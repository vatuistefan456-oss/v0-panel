using CounterStrikeSharp.API;
using CounterStrikeSharp.API.Core;
using CounterStrikeSharp.API.Modules.Commands;
using CounterStrikeSharp.API.Modules.Menu;
using System.Text.Json;

namespace CS2PanelPlugin;

public class ClanSystem
{
    private readonly CS2PanelPlugin _plugin;
    private readonly Dictionary<ulong, ClanMenuState> _playerMenuStates = new();
    private readonly string _apiBaseUrl;

    public ClanSystem(CS2PanelPlugin plugin, string apiBaseUrl)
    {
        _plugin = plugin;
        _apiBaseUrl = apiBaseUrl;
    }

    public void Initialize()
    {
        _plugin.AddCommand("css_clan", "Open clan menu", OnClanCommand);
        _plugin.AddCommand("css_clan_donate", "Donate credits to clan", OnClanDonateCommand);
    }

    private void OnClanCommand(CController? player, CommandInfo command)
    {
        if (player == null || !player.IsValid) return;

        var steamId = player.SteamID.ToString();
        ShowMainClanMenu(player, steamId);
    }

    private void OnClanDonateCommand(CController? player, CommandInfo command)
    {
        if (player == null || !player.IsValid) return;

        if (command.ArgCount < 2)
        {
            player.PrintToChat($" {ChatColors.Red}Command: !clan_donate <credits>");
            return;
        }

        if (!int.TryParse(command.ArgByIndex(1), out int amount) || amount <= 0)
        {
            player.PrintToChat($" {ChatColors.Red}Invalid amount!");
            return;
        }

        var steamId = player.SteamID.ToString();
        DonateToClan(player, steamId, amount);
    }

    private async void ShowMainClanMenu(CController player, string steamId)
    {
        try
        {
            var clanData = await FetchClanData(steamId);
            
            if (clanData == null || !clanData.HasClan)
            {
                ShowNoClanMenu(player);
                return;
            }

            var menu = new ChatMenu($"Clan {clanData.ClanName}");
            
            menu.AddMenuOption($"Administration", (p, opt) => ShowAdministrationMenu(p, steamId, clanData));
            menu.AddMenuOption($"Members [{clanData.MemberCount}/{clanData.MaxMembers}]", (p, opt) => ShowMembersMenu(p, steamId, clanData));
            menu.AddMenuOption($"Shop [{clanData.ClanPoints}p]", (p, opt) => ShowClanShopMenu(p, steamId, clanData));
            menu.AddMenuOption($"Missions [{clanData.CompletedMissions}/{clanData.TotalMissions}]", (p, opt) => ShowMissionsMenu(p, steamId, clanData));
            menu.AddMenuOption("Top clans", (p, opt) => ShowTopClansMenu(p));
            menu.AddMenuOption("Commands", (p, opt) => ShowCommandsMenu(p, clanData));

            MenuManager.OpenChatMenu(player, menu);
        }
        catch (Exception ex)
        {
            Server.PrintToConsole($"[v0] Error showing clan menu: {ex.Message}");
        }
    }

    private void ShowNoClanMenu(CController player)
    {
        var menu = new ChatMenu("Clans");
        
        menu.AddMenuOption("Create clan", (p, opt) => ShowCreateClanDialog(p));
        menu.AddMenuOption("Accept invite", (p, opt) => ShowPendingInvites(p));
        menu.AddMenuOption("View top clans", (p, opt) => ShowTopClansMenu(p));

        MenuManager.OpenChatMenu(player, menu);
    }

    private void ShowAdministrationMenu(CController player, string steamId, ClanData clanData)
    {
        if (clanData.Role != "Leader" && clanData.Role != "Officer")
        {
            player.PrintToChat($" {ChatColors.Red}You don't have permission!");
            return;
        }

        var menu = new ChatMenu("Administration");
        
        menu.AddMenuOption($"Clan level -{clanData.Level}", (p, opt) => ShowLevelInfo(p, clanData));
        menu.AddMenuOption("Tag generator", (p, opt) => ShowTagGenerator(p, clanData));
        
        if (clanData.Role == "Leader")
        {
            menu.AddMenuOption("Clan settings", (p, opt) => ShowClanSettings(p, clanData));
        }

        MenuManager.OpenChatMenu(player, menu);
    }

