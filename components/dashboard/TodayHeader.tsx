import React from "react";
import Link from "next/link";
import { formatDisplayDate } from "@/lib/dates";
import { ArrowRight, Sparkles } from "lucide-react";

interface TodayHeaderProps {
  displayName: string;
  supportiveMessage?: string;
  hasSampleDataBadge?: boolean;
}

export const TodayHeader: React.FC<TodayHeaderProps> = ({
  displayName,
  supportiveMessage = "Consistency beats intensity. Focus on executing today's baseline targets.",
  hasSampleDataBadge = true,
}) => {
  const todayFormatted = formatDisplayDate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-content-primary">
            Welcome back, {displayName}
          </h1>
          {hasSampleDataBadge && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-primary-soft text-primary border border-primary/20">
              <Sparkles className="w-3 h-3" />
              Founder Blueprint • Initial Journey
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-content-secondary mt-1 font-medium">
          {todayFormatted} • <span className="text-content-primary font-normal">{supportiveMessage}</span>
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <Link
          href="/training"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover bg-primary-soft hover:bg-[#DCE9DF] px-3.5 py-2 rounded-lg border border-primary/20 transition-all group"
        >
          <span>View 4-Day Plan</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
