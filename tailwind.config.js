/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FBF6EC",
        card: "#FFFDF8",
        foreground: "#26331F",
        muted: "#F3EEDD",
        "muted-foreground": "#6B7263",
        border: "#E7DEC9",
        primary: "#2F6B33",
        "primary-hover": "#26592B",
        "primary-soft": "#E4F0DC",
        accent: "#C85A32",
        "accent-hover": "#B04C28",
        "accent-soft": "#FBE9DF",
        warn: "#FFF3D6",
        "warn-border": "#EBCB7A",
        "warn-text": "#7A5510",
        danger: "#B3261E",
        "danger-soft": "#FDECEA",
        "danger-border": "#F3B8B2",
      },
      fontFamily: {
        display: ["Bitter", "Georgia", "serif"],
        body: ["Nunito Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
        control: "14px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(60, 48, 20, 0.06), 0 8px 24px -12px rgba(60, 48, 20, 0.18)",
      },
    },
  },
  plugins: [],
};