    private void ShowMembersMenu(CController player, string steamId, ClanData clanData)
    {
        var menu = new ChatMenu("Members");
        
        foreach (var member in clanData.Members)
        {
            var displayName = $"{member.Name} {clanData.ClanTag}";
            menu.AddMenuOption(displayName, (p, opt) => ShowMemberProfile(p, member, clanData));
        }

        MenuManager.OpenChatMenu(player, menu);
    }

    private void ShowMemberProfile(CController player, ClanMember member, ClanData clanData)
    {
        player.PrintToChat($" {ChatColors.Red}Member {member.Name} {clanData.ClanTag}");
        player.PrintToChat($" {ChatColors.Grey}Rank: {member.Role}");
        player.PrintToChat($" {ChatColors.Grey}Steamid: {member.SteamId}");
        player.PrintToChat($" {ChatColors.Grey}Shop points: {member.ShopPoints}");
        player.PrintToChat($" {ChatColors.Grey}Mission: {member.CurrentMission}");
        player.PrintToChat($" {ChatColors.Grey}Join date: {member.JoinedAt:dd.MM.yyyy HH:mm:ss}");
        player.PrintToChat($" {ChatColors.Grey}Last connected: {member.LastConnected:dd.MM.yyyy HH:mm:ss}");
    }

    private void ShowClanShopMenu(CController player, string steamId, ClanData clanData)
    {
        var menu = new ChatMenu($"Shop - {clanData.ClanPoints}p");
        
        menu.AddMenuOption("Credits: 1000 [1p]", (p, opt) => PurchaseClanItem(p, "credits_1000", 1, clanData));
        menu.AddMenuOption("AK-47 | The Oligarch: 30d. [16p]", (p, opt) => PurchaseClanItem(p, "ak47_oligarch", 16, clanData));
        menu.AddMenuOption("M4A4 | Full Throttle: 30d. [15p]", (p, opt) => PurchaseClanItem(p, "m4a4_throttle", 15, clanData));
        menu.AddMenuOption("AWP | Ice Coaled: 30d. [15p]", (p, opt) => PurchaseClanItem(p, "awp_ice", 15, clanData));
        menu.AddMenuOption("[0/7200] Jumper", (p, opt) => PurchaseClanSkill(p, "jumper", 7200, clanData));

        MenuManager.OpenChatMenu(player, menu);
    }

    private void ShowMissionsMenu(CController player, string steamId, ClanData clanData)
    {
        var menu = new ChatMenu("Missions [1/3]");
        
        menu.AddMenuOption("Fun missions [0/3]", (p, opt) => ShowMissionCategory(p, "fun", clanData));
        menu.AddMenuOption("AWP missions [0/8]", (p, opt) => ShowMissionCategory(p, "awp", clanData));
        menu.AddMenuOption("AK-47 missions [0/9]", (p, opt) => ShowMissionCategory(p, "ak47", clanData));
        menu.AddMenuOption("M4A1 missions [0/6]", (p, opt) => ShowMissionCategory(p, "m4a1", clanData));
        menu.AddMenuOption("FAMAS missions [0/8]", (p, opt) => ShowMissionCategory(p, "famas", clanData));
        menu.AddMenuOption("GALIL AR missions [0/8]", (p, opt) => ShowMissionCategory(p, "galil", clanData));
        menu.AddMenuOption("AUG missions [0/8]", (p, opt) => ShowMissionCategory(p, "aug", clanData));

        MenuManager.OpenChatMenu(player, menu);
    }

