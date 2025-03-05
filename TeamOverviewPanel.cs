// Filename: TeamOverviewPanel.cs
// Displays the team members list with filtering options

using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;
using TMPro;

public class TeamOverviewPanel : MonoBehaviour
{
    public GameObject teamMemberPrefab;
    public Transform teamMembersContainer;
    public TMP_InputField searchInput;
    public TMP_Dropdown rankFilterDropdown;
    
    private TeamManagementSystem teamSystem;
    private List<TeamMember> allMembers = new List<TeamMember>();
    
    void Start()
    {
        teamSystem = TeamManagementSystem.Instance;
        
        // Set up search functionality
        searchInput.onValueChanged.AddListener(FilterMembers);
        
        // Set up rank filter
        SetupRankFilter();
        rankFilterDropdown.onValueChanged.AddListener(delegate { FilterMembers(searchInput.text); });
        
        RefreshTeamList();
    }
    
    private void SetupRankFilter()
    {
        rankFilterDropdown.ClearOptions();
        
        List<string> options = new List<string>
        {
            "All Ranks",
            "Owner",
            "Co-Owner",
            "Developer",
            "Admin",
            "Jr-Admin",
            "Moderator",
            "Jr-Moderator",
            "Supporter",
            "Jr-Supporter",
            "Sr-Builder",
            "Builder",
            "Member"
        };
        
        rankFilterDropdown.AddOptions(options);
    }
    
    public void RefreshTeamList()
    {
        allMembers = teamSystem.GetAllMembers();
        
        // Sort members by rank and points
        allMembers.Sort((a, b) => {
            // Define rank order
            Dictionary<string, int> rankOrder = new Dictionary<string, int>
            {
                {"Owner", 0},
                {"Co-Owner", 1},
                {"Developer", 2},
                {"Admin", 3},
                {"Jr-Admin", 4},
                {"Moderator", 5},
                {"Jr-Moderator", 6},
                {"Supporter", 7},
                {"Jr-Supporter", 8},
                {"Sr-Builder", 9},
                {"Builder", 10},
                {"Member", 11}
            };
            
            // Compare by rank first
            int rankComparison = rankOrder.GetValueOrDefault(a.rank, 999).CompareTo(rankOrder.GetValueOrDefault(b.rank, 999));
            if (rankComparison != 0)
                return rankComparison;
            
            // If same rank, compare by points (descending)
            return b.points.CompareTo(a.points);
        });
        
        FilterMembers(searchInput.text);
    }
    
    private void FilterMembers(string searchText)
    {
        // Clear existing members
        foreach (Transform child in teamMembersContainer)
        {
            Destroy(child.gameObject);
        }
        
        string searchLower = searchText.ToLower();
        string selectedRank = rankFilterDropdown.options[rankFilterDropdown.value].text;
        
        foreach (TeamMember member in allMembers)
        {
            // Apply search filter
            bool matchesSearch = string.IsNullOrEmpty(searchLower) || 
                                member.username.ToLower().Contains(searchLower) ||
                                member.rank.ToLower().Contains(searchLower);
            
            // Apply rank filter
            bool matchesRank = selectedRank == "All Ranks" || member.rank == selectedRank;
            
            if (matchesSearch && matchesRank)
            {
                CreateMemberCard(member);
            }
        }
    }
    
    private void CreateMemberCard(TeamMember member)
    {
        GameObject card = Instantiate(teamMemberPrefab, teamMembersContainer);
        
        // Set member data
        card.transform.Find("Username").GetComponent<TextMeshProUGUI>().text = member.username;
        
        TextMeshProUGUI rankText = card.transform.Find("Rank").GetComponent<TextMeshProUGUI>();
        rankText.text = member.rank;
        SetRankColor(rankText, member.rank);
        
        card.transform.Find("Points").GetComponent<TextMeshProUGUI>().text = $"Points: {member.points}";
        card.transform.Find("DeathPoints").GetComponent<TextMeshProUGUI>().text = $"Death Points: {member.deathPoints}";
        
        // Set mood indicator
        card.transform.Find("MoodIndicator").GetComponent<TextMeshProUGUI>().text = member.GetMoodIndicator();
        
        // Set up view profile button
        card.transform.Find("ViewProfileButton").GetComponent<Button>().onClick.AddListener(() => {
            teamSystem.ShowUserProfile(member.id);
        });
        
        // Set avatar image (in a real implementation, you would load the Minecraft skin)
        // For now, we'll just use a placeholder
        Image avatarImage = card.transform.Find("Avatar").GetComponent<Image>();
        // You would load the actual avatar here using the Minecraft API
        // Example: https://mc-heads.net/avatar/{username}/64
    }
    
    private void SetRankColor(TextMeshProUGUI text, string rank)
    {
        switch (rank)
        {
            case "Owner":
                text.color = new Color(0.2f, 0.8f, 1f); // Light blue
                break;
            case "Co-Owner":
                text.color = new Color(1f, 0.84f, 0f); // Gold
                break;
            case "Developer":
                text.color = new Color(0.55f, 0f, 1f); // Purple
                break;
            case "Admin":
                text.color = new Color(1f, 0.2f, 0.2f); // Red
                break;
            case "Jr-Admin":
                text.color = new Color(1f, 0.5f, 0.5f); // Light red
                break;
            case "Moderator":
                text.color = new Color(0.2f, 0.8f, 0.2f); // Green
                break;
            case "Jr-Moderator":
                text.color = new Color(0.5f, 0.8f, 0.5f); // Light green
                break;
            case "Supporter":
                text.color = new Color(0.2f, 0.6f, 1f); // Blue
                break;
            case "Jr-Supporter":
                text.color = new Color(0.5f, 0.7f, 1f); // Light blue
                break;
            case "Sr-Builder":
                text.color = new Color(1f, 0.6f, 0.2f); // Orange
                break;
            case "Builder":
                text.color = new Color(1f, 0.8f, 0.4f); // Light orange
                break;
            default:
                text.color = Color.white;
                break;
        }
    }
}
