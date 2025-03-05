// File: SchedulePanel.cs
// Handles team schedule and events

using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System;
using System.Collections.Generic;

public class SchedulePanel : MonoBehaviour
{
    [Header("Event List")]
    public GameObject eventListPanel;
    public GameObject eventItemPrefab;
    public Transform eventListContainer;
    public TMP_InputField eventSearchInput;
    public TMP_Dropdown timeFilterDropdown;
    
    [Header("Add Event")]
    public GameObject addEventPanel;
    public TMP_InputField eventTitleInput;
    public TMP_InputField eventDescriptionInput;
    public TMP_InputField startDateInput;
    public TMP_InputField startTimeInput;
    public TMP_InputField endDateInput;
    public TMP_InputField endTimeInput;
    public Button addEventButton;
    public TextMeshProUGUI addEventStatusText;
    
    [Header("Event Details")]
    public GameObject eventDetailsPanel;
    public TextMeshProUGUI eventTitleText;
    public TextMeshProUGUI eventDescriptionText;
    public TextMeshProUGUI eventTimeText;
    public GameObject participantItemPrefab;
    public Transform participantsContainer;
    public Button editEventButton;
    public Button deleteEventButton;
    public Button addParticipantButton;
    
    [Header("Edit Event")]
    public GameObject editEventPanel;
    public TMP_InputField editTitleInput;
    public TMP_InputField editDescriptionInput;
    public TMP_InputField editStartDateInput;
    public TMP_InputField editStartTimeInput;
    public TMP_InputField editEndDateInput;
    public TMP_InputField editEndTimeInput;
    public Button saveEditButton;
    public TextMeshProUGUI editStatusText;
    
    [Header("Add Participant")]
    public GameObject addParticipantPanel;
    public TMP_Dropdown participantDropdown;
    public Button confirmAddParticipantButton;
    
    [Header("Navigation")]
    public Button showAddEventButton;
    public Button showEventListButton;
    public Button backToListButton;
    public Button backFromEditButton;
    public Button backFromAddParticipantButton;
    
    private TeamManagementSystem teamSystem;
    private List<ScheduleEvent> allEvents = new List<ScheduleEvent>();
    private ScheduleEvent currentEvent;
    
    void Start()
    {
        teamSystem = TeamManagementSystem.Instance;
        
        // Set up search
        eventSearchInput.onValueChanged.AddListener(FilterEvents);
        
        // Set up time filter
        SetupTimeFilter();
        timeFilterDropdown.onValueChanged.AddListener(delegate { FilterEvents(eventSearchInput.text); });
        
        // Set up navigation
        showAddEventButton.onClick.AddListener(() => {
            eventListPanel.SetActive(false);
            addEventPanel.SetActive(true);
            eventDetailsPanel.SetActive(false);
            editEventPanel.SetActive(false);
            addParticipantPanel.SetActive(false);
            addEventStatusText.text = "";
        });
        
        showEventListButton.onClick.AddListener(() => {
            eventListPanel.SetActive(true);
            addEventPanel.SetActive(false);
            eventDetailsPanel.SetActive(false);
            editEventPanel.SetActive(false);
            addParticipantPanel.SetActive(false);
        });
        
        backToListButton.onClick.AddListener(() => {
            eventListPanel.SetActive(true);
            eventDetailsPanel.SetActive(false);
        });
        
        backFromEditButton.onClick.AddListener(() => {
            editEventPanel.SetActive(false);
            eventDetailsPanel.SetActive(true);
        });
        
        backFromAddParticipantButton.onClick.AddListener(() => {
            addParticipantPanel.SetActive(false);
            eventDetailsPanel.SetActive(true);
        });
        
        // Set up add event button
        addEventButton.onClick.AddListener(AddEvent);
        
        // Set up event details buttons
        editEventButton.onClick.AddListener(ShowEditEvent);
        deleteEventButton.onClick.AddListener(DeleteEvent);
        addParticipantButton.onClick.AddListener(ShowAddParticipant);
        
        // Set up edit event button
        saveEditButton.onClick.AddListener(SaveEventEdit);
        
        // Set up add participant button
        confirmAddParticipantButton.onClick.AddListener(AddParticipantToEvent);
        
        // Start with event list
        eventListPanel.SetActive(true);
        addEventPanel.SetActive(false);
        eventDetailsPanel.SetActive(false);
        editEventPanel.SetActive(false);
        addParticipantPanel.SetActive(false);
        
        RefreshSchedule();
    }
    
