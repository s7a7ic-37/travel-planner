"use client";
import styles from "../page.module.css";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import firebase_app from "@/app/firebase/config";
import {
  fetchDataFromFirebase,
  deleteDataFromFirebase,
} from "@/utils/firebaseUtils";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ButtonGroup from "@mui/material/ButtonGroup";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import LoadingPage from "@/components/loadingPage";

import { AuthContext } from "@/app/context/AuthContext";
import { getFirestore } from "firebase/firestore";
import { redirect } from "next/navigation";
import Divider from "@mui/material/Divider";
import { Paper } from "@mui/material";

export default function Trips() {
  const [trips, setTrips] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function fetchData() {
      if (!user?.uid) return;
      try {
        const db = getFirestore(firebase_app);
        setIsLoading(true);
        const data = await fetchDataFromFirebase(db, user.uid);
        const tripNames = Object.keys(data).sort((a, b) => {
          const timestampA = Date.parse(data[a].created_at);
          const timestampB = Date.parse(data[b].created_at);
          return timestampA - timestampB;
        });
        setTrips(tripNames);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    if (!user) {
      redirect("/sign-in");
    }
    fetchData();
  }, [user]);

  const handleDelete = async (destination: string) => {
    if (!user?.uid) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this itinerary?"
    );
    if (!confirmDelete) return;

    const db = getFirestore(firebase_app);
    await deleteDataFromFirebase(db, user?.uid, destination);
    setTrips((prevTrips) => prevTrips.filter((trip) => trip !== destination));
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <Stack gap={5} height="80vh" justifyContent="center" alignItems="center">
      <Typography
        sx={{
          textShadow: "0px 0px 20px black",
        }}
        textAlign="center"
        variant="h3"
        fontWeight="bold"
      >
        Your trips 🌎
      </Typography>
      <Paper
        sx={{
          p: 1,
        }}
      >
        <Stack gap={5} justifyContent="center" alignItems="center">
          {trips.length !== 0 ? (
            trips.map((trip, i) => (
              <ButtonGroup key={i}>
                <Button
                  variant="contained"
                  href={`/itineraries?destination=${encodeURIComponent(trip)}`}
                  component={Link}
                  size="large"
                  sx={{
                    width: "65vw",
                    maxWidth: "200px",
                    height: "80px",
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                >
                  <Typography fontWeight="bold">{trip}</Typography>
                </Button>
                <Divider />
                <Button
                  variant="contained"
                  onClick={() => {
                    handleDelete(trip);
                  }}
                  sx={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                  size="large"
                >
                  <DeleteIcon sx={{ color: "red" }} />
                </Button>
              </ButtonGroup>
            ))
          ) : (
            <Typography textAlign="center" variant="h3" fontWeight="bold">
              No trips found
            </Typography>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
