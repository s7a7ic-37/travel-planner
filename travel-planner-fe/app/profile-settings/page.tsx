"use client";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function ProfileSettings() {
  return (
    <Container component="main" maxWidth="sm">
      <Typography component="h1" variant="h4">Profile settings</Typography>
      <Typography sx={{ my: 2 }}>
        Account editing is unavailable. The guest
        itinerary demo works without an account and saves only in your browser.
      </Typography>
      <Button variant="contained" href="/demo/">Open the guest itinerary planner</Button>
    </Container>
  );
}
