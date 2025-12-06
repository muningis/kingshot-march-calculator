# Architecture

## Overview

This document defines the structural organization patterns for the application. It establishes conventions for code organization, separation of concerns, and architectural boundaries.

---

## Folder Structure

```
src/
├── components/
│   ├── ui/                    # Third-party UI primitives (shadcn/ui)
│   ├── molecules/             # Simple composite components
│   ├── structures/            # Complex feature components
│   └── templates/             # Page-level layouts
│
├── modules/                   # Business logic modules (domain-specific)
│   └── [module-name]/
│       ├── types.ts           # Module-scoped TypeScript types
│       ├── [module-name].ts   # Pure functions (no React dependencies)
│       ├── [module-name].test.ts  # Bun tests
│       └── index.ts           # Public API exports
│
├── store/                     # Global state management (Zustand)
│   ├── index.ts               # Store configuration
│   ├── slices/                # State slices
│   │   ├── [slice-name].ts
│   │   └── index.ts
│   └── middleware/            # Store middleware (persistence, etc.)
│
├── lib/                       # Shared utilities
│   └── utils.ts
│
├── App.tsx                    # Root component (composition only)
├── main.tsx                   # Application entry point
└── index.css                  # Global styles
```

---

## Architectural Layers

### 1. Component Layer (`components/`)

**Hierarchy:** ui → molecules → structures → templates

#### `ui/` - Primitives
- Third-party components (shadcn/ui, etc.)
- No business logic
- Styling and basic interactions only
- **Do not modify** - managed by third-party

#### `molecules/` - Simple Composites
- Compose multiple primitives
- Minimal logic (form validation, local state)
- Reusable across features
- Accept data via props
- Use callbacks for communication

#### `structures/` - Feature Components
- Complex, feature-specific components
- Connect to global state (store hooks)
- Compose molecules and primitives
- Handle feature-level business logic coordination

#### `templates/` - Page Layouts
- Define page-level structure
- Accept components as props (composition)
- No business logic
- Responsive layout logic only

**Rules:**
- Components should never import from `modules/` directly
- State management handled via store hooks
- Bottom-up dependency: ui ← molecules ← structures ← templates
- No cross-dependencies within same layer

---

### 2. Module Layer (`modules/`)

**Purpose:** Pure business logic with no UI dependencies

