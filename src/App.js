import { useEffect, useState } from "react";
import "./App.css";

const EXAM_START = new Date(2026, 5, 3, 8, 15, 0);
const RESULTS_AT = new Date(2026, 5, 3, 12, 0, 0);

function getPhase(now) {
  if (now < EXAM_START) return "before";
  if (now < RESULTS_AT) return "during";
  return "after";
}

function getCountdownTarget(phase) {
  if (phase === "before") return EXAM_START;
  if (phase === "during") return RESULTS_AT;
  return null;
}

function getTimeLeft(target, now) {
  const diff = Math.max(0, target - now);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { hours, minutes, seconds, total: diff };
}

function pad(n) {
  return String(n).padStart(2, "0");
}

const PHASE_CONTENT = {
  before: {
    label: "Do státnic zbývá",
    sublabel: "3. června 2026 · 8:15",
    emoji: "📚",
  },
  during: {
    label: "Do výsledků zbývá",
    sublabel: "3. června 2026 · 12:00",
    emoji: "⏳",
  },
  after: {
    label: "Výsledky jsou venku!",
    sublabel: "Držíme palce, Davide 🎓",
    emoji: "🎉",
  },
};

function App() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const phase = getPhase(now);
  const content = PHASE_CONTENT[phase];
  const target = getCountdownTarget(phase);
  const left = target ? getTimeLeft(target, now) : null;

  return (
    <div className="App">
      <div className="glow" aria-hidden="true" />
      <main className="card">
        <p className="eyebrow">Státnice Davida</p>
        <span className="emoji" role="img" aria-hidden="true">
          {content.emoji}
        </span>
        <h1 className="title">{content.label}</h1>
        <p className="sublabel">{content.sublabel}</p>

        {left && left.total > 0 ? (
          <div className="countdown" aria-live="polite">
            <TimeBlock value={left.hours} unit="hodin" />
            <span className="separator">:</span>
            <TimeBlock value={left.minutes} unit="minut" />
            <span className="separator">:</span>
            <TimeBlock value={left.seconds} unit="sekund" />
          </div>
        ) : phase === "after" ? (
          <p className="done-message">Už víme. Teď už jen oslava.</p>
        ) : (
          <p className="done-message">Právě teď!</p>
        )}

        <Timeline phase={phase} />
      </main>
    </div>
  );
}

function TimeBlock({ value, unit }) {
  return (
    <div className="time-block">
      <span className="time-value">{pad(value)}</span>
      <span className="time-unit">{unit}</span>
    </div>
  );
}

function Timeline({ phase }) {
  const steps = [
    {
      id: "before",
      time: "8:15",
      text: "Začátek státnic",
      active: phase === "before",
    },
    {
      id: "during",
      time: "8:15–12:00",
      text: "Čekáme na výsledek",
      active: phase === "during",
    },
    { id: "after", time: "12:00", text: "Výsledky", active: phase === "after" },
  ];

  return (
    <ol className="timeline">
      {steps.map((step) => (
        <li key={step.id} className={step.active ? "active" : ""}>
          <span className="timeline-time">{step.time}</span>
          <span className="timeline-text">{step.text}</span>
        </li>
      ))}
    </ol>
  );
}

export default App;
