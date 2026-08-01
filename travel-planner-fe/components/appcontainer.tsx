"use client";
import Box from "@mui/material/Box";
export default function Container({ children }: { children: React.ReactNode }) {
  return <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3 }, boxSizing: "border-box" }}>{children}</Box>;
}
