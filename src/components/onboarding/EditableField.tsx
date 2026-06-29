"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

interface EditableFieldProps {
  value: string;
  // Called on blur with raw text. Parent decides set-vs-clear
  // (empty or equals-default => clearField => reverts to our default).
  onCommit: (raw: string) => void;
  multiline?: boolean;
  placeholder?: string;
  ariaLabel?: string;
  // Text styling so the value reads as content (size / weight / color).
  className?: string;
}

// A value that looks like typeset text and quietly becomes editable on
// hover/focus, no permanent form box. Auto-grows so prose wraps naturally.
export default function EditableField({
  value,
  onCommit,
  multiline = false,
  placeholder,
  ariaLabel,
  className = "",
}: EditableFieldProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const ref = useRef<HTMLTextAreaElement>(null);
  const display = draft ?? value;

  const resize = () => {
    const el = ref.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };
  useLayoutEffect(resize, [display]);
  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const commit = () => {
    if (draft === null) return;
    const cleaned = multiline ? draft.trim() : draft.replace(/\s*\n\s*/g, " ").trim();
    onCommit(cleaned);
    setDraft(null);
  };

  return (
    <div className="group/edit relative">
      <textarea
        ref={ref}
        rows={1}
        aria-label={ariaLabel}
        value={display}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (!multiline && e.key === "Enter") {
            e.preventDefault();
            (e.target as HTMLTextAreaElement).blur();
          }
        }}
        className={`w-full resize-none overflow-hidden bg-transparent rounded-lg -mx-2 px-2 pr-7 py-1 transition-colors duration-150 cursor-text hover:bg-[var(--color-surface-low)]/70 focus:bg-[var(--color-surface-low)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/25 placeholder:text-[var(--color-on-surface-variant)]/40 ${className}`}
      />
      <span className="pointer-events-none absolute right-1.5 top-2 text-[var(--color-on-surface-variant)] opacity-0 group-hover/edit:opacity-35 group-focus-within/edit:opacity-0 transition-opacity">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </span>
    </div>
  );
}
