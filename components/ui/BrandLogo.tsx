import React from "react";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "",
  size = "md",
  showText = true,
}) => {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={`inline-flex items-center gap-2.5 font-sans ${className}`}>
      {/* Geometric Reset/Refocus Mark */}
      <div
        className={`${iconSizes[size]} bg-primary flex items-center justify-center rounded-lg shadow-sm text-white flex-shrink-0 relative overflow-hidden`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/4 h-3/4"
        >
          {/* Subtle outer focus reticles */}
          <path
            d="M 6 12 L 6 7 C 6 6.4 6.4 6 7 6 L 12 6"
            stroke="#A3C6B5"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 30 12 L 30 7 C 30 6.4 29.6 6 29 6 L 24 6"
            stroke="#A3C6B5"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 6 24 L 6 29 C 6 29.6 6.4 30 7 30 L 12 30"
            stroke="#A3C6B5"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 30 24 L 30 29 C 30 29.6 29.6 30 29 30 L 24 30"
            stroke="#A3C6B5"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Inner forward/ascent chevron (Strength & Refocus) */}
          <path
            d="M 12 21 L 18 15 L 24 21"
            stroke="#FFFFFF"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="18" cy="10" r="1.8" fill="#FFFFFF" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`font-bold tracking-tight text-content-primary ${textSizes[size]}`}>
            REFOCOUS
          </span>
          {size !== "sm" && (
            <span className="text-[10px] uppercase tracking-wider text-content-secondary font-medium -mt-0.5">
              Refocus your life
            </span>
          )}
        </div>
      )}
    </div>
  );
};
