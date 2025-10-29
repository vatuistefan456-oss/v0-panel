using CounterStrikeSharp.API;
using CounterStrikeSharp.API.Core;
using CounterStrikeSharp.API.Core.Attributes.Registration;
using CounterStrikeSharp.API.Modules.Commands;
using CounterStrikeSharp.API.Modules.Utils;
using System.Text.Json;
using System.Net.Http;
using System.Text;

namespace CS2PanelPlugin;

public class CS2PanelPlugin : BasePlugin
{
    public override string ModuleName => "CS2 Panel Integration";
    public override string ModuleVersion => "1.0.0";
    public override string ModuleAuthor => "CS2 Panel";
    public override string ModuleDescription => "Integrare cu panoul web CS2";

    private Config? _config;
    private HttpClient _httpClient = new HttpClient();
    private Dictionary<ulong, PlayerData> _playerData = new Dictionary<ulong, PlayerData>();
    private Dictionary<ulong, DateTime> _lastKeyRequest = new Dictionary<ulong, DateTime>();
    private Dictionary<ulong, DateTime> _lastResetRequest = new Dictionary<ulong, DateTime>();

    public override void Load(bool hotReload)
    {
        _config = LoadConfig();
        
        if (_config == null)
        {
            Console.WriteLine("[CS2 Panel] Eroare: Nu s-a putut încărca configurația!");
            return;
        }

        _httpClient.DefaultRequestHeaders.Add("X-API-Key", _config.ApiKey);
        
        Console.WriteLine("[CS2 Panel] Plugin încărcat cu succes!");
        
        // Sincronizare automată la fiecare 5 minute
        if (_config.EnableAutoSync)
        {
            AddTimer(_config.SyncInterval, () => SyncAllPlayers(), TimerFlags.REPEAT);
        }
    }

