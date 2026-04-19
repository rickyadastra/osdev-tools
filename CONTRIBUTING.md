# Contributing to OSDev Tools
Contributions, suggestions and additions are very much welcome! 🎉
Whether you are fixing a bug, adding a new hardware register schema or improving the UI, your help is greatly appreciated.

## Tech stack
The app uses Vanilla JS, Vite, Tailwind CSS v4 and [BasecoatUI](https://basecoatui.com/).

## Branching Strategy
This project follows a simplified GitFlow model:
- `main` reflects the production-ready code deployed to GitHub Pages.
- `dev` is the active development branch
- `feature/` branches are for tools and other additions
    - Use `feature/tool/<name>` for a branch that adds a new tool to the project
    - Use `feature/<name>` for any other feature branch
- `bugfix/` branches are for non-critical fixes
- `hotfix/` branches are for critical fixes that should be added to `main` as soon as possible 

> [!IMPORTANT]
> All Pull Requests must be targeted at the `dev` branch. Do not target `main` in PRs.

## Code Guidelines
If you are contributing to new or existing JavaScript logic:
- use **Vanilla JS** to keep the tool lightweight and fast; avoid heavy frameworks like React or Vue
- use **Tailwind CSS** v4 utility classes for styling instead of writing custom CSS, unless necessary
- use **BigInt** when working with 64-bit values and bitwise operations

## Submitting a Pull Request
1. Commit your changes with clear messages; using conventional commits (see [cheatsheet](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13)) is greatly encouraged
2. Push your branch to your fork and ensure it's up-to-date with this repository's `dev` branch
3. Open a PR against the `dev` branch of this repository giving an exhaustive description about your additions and/or fixes
4. Wait for CI status checks to pass and reviewers to approve
