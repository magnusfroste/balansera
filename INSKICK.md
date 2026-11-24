# Inskick – Balansera

- **Titel:** Balansera
- **Kort beskrivning (≤34 tecken):** Kemiska reaktioner i balans
- **URL:** https://balansera.shipholm.dev
- **Ämne:** STEM (kemi)
- **Årskurs:** 7–9
- **Typ:** Öva
- **Enhet:** Alla enheter
- **Lgr22 (curriculum_ids):** KE.7-9.1.1 (primär), KE.7-9.2.2 (valfri)
- **Kortbild:** `public/kort.png` (1200×900, 4:3, spelmoment utan pålägg) →
  https://balansera.shipholm.dev/kort.png

## long_description
Balansera är ett övningsspel i kemi för åk 7–9. En färdig reaktion visas, till
exempel `_ H2 + _ O2 → _ H2O`, och eleven ändrar talen framför ämnena med − och +
tills antalet atomer av varje grundämne är lika stort på båda sidor om pilen.
Under reaktionen finns en räknetabell som visar varje grundämne med antal atomer
till vänster och till höger – raden blir grön med en bock när den stämmer. Då
firar Kotten, och eleven går vidare till nästa reaktion.

Appen tränar massans oförstörbarhet och hur en koefficient multiplicerar hela
formeln, vilket är precis det momentet i det centrala innehållet för kemi åk 7–9:
”Materiens uppbyggnad, kretslopp och oförstörbarhet visualiserat med hjälp av
partikelmodeller. Grundämnen, molekyl- och jonföreningar samt hur ämnen omvandlas
genom kemiska reaktioner.” (Skolverket, Lgr22.)

Innehållet är 16 riktiga reaktioner (förbränning, rostning, fotosyntesnära
reaktioner, syra–bas, sönderdelning) kontrollerade maskinellt: varje formel räknas
atom för atom så att inget påhittat eller obalanserat exempel kan hamna i appen.

En runda är 5 reaktioner och tar ungefär 5 minuter. Runda 1–2 har två ämnen per
sida, därefter upp till fyra. Fel svar kostar ingenting: Kotten pekar i stället på
vilket grundämne som inte stämmer och ger en ny chans. Gratis, ingen inloggning,
inga annonser, inga länkar ut.

## Kontroll
- `node verify.mjs` – 16 reaktioner, 0 fel (lika många atomer av varje grundämne på båda sidor).
- Spelat igenom en hel runda med `Input.dispatchTouchEvent` (touch): 5/5 balanserade,
  5 stjärnor, resultatrutan ”Runda 1 av 5”.
- Ryms utan scroll i 1024×768, 768×1024, 390×844 och 1440×900 (`scrollHeight-innerHeight = 0`).
- Tryckytor för − / +: 48–58 px beroende på skärm.
