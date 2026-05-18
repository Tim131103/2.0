# Person 1 – Produkt & Anforderungsanalyse

## Sanxia Old Street Explorer — 三峽老街探索

---

## 1. Catchy Einstieg — USP

> **„Sanxia entdecken, Punkte sammeln, Geschichte erleben — alles in einer App."**

Die meisten Touristen-Apps zeigen nur eine statische Karte. **Sanxia Explorer** verwandelt den Besuch der historischen Altstraße in ein interaktives Erlebnis: Besucher checken an echten Sehenswürdigkeiten ein, sammeln Punkte und lösen diese für lokale Belohnungen ein. Das schafft einen echten Anreiz, _alle_ Stationen zu erkunden — statt nur die bekanntesten.

**Kern-USP:**

- Gamifiziertes Check-in-System mit echten lokalen Rewards
- Offline-fähige PWA — keine App-Store-Installation nötig
- Bilinguale Oberfläche (EN/ZH) für internationale Gäste und lokale Nutzer

---

## 2. Zielgruppe — Persona & User Stories

### Persona: „The Curious Traveller"

| Attribut           | Detail                                                                |
| ------------------ | --------------------------------------------------------------------- |
| **Name**           | Sarah Chen                                                            |
| **Alter**          | 28 Jahre                                                              |
| **Herkunft**       | Singapur                                                              |
| **Situation**      | Wochenend-Ausflug nach Taiwan, 1 Tag in Sanxia                        |
| **Tech-Affinität** | Hoch — nutzt täglich ihr Smartphone                                   |
| **Motivation**     | Authentische Erlebnisse, lokale Küche, Handwerk                       |
| **Frustration**    | Unübersichtliche Reiseführer, kein WLAN überall, verpasste Highlights |

### User Stories (Should-have)

| ID    | Als …     | möchte ich …                      | damit …                                          |
| ----- | --------- | --------------------------------- | ------------------------------------------------ |
| US-01 | Touristen | mich einfach registrieren können  | ich meine Punkte geräteübergreifend behalte      |
| US-02 | Besucher  | an Shops einchecken               | ich Punkte für meinen Besuch erhalte             |
| US-03 | Nutzer    | meinen Punktestand sehen          | ich weiß, wie nah ich an einer Belohnung bin     |
| US-04 | Tourist   | eine Wanderroute geplant bekommen | ich keine Sehenswürdigkeit verpasse              |
| US-05 | Nutzer    | Rewards einlösen können           | ich von meinen Punkten profitiere                |
| US-06 | Besucher  | aktuelle Events sehen             | ich spontan teilnehmen kann                      |
| US-07 | Nutzer    | die App ohne Internet nutzen      | ich auch ohne WLAN navigieren kann (PWA/Offline) |

---

## 3. Empathy Map

```
┌─────────────────────────────────────────────────────────────────┐
│                        SARAH CHEN                               │
├──────────────────────────┬──────────────────────────────────────┤
│  DENKT & FÜHLT           │  HÖRT                               │
│  • Will nichts verpassen │  • Freunde empfehlen bestimmte Shops │
│  • Unsicher wegen Sprache│  • Guide sagt: „Schnell, wir gehen"  │
│  • Aufgeregt bei Entdeck.│  • „Die Croissants sind ausverkauft" │
├──────────────────────────┼──────────────────────────────────────┤
│  SIEHT                   │  SAGT & TUT                         │
│  • Viele Touristen ohne  │  • Fotografiert alles                │
│    Plan                  │  • Sucht auf Google Maps             │
│  • Lange Warteschlangen  │  • Fragt Einheimische um Rat         │
│  • Schöne Architektur    │  • Kauft zu viel / zu wenig          │
├──────────────────────────┼──────────────────────────────────────┤
│  SCHMERZPUNKTE (Pain)    │  GEWINNE (Gain)                     │
│  • Kein Offline-Guide    │  • Strukturierter Tagesplan          │
│  • Keine Gamification    │  • Belohnungen motivieren            │
│  • Sprachbarriere        │  • App ersetzt Reiseführer            │
│  • Verpasse Events       │  • Punkte = Wertschätzung             │
└──────────────────────────┴──────────────────────────────────────┘
```

**Erkenntnisse:**

1. Offline-Fähigkeit ist entscheidend (schwaches WLAN in der Altstadt)
2. Gamification erhöht die Verweildauer und fördert lokale Wirtschaft
3. Bilinguale Inhalte senken die Einstiegshürde für internationale Besucher

---

## 4. Problem → Lösung

