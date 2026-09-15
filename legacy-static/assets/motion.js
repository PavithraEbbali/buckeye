/* Buckeye Broadband Authorized Agent — page motion layer (GSAP + ScrollTrigger choreography for
   every section below the hero). Takes ownership of the basic data-reveal /
   data-count system when GSAP is available; otherwise exits and app.js's
   scroll-spy fallback keeps working. Typographic reveals, per-section card
   choreography, animated FAQ accordion, magnetic CTAs, counters, and a
   failsafe that never leaves content hidden. Reduced-motion: exits (app.js
   shows everything instantly). */
(function () {
  "use strict";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  var g = window.gsap;
  if (!g || !window.ScrollTrigger) return;
  g.registerPlugin(window.ScrollTrigger);
  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---- take ownership of the legacy reveal/counter system ---------------- */
  var owned = [];                                   // everything we hide
  Array.prototype.slice.call(document.querySelectorAll("[data-reveal]")).forEach(function (el) {
    el.removeAttribute("data-reveal");              // CSS rule stops hiding it
    owned.push(el);
  });
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"))
    .filter(function (el) { return !el.__counted; });
  counters.forEach(function (el) { el.__counted = true; el.textContent = "0"; });

  /* ...and count each one back up when it scrolls into view. Without this
     loop the reset above is permanent and every counter reads "0". */
  function runCounters() {
    counters.forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      if (isNaN(target)) { el.textContent = el.getAttribute("data-count"); return; }
      var proxy = { v: 0 };
      g.to(proxy, { v: target, duration: 1.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        onUpdate: function () { el.textContent = Math.round(proxy.v); },
        onComplete: function () { el.textContent = String(target); } });
    });
  }

  function ST(el, extra) {
    return Object.assign({ trigger: el, start: "top 86%", once: true }, extra || {});
  }
  var claimed = new Set();
  function grab(sel, scope) {
    var els = Array.prototype.slice.call((scope || document).querySelectorAll(sel));
    els.forEach(function (e) { claimed.add(e); });
    return els;
  }

  runCounters();

  /* ---- 1. Typographic system: every section header ----------------------- */
  Array.prototype.slice.call(document.querySelectorAll(".co-section, .co-coverage__inner")).forEach(function (sec) {
    var eyebrow = sec.querySelector(".co-eyebrow");
    var h2 = sec.querySelector(".co-h2");
    var lead = sec.querySelector(".co-lead");
    if (eyebrow && !claimed.has(eyebrow)) {
      claimed.add(eyebrow);
      g.set(eyebrow, { x: -26, opacity: 0 });
      g.to(eyebrow, { x: 0, opacity: 1, duration: .7, ease: "power3.out", scrollTrigger: ST(eyebrow) });
    }
    if (h2 && !claimed.has(h2)) {
      claimed.add(h2);
      if (!h2.querySelector(".sh-in")) h2.innerHTML = '<span class="sh-in">' + h2.innerHTML + "</span>";
      var inner = h2.querySelector(".sh-in");
      g.set(inner, { yPercent: 112 });
      g.to(inner, { yPercent: 0, duration: 1, ease: "power4.out", scrollTrigger: ST(h2), delay: .08 });
      owned.push(inner);
    }
    if (lead && !claimed.has(lead)) {
      claimed.add(lead);
      g.set(lead, { y: 26, opacity: 0, filter: "blur(6px)" });
      g.to(lead, { y: 0, opacity: 1, filter: "blur(0px)", duration: .85, ease: "power3.out", scrollTrigger: ST(lead), delay: .18 });
    }
  });

  /* ---- 2. Stats: rise + live count-up ------------------------------------ */
  var stats = grab("[data-stb]");
  if (stats.length) {
    var stTrig = ST(stats[0].parentElement, { start: "top 84%" });
    /* the connecting rail wipes across as the section is read */
    var stRail = document.querySelector("[data-strail]");
    if (stRail) {
      g.set(stRail, { scaleX: 0 });
      g.to(stRail, { scaleX: 1, ease: "none",
        scrollTrigger: { trigger: stats[0].parentElement, start: "top 88%", end: "bottom 62%", scrub: .7 } });
    }
    stats.forEach(function (bt, i) {
      var fig = bt.querySelector(".st-b__fig");
      var num = bt.querySelector("[data-stcount]");
      var rest = bt.querySelectorAll("h3, p, .st-b__n");
      var d = i * .14;
      g.set(fig, { y: 40, opacity: 0, rotationX: 55, transformPerspective: 900, transformOrigin: "50% 100%" });
      g.to(fig, { y: 0, opacity: 1, rotationX: 0, duration: 1, ease: "power4.out", delay: d,
        scrollTrigger: stTrig,
        onComplete: function () { g.set(fig, { clearProps: "transform,perspective,opacity" }); } });
      g.set(rest, { y: 22, opacity: 0 });
      g.to(rest, { y: 0, opacity: 1, duration: .7, ease: "power3.out", stagger: .06, delay: d + .22,
        scrollTrigger: stTrig,
        onComplete: function () { g.set(rest, { clearProps: "transform,opacity" }); } });
      if (num) {
        var target = parseFloat(num.getAttribute("data-stcount"));
        var proxy = { v: 0 };
        num.textContent = "0";
        g.to(proxy, { v: target, duration: 1.4, ease: "power3.out", delay: d + .1,
          scrollTrigger: stTrig,
          onUpdate: function () { num.textContent = Math.round(proxy.v); },
          onComplete: function () { num.textContent = String(target); } });
      }
    });
  }

  /* ---- 3. Plans: dramatic 3D flip-up (cards hinge up from below) ---------- */
  var plans = grab(".co-plans .co-plan");
  if (plans.length) {
    g.set(plans, { y: 100, opacity: 0, rotationX: 48, transformOrigin: "50% 100% -40px", transformPerspective: 1000 });
    g.to(plans, { y: 0, opacity: 1, rotationX: 0, duration: 1.05, ease: "power4.out", stagger: .13,
      scrollTrigger: ST(plans[0].parentElement, { start: "top 82%" }),
      onComplete: function () { g.set(plans, { clearProps: "transform,perspective" }); } });
    var ribbon = document.querySelector(".co-plan__ribbon");
    if (ribbon) {
      g.set(ribbon, { scale: 0, rotation: -10, y: -6 });
      g.to(ribbon, { scale: 1, rotation: 0, y: 0, duration: .75, ease: "elastic.out(1,.5)", delay: 1.0,
        scrollTrigger: ST(plans[0].parentElement, { start: "top 82%" }) });
    }
    var prices = grab(".co-plan__price b");
    if (prices.length) {
      g.set(prices, { scale: .66, opacity: 0, filter: "blur(5px)" });
      g.to(prices, { scale: 1, opacity: 1, filter: "blur(0px)", duration: .65, ease: "back.out(1.9)", stagger: .13, delay: .55,
        scrollTrigger: ST(plans[0].parentElement, { start: "top 82%" }) });
    }
  }

  /* ---- 3b. Plan rows: 3D hinge-in + speed bars sweep --------------------- */
  var prows = grab(".pl-list .pl-row");
  var pbars = grab(".pl-row__bar i");
  if (prows.length) {
    var pTrig = ST(prows[0].parentElement, { start: "top 84%" });
    g.set(prows, { y: 74, opacity: 0, rotationX: 28, transformOrigin: "50% 100% -60px", transformPerspective: 1200 });
    g.to(prows, { y: 0, opacity: 1, rotationX: 0, duration: .95, ease: "power4.out", stagger: .12,
      scrollTrigger: pTrig,
      onComplete: function () { g.set(prows, { clearProps: "transform,perspective" }); } });
    if (pbars.length) {
      g.set(pbars, { scaleX: 0 });
      g.to(pbars, { scaleX: 1, duration: 1.15, ease: "power3.out", stagger: .12, delay: .4,
        scrollTrigger: ST(prows[0].parentElement, { start: "top 84%" }) });
    }
    var pflag = document.querySelector(".pl-row__flag");
    if (pflag) {
      g.set(pflag, { scale: 0, rotation: -6 });
      g.to(pflag, { scale: 1, rotation: 0, duration: .75, ease: "elastic.out(1,.55)", delay: .9,
        scrollTrigger: ST(prows[0].parentElement, { start: "top 84%" }) });
    }
    var pdevs = grab(".pl-dev.is-on");
    if (pdevs.length) {
      g.set(pdevs, { scale: 0 });
      g.to(pdevs, { scale: 1, duration: .5, ease: "back.out(2.2)", stagger: .04, delay: .6,
        scrollTrigger: ST(prows[0].parentElement, { start: "top 84%" }),
        onComplete: function () { g.set(pdevs, { clearProps: "transform" }); } });
    }
  }

  /* ---- 4. Why-switch: scale-pop with elastic settle + icon spin ---------- */
  var spots = grab(".co-why .co-spot");
  if (spots.length) {
    g.set(spots, { scale: .72, opacity: 0, y: 58, rotationZ: -2.5, transformPerspective: 800 });
    window.ScrollTrigger.batch(spots, { start: "top 88%", once: true,
      onEnter: function (els) {
        g.to(els, { scale: 1, opacity: 1, y: 0, rotationZ: 0, duration: .95, ease: "back.out(1.7)", stagger: .14,
          onComplete: function () { g.set(els, { clearProps: "transform,perspective" }); } });
        g.fromTo(els.map(function (e) { return e.querySelector(".co-icon"); }).filter(Boolean),
          { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: .7, ease: "back.out(2.4)", stagger: .14, delay: .2,
          onComplete: function () { els.forEach(function (e) { var i = e.querySelector(".co-icon"); if (i) g.set(i, { clearProps: "transform" }); }); } });
      } });
  }

  /* ---- 4b. Why: engraved seal + editorial reason index -------------------- */
  var wseal = document.querySelector("[data-wseal]");
  if (wseal) {
    g.set(wseal, { scale: .55, opacity: 0, rotation: -32 });
    g.to(wseal, { scale: 1, opacity: 1, rotation: 0, duration: 1.15, ease: "back.out(1.5)",
      scrollTrigger: ST(wseal, { start: "top 90%" }),
      onComplete: function () { g.set(wseal, { clearProps: "transform,opacity" }); } });
    var ring = wseal.querySelector(".wr-seal__spin");
    if (ring) {
      g.to(ring, { rotation: 190, ease: "none", svgOrigin: "100 100",
        scrollTrigger: { trigger: wseal, start: "top bottom", end: "bottom top", scrub: 1.1 } });
    }
    var side = grab(".wr-col__note, .wr-col__tel");
    if (side.length) {
      g.set(side, { y: 16, opacity: 0 });
      g.to(side, { y: 0, opacity: 1, duration: .7, ease: "power3.out", stagger: .1, delay: .45,
        scrollTrigger: ST(wseal, { start: "top 90%" }),
        onComplete: function () { g.set(side, { clearProps: "transform,opacity" }); } });
    }
  }

  var wrows = grab("[data-wrow]");
  if (wrows.length) {
    wrows.forEach(function (row, i) {
      var num  = row.querySelector(".wr-row__n");
      var txt  = row.querySelector(".wr-row__txt");
      var chip = row.querySelector(".wr-chip");
      var trig = ST(row, { start: "top 92%" });
      g.set(row, { "--wrl": 0 });
      g.set([num], { x: -26, opacity: 0 });
      g.set([txt], { y: 22, opacity: 0 });
      g.set([chip], { scale: .7, opacity: 0 });
      var tl = g.timeline({ scrollTrigger: trig, delay: i * .05 });
      tl.to(num,  { x: 0, opacity: 1, duration: .7, ease: "power3.out" })
        .to(txt,  { y: 0, opacity: 1, duration: .7, ease: "power3.out" }, "-=.55")
        .to(chip, { scale: 1, opacity: 1, duration: .6, ease: "back.out(2.4)" }, "-=.45")
        .add(function () { g.set([num, txt, chip], { clearProps: "transform,opacity" }); });
    });
  }

  /* ---- 5. Perks: plates rise and unfold ---------------------------------- */
  var cells = grab("[data-pkp]");
  if (cells.length) {
    var pkWrap = cells[0].parentElement;
    cells.forEach(function (cell, i) {
      g.set(cell, { y: 58, opacity: 0, rotationY: -10, transformPerspective: 1100 });
      g.to(cell, { y: 0, opacity: 1, rotationY: 0, duration: .95, ease: "power3.out", delay: i * .11,
        scrollTrigger: ST(pkWrap, { start: "top 88%" }),
        onComplete: function () { g.set(cell, { clearProps: "transform,perspective,opacity" }); } });
      var ic = cell.querySelector(".pk-p__ico, .mo-p__frame, .mo-p__label, .qa-i, [data-qacard], .cta-l i, [data-ctakick], [data-ctasub], [data-ctaact], .st-b__fig, .st-b h3, .st-b p, .st-b__n, [data-strail], .mv-arc, .mv-fig__n, .mv-fig__u, .mv-run__i, .mv-act, .hw-s__art, .hw-s__art img, .hw-s__txt, .hw-act, .cv-dot, .cv-link, .cv-lab, .cv-hub, .cv-ring, .cv-halo, .cv-stat");
      g.set(ic, { scale: 0, rotation: -40 });
      g.to(ic, { scale: 1, rotation: 0, duration: .7, ease: "back.out(2.3)", delay: .3 + i * .11,
        scrollTrigger: ST(pkWrap, { start: "top 88%" }),
        onComplete: function () { g.set(ic, { clearProps: "transform" }); } });
    });
    /* touch + keyboard: move the default-open plate (CSS owns pointer hover) */
    cells.forEach(function (cell, i) {
      var hit = cell.querySelector(".pk-p__hit");
      if (!hit) return;
      hit.addEventListener("click", function () {
        cells.forEach(function (o, k) { o.classList.toggle("is-open", k === i); });
      });
    });
  }

  /* ---- 6. Mobile 5G: arcs draw on, price lands --------------------------- */
  var mvWrap = document.querySelector("[data-mv]");
  var checks = grab(".mv-run__i");
  if (mvWrap) {
    var mvTrig = ST(mvWrap, { start: "top 82%" });

    var mvArcs = grab(".mv-arc");
    if (mvArcs.length) {
      g.set(mvArcs, { strokeDashoffset: 1 });
      g.to(mvArcs, { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut", stagger: .1,
        scrollTrigger: mvTrig,
        onComplete: function () { g.set(mvArcs, { clearProps: "strokeDashoffset" }); } });
    }

    var mvFig = mvWrap.querySelector("[data-mvfig]");
    if (mvFig) {
      var mvNum = mvFig.querySelector(".mv-fig__n");
      var mvUnit = mvFig.querySelector(".mv-fig__u");
      g.set(mvNum, { y: 64, opacity: 0, rotationX: 62, transformPerspective: 900, transformOrigin: "50% 100%" });
      g.to(mvNum, { y: 0, opacity: 1, rotationX: 0, duration: 1.2, ease: "power4.out",
        scrollTrigger: mvTrig,
        onComplete: function () { g.set(mvNum, { clearProps: "transform,perspective,opacity" }); } });
      g.fromTo(mvUnit, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: "power3.out", delay: .55,
        scrollTrigger: mvTrig,
        onComplete: function () { g.set(mvUnit, { clearProps: "transform,opacity" }); } });
    }

    if (checks.length) {
      g.set(checks, { y: 30, opacity: 0 });
      g.to(checks, { y: 0, opacity: 1, duration: .8, ease: "power3.out", stagger: .12, delay: .5,
        scrollTrigger: mvTrig,
        onComplete: function () { g.set(checks, { clearProps: "transform,opacity" }); } });
    }
    var mvAct = mvWrap.querySelector("[data-mvact]");
    if (mvAct) {
      g.set(mvAct, { y: 26, opacity: 0 });
      g.to(mvAct, { y: 0, opacity: 1, duration: .8, ease: "power3.out", delay: .85,
        scrollTrigger: mvTrig,
        onComplete: function () { g.set(mvAct, { clearProps: "transform,opacity" }); } });
    }
  }

  /* ---- 7. Steps: cascade (clearProps so CSS hover lift works after) ------- */
  var steps = grab(".co-steps .co-step");
  if (steps.length) {
    g.set(steps, { y: 54, opacity: 0 });
    g.to(steps, { y: 0, opacity: 1, duration: .85, ease: "power3.out", stagger: .14,
      scrollTrigger: ST(steps[0].parentElement),
      onComplete: function () { g.set(steps, { clearProps: "transform" }); } });
  }

  /* ---- 7b. How-it-works timeline: rail draws, nodes pop, cards slide ------ */
  var tls = grab("[data-hws]");
  var tline = document.querySelector("[data-hw]");
  var tlNodes = Array.prototype.slice.call(document.querySelectorAll(".hw-s__n"));
  if (tls.length && tline) {
    var hwTrig = ST(tline, { start: "top 82%" });
    /* each step drops in behind a bottom-up curtain, staggered down the staircase */
    tls.forEach(function (st, i) {
      var art = st.querySelector(".hw-s__art");
      var txt = st.querySelector(".hw-s__txt");
      var num = st.querySelector(".hw-s__n");
      var d = i * .16;
      g.set(art, { clipPath: "inset(0% 0% 100% 0% round 20px 20px 4px 4px)" });
      g.set(art.querySelector("img"), { scale: 1.2 });
      g.to(art, { clipPath: "inset(0% 0% 0% 0% round 20px 20px 4px 4px)", duration: 1.1,
        ease: "power4.inOut", delay: d, scrollTrigger: hwTrig,
        onComplete: function () { g.set(art, { clearProps: "clipPath" }); } });
      g.to(art.querySelector("img"), { scale: 1, duration: 1.5, ease: "power3.out", delay: d,
        scrollTrigger: hwTrig,
        onComplete: function () { g.set(art.querySelector("img"), { clearProps: "transform" }); } });
      g.set(num, { y: 26, opacity: 0, filter: "blur(10px)" });
      g.to(num, { y: 0, opacity: 1, filter: "blur(0px)", duration: .9, ease: "power3.out", delay: d + .18,
        scrollTrigger: hwTrig,
        onComplete: function () { g.set(num, { clearProps: "transform,opacity,filter" }); } });
      g.set(txt, { y: 30, opacity: 0 });
      g.to(txt, { y: 0, opacity: 1, duration: .8, ease: "power3.out", delay: d + .38,
        scrollTrigger: hwTrig,
        onComplete: function () { g.set(txt, { clearProps: "transform,opacity" }); } });
    });
    var hwAct = document.querySelector("[data-hwact]");
    if (hwAct) {
      g.set(hwAct, { y: 24, opacity: 0 });
      g.to(hwAct, { y: 0, opacity: 1, duration: .8, ease: "power3.out", delay: .8,
        scrollTrigger: hwTrig,
        onComplete: function () { g.set(hwAct, { clearProps: "transform,opacity" }); } });
    }
  }

  /* ---- 8. Coverage: network lights up, then runs live -------------------- */
  var cvMap = document.querySelector("[data-cvmap]");
  if (cvMap) {
    var hubX = 330, hubY = 300;
    var cvDots = Array.prototype.slice.call(cvMap.querySelectorAll("[data-cvdot]"));
    var cvGlows = Array.prototype.slice.call(cvMap.querySelectorAll(".cv-glow"));
    var cvLinks = Array.prototype.slice.call(cvMap.querySelectorAll("[data-cvlink]"));
    var cvLabs = Array.prototype.slice.call(cvMap.querySelectorAll("[data-cvlab]"));
    var cvPkts = Array.prototype.slice.call(cvMap.querySelectorAll("[data-pkt]"));
    var cvPulses = Array.prototype.slice.call(cvMap.querySelectorAll("[data-cvpulse]"));
    var cvHub = cvMap.querySelectorAll(".cv-hub, .cv-halo");
    var cvChrome = cvMap.querySelectorAll(".cv-water, .cv-shore, .cv-water-lab, .cv-border, .cv-region, .cv-key");

    function dist(el) {
      var x = parseFloat(el.getAttribute("cx") || el.getAttribute("x2") || el.getAttribute("x") || hubX);
      var y = parseFloat(el.getAttribute("cy") || el.getAttribute("y2") || el.getAttribute("y") || hubY);
      return Math.sqrt((x - hubX) * (x - hubX) + (y - hubY) * (y - hubY));
    }
    var byDist = function (p, q) { return dist(p) - dist(q); };
    cvDots.sort(byDist); cvLinks.sort(byDist); cvLabs.sort(byDist);

    /* ---- entrance: the network fills outward from Toledo ---- */
    var cvTl = g.timeline({ scrollTrigger: ST(cvMap, { start: "top 84%" }) });
    cvTl.from(cvChrome, { opacity: 0, duration: .9, ease: "power2.out", stagger: .06 })
        .from(cvHub, { scale: 0, transformOrigin: "330px 300px", duration: .85, ease: "back.out(2)" }, .15)
        .from(cvLinks, { opacity: 0, duration: .5, ease: "power2.out", stagger: .045 }, .35)
        .from(cvDots, { scale: 0, transformOrigin: "50% 50%", duration: .5, ease: "back.out(2.6)", stagger: .045,
          onComplete: function () { g.set(cvDots, { clearProps: "transform" }); } }, .45)
        .from(cvGlows, { scale: 0, transformOrigin: "50% 50%", duration: .6, ease: "power2.out", stagger: .045,
          onComplete: function () { g.set(cvGlows, { clearProps: "transform" }); } }, .45)
        .from(cvLabs, { opacity: 0, y: 8, duration: .5, ease: "power2.out", stagger: .05,
          onComplete: function () { g.set(cvLabs, { clearProps: "opacity,transform" }); } }, .6);

    /* ---- live layer: runs by default, pauses only when provably off screen.
       Failing to "playing" matters — stale ScrollTrigger positions (this page
       lazy-loads imagery) must never leave the map frozen while it's visible. */
    var live = g.timeline();

    /* current flowing outward along every fiber */
    live.to(cvLinks, { strokeDashoffset: -36, duration: 1.5, ease: "none", repeat: -1 }, 0);

    /* radar sweep off the hub */
    var cvSweep = cvMap.querySelector("[data-cvsweep]");
    if (cvSweep) {
      live.to(cvSweep, { rotation: 360, svgOrigin: "330 300", duration: 11, ease: "none", repeat: -1 }, 0);
    }

    /* light packets riding hub -> town */
    cvPkts.forEach(function (pk, i) {
      var x1 = +pk.getAttribute("data-x1"), y1 = +pk.getAttribute("data-y1");
      var x2 = +pk.getAttribute("data-x2"), y2 = +pk.getAttribute("data-y2");
      var len = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
      var dur = Math.max(.85, len / 190);
      var run = g.timeline({ repeat: -1, repeatDelay: 1.15 });
      run.set(pk, { attr: { cx: x1, cy: y1 }, opacity: 0 })
         .to(pk, { attr: { cx: x2, cy: y2 }, duration: dur, ease: "none" }, 0)
         .to(pk, { opacity: 1, duration: dur * .22 }, 0)
         .to(pk, { opacity: 0, duration: dur * .3 }, dur * .7);
      live.add(run, (i * 0.19) % 2.4);
    });

    /* sonar rings off the Toledo hub */
    cvPulses.forEach(function (ring, i) {
      live.fromTo(ring, { attr: { r: 12 }, strokeOpacity: .55 },
        { attr: { r: 78 }, strokeOpacity: 0, duration: 2.6, ease: "power2.out", repeat: -1 }, i * .87);
    });

    /* breathing status lamp */
    var lamp = document.querySelector("[data-cvlive]");
    if (lamp) live.to(lamp, { opacity: .25, duration: .9, ease: "sine.inOut", repeat: -1, yoyo: true }, 0);

    window.ScrollTrigger.create({
      trigger: cvMap, start: "top bottom", end: "bottom top", invalidateOnRefresh: true,
      onToggle: function (self) { if (self.isActive) { live.play(); } else { live.pause(); } },
      onRefresh: function (self) { if (self.isActive) live.play(); }
    });

    /* ---- mouse: the card tilts in 3D and its layers drift at depth ---- */
    if (fine) {
      var card = cvMap.querySelector("[data-cvcard]");
      var glare = cvMap.querySelector("[data-cvglare]");
      var layers = Array.prototype.slice.call(cvMap.querySelectorAll("[data-cvlayer]"));
      var rotY = g.quickTo(card, "rotationY", { duration: .8, ease: "power3.out" });
      var rotX = g.quickTo(card, "rotationX", { duration: .8, ease: "power3.out" });
      var layX = layers.map(function (l) { return g.quickTo(l, "x", { duration: .9, ease: "power3.out" }); });
      var layY = layers.map(function (l) { return g.quickTo(l, "y", { duration: .9, ease: "power3.out" }); });
      g.set(card, { transformPerspective: 1400, transformStyle: "preserve-3d" });

      cvMap.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width - .5;
        var ny = (e.clientY - r.top) / r.height - .5;
        rotY(nx * 11); rotX(-ny * 8);
        layers.forEach(function (l, i) {
          var d = +l.getAttribute("data-depth");
          layX[i](-nx * d); layY[i](-ny * d * .6);
        });
        if (glare) { glare.style.setProperty("--gx", (nx + .5) * 100 + "%");
                     glare.style.setProperty("--gy", (ny + .5) * 100 + "%"); }
      }, { passive: true });

      cvMap.addEventListener("mouseleave", function () {
        rotY(0); rotX(0);
        layers.forEach(function (l, i) { layX[i](0); layY[i](0); });
      }, { passive: true });
    }

    /* ---- hover a town: light its fiber back to Toledo ---- */
    Array.prototype.slice.call(cvMap.querySelectorAll(".cv-node")).forEach(function (node) {
      var dot = node.querySelector(".cv-dot");
      if (!dot) return;
      var nx = dot.getAttribute("cx"), ny = dot.getAttribute("cy");
      var line = cvLinks.filter(function (l) {
        return l.getAttribute("x2") === nx && l.getAttribute("y2") === ny;
      })[0];
      if (!line) return;
      node.addEventListener("mouseenter", function () { line.classList.add("is-lit"); });
      node.addEventListener("mouseleave", function () { line.classList.remove("is-lit"); });
    });

    var cvStat = document.querySelector("[data-cvstat]");
    if (cvStat) {
      g.set(cvStat, { y: 22, opacity: 0 });
      g.to(cvStat, { y: 0, opacity: 1, duration: .8, ease: "power3.out", delay: .3,
        scrollTrigger: ST(cvMap, { start: "top 84%" }),
        onComplete: function () { g.set(cvStat, { clearProps: "transform,opacity" }); } });
    }
  }

  /* ---- 9. FAQ: rows deal in, spine lights as you scroll, height animates -- */
  var accs = grab("[data-qai]");
  if (accs.length) {
    var qaList = document.querySelector("[data-qalist]");
    var qaTrig = ST(qaList, { start: "top 84%" });

    /* the spine fills in step with how far through the list you have scrolled */
    var qaSpine = document.querySelector("[data-qaspine]");
    if (qaSpine) {
      g.set(qaSpine, { scaleY: 0 });
      g.to(qaSpine, { scaleY: 1, ease: "none",
        scrollTrigger: { trigger: qaList, start: "top 76%", end: "bottom 70%", scrub: .6 } });
    }

    /* each row deals in from the left with a slight 3D turn */
    g.set(accs, { x: -34, opacity: 0, rotationY: 6, transformPerspective: 900, transformOrigin: "left center" });
    g.to(accs, { x: 0, opacity: 1, rotationY: 0, duration: .85, ease: "power3.out", stagger: .1,
      scrollTrigger: qaTrig,
      onComplete: function () { g.set(accs, { clearProps: "transform,perspective,opacity" }); } });

    var qaCard = document.querySelector("[data-qacard]");
    if (qaCard) {
      g.set(qaCard, { y: 30, opacity: 0 });
      g.to(qaCard, { y: 0, opacity: 1, duration: .8, ease: "back.out(1.5)", delay: .25,
        scrollTrigger: qaTrig,
        onComplete: function () { g.set(qaCard, { clearProps: "transform,opacity" }); } });
    }

    /* buttery open/close: animate the body height, keep one row open at a time */
    accs.forEach(function (d) {
      var body = d.querySelector(".qa-i__a");
      var sum = d.querySelector("summary");
      if (!body || !sum) return;
      if (!d.open) g.set(body, { height: 0 });
      sum.addEventListener("click", function (e) {
        e.preventDefault();
        var opening = !d.open;
        accs.forEach(function (o) {
          if (o === d || !o.open) return;
          var ob = o.querySelector(".qa-i__a");
          g.to(ob, { height: 0, duration: .42, ease: "power3.inOut",
            onComplete: function () { o.open = false; } });
        });
        if (opening) {
          d.open = true;
          g.fromTo(body, { height: 0 }, { height: "auto", duration: .5, ease: "power3.out" });
        } else {
          g.to(body, { height: 0, duration: .42, ease: "power3.inOut",
            onComplete: function () { d.open = false; } });
        }
      });
    });
  }

  /* ---- 10. CTA band: lines rise, gold payoff, endless outline marquee ----- */
  var ctaSec = document.querySelector(".cta-sec");
  if (ctaSec) {
    var ctaTrig = ST(ctaSec, { start: "top 78%" });
    var ctaLines = grab(".cta-l i", ctaSec);
    var ctaKick = ctaSec.querySelector("[data-ctakick]");
    var ctaSub = ctaSec.querySelector("[data-ctasub]");
    var ctaAct = ctaSec.querySelector("[data-ctaact]");

    g.set(ctaKick, { y: -14, opacity: 0 });
    g.set(ctaLines, { yPercent: 116, rotationX: -40, transformPerspective: 800, transformOrigin: "50% 100%" });
    g.set([ctaSub, ctaAct], { y: 26, opacity: 0 });

    var ctl = g.timeline({ scrollTrigger: ctaTrig, defaults: { ease: "power4.out" } });
    ctl.to(ctaKick, { y: 0, opacity: 1, duration: .6 })
       .to(ctaLines, { yPercent: 0, rotationX: 0, duration: 1, stagger: .1,
         onComplete: function () { g.set(ctaLines, { clearProps: "transform,perspective" }); } }, "-=.34")
       .to(ctaSub, { y: 0, opacity: 1, duration: .75 }, "-=.5")
       .to(ctaAct, { y: 0, opacity: 1, duration: .75 }, "-=.55")
       .add(function () { g.set([ctaKick, ctaSub, ctaAct], { clearProps: "transform,opacity" }); });

    /* build + run the closing marquee */
    var mqT = ctaSec.querySelector("[data-ctamq]");
    if (mqT && !mqT.children.length) {
      var words = ["Unlimited data", "No contract", "Free install", "Local support", "Price locked 3 years"];
      var html = "";
      for (var r = 0; r < 2; r++) {
        words.forEach(function (w, i) {
          html += '<span class="' + (i % 2 ? "on" : "") + '">' + w + "</span>";
        });
      }
      mqT.innerHTML = html;
      var half = mqT.scrollWidth / 2;
      g.to(mqT, { x: -half, duration: 26, ease: "none", repeat: -1,
        modifiers: { x: function (x) { return (parseFloat(x) % half) + "px"; } } });
    }
  }

  /* ---- 10a. Global scroll progress ---------------------------------------- */
  (function () {
    var bar = document.querySelector(".co-prog");
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "co-prog";
      bar.setAttribute("aria-hidden", "true");
      document.body.appendChild(bar);
    }
    g.to(bar, { scaleX: 1, ease: "none",
      scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: .25 } });
  })();

  /* ---- 10b. Headings drift on scroll (depth parallax) ---------------------- */
  Array.prototype.slice.call(document.querySelectorAll(".co-h2")).forEach(function (h2) {
    var sec = h2.closest(".co-section") || h2;
    g.fromTo(h2, { y: 12 }, { y: -14, ease: "none",
      scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: 1.2 } });
  });

  /* ---- 10b2. Giant background words drift with scroll ---------------------- */
  Array.prototype.slice.call(document.querySelectorAll(".co-bgword")).forEach(function (w) {
    g.fromTo(w, { xPercent: -56 }, { xPercent: -44, ease: "none", immediateRender: false,
      scrollTrigger: { trigger: w.closest(".co-section") || w, start: "top bottom", end: "bottom top", scrub: 1.3 } });
  });

  /* ---- 10d. Card grids drift as you scroll (grid-level = hover-safe) ------ */
  [".co-plans", ".co-why", ".pk", ".mo", ".hw"].forEach(function (sel) {
    var grid = document.querySelector(sel);
    if (grid) g.fromTo(grid, { y: 44 }, { y: -32, ease: "none",
      scrollTrigger: { trigger: grid, start: "top bottom", end: "bottom top", scrub: 1.1 } });
  });

  /* ---- 10e. Photo strip: cinematic 3D swing-in --------------------------- */
  var photos = grab("[data-mop]");
  var moWrap = document.querySelector("[data-mo]");
  if (photos.length && moWrap) {
    var moTrig = ST(moWrap, { start: "top 84%" });
    var moFrames = photos.map(function (p) { return p.querySelector(".mo-p__frame"); });
    var moLabels = photos.map(function (p) { return p.querySelector(".mo-p__label"); });
    var moRot = [-1.6, 1.1, -.9];
    photos.forEach(function (pan, i) {
      g.set(moFrames[i], { y: 78, opacity: 0, rotation: moRot[i] + (i % 2 ? 7 : -7), scale: .94 });
      g.to(moFrames[i], { y: 0, opacity: 1, rotation: moRot[i], scale: 1, duration: 1.15,
        ease: "power4.out", delay: i * .15, scrollTrigger: moTrig });
      g.set(moLabels[i], { y: 30, opacity: 0 });
      g.to(moLabels[i], { y: 0, opacity: 1, duration: .75, ease: "back.out(1.7)", delay: .55 + i * .15,
        scrollTrigger: moTrig,
        onComplete: function () { g.set(moLabels[i], { clearProps: "transform,opacity" }); } });
    });

    /* mouse-move depth: each print drifts by a different factor */
    if (fine) {
      var moDepth = [26, 15, 34];
      var moX = photos.map(function (pan, i) {
        return g.quickTo(pan.querySelector(".mo-p__tilt"), "x", { duration: .9, ease: "power3.out" });
      });
      var moY = photos.map(function (pan, i) {
        return g.quickTo(pan.querySelector(".mo-p__tilt"), "y", { duration: .9, ease: "power3.out" });
      });
      moWrap.addEventListener("mousemove", function (e) {
        var r = moWrap.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width - .5;
        var ny = (e.clientY - r.top) / r.height - .5;
        photos.forEach(function (pan, i) {
          var d = moDepth[i] * (i === 1 ? -1 : 1);
          moX[i](nx * d); moY[i](ny * d * .55);
        });
      }, { passive: true });
      moWrap.addEventListener("mouseleave", function () {
        photos.forEach(function (pan, i) { moX[i](0); moY[i](0); });
      }, { passive: true });
    }
  }

  /* ---- 10f. Scroll-driven focus ------------------------------------------
     Everything below used to need a mouse. Now the page itself drives it:
     as a section travels through the viewport, its items light up in turn.
     Pointer hover still wins where a pointer exists. ---------------------- */

  /* perks: the open plate advances as the strip scrolls past */
  var pkPlates = Array.prototype.slice.call(document.querySelectorAll("[data-pkp]"));
  var pkStrip = document.querySelector("[data-pk]");
  if (pkPlates.length && pkStrip) {
    window.ScrollTrigger.create({
      trigger: pkStrip, start: "top 82%", end: "bottom 45%", scrub: false,
      onUpdate: function (self) {
        var i = Math.min(pkPlates.length - 1,
                Math.floor(self.progress * pkPlates.length));
        if (i === pkStrip.__i) return;
        pkStrip.__i = i;
        pkPlates.forEach(function (pl, k) { pl.classList.toggle("is-open", k === i); });
      }
    });
  }

  /* local life: prints drift at their own depth and light up in sequence */
  var moPanels = Array.prototype.slice.call(document.querySelectorAll("[data-mop]"));
  if (moPanels.length) {
    var moDepth = [-56, -26, -80];
    moPanels.forEach(function (pan, i) {
      g.to(pan, { y: moDepth[i] || -40, ease: "none",
        scrollTrigger: { trigger: pan.parentElement, start: "top bottom", end: "bottom top", scrub: .8 } });
      window.ScrollTrigger.create({
        trigger: pan, start: "top 72%", end: "bottom 38%",
        onToggle: function (self) { pan.classList.toggle("is-lit", self.isActive); }
      });
    });
  }

  /* plan rows light as they cross the middle of the screen */
  var plRows = Array.prototype.slice.call(document.querySelectorAll(".pl-row"));
  plRows.forEach(function (row) {
    window.ScrollTrigger.create({
      trigger: row, start: "top 70%", end: "bottom 40%",
      onToggle: function (self) { row.classList.toggle("is-lit", self.isActive); }
    });
  });

  /* every icon in the page pops once as its section arrives */
  var icons = Array.prototype.slice.call(document.querySelectorAll(
    ".mx-b__ico, .wh-item__ico, .hw-s__n, .qa-i__ico, .co-icon"));
  icons.forEach(function (ic) {
    g.from(ic, { scale: .4, rotation: -22, opacity: 0, duration: .65, ease: "back.out(2.2)",
      scrollTrigger: ST(ic, { start: "top 90%" }),
      onComplete: function () { g.set(ic, { clearProps: "transform,opacity" }); } });
  });

  /* ---- 10g. Plans: pointer depth + magnetic CTA --------------------------
     Each column answers the cursor at its own rate, so the card reads as
     layered rather than as one flat panel being nudged. Pointer-only, and
     deliberately NOT applied to .pl-row itself — that transform belongs to
     the CSS hover/.is-lit lift. */
  if (fine) {
    Array.prototype.slice.call(document.querySelectorAll("[data-plrow]")).forEach(function (row) {
      var cols = [
        { el: row.querySelector(".pl-row__speed"), ax: 16, ay: 9 },
        { el: row.querySelector(".pl-row__main"),  ax: 9,  ay: 5 },
        { el: row.querySelector(".pl-row__cap"),   ax: 20, ay: 11 },
        { el: row.querySelector(".pl-row__buy"),   ax: 27, ay: 14 }
      ].filter(function (c) { return c.el; });
      if (!cols.length) return;

      cols.forEach(function (c) {
        c.qx = g.quickTo(c.el, "x", { duration: .85, ease: "power3.out" });
        c.qy = g.quickTo(c.el, "y", { duration: .85, ease: "power3.out" });
      });

      /* the CTA additionally leans toward the pointer when it is close */
      var cta = row.querySelector(".pl-row__cta");
      var cx = cta && g.quickTo(cta, "x", { duration: .5, ease: "power3.out" });
      var cy = cta && g.quickTo(cta, "y", { duration: .5, ease: "power3.out" });

      row.addEventListener("pointermove", function (e) {
        var r = row.getBoundingClientRect();
        if (!r.width || !r.height) return;
        var nx = (e.clientX - r.left) / r.width - .5;
        var ny = (e.clientY - r.top) / r.height - .5;
        cols.forEach(function (c) { c.qx(nx * c.ax); c.qy(ny * c.ay); });
        if (cta) {
          var b = cta.getBoundingClientRect();
          var dx = e.clientX - (b.left + b.width / 2);
          var dy = e.clientY - (b.top + b.height / 2);
          var d = Math.sqrt(dx * dx + dy * dy);
          var pull = d < 190 ? (1 - d / 190) : 0;
          cx(dx * .22 * pull); cy(dy * .3 * pull);
        }
      }, { passive: true });

      row.addEventListener("pointerleave", function () {
        cols.forEach(function (c) { c.qx(0); c.qy(0); });
        if (cta) { cx(0); cy(0); }
      }, { passive: true });
    });
  }

  /* ---- 11. Footer: columns rise ------------------------------------------- */
  var cols = Array.prototype.slice.call(document.querySelectorAll(".co-footer__top > *"));
  if (cols.length) {
    g.set(cols, { y: 34, opacity: 0 });
    g.to(cols, { y: 0, opacity: 1, duration: .75, ease: "power3.out", stagger: .09,
      scrollTrigger: ST(cols[0].parentElement, { start: "top 92%" }) });
  }

  /* ---- 12. Catch-all: any legacy reveal element not claimed above ---------- */
  var leftovers = owned.filter(function (el) { return !claimed.has(el) && !el.classList.contains("sh-in"); });
  if (leftovers.length) {
    g.set(leftovers, { y: 30, opacity: 0 });
    window.ScrollTrigger.batch(leftovers, { start: "top 90%", once: true,
      onEnter: function (els) { g.to(els, { y: 0, opacity: 1, duration: .7, ease: "power3.out", stagger: .08 }); } });
  }

  /* ---- refresh + failsafe --------------------------------------------------
     If the ticker never runs (frozen rAF, background tab at load), force every
     owned element visible so nothing is ever left hidden. */
  window.addEventListener("load", function () { try { window.ScrollTrigger.refresh(); } catch (e) {} });
  /* imagery is lazy-loaded, so trigger positions drift after first paint */
  setTimeout(function () { try { window.ScrollTrigger.refresh(); } catch (e) {} }, 1800);
  var alive = false;
  g.ticker.add(function once() {
    alive = true; g.ticker.remove(once);
  });
  setTimeout(function () {
    if (alive) return;
    try {
      var all = owned.concat(stats, plans, spots, cells, checks, steps, accs, cols, tls, tlNodes, photos, prows, pbars);
      all = all.concat(wrows); if (wseal) all.push(wseal);
      document.querySelectorAll(".pl-row__flag, .pl-dev, .wr-row__n, .wr-row__txt, .wr-chip, .wr-col__note, .wr-col__tel, .pk-p__ico, .mo-p__frame, .mo-p__label, .qa-i, [data-qacard], .cta-l i, [data-ctakick], [data-ctasub], [data-ctaact], .st-b__fig, .st-b h3, .st-b p, .st-b__n, [data-strail], .mv-arc, .mv-fig__n, .mv-fig__u, .mv-run__i, .mv-act, .hw-s__art, .hw-s__art img, .hw-s__txt, .hw-act, .cv-dot, .cv-link, .cv-lab, .cv-hub, .cv-ring, .cv-halo, .cv-stat").forEach(function (e) { all.push(e); });
      document.querySelectorAll(".co-h2 .sh-in, .cta-w, .co-eyebrow, .co-lead, .co-plan__ribbon, .co-icon, .co-plan__price b, .co-h2").forEach(function (e) { all.push(e); });
      g.set(all, { clearProps: "all" });
      counters.forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
      document.querySelectorAll("[data-stcount]").forEach(function (el) { el.textContent = el.getAttribute("data-stcount"); });
    } catch (e) {}
  }, 3200);
})();
