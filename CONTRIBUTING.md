# Contributing Guide

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions.

## Getting Started

### Fork and Clone
```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Smart-Community-Health-Monitoring.git
cd Smart-Community-Health-Monitoring

# Add upstream remote
git remote add upstream https://github.com/Natarajan2007/Smart-Community-Health-Monitoring.git
```

### Setup Development Environment
```bash
# Install dependencies
npm install

# Create .env.local from .env.example
cp .env.example .env.local
```

## Development Workflow

### 1. Create Feature Branch
```bash
# Update main branch
git checkout main
git pull upstream main

# Create new feature branch
git checkout -b feature/descriptive-name
```

### 2. Make Changes
- Write clean, readable code
- Add comments for complex logic
- Update tests as needed
- Follow existing code style

### 3. Code Quality Checks
```bash
# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Run tests
npm test
npm run test:coverage
```

### 4. Commit Changes
```bash
# Stage changes
git add .

# Commit with clear message
git commit -m "feat: Add feature description

- Specific detail about change
- Another detail if needed"
```

### Commit Message Format

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, semicolons, etc.)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Test additions/updates
- `chore:` Build, dependencies, or other maintenance

### 5. Push and Create Pull Request
```bash
# Push to your fork
git push origin feature/descriptive-name

# Create pull request on GitHub
```

## Pull Request Guidelines

### Description Template
```markdown
## Description
Clear description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test the changes:
- Step 1
- Step 2

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] No new warnings generated
- [ ] Documentation updated
```

### Before Submitting
- [ ] Code passes all linting checks (`npm run lint`)
- [ ] Code is properly formatted (`npm run format`)
- [ ] Tests pass (`npm test`)
- [ ] No console errors or warnings
- [ ] Changes are documented
- [ ] Commits are logical and well-described

## Adding New Features

### New Component
1. Create in `src/components/ComponentName.jsx`
2. Wrap with `React.memo()` for performance
3. Add JSDoc comments
4. Include in `src/components/index.js` if creating index
5. Add tests in `__tests__/` folder

### New Utility Function
1. Create in `src/utils/`
2. Export default and named exports
3. Add comprehensive JSDoc
4. Add unit tests
5. Update exports in relevant index files

### New Service
1. Create in `src/services/ `
2. Follow existing service patterns
3. Add error handling
4. Add JSDoc comments
5. Add integration tests

### New Hook
1. Create in `src/hooks/`
2. Follow React hook best practices
3. Add cleanup functions if needed
4. Document dependencies array
5. Add JSDoc comments

## Style Guide

### JavaScript
- Use ES6+ syntax
- Use const/let, not var
- Prefer arrow functions
- Use template literals for strings
- 2-space indentation

### React
- Functional components only
- Use hooks for state management
- Memoize expensive components
- Keep components focused and small
- Use JSDoc for component documentation

### CSS/SCSS
- Use BEM naming convention
- Variables for colors and sizes
- Mobile-first approach
- Accessibility considerations

### Documentation
- Clear and concise
- Include code examples
- Update README for major changes
- Add comments for complex logic
- JSDoc for public functions

## Testing

### Writing Tests
```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });
});
```

### Test Coverage
- Aim for >80% coverage
- Focus on critical paths
- Test edge cases
- Mock external dependencies

## Documentation

### JSDoc Format
```javascript
/**
 * Brief description of function
 * 
 * Longer description if needed.
 * 
 * @param {Type} paramName - Parameter description
 * @returns {Type} Return value description
 * @throws {ErrorType} Error description
 * @example
 * functionName(arg) // returns value
 */
```

### README Updates
- Update if adding new features
- Explain new installation steps
- Add usage examples
- Update troubleshooting section

### Comments
- Explain "why", not "what"
- Keep comments up-to-date
- Use block comments for sections
- Use inline comments sparingly

## Performance Considerations

- Memoize components that render frequently
- Use useCallback for event handlers
- Lazy load non-critical routes
- Optimize images and assets
- Minimize bundle size

## Accessibility (a11y)

- Use semantic HTML
- Include alt text for images
- Ensure keyboard navigation
- Maintain sufficient color contrast
- Test with screen readers

## Security

- Sanitize user inputs
- Prevent XSS attacks
- Validate all API inputs
- Never commit sensitive data
- Use environment variables for secrets

## Review Process

1. **Initial Review**: Automated checks (linting, tests)
2. **Code Review**: Maintainers review changes
3. **Feedback**: Address review comments
4. **Approval**: Get maintainer approval
5. **Merge**: Changes merged to main

## Reporting Issues

### Bug Reports Include
- Clear description of bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (OS, Node version, etc.)
- Screenshots if applicable
- Error logs

### Feature Requests Include
- Clear description of feature
- Use case and motivation
- Proposed implementation (optional)
- Examples from other projects (optional)

## Questions?

- Check existing issues and discussions
- Read the Development Guide
- Ask in pull request comments
- Create a Discussion issue

## Recognition

Contributors are recognized in:
- GitHub Contributors page
- Commit history
- Release notes
- Project documentation

Thank you for contributing! 🎉
