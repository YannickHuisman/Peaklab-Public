# Peaklab

> Preventive blood analysis for active adults — test your biomarkers, get AI-driven insights, and optimise your energy, strength and performance.

Live product: **T.B.C.**

<img width="1735" height="987" alt="Screenshot 2026-06-15 at 18 06 48" src="https://github.com/user-attachments/assets/94b6cd14-7032-4ecf-b6b5-fa3581a26e28" />
<img width="1735" height="987" alt="Screenshot 2026-06-15 at 18 06 55" src="https://github.com/user-attachments/assets/be9f8048-6ad4-4a8a-beec-7effc8134ad0" />
<img width="1735" height="987" alt="Screenshot 2026-06-15 at 18 07 04" src="https://github.com/user-attachments/assets/54e529ca-3a0e-4413-815d-c51d88d9d4de" />
<img width="1735" height="987" alt="Screenshot 2026-06-15 at 18 07 18" src="https://github.com/user-attachments/assets/0273735e-b942-41c8-be61-27f1f0a3e96c" />
<img width="1735" height="987" alt="Screenshot 2026-06-15 at 18 07 26" src="https://github.com/user-attachments/assets/12ebe5c0-f67e-4ab0-b62f-994f7f2da9e0" />
<img width="1735" height="987" alt="Screenshot 2026-06-15 at 18 07 33" src="https://github.com/user-attachments/assets/cebf4cd8-6cf4-4546-b017-05935b8222b8" />

---

## About this repository

This is a **public, curated showcase** of the Peaklab codebase. The commit history has been squashed and all secrets and credentials removed, so it is meant for reviewing the architecture and code quality rather than running a full production instance.

**All data in this repository is mock / example data** — it contains no real users, blood results or personal information. Peaklab works with sensitive health data, so the public version uses only synthetic placeholders.

## What Peaklab does

Peaklab is a platform for preventive blood analysis aimed at athletic adults. Users test a set of biomarkers, receive AI-driven insights into what the results mean for them, and get concrete guidance to optimise their energy, strength and performance over time. The platform is fully bilingual (Dutch / English).

## My role

I am the **sole developer of Peaklab** — I designed and built the entire platform end to end:

- **Frontend** — the complete user-facing application in React and TypeScript.
- **Backend & data** — the backend, database schema and the biomarker content model, including interpretation ranges per marker and the optimisation guidance shown to users.
- **Infrastructure & tooling** — the monorepo setup, CI/CD pipeline, internationalisation (NL/EN) and deployment.

## Tech stack

- **Frontend:** React, TypeScript
- **Backend & data:** Node.js, PostgreSQL
- **Monorepo:** pnpm workspaces + Turborepo
- **Internationalisation:** i18n (NL / EN)
- **Deployment:** Railway

## Architecture

A Turborepo-managed monorepo:

```
apps/        # application(s)
packages/    # shared code (UI, config, types, ...)
scripts/     # tooling and maintenance scripts
```

Shared configuration (TypeScript, ESLint, Prettier) lives at the root and is extended across the workspace, so every package follows the same standards.

## Engineering practices

The project is set up to stay maintainable as it grows:

- **Strict TypeScript** across the entire monorepo (~96% of the codebase).
- **Turborepo** for fast, cached builds and task orchestration.
- **Consistent code style** enforced with ESLint and Prettier (shared configs).
- **Conventional commits** enforced via commitlint.
- **Pre-commit hooks** with Husky + lint-staged, so linting and formatting run before anything is committed.
- **CI** via GitHub Actions.

## Getting started

> Note: this is a sanitised public copy. Environment variables and secrets are not included, so it will not run end-to-end out of the box — it is primarily here to read.
