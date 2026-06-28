"use client";

import type { FaqItem } from "./types";

interface FaqEditorProps {
  items: FaqItem[];
  onItems: (items: FaqItem[]) => void;
  global: string;
  onGlobal: (text: string) => void;
}

const inputCls =
  "w-full px-4 py-2.5 rounded-lg border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-low)] text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)] transition-colors";

export default function FaqEditor({ items, onItems, global, onGlobal }: FaqEditorProps) {
  const update = (i: number, patch: Partial<FaqItem>) => {
    const next = items.slice();
    next[i] = { ...next[i], ...patch };
    onItems(next);
  };
  const remove = (i: number) => onItems(items.filter((_, idx) => idx !== i));
  const add = () => onItems([...items, { id: `new-${Date.now()}`, q: "", a: "" }]);

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div
          key={item.id}
          className="rounded-2xl border border-[var(--color-outline-variant)]/20 bg-[var(--color-surface-lowest)] p-5 shadow-ambient"
        >
          <div className="flex items-start gap-2">
            <input
              type="text"
              value={item.q}
              placeholder="If a prospect asks…"
              onChange={(e) => update(i, { q: e.target.value })}
              className={`${inputCls} font-semibold`}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove question"
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-[var(--color-on-surface-variant)]/60 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <textarea
            value={item.a}
            placeholder="…here's how we should respond."
            rows={2}
            onChange={(e) => update(i, { a: e.target.value })}
            className={`${inputCls} mt-2 resize-y leading-relaxed`}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-secondary)] hover:underline"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add a question
      </button>

      <div className="pt-4">
        <label className="block text-sm font-semibold text-[var(--color-primary)] mb-1.5">
          Anything else we should know?
        </label>
        <textarea
          value={global}
          placeholder="Open notes, edge cases, things to avoid…"
          rows={4}
          onChange={(e) => onGlobal(e.target.value)}
          className={`${inputCls} resize-y leading-relaxed`}
        />
      </div>
    </div>
  );
}
