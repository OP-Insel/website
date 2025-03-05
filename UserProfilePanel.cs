// File: UserProfilePanel.cs
// Handles user profile viewing and editing

using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System.Collections.Generic;
using System;

public class UserProfilePanel : MonoBehaviour
{
    [Header("User Info")]
    public TextMeshProUGUI usernameText;
    public TextMeshProUGUI rankText;
    public TextMeshProUGUI pointsText;
    public TextMeshProUGUI deathPointsText;
    public TextMeshProUGUI joinDateText;
    public TextMeshProUGUI lastActiveText;
    public TextMeshProUGUI moodIndicatorText;
    public Image avatarImage;
    
    [Header("Edit Fields")]
    public GameObject editPanel;
    public TMP_InputField usernameInput;
    public TMP_Dropdown rankDropdown;
    public TMP_InputField pointsInput;
    public TMP_InputField deathPointsInput;
    public Button saveButton;
    public Button cancelButton;
    public TextMeshProUGUI editStatusText;
    
    [Header("Violation History")]
    public GameObject violationHistoryPanel;
    public GameObject violationItemPrefab;
    public Transform violationContainer;
    public Button addViolationButton;
    public GameObject addViolationPanel;
    public TMP_Dropdown violationTypeDropdown;
    public Button confirmViolationButton;
    public Button cancelViolationButton;
    
    [Header("Projects")]
    public GameObject projectsPanel;
    public GameObject projectItemPrefab;
    public Transform projectsContainer;
    
    [Header("Death Points")]
    public Button addDeathPointButton;
    public Button resetDeathPointsButton;
    public TMP_InputField deathPointsToAddInput;
    
    [Header("Navigation")]
    public Button editButton;
    public Button backButton;
    public Button violationHistoryButton;
    public Button projectsButton;
    
    private TeamManagementSystem teamSystem;
    private TeamMember displayedUser;
    private TeamMember currentUser;
    
    void Start()
    {
        teamSystem = TeamManagementSystem.Instance;
        
        // Set up buttons
        editButton.onClick.AddListener(ShowEditPanel);
        backButton.onClick.AddListener(() => teamSystem.ShowTeamOverview());
        saveButton.onClick.AddListener(SaveChanges);
        cancelButton.onClick.AddListener(HideEditPanel);
        violationHistoryButton.onClick.AddListener(ToggleViolationHistory);
        projectsButton.onClick.AddListener(ToggleProjects);
        
        // Set up violation panel
        addViolationButton.onClick.AddListener(ShowAddViolationPanel);
        confirmViolationButton.onClick.AddListener(AddViolation);
        cancelViolationButton.onClick.AddListener(HideAddViolationPanel);
        
        // Set up death points buttons
        addDeathPointButton.onClick.AddListener(AddDeathPoints);
        resetDeathPointsButton.onClick.AddListener(ResetDeathPoints);
        
        // Hide panels initially
        editPanel.SetActive(false);
        violationHistoryPanel.SetActive(false);
        addViolationPanel.SetActive(false);
        projectsPanel.SetActive(false);
        editStatusText.text = "";
        
        // Set up rank dropdown
        SetupRankDropdown();
        
        // Set up violation type dropdown
        SetupViolationTypeDropdown();
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
    }
    
    private void SetupViolationTypeDropdown()
    {
        violationTypeDropdown.ClearOptions();
        
        List<string> options = new List<string>
        {
            "Ban ohne Begründung",
            "Unfaire oder ungerechtfertigte Strafe",
            "Missbrauch der Admin-Rechte",
            "Beleidigung oder schlechtes Verhalten",
            "Inaktiv ohne Abmeldung",
            "Wiederholtes Fehlverhalten",
            "Spamming",
            "Schwere Regelverstöße"
        };
        
        violationTypeDropdown.AddOptions(options);
    }
    
