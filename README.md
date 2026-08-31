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
assets/js/seite.js    Vergleichsregler, Großansicht, Formular, Auftritt beim Scrollen
assets/fonts/         Archivo, IBM Plex Sans, IBM Plex Mono (woff2)
assets/img/           Signet, Logo, Fotos — je Foto ein JPG und die WebP-Fassungen
werkzeug/bilder.py    legt die WebP-Fassungen an (nur beim Bildwechsel nötig)
```

Vorschau mit PHP, damit auch das Formular läuft:

```bash
php -S localhost:8000     # dann http://localhost:8000 öffnen
```

---

## Was noch offen ist

| Was | Wo |
|---|---|
| **Speicherdauer der Server-Logdateien** | `datenschutz.html`, beim Hoster erfragen |
| **Absenderadresse für das Formular** | `kontakt.php`, Konstante `ABSENDER` |
| **Öffnungszeiten** | `index.html`, strukturierte Daten — siehe unten |

Alles gelb Schraffierte ist ein Platzhalter. Nach dem Ersetzen jeweils
`class="platzhalter"` entfernen, damit die Markierung verschwindet.

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
| `dachfenster.jpg` | Galerie | hoch oder quadratisch |
| `gaststaette.jpg` | großes Galeriefeld | quer, 4:3 |
| `glasfassade.jpg`, `altbau-erdgeschoss.jpg`, `altbau-holzfenster.jpg` | Galerie | hoch, 3:4 |

Beim Vergleichsregler kommt es auf den Ausschnitt an: gleicher Standpunkt,
gleicher Bildwinkel, gleiches Seitenverhältnis. Am besten das Handy für beide
Aufnahmen an derselben Stelle halten. Je genauer die Bilder übereinanderliegen,
desto stärker wirkt der Effekt.

Für die Galerie eine neue Kachel nach dem Muster der vorhandenen einfügen —
`data-gross` ist das Bild für die Großansicht, `data-text` die Bildunterschrift.
Das große Feld trägt zusätzlich `galerie__stueck--gross`.

**Wichtig zur Anzahl:** Das große Feld belegt vier Plätze. Damit das Raster
ohne Lücke aufgeht, braucht es 5, 9 oder 13 Kacheln — aktuell sind es neun.
Bei einer anderen Zahl bleibt in der letzten Reihe eine Lücke stehen.

Vor dem Hochladen jedes Foto einmal ganz ansehen: Aufkleber, Kennzeichen,
Hausnummern und Personen im Bild fallen sonst erst auf, wenn die Seite online
ist.

### Nach jedem Bildwechsel: einmal umwandeln

Die Seite liefert Fotos als WebP aus, und zwar in mehreren Breiten — ein Handy
lädt dadurch rund ein Fünftel dessen, was ein großer Monitor lädt. Zu jedem
`foto.jpg` gehören deshalb `foto.webp`, `foto-400.webp`, `foto-720.webp` und
`foto-1200.webp`. Angelegt werden sie mit:

```bash
python3 werkzeug/bilder.py          # legt nur an, was fehlt
python3 werkzeug/bilder.py --neu    # rechnet auch Vorhandenes neu
```

Einmalig nötig: `pip install Pillow`. Das JPG bleibt liegen — es ist der
Rückfall für die wenigen Browser ohne WebP.

**Foto unter gleichem Namen ausgetauscht?** Dann `--neu` verwenden, sonst
bleiben die alten WebP-Dateien liegen und die Seite zeigt weiter das alte Bild.

**Neues Foto zusätzlich eingefügt?** Im HTML gehört es in ein `<picture>` nach
dem Muster der vorhandenen: das `<source>` trägt die Breiten (`srcset`) und die
Anzeigegröße (`sizes`), das `<img>` darin das JPG als Rückfall. Die `sizes`
sind je Verwendung verschieden — für eine Galeriekachel steht dort
`(max-width: 1023px) 46vw, 291px`, das ist die gemessene Anzeigebreite.

Fotos weiterhin unter 400 KB halten, bevor sie umgewandelt werden.

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

**Bewegung beim Scrollen.** Abschnittsköpfe, Ablaufschritte, Galeriekacheln und
Kundenstimmen blenden beim Hereinscrollen auf — 12 px Versatz, 0,38 s, in
Reihen leicht versetzt. Es soll wie ein Aufblenden wirken, nicht wie ein
Hereinfahren.

Der wichtige Teil steckt in der Umsetzung: **versteckt wird ausschließlich per
JavaScript.** Erst das Skript setzt die Klasse `auftritt-an` am `<html>`, und
nur daran hängen die CSS-Regeln. Läuft kein JavaScript — oder liest ein
Suchmaschinen-Roboter die Seite —, greift keine einzige dieser Regeln und der
volle Inhalt steht sofort sichtbar da. Bei „Bewegung reduzieren" wird die
Klasse gar nicht erst gesetzt.

**Der Vergleichsregler** fährt einmal von selbst auf, sobald er ins Bild kommt,
sonst ahnt niemand, dass daran zu ziehen ist. Die Vorführung bricht bei der
ersten eigenen Berührung sofort ab und entfällt bei „Bewegung reduzieren"
ganz.

---

## Strukturierte Daten

Im Kopf von `index.html` steht ein `application/ld+json`-Block: er sagt
Suchmaschinen in maschinenlesbarer Form, dass hier ein Handwerksbetrieb in
Dresden sitzt, welche Leistungen er anbietet und in welchen Orten er arbeitet.
Für einen Betrieb, der lokal gefunden werden will, ist das der wirksamste
einzelne Eintrag auf der Seite.

Alle Angaben darin stammen wörtlich aus dem Impressum. **Ändert sich dort
etwas — Adresse, Telefonnummer, Name —, muss es hier mitgeändert werden.**
Widersprechen sich beide, schadet das mehr, als der Eintrag nützt.

Zwei Dinge fehlen bewusst:

- **Öffnungszeiten.** Sobald feste Zeiten stehen, gehört ins JSON ein Eintrag
  `"openingHoursSpecification"`. Erfundene Zeiten sind schlimmer als keine.
- **Sternebewertungen.** Google erkennt Bewertungen, die ein Betrieb auf der
  eigenen Seite über sich selbst auszeichnet, nicht als Sterne an und wertet
  den Versuch im Zweifel ab. Echte Sterne entstehen über das
  Google-Unternehmensprofil, nicht über die eigene Webseite.

Prüfen lässt sich der Block mit dem Test für Rich-Suchergebnisse von Google
oder dem Schema-Markup-Validator von schema.org.

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
einem Webhoster mit PHP. Die WebP-Fassungen der Fotos liegen fertig im
Projekt — auf dem Server wird nichts gerechnet.

`werkzeug/` und `README.md` gehören nicht auf den Server. Sie schaden dort
nicht, haben aber nichts verloren, was Besucher abrufen können.

Statische Dienste wie Netlify, Cloudflare Pages oder GitHub Pages funktionieren
für die Seite selbst, führen aber kein PHP aus — dort würde das Formular nicht
arbeiten.

Zwei Dinge beim Hoster einstellen:

1. **HTTPS aktivieren.** Ohne Verschlüsselung stimmt der letzte Abschnitt der
   Datenschutzerklärung nicht mehr.
2. **Umleitung auf eine Adressform.** Entweder immer mit `www.` oder immer
   ohne — sonst zählt Google die Seite doppelt.

In `index.html` steht die Domain `https://www.elbservice-freyer.de/` an sieben
Stellen: `canonical`, `og:url` und `og:image` im Kopfbereich sowie `@id`,
`url`, `image` und `logo` im Block mit den strukturierten Daten. **Lautet die
echte Adresse anders — etwa ohne `www.` —, müssen alle sieben geändert
werden.** Sie müssen zeichengenau zu der Form passen, auf die der Hoster
umleitet, sonst zählt Google die Seite doppelt.

Prüfen lässt sich das mit:

```bash
grep -n 'elbservice-freyer.de' index.html
```
