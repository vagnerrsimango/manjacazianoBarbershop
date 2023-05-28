import { extendTheme } from "native-base";

export const theme = extendTheme({
  colors: {
    // Add new color
    primary: {
      100: "#F2F2F2",//bg white
      200: "#E8E8E8", //bg button grey
      300: "#727272", //grey in the buttons
      400: "#FDAD11", //main orange
      500: "#f09d0d",
      600: "#73494949",
      700: '#3A3A3A',
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
