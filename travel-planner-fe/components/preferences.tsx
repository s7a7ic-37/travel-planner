"use client";
import { useState } from "react";
import { redirect } from "next/navigation";
import {
  fetchPlaces,
  fetchRestaurants,
  transformData,
} from "@/utils/placesUtils";
import Chip from "@mui/material/Chip";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Circle from "@mui/icons-material/Circle";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import MuseumIcon from "@mui/icons-material/Museum";
import PaletteIcon from "@mui/icons-material/Palette";
import HikingIcon from "@mui/icons-material/Hiking";
import ParkIcon from "@mui/icons-material/Park";
import WineBarIcon from "@mui/icons-material/WineBar";
import AttractionsIcon from "@mui/icons-material/Attractions";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { useContext } from "react";
import { AuthContext } from "@/app/context/AuthContext";
import firebase_app from "@/app/firebase/config";
import { getFirestore } from "firebase/firestore";
import { writeDataToFirebase } from "@/utils/firebaseUtils";
import { Typography } from "@mui/material";

interface PreferencesProps {
  handlePrevPage: () => void;
  currentPage: number;
  lng: number | null;
  lat: number | null;
  numDays: number | null;
  destination: string;
}

export default function Preferences({
  handlePrevPage,
  lng,
  lat,
  numDays,
  destination,
}: PreferencesProps) {
  const [preferences, setPreferences] = useState<Set<string>>(new Set());
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useContext(AuthContext);
  const allCategories = [
    {
      name: "Beach",
      category: "beach",
      icon: <BeachAccessIcon />,
    },
    {
      name: "Museum",
      category: "museum",
      icon: <MuseumIcon />,
    },
    {
      name: "Art",
      category: "art",
      icon: <PaletteIcon />,
    },
    {
      name: "Mountain",
      category: "mountain",
      icon: <HikingIcon />,
    },
    {
      name: "Park",
      category: "park",
      icon: <ParkIcon />,
    },
    {
      name: "Winery",
      category: "winery",
      icon: <WineBarIcon />,
    },
    {
      name: "Theme Park",
      category: "theme_park",
      icon: <AttractionsIcon />,
    },
    {
      name: "Garden",
      category: "garden",
      icon: <LocalFloristIcon />,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dayNum = numDays ? numDays : 1;
    if (lng === null || lat === null || !user || isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      const db = getFirestore(firebase_app);
      const [placesData, restaurantsData] = await Promise.all([
        fetchPlaces(preferences, lng, lat),
        fetchRestaurants(lng, lat),
      ]);

      const transformedPlaces = transformData(dayNum, placesData);

      const transformedRestaurants = transformData(dayNum, restaurantsData);

      const destination_coordinates = { lng, lat };

      await writeDataToFirebase(
        db,
        user.uid,
        transformedPlaces,
        transformedRestaurants,
        destination,
        destination_coordinates
      );

      setRedirectUrl(
        `/itineraries?destination=${encodeURIComponent(destination)}`
      );
    } catch (error) {
      setError("The itinerary could not be saved. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (redirectUrl) {
    redirect(redirectUrl);
  }

  const handleReturn = (e: React.MouseEvent<HTMLButtonElement>) => {
    handlePrevPage();
    e.preventDefault();
  };

  const handleToggle = (category: string) => {
    setPreferences((currPreferences) => {
      const cloned = new Set(currPreferences);
      const isSelected = currPreferences.has(category);
      if (isSelected) {
        cloned.delete(category);
      } else {
        cloned.add(category);
      }
      return cloned;
    });
  };

  return (
    <Stack gap={5} height="80vh" justifyContent="center" alignItems="center">
      <Typography
        textAlign="center"
        variant="h6"
        sx={{
          textShadow: "0px 0px 20px black",
        }}
      >{`Finally, tell us what you enjoy doing when you're away...`}</Typography>
      <Stack
        sx={{
          background: "white",
          bgcolor: "background.paper",
          borderRadius: "16px",
          padding: "16px",
        }}
        gap={2}
      >
        {allCategories.map(({ name, category, icon }) => {
          const isSelected = preferences.has(category);
          return (
            <Chip
              size="medium"
              sx={{
                width: "200px",
              }}
              onClick={() => {
                handleToggle(category);
              }}
              label={category}
              key={category}
              onDelete={() => {
                handleToggle(category);
              }}
              color={isSelected ? "secondary" : "primary"}
              icon={icon}
              deleteIcon={isSelected ? <CheckCircle /> : <Circle />}
              variant={isSelected ? "filled" : "outlined"}
            />
          );
        })}
      </Stack>
      <Stack alignContent="space-around" direction="row">
        <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving plan…" : "Generate plan"}
        </Button>
        <Button variant="contained" onClick={handleReturn}>
          Return
        </Button>
      </Stack>
      {error && <Typography role="alert">{error}</Typography>}
    </Stack>
  );
}
