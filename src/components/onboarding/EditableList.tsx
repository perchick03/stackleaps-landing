"use client";

import { useEffect, useRef, useState } from "react";
import EditableField from "./EditableField";

interface EditableListProps {
  value: string[];
  // Receives the whole new array. Parent maps [] => clearField (revert to default).
  onCommit: (items: string[]) => void;
  variant?: "chips" | "lines";
  marker?: "check" | "dot" | "number"; // lines only
  itemPlaceholder?: string;
  addLabel?: string;
}

/* ---- chips ---- */

function Chip({
  value,
  onCommit,
}: {
  value: string;
  onCommit: (v: string) => void; // "" => caller removes
}) {
  const [editing, setEditing] = useState(value === "");
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const startEditing = () => {
    setDraft(value);
    setEditing(true);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        size={Math.max(draft.length, 4)}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          setEditing(false);
          onCommit(draft.trim());
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        className="px-3 py-1.5 rounded-full bg-[var(--color-surface-lowest)] text-sm font-medium text-[var(--color-primary)] ring-2 ring-[var(--color-secondary)]/30 focus:outline-none"
      />
    );
  }

  return (
    <span className="group/chip inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-[var(--color-primary)]/8 text-sm font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/12">
      <button type="button" onClick={startEditing} className="cursor-text">
        {value}
      </button>
      <button
        type="button"
        onClick={() => onCommit("")}
        aria-label={`Remove ${value}`}
        className="grid place-items-center w-4 h-4 rounded-full text-[var(--color-primary)]/40 hover:text-red-600 hover:bg-red-100/60 transition-colors"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}

/* ---- lines ---- */

function Marker({ kind, n }: { kind: NonNullable<EditableListProps["marker"]>; n: number }) {
  if (kind === "number") {
    return (
      <span className="mt-0.5 grid place-items-center w-6 h-6 shrink-0 rounded-full bg-[var(--color-primary)] text-[11px] font-bold text-white">
        {n}
      </span>
    );
  }
  if (kind === "check") {
    return (
      <span className="mt-0.5 grid place-items-center w-6 h-6 shrink-0 rounded-full bg-[var(--color-secondary)]/12 text-[var(--color-secondary)]">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }
  return <span className="mt-2.5 w-1.5 h-1.5 shrink-0 rounded-full bg-[var(--color-primary)]/40" />;
}

export default function EditableList({
  value,
  onCommit,
  variant = "chips",
  marker = "dot",
  itemPlaceholder,
  addLabel = "Add",
}: EditableListProps) {
  const update = (i: number, text: string) => {
    if (!text) return onCommit(value.filter((_, idx) => idx !== i));
    const next = value.slice();
    next[i] = text;
    onCommit(next);
  };

  if (variant === "chips") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {value.map((item, i) => (
          <Chip key={i} value={item} onCommit={(v) => update(i, v)} />
        ))}
        <button
          type="button"
          onClick={() => onCommit([...value, ""])}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-[var(--color-outline-variant)]/60 text-sm font-medium text-[var(--color-on-surface-variant)] hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {addLabel}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-2.5">
        {value.map((item, i) => (
          <div key={i} className="group/line flex items-start gap-3">
            <Marker kind={marker} n={i + 1} />
            <div className="flex-1 min-w-0">
              <EditableField
                value={item}
                multiline
                placeholder={itemPlaceholder}
                onCommit={(v) => update(i, v)}
                className="text-[var(--color-on-surface)] leading-relaxed"
              />
            </div>
            <button
              type="button"
              onClick={() => onCommit(value.filter((_, idx) => idx !== i))}
              aria-label="Remove"
              className="mt-1.5 shrink-0 w-7 h-7 grid place-items-center rounded-lg text-[var(--color-on-surface-variant)]/40 opacity-0 group-hover/line:opacity-100 hover:text-red-600 hover:bg-red-50 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onCommit([...value, ""])}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-secondary)] hover:underline"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        {addLabel}
      </button>
    </div>
  );
}
