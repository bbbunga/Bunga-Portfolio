"use client";

import { useEffect, useRef, useState } from "react";

type ThemeTransitionEvent = CustomEvent<{ theme: "light" | "dark" }>;

const transitionDuration = 850;

export function ThemeTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetTheme, setTargetTheme] = useState<"light" | "dark">("light");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) return;

      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }

      const detail = (event as ThemeTransitionEvent).detail;
      setTargetTheme(detail?.theme ?? "light");
      setIsTransitioning(true);

      timerRef.current = window.setTimeout(() => {
        setIsTransitioning(false);
        timerRef.current = null;
      }, transitionDuration);
    };

    window.addEventListener("bunga-theme-transition", handleThemeChange);

    return () => {
      window.removeEventListener("bunga-theme-transition", handleThemeChange);
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (!isTransitioning) return null;

  return <div className="theme-transition-sheet" data-theme-target={targetTheme} />;
}
