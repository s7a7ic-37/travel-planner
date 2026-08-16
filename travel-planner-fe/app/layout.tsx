import "./theme.css";
import { AuthContextProvider } from "./context/AuthContext";
import { Suspense } from "react";
import Container from "@/components/appcontainer";
import Navbar from "@/components/navbar";
import { NextAppDirEmotionCacheProvider } from "tss-react/next/appDir";
import AppMuiThemeProvider from "@/shared/AppMuiThemeProvider";
import { places } from "@/lib/demo";

export const metadata = {
  title: "Ready, Jet Set, Go! · Manchester planner",
  description:
    `Plan a Manchester city break, explore ${places.length} places and save your itinerary.`,
  icons: {
    icon: [
      { url: "/favicon-32.png?v=20261031", type: "image/png", sizes: "32x32" },
      { url: "/favicon.svg?v=20261031", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script src="/theme.js" /></head>
      <body
        style={{
          margin: 0,
        }}
      >
        <AuthContextProvider>
          <NextAppDirEmotionCacheProvider options={{ key: "css" }}>
            <AppMuiThemeProvider>
              <Navbar />
              <Container><Suspense fallback={<p>Loading itinerary…</p>}>{children}</Suspense></Container>
            </AppMuiThemeProvider>
          </NextAppDirEmotionCacheProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
