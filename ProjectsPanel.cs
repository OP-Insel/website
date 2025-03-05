// File: ProjectsPanel.cs
// Handles project management and deadlines

using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System;
using System.Collections.Generic;

public class ProjectsPanel : MonoBehaviour
{
    [Header("Project List")]
    public GameObject projectListPanel;
    public GameObject projectItemPrefab;
    public Transform projectListContainer;
    public TMP_InputField projectSearchInput;
    public TMP_Dropdown statusFilterDropdown;
    
    [Header("Add Project")]
    public GameObject addProjectPanel;
    public TMP_InputField projectNameInput;
    public TMP_InputField projectDescriptionInput;
    public TMP_InputField deadlineDateInput;
    public Button addProjectButton;
    public TextMeshProUGUI addProjectStatusText;
    
    [Header("Project Details")]
    public GameObject projectDetailsPanel;
    public TextMeshProUGUI projectNameText;
    public TextMeshProUGUI projectDescriptionText;
    public TextMeshProUGUI projectDeadlineText;
    public TextMeshProUGUI projectStatusText;
    public GameObject memberItemPrefab;
    public Transform membersContainer;
    public Button markCompletedButton;
    public Button editProjectButton;
    public Button deleteProjectButton;
    public Button addMemberButton;
    
    [Header("Edit Project")]
    public GameObject editProjectPanel;
    public TMP_InputField editNameInput;
    public TMP_InputField editDescriptionInput;
    public TMP_InputField editDeadlineInput;
    public Button saveEditButton;
    public TextMeshProUGUI editStatusText;
    
    [Header("Add Member")]
    public GameObject addMemberPanel;
    public TMP_Dropdown memberDropdown;
    public Button confirmAddMemberButton;
    
    [Header("Navigation")]
    public Button showAddProjectButton;
    public Button showProjectListButton;
    public Button backToListButton;
    public Button backFromEditButton;
    public Button backFromAddMemberButton;
    
    private TeamManagementSystem teamSystem;
    private List<Project> allProjects = new List<Project>();
    private Project currentProject;
    
    void Start()
    {
        teamSystem = TeamManagementSystem.Instance;
        
        // Set up search
        projectSearchInput.onValueChanged.AddListener(FilterProjects);
        
        // Set up status filter
        SetupStatusFilter();
        statusFilterDropdown.onValueChanged.AddListener(delegate { FilterProjects(projectSearchInput.text); });
        
        // Set up navigation
        showAddProjectButton.onClick.AddListener(() => {
            projectListPanel.SetActive(false);
            addProjectPanel.SetActive(true);
            projectDetailsPanel.SetActive(false);
            editProjectPanel.SetActive(false);
            addMemberPanel.SetActive(false);
            addProjectStatusText.text = "";
        });
        
        showProjectListButton.onClick.AddListener(() => {
            projectListPanel.SetActive(true);
            addProjectPanel.SetActive(false);
            projectDetailsPanel.SetActive(false);
            editProjectPanel.SetActive(false);
            addMemberPanel.SetActive(false);
        });
        
        backToListButton.onClick.AddListener(() => {
            projectListPanel.SetActive(true);
            projectDetailsPanel.SetActive(false);
        });
        
        backFromEditButton.onClick.AddListener(() => {
            editProjectPanel.SetActive(false);
            projectDetailsPanel.SetActive(true);
        });
        
        backFromAddMemberButton.onClick.AddListener(() => {
            addMemberPanel.SetActive(false);
            projectDetailsPanel.SetActive(true);
        });
        
        // Set up add project button
        addProjectButton.onClick.AddListener(AddProject);
        
        // Set up project details buttons
        markCompletedButton.onClick.AddListener(MarkProjectCompleted);
        editProjectButton.onClick.AddListener(ShowEditProject);
        deleteProjectButton.onClick.AddListener(DeleteProject);
        addMemberButton.onClick.AddListener(ShowAddMember);
        
        // Set up edit project button
        saveEditButton.onClick.AddListener(SaveProjectEdit);
        
        // Set up add member button
        confirmAddMemberButton.onClick.AddListener(AddMemberToProject);
        
        // Start with project list
        projectListPanel.SetActive(true);
        addProjectPanel.SetActive(false);
        projectDetailsPanel.SetActive(false);
        editProjectPanel.SetActive(false);
        addMemberPanel.SetActive(false);
        
        RefreshProjects();
    }
    
