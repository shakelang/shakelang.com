import { experimental_extendTheme as extendTheme } from "@mui/material/styles";

// General MUI theme
const extTheme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#b33b1e",
        },
        background: {
          paper: "hsl(240, 15%, 95%)",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#cf6039",
        },
        background: {
          paper: "hsl(210, 3%, 15%)",
        },
      },
    },
  },
});

export default extTheme;
