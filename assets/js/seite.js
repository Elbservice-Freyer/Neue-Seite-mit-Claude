/* ElbService Freyer — Verhalten der Seite.
   Drei Dinge: der Regler zwischen vorher und nachher, die Grossansicht der
   Referenzfotos und das Anfrageformular. Alles funktioniert auch ohne
   JavaScript, nur eben ohne die Bequemlichkeiten. */

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

  /* --- Referenzfotos in Gross ------------------------------------------
     Ohne JavaScript bleiben die Bilder in ihrer Kachelgroesse sichtbar,
     es geht also nichts verloren. */

  var lupe = document.getElementById("lupe");
  var galerie = document.getElementById("galerie");

  if (lupe && galerie && typeof lupe.showModal === "function") {
    var bild = document.getElementById("lupe-bild");
    var text = document.getElementById("lupe-text");
    var stuecke = [].slice.call(galerie.querySelectorAll("button[data-gross]"));
    var offen = 0;

    function anzeigen(nummer) {
      offen = (nummer + stuecke.length) % stuecke.length;
      var stueck = stuecke[offen];
      bild.src = stueck.dataset.gross;
      bild.alt = stueck.querySelector("img").alt;
      text.textContent = stueck.dataset.text;
    }

    stuecke.forEach(function (stueck, nummer) {
      stueck.addEventListener("click", function () {
        anzeigen(nummer);
        lupe.showModal();
      });
    });

    lupe.querySelector("[data-lupe-zu]").addEventListener("click", function () {
      lupe.close();
    });
    lupe.querySelector("[data-lupe-zurueck]").addEventListener("click", function () {
      anzeigen(offen - 1);
    });
    lupe.querySelector("[data-lupe-weiter]").addEventListener("click", function () {
      anzeigen(offen + 1);
    });

    lupe.addEventListener("keydown", function (ereignis) {
      if (ereignis.key === "ArrowLeft")  { anzeigen(offen - 1); }
      if (ereignis.key === "ArrowRight") { anzeigen(offen + 1); }
    });

    /* Klick auf den dunklen Grund neben dem Bild schliesst die Ansicht. */
    lupe.addEventListener("click", function (ereignis) {
      if (ereignis.target === lupe) lupe.close();
    });
  }

  /* --- Anfrageformular ---------------------------------------------------
     Ohne JavaScript schickt der Browser das Formular an kontakt.php und
     landet auf danke.html. Mit JavaScript bleibt der Besucher auf der Seite
     und bekommt die Antwort direkt unter dem Absendeknopf. */

  var formular = document.querySelector("[data-anfrage]");
  if (!formular) return;

  /* Wer oben "Gewerbe" anklickt, findet die Auswahl im Formular schon gesetzt. */
  document.querySelectorAll("a[data-art]").forEach(function (weg) {
    weg.addEventListener("click", function () {
      var feld = formular.querySelector('input[name="art"][value="' + weg.dataset.art + '"]');
      if (feld) feld.checked = true;
    });
  });

  /* Zeitstempel fuer die Prüfung auf der Serverseite */
  var gestartet = formular.querySelector('input[name="gestartet"]');
  if (gestartet) gestartet.value = String(Date.now());

  var meldung = document.getElementById("formular-meldung");
  var knopf = formular.querySelector('button[type="submit"]');
  var knopfText = knopf ? knopf.innerHTML : "";

  function melden(art, satz) {
    if (!meldung) return;
    meldung.className = "meldung meldung--" + art;
    meldung.textContent = satz;
    meldung.hidden = false;
  }

  formular.addEventListener("submit", function (ereignis) {
    if (!formular.checkValidity()) return; /* Browser meldet die Luecke selbst */
    if (!window.fetch) return;             /* aeltere Browser senden normal ab */

    ereignis.preventDefault();
    if (meldung) meldung.hidden = true;
    if (knopf) { knopf.disabled = true; knopf.textContent = "Wird gesendet …"; }

    fetch(formular.action, {
      method: "POST",
      body: new FormData(formular),
      headers: { "X-Requested-With": "XMLHttpRequest" }
    })
      .then(function (antwort) {
        return antwort.json().then(function (daten) {
          return { ok: antwort.ok, daten: daten };
        });
      })
      .then(function (ergebnis) {
        if (ergebnis.ok && ergebnis.daten.erfolg) {
          formular.reset();
          if (gestartet) gestartet.value = String(Date.now());
          melden("gut", ergebnis.daten.text);
        } else {
          melden("fehl", ergebnis.daten.text ||
            "Die Anfrage konnte nicht gesendet werden. Bitte rufen Sie uns an: 0152 22478238.");
        }
      })
      .catch(function () {
        melden("fehl", "Die Verbindung hat nicht geklappt. Bitte rufen Sie uns an: " +
          "0152 22478238, oder schreiben Sie an elbservice-freyer@gmx.de.");
      })
      .then(function () {
        if (knopf) { knopf.disabled = false; knopf.innerHTML = knopfText; }
      });
  });
})();