    public void SetupProfile(TeamMember user, TeamMember viewer)
    {
        displayedUser = user;
        currentUser = viewer;
        
        // Set user info
        usernameText.text = user.username;
        rankText.text = user.rank;
        SetRankColor(rankText, user.rank);
        pointsText.text = $"Points: {user.points}";
        deathPointsText.text = $"Death Points: {user.deathPoints}";
        joinDateText.text = $"Joined: {user.joinDate.ToShortDateString()}";
        lastActiveText.text = $"Last Active: {user.lastActive.ToShortDateString()}";
        moodIndicatorText.text = user.GetMoodIndicator();
        
        // Set avatar image (in a real implementation, you would load the Minecraft skin)
        // For now, we'll just use a placeholder
        
        // Show/hide edit button based on permissions
        bool canEdit = viewer.HasPermission("editUsers") || viewer.id == user.id;
        editButton.gameObject.SetActive(canEdit);
        
        // Show/hide violation history button based on permissions
        violationHistoryButton.gameObject.SetActive(viewer.HasPermission("editUsers"));
        
        // Show/hide death points buttons based on permissions
        bool canEditDeathPoints = viewer.HasPermission("editDeathPoints");
        addDeathPointButton.gameObject.SetActive(canEditDeathPoints);
        resetDeathPointsButton.gameObject.SetActive(canEditDeathPoints);
        deathPointsToAddInput.gameObject.SetActive(canEditDeathPoints);
        
        // Load projects
        LoadProjects();
    }
    
    private void ShowEditPanel()
    {
        usernameInput.text = displayedUser.username;
        
        // Set rank dropdown
        int rankIndex = rankDropdown.options.FindIndex(option => option.text == displayedUser.rank);
        rankDropdown.value = rankIndex >= 0 ? rankIndex : 0;
        
        pointsInput.text = displayedUser.points.ToString();
        deathPointsInput.text = displayedUser.deathPoints.ToString();
        
        // Only Owner/Co-Owner can edit rank and points
        bool isAdmin = currentUser.HasPermission("editUsers");
        rankDropdown.interactable = isAdmin;
        pointsInput.interactable = isAdmin;
        deathPointsInput.interactable = isAdmin;
        
        // Owner rank can't be changed in dropdown
        if (displayedUser.rank == "Owner")
        {
            rankDropdown.interactable = false;
        }
        
        editPanel.SetActive(true);
        editStatusText.text = "";
    }
    
    private void HideEditPanel()
    {
        editPanel.SetActive(false);
    }
    
    private void SaveChanges()
    {
        // Create updated user
        TeamMember updatedUser = new TeamMember(
            usernameInput.text,
            displayedUser.email,
            displayedUser.password,
            rankDropdown.options[rankDropdown.value].text,
            int.Parse(pointsInput.text)
        );
        
        // Copy over other properties
        updatedUser.id = displayedUser.id;
        updatedUser.joinDate = displayedUser.joinDate;
        updatedUser.lastActive = displayedUser.lastActive;
        updatedUser.violationHistory = displayedUser.violationHistory;
        updatedUser.assignedProjects = displayedUser.assignedProjects;
        updatedUser.deathPoints = int.Parse(deathPointsInput.text);
        
        bool success = teamSystem.UpdateTeamMember(updatedUser);
        
        if (success)
        {
            editStatusText.text = "Changes saved successfully!";
            editStatusText.color = Color.green;
            
            // Refresh displayed user
            displayedUser = teamSystem.GetMemberById(displayedUser.id);
            if (displayedUser != null)
            {
                SetupProfile(displayedUser, currentUser);
            }
            else
            {
                // User was removed (e.g., due to points)
                teamSystem.ShowTeamOverview();
                return;
            }
            
            // Hide edit panel after a delay
            Invoke("HideEditPanel", 1.5f);
        }
        else
        {
            editStatusText.text = "Failed to save changes. Check permissions.";
            editStatusText.color = Color.red;
        }
    }
    
    private void ToggleViolationHistory()
    {
        bool isActive = violationHistoryPanel.activeSelf;
        violationHistoryPanel.SetActive(!isActive);
        
        if (!isActive)
        {
            LoadViolationHistory();
        }
    }
    
    private void LoadViolationHistory()
    {
        // Clear existing items
        foreach (Transform child in violationContainer)
        {
            Destroy(child.gameObject);
        }
        
        // Add violation history items
        foreach (ViolationRecord violation in displayedUser.violationHistory)
        {
            GameObject item = Instantiate(violationItemPrefab, violationContainer);
            
            item.transform.Find("Date").GetComponent<TextMeshProUGUI>().text = 
                violation.date.ToShortDateString();
            
            item.transform.Find("Type").GetComponent<TextMeshProUGUI>().text = 
                violation.violationType;
            
            item.transform.Find("Points").GetComponent<TextMeshProUGUI>().text = 
                violation.pointDeduction.ToString();
            
            item.transform.Find("Admin").GetComponent<TextMeshProUGUI>().text = 
                violation.adminName;
        }
        
        // Show "No violations" message if empty
        if (displayedUser.violationHistory.Count == 0)
        {
            GameObject item = Instantiate(violationItemPrefab, violationContainer);
            item.transform.Find("Type").GetComponent<TextMeshProUGUI>().text = "No violations recorded";
            item.transform.Find("Date").GetComponent<TextMeshProUGUI>().text = "";
            item.transform.Find("Points").GetComponent<TextMeshProUGUI>().text = "";
            item.transform.Find("Admin").GetComponent<TextMeshProUGUI>().text = "";
        }
    }
    
