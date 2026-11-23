/* Interactions communes à toutes les pages */
(function () {
  "use strict";

  /* 1) Mode clair / sombre (mémorisé dans localStorage) */
  const root = document.documentElement;
  const themeBtn = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeBtn) {
      themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
      themeBtn.setAttribute("aria-label", theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre");
    }
  }

  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) { /* stockage indisponible */ }
  applyTheme(saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) { /* ignoré */ }
    });
  }

  /* 2) Menu burger */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("main-nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      const open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        burger.focus();
      }
    });
  }

  /* 3) Année dans le pied de page */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* 4) Compteurs animés (page d'accueil) */
  const counters = document.querySelectorAll("[data-count]");
  function animate(el) {
    const target = Number(el.dataset.count);
    const duration = 1200;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(p * target).toLocaleString("fr-FR");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animate(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { obs.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.dataset.count; });
  }

  /* 5) Statut « ouvert / fermé » + jour courant dans le tableau des horaires */
  const status = document.getElementById("open-status");
  const rows = document.querySelectorAll("[data-day]");
  if (status || rows.length) {
    const now = new Date();
    const day = now.getDay(); // 0 = dimanche
    const hour = now.getHours() + now.getMinutes() / 60;
    // Ouvert tous les jours 12h–23h, vendredi 14h–23h ; fermé le lundi
    let open = false;
    if (day !== 1) open = hour >= (day === 5 ? 14 : 12) && hour < 23;
    if (status) {
      status.textContent = open ? "Ouvert maintenant" : "Fermé actuellement";
      status.style.color = open ? "var(--success)" : "var(--error)";
    }
    rows.forEach(function (r) {
      if (Number(r.dataset.day) === day) r.classList.add("today");
    });
  }
})();
