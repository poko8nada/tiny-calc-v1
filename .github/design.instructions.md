# UI/UX Design Guidelines

## Core Principles

### Scope

- **Visual only**: layout, typography, color, spacing, interaction states
- **NO business logic or data architecture**

### Design Philosophy

- Modern web aesthetics (Vercel, Linear, Stripe, shadcn/ui)
- Accessibility first (WCAG 2.1 AA)
- Mobile-first responsive design
- Clear hierarchy, consistent language, minimal design

### Tech Stack

**Default**: Tailwind CSS + shadcn/ui (or similar Tailwind-based component libraries)

- **Respect Tailwind defaults** for typography, spacing, responsive breakpoints
- **Customize colors only** to match brand identity
- Component libraries are built on Tailwind - follow their conventions
- Avoid overriding built-in accessibility features

## Customization Guidelines

### Colors (Primary Customization Area)

Provide color tokens mapped to Tailwind config:

- Primary, secondary, accent colors (hex codes)
- Neutral scale (gray-50 to gray-900)
- Semantic colors (success, warning, error, info)
- **Ensure contrast ratios**: minimum 4.5:1 (text), 3:1 (UI components)

### Example

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          // ...
          900: "#0c4a6e",
        },
      },
    },
  },
};
```

## Accessibility Requirements

- Minimum contrast ratio: 4.5:1 (text), 3:1 (UI components)
- Keyboard navigation support
- Focus indicators (visible outline)
- ARIA labels for interactive elements
- Alt text for images
- Semantic HTML structure
