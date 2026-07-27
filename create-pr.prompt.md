---
mode: agent
description: Create a pull request using GH CLI, populating the repository's PR description template. Target branch must be specified by the user.
tools:
  - terminal
  - githubRepo
---

# Create Pull Request

You are helping the user create a GitHub pull request using the `gh` CLI. You must follow the repository's existing PR description template exactly — do not invent structure or skip sections.

---

## Step 1: Confirm Target Branch

Ask the user:

> "Which branch should this PR target? (e.g., `main`, `develop`, `staging`)"

Do **not** assume or default. Wait for an explicit answer before proceeding.

---

## Step 2: Validate Environment

Run the following checks in sequence. Stop and report if any fail.

```bash
# 1. GH CLI is installed and authenticated
gh auth status

# 2. We are inside a git repository
git rev-parse --git-dir

# 3. Capture current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"

# 4. Target branch exists on remote (substitute <target-branch> with user input)
git ls-remote --heads origin <target-branch>
```

---

## Step 3: Read the PR Template

Locate and read the repository's PR description template. Check in this order:

```bash
# Check priority order
[ -f .github/PULL_REQUEST_TEMPLATE.md ] && cat .github/PULL_REQUEST_TEMPLATE.md
[ -f docs/PULL_REQUEST_TEMPLATE.md ] && cat docs/PULL_REQUEST_TEMPLATE.md
[ -f PULL_REQUEST_TEMPLATE.md ] && cat PULL_REQUEST_TEMPLATE.md
```

If no template is found in any location, **stop and inform the user** with:

> "No PR template found in this repository. Please create one at `.github/PULL_REQUEST_TEMPLATE.md` before using this prompt, or provide the template content directly."

---

## Step 4: Gather Context from Git

Collect information to populate the template:

```bash
# Recent commits on this branch relative to target
git log --oneline origin/<target-branch>..HEAD

# File change summary
git diff origin/<target-branch>...HEAD --stat

# Full diff (for context, not for output)
git diff origin/<target-branch>...HEAD
```

---

## Step 5: Populate the PR Template

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

## Step 6: Confirm PR Title

Ask the user:

> "What should the PR title be?"

Guidelines to share with the user:
- Use imperative mood: "Add feature X", "Fix bug in Y", "Refactor Z"
- Keep it under 72 characters
- Reference a ticket number if applicable: `feat(auth): add OAuth2 PKCE flow [PROJ-123]`

---

## Step 7: Optional Metadata

Ask the user (all optional — they can skip):

```
- Reviewers (GH usernames, comma-separated)?
- Labels (must exist in repo)?
- Draft PR? [y/N]
- Assignees? (default: yourself)
```

---

## Step 8: Create the PR

Construct the final command:

```bash
gh pr create \
  --base <target-branch> \
  --head $(git branch --show-current) \
  --title "<pr-title>" \
  --body-file "$BODY_FILE" \
  [--draft] \
  [--reviewer "<reviewer1>,<reviewer2>"] \
  [--label "<label1>,<label2>"] \
  [--assignee "<assignee>"]
```

Execute it and capture the output.

---

## Step 9: Cleanup and Confirm

```bash
# Remove temp file
rm -f "$BODY_FILE"
```

Report back to the user:

```
✅ PR created successfully!

Title:   <pr-title>
Base:    <target-branch>
Head:    <current-branch>
Draft:   <yes/no>
URL:     <pr-url>
```

Offer to open in the browser:

```bash
gh pr view --web
```

---

## Important Rules

- **Never push commits.** Only create the PR against already-pushed branches.
- **Never modify** the repository's PR template file.
- **Always confirm** the target branch with the user — never infer it.
- **Never fabricate** a PR description template if one is not found in the repo.
- If the branch hasn't been pushed yet, inform the user:
  ```bash
  git push --set-upstream origin $(git branch --show-current)
  ```
  Then retry PR creation.
