# Ghid Configurare Misiuni și Sistem

## Prezentare Generală

Toate setările serverului CS2 pot fi gestionate prin fișierul `config.json` și interfața admin din panoul web.

## Structura Config.json

### Misiuni

Fiecare misiune are următoarele proprietăți:

\`\`\`json
{
  "id": "daily_awp_kills",           // ID unic
  "name": "AWP Master",               // Nume afișat
  "description": "Get 10 kills...",   // Descriere
  "type": "weapon_kills",             // Tip misiune
  "weapon": "awp",                    // Armă (opțional)
  "target": 10,                       // Obiectiv
  "credits_reward": 500,              // Credite recompensă
  "xp_reward": 100,                   // XP recompensă
  "enabled": true                     // Activat/Dezactivat
}
\`\`\`

### Tipuri de Misiuni

- `weapon_kills` - Kill-uri cu o anumită armă
- `weapon_headshots` - Headshot-uri cu o anumită armă
- `total_kills` - Total kill-uri
- `total_headshots` - Total headshot-uri
- `wins` - Victorii
- `mvp` - MVP-uri
- `clutch_wins` - Clutch-uri câștigate
- `ace_rounds` - Runde cu ACE

### Arme Disponibile

- `awp`, `ak47`, `m4a1`, `m4a1_silencer`, `deagle`, `knife`, `usp_silencer`, `glock`, etc.

## Cum să Adaugi o Misiune Nouă

### Metoda 1: Din Panoul Web (Recomandat)

1. Accesează `/admin/config`
2. Selectează tab-ul "Misiuni"
3. Alege perioada (Daily/Weekly/Monthly)
4. Click pe "Adaugă Misiune"
5. Completează detaliile
6. Click "Salvează Config"

### Metoda 2: Editare Manuală config.json

1. Deschide `CS2Plugin/config.json`
2. Adaugă misiunea în secțiunea corespunzătoare:

\`\`\`json
{
  "Missions": {
    "Daily": [
      {
        "id": "daily_new_mission",
        "name": "Misiune Nouă",
        "description": "Descriere",
        "type": "weapon_kills",
        "weapon": "awp",
        "target": 15,
        "credits_reward": 600,
        "xp_reward": 120,
        "enabled": true
      }
    ]
  }
}
\`\`\`

3. Salvează fișierul
4. Restart plugin CS2 sau așteaptă sincronizarea automată

## Modificare Recompense

Pentru a modifica recompensele unei misiuni existente:

1. Găsește misiunea în `config.json`
2. Modifică `credits_reward` și/sau `xp_reward`
3. Salvează și restart plugin

Exemplu:
\`\`\`json
{
  "id": "daily_awp_kills",
  "credits_reward": 1000,  // Modificat de la 500
  "xp_reward": 200         // Modificat de la 100
}
\`\`\`

## Dezactivare Misiuni

Pentru a dezactiva temporar o misiune fără a o șterge:

\`\`\`json
{
  "id": "daily_awp_kills",
  "enabled": false  // Setează pe false
}
\`\`\`

## Ștergere Misiuni

### Din Panoul Web:
1. Click pe butonul de ștergere (🗑️) lângă misiune
2. Salvează configurația

### Manual:
Șterge întreaga secțiune a misiunii din `config.json`

## Configurare Clan-uri

\`\`\`json
{
  "Clans": {
    "MaxMembers": 20,              // Membri maximi per clan
    "CreateCost": 5000,            // Cost creare clan
    "SkillUpgradeCosts": {
      "health": 1000,              // Cost upgrade health
      "armor": 1200,               // Cost upgrade armor
      "speed": 1500,               // Cost upgrade speed
      "gravity": 2000,             // Cost upgrade gravity
      "damage": 2500               // Cost upgrade damage
    },
    "MaxSkillLevel": 10,           // Nivel maxim skill
    "SkillBonusPerLevel": {
      "health": 5,                 // +5 HP per nivel
      "armor": 3,                  // +3 armor per nivel
      "speed": 0.02,               // +2% speed per nivel
      "gravity": 0.05,             // +5% gravity per nivel
      "damage": 0.05               // +5% damage per nivel
    }
  }
}
\`\`\`

## Configurare Sistem Credite

\`\`\`json
{
  "Credits": {
    "KillReward": 10,              // Credite per kill
    "HeadshotReward": 15,          // Credite per headshot
    "WinReward": 100,              // Credite per victorie
    "MVPReward": 50,               // Credite per MVP
    "DeathPenalty": 0,             // Penalitate per moarte
    "SuicidePenalty": 5            // Penalitate per sinucidere
  }
}
\`\`\`

## Sincronizare Automată

Plugin-ul sincronizează automat configurația la fiecare 5 minute. Pentru sincronizare manuală:

1. Restart plugin CS2
2. Sau folosește comanda admin din joc (dacă este implementată)

## Best Practices

1. **Testează pe server de test** înainte de a aplica pe production
2. **Backup config.json** înainte de modificări majore
3. **Folosește ID-uri descriptive** pentru misiuni (ex: `daily_awp_kills`)
4. **Balansează recompensele** - misiuni mai grele = recompense mai mari
5. **Nu șterge misiuni active** - dezactivează-le mai întâi

## Exemple de Misiuni

### Misiune Simplă (Kill-uri)
\`\`\`json
{
  "id": "daily_deagle_kills",
  "name": "Desert Eagle Master",
  "description": "Get 20 kills with Desert Eagle",
  "type": "weapon_kills",
  "weapon": "deagle",
  "target": 20,
  "credits_reward": 800,
  "xp_reward": 150,
  "enabled": true
}
\`\`\`

### Misiune Complexă (Clutch)
\`\`\`json
{
  "id": "weekly_clutch_master",
  "name": "Clutch King",
  "description": "Win 15 clutch rounds (1vX)",
  "type": "clutch_wins",
  "target": 15,
  "credits_reward": 5000,
  "xp_reward": 1000,
  "enabled": true
}
\`\`\`

## Troubleshooting

**Misiunile nu apar în joc:**
- Verifică că `enabled: true`
- Verifică că plugin-ul este pornit
- Verifică logs pentru erori de sincronizare

**Recompensele nu se acordă:**
- Verifică că valorile sunt numere întregi pozitive
- Verifică că tipul misiunii este corect
- Verifică logs pentru erori

**Config nu se salvează:**
- Verifică permisiunile fișierului
- Verifică sintaxa JSON (folosește un validator)
- Verifică logs pentru erori
