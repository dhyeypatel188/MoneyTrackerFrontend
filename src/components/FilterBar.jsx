import { useState } from "react";

const CATEGORIES = [
  "", "Food", "Transport", "Shopping", "Entertainment",
  "Health", "Utilities", "Travel", "Education", "Other",
];

export default function FilterBar({ onFilter }) {
  const [filters, setFilters] = useState({
    category: "",
    from_date: "",
    to_date: "",
  });

  const handleChange = (e) => {
    const next = { ...filters, [e.target.name]: e.target.value };
    setFilters(next);
    onFilter(next);
  };

  const handleClear = () => {
    const cleared = { category: "", from_date: "", to_date: "" };
    setFilters(cleared);
    onFilter(cleared);
  };

  return (
    <div className="filter-bar">
      <span className="filter-label">🔍 Filter:</span>

      <select
        id="filter-category"
        name="category"
        value={filters.category}
        onChange={handleChange}
        className="filter-input"
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c === "" ? "All categories" : c}</option>
        ))}
      </select>

      <input
        id="filter-from-date"
        name="from_date"
        type="date"
        value={filters.from_date}
        onChange={handleChange}
        className="filter-input"
        placeholder="From date"
      />

      <input
        id="filter-to-date"
        name="to_date"
        type="date"
        value={filters.to_date}
        onChange={handleChange}
        className="filter-input"
        placeholder="To date"
      />

      <button
        id="clear-filters-btn"
        type="button"
        className="btn-ghost"
        onClick={handleClear}
      >
        Clear
      </button>
    </div>
  );
}
