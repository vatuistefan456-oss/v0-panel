# Integrare Plugin CS2 - CounterStrikeSharp

Acest document explică cum să integrezi plugin-ul CS2 CounterStrikeSharp cu panoul web.

## Versiune Plugin
- **CounterStrikeSharp**: v1.0.343
- **Link**: https://github.com/roflmuffin/CounterStrikeSharp/releases/tag/v1.0.343

## Funcționalități

### 1. Sistem de Autentificare cu Chei Unice

#### Generare Cheie (!key)
Când un jucător scrie `!key` în chat, plugin-ul trebuie să:

1. Facă un request POST la: `https://your-domain.com/api/cs2/generate-key`
2. Body JSON:
\`\`\`json
{
  "steam_id": "STEAM_1:0:123456789",
  "steam_name": "PlayerName",
  "steam_avatar_url": "https://avatars.steamstatic.com/..."
}
\`\`\`

3. Răspuns:
\`\`\`json
{
  "success": true,
  "key": "A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6",
  "message": "Key generated successfully"
}
\`\`\`

4. Afișează cheia în chat jucătorului:
\`\`\`
[CS2 Panel] Cheia ta unică este: A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6
[CS2 Panel] Folosește această cheie pentru a te autentifica pe https://your-domain.com/login-key
[CS2 Panel] IMPORTANT: Păstrează această cheie în siguranță!
\`\`\`

#### Reset Cheie (!resetkey)
Când un jucător scrie `!resetkey` în chat:

1. Request POST la: `https://your-domain.com/api/cs2/reset-key`
2. Body JSON:
\`\`\`json
{
  "steam_id": "STEAM_1:0:123456789",
  "old_key": "A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6"
}
\`\`\`

3. Răspuns:
\`\`\`json
{
  "success": true,
  "key": "Z9Y8X7W6V5U4T3S2R1Q0P9O8N7M6L5K4",
  "message": "Key reset successfully"
}
\`\`\`

4. Afișează noua cheie:
\`\`\`
[CS2 Panel] Cheia ta a fost resetată!
[CS2 Panel] Noua cheie: Z9Y8X7W6V5U4T3S2R1Q0P9O8N7M6L5K4
[CS2 Panel] IMPORTANT: Jucătorul NU pierde: rank, timp jucat, stats, credite, inventory!
\`\`\`

### 2. Sincronizare Date Jucător

Plugin-ul trebuie să sincronizeze datele jucătorului periodic (la fiecare 5 minute sau la disconnect):

**Endpoint**: `POST https://your-domain.com/api/cs2/sync-player`

**Body**:
\`\`\`json
{
  "steam_id": "STEAM_1:0:123456789",
  "steam_name": "PlayerName",
  "steam_avatar_url": "https://avatars.steamstatic.com/...",
  "credits": 15000,
  "kills": 1234,
  "deaths": 567,
  "headshots": 456,
  "wins": 89,
  "matches_played": 150,
  "time_played": 360000,
  "mvp": 45
}
\`\`\`

### 3. Obținere Date Jucător

Pentru a obține datele unui jucător din baza de date:

**Endpoint**: `GET https://your-domain.com/api/cs2/get-player?steam_id=STEAM_1:0:123456789`

**Răspuns**:
\`\`\`json
{
  "success": true,
  "player": {
    "id": "uuid",
    "steam_id": "STEAM_1:0:123456789",
    "steam_name": "PlayerName",
    "steam_avatar_url": "https://...",
    "unique_key": "A1B2C3D4...",
    "username": "player123",
    "credits": 15000,
    "kills": 1234,
    "deaths": 567,
    "headshots": 456,
    "wins": 89,
    "matches_played": 150,
    "time_played": 360000,
    "mvp": 45,
    "rank": "Gold Nova",
    "vip_tier": "Premium",
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T12:00:00Z"
  }
}
\`\`\`

## Flux de Autentificare

### Prima Autentificare
1. Jucătorul scrie `!key` în joc
2. Plugin-ul generează cheia și o afișează
3. Jucătorul merge pe `https://your-domain.com/login-key`
4. Introduce:
   - Cheia unică
   - Nume de utilizator (alege el)
   - Parolă (alege el)
5. Contul este creat și jucătorul este autentificat

### Autentificări Ulterioare
1. Jucătorul merge pe `https://your-domain.com/login-key`
2. Introduce:
   - Cheia unică
   - Numele de utilizator (cel ales la prima autentificare)
   - Parola
3. Este autentificat

### Reset Cheie
1. Jucătorul scrie `!resetkey` în joc
2. Plugin-ul resetează cheia și afișează noua cheie
3. Jucătorul folosește noua cheie pentru autentificare
4. **IMPORTANT**: Jucătorul păstrează toate datele (rank, stats, credite, inventory)

## Configurare Plugin

În fișierul de configurare al plugin-ului, adaugă:

\`\`\`json
{
  "WebPanelUrl": "https://your-domain.com",
  "ApiKey": "your-secret-api-key",
  "SyncInterval": 300,
  "EnableKeyAuth": true,
  "EnableAutoSync": true
}
\`\`\`

## Securitate

1. **API Key**: Toate request-urile de la plugin trebuie să includă un header:
   \`\`\`
   X-API-Key: your-secret-api-key
   \`\`\`

2. **Rate Limiting**: API-ul limitează request-urile la:
   - Generare cheie: 1 request / 60 secunde per Steam ID
   - Reset cheie: 1 request / 300 secunde per Steam ID
   - Sincronizare: 1 request / 60 secunde per Steam ID

3. **Validare**: Toate datele sunt validate înainte de a fi salvate în baza de date

## Testare

### Test Generare Cheie
\`\`\`bash
curl -X POST https://your-domain.com/api/cs2/generate-key \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-api-key" \
  -d '{
    "steam_id": "STEAM_1:0:123456789",
    "steam_name": "TestPlayer",
    "steam_avatar_url": "https://example.com/avatar.jpg"
  }'
\`\`\`

### Test Reset Cheie
\`\`\`bash
curl -X POST https://your-domain.com/api/cs2/reset-key \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-api-key" \
  -d '{
    "steam_id": "STEAM_1:0:123456789",
    "old_key": "A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6"
  }'
\`\`\`

### Test Sincronizare
\`\`\`bash
curl -X POST https://your-domain.com/api/cs2/sync-player \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-api-key" \
  -d '{
    "steam_id": "STEAM_1:0:123456789",
    "steam_name": "TestPlayer",
    "credits": 15000,
    "kills": 100,
    "deaths": 50
  }'
\`\`\`

## Suport

Pentru probleme sau întrebări, contactează echipa de dezvoltare.
\`\`\`

```typescript file="" isHidden