    [ConsoleCommand("css_key", "Generează cheia unică pentru autentificare")]
    [CommandHelper(whoCanExecute: CommandUsage.CLIENT_ONLY)]
    public void OnKeyCommand(CCSPlayerController? player, CommandInfo command)
    {
        if (player == null || !player.IsValid) return;

        var steamId = player.SteamID;
        
        // Rate limiting - 1 minut între cereri
        if (_lastKeyRequest.ContainsKey(steamId))
        {
            var timeSinceLastRequest = DateTime.Now - _lastKeyRequest[steamId];
            if (timeSinceLastRequest.TotalSeconds < 60)
            {
                var remainingTime = 60 - (int)timeSinceLastRequest.TotalSeconds;
                player.PrintToChat($" {ChatColors.Red}[CS2 Panel] Așteaptă {remainingTime} secunde înainte de a cere o nouă cheie!");
                return;
            }
        }

        _lastKeyRequest[steamId] = DateTime.Now;

        Task.Run(async () =>
        {
            try
            {
                var steamIdStr = ConvertSteamId(steamId);
                var avatarUrl = await GetPlayerAvatar(steamId);
                
                var requestData = new
                {
                    steam_id = steamIdStr,
                    steam_name = player.PlayerName,
                    steam_avatar_url = avatarUrl
                };

                var json = JsonSerializer.Serialize(requestData);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                
                var response = await _httpClient.PostAsync($"{_config!.WebPanelUrl}/api/cs2/generate-key", content);
                var responseText = await response.Content.ReadAsStringAsync();
                
                if (response.IsSuccessStatusCode)
                {
                    var result = JsonSerializer.Deserialize<KeyResponse>(responseText);
                    if (result?.success == true && !string.IsNullOrEmpty(result.key))
                    {
                        Server.NextFrame(() =>
                        {
                            player.PrintToChat($" {ChatColors.Green}[CS2 Panel] ═══════════════════════════════");
                            player.PrintToChat($" {ChatColors.LightBlue}[CS2 Panel] Cheia ta unică:");
                            player.PrintToChat($" {ChatColors.Yellow}[CS2 Panel] {result.key}");
                            player.PrintToChat($" {ChatColors.Green}[CS2 Panel] ═══════════════════════════════");
                            player.PrintToChat($" {ChatColors.White}[CS2 Panel] Folosește această cheie pe:");
                            player.PrintToChat($" {ChatColors.LightBlue}[CS2 Panel] {_config.WebPanelUrl}/login-key");
                            player.PrintToChat($" {ChatColors.Red}[CS2 Panel] IMPORTANT: Păstrează cheia în siguranță!");
                            player.PrintToChat($" {ChatColors.Green}[CS2 Panel] ═══════════════════════════════");
                        });
                    }
                }
                else
                {
                    Server.NextFrame(() =>
                    {
                        player.PrintToChat($" {ChatColors.Red}[CS2 Panel] Eroare la generarea cheii. Încearcă din nou!");
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[CS2 Panel] Eroare la generarea cheii: {ex.Message}");
                Server.NextFrame(() =>
                {
                    player.PrintToChat($" {ChatColors.Red}[CS2 Panel] Eroare la generarea cheii!");
                });
            }
        });
    }

    [ConsoleCommand("css_resetkey", "Resetează cheia unică")]
    [CommandHelper(whoCanExecute: CommandUsage.CLIENT_ONLY)]
    public void OnResetKeyCommand(CCSPlayerController? player, CommandInfo command)
    {
        if (player == null || !player.IsValid) return;

        var steamId = player.SteamID;
        
        // Rate limiting - 5 minute între reset-uri
        if (_lastResetRequest.ContainsKey(steamId))
        {
            var timeSinceLastRequest = DateTime.Now - _lastResetRequest[steamId];
            if (timeSinceLastRequest.TotalSeconds < 300)
            {
                var remainingTime = 300 - (int)timeSinceLastRequest.TotalSeconds;
                var minutes = remainingTime / 60;
                var seconds = remainingTime % 60;
                player.PrintToChat($" {ChatColors.Red}[CS2 Panel] Așteaptă {minutes}m {seconds}s înainte de a reseta cheia!");
                return;
            }
        }

        _lastResetRequest[steamId] = DateTime.Now;

        Task.Run(async () =>
        {
            try
            {
                var steamIdStr = ConvertSteamId(steamId);
                
                // Mai întâi obținem cheia veche
                var getResponse = await _httpClient.GetAsync($"{_config!.WebPanelUrl}/api/cs2/get-player?steam_id={steamIdStr}");
                if (!getResponse.IsSuccessStatusCode)
                {
                    Server.NextFrame(() =>
                    {
                        player.PrintToChat($" {ChatColors.Red}[CS2 Panel] Nu ai o cheie generată! Folosește !key");
                    });
                    return;
                }

                var playerDataText = await getResponse.Content.ReadAsStringAsync();
                var playerDataResult = JsonSerializer.Deserialize<PlayerDataResponse>(playerDataText);
                
                if (playerDataResult?.success != true || string.IsNullOrEmpty(playerDataResult.player?.unique_key))
                {
                    Server.NextFrame(() =>
                    {
                        player.PrintToChat($" {ChatColors.Red}[CS2 Panel] Nu ai o cheie generată! Folosește !key");
                    });
                    return;
                }

                var requestData = new
                {
                    steam_id = steamIdStr,
                    old_key = playerDataResult.player.unique_key
                };

                var json = JsonSerializer.Serialize(requestData);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                
                var response = await _httpClient.PostAsync($"{_config.WebPanelUrl}/api/cs2/reset-key", content);
                var responseText = await response.Content.ReadAsStringAsync();
                
                if (response.IsSuccessStatusCode)
                {
                    var result = JsonSerializer.Deserialize<KeyResponse>(responseText);
                    if (result?.success == true && !string.IsNullOrEmpty(result.key))
                    {
                        Server.NextFrame(() =>
                        {
                            player.PrintToChat($" {ChatColors.Green}[CS2 Panel] ═══════════════════════════════");
                            player.PrintToChat($" {ChatColors.LightBlue}[CS2 Panel] Cheia ta a fost resetată!");
                            player.PrintToChat($" {ChatColors.Yellow}[CS2 Panel] Noua cheie: {result.key}");
                            player.PrintToChat($" {ChatColors.Green}[CS2 Panel] ═══════════════════════════════");
                            player.PrintToChat($" {ChatColors.White}[CS2 Panel] NU ai pierdut:");
                            player.PrintToChat($" {ChatColors.LightBlue}[CS2 Panel] ✓ Rank, Stats, Credite, Inventory");
                            player.PrintToChat($" {ChatColors.Green}[CS2 Panel] ═══════════════════════════════");
                        });
                    }
                }
                else
                {
                    Server.NextFrame(() =>
                    {
                        player.PrintToChat($" {ChatColors.Red}[CS2 Panel] Eroare la resetarea cheii!");
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[CS2 Panel] Eroare la resetarea cheii: {ex.Message}");
                Server.NextFrame(() =>
                {
                    player.PrintToChat($" {ChatColors.Red}[CS2 Panel] Eroare la resetarea cheii!");
                });
            }
        });
    }

    [ConsoleCommand("css_credits", "Verifică credite")]
    [CommandHelper(whoCanExecute: CommandUsage.CLIENT_ONLY)]
    public void OnCreditsCommand(CCSPlayerController? player, CommandInfo command)
    {
        if (player == null || !player.IsValid) return;

        var steamId = player.SteamID;
        if (_playerData.ContainsKey(steamId))
        {
            var data = _playerData[steamId];
            player.PrintToChat($" {ChatColors.Green}[CS2 Panel] Ai {ChatColors.Yellow}{data.Credits}{ChatColors.Green} credite!");
        }
        else
        {
            player.PrintToChat($" {ChatColors.Red}[CS2 Panel] Nu s-au putut încărca datele!");
        }
    }

    [ConsoleCommand("css_stats", "Verifică statistici")]
    [CommandHelper(whoCanExecute: CommandUsage.CLIENT_ONLY)]
    public void OnStatsCommand(CCSPlayerController? player, CommandInfo command)
    {
        if (player == null || !player.IsValid) return;

        var steamId = player.SteamID;
        if (_playerData.ContainsKey(steamId))
        {
            var data = _playerData[steamId];
            player.PrintToChat($" {ChatColors.Green}[CS2 Panel] ═══════════════════════════════");
            player.PrintToChat($" {ChatColors.LightBlue}[CS2 Panel] Statisticile tale:");
            player.PrintToChat($" {ChatColors.White}[CS2 Panel] Kills: {ChatColors.Yellow}{data.Kills}");
            player.PrintToChat($" {ChatColors.White}[CS2 Panel] Deaths: {ChatColors.Yellow}{data.Deaths}");
            player.PrintToChat($" {ChatColors.White}[CS2 Panel] K/D: {ChatColors.Yellow}{(data.Deaths > 0 ? ((double)data.Kills / data.Deaths).ToString("F2") : data.Kills.ToString())}");
            player.PrintToChat($" {ChatColors.White}[CS2 Panel] Headshots: {ChatColors.Yellow}{data.Headshots}");
            player.PrintToChat($" {ChatColors.White}[CS2 Panel] Wins: {ChatColors.Yellow}{data.Wins}");
            player.PrintToChat($" {ChatColors.White}[CS2 Panel] Meciuri: {ChatColors.Yellow}{data.MatchesPlayed}");
            player.PrintToChat($" {ChatColors.Green}[CS2 Panel] ═══════════════════════════════");
        }
        else
        {
            player.PrintToChat($" {ChatColors.Red}[CS2 Panel] Nu s-au putut încărca datele!");
        }
    }

    [GameEventHandler]
    public HookResult OnPlayerConnect(EventPlayerConnectFull @event, GameEventInfo info)
    {
        var player = @event.Userid;
        if (player == null || !player.IsValid || player.IsBot) return HookResult.Continue;

        var steamId = player.SteamID;
        
        // Inițializare date jucător
        if (!_playerData.ContainsKey(steamId))
        {
            _playerData[steamId] = new PlayerData
            {
                SteamId = ConvertSteamId(steamId),
                SteamName = player.PlayerName,
                Credits = 0,
                Kills = 0,
                Deaths = 0,
                Headshots = 0,
                Wins = 0,
                MatchesPlayed = 0,
                TimePlayed = 0,
                MVP = 0
            };
        }

        // Încarcă datele din baza de date
        Task.Run(async () => await LoadPlayerData(player));

        return HookResult.Continue;
    }

    [GameEventHandler]
    public HookResult OnPlayerDisconnect(EventPlayerDisconnect @event, GameEventInfo info)
    {
        var player = @event.Userid;
        if (player == null || !player.IsValid || player.IsBot) return HookResult.Continue;

        // Salvează datele la disconnect
        Task.Run(async () => await SyncPlayerData(player));

        return HookResult.Continue;
    }

    [GameEventHandler]
    public HookResult OnPlayerDeath(EventPlayerDeath @event, GameEventInfo info)
    {
        var attacker = @event.Attacker;
        var victim = @event.Userid;

        if (attacker != null && attacker.IsValid && !attacker.IsBot && attacker.SteamID != victim?.SteamID)
        {
            var steamId = attacker.SteamID;
            if (_playerData.ContainsKey(steamId))
            {
                _playerData[steamId].Kills++;
                if (@event.Headshot)
                {
                    _playerData[steamId].Headshots++;
                }
            }
        }

        if (victim != null && victim.IsValid && !victim.IsBot)
        {
            var steamId = victim.SteamID;
            if (_playerData.ContainsKey(steamId))
            {
                _playerData[steamId].Deaths++;
            }
        }

        return HookResult.Continue;
    }

    [GameEventHandler]
    public HookResult OnRoundEnd(EventRoundEnd @event, GameEventInfo info)
    {
        var winner = @event.Winner;
        
        foreach (var player in Utilities.GetPlayers().Where(p => p.IsValid && !p.IsBot))
        {
            var steamId = player.SteamID;
            if (_playerData.ContainsKey(steamId))
            {
                _playerData[steamId].MatchesPlayed++;
                
                if ((int)player.TeamNum == winner)
                {
                    _playerData[steamId].Wins++;
                    // Bonus credite pentru câștig
                    _playerData[steamId].Credits += 100;
                }
                else
                {
                    // Credite pentru participare
                    _playerData[steamId].Credits += 50;
                }
            }
        }

        return HookResult.Continue;
    }

    private async Task LoadPlayerData(CCSPlayerController player)
    {
        try
        {
            var steamIdStr = ConvertSteamId(player.SteamID);
            var response = await _httpClient.GetAsync($"{_config!.WebPanelUrl}/api/cs2/get-player?steam_id={steamIdStr}");
            
            if (response.IsSuccessStatusCode)
            {
                var responseText = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<PlayerDataResponse>(responseText);
                
                if (result?.success == true && result.player != null)
                {
                    var steamId = player.SteamID;
                    _playerData[steamId] = new PlayerData
                    {
                        SteamId = steamIdStr,
                        SteamName = player.PlayerName,
                        Credits = result.player.credits,
                        Kills = result.player.kills,
                        Deaths = result.player.deaths,
                        Headshots = result.player.headshots,
                        Wins = result.player.wins,
                        MatchesPlayed = result.player.matches_played,
                        TimePlayed = result.player.time_played,
                        MVP = result.player.mvp
                    };
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[CS2 Panel] Eroare la încărcarea datelor pentru {player.PlayerName}: {ex.Message}");
        }
    }

    private async Task SyncPlayerData(CCSPlayerController player)
    {
        try
        {
            var steamId = player.SteamID;
            if (!_playerData.ContainsKey(steamId)) return;

            var data = _playerData[steamId];
            var avatarUrl = await GetPlayerAvatar(steamId);
            
            var requestData = new
            {
                steam_id = data.SteamId,
                steam_name = player.PlayerName,
                steam_avatar_url = avatarUrl,
                credits = data.Credits,
                kills = data.Kills,
                deaths = data.Deaths,
                headshots = data.Headshots,
                wins = data.Wins,
                matches_played = data.MatchesPlayed,
                time_played = data.TimePlayed,
                mvp = data.MVP
            };

            var json = JsonSerializer.Serialize(requestData);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            
            await _httpClient.PostAsync($"{_config!.WebPanelUrl}/api/cs2/sync-player", content);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[CS2 Panel] Eroare la sincronizarea datelor pentru {player.PlayerName}: {ex.Message}");
        }
    }

    private void SyncAllPlayers()
    {
        foreach (var player in Utilities.GetPlayers().Where(p => p.IsValid && !p.IsBot))
        {
            Task.Run(async () => await SyncPlayerData(player));
        }
    }

    private string ConvertSteamId(ulong steamId64)
    {
        // Convertește SteamID64 în format STEAM_X:Y:Z
        var steamId32 = steamId64 - 76561197960265728;
        var y = steamId32 % 2;
        var z = (steamId32 - y) / 2;
        return $"STEAM_1:{y}:{z}";
    }

    private async Task<string> GetPlayerAvatar(ulong steamId)
    {
        // Aici poți implementa logica pentru a obține avatar-ul de pe Steam
        // Pentru moment returnăm un URL generic
        return $"https://avatars.steamstatic.com/{steamId}_full.jpg";
    }

    private Config? LoadConfig()
    {
        var configPath = Path.Combine(ModuleDirectory, "config.json");
        
        if (!File.Exists(configPath))
        {
            // Creează config implicit
            var defaultConfig = new Config
            {
                WebPanelUrl = "https://your-domain.com",
                ApiKey = "your-api-key-here",
                SyncInterval = 300,
                EnableKeyAuth = true,
                EnableAutoSync = true
            };
            
            var json = JsonSerializer.Serialize(defaultConfig, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(configPath, json);
            
            Console.WriteLine($"[CS2 Panel] Config creat la: {configPath}");
            return defaultConfig;
        }

        var configText = File.ReadAllText(configPath);
        return JsonSerializer.Deserialize<Config>(configText);
    }
}

public class Config
{
    public string WebPanelUrl { get; set; } = "";
    public string ApiKey { get; set; } = "";
    public int SyncInterval { get; set; } = 300;
    public bool EnableKeyAuth { get; set; } = true;
    public bool EnableAutoSync { get; set; } = true;
}

public class PlayerData
{
    public string SteamId { get; set; } = "";
    public string SteamName { get; set; } = "";
    public int Credits { get; set; }
    public int Kills { get; set; }
    public int Deaths { get; set; }
    public int Headshots { get; set; }
    public int Wins { get; set; }
    public int MatchesPlayed { get; set; }
    public int TimePlayed { get; set; }
    public int MVP { get; set; }
}

public class KeyResponse
{
    public bool success { get; set; }
    public string? key { get; set; }
    public string? message { get; set; }
}

public class PlayerDataResponse
{
    public bool success { get; set; }
    public PlayerInfo? player { get; set; }
}

public class PlayerInfo
{
    public string? unique_key { get; set; }
    public int credits { get; set; }
    public int kills { get; set; }
    public int deaths { get; set; }
    public int headshots { get; set; }
    public int wins { get; set; }
    public int matches_played { get; set; }
    public int time_played { get; set; }
    public int mvp { get; set; }
}
