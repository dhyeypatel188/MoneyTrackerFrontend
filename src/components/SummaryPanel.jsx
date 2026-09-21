export default function SummaryPanel({ summary, loading }) {
  if (loading) {
    return (
      <div className="summary-panel">
        <h2 className="panel-title">📊 Summary</h2>
        <div className="skeleton-block" />
        <div className="skeleton-block" />
        <div className="skeleton-block" />
      </div>
    );
  }

  if (!summary) return null;

  const { total_spend, by_category, month_over_month } = summary;
  const mom = month_over_month;
  const momPct = mom.change_percent;
  const momSign = momPct >= 0 ? "+" : "";
  const momClass = momPct == null ? "" : momPct > 0 ? "mom-up" : "mom-down";

  return (
    <div className="summary-panel">
      <h2 className="panel-title">📊 Summary</h2>

      <div className="summary-total">
        <span className="summary-label">All-Time Total</span>
        <span className="summary-amount">₹{parseFloat(total_spend).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
      </div>

      <div className="summary-mom">
        <span className="summary-label">This Month</span>
        <span className="summary-amount">
          ₹{parseFloat(mom.current_month).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
        {momPct != null && (
          <span className={`mom-badge ${momClass}`}>
            {momSign}{momPct.toFixed(1)}% vs last month
          </span>
        )}
      </div>

      <div className="by-category">
        <h3 className="category-title">By Category</h3>
        {Object.keys(by_category).length === 0 ? (
          <p className="empty-msg">No expenses yet.</p>
        ) : (
          <ul className="category-list">
            {Object.entries(by_category)
              .sort(([, a], [, b]) => parseFloat(b) - parseFloat(a))
              .map(([cat, amt]) => (
                <li key={cat} className="category-item">
                  <span className="cat-name">{cat}</span>
                  <span className="cat-amt">₹{parseFloat(amt).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
