/**
 * Note data model:
 * { id (uuid), title (string), content (string), updatedAt (ISO string) }
 */

// PUBLIC_INTERFACE
export function createNoteDraft() {
  /** Create an empty draft note object (not persisted). */
  return {
    id: cryptoRandomUuid(),
    title: "",
    content: "",
    updatedAt: new Date().toISOString()
  };
}

// PUBLIC_INTERFACE
export function makeNote({ id, title, content, updatedAt } = {}) {
  /** Construct a note object ensuring required fields exist. */
  return {
    id: id ?? cryptoRandomUuid(),
    title: String(title ?? ""),
    content: String(content ?? ""),
    updatedAt: updatedAt ?? new Date().toISOString()
  };
}

function cryptoRandomUuid() {
  // Prefer the browser's crypto.randomUUID() when available.
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  // Fallback (RFC4122-ish) - sufficient for local-only identifiers.
  // eslint-disable-next-line no-bitwise
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line no-bitwise
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
