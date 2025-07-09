# Project Development Guidelines

## Automated Testing Guidelines

### Test Scope
- **Only create positive tests** unless explicitly requested to add negative tests or edge cases
- Focus on happy path scenarios that verify features work as expected
- One positive test per feature is sufficient unless more comprehensive testing is specifically requested
- Keep tests as simple as possible

### Test Execution
- **Do not display Playwright reports** in the UI, run the tests in headless mode and review console results or text results. Don't pull up HTML reports
- Run tests in the background using terminal commands
- Analyze test results programmatically and provide summary of outcomes
- Only show test failures or issues that need attention

### Test Structure
- Use clear, descriptive test names that indicate the feature being tested
- Include proper test setup and cleanup
- Use reliable selectors (preferably data-testid attributes)
- Keep tests focused and atomic - one test per specific functionality

### Test Names
- name test files after the feature they are testing and not generic file names like "bug-fix" or "new-feature"

## Code Review Guidelines

### Change Validation
- **Always review all changes holistically** across the entire codebase
- Ensure changes are consistent across all related files
- Verify that modifications don't break existing functionality
- Check for orphaned references when files are deleted or renamed

### Documentation Consistency
- If files are deleted, remove references from README.md
- If new files are created, add them to relevant documentation
- Update project structure diagrams if significant changes are made
- Keep package.json scripts aligned with actual test files

### Integration Checks
- Verify imports/exports are updated when files are moved or renamed
- Check that routing still works after page component changes
- Ensure CSS classes and styling remain consistent
- Validate that test-ids are properly added for new interactive elements

## Implementation Standards

### Component Development
- Add appropriate data-testid attributes for testable elements
- Maintain consistent styling and UX patterns
- Follow existing code patterns and conventions
- Ensure proper TypeScript typing

### Feature Implementation
- Implement features incrementally and test at each stage
- Maintain backwards compatibility unless breaking changes are intentional
- Consider performance impact of new features
- Follow accessibility best practices
- All features should prioritize performance and be as fast as possible.

---

*These guidelines should be considered for all development tasks unless specifically overridden by explicit instructions.* 