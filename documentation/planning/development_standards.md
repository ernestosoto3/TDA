# Development Standards

## Purpose

This document defines the shared development standards for the TDA monorepo. These standards help contributors produce consistent, maintainable, and reviewable work.

## Required Commands

Run all commands from the repository root.

### Formatting

Format all supported repository files:

```bash
pnpm format
```

Verify formatting without modifying files:

```bash
pnpm format:check
```

### Linting

Analyze the repository for code-quality problems:

```bash
pnpm lint
```

### Type Checking

Run the type-checking scripts available in the workspace projects:

```bash
pnpm typecheck
```

Each application and shared package must define its own `typecheck` script when its source code is initialized.

### Testing

Run the available project tests:

```bash
pnpm test
```

The repository currently uses a temporary test command because application source projects have not been initialized. Real automated tests must be added as features are implemented.

### Complete Validation

Run all required validations before opening or updating a pull request:

```bash
pnpm check
```

This command verifies formatting, linting, type checking, and testing.

## File and Folder Naming Conventions

Use the following naming conventions:

- Use `kebab-case` for source folders and general source files.
- Use `PascalCase` for React component files.
- Use `camelCase` for variables and functions.
- Use `PascalCase` for types, interfaces, and classes.
- Use `UPPER_SNAKE_CASE` for constants and environment variables.
- Use `snake_case` for documentation files to remain consistent with the existing documentation structure.
- Use descriptive names that clearly communicate each file or folder’s responsibility.
- Use the approved TDA terminology consistently throughout the repository.

Examples:

```text
game-details/
game-service.ts
GameCard.tsx
development_standards.md
```

## Branch Naming Conventions

Use the following format:

```text
type/issue-number-short-description
```

Approved branch types:

- `feature` for new functionality
- `fix` for bug fixes
- `docs` for documentation
- `design` for design work
- `refactor` for code restructuring
- `test` for testing work
- `chore` for configuration and maintenance

Examples:

```text
feature/31-user-authentication
fix/42-notification-navigation
docs/15-primary-user-flows
chore/24-development-standards
```

Branch names must be lowercase, concise, and use hyphens between words.

## Commit-Message Conventions

Use the following format:

```text
type: short description
```

Approved commit types:

- `feat`
- `fix`
- `docs`
- `design`
- `refactor`
- `test`
- `chore`

Examples:

```text
feat: add user authentication
fix: correct notification navigation
docs: document development standards
chore: configure automated checks
```

Commit messages must:

- Be concise.
- Use the imperative form.
- Describe one logical change.
- Use lowercase after the commit type.
- Avoid unrelated changes in the same commit.

## Pull-Request Requirements

Every pull request must:

- Have a clear title and concise description.
- Reference the related issue.
- Explain the principal changes.
- Include the testing or validation performed.
- Target the correct branch.
- Contain only changes related to its issue.
- Pass all required automated checks.
- Receive approval before being merged.
- Resolve requested changes and review comments.
- Avoid committing secrets, credentials, private keys, or `.env` files.

## Automated Pull-Request Checks

Pull requests into `main` automatically run:

- Formatting validation
- ESLint
- Type checking
- Tests

The automated checks are configured in:

```text
.github/workflows/pull-request-checks.yml
```

A pull request must not be merged when a required check fails.

## Testing Strategy

TDA will use the following levels of testing:

- Unit tests for individual functions, services, and components.
- Integration tests for interactions between modules, APIs, and databases.
- End-to-end tests for critical user and administrator flows.
- Manual tests for interface behavior and platform-specific functionality.

Every bug fix should include a regression test when practical. New features should include tests appropriate to their complexity and risk.

Each application and shared package must add its own testing and type-checking scripts when its source code is initialized.

## Definition of Done

Work is considered complete when:

- The issue requirements and acceptance criteria are satisfied.
- The implementation follows repository naming and coding conventions.
- Formatting, linting, type checking, and tests pass.
- Relevant tests are added or updated.
- Documentation is updated when necessary.
- No secrets or unrelated changes are included.
- The pull request references the related issue.
- Review comments are resolved.
- Required approval is received.
- The changes are merged into the correct target branch.

## Approval

These standards become the approved team baseline when the related pull request is reviewed and merged. Future changes to these standards must be made through a reviewed pull request.