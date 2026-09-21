export default function InsightBanner({ insights }) {
  const flagged = insights.filter((i) => i.flagged);
  if (flagged.length === 0) return null;

  return (
    <div className="insight-banner" role="alert" aria-live="polite">
      <span className="insight-icon">⚠️</span>
      <div className="insight-content">
        <strong>Spending Alert</strong>
        <ul className="insight-list">
          {flagged.map((ins) => (
            <li key={ins.category}>
              <strong>{ins.category}</strong> is up{" "}
              <span className="spike-pct">+{ins.change_percent.toFixed(1)}%</span>{" "}
              vs last month
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
