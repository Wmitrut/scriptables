# 🏟️ Football Game Tracker

A sleek iOS widget that keeps you updated on your favourite football team — live scores, upcoming fixtures, and recent results — all powered by the SofaScore API (no API key required).

> **Supports both Soccer ⚽ and NFL 🏈!**

## Features

- **🔴 Live Scores** — real-time score updates with match minute (soccer) or quarter (NFL)
- **📅 Upcoming Matches** — shows the next fixture with relative date (e.g. "Tomorrow at 16:00")
- **✅ Recent Results** — displays the last result with win/draw/loss badge
- **🎨 Beautiful UI** — dark gradient background with team crests and gold accents
- **⚡ Smart Priority** — automatically picks the most relevant game to display (Live → Today → Last Result → Next Match)
- **🌐 Multi-Sport** — switch between soccer and NFL with a single config change

## Preview

| Live                                           | Upcoming                     | Finished                      |
| ---------------------------------------------- | ---------------------------- | ----------------------------- |
| 🔴 AO VIVO – real-time score with match minute | VS — relative date countdown | Final score with result badge |

## Setup

1. Download [Scriptable](https://apps.apple.com/app/scriptable/id1405459188) from the App Store
2. Copy the contents of [`football-game-tracker.js`](football-game-tracker.js) into a new script
3. **Choose your sport** — set `SPORT` at the top of the script:
   ```js
   const SPORT = "soccer"; // or "nfl"
   ```
4. **Customize your team** — change `TEAM_ID` to your team's [SofaScore](https://sofascore.com) ID:

   ```js
   // Soccer examples
   const TEAM_ID = 5926; // Grêmio 🇧🇷
   const TEAM_ID = 2817; // Barcelona 🇪🇸
   const TEAM_ID = 17; // Manchester United 🏴󠁧󠁢󠁥󠁮󠁧󠁿

   // NFL examples
   const TEAM_ID = 4388; // Kansas City Chiefs
   const TEAM_ID = 4389; // San Francisco 49ers
   ```

5. Add a **medium-sized** Scriptable widget to your Home Screen
6. Long-press the widget → Edit Widget → select the script

## Finding Your Team ID

1. Go to [sofascore.com](https://www.sofascore.com)
2. Search for your team and open the team page
3. The team ID is the number in the URL:
   - Soccer: `sofascore.com/team/football/team-name/{TEAM_ID}`
   - NFL: `sofascore.com/team/american-football/team-name/{TEAM_ID}`

## Sport Differences

| Feature        | Soccer ⚽                   | NFL 🏈                 |
| -------------- | --------------------------- | ---------------------- |
| Live indicator | Match minute (e.g. `⏱ 72'`) | Quarter (e.g. `🏈 Q3`) |
| Labels         | Portuguese (pt-BR)          | English                |
| Result badge   | Vitória / Empate / Derrota  | Win / Tie / Loss       |

## Customization

You can adjust the widget's appearance by modifying the color constants at the top of the script:

```js
const BG_COLOR_DARK = new Color("#0a1628"); // Gradient start
const BG_COLOR_BLUE = new Color("#0d3b8c"); // Gradient end
const GOLD = new Color("#f5c800"); // Competition label
const WHITE = new Color("#ffffff"); // Text color
const GRAY = new Color("#aaaaaa"); // Secondary text
```
