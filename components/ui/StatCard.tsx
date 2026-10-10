import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "./Card";
import { ProgressBar } from "./ProgressBar";

export interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  target?: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  progressValue?: number;
  progressMax?: number;
  progressVariant?: "primary" | "success" | "warning" | "error";
  badgeText?: string;
  badgeVariant?: "primary" | "success" | "warning" | "neutral";
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  target,
  subtitle,
  icon,
  progressValue,
  progressMax,
  progressVariant = "primary",
  badgeText,
  badgeVariant = "neutral",
  className,
  onClick,
}) => {
  const badgeStyles = {
    primary: "bg-primary-soft text-primary border-primary/20",
    success: "bg-status-successBg text-status-success border-status-success/20",
    warning: "bg-status-warningBg text-status-warning border-status-warning/20",
    neutral: "bg-surface-subtle text-content-secondary border-border",
  };

  return (
    <Card
      className={cn(
        "flex flex-col justify-between transition-all hover:border-[#CCD5CC]",
        onClick && "cursor-pointer hover:shadow-md",
        className
      )}
      onClick={onClick}
    >
      <div>
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="w-8 h-8 rounded-lg bg-surface-subtle border border-border flex items-center justify-center text-primary flex-shrink-0">
                {icon}
              </div>
            )}
            <span className="text-xs font-semibold text-content-secondary tracking-wide uppercase">
              {title}
            </span>
          </div>
          {badgeText && (
            <span
              className={cn(
                "text-[10px] font-medium px-2 py-0.5 rounded-full border",
                badgeStyles[badgeVariant]
              )}
            >
              {badgeText}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-content-primary tabular-nums">
            {value}
          </span>
          {unit && (
            <span className="text-sm font-medium text-content-secondary">{unit}</span>
          )}
          {target !== undefined && (
            <span className="text-xs text-content-tertiary ml-auto tabular-nums">
              Target: <strong className="text-content-secondary font-medium">{target} {unit}</strong>
            </span>
          )}
        </div>

        {subtitle && (
          <p className="mt-1 text-xs text-content-secondary line-clamp-1">{subtitle}</p>
        )}
      </div>

      {progressValue !== undefined && progressMax !== undefined && (
        <div className="mt-4 pt-2 border-t border-border/40">
          <ProgressBar
            value={progressValue}
            max={progressMax}
            variant={progressVariant}
          />
        </div>
      )}
    </Card>
  );
};
