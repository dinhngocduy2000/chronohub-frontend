---
applyTo: "**"
---

# GitHub Copilot Instructions: Automated Pull Request Creation

## Overview

These instructions enable GitHub Copilot to automatically create pull requests using the GitHub CLI (`gh`), enforcing the repository's PR description template and accepting a user-specified target branch.

---

## Trigger Conditions

Activate these instructions when the user requests any of the following:

- "Create a PR", "Open a pull request", "Submit a PR"
- "Push and create PR to `<branch>`"
- "Make a pull request targeting `<branch>`"
- Any phrasing involving `gh pr create` or PR automation

---

## Prerequisites

Verify before executing:

| Requirement | Check Command |
|---|---|
| GH CLI installed | `gh --version` |
| GH CLI authenticated | `gh auth status` |
| Git repo initialized | `git rev-parse --git-dir` |
| Active branch (not detached HEAD) | `git branch --show-current` |
| PR template exists | See template resolution below |

If any check fails, surface a clear error to the user before proceeding.

---

## Behavior

### 1. Resolve Target Branch

- Accept the target branch from the user explicitly (e.g., `main`, `develop`, `staging`).
- **Never infer or default** the target branch silently — always confirm with the user if not provided.
- Validate the target branch exists on the remote:
  ```bash
  git ls-remote --heads origin <target-branch>
  ```

### 2. Resolve PR Description Template

Look for the template in the following priority order:

1. `.github/PULL_REQUEST_TEMPLATE.md`
2. `.github/PULL_REQUEST_TEMPLATE/*.md` (first file found)
3. `docs/PULL_REQUEST_TEMPLATE.md`
4. `PULL_REQUEST_TEMPLATE.md` (repo root)

If no template is found, **halt and notify the user** — do not fabricate a template.

### 3. Collect PR Metadata

Prompt the user for:

| Field | Required | Notes |
|---|---|---|
| PR Title | Yes | Should be imperative mood, concise |
| Target Branch | Yes | Must be confirmed explicitly |
| Draft PR? | No | Default: `false` |
| Reviewers | No | Comma-separated GH usernames |
| Labels | No | Must exist in the repo |
| Assignees | No | Default: current authenticated user |
| Milestone | No | Optional |

### 4. Populate the Template

- Read the full template content.
- **Preserve all section headers and checkboxes** from the template exactly.
- Populate sections using:
  - Current branch name and recent commits (`git log --oneline -10`)
  - Diff summary (`git diff <target-branch>...HEAD --stat`)
  - User-provided inputs for description-specific fields
- Leave unpopulated optional sections with their placeholder text intact — do not remove them.

### 5. Construct and Execute the GH CLI Command

```bash
gh pr create \
  --base <target-branch> \
  --title "<pr-title>" \
  --body-file <temp-body-file> \
  [--draft] \
  [--reviewer <reviewers>] \
  [--label <labels>] \
  [--assignee <assignees>] \
  [--milestone <milestone>]
```

- Write the populated template to a **temporary file** (e.g., `/tmp/pr_body_<timestamp>.md`) rather than passing inline to avoid shell escaping issues.
- Clean up the temp file after the PR is created.

### 6. Confirm and Report

After successful creation:

- Output the PR URL.
- Confirm the target base branch.
- Confirm draft status.
- Offer to open the PR in the browser: `gh pr view --web`.

---

## Error Handling

| Scenario | Behavior |
|---|---|
| Not authenticated | Run `gh auth login` and retry |
| Target branch not found on remote | Halt, show available remote branches |
| Dirty working tree (uncommitted changes) | Warn user; do not block |
| No commits ahead of target | Warn user — PR may be empty |
| Template not found | Halt, do not fabricate content |
| GH CLI not installed | Provide installation instructions |
| PR already exists for this branch | Notify user, offer to open existing PR |

---

## Constraints

- **Never modify the PR template file** — treat it as read-only.
- **Never default the target branch** without explicit user confirmation.
- **Never push commits** — these instructions only cover PR creation. Branch pushing is the user's responsibility unless explicitly requested.
- Do not add or remove template sections — populate only.

---

## Related Files

- Prompt: [`.github/prompts/create-pr.prompt.md`](../../prompts/create-pr.prompt.md)
- PR Template: [`.github/PULL_REQUEST_TEMPLATE.md`](../../PULL_REQUEST_TEMPLATE.md)
