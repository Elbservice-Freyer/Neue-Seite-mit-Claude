<?php
/**
 * Nimmt das Anfrageformular entgegen und schickt es als E-Mail weiter.
 *
 * Laeuft auf dem eigenen Webspace, deshalb verlassen die Daten der Besucher
 * den Server nicht. Kein fremder Formulardienst, kein Vertrag zur
 * Auftragsverarbeitung noetig, keine Uebermittlung in ein Drittland.
 *
 * Antwortet auf zwei Arten:
 *   - mit JSON, wenn das Formular ueber JavaScript abgeschickt wurde
 *   - mit einer Weiterleitung auf danke.html, wenn nicht
 * Damit funktioniert das Formular auch bei abgeschaltetem JavaScript.
 */

declare(strict_types=1);

// ---------------------------------------------------------------------------
// Einstellungen
// ---------------------------------------------------------------------------

const EMPFAENGER   = 'elbservice-freyer@gmx.de';
const ABSENDER     = 'formular@elbservice-freyer.de'; // muss zur Domain gehoeren
const DANKE_SEITE  = 'danke.html';
const MINDESTDAUER = 3; // Sekunden; schneller fuellt kein Mensch ein Formular aus

// ---------------------------------------------------------------------------

session_start();

$istJson = isset($_SERVER['HTTP_X_REQUESTED_WITH'])
    && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

/** Beendet die Verarbeitung mit einer Antwort, die zum Absendeweg passt. */
function antworten(bool $erfolg, string $text, int $code = 200): never
{
    global $istJson;

    if ($istJson) {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['erfolg' => $erfolg, 'text' => $text], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($erfolg) {
        header('Location: ' . DANKE_SEITE, true, 303);
        exit;
    }

    http_response_code($code);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><meta charset="utf-8"><title>Anfrage nicht gesendet</title>'
       . '<p style="font:1rem/1.6 system-ui;max-width:34rem;margin:4rem auto;padding:0 1.5rem">'
       . htmlspecialchars($text, ENT_QUOTES, 'UTF-8')
       . ' <a href="index.html#anfrage">Zurueck zum Formular</a></p>';
    exit;
}

/** Holt ein Feld, entfernt Steuerzeichen und begrenzt die Laenge. */
function feld(string $name, int $grenze = 500): string
{
    $wert = trim((string) ($_POST[$name] ?? ''));
    $wert = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $wert);
    return mb_substr($wert, 0, $grenze);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    antworten(false, 'Diese Adresse nimmt nur abgeschickte Formulare entgegen.', 405);
}

// --- Abwehr selbsttaetiger Eintraege ---------------------------------------

// Das Feld ist im Formular versteckt. Nur Maschinen fuellen es aus.
if (feld('webseite') !== '') {
    antworten(true, 'Danke, Ihre Anfrage ist eingegangen.'); // stillschweigend verwerfen
}

// Wer das Formular in unter drei Sekunden ausfuellt, ist keiner.
$gestartet = (int) ($_POST['gestartet'] ?? 0);
if ($gestartet > 0 && (time() - intdiv($gestartet, 1000)) < MINDESTDAUER) {
    antworten(false, 'Das ging zu schnell. Bitte senden Sie das Formular noch einmal ab.', 422);
}

// Hoechstens eine Anfrage pro Minute je Sitzung.
if (isset($_SESSION['zuletzt']) && (time() - $_SESSION['zuletzt']) < 60) {
    antworten(false, 'Sie haben gerade erst eine Anfrage gesendet. Bitte warten Sie eine Minute.', 429);
}

// --- Eingaben pruefen -------------------------------------------------------

$art       = feld('art', 20) === 'gewerbe' ? 'Gewerbe' : 'Privat';
$name      = feld('name', 120);
$email     = feld('email', 180);
$telefon   = feld('telefon', 60);
$objekt    = feld('objekt', 250);
$nachricht = feld('nachricht', 5000);

$fehlt = [];
if ($name === '')      { $fehlt[] = 'Ihr Name'; }
if ($nachricht === '') { $fehlt[] = 'die Beschreibung'; }
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { $fehlt[] = 'eine gueltige E-Mail-Adresse'; }

if ($fehlt !== []) {
    antworten(false, 'Es fehlt noch: ' . implode(', ', $fehlt) . '.', 422);
}

// --- E-Mail zusammenstellen -------------------------------------------------

$betreff = sprintf('Anfrage %s: %s', $art, $name);

$inhalt = implode("\n", [
    'Art der Anfrage: ' . $art,
    'Name:            ' . $name,
    'E-Mail:          ' . $email,
    'Telefon:         ' . ($telefon !== '' ? $telefon : 'nicht angegeben'),
    'Objekt:          ' . ($objekt !== '' ? $objekt : 'nicht angegeben'),
    '',
    'Nachricht:',
    $nachricht,
    '',
    str_repeat('-', 58),
    'Gesendet ueber das Formular auf elbservice-freyer.de',
    'Zeitpunkt: ' . date('d.m.Y, H:i') . ' Uhr',
]);

// Absender und Antwortadresse duerfen keine Zeilenumbrueche enthalten,
// sonst liessen sich zusaetzliche Kopfzeilen einschleusen.
$antwortAn = str_replace(["\r", "\n"], '', $email);

$kopf = [
    'From: ElbService Freyer Formular <' . ABSENDER . '>',
    'Reply-To: ' . $antwortAn,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: PHP/' . phpversion(),
];

$gesendet = mail(
    EMPFAENGER,
    '=?UTF-8?B?' . base64_encode($betreff) . '?=',
    $inhalt,
    implode("\r\n", $kopf),
    '-f' . ABSENDER
);

if (!$gesendet) {
    antworten(false, 'Die Anfrage konnte nicht gesendet werden. Bitte rufen Sie uns an.', 500);
}

$_SESSION['zuletzt'] = time();
antworten(true, 'Danke, Ihre Anfrage ist eingegangen. Wir melden uns zurueck.');
