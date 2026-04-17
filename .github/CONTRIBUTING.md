# Contributing to Smart Community Health Monitoring

Thank you for considering contributing to our project! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please note that this project follows our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the issue list to avoid duplicates.

When you create a bug report, include as many details as possible:
- **Use a clear and descriptive title**
- **Describe the exact steps which reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see and why**
- **Include screenshots if possible**
- **Include your environment** (Node version, OS, browser)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:
- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and expected behavior**
- **Explain why this enhancement would be useful**

## Pull Requests

- Fill in the required template
- Follow the JavaScript/React styleguides
- End all files with a newline
- Avoid platform-dependent code
- Use clear and descriptive commit messages

### Process

1. **Fork the repository** and create a branch from `develop`
2. **Install dependencies**: `npm install`
3. **Make your changes** and test thoroughly
4. **Run linting**: `npm run lint`
5. **Run formatting**: `npm run format`
6. **Run tests**: `npm test`
7. **Commit with clear messages** following conventional commits
8. **Push to your fork** and submit a pull request

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone https://github.com/Natarajan2007/Smart-Community-Health-Monitoring.git
cd Smart-Community-Health-Monitoring

# Install dependencies
npm install

# Start development server
npm run dev

# In another terminal, start the backend server
npm run server
```

### Available Scripts

```bash
npm run dev              # Start Vite dev server
npm run server          # Start Express backend
npm run build           # Build for production
npm run preview         # Preview production build
npm test               # Run tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run lint          # Run ESLint
npm run lint:fix      # Fix linting errors
npm run format        # Format code with Prettier
npm run format:check  # Check code formatting
```

## Styleguides

### JavaScript/React Code

- Use `const` and `let`, avoid `var`
- Use arrow functions where appropriate
- Add JSDoc comments for functions
- Keep components focused and single-responsibility
- Use meaningful variable and function names
- Follow the existing code style

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, semicolons, etc.)
- `refactor:` Code refactoring without feature changes
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Build process, dependencies, or other maintenance
- `ci:` CI/CD configuration changes

**Example:**
```
feat(comparison): add side-by-side account comparison

Add new comparison table component that shows three account types
side-by-side with feature comparisons.

Closes #123
```

### Component Structure

```
ComponentName/
├── ComponentName.jsx       # Main component
├── ComponentName.scss      # Styles
├── ComponentName.test.jsx  # Tests
├── index.js               # Exports
└── README.md              # Documentation
```

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for >80% code coverage

```bash
npm test               # Run all tests
npm run test:coverage # Generate coverage report
```

## Documentation

- Update relevant documentation when making changes
- Add comments for complex logic
- Update README if adding features
- Keep documentation up-to-date with code

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- GitHub contributors page

## Questions or Need Help?

Feel free to:
- Open an issue with your question
- Discuss in pull request comments
- Check existing issues for similar questions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🎉
