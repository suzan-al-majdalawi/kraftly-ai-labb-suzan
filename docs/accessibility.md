# Tillgänglighet

*M8 – Komponentbibliotek. Mål: WCAG 2.2 nivå AA för de fem vyerna. Kontrollerat med axe i komponenttesterna, axe i Storybook och en genomgång med tangentbordet. Storybook och axe körs lokalt. Att köra dem i pipelinen är M9.*

## Komponentbiblioteket

| Komponent | Ersätter | API |
|---|---|---|
| `KButton` | `BaseButton.vue`, `AppButton.vue`, den råa `.button-secondary` i profilen, `.btn`-knappen i inloggningen och tre klickbara `<div>`/`<span>` (Fler spartips, Ladda ner, Logga ut) | `variant`: `primary` · `secondary` · `text`. `type` (standard `button`), `block`. Texten är en slot |
| `KField` | Fält med bara placeholder (inloggning), fält helt utan namn (profil), egna label + input (flyttanmälan) | `label` (krävs), `hint`, `error`, `id`, `v-model`. Övriga attribut (`type`, `autocomplete`, `inputmode`) hamnar på `<input>` |

Varianter är en prop, inte en ny komponent. Det var så det blev tre knappar: varje gång någon behövde ett nytt utseende skrev de en ny knapp.

Det vi lagat i komponenterna är lagat överallt där de används: riktig `<button>` (Tab, Enter och mellanslag fungerar utan extra kod), fokusring, label kopplad med `for`/`id`, hjälptext och fel kopplade med `aria-describedby`, `aria-invalid` när fältet har fel.

    npm run storybook    # alla gemensamma komponenter på http://localhost:6006, fliken Accessibility
    npm run test:a11y    # axe-testerna och tillgänglighetstesterna (filerna *.a11y.test.js)

Stories finns för `KButton`, `KField`, `StatusChip`, `NorwayNotice` och `ConsumptionChart`, och för inloggningsvyn.

## Vad vi åtgärdade

| Brist | Var | Hittades med | Åtgärd |
|---|---|---|---|
| Tre knappvarianter + klickbara divar | `BaseButton`, `AppButton`, `ProfileView`, `DashboardView`, `InvoicesView`, `App.vue` | Kodgranskning, tangentbordet (divarna gick inte att nå med Tab) | `KButton` |
| Fält utan label | `LoginView` (bara placeholder), `ProfileView` (inget alls) | axe (`label`, critical) för profilen. Inloggningen: **inte axe** – axe godkänner en placeholder som namn. Testing Library (`getByLabelText`) | `KField` |
| `*:focus { outline: none }` | `styles.css` | Bara tangentbordet | `:focus-visible`-ring, vit i toppmenyn, egen ring i `KButton` |
| `lang="en"` | `index.html` | Bara manuellt (`en` är ett giltigt språk – axe kan inte veta att sidan är svensk) | `lang="sv"`, sidtitel `Mina sidor – Kraftly` |
| `<img>` utan alt | logotyperna i `App.vue` och `LoginView` | axe (`image-alt`, critical) | `alt="Kraftly"` |
| Låg kontrast | `.hint` 1,8:1, etiketter 3,7:1, statuschippen 2,5:1 och 3,2:1, gröna Spara-knappen 2,6:1 | axe **i browsern** (Storybook, eller axe mot sidan). Inte i jsdom | Mörkare färger, alla ≥ 4,5:1 (värdena står som kommentarer i CSS:en) |
| Tabell utan `scope`, tom rubrik | `InvoicesView` | Tom rubrik: axe (`empty-table-header`, minor). Saknad `scope`: inte axe | `thead`/`tbody`, `scope="col"`, dold rubrik "Åtgärd", dold caption |
| "Ladda ner" × 6 utan sammanhang | `InvoicesView` | Manuellt (alla knappar heter likadant för en skärmläsare) | Dold text: knappens namn är "Ladda ner faktura F-2026-06" |
| Diagrammet utan textalternativ | `ConsumptionChart` | Manuellt (en `<canvas>` utan roll flaggas inte) | `role="img"` + `aria-label` med månader och kWh |
| Miljöbannern utanför landmärken | `App.vue` | axe i browsern (`region`, moderate) | `<aside aria-label="Miljö">` |

## Tangentbordsgenomgång

Genomförd 2026-10-03 i Chromium (macOS) mot `npm run dev` med mock-API:t, inloggad som Anna. Bara tangentbordet: Tab, Enter, mellanslag. Ingen mus. Ingen skärmläsare (se sist).

