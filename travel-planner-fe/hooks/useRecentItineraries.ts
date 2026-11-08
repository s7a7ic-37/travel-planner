"use client";
import { useEffect, useState } from "react";
import {
  HISTORY_KEY,
  readRecentItineraries,
  rememberItinerary,
  type Plan,
} from "@/lib/demo";

export function useRecentItineraries() {
  const [recent, setRecent] = useState<ReturnType<typeof readRecentItineraries>>([]);
  useEffect(() => {
    const refresh = () => {
      try { setRecent(readRecentItineraries(localStorage.getItem(HISTORY_KEY))); }
      catch { setRecent([]); }
    };
    refresh();
    window.addEventListener("plannerhistorychange", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("plannerhistorychange", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return recent;
}

export function addRecentItinerary(plan: Plan) {
  const items = rememberItinerary(
    readRecentItineraries(localStorage.getItem(HISTORY_KEY)),
    plan,
  );
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("plannerhistorychange"));
}

export function clearRecentItineraries() {
  localStorage.removeItem(HISTORY_KEY);
  window.dispatchEvent(new Event("plannerhistorychange"));
}
