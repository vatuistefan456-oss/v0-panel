# Sistem Deschidere Cutii CS2

## Prezentare Generală

Sistemul de deschidere cutii implementează mecanica oficială CS2 cu procente exacte de drop și toate cutiile disponibile în joc.

## Drop Rates Oficiale (Valve 2017)

- **Mil-Spec (Albastru)**: 79.92%
- **Restricted (Mov)**: 15.98%
- **Classified (Roz)**: 3.20%
- **Covert (Roșu)**: 0.64%
- **Rare/Knife (Auriu)**: 0.26%
- **StatTrak Chance**: 10% (pentru orice skin, exclusiv knife-uri)

## Cutii Disponibile

### 1. Chroma Case (2,290 credite)
- 7 Mil-Spec items
- 5 Restricted items
- 3 Classified items
- 2 Covert items (Fire Serpent, Howl)
- 3 Rare knives (Karambit, Bayonet, Butterfly)

### 2. Chroma 2 Case (2,290 credite)
- 7 Mil-Spec items
- 5 Restricted items
- 3 Classified items
- 2 Covert items (Poseidon, Vulcan)
- 2 Rare knives (Karambit, M9 Bayonet)

### 3. Chroma 3 Case (2,290 credite)
- 7 Mil-Spec items
- 5 Restricted items
- 3 Classified items
- 2 Covert items
- 2 Rare knives

### 4. Kilowatt Case (3,000 credite)
- 7 Mil-Spec items
- 5 Restricted items
- 3 Classified items
- 2 Covert items (Inheritance, Printstream)
- Kukri Knife (nou!)

### 5. Revolution Case (2,800 credite)
- 7 Mil-Spec items
- 5 Restricted items
- 3 Classified items
- 2 Covert items (Head Shot, Chromatic Aberration)
- Knife-uri clasice

## Float Values și Wear

Fiecare skin are un float value între 0.00 și 1.00:

- **Factory New**: 0.00 - 0.07
- **Minimal Wear**: 0.07 - 0.15
- **Field-Tested**: 0.15 - 0.38
- **Well-Worn**: 0.38 - 0.45
- **Battle-Scarred**: 0.45 - 1.00

Float-ul afectează valoarea skin-ului: cu cât e mai mic, cu atât e mai valoros.

## Comenzi În Joc

### !opencase <case_id>
Deschide o cutie specificată.

**Exemple:**
\`\`\`
!opencase chroma_case
!opencase kilowatt_case
!opencase revolution_case
\`\`\`

### !cases
Afișează lista cu toate cutiile disponibile și prețurile lor.

## Mesaje Chat

Când un jucător deschide o cutie, se afișează:

**Normal:**
\`\`\`
azmu a deschis M4A1-S | Black Lotus (0.41) 2,290 credite
\`\`\`

**StatTrak:**
\`\`\`
azmu a deschis StatTrak™ AK-47 | Fire Serpent (0.07) 2,290 credite
\`\`\`

**Item Rar (Knife/Covert):**
\`\`\`
🎉 azmu a primit un item RAR: Karambit | Doppler! 🎉
\`\`\`

**Mesaj Promoțional (random):**
\`\`\`
Verifica-te pe !discord sau cs2-panel.ro
\`\`\`

## Configurare

Toate setările se află în `CS2Plugin/cases-config.json`:

\`\`\`json
{
  "dropRates": { ... },
  "wearRanges": { ... },
  "cases": [
    {
      "id": "chroma_case",
      "name": "Chroma Case",
      "price": 2290,
      "keyPrice": 2500,
      "contents": { ... }
    }
  ],
  "chatMessages": { ... }
}
\`\`\`

### Modificare Prețuri

Editează `price` și `keyPrice` pentru fiecare cutie:

\`\`\`json
{
  "id": "kilowatt_case",
  "price": 3000,  // ← Modifică aici
  "keyPrice": 2500
}
\`\`\`

### Adăugare Cutie Nouă

\`\`\`json
{
  "id": "new_case",
  "name": "New Case",
  "price": 2500,
  "keyPrice": 2500,
  "contents": {
    "milSpec": [ ... ],
    "restricted": [ ... ],
    "classified": [ ... ],
    "covert": [ ... ],
    "rare": [ ... ]
  }
}
\`\`\`

## Calcul Valoare Item

Valoarea unui item se calculează astfel:

1. **Valoare de bază** (după raritate):
   - Rare (Knife): 50,000 credite
   - Covert: 5,000 credite
   - Classified: 1,000 credite
   - Restricted: 300 credite
   - Mil-Spec: 100 credite

2. **Multiplicator Float**: `1 + (1 - float) * 0.5`
   - Float 0.00 (FN) = +50% valoare
   - Float 1.00 (BS) = +0% valoare

3. **Multiplicator StatTrak**: +30% valoare

**Exemplu:**
- AK-47 Fire Serpent (Covert)
- Float: 0.07 (Factory New)
- StatTrak: Da

Calcul:
\`\`\`
Base: 5,000
Float multiplier: 1 + (1 - 0.07) * 0.5 = 1.465
StatTrak multiplier: 1.3
Final: 5,000 * 1.465 * 1.3 = 9,522 credite
\`\`\`

## Rate Limiting

- Cooldown între deschideri: 3 secunde
- Previne spam-ul și abuzul

## Integrare cu Panoul Web

Toate deschiderile de cutii se sincronizează automat:
- Se scad creditele din cont
- Item-ul se adaugă în inventar
- Statisticile se actualizează
- Istoricul se salvează

## API Endpoint

**POST** `/api/cs2/cases/open`

**Headers:**
\`\`\`
X-API-Key: your_api_key
\`\`\`

**Body:**
\`\`\`json
{
  "steamId": "76561198123456789",
  "caseId": "chroma_case"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "item": {
    "name": "AK-47 | Fire Serpent",
    "rarity": "covert",
    "floatValue": 0.07,
    "wear": "Factory New",
    "isStatTrak": true,
    "value": 9522
  },
  "chatMessage": "azmu a deschis StatTrak™ AK-47 | Fire Serpent (0.07) 2,290 credite",
  "isRare": true,
  "newCredits": 15000
}
