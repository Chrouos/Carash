import type { Config } from "tailwindcss/types";
const {nextui} = require("@nextui-org/react");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",

    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      "90vh": "90vh",
      "80vh": "80vh",
      "20vh": "20vh",
      "15vh": "15vh",
      "10vh": "10vh",
    }
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
