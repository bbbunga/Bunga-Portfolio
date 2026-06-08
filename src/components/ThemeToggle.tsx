"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type ThemeMode = "light" | "dark";

const themeStorageKey = "bunga-theme-mode";
const themeSubscribers = new Set<() => void>();
const themeTransitionDuration = 850;

function getThemeSnapshot(): ThemeMode {
  if (typeof window === "undefined") return "light";

  try {
    const storedTheme = window.localStorage.getItem(themeStorageKey);
    return storedTheme === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function getThemeServerSnapshot(): ThemeMode {
  return "light";
}

function subscribeToThemeStore(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (event.key === themeStorageKey) {
      onStoreChange();
    }
  };

  themeSubscribers.add(onStoreChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    themeSubscribers.delete(onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

function saveThemeMode(mode: ThemeMode) {
  try {
    window.localStorage.setItem(themeStorageKey, mode);
  } catch {
    return;
  }

  themeSubscribers.forEach((onStoreChange) => onStoreChange());
}

export function ThemeToggle() {
  const themeMode = useSyncExternalStore<ThemeMode>(
    subscribeToThemeStore,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = themeMode;
    root.style.colorScheme = themeMode;
  }, [themeMode]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const toggleTheme = () => {
    if (isTransitioning) return; // Prevent rapid clicks

    const newMode = themeMode === "light" ? "dark" : "light";

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!prefersReducedMotion) {
      setIsTransitioning(true);

      window.dispatchEvent(
        new CustomEvent("bunga-theme-transition", {
          detail: { theme: newMode },
        }),
      );

      transitionTimerRef.current = window.setTimeout(() => {
        setIsTransitioning(false);
        transitionTimerRef.current = null;
      }, themeTransitionDuration);
    }

    saveThemeMode(newMode);
  };

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      disabled={isTransitioning}
      aria-label={`Switch to ${themeMode === "light" ? "dark" : "light"} mode`}
    >
      {themeMode === "light" ? (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3v2.25m0 13.5V21m9-9h-2.25M5.25 12H3m15.364 6.364l-1.591-1.591M7.227 7.227L5.636 5.636m12.728 0l-1.591 1.591M7.227 16.773l-1.591 1.591"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="12"
            r="4"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
