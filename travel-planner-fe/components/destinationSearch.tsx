"use client";
// @ts-nocheck
import React, { useState } from "react";
// import { SearchBox } from "@mapbox/search-js-react";
// import styles from "../app/page.module.css";
import { SearchBoxRetrieveResponse } from "@mapbox/search-js-core";
import dynamic from "next/dynamic";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import { Typography } from "@mui/material";

const accessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
const DynamicSearchBox = dynamic(
  () => import("@mapbox/search-js-react").then((module) => module.SearchBox),
  {
    ssr: false,
  }
);

interface DestinationProps {
  handleNextPage: () => void;
  setLng: React.Dispatch<React.SetStateAction<number | null>>;
  setLat: React.Dispatch<React.SetStateAction<number | null>>;
  setDestination: React.Dispatch<React.SetStateAction<string>>;
  destination: string;
}

export default function Destination({
  handleNextPage,
  setLng,
  setLat,
  setDestination,
  destination,
}: DestinationProps) {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleNextPage();
    e.preventDefault();
  };

  const handleRetrieve = (e: SearchBoxRetrieveResponse) => {
    setLng(e.features[0].properties.coordinates.longitude);
    setLat(e.features[0].properties.coordinates.latitude);
    setDestination(e.features[0].properties.name);
    setIsDisabled(false);
  };

  const handleChange = () => {
    setIsDisabled(true);
  };
  if (!accessToken) {
    return (
      <div>
        Live destination search is unavailable in this personal fork.
        <a href="/demo/">Try the sample itinerary planner</a> without signing in.
      </div>
    );
  }
  return (
    <Stack gap={5} height="80vh" justifyContent="center" alignItems="center">
      <Typography
        textAlign={"center"}
        sx={{
          textShadow: "0px 0px 20px black",
        }}
        variant="h3"
      >
        Where are you headed?
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <DynamicSearchBox
            options={{
              language: "en",
              types: "place",
            }}
            value={destination}
            accessToken={accessToken}
            onRetrieve={handleRetrieve}
            onChange={handleChange}
          />

          <Button variant="contained" disabled={isDisabled} type="submit">
            Continue
          </Button>
        </FormControl>
      </form>
    </Stack>
  );
}
