"use client";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Close from "@mui/icons-material/Close";
import AddLocationAltOutlined from "@mui/icons-material/AddLocationAltOutlined";
import HistoryOutlined from "@mui/icons-material/HistoryOutlined";
import LoginOutlined from "@mui/icons-material/LoginOutlined";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import { useContext } from "react";
import { AuthContext } from "@/app/context/AuthContext";
import { useRecentItineraries, clearRecentItineraries } from "@/hooks/useRecentItineraries";
import styles from "./hamburgerMenu.module.css";

interface HamburgerListProps { handleCloseMenu: () => void }

export default function HamburgerList({ handleCloseMenu }: HamburgerListProps) {
  const { user } = useContext(AuthContext);
  const recent = useRecentItineraries();
  return (
    <Box className={styles.menu} component="nav" aria-label="Trip planner">
      <header className={styles.header}>
        <div><span className={styles.kicker}>FIELD NOTES / TRAVEL PLANNER</span><h2>Where to next?</h2></div>
        <IconButton aria-label="Close navigation menu" onClick={handleCloseMenu}><Close /></IconButton>
      </header>
      <NextLink className={styles.primary} href="/demo/?new=1" onClick={handleCloseMenu}>
        <AddLocationAltOutlined /><span><b>Start a new itinerary</b><small>Choose a city, interests and trip length</small></span>
      </NextLink>
      <Divider className={styles.divider} />
      <section aria-labelledby="recent-heading">
        <div className={styles.sectionHeading}><h3 id="recent-heading"><HistoryOutlined /> Recent itineraries</h3>{recent.length > 0 && <button type="button" onClick={clearRecentItineraries}>Clear</button>}</div>
        {recent.length === 0 ? <p className={styles.empty}>Plans you generate on this device will appear here.</p> : recent.map(({ id, createdAt, plan }) => (
          <NextLink key={id} className={styles.recent} href={`/demo/?history=${encodeURIComponent(id)}`} onClick={handleCloseMenu}>
            <b>{plan.city} · {plan.days} {plan.days === 1 ? "day" : "days"}</b>
            <time dateTime={new Date(createdAt).toISOString()}>{new Date(createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</time>
          </NextLink>
        ))}
      </section>
      <Divider className={styles.divider} />
      <div className={styles.account}>
        {user?.uid ? <><NextLink className={styles.navLink} href="/trips" onClick={handleCloseMenu}><HistoryOutlined /> Account itineraries</NextLink><NextLink className={styles.navLink} href="/logout" onClick={handleCloseMenu}><LogoutOutlined /> Sign out</NextLink></> : <NextLink className={styles.navLink} href="/sign-in" onClick={handleCloseMenu}><LoginOutlined /> Sign in</NextLink>}
      </div>
      <footer className={styles.footer}><Typography variant="caption">Recent guest plans stay in this browser.</Typography><a href="https://github.com/s7a7ic-37/travel-planner">Project source ↗</a></footer>
    </Box>
  );
}
