using CounterStrikeSharp.API;
using CounterStrikeSharp.API.Core;
using CounterStrikeSharp.API.Modules.Commands;
using CounterStrikeSharp.API.Modules.Utils;
using CounterStrikeSharp.API.Modules.Menu;
using System.Text.Json;

namespace CS2PanelPlugin
{
    public partial class CS2PanelPlugin
    {
        private Dictionary<ulong, MenuState> playerMenuStates = new Dictionary<ulong, MenuState>();
        private Dictionary<ulong, int> playerCaseInventory = new Dictionary<ulong, int>();

        [ConsoleCommand("css_case", "Deschide meniul de cutii")]
        public void OnCaseMenuCommand(CCSPlayerController? player, CommandInfo command)
        {
            if (player == null || !player.IsValid) return;
            
            OpenMainCasesMenu(player);
        }

        private void OpenMainCasesMenu(CCSPlayerController player)
        {
            var steamId = player.SteamID;
            
            // Obține numărul de cutii din inventar
            var caseCount = playerCaseInventory.ContainsKey(steamId) ? playerCaseInventory[steamId] : 0;
            
            player.PrintToCenter($"Cases\n▶ Your cases [{caseCount}] ◀\nCraft system\nShards system\n\nTAB=close | WASD=move | R=select | SHIFT=back");
            
            var menu = new ChatMenu("Cases");
            menu.AddMenuOption($"Your cases [{caseCount}]", (p, option) => OpenCaseListMenu(p));
            menu.AddMenuOption("Craft system", (p, option) => OpenCraftMenu(p));
            menu.AddMenuOption("Shards system", (p, option) => OpenShardsMenu(p));
            
            MenuManager.OpenChatMenu(player, menu);
        }

        private void OpenCaseListMenu(CCSPlayerController player)
        {
            var menu = new ChatMenu("Cases [1/7]");
            
            menu.AddMenuOption("▶ Chroma Case ◀", (p, option) => OpenCaseDetailMenu(p, "chroma_case", "Chroma Case", 2290));
            menu.AddMenuOption("Chroma 2 Case", (p, option) => OpenCaseDetailMenu(p, "chroma_2_case", "Chroma 2 Case", 2290));
            menu.AddMenuOption("Chroma 3 Case", (p, option) => OpenCaseDetailMenu(p, "chroma_3_case", "Chroma 3 Case", 2290));
            menu.AddMenuOption("Clutch Case", (p, option) => OpenCaseDetailMenu(p, "clutch_case", "Clutch Case", 2500));
            menu.AddMenuOption("CS:GO Weapon Case", (p, option) => OpenCaseDetailMenu(p, "csgo_weapon_case", "CS:GO Weapon Case", 3000));
            menu.AddMenuOption("CS:GO Weapon Case 2", (p, option) => OpenCaseDetailMenu(p, "csgo_weapon_case_2", "CS:GO Weapon Case 2", 3000));
            menu.AddMenuOption("CS:GO Weapon Case 3", (p, option) => OpenCaseDetailMenu(p, "csgo_weapon_case_3", "CS:GO Weapon Case 3", 3000));
            menu.AddMenuOption("◀ Back", (p, option) => OpenMainCasesMenu(p));
            
            MenuManager.OpenChatMenu(player, menu);
        }

        private void OpenCaseDetailMenu(CCSPlayerController player, string caseId, string caseName, int price)
        {
            var steamId = player.SteamID;
            var caseCount = playerCaseInventory.ContainsKey(steamId) ? playerCaseInventory[steamId] : 0;
            var credits = _playerData.ContainsKey(steamId) ? _playerData[steamId].Credits : 0;
            var keys = 0; // TODO: Implementează sistem de chei
            
            player.PrintToCenter($"{caseName}\nCases: {caseCount} | Opened: 0\nCredits: {credits:N0} | Keys: {keys}\n\nOpen x1 case\nOpen x2 cases [VIP STARTER/PRO]\nOpen x6 cases [VIP LEGEND]\n\nTAB=close | WASD=move | R=select | SHIFT=back");
            
            var menu = new ChatMenu(caseName);
            menu.AddMenuOption($"Open x1 case ({price} credits)", (p, option) => OpenCase(p, caseId, 1, price));
            menu.AddMenuOption($"Open x2 cases [VIP STARTER/PRO]", (p, option) => OpenCase(p, caseId, 2, price));
            menu.AddMenuOption($"Open x6 cases [VIP LEGEND]", (p, option) => OpenCase(p, caseId, 6, price));
            menu.AddMenuOption("◀ Back", (p, option) => OpenCaseListMenu(p));
            
            MenuManager.OpenChatMenu(player, menu);
        }

