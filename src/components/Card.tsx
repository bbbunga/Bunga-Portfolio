import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  variant?: "default" | "elevated" | "flat";
  className?: string;
  padding?: "sm" | "md" | "lg";
}

export function Card({
  children,
  variant = "default",
  className = "",
  padding = "md",
}: CardProps) {
  return (
    <div
      className={`card card--${variant} card--padding-${padding} ${className}`}
    >
      {children}
    </div>
  );
}

interface CardGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function CardGrid({
  children,
  columns = 2,
  className = "",
}: CardGridProps) {
  return (
    <div className={`card-grid card-grid--cols-${columns} ${className}`}>
      {children}
    </div>
  );
}
