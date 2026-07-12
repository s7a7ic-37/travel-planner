"use client";
import Link from "@mui/material/Link";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import { redirect } from "next/navigation";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useBackgroundImage } from "@/shared/AppMuiThemeProvider";
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
    <Stack gap={5} height="80vh" justifyContent="center">
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
        variant="h6"
      >
        Welcome to your itinerary travel planner, the ultimate companion for
        seamless trip organization and unforgettable adventures!
      </Typography>
      <Button variant="contained" href="/sign-in">
        {firebase_app.options.apiKey ? "Sign in" : "About the original sign-in"}
      </Button>
      <Button variant="contained" href="/demo/">Try the guest itinerary demo</Button>
      <Typography textAlign="center">Personal maintenance fork of a four-person Northcoders project (2023). The guest demo uses example places and saves only in this browser.</Typography>
      <br></br>
      <Typography
        sx={{
          textShadow: "0px 0px 20px black",
        }}
        textAlign="center"
      >
        If you do not have an account, <Link href="/sign-up">sign up here</Link>
      </Typography>
    </Stack>
  );
}
