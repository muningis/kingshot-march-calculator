# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React + TypeScript application that calculates optimal start times for players to arrive at their destination in a specific order with 1-second intervals between arrivals. This is a gaming/strategy tool (possibly for games like Rise of Kingdoms or similar march-based games). Built with modern tooling: Vite, Tailwind CSS, shadcn/ui, and Bun.

## Development Commands

```bash
# Start development server (runs on http://localhost:5173/)
bun run dev

# Build for production
bun run build

# Lint code
bun run lint

# Preview production build
bun run preview

# Add shadcn/ui components
bunx shadcn@latest add [component-name]

# Install dependencies
bun install
```

## Tech Stack

- **Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 7.2.4
- **Package Manager**: Bun 1.2.9
- **Styling**: Tailwind CSS 4.1.17
- **UI Components**: shadcn/ui (Button, Input, Card, Badge)
- **Icons**: lucide-react
- **Linting**: ESLint

## Architecture

Single-page React application with TypeScript. Component-based architecture using shadcn/ui for UI primitives.

### Main Component Structure

- **src/App.tsx**: Main application component containing all state management and calculation logic
  - State managed with React's useState hook with full TypeScript types
  - Core algorithm calculates start times based on march times and arrival order
  - Players can be reordered to change arrival sequence
  - Uses shadcn/ui components (Button, Input, Card, Badge) with Tailwind CSS styling

### Core Algorithm

The start time calculation (in `App.tsx:52-70`) implements this logic:
- Each player should arrive exactly 1 second after the previous player in the list
- All start times must be non-negative (at or after 00:00)
- The minimum arrival time for the first player is: `max(marchTime[i] - i)` across all players
- For player at position `i`:
  - Arrival time = `minArrivalTime + i`
  - Start time = `arrivalTime - marchTime[i]`

## File Structure

```
src/
├── components/
│   └── ui/              - shadcn/ui components (Button, Input, Card, Badge)
├── lib/
│   └── utils.ts         - Utility functions (cn for class merging)
├── types/
│   └── index.ts         - TypeScript type definitions (Player, Result, MoveDirection)
├── App.tsx              - Main component with all logic
├── main.tsx             - React entry point
└── index.css            - Global styles + Tailwind directives

Root config files:
├── tsconfig.json        - TypeScript configuration
├── tailwind.config.js   - Tailwind CSS configuration
├── components.json      - shadcn/ui configuration
├── vite.config.ts       - Vite configuration
└── bun.lock             - Bun lockfile
```

## TypeScript Types

- **Player**: `{ id: number, name: string, marchTime: number }`
- **Result**: `{ name: string, marchTime: number, startTime: number, arrivalTime: number, order: number }`
- **MoveDirection**: `'up' | 'down'`

## Design System: "Slate & Sapphire"

Modern, professional theme with excellent contrast:

**Colors**:
- Background: Soft slate gradient (from-slate-50 to-slate-100)
- Primary Actions: Vibrant blue (blue-600) - "Add Player" button
- Secondary Actions: Indigo (indigo-600) - "Calculate" button
- Destructive: Rose (rose-600) - Remove actions
- Success/Info: Emerald (emerald-600) - March time badges
- Cards: Pure white with subtle shadows
- Text: Slate scale (slate-900 for headings, slate-600 for body)

**Key Tailwind Classes**:
- Rounded corners: `rounded-lg` (0.75rem radius)
- Shadows: `shadow-lg` for main container, `shadow-md` for hover states
- Transitions: `transition-all` for smooth interactions
- Grid: `grid grid-cols-1 md:grid-cols-2` for responsive 2-column layout

## Key Functions

- `calculateStartTimes()` - Core algorithm implementation at src/App.tsx:52
- `formatTime(seconds)` - Time formatting utility at src/App.tsx:47
- `movePlayer(index, direction)` - Player reordering logic at src/App.tsx:34
- `addPlayer()` - Form submission handler at src/App.tsx:17
- `removePlayer()` - Player removal handler at src/App.tsx:30

## shadcn/ui Components Used

- **Button**: Primary actions (Add Player), secondary (Calculate), destructive (Remove), ghost (Up/Down)
- **Input**: Form inputs for player name and march time
- **Card**: Section containers with CardHeader, CardTitle, CardDescription, CardContent
- **Badge**: March time display with custom emerald styling
- **Icons**: ArrowUp, ArrowDown, X, Calculator from lucide-react
