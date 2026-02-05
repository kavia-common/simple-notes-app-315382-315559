import React from "react";

// PUBLIC_INTERFACE
export default function Header({ noteCount, query, onQueryChange, toast }) {
  /** App header with search input and save/delete feedback. */
  return (
    <header className="header">
      <h1>Simple Notes</h1>

      <div className="headerRight">
        {toast ? (
          <div className="toast" role="status" aria-live="polite">
            {toast}
          </div>
        ) : (
          <div className="badge" aria-label="note count">
            {noteCount} {noteCount === 1 ? "note" : "notes"}
          </div>
        )}

        <label className="srOnly" htmlFor="search">
          Search notes
        </label>
        <input
          id="search"
          className="input"
          style={{ minWidth: 220 }}
          placeholder="Search…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>
    </header>
  );
}
