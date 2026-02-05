const STORAGE_KEY = "notes:v1";

/**
 * Storage format:
 * localStorage[STORAGE_KEY] = JSON.stringify(Note[])
 */

// PUBLIC_INTERFACE
export function loadNotes() {
  /** Load notes from localStorage. If corrupt/unexpected, return empty array. */
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Validate minimal shape; drop invalid rows.
    return parsed
      .filter((n) => n && typeof n === "object")
      .filter((n) => typeof n.id === "string" && typeof n.title === "string")
      .map((n) => ({
        id: n.id,
        title: String(n.title ?? ""),
        content: String(n.content ?? ""),
        updatedAt:
          typeof n.updatedAt === "string" ? n.updatedAt : new Date().toISOString()
      }));
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
export function saveNotes(notes) {
  /** Save notes array to localStorage using JSON serialization. */
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes ?? []));
}

// PUBLIC_INTERFACE
export function clearNotes() {
  /** Clear all notes from localStorage (used primarily for tests). */
  localStorage.removeItem(STORAGE_KEY);
}

// PUBLIC_INTERFACE
export function getStorageKey() {
  /** Expose storage key for tests/diagnostics. */
  return STORAGE_KEY;
}
