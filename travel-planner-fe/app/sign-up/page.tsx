"use client";
import React, { useContext, useEffect, useState } from "react";
import signUp from "../firebase/auth/signUp";
import { getErrorMessage } from "../firebase/authErrors";
import firebase_app from "../firebase/config";
import { redirect } from "next/navigation";
import { AuthContext } from "../context/AuthContext";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";

export default function SignUp() {
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (user) {
      redirect("/home");
    }
  }, [user]);

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);
    const formEmail = data.get("email") as string;
    const formPassword = data.get("password") as string;
    const formName = data.get("name") as string;
    try {
      const { error, result } = await signUp(formEmail, formPassword, formName);
      if (error) {
        setStatus(getErrorMessage(error.code));
      } else if (result) {
        setStatus("Account created!");
        redirect("/home");
      }
    } catch (error) {
      setStatus("An error occurred during sign-in");
    }
  };

  if (!firebase_app.options.apiKey) return <Container component="main"><Typography variant="h4">Guest access only</Typography><Typography>Use the planner without an account.</Typography><Button href="/demo/">Open the guest itinerary planner</Button></Container>;
  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            sx={{
              textShadow: "0px 0px 20px black",
            }}
            component="h1"
            variant="h5"
          >
            Sign up
          </Typography>
          <form onSubmit={handleSignUp}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="email"
              autoFocus
              type="text"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              type="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              inputProps={{ minLength: 6 }}
            />
            <Box sx={{ textAlign: "center", height: "16px" }}>
              <Typography fontWeight="bold">{status}</Typography>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign up
            </Button>
            <Link
              sx={{
                textShadow: "0px 0px 20px black",
              }}
              href="/sign-in"
              variant="body2"
            >
              {"Already have an account? Sign in"}
            </Link>
          </form>
        </Box>
      </Container>
      <Button
        sx={{
          my: 10,
          p: 1,
        }}
        href={"/"}
        variant="contained"
      >
        Back
      </Button>
    </>
  );
}
