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
      <IconButton aria-label="Open navigation menu" style={{ borderRadius: 0 }} onClick={toggleMenu}>
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer
        onOpen={handleOpenMenu}
        open={open}
        onClose={handleCloseMenu}
        onKeyDown={handleCloseMenu}
      >
        <HamburgerList handleCloseMenu={handleCloseMenu} />
      </SwipeableDrawer>
      <CurrentUser />
    </Stack>
  );
};

export default Navbar;
