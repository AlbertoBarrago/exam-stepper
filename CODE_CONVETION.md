# Clean Code Policy for React & Next.js

## 1. Code Structure & Organization

- Organize components, pages, and utilities in meaningful directories.
- Use clear, descriptive file and folder names.
- Keep components small and focused; one component per file.

## 2. Naming Conventions

- Use `camelCase` for variables and functions.
- Use `PascalCase` for component names.
- Name files and components consistently.

## 3. Component Best Practices

- Prefer functional components and React hooks (e.g., `useState`, `useEffect`).
- Avoid deeply nested components; extract logic to reusable hooks or helpers.
- Use `props` and context for data flow, not global/shared variables.

## 4. Readability & Formatting

- Use consistent indentation (2 spaces by default).
- Write self-explanatory code; comment only when necessary.
- Use a linter (e.g., ESLint) and formatter (e.g., Prettier).

## 5. State Management

- Use local state for UI-related or isolated data.
- Use global state management (e.g., Zustand) sparingly as needed.
- Avoid prop drilling by using context or custom hooks.

## 6. Performance

- Memoize components and values with `React.memo` or `useMemo` where appropriate.
- Lazy load components and pages with dynamic imports.

## 7. Accessibility & Semantic HTML

- Use semantic HTML tags (e.g., `<button>`, `<header>`).
- Ensure components are accessible (ARIA labels, keyboard navigation).

## 8. Testing & Documentation

- Write unit and integration tests for components and pages.
- Use [Jest](https://jestjs.io/) and [Testing Library](https://testing-library.com/) as standard.
- Document components, hooks, and utility functions with comments or Markdown files.

---

Following this policy helps maintain a high-quality, scalable, and readable React/Next.js codebase.
