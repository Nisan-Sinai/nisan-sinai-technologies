import assert from "node:assert/strict";
import test from "node:test";
import {
  ADVISORY_URL, EXCEPTION_FLAG, EXPIRES_AT, FULL_ARGS, PRODUCTION_ARGS,
  evaluateAuditPolicy, npmInvocation, printAuditOutcome, runAuditPolicy,
} from "../scripts/audit-policy.mjs";

const NOW = new Date("2026-10-21T12:00:00.000Z");

function report(vulnerabilities = {}) {
  const counts = { info: 0, low: 0, moderate: 0, high: 0, critical: 0, total: 0 };
  for (const vulnerability of Object.values(vulnerabilities)) {
    counts[vulnerability.severity] += 1;
    counts.total += 1;
  }
  return { auditReportVersion: 2, vulnerabilities, metadata: { vulnerabilities: counts } };
}

function result(value = report()) {
  return { status: Object.keys(value.vulnerabilities).length === 0 ? 0 : 1,
    stdout: JSON.stringify(value), stderr: "", signal: null };
}

function fixture() {
  const manifest = { dependencies: { app: "1.0.0" }, devDependencies: { tool: "1.0.0" } };
  const record = (name, via) => ({ name, severity: "high", isDirect: name === "tool",
    via, nodes: [`node_modules/${name}`], effects: [], range: "*", fixAvailable: false });
  const full = report({
    tool: record("tool", ["bridge"]),
    bridge: record("bridge", ["braces"]),
    braces: record("braces", [{ source: 1240992, name: "braces", dependency: "braces",
      severity: "high", range: "<=3.0.3", url: ADVISORY_URL }]),
  });
  return {
    manifest,
    lockfile: { lockfileVersion: 3, packages: {
      "": structuredClone(manifest),
      "node_modules/app": { version: "1.0.0" },
      "node_modules/tool": { version: "1.0.0", dev: true, dependencies: { bridge: "1.0.0" } },
      "node_modules/bridge": { version: "1.0.0", dev: true, dependencies: { braces: "3.0.3" } },
      "node_modules/braces": { version: "3.0.3", dev: true },
    } },
    production: report(), full,
  };
}

function evaluate(f = fixture(), options = {}) {
  return evaluateAuditPolicy({ productionResult: result(f.production), fullResult: result(f.full),
    manifest: f.manifest, lockfile: f.lockfile, now: NOW, ...options });
}

test("default strict policy accepts only zero production and full advisories", () => {
  const f = fixture();
  assert.throws(() => evaluate(f), /strict policy/);
  f.full = report();
  assert.deepEqual(evaluate(f), { exceptionUsed: false, affectedPackages: [] });
});

test("explicit temporary opt-in accepts only the exact dev-only advisory chain", () => {
  assert.deepEqual(evaluate(fixture(), { allowBracesDev: true }),
    { exceptionUsed: true, affectedPackages: ["braces", "bridge", "tool"] });
});

test("opt-in does not fabricate a finding when audits are clean", () => {
  const f = fixture();
  f.full = report();
  assert.equal(evaluate(f, { allowBracesDev: true }).exceptionUsed, false);
});

test("only the reviewed npm tool-downgrade suggestion is accepted, never applied", () => {
  const f = fixture();
  f.full.vulnerabilities.braces.fixAvailable = {
    name: "eslint-config-next", version: "14.2.35", isSemVerMajor: true,
  };
  const originalLock = JSON.stringify(f.lockfile);
  const originalManifest = JSON.stringify(f.manifest);
  assert.equal(evaluate(f, { allowBracesDev: true }).exceptionUsed, true);
  assert.equal(JSON.stringify(f.lockfile), originalLock);
  assert.equal(JSON.stringify(f.manifest), originalManifest);
  for (const changed of [
    { name: "braces", version: "3.0.4", isSemVerMajor: false },
    { name: "eslint-config-next", version: "14.2.36", isSemVerMajor: true },
    { name: "eslint-config-next", version: "14.2.35", isSemVerMajor: false },
    { name: "eslint-config-next", version: "14.2.35", isSemVerMajor: true, extra: "unreviewed" },
  ]) {
    f.full.vulnerabilities.braces.fixAvailable = changed;
    assert.throws(() => evaluate(f, { allowBracesDev: true }), /Unapproved or changed/);
  }
});

