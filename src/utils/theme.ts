import { extendTheme } from "native-base";

export const theme = extendTheme({
  colors: {
    // Add new color
    primary: {
      100: "#494949",
      200: "#EAEAEA", //bg white
      400: "#161618",
      500: "#0172BD",
      600: "#73494949",
      900: "#29ABE2",
    },

    secondary: {
      500: "#DB8C15",
    },
    tertiary: {
      500: "#1564DB",
    },
    muted: {
      500: "#C4C4CC",
    },
    social: {
      fb: "#0988EF",
      google: "#DB4437",
      color: "#FFFBFB",
    },
    // Redefining only one shade, rest of the color will remain same.
    amber: {
      400: "#d97706",
    },
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
  },
  sizes: {
    14: 56,
    22: 64,
    26: 104,
    28: 112,
  },
  config: {
    // Changing initialColorMode to 'dark'
    initialColorMode: "dark",
  },
});