    private void SetupTimeFilter()
    {
        timeFilterDropdown.ClearOptions();
        
        List<string> options = new List<string>
        {
            "All Events",
            "Today",
            "This Week",
            "This Month",
            "Upcoming",
            "Past"
        };
        
        timeFilterDropdown.AddOptions(options);
    }
    
    public void RefreshSchedule()
    {
        allEvents = teamSystem.GetAllEvents();
        FilterEvents(eventSearchInput.text);
    }
    
    private void FilterEvents(string searchText)
    {
        // Clear existing events
        foreach (Transform child in eventListContainer)
        {
            Destroy(child.gameObject);
        }
        
        string searchLower = searchText.ToLower();
        string timeFilter = timeFilterDropdown.options[timeFilterDropdown.value].text;
        DateTime now = DateTime.Now;
        
        foreach (ScheduleEvent evt in allEvents)
        {
            // Apply search filter
            bool matchesSearch = string.IsNullOrEmpty(searchLower) || 
                                evt.title.ToLower().Contains(searchLower) ||
                                evt.description.ToLower().Contains(searchLower);
            
            // Apply time filter
            bool matchesTime = timeFilter == "All Events";
            
            if (timeFilter == "Today")
            {
                matchesTime = evt.startTime.Date == now.Date;
            }
            else if (timeFilter == "This Week")
            {
                DateTime startOfWeek = now.AddDays(-(int)now.DayOfWeek);
                DateTime endOfWeek = startOfWeek.AddDays(7);
                matchesTime = evt.startTime >= startOfWeek && evt.startTime < endOfWeek;
            }
            else if (timeFilter == "This Month")
            {
                matchesTime = evt.startTime.Month == now.Month && evt.startTime.Year == now.Year;
            }
            else if (timeFilter == "Upcoming")
            {
                matchesTime = evt.startTime >= now;
            }
            else if (timeFilter == "Past")
            {
                matchesTime = evt.endTime < now;
            }
            
            if (matchesSearch && matchesTime)
            {
                CreateEventItem(evt);
            }
        }
    }
    
    private void CreateEventItem(ScheduleEvent evt)
    {
        GameObject item = Instantiate(eventItemPrefab, eventListContainer);
        
        // Set event data
        item.transform.Find("Title").GetComponent<TextMeshProUGUI>().text = evt.title;
        
        string timeText = evt.startTime.ToString("MMM d, yyyy h:mm tt") + " - ";
        
        if (evt.startTime.Date == evt.endTime.Date)
        {
            // Same day, just show end time
            timeText += evt.endTime.ToString("h:mm tt");
        }
        else
        {
            // Different days, show full end date/time
            timeText += evt.endTime.ToString("MMM d, yyyy h:mm tt");
        }
        
        item.transform.Find("Time").GetComponent<TextMeshProUGUI>().text = timeText;
        
        // Color based on time
        TextMeshProUGUI timeTextUI = item.transform.Find("Time").GetComponent<TextMeshProUGUI>();
        if (evt.endTime < DateTime.Now)
        {
            // Past event
            timeTextUI.color = Color.gray;
        }
        else if (evt.startTime.Date == DateTime.Now.Date)
        {
            // Today's event
            timeTextUI.color = Color.green;
        }
        else
        {
            // Future event
            timeTextUI.color = Color.white;
        }
        
        // Set up view details button
        item.transform.Find("ViewButton").GetComponent<Button>().onClick.AddListener(() => {
            ShowEventDetails(evt);
        });
    }
    
    private void AddEvent()
    {
        string title = eventTitleInput.text.Trim();
        string description = eventDescriptionInput.text.Trim();
        string startDateStr = startDateInput.text.Trim();
        string startTimeStr = startTimeInput.text.Trim();
        string endDateStr = endDateInput.text.Trim();
        string endTimeStr = endTimeInput.text.Trim();
        
        // Validate inputs
        if (string.IsNullOrEmpty(title))
        {
            addEventStatusText.text = "Please enter an event title.";
            addEventStatusText.color = Color.red;
            return;
        }
        
        DateTime startDateTime, endDateTime;
        
        try
        {
            startDateTime = ParseDateTime(startDateStr, startTimeStr);
            endDateTime = ParseDateTime(endDateStr, endTimeStr);
        }
        catch (Exception)
        {
            addEventStatusText.text = "Please enter valid date and time (MM/DD/YYYY and HH:MM).";
            addEventStatusText.color = Color.red;
            return;
        }
        
        if (endDateTime <= startDateTime)
        {
            addEventStatusText.text = "End time must be after start time.";
            addEventStatusText.color = Color.red;
            return;
        }
        
        bool success = teamSystem.AddEvent(title, description, startDateTime, endDateTime);
        
        if (success)
        {
            addEventStatusText.text = "Event added successfully!";
            addEventStatusText.color = Color.green;
            
            // Clear fields
            eventTitleInput.text = "";
            eventDescriptionInput.text = "";
            startDateInput.text = "";
            startTimeInput.text = "";
            endDateInput.text = "";
            endTimeInput.text = "";
            
            // Refresh event list
            RefreshSchedule();
        }
        else
        {
            addEventStatusText.text = "Failed to add event. Check permissions.";
            addEventStatusText.color = Color.red;
        }
    }
    
