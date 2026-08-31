#!/usr/bin/env python3
"""Fotos fuer die Webseite aufbereiten.

Legt zu jedem JPG in assets/img/ die WebP-Fassungen an, die die Seite
ausliefert: eine in Originalgroesse und je eine mit 400, 720 und 1200 Pixeln
Breite. Der Browser sucht sich daraus die kleinste Datei, die fuer seinen
Bildschirm noch scharf ist — deshalb laedt ein Handy rund ein Fuenftel
dessen, was ein grosser Monitor laedt.

Das JPG bleibt liegen. Es ist der Rueckfall fuer die wenigen Browser ohne
WebP und steht weiterhin im <img src="...">.

Aufruf im Projektordner:

    python3 werkzeug/bilder.py

Vorhandene WebP-Dateien werden uebersprungen. Sollen sie neu gerechnet
werden — etwa nach dem Austausch eines Fotos unter gleichem Namen:

    python3 werkzeug/bilder.py --neu

Einmalig noetig:  pip install Pillow
"""

import argparse
import os
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow fehlt. Einmalig installieren mit:  pip install Pillow")

ORDNER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "img")
BREITEN = (400, 720, 1200)

# Gross dargestellte Fotos bekommen etwas mehr Qualitaet als Rasterkacheln.
GROSS = {
    "aufmacher", "vergleich-vorher", "vergleich-nachher",
    "wintergarten", "gaststaette", "portraet-freyer",
}


def aufbereiten(neu_rechnen=False):
    os.chdir(ORDNER)
    erzeugt = uebersprungen = 0

    for datei in sorted(os.listdir(".")):
        if not datei.lower().endswith((".jpg", ".jpeg", ".png")):
            continue

        stamm = os.path.splitext(datei)[0]
        bild = Image.open(datei)

        # Das Signet hat einen durchsichtigen Hintergrund und wird winzig
        # dargestellt: verlustfrei, nur zwei Groessen.
        if stamm == "signet-ef":
            ziele = [(f"{stamm}-128.webp", 128), (f"{stamm}.webp", bild.width)]
            for name, breite in ziele:
                if os.path.exists(name) and not neu_rechnen:
                    uebersprungen += 1
                    continue
                hoehe = round(bild.height * breite / bild.width)
                bild.resize((breite, hoehe), Image.LANCZOS).save(
                    name, "WEBP", lossless=True, method=6)
                erzeugt += 1
                print(f"  {name}")
            continue

        # Das Logo wird nur in den strukturierten Daten verlinkt, dort als PNG.
        if stamm.startswith("logo"):
            continue

        guete = 80 if stamm in GROSS else 75
        rgb = bild.convert("RGB")

        ziele = [(f"{stamm}-{b}.webp", b) for b in BREITEN if b < rgb.width]
        ziele.append((f"{stamm}.webp", rgb.width))

        for name, breite in ziele:
            if os.path.exists(name) and not neu_rechnen:
                uebersprungen += 1
                continue
            if breite == rgb.width:
                fassung = rgb
            else:
                hoehe = round(rgb.height * breite / rgb.width)
                fassung = rgb.resize((breite, hoehe), Image.LANCZOS)
            fassung.save(name, "WEBP", quality=guete, method=6)
            erzeugt += 1
            print(f"  {name}  ({os.path.getsize(name) // 1024} KB)")

    print(f"\n{erzeugt} Dateien erzeugt, {uebersprungen} bereits vorhanden.")
    if erzeugt:
        print("\nNicht vergessen: ein neues Foto braucht im HTML ein <picture> nach\n"
              "dem Muster der vorhandenen — mit srcset, sizes und dem JPG als\n"
              "Rueckfall im <img>. Die Anleitung dazu steht in der README.")


if __name__ == "__main__":
    zerleger = argparse.ArgumentParser(description="WebP-Fassungen der Fotos anlegen")
    zerleger.add_argument("--neu", action="store_true",
                          help="vorhandene WebP-Dateien ueberschreiben")
    aufbereiten(zerleger.parse_args().neu)
