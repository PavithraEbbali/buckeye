"use client";

import { useState } from "react";
import { SITE, zipInFootprint } from "@/lib/content";

/* Hero availability check. Front end only — no API, no database.

   It reports whether a ZIP falls inside the published Buckeye footprint and
   routes every outcome to the phone, because a street address is the only
   thing that actually determines serviceability. It never returns a bare
   "available" verdict for an address it cannot check. */

type Result = { kind: "in" | "out" | "invalid"; zip: string } | null;

export function ZipCheck() {
  const [zip, setZip] = useState("");
  const [result, setResult] = useState<Result>(null);

  function check(e: React.FormEvent) {
    e.preventDefault();
    const clean = zip.trim();
    if (!/^\d{5}$/.test(clean)) {
      setResult({ kind: "invalid", zip: clean });
      return;
    }
    setResult({ kind: zipInFootprint(clean) ? "in" : "out", zip: clean });
  }

  return (
    <div className="zc">
      <form className="zc__form" onSubmit={check} noValidate>
        <label className="sr-only" htmlFor="zc-input">
          Enter your ZIP code to check the Buckeye Broadband service area
        </label>
        <input
          id="zc-input"
          className="zc__input"
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={5}
          placeholder="Enter your ZIP code"
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
        />
        <button className="zc__btn" type="submit">
          Check availability
        </button>
      </form>

      {result ? (
        <p className={`zc__out zc__out--${result.kind}`} role="status">
          {result.kind === "invalid" ? (
            <>Enter a five-digit ZIP code to check the service area.</>
          ) : result.kind === "in" ? (
            <>
              {SITE.carrier} builds in the {result.zip} area. Speeds differ street by
              street, so call to confirm what is serviceable at your exact address.
            </>
          ) : (
            <>
              {result.zip} sits outside the {SITE.serviceArea} footprint we show here.
              Call and an agent can check your address directly.
            </>
          )}
        </p>
      ) : null}
    </div>
  );
}