    private DateTime ParseDateTime(string dateStr, string timeStr)
    {
        DateTime date = DateTime.Parse(dateStr);
        
        if (!string.IsNullOrEmpty(timeStr))
        {
            string[] timeParts = timeStr.Split(':');
            int hour = int.Parse(timeParts[0]);
            int minute = int.Parse(timeParts[1]);
            
            return new DateTime(date.Year, date.Month, date.Day, hour, minute, 0);
        }
        
        return date;
    }
    
    private void ShowEventDetails(ScheduleEvent evt)
    {
        currentEvent = evt;
        
        // Set event details
        eventTitleText.text = evt.title;
        eventDescriptionText.text = evt.description;
        
        string timeText = evt.startTime.ToString("MMM d, yyyy h:mm tt") + " - ";
        
        if (evt.startTime.Date == evt.endTime.Date)
        {
            // Same day, just show end time
            timeText += evt.endTime.ToString("h:mm tt");
        }
        else
        {
            // Different days, show full end date/time
            timeText += evt.endTime.ToString("MMM d, yyyy h:mm tt");
        }
        
        eventTimeText.text = timeText;
        
        // Load participants
        LoadParticipants();
        
        // Show/hide buttons based on permissions
        bool canManageSchedule = teamSystem.GetCurrentUser().HasPermission("manageSchedule");
        editEventButton.gameObject.SetActive(canManageSchedule);
        deleteEventButton.gameObject.SetActive(canManageSchedule);
        addParticipantButton.gameObject.SetActive(canManageSchedule);
        
        // Show details panel
        eventListPanel.SetActive(false);
        eventDetailsPanel.SetActive(true);
    }
    
    private void LoadParticipants()
    {
        // Clear existing participants
        foreach (Transform child in participantsContainer)
        {
            Destroy(child.gameObject);
        }
        
        // Add participants
        foreach (string participantId in currentEvent.participants)
        {
            TeamMember member = teamSystem.GetMemberById(participantId);
            if (member != null)
            {
                GameObject item = Instantiate(participantItemPrefab, participantsContainer);
                
                item.transform.Find("Username").GetComponent<TextMeshProUGUI>().text = member.username;
                
                TextMeshProUGUI rankText = item.transform.Find("Rank").GetComponent<TextMeshProUGUI>();
                rankText.text = member.rank;
                SetRankColor(rankText, member.rank);
                
                // Set up remove button
                Button removeButton = item.transform.Find("RemoveButton").GetComponent<Button>();
                
                if (teamSystem.GetCurrentUser().HasPermission("manageSchedule"))
                {
                    removeButton.onClick.AddListener(() => {
                        RemoveParticipantFromEvent(participantId);
                    });
                }
                else
                {
                    removeButton.gameObject.SetActive(false);
                }
            }
        }
        
        // Show "No participants" message if empty
        if (currentEvent.participants.Count == 0)
        {
            GameObject item = Instantiate(participantItemPrefab, participantsContainer);
            item.transform.Find("Username").GetComponent<TextMeshProUGUI>().text = "No participants";
            item.transform.Find("Rank").GetComponent<TextMeshProUGUI>().text = "";
            item.transform.Find("RemoveButton").gameObject.SetActive(false);
        }
    }
    
    private void ShowEditEvent()
    {
        editTitleInput.text = currentEvent.title;
        editDescriptionInput.text = currentEvent.description;
        editStartDateInput.text = currentEvent.startTime.ToString("MM/dd/yyyy");
        editStartTimeInput.text = currentEvent.startTime.ToString("HH:mm");
        editEndDateInput.text = currentEvent.endTime.ToString("MM/dd/yyyy");
        editEndTimeInput.text = currentEvent.endTime.ToString("HH:mm");
        
        editEventPanel.SetActive(true);
        eventDetailsPanel.SetActive(false);
        editStatusText.text = "";
    }
    
