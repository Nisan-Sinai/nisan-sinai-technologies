# Protecting the `main` branch

**Important: merging this PR does NOT enable branch protection.** GitHub reads rulesets from repository **Settings → Rules → Rulesets**, not from files inside `.github/rulesets/`. This repository-stored JSON is the reviewable source of truth for the exact rule that an administrator must import once.

## Activation (repository administrator)

1. Open `https://github.com/Nisan-Sinai/nisan-sinai-technologies/blob/main/.github/rulesets/protect-main.json`, and use **Download raw file** (or download the file from this PR).
2. Open `https://github.com/Nisan-Sinai/nisan-sinai-technologies/settings/rules`.
3. Choose **New ruleset → Import a ruleset** and select `protect-main.json`.
4. Confirm the target is only `main` and enforcement is **Active**; review every setting, then click **Create**.
5. Verify that `main` now reports as protected, and test with an empty commit on a new PR.

## Checks and protections staged

- PRs required on `main`, with squash merges and all review conversations resolved.
- No required approval from another reviewer (single-maintainer workflow and existing Dependabot auto-merge).
- Strict required status checks (PR branch up-to-date with `main`):
  - `Audit · Lint · Type-check · Unit · Dual build`
  - `Playwright · Desktop & mobile · Accessibility`
  - `Secret scan`
  - `Supabase migrations · RLS contract`
  - `Vercel`
- Forbid force pushes and deletion, require linear history, no bypass actors.
- Do **not** require an additional GitHub Deployment environment called `Preview`. The required `Vercel` commit status is the project-verified deployment gate.

## Operational caveats

- Enabling strict status checks can prevent the existing Dependabot auto-merge workflow from merging PRs that are behind `main`; Dependabot must update/rebase those PRs before the checks are accepted.
- The GitHub Actions bot cannot grant itself repository-administration permission. The import/Create step therefore cannot be automated by this PR.
- If any imported rule or required check displays incorrectly, do not create the ruleset until the discrepancy is resolved.
- To require a review from a code owner in the future, configure an eligible **separate** reviewer; the PR author cannot approve their own changes.

Tracking issue: https://github.com/Nisan-Sinai/nisan-sinai-technologies/issues/55
