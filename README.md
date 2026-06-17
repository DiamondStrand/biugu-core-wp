# Biugu Core

Biugu Core är ett WordPress-plugin för avancerad händelsehantering (event management), byggt med ett modernt React-gränssnitt för en sömlös användarupplevelse direkt i WordPress admin.

## Översikt
Pluginet ersätter traditionella WordPress-formulär med ett robust, komponentbaserat gränssnitt för att hantera händelser, datum och tid. Det är utvecklat med fokus på prestanda, underhållbarhet och användarvänlighet.

## Teknisk Stack
* **Frontend:** React, WordPress Element
* **Stil:** CSS-moduler/Standard CSS (isolerade stilar per komponent)
* **Backend:** PHP, WordPress API
* **Byggverktyg:** @wordpress/scripts (Webpack)
* **Versionshantering:** Git

## Mappstruktur
```text
biugu-core/
├── assets/          # CSS-filer och statiska tillgångar
├── build/           # Kompilerad kod (genereras av wp-scripts)
├── includes/        # Backend-logik (API, Database, Sync)
├── src/             # Källkod (React-komponenter och admin-logik)
└── .gitignore       # Git-konfiguration
```

## Komma igång
För att arbeta med pluginet lokalt:

1. **Installera beroenden:**
   ```bash
   npm install
   ```
2. **Starta utvecklingsläge (auto-build vid ändringar):**
   ```bash
   npm run start
   ```
3. **Bygg för produktion:**
   ```bash
   npm run build
   ```

## Utvecklingsarbetsflöde
Projektet följer "Feature Branching"-metodik:
1. Skapa en gren (branch) för din specifika ändring (`git checkout -b feature/namn`).
2. Genomför ändringar och commit:a (`git commit -m "beskrivning"`).
3. Pusha grenen till GitHub och skapa en Pull Request (PR) för granskning.