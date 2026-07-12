"use client";

import { useState, useEffect, useContext } from "react";
import { getFirestore } from "firebase/firestore";
import { orange, red } from "@mui/material/colors";
import { useSearchParams } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import firebase_app from "@/app/firebase/config";
import { fetchDataFromFirebase } from "@/utils/firebaseUtils";
import Typography from "@mui/material/Typography";
import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import LoadingPage from "@/components/loadingPage";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

function Itinerary() {
  const [currentDay, setCurrentDay] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination") || "";
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [itineraryData, setItineraryData] = useState({
    places: [],
    restaurants: [],
    destination_coordinates: {},
  });

  useEffect(() => {
    if (!user?.uid || !destination) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const db = getFirestore(firebase_app);
        const data = await fetchDataFromFirebase(db, user.uid, destination);
        setItineraryData(data);
      } catch {
        setError("The itinerary could not be loaded. Return to your trips and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.uid, destination]);

  if (isLoading) {
    return <LoadingPage />;
  }

  const days = itineraryData.places.length / 3;
  return (
    <Stack justifyContent="center" alignItems="center">
      {error && <Typography role="alert">{error}</Typography>}
      <Typography
        variant="h5"
        align="center"
        sx={{
          textShadow: "0px 0px 20px black",
        }}
      >
        Here is a day by day plan for your trip to {destination}. Enjoy your
        travel!
      </Typography>
      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {Array.from({ length: days }, (_, index) => (
          <TimelineItem key={index}>
            <TimelineContent
              onClick={() => setCurrentDay(index)}
              sx={{
                height: `${60 / days}vh`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "50vw",
              }}
            >
              <Button
                fullWidth
                variant="contained"
                href={`/itineraries/day-${
                  index + 1
                }?places=${encodeURIComponent(
                  JSON.stringify(
                    itineraryData.places.slice(index * 3, index * 3 + 3)
                  )
                )}&restaurants=${encodeURIComponent(
                  JSON.stringify(
                    itineraryData.restaurants.slice(index * 3, index * 3 + 3)
                  )
                )}&destination_coordinates=${encodeURIComponent(
                  JSON.stringify(itineraryData.destination_coordinates)
                )}&destination=${encodeURIComponent(destination)}`}
              >
                <Typography variant="h2" align="center">
                  Day {index + 1}
                </Typography>
              </Button>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
      <Button variant="contained" href="/trips">
        Return to your trips
      </Button>
    </Stack>
  );
}

export default Itinerary;
