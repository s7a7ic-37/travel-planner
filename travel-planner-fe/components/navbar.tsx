"use client";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Link from "next/link";
import styles from "./navbar.module.css";
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
    <header className={styles.bar}>
      <Link href="/demo/" className={styles.brand}><img src="/favicon.svg" width="38" height="38" alt="" /><span><strong>Ready, Jet Set, Go!</strong><small>CITY FIELD NOTES · PERSONAL FORK</small></span></Link>
      <a className={styles.source} href="https://github.com/s7a7ic-37/travel-planner">Source & team credit ↗</a>
      <IconButton aria-label="Open navigation menu" aria-expanded={open} sx={{ borderRadius: 2, minWidth: 44, minHeight: 44, bgcolor: "#fffdf7", color: "#24354a", border: "1px solid #d9d2c4" }} onClick={toggleMenu}>
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
    </header>
  );
};

export default Navbar;
