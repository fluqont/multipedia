import type { Config } from "tailwindcss";
import { withMaterialColors } from "tailwind-material-colors";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default withMaterialColors(config, {
  primary: "#ABC7FF",
});