    private void ShowAddViolationPanel()
    {
        addViolationPanel.SetActive(true);
    }
    
    private void HideAddViolationPanel()
    {
        addViolationPanel.SetActive(false);
    }
    
    private void AddViolation()
    {
        string violationType = violationTypeDropdown.options[violationTypeDropdown.value].text;
        
        bool success = teamSystem.ApplyViolation(
            displayedUser.id, 
            violationType, 
            currentUser.username
        );
        
        if (success)
        {
            // Refresh displayed user
            displayedUser = teamSystem.GetMemberById(displayedUser.id);
            if (displayedUser != null)
            {
                SetupProfile(displayedUser, currentUser);
                LoadViolationHistory();
            }
            else
            {
                // User was removed (e.g., due to points)
                teamSystem.ShowTeamOverview();
                return;
            }
        }
        
        HideAddViolationPanel();
    }
    
    private void AddDeathPoints()
    {
        if (!int.TryParse(deathPointsToAddInput.text, out int pointsToAdd) || pointsToAdd <= 0)
        {
            teamSystem.ShowNotification("Please enter a valid number of death points to add");
            return;
        }
        
        bool success = teamSystem.AddDeathPoints(displayedUser.id, pointsToAdd);
        
        if (success)
        {
            // Refresh displayed user
            displayedUser = teamSystem.GetMemberById(displayedUser.id);
            if (displayedUser != null)
            {
                SetupProfile(displayedUser, currentUser);
                deathPointsToAddInput.text = "";
            }
        }
    }
    
    private void ResetDeathPoints()
    {
        bool success = teamSystem.ResetDeathPoints(displayedUser.id);
        
        if (success)
        {
            // Refresh displayed user
            displayedUser = teamSystem.GetMemberById(displayedUser.id);
            if (displayedUser != null)
            {
                SetupProfile(displayedUser, currentUser);
            }
        }
    }
    
    private void ToggleProjects()
    {
        bool isActive = projectsPanel.activeSelf;
        projectsPanel.SetActive(!isActive);
        
        if (!isActive)
        {
            LoadProjects();
        }
    }
    
    private void LoadProjects()
    {
        // Clear existing items
        foreach (Transform child in projectsContainer)
        {
            Destroy(child.gameObject);
        }
        
        // Get projects for this user
        List<Project> userProjects = teamSystem.GetProjectsForMember(displayedUser.id);
        
        // Add project items
        foreach (Project project in userProjects)
        {
            GameObject item = Instantiate(projectItemPrefab, projectsContainer);
            
            item.transform.Find("Name").GetComponent<TextMeshProUGUI>().text = project.name;
            
            string deadlineText = project.deadline.ToShortDateString();
            if (project.completed)
            {
                deadlineText += " (Completed)";
                item.transform.Find("Deadline").GetComponent<TextMeshProUGUI>().color = Color.green;
            }
            else if (DateTime.Now > project.deadline)
            {
                deadlineText += " (Overdue)";
                item.transform.Find("Deadline").GetComponent<TextMeshProUGUI>().color = Color.red;
            }
            
            item.transform.Find("Deadline").GetComponent<TextMeshProUGUI>().text = deadlineText;
            item.transform.Find("Description").GetComponent<TextMeshProUGUI>().text = project.description;
        }
        
        // Show "No projects" message if empty
        if (userProjects.Count == 0)
        {
            GameObject item = Instantiate(projectItemPrefab, projectsContainer);
            item.transform.Find("Name").GetComponent<TextMeshProUGUI>().text = "No assigned projects";
            item.transform.Find("Deadline").GetComponent<TextMeshProUGUI>().text = "";
            item.transform.Find("Description").GetComponent<TextMeshProUGUI>().text = "";
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
                text.color =  0.2f, 0.2f); // Red
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