    private void SetupStatusFilter()
    {
        statusFilterDropdown.ClearOptions();
        
        List<string> options = new List<string>
        {
            "All Projects",
            "Active",
            "Completed",
            "Overdue"
        };
        
        statusFilterDropdown.AddOptions(options);
    }
    
    public void RefreshProjects()
    {
        allProjects = teamSystem.GetAllProjects();
        FilterProjects(projectSearchInput.text);
    }
    
    private void FilterProjects(string searchText)
    {
        // Clear existing projects
        foreach (Transform child in projectListContainer)
        {
            Destroy(child.gameObject);
        }
        
        string searchLower = searchText.ToLower();
        string statusFilter = statusFilterDropdown.options[statusFilterDropdown.value].text;
        
        foreach (Project project in allProjects)
        {
            // Apply search filter
            bool matchesSearch = string.IsNullOrEmpty(searchLower) || 
                                project.name.ToLower().Contains(searchLower) ||
                                project.description.ToLower().Contains(searchLower);
            
            // Apply status filter
            bool matchesStatus = statusFilter == "All Projects" ||
                                (statusFilter == "Active" && !project.completed && DateTime.Now <= project.deadline) ||
                                (statusFilter == "Completed" && project.completed) ||
                                (statusFilter == "Overdue" && !project.completed && DateTime.Now > project.deadline);
            
            if (matchesSearch && matchesStatus)
            {
                CreateProjectItem(project);
            }
        }
    }
    
    private void CreateProjectItem(Project project)
    {
        GameObject item = Instantiate(projectItemPrefab, projectListContainer);
        
        // Set project data
        item.transform.Find("Name").GetComponent<TextMeshProUGUI>().text = project.name;
        
        string deadlineText = project.deadline.ToShortDateString();
        TextMeshProUGUI deadlineTextUI = item.transform.Find("Deadline").GetComponent<TextMeshProUGUI>();
        
        if (project.completed)
        {
            deadlineText += " (Completed)";
            deadlineTextUI.color = Color.green;
        }
        else if (DateTime.Now > project.deadline)
        {
            deadlineText += " (Overdue)";
            deadlineTextUI.color = Color.red;
        }
        
        deadlineTextUI.text = deadlineText;
        
        // Set up view details button
        item.transform.Find("ViewButton").GetComponent<Button>().onClick.AddListener(() => {
            ShowProjectDetails(project);
        });
    }
    
    private void AddProject()
    {
        string name = projectNameInput.text.Trim();
        string description = projectDescriptionInput.text.Trim();
        string deadlineStr = deadlineDateInput.text.Trim();
        
        // Validate inputs
        if (string.IsNullOrEmpty(name))
        {
            addProjectStatusText.text = "Please enter a project name.";
            addProjectStatusText.color = Color.red;
            return;
        }
        
        DateTime deadline;
        if (!DateTime.TryParse(deadlineStr, out deadline))
        {
            addProjectStatusText.text = "Please enter a valid deadline date (MM/DD/YYYY).";
            addProjectStatusText.color = Color.red;
            return;
        }
        
        bool success = teamSystem.AddProject(name, description, deadline);
        
        if (success)
        {
            addProjectStatusText.text = "Project added successfully!";
            addProjectStatusText.color = Color.green;
            
            // Clear fields
            projectNameInput.text = "";
            projectDescriptionInput.text = "";
            deadlineDateInput.text = "";
            
            // Refresh project list
            RefreshProjects();
        }
        else
        {
            addProjectStatusText.text = "Failed to add project. Check permissions.";
            addProjectStatusText.color = Color.red;
        }
    }
    
