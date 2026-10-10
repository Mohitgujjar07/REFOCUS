import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F8F5",
        card: "#FFFFFF",
        primary: {
          DEFAULT: "#245B46",
          hover: "#1D4B39",
          dark: "#163A2C",
          light: "#2F7359",
          soft: "#EAF2EC",
          border: "#C8D9CD",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F2F4F0",
          muted: "#EAECE7",
        },
        content: {
          primary: "#202923",
          secondary: "#6B756E",
          tertiary: "#95A098",
          inverse: "#FFFFFF",
        },
        border: {
          DEFAULT: "#E2E7E1",
          subtle: "#ECEFEA",
          strong: "#CCD3CB",
        },
        status: {
          success: "#16A34A",
          successBg: "#EAF7EE",
          warning: "#D97706",
          warningBg: "#FEF7EA",
          error: "#DC2626",
          errorBg: "#FDF2F2",
          info: "#2563EB",
          infoBg: "#EFF6FF",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(32, 41, 35, 0.04)",
        DEFAULT: "0 1px 3px 0 rgba(32, 41, 35, 0.06), 0 1px 2px -1px rgba(32, 41, 35, 0.04)",
        md: "0 4px 6px -1px rgba(32, 41, 35, 0.05), 0 2px 4px -2px rgba(32, 41, 35, 0.03)",
        lg: "0 10px 15px -3px rgba(32, 41, 35, 0.05), 0 4px 6px -4px rgba(32, 41, 35, 0.02)",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        md: "0.625rem",
        lg: "0.75rem",
        xl: "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
