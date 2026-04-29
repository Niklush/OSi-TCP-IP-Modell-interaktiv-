# OSI & TCP/IP — Interaktive Lerninfografik

Eine interaktive Webanwendung zur Visualisierung des OSI-Modells und des TCP/IP-Modells für den Einsatz im Informatikunterricht (Fachinformatiker / IT-Berufe).

## Demo

> Artifact direkt in [Claude.ai](https://claude.ai) ausführbar — JSX-Datei in ein React-Projekt einbinden oder in der Claude-Oberfläche als Artifact öffnen.

-----

## Features

|Feature               |Beschreibung                                                                     |
|----------------------|---------------------------------------------------------------------------------|
|**Modellansicht**     |OSI (7 Schichten) und TCP/IP (4 Schichten) nebeneinander, pixelgenau ausgerichtet|
|**Mapping-Ansicht**   |SVG-Bezier-Kurven zeigen die Zuordnung zwischen beiden Modellen                  |
|**Detail-Panel**      |Funktion, Protokolle, Alltagsanalogie, Fehler & Diagnose je Schicht              |
|**Enkapsulation**     |Schritt-für-Schritt-Visualisierung der Datenkapselung (L7 → L1)                  |
|**Protokoll-Tooltips**|Hover über Protokoll-Tags zeigt kurze Erklärung                                  |
|**Suchfunktion**      |Protokoll oder Schicht suchen — Treffer leuchten auf, Rest wird ausgeblendet     |

-----

## Technischer Stack

- **React** (Hooks: `useState`)
- **Tailwind** wird *nicht* verwendet — reines Inline-CSS für maximale Portabilität
- Keine externen Abhängigkeiten außer React
- Fonts: [Syne](https://fonts.google.com/specimen/Syne) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) via Google Fonts

-----

## Installation & Verwendung

### Als Claude-Artifact

Die Datei `network-models.jsx` direkt in der Claude-Oberfläche als React-Artifact öffnen.

### In einem Vite-Projekt

```bash
npm create vite@latest mein-projekt -- --template react
cd mein-projekt
npm install
```

`network-models.jsx` in `src/` kopieren, dann in `src/App.jsx`:

```jsx
import NetworkModels from './network-models';

export default function App() {
  return <NetworkModels />;
}
```

```bash
npm run dev
```

-----

## Inhalt & Didaktik

Die Infografik deckt folgende Lernziele ab:

- Aufbau und Funktion aller 7 OSI-Schichten
- Gegenüberstellung OSI ↔ TCP/IP (DoD-Modell)
- Schicht-spezifische Protokolle mit Kurzbeschreibungen
- Typische Fehlermeldungen und Diagnosemöglichkeiten je Schicht
- Alltagsanalogie pro Schicht zur Veranschaulichung
- Enkapsulation als dynamischen Prozess verstehen

Geeignet für: Ausbildungsjahr 1–2, Lernfeld „Vernetzte IT-Systeme”, Prüfungsvorbereitung AP1/AP2.

-----

## Lizenz

MIT License — siehe [LICENSE](./LICENSE)

Erstellt mit Unterstützung von [Claude (Anthropic)](https://claude.ai).
