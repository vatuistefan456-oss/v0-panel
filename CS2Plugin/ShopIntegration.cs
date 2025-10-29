using CounterStrikeSharp.API;
using CounterStrikeSharp.API.Core;
using CounterStrikeSharp.API.Modules.Commands;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace CS2Plugin
{
    public class ShopIntegration
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiBaseUrl;
        private readonly string _apiKey;

        public ShopIntegration(string apiBaseUrl, string apiKey)
        {
            _apiBaseUrl = apiBaseUrl;
            _apiKey = apiKey;
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Add("x-api-key", _apiKey);
        }

        // Get player balance from website
        public async Task<PlayerBalance?> GetPlayerBalance(string steamId)
        {
            try
            {
                var content = new StringContent(
                    JsonSerializer.Serialize(new { steamId }),
                    Encoding.UTF8,
                    "application/json"
                );

                var response = await _httpClient.PostAsync($"{_apiBaseUrl}/api/cs2/player-balance", content);
                
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    return JsonSerializer.Deserialize<PlayerBalance>(json);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ShopIntegration] Error getting balance: {ex.Message}");
            }

            return null;
        }

        // Sync player inventory from website
        public async Task<List<InventoryItem>?> SyncInventory(string steamId)
        {
            try
            {
                var content = new StringContent(
                    JsonSerializer.Serialize(new { steamId }),
                    Encoding.UTF8,
                    "application/json"
                );

                var response = await _httpClient.PostAsync($"{_apiBaseUrl}/api/cs2/sync-inventory", content);
                
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<InventorySyncResponse>(json);
                    return result?.inventory;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ShopIntegration] Error syncing inventory: {ex.Message}");
            }

            return null;
        }

        // Add credits to player (called from gameplay rewards)
        public async Task<bool> AddCredits(string steamId, int credits, string reason)
        {
            try
            {
                var content = new StringContent(
                    JsonSerializer.Serialize(new { steamId, credits, reason }),
                    Encoding.UTF8,
                    "application/json"
                );

                var response = await _httpClient.PostAsync($"{_apiBaseUrl}/api/cs2/add-credits", content);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ShopIntegration] Error adding credits: {ex.Message}");
                return false;
            }
        }

        // Command: !balance - Show player balance
        [ConsoleCommand("css_balance", "Show your balance")]
        public void OnBalanceCommand(CCSPlayerController? player, CommandInfo command)
        {
            if (player == null || !player.IsValid) return;

            var steamId = player.SteamID.ToString();
            
            Task.Run(async () =>
            {
                var balance = await GetPlayerBalance(steamId);
                
                if (balance != null)
                {
                    Server.NextFrame(() =>
                    {
                        player.PrintToChat($" \x04[Shop]\x01 Balance: \x06${balance.realMoneyBalance:F2}\x01 | \x0E{balance.creditsBalance:N0} Credits");
                    });
                }
                else
                {
                    Server.NextFrame(() =>
                    {
                        player.PrintToChat($" \x02[Shop]\x01 Failed to fetch balance. Try again later.");
                    });
                }
            });
        }

        // Command: !shop - Open shop URL
        [ConsoleCommand("css_shop", "Open the shop")]
        public void OnShopCommand(CCSPlayerController? player, CommandInfo command)
        {
            if (player == null || !player.IsValid) return;

            player.PrintToChat($" \x04[Shop]\x01 Visit our shop: \x0B{_apiBaseUrl}/shop");
            player.PrintToChat($" \x04[Shop]\x01 Buy cases, skins, agents, and more!");
        }

        // Command: !inventory - Sync inventory from website
        [ConsoleCommand("css_inventory", "Sync your inventory")]
        public void OnInventoryCommand(CCSPlayerController? player, CommandInfo command)
        {
            if (player == null || !player.IsValid) return;

            var steamId = player.SteamID.ToString();
            
            Task.Run(async () =>
            {
                var inventory = await SyncInventory(steamId);
                
                if (inventory != null && inventory.Count > 0)
                {
                    Server.NextFrame(() =>
                    {
                        player.PrintToChat($" \x04[Shop]\x01 Inventory synced! You have \x0E{inventory.Count}\x01 items.");
                        
                        // Count items by type
                        var cases = inventory.Count(i => i.item_type == "case");
                        var skins = inventory.Count(i => i.item_type == "skin");
                        var agents = inventory.Count(i => i.item_type == "agent");
                        var charms = inventory.Count(i => i.item_type == "charm");
                        
                        if (cases > 0) player.PrintToChat($" \x06Cases:\x01 {cases}");
                        if (skins > 0) player.PrintToChat($" \x06Skins:\x01 {skins}");
                        if (agents > 0) player.PrintToChat($" \x06Agents:\x01 {agents}");
                        if (charms > 0) player.PrintToChat($" \x06Charms:\x01 {charms}");
                    });
                }
                else
                {
                    Server.NextFrame(() =>
                    {
                        player.PrintToChat($" \x04[Shop]\x01 Your inventory is empty. Visit \x0B!shop\x01 to buy items!");
                    });
                }
            });
        }
    }

    // Data models
    public class PlayerBalance
    {
        public string steamId { get; set; } = "";
        public decimal realMoneyBalance { get; set; }
        public int creditsBalance { get; set; }
        public decimal totalSpentRealMoney { get; set; }
        public int totalSpentCredits { get; set; }
    }

    public class InventoryItem
    {
        public int id { get; set; }
        public string steam_id { get; set; } = "";
        public string item_type { get; set; } = "";
        public int item_id { get; set; }
        public string item_name { get; set; } = "";
        public string acquired_from { get; set; } = "";
        public string acquired_at { get; set; } = "";
    }

    public class InventorySyncResponse
    {
        public bool success { get; set; }
        public List<InventoryItem> inventory { get; set; } = new();
    }
}