test("expiration is exclusive, fixed in UTC, and cannot be extended by an argument", () => {
  assert.equal(EXPIRES_AT, "2026-11-04T00:00:00.000Z");
  assert.equal(evaluate(fixture(), { allowBracesDev: true,
    now: new Date("2026-11-03T23:59:59.999Z") }).exceptionUsed, true);
  for (const now of [new Date(EXPIRES_AT), new Date("2026-11-05T00:00:00Z")]) {
    assert.throws(() => evaluate(fixture(), { allowBracesDev: true, now }), /expired/);
    const f = fixture();
    f.full = report();
    assert.throws(() => evaluate(f, { allowBracesDev: true, now }), /expired/);
  }
});

for (const [label, mutation] of [
  ["different GHSA", (f) => { f.full.vulnerabilities.braces.via[0].url = "https://github.com/advisories/GHSA-other"; }],
  ["noncanonical URL suffix", (f) => { f.full.vulnerabilities.braces.via[0].url += "?allow=true"; }],
  ["different npm advisory source", (f) => { f.full.vulnerabilities.braces.via[0].source += 1; }],
  ["different affected package", (f) => { f.full.vulnerabilities.braces.via[0].name = "other"; }],
  ["different advisory dependency", (f) => { f.full.vulnerabilities.braces.via[0].dependency = "other"; }],
  ["changed advisory range", (f) => { f.full.vulnerabilities.braces.via[0].range = "*"; }],
  ["changed advisory severity", (f) => { f.full.vulnerabilities.braces.via[0].severity = "critical"; }],
  ["new patched release", (f) => { f.full.vulnerabilities.braces.fixAvailable = true; }],
  ["additional advisory on accepted package", (f) => {
    f.full.vulnerabilities.braces.via.push({ ...f.full.vulnerabilities.braces.via[0], source: 999 });
  }],
  ["unresolved advisory reference", (f) => { f.full.vulnerabilities.tool.via = ["missing"]; }],
  ["cyclic advisory reference", (f) => { f.full.vulnerabilities.braces.via = ["tool"]; }],
  ["invalid via entry", (f) => { f.full.vulnerabilities.braces.via = [null]; }],
  ["missing dev marker", (f) => { delete f.lockfile.packages["node_modules/braces"].dev; }],
  ["false dev marker", (f) => { f.lockfile.packages["node_modules/braces"].dev = false; }],
  ["missing affected version", (f) => { delete f.lockfile.packages["node_modules/braces"].version; }],
  ["invalid affected version", (f) => { f.lockfile.packages["node_modules/braces"].version = "unknown"; }],
  ["changed affected version", (f) => { f.lockfile.packages["node_modules/braces"].version = "3.0.2"; }],
  ["missing metavulnerable parent version", (f) => { delete f.lockfile.packages["node_modules/bridge"].version; }],
  ["missing report effect schema", (f) => { delete f.full.vulnerabilities.braces.effects; }],
  ["missing report fix schema", (f) => { delete f.full.vulnerabilities.bridge.fixAvailable; }],
  ["devOptional is not dev-only proof", (f) => {
    delete f.lockfile.packages["node_modules/braces"].dev;
    f.lockfile.packages["node_modules/braces"].devOptional = true;
  }],
  ["runtime path despite dev marker", (f) => {
    f.lockfile.packages["node_modules/app"].dependencies = { braces: "3.0.3" };
  }],
  ["runtime path to a vulnerable parent", (f) => {
    f.lockfile.packages["node_modules/app"].dependencies = { tool: "1.0.0" };
  }],
  ["runtime optional path", (f) => {
    f.lockfile.packages["node_modules/app"].optionalDependencies = { braces: "3.0.3" };
  }],
  ["runtime peer path", (f) => {
    f.lockfile.packages["node_modules/app"].peerDependencies = { braces: "3.0.3" };
  }],
  ["orphaned vulnerable node", (f) => {
    delete f.lockfile.packages["node_modules/bridge"].dependencies;
  }],
  ["unresolved required runtime edge", (f) => {
    f.lockfile.packages["node_modules/app"].dependencies = { missing: "1.0.0" };
  }],
  ["missing affected node", (f) => { delete f.lockfile.packages["node_modules/braces"]; }],
  ["different affected node name", (f) => {
    f.full.vulnerabilities.braces.nodes = ["node_modules/tool"];
  }],
  ["duplicate affected node", (f) => {
    f.full.vulnerabilities.braces.nodes.push("node_modules/braces");
  }],
  ["unsafe graph path", (f) => {
    f.lockfile.packages["node_modules/../braces"] = { version: "3.0.3", dev: true };
  }],
  ["linked package", (f) => { f.lockfile.packages["node_modules/tool"].link = true; }],
  ["workspace manifest", (f) => { f.manifest.workspaces = ["packages/*"]; }],
  ["workspace lock", (f) => { f.lockfile.packages[""].workspaces = ["packages/*"]; }],
  ["old lock version", (f) => { f.lockfile.lockfileVersion = 2; }],
  ["stale manifest/lock", (f) => { f.manifest.dependencies.app = "2.0.0"; }],
]) {
  test(`exception fails closed for ${label}`, () => {
    const f = fixture();
    mutation(f);
    assert.throws(() => evaluate(f, { allowBracesDev: true }));
  });
}

