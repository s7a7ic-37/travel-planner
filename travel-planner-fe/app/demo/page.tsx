"use client";

import { useEffect, useState } from "react";
import {
  createPlan,
  interests,
  moveStop,
  restorePlan,
  type Interest,
  type Plan,
} from "@/lib/demo";
import styles from "./page.module.css";

const STORAGE_KEY = "travel-planner-personal-demo-v1";

export default function DemoPlanner() {
  const [days, setDays] = useState(2);
  const [preferences, setPreferences] = useState<Interest[]>([]);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      setSaved(Boolean(localStorage.getItem(STORAGE_KEY)));
    } catch {
      setMessage(
        "Browser storage is unavailable. You can still build and print a plan.",
      );
    }
  }, []);

  function generate(event: React.FormEvent) {
    event.preventDefault();
    try {
      setPlan(createPlan(days, preferences));
      setMessage("Sample itinerary ready. Move stops to change the order.");
    } catch {
      setMessage("Choose one to three whole days.");
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
      setSaved(true);
      setMessage("Saved in this browser. No account or upload.");
    } catch {
      setMessage(
        "The browser could not save this plan. Try printing a copy instead.",
      );
    }
  }

  function load() {
    try {
      const loaded = restorePlan(localStorage.getItem(STORAGE_KEY) || "");
      setPlan(loaded);
      setDays(loaded.days);
      setPreferences(loaded.preferences);
      setMessage("Loaded your saved sample itinerary.");
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

  return (
    <main className={styles.demo}>
      <div className={styles.heading}>
        <p className={styles.eyebrow}>READY, JET SET, GO! / PERSONAL FORK</p>
        <h1>
          A little structure.
          <br />
          Room to explore.
        </h1>
        <p>
          Build a Manchester sample itinerary. Pick your interests, change the
          order, and keep a copy in your browser.
        </p>
        <span className={styles.badge}>Guest demo · no account needed</span>
      </div>
      <aside className={styles.credit}>
        Originally a four-person Northcoders project, built in 2023. This
        maintenance fork adds a guest demo; the original Firebase and Mapbox
        integrations remain in the source.{" "}
        <a href="https://github.com/lai1372/travel-planner">
          Original team repository ↗
        </a>
      </aside>
      <div className={styles.layout}>
        <form className={styles.controls} onSubmit={generate}>
          <h2>Your starting point</h2>
          <label htmlFor="destination">Destination</label>
          <select id="destination">
            <option>Manchester · sample city</option>
          </select>
          <label htmlFor="days">How many days?</label>
          <input
            id="days"
            type="number"
            inputMode="numeric"
            min="1"
            max="3"
            step="1"
            required
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
          />
          <fieldset>
            <legend>What do you enjoy?</legend>
            {interests.map((interest) => (
              <label key={interest} className={styles.choice}>
                <input
                  type="checkbox"
                  checked={preferences.includes(interest)}
                  onChange={() =>
                    setPreferences((current) =>
                      current.includes(interest)
                        ? current.filter((value) => value !== interest)
                        : [...current, interest],
                    )
                  }
                />
                {interest}
              </label>
            ))}
          </fieldset>
          <p className={styles.small}>
            Two stops per day. Preferred categories come first, then other
            places fill the remaining slots. No random or AI recommendations.
          </p>
          <button type="submit">Build sample itinerary →</button>
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
        </form>
        <section
          className={styles.itinerary}
          aria-label="Your sample itinerary"
        >
          {!plan ? (
            <div className={styles.empty}>
              <span aria-hidden="true">↗</span>
              <h2>Your days, at a glance.</h2>
              <p>
                Choose one to three days and build a plan. A short, editable
                starting point beats a crowded schedule.
              </p>
            </div>
          ) : (
            <>
              <div className={styles.planHeading}>
                <div>
                  <p className={styles.eyebrow}>
                    MANCHESTER / {plan.days} {plan.days === 1 ? "DAY" : "DAYS"}
                  </p>
                  <h2>Your sample itinerary</h2>
                </div>
                <div className={styles.actions}>
                  <button type="button" onClick={save}>
                    Save locally
                  </button>
                  <button type="button" onClick={() => window.print()}>
                    Print / PDF
                  </button>
                </div>
              </div>
              {Array.from({ length: plan.days }, (_, day) => (
                <article className={styles.day} key={day}>
                  <h3>
                    <span>{String(day + 1).padStart(2, "0")}</span> Day{" "}
                    {day + 1}
                  </h3>
                  <ol>
                    {plan.stops
                      .slice(day * 2, day * 2 + 2)
                      .map((stop, offset) => {
                        const index = day * 2 + offset;
                        return (
                          <li key={stop.id}>
                            <div>
                              <span className={styles.category}>
                                {stop.category}
                              </span>
                              <h4>{stop.name}</h4>
                              <p>{stop.note}</p>
                              <a
                                href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(stop.name + ", Manchester")}`}
                              >
                                Find on OpenStreetMap ↗
                              </a>
                            </div>
                            <div className={styles.reorder}>
                              <button
                                type="button"
                                aria-label={`Move ${stop.name} earlier`}
                                disabled={index === 0}
                                onClick={() =>
                                  setPlan(
                                    (current) =>
                                      current && moveStop(current, index, -1),
                                  )
                                }
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                aria-label={`Move ${stop.name} later`}
                                disabled={index === plan.stops.length - 1}
                                onClick={() =>
                                  setPlan(
                                    (current) =>
                                      current && moveStop(current, index, 1),
                                  )
                                }
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
      <p className={styles.caution}>
        Example places only. Opening times, availability, accessibility, journey
        times and prices are not checked. There is no live search, map feed or
        route optimisation in guest mode. Verify details before travelling.
      </p>
      <p className={styles.links}>
        <a href="https://github.com/s7a7ic-37/travel-planner">
          Fork source & team credit ↗
        </a>
        <a href="https://portfolio.artemislab.co.uk">
          Maksymilian’s portfolio ↗
        </a>
      </p>
    </main>
  );
}
