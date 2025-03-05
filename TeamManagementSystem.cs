// Filename: TeamManagementSystem.cs
// Core system for Minecraft team management

using UnityEngine;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using UnityEngine.UI;

[System.Serializable]
public class TeamMember
{
    public string id;
    public string username;
    public string email;
    public string password;
    public string rank;
    public int points;
    public DateTime joinDate;
    public DateTime lastActive;
    public List<ViolationRecord> violationHistory = new List<ViolationRecord>();
    public List<string> assignedProjects = new List<string>();
    public int deathPoints;
    public Dictionary<string, bool> permissions = new Dictionary<string, bool>();
    
    // Constructor
    public TeamMember(string username, string email, string password, string rank, int points)
    {
        this.id = Guid.NewGuid().ToString();
        this.username = username;
        this.email = email;
        this.password = password;
        this.rank = rank;
        this.points = points;
        this.joinDate = DateTime.Now;
        this.lastActive = DateTime.Now;
        this.deathPoints = 0;
        InitializePermissions();
    }
    
    private void InitializePermissions()
    {
        // Default permissions
        permissions["viewTeam"] = true;
        
        // Rank-specific permissions
        switch (rank)
        {
            case "Owner":
                permissions["editUsers"] = true;
                permissions["deleteUsers"] = true;
                permissions["assignRanks"] = true;
                permissions["manageProjects"] = true;
                permissions["manageSchedule"] = true;
                permissions["resetPoints"] = true;
                break;
            case "Co-Owner":
                permissions["editUsers"] = true;
                permissions["deleteUsers"] = true;
                permissions["assignRanks"] = true;
                permissions["manageProjects"] = true;
                permissions["manageSchedule"] = true;
                permissions["resetPoints"] = true;
                break;
            case "Admin":
                permissions["manageProjects"] = true;
                permissions["manageSchedule"] = true;
                break;
            case "Jr-Admin":
                permissions["manageProjects"] = true;
                break;
            default:
                break;
        }
    }
    
    public void UpdatePermissions()
    {
        InitializePermissions();
    }
    
    public bool HasPermission(string permission)
    {
        return permissions.ContainsKey(permission) && permissions[permission];
    }
    
    // Get mood indicator based on points and rank threshold
    public string GetMoodIndicator()
    {
        int threshold = TeamManagementSystem.GetRankThreshold(rank);
        int nextLowerThreshold = TeamManagementSystem.GetNextLowerRankThreshold(rank);
        
        if (points <= 0)
            return "😡"; // Angry - about to be removed
            
        float percentage = (float)(points - nextLowerThreshold) / (threshold - nextLowerThreshold);
        
        if (percentage >= 0.9f)
            return "😄"; // Very happy - far from degradation
        else if (percentage >= 0.7f)
            return "🙂"; // Happy
        else if (percentage >= 0.5f)
            return "😐"; // Neutral
        else if (percentage >= 0.3f)
            return "😕"; // Concerned
        else
            return "😟"; // Worried - close to degradation
    }
}

[System.Serializable]
public class ViolationRecord
{
    public string violationType;
    public int pointDeduction;
    public DateTime date;
    public string adminName;
    
    public ViolationRecord(string violationType, int pointDeduction, string adminName)
    {
        this.violationType = violationType;
        this.pointDeduction = pointDeduction;
        this.date = DateTime.Now;
        this.adminName = adminName;
    }
}

[System.Serializable]
public class Project
{
    public string id;
    public string name;
    public string description;
    public DateTime deadline;
    public List<string> assignedMembers = new List<string>();
    public bool completed;
    
    public Project(string name, string description, DateTime deadline)
    {
        this.id = Guid.NewGuid().ToString();
        this.name = name;
        this.description = description;
        this.deadline = deadline;
        this.completed = false;
    }
}

[System.Serializable]
public class ScheduleEvent
{
    public string id;
    public string title;
    public string description;
    public DateTime startTime;
    public DateTime endTime;
    public List<string> participants = new List<string>();
    
