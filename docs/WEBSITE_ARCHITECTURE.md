# Inner Cosmos Website Architecture

This document provides an overview of the architectural patterns and solutions implemented in the Inner Cosmos website. It serves as a guide for developers who want to understand or build upon this codebase.

## Table of Contents
- [Project Structure](#project-structure)
- [Core Technologies](#core-technologies)
- [Key Architectural Patterns](#key-architectural-patterns)
- [State Management](#state-management)
- [Navigation System](#navigation-system)
- [UI/UX Solutions](#uiux-solutions)
- [Accessibility Features](#accessibility-features)
- [Development Workflow](#development-workflow)

## Project Structure

```
Inner-Cosmos/
├── frontend/               # React TypeScript application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux state management
│   │   ├── utils/        # Utility functions
│   │   └── App.tsx       # Main application component
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
├── backend/              # Python FastAPI backend
├── shared/               # Shared types between frontend/backend
└── docs/                 # Documentation
```

## Core Technologies

### Frontend Stack
- **React 18**: Component-based UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **Redux Toolkit**: State management
- **Tailwind CSS**: Utility-first CSS framework

### Backend Stack
- **Python**: Backend language
- **FastAPI**: Modern web framework
- **Uvicorn**: ASGI server

## Key Architectural Patterns

### 1. **Component Composition**

The application uses a hierarchical component structure:

```typescript
<App>
  <Layout>
    <Sidebar />
    <main>{children}</main>
    <Modals />
  </Layout>
</App>
```

### 2. **Custom Hooks Pattern**

Encapsulates complex logic in reusable hooks:

```typescript
// useKeyboardNavigation.ts
export function useKeyboardNavigation() {
  // Manages all keyboard interactions
  // Returns focus states and navigation logic
}

// useRandomQuote.ts
export function useRandomQuote() {
  // Fetches and manages quotes
  // Handles loading states
}
```

### 3. **Redux Store Architecture**

Organized by feature with Redux Toolkit:

```
store/
├── index.ts           # Store configuration
├── hooks.ts           # Typed hooks
└── slices/
    ├── uiSlice.ts     # UI state (sidebar, modals)
    └── navigationSlice.ts  # Navigation state
```

## State Management

### Global State (Redux)

Used for cross-component state:

```typescript
// UI State
interface UIState {
  sidebarVisible: boolean;
  soundEnabled: boolean;
  showControls: boolean;
  showSettings: boolean;
}

// Navigation State
interface NavigationState {
  projectsOpen: boolean;
  focusArea: 'sidebar' | 'main';
}
```

### Local State (useState)

Used for component-specific state:
- Form inputs
- Temporary UI states
- Animation states

### Session Storage

Used for temporary data between page navigations:
- Search terms
- Scroll positions

## Navigation System

### 1. **Keyboard Navigation**

Complete keyboard-only navigation system:

```typescript
// Key mappings
Tab         → Switch focus areas
↑↓          → Navigate vertically
←→          → Navigate horizontally / Expand-collapse
Enter       → Select item
Escape      → Close modals / Clear focus
Cmd+F       → Open search
Cmd+E       → Toggle sidebar
```

### 2. **Focus Management**

Three-tier focus system:
1. **Sidebar Navigation**: Menu items and projects
2. **Main Content**: Links and interactive elements
3. **Bottom Controls**: Action buttons

### 3. **Route Structure**

```
/                     → Home
/about               → About
/blog                → Blog
/contact             → Contact
/projects            → Projects overview
/projects/web-dev    → Web Development
/projects/ai-ml      → AI & ML
/projects/open-source → Open Source
/projects/research   → Research Papers
```

## UI/UX Solutions

### 1. **Responsive Sidebar**

- Collapsible with animation
- Persistent state across sessions
- Keyboard shortcut (Cmd+E)

### 2. **Modal System**

Centralized modal management:

```typescript
// Modal components
<ControlsModal />    // Keyboard shortcuts help
<SettingsModal />    // User preferences
<Search />          // Search interface
```

### 3. **Visual Feedback**

- Focus rings for keyboard navigation
- Hover states for interactive elements
- Loading states for async operations
- Highlight animations for search results

### 4. **Minimalist Design**

- Black and white color scheme
- Clean typography
- Subtle animations
- Clear visual hierarchy

## Accessibility Features

### 1. **Keyboard Navigation**

- Full keyboard operability
- No keyboard traps
- Logical tab order
- Visual focus indicators

### 2. **Search Functionality**

- Override browser search for better UX
- Direct navigation to text occurrences
- Context preview in results
- Highlight and scroll to matches

### 3. **Screen Reader Support**

- Semantic HTML structure
- Proper heading hierarchy
- ARIA labels where needed
- Descriptive link text

### 4. **Performance**

- Fast page loads with Vite
- Code splitting by route
- Optimized bundle size
- Lazy loading for modals

## Development Workflow

### 1. **Type Safety**

Full TypeScript coverage:

```typescript
// Typed Redux hooks
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Typed props
interface SidebarProps {
  focusedIndex: number;
  focusedProjectIndex: number;
  bottomButtonFocused: number;
}
```

### 2. **Component Organization**

```
components/
├── Layout.tsx         # Main layout wrapper
├── Sidebar.tsx        # Navigation sidebar
├── Search.tsx         # Search modal
├── SidebarToggle.tsx  # Toggle button
└── modals/           # Modal components
```

### 3. **Hot Module Replacement**

Vite provides instant updates during development:
- Component updates preserve state
- CSS changes apply immediately
- Fast refresh for React components

### 4. **Development Scripts**

```bash
npm run dev        # Start frontend and backend
npm run dev:frontend  # Frontend only
npm run dev:backend   # Backend only
```

## Best Practices Demonstrated

### 1. **Separation of Concerns**

- UI logic in components
- Business logic in hooks
- State management in Redux
- Utilities in separate files

### 2. **Reusability**

- Generic components (modals, buttons)
- Custom hooks for common patterns
- Shared types and interfaces
- Utility functions

### 3. **Performance**

- Minimal re-renders with Redux
- Memoization where appropriate
- Efficient DOM operations
- Lazy initialization

### 4. **Maintainability**

- Clear file organization
- Descriptive naming
- TypeScript for type safety
- Comprehensive documentation

## Extension Points

### Adding New Pages

1. Create page component in `pages/`
2. Add route in `App.tsx`
3. Update navigation in `Sidebar.tsx`
4. Add to search registry in `pageRegistry.ts`

### Adding New Features

1. Create feature slice in `store/slices/`
2. Add to store configuration
3. Create hooks for feature logic
4. Build UI components

### Styling Customization

1. Modify Tailwind config
2. Update global styles in `index.css`
3. Use Tailwind utilities in components
4. Maintain consistent design system

This architecture provides a solid foundation for building modern, accessible web applications with excellent developer experience and user experience. 