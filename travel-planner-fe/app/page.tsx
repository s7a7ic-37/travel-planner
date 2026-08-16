"use client";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "./landing.module.css";
import { places } from "@/lib/demo";

export default function LandingPage() {
  const { user } = useContext(AuthContext);
  useEffect(() => { if (user) redirect("/home"); }, [user]);
  return <main className={styles.landing}>
    <div><h1>A city break.<br /><em>Your kind of day.</em></h1>
    <div className={styles.actions}><Link href="/demo/">Open the city planner ↗</Link></div>
    </div>
    <aside className={styles.postcard}><span>THE MANCHESTER EDITION</span><img src="/favicon.svg" width="100" height="100" alt="" /><h2>Go somewhere.<br />Keep it simple.</h2><p>1–3 days / {places.length} places</p><Link href="/demo/">Make your field notes →</Link></aside>
    <footer><a href="https://github.com/s7a7ic-37/travel-planner">Source ↗</a></footer>
  </main>;
}
