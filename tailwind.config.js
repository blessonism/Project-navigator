/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        sm: "2rem",
        md: "3rem",
        lg: "4rem",
        xl: "6rem",
        "2xl": "8rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: [
            {
              "--tw-prose-body": theme("colors.muted.foreground"),
              "--tw-prose-headings": theme("colors.foreground"),
              "--tw-prose-lead": theme("colors.muted.foreground"),
              "--tw-prose-links": theme("colors.primary.DEFAULT"),
              "--tw-prose-bold": theme("colors.foreground"),
              "--tw-prose-counters": theme("colors.muted.foreground"),
              "--tw-prose-bullets": theme("colors.muted.foreground"),
              "--tw-prose-hr": theme("colors.border"),
              "--tw-prose-quotes": theme("colors.foreground"),
              "--tw-prose-quote-borders": theme("colors.border"),
              "--tw-prose-captions": theme("colors.muted.foreground"),
              "--tw-prose-code": theme("colors.foreground"),
              "--tw-prose-pre-code": theme("colors.muted.foreground"),
              "--tw-prose-pre-bg": theme("colors.muted.DEFAULT"),
              "--tw-prose-th-borders": theme("colors.border"),
              "--tw-prose-td-borders": theme("colors.border"),
            },
          ],
        },
        invert: {
          css: [
            {
              "--tw-prose-invert-body": theme("colors.muted.foreground"),
              "--tw-prose-invert-headings": theme("colors.foreground"),
              "--tw-prose-invert-lead": theme("colors.muted.foreground"),
              "--tw-prose-invert-links": theme("colors.primary.DEFAULT"),
              "--tw-prose-invert-bold": theme("colors.foreground"),
              "--tw-prose-invert-counters": theme("colors.muted.foreground"),
              "--tw-prose-invert-bullets": theme("colors.muted.foreground"),
              "--tw-prose-invert-hr": theme("colors.border"),
              "--tw-prose-invert-quotes": theme("colors.foreground"),
              "--tw-prose-invert-quote-borders": theme("colors.border"),
              "--tw-prose-invert-captions": theme("colors.muted.foreground"),
              "--tw-prose-invert-code": theme("colors.foreground"),
              "--tw-prose-invert-pre-code": theme("colors.muted.foreground"),
              "--tw-prose-invert-pre-bg": theme("colors.muted.DEFAULT"),
              "--tw-prose-invert-th-borders": theme("colors.border"),
              "--tw-prose-invert-td-borders": theme("colors.border"),
            },
          ],
        },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
}