    private void ShowProjectDetails(Project project)
    {
        currentProject = project;
        
        // Set project details
        projectNameText.text = project.name;
        projectDescriptionText.text = project.description;
        
        string deadlineText = project.deadline.ToShortDateString();
        if (project.completed)
        {
            projectStatusText.text = "Status: Completed";
            projectStatusText.color = Color.green;
            markCompletedButton.interactable = false;
        }
        else if (DateTime.Now > project.deadline)
        {
            projectStatusText.text = "Status: Overdue";
            projectStatusText.color = Color.red;
            markCompletedButton.interactable = true;
        }
        else
        {
            projectStatusText.text = "Status: Active";
            projectStatusText.color = Color.white;
            markCompletedButton.interactable = true;
        }
        
        projectDeadlineText.text = "Deadline: " + deadlineText;
        
        // Load assigned members
        LoadAssignedMembers();
        
        // Show/hide buttons based on permissions
        bool canManageProjects = teamSystem.GetCurrentUser().HasPermission("manageProjects");
        markCompletedButton.gameObject.SetActive(canManageProjects);
        editProjectButton.gameObject.SetActive(canManageProjects);
        deleteProjectButton.gameObject.SetActive(canManageProjects);
        addMemberButton.gameObject.SetActive(canManageProjects);
        
        // Show details panel
        projectListPanel.SetActive(false);
        projectDetailsPanel.SetActive(true);
    }
    
    private void LoadAssignedMembers()
    {
        // Clear existing members
        foreach (Transform child in membersContainer)
        {
            Destroy(child.gameObject);
        }
        
        // Add assigned members
        foreach (string memberId in currentProject.assignedMembers)
        {
            TeamMember member = teamSystem.GetMemberById(memberId);
            if (member != null)
            {
                GameObject item = Instantiate(memberItemPrefab, membersContainer);
                
                item.transform.Find("Username").GetComponent<TextMeshProUGUI>().text = member.username;
                
                TextMeshProUGUI rankText = item.transform.Find("Rank").GetComponent<TextMeshProUGUI>();
                rankText.text = member.rank;
                SetRankColor(rankText, member.rank);
                
                // Set up remove button
                Button removeButton = item.transform.Find("RemoveButton").GetComponent<Button>();
                
                if (teamSystem.GetCurrentUser().HasPermission("manageProjects"))
                {
                    removeButton.onClick.AddListener(() => {
                        RemoveMemberFromProject(memberId);
                    });
                }
                else
                {
                    removeButton.gameObject.SetActive(false);
                }
            }
        }
        
        // Show "No members" message if empty
        if (currentProject.assignedMembers.Count == 0)
        {
            GameObject item = Instantiate(memberItemPrefab, membersContainer);
            item.transform.Find("Username").GetComponent<TextMeshProUGUI>().text = "No members assigned";
            item.transform.Find("Rank").GetComponent<TextMeshProUGUI>().text = "";
            item.transform.Find("RemoveButton").gameObject.SetActive(false);
        }
    }
    
    private void MarkProjectCompleted()
    {
        bool success = teamSystem.CompleteProject(currentProject.id);
        
        if (success)
        {
            currentProject.completed = true;
            ShowProjectDetails(currentProject);
        }
    }
    
    private void ShowEditProject()
    {
        editNameInput.text = currentProject.name;
        editDescriptionInput.text = currentProject.description;
        editDeadlineInput.text = currentProject.deadline.ToString("MM/dd/yyyy");
        
        editProjectPanel.SetActive(true);
        projectDetailsPanel.SetActive(false);
        editStatusText.text = "";
    }
    
