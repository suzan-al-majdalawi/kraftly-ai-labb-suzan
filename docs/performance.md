# Prestanda

*M7 – Prestandan mäts på produktionsbygget. Lighthouse-resultaten dokumenteras och används för att identifiera förbättringar. Endast verifierade optimeringar redovisas som genomförda.*

## Så mäter vi

| Vad | Verktyg | Inställning |
|---|---|---|
| Webbapplikationen | Chrome DevTools → Lighthouse | Produktionsbygge med `npm run build` och `npm run preview` |
| Enhetsläge | Lighthouse | Emulated Moto G Power |
| Nätverk | Lighthouse | Slow 4G |
| Webbläsare | Chromium 155 | Lighthouse 13.4.1 |
| JavaScript | Vite build | Storlekar från produktionsbyggets gzip-rapport |

Testet genomfördes den 22 oktober 2026. En dokumenterad körning finns tillgänglig. Medianen av tre körningar har ännu inte mätts.

Vi använder produktionsbygget eftersom det bättre motsvarar den optimerade frontend som levereras till användaren än utvecklingsservern.

## Budgeten

| Mått | Mål | Var | Varför |
|---|---|---|---|
| Performance | ≥ 90 | Lighthouse | Mål för god uppmätt prestanda |
| LCP | ≤ 2,5 s | Lighthouse | Målet är att huvudinnehållet ska visas snabbt |
| CLS | ≤ 0,1 | Lighthouse | Begränsar oväntade layoutförflyttningar |
| TBT | ≤ 200 ms | Lighthouse | Begränsar tiden som huvudtråden blockeras |
| JavaScript | Fastställs efter mätning | Vite build | En budget ska baseras på den faktiska mängden JavaScript som laddas |

LCP-, CLS- och TBT-målen används som riktmärken. JavaScript-budgeten behöver fastställas efter att den faktiska överförda mängden vid första sidvisningen har verifierats.

## Optimeringarna

### 1. Produktionsbygge i stället för utvecklingsserver

Tidigare kördes Lighthouse mot utvecklingsmiljön. Jag byggde projektet med `npm run build` och startade produktionsförhandsvisningen med `npm run preview`.

Detta ändrade testmiljön, inte nödvändigtvis applikationens kod. Resultatet visar därför skillnaden mellan de två testkörningarna, men bevisar inte att en specifik kodändring orsakade hela förbättringen.

| Mått | Före: utvecklingsmiljö | Efter: produktionsbygge |
|---|---:|---:|
| Performance | 56 | 93 |
| FCP | 4,6 s | 1,7 s |
| LCP | 10,5 s | 3,1 s |
| TBT | 210 ms | 60 ms |
| CLS | 0,002 | 0,002 |
| Speed Index | 6,9 s | 2,4 s |

### 2. JavaScript i produktionsbygget

Vite byggde applikationen och rapporterade följande gzip-storlekar för två JavaScript-filer:

| Fil | Storlek gzip |
|---|---:|
| `index-CNvisDp8.js` | 42,85 kB |
| `DashboardView-SFAEy_92.js` | 51,81 kB |

Storlekarna ovan är rapporterade för enskilda filer. De ska inte automatiskt summeras som den mängd JavaScript som laddas vid första sidvisningen, eftersom olika vyer kan laddas separat.

Lighthouse rapporterade dessutom en uppskattad besparing på 94 KiB genom att minska oanvänd JavaScript. Ingen specifik kodändring för detta är ännu verifierad.

| Mått | Före | Efter |
|---|---|---|
| Oanvänd JavaScript enligt Lighthouse | Inte dokumenterat | Uppskattad besparing: 94 KiB |
| Effekt av kodoptimering | Inte uppmätt | Inte uppmätt |

### 3. Render-blockerande resurser

Lighthouse rapporterade att render-blockerande resurser potentiellt kan förbättras med cirka 300 ms.

Detta är en uppskattad besparing, inte en uppmätt förbättring efter en genomförd ändring. Nästa steg är att identifiera resurserna och testa en optimering i taget.

| Mått | Före | Efter |
|---|---|---|
| Uppskattad besparing | 300 ms möjlig | Inte omtestat |

### 4. Tillgänglighet för pekmål

Lighthouse gav Accessibility 95 poäng men rapporterade att vissa pekmål är för små eller ligger för nära varandra.

Nästa steg är att identifiera de berörda elementen och förbättra deras storlek och mellanrum.

| Mått | Resultat |
|---|---|
| Accessibility | 95/100 |
| Pekmål | Förbättring rekommenderas |
| Efterkontroll | Inte genomförd |

## Sammanlagt

Lighthouse-resultatet från produktionsbygget den 22 oktober 2026:

| Mått | Resultat |
|---|---:|
| Performance | 93/100 |
| Accessibility | 95/100 |
| Best Practices | 100/100 |
| SEO | 83/100 |
| Agentic Browsing | 2/3 |
| FCP | 1,7 s |
| LCP | 3,1 s |
| TBT | 60 ms |
| CLS | 0,002 |
| Speed Index | 2,4 s |

Performance förbättrades från 56 i utvecklingsmiljön till 93 i produktionsbygget. För att jämföra kodoptimeringar rättvist behöver fortsatta mätningar genomföras med samma produktionsmiljö och inställningar.

## Flaskhalsen vi inte äger

Frontend använder en separat API-server på port 4000. API-fördröjningar kan påverka hur snabbt data visas, men det nuvarande Lighthouse-resultatet fastställer inte hur stor del av LCP som beror på API:t.

Nästa steg är att mäta API-anropens svarstid i Chrome DevTools → Network och skilja mellan nätverksfördröjning, API-svarstid och frontendens rendering.

Vi kan förbättra vår del genom att undvika onödiga anrop, visa laddningstillstånd och låta innehåll som inte är beroende av API-data visas utan onödig väntan.

## Övriga identifierade förbättringar

- **SEO:** Lighthouse rapporterade att sidan saknar meta description.
- **SEO:** `robots.txt` rapporterades som ogiltig med 16 fel.
- **Agentic Browsing:** `llms.txt` följer inte alla rekommendationer.
- **Prestanda:** Lighthouse hittade åtta långa huvudtrådsuppgifter och uppskattad möjlighet att minska oanvänd JavaScript.

Dessa punkter är identifierade förbättringsområden. De betraktas inte som åtgärdade förrän en ändring har genomförts och verifierats med ett nytt test.

## Vad vi inte gjorde

Vi bytte inte renderingsstrategi från SPA till SSR eller SSG. Beslutet om rendering dokumenteras separat i `docs/decisions/rendering.md`.
