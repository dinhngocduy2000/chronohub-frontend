---
description: Create a pull request using GH CLI, populating the repository's PR description template. Target branch must be specified by the user.
tools:
  - runCommands
  - githubRepo
inputs:
  - id: targetBranch
    description: "Target base branch for the PR (e.g. main, develop, staging)"
    type: promptString
    default: main
---

# Create Pull Request

You are helping the user create a GitHub pull request using the `gh` CLI. You must follow the repository's existing PR description template exactly — do not invent structure or skip sections.

The target base branch is: **`${input:targetBranch}`**

---

## Step 1: Validate Environment

Run the following checks in sequence. Stop and report if any fail.

```bash
# 1. GH CLI is installed and authenticated
gh auth status

# 2. We are inside a git repository
git rev-parse --git-dir

# 3. Capture current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"

# 4. Target branch exists on remote
git ls-remote --heads origin ${input:targetBranch}
```

---

## Step 2: Read the PR Template

Locate and read the repository's PR description template. Check in this order:

```bash
[ -f .github/PULL_REQUEST_TEMPLATE.md ] && cat .github/PULL_REQUEST_TEMPLATE.md
[ -f docs/PULL_REQUEST_TEMPLATE.md ] && cat docs/PULL_REQUEST_TEMPLATE.md
[ -f PULL_REQUEST_TEMPLATE.md ] && cat PULL_REQUEST_TEMPLATE.md
```

If no template is found in any location, **stop and inform the user** with:

> "No PR template found in this repository. Please create one at `.github/PULL_REQUEST_TEMPLATE.md` before using this prompt, or provide the template content directly."

---

## Step 3: Gather Context from Git

Collect information to populate the template:

```bash
# Recent commits on this branch relative to target
git log --oneline origin/${input:targetBranch}..HEAD

# File change summary
git diff origin/${input:targetBranch}...HEAD --stat

# Full diff (for context, not for output)
git diff origin/${input:targetBranch}...HEAD
```

---

## Step 4: Populate the PR Template

Using the template content and git context gathered above, fill in the template sections:

- **Preserve every section header, checkbox, and structural element** from the original template.
- Populate description fields with a clear, human-readable summary of what this PR does, derived from the commit messages and diff.
- For checklist items (e.g., `- [ ] Tests added`), leave them unchecked — do not pre-check items on the user's behalf.
- For sections you cannot determine automatically (e.g., "Related tickets", "Screenshots"), insert a clear placeholder: `<!-- TODO: fill in -->`
- Do not remove any optional sections.

Write the populated body to a temp file:

```bash
BODY_FILE=$(mktemp /tmp/pr_body_XXXXXX.md)
cat > "$BODY_FILE" << 'EOF'
<populated template content here>
EOF
```

---

## Step 5: Resolve PR Metadata

Do **not** ask the user for these — resolve them automatically:

```bash
# Title: derive from current branch name
# Convert slashes, hyphens, and underscores to spaces
# e.g. "feat/add-oauth-flow" → "feat add oauth flow"
CURRENT_BRANCH=$(git branch --show-current)
PR_TITLE=$(echo "$CURRENT_BRANCH" | sed 's/[-_\/]/ /g')

# Assignee: default to the authenticated GH user
GH_USER=$(gh api user --jq '.login')
```

Apply these defaults unless the user explicitly stated otherwise in their message:

| Field | Default |
|---|---|
| Title | Branch name (normalized as above) |
| Reviewers | None — omit `--reviewer` flag entirely |
| Draft | `false` — omit `--draft` flag unless user said "draft" |
| Assignees | Authenticated GH user (`$GH_USER`) |
| Labels | None — omit `--label` flag entirely |

---

## Step 6: Create the PR

Construct and execute the final command:

```bash
gh pr create \
  --base ${input:targetBranch} \
  --head $(git branch --show-current) \
  --title "$PR_TITLE" \
  --body-file "$BODY_FILE" \
  --assignee "$GH_USER"
```

Execute it and capture the output.

---

## Step 7: Cleanup and Confirm

```bash
rm -f "$BODY_FILE"
```

Report back to the user:

```
✅ PR created successfully!

Title:     <pr-title>
Base:      ${input:targetBranch}
Head:      <current-branch>
Assignee:  <gh-user>
Draft:     no
URL:       <pr-url>
```

Offer to open in the browser:

```bash
gh pr view --web
```

---

## Important Rules

- **Never push commits.** Only create the PR against already-pushed branches.
- **Never modify** the repository's PR template file.
- **Never fabricate** a PR description template if one is not found in the repo.
- **Never prompt the user** for title, reviewers, draft status, or assignees — use the defaults above.
- If the branch hasn't been pushed yet, inform the user:
  ```bash
  git push --set-upstream origin $(git branch --show-current)
  ```
  Then retry PR creation.
