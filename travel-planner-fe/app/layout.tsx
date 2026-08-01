import { AuthContextProvider } from "./context/AuthContext";
import { Suspense } from "react";
import Container from "@/components/appcontainer";
import Navbar from "@/components/navbar";
import { NextAppDirEmotionCacheProvider } from "tss-react/next/appDir";
import AppMuiThemeProvider from "@/shared/AppMuiThemeProvider";

export const metadata = {
  title: "Ready, Jet Set, Go! · City field notes",
  description:
    "Build a Manchester sample itinerary, reorder stops and keep a browser-local plan. A personal maintenance fork with original team credit.",
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
    <html lang="en">
      <body
        style={{
          margin: 0,
        }}
      >
        <AuthContextProvider>
          <NextAppDirEmotionCacheProvider options={{ key: "css" }}>
            <AppMuiThemeProvider fontFamily="system-ui, sans-serif">
              <Navbar />
              <Container><Suspense fallback={<p>Loading itinerary…</p>}>{children}</Suspense></Container>
            </AppMuiThemeProvider>
          </NextAppDirEmotionCacheProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