    private void ShowMissionCategory(CController player, string category, ClanData clanData)
    {
        var menu = new ChatMenu("Missions");
        
        if (category == "awp")
        {
            menu.AddMenuOption("[0/100] AWP Killer [QN]", (p, opt) => ShowMissionDetails(p, "awp_killer"));
            menu.AddMenuOption("[x] AWP Damage", (p, opt) => ShowMissionDetails(p, "awp_damage"));
            menu.AddMenuOption("[x] AWP Killer [Distance]", (p, opt) => ShowMissionDetails(p, "awp_distance"));
            menu.AddMenuOption("[x] AWP Damage [Minimum]", (p, opt) => ShowMissionDetails(p, "awp_damage_min"));
            menu.AddMenuOption("[x] AWP Killer [Smoke]", (p, opt) => ShowMissionDetails(p, "awp_smoke"));
            menu.AddMenuOption("[x] AWP Damage [Head]", (p, opt) => ShowMissionDetails(p, "awp_head"));
        }

        MenuManager.OpenChatMenu(player, menu);
    }

    private void ShowMissionDetails(CController player, string missionId)
    {
        player.PrintToChat($" {ChatColors.Green}Mission details for {missionId}");
        player.PrintToChat($" {ChatColors.Grey}Progress: 0/100");
        player.PrintToChat($" {ChatColors.Grey}Reward: 500 credits + 100 XP");
    }

    private void ShowCommandsMenu(CController player, ClanData clanData)
    {
        var menu = new ChatMenu("Commands");
        
        if (clanData.Role == "Leader")
        {
            menu.AddMenuOption("Invite member", (p, opt) => ShowInviteMemberDialog(p, clanData));
            menu.AddMenuOption("Kick member", (p, opt) => ShowKickMemberMenu(p, clanData));
            menu.AddMenuOption("Delete clan", (p, opt) => ConfirmDeleteClan(p, clanData));
        }
        
        menu.AddMenuOption("Leave clan", (p, opt) => ConfirmLeaveClan(p, clanData));
        menu.AddMenuOption("Donate credits", (p, opt) => ShowDonateDialog(p, clanData));

        MenuManager.OpenChatMenu(player, menu);
    }

    private void ShowTopClansMenu(CController player)
    {
        player.PrintToChat($" {ChatColors.Green}Top Clans:");
        player.PrintToChat($" {ChatColors.Grey}1. LEGION.XENUS.RO - Level 15");
        player.PrintToChat($" {ChatColors.Grey}2. ROMANIA.LLG.RO - Level 12");
        player.PrintToChat($" {ChatColors.Grey}3. PRO.GAMING - Level 10");
    }

    private void ShowCreateClanDialog(CController player)
    {
        player.PrintToChat($" {ChatColors.Green}To create a clan, use:");
        player.PrintToChat($" {ChatColors.Grey}!clan_create <name> <tag>");
        player.PrintToChat($" {ChatColors.Grey}Cost: 10,000 credits");
    }

    private void ShowPendingInvites(CController player)
    {
        player.PrintToChat($" {ChatColors.Green}You have no pending clan invites.");
    }

    private void ShowLevelInfo(CController player, ClanData clanData)
    {
        player.PrintToChat($" {ChatColors.Green}Clan Level: {clanData.Level}");
        player.PrintToChat($" {ChatColors.Grey}Experience: {clanData.Experience}/{clanData.NextLevelXP}");
        player.PrintToChat($" {ChatColors.Grey}Max members: {clanData.MaxMembers}");
    }

    private void ShowTagGenerator(CController player, ClanData clanData)
    {
        player.PrintToChat($" {ChatColors.Green}Current tag: {clanData.ClanTag}");
        player.PrintToChat($" {ChatColors.Grey}Use !clan_tag <new_tag> to change");
    }

    private void ShowClanSettings(CController player, ClanData clanData)
    {
        player.PrintToChat($" {ChatColors.Green}Clan Settings");
        player.PrintToChat($" {ChatColors.Grey}Name: {clanData.ClanName}");
        player.PrintToChat($" {ChatColors.Grey}Tag: {clanData.ClanTag}");
        player.PrintToChat($" {ChatColors.Grey}Description: {clanData.Description}");
    }

