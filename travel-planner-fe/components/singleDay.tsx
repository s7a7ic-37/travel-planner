"use client";

import { useSearchParams, usePathname } from "next/navigation";
import { PlacesMap } from "@/components/placesMap";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import MobileStepper from "@mui/material/MobileStepper";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import restaurant1 from "@/public/restaurant/restaurant1.avif";
import restaurant2 from "@/public/restaurant/restaurant2.avif";
import restaurant3 from "@/public/restaurant/restaurant3.avif";
import place1 from "@/public/place/place1.jpg";
import place2 from "@/public/place/place2.jpg";
import place3 from "@/public/place/place3.jpg";
import React from "react";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { parseDayQuery } from "@/lib/itinerary";

const restaurantImages = [restaurant1, restaurant2, restaurant3];
const placeImages = [place1, place2, place3];


type itemProperties = {
  name: string;
  full_address: string;
};

interface PlaceCardProps {
  name: string;
  address: string;
  image: string;
}

const PlaceCard = ({ name, address, image }: PlaceCardProps) => {
  return (
    <>
      <CardMedia component="img" height="140" image={image} alt={name} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {address}
        </Typography>
      </CardContent>
    </>
  );
};

interface CarouselProps {
  children: React.ReactNode;
  maxSteps: number;
  category: string;
}

const Carousel = ({ children, maxSteps, category }: CarouselProps) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };
  return (
    <Card sx={{ maxWidth: 345 }}>
      <Paper
        square
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          height: 50,
          pl: 2,
          bgcolor: "background.default",
        }}
      >
        <Typography>{category}</Typography>
      </Paper>
      {React.Children.toArray(children)[Math.min(activeStep, maxSteps - 1)]}
      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            Next
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />
    </Card>
  );
};

export default function SingleDay() {
  const searchParams = useSearchParams();
  const currentDay = usePathname().match(/day-(\d+)/)?.[1] || "";
  const places = searchParams.get("places") || null;
  const restaurants = searchParams.get("restaurants") || null;
  const destinationCoordinates =
    searchParams.get("destination_coordinates") || null;
  const destination = searchParams.get("destination") || "";

  let parsed;
  try {
    parsed = parseDayQuery(places, restaurants, destinationCoordinates);
  } catch {
    return <Paper sx={{p:3}}><Typography role="alert">This itinerary link is incomplete or invalid.</Typography><Button href="/demo/">Open the guest demo</Button></Paper>;
  }
  const {places:parsedPlaces,restaurants:parsedRestaurants,coordinates:parsedCoordinates} = parsed;

  return (
    <>
      <Typography
        sx={{
          textShadow: "0px 0px 20px black",
        }}
        variant="h3"
      >
        Day {currentDay}
      </Typography>
      <Stack
        alignContent={"center"}
        gap={2}
        sx={{
          p: 1,
        }}
      >
        <PlacesMap
          places={parsedPlaces}
          restaurants={parsedRestaurants}
          destinationCoordinates={parsedCoordinates}
        />
        <Stack alignContent={"center"} alignItems={"center"} gap={2}>
          <Carousel category="Places to Visit" maxSteps={parsedPlaces.length}>
            {parsedPlaces.map(
              ({ name, full_address }: itemProperties, index: number) => (
                <PlaceCard
                  key={index + name}
                  name={name}
                  address={full_address}
                  image={placeImages[index % placeImages.length].src}
                />
              )
            )}
          </Carousel>
          <Carousel category="Restaurants to Visit" maxSteps={parsedRestaurants.length}>
            {parsedRestaurants.map(
              ({ name, full_address }: itemProperties, index: number) => (
                <PlaceCard
                  key={index + name}
                  name={name}
                  address={full_address}
                  image={restaurantImages[index % restaurantImages.length].src}
                />
              )
            )}
          </Carousel>
        </Stack>

        <Button
          variant="contained"
          href={`/itineraries?destination=${encodeURIComponent(destination)}`}
        >
          Return to itinerary
        </Button>
      </Stack>
    </>
  );
}
