"use client";

import { useEffect, useMemo, useState } from "react";
import NoteItem from "./note-item";

const STORAGE_KEY = "little-notes-v1";

function readNotes() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [duplicate, setDuplicate] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setNotes(readNotes());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes, ready]);

  useEffect(() => {
    const normalizedTitle = title.trim().toLocaleLowerCase();
    const normalizedDescription = description.trim().toLocaleLowerCase();
    setDuplicate(Boolean(normalizedTitle) && notes.some((note) =>
      note.id !== editingId &&
      note.title.trim().toLocaleLowerCase() === normalizedTitle &&
      note.description.trim().toLocaleLowerCase() === normalizedDescription
    ));
  }, [title, description, notes, editingId]);

  const visibleNotes = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return [...notes]
      .filter((note) => !query || `${note.title} ${note.description}`.toLocaleLowerCase().includes(query))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, search]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setEditingId(null);
  }

  function saveNote(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    if (!cleanTitle || !cleanDescription || duplicate) return;

    const now = Date.now();
    if (editingId) {
      setNotes((current) => current.map((note) => note.id === editingId
        ? { ...note, title: cleanTitle, description: cleanDescription, updatedAt: now }
        : note));
    } else {
      setNotes((current) => [{ id: `${now}-${Math.random().toString(36).slice(2, 8)}`, title: cleanTitle, description: cleanDescription, createdAt: now, updatedAt: now }, ...current]);
    }
    resetForm();
  }

  function editNote(note) {
    setEditingId(note.id);
    setTitle(note.title);
    setDescription(note.description);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteNote(id) {
    setNotes((current) => current.filter((note) => note.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Little Notes home"><img className="coffee-logo" src="/coffee-cup.jpg" alt="Iced coffee" /><span>little notes</span></a>
        <span className="topbar-note">A little room for your thoughts <span aria-hidden="true">✳</span></span>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> YOUR PERSONAL NOTEBOOK</p>
          <h1>Thoughts, <em>gathered.</em></h1>
          <p className="hero-intro">A calm little corner to catch the ideas, reminders, and passing thoughts you want to keep.</p>
        </div>
        <div className="hero-stamp" aria-hidden="true"><span>MAKE SPACE</span><b>✳</b><span>FOR IDEAS</span></div>
      </section>

      <section className="workspace" aria-label="Notes workspace">
        <aside className="editor-panel">
          <div className="panel-heading">
            <div><p className="eyebrow">THE NOTEBOOK</p><h2>{editingId ? "A small revision" : "Start with a thought"}</h2></div>
            <span className="heading-spark" aria-hidden="true">✳</span>
          </div>
          <form className="note-form" onSubmit={saveNote}>
            <label htmlFor="note-title">TITLE</label>
            <input id="note-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give it a name…" maxLength={80} required />
            <div className="label-row"><label htmlFor="note-description">YOUR THOUGHT</label><span>{description.length}/500</span></div>
            <textarea id="note-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Let the words find their way…" rows={6} maxLength={500} required />
            <div className="form-footer">
              <span className="form-hint">{duplicate ? "You’ve already saved this note." : "Saved just for you, in this browser."}</span>
              <button className="save-button" type="submit" disabled={!title.trim() || !description.trim() || duplicate}>
                {editingId ? "Save changes" : "Add note"}<span aria-hidden="true">↗</span>
              </button>
            </div>
            {editingId && <button type="button" className="cancel-edit" onClick={resetForm}>Cancel editing</button>}
          </form>
          <div className="editor-footnote"><span className="footnote-icon">✎</span><p>Good ideas don’t need to be fully formed.<br />Just put them somewhere safe.</p></div>
        </aside>

        <section className="notes-panel" aria-label="Your saved notes">
          <div className="notes-heading">
            <div><p className="eyebrow">YOUR COLLECTION</p><h2>Your notes <span className="count-badge">{notes.length}</span></h2></div>
            <label className="search-box"><span className="search-icon" aria-hidden="true">⌕</span><input aria-label="Search notes" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a note…" /></label>
          </div>
          {!ready ? <div className="empty-state loading-state"><span className="empty-icon">✳</span><h3>Opening your notebook…</h3><p>Your thoughts are right where you left them.</p></div> : visibleNotes.length ? (
            <div className="notes-grid">{visibleNotes.map((note, index) => <NoteItem key={note.id} note={note} index={index} onEdit={editNote} onDelete={deleteNote} />)}</div>
          ) : search ? (
            <div className="empty-state"><span className="empty-icon">⌕</span><h3>No notes found</h3><p>Try another word, or start a fresh thought.</p><button type="button" className="text-button" onClick={() => setSearch("")}>Clear search <span>↗</span></button></div>
          ) : (
            <div className="empty-state"><span className="empty-icon">✳</span><h3>A blank page is full of possibility.</h3><p>Start with the thought you keep coming back to.</p></div>
          )}
          <div className="collection-footer"><span>{notes.length === 1 ? "ONE THOUGHT KEPT" : `${String(notes.length).padStart(2, "0")} THOUGHTS KEPT`}</span><span>TAKE YOUR TIME <b>✳</b></span></div>
        </section>
      </section>
      <footer className="page-footer"><span>MADE FOR THE THOUGHTS WORTH KEEPING</span><span>ONE PAGE AT A TIME <b>✳</b></span></footer>
    </main>
  );
}