test("mixed runtime/development instances of the same package fail", () => {
  const f = fixture();
  f.lockfile.packages["node_modules/app"].dependencies = { braces: "3.0.3" };
  f.lockfile.packages["node_modules/app/node_modules/braces"] = { version: "3.0.3" };
  f.full.vulnerabilities.braces.nodes.push("node_modules/app/node_modules/braces");
  assert.throws(() => evaluate(f, { allowBracesDev: true }), /dev-only/);
});

test("runtime braces omitted from the full audit still fails despite clean production JSON", () => {
  const f = fixture();
  f.lockfile.packages["node_modules/app"].dependencies = { braces: "3.0.3" };
  f.lockfile.packages["node_modules/app/node_modules/braces"] = { version: "3.0.3", dev: true };
  assert.throws(() => evaluate(f, { allowBracesDev: true }), /Every braces/);
});

test("a second dev-only braces instance omitted from the report also fails", () => {
  const f = fixture();
  f.lockfile.packages["node_modules/tool/node_modules/braces"] = { version: "3.0.3", dev: true };
  assert.throws(() => evaluate(f, { allowBracesDev: true }), /Every braces/);
});

test("an npm alias of braces cannot hide a runtime instance", () => {
  const f = fixture();
  f.lockfile.packages["node_modules/app"].dependencies = { aliased: "npm:braces@3.0.3" };
  f.lockfile.packages["node_modules/aliased"] = { name: "braces", version: "3.0.3", dev: true };
  assert.throws(() => evaluate(f, { allowBracesDev: true }), /alias graphs/);
});

test("an alias missing package-name metadata still cannot hide omitted runtime braces", () => {
  const f = fixture();
  f.lockfile.packages["node_modules/app"].dependencies = { aliased: "npm:braces@3.0.3" };
  f.lockfile.packages["node_modules/aliased"] = { version: "3.0.3", dev: true };
  assert.throws(() => evaluate(f, { allowBracesDev: true }), /alias graphs/);
});

test("nested node_modules resolution accepts a genuinely dev-only nested instance", () => {
  const f = fixture();
  const path = "node_modules/bridge/node_modules/braces";
  f.lockfile.packages[path] = f.lockfile.packages["node_modules/braces"];
  delete f.lockfile.packages["node_modules/braces"];
  f.full.vulnerabilities.braces.nodes = [path];
  assert.equal(evaluate(f, { allowBracesDev: true }).exceptionUsed, true);
});

