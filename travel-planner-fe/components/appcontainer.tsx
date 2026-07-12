"use client";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CssBaseline from "@mui/material/CssBaseline";
interface ContainerProps {
  children: React.ReactNode;
}
function Container({ children }: ContainerProps) {
  return (
    <>
      <Box
        sx={{
          p: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            p: 1,
            width: "100%",
            maxWidth: 1200,
          }}
        >
          {children}
        </Stack>
      </Box>
    </>
  );
}

export default Container;
