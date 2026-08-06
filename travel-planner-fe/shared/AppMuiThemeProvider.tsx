"use client";
import { forwardRef, useMemo } from "react";
import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";
import NextLink from "next/link";

const LinkBehaviour = forwardRef(function LinkBehaviour(props, ref) {
  // @ts-ignore MUI passes its link props through to NextLink.
  return <NextLink ref={ref} {...props} />;
});

export default function AppMuiThemeProvider(props: { children: React.ReactNode }) {
  const theme = useMemo(() => createTheme({
    palette: {
      mode: "light",
      primary: { main: "#1a6778", contrastText: "#ffffff" },
      secondary: { main: "#24354a" },
      background: { paper: "#ffffff", default: "#f4f9fb" },
      text: { primary: "#24354a", secondary: "#5e6978" },
      divider: "#ddd6c8",
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
      MuiCssBaseline: { styleOverrides: { html: { colorScheme: "light" }, body: { backgroundColor: "#f4f9fb" } } },
    },
  }), []);
  return <ThemeProvider theme={theme}><CssBaseline /><div id="app-container">{props.children}</div></ThemeProvider>;
}
