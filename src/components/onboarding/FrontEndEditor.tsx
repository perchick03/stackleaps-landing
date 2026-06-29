"use client";

import EditableField from "./EditableField";
import type { FrontEndItem } from "./types";

interface FrontEndEditorProps {
  items: FrontEndItem[];
  onItems: (items: FrontEndItem[]) => void;
}

export default function FrontEndEditor({ items, onItems }: FrontEndEditorProps) {
  const update = (i: number, patch: Partial<FrontEndItem>) => {
    const next = items.slice();
    next[i] = { ...next[i], ...patch };
    onItems(next);
  };
  const remove = (i: number) => onItems(items.filter((_, idx) => idx !== i));
  const add = () => onItems([...items, { name: "", url: "", note: "" }]);

  return (
    <div>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="group/fe rounded-xl bg-[var(--color-surface-low)]/60 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <EditableField
                  value={it.name}
                  onCommit={(v) => update(i, { name: v })}
                  ariaLabel="Resource name"
                  placeholder="Resource name"
                  className="font-semibold text-[var(--color-primary)]"
                />
              </div>
              <div className="flex items-center gap-1 shrink-0 mt-1.5">
                {it.url && (
                  <a
                    href={it.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-secondary)] hover:underline"
                  >
                    View
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
                    </svg>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  aria-label="Remove resource"
                  className="w-7 h-7 grid place-items-center rounded-lg text-[var(--color-on-surface-variant)]/40 opacity-0 group-hover/fe:opacity-100 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <EditableField
              value={it.url ?? ""}
              onCommit={(v) => update(i, { url: v })}
              ariaLabel="Resource URL"
              placeholder="https://…"
              className="text-xs text-[var(--color-on-surface-variant)]"
            />
            <EditableField
              value={it.note ?? ""}
              onCommit={(v) => update(i, { note: v })}
              ariaLabel="Best for"
              multiline
              placeholder="Best for…"
              className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed"
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-secondary)] hover:underline"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add free resource
      </button>
    </div>
  );
}
