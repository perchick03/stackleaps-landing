"use client";

import { useState } from "react";

interface EditableFieldProps {
  label?: string;
  value: string;
  // Called on blur with the raw text. Parent decides set-vs-clear
  // (empty or equals-default => clearField => reverts to our default).
  onCommit: (raw: string) => void;
  multiline?: boolean;
  placeholder?: string;
  rows?: number;
}

const baseInput =
  "w-full px-4 py-3 rounded-lg border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-low)] text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)] transition-colors";

export default function EditableField({
  label,
  value,
  onCommit,
  multiline = false,
  placeholder,
  rows = 3,
}: EditableFieldProps) {
  // draft === null => not editing, display the resolved `value` prop.
  const [draft, setDraft] = useState<string | null>(null);
  const display = draft ?? value;

  const commit = () => {
    if (draft === null) return;
    onCommit(draft);
    setDraft(null); // fall back to the (possibly reverted) value prop
  };

  return (
    <label className="block">
      {label && (
        <span className="block text-sm font-semibold text-[var(--color-primary)] mb-1.5">{label}</span>
      )}
      {multiline ? (
        <textarea
          value={display}
          rows={rows}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          className={`${baseInput} resize-y leading-relaxed`}
        />
      ) : (
        <input
          type="text"
          value={display}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          }}
          className={baseInput}
        />
      )}
    </label>
  );
}
