"use client";

function formatDate(timestamp) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(timestamp));
}

export default function NoteItem({ note, index, onEdit, onDelete }) {
  const colors = ["sage", "peach", "lavender", "butter"];
  const color = colors[index % colors.length];
  return (
    <article className={`note-card ${color}`}>
      <div className="card-topline"><span className="card-marker" aria-hidden="true">✳</span><span className="card-date">{formatDate(note.updatedAt)}</span></div>
      <h3>{note.title}</h3>
      <p className="card-description">{note.description}</p>
      <div className="card-actions">
        <button type="button" onClick={() => onEdit(note)} aria-label={`Edit ${note.title}`}>Edit <span aria-hidden="true">↗</span></button>
        <button type="button" className="delete-action" onClick={() => onDelete(note.id)} aria-label={`Delete ${note.title}`}>Delete <span aria-hidden="true">×</span></button>
      </div>
    </article>
  );
}
