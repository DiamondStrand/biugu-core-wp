# BIUGU Core Engine

BIUGU Core Engine är hjärtat i kalender- och evenemangsstrukturen för "Barn i Uppsala" & Gratis Uppsala". Detta plugin kapslar in all tung backend-logik, databasrelationer, delta-synkronisering och det framtida React-baserade gränssnittet för att separera ren funktionalitet från webbplatsens design (temat).

Detta plugin har en strikt, modulär och filbaserad struktur för att göra koden lättläst, lätt att underhålla och skalbar.

---

## Systemkrav & Beroenden

För att detta plugin ska fungera krävs följande miljö:
* **WordPress:** 6.0+ (Utvecklat och testat mot 6.7)
* **PHP:** 8.1 eller 8.2
* **Pods Framework:** ^3.0 (Måste vara installerat och aktivt i WordPress!)
* **Node.js & pnpm:** För kompilering av React-gränssnittet i `src/`

---

## Mappstruktur

Projektet är uppdelat i en tydlig backend (PHP) och frontend (React):

```text
biugu-core/
├── biugu-core.php              # Plugin-header & startmotor (motsvarar root layout)
├── package.json                # Skript för React & pnpm-beroenden
├── README.md                   # Denna dokumentationsfil
│
├── includes/                   # BACKEND (Ren PHP-logik)
│   ├── app.php                 # Huvudklassen som laddar och initierar alla moduler
│   │
│   ├── database/               # Data-lagret (Motsvarar Prisma/Drizzle i Next.js)
│   │   ├── class-pods-init.php # Automatisk import och delta-synk av Pods-schemat
│   │   └── pods-schema.json    # Den exporterade sanningen av databasstrukturen
│   │
│   ├── api/                    # API Endpoints (Motsvarar app/api/ i Next.js)
│   │   └── class-wp-api.php    # Anpassade WP REST API-rutter för frontend-appen
│   │
│   └── sync/                   # Bakgrundsjobb & Datavalidering
│       └── class-delta-sync.php# Motorn som hanterar linjära rader (6-månadersbuffert)
│
└── src/                        # FRONTEND (React-appen, din Next.js/src-motsvarighet)
    ├── index.js                # Entrypoint (Hookar i "biu-event-editor-root" i WP Admin)
    │
    ├── components/             # Globala, återanvändbara UI-komponenter
    │   ├── ui/                 # Atomiska komponenter (Knappar, Inputs, Spinners)
    │   └── forms/              # Återanvändbara formulärelement
    │
    └── admin/                  # Sidor och vyer specifika för WP-Admin
        └── event-editor/       # Gränssnittet för Kalendergeneratorn
            ├── page.jsx        # Huvudkomponenten (motsvarar page.tsx i Next.js)
            ├── EventForm.jsx   # Delkomponent för grundläggande event-info
            └── Occurrence.jsx  # Delkomponent för att generera specifika datum/tider
```

---

## Kom igång med utveckling

### 1. Installation av beroenden
Ställ dig i plugin-mappen via terminalen och installera alla JavaScript- och utvecklingsverktyg via `pnpm`:

```bash
cd wp-content/plugins/biugu-core
pnpm install
```

### 2. Starta utvecklingsläget (Watch Mode)
För att ändringar i din React-kod (`src/`) ska kompileras live till den körbara WordPress-koden (`build/`), kör igång den inbyggda kompilatorn:

```bash
pnpm run start
```
*Detta kör `@wordpress/scripts` i bakgrunden. Så fort du sparar en `.js` eller `.jsx`-fil byggs koden om på en bråkdel av en sekund.*

### 3. Bygg för produktion
När koden ska rullas ut skarpt till staging eller produktion kompileras och minifieras koden med:

```bash
pnpm run build
```

---

## Hur man bidrar

1. **Håll det modulärt:** Skriv inte lång proceduriell kod i `biugu-core.php`. Om du lägger till en ny funktion, skapa en dedikerad klass under `includes/` och instantiera den via `includes/app.php`.
2. **REST API framför Admin-Ajax:** Alla nya asynkrona anrop från React-appen ska gå via moderna WP REST-rutter i `includes/api/`. 
3. **Skydda databasen:** Om du ändrar fältstrukturen i Pods under utveckling, glöm inte att exportera det nya JSON-schemat till `includes/database/pods-schema.json` så att andra utvecklare får med sig ändringarna.
4. **Använd WordPress React-komponenter:** Utnyttja WordPress egna komponentbibliotek (`@wordpress/components`) i den mån det går för att bibehålla ett sömlöst och nativt utseende i WP-Admin.