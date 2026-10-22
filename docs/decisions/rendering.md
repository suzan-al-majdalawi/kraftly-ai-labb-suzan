# Beslut: rendering – SPA, SSR eller statiskt?

**Datum:** 2026-10-08  
**Beslut:** Vi behåller portalen som SPA (client-side rendering). Vi inför inte Nuxt.

## Bakgrund

Frågan är om server-side rendering (SSR) med Nuxt skulle göra Kraftlys portal snabbare eller bättre.

Portalen är en inloggad kundapplikation. Det viktigaste innehållet är beroende av kundens autentisering och API-data. Serverrendering skulle därför innebära mer komplexitet utan en tydligt verifierad fördel för den huvudsakliga användningen.

I Lighthouse-testet av produktionsbygget den 22 oktober 2026 fick applikationen Performance 93, FCP 1,7 s och LCP 3,1 s. Resultatet visar att produktionsversionen fungerar relativt bra, men LCP ligger fortfarande över riktmärket 2,5 sekunder. Det är inte i sig ett bevis för att SSR skulle vara bättre.

## Alternativ vi jämförde

| Egenskap | SPA (nuvarande) | SSR (Nuxt) | Statiskt (SSG, `nuxt generate`) |
|---|---|---|---|
| Första HTML:en | En grundläggande HTML-fil; JavaScript renderar innehållet | HTML renderas på servern för varje begäran | HTML genereras i förväg vid bygget |
| Passar för | Interaktiva, inloggade applikationer | Publika sidor eller sidor där serverrendering ger tydlig nytta | Publika sidor vars innehåll ändras relativt sällan |
| SEO | Begränsat värde för sidor bakom inloggning | Bra möjligheter för publikt innehåll | Bra möjligheter för publikt innehåll |
| Personliga kunddata | Hämtas efter autentisering via API | Kräver fortfarande korrekt autentisering och säker datahantering | Kräver fortfarande klientlogik eller API för personliga data |
| Drift | Statiska filer i nginx | Kräver SSR-kompatibel server eller plattform | Statiska filer kan distribueras enkelt |
| Komplexitet | Nuvarande arkitektur | Högre drift- och säkerhetskomplexitet | Byggprocess och hantering av uppdaterat innehåll |

## Motivering

Vi behåller SPA eftersom portalen främst används av inloggade kunder. Det finns därför begränsad SEO-nytta med att serverrendera de privata sidorna.

Det första meningsfulla kundinnehållet kräver fortfarande ett API-anrop med kundens autentisering. SSR skulle inte eliminera det behovet.

Nuvarande lösning kan distribueras som statiska filer i nginx, vilket ger en enkel driftmodell. Att införa Nuxt SSR skulle kräva en server eller motsvarande plattform att drifta, skala och säkra.

Vi prioriterar därför att förbättra den befintliga lösningen och mäta flaskhalsar innan vi överväger en arkitekturförändring. LCP på 3,1 sekunder innebär att vi fortfarande har prestanda att förbättra, men det visar inte att ett byte till SSR är rätt åtgärd.

## Konsekvenser

- Vi fortsätter att distribuera portalen som en SPA med statiska filer i nginx.
- Vi behåller den befintliga arkitekturen och undviker kostnaden för en separat SSR-server.
- Vi fortsätter att optimera och mäta frontendens prestanda, särskilt LCP.
- Personliga kunduppgifter fortsätter att hämtas via API efter autentisering.
- Drift och skalning följer den befintliga lösningen, se `docs/scaling.md`.

### När ska beslutet omprövas?

Beslutet omprövas om Kraftly vill lägga till publika sidor i samma kodbas, exempelvis prislistor eller spartips som ska hittas via Google.

Då utvärderar vi Nuxt SSR eller SSG för det publika innehållet. Vi jämför mätresultat, driftskostnad, komplexitet och SEO-nytta innan vi fattar ett nytt beslut.

## Underlag

- Lighthouse-test av produktionsbygget den 22 oktober 2026.
- Nuvarande SPA-arkitektur och befintlig distribution med nginx.
- Resultat från Nuxt-spiken i övning 2B läggs till här om de finns tillgängliga.
