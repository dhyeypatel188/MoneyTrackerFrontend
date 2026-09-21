import { useState } from "react";
import { createExpense } from "../api/client";

const CATEGORIES = [
  "Food", "Transport", "Shopping", "Entertainment",
  "Health", "Utilities", "Travel", "Education", "Other",
];

export default function AddExpenseForm({ onAdded }) {
  const [form, setForm] = useState({
    amount: "",
    category: "Food",
    note: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createExpense({
        amount: parseFloat(form.amount),
        category: form.category,
        note: form.note || null,
        date: form.date,
      });
      setForm({ ...form, amount: "", note: "" });
      onAdded();
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((d) => d.msg).join(", "));
      } else {
        setError(detail || "Failed to add expense.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h2 className="form-title">➕ Add Expense</h2>

      <div className="form-row">
        <div className="field">
          <label htmlFor="amount">Amount (₹)</label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="date">Date</label>
        <input
          id="date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="note">Note (optional)</label>
        <input
          id="note"
          name="note"
          type="text"
          placeholder="What was this for?"
          value={form.note}
          onChange={handleChange}
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button
        id="submit-expense-btn"
        type="submit"
        className="btn-primary"
        disabled={loading}
      >
        {loading ? "Adding…" : "Add Expense"}
      </button>
    </form>
  );
}