test("missing optional dependency and optional peer are supported without hiding installed peers", () => {
  const f = fixture();
  f.lockfile.packages["node_modules/app"].optionalDependencies = { absent: "1.0.0" };
  f.lockfile.packages["node_modules/app"].peerDependencies = { absentPeer: "1.0.0" };
  f.lockfile.packages["node_modules/app"].peerDependenciesMeta = { absentPeer: { optional: true } };
  assert.equal(evaluate(f, { allowBracesDev: true }).exceptionUsed, true);
});

test("production findings are never excepted, including the exact approved advisory", () => {
  const f = fixture();
  f.production = f.full;
  assert.throws(() => evaluate(f, { allowBracesDev: true }), /Production dependencies/);
});

for (const label of ["productionResult", "fullResult"]) {
  for (const [failure, mutation] of [
    ["invalid JSON", (r) => { r.stdout = "not JSON"; }],
    ["JSON error response", (r) => { r.stdout = JSON.stringify({ error: { code: "E503" } }); }],
    ["error attached to valid JSON", (r) => {
      const parsed = JSON.parse(r.stdout); parsed.error = null; r.stdout = JSON.stringify(parsed);
    }],
    ["command failure", (r) => { r.error = new Error("ENOTFOUND"); }],
    ["timeout signal", (r) => { r.signal = "SIGTERM"; r.status = null; }],
    ["unexpected exit", (r) => { r.status = 2; }],
    ["stderr warning/error", (r) => { r.stderr = "npm error registry failure"; }],
    ["unsupported schema", (r) => {
      const parsed = JSON.parse(r.stdout); parsed.auditReportVersion = 1; r.stdout = JSON.stringify(parsed);
    }],
    ["missing vulnerability map", (r) => {
      const parsed = JSON.parse(r.stdout); delete parsed.vulnerabilities; r.stdout = JSON.stringify(parsed);
    }],
    ["inconsistent total", (r) => {
      const parsed = JSON.parse(r.stdout); parsed.metadata.vulnerabilities.total += 1; r.stdout = JSON.stringify(parsed);
    }],
    ["inconsistent severity", (r) => {
      const parsed = JSON.parse(r.stdout); parsed.metadata.vulnerabilities.high += 1; r.stdout = JSON.stringify(parsed);
    }],
    ["contradictory exit", (r) => { r.status = r.status === 0 ? 1 : 0; }],
  ]) {
    test(`${label} rejects ${failure}`, () => {
      const f = fixture();
      const inputs = { productionResult: result(f.production), fullResult: result(f.full),
        lockfile: f.lockfile, manifest: f.manifest, now: NOW, allowBracesDev: true };
      mutation(inputs[label]);
      assert.throws(() => evaluateAuditPolicy(inputs));
    });
  }
}

test("invalid policy clock and nonboolean opt-in fail closed", () => {
  assert.throws(() => evaluate(fixture(), { allowBracesDev: "true" }), /Invalid policy/);
  assert.throws(() => evaluate(fixture(), { now: new Date("invalid") }), /Invalid policy/);
});

function runHarness({ argv = [], f = fixture(), mutateResult } = {}) {
  const calls = [];
  const run = () => runAuditPolicy({ argv, now: NOW, cwd: "/test-project",
    read: (path) => JSON.stringify(path.endsWith("package-lock.json") ? f.lockfile : f.manifest),
    execute: (command, args, options) => {
      calls.push({ command, args, options });
      const output = result(calls.length === 1 ? f.production : f.full);
      mutateResult?.(output, calls.length);
      return output;
    },
  });
  return { run, calls };
}

