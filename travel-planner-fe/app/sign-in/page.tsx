"use client";
import { useContext, useEffect, useState } from "react";
import signIn from "../firebase/auth/signIn";
import { AuthContext } from "../context/AuthContext";
import resetPassword from "../firebase/auth/resetPassword";
import { getErrorMessage } from "../firebase/authErrors";
import firebase_app from "../firebase/config";
import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";

export default function SignIn() {
  // SignIn  form
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState("");

  // Reset password form
  const [showResetPassword, setShowResetPassword] = useState(false);

  useEffect(() => {
    if (user) {
      redirect("/home");
    }
  }, [user]);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);
    const formEmail = data.get("email") as string;
    const formPassword = data.get("password") as string;
    try {
      const { error } = await signIn(formEmail, formPassword);
      if (error) {
        setStatus(getErrorMessage(error.code));
      } else {
        redirect("/home");
      }
    } catch (error) {
      setStatus("An error occurred during sign-in");
    }
  };

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);
    const formEmail = data.get("email") as string;
    try {
      const { error } = await resetPassword(formEmail);
      setStatus(error ? getErrorMessage(error.code) : "Password reset email sent");
    } catch (error) {
      setStatus("Failed to reset password");
    }
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    if (showResetPassword) {
      handleResetPassword(event);
    } else {
      handleSignIn(event);
    }
  };

  const toggleResetPassword = () => {
    setShowResetPassword(!showResetPassword);
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
            {showResetPassword ? "Reset password" : "Sign in"}
          </Typography>
          <form onSubmit={handleFormSubmit}>
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
              disabled={showResetPassword}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              inputProps={{ minLength: 6 }}
              sx={{
                visibility: showResetPassword ? "hidden" : "visible",
              }}
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
              {showResetPassword ? "Reset password" : "Sign in"}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link
                  sx={{
                    textShadow: "0px 0px 20px black",
                  }}
                  href="#"
                  onClick={toggleResetPassword}
                  variant="body2"
                >
                  {showResetPassword ? "Sign in" : "Forgot password?"}
                </Link>
              </Grid>
              <Grid item>
                <Link
                  sx={{
                    textShadow: "0px 0px 20px black",
                  }}
                  href="/sign-up"
                  variant="body2"
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
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
