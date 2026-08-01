"use client";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "./landing.module.css";

export default function LandingPage() {
  const { user } = useContext(AuthContext);
  useEffect(() => { if (user) redirect("/home"); }, [user]);
  return <main className={styles.landing}>
    <div><p className={styles.eyebrow}>A SMALL PLAN. A GOOD CITY DAY.</p><h1>Your next city day,<br /><em>loosely planned.</em></h1>
    <p className={styles.lede}>Start with Manchester. Pick a few interests, shape one to three days and leave room for the places in between.</p>
    <div className={styles.actions}><Link href="/demo/">Open the city planner ↗</Link><Link href="/sign-in/">About guest access</Link></div>
    <p className={styles.note}>A browser-local sample. No account, live booking or location tracking.</p></div>
    <aside className={styles.postcard}><span>THE MANCHESTER EDITION</span><img src="/favicon.svg" width="100" height="100" alt="" /><h2>Go somewhere.<br />Keep it simple.</h2><p>01—03 days / 06 sample places</p><Link href="/demo/">Make your field notes →</Link></aside>
    <footer>Personal maintenance fork of a four-person Northcoders project. <a href="https://github.com/lai1372/travel-planner">Original team repository ↗</a></footer>
  </main>;
}
