# Balansera

Statisk webbapp (åk 7–9, kemi): balansera kemiska reaktioner genom att ändra
koefficienterna tills antalet atomer av varje grundämne är lika stort på båda
sidor om reaktionspilen. Massans oförstörbarhet, Lgr22 KE.7-9.1.1.

Inga beroenden, inga konton, ingen spårning utöver skolappar-kodsnutten.

- `public/` – hela appen (serveras av nginx i containern)
- `verify.mjs` – maskinell kontroll att varje reaktion är massbalanserad
- `kit.py` – ritar ikoner, favicon och og-bild
