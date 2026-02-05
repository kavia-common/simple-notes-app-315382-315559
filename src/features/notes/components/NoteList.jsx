import React from "react";
import NoteItem from "./NoteItem.jsx";

// PUBLIC_INTERFACE
export default function NoteList({ notes, selectedId, onSelect, onDelete }) {
  /** List of notes with selection and delete button per note. */
  return (
    <div className="panel" aria-label="notes list panel">
      <div className="panelHeader">
        <h2>Notes</h2>
      </div>

      <div className="panelBody">
        {notes.length === 0 ? (
          <p className="helpText">No notes yet. Create one on the right.</p>
        ) : (
          <div className="list" role="list" aria-label="notes list">
            {notes.map((n) => (
              <NoteItem
                key={n.id}
                note={n}
                selected={n.id === selectedId}
                onSelect={() => onSelect(n.id)}
                onDelete={() => onDelete(n.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
