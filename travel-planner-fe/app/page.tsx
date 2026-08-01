"use client";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import { redirect } from "next/navigation";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Logo from "@/components/logo";
import firebase_app from "./firebase/config";

export default function LandingPage() {
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (user) {
      redirect("/home");
    }
  }, [user]);
  return (
    <Stack gap={3} minHeight="80vh" justifyContent="center" sx={{ py: 3 }}>
      <Logo
        style={{
          display: "block",
          height: "20vh",
          width: "auto",
          objectFit: "contain",
        }}
      />
      <Typography
        sx={{
          textShadow: "0px 0px 20px black",
        }}
        textAlign="center"
        component="h1"
        variant="h6"
      >
        Build a day-by-day itinerary, with room to explore.
      </Typography>
      <Button variant="contained" href="/demo/">Try the guest itinerary demo</Button>
      <Button variant="contained" href="/sign-in">
        {firebase_app.options.apiKey ? "Sign in" : "About the original sign-in"}
      </Button>
      <Typography textAlign="center">Personal maintenance fork of a four-person Northcoders project (2023). The guest demo uses example places and saves only in this browser.</Typography>
    </Stack>
  );
}
