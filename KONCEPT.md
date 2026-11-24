# Balansera – koncept och testplan

## Mål (en sak per app)
Eleven ska förstå och kunna använda **massans oförstörbarhet**: i en kemisk reaktion
är antalet atomer av varje grundämne lika stort före och efter pilen, och det är
koefficienterna framför ämnena som ser till att det stämmer.

## Målgrupp och årskurs
Åk 7–9 (kemi). Spelbart från ca 12 år. Läsning är inget hinder i den åldern, så
texten får finnas – men allt viktigt ligger i siffror och färg.

## Kärnmekanik (touch först)
En färdig reaktion visas: `_ H2 + _ O2 → _ H2O`. Framför varje ämne sitter ett tal
med **−** och **+** (tryckytor ≥ 52 px). Barnet ändrar talen och ser direkt en
tabell över varje grundämne: antal atomer till vänster och till höger. När alla
rader är gröna med bock är reaktionen balanserad och rundan firar. Ingen
drakamp, inget släpp – två tryck per ändring, inget drag.

## 5-minuterssession
5 reaktioner per runda. Runda 1–2 är enklast (två ämnen per sida), runda 3+
blandat och svårare (upp till fyra ämnen). "En runda till" och "Byt nivå" i
resultatrutan. Klocka finns inte – ingen tidspress.

## Belöning barnet kan berätta om
"Jag balanserade 5 av 5 och fick 12 stjärnor. Jag klarade `2 C2H6 + 7 O2 → 4 CO2 + 6 H2O`."

## Vad barnet lär
- Räkna atomer i en formel (inkl. parenteser och nedsänkta tal).
- Att massan bevaras: samma antal atomer av varje slag på båda sidor.
- Att koefficienten multiplicerar hela formeln, inte bara sista atomen.

## Lgr22 (verbatimt, ur Skolverkets centrala innehåll för kemi åk 7–9)
1. `KE.7-9.1.1` – "Materiens uppbyggnad, kretslopp och oförstörbarhet visualiserat
   med hjälp av partikelmodeller. Grundämnen, molekyl- och jonföreningar samt hur
   ämnen omvandlas genom kemiska reaktioner. Atomer, elektroner och kärnpartiklar."
2. `KE.7-9.2.2` (valfri) – sambandet mellan kemiska undersökningar och utvecklingen
   av begrepp och förklaringsmodeller.

## Kotten
Egen SVG-kotte (minst fem uttryck: glad, hejar, firar, tänker, funderar). Hon
hejar, ger ledtrådar och firar – hon säger aldrig "fel". Fel svar kostar inget;
hon pekar i stället på vilket grundämne som inte stämmer än.

## Testplan (mätbara krav)
| Krav | Mätning | Gräns |
|---|---|---|
| Allt ryms | `scrollHeight - innerHeight` och `scrollWidth - innerWidth` efter Spela | 0 i 1024×768, 768×1024, 390×844, 1440×900 |
| Bara fingrar | hela sessionen med `Input.dispatchTouchEvent` | rundan kan spelas klart med touch |
| Tryckytor | `getBoundingClientRect` på − / + | ≥ 52 px höjd |
| Direkt återkoppling | tabellen uppdateras vid varje tryck, grön/bock när det stämmer | ja |
| Nytt försök utan straff | fel svar ger ledtråd, ingen poängförlust | ja |
| Ingen inloggning/reklam/länk ut | `check_app` + manuell kontroll | inga utlänkar, ingen analys utöver kodsnutten |
| Korrekt kemi | `node verify.mjs` räknar atomer i varje reaktion | 0 fel av 16 |
| Textstorlek | all text i spelplanen | ≥ 18 px |
| Reducerad rörelse | `prefers-reduced-motion` stänger av puls | ja |

## Validation (annan agent / hård kritik)
`delegate_task` finns inte i den här körningens verktygsuppsättning; i stället
gjordes den kritiska granskningen som en skriven checklista mot källmaterialet
(Skolverkets centrala innehåll + PappasAppars lucka: deras två kemirecensioner är
sandlådor utan fakta, vår katalog hade noll kemiappar). Go-beslut: mekaniken är
den enklaste som träffar ett verkligt kunskapskrav, faktan verifieras maskinellt,
och risken är låg eftersom appen är en statisk sida utan beroenden.
