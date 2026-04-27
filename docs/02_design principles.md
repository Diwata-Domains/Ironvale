# Design Principles
---
1. CSS-First

All core functionality must work with CSS alone.
JavaScript is optional and layered on top.

2. Framework-Agnostic

The system must function in:
- plain HTML
- React, Vue, Svelte, Angular
- server-rendered templates

No core dependency on any framework.

3. Composability Over Abstraction

Prefer small primitives over large components.

Avoid:
- “mega components” (e.g., full Form systems)

Prefer:
- Field, Label, Input, ErrorText

4. Token-Driven System

All styling must derive from tokens:
- global tokens
- semantic tokens
- component tokens

No hardcoded values in components unless justified.

5. Low Specificity Styling

Ensure easy overrides:
- avoid deep nesting
- avoid !important
- use predictable class structure
- prefer CSS variables

6. Predictable APIs

Consistency across all components:
- same variant names
- same size scale
- same state conventions

7. Accessibility by Default

All components must:
- support keyboard navigation
- include visible focus states
- use semantic HTML
- avoid unnecessary ARIA

8. Explicit Over Implicit

No hidden behavior:
- DOM structure must be understandable
- styles must be traceable
- no “magic” dependencies

9. Themeability as a First-Class Feature

Developers must be able to:
- change colors
- change spacing
- change typography
- without modifying source code

10. Documentation as Product

Documentation is not secondary:
- interactive
- example-driven
- practical use cases