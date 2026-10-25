* {
  box-sizing: border-box;
}

:root {
  font-family: Inter, 'Segoe UI', sans-serif;
  color: #e5ecf6;
  background: #06111b;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: dark;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html, body, #root {
  margin: 0;
  min-height: 100%;
  min-width: 100%;
  background:
    radial-gradient(circle at top, rgba(14, 116, 144, 0.28), transparent 35%),
    linear-gradient(180deg, #050d16, #091522);
}

body {
  min-height: 100vh;
}

button, input, textarea {
  font: inherit;
}

button {
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background: linear-gradient(135deg, #22c1f2, #4f46e5);
  color: #eafaff;
  padding: 0.8rem 1.1rem;
  font-weight: 700;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
}

button.secondary {
  background: rgba(148, 163, 184, 0.12);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

input, textarea {
  width: 100%;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 10px;
  padding: 0.7rem 0.8rem;
  color: #edf6ff;
}

textarea {
  resize: vertical;
}

.app-shell {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  min-height: 100vh;
}

.sidebar {
  background: rgba(9, 17, 29, 0.9);
  border-right: 1px solid rgba(125, 211, 252, 0.2);
  padding: 1.4rem 1rem;
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.brand-icon {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #22d3ee, #3b82f6);
  color: #06131f;
  display: grid;
  place-items: center;
  border-radius: 12px;
  font-weight: 900;
}

.brand-block strong,
.brand-block small {
  display: block;
}

.brand-block small {
  color: #8db4cc;
}

.nav {
  display: grid;
  gap: 0.5rem;
}

.nav-item {
  text-align: left;
  background: transparent;
  border: 1px solid transparent;
  color: #d5e5f6;
  opacity: 0.8;
}

.nav-item.active {
  background: rgba(34, 211, 238, 0.1);
  border-color: rgba(34, 211, 238, 0.4);
  opacity: 1;
}

.sidebar-card {
  margin-top: 1.4rem;
  padding: 1rem;
  border-radius: 16px;
  background: rgba(14, 116, 144, 0.08);
  border: 1px solid rgba(34, 211, 238, 0.22);
  display: grid;
  gap: 0.25rem;
}

.sidebar-card p,
.sidebar-card span {
  color: #9bb7cf;
}

.content-panel {
  padding: 1.5rem;
}

.panel-stack {
  display: grid;
  gap: 1.2rem;
}

.hero-card,
.panel,
.metric-card {
  background: rgba(10, 20, 32, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 18px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
}

.hero-card {
  padding: 1.4rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.hero-card h1 {
  margin: 0.2rem 0;
  font-size: clamp(2rem, 3vw, 3rem);
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.7rem;
  color: #7dd3fc;
  margin: 0;
}

.subtext {
  color: #a5bacd;
  max-width: 620px;
  margin: 0;
}

.hero-actions {
  display: flex;
  gap: 0.75rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: 1rem;
}

.metric-card {
  padding: 1rem 1.1rem;
  display: grid;
  gap: 0.25rem;
}

.metric-card span,
.metric-card small {
  color: #9ab2c8;
}

.metric-card strong {
  font-size: 1.6rem;
}

.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.panel {
  padding: 1.2rem;
}

.panel h3 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.status-list,
.recommendation-list {
  display: grid;
  gap: 0.8rem;
  padding: 0;
  margin: 0;
}

.status-list li,
.recommendation-list li {
  list-style: none;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  padding: 0.7rem 0.8rem;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148,163,184,0.12);
}

.status-list span {
  color: #9fb8c9;
}

.status-list strong {
  color: #ebf9ff;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(180px, 1fr));
  gap: 1rem;
}

.form-grid.compact {
  grid-template-columns: repeat(2, minmax(160px, 1fr));
}

.form-grid label {
  display: grid;
  gap: 0.4rem;
}

.form-grid label span {
  color: #a7bed2;
  font-size: 0.85rem;
}

.full-width {
  grid-column: 1 / -1;
}

.upload-row {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.viewer-surface {
  height: 380px;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(9,17,29,0.8), rgba(9,17,29,0.95));
  border: 1px solid rgba(148,163,184,0.2);
}

.info-box {
  margin-top: 1rem;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  background: rgba(22, 163, 74, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.warning {
  color: #f9c56b;
  margin-top: 0.5rem;
}

.planner-wrap {
  display: grid;
  gap: 1rem;
}

.planner-wrap svg {
  width: 100%;
  max-height: 340px;
  background: rgba(15, 23, 42, 0.7);
  border-radius: 16px;
  border: 1px solid rgba(148,163,184,0.14);
}

.roof-base {
  fill: rgba(96, 165, 250, 0.12);
  stroke: rgba(125, 211, 252, 0.7);
  stroke-width: 2;
}

.obstacle {
  fill: rgba(239, 68, 68, 0.28);
  stroke: rgba(248, 113, 113, 0.9);
  stroke-width: 1.5;
}

.zone {
  fill: rgba(52, 211, 153, 0.38);
  stroke: rgba(52, 211, 153, 0.9);
  stroke-width: 2;
}

.planner-labels text {
  fill: #dfeefc;
  font-size: 12px;
}

.planner-controls {
  display: grid;
  grid-template-columns: repeat(4, minmax(140px, 1fr));
  gap: 0.75rem;
}

.planner-controls label {
  display: grid;
  gap: 0.4rem;
}

.planner-controls span {
  font-size: 0.78rem;
  color: #9bb2c7;
}

.scenario-table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.8rem 0.7rem;
  border-bottom: 1px solid rgba(148,163,184,0.14);
  text-align: left;
}

th {
  color: #9ec6f3;
  font-weight: 700;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.report-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(240px, 1fr));
  gap: 1rem;
}

.report-block {
  min-height: 200px;
}

@media (max-width: 980px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    border-right: none;
    border-bottom: 1px solid rgba(125,211,252,0.2);
  }

  .metrics-grid,
  .two-column,
  .form-grid,
  .planner-controls,
  .report-grid {
    grid-template-columns: 1fr;
  }

  .hero-card,
  .report-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media print {
  body {
    background: white;
    color: black;
  }

  .sidebar,
  .nav,
  .hero-actions,
  button {
    display: none !important;
  }

  .app-shell {
    display: block;
  }

  .content-panel {
    padding: 0;
  }

  .panel,
  .metric-card,
  .hero-card {
    box-shadow: none;
    border: 1px solid #ced4da;
    background: white;
    color: black;
  }
}
