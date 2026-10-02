/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          inverse: "var(--text-inverse)"
        },
        surface: {
          primary: "var(--surface-primary)",
          secondary: "var(--surface-secondary)",
          interactive: "var(--surface-interactive)"
        },
        border: {
          subtle: "var(--border-subtle)",
          default: "var(--border-default)",
          strong: "var(--border-strong)"
        },
        brand: {
          primary: {
            DEFAULT: "var(--brand-primary)",
            hover: "var(--brand-primary-hover)",
            light: "var(--brand-primary-light)"
          },
          secondary: {
            DEFAULT: "var(--brand-secondary)",
            hover: "var(--brand-secondary-hover)",
            light: "var(--brand-secondary-light)"
          }
        },
        route: {
          path: "var(--route-path)",
          node: "var(--route-node)",
          active: "var(--route-active)"
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          'from': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(251, 146, 60, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(251, 146, 60, 0.6)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
      },
    },
  },
  plugins: [],
};
