# Simple Notes App (React)

A lightweight, offline-capable notes app built as a single React frontend with browser `localStorage` persistence.

## Features

- List notes
- Create / edit / delete notes
- Search notes (filters by title + content)
- Persists to `localStorage` key: `notes:v1`
- Works fully offline (no backend)

## Data model

```json
{ "id": "uuid", "title": "string", "content": "string", "updatedAt": "ISO string" }
```

## Getting started

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (typically `http://localhost:5173`).

## Tests

```bash
npm test
```

## Lint / format

```bash
npm run lint
npm run format
```