| Problem                                      | Lösung in Sanxia Explorer                                       |
| -------------------------------------------- | --------------------------------------------------------------- |
| Touristen wissen nicht, was es alles gibt    | Kuratierte Shops-Seite mit Kategorien, Beschreibungen und Fotos |
| Kein Anreiz, alle Stationen zu besuchen      | Punkte-System mit Check-ins und Tier-Rewards                    |
| Schwache oder keine Internetverbindung       | PWA mit Service Worker — funktioniert offline                   |
| Angst, die App zu installieren / Speicher    | Kein App-Store nötig — direkt im Browser installierbar          |
| Verlorene Punkte beim Gerätewechsel          | Kontobasiertes System mit JWT-Auth und PostgreSQL-Backend       |
| Altdaten aus lokalem Speicher gehen verloren | Migrations-Prompt überträgt lokale Punkte ins Nutzerkonto       |

---

## 5. Funktionale Anforderungen

### Authentifizierung

- [ ] FA-01: Nutzer kann sich mit E-Mail und Passwort registrieren
- [ ] FA-02: Nutzer kann sich einloggen und erhält ein JWT-Token
- [ ] FA-03: Nutzer bleibt 7 Tage eingeloggt (Token-Gültigkeit)
- [ ] FA-04: Nutzer kann sich ausloggen

### Shop-Discovery

- [ ] FA-05: App zeigt alle Shops mit Name, Kategorie, Beschreibung und Punkte-Wert
- [ ] FA-06: Nutzer sieht, welche Shops er bereits besucht hat

### Check-in

- [ ] FA-07: Eingeloggter Nutzer kann an einem Shop einchecken
- [ ] FA-08: Pro Shop ist nur ein Check-in möglich (unique constraint)
- [ ] FA-09: Punkte werden beim Check-in sofort gutgeschrieben

### Rewards

- [ ] FA-10: Nutzer sieht seinen aktuellen Punktestand und Tier-Status
- [ ] FA-11: Nutzer kann Rewards einlösen, wenn genug Punkte vorhanden
- [ ] FA-12: Eingelöster Reward erzeugt einen einmaligen Code (z.B. `SANXIA-XXXX`)
- [ ] FA-13: Nutzer kann seine Einlöse-Historie einsehen

### Route Planner

- [ ] FA-14: App schlägt eine optimierte Laufreihenfolge der Shops vor
- [ ] FA-15: Distanzangaben zwischen den Stationen werden angezeigt

### Events

- [ ] FA-16: App zeigt eine Liste bevorstehender lokaler Events

### PWA

- [ ] FA-17: App ist installierbar (Web App Manifest)
- [ ] FA-18: App funktioniert offline (Service Worker)
- [ ] FA-19: Install-Banner erscheint für Erstbesucher

### Migration

- [ ] FA-20: Nutzer kann lokal gespeicherte Punkte ins neue Konto migrieren

---

## 6. Use-Case-Diagramm

```
                    ┌─────────────────────────────────────┐
                    │        Sanxia Explorer App           │
                    │                                     │
  ┌──────────┐      │  ┌──────────────────────────────┐   │
  │          │──────┼─▶│  Registrieren / Einloggen    │   │
  │          │      │  └──────────────────────────────┘   │
  │          │      │  ┌──────────────────────────────┐   │
  │          │──────┼─▶│  Shops entdecken              │   │
  │          │      │  └──────────────────────────────┘   │
  │  Tourist │      │  ┌──────────────────────────────┐   │
  │  (Guest) │──────┼─▶│  Shop einchecken             │   │
  │          │      │  └──────────────────────────────┘   │
  │          │      │  ┌──────────────────────────────┐   │
  │          │──────┼─▶│  Punkte & Rewards ansehen    │   │
  │          │      │  └──────────────────────────────┘   │
  │          │      │  ┌──────────────────────────────┐   │
  │          │──────┼─▶│  Reward einlösen             │   │
  └──────────┘      │  └──────────────────────────────┘   │
                    │  ┌──────────────────────────────┐   │
  ┌──────────┐      │  │  Route planen                │   │
  │  System  │──────┼─▶│  Events anzeigen             │   │
  │  (Auto)  │      │  │  Offline cachen (SW)         │   │
  └──────────┘      │  └──────────────────────────────┘   │
                    └─────────────────────────────────────┘
```

---

## 7. MoSCoW-Priorisierung

### Must-have ✅

- Nutzer-Authentifizierung (Register / Login / Logout)
- Shop-Liste mit Details und Punkten
- Check-in-System mit Punkte-Vergabe
- Rewards-System (Tiers + Einlösung)
- JWT-gesichertes Backend
- PostgreSQL-Datenbank mit persistenten Daten
- PWA-Grundfunktionen (Manifest, installierbar)

### Should-have 🟡

