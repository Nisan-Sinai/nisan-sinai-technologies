# Dependency policy — approved temporary development-only risk

The user explicitly approved this narrowly limited development-only risk until
2026-11-04. `npm run audit:ci` enables that exact policy in the centrally managed
security gate and six-hour dependency watch. This is **not** a vulnerability-free
result. `npm run audit:prod` remains available and unchanged; the policy itself
requires an even stricter low-threshold production audit with zero advisories.

The runner defaults to strict mode: `node scripts/audit-policy.mjs` runs production
and full npm audits at the **low** threshold, and rejects every advisory. Audits use
the lockfile, the public npm registry, and include optional/peer dependencies.
They do not install, upgrade, or modify dependencies.

## Exact optional acceptance contract

Only the explicit argument `--allow-braces-dev-until-2026-11-04` can activate the
proposed temporary policy. It accepts a nonzero full audit only if every condition
below holds; otherwise the command exits nonzero:

1. The separate production audit has **zero advisories**, without any exception.
2. Both commands complete successfully with consistent npm v2 JSON, vulnerability
   counts, and expected exit codes. Registry errors, stderr, malformed JSON,
   command errors/timeouts/signals, and unsupported schemas fail closed.
3. Every advisory chain terminates solely in the canonical URL
   `https://github.com/advisories/GHSA-vfj7-8cjw-p6xm`, npm source `1240992`, package
   `braces`, high severity, and affected range `<=3.0.3`. Remediation metadata must
   be `false` or exactly `{ "name": "eslint-config-next", "version": "14.2.35",
   "isSemVerMajor": true }`, with no extra keys. The latter is npm's reviewed
   **major tool-downgrade suggestion**, not a patched braces release. No downgrade
   is performed. A second advisory, changed identity/remediation, direct braces
   patch, missing chain, or cycle fails pending review.
4. Every affected node, including metavulnerable parent packages, is present in
   the v3 lockfile with `dev: true`, reachable from the full dependency roots, and
   **not reachable from any production root** through dependency, optional, or
   peer edges. All braces lock instances are independently enumerated (including
   aliases), must be exactly `3.0.3`, and must appear in the full audit. Missing or
   changed versions fail pending review. A dev marker or omission from the audit
   alone is insufficient. Mixed runtime/dev usage fails.
5. Manifest and lock dependency declarations match. Workspaces, links, npm alias
   dependency specs, unsafe paths, unsupported graphs, and unresolved required
   edges fail closed. Alias targets cannot be omitted by removing name metadata.
6. Current UTC time is strictly before **2026-11-04 00:00:00 UTC**. At that instant
   the opt-in fails even if the audits become clean, requiring removal/review of
   the stale exception. The deadline is not configurable.

Accepted risk is printed visibly as a GitHub warning annotation and log message
with its advisory URL, affected package names, and expiry, explicitly saying the
result is **not vulnerability-free**. No generic
ignore list, reduced severity threshold, registry-error bypass, or environment
variable enables the exception. The runner does not replace the existing required
production coverage; it adds its own stricter production prerequisite. The policy
test suite runs before the unit/coverage test command in the central core job;
Node's built-in test runner is kept separate from the Vitest unit suite.

Run the independent, dependency-free test suite with:

```sh
node --test tests/audit-policy.test.mjs
```

## Why ordinary upstream upgrades are insufficient today

The current development graph includes two tool chains:

- `eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces`
- `vinext → vite-plugin-commonjs → vite-plugin-dynamic-import → fast-glob → micromatch → braces`

As checked on 2026-10-21, even current upstream tool releases retain these paths.
The [official advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) has no
patched braces release. Removing it requires an upstream fix, a reviewed patch,
or changing tooling; aliasing an unrelated glob package is not a compatible fix.

References: [npm audit](https://docs.npmjs.com/cli/v11/commands/npm-audit/) and
[lockfile metadata](https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json/).
