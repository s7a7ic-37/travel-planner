"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DownloadOutlined from "@mui/icons-material/DownloadOutlined";
import BookmarkBorder from "@mui/icons-material/BookmarkBorder";
import PrintOutlined from "@mui/icons-material/PrintOutlined";
import {
  createPlan,
  availablePlaces,
  destinations,
  interests,
  moveStop,
  replaceStop,
  restorePlan,
  exportPlan,
  importPlanFile,
  type Interest,
  type City,
  type Plan,
} from "@/lib/demo";
import { addRecentItinerary, useRecentItineraries } from "@/hooks/useRecentItineraries";
import styles from "./page.module.css";

const STORAGE_KEY = "travel-planner-personal-demo-v1";

export default function DemoPlanner() {
  const [days, setDays] = useState(2);
  const [city, setCity] = useState<City>("Manchester");
  const [preferences, setPreferences] = useState<Interest[]>([]);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const itineraryRef = useRef<HTMLElement>(null);
  const variation = useRef(0);
  // A file read must not replace planner changes made while it was pending.
  const revision = useRef(0);
  const recent = useRecentItineraries();
  const searchParams = useSearchParams();
  const router = useRouter();
  const newPlanRequest = searchParams.get("new");
  const historyRequest = searchParams.get("history");
  const activePlan = plan?.city === city ? plan : null;

  useEffect(() => {
    try {
      // Browser storage is restored after hydration so the initial markup stays consistent.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSaved(Boolean(localStorage.getItem(STORAGE_KEY)));
    } catch {
      setMessage(
        "Browser storage is unavailable. You can still build and print a plan.",
      );
    }
  }, []);

  useEffect(() => {
    if (newPlanRequest !== null) {
      revision.current += 1;
      // Apply the menu's URL command once, then remove it from the URL below.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlan(null);
      setCity("Manchester");
      setDays(2);
      setPreferences([]);
      variation.current = 0;
      setMessage("Choose a city and interests to start a new itinerary.");
      router.replace("/demo/#plan-controls");
      return;
    }
    if (historyRequest === null || recent.length === 0) return;
    const item = recent.find(({ id }) => id === historyRequest);
    if (!item) return;
    revision.current += 1;
    setPlan(item.plan);
    setCity(item.plan.city);
    setDays(item.plan.days);
    setPreferences(item.plan.preferences);
    setMessage("Past itinerary loaded from this browser.");
    router.replace("/demo/#plan-controls");
  }, [newPlanRequest, historyRequest, recent, router]);

  function generate(event: React.FormEvent) {
    event.preventDefault();
    revision.current += 1;
    try {
      let next = createPlan(days, preferences, variation.current, city);
      variation.current += 1;
      if (plan && next.stops.every((stop, index) => stop.id === plan.stops[index]?.id)) {
        next = createPlan(days, preferences, variation.current, city);
        variation.current += 1;
      }
      setPlan(next);
      try {
        addRecentItinerary(next);
        setMessage("Itinerary ready. Added to recent itineraries.");
      } catch {
        setMessage("Itinerary ready. Recent history could not be saved in this browser.");
      }
      requestAnimationFrame(() => itineraryRef.current?.scrollIntoView({ block: "start" }));
    } catch {
      setMessage("Choose one to seven whole days.");
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
      setSaved(true);
      setMessage("Saved in this browser.");
    } catch {
      setMessage(
        "The browser could not save this plan. Try printing a copy instead.",
      );
    }
  }

  function load() {
    revision.current += 1;
    try {
      const loaded = restorePlan(localStorage.getItem(STORAGE_KEY) || "");
      setPlan(loaded);
      setDays(loaded.days);
      setCity(loaded.city);
      setPreferences(loaded.preferences);
      setMessage("Saved itinerary loaded.");
    } catch {
      setMessage(
        "That saved plan could not be read. Build a new plan to replace it.",
      );
    }
  }

  function clearSaved() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setSaved(false);
      setMessage("Saved copy removed. Your open plan is still here.");
    } catch {
      setMessage("Browser storage could not be updated.");
    }
  }

  function download() {
    if (!plan) return;
    const url = URL.createObjectURL(new Blob([exportPlan(plan)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${plan.city.toLowerCase()}-sample-plan.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Downloaded your sample plan. Import it in another browser to continue.");
  }

  async function importFile(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    const requested = ++revision.current;
    input.value = "";
    try {
      const imported = await importPlanFile(file);
      if (requested !== revision.current) return;
      setPlan(imported);
      setDays(imported.days);
      setCity(imported.city);
      setPreferences(imported.preferences);
      setMessage("Imported the sample plan. Your saved browser copy is unchanged until you save.");
    } catch {
      if (requested !== revision.current) return;
      setMessage("That plan could not be imported. Use a valid sample-plan JSON file under 6 KB. Your open plan is unchanged.");
    }
  }

  return (
    <main className={styles.demo}>
      <div className={styles.hero}>
      <div className={styles.heading}>
        <h1>Your {city}.<br /><span>Your way.</span></h1>
        <div className={styles.heroActions}><a className={styles.startLink} href="#plan-controls">Plan a city day <span aria-hidden="true">↗</span></a></div>
      </div>
      <aside className={styles.cityCard} aria-label={city}>
        <div className={styles.cityLabel}><span>{city}</span><span>UK ↗</span></div>
        <svg viewBox="0 0 340 150" role="img" aria-label="Abstract city skyline illustration, not a map">
          <path d="M12 132H328M35 132V68H72V132M81 132V91H119V132M134 132V51H172V132M183 132V78H214V132M230 132V36H265V132M278 132V93H311V132" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M142 51V38H165V51M150 38V17M237 36V25H258V36" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M50 84H58M50 101H58M93 106H105M146 70H159M146 88H159M146 106H159M242 57H252M242 77H252M242 97H252M288 108H299" stroke="currentColor" strokeWidth="3" />
          <circle cx="294" cy="32" r="15" fill="#e9b78e" /><path d="M16 146C75 120 112 150 169 140S277 143 329 146" fill="none" stroke="#b5482b" strokeWidth="3" />
        </svg>
        <h2>A little city escape.</h2>
        <div className={styles.cityStats}><span><b>01—07</b>days</span><span><b>{availablePlaces(city).length}</b>places</span><span><b>YOUR</b>order</span></div>
      </aside>
      </div>
      <div className={styles.layout}>
        <form id="plan-controls" className={styles.controls} onSubmit={generate}>
          <h2>Make a plan</h2>
          <label htmlFor="destination">Destination</label>
          <select id="destination" value={city} onChange={(event) => {
            revision.current += 1;
            setCity(event.target.value as City);
            setPlan(null);
            variation.current = 0;
            setMessage(`Ready to build a new ${event.target.value} itinerary.`);
          }}>
            {destinations.map((destination) => <option key={destination} value={destination}>{destination}, UK</option>)}
          </select>
          <label htmlFor="days">How many days?</label>
          <input
            id="days"
            type="number"
            inputMode="numeric"
            min="1"
            max="7"
            step="1"
            required
            value={days}
            onChange={(event) => {
              revision.current += 1;
              setDays(Number(event.target.value));
            }}
          />
          <fieldset>
            <legend>What do you enjoy?</legend>
            {interests.map((interest) => (
              <label key={interest} className={styles.choice}>
                <input
                  type="checkbox"
                  checked={preferences.includes(interest)}
                  onChange={() => {
                    revision.current += 1;
                    setPreferences((current) =>
                      current.includes(interest)
                        ? current.filter((value) => value !== interest)
                        : [...current, interest],
                    );
                  }}
                />
                {interest}
              </label>
            ))}
          </fieldset>
          <button type="submit">{activePlan ? "Try another plan ↻" : "Build itinerary →"}</button>
          {saved && (
            <div className={styles.saved}>
              <button type="button" onClick={load}>
                Load saved plan
              </button>
              <button type="button" onClick={clearSaved}>
                Remove saved copy
              </button>
            </div>
          )}
          <details className={styles.transfer}><summary>Transfer an itinerary (JSON)</summary>
            <p className={styles.small}>A JSON file is a portable, plain-text copy of your city, trip length, interests and stop order. It can be inspected or imported on another device; it is read in this browser and never uploaded.</p>
            <label htmlFor="import-plan">Import an itinerary file</label>
            <input id="import-plan" type="file" accept=".json,application/json" onChange={importFile} aria-describedby="import-help" />
            <p className={styles.small} id="import-help">A valid file replaces the open plan. Your saved copy stays unchanged. Files are read here, never uploaded.</p>
          </details>
        </form>
        <section
          className={styles.itinerary}
          ref={itineraryRef}
          aria-label="Your itinerary"
        >
          {!activePlan ? (
            <div className={styles.empty}>
              <span className={styles.emptyMark} aria-hidden="true">↗</span>
              <h2>Where will the day take you?</h2>
              <p>Choose your days and interests to get started.</p>
            </div>
          ) : (
            <>
              <div className={styles.planHeading}>
                <div>
                  <p className={styles.eyebrow}>
                    {activePlan.city.toUpperCase()} / {activePlan.days} {activePlan.days === 1 ? "DAY" : "DAYS"}
                  </p>
                  <h2>Your itinerary</h2>
                </div>
                <div className={styles.actions}>
                  <button type="button" onClick={save}>
                    <BookmarkBorder fontSize="small" /> Save locally
                  </button>
                  <button type="button" onClick={download}><DownloadOutlined fontSize="small" /> Export JSON</button>
                  <button type="button" onClick={() => window.print()}>
                    <PrintOutlined fontSize="small" /> Print / PDF
                  </button>
                </div>
              </div>
              {Array.from({ length: activePlan.days }, (_, day) => (
                <article className={styles.day} key={day}>
                  <h3>
                    <span>{String(day + 1).padStart(2, "0")}</span><span>Day {day + 1}</span>
                  </h3>
                  <ol>
                    {activePlan.stops
                      .slice(day * 2, day * 2 + 2)
                      .map((stop, offset) => {
                        const index = day * 2 + offset;
                        return (
                          <li key={index}>
                            <div>
                              <span className={styles.category} data-category={stop.category.toLowerCase().replaceAll(" & ", "-").replaceAll(" ", "-")}>
                                {stop.category}
                              </span>
                              <h4>{stop.name}</h4>
                              <p>{stop.note}</p>
                              <a
                                href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(stop.name + ", " + activePlan.city)}`}
                              >
                                Find on OpenStreetMap ↗
                              </a>
                              <select
                                className={styles.replace}
                                aria-label={`Replace ${stop.name}`}
                                value=""
                                onChange={(event) => {
                                  revision.current += 1;
                                  const replacement = event.target.value;
                                  setPlan(current => current && replaceStop(current, index, replacement));
                                  setMessage("Stop replaced. Your saved copy is unchanged until you save.");
                                }}
                              >
                                <option value="" disabled>Replace this stop…</option>
                                {availablePlaces(activePlan.city)
                                  .filter(place => !activePlan.stops.some(selected => selected.id === place.id))
                                  .map(place => <option key={place.id} value={place.id}>{place.name} · {place.category}</option>)}
                              </select>
                            </div>
                            <div className={styles.reorder}>
                              <button
                                type="button"
                                aria-label={`Move ${stop.name} earlier`}
                                disabled={index === 0}
                                onClick={() => {
                                  revision.current += 1;
                                  setPlan(
                                    (current) =>
                                      current && moveStop(current, index, -1),
                                  );
                                }}
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                aria-label={`Move ${stop.name} later`}
                                disabled={index === activePlan.stops.length - 1}
                                onClick={() => {
                                  revision.current += 1;
                                  setPlan(
                                    (current) =>
                                      current && moveStop(current, index, 1),
                                  );
                                }}
                              >
                                ↓
                              </button>
                            </div>
                          </li>
                        );
                      })}
                  </ol>
                </article>
              ))}
            </>
          )}
          <p className={styles.message} role="status" aria-live="polite">
            {message}
          </p>
        </section>
      </div>
      <p className={styles.links}>
        <a href="https://portfolio.artemislab.co.uk/#projects">
          ← All projects
        </a>
        <a href="https://github.com/s7a7ic-37/travel-planner">
          Source ↗
        </a>
      </p>
    </main>
  );
}
