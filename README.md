# March Time Calculator

A React application to calculate optimal start times for players to arrive at their destination in a specific order with 1-second intervals between arrivals.

## Features

- Add players with their names and march times (in seconds)
- Reorder players using up/down arrows to set the desired arrival order
- Calculate start times automatically
- Visual results showing when each player should start and when they'll arrive

## How It Works

The application calculates start times based on the principle that:
1. Players should arrive in the order you specify
2. Each player should arrive exactly 1 second after the previous player
3. All players should start at or after time 00:00

**Algorithm:**
- For each player in position `i` (starting from 0) with march time `M`:
  - They should arrive at time `A + i` (where A is the first player's arrival time)
  - They should start at time `(A + i) - M`
- The first player's arrival time `A` is calculated as: `max(M₀ - 0, M₁ - 1, M₂ - 2, ...)`

## Example

If you have players:
1. John Snow - 46 sec
2. Peter Griffin - 50 sec
3. Naruto - 48 sec
4. Gojo - 45 sec

The calculator will determine:
- Peter Griffin starts at 00:00 (arrives at 00:50)
- Naruto starts at 00:03 (arrives at 00:51)
- John Snow starts at 00:03 (arrives at 00:49)
- Gojo starts at 00:07 (arrives at 00:52)

So John arrives first, then Peter (+1 sec), then Naruto (+1 sec), then Gojo (+1 sec).

## Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The application will be available at http://localhost:5173/

## Usage

1. Enter a player name and their march time in seconds
2. Click "Add Player" to add them to the list
3. Use the up/down arrows to reorder players (this sets the arrival order)
4. Click "Calculate Start Times" to see when each player should start
5. The results show players sorted by start time (who starts first, second, etc.)
