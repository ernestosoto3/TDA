# Contributing to TDA

This document defines how the team should create issues, organize branches, write commits, and submit changes.

## Repository Branches

The repository has two permanent branches:

- `main`: Contains application code, configuration, setup files, and the stable project structure.
- `documentation`: Contains product planning, architecture, research, design documentation, and other project documents.

Repository-level files such as `README.md` and `CONTRIBUTING.md` remain on `main` because contributors need them when cloning the repository.

## Development Workflow

### Changes for `main`

Do not make application or configuration changes directly on `main`.

1. Switch to `main`.
2. Pull the latest changes.
3. Create a new branch for the issue.
4. Make only the changes related to that issue.
5. Run the applicable validation commands.
6. Commit and push the branch.
7. Open a pull request into `main`.

Example:

```bash
git switch main
git pull origin main
git switch -c chore/15-configure-monorepo
```

### Documentation Changes

Planning, architecture, research, product, and design documentation should be completed on the `documentation` branch.

```bash
git switch documentation
git pull origin documentation
```

Before starting documentation work, make sure the branch includes any relevant updates from `main`.

```bash
git merge main
```

## Branch Names

Use lowercase words separated by hyphens.

Include the issue type, issue number, and a short description when creating a branch from `main`.

Format:

```text
type/issue-number-short-description
```

Examples:

```text
feature/21-add-team-page
fix/34-following-feed-loading
chore/15-configure-monorepo
refactor/42-organize-api-services
```

## GitHub Issue Format

Every issue should clearly explain the task and what must be completed.

### Title

Start the title with a bracket tag:

```text
[Type] Issue title
```

Accepted issue types:

- `[Feature]`: New feature or planned application section
- `[Fix]`: Correction or adjustment
- `[Documentation]`: Planning, research, or written project documentation
- `[Design]`: Branding, wireframes, layout, or visual style
- `[Refactor]`: Reorganization without changing existing behavior
- `[Chore]`: Setup, organization, tooling, or maintenance

Examples:

```text
[Documentation] Research Competitor Sports Apps
[Design] Define Branding Direction and Visual Style
[Feature] Create Initial Sports Feed
[Chore] Configure Initial Monorepo
```

### Issue Content

Each issue should contain:

#### Quick Description

Briefly explain what the issue is about and why it matters.

#### Deliverables

List everything that must be completed for the issue to be considered done.

#### Example

Include an example only when it helps explain the expected result.

## Commit Messages

Use the following format:

```text
type: short description #issue-number (initial)
```

Accepted commit types:

- `feat`: Adds a feature or new planned section
- `fix`: Corrects a problem
- `docs`: Changes documentation, planning, research, or written content
- `style`: Changes branding, layout, or visual presentation
- `test`: Adds or changes tests
- `refactor`: Reorganizes code without changing its behavior
- `chore`: Changes setup, tooling, configuration, or maintenance files

Contributor initials:

- `(E)`: Ernesto
- `(V)`: Victor

Examples:

```text
docs: add problem statement draft #1 (E)
docs: update competitor research notes #2 (V)
feat: define initial sports feed concept #3 (E)
style: add branding direction options #4 (V)
fix: correct wording in user stories #5 (E)
chore: configure initial monorepo #15 (E)
```

Keep commit messages short and clear. Every commit should identify:

- The type of change
- What changed
- The related issue
- The contributor

## Validation

Before committing, run every command applicable to the change:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Some commands may become available only after the applications are initialized.

Documentation-only changes do not require application validation unless they affect commands, configuration, or code examples.

## Pull Requests

Each pull request into `main` should:

- Address one issue or a closely related set of changes
- Explain what changed and why
- Include verification or testing instructions
- Reference the corresponding issue
- Avoid unrelated changes
- Contain no credentials, secrets, or private environment values

## General Rules

- Keep issues, commits, and pull requests short, clear, and consistent.
- Use the approved TDA terminology throughout the repository.
- Never commit `.env` files, credentials, tokens, or private keys.
- Confirm the correct target branch before making changes.
- Do not mix documentation work with unrelated application changes.
