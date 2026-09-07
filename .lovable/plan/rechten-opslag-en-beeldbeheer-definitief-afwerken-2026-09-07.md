# Rechten, opslag en beeldbeheer definitief afwerken

Doel: geen enkele valse "Je hebt geen rechten" meer voor eigenaars, de mediabibliotheek toont echt de beelden uit de Europese opslag, en elk beeldveld in de Manager heeft een werkende voorbeeld-, vervang- en verwijderknop.

## 1. Waarom de 403 nu verschijnt (en hoe we het zichtbaar maken)

De knop "Initialiseer Scaleway S3 Rechten" stuurt naar een endpoint dat elke fout tijdens de rechtencontrole omzet in "403 Forbidden" — ook wanneer de oorzaak iets anders is (databaseverbinding, ontbrekende rij, verlopen sessie). Daardoor is de echte oorzaak vandaag niet vast te stellen.

Aanpak:
- De rechtencontrole geeft alleen 403 bij een echte rechtenweigering; alle andere fouten geven de echte foutmelding terug, zodat de oorzaak leesbaar is.
- Nieuw kaartje "Mijn toegang" in de instellingen: toont het e-mailadres dat de server ziet, de gevonden rollen, of je als eigenaar erkend wordt, en of de opslagsleutels aanwezig zijn. Dit is de eerste stap bij elke twijfel.
- Eigenaars-e-mailadressen krijgen bij hun eerste beheeractie automatisch de ontbrekende rollen/rijen aangemaakt, zodat de database en de vaste eigenaarslijst niet meer uit elkaar kunnen lopen.

## 2. Eén rechtenpoort voor het hele portaal

- Alle overgebleven eigen controles (admin-checks, rechten-checks per module, database-functies, API-routes onder /api) gaan via dezelfde centrale controle die eigenaars en super-admins altijd doorlaat.
- "owner", "Eigenaar", "eigenaar" en "super_admin" worden als hetzelfde behandeld.
- E-mail- en mailserverinstellingen, opslaginstellingen en teambeheer worden expliciet nagelopen.

## 3. Mediabibliotheek: echte beelden uit de opslag

De bibliotheek toont vandaag alleen beelden die via de Manager zijn opgeladen; bestanden die al in de Europese opslag staan blijven onzichtbaar ("Nog geen beelden").

- De beeldkiezer en de mediapagina krijgen naast "Bibliotheek" een tabblad "Opslag" dat mappen en bestanden uit de bucket toont, met paginering.
- Een bestand uit de opslag kiezen registreert het in één klik in de bibliotheek (geen nieuwe upload, hetzelfde bestand) en is daarna gewoon selecteerbaar.
- Duidelijk onderscheid in de melding: leeg, geen verbinding met de opslag, of geen rechten — telkens met "Opnieuw proberen".

## 4. Beeldvelden: voorbeeld, vervangen en verwijderen

- Webshop-hero: knop "Verwijder afbeelding" naast "Kies uit mediabibliotheek"; leegmaken wist de verwijzing echt in de database (het opslaan aanvaardt nu een lege waarde).
- Alle andere beeldvelden (producten, diensten, banners, galerijen, teamfoto's) worden nagelopen op: zichtbaar voorbeeld van het actieve beeld, "Vervang / Kies nieuw" en "Verwijder".
- Knoppen blijven op smalle schermen naast het voorbeeld leesbaar (geen afgesneden of overlappende knoppen).

## 5. Controle

- Typecheck en tests.
- Browsercontrole van de instellingen- en webshoppagina op mobiel en desktop.
- Daarna vraag ik je één keer om aangemeld op "Initialiseer Scaleway S3 Rechten" te klikken en een foto op te laden; het nieuwe "Mijn toegang"-kaartje toont dan meteen wat de server van je sessie ziet als er nog iets misgaat.

## Technische noot

- Centrale controle: `src/lib/permission-core.server.ts` (uitbreiden met rolaliassen en automatische eigenaars-provisioning), aangeroepen via `portal-permissions.ts`.
- Routes: `src/routes/api/admin/init-s3-cors.ts` en overige `/api`-routes onderscheiden 401 / 403 / 500 correct.
- Opslag: `src/lib/scaleway-media.server.ts` + `/api/media/scaleway/list` als bron voor het tabblad "Opslag"; import registreert een rij in `media_assets` met `storage_key`/`storage_url`.
- Hero: `updateShopHero` in `src/lib/shop-admin.functions.ts` aanvaardt een leegmaak-actie; UI in `ShopPage.tsx`.
- Opslagsleutels (`S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_BUCKET_NAME`, `S3_REGION`, `S3_ENDPOINT`) zijn al bewaard; het diagnosekaartje toont enkel of ze aanwezig zijn, nooit de waarde.
