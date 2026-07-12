"use client";
import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

interface DurationProps {
  handleNextPage: () => void;
  handlePrevPage: () => void;
  numDays: number | null;
  setNumDays: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function Duration({
  handleNextPage,
  handlePrevPage,
  numDays,
  setNumDays,
}: DurationProps) {
  const [day, setDay] = useState<string>("Monday");
  const isDisabled = !Number.isInteger(numDays) || numDays === null || numDays < 1 || numDays > 7;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isDisabled) handleNextPage();
  };

  const handleReturn = () => {
    handlePrevPage();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setNumDays(value);
  };

  const handleSelect = (event: SelectChangeEvent<string>) => {
    setDay(event.target.value);
  };
  return (
    <Stack gap={5} height="80vh" justifyContent="center" alignItems="center">
      <form onSubmit={handleSubmit}>
        <FormControl
          fullWidth
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <Typography
            sx={{
              textShadow: "0px 0px 20px black",
            }}
            textAlign="center"
            variant="h3"
          >
            Tell us a little more about your trip
          </Typography>
          <FormControl fullWidth>
            <TextField
              label="How many days are you there for?"
              id="numDays"
              value={numDays ?? ""}
              type="number"
              inputProps={{ min: 1, max: 7 }}
              onChange={handleChange}
            />
          </FormControl>
          <Button variant="contained" type="submit" disabled={isDisabled}>
            Continue
          </Button>
          <Button variant="contained" onClick={handleReturn} type="button">
            Return
          </Button>
        </FormControl>
      </form>
    </Stack>
  );
}
