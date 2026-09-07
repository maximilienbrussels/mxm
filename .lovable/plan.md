# Contactkolom in de voettekst

## Advies

Van de twee varianten is de verticale lijst de beste keuze, zowel op gsm als op computer:

- Elk gegeven staat op een eigen regel, dus e-mail en telefoon zijn allebei grote, aparte aanraakzones. In de tweede variant ("alles achter elkaar") komen e-mail en adres op één regel, wat op een smal scherm afbreekt en de e-mailkoppeling moeilijk aantikbaar maakt.
- Bezoekers scannen een voettekst van boven naar beneden. Een blokje met drie regels leest sneller dan een lopende zin.
- De volgorde e-mail, telefoon, adres zet het kanaal dat mensen het vaakst gebruiken bovenaan.

Over de zorg om spamrobots: e-mail zichtbaar tonen is nog steeds het gebruiksvriendelijkst, en het adres is sowieso al te vinden op de contactpagina. In plaats van het te verstoppen, laat ik het staan maar in een vorm die automatische verzamelaars moeilijker kunnen oogsten.

## Wat er verandert

De contactkolom wordt:

```text
CONTACT

contact@maximilien.brussels
+32 2 201 56 09
Schipperijkaai 2, 1000 Brussel

Contactformulier
Veelgestelde vragen
Pers & mediakit
```

- Vaste volgorde: e-mail, telefoon, adres, daarna de drie koppelingen.
- Meer ruimte tussen de gegevens en de koppelingen, zodat het twee duidelijke blokjes zijn.
- Op smalle schermen breekt het e-mailadres netjes af in plaats van buiten de rand te lopen.
- Adres blijft één regel: Schipperijkaai 2, 1000 Brussel.

## Technische details

- Bestand: `src/components/SiteFooter.tsx`, kolom "contact".
- De drie regels worden een `<ul>` met `space-y` in plaats van `<br>`, zodat elke regel een eigen aanraakzone krijgt; `break-words` blijft voor het e-mailadres.
- Het e-mailadres wordt via een kleine hulpfunctie samengesteld (gebruiker + domein apart) en de `mailto`-koppeling wordt bij de klik opgebouwd, zodat oogstrobots geen kant-en-klaar adres in de broncode vinden. De tekst blijft voor bezoekers gewoon zichtbaar en kopieerbaar.
- Waarden blijven uit `useSiteContact()` komen met de bestaande vaste waarden als vangnet; niets wordt hardgecodeerd in de voettekst.
- Dezelfde volgorde wordt in NL, FR en EN gebruikt.
