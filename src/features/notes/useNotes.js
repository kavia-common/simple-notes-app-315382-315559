import { useEffect, useMemo, useRef, useState } from "react";
import { loadNotes, saveNotes } from "./notesStorage.js";
import { makeNote } from "./noteModel.js";

// PUBLIC_INTERFACE
export function useNotes() {
  /**
   * Notes domain hook:
   * - Loads initial notes from localStorage
   * - Provides CRUD methods
   * - Persists on change
   * - Handles search filtering
   */
  const [notes, setNotes] = useState(() => loadNotes());
  const [selectedId, setSelectedId] = useState(() => (loadNotes()[0]?.id ?? null));
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(null);

  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    // Persist after every notes change.
    saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    // Ensure selectedId remains valid when notes change.
    if (selectedId && !notes.some((n) => n.id === selectedId)) {
      setSelectedId(notes[0]?.id ?? null);
    }
  }, [notes, selectedId]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    if (!q) return sorted;
    return sorted.filter((n) => {
      const hay = `${n.title}\n${n.content}`.toLowerCase();
      return hay.includes(q);
    });
  }, [notes, query]);

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId) ?? null,
    [notes, selectedId]
  );

  function showToast(message) {
    setToast(message);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToast(null), 1500);
  }

  // PUBLIC_INTERFACE
  function createNote({ title, content }) {
    /** Create a new note and select it. */
    const now = new Date().toISOString();
    const note = makeNote({ title, content, updatedAt: now });

    setNotes((prev) => [note, ...prev]);
    setSelectedId(note.id);
    showToast("Saved");
    return note;
  }

  // PUBLIC_INTERFACE
  function updateNote(id, { title, content }) {
    /** Update an existing note by id. */
    const now = new Date().toISOString();
    let updated = null;

    setNotes((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        updated = { ...n, title, content, updatedAt: now };
        return updated;
      })
    );

    showToast("Saved");
    return updated;
  }

  // PUBLIC_INTERFACE
  function deleteNote(id) {
    /** Delete a note by id. */
    setNotes((prev) => prev.filter((n) => n.id !== id));
    showToast("Deleted");
  }

  // PUBLIC_INTERFACE
  function selectNote(id) {
    /** Select a note for editing. */
    setSelectedId(id);
  }

  // PUBLIC_INTERFACE
  function setSearchQuery(nextQuery) {
    /** Set the search query used for filtering notes. */
    setQuery(nextQuery);
  }

  // PUBLIC_INTERFACE
  function clearSelection() {
    /** Clear current selection (useful if list is empty). */
    setSelectedId(null);
  }

  return {
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
  };
}
