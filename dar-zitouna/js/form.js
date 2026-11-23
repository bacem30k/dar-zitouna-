/* Validation des formulaires (réservation et contact) */
(function () {
  "use strict";

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_RE = /^(\+216)?[\s.-]?\d{2}[\s.-]?\d{3}[\s.-]?\d{3}$/;

  function showError(field, message) {
    const err = document.getElementById(field.id + "-error");
    if (err) err.textContent = message;
    field.setAttribute("aria-invalid", message ? "true" : "false");
  }

  /* Retourne un message d'erreur, ou "" si le champ est valide */
  function check(field) {
    const v = field.value.trim();
    if (field.required && v === "") return "Ce champ est obligatoire.";
    if (v === "") return "";
    if (field.type === "email" && !EMAIL_RE.test(v)) return "Format d'e-mail invalide (ex. nom@exemple.com).";
    if (field.type === "tel" && !PHONE_RE.test(v)) return "Numéro invalide (8 chiffres, ex. 20 123 456).";
    if (field.dataset.min && v.length < Number(field.dataset.min)) {
      return "Minimum " + field.dataset.min + " caractères (actuellement " + v.length + ").";
    }
    if (field.type === "date") {
      const chosen = new Date(v + "T00:00:00");
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (chosen < today) return "La date doit être aujourd'hui ou plus tard.";
      if (chosen.getDay() === 1) return "Le restaurant est fermé le lundi.";
    }
    if (field.type === "number") {
      const n = Number(v);
      if (n < Number(field.min) || n > Number(field.max)) {
        return "Choisissez une valeur entre " + field.min + " et " + field.max + ".";
      }
    }
    return "";
  }

  document.querySelectorAll("form[data-validate]").forEach(function (form) {
    const fields = form.querySelectorAll("input, select, textarea");

    fields.forEach(function (f) {
      f.addEventListener("blur", function () { showError(f, check(f)); });
      f.addEventListener("input", function () {
        if (f.getAttribute("aria-invalid") === "true") showError(f, check(f));
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let firstInvalid = null;
      fields.forEach(function (f) {
        const msg = check(f);
        showError(f, msg);
        if (msg && !firstInvalid) firstInvalid = f;
      });
      const ok = form.querySelector(".form-success");
      if (firstInvalid) {
        if (ok) ok.classList.remove("show");
        firstInvalid.focus();
        return;
      }
      if (ok) {
        ok.classList.add("show");
        ok.focus();
      }
      form.reset();
      fields.forEach(function (f) { f.removeAttribute("aria-invalid"); });
      const total = document.getElementById("total");
      if (total) total.textContent = "0";
    });
  });

  /* Date minimale = aujourd'hui (réservation) */
  const dateField = document.getElementById("date");
  if (dateField) dateField.min = new Date().toISOString().split("T")[0];

  /* Estimation du budget (nombre de personnes × prix moyen par menu) */
  const guests = document.getElementById("guests");
  const formula = document.getElementById("formula");
  const total = document.getElementById("total");
  function estimate() {
    if (!guests || !formula || !total) return;
    const n = Number(guests.value) || 0;
    total.textContent = (n * Number(formula.value || 0)).toString();
  }
  if (guests && formula) {
    guests.addEventListener("input", estimate);
    formula.addEventListener("change", estimate);
  }

  /* Compteur de caractères du message */
  const msg = document.getElementById("message");
  const counter = document.getElementById("char-count");
  if (msg && counter) {
    msg.addEventListener("input", function () { counter.textContent = msg.value.length; });
  }
})();
