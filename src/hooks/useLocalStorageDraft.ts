"use client";

import { useEffect, useRef, useState } from "react";
import type { Overlay, Verdict, VerdictEntry } from "@/components/onboarding/types";

const VERSION = 1;
const DEBOUNCE_MS = 400;

const clone = <T,>(o: T): T => JSON.parse(JSON.stringify(o));

// Generic immutable path helpers — paths are dot strings, e.g. "icps.icp-1.companySize".
// ponytail: one generic getter/setter/unsetter beats five bespoke per-section ones.

function getPath(obj: Record<string, unknown>, path: string[]): unknown {
  return path.reduce<unknown>(
    (acc, k) => (acc == null ? undefined : (acc as Record<string, unknown>)[k]),
    obj,
  );
}

function setPath(obj: Overlay, path: string[], value: unknown): Overlay {
  const next = clone(obj);
  let cur = next as unknown as Record<string, unknown>;
  for (let i = 0; i < path.length - 1; i++) {
    if (cur[path[i]] == null || typeof cur[path[i]] !== "object") cur[path[i]] = {};
    cur = cur[path[i]] as Record<string, unknown>;
  }
  cur[path[path.length - 1]] = value;
  return next;
}

// Delete a key, then prune now-empty parent objects so the overlay stays sparse —
// this is what makes "empty field = revert to default" work (no stored "").
function unsetPath(obj: Overlay, path: string[]): Overlay {
  const next = clone(obj);
  const parents: Record<string, unknown>[] = [next as unknown as Record<string, unknown>];
  let cur = next as unknown as Record<string, unknown>;
  for (let i = 0; i < path.length - 1; i++) {
    if (cur[path[i]] == null) return next; // nothing to unset
    cur = cur[path[i]] as Record<string, unknown>;
    parents.push(cur);
  }
  delete cur[path[path.length - 1]];
  for (let i = path.length - 1; i >= 1; i--) {
    const parent = parents[i - 1];
    const key = path[i - 1];
    const child = parent[key];
    if (child && typeof child === "object" && Object.keys(child).length === 0) {
      delete parent[key];
    }
  }
  return next;
}

export type SaveStatus = "idle" | "saving" | "saved";

export function useLocalStorageDraft(client: string) {
  const storageKey = `sl_onboarding_v1:${client}`;

  const [overlay, setOverlay] = useState<Overlay>(() => {
    // SSR-safe lazy init — never touch localStorage outside this guard.
    if (typeof window === "undefined") return { v: VERSION };
    try {
      const raw = window.localStorage.getItem(storageKey);
      const parsed = raw ? (JSON.parse(raw) as Overlay) : null;
      return parsed && parsed.v === VERSION ? parsed : { v: VERSION };
    } catch {
      return { v: VERSION };
    }
  });

  const [saved, setSaved] = useState<SaveStatus>("idle");
  const firstRun = useRef(true);
  const overlayRef = useRef(overlay);
  useEffect(() => {
    overlayRef.current = overlay;
  }, [overlay]);

  // Debounced write — don't hit localStorage on every keystroke.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (firstRun.current) {
      firstRun.current = false; // don't write on initial hydrate
      return;
    }
    const t = setTimeout(() => {
      try {
        window.localStorage.setItem(
          storageKey,
          JSON.stringify({ ...overlay, v: VERSION, updatedAt: new Date().toISOString() }),
        );
        setSaved("saved");
      } catch {
        /* quota / private mode — drop silently, edits stay in memory */
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [overlay, storageKey]);

  // Data-loss guard: flush synchronously if the tab closes within the debounce window.
  useEffect(() => {
    const flush = () => {
      try {
        window.localStorage.setItem(
          storageKey,
          JSON.stringify({ ...overlayRef.current, v: VERSION, updatedAt: new Date().toISOString() }),
        );
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("beforeunload", flush);
    return () => window.removeEventListener("beforeunload", flush);
  }, [storageKey]);

  const getValue = <T,>(path: string, fallback: T): T => {
    const v = getPath(overlay as unknown as Record<string, unknown>, path.split("."));
    return v === undefined ? fallback : (v as T);
  };

  // Setters flag "saving" on user action; the debounced effect flips to "saved" after writing.
  const setField = (path: string, value: unknown) => {
    setSaved("saving");
    setOverlay((o) => setPath(o, path.split("."), value));
  };

  const clearField = (path: string) => {
    setSaved("saving");
    setOverlay((o) => unsetPath(o, path.split(".")));
  };

  const getVerdict = (id: string): VerdictEntry =>
    overlay.verdicts?.[id] ?? { verdict: null, note: "" };

  const setVerdict = (id: string, entry: VerdictEntry) => {
    setSaved("saving");
    setOverlay((o) => setPath(o, ["verdicts", id], entry));
  };

  return { overlay, saved, getValue, setField, clearField, getVerdict, setVerdict };
}

export type { Verdict };
