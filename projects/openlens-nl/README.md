# OpenLens NL — eerste MVP

**Projectlocatie:** `projects/openlens-nl/` in `superemre-idea-vault`.

## Wat is klaar?
- Nederlandstalige, responsive dashboardwebsite.
- 36 afzonderlijke openbare webcam-bronpagina's met zoeken en filters.
- Geografische kaart (Leaflet / OpenStreetMap), alleen geladen na toestemming via klik.
- 6 officieel gepubliceerde politie-coldcases met bronlinks; drie met op bronpagina vermelde beloningen.
- Scenario-calculator voor advertentie-inkomsten, met duidelijk aangeduide fictieve aannames.
- Geen ingebedde externe streams: bronrechten/embedding-toestemming nog niet onderzocht en verkregen.
- Geen persoonsgegevensanalyse of automatisch personen volgen.

## Bekende beperkingen
1. Dit is een **bronpagina-catalogus**, geen geverifieerde live-feed monitoring. Een gepubliceerde pagina kan een offline stream tonen; voorbeeld Eindhoven is als archiefpagina gemarkeerd.
2. Camera-punten op de kaart zijn **globale locaties op stadsniveau**, geen exacte cameracoördinaten.
3. De 600+ extern genoemde camera's zijn **niet** geïmporteerd, niet geverifieerd en niet onder eigen licentie beschikbaar.
4. Er is **nog geen automatische API-koppeling** met politie.nl. De politie heeft een publieke API (V4/V5), met CC0 voor de beschreven datasets behoudens uitzonderingen. Documentatie: https://www.politie.nl/algemeen/transparantie.html
5. Beloningsbedragen veranderen; altijd eerst de oorspronkelijke politiepagina controleren.
6. Privacy- en advertentie-infrastructuur, CMP, hosting, domein en SEO-indexatie moeten vóór publieke commercialisering uitgewerkt worden.

## Starten
Open `index.html` rechtstreeks in je browser. Voor publicatie kun je deze map als statische site hosten, bijvoorbeeld via GitHub Pages, Netlify of Vercel. De kaart vereist netwerktoegang en een extra klik om externe scripts en tegels te laden.

## Verder ontwikkelen
1. Normaliseer brondata naar JSON + bronlicentie + `last_checked`.
2. Bouw een licentie- en beschikbaarheidscontrole. Benader camera-eigenaren voor schriftelijke toestemming voor embeds en snapshots.
3. Voeg server-side politie API synchronisatie toe met datum/foutlogging; scheid publiceerbare cases van alle camerakaarten.
4. Voeg meldingen voor offline bronpagina's toe (zonder streams uit te lezen).
5. Implementeer privacyverklaring, consent management en AdSense pas na bezoekersvalidatie.

## Bronnen (19 oktober 2026)
- https://www.skylinewebcams.com/en/webcam/netherlands.html
- https://webcam.nl/faq/
- https://www.earthcam.com/world/netherlands/amsterdam/
- https://argosatlas.com/en/cameras/netherlands/
- https://www.politie.nl/gezocht/cold-cases
- https://www.politie.nl/algemeen/transparantie.html

Dit is een **onafhankelijke bronverzameling**. Geen politieproduct, geen officiële partner, geen eigen toezichtcamera's.