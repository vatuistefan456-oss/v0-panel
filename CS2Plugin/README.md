# CS2 Panel Plugin - Ghid de Instalare

## Cerințe
- CounterStrikeSharp v1.0.343 sau mai nou
- .NET 8.0 Runtime
- Server CS2 dedicat

## Instalare

### 1. Instalează CounterStrikeSharp
1. Descarcă CounterStrikeSharp v1.0.343 de pe: https://github.com/roflmuffin/CounterStrikeSharp/releases/tag/v1.0.343
2. Extrage fișierele în folderul serverului CS2: `csgo/addons/counterstrikesharp`

### 2. Compilează Plugin-ul
\`\`\`bash
cd CS2Plugin
dotnet build -c Release
\`\`\`

### 3. Instalează Plugin-ul
1. Copiază fișierul `CS2PanelPlugin.dll` din `bin/Release/net8.0/` în:
   \`\`\`
   csgo/addons/counterstrikesharp/plugins/CS2PanelPlugin/
   \`\`\`

2. Copiază fișierul `config.json` în același folder

### 4. Configurare

Editează `config.json`:
\`\`\`json
{
  "WebPanelUrl": "https://ta-domeniu.com",
  "ApiKey": "cs2_api_key_a8f9d2e1b4c7f3a6e9d2b5c8f1a4e7d0b3c6f9a2e5d8b1c4f7a0e3d6b9c2f5a8",
  "SyncInterval": 300,
  "EnableKeyAuth": true,
  "EnableAutoSync": true
}
\`\`\`

**Important**: 
- `WebPanelUrl`: URL-ul panoul tău web (fără slash la final)
- `ApiKey`: Cheia API pe care ai configurat-o în Vercel (aceeași cheie!)
- `SyncInterval`: Interval de sincronizare în secunde (300 = 5 minute)

### 5. Restart Server
Restartează serverul CS2 pentru a încărca plugin-ul.

## Comenzi Disponibile

### Pentru Jucători
- `!key` sau `css_key` - Generează cheia unică pentru autentificare
- `!resetkey` sau `css_resetkey` - Resetează cheia unică
- `!credits` sau `css_credits` - Verifică credite
- `!stats` sau `css_stats` - Verifică statistici

### Pentru Admini
- Toate comenzile de mai sus
- Plugin-ul sincronizează automat datele la fiecare 5 minute

## Funcționalități

### Sistem de Chei Unice
- Jucătorii pot genera o cheie unică cu `!key`
- Cheia este folosită pentru autentificare pe panoul web
- Jucătorii pot reseta cheia cu `!resetkey` fără a pierde datele

### Sincronizare Automată
- Datele jucătorilor sunt sincronizate automat la fiecare 5 minute
- Sincronizare la disconnect
- Sincronizare la evenimente importante (kills, deaths, wins)

### Sistem de Credite
- Jucătorii primesc credite pentru participare
- 100 credite pentru câștig
- 50 credite pentru participare
- Credite pentru kills, headshots, MVP

### Statistici
- Kills, Deaths, K/D Ratio
- Headshots
- Wins, Meciuri jucate
- Timp jucat
- MVP

## Testare

### Test Generare Cheie
1. Intră pe server
2. Scrie în chat: `!key`
3. Vei primi cheia unică în chat
4. Folosește cheia pe `https://ta-domeniu.com/login-key`

### Test Statistici
1. Joacă câteva runde
2. Scrie în chat: `!stats`
3. Vei vedea statisticile tale

### Test Credite
1. Câștigă o rundă
2. Scrie în chat: `!credits`
3. Vei vedea creditele tale

## Troubleshooting

### Plugin-ul nu se încarcă
- Verifică că ai instalat CounterStrikeSharp corect
- Verifică că ai .NET 8.0 Runtime instalat
- Verifică logs-urile serverului: `csgo/addons/counterstrikesharp/logs/`

### Cheia nu se generează
- Verifică că `WebPanelUrl` este corect în config.json
- Verifică că `ApiKey` este corect (aceeași cu cea din Vercel)
- Verifică că panoul web este accesibil de pe serverul CS2

### Datele nu se sincronizează
- Verifică conexiunea la internet a serverului
- Verifică că API-ul panoul web funcționează
- Verifică logs-urile pentru erori

## Suport

Pentru probleme sau întrebări:
- Verifică documentația: `docs/CS2_PLUGIN_INTEGRATION.md`
- Verifică logs-urile serverului
- Contactează echipa de dezvoltare

## Licență

Acest plugin este parte din CS2 Panel și este licențiat sub aceeași licență.
