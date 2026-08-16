"use client";
import { forwardRef, useEffect, useMemo, useState } from "react";
import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";
import NextLink from "next/link";

const LinkBehaviour = forwardRef(function LinkBehaviour(props, ref) {
  // @ts-ignore MUI passes its link props through to NextLink.
  return <NextLink ref={ref} {...props} />;
});

export default function AppMuiThemeProvider(props: { children: React.ReactNode }) {
  const [night, setNight] = useState(false);
  useEffect(() => {
    const update = () => setNight(document.documentElement.dataset.theme === "dark");
    update();
    window.addEventListener("themechange", update);
    return () => window.removeEventListener("themechange", update);
  }, []);
  const theme = useMemo(() => createTheme({
    palette: {
      mode: night ? "dark" : "light",
      primary: { main: night ? "#8ad4df" : "#1a6778", contrastText: night ? "#10212c" : "#ffffff" },
      secondary: { main: night ? "#e4f1f6" : "#24354a" },
      background: { paper: night ? "#172f3b" : "#ffffff", default: night ? "#10212c" : "#f4f9fb" },
      text: { primary: night ? "#e4f1f6" : "#24354a", secondary: night ? "#b2c7d3" : "#5e6978" },
      divider: night ? "#34515e" : "#d7e4e9",
    },
    typography: { fontFamily: '"Trebuchet MS", Arial, sans-serif' },
    shape: { borderRadius: 10 },
    components: {
      MuiLink: { defaultProps: {
        // @ts-ignore MUI's link override accepts the NextLink adapter.
        component: LinkBehaviour,
      } },
      MuiButtonBase: { defaultProps: { LinkComponent: LinkBehaviour } },
      MuiButton: { styleOverrides: { root: { minHeight: 44, textTransform: "none", fontWeight: 650 } } },
      MuiCssBaseline: { styleOverrides: { html: { colorScheme: night ? "dark" : "light" } } },
    },
  }), [night]);
  return <ThemeProvider theme={theme}><CssBaseline /><div id="app-container">{props.children}</div></ThemeProvider>;
}
