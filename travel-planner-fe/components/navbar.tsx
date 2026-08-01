"use client";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import MenuIcon from "@mui/icons-material/Menu";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import HamburgerList from "./hamburgerMenu";
import CurrentUser from "./currentUserComponent";
const Navbar = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen(!open);
  };
  const handleOpenMenu = () => {
    setOpen(true);
  };
  const handleCloseMenu = () => {
    setOpen(false);
  };
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{
        p: 1,
      }}
    >
      <IconButton aria-label="Open navigation menu" aria-expanded={open} sx={{ borderRadius: 1, minWidth: 44, minHeight: 44, bgcolor: "rgba(255,255,255,.9)", color: "#203e3c" }} onClick={toggleMenu}>
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer
        onOpen={handleOpenMenu}
        open={open}
        onClose={handleCloseMenu}
      >
        <HamburgerList handleCloseMenu={handleCloseMenu} />
      </SwipeableDrawer>
      <CurrentUser />
    </Stack>
  );
};

export default Navbar;