    private void ShowInviteMemberDialog(CController player, ClanData clanData)
    {
        player.PrintToChat($" {ChatColors.Green}Use: !clan_invite <player_name>");
    }

    private void ShowKickMemberMenu(CController player, ClanData clanData)
    {
        player.PrintToChat($" {ChatColors.Green}Use: !clan_kick <player_name>");
    }

    private void ShowDonateDialog(CController player, ClanData clanData)
    {
        player.PrintToChat($" {ChatColors.Green}Use: !clan_donate <amount>");
    }

    private void ConfirmLeaveClan(CController player, ClanData clanData)
    {
        player.PrintToChat($" {ChatColors.Red}Are you sure you want to leave {clanData.ClanName}?");
        player.PrintToChat($" {ChatColors.Grey}Type !clan_leave_confirm to confirm");
    }

    private void ConfirmDeleteClan(CController player, ClanData clanData)
    {
        player.PrintToChat($" {ChatColors.Red}Are you sure you want to delete {clanData.ClanName}?");
        player.PrintToChat($" {ChatColors.Grey}Type !clan_delete_confirm to confirm");
    }

    private async void PurchaseClanItem(CController player, string itemId, int cost, ClanData clanData)
    {
        if (clanData.ClanPoints < cost)
        {
            player.PrintToChat($" {ChatColors.Red}Not enough clan points! Need {cost}p");
            return;
        }

        player.PrintToChat($" {ChatColors.Green}Purchased {itemId} for {cost}p!");
    }

    private async void PurchaseClanSkill(CController player, string skillId, int cost, ClanData clanData)
    {
        if (clanData.ClanPoints < cost)
        {
            player.PrintToChat($" {ChatColors.Red}Not enough clan points! Need {cost}p");
            return;
        }

        player.PrintToChat($" {ChatColors.Green}Unlocked skill: {skillId}!");
    }

    private async void DonateToClan(CController player, string steamId, int amount)
    {
        try
        {
            using var client = new HttpClient();
            var response = await client.PostAsync(
                $"{_apiBaseUrl}/cs2/clans/donate",
                JsonContent.Create(new { steamId, amount })
            );

            if (response.IsSuccessStatusCode)
            {
                player.PrintToChat($" {ChatColors.Green}Donated {amount} credits to your clan!");
            }
            else
            {
                player.PrintToChat($" {ChatColors.Red}Failed to donate credits!");
            }
        }
        catch (Exception ex)
        {
            Server.PrintToConsole($"[v0] Error donating to clan: {ex.Message}");
        }
    }

    private async Task<ClanData?> FetchClanData(string steamId)
    {
        try
        {
            using var client = new HttpClient();
            var response = await client.GetAsync($"{_apiBaseUrl}/cs2/clans/player/{steamId}");
            
            if (!response.IsSuccessStatusCode) return null;

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<ClanData>(json);
        }
        catch (Exception ex)
        {
            Server.PrintToConsole($"[v0] Error fetching clan data: {ex.Message}");
            return null;
        }
    }
}

public class ClanMenuState
{
    public string CurrentMenu { get; set; } = "main";
    public int SelectedIndex { get; set; } = 0;
    public string? SelectedCategory { get; set; }
}

public class ClanData
{
    public bool HasClan { get; set; }
    public string ClanName { get; set; } = "";
    public string ClanTag { get; set; } = "";
    public string Description { get; set; } = "";
    public int Level { get; set; }
    public int Experience { get; set; }
    public int NextLevelXP { get; set; }
    public int ClanPoints { get; set; }
    public int MemberCount { get; set; }
    public int MaxMembers { get; set; }
    public int CompletedMissions { get; set; }
    public int TotalMissions { get; set; }
    public string Role { get; set; } = "";
    public List<ClanMember> Members { get; set; } = new();
}

public class ClanMember
{
    public string Name { get; set; } = "";
    public string SteamId { get; set; } = "";
    public string Role { get; set; } = "";
    public int ShopPoints { get; set; }
    public string CurrentMission { get; set; } = "";
    public DateTime JoinedAt { get; set; }
    public DateTime LastConnected { get; set; }
}