Each module is self-contained with:
- `types.ts` - TypeScript interfaces/types scoped to this module
- `[name].ts` - Pure functions implementing business logic
- `[name].test.ts` - Comprehensive unit tests
- `index.ts` - Public API (exports only what's needed)

**Characteristics:**
- **No React dependencies** - can run in Node.js, workers, etc.
- **Pure functions** - deterministic, testable
- **No side effects** - no API calls, localStorage, etc.
- **Framework agnostic** - could be used in Vue, Angular, etc.

**Rules:**
- Never import from `components/` or `store/`
- All types scoped within module (no shared types folder)
- Modules can import from other modules if needed
- Each module must have 100% test coverage

---

### 3. State Management Layer (`store/`)

**Pattern:** Zustand with slice-based architecture

#### Structure
```
store/
├── index.ts              # Combines all slices, exports hooks
├── slices/               # State slices (feature-based)
│   ├── [feature].ts      # State + actions for one feature
│   └── index.ts
└── middleware/           # Cross-cutting concerns
    └── [middleware].ts   # Persistence, logging, etc.
```

#### Slice Pattern
Each slice contains:
- State interface
- Actions (functions that modify state)
- Selectors (optional, for derived state)

Slices use functions from `modules/` for business logic:
```typescript
// ✅ Correct: Store orchestrates, module implements
import { businessLogic } from '@/modules/feature'

const slice = {
  state: [...],
  action: () => set(state => businessLogic(state))
}

// ❌ Wrong: Business logic in store
const slice = {
  action: () => set(state => {
    // Complex calculation here...
  })
}
```

**Rules:**
- Store orchestrates, modules implement
- Keep slices focused on single feature
- Use middleware for cross-cutting concerns
- No direct component imports

---

## Testing Strategy

### Test Runner: Bun

All tests use Bun's built-in test runner.

### Coverage Goals
- **Modules:** 100% coverage (critical business logic)
- **Store:** Integration tests for state updates
- **Components:** Optional (future consideration)

### Test Organization
- Co-located with source files (`.test.ts` suffix)
- Use descriptive test names (`should...` pattern)
- Group related tests with `describe` blocks

### Test Pattern
```typescript
import { describe, test, expect } from 'bun:test'
import { functionToTest } from './module'

describe('functionToTest', () => {
  test('should handle normal case', () => {
    expect(functionToTest(input)).toBe(expected)
  })

  test('should handle edge case', () => {
    expect(functionToTest(edgeInput)).toBe(edgeExpected)
  })

  test('should handle error case', () => {
    expect(() => functionToTest(badInput)).toThrow()
  })
})
```

---

## State Management: Zustand

### Why Zustand?

| Criteria | Zustand | Redux Toolkit | Context API | Jotai |
|----------|---------|---------------|-------------|-------|
| Bundle Size | ~3kb | ~30kb | 0kb | ~5kb |
| Boilerplate | Minimal | Moderate | Moderate | Minimal |
| TypeScript | Excellent | Excellent | Good | Excellent |
| Learning Curve | Low | Moderate | Low | Low |
| Middleware | Built-in | Built-in | Manual | Limited |
| Testing | Easy | Moderate | Hard | Easy |
| Persistence | Built-in | Plugin | Manual | Plugin |

**Decision:** Zustand provides the best balance of simplicity, features, and performance for small-to-medium applications.

### Store Pattern

```typescript
// store/index.ts
import { create } from 'zustand'
import { createSliceA } from './slices/sliceA'
import { createSliceB } from './slices/sliceB'
import { middleware } from './middleware/custom'

export const useStore = create(
  middleware(
    (...args) => ({
      ...createSliceA(...args),
      ...createSliceB(...args),
    })
  )
)
```

---

## TypeScript Conventions

### Module-Scoped Types

Types are defined within the module that uses them, not in a centralized location.

**Rationale:**
- Better encapsulation
- Prevents coupling between unrelated features
- Makes modules more portable
- Clear ownership of types

**Pattern:**
```typescript
// modules/feature/types.ts
export interface FeatureType { ... }

// modules/feature/feature.ts
import type { FeatureType } from './types'

// modules/feature/index.ts
export type { FeatureType } from './types'
export { featureFunction } from './feature'
```

### Import Conventions
- Use `import type` for type-only imports
- Use path aliases (`@/`) for absolute imports
- Prefer named exports over default exports (except App.tsx)

---

## Migration Strategy

### Phase 1: Infrastructure
1. Install dependencies (state management library)
2. Create folder structure
3. Configure test scripts in package.json

### Phase 2: Extract Logic
1. Create modules with types and pure functions
2. Write comprehensive tests for all modules
3. Verify 100% test coverage

### Phase 3: State Management
1. Create store structure with slices
2. Implement slices using module functions
3. Add middleware as needed
4. Write store integration tests

### Phase 4: Component Extraction
1. Create molecules (no store dependencies)
2. Create structures (with store hooks)
3. Create templates
4. Extract app header/layout components

### Phase 5: Refactor Root
1. Update App.tsx to use new components
2. Remove all business logic from App.tsx
3. App.tsx becomes pure composition (~50-75 lines)

### Phase 6: Validation
1. Run all tests (`bun test`)
2. Manual browser testing
3. Build production bundle (`bun run build`)
4. Run linter (`bun run lint`)
5. Remove unused code/files

---

## Architectural Principles

1. **Separation of Concerns:** UI, logic, and state are clearly separated
2. **Single Responsibility:** Each file/module has one clear purpose
3. **Dependency Rule:** Inner layers (modules) don't depend on outer layers (components)
4. **Testability First:** Architecture enables easy testing
5. **Pure Functions:** Business logic is deterministic and side-effect free
6. **Composition Over Inheritance:** Build complex UIs from simple components
7. **Explicit Over Implicit:** Clear imports and dependencies
8. **Colocation:** Keep related files together (tests with code)

---

## Benefits

1. **Testability:** Pure functions in modules can be tested without React
2. **Maintainability:** Clear separation of concerns
3. **Reusability:** Components and modules are decoupled
4. **Scalability:** Easy to add features without touching existing code
5. **Type Safety:** Module-scoped types prevent coupling
6. **Performance:** Zustand only re-renders components using changed state
7. **Developer Experience:** Clear structure aids onboarding
8. **Portability:** Modules can work in different frameworks
9. **Bundle Size:** Minimal overhead from state management

---

## File Naming Conventions

- **Components:** PascalCase (`PlayerList.tsx`, `AppHeader.tsx`)
- **Modules:** camelCase (`calculator.ts`, `players.ts`)
- **Types:** PascalCase for interfaces/types, camelCase for files (`types.ts`)
- **Tests:** Same as source file + `.test.ts` (`calculator.test.ts`)
- **Stores:** camelCase + "Slice" suffix (`playersSlice.ts`, `uiSlice.ts`)

---

## Dependencies

### Production
```bash
bun add zustand
```

### Development
All testing tools are built into Bun - no additional dependencies needed.

---

## Commands

```bash
# Development
bun run dev

# Testing
bun test                    # Run all tests
bun test --watch           # Watch mode
bun test --coverage        # Coverage report
bun test [file]            # Run specific test

# Build
bun run build              # Production build
bun run preview            # Preview production build

# Quality
bun run lint               # Run linter
```
