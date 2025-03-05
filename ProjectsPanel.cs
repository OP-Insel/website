// Filename: ProjectsPanel.cs
// Manages project creation, editing, and assignment

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
        if (currentProject.assignedMembers != null && currentProject.assignedMembers.Count > 0)
        {
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
        }
        else
        {
            // Show "No members" message if empty
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
        updatedProject.assignedMembers = curren
