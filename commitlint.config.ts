module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "test",
        "chore",
        "ci",
        "revert",
      ],
    ],
    "scope-case": [2, "always", ["lower-case", "upper-case"]],
    "subject-case": [2, "never", []],
  },
};

/**
 * ✅ Commit Message Guidelines (Using Conventional Commits)
 *
 * Example:
 *    feat: add login support
 *    fix: resolve login issue
 *
 * Rules:
 * 1. ✅ Subject (description) must not be empty
 * 2. ✅ Type must be one of these:
 *    - feat: new feature
 *    - fix: bug fix
 *    - docs: documentation only
 *    - style: formatting only (no code change)
 *    - refactor: code improvement (no feature/bug)
 *    - test: adding/updating tests
 *    - chore: build tools, deps, etc.
 *    - ci: CI/CD config
 *    - revert: undo previous commit
 * 3. ✅ Scope (optional) must be all lowercase or all UPPERCASE
 *    - ✅ Correct: feat(api): ...
 *    - ❌ Wrong: feat(Api): ...
 * 4. ✅ Subject can be written naturally (no forced casing)
 *    - ✅ add login flow
 *    - ❌ ADD LOGIN FLOW or addloginflow
 */
