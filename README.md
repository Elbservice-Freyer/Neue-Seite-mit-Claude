# ElbService Freyer — Webseite

Glas- und Fensterreinigung in Dresden. Statische Webseite ohne Baukasten,
ohne Framework und ohne Abhängigkeit von fremden Servern.

```
index.html            Startseite
impressum.html        Anbieterkennzeichnung (Pflicht, noch auszufüllen)
datenschutz.html      Datenschutzerklärung (noch zu prüfen)
assets/css/stil.css   das gesamte Gestaltungssystem
assets/css/schriften.css  lokal ausgelieferte Schriften
assets/js/seite.js    Vorher/Nachher-Regler und Anfrageformular
assets/fonts/         Archivo, IBM Plex Sans, IBM Plex Mono (woff2)
assets/img/           Signet, Logo, Platzhalterbilder
```

Zum Ansehen genügt ein Doppelklick auf `index.html`. Für eine Vorschau, die
sich genau wie später im Netz verhält:

```bash
python3 -m http.server 8000     # dann http://localhost:8000 öffnen
```

---

## Vor dem Livegang — die Pflichtliste

Alles, was auf der Seite **gelb schraffiert** ist, ist ein Platzhalter und muss
ersetzt werden. Sie erkennen die Stellen im Browser sofort.

### 1. Kontaktdaten

Drei Angaben, die in mehreren Dateien vorkommen. Am schnellsten mit
Suchen-und-Ersetzen über alle Dateien:

| Suchen | Ersetzen durch |
|---|---|
| `+493511234567` | Ihre Nummer im Format `+4935112345678` (für `tel:`-Links) |
| `0351 123 45 67` | Ihre Nummer in lesbarer Schreibweise |
| `info@elbservice-freyer.de` | Ihre echte E-Mail-Adresse |
| `[Straße und Hausnummer]` | Ihre Anschrift |
| `[PLZ] Dresden` | Ihre Postleitzahl |

Danach in `index.html` bei allen geänderten Stellen `class="platzhalter"`
entfernen, damit die gelbe Markierung verschwindet.

Auf der Kommandozeile geht das in einem Rutsch:

```bash
sed -i 's/+493511234567/+4935187654321/g; s/0351 123 45 67/0351 8765432/g' *.html
```

### 2. Impressum ausfüllen

`impressum.html` enthält alle Felder, die § 5 DDG verlangt. Ohne vollständiges
Impressum ist eine geschäftliche Webseite abmahnfähig. Klären Sie insbesondere:

- vollständiger Firmenname und Rechtsform laut Gewerbeanmeldung
- Umsatzsteuer-Identifikationsnummer **oder** Hinweis auf die
  Kleinunternehmerregelung nach § 19 UStG
- Eintragung in der Handwerksrolle, sofern zutreffend

### 3. Datenschutzerklärung prüfen

`datenschutz.html` beschreibt den Auslieferungszustand: keine Cookies, kein
Statistikwerkzeug, keine fremden Server. Sobald Sie etwas davon ändern — ein
Formulardienst, eine Karte, ein Buchungssystem, Statistik — muss der jeweilige
Abschnitt ergänzt werden. Fragen Sie außerdem beim Hoster nach der
Speicherdauer der Logdateien und nach dem Vertrag zur Auftragsverarbeitung.

### 4. Eigene Fotos einsetzen

**Aufmacher.** Bis Ihr Foto vorliegt, zeichnet die Seite einen Verlauf aus
reinem CSS. In `assets/css/stil.css` bei `.aufmacher__blick` eine Zeile
ergänzen — die dunkle Abstufung darüber bleibt bestehen, damit die Schrift
lesbar bleibt:

```css
.aufmacher__blick {
  background-image:
    linear-gradient(to top, rgba(9, 20, 38, 0.78) 0%, rgba(9, 20, 38, 0.46) 32%,
                    rgba(9, 20, 38, 0.12) 58%, rgba(9, 20, 38, 0) 78%),
    url("../img/aufmacher.jpg");   /* diese Zeile ergänzen */
}
```

Empfehlung: Querformat, mindestens 2400 px breit, unter 400 KB. Ein Motiv, das
unten ruhig ist — dort steht die Schrift.

**Vorher/Nachher.** `assets/img/ergebnis-vorher.svg` und
`ergebnis-nachher.svg` durch zwei eigene Fotos ersetzen und in `index.html`
die Dateinamen anpassen. Wichtig: **exakt derselbe Bildausschnitt**, gleiches
Seitenverhältnis, gleicher Standpunkt. Sonst springt das Bild beim Ziehen.

