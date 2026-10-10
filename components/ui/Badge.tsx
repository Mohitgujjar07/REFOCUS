import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "neutral";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}) => {
  const variants = {
    primary: "bg-primary-soft text-primary border border-primary/20",
    secondary: "bg-surface-subtle text-content-secondary border border-border",
    success: "bg-status-successBg text-status-success border border-status-success/20",
    warning: "bg-status-warningBg text-status-warning border border-status-warning/20",
    error: "bg-status-errorBg text-status-error border border-status-error/20",
    neutral: "bg-surface-muted text-content-primary border border-border",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px] font-medium rounded-md",
    md: "px-2.5 py-1 text-xs font-medium rounded-md",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-sans select-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
