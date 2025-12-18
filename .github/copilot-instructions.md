# Copilot Instructions

## Language and Communication Policy

- Always think, reason, and write code in English
- Always respond to user instructions and questions in **Japanese**
- Use concise, telegraphic style - minimize volume
- Avoid unnecessary explanations and emojis

## Task Execution Workflow

1. List tasks, files and what you do → **Get approval**
2. Execute implementation
3. Run tests → If fails, investigate and propose fixes → **Get approval** → Fix
4. Prepare commit message → **Get approval** → Commit

## Trigger Keywords

When user input contains these keywords → **STOP & REQUEST APPROVAL**

- commit, push, git add
- create, modify, delete, fix, refactor
- test, build, deploy

## Tools

- Use pnpm for all package management
- Consult Context7 MCP tools when needed
- Use Next-devtools for Next.js development

---

## Git Workflow

### Basic

- **Commit Format:** `<type>: <description>`
- **Types:** add, fix, remove, update, WIP

### Rules

- English, imperative mood (Add, Update, Fix)
- Lowercase description, no period
- Be specific and concise

---

## Reference Documents

For detailed guidelines, refer to:

- [Planning Phase](planning.instructions.md)
- [Coding Standards](coding.instructions.md)
- [UI/UX Design](design.instructions.md)
- [Next.js Architecture](arch/nextjs.instructions.md)
