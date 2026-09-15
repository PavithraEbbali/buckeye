/* Buckeye Broadband Authorized Agent — interaction + motion layer (vanilla, dependency-free)
   Techniques: IntersectionObserver scroll reveal + stagger, rAF mouse
   parallax, 3D perspective tilt, spotlight tracking, count-up tickers,
   scroll progress, sticky header, smooth accordions. GSAP/Framer-grade
   feel, zero external weight, prefers-reduced-motion respected. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---- 1. Scroll reveal + stagger + counters (rect scroll-spy) ----------
     Deliberately NOT IntersectionObserver-only: a rect-based scroll-spy
     fires reliably everywhere and a timed failsafe guarantees no element
     is ever left hidden, even if scroll/paint events misbehave. */
  function animateCounter(el) {
    if (el.__counted) return; el.__counted = true;
    var target = parseFloat(el.getAttribute("data-count"));
    var dec = (el.getAttribute("data-count").split(".")[1] || "").length;
    if (reduce) { el.textContent = target.toFixed(dec); return; }
    el.textContent = "0";
    var start = null, dur = 1500;
    requestAnimationFrame(function loop(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = (target * (1 - Math.pow(1 - p, 3))).toFixed(dec);
      if (p < 1) requestAnimationFrame(loop); else el.textContent = target.toFixed(dec);
    });
  }
  function initReveal() {
    var reveals = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
    if (reduce) {
      reveals.forEach(function (el) { el.classList.add("is-in"); });
      counters.forEach(animateCounter);
      return;
    }
    function reveal(el) {
      if (el.classList.contains("is-in")) return;
      var g = el.parentElement;
      var sibs = g ? Array.prototype.slice.call(g.querySelectorAll(":scope > [data-reveal]")) : [el];
      el.style.setProperty("--d", Math.max(0, sibs.indexOf(el)) * 85 + "ms");
      el.classList.add("is-in");
    }
    var ticking = false;
    function check() {
      ticking = false;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      for (var i = 0; i < reveals.length; i++) {
        var el = reveals[i];
        if (el.classList.contains("is-in")) continue;
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > -60) reveal(el);
      }
      for (var j = 0; j < counters.length; j++) {
        var c = counters[j];
        if (c.__counted) continue;
        var cr = c.getBoundingClientRect();
        if (cr.top < vh * 0.88 && cr.bottom > 0) animateCounter(c);
      }
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(check); } }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("load", check);
    check();
    // Capability failsafe: if requestAnimationFrame never fires (headless,
    // background tab, low-power mode), force final states so nothing is stuck.
    var rafAlive = false;
    requestAnimationFrame(function () { rafAlive = true; });
    setTimeout(function () {
      if (rafAlive) return;
      reveals.forEach(reveal);
      counters.forEach(function (c) {
        var t = parseFloat(c.getAttribute("data-count"));
        var dec = (c.getAttribute("data-count").split(".")[1] || "").length;
        c.__counted = true; c.textContent = t.toFixed(dec);
      });
    }, 450);
  }

  /* ---- 2. Word-by-word headline reveal ---------------------------------- */
  function initWords() {
    var host = document.querySelector("[data-words]");
    if (!host) return;
    var text = host.textContent.trim();
    host.textContent = "";
    host.classList.add("co-words");
    text.split(/\s+/).forEach(function (w, i) {
      var s = document.createElement("span");
      s.className = "co-word"; s.textContent = w;
      host.appendChild(s);
      host.appendChild(document.createTextNode(" "));
      if (!reduce) {
        s.style.transition = "opacity .7s ease, transform .8s cubic-bezier(.22,1,.36,1)";
        s.style.transitionDelay = (i * 70 + 150) + "ms";
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { s.style.opacity = 1; s.style.transform = "none"; });
        });
      } else { s.style.opacity = 1; s.style.transform = "none"; }
    });
  }

  /* ---- 3. Mouse parallax (hero aurora + floating shapes) ---------------- */
  function initParallax() {
    if (!supportsHover || reduce) return;
    var layers = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
    if (!layers.length) return;
    var tx = 0, ty = 0, cx = 0, cy = 0, ticking = false;
    function onMove(e) {
      var w = window.innerWidth, h = window.innerHeight;
      tx = (e.clientX / w - 0.5) * 2;
      ty = (e.clientY / h - 0.5) * 2;
      if (!ticking) { ticking = true; requestAnimationFrame(loop); }
    }
    function loop() {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      layers.forEach(function (l) {
        var d = parseFloat(l.getAttribute("data-parallax")) || 20;
        l.style.transform = "translate3d(" + (-cx * d) + "px," + (-cy * d) + "px,0)";
      });
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) requestAnimationFrame(loop);
      else ticking = false;
    }
    window.addEventListener("mousemove", onMove, { passive: true });
  }

  /* ---- 4. 3D tilt on cards ---------------------------------------------- */
  function initTilt() {
    if (!supportsHover || reduce) return;
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-tilt]"));
    cards.forEach(function (card) {
      var max = parseFloat(card.getAttribute("data-tilt")) || 8;
      var raf = null;
      function move(e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          card.style.transform = "perspective(900px) rotateX(" + (-py * max) + "deg) rotateY(" + (px * max) + "deg) translateY(-6px)";
        });
      }
      function leave() {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = "";
      }
      card.addEventListener("mousemove", move, { passive: true });
      card.addEventListener("mouseleave", leave);
    });
  }

  /* ---- 5. Spotlight follow (cards with ::before glow) ------------------- */
  function initSpotlight() {
    if (!supportsHover) return;
    var spots = Array.prototype.slice.call(document.querySelectorAll("[data-spot]"));
    spots.forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - r.left) + "px");
        el.style.setProperty("--my", (e.clientY - r.top) + "px");
      }, { passive: true });
    });
  }

  /* ---- 6. Count-up tickers: handled by the scroll-spy in initReveal ----- */

  /* ---- 7. Sticky header + scroll progress + back-to-top ----------------- */
  function initScrollUI() {
    var header = document.querySelector("[data-header]");
    var bar = document.querySelector("[data-progress]");
    var top = document.querySelector("[data-totop]");
    var ticking = false;
    function update() {
      var y = window.pageYOffset;
      if (header) header.classList.toggle("is-stuck", y > 8);
      if (bar) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = "scaleX(" + (h > 0 ? y / h : 0) + ")";
      }
      if (top) top.classList.toggle("is-show", y > 600);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
    if (top) top.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  /* ---- 8. Mobile menu ---------------------------------------------------- */
  function initMenu() {
    var burger = document.querySelector("[data-burger]");
    var menu = document.querySelector("[data-menu]");
    if (!burger || !menu) return;
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { menu.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ---- 9. Single-open accordion (nice-to-have) -------------------------- */
  function initFaq() {
    var accs = Array.prototype.slice.call(document.querySelectorAll("[data-qai]"));
    accs.forEach(function (a) {
      a.addEventListener("toggle", function () {
        if (a.open) accs.forEach(function (o) { if (o !== a) o.open = false; });
      });
    });
  }

  /* ---- 10. Custom glowing-dot cursor ------------------------------------ */
  function initCursor() {
    if (!supportsHover || reduce) return;
    var dot = document.createElement("div"); dot.className = "co-cursor co-cursor--dot";
    var ring = document.createElement("div"); ring.className = "co-cursor co-cursor--ring";
    document.body.appendChild(dot); document.body.appendChild(ring);
    document.body.classList.add("has-cursor");
    /* Park both off-screen immediately. Without this they sit at left:0;top:0
       until the first pointermove, which paints a stray blue dot in the
       top-left corner of the hero. */
    dot.style.transform = "translate(-200px,-200px) translate(-50%,-50%)";
    ring.style.transform = "translate(-200px,-200px) translate(-50%,-50%)";
    var tx = 0, ty = 0, rx = 0, ry = 0, shown = false, raf = null, hovering = false;
    var sel = "a,button,summary,[role='button'],input,label,.ph-btn,.co-btn";
    function place(el, x, y) { el.style.transform = "translate(" + x + "px," + y + "px) translate(-50%,-50%)"; }
    function loop() {
      rx += (tx - rx) * 0.2; ry += (ty - ry) * 0.2; place(ring, rx, ry);
      if (Math.abs(tx - rx) > 0.1 || Math.abs(ty - ry) > 0.1) raf = requestAnimationFrame(loop); else raf = null;
    }
    function show() { if (!shown) { shown = true; dot.classList.add("is-visible"); ring.classList.add("is-visible"); } }
    function hide() { shown = false; dot.classList.remove("is-visible"); ring.classList.remove("is-visible"); }
    document.addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY; place(dot, tx, ty);
      if (!shown) { rx = tx; ry = ty; place(ring, tx, ty); show(); }
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    document.addEventListener("pointerover", function (e) { if (e.target.closest && e.target.closest(sel)) { hovering = true; ring.classList.add("is-active"); } }, { passive: true });
    document.addEventListener("pointerout", function (e) { if (e.target.closest && e.target.closest(sel)) { hovering = false; ring.classList.remove("is-active"); } }, { passive: true });
    document.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
  }

  function boot() {
    initReveal(); initWords(); initParallax(); initTilt();
    initSpotlight(); initScrollUI(); initMenu(); initFaq(); initCursor();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
