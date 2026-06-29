"use client";

import EditableField from "./EditableField";
import type { FaqItem } from "./types";

interface FaqEditorProps {
  items: FaqItem[];
  onItems: (items: FaqItem[]) => void;
  global: string;
  onGlobal: (text: string) => void;
}

export default function FaqEditor({ items, onItems, global, onGlobal }: FaqEditorProps) {
  const update = (i: number, patch: Partial<FaqItem>) => {
    const next = items.slice();
    next[i] = { ...next[i], ...patch };
    onItems(next);
  };
  const remove = (i: number) => onItems(items.filter((_, idx) => idx !== i));
  const add = () => onItems([...items, { id: `new-${Date.now()}`, q: "", a: "" }]);

  return (
    <div>
      <div className="divide-y divide-[var(--color-outline-variant)]/15">
        {items.map((item, i) => (
          <div key={item.id} className="group/faq flex items-start gap-4 py-5 first:pt-0">
            <span className="mt-1.5 font-serif text-xl font-bold text-[var(--color-secondary)] select-none">Q.</span>
            <div className="flex-1 min-w-0">
              <EditableField
                value={item.q}
                onCommit={(v) => update(i, { q: v })}
                ariaLabel="Question"
                placeholder="If a prospect asks…"
                className="text-lg font-semibold text-[var(--color-primary)]"
              />
              <div className="mt-0.5">
                <EditableField
                  value={item.a}
                  onCommit={(v) => update(i, { a: v })}
                  ariaLabel="Answer"
                  multiline
                  placeholder="…here's how we should respond."
                  className="text-[var(--color-on-surface-variant)] leading-relaxed"
                />
              </div>
              {item.ask && (
                <div className="mt-3 rounded-xl bg-[var(--color-secondary-fixed)]/40 px-4 py-3">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-secondary)]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 21V4h13l-2 4 2 4H4" />
                    </svg>
                    We Need From You
                  </span>
                  <p className="text-sm text-[var(--color-on-surface)] mt-1">{item.ask}</p>
                  <div className="mt-1.5 border-t border-[var(--color-secondary)]/15 pt-1.5">
                    <EditableField
                      value={item.reply ?? ""}
                      onCommit={(v) => update(i, { reply: v })}
                      ariaLabel="Your answer"
                      multiline
                      placeholder="Your answer…"
                      className="text-[var(--color-on-surface)] leading-relaxed"
                    />
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove question"
              className="mt-1.5 shrink-0 w-7 h-7 grid place-items-center rounded-lg text-[var(--color-on-surface-variant)]/40 opacity-0 group-hover/faq:opacity-100 hover:text-red-600 hover:bg-red-50 transition-all"
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
        onClick={add}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-secondary)] hover:underline"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add a question
      </button>

      <div className="mt-10 rounded-2xl bg-[var(--color-surface-low)]/60 p-5 sm:p-6">
        <span className="block text-sm font-medium text-[var(--color-on-surface-variant)] mb-1">
          Anything else we should know?
        </span>
        <EditableField
          value={global}
          onCommit={onGlobal}
          ariaLabel="Anything else we should know"
          multiline
          placeholder="Open notes, edge cases, things to avoid…"
          className="text-[var(--color-on-surface)] leading-relaxed"
        />
      </div>
    </div>
  );
}
