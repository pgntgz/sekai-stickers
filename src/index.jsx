import React from "react";
import ReactDOM from "react-dom/client";
import "mdui/mdui.css";
import "mdui";
import { setColorScheme, setTheme } from "mdui";
import "./index.css";
import "./i18n";
import App from "./App";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Initialize MD3 theme with user preferred matugen teal #59dbc1 & dark mode
setColorScheme("#59dbc1");
setTheme("dark");

// Harmonized MD3 MUI theme to match Matugen / QuickShell palette
const md3Theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#59dbc1",
      contrastText: "#00382f",
    },
    secondary: {
      main: "#84d6c2",
      contrastText: "#00382f",
    },
    background: {
      default: "#0a151a",
      paper: "#172126",
    },
    text: {
      primary: "#d9e4eb",
      secondary: "#b4cad6",
    },
  },
  typography: {
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans SC", "Noto Sans JP", sans-serif',
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 9999,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 28,
          backgroundColor: "#172126",
          backgroundImage: "none",
          border: "1px solid #2c363c",
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          backgroundColor: "#172126",
          backgroundImage: "none",
          border: "1px solid #2c363c",
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={md3Theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
