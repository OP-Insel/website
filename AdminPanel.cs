// File: AdminPanel.cs
// Handles the admin panel for user management

using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System.Collections.Generic;

public class AdminPanel : MonoBehaviour
{
    [Header("User Management")]
    public GameObject userListPanel;
    public GameObject userItemPrefab;
    public Transform userListContainer;
    public TMP_InputField userSearchInput;
    
    [Header("Add User")]
    public GameObject addUserPanel;
    public TMP_InputField usernameInput;
    public TMP_InputField emailInput;
    public TMP_InputField passwordInput;
    public TMP_Dropdown rankDropdown;
    public TMP_InputField pointsInput;
    public Button addUserButton;
    public TextMeshProUGUI addUserStatusText;
    
    [Header("Navigation")]
    public Button showAddUserButton;
    public Button showUserListButton;
    
    private TeamManagementSystem teamSystem;
    
    void Start()
    {
        teamSystem = TeamManagementSystem.Instance;
        
        // Set up search
        userSearchInput.onValueChanged.AddListener(FilterUsers);
        
        // Set up navigation
        showAddUserButton.onClick.AddListener(() => {
            userListPanel.SetActive(false);
            addUserPanel.SetActive(true);
            addUserStatusText.text = "";
        });
        
        showUserListButton.onClick.AddListener(() => {
            userListPanel.SetActive(true);
            addUserPanel.SetActive(false);
        });
        
        // Set up add user button
        addUserButton.onClick.AddListener(AddUser);
        
        // Set up rank dropdown
        SetupRankDropdown();
        
        // Start with user list
        userListPanel.SetActive(true);
        addUserPanel.SetActive(false);
        addUserStatusText.text = "";
        
        RefreshPanel();
    }
    
    private void SetupRankDropdown()
    {
        rankDropdown.ClearOptions();
        
        List<string> options = new List<string>
        {
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
        
        rankDropdown.AddOptions(options);
        rankDropdown.value = options.Count - 1; // Default to Member
    }
    
    public void RefreshPanel()
    {
        FilterUsers(userSearchInput.text);
    }
    
    private void FilterUsers(string searchText)
    {
        // Clear existing users
        foreach (Transform child in userListContainer)
        {
            Destroy(child.gameObject);
        }
        
        List<TeamMember> allMembers = teamSystem.GetAllMembers();
        string searchLower = searchText.ToLower();
        
        foreach (TeamMember member in allMembers)
        {
            // Apply search filter
            bool matchesSearch = string.IsNullOrEmpty(searchLower) || 
                                member.username.ToLower().Contains(searchLower) ||
                                member.email.ToLower().Contains(searchLower) ||
                                member.rank.ToLower().Contains(searchLower);
            
            if (matchesSearch)
            {
                CreateUserItem(member);
            }
        }
    }
    
    private void CreateUserItem(TeamMember member)
    {
        GameObject item = Instantiate(userItemPrefab, userListContainer);
        
        // Set user data
        item.transform.Find("Username").GetComponent<TextMeshProUGUI>().text = member.username;
        item.transform.Find("Email").GetComponent<TextMeshProUGUI>().text = member.email;
        
        TextMeshProUGUI rankText = item.transform.Find("Rank").GetComponent<TextMeshProUGUI>();
        rankText.text = member.rank;
        SetRankColor(rankText, member.rank);
        
        item.transform.Find("Points").GetComponent<TextMeshProUGUI>().text = $"Points: {member.points}";
        item.transform.Find("DeathPoints").GetComponent<TextMeshProUGUI>().text = $"Death Points: {member.deathPoints}";
        item.transform.Find("MoodIndicator").GetComponent<TextMeshProUGUI>().text = member.GetMoodIndicator();
        
        // Set up edit button
        item.transform.Find("EditButton").GetComponent<Button>().onClick.AddListener(() => {
            teamSystem.ShowUserProfile(member.id);
        });
        
        // Set up delete button
        Button deleteButton = item.transform.Find("DeleteButton").GetComponent<Button>();
        
        // Only show delete button if not viewing self and not Owner
        TeamMember currentUser = teamSystem.GetCurrentUser();
        if (member.id == currentUser.id || member.rank == "Owner")
        {
            deleteButton.gameObject.SetActive(false);
        }
        else
        {
            deleteButton.onClick.AddListener(() => {
                DeleteUser(member.id);
            });
        }
    }
    
    private void AddUser()
    {
        string username = usernameInput.text.Trim();
        string email = emailInput.text.Trim();
        string password = passwordInput.text;
        string rank = rankDropdown.options[rankDropdown.value].text;
        int points;
        
        // Validate inputs
        if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
        {
            addUserStatusText.text = "Please fill in all required fields.";
            addUserStatusText.color = Color.red;
            return;
        }
        
        if (!int.TryParse(pointsInput.text, out points))
        {
            addUserStatusText.text = "Points must be a valid number.";
            addUserStatusText.color = Color.red;
            return;
        }
        
        bool success = teamSystem.AddTeamMember(username, email, password, rank, points);
        
        if (success)
        {
            addUserStatusText.text = "User added successfully!";
            addUserStatusText.color = Color.green;
            
            // Clear fields
            usernameInput.text = "";
            emailInput.text = "";
            passwordInput.text = "";
            rankDropdown.value = rankDropdown.options.Count - 1; // Reset to Member
            pointsInput.text = "0";
            
            // Refresh user list
            RefreshPanel();
        }
        else
        {
            addUserStatusText.text = "Failed to add user. Username or email already exists.";
            addUserStatusText.color = Color.red;
        }
    }
    
    private void DeleteUser(string userId)
    {
        // Confirm deletion
        if (!UnityEngine.Application.isMobilePlatform)
        {
            // On non-mobile platforms, use a confirmation dialog
            if (!UnityEngine.Windows.Dialog.Confirm("Delete User", "Are you sure you want to delete this user?"))
            {
                return;
            }
        }
        else
        {
            // On mobile, we'd need a custom dialog
            // For this example, we'll just proceed with deletion
        }
        
        bool success = teamSystem.DeleteTeamMember(userId);
        
        if (success)
        {
            RefreshPanel();
        }
        else
        {
            Debug.LogError("Failed to delete user. Check permissions.");
        }
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
