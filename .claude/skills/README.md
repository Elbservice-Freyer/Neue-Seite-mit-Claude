# Installierte Claude-Skills

Diese Skills liegen im Projekt und stehen damit in jeder Claude-Code-Session
fuer dieses Repository automatisch zur Verfuegung.

| Skill | Herkunft | Lizenz |
| --- | --- | --- |
| `frontend-design` | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | siehe `frontend-design/LICENSE.txt` |
| `ui-ux-pro-max` | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) v2.13.0 (`d279284`) | MIT, siehe `LICENSE-ui-ux-pro-max.txt` |
| `ui-styling` | dito | MIT |
| `design` | dito | MIT |
| `design-system` | dito | MIT |
| `brand` | dito | MIT |
| `banner-design` | dito | MIT |
| `slides` | dito | MIT |

## Hinweise

- Die sieben Skills aus `ui-ux-pro-max-skill` gehoeren zusammen zu einem Plugin
  und verweisen teilweise aufeinander.
- Optionale Bild-/Logo-Generierung in `design` benoetigt einen eigenen API-Key
  (`GEMINI_API_KEY`, `GOOGLE_API_KEY` oder `ATLASCLOUD_API_KEY`). Ohne Key
  funktionieren alle uebrigen Teile normal weiter.
- `banner-design` verweist zusaetzlich auf die Skills `ai-artist` und
  `ai-multimodal`, die nicht Teil dieses Pakets sind; die entsprechenden
  Funktionen stehen daher nicht vollstaendig zur Verfuegung.

## Aktualisieren

Repository klonen und den Ordner `.claude/skills/` daraus hierher kopieren.