- Profilseite mit Punktestand und Check-in-Verlauf
- Route Planner mit Reihenfolge und Gehzeiten
- Events-Seite mit lokalen Veranstaltungen
- Migrations-Funktion (lokale → Cloud-Punkte)
- Pull-to-Refresh auf Mobilgeräten
- Responsive Design für alle Bildschirmgrößen

### Could-have 🔵

- Karte mit Live-Position und Shop-Pins
- Push-Benachrichtigungen bei neuen Events
- Empathy-basiertes Onboarding (Interessen auswählen)
- Mehrsprachige Inhalte (DE, JP, KR)
- Social Sharing: „Ich habe X Punkte gesammelt!"
- Admin-Dashboard für Shop-Betreiber

### Won't-have (dieses Release) ❌

- Native Mobile App (iOS / Android)
- Bezahlfunktion
- Echtzeit-Multiplayer-Elemente
- Augmented Reality

---

## 8. Prototyp-Erklärung

Der Prototyp ist eine **funktionale PWA** (kein Klick-Dummy), die alle Must-have-Features implementiert.

**Wichtigste Design-Entscheidungen:**

| Entscheidung                                         | Begründung                                                               |
| ---------------------------------------------------- | ------------------------------------------------------------------------ |
| **Bottom Navigation**                                | Mobile-first UX — Daumen erreichen untere Leiste leichter                |
| **Splash Screen**                                    | Markenerlebnis beim Start, überbrückt Ladezeit                           |
| **Farbschema** (#2B2D6E, #FAF6EF, #C9933A)           | Inspiriert von Sanxias Tempel-Blau, altem Papier und goldenen Croissants |
| **Noto Serif TC**                                    | Verbindet traditionelle chinesische Typografie mit modernem Layout       |
| **Karten-Layout für Shops**                          | Schnelles Scannen, visuell erkennbar ohne Text zu lesen                  |
| **Tier-System** (Explorer → Wanderer → Local Legend) | Progressives Engagement, Belohnungen steigen mit Aufwand                 |

---

## 9. Wireframe-Beschreibung (Prototyp)

```
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│  🏠 HOME PAGE        │   │  🏪 SHOPS PAGE        │   │  🎁 REWARDS PAGE     │
│─────────────────────│   │─────────────────────│   │─────────────────────│
│  [Logo + Titel]     │   │  Bakery      ✅ 40pts│   │  Dein Punktestand   │
│                     │   │  ┌──────────────────┐│   │  ████░░░  180/200   │
│  Willkommen, Sarah  │   │  │ 🥐 Golden Croiss.││   │                     │
│                     │   │  │ Local Specialty  ││   │  🥉 Explorer        │
│  ┌───────────────┐  │   │  │ "Buttery pastry" ││   │  [Einlösen]         │
│  │  📍 Karte     │  │   │  └──────────────────┘│   │                     │
│  │  (Shops map)  │  │   │  Temple      ☐ 30pts│   │  🥈 Wanderer (200)  │
│  └───────────────┘  │   │  Indigo      ☐ 80pts│   │  🔒 Noch 20 Punkte  │
│                     │   │  Tea House   ☐ 50pts│   │                     │
│  [→ Shops erkunden] │   │                     │   │  🥇 Local Legend    │
│  [→ Route planen]   │   │  Gesamt: 40/200 pts │   │  🔒 Noch 320 Punkte │
├─────────────────────┤   ├─────────────────────┤   ├─────────────────────┤
│ 🏠  🏪  🎁  🗺️  📅  │   │ 🏠  🏪  🎁  🗺️  📅  │   │ 🏠  🏪  🎁  🗺️  📅  │
└─────────────────────┘   └─────────────────────┘   └─────────────────────┘
```

---

## 10. Nächste Schritte & Roadmap-Features

### Phase 2 — Kurzfristig

- **Interaktive Karte** mit Leaflet.js / Mapbox — Shops auf Karte mit Pins
- **QR-Code-Check-in** — statt manuellem Button, physische QR-Codes an Shops
- **Profil-Seite** — Nutzerbild, Statistiken, besuchte Shops

### Phase 3 — Mittelfristig

- **Push-Benachrichtigungen** via Web Push API — Events, Angebote
- **Admin-Dashboard** für Ladenbesitzer — Punkte konfigurieren, Angebote einstellen
- **Mehrsprachigkeit** (i18n) — Japanisch, Koreanisch, Deutsch

### Phase 4 — Langfristig

- **Native App** (React Native oder Capacitor) für bessere iOS/Android-Integration
- **Soziale Features** — Rangliste, Freunde einladen, Badges teilen
- **Erweiterte Analytics** — Besucherströme für lokale Tourismusbehörde
