SuperEmre Idea Vault
======================

Doel
----
Supersnelle, privé, 100% lokale app om ideeën vast te leggen, te filteren en voortgang te loggen.
Geen accounts, geen cloud. Werkt direct op pc. Op telefoon kun je hem als PWA installeren
als je hem via een lokale server of GitHub Pages serveert.

Bestanden
---------
- index.html — de app
- styles.css — styling
- app.js — logica + localStorage opslag
- manifest.json — PWA manifest (optioneel)
- sw.js — service worker voor offline (alleen via http/https)
- README.txt — deze uitleg

Snelstart (pc, binnen 1 minuut)
--------------------------------
1) Download en unzip de map.
2) Open `index.html` dubbelklik. Je data wordt lokaal opgeslagen (localStorage).
3) Gebruik Exporteren voor back-up (JSON).

Installeren als PWA (telefoon of pc)
------------------------------------
Service workers werken niet vanaf file://. Gebruik één van deze opties:
A) Snelle lokale server (Python)
   - Windows/Mac: open terminal in de map en run:
     - Python 3: `python -m http.server 8000`
   - Ga naar `http://localhost:8000` en open de app.
   - Je ziet de knop “Installeren” verschijnen -> toevoegen aan beginscherm.
B) VS Code Live Server
   - Installeer extensie "Live Server", rechtsklik op index.html > "Open with Live Server".
C) GitHub Pages (gratis hosting)
   - Upload de map naar een GitHub repo en zet Pages aan (branch main, root).

Data & privacy
--------------
- Alles staat lokaal in je browser (localStorage key: `superemre_idea_vault_v1`).
- Gebruik Export om periodiek te back-uppen.
- Import laadt een eerdere JSON-dump terug.

Workflow-tip met Codex
----------------------
- Selecteer een idee > “Codex-prompt kopiëren” > plak in ChatGPT/Codex.
- Vraag om feature-PR’s, tests en release notes. Itereer snel.

Velden
------
- Titel, Categorie, Status, Prioriteit, Deadline, Volgende actie, Tags, Beschrijving
- Voortgangslog met datum/tijdstempel

Bekende beperkingen
-------------------
- Zonder server is er geen PWA-install. De app werkt wel volledig vanuit `index.html`.
- localStorage is per browser en apparaat. Export/Import gebruiken voor sync.

Gemaakt: 2025-09-05
