/* ElbService Freyer — Verhalten der Seite.
   Zwei Dinge: der Regler zwischen vorher und nachher, und das Anfrageformular. */

(function () {
  "use strict";

  /* --- Vorher/Nachher ---------------------------------------------------
     Der sichtbare Zustand haengt allein an der CSS-Variablen --stand.
     Gezogen wird an einem echten <input type="range">, das unsichtbar
     ueber dem Bild liegt: damit funktionieren Maus, Finger, Pfeiltasten
     und Screenreader ohne eigenen Code. */

  document.querySelectorAll("[data-ergebnis]").forEach(function (rahmen) {
    var regler = rahmen.querySelector(".ergebnis__regler");
    if (!regler) return;

    function zeichnen() {
      rahmen.style.setProperty("--stand", regler.value + "%");
    }

    regler.addEventListener("input", zeichnen);
    zeichnen();
  });

  /* --- Anfrageformular ---------------------------------------------------
     Die Seite laeuft ohne Server. Bis ein Formulardienst angebunden ist,
     stellt das Formular eine fertige E-Mail im Mailprogramm zusammen.
     Zum Umstellen: siehe README, Abschnitt "Formular anbinden". */

  var formular = document.querySelector("[data-anfrage]");
  if (!formular) return;

  /* Wer oben "Gewerbe" anklickt, findet die Auswahl im Formular schon gesetzt. */
  document.querySelectorAll("a[data-art]").forEach(function (weg) {
    weg.addEventListener("click", function () {
      var feld = formular.querySelector('input[name="art"][value="' + weg.dataset.art + '"]');
      if (feld) feld.checked = true;
    });
  });

  var ziel = formular.getAttribute("data-empfaenger") || "";

  formular.addEventListener("submit", function (ereignis) {
    if (!formular.checkValidity()) return; /* Browser meldet die Luecke selbst */
    ereignis.preventDefault();

    var daten = new FormData(formular);
    var art = daten.get("art") === "gewerbe" ? "Gewerbe" : "Privat";

    var zeilen = [
      "Art der Anfrage: " + art,
      "Name: " + (daten.get("name") || ""),
      "E-Mail: " + (daten.get("email") || ""),
      "Telefon: " + (daten.get("telefon") || "nicht angegeben"),
      "Objekt / Anschrift: " + (daten.get("objekt") || "nicht angegeben"),
      "",
      "Nachricht:",
      daten.get("nachricht") || ""
    ];

    var betreff = "Anfrage " + art + " — Fensterreinigung";
    var adresse = "mailto:" + ziel +
      "?subject=" + encodeURIComponent(betreff) +
      "&body=" + encodeURIComponent(zeilen.join("\n"));

    window.location.href = adresse;
  });
})();