    private void SaveProjectEdit()
    {
        string name = editNameInput.text.Trim();
        string description = editDescriptionInput.text.Trim();
        string deadlineStr = editDeadlineInput.text.Trim();
        
        // Validate inputs
        if (string.IsNullOrEmpty(name))
        {
            editStatusText.text = "Please enter a project name.";
            editStatusText.color = Color.red;
            return;
        }
        
        DateTime deadline;
        if (!DateTime.TryParse(deadlineStr, out deadline))
        {
            editStatusText.text = "Please enter a valid deadline date (MM/DD/YYYY).";
            editStatusText.color = Color.red;
            return;
        }
        
        // Update project
        Project updatedProject = new Project(name, description, deadline);
        updatedProject.id = currentProject.id;
        updatedProject.assignedMembers = currentProject.assignedMembers;
        updatedProject.completed = currentProject.completed;
        
        bool success = teamSystem.UpdateProject(updatedProject);
        
        if (success)
        {
            editStatusText.text = "Project updated successfully!";
            editStatusText.color = Color.green;
            
            // Update current project
            currentProject = updatedProject;
            
            // Refresh project list
            RefreshProjects();
            
            // Return to details after a delay
            Invoke("ReturnToDetails", 1.5f);
        }
        else
        {
            editStatusText.text = "Failed to update project. Check permissions.";
            editStatusText.color = Color.red;
        }
    }
    
    private void ReturnToDetails()
    {
        editProjectPanel.SetActive(false);
        ShowProjectDetails(currentProject);
    }
    
    private void DeleteProject()
    {
        // Confirm deletion
        if (!UnityEngine.Application.isMobilePlatform)
        {
            // On non-mobile platforms, use a confirmation dialog
            if (!UnityEngine.Windows.Dialog.Confirm("Delete Project", "Are you sure you want to delete this project?"))
            {
                return;
            }
        }
        else
        {
            // On mobile, we'd need a custom dialog
            // For this example, we'll just proceed with deletion
        }
        
        bool success = teamSystem.DeleteProject(currentProject.id);
        
        if (success)
        {
            // Return to project list
            projectDetailsPanel.SetActive(false);
            projectListPanel.SetActive(true);
            
            // Refresh project list
            RefreshProjects();
        }
    }
    
    private void ShowAddMember()
    {
        // Set up member dropdown
        SetupMemberDropdown();
        
        addMemberPanel.SetActive(true);
        projectDetailsPanel.SetActive(false);
    }
    
    private void SetupMemberDropdown()
    {
        memberDropdown.ClearOptions();
        List<string> options = new List<string>();
        List<TeamMember> allMembers = teamSystem.GetAllMembers();
        
        foreach (TeamMember member in allMembers)
        {
            // Only show members not already assigned
            if (!currentProject.assignedMembers.Contains(member.id))
            {
                options.Add(member.username);
            }
        }
        
        memberDropdown.AddOptions(options);
        
        // Disable button if no members available
        confirmAddMemberButton.interactable = options.Count > 0;
    }
    
    private void AddMemberToProject()
    {
        if (memberDropdown.options.Count == 0)
        {
            return;
        }
        
        string selectedUsername = memberDropdown.options[memberDropdown.value].text;
        TeamMember selectedMember = teamSystem.GetAllMembers().Find(m => m.username == selectedUsername);
        
        if (selectedMember != null)
        {
            bool success = teamSystem.AssignMemberToProject(currentProject.id, selectedMember.id);
            
            if (success)
            {
                // Return to details
                addMemberPanel.SetActive(false);
                ShowProjectDetails(teamSystem.GetProjectById(currentProject.id));
            }
        }
    }
    
    private void RemoveMemberFromProject(string memberId)
    {
        bool success = teamSystem.RemoveMemberFromProject(currentProject.id, memberId);
        
        if (success)
        {
            // Refresh details
            ShowProjectDetails(teamSystem.GetProjectById(currentProject.id));
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
