import { useState, useEffect, useCallback } from "react";
import AddExpenseForm from "./components/AddExpenseForm";
import SummaryPanel from "./components/SummaryPanel";
import FilterBar from "./components/FilterBar";
import ExpenseList from "./components/ExpenseList";
import InsightBanner from "./components/InsightBanner";
import AuthCard from "./components/AuthCard";
import {
  listExpenses,
  getSummary,
  getMe,
  getToken,
  removeToken,
} from "./api/client";
import "./App.css";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState("");

  // Check existing session on load
  useEffect(() => {
    const token = getToken();
    if (token) {
      getMe()
        .then((res) => {
          setCurrentUser(res.data);
        })
        .catch(() => {
          removeToken();
          setCurrentUser(null);
        })
        .finally(() => {
          setAuthChecking(false);
        });
    } else {
      setAuthChecking(false);
    }
  }, []);

  const fetchExpenses = useCallback(async (activeFilters = {}) => {
    setLoadingExpenses(true);
    setError("");
    try {
      const params = Object.fromEntries(
        Object.entries(activeFilters).filter(([, v]) => v !== "")
      );
      const res = await listExpenses(params);
      setExpenses(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        removeToken();
        setCurrentUser(null);
        setError("Session expired. Please log in again.");
      } else {
        setError("Could not load expenses. Is the backend running?");
      }
    } finally {
      setLoadingExpenses(false);
    }
  }, []);

  const fetchSummary = useCallback(async () => {
    setLoadingSummary(true);
    try {
      const res = await getSummary();
      setSummary(res.data);
    } catch {
      // summary errors are non-critical
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  // Whenever user logs in or is confirmed, load expenses and summary
  useEffect(() => {
    if (currentUser) {
      fetchExpenses(filters);
      fetchSummary();
    }
  }, [currentUser, fetchExpenses, fetchSummary, filters]);

  const handleAdded = () => {
    fetchExpenses(filters);
    fetchSummary();
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    fetchExpenses(newFilters);
  };

  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    setError("");
  };

  const handleLogout = () => {
    removeToken();
    setCurrentUser(null);
    setExpenses([]);
    setSummary(null);
  };

  if (authChecking) {
    return (
      <div className="auth-loading-screen">
        <div className="spinner"></div>
        <p>Connecting to Spend Tracker...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="logo">
              <span className="logo-icon">💸</span>
              <h1>Spend Tracker</h1>
            </div>
            <p className="header-sub">Track your expenses. Understand your spending.</p>
          </div>

          {currentUser && (
            <div className="header-user-nav">
              <div className="user-badge">
                <span className="user-icon">👤</span>
                <span className="user-name">{currentUser.username}</span>
              </div>
              <button
                type="button"
                className="btn-logout"
                onClick={handleLogout}
                title="Log out of Spend Tracker"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        {!currentUser ? (
          <AuthCard onAuthSuccess={handleAuthSuccess} />
        ) : (
          <>
            {error && (
              <div className="error-banner" role="alert">
                ⚠️ {error}
              </div>
            )}

            {summary && summary.insights && (
              <InsightBanner insights={summary.insights} />
            )}

            <div className="content-grid">
              <aside className="left-col">
                <AddExpenseForm onAdded={handleAdded} />
                <SummaryPanel summary={summary} loading={loadingSummary} />
              </aside>

              <section className="right-col">
                <FilterBar onFilter={handleFilter} />
                <ExpenseList expenses={expenses} loading={loadingExpenses} />
              </section>
            </div>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Spend Tracker · Built with FastAPI & React</p>
      </footer>
    </div>
  );
}