        private void OpenCase(CCSPlayerController player, string caseId, int count, int pricePerCase)
        {
            var steamId = player.SteamID;
            
            if (!_playerData.ContainsKey(steamId))
            {
                player.PrintToChat($" {ChatColors.Red}Eroare la încărcarea datelor!");
                return;
            }

            var totalPrice = pricePerCase * count;
            var playerData = _playerData[steamId];
            
            if (playerData.Credits < totalPrice)
            {
                player.PrintToChat($" {ChatColors.Red}Nu ai suficiente credite! Necesare: {totalPrice:N0}, Ai: {playerData.Credits:N0}");
                return;
            }

            // Verifică VIP pentru deschidere multiplă
            if (count > 1)
            {
                // TODO: Verifică status VIP
                player.PrintToChat($" {ChatColors.Red}Ai nevoie de VIP pentru a deschide multiple cutii!");
                return;
            }

            // Deschide cutia/cutiile
            for (int i = 0; i < count; i++)
            {
                Task.Run(async () => await OpenCaseAsync(player, steamId.ToString(), caseId));
            }
            
            // Scade creditele
            playerData.Credits -= totalPrice;
            
            player.PrintToChat($" {ChatColors.Green}Deschizi {count} cutie/cutii...");
        }

        private void OpenCraftMenu(CCSPlayerController player)
        {
            player.PrintToChat($" {ChatColors.Yellow}[Craft System] Sistemul de craft va fi disponibil în curând!");
            player.PrintToChat($" {ChatColors.Blue}[Craft System] Vei putea combina skin-uri pentru a crea altele noi!");
        }

        private void OpenShardsMenu(CCSPlayerController player)
        {
            player.PrintToChat($" {ChatColors.Yellow}[Shards System] Sistemul de shards va fi disponibil în curând!");
            player.PrintToChat($" {ChatColors.Blue}[Shards System] Vei putea descompune skin-uri în shards!");
        }

        [ConsoleCommand("css_inventory", "Vezi inventarul tău")]
        public void OnInventoryCommand(CCSPlayerController? player, CommandInfo command)
        {
            if (player == null || !player.IsValid) return;

            var steamId = player.SteamID;
            
            Task.Run(async () =>
            {
                try
                {
                    var steamIdStr = ConvertSteamId(steamId);
                    var response = await _httpClient.GetAsync($"{_config!.WebPanelUrl}/api/cs2/inventory?steam_id={steamIdStr}");
                    
                    if (response.IsSuccessStatusCode)
                    {
                        var responseText = await response.Content.ReadAsStringAsync();
                        var result = JsonSerializer.Deserialize<InventoryResponse>(responseText);
                        
                        if (result?.success == true && result.items != null)
                        {
                            Server.NextFrame(() =>
                            {
                                player.PrintToChat($" {ChatColors.Green}═══════════════════════════════");
                                player.PrintToChat($" {ChatColors.LightBlue}Inventarul tău ({result.items.Count} items):");
                                
                                var displayCount = Math.Min(result.items.Count, 10);
                                for (int i = 0; i < displayCount; i++)
                                {
                                    var item = result.items[i];
                                    var color = GetRarityColor(item.rarity);
                                    var statTrak = item.isStatTrak ? "ST " : "";
                                    player.PrintToChat($" {color}{statTrak}{item.name} {ChatColors.Grey}({item.wear}) {ChatColors.Yellow}{item.value} cr");
                                }
                                
                                if (result.items.Count > 10)
                                {
                                    player.PrintToChat($" {ChatColors.Grey}... și încă {result.items.Count - 10} items");
                                }
                                
                                player.PrintToChat($" {ChatColors.Blue}Vezi inventarul complet pe: {_config.WebPanelUrl}");
                                player.PrintToChat($" {ChatColors.Green}═══════════════════════════════");
                            });
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[CS2 Panel] Eroare la încărcarea inventarului: {ex.Message}");
                    Server.NextFrame(() =>
                    {
                        player.PrintToChat($" {ChatColors.Red}Eroare la încărcarea inventarului!");
                    });
                }
            });
        }

        private class MenuState
        {
            public string CurrentMenu { get; set; } = "main";
            public int SelectedIndex { get; set; } = 0;
            public string? SelectedCaseId { get; set; }
        }

        private class InventoryResponse
        {
            public bool success { get; set; }
            public List<InventoryItem>? items { get; set; }
        }

        private class InventoryItem
        {
            public string name { get; set; } = "";
            public string rarity { get; set; } = "";
            public string wear { get; set; } = "";
            public bool isStatTrak { get; set; }
            public int value { get; set; }
        }
    }
}
