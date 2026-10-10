import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: "primary" | "success" | "warning" | "error";
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = "primary",
  className,
  showLabel = false,
  label,
}) => {
  const percentage = Math.min(100, Math.max(0, max > 0 ? (value / max) * 100 : 0));

  const variantFills = {
    primary: "bg-primary",
    success: "bg-status-success",
    warning: "bg-status-warning",
    error: "bg-status-error",
  };

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs">
          <span className="text-content-secondary">{label}</span>
          <span className="font-semibold text-content-primary tabular-nums">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className="w-full bg-[#E5EAE4] rounded-full h-2 overflow-hidden"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            variantFills[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
