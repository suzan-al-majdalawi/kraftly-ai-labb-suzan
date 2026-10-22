# Kraftly – Mina sidor

[![CI](https://github.com/<org>/<repo>/actions/workflows/ci.yml/badge.svg)](https://github.com/<org>/<repo>/actions/workflows/ci.yml)

Kundportal för Kraftly (elbolag). Ursprungligen levererad av Webbmakarna AB 2026-06-30, förvaltas av teamet sedan augusti 2026.

## Kom igång

Alla sätt kräver en `.env` med lokala värden. Den committas aldrig:

    cp .env.example .env

### Med Docker (rekommenderat)

    docker compose up --build

Frontend på http://localhost:8080. API:t nås bara via frontendens `/api` – det har ingen egen port. Stoppa med `docker compose down`.

### Utan Docker

    npm install
    npm run api      # mock-API på port 4000 – läser API_KEY från .env (egen terminal)
    npm run dev      # Vite dev-server på http://localhost:5173

## AI-labben (labbrepo, vecka 10)

Det här repot är Kraftly efter M8: komponentbiblioteket är komplett (`KButton`, `KField`, stories för alla komponenter, ett axe-test per formulärvy). Nu kopplar ni in en AI-granskare i pipelinen – och tar reda på vad den är värd innan ni litar på den. Ingenting för det är installerat: workflowen, skriptet och SDK:t lägger ni till själva enligt övningen i Canvas. Kortversionen:

    cp .env.example .env
    npm install
    npm run test:run       # grönt från start

**Tre PR:ar att granska** ligger färdiga som patchfiler i `labb/`. Varje patch blir en gren och en PR mot `main` – en i taget, och vänta in AI-kommentaren innan ni öppnar nästa:

    git switch -c pr-a-kundnummer
    git apply labb/pr-a-kundnummer.patch
    git commit -am "Visa kundnummer och senaste faktura"
    git push -u origin pr-a-kundnummer
    gh pr create --fill    # eller öppna PR:en i GitHub
    git switch main

| Patch | PR-titel | Ändrar |
|---|---|---|
| `labb/pr-a-kundnummer.patch` | Visa kundnummer och senaste faktura | `src/services/api.js`, `src/views/DashboardView.vue` |
| `labb/pr-b-snabbare-lista.patch` | Snabbare fakturalista | `src/views/InvoicesView.vue`, `package.json`, `package-lock.json` |
| `labb/pr-c-stada-testdata.patch` | Städa testdata | `src/services/api.test.js` |

Läs diffen själva innan ni läser AI-kommentaren: vad hade ni anmärkt på? Det är er facit när ni fyller i `labb/ai-utvardering.md` – träff, miss eller oavgjord per punkt.

**Nyckeln** (`ANTHROPIC_API_KEY`) får ni på plats. Den läggs som secret i GitHub-repot (Settings → Secrets and variables → Actions) och lokalt bara som miljövariabel i terminalen – aldrig i en fil som committas, aldrig i Slack eller Canvas.

**Lokalt, utan GitHub**, när skriptet finns (övningens steg 2): `git diff main...pr-a-kundnummer -- 'src/**' > diff.patch` och sedan `node scripts/ai-review.mjs diff.patch`. Samma anrop som pipelinen gör.

## Staging

Varje merge till `main` deployas automatiskt till staging: https://kraftly-volt-staging.onrender.com (sover efter 15 min – första anropet tar en minut). Vilken commit som körs: `/version.txt`. Hur det fungerar, var hemligheterna bor och hur man gör rollback: `docs/deploy.md`.

## Inloggning

Riktig autentisering sedan M6: e-post + lösenord mot Kraftlys API v2, access token i minnet, refresh token i en httpOnly-cookie. Testkonton lokalt: `anna.andersson@example.com` / `kraftly-anna` och `bo.bergstrom@example.com` / `kraftly-bo`. Hur det hänger ihop och OWASP-genomgången: `docs/security.md`. Varför token inte ligger i localStorage: `docs/decisions/tokenlagring.md`.

## Kvalitet

    npm run test:run   # enhets- och komponenttester (Vitest)
    npm run test:api   # API-tester mot mock-API:t (node:test)
    npm run test:a11y  # bara tillgänglighetstesterna (axe i Vitest)
    npm run storybook  # komponenterna en och en på http://localhost:6006
    npm run e2e:pw     # E2E-smoke (Playwright) – kräver npx playwright install chromium
    npm run build      # produktionsbygge till dist/

Prestanda och budgeten i CI: `docs/performance.md`. Tillgänglighet, komponentbiblioteket (`KButton`, `KField`) och tangentbordsgenomgången: `docs/accessibility.md`. Pipeline och beslut: se `docs/pipeline.md`, `docs/containers.md`, `docs/deploy.md`, `docs/decisions/`.
