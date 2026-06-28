"use client";

interface EditableListProps {
  label?: string;
  value: string[];
  // Receives the whole new array. Parent maps [] => clearField (revert to default).
  onCommit: (items: string[]) => void;
  itemPlaceholder?: string;
  addLabel?: string;
}

const rowInput =
  "flex-1 px-4 py-2.5 rounded-lg border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-low)] text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/40 focus:border-[var(--color-secondary)] transition-colors";

export default function EditableList({
  label,
  value,
  onCommit,
  itemPlaceholder,
  addLabel = "Add",
}: EditableListProps) {
  const update = (i: number, text: string) => {
    const next = value.slice();
    next[i] = text;
    onCommit(next);
  };
  const remove = (i: number) => onCommit(value.filter((_, idx) => idx !== i));
  const add = () => onCommit([...value, ""]);

  return (
    <div>
      {label && (
        <span className="block text-sm font-semibold text-[var(--color-primary)] mb-1.5">{label}</span>
      )}
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              placeholder={itemPlaceholder}
              onChange={(e) => update(i, e.target.value)}
              className={rowInput}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove"
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-[var(--color-on-surface-variant)]/60 hover:text-red-600 hover:bg-red-50 transition-colors"
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
        className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-secondary)] hover:underline"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        {addLabel}
      </button>
    </div>
  );
}