test("runner always audits production first and then the full graph at low threshold", () => {
  const harness = runHarness({ argv: [EXCEPTION_FLAG] });
  assert.equal(harness.run().exceptionUsed, true);
  assert.equal(harness.calls.length, 2);
  assert.deepEqual(harness.calls[0].args.slice(-PRODUCTION_ARGS.length), PRODUCTION_ARGS);
  assert.deepEqual(harness.calls[1].args.slice(-FULL_ARGS.length), FULL_ARGS);
  assert.ok(PRODUCTION_ARGS.includes("--omit=dev"));
  assert.ok(FULL_ARGS.includes("--include=dev"));
  assert.ok(FULL_ARGS.includes("--include=optional"));
  assert.ok(FULL_ARGS.includes("--include=peer"));
  for (const { args, options } of harness.calls) {
    assert.ok(args.includes("--audit-level=low"));
    assert.ok(args.includes("--registry=https://registry.npmjs.org"));
    assert.equal(options.shell, false);
    assert.equal(options.timeout, 120_000);
  }
});

test("runner stops on a failed production audit rather than ignoring it", () => {
  const harness = runHarness({ argv: [EXCEPTION_FLAG], mutateResult: (r) => { r.status = 2; } });
  assert.throws(harness.run);
  assert.equal(harness.calls.length, 1);
});

test("runner does not opt in by default", () => {
  const harness = runHarness();
  assert.throws(harness.run, /strict policy/);
});

test("unknown, duplicate, blanket, or expiry-extension flags fail before any audit", () => {
  for (const argv of [["--allow-all"], [EXCEPTION_FLAG, EXCEPTION_FLAG],
    ["--allow-braces-dev-until-2026-11-05"], ["--omit=dev"]]) {
    const harness = runHarness({ argv });
    assert.throws(harness.run, /argument/);
    assert.equal(harness.calls.length, 0);
  }
});

test("expired opt-in and malformed local files fail before any audit", () => {
  let called = false;
  const execute = () => { called = true; throw new Error("must not run"); };
  assert.throws(() => runAuditPolicy({ argv: [EXCEPTION_FLAG], now: new Date(EXPIRES_AT), execute }), /expired/);
  assert.throws(() => runAuditPolicy({ argv: [], read: () => "{", execute }), /invalid JSON/);
  assert.equal(called, false);
});

test("npm invocation resolves Windows npm CLI directly without a shell", () => {
  const invocation = npmInvocation({ env: {}, platform: "win32", execPath: process.execPath,
    exists: (path) => path.endsWith("npm-cli.js") });
  assert.equal(invocation.command, process.execPath);
  assert.equal(invocation.prefix.length, 1);
  assert.match(invocation.prefix[0], /npm-cli\.js$/);
});

test("npm invocation rejects another package manager or missing CLI", () => {
  assert.throws(() => npmInvocation({ env: { npm_execpath: "/bin/pnpm.cjs" }, exists: () => true }));
  assert.throws(() => npmInvocation({ env: {}, platform: "win32", exists: () => false }));
  assert.deepEqual(npmInvocation({ env: {}, platform: "linux" }), { command: "npm", prefix: [] });
});

test("accepted risk emits a visible GitHub warning and honest human-readable warning", () => {
  const logs = [];
  const warnings = [];
  printAuditOutcome(evaluate(fixture(), { allowBracesDev: true }),
    { log: (message) => logs.push(message), warn: (message) => warnings.push(message) });
  assert.equal(logs.length, 1);
  assert.match(logs[0], /^::warning title=Temporary development-only risk::/);
  for (const output of [logs[0], warnings[0]]) {
    assert.ok(output.includes(ADVISORY_URL));
    assert.ok(output.includes(EXPIRES_AT));
    assert.ok(output.includes("not a vulnerability-free audit"));
  }
  assert.equal(warnings.length, 1);
});

test("clean audit outcome does not emit an exception warning", () => {
  const logs = [];
  const warnings = [];
  printAuditOutcome({ exceptionUsed: false, affectedPackages: [] },
    { log: (message) => logs.push(message), warn: (message) => warnings.push(message) });
  assert.equal(logs.length, 1);
  assert.match(logs[0], /zero advisories/);
  assert.equal(warnings.length, 0);
});