**Weitere Fotos.** Für eine Referenzgalerie ist noch kein Abschnitt angelegt —
sagen Sie Bescheid, wenn Sie einen brauchen.

### 5. Kundenstimmen

Der Abschnitt „Was Kunden sagen" enthält drei markierte Platzhalter. Setzen
Sie dort **echte** Rückmeldungen ein, und nur mit Einverständnis der Person.
Erfundene Bewertungen sind Wettbewerbsverstöße und werden abgemahnt.
Wenn Sie noch keine haben: den ganzen `<section id="stimmen">`-Block löschen
und später ergänzen.

### 6. Angaben prüfen, die Ihren Betrieb betreffen

Zwei Formulierungen beschreiben Ihre Arbeitsweise und sollten stimmen:

- „Wir arbeiten mit entmineralisiertem Wasser" (Abschnitt Leistungen)
- „Rahmen und Falze sind bei uns immer im Preis enthalten" (Abschnitt Preis)
- die Erreichbarkeitszeiten „Montag bis Freitag, 8 bis 18 Uhr"

---

## Formular anbinden

Im Auslieferungszustand überträgt das Anfrageformular nichts an einen Server.
Es stellt eine fertige E-Mail im Mailprogramm des Besuchers zusammen. Das
funktioniert überall, hat aber zwei Nachteile: auf Geräten ohne eingerichtetes
Mailprogramm passiert nichts, und Sie sehen nicht, wie viele Anfragen abbrechen.

Für einen echten Versand einen Formulardienst eintragen — in `index.html` beim
`<form>`-Element:

```html
<form class="formular" action="https://formspree.io/f/IHRE-ID" method="POST">
```

Danach in `assets/js/seite.js` den Abschnitt „Anfrageformular" entfernen,
damit nicht zusätzlich das Mailprogramm aufgeht. Und daran denken:
Datenschutzerklärung ergänzen (Abschnitt 3).

---

## Gestaltung

Die Seite ist als Fenster gebaut. Flächen sind Scheiben, Trennlinien sind
Sprossen. Deshalb: keine abgerundeten Ecken an Glasflächen, Haarlinien statt
Schlagschatten, und ein Raster mit ungleichen Feldern, wie es die Verglasung
eines Dresdner Altbaufensters hat.

**Farben** stehen als Variablen am Anfang von `stil.css`:

| Variable | Wert | Wofür |
|---|---|---|
| `--tinte` | `#0A0F14` | Schrift, aus dem Logo-Schwarz |
| `--elbe` | `#17356B` | Marineblau der Logo-Welle |
| `--strom` | `#4A72C4` | helleres Wellenblau |
| `--glaskante` | `#1E6E5E` | Akzent |
| `--tageslicht` | `#F7F9FA` | Grundfläche |
| `--dunst` | `#DCE4E9` | Linien und Ränder |

Das Grün ist die Farbe, die Floatglas an der Schnittkante zeigt. Es ersetzt
bewusst das Signalblau, mit dem in dieser Branche fast jede Webseite arbeitet.

**Schriften:** Archivo für Überschriften, breit gestellt wie eine
Fensteröffnung. IBM Plex Sans für den Fließtext. IBM Plex Mono für alles
Technische — Bereichsangaben, Nummern, Maße.

**Der Aufmacher** zieht beim Laden einmal einen Schmutzfilm von der Scheibe.
Wer im Betriebssystem „Bewegung reduzieren" eingestellt hat, sieht die saubere
Scheibe sofort.

---

## Barrierefreiheit

Eingebaut und beim Ändern bitte erhalten:

- Sprungmarke zum Inhalt als erstes Element
- sichtbarer Fokusrahmen auf allen bedienbaren Elementen
- der Vorher/Nachher-Regler ist ein echtes `<input type="range">` und damit
  mit Pfeiltasten und Screenreader bedienbar
- `prefers-reduced-motion` wird respektiert
- Bedienung ab 320 px Breite

---

## Veröffentlichen

Es gibt keinen Bauschritt. Der Ordnerinhalt wird unverändert hochgeladen —
per FTP zu einem Webhoster, oder über einen Dienst wie Netlify, Cloudflare
Pages oder GitHub Pages.

Zwei Dinge beim Hoster einstellen:

1. **HTTPS aktivieren.** Ohne Verschlüsselung stimmt der letzte Abschnitt der
   Datenschutzerklärung nicht mehr.
2. **Umleitung auf eine Adressform.** Entweder immer mit `www.` oder immer
   ohne — sonst zählt Google die Seite doppelt.

Danach `index.html` in den Zeilen `<link rel="canonical">` und
`<meta property="og:image">` auf die echte Domain setzen.
