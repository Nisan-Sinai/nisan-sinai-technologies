import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// This exact, temporary risk acceptance requires explicit user approval.
export const EXCEPTION_FLAG = "--allow-braces-dev-until-2026-11-04";
export const EXPIRES_AT = "2026-11-04T00:00:00.000Z";
export const ADVISORY_URL = "https://github.com/advisories/GHSA-vfj7-8cjw-p6xm";
const ADVISORY_SOURCE = 1240992;
const SEVERITIES = ["info", "low", "moderate", "high", "critical"];
const AUDIT_ARGS = [
  "audit", "--json", "--audit-level=low", "--package-lock-only",
  "--registry=https://registry.npmjs.org", "--include=optional", "--include=peer",
];
export const PRODUCTION_ARGS = [...AUDIT_ARGS, "--omit=dev"];
export const FULL_ARGS = [...AUDIT_ARGS, "--include=dev"];

function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasOwn(object, key) {
  return Object.hasOwn(object, key);
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${label}: invalid JSON`);
  }
}

function packageName(value) {
  return typeof value === "string" &&
    /^(?:@[^/\\\s]+\/)?[^/@\\\s]+$/.test(value) &&
    value !== "." && value !== "..";
}

function packageVersion(value) {
  return typeof value === "string" &&
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[\da-zA-Z-]+(?:\.[\da-zA-Z-]+)*)?(?:\+[\da-zA-Z-]+(?:\.[\da-zA-Z-]+)*)?$/.test(value);
}

function dependencyMap(value, label) {
  if (value === undefined) return {};
  requireCondition(isObject(value), `${label}: invalid dependency map`);
  for (const [name, version] of Object.entries(value)) {
    requireCondition(packageName(name) && typeof version === "string" && version.length > 0,
      `${label}: invalid dependency entry`);
    requireCondition(!version.startsWith("npm:"), "npm alias graphs require separate security review");
  }
  return value;
}

function mapsEqual(first, second) {
  const keys = Object.keys(first);
  return keys.length === Object.keys(second).length &&
    keys.every((key) => hasOwn(second, key) && first[key] === second[key]);
}

function validateAudit(result, label) {
  requireCondition(isObject(result) && !result.error && !result.signal,
    `${label}: audit command failed`);
  requireCondition(result.status === 0 || result.status === 1,
    `${label}: unexpected audit exit status`);
  requireCondition(typeof result.stdout === "string" &&
    typeof result.stderr === "string" && result.stderr.trim() === "",
  `${label}: missing output or unexpected stderr`);
  const report = parseJson(result.stdout, label);
  requireCondition(isObject(report) && !hasOwn(report, "error") &&
    report.auditReportVersion === 2 && isObject(report.vulnerabilities) &&
    isObject(report.metadata) && isObject(report.metadata.vulnerabilities),
  `${label}: unsupported or error audit report`);
  const counts = Object.fromEntries(SEVERITIES.map((severity) => [severity, 0]));
  for (const [name, vulnerability] of Object.entries(report.vulnerabilities)) {
    requireCondition(packageName(name) && isObject(vulnerability) &&
      vulnerability.name === name && SEVERITIES.includes(vulnerability.severity) &&
      typeof vulnerability.range === "string" && vulnerability.range.length > 0 &&
      typeof vulnerability.isDirect === "boolean" &&
      Array.isArray(vulnerability.effects) && vulnerability.effects.every(packageName) &&
      (typeof vulnerability.fixAvailable === "boolean" ||
        isObject(vulnerability.fixAvailable) && packageName(vulnerability.fixAvailable.name) &&
        packageVersion(vulnerability.fixAvailable.version) &&
        typeof vulnerability.fixAvailable.isSemVerMajor === "boolean") &&
      Array.isArray(vulnerability.via) && vulnerability.via.length > 0 &&
      Array.isArray(vulnerability.nodes) && vulnerability.nodes.length > 0 &&
      vulnerability.nodes.every((node) => typeof node === "string") &&
      new Set(vulnerability.nodes).size === vulnerability.nodes.length,
    `${label}: malformed vulnerability record`);
    counts[vulnerability.severity] += 1;
  }
  const total = Object.keys(report.vulnerabilities).length;
  for (const severity of [...SEVERITIES, "total"]) {
    const actual = report.metadata.vulnerabilities[severity];
    requireCondition(Number.isSafeInteger(actual) && actual >= 0 &&
      actual === (severity === "total" ? total : counts[severity]),
    `${label}: inconsistent vulnerability counts`);
  }
  requireCondition(result.status === (total === 0 ? 0 : 1),
    `${label}: exit status contradicts report`);
  return report;
}

function dependencyGraph(lockfile, manifest) {
  requireCondition(isObject(lockfile) && lockfile.lockfileVersion === 3 &&
    isObject(lockfile.packages) && isObject(lockfile.packages[""]) &&
    isObject(manifest) && !hasOwn(manifest, "workspaces"),
  "Exception requires a non-workspace npm v3 lockfile and package manifest");
  const packages = lockfile.packages;
  const root = packages[""];
  requireCondition(!hasOwn(root, "workspaces"), "Workspace graph is not supported");
  const fields = ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"];
  for (const field of fields) {
    requireCondition(mapsEqual(dependencyMap(root[field], `lock root ${field}`),
      dependencyMap(manifest[field], `manifest ${field}`)),
    `Manifest/lock ${field} mismatch`);
  }
  for (const [path, node] of Object.entries(packages)) {
    requireCondition(isObject(node) && node.link !== true, "Linked or invalid lock nodes are unsupported");
    if (path === "") continue;
    requireCondition(/^(?:node_modules\/(?:@[^/\\\s]+\/)?[^/@\\\s]+)(?:\/node_modules\/(?:@[^/\\\s]+\/)?[^/@\\\s]+)*$/.test(path) &&
      !path.split("/").some((part) => part === "." || part === ".."),
    "Unsafe or unsupported lock node path");
  }
  function lookup(from, name) {
    let parent = from;
    while (true) {
      const candidate = `${parent ? `${parent}/` : ""}node_modules/${name}`;
      if (hasOwn(packages, candidate)) return candidate;
      if (parent === "") return undefined;
      const slash = parent.lastIndexOf("/");
      parent = slash < 0 ? "" : parent.slice(0, slash);
    }
  }
  function reachable(includeDev) {
    const seen = new Set();
    const queue = [""];
    while (queue.length > 0) {
      const current = queue.pop();
      if (seen.has(current)) continue;
      seen.add(current);
      const node = packages[current];
      const edges = new Map();
      for (const field of ["dependencies", "optionalDependencies", "peerDependencies",
        ...(includeDev && current === "" ? ["devDependencies"] : [])]) {
        for (const name of Object.keys(dependencyMap(node[field], `${current} ${field}`))) {
          const optional = field === "optionalDependencies" ||
            (field === "peerDependencies" && node.peerDependenciesMeta?.[name]?.optional === true);
          // A required edge wins over a duplicate optional edge.
          edges.set(name, edges.get(name) === false ? false : optional);
        }
      }
      for (const [name, optional] of edges) {
        const target = lookup(current, name);
        requireCondition(target !== undefined || optional, `Unresolved required graph edge: ${name}`);
        if (target !== undefined) queue.push(target);
      }
    }
    return seen;
  }
  return { packages, production: reachable(false), full: reachable(true) };
}

function validateException(report, lockfile, manifest) {
  const { packages, production, full } = dependencyGraph(lockfile, manifest);
  const records = report.vulnerabilities;
  requireCondition(hasOwn(records, "braces"), "The approved braces advisory is missing");
  const reportedBraces = new Set(records.braces.nodes);
  // Do not trust omission from the registry report as proof of safety. Inspect
  // every lock instance independently, including npm aliases and mixed trees.
  for (const [path, node] of Object.entries(packages)) {
    if (path === "") continue;
    const pathIsBraces = path === "node_modules/braces" || path.endsWith("/node_modules/braces");
    if (pathIsBraces || node.name === "braces") {
      requireCondition(node.version === "3.0.3" &&
        (node.name === undefined || node.name === "braces") &&
        reportedBraces.has(path) && node.dev === true && full.has(path) && !production.has(path),
      "Every braces@3.0.3 lock instance must be reported and proven dev-only; changed versions require review");
    }
  }
  const finished = new Set();
  const visiting = new Set();
  function visit(name) {
    if (finished.has(name)) return;
    requireCondition(hasOwn(records, name), `Unresolved advisory chain: ${name}`);
    requireCondition(!visiting.has(name), "Cyclic advisory chain");
    visiting.add(name);
    const record = records[name];
    for (const path of record.nodes) {
      const matchesPackage = path === `node_modules/${name}` || path.endsWith(`/node_modules/${name}`);
      requireCondition(hasOwn(packages, path) && packages[path].dev === true &&
        packageVersion(packages[path].version) &&
        full.has(path) && !production.has(path) && matchesPackage,
      `Exception is not proven dev-only: ${name}`);
    }
    for (const via of record.via) {
      if (typeof via === "string") {
        requireCondition(packageName(via), "Invalid advisory chain name");
        visit(via);
      } else {
        // npm proposes a major TOOL DOWNGRADE for this unresolved advisory, not
        // a patched braces release. Recognize only the currently reviewed
        // metadata; never perform a downgrade or accept a new remediation.
        const fix = record.fixAvailable;
        const knownToolDowngrade = isObject(fix) && Object.keys(fix).length === 3 &&
          fix.name === "eslint-config-next" && fix.version === "14.2.35" && fix.isSemVerMajor === true;
        requireCondition(isObject(via) && via.source === ADVISORY_SOURCE &&
          via.url === ADVISORY_URL && via.name === "braces" && via.dependency === "braces" &&
          via.severity === "high" && via.range === "<=3.0.3" &&
          name === "braces" && (fix === false || knownToolDowngrade),
        "Unapproved or changed advisory; review required");
      }
    }
    visiting.delete(name);
    finished.add(name);
  }
  for (const name of Object.keys(records)) visit(name);
}

export function npmInvocation({ env = process.env, platform = process.platform,
  execPath = process.execPath, exists = existsSync } = {}) {
  const npmCli = env.npm_execpath || (platform === "win32"
    ? resolve(dirname(execPath), "node_modules/npm/bin/npm-cli.js") : undefined);
  if (npmCli) {
    requireCondition(basename(npmCli) === "npm-cli.js" && exists(npmCli),
      "Cannot resolve the npm CLI safely; use the installed npm toolchain");
    return { command: execPath, prefix: [npmCli] };
  }
  return { command: "npm", prefix: [] };
}

export function evaluateAuditPolicy({ productionResult, fullResult, lockfile, manifest,
  allowBracesDev = false, now = new Date() }) {
  requireCondition(typeof allowBracesDev === "boolean" && now instanceof Date &&
    Number.isFinite(now.getTime()), "Invalid policy options or clock");
  if (allowBracesDev) {
    requireCondition(now.getTime() < Date.parse(EXPIRES_AT), "Temporary exception expired; review required");
  }
  const production = validateAudit(productionResult, "Production audit");
  requireCondition(Object.keys(production.vulnerabilities).length === 0,
    "Production dependencies must have zero advisories; no exception applies");
  const full = validateAudit(fullResult, "Full audit");
  const total = Object.keys(full.vulnerabilities).length;
  if (total === 0) return { exceptionUsed: false, affectedPackages: [] };
  requireCondition(allowBracesDev, "Full audit has advisories; strict policy rejected them");
  validateException(full, lockfile, manifest);
  return { exceptionUsed: true, affectedPackages: Object.keys(full.vulnerabilities).sort() };
}

export function runAuditPolicy({ argv = process.argv.slice(2), cwd = process.cwd(),
  execute = spawnSync, read = readFileSync, now = new Date() } = {}) {
  requireCondition(argv.length === 0 || (argv.length === 1 && argv[0] === EXCEPTION_FLAG),
    "Unknown or duplicate policy argument");
  const allowBracesDev = argv.length === 1;
  if (allowBracesDev) {
    requireCondition(now instanceof Date && Number.isFinite(now.getTime()) &&
      now.getTime() < Date.parse(EXPIRES_AT), "Temporary exception expired or clock invalid");
  }
  const manifest = parseJson(read(resolve(cwd, "package.json"), "utf8"), "package.json");
  const lockfile = parseJson(read(resolve(cwd, "package-lock.json"), "utf8"), "package-lock.json");
  // Resolve Windows npm-cli.js without invoking a .cmd shell. Linux CI can use
  // the normal npm executable when not launched by an npm package script.
  const { command, prefix } = npmInvocation();
  const options = { cwd, encoding: "utf8", shell: false, timeout: 120_000,
    maxBuffer: 8 * 1024 * 1024, windowsHide: true };
  const productionResult = execute(command, [...prefix, ...PRODUCTION_ARGS], options);
  const production = validateAudit(productionResult, "Production audit");
  requireCondition(Object.keys(production.vulnerabilities).length === 0,
    "Production dependencies must have zero advisories; no exception applies");
  const fullResult = execute(command, [...prefix, ...FULL_ARGS], options);
  return evaluateAuditPolicy({ productionResult, fullResult, lockfile, manifest, allowBracesDev, now });
}

export function printAuditOutcome(outcome, { log = console.log, warn = console.warn } = {}) {
  if (outcome.exceptionUsed) {
    const message = `${ADVISORY_URL}; development-only packages: ` +
      `${outcome.affectedPackages.join(", ")}; expires ${EXPIRES_AT}. ` +
      "This is not a vulnerability-free audit.";
    const annotation = message.replaceAll("%", "%25").replaceAll("\r", "%0D").replaceAll("\n", "%0A");
    log(`::warning title=Temporary development-only risk::${annotation}`);
    warn(`TEMPORARY ACCEPTED RISK: ${message}`);
  } else {
    log("Production and full dependency audits report zero advisories.");
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    printAuditOutcome(runAuditPolicy());
  } catch (error) {
    console.error(`Dependency audit policy failed: ${error.message}`);
    process.exitCode = 1;
  }
}
