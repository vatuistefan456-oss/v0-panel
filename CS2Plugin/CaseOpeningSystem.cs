using CounterStrikeSharp.API;
using CounterStrikeSharp.API.Core;
using CounterStrikeSharp.API.Modules.Commands;
using CounterStrikeSharp.API.Modules.Utils;
using System.Text.Json;
using System.Net.Http;
using System.Text;

namespace CS2PanelPlugin
{
    public partial class CS2PanelPlugin
    {
        private Dictionary<string, DateTime> caseOpenCooldowns = new Dictionary<string, DateTime>();
        private const int CASE_OPEN_COOLDOWN_SECONDS = 3;

        [ConsoleCommand("css_opencase", "Open a case")]
        public void OnOpenCaseCommand(CCSPlayerController? player, CommandInfo command)
        {
            if (player == null || !player.IsValid) return;

            var steamId = player.SteamID.ToString();
            
            if (caseOpenCooldowns.ContainsKey(steamId))
            {
                var timeSinceLastOpen = DateTime.Now - caseOpenCooldowns[steamId];
                if (timeSinceLastOpen.TotalSeconds < CASE_OPEN_COOLDOWN_SECONDS)
                {
                    player.PrintToChat($" {ChatColors.Red}Așteaptă {CASE_OPEN_COOLDOWN_SECONDS - (int)timeSinceLastOpen.TotalSeconds} secunde!");
                    return;
                }
            }

            if (command.ArgCount < 2)
            {
                player.PrintToChat($" {ChatColors.Yellow}Folosește: !opencase <case_id>");
                player.PrintToChat($" {ChatColors.Yellow}Exemple: !opencase chroma_case, !opencase kilowatt_case");
                return;
            }

            var caseId = command.GetArg(1);
            
            caseOpenCooldowns[steamId] = DateTime.Now;

            Task.Run(async () => await OpenCaseAsync(player, steamId, caseId));
        }

        private async Task OpenCaseAsync(CCSPlayerController player, string steamId, string caseId)
        {
            try
            {
                var requestData = new
                {
                    steamId = steamId,
                    caseId = caseId
                };

                var json = JsonSerializer.Serialize(requestData);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var request = new HttpRequestMessage(HttpMethod.Post, $"{Config.PanelUrl}/api/cs2/cases/open");
                request.Headers.Add("X-API-Key", Config.ApiKey);
                request.Content = content;

                var response = await httpClient.SendAsync(request);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    var result = JsonSerializer.Deserialize<CaseOpenResult>(responseContent);
                    
                    if (result?.success == true && result.item != null)
                    {
                        Server.NextFrame(() =>
                        {
                            var chatColor = GetRarityColor(result.item.rarity);
                            var statTrakPrefix = result.item.isStatTrak ? "StatTrak™ " : "";
                            
                            Server.PrintToChatAll($" {ChatColors.Green}{player.PlayerName} {ChatColors.Default}a deschis {chatColor}{statTrakPrefix}{result.item.name} {ChatColors.Grey}({result.item.wear}) {ChatColors.Yellow}{result.item.value} credite");
                            
                            if (result.isRare)
                            {
                                Server.PrintToChatAll($" {ChatColors.Gold}🎉 {player.PlayerName} a primit un item RAR: {result.item.name}! 🎉");
                            }
                            
                            if (new Random().Next(0, 5) == 0)
                            {
                                Server.PrintToChatAll($" {ChatColors.Blue}Verifica-te pe !discord sau cs2-panel.ro");
                            }
                        });
                    }
                    else
                    {
                        Server.NextFrame(() =>
                        {
                            player.PrintToChat($" {ChatColors.Red}Eroare la deschiderea cutiei!");
                        });
                    }
                }
                else
                {
                    var errorMsg = "Eroare necunoscută";
                    try
                    {
                        var errorResult = JsonSerializer.Deserialize<ApiErrorResponse>(responseContent);
                        errorMsg = errorResult?.error ?? errorMsg;
                    }
                    catch { }

                    Server.NextFrame(() =>
                    {
                        player.PrintToChat($" {ChatColors.Red}{errorMsg}");
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[CS2Panel] Error opening case: {ex.Message}");
                Server.NextFrame(() =>
                {
                    player.PrintToChat($" {ChatColors.Red}Eroare la conectarea cu panoul!");
                });
            }
        }

        private ChatColors GetRarityColor(string rarity)
        {
            return rarity switch
            {
                "rare" => ChatColors.Gold,
                "covert" => ChatColors.Red,
                "classified" => ChatColors.Pink,
                "restricted" => ChatColors.Purple,
                "milSpec" => ChatColors.Blue,
                _ => ChatColors.Default
            };
        }

        [ConsoleCommand("css_cases", "View available cases")]
        public void OnCasesCommand(CCSPlayerController? player, CommandInfo command)
        {
            if (player == null || !player.IsValid) return;

            player.PrintToChat($" {ChatColors.Yellow}═══════════════════════════════");
            player.PrintToChat($" {ChatColors.Green}Cutii Disponibile:");
            player.PrintToChat($" {ChatColors.Blue}• Chroma Case {ChatColors.Grey}(2,290 credite)");
            player.PrintToChat($" {ChatColors.Blue}• Chroma 2 Case {ChatColors.Grey}(2,290 credite)");
            player.PrintToChat($" {ChatColors.Blue}• Chroma 3 Case {ChatColors.Grey}(2,290 credite)");
            player.PrintToChat($" {ChatColors.Blue}• Kilowatt Case {ChatColors.Grey}(3,000 credite)");
            player.PrintToChat($" {ChatColors.Blue}• Revolution Case {ChatColors.Grey}(2,800 credite)");
            player.PrintToChat($" {ChatColors.Yellow}Folosește: !opencase <case_id>");
            player.PrintToChat($" {ChatColors.Yellow}═══════════════════════════════");
        }

        private class CaseOpenResult
        {
            public bool success { get; set; }
            public CaseItem? item { get; set; }
            public string? chatMessage { get; set; }
            public bool isRare { get; set; }
            public int newCredits { get; set; }
        }

        private class CaseItem
        {
            public string name { get; set; } = "";
            public string rarity { get; set; } = "";
            public double floatValue { get; set; }
            public string wear { get; set; } = "";
            public bool isStatTrak { get; set; }
            public int value { get; set; }
        }
    }
}
