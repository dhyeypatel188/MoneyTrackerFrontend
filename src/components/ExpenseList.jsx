export default function ExpenseList({ expenses, loading }) {
  if (loading) {
    return (
      <div className="expense-list-wrap">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton-row" />
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="expense-list-wrap">
        <p className="empty-msg">No expenses found. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="expense-list-wrap">
      <table className="expense-table" aria-label="Expenses list">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Note</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id} className="expense-row">
              <td className="date-cell">{exp.date}</td>
              <td>
                <span className="category-badge">{exp.category}</span>
              </td>
              <td className="note-cell">{exp.note || "—"}</td>
              <td className="amount-cell text-right">
                ₹{parseFloat(exp.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
