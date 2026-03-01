// ============================================
// 🏟️ Football Game Tracker - Scriptable App
// Supports Soccer ⚽ and NFL 🏈
// Uses SofaScore unofficial API (no key needed)
// ============================================

// ─── Configuration ──────────────────────────────────────────
// SPORT: "soccer" or "nfl"
const SPORT = "soccer";

// TEAM_ID: Your team's SofaScore ID
// Soccer examples: 5926 (Grêmio), 2817 (Barcelona), 17 (Manchester United)
// NFL examples:    4388 (Kansas City Chiefs), 4389 (San Francisco 49ers)
const TEAM_ID = 5926;

const TEAM_SHIELD = `https://api.sofascore.app/api/v1/team/${TEAM_ID}/image`;
const BG_COLOR_DARK = new Color("#0a1628");
const BG_COLOR_BLUE = new Color("#0d3b8c");
const GOLD = new Color("#f5c800");
const WHITE = new Color("#ffffff");
const GRAY = new Color("#aaaaaa");

// ─── Sport-specific labels ───────────────────────────────────
const LABELS =
  SPORT === "nfl"
    ? {
        live: "🔴 LIVE",
        finished: "Final",
        win: "✅ Win!",
        draw: "🤝 Tie",
        loss: "❌ Loss",
        today: "🏈 Game day!",
        noGame: "No game found 😢",
        vs: "VS",
      }
    : {
        live: "🔴 AO VIVO",
        finished: "Encerrado",
        win: "✅ Vitória!",
        draw: "🤝 Empate",
        loss: "❌ Derrota",
        today: "🎽 Jogo hoje!",
        noGame: "Nenhum jogo encontrado 😢",
        vs: "VS",
      };

// ─── Fetch last + next events ───────────────────────────────
async function fetchTeamEvents() {
  const [lastRes, nextRes] = await Promise.all([
    new Request(
      `https://api.sofascore.app/api/v1/team/${TEAM_ID}/events/last/0`,
    ).loadJSON(),
    new Request(
      `https://api.sofascore.app/api/v1/team/${TEAM_ID}/events/next/0`,
    ).loadJSON(),
  ]);

  const last = lastRes?.events ?? [];
  const next = nextRes?.events ?? [];
  return { last, next };
}

// ─── Load image from URL ─────────────────────────────────────
async function loadImg(url) {
  try {
    return await new Request(url).loadImage();
  } catch {
    return null;
  }
}

// ─── Determine game state ────────────────────────────────────
function getGameState(event) {
  const status = event.status?.type;
  if (status === "inprogress") return "LIVE";
  if (status === "finished") return "FINISHED";
  return "UPCOMING";
}

// ─── Format relative date ────────────────────────────────────
function formatRelativeDate(timestamp) {
  const now = new Date();
  const gameDate = new Date(timestamp * 1000);
  const diffMs = gameDate - now;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const timeStr = gameDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = gameDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });

  if (diffDays === 0) return `Hoje às ${timeStr}`;
  if (diffDays === 1) return `Amanhã às ${timeStr}`;
  if (diffDays > 1 && diffDays <= 7) return `Em ${diffDays} dias — ${dateStr}`;
  return dateStr;
}

function isToday(timestamp) {
  const now = new Date();
  const gameDate = new Date(timestamp * 1000);
  return (
    now.getFullYear() === gameDate.getFullYear() &&
    now.getMonth() === gameDate.getMonth() &&
    now.getDate() === gameDate.getDate()
  );
}

