import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NotesApp from "./NotesApp.jsx";
import { getStorageKey } from "./notesStorage.js";

describe("NotesApp CRUD", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("creates a note and persists to localStorage", async () => {
    const user = userEvent.setup();
    render(<NotesApp />);

    await user.type(screen.getByPlaceholderText("Title"), "My Note");
    await user.type(screen.getByPlaceholderText("Write your note…"), "Hello");
    await user.click(screen.getByRole("button", { name: /save/i }));

    // List shows the new note
    expect(screen.getByRole("list", { name: /notes list/i })).toBeInTheDocument();
    expect(screen.getByText("My Note")).toBeInTheDocument();

    // Persisted
    const stored = JSON.parse(localStorage.getItem(getStorageKey()));
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe("My Note");
    expect(stored[0].content).toBe("Hello");
    expect(stored[0].updatedAt).toMatch(/T/);
  });

  it("updates a note", async () => {
    const user = userEvent.setup();
    render(<NotesApp />);

    await user.type(screen.getByPlaceholderText("Title"), "First");
    await user.click(screen.getByRole("button", { name: /save/i }));

    // Select note in list to edit (click item)
    const item = screen.getByLabelText(/note first/i);
    await user.click(item);

    const titleInput = screen.getByPlaceholderText("Title");
    await user.clear(titleInput);
    await user.type(titleInput, "Updated");
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(screen.getByText("Updated")).toBeInTheDocument();
  });

  it("deletes a note", async () => {
    const user = userEvent.setup();
    render(<NotesApp />);

    await user.type(screen.getByPlaceholderText("Title"), "To Delete");
    await user.click(screen.getByRole("button", { name: /save/i }));

    // Accept confirm dialog
    const confirmSpy = window.confirm;
    window.confirm = () => true;

    const list = screen.getByRole("list", { name: /notes list/i });
    const noteRow = within(list).getByLabelText(/note to delete/i);
    await user.click(within(noteRow).getByRole("button", { name: /delete/i }));

    // Restore
    window.confirm = confirmSpy;

    expect(screen.queryByText("To Delete")).not.toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(getStorageKey()))).toHaveLength(0);
  });

  it("validates non-empty title", async () => {
    const user = userEvent.setup();
    render(<NotesApp />);

    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(screen.getByText("Title is required.")).toBeInTheDocument();
  });
});
