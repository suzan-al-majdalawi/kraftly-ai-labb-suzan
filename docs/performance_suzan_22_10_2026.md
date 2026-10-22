# Prestanda

## Så mäter vi

Vi mäter med Chrome DevTools → Lighthouse på produktionsbygget.

- Byggkommando: `npm run build`
- Förhandsvisning: `npm run preview`
- Testad URL: `http://localhost:4173/`
- Enhet: Emulated Moto G Power
- Nätverk: Slow 4G
- Webbläsare: Chromium 155, Lighthouse 13.4.1
- Datum: 22 oktober 2026
- Antal mätningar: En dokumenterad körning. Median av tre körningar är ännu inte uppmätt.

Resultaten påverkas av enhetsemulering, nätverk, cache och omgivande belastning. För att kunna jämföra optimeringar rättvist ska vi använda samma inställningar och helst medianen av tre körningar.

## Budgeten

| Mått | Budget | Var | Varför just den |
|---|---|---|---|
| LCP | ≤ 2,5 s | Startsidan, Lighthouse | Målet är att huvudinnehållet ska visas snabbt. |
| CLS | ≤ 0,1 | Startsidan, Lighthouse | Undviker oväntade layoutförflyttningar. |
| TBT | ≤ 200 ms | Startsidan, Lighthouse | Begränsar blockering av huvudtråden. |
| Performance | ≥ 90 | Startsidan, Lighthouse | Praktiskt mål för en bra Lighthouse-poäng. |
| JavaScript | ≤ 150 kB gzip, preliminär budget | Produktionsbygget | Ska begränsa mängden JavaScript som behöver överföras. Budgeten ska valideras mot den faktiska produktens behov. |

JavaScript-budgeten är preliminär. I produktionsbygget rapporterade Vite bland annat följande gzip-storlekar:

| Fil | Storlek gzip |
|---|---:|
| `index-CNvisDp8.js` | 42,85 kB |
| `DashboardView-SFAEy_92.js` | 51,81 kB |

Dessa två filer summerar till 94,66 kB gzip. Det är inte nödvändigtvis den totala JavaScript-mängd som laddas vid första sidvisningen. Övriga filer och vilka moduler som faktiskt laddas behöver också beaktas.

## Optimeringarna

### 1. Produktionsbygge i stället för utvecklingsserver

Problemet var att Lighthouse kördes mot utvecklingsmiljön, vilket kan ge sämre prestanda än den optimerade produktionsversionen.

Vi byggde projektet med `npm run build` och startade sedan `npm run preview`. Detta är en ändring av mätmiljön, inte en bevisad kodoptimering.

| Mått | Före: utvecklingsmiljö | Efter: produktionsbygge |
|---|---:|---:|
| Performance | 56 | 93 |
| Accessibility | Ej dokumenterat här | 95 |
| Best Practices | Ej dokumenterat här | 100 |
| SEO | Ej dokumenterat här | 83 |
| FCP | 4,6 s | 1,7 s |
| LCP | 10,5 s | 3,1 s |
| TBT | 210 ms | 60 ms |
| CLS | 0,002 | 0,002 |
| Speed Index | 6,9 s | 2,4 s |

Resultatet visar att produktionsbygget presterar bättre i testet. Eftersom både byggläge och mätning kan påverka resultatet kan vi inte tillskriva hela förbättringen en enskild kodändring.

PR: Lägg till länken när pull requesten har skapats.

### 2. Render-blockerande resurser

Lighthouse uppskattar att render-blockerande resurser kan förbättras med cirka 300 ms.

Åtgärd: Inte genomförd ännu. Undersök vilka resurser som blockerar den första renderingen och testa en ändring i taget.

| Mått | Före | Efter |
|---|---:|---:|
| Uppskattad besparing | 300 ms | Inte uppmätt |

PR: Inte genomförd ännu.

### 3. Minska oanvänd JavaScript

Lighthouse uppskattar att 94 KiB JavaScript kan vara oanvänt.

Åtgärd: Inte genomförd ännu. Undersök Lighthouse-treemapen och om fler komponenter kan laddas först när de behövs.

| Mått | Före | Efter |
|---|---:|---:|
| Uppskattad oanvänd JavaScript | 94 KiB | Inte uppmätt |

PR: Inte genomförd ännu.

### 4. Tillgänglighet för pekmål

Lighthouse rapporterar att vissa pekmål är för små eller ligger för nära varandra.

Åtgärd: Inte genomförd ännu. Identifiera de berörda knapparna och länkarna och förbättra deras storlek och mellanrum.

| Mått | Före | Efter |
|---|---|---|
| Accessibility | 95 | Inte uppmätt |
| Pekmål | Underkänd kontroll | Inte omtestat |

PR: Inte genomförd ännu.

## Flaskhalsen vi inte äger

API-servern körs separat från frontend och använder port 4000. En fördröjning från API:et kan påverka hur snabbt data visas, men Lighthouse-resultaten ovan visar inte i sig hur stor del av LCP som orsakas av API-fördröjning.

Vi ska mäta API-anropens svarstid i Chrome DevTools → Network och skilja mellan serverns svarstid, nätverksfördröjning och frontendens rendering.

Vi kan optimera vår del genom att undvika onödiga anrop, visa laddningstillstånd och rendera den del av sidan som inte behöver vänta på API-data. API-fördröjningen behöver mätas separat innan vi drar slutsatser.