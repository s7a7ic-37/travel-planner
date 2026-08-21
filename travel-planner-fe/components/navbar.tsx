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
      <Link href="/demo/" className={styles.brand}><img src="/favicon.svg" width="38" height="38" alt="" /><strong>Ready, Jet Set, Go!</strong></Link>
      <a className={styles.source} href="https://github.com/s7a7ic-37/travel-planner">GitHub ↗</a>
      <IconButton aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} aria-controls="travel-planner-drawer" sx={{ borderRadius: 2, minWidth: 44, minHeight: 44, border: "1px solid", borderColor: "divider" }} onClick={toggleMenu}>
        {open ? <span aria-hidden="true">×</span> : <MenuIcon />}
      </IconButton>
      <SwipeableDrawer
        PaperProps={{ id: "travel-planner-drawer", sx: { width: "min(390px, 92vw)", bgcolor: "background.paper", color: "text.primary" } }}
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
