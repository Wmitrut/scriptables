# 🏟️ Football Game Tracker

A sleek iOS widget that keeps you updated on your favourite football team — live scores, upcoming fixtures, and recent results — all powered by the SofaScore API (no API key required).

## Features

- **🔴 Live Scores** — real-time score updates with match minute indicator
- **📅 Upcoming Matches** — shows the next fixture with relative date (e.g. "Tomorrow at 16:00")
- **✅ Recent Results** — displays the last result with win/draw/loss badge
- **🎨 Beautiful UI** — dark gradient background with team crests and gold accents
- **⚡ Smart Priority** — automatically picks the most relevant game to display (Live → Today → Last Result → Next Match)

## Preview

| Live                                           | Upcoming                     | Finished                      |
| ---------------------------------------------- | ---------------------------- | ----------------------------- |
| 🔴 AO VIVO – real-time score with match minute | VS — relative date countdown | Final score with result badge |

## Setup

1. Download [Scriptable](https://apps.apple.com/app/scriptable/id1405459188) from the App Store
2. Copy the contents of [`football-game-tracker.js`](football-game-tracker.js) into a new script
3. **Customize your team** — change `TEAM_ID` on line 6 to your team's [SofaScore](https://sofascore.com) ID:
   ```js
   const TEAM_ID = 5926; // Default: Grêmio 🇧🇷
   ```
4. Add a **medium-sized** Scriptable widget to your Home Screen
5. Long-press the widget → Edit Widget → select the script

## Finding Your Team ID

1. Go to [sofascore.com](https://www.sofascore.com)
2. Search for your team and open the team page
3. The team ID is the number in the URL: `sofascore.com/team/football/team-name/{TEAM_ID}`

## Customization

You can adjust the widget's appearance by modifying the color constants at the top of the script:

```js
const BG_COLOR_DARK = new Color("#0a1628"); // Gradient start
const BG_COLOR_BLUE = new Color("#0d3b8c"); // Gradient end
const GOLD = new Color("#f5c800"); // Competition label
const WHITE = new Color("#ffffff"); // Text color
const GRAY = new Color("#aaaaaa"); // Secondary text
```
