"use client";

import EditableField from "./EditableField";
import type { ExampleEmail } from "./types";

// Merge tags the sequencer fills per-lead, e.g. {{first_name}}.
const TAG_RE = /\{\{\s*([\w.]+)\s*\}\}/g;

function tagsIn(...parts: string[]): string[] {
  const found = new Set<string>();
  for (const p of parts) for (const m of p.matchAll(TAG_RE)) found.add(m[1]);
  return [...found];
}

function EnvelopeIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

function EmailCard({
  email,
  from,
  onChange,
  onRemove,
}: {
  email: ExampleEmail;
  from: string;
  onChange: (next: ExampleEmail) => void;
  onRemove: () => void;
}) {
  const tags = tagsIn(email.subject, email.body);

  return (
    <div className="group/mail rounded-2xl bg-[var(--color-surface-lowest)] ring-1 ring-[var(--color-outline-variant)]/25 overflow-hidden shadow-ambient">
      {/* Client chrome */}
      <div className="flex items-center justify-between gap-2 px-4 py-2 bg-[var(--color-surface-low)]/70 border-b border-[var(--color-outline-variant)]/20">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-on-surface-variant)]">
          <EnvelopeIcon />
          New message
        </span>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove email"
          className="w-6 h-6 grid place-items-center rounded-md text-[var(--color-on-surface-variant)]/40 opacity-0 group-hover/mail:opacity-100 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* From - not editable here, it comes from the campaign identity */}
      <div className="flex items-baseline gap-2 px-5 pt-3 text-sm">
        <span className="w-14 shrink-0 text-xs font-medium text-[var(--color-on-surface-variant)]/70">From</span>
        <span className="text-[var(--color-on-surface-variant)] truncate">{from}</span>
      </div>

      {/* Subject */}
      <div className="flex items-baseline gap-2 px-5 pt-1.5 pb-2.5 border-b border-[var(--color-outline-variant)]/20">
        <span className="w-14 shrink-0 text-xs font-medium text-[var(--color-on-surface-variant)]/70">Subject</span>
        <div className="flex-1 min-w-0">
          <EditableField
            value={email.subject}
            onCommit={(v) => onChange({ ...email, subject: v })}
            ariaLabel="Email subject"
            placeholder="Subject line…"
            className="font-semibold text-[var(--color-on-surface)]"
          />
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-3">
        <EditableField
          value={email.body}
          onCommit={(v) => onChange({ ...email, body: v })}
          ariaLabel="Email body"
          multiline
          placeholder="Write the email…"
          className="text-[15px] text-[var(--color-on-surface)] leading-[1.7] whitespace-pre-line"
        />
      </div>

      {/* Merge tags actually used */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-5 pb-4 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]/60">
            Personalized
          </span>
          {tags.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-md bg-[var(--color-secondary)]/12 text-[var(--color-secondary)] font-mono text-[11px] font-semibold"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EmailPreview({
  emails,
  from,
  onEmails,
}: {
  emails: ExampleEmail[];
  from: string;
  onEmails: (next: ExampleEmail[]) => void;
}) {
  const update = (i: number, next: ExampleEmail) => {
    const arr = emails.slice();
    arr[i] = next;
    onEmails(arr);
  };

  return (
    <div className="space-y-4">
      {emails.map((e, i) => (
        <EmailCard
          key={e.id}
          email={e}
          from={from}
          onChange={(next) => update(i, next)}
          onRemove={() => onEmails(emails.filter((_, idx) => idx !== i))}
        />
      ))}
      <button
        type="button"
        onClick={() =>
          onEmails([...emails, { id: `email-${Date.now()}`, subject: "", body: "" }])
        }
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-secondary)] hover:underline cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add email
      </button>
    </div>
  );
}
