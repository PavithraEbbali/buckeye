/* ==========================================================================
   HERO motion — asymmetric photo poster

   One load-triggered storyboard, in reading order:

     kicker rule wipes  ->  headline line 1  ->  line 2  ->  line 3 + the
     gradient rule draws under it  ->  body copy  ->  buttons  ->  the offer
     block rises off the photo (speed counts up)  ->  trust strip deals across

   Reliability contract (do not break):
     · the markup is authored in its VISIBLE end state; we only ever animate
       *from* an offset, so a thrown error or a missing GSAP leaves the hero
       fully readable
     · transform-only entrances — nothing above the fold is hidden with
       opacity, so the LCP text paints on the first frame
     · load-triggered only. No ScrollTrigger anywhere in this file
     · prefers-reduced-motion: final state immediately, hovers still live
     · a 2.4s failsafe force-completes if the ticker never runs
   ========================================================================== */
(function () {
  "use strict";

  var hero = document.querySelector("[data-ph]");
  if (!hero) return;

  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  var q  = function (s) { return hero.querySelector(s); };
  var qa = function (s) { return Array.prototype.slice.call(hero.querySelectorAll(s)); };

  var kick   = q("[data-phkick]");
  var krule  = q(".ph-kicker__rule");
  var lines  = qa("[data-phline]");
  var mark   = q("[data-phmark]");
  var sub    = q("[data-phsub]");
  var act    = q("[data-phact]");
  var btns   = qa("[data-phact] .ph-btn");
  var offer  = q("[data-phoffer]");
  var ostats = qa("[data-phostat]");
  var num    = q("[data-phnum]");
  var strip  = qa("[data-phstrip] li");
  var shot   = q(".ph-shot");
  var plate  = q(".ph-img");
  var glint  = q("[data-phglint]");

  /* the end state, reachable from anywhere */
  function settle() {
    var gg = window.gsap;
    if (num) num.textContent = "1";
    var unit = q(".ph-offer__speed em"); if (unit) unit.textContent = "Gig";
    if (mark) { mark.style.strokeDasharray = "none"; mark.style.strokeDashoffset = "0"; }
    var all = [kick, krule, sub, act, offer, shot, plate, glint]
      .concat(lines, btns, ostats, strip,
              Array.prototype.slice.call(hero.querySelectorAll(".ph-w__i"))).filter(Boolean);
    if (gg) { try { gg.set(all, { clearProps: "transform,opacity" }); } catch (e) {} }
    all.forEach(function (el) { el.style.transform = ""; });
  }

  var g = window.gsap;
  if (!g || reduce) { settle(); return; }

  var tl = g.timeline({ defaults: { ease: "power4.out" } });
  hero.__tl = tl;                       // handle for verification

  /* 1 — the kicker rule wipes out, then the label follows */
  if (krule) tl.from(krule, { scaleX: 0, duration: .5, ease: "power2.inOut" });
  if (kick)  tl.from(kick,  { y: -12, duration: .5 }, "-=.34");

  /* 2 — headline builds line by line out of its clipping masks */
  /* Each line is split into words so the headline builds word by word with a
     3D hinge rather than three flat slabs sliding up. Words stay in nowrap
     wrappers so a line break can never fall mid-word. */
  function splitWords(el) {
    if (el.__w) return el.__w;
    var parts = el.textContent.split(/(\s+)/);
    el.textContent = "";
    var out = [];
    parts.forEach(function (t) {
      if (!t.trim()) { el.appendChild(document.createTextNode(t)); return; }
      var w = document.createElement("span"); w.className = "ph-w";
      var i = document.createElement("span"); i.className = "ph-w__i"; i.textContent = t;
      w.appendChild(i); el.appendChild(w); out.push(i);
    });
    el.__w = out;
    return out;
  }
  var words = lines.map(splitWords).reduce(function (a, b) { return a.concat(b); }, []);

  tl.from(words, { yPercent: 118, rotationX: -72, duration: .95,
    stagger: { each: .055, from: "start" },
    onComplete: function () { g.set(words, { clearProps: "transform" }); } }, "-=.24");

  /* 3 — the promise line earns its own beat: the gradient rule draws */
  if (mark) {
    var len = 320;
    try { len = mark.getTotalLength() || 320; } catch (e) {}
    g.set(mark, { strokeDasharray: len, strokeDashoffset: len });
    tl.to(mark, { strokeDashoffset: 0, duration: .72, ease: "power2.inOut" }, "-=.30");
  }

  /* 4 — body copy, 5 — buttons */
  if (sub)         tl.from(sub,  { y: 18, duration: .58 }, "-=.40");
  if (btns.length) tl.from(btns, { y: 18, duration: .55, stagger: .09 }, "-=.34");

  /* 6 — the offer lifts off the photograph, then its lines settle in */
  if (offer)         tl.from(offer,  { x: 34, duration: .85, ease: "power3.out" }, "-=.62");
  if (ostats.length) tl.from(ostats, { y: 16, duration: .5, stagger: .08 }, "-=.55");

  /* the speed counts up on a linear tween — on an eased one the digits reach
     the Gig threshold almost immediately and the count never reads */
  if (num) {
    var reading = { v: 0 };
    var unitEl = q(".ph-offer__speed em");
    tl.to(reading, {
      v: 1000, duration: 1.1, ease: "none",
      onUpdate: function () {
        if (reading.v < 985) {
          num.textContent = String(Math.round(reading.v / 50) * 50);
          if (unitEl) unitEl.textContent = "Mbps";
        } else {
          num.textContent = "1";
          if (unitEl) unitEl.textContent = "Gig";
        }
      },
      onComplete: function () {
        num.textContent = "1";
        if (unitEl) unitEl.textContent = "Gig";
      }
    }, "-=.72");
  }

  /* 7 — the trust strip deals across, left to right.
     clearProps so the CSS hover states are not out-specified by a leftover
     inline transform once the entrance has landed. */
  if (strip.length) tl.from(strip, { y: 22, duration: .5, stagger: .07,
    clearProps: "transform" }, "-=.5");

  /* 8 — the plate settles: a slow push-in that lands as the copy finishes.
     Transform-only, so the image is painted at full opacity from frame one. */
  if (plate) tl.from(plate, { scale: 1.14, duration: 1.6, ease: "power3.out" }, 0);

  /* 9 — a single glint rakes across the offer once it has landed */
  if (glint) {
    g.set(glint, { xPercent: -160, skewX: -14 });
    tl.to(glint, { xPercent: 320, duration: 1.1, ease: "power2.inOut" }, "-=.25");
  }

  /* a single sheen travels the payoff line once it has landed */
  var keyLine = q(".ph-h__l--key");
  if (keyLine && !keyLine.querySelector(".ph-h__sheen")) {
    var sheen = document.createElement("span");
    sheen.className = "ph-h__sheen";
    sheen.setAttribute("aria-hidden", "true");
    keyLine.appendChild(sheen);
    g.set(sheen, { xPercent: -130 });
    tl.to(sheen, { xPercent: 130, duration: 1.0, ease: "power2.inOut" }, "-=.9");
  }

  /* the strip icons draw themselves rather than just appearing */
  var stripIcons = qa("[data-phstrip] li svg");
  stripIcons.forEach(function (ic) {
    var len = 24;
    try { var pth = ic.querySelector("use, path"); if (pth && pth.getTotalLength) len = pth.getTotalLength() || 24; } catch (e) {}
    g.set(ic, { strokeDasharray: len, strokeDashoffset: len });
  });
  if (stripIcons.length) {
    tl.to(stripIcons, { strokeDashoffset: 0, duration: .7, ease: "power2.out", stagger: .07,
      onComplete: function () { g.set(stripIcons, { clearProps: "strokeDasharray,strokeDashoffset" }); } }, "-=.42");
  }

  /* ---- interaction: depth ------------------------------------------------
     Copy, plate and offer each answer the pointer at their own rate. Same
     input, three different responses — that is what reads as depth rather
     than a single layer being nudged. Pointer-only; never gated on scroll. */
  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (fine) {
    var layers = [
      /* drift the PLATE inside its clip, never the container — moving the
         container would drag the grade/feather overlays with it and re-open
         the raw edge this clip exists to prevent */
      { el: plate, mx: -18, my: -11, rot:  0 },
      { el: offer, mx:  18, my:  11, rot: -0.8 },
      { el: q(".ph-copy"), mx: 9, my: 6, rot: 0 }
    ].filter(function (l) { return l.el; });

    layers.forEach(function (l) {
      l.qx = g.quickTo(l.el, "x", { duration: 1.0, ease: "power3.out" });
      l.qy = g.quickTo(l.el, "y", { duration: 1.0, ease: "power3.out" });
      if (l.rot) l.qr = g.quickTo(l.el, "rotation", { duration: 1.2, ease: "power3.out" });
    });

    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      if (!r.width || !r.height) return;
      var nx = (e.clientX - r.left) / r.width - .5;
      var ny = (e.clientY - r.top) / r.height - .5;
      layers.forEach(function (l) {
        l.qx(nx * l.mx); l.qy(ny * l.my);
        if (l.qr) l.qr(nx * l.rot);
      });
    }, { passive: true });

    hero.addEventListener("mouseleave", function () {
      layers.forEach(function (l) { l.qx(0); l.qy(0); if (l.qr) l.qr(0); });
    }, { passive: true });
  }

  /* press feedback — not gated on `fine`, so touch gets it too */
  btns.forEach(function (b) {
    b.addEventListener("pointerdown", function () { g.to(b, { scale: .96, duration: .12 }); });
    ["pointerup", "pointerleave", "pointercancel"].forEach(function (ev) {
      b.addEventListener(ev, function () { g.to(b, { scale: 1, duration: .28, ease: "back.out(2)" }); });
    });
  });

  /* ---- failsafe: never leave the hero mid-build -------------------------- */
  var alive = false;
  g.ticker.add(function once() { alive = true; g.ticker.remove(once); });
  setTimeout(function () {
    if (alive) return;
    try { tl.progress(1); } catch (e) {}
    settle();
  }, 2400);
})();
