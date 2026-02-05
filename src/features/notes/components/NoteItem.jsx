import React from "react";

function formatUpdatedAt(isoString) {
  try {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return "—";
  }
}

// PUBLIC_INTERFACE
export default function NoteItem({ note, selected, onSelect, onDelete }) {
  /** One note row in the list, click to select, button to delete. */
  const snippet =
    note.content.trim().length > 0 ? note.content.trim() : "No content";

  return (
    <div
      className={`noteItem ${selected ? "noteItemSelected" : ""}`}
      role="listitem"
      tabIndex={0}
      aria-label={`note ${note.title}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
    >
      <div className="noteTitleRow">
        <p className="noteTitle">{note.title || "(Untitled)"}</p>
        <span className="noteMeta">{formatUpdatedAt(note.updatedAt)}</span>
      </div>

      <p className="noteSnippet">{snippet}</p>

      <div className="actions" style={{ justifyContent: "flex-start" }}>
        <button
          type="button"
          className="button buttonDanger"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label={`delete ${note.title}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
