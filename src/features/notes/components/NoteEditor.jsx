import React, { useEffect, useMemo, useState } from "react";

// PUBLIC_INTERFACE
export default function NoteEditor({
  selectedNote,
  onCreate,
  onUpdate,
  onClearSelection
}) {
  /** Editor form for creating a new note or editing the selected one. */
  const isEditing = Boolean(selectedNote);

  const initialState = useMemo(() => {
    return {
      title: selectedNote?.title ?? "",
      content: selectedNote?.content ?? ""
    };
  }, [selectedNote]);

  const [title, setTitle] = useState(initialState.title);
  const [content, setContent] = useState(initialState.content);
  const [error, setError] = useState("");

  // Keep form in sync when selection changes.
  useEffect(() => {
    setTitle(initialState.title);
    setContent(initialState.content);
    setError("");
  }, [initialState]);

  function validate() {
    if (!title.trim()) {
      setError("Title is required.");
      return false;
    }
    setError("");
    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing) {
      onUpdate(selectedNote.id, { title: title.trim(), content });
    } else {
      onCreate({ title: title.trim(), content });
      setTitle("");
      setContent("");
    }
  }

  return (
    <div className="panel" aria-label="note editor panel">
      <div className="panelHeader">
        <h2>{isEditing ? "Edit note" : "New note"}</h2>
        {isEditing ? (
          <button
            type="button"
            className="button"
            onClick={onClearSelection}
            aria-label="clear selection"
          >
            New
          </button>
        ) : null}
      </div>

      <div className="panelBody">
        <form onSubmit={handleSubmit} aria-label="note form">
          <div className="row">
            <div>
              <label className="srOnly" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                className="input"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => {
                  if (error) validate();
                }}
              />
              {error ? <div className="errorText">{error}</div> : null}
              <div className="helpText">A non-empty title is required.</div>
            </div>
          </div>

          <div style={{ height: 10 }} />

          <div className="row">
            <div>
              <label className="srOnly" htmlFor="content">
                Content
              </label>
              <textarea
                id="content"
                className="textarea"
                placeholder="Write your note…"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="helpText">
                Tip: you can use the search box to filter by title or content.
              </div>
            </div>
          </div>

          <div style={{ height: 12 }} />

          <div className="actions">
            <button type="submit" className="button buttonPrimary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
