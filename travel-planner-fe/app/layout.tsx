import { AuthContextProvider } from "./context/AuthContext";
import { Suspense } from "react";
import Container from "@/components/appcontainer";
import Navbar from "@/components/navbar";
import { NextAppDirEmotionCacheProvider } from "tss-react/next/appDir";
import AppMuiThemeProvider from "@/shared/AppMuiThemeProvider";

export const metadata = {
  title: "Ready, Jet Set, Go!",
  description:
    "Welcome to your itinerary travel planner, the ultimate companion for seamless trip organization and unforgettable adventures!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="./favicon.ico" sizes="any" />
      </head>
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
