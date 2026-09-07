# Project roadmap

## In progress / done
- [x] Vervang bliksem-emoji in AI-badge door Euria-logo; fix blauwe kader styling.
- [x] Vervang alle "Ferme du Parc Maximilien"/"La Ferme du Parc Maximilien" door "Maxilien" over hele codebase (components, pages, meta, SEO, vertalingen, footer).
- [x] Update footer copyright naar "© 2026 Maxilien. Alle rechten voorbehouden." (+ FR/EN) en behoud "Architectuur & Platform door Delplanche".

## Chat & UI optimalisaties — afgewerkt
- [ ] 1. AI-chat antwoordt altijd in de taal van de gebruiker (geen Engelse tussenzinnen bij NL).
- [ ] 2. Adres overal exact "Schipperijkaai 2, 1000 Brussel" (AI-prompt, kaarten, locatiecomponenten).
- [ ] 3. Geen blauwe tekstselectie/focus meer; huisstijl groen/aardetinten overal.
- [ ] 4. Foto's in de chat klikbaar (fullscreen lightbox); kaarten/planningen groot te openen.
- [ ] 5. Planning-generatie koppelen aan echte databank (reservaties, openingstijden) i.p.v. gokken.
- [ ] 6. QR-code alleen op desktop; op mobiel enkel actieknop/scanner (6-teken code intern, geen extern secret).
- [ ] 7. AI kan overzichten/codes/bevestigingen mailen via Brevo.
- [ ] Databankmigratie 0034 (afhaalcodes) uitvoeren op live databank.

### Status (deze ronde)
- [x] Taalslot in de chat (antwoord volledig in de taal van de bezoeker)
- [x] Adres hard vastgezet op Schipperijkaai 2, 1000 Brussel in de chatprompt
- [x] Geen blauwe tekstselectie/focus meer: overal terracotta huisstijl
- [x] Foto's in de chat en op de fotokaarten openen schermvullend
- [x] Kaart/route kan in het groot geopend worden
- [x] Planning gebruikt de echte agenda uit de databank (openingsuren, uitzonderingen, activiteiten)
- [x] QR-code enkel op desktop, niet op mobiel
- [x] E-mailknop bij overzichten: Maxim mailt de planning via Brevo
- [ ] Databankaanpassing 0034 (afhaalcodes) uitvoeren op de live databank — wacht op DATABASE_URL
- [ ] Brevo-sleutel instellen zodat de e-mailknop echt verstuurt

## Nieuwe taken (import-sessie)
- [ ] Werkende passkeys (WebAuthn) op profiel + login
- [ ] "Verbonden Accounts" met live status per provider (Google, GitHub, Mastodon, Bluesky) + koppelen/ontkoppelen
- [ ] Veilige e-mailwijziging met bevestigingslink via Brevo
- [ ] Ontbrekende API-sleutels/secrets opvragen bij de gebruiker
- [ ] Architectuur: intern UUID als enige sleutel, koppeltabel user_identities met subject-id per provider (incl. passkeys), e-mail als gewoon profielveld
