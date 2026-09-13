"use client";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "./landing.module.css";
import { destinations } from "@/lib/demo";

export default function LandingPage() {
  const { user } = useContext(AuthContext);
  useEffect(() => { if (user) redirect("/home"); }, [user]);
  return <main className={styles.landing}>
    <div><h1>A city break.<br /><em>Your kind of day.</em></h1>
    <div className={styles.actions}><Link href="/demo/">Open the city planner ↗</Link></div>
    </div>
    <aside className={styles.postcard}><span>FIVE CITY EDITIONS</span><img src="/logo.png" width="160" height="100" alt="Ready, Jet Set, Go!" /><h2>Go somewhere.<br />Keep it simple.</h2><p>1–7 days / {destinations.length} UK cities</p><Link href="/demo/">Make your field notes →</Link></aside>
    <footer><a href="https://github.com/s7a7ic-37/travel-planner">Source ↗</a></footer>
  </main>;
}
