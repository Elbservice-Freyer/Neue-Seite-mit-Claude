# ElbService Freyer — Webseite

Glas- und Fensterreinigung in Dresden. Statische Webseite ohne Baukasten und
ohne Framework. Einzige Serverkomponente ist das Anfrageformular.

```
index.html            Startseite
danke.html            Bestätigung nach dem Absenden des Formulars
impressum.html        Anbieterkennzeichnung
datenschutz.html      Datenschutzerklärung
kontakt.php           nimmt das Formular entgegen und schickt es als E-Mail
assets/css/stil.css   das gesamte Gestaltungssystem
assets/css/schriften.css  lokal ausgelieferte Schriften
assets/js/seite.js    Vergleichsregler, Großansicht, Formular
assets/fonts/         Archivo, IBM Plex Sans, IBM Plex Mono (woff2)
assets/img/           Signet, Logo, Fotos
```

Vorschau mit PHP, damit auch das Formular läuft:

```bash
php -S localhost:8000     # dann http://localhost:8000 öffnen
```

---

## Was noch offen ist

| Was | Wo |
|---|---|
| **Vorname des Inhabers** | `impressum.html`, zwei Stellen, gelb markiert |
| **Speicherdauer der Server-Logdateien** | `datenschutz.html`, beim Hoster erfragen |
| **Zwei bis drei echte Kundenstimmen** | `index.html`, Abschnitt „Stimmen" |
| **Ein weiteres Referenzfoto** | `index.html`, letzte Kachel der Galerie |
| **Absenderadresse für das Formular** | `kontakt.php`, Konstante `ABSENDER` |
| **Domain in `canonical` und `og:image`** | `index.html`, Kopfbereich |

Alles gelb Schraffierte ist ein Platzhalter. Nach dem Ersetzen jeweils
`class="platzhalter"` entfernen, damit die Markierung verschwindet.

Der Vorname ist Pflicht: Bei einem Einzelunternehmen verlangt § 5 DDG den
vollständigen Vor- und Nachnamen. Der Geschäftsname allein genügt nicht.

---

## Das Anfrageformular

Das Formular wird von `kontakt.php` auf dem eigenen Webspace verarbeitet und
als E-Mail an `elbservice-freyer@gmx.de` geschickt. Bewusst kein externer
Formulardienst: die Daten der Besucher verlassen den Server nicht, es braucht
keinen Vertrag zur Auftragsverarbeitung, und es findet keine Übermittlung in
ein Land außerhalb der EU statt.

**Voraussetzung beim Hoster:** PHP (Version 8 oder neuer) und ein funktionierender
Mailversand. Beides ist bei allen gängigen deutschen Anbietern enthalten.

**Vor dem Livegang einstellen** — in `kontakt.php`, ganz oben:

```php
const EMPFAENGER = 'elbservice-freyer@gmx.de';
const ABSENDER   = 'formular@elbservice-freyer.de';  // anpassen
```

Die Absenderadresse muss zur eigenen Domain gehören, sonst stufen viele
Mailanbieter die Nachricht als Fälschung ein und sie landet im Spam. Legen Sie
beim Hoster ein Postfach oder eine Weiterleitung dafür an.

**Eingebaut:**

- ein für Menschen unsichtbares Feld, das nur Maschinen ausfüllen
- eine Mindestdauer von drei Sekunden zwischen Aufruf und Absenden
- höchstens eine Anfrage pro Minute je Besucher
- Längenbegrenzung aller Felder und Schutz vor eingeschleusten Kopfzeilen
- Antwort direkt auf der Seite, wenn JavaScript läuft; sonst Weiterleitung auf
  `danke.html`. Ohne JavaScript funktioniert das Formular vollständig.

**Testen nach dem Hochladen:** einmal absenden und prüfen, ob die E-Mail
ankommt. Kommt nichts an, liegt es fast immer an der Absenderadresse.

**Falls der Hoster kein PHP kann:** dann bleibt nur ein externer Dienst
(Formspree, FormSubmit). Beide sitzen in den USA — dann muss die
Datenschutzerklärung um Anbieter, Rechtsgrundlage und Drittlandübermittlung
ergänzt werden. Der eigene Server ist der sauberere Weg.

---

## Fotos austauschen

| Datei | Wo sie erscheint | Format |
|---|---|---|
| `aufmacher.jpg` | Kopfbild und zweite Galeriekachel | quer, ab 2000 px breit |
| `vergleich-vorher.jpg` | linke Seite des Reglers | 4:3, gleicher Ausschnitt wie nachher |
| `vergleich-nachher.jpg` | rechte Seite des Reglers | 4:3, gleicher Ausschnitt wie vorher |
| `wintergarten.jpg` | große Galeriekachel | hoch oder quadratisch |
| `portraet-freyer.jpg` | Abschnitt „Wer kommt" | hoch, Kopf im oberen Drittel |

Beim Vergleichsregler kommt es auf den Ausschnitt an: gleicher Standpunkt,
gleicher Bildwinkel, gleiches Seitenverhältnis. Am besten das Handy für beide
Aufnahmen an derselben Stelle halten. Je genauer die Bilder übereinanderliegen,
desto stärker wirkt der Effekt.

Für die Galerie eine neue Kachel nach dem Muster der vorhandenen einfügen —
`data-gross` ist das Bild für die Großansicht, `data-text` die Bildunterschrift.

Neue Fotos vor dem Hochladen verkleinern (unter 400 KB), sonst wird die Seite
auf dem Handy langsam.

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
Technische. Alle drei liegen im Projekt und werden vom eigenen Server
ausgeliefert — so geht beim Seitenaufruf keine IP-Adresse an Google.

**Der Aufmacher** zieht beim Laden einmal einen Schmutzfilm von der Scheibe.
Wer im Betriebssystem „Bewegung reduzieren" eingestellt hat, sieht die saubere
Scheibe sofort.

---

## Barrierefreiheit

Eingebaut und beim Ändern bitte erhalten:

- Sprungmarke zum Inhalt als erstes Element
- sichtbarer Fokusrahmen auf allen bedienbaren Elementen
- der Vergleichsregler ist ein echtes `<input type="range">` und damit mit
  Pfeiltasten und Screenreader bedienbar
- die Großansicht der Galerie ist ein `<dialog>`: Escape schließt, der Fokus
  bleibt darin gefangen, die Pfeiltasten blättern
- `prefers-reduced-motion` wird respektiert
- Bedienung ab 320 px Breite, kein waagerechter Überlauf

---

## Veröffentlichen

Kein Bauschritt. Der Ordnerinhalt wird unverändert hochgeladen, per FTP zu
einem Webhoster mit PHP.

Statische Dienste wie Netlify, Cloudflare Pages oder GitHub Pages funktionieren
für die Seite selbst, führen aber kein PHP aus — dort würde das Formular nicht
arbeiten.

Zwei Dinge beim Hoster einstellen:

1. **HTTPS aktivieren.** Ohne Verschlüsselung stimmt der letzte Abschnitt der
   Datenschutzerklärung nicht mehr.
2. **Umleitung auf eine Adressform.** Entweder immer mit `www.` oder immer
   ohne — sonst zählt Google die Seite doppelt.

Danach in `index.html` die Zeilen `<link rel="canonical">` und
`<meta property="og:image">` auf die echte Domain setzen.
