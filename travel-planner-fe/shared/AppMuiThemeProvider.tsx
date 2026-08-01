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

export default function AppMuiThemeProvider(props: { children: React.ReactNode; fontFamily?: string }) {
  const theme = useMemo(() => createTheme({
    palette: {
      mode: "light",
      primary: { main: "#b5482b", contrastText: "#ffffff" },
      secondary: { main: "#24354a" },
      background: { paper: "#fffdf7", default: "#f6f1e7" },
      text: { primary: "#24354a", secondary: "#66707b" },
      divider: "#ddd6c8",
    },
    typography: { fontFamily: props.fontFamily },
    shape: { borderRadius: 10 },
    components: {
      MuiLink: { defaultProps: {
        // @ts-ignore MUI's link override accepts the NextLink adapter.
        component: LinkBehaviour,
      } },
      MuiButtonBase: { defaultProps: { LinkComponent: LinkBehaviour } },
      MuiButton: { styleOverrides: { root: { minHeight: 44, textTransform: "none", fontWeight: 650 } } },
      MuiCssBaseline: { styleOverrides: { html: { colorScheme: "light" }, body: { backgroundColor: "#f6f1e7" } } },
    },
  }), [props.fontFamily]);
  return <ThemeProvider theme={theme}><CssBaseline /><div id="app-container">{props.children}</div></ThemeProvider>;
}