// ─── Build Widget ────────────────────────────────────────────
async function buildWidget(event, state) {
  const isTeamHome = event.homeTeam.id === TEAM_ID;
  const team = isTeamHome ? event.homeTeam : event.awayTeam;
  const adversary = isTeamHome ? event.awayTeam : event.homeTeam;
  const teamScore = isTeamHome
    ? event.homeScore?.current
    : event.awayScore?.current;
  const adversaryScore = isTeamHome
    ? event.awayScore?.current
    : event.homeScore?.current;

  const [teamImg, adversaryImg] = await Promise.all([
    loadImg(`https://api.sofascore.app/api/v1/team/${team.id}/image`),
    loadImg(`https://api.sofascore.app/api/v1/team/${adversary.id}/image`),
  ]);

  const widget = new ListWidget();
  widget.backgroundGradient = buildGradient();
  widget.setPadding(12, 14, 12, 14);

  // ── Competition label ──
  const compLabel = widget.addText(
    (event.tournament?.name ?? "Competição").toUpperCase(),
  );
  compLabel.font = Font.boldSystemFont(9);
  compLabel.textColor = GOLD;
  compLabel.lineLimit = 1;

  widget.addSpacer(6);

  // ── Teams row ──
  const row = widget.addStack();
  row.layoutHorizontally();
  row.centerAlignContent();

  // Team side
  addTeamColumn(row, teamImg, team.shortName ?? team.name);

  row.addSpacer();

  // Center: score / time / VS
  const center = row.addStack();
  center.layoutVertically();
  center.centerAlignContent();

  if (state === "LIVE") {
    addScoreCenter(center, teamScore, adversaryScore, LABELS.live);
  } else if (state === "FINISHED") {
    addScoreCenter(center, teamScore, adversaryScore, LABELS.finished);
  } else {
    // UPCOMING
    const vsText = center.addText("VS");
    vsText.font = Font.boldSystemFont(20);
    vsText.textColor = WHITE;
    center.addSpacer(4);
    const timeText = center.addText(formatRelativeDate(event.startTimestamp));
    timeText.font = Font.systemFont(9);
    timeText.textColor = GRAY;
    timeText.centerAlignText();
  }

  row.addSpacer();

  // Adversary side
  addTeamColumn(row, adversaryImg, adversary.shortName ?? adversary.name);

  widget.addSpacer(8);

  // ── Bottom status bar ──
  if (state === "LIVE") {
    let pillText;
    if (SPORT === "nfl") {
      const quarter = event.time?.period ?? "?";
      pillText = `🏈 Q${quarter}`;
    } else {
      const minute = event.time?.currentPeriodStartTimestamp
        ? Math.floor(
            (Date.now() / 1000 - event.time.currentPeriodStartTimestamp) / 60,
          )
        : "?";
      pillText = `⏱ ${minute}'`;
    }
    addBottomPill(widget, pillText, new Color("#cc0000"));
  } else if (state === "UPCOMING" && isToday(event.startTimestamp)) {
    addBottomPill(widget, LABELS.today, new Color("#1a5c2a"));
  } else if (state === "FINISHED") {
    const won = teamScore > adversaryScore;
    const drew = teamScore === adversaryScore;
    const label = won ? LABELS.win : drew ? LABELS.draw : LABELS.loss;
    const color = won
      ? new Color("#1a5c2a")
      : drew
        ? new Color("#555")
        : new Color("#7a1010");
    addBottomPill(widget, label, color);
  }

  return widget;
}

// ─── Helpers ─────────────────────────────────────────────────
function buildGradient() {
  const g = new LinearGradient();
  g.colors = [BG_COLOR_DARK, BG_COLOR_BLUE];
  g.locations = [0, 1];
  g.startPoint = new Point(0, 0);
  g.endPoint = new Point(1, 1);
  return g;
}

function addTeamColumn(stack, img, name) {
  const col = stack.addStack();
  col.layoutVertically();
  col.centerAlignContent();

  if (img) {
    const imgWidget = col.addImage(img);
    imgWidget.imageSize = new Size(44, 44);
    imgWidget.centerAlignImage();
  } else {
    const placeholder = col.addText("⚽");
    placeholder.font = Font.systemFont(36);
    placeholder.centerAlignText();
  }

  col.addSpacer(4);
  const nameText = col.addText(name);
  nameText.font = Font.boldSystemFont(10);
  nameText.textColor = WHITE;
  nameText.lineLimit = 1;
  nameText.centerAlignText();
}

function addScoreCenter(stack, s1, s2, label) {
  const scoreText = stack.addText(`${s1 ?? 0}  –  ${s2 ?? 0}`);
  scoreText.font = Font.boldRoundedSystemFont(26);
  scoreText.textColor = WHITE;
  scoreText.centerAlignText();

  stack.addSpacer(2);
  const lbl = stack.addText(label);
  lbl.font = Font.systemFont(9);
  lbl.textColor = GRAY;
  lbl.centerAlignText();
}

function addBottomPill(widget, text, bgColor) {
  const pill = widget.addStack();
  pill.backgroundColor = bgColor;
  pill.cornerRadius = 8;
  pill.setPadding(3, 10, 3, 10);
  pill.centerAlignContent();

  const t = pill.addText(text);
  t.font = Font.boldSystemFont(10);
  t.textColor = WHITE;
  t.centerAlignText();
}

// ─── Main ─────────────────────────────────────────────────────
async function main() {
  const { last, next } = await fetchTeamEvents();

  // Pick the most relevant event
  let event = null;
  let state = "UPCOMING";

  // Check if there's a live game
  const live = [...last, ...next].find((e) => e.status?.type === "inprogress");
  if (live) {
    event = live;
    state = "LIVE";
  } else {
    // Check if next game is today
    if (next.length > 0 && isToday(next[0].startTimestamp)) {
      event = next[0];
      state = "UPCOMING";
    } else if (last.length > 0) {
      // Show last finished game
      event = last[last.length - 1];
      state = "FINISHED";
    } else if (next.length > 0) {
      // Show next upcoming
      event = next[0];
      state = "UPCOMING";
    }
  }

  if (!event) {
    const w = new ListWidget();
    w.addText(LABELS.noGame).textColor = WHITE;
    Script.setWidget(w);
    return;
  }

  const widget = await buildWidget(event, state);

  if (config.runsInWidget) {
    Script.setWidget(widget);
  } else {
    widget.presentMedium();
  }

  Script.complete();
}

await main();
