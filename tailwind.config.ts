import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        border: "var(--border)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        card: "var(--card)",
      },
      fontFamily: {
        sans: ["IRANYekanX", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Material Design 3 — Persian-friendly line heights
        xs: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.025em" }], // 12 Label/Body Small
        sm: ["0.875rem", { lineHeight: "1.43", letterSpacing: "0.01em" }], // 14 Label Large
        base: ["1rem", { lineHeight: "1.5", letterSpacing: "0.015em" }], // 16 Body Large
        lg: ["1.125rem", { lineHeight: "1.5", letterSpacing: "0" }], // 18
        xl: ["1.25rem", { lineHeight: "1.4", letterSpacing: "0" }], // 20 Title
        "2xl": ["1.5rem", { lineHeight: "1.35", letterSpacing: "0" }], // 24 Headline Small
        "3xl": ["1.75rem", { lineHeight: "1.3", letterSpacing: "0" }], // 28 Headline Medium
        "4xl": ["2rem", { lineHeight: "1.25", letterSpacing: "0" }], // 32 Headline Large
        "5xl": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }], // 36
        "6xl": ["2.8125rem", { lineHeight: "1.15", letterSpacing: "-0.015em" }], // 45 Display Med
        "7xl": ["3.5625rem", { lineHeight: "1.12", letterSpacing: "-0.015em" }], // 57 Display Large
      },
      animation: {
        "ambient-drift": "ambient-drift 25s ease-in-out infinite",
      },
      keyframes: {
        "ambient-drift": {
          "0%, 100%": { transform: "scale(1.05) translate(0, 0)" },
          "50%": { transform: "scale(1.08) translate(-1%, 1%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
