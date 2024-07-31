/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        custom1: "0px 0px 9px -1px rgba(0,0,0,0.2)",
        custom2: "0px 0px 9px -1px rgba(0,0,0,0.5)",
      },
    },
  },
  plugins: [],
};
