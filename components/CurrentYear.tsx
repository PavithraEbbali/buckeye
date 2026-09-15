"use client";

import { useEffect, useState } from "react";

/* Replaces the original inline
   `<script>document.getElementById('yr').textContent=new Date().getFullYear();</script>`
   — computed the same way, once on mount, instead of baked in at build time. */
export function CurrentYear() {
  const [year, setYear] = useState(() => new Date().getFullYear());
  useEffect(() => { setYear(new Date().getFullYear()); }, []);
  return <span id="yr">{year}</span>;
}
