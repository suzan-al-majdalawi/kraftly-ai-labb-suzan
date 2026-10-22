# Beslut: Renderingsstrategi för Kraftlys portal

## Datum

22 oktober 2026

## Beslut

Vi behåller den nuvarande SPA-lösningen tills vidare.

Portalen är främst avsedd för inloggade användare som hanterar sina kunduppgifter, fakturor och andra ärenden. För dessa sidor väger en enkel driftsmodell och interaktivitet tyngre än att varje vy ska indexeras av sökmotorer.

Beslutet är preliminärt tills resultaten från Nuxt-spiken i övning 2B har jämförts med den nuvarande lösningen.

## Bakgrund

Kraftlys portal använder en SPA (Single-Page Application). Webbläsaren laddar applikationen och JavaScript hanterar navigering och uppdateringar av innehållet.

Vi behöver bedöma om SPA fortfarande är rätt val eller om SSR (Server-Side Rendering) eller SSG (Static Site Generation) skulle ge tydliga fördelar.

Lighthouse-resultatet för produktionsbygget var:

- Performance: 93
- Accessibility: 95
- Best Practices: 100
- SEO: 83
- LCP: 3,1 s
- CLS: 0,002

Resultaten visar att SPA-lösningen kan prestera bra, men de bevisar inte ensamma att SPA är bättre än SSR eller SSG. För en rättvis jämförelse behövs samma sida, samma innehåll och samma mätförhållanden.

## Alternativ vi jämförde

| Alternativ | Fördelar | Nackdelar | Passar när |
|---|---|---|---|
| SPA – nuvarande lösning | Interaktiv, enkel att drifta som statiska filer, inget separat renderingssteg på servern | Kan behöva JavaScript innan innehållet visas; SEO kan bli svårare | Inloggade och interaktiva applikationer |
| SSR – exempelvis Nuxt | HTML kan skickas från servern vid varje sidbegäran; kan förbättra första visningen och indexering | Kräver serverdrift eller en motsvarande SSR-plattform; mer komplex drift | Offentliga sidor där snabb första visning och SEO är viktiga |
| SSG – statisk generering | HTML genereras vid bygget; snabb leverans och enkel hosting | Innehållet kan bli inaktuellt mellan byggen; personliga sidor kräver fortfarande klientlogik eller API | Offentliga, relativt statiska informationssidor |

## Frågorna som styr beslutet

### Ska sidan hittas eller delas?

För privata sidor bakom inloggning är sökmotorindexering normalt inte ett huvudkrav. Offentliga informationssidor, kampanjsidor och artiklar kan däremot behöva kunna hittas och delas.

Om Kraftly får ett större behov av publikt innehåll kan SSG eller SSR vara lämpligt för de publika sidorna utan att hela portalen behöver byta strategi.

### Syns innehållet innan användaren loggat in?

Inloggningsvyn behöver vara snabb och tydlig, men kundspecifika uppgifter ska inte exponeras innan användaren är autentiserad.

För sidor efter inloggning kan SPA fungera bra om laddning, felhantering och hämtning av API-data är väl utformade. SSR är inte automatiskt snabbare i alla situationer och måste utvärderas med mätningar.

### Är vi beredda att drifta en server?

SPA och SSG kan normalt distribueras som statiska filer. SSR kräver en server eller en driftplattform som stöder serverrendering.

Om teamet vill hålla driften enkel talar det för SPA. Om nyttan av serverrenderad HTML är tillräckligt stor kan SSR ändå vara motiverat.

## Motivering

Vi behåller SPA eftersom portalen främst verkar vara en interaktiv tjänst för inloggade användare och den nuvarande produktionsversionen fick 93 poäng i Lighthouse Performance.

Det finns ännu inte tillräckliga jämförande mätdata för att motivera en övergång till Nuxt SSR. SSG kan vara ett alternativ för eventuella publika informationssidor, men löser inte i sig behovet av att hämta personlig och aktuell kunddata.

Nuxt-spiken från övning 2B ska vägas in innan beslutet betraktas som slutgiltigt.

## Konsekvenser

- Vi behåller nuvarande SPA och dess befintliga driftsmodell.
- Vi fortsätter förbättra prestanda, tillgänglighet och SEO där det är relevant.
- Vi dokumenterar och jämför mätningar innan större arkitekturbeslut.
- Vi omprövar beslutet om publika sidor blir en viktig del av produkten, om första visningen fortsätter att vara ett problem eller om Nuxt-spiken visar en tydlig mätbar fördel.
- Beslutet ska också omprövas om driftkraven förändras eller teamet blir berett att underhålla en SSR-server.

## Underlag och uppföljning

- Lighthouse: produktionsbygget, testat 22 oktober 2026.
- Nuxt-spiken från övning 2B: curl-resultat ska läggas till här.
- Nästa steg: jämför svarstid, levererad HTML, LCP och driftskomplexitet mellan alternativen under så lika förhållanden som möjligt.