    public ScheduleEvent(string title, string description, DateTime startTime, DateTime endTime)
    {
        this.id = Guid.NewGuid().ToString();
        this.title = title;
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

[System.Serializable]
public class TeamData
{
    public List<TeamMember> members = new List<TeamMember>();
    public List<Project> projects = new List<Project>();
    public List<ScheduleEvent> events = new List<ScheduleEvent>();
    public DateTime lastMonthlyReset;
}

public class TeamManagementSystem : MonoBehaviour
{
    private static TeamManagementSystem _instance;
    public static TeamManagementSystem Instance
    {
        get { return _instance; }
    }
    
    // UI References
    public GameObject loginPanel;
    public GameObject mainPanel;
    public GameObject teamOverviewPanel;
    public GameObject adminPanel;
    public GameObject userProfilePanel;
    public GameObject projectsPanel;
    public GameObject schedulePanel;
    
    // Notification system
    public GameObject notificationPrefab;
    public Transform notificationContainer;
    
    // Current logged in user
    private TeamMember currentUser;
    
    // Team data
    private TeamData teamData = new TeamData();
    
    // Rule violations and their point deductions
    private static Dictionary<string, int> ruleViolations = new Dictionary<string, int>()
    {
        {"Ban ohne Begründung", -5},
        {"Unfaire oder ungerechtfertigte Strafe", -10},
        {"Missbrauch der Admin-Rechte", -20},
        {"Beleidigung oder schlechtes Verhalten", -15},
        {"Inaktiv ohne Abmeldung", -10},
        {"Wiederholtes Fehlverhalten", -30},
        {"Spamming", -5},
        {"Schwere Regelverstöße", -20}
    };
    
    // Rank degradation thresholds
    private static Dictionary<string, int> rankThresholds = new Dictionary<string, int>()
    {
        {"Owner", int.MaxValue},
        {"Co-Owner", 750},
        {"Developer", 250},
        {"Admin", 500},
        {"Jr-Admin", 400},
        {"Moderator", 300},
        {"Jr-Moderator", 250},
        {"Supporter", 200},
        {"Jr-Supporter", 150},
        {"Sr-Builder", 300},
        {"Builder", 200},
        {"Member", 100}
    };
    
    // Rank degradation paths
    private static Dictionary<string, string> degradationPaths = new Dictionary<string, string>()
    {
        {"Co-Owner", "Admin"},
        {"Admin", "Jr-Admin"},
        {"Jr-Admin", "Moderator"},
        {"Moderator", "Jr-Moderator"},
        {"Jr-Moderator", "Supporter"},
        {"Supporter", "Jr-Supporter"},
        {"Jr-Supporter", "Member"},
        {"Sr-Builder", "Builder"},
        {"Builder", "Member"},
        {"Developer", "Member"},
        {"Member", "Removed"}
    };
    
    // File path for saving data
    private string dataPath;
    
    void Awake()
    {
        if (_instance != null && _instance != this)
        {
            Destroy(gameObject);
            return;
        }
        
        _instance = this;
        DontDestroyOnLoad(gameObject);
        
        dataPath = Path.Combine(Application.persistentDataPath, "teamData.json");
        
        LoadData();
        
        // Initialize if no data exists
        if (teamData.members.Count == 0)
        {
            InitializeDefaultData();
        }
        
        teamData.lastMonthlyReset = teamData.lastMonthlyReset == default(DateTime) ? 
            DateTime.Now : teamData.lastMonthlyReset;
    }
    
    void Start()
    {
        ShowLoginPanel();
        
        // Start periodic checks
        InvokeRepeating("CheckMonthlyReset", 0f, 3600f); // Check every hour
        InvokeRepeating("CheckInactivity", 0f, 86400f); // Check every day
        InvokeRepeating("CheckProjectDeadlines", 0f, 3600f); // Check every hour
        
        // Auto-save every 5 minutes
        InvokeRepeating("SaveData", 300f, 300f);
    }
    
    void OnApplicationQuit()
    {
        SaveData();
    }
    
    #region Data Management
    
    private void InitializeDefaultData()
    {
        // Create default Owner account
        TeamMember owner = new TeamMember("Owner", "owner@example.com", "password123", "Owner", int.MaxValue);
        teamData.members.Add(owner);
        
        // Create default Co-Owner account
        TeamMember coOwner = new TeamMember("CoOwner", "coowner@example.com", "password123", "Co-Owner", 750);
        teamData.members.Add(coOwner);
        
        // Create default Admin account
        TeamMember admin = new TeamMember("Admin", "admin@example.com", "password123", "Admin", 500);
        teamData.members.Add(admin);
        
        // Create default Moderator account
        TeamMember mod = new TeamMember("Moderator", "mod@example.com", "password123", "Moderator", 300);
        teamData.members.Add(mod);
        
        // Create default Builder account
        TeamMember builder = new TeamMember("Builder", "builder@example.com", "password123", "Builder", 200);
        teamData.members.Add(builder);
        
        teamData.lastMonthlyReset = DateTime.Now;
        
        // Create a sample project
        Project sampleProject = new Project(
            "Server Spawn", 
            "Build a new spawn area for the Minecraft server", 
            DateTime.Now.AddDays(14)
        );
        sampleProject.assignedMembers.Add(builder.id);
        teamData.projects.Add(sampleProject);
        
        // Create a sample event
        ScheduleEvent sampleEvent = new ScheduleEvent(
            "Team Meeting",
            "Weekly team meeting to discuss progress",
            DateTime.Now.AddDays(7).Date.AddHours(18),
            DateTime.Now.AddDays(7).Date.AddHours(19)
        );
        sampleEvent.participants.Add(owner.id);
        sampleEvent.participants.Add(coOwner.id);
        sampleEvent.participants.Add(admin.id);
        teamData.events.Add(sampleEvent);
        
        SaveData();
    }
    
    public void SaveData()
    {
        try
        {
            string json = JsonUtility.ToJson(teamData, true);
            File.WriteAllText(dataPath, json);
            Debug.Log("Team data saved successfully");
        }
        catch (Exception e)
        {
            Debug.LogError("Error saving team data: " + e.Message);
            ShowNotification("Error saving data: " + e.Message, true);
        }
    }
    
    private void LoadData()
    {
        try
        {
            if (File.Exists(dataPath))
            {
                string json = File.ReadAllText(dataPath);
                teamData = JsonUtility.FromJson<TeamData>(json);
                Debug.Log("Team data loaded successfully");
            }
        }
        catch (Exception e)
        {
            Debug.LogError("Error loading team data: " + e.Message);
            teamData = new TeamData();
            ShowNotification("Error loading data. Starting with fresh data.", true);
        }
    }
    
    #endregion
    
    #region Authentication
    
    public bool Login(string email, string password)
    {
        TeamMember user = teamData.members.Find(m => m.email == email && m.password == password);
        
        if (user != null)
        {
            currentUser = user;
            currentUser.lastActive = DateTime.Now;
            SaveData();
            
            ShowMainPanel();
            ShowNotification("Welcome back, " + user.username + "!");
            return true;
        }
        
        return false;
    }
    
    public bool Register(string username, string email, string password)
    {
        // Check if email already exists
        if (teamData.members.Exists(m => m.email == email))
        {
            return false;
        }
        
        // Check if username already exists
        if (teamData.members.Exists(m => m.username == username))
        {
            return false;
        }
        
        // Create new user with Member rank
        TeamMember newUser = new TeamMember(username, email, password, "Member", 100);
        teamData.members.Add(newUser);
        SaveData();
        
        ShowNotification("Registration successful! You can now login.");
        return true;
    }
    
    public void Logout()
    {
        currentUser = null;
        ShowLoginPanel();
        ShowNotification("You have been logged out.");
    }
    
    #endregion
    
    #region UI Management
    
    private void ShowLoginPanel()
    {
        loginPanel.SetActive(true);
        mainPanel.SetActive(false);
        teamOverviewPanel.SetActive(false);
        adminPanel.SetActive(false);
        userProfilePanel.SetActive(false);
        projectsPanel.SetActive(false);
        schedulePanel.SetActive(false);
    }
    
    private void ShowMainPanel()
    {
        loginPanel.SetActive(false);
        mainPanel.SetActive(true);
        teamOverviewPanel.SetActive(true);
        adminPanel.SetActive(currentUser.HasPermission("editUsers"));
        userProfilePanel.SetActive(false);
        projectsPanel.SetActive(false);
        schedulePanel.SetActive(false);
        
        // Refresh UI
        RefreshTeamOverview();
    }
    
    public void ShowUserProfile(string userId)
    {
        TeamMember user = teamData.members.Find(m => m.id == userId);
        if (user != null)
        {
            // Set up user profile panel with user data
            // This would be implemented in the UserProfilePanel script
            userProfilePanel.GetComponent<UserProfilePanel>().SetupProfile(user, currentUser);
            
            teamOverviewPanel.SetActive(false);
            adminPanel.SetActive(false);
            userProfilePanel.SetActive(true);
            projectsPanel.SetActive(false);
            schedulePanel.SetActive(false);
        }
    }
    
    public void ShowTeamOverview()
    {
        teamOverviewPanel.SetActive(true);
        adminPanel.SetActive(false);
        userProfilePanel.SetActive(false);
        projectsPanel.SetActive(false);
        schedulePanel.SetActive(false);
        
        RefreshTeamOverview();
    }
    
    public void ShowAdminPanel()
    {
        if (currentUser.HasPermission("editUsers"))
        {
            teamOverviewPanel.SetActive(false);
            adminPanel.SetActive(true);
            userProfilePanel.SetActive(false);
            projectsPanel.SetActive(false);
            schedulePanel.SetActive(false);
            
            // Refresh admin panel
            adminPanel.GetComponent<AdminPanel>().RefreshPanel();
        }
        else
        {
            ShowNotification("You don't have permission to access the admin panel.", true);
        }
    }
    
    public void ShowProjectsPanel()
    {
        teamOverviewPanel.SetActive(false);
        adminPanel.SetActive(false);
        userProfilePanel.SetActive(false);
        projectsPanel.SetActive(true);
        schedulePanel.SetActive(false);
        
        // Refresh projects panel
        projectsPanel.GetComponent<ProjectsPanel>().RefreshProjects();
    }
    
    public void ShowSchedulePanel()
    {
        teamOverviewPanel.SetActive(false);
        adminPanel.SetActive(false);
        userProfilePanel.SetActive(false);
        projectsPanel.SetActive(false);
        schedulePanel.SetActive(true);
        
        // Refresh schedule panel
        schedulePanel.GetComponent<SchedulePanel>().RefreshSchedule();
    }
    
    private void RefreshTeamOverview()
    {
        // This would be implemented in the TeamOverviewPanel script
        teamOverviewPanel.GetComponent<TeamOverviewPanel>().RefreshTeamList();
    }
    
    public void ShowNotification(string message, bool isError = false)
    {
        if (notificationPrefab == null || notificationContainer == null)
        {
            Debug.LogWarning("Notification system not set up properly");
            return;
        }
        
        GameObject notification = Instantiate(notificationPrefab, notificationContainer);
        NotificationItem notificationItem = notification.GetComponent<NotificationItem>();
        
        if (notificationItem != null)
        {
            notificationItem.SetMessage(message, isError);
        }
        else
        {
            // Fallback if NotificationItem component is missing
            TextMeshProUGUI text = notification.GetComponentInChildren<TextMeshProUGUI>();
            if (text != null)
            {
                text.text = message;
                if (isError)
                {
                    text.color = Color.red;
                }
            }
            
            // Auto-destroy after 3 seconds
            Destroy(notification, 3f);
        }
    }
    
    #endregion
    
    #region Team Management
    
    public List<TeamMember> GetAllMembers()
    {
        return teamData.members;
    }
    
    public TeamMember GetCurrentUser()
    {
        return currentUser;
    }
    
    public TeamMember GetMemberById(string id)
    {
        return teamData.members.Find(m => m.id == id);
    }
    
    public bool AddTeamMember(string username, string email, string password, string rank, int points)
    {
        // Check if user has permission
        if (!currentUser.HasPermission("editUsers"))
        {
            ShowNotification("You don't have permission to add users.", true);
            return false;
        }
        
        // Check if email already exists
        if (teamData.members.Exists(m => m.email == email))
        {
            ShowNotification("Email already in use.", true);
            return false;
        }
        
        // Check if username already exists
        if (teamData.members.Exists(m => m.username == username))
        {
            ShowNotification("Username already in use.", true);
            return false;
        }
        
        // Create new user
        TeamMember newUser = new TeamMember(username, email, password, rank, points);
        teamData.members.Add(newUser);
        SaveData();
        
        ShowNotification($"User {username} added successfully!");
        return true;
    }
    
    public bool UpdateTeamMember(TeamMember updatedMember)
    {
        // Check if user has permission
        bool isAdmin = currentUser.HasPermission("editUsers");
        bool isSelf = currentUser.id == updatedMember.id;
        
        if (!isAdmin && !isSelf)
        {
            ShowNotification("You don't have permission to update this user.", true);
            return false;
        }
        
        int index = teamData.members.FindIndex(m => m.id == updatedMember.id);
        if (index == -1)
        {
            ShowNotification("User not found.", true);
            return false;
        }
        
        TeamMember existingMember = teamData.members[index];
        
        // Only Owner can change Co-Owner rank
        if (existingMember.rank == "Co-Owner" && updatedMember.rank != "Co-Owner" && currentUser.rank != "Owner")
        {
            ShowNotification("Only the Owner can change a Co-Owner's rank.", true);
            return false;
        }
        
        // Only Owner can assign Co-Owner rank
        if (existingMember.rank != "Co-Owner" && updatedMember.rank == "Co-Owner" && currentUser.rank != "Owner")
        {
            ShowNotification("Only the Owner can assign the Co-Owner rank.", true);
            return false;
        }
        
        // Owner cannot be demoted
        if (existingMember.rank == "Owner" && updatedMember.rank != "Owner")
        {
            ShowNotification("The Owner's rank cannot be changed.", true);
            return false;
        }
        
        // If not admin, can only update username
        if (!isAdmin)
        {
            existingMember.username = updatedMember.username;
            ShowNotification("Username updated successfully!");
        }
        else
        {
            // Store old rank for notification
            string oldRank = existingMember.rank;
            
            // Admin can update everything
            existingMember.username = updatedMember.username;
            existingMember.rank = updatedMember.rank;
            existingMember.points = updatedMember.points;
            existingMember.deathPoints = updatedMember.deathPoints;
            
            // Update permissions based on new rank
            existingMember.UpdatePermissions();
            
            // Show appropriate notification
            if (oldRank != updatedMember.rank)
            {
                ShowNotification($"{existingMember.username} has been {(RankValue(oldRank) > RankValue(updatedMember.rank) ? "demoted to" : "promoted to")} {updatedMember.rank}!");
            }
            else
            {
                ShowNotification($"User {existingMember.username} updated successfully!");
            }
        }
        
        SaveData();
        return true;
    }
    
    private int RankValue(string rank)
    {
        Dictionary<string, int> rankValues = new Dictionary<string, int>
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
        
        return rankValues.ContainsKey(rank) ? rankValues[rank] : 999;
    }
    
    public bool DeleteTeamMember(string memberId)
    {
        // Check if user has permission
        if (!currentUser.HasPermission("deleteUsers"))
        {
            ShowNotification("You don't have permission to delete users.", true);
            return false;
        }
        
        TeamMember memberToDelete = teamData.members.Find(m => m.id == memberId);
        
        if (memberToDelete == null)
        {
            ShowNotification("User not found.", true);
            return false;
        }
        
        // Cannot delete Owner
        if (memberToDelete.rank == "Owner")
        {
            ShowNotification("The Owner cannot be deleted.", true);
            return false;
        }
        
        // Only Owner can delete Co-Owner
        if (memberToDelete.rank == "Co-Owner" && currentUser.rank != "Owner")
        {
            ShowNotification("Only the Owner can delete a Co-Owner.", true);
            return false;
        }
        
        // Cannot delete self
        if (memberToDelete.id == currentUser.id)
        {
            ShowNotification("You cannot delete yourself.", true);
            return false;
        }
        
        // Remove user from projects
        foreach (Project project in teamData.projects)
        {
            project.assignedMembers.Remove(memberId);
        }
        
        // Remove user from events
        foreach (ScheduleEvent evt in teamData.events)
        {
            evt.participants.Remove(memberId);
        }
        
        // Remove user
        string username = memberToDelete.username;
        teamData.members.Remove(memberToDelete);
        SaveData();
        
        ShowNotification($"User {username} has been deleted.");
        return true;
    }
    
    public bool ApplyViolation(string memberId, string violationType, string adminName)
    {
        // Check if user has permission
        if (!currentUser.HasPermission("editUsers"))
        {
            ShowNotification("You don't have permission to apply violations.", true);
            return false;
        }
        
        if (!ruleViolations.ContainsKey(violationType))
        {
            ShowNotification("Invalid violation type.", true);
            return false;
        }
        
        TeamMember member = teamData.members.Find(m => m.id == memberId);
        if (member == null)
        {
            ShowNotification("User not found.", true);
            return false;
        }
        
        // Owner cannot receive violations
        if (member.rank == "Owner")
        {
            ShowNotification("The Owner cannot receive violations.", true);
            return false;
        }
        
        int deduction = ruleViolations[violationType];
        member.points += deduction;
        
        // Add to violation history
        ViolationRecord violation = new ViolationRecord(violationType, deduction, adminName);
        member.violationHistory.Add(violation);
        
        ShowNotification($"Applied violation to {member.username}: {violationType} ({deduction} points)");
        
        // Check for automatic removal
        if (member.points <= 0)
        {
            // Don't remove Owner
            if (member.rank != "Owner")
            {
                string username = member.username;
                teamData.members.Remove(member);
                ShowNotification($"{username} has been removed from the team due to having 0 or fewer points!");
            }
            else
            {
                member.points = 1; // Minimum for Owner
            }
            
            SaveData();
            return true;
        }
        
        CheckForDegradation(member);
        SaveData();
        
        return true;
    }
    
    private void CheckForDegradation(TeamMember member)
    {
        if (member.rank == "Owner") return; // Owner can't be degraded
        
        int currentThreshold = GetRankThreshold(member.rank);
        if (member.points < currentThreshold)
        {
            string oldRank = member.rank;
            
            // Determine new rank based on degradation path
            string newRank = GetDegradedRank(member.rank);
            if (newRank != member.rank)
            {
                member.rank = newRank;
                member.UpdatePermissions();
                
                ShowNotification($"{member.username} has been demoted from {oldRank} to {newRank} due to low points!");
                
                // If removed, actually remove from team
                if (newRank == "Removed")
                {
                    string username = member.username;
                    teamData.members.Remove(member);
                    ShowNotification($"{username} has been removed from the team!");
                }
            }
        }
    }
    
    private static string GetDegradedRank(string currentRank)
    {
        if (degradationPaths.ContainsKey(currentRank))
        {
            return degradationPaths[currentRank];
        }
        
        return currentRank;
    }
    
    public static int GetRankThreshold(string rank)
    {
        if (rankThresholds.ContainsKey(rank))
        {
            return rankThresholds[rank];
        }
        
        return 0;
    }
    
    public static int GetNextLowerRankThreshold(string rank)
    {
        if (degradationPaths.ContainsKey(rank) && rankThresholds.ContainsKey(degradationPaths[rank]))
        {
            return rankThresholds[degradationPaths[rank]];
        }
        
        return 0;
    }
    
    private void CheckMonthlyReset()
    {
        if (DateTime.Now.Month != teamData.lastMonthlyReset.Month || 
            DateTime.Now.Year != teamData.lastMonthlyReset.Year)
        {
            ResetMonthlyPoints();
            teamData.lastMonthlyReset = DateTime.Now;
            SaveData();
            
            ShowNotification("Monthly points have been reset for all team members.");
        }
    }
    
    private void ResetMonthlyPoints()
    {
        foreach (TeamMember member in teamData.members)
        {
            // Store current rank before reset
            string currentRank = member.rank;
            
            // Reset points to rank threshold
            member.points = GetRankThreshold(currentRank);
            
            Debug.Log($"Monthly reset for {member.username}: Points reset to {member.points}");
        }
    }
    
    private void CheckInactivity()
    {
        foreach (TeamMember member in teamData.members.ToList()) // Use ToList to avoid collection modified exception
        {
            TimeSpan inactiveTime = DateTime.Now - member.lastActive;
            if (inactiveTime.TotalDays >= 14) // 2 weeks
            {
                ApplyViolation(member.id, "Inaktiv ohne Abmeldung", "System");
            }
        }
    }
    
    private void CheckProjectDeadlines()
    {
        foreach (Project project in teamData.projects)
        {
            if (!project.completed && DateTime.Now > project.deadline && 
                DateTime.Now.Date == project.deadline.Date) // Only notify on the exact day
            {
                ShowNotification($"Project deadline reached: {project.name}", true);
            }
        }
    }
    
    public void AddDeathPoints(string memberId, int points)
    {
        TeamMember member = teamData.members.Find(m => m.id == memberId);
        if (member != null)
        {
            member.deathPoints += points;
            SaveData();
            
            ShowNotification($"{member.username} received {points} death points.");
        }
    }
    
    #endregion
    
    #region Projects Management
    
    public List<Project> GetAllProjects()
    {
        return teamData.projects;
    }
    
    public Project GetProjectById(string id)
    {
        return teamData.projects.Find(p => p.id == id);
    }
    
    public List<Project> GetProjectsForMember(string memberId)
    {
        return teamData.projects.Where(p => p.assignedMembers.Contains(memberId)).ToList();
    }
    
    public bool AddProject(string name, string description, DateTime deadline)
    {
        // Check if user has permission
        if (!currentUser.HasPermission("manageProjects"))
        {
            ShowNotification("You don't have permission to add projects.", true);
            return false;
        }
        
        Project newProject = new Project(name, description, deadline);
        teamData.projects.Add(newProject);
        SaveData();
        
        ShowNotification($"Project '{name}' added successfully!");
        return true;
    }
    
    public bool UpdateProject(Project updatedProject)
    {
        // Check if user has permission
        if (!currentUser.HasPermission("manageProjects"))
        {
            ShowNotification("You don't have permission to update projects.", true);
            return false;
        }
        
        int index = teamData.projects.FindIndex(p => p.id == updatedProject.id);
        if (index == -1)
        {
            ShowNotification("Project not found.", true);
            return false;
        }
        
        teamData.projects[index] = updatedProject;
        SaveData();
        
        ShowNotification($"Project '{updatedProject.name}' updated successfully!");
        return true;
    }
    
    public bool DeleteProject(string projectId)
    {
        // Check if user has permission
        if (!currentUser.HasPermission("manageProjects"))
        {
            ShowNotification("You don't have permission to delete projects.", true);
            return false;
        }
        
        Project projectToDelete = teamData.projects.Find(p => p.id == projectId);
        if (projectToDelete == null)
        {
            ShowNotification("Project not found.", true);
            return false;
        }
        
        teamData.projects.Remove(projectToDelete);
        SaveData();
        
        ShowNotification($"Project '{projectToDelete.name}' deleted successfully!");
        return true;
    }
    
    public bool AssignMemberToProject(string projectId, string memberId)
    {
        // Check if user has permission
        if (!currentUser.HasPermission("manageProjects"))
        {
            ShowNotification("You don't have permission to assign members to projects.", true);
            return false;
        }
        
        Project project = teamData.projects.Find(p => p.id == projectId);
        TeamMember member = teamData.members.Find(m => m.id == memberId);
        
        if (project == null || member == null)
        {
            ShowNotification("Project or member not found.", true);
            return false;
        }
        
        if (!project.assignedMembers.Contains(memberId))
        {
            project.assignedMembers.Add(memberId);
            member.assignedProjects.Add(projectId);
            SaveData();
            
            ShowNotification($"{member.username} assigned to project '{project.name}'!");
        }
        
        return true;
    }
    
    public bool RemoveMemberFromProject(string projectId, string memberId)
    {
        // Check if user has permission
        if (!currentUser.HasPermission("manageProjects"))
        {
            ShowNotification("You don't have permission to remove members from projects.", true);
            return false;
        }
        
        Project project = teamData.projects.Find(p => p.id == projectId);
        TeamMember member = teamData.members.Find(m => m.id == memberId);
        
        if (project == null || member == null)
        {
            ShowNotification("Project or member not found.", true);
            return false;
        }
        
        if (project.assignedMembers.Contains(memberId))
        {
            project.assignedMembers.Remove(memberId);
            member.assignedProjects.Remove(projectId);
            SaveData();
            
            ShowNotification($"{member.username} removed from project '{project.name}'!");
        }
        
        return true;
    }
    
    public bool CompleteProject(string projectId)
    {
        // Check if user has permission
        if (!currentUser.HasPermission("manageProjects"))
        {
            ShowNotification("You don't have permission to complete projects.", true);
            return false;
        }
        
        Project project = teamData.projects.Find(p => p.id == projectId);
        if (project == null)
        {
            ShowNotification("Project not found.", true);
            return false;
        }
        
        project.completed = true;
        SaveData();
        
        ShowNotification($"Project '{project.name}' marked as completed!");
        return true;
    }
    
    #endregion
    
    #region Schedule Management
    
    public List<ScheduleEvent> GetAllEvents()
    {
        return teamData.events;
    }
    
    public ScheduleEvent GetEventById(string id)
    {
        return teamData.events.Find(e => e.id == id);
    }
    
    public List<ScheduleEvent> GetEventsForMember(string memberId)
    {
        return teamData.events.Where(e => e.participants.Contains(memberId)).ToList();
    }
    
    public bool AddEvent(string title, string description, DateTime startTime, DateTime endTime)
    {
        // Check if user has permission
        if (!currentUser.HasPermission("manageSchedule"))
        {
            ShowNotification("You don't have permission to add events.", true);
            return false;
        }
        
        ScheduleEvent newEvent = new ScheduleEvent(title, description, startTime, endTime);
        teamData.events.Add(newEvent);
        SaveData();
        
        ShowNotification($"Event '{title}' added successfully!");
        return true;
    }
    
    public bool UpdateEvent(ScheduleEvent updatedEvent)
    {
        // Check if user has permission
        if (!currentUser.HasPermission("manageSchedule"))
        {
            ShowNotification("You don't have permission to update events.", true);
            return false;
        }
        
        int index = teamData.events.FindIndex(e => e.id == updatedEvent.id);
        if (index == -1)
        {
            ShowNotification("Event not found.", true);
            return false;
        }
        
        teamData.events[index] = updatedEvent;
        SaveData();
        
        ShowNotification($"Event '{updatedEvent.title}' updated successfully!");
        return true;
    }
    
    public bool DeleteEvent(string eventId)
    {
        // Check if user has permission
        if (!currentUser.HasPermission("manageSchedule"))
        {
            ShowNotification("You don't have permission to delete events.", true);
            return false;
        }
        
        ScheduleEvent eventToDelete = teamData.events.Find(e => e.id == eventId);
        if (eventToDelete == null)
        {
            ShowNotification("Event not found.", true);
            return false;
        }
        
        teamData.events.Remove(eventToDelete);
        SaveData();
        
        ShowNotification($"Event '{eventToDelete.title}' deleted successfully!");
        return true;
    }
    
    public bool AddParticipantToEvent(string eventId, string memberId)
    {
        // Check if user has permission
        if (!currentUser.HasPermission("manageSchedule"))
        {
            ShowNotification("You don't have permission to add participants to events.", true);
            return false;
        }
        
        ScheduleEvent evt = teamData.events.Find(e => e.id == eventId);
        TeamMember member = teamData.members.Find(m => m.id == memberId);
        
        if (evt == null || member == null)
        {
            ShowNotification("Event or member not found.", true);
            return false;
        }
        
        if (!evt.participants.Contains(memberId))
        {
            evt.participants.Add(memberId);
            SaveData();
            
            ShowNotification($"{member.username} added to event '{evt.title}'!");
        }
        
        return true;
    }
    
    public bool RemoveParticipantFromEvent(string eventId, string memberId)
    {
        // Check if user has permission
        if (!currentUser.HasPermission("manageSchedule"))
        {
            ShowNotification("You don't have permission to remove participants from events.", true);
            return false;
        }
        
        ScheduleEvent evt = teamData.events.Find(e => e.id == eventId);
        TeamMember member = teamData.members.Find(m => m.id == memberId);
        
        if (evt == null || member == null)
        {
            ShowNotification("Event or member not found.", true);
            return false;
        }
        
        if (evt.participants.Contains(memberId))
        {
            evt.participants.Remove(memberId);
            SaveData();
            
            ShowNotification($"{member.username} removed from event '{evt.title}'!");
        }
        
        return true;
    }
    
    #endregion
}
