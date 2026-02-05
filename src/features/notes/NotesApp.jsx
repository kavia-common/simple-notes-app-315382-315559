import React from "react";
import Header from "./components/Header.jsx";
import NoteList from "./components/NoteList.jsx";
import NoteEditor from "./components/NoteEditor.jsx";
import { useNotes } from "./useNotes.js";

// PUBLIC_INTERFACE
export default function NotesApp() {
  /** Root feature component: coordinates list/editor/search and persistence. */
  const {
    notes,
    filteredNotes,
    selectedId,
    selectedNote,
    query,
    toast,
    createNote,
    updateNote,
    deleteNote,
    selectNote,
    setSearchQuery,
    clearSelection
  } = useNotes();

  return (
    <div className="container">
      <div className="appShell">
        <Header
          noteCount={notes.length}
          query={query}
          onQueryChange={setSearchQuery}
          toast={toast}
        />

        <div className="grid">
          <NoteList
            notes={filteredNotes}
            selectedId={selectedId}
            onSelect={selectNote}
            onDelete={(id) => {
              const target = notes.find((n) => n.id === id);
              const ok = window.confirm(
                `Delete "${target?.title ?? "this note"}"?`
              );
              if (ok) deleteNote(id);
            }}
          />

          <NoteEditor
            selectedNote={selectedNote}
            onCreate={createNote}
            onUpdate={updateNote}
            onClearSelection={clearSelection}
          />
        </div>

        <footer className="helpText" style={{ marginBottom: 6 }}>
          Offline-capable: all notes are stored locally in your browser (localStorage).
        </footer>
      </div>
    </div>
  );
}
