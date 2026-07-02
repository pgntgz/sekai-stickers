import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// MD3-inspired MUI theme
const md3Theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#d0bcff",
      contrastText: "#381e72",
    },
    secondary: {
      main: "#ccc2dc",
      contrastText: "#332d41",
    },
    background: {
      default: "#121212",
      paper: "#2b2930",
    },
    text: {
      primary: "#e6e1e5",
      secondary: "#cac4d0",
    },
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans SC", "Noto Sans JP", sans-serif',
  },
  shape: {
    borderRadius: 16,
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
          backgroundColor: "#2b2930",
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 28,
          backgroundColor: "#36343b",
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
