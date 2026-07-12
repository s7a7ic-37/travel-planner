"use client";
import {
  createContext,
  useState,
  useMemo,
  forwardRef,
  useContext,
  useEffect,
} from "react";
import createTheme from "@mui/material/styles/createTheme";
import Paper from "@mui/material/Paper";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import NextLink from "next/link";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import { StaticImageData } from "next/image";
import maldives from "../public/maldives.jpeg";

const contextIsDark = createContext<
  { isDark: boolean; setIsDark: (isDark: boolean) => void } | undefined
>(undefined);

const contextBackgroundImage = createContext<
  | {
      backgroundImage: string;
      setBackgroundImage: (image: string) => void;
    }
  | undefined
>(undefined);

const LinkBehaviour = forwardRef(function LinkBehaviour(props, ref) {
  // @ts-ignore
  return <NextLink ref={ref} {...props} />;
});

export default function AppMuiThemeProvider(props: {
  children: React.ReactNode;
  fontFamily?: string;
}) {
  const { children } = props;
  const [backgroundImage, setBackgroundImage] = useState<string>(maldives.src);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    const rootColorSchemeStyleTagId = "root-color-scheme";

    document.getElementById(rootColorSchemeStyleTagId)?.remove();

    document.head.insertAdjacentHTML(
      "afterend",
      `<style id="${rootColorSchemeStyleTagId}">:root { color-scheme: ${
        prefersDarkMode ? "dark" : "light"
      }; }</style>`,
    );
  }, [prefersDarkMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "light",
          primary: {
            main: "#fff685",
          },
          secondary: {
            main: "#00ddff",
          },
          background: {
            paper: "#d01746",
            default: "#ff1d58",
          },
          text: {
            primary: "rgba(255,255,255,0.87)",
            secondary: "rgba(16,16,16,0.54)",
          },
          divider: "#000044",
        },
        typography: {
          fontFamily: props.fontFamily,
        },
        shape: {
          borderRadius: 16,
        },
        components: {
          MuiLink: {
            defaultProps: {
              // @ts-ignore
              component: LinkBehaviour,
            },
          },
          MuiButtonBase: {
            defaultProps: {
              LinkComponent: LinkBehaviour,
            },
          },
        },
      }),
    [prefersDarkMode],
  );
  const wrap = useMemo(
    () => ({ backgroundImage, setBackgroundImage }),
    [backgroundImage],
  );

  return (
    <ThemeProvider theme={theme}>
      <contextBackgroundImage.Provider value={wrap}>
        <Box
          id="app-container"
          sx={{
            minHeight: "100vh",
            width: "100%",
          }}
        >
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(5px)", // Change the pixel value to adjust the blur
              zIndex: -1,
            }}
          />
          {children}
        </Box>
      </contextBackgroundImage.Provider>
    </ThemeProvider>
  );
}

export function useBackgroundImage() {
  const wrap = useContext(contextBackgroundImage);

  if (wrap === undefined) {
    throw new Error("Not wrapped in provider");
  }

  return wrap;
}

export function useIsDark() {
  const wrap = useContext(contextIsDark);

  if (wrap === undefined) {
    throw new Error("Not wrapped in provider");
  }

  return wrap;
}
