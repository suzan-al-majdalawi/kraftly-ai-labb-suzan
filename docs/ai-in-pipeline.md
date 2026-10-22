# AI-granskning i pipelinen

## Syfte

AI-granskningen hjälper oss att hitta möjliga buggar och problem i kodändringar innan de mergas. AI:ns kommentarer är förslag, inte beslut. En människa ansvarar alltid för att bedöma kommentarerna.

## Hur granskningen fungerar

När en pull request skapas eller uppdateras körs arbetsflödet för AI-granskning. Granskaren läser ändringarna i pull requesten och lämnar kommentarer när den hittar möjliga problem.

Om granskningen inte kan köras, exempelvis på grund av en ogiltig API-nyckel, ska felet kontrolleras och åtgärdas. En lyckad CI-körning betyder inte automatiskt att AI-granskningen har lyckats.

## Hur vi bedömer kommentarerna

Varje AI-kommentar bedöms enligt följande:

- **Träff:** Kommentaren identifierar ett verkligt problem som är värt att åtgärda.
- **Miss:** Kommentaren är felaktig eller gäller något oviktigt som inte behöver åtgärdas.
- **Oavgjord:** Bedömningen kräver domänkunskap eller information som modellen saknar. En människa måste avgöra.

Vi läser alltid diffen själva innan vi granskar AI:ns kommentarer. Vi dokumenterar också relevanta problem som vi själva upptäcker men som AI:n missar.

## När vi inte håller med

Vi accepterar inte en kommentar automatiskt. Om vi inte håller med förklarar vi varför i svaret på kommentaren och kontrollerar koden och testerna innan vi fattar beslut.

Verkliga problem åtgärdas. Felaktiga eller oviktiga kommentarer dokumenteras som missar. Oavgjorda frågor bedöms av en människa.

## API-nyckel och felhantering

API-nyckeln lagras som en GitHub Actions secret med namnet `ANTHROPIC_API_KEY`. Nyckeln får inte läggas i källkoden eller publiceras i loggar eller kommentarer.

Om API-anropet misslyckas kontrollerar vi att secret finns, att nyckeln är giltig och att API-kontot har åtkomst. Därefter kör vi arbetsflödet igen.

## Ansvar

AI-granskningen ersätter inte vanliga tester, kodgranskning eller mänskligt ansvar. Pull requesten ska bedömas utifrån kodens kvalitet, testresultat och relevanta granskningskommentarer.