| Vy | Vad vi testade | Resultat |
|---|---|---|
| Inloggning | Tab genom sidan, logga in med Enter | ✅ Ordning: E-postadress → Lösenord → Logga in. Fokusringen syns på alla tre. Enter loggar in |
| Inloggning → Översikt | Var hamnar fokus efter inloggningen? | ⚠️ Fokus hamnar på `<body>`. Första Tab går till "Fler spartips" längst ner på sidan, menyn hoppas över. Se kända brister |
| Toppmenyn | Tab genom menyn | ✅ Översikt → Fakturor → Flyttanmälan → Mina uppgifter → Logga ut. Vit ring mot den mörka bakgrunden. Enter på en länk byter vy |
| Översikt | Nå och använda "Fler spartips" | ✅ Nås med Tab, Enter och mellanslag fungerar båda (förut en `<div>` som inte gick att nå) |
| Fakturor | Nå och använda "Ladda ner" | ✅ Nås med Tab, namnet är "Ladda ner faktura F-2026-06", Enter fungerar |
| Fakturor | Vart tar fokus vägen efter ruttbytet? | ⚠️ Fokus står kvar på menylänken "Fakturor". Fungerar, men en skärmläsare får inte veta att sidan bytts |
| Flyttanmälan | Tab genom formuläret, skicka tomt med Enter | ✅ Ny adress → Postnummer → Ort → Inflyttningsdatum → Avtal → Skicka. Fellistan har `role="alert"`, alla fem fält får `aria-invalid` och felet kopplat med `aria-describedby` |
| Flyttanmälan | Var står fokus efter felen? | ⚠️ Kvar på knappen. Den som vill rätta får Skift+Tabba tillbaka. Se kända brister |
| Mina uppgifter | Tab genom formuläret | ✅ Namn → E-postadress → Adress → Spara ändringar → Ångra, alla med label och ring |
| Logga ut | Enter på "Logga ut" | ✅ Till inloggningen (förut en `<span>` som inte gick att nå) |

## Vad axe inte hittar

axe hittar en del av bristerna, inte alla. Grönt axe-test betyder "inga av de fel axe letar efter", inte "tillgängligt". De här fanns i Kraftly och syntes **inte** i något axe-resultat, varken i jsdom eller i browsern:

- **Fokusringen var borttagen** (`outline: none`). Ingen regel letar efter det.
- **Klickbara `<div>` och `<span>`.** Utan roll ser axe bara text. Det är `getByRole('button')` i testerna, och Tab, som hittar dem.
- **Placeholder i stället för label.** axe räknar placeholdern som fältets namn (`label`-regeln godkänner den). Placeholdern försvinner när man börjar skriva.
- **`lang="en"` på en svensk sida.** Giltigt språk, fel språk.
- **Tabellen utan `scope`.** Inte ett fel enligt axe för en enkel tabell.
- **Sex knappar som heter "Ladda ner".** Unika namn är inget axe-krav.
- **Diagrammet utan text.** En `<canvas>` utan roll flaggas inte.
- **Fokus vid ruttbyte.** axe granskar en sida i taget, inte vad som händer mellan två.

Och **i jsdom** (Vitest) ser axe dessutom inte **kontrast**: jsdom har ingen layout och läser inte vår CSS, och jest-axe stänger av färgreglerna. Kontrastfelen syntes bara i Storybooks Accessibility-flik och när axe kördes mot sidan i en riktig browser.

## Kända brister (inte åtgärdade i M8)

- **Fokus flyttas inte vid ruttbyte.** Efter inloggning och vid byte av vy står fokus kvar på länken eller på `<body>`. Förslag: flytta fokus till vyns `<h1>` (med `tabindex="-1"`) i `router.afterEach`.
- **Fokus flyttas inte till första felet** i flyttanmälan. Fellistan har `role="alert"`, men fokus står kvar på knappen.
- **Ingen "Hoppa till innehållet"-länk.** Fem menyval att tabba förbi på varje sida.
- **`StatusChip` har `role="status"`.** Den rollen är till för meddelanden som dyker upp, inte för en etikett i en tabell. Kvar för att `StatusChip.test.js` letar efter den. Byt tillsammans med testet.
- **Listan "Avtal" får ingen röd ram vid fel** (bara textfälten). Felet är kopplat med `aria-describedby`, så det är visuellt, inte för skärmläsare.
- **`alert()`** används för "Sparat!", "Fler spartips" och "Ladda ner". Browserns dialog fungerar med tangentbordet men bryter flödet. Ersätts när funktionerna finns på riktigt.
- **Inte testat:** skärmläsare (VoiceOver, NVDA), zoom till 200 % och smal skärm (reflow), Windows högkontrastläge.
