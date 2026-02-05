import { describe, expect, it, beforeEach } from "vitest";
import { clearNotes, getStorageKey, loadNotes, saveNotes } from "./notesStorage.js";

describe("notesStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns [] when empty", () => {
    expect(loadNotes()).toEqual([]);
  });

  it("saves and loads notes", () => {
    const notes = [
      {
        id: "a",
        title: "T1",
        content: "C1",
        updatedAt: "2026-01-01T00:00:00.000Z"
      }
    ];
    saveNotes(notes);
    expect(loadNotes()).toEqual(notes);
  });

  it("falls back to [] on corrupt JSON", () => {
    localStorage.setItem(getStorageKey(), "{not valid json");
    expect(loadNotes()).toEqual([]);
  });

  it("falls back to [] when JSON is not an array", () => {
    localStorage.setItem(getStorageKey(), JSON.stringify({ hello: "world" }));
    expect(loadNotes()).toEqual([]);
  });

  it("filters invalid entries", () => {
    localStorage.setItem(
      getStorageKey(),
      JSON.stringify([null, { id: 1 }, { id: "ok", title: "t" }])
    );
    expect(loadNotes()).toEqual([
      { id: "ok", title: "t", content: "", updatedAt: expect.any(String) }
    ]);
  });
});
