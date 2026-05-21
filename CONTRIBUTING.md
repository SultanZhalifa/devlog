# Contributing to DevLog

Thank you for your interest in contributing! This document describes how to get set up and submit changes.

## Development Setup

```bash
git clone https://github.com/sultanzhalifa/devlog.git
cd devlog
npm install
cp .env.example .env.local
# Fill in your credentials in .env.local
npx prisma generate
npx prisma db push
npm run dev
```

## Code Style

- TypeScript strict mode — no `any`, no suppression comments
- Prettier + ESLint enforced (`npm run lint`, `npm run format`)
- Tailwind CSS for all styling — no inline styles
- React Server Components by default; `"use client"` only when state/browser APIs are needed

## Commit Messages

Use the imperative mood and keep the subject under 72 characters:

```
add streak calendar component
fix tag upsert race condition
refactor analytics page to use server actions
```

## Pull Request Process

1. Fork the repo and create your branch from `main`
2. Make your changes and add tests if relevant
3. Ensure all checks pass: `npm run typecheck && npm run lint && npm test && npm run build`
4. Open a PR describing what changed and why

## Reporting Issues

Open a GitHub issue with:
- Steps to reproduce
- Expected vs actual behavior
- Your Node.js version and OS

## License

By contributing you agree your work will be licensed under the [MIT License](./LICENSE).