    private void SaveEventEdit()
    {
        string title = editTitleInput.text.Trim();
        string description = editDescriptionInput.text.Trim();
        string startDateStr = editStartDateInput.text.Trim();
        string startTimeStr = editStartTimeInput.text.Trim();
        string endDateStr = editEndDateInput.text.Trim();
        string endTimeStr = editEndTimeInput.text.Trim();
        
        // Validate inputs
        if (string.IsNullOrEmpty(title))
        {
            editStatusText.text = "Please enter an event title.";
            editStatusText.color = Color.red;
            return;
        }
        
        DateTime startDateTime, endDateTime;
        
        try
        {
            startDateTime = ParseDateTime(startDateStr, startTimeStr);
            endDateTime = ParseDateTime(endDateStr, endTimeStr);
        }
        catch (Exception)
        {
            editStatusText.text = "Please enter valid date and time (MM/DD/YYYY and HH:MM).";
            editStatusText.color = Color.red;
            return;
        }
        
        if (endDateTime <= startDateTime)
        {
            editStatusText.text = "End time must be after start time.";
            editStatusText.color = Color.red;
            return;
        }
        
        // Update event
        ScheduleEvent updatedEvent = new ScheduleEvent(title, description, startDateTime, endDateTime);
        updatedEvent.id = currentEvent.id;
        updatedEvent.participants = currentEvent.participants;
        
        bool success = teamSystem.UpdateEvent(updatedEvent);
        
        if (success)
        {
            editStatusText.text = "Event updated successfully!";
            editStatusText.color = Color.green;
            
            // Update current event
            currentEvent = updatedEvent;
            
            // Refresh event list
            RefreshSchedule();
            
            // Return to details after a delay
            Invoke("ReturnToDetails", 1.5f);
        }
        else
        {
            editStatusText.text = "Failed to update event. Check permissions.";
            editStatusText.color = Color.red;
        }
    }
    
    private void ReturnToDetails()
    {
        editEventPanel.SetActive(false);
        ShowEventDetails(currentEvent);
    }
    
    private void DeleteEvent()
    {
        // Confirm deletion
        if (!UnityEngine.Application.isMobilePlatform)
        {
            // On non-mobile platforms, use a confirmation dialog
            if (!UnityEngine.Windows.Dialog.Confirm("Delete Event", "Are you sure you want to delete this event?"))
            {
                return;
            }
        }
        else
        {
            // On mobile, we'd need a custom dialog
            // For this example, we'll just proceed with deletion
        }
        
        bool success = teamSystem.DeleteEvent(currentEvent.id);
        
        if (success)
        {
            // Return to event list
            eventDetailsPanel.SetActive(false);
            eventListPanel.SetActive(true);
            
            // Refresh event list
            RefreshSchedule();
        }
    }
    
    private void ShowAddParticipant()
    {
        // Set up participant dropdown
        SetupParticipantDropdown();
        
        addParticipantPanel.SetActive(true);
        eventDetailsPanel.SetActive(false);
    }
    
    private void SetupParticipantDropdown()
    {
        participantDropdown.ClearOptions();
        List<string> options = new List<string>();
        List<TeamMember> allMembers = teamSystem.GetAllMembers();
        
        foreach (TeamMember member in allMembers)
        {
            // Only show members not already participating
            if (!currentEvent.participants.Contains(member.id))
            {
                options.Add(member.username);
            }
        }
        
        participantDropdown.AddOptions(options);
        
        // Disable button if no members available
        confirmAddParticipantButton.interactable = options.Count > 0;
    }
    
    private void AddParticipantToEvent()
    {
        if (participantDropdown.options.Count == 0)
        {
            return;
        }
        
        string selectedUsername = participantDropdown.options[participantDropdown.value].text;
        TeamMember selectedMember = teamSystem.GetAllMembers().Find(m => m.username == selectedUsername);
        
        if (selectedMember != null)
        {
            bool success = teamSystem.AddParticipantToEvent(currentEvent.id, selectedMember.id);
            
            if (success)
            {
                // Return to details
                addParticipantPanel.SetActive(false);
                ShowEventDetails(teamSystem.GetEventById(currentEvent.id));
            }
        }
    }
    
    private void RemoveParticipantFromEvent(string participantId)
    {
        bool success = teamSystem.RemoveParticipantFromEvent(currentEvent.id, participantId);
        
        if (success)
        {
            // Refresh details
            ShowEventDetails(teamSystem.GetEventById(currentEvent.id));
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
