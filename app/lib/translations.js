// Translations for the application
export const translations = {
  // English translations
  en: {
    // Navigation
    nav: {
      dashboard: "Dashboard",
      team_members: "Team Members",
      admin_panel: "Admin Panel",
      calendar: "Calendar",
      story: "Story",
      tasks: "Tasks",
      rules: "Rules & Points",
    },

    // Header
    header: {
      documentation: "Documentation",
      logout: "Logout",
    },

    // User management
    user: {
      team_members: "Team Members",
      select_description: "Select a user to view details",
      details: "User Details",
      viewing_user: "Viewing {username}",
      select_user: "Select a user to view details",
      select_prompt: "Select a user from the list to view their details",
      update_success_title: "User Updated",
      update_success_description: "{username}'s information has been updated.",
      add_success_title: "User Added",
      add_success_description: "{username} has been added to the team.",
    },

    // Story management
    story: {
      add_success_title: "Story Added",
      add_success_description: 'New story "{title}" has been added.',
      update_success_title: "Story Updated",
      update_success_description: 'Story "{title}" has been updated.',
    },

    // Task management
    task: {
      add_success_title: "Task Added",
      add_success_description: 'New task "{title}" has been added.',
      update_success_title: "Task Updated",
      update_success_description: 'Task "{title}" has been updated.',
      deduction_request_title: "Point Deduction Request: {username}",
      deduction_request_description: "Request to deduct {points} points from {username} for: {reason}",
    },

    // Point deductions
    deduction: {
      request_submitted_title: "Deduction Request Submitted",
      request_submitted_description: "Your point deduction request has been submitted for approval.",
      applied_title: "Points Deducted",
      applied_description: "{points} points have been deducted.",
      approved_title: "Deduction Approved",
      approved_description: "The point deduction request has been approved and applied.",
      rejected_title: "Deduction Rejected",
      rejected_description: "The point deduction request has been rejected.",
    },

    // History
    history: {
      points_deducted: "Deducted {points} points: {reason}",
      user_added: "User added to team",
    },

    // Rules
    rules: {
      title: "Rules & Point System",
      description: "Team rules and point deduction system",
      point_deductions_title: "Point Deductions for Rule Violations",
      violation: "Violation",
      point_deduction: "Point Deduction",
      points: "Points",
      ban_without_reason: "Ban without reason",
      unfair_punishment: "Unfair or unjustified punishment against players",
      abuse_admin_rights: "Abuse of admin rights (e.g., giving yourself OP without permission)",
      insulting_behavior: "Insulting or bad behavior towards players",
      inactive_without_notice: "Inactive without notice (e.g., 2 weeks)",
      repeated_misconduct: "Repeated misconduct despite warning",
      spamming: "Spamming commands or messages",
      serious_violations: "Serious rule violations (e.g., manipulating server or player data)",
      demotion_system: "Demotion System",
      rank: "Rank",
      points_for_demotion: "Points for Automatic Demotion",
      co_owner_to_admin: "Co-Owner → Admin",
      admin_to_jr_admin: "Admin → Jr. Admin",
      jr_admin_to_moderator: "Jr. Admin → Moderator",
      moderator_to_jr_moderator: "Moderator → Jr. Moderator",
      jr_moderator_to_supporter: "Jr. Moderator → Supporter",
      supporter_to_jr_supporter: "Supporter → Jr. Supporter",
      jr_supporter_to_removed: "Jr. Supporter → Removed from Team",
      zero_points_warning: "If a team member falls below 0 points, they will be directly removed from the team!",
      important_rules: "Important Rules",
      monthly_reset: "Points are reset on the 1st of each month, but demotions remain in effect.",
      document_violations: "Admins and Co-Owners must log rule violations in Discord (e.g., when banning a player).",
      removal_at_zero: "At 0 points or less, a team member will be removed.",
      operator_reset_points: "Owner & Co-Owner can reset or award points if someone was treated unfairly.",
      operator_rights: "Only Owner & Co-Owner have Operator rights on the server.",
      suggestion_only: "Other ranks can only suggest point deductions, which must be approved by an Operator.",
    },

    // Errors
    error: {
      fetch_title: "Data Fetch Error",
      fetch_description: "There was an error fetching the data. Please try again.",
      update_title: "Update Error",
      update_description: "There was an error updating the information. Please try again.",
      request_title: "Request Error",
      request_description: "There was an error submitting your request. Please try again.",
      deduction_title: "Deduction Error",
      deduction_description: "There was an error applying the point deduction. Please try again.",
      add_user_title: "Add User Error",
      add_user_description: "There was an error adding the user. Please try again.",
      add_story_title: "Add Story Error",
      add_story_description: "There was an error adding the story. Please try again.",
      update_story_title: "Update Story Error",
      update_story_description: "There was an error updating the story. Please try again.",
      add_task_title: "Add Task Error",
      add_task_description: "There was an error adding the task. Please try again.",
      update_task_title: "Update Task Error",
      update_task_description: "There was an error updating the task. Please try again.",
      approve_deduction_title: "Approve Deduction Error",
      approve_deduction_description: "There was an error approving the deduction. Please try again.",
      reject_deduction_title: "Reject Deduction Error",
      reject_deduction_description: "There was an error rejecting the deduction. Please try again.",
      unauthorized_title: "Unauthorized",
      unauthorized_edit_description: "You don't have permission to edit this user.",
      unauthorized_add_description: "You don't have permission to add users.",
      unauthorized_story_description: "You don't have permission to manage stories.",
      unauthorized_task_description: "You don't have permission to manage tasks.",
      unauthorized_approve_description: "You don't have permission to approve deductions.",
      unauthorized_reject_description: "You don't have permission to reject deductions.",
    },
  },

  // German translations
  de: {
    // Navigation
    nav: {
      dashboard: "Dashboard",
      team_members: "Teammitglieder",
      admin_panel: "Admin-Panel",
      calendar: "Kalender",
      story: "Geschichte",
      tasks: "Aufgaben",
      rules: "Regeln & Punkte",
    },

    // Header
    header: {
      documentation: "Dokumentation",
      logout: "Abmelden",
    },

    // User management
    user: {
      team_members: "Teammitglieder",
      select_description: "Wähle einen Benutzer aus, um Details anzuzeigen",
      details: "Benutzerdetails",
      viewing_user: "Ansicht von {username}",
      select_user: "Wähle einen Benutzer aus, um Details anzuzeigen",
      select_prompt: "Wähle einen Benutzer aus der Liste aus, um seine Details anzuzeigen",
      update_success_title: "Benutzer aktualisiert",
      update_success_description: "Die Informationen von {username} wurden aktualisiert.",
      add_success_title: "Benutzer hinzugefügt",
      add_success_description: "{username} wurde zum Team hinzugefügt.",
    },

    // Story management
    story: {
      add_success_title: "Geschichte hinzugefügt",
      add_success_description: 'Neue Geschichte "{title}" wurde hinzugefügt.',
      update_success_title: "Geschichte aktualisiert",
      update_success_description: 'Geschichte "{title}" wurde aktualisiert.',
    },

    // Task management
    task: {
      add_success_title: "Aufgabe hinzugefügt",
      add_success_description: 'Neue Aufgabe "{title}" wurde hinzugefügt.',
      update_success_title: "Aufgabe aktualisiert",
      update_success_description: 'Aufgabe "{title}" wurde aktualisiert.',
      deduction_request_title: "Punktabzugsanfrage: {username}",
      deduction_request_description: "Anfrage, {points} Punkte von {username} abzuziehen für: {reason}",
    },

    // Point deductions
    deduction: {
      request_submitted_title: "Abzugsanfrage eingereicht",
      request_submitted_description: "Deine Punktabzugsanfrage wurde zur Genehmigung eingereicht.",
      applied_title: "Punkte abgezogen",
      applied_description: "{points} Punkte wurden abgezogen.",
      approved_title: "Abzug genehmigt",
      approved_description: "Die Punktabzugsanfrage wurde genehmigt und angewendet.",
      rejected_title: "Abzug abgelehnt",
      rejected_description: "Die Punktabzugsanfrage wurde abgelehnt.",
    },

    // History
    history: {
      points_deducted: "{points} Punkte abgezogen: {reason}",
      user_added: "Benutzer zum Team hinzugefügt",
    },

    // Rules
    rules: {
      title: "Regeln & Punktesystem",
      description: "Teamregeln und Punktabzugssystem",
      point_deductions_title: "Punktabzüge für Regelverstöße",
      violation: "Verstoß",
      point_deduction: "Punktabzug",
      points: "Punkte",
      ban_without_reason: "Bann ohne Grund",
      unfair_punishment: "Unfaire oder ungerechtfertigte Bestrafung von Spielern",
      abuse_admin_rights: "Missbrauch von Admin-Rechten (z.B. sich selbst OP-Rechte geben ohne Erlaubnis)",
      insulting_behavior: "Beleidigendes oder schlechtes Verhalten gegenüber Spielern",
      inactive_without_notice: "Inaktiv ohne Mitteilung (z.B. 2 Wochen)",
      repeated_misconduct: "Wiederholtes Fehlverhalten trotz Warnung",
      spamming: "Spammen von Befehlen oder Nachrichten",
      serious_violations: "Schwerwiegende Regelverstöße (z.B. Manipulation von Server- oder Spielerdaten)",
      demotion_system: "Degradierungssystem",
      rank: "Rang",
      points_for_demotion: "Punkte für automatische Degradierung",
      co_owner_to_admin: "Co-Owner → Admin",
      admin_to_jr_admin: "Admin → Jr. Admin",
      jr_admin_to_moderator: "Jr. Admin → Moderator",
      moderator_to_jr_moderator: "Moderator → Jr. Moderator",
      jr_moderator_to_supporter: "Jr. Moderator → Supporter",
      supporter_to_jr_supporter: "Supporter → Jr. Supporter",
      jr_supporter_to_removed: "Jr. Supporter → Aus dem Team entfernt",
      zero_points_warning: "Wenn ein Teammitglied unter 0 Punkte fällt, wird es direkt aus dem Team entfernt!",
      important_rules: "Wichtige Regeln",
      monthly_reset: "Punkte werden am 1. eines jeden Monats zurückgesetzt, aber Degradierungen bleiben bestehen.",
      document_violations:
        "Admins und Co-Owner müssen Regelverstöße in Discord dokumentieren (z.B. beim Bannen eines Spielers).",
      removal_at_zero: "Bei 0 oder weniger Punkten wird ein Teammitglied entfernt.",
      operator_reset_points:
        "Owner & Co-Owner können Punkte zurücksetzen oder vergeben, wenn jemand unfair behandelt wurde.",
      operator_rights: "Nur Owner & Co-Owner haben Operator-Rechte auf dem Server.",
      suggestion_only:
        "Andere Ränge können nur Punktabzüge vorschlagen, die von einem Operator genehmigt werden müssen.",
    },

    // Errors
    error: {
      fetch_title: "Datenabruffehler",
      fetch_description: "Beim Abrufen der Daten ist ein Fehler aufgetreten. Bitte versuche es erneut.",
      update_title: "Aktualisierungsfehler",
      update_description: "Beim Aktualisieren der Informationen ist ein Fehler aufgetreten. Bitte versuche es erneut.",
      request_title: "Anfragefehler",
      request_description: "Beim Einreichen deiner Anfrage ist ein Fehler aufgetreten. Bitte versuche es erneut.",
      deduction_title: "Abzugsfehler",
      deduction_description: "Beim Anwenden des Punktabzugs ist ein Fehler aufgetreten. Bitte versuche es erneut.",
      add_user_title: "Fehler beim Hinzufügen des Benutzers",
      add_user_description: "Beim Hinzufügen des Benutzers ist ein Fehler aufgetreten. Bitte versuche es erneut.",
      add_story_title: "Fehler beim Hinzufügen der Geschichte",
      add_story_description: "Beim Hinzufügen der Geschichte ist ein Fehler aufgetreten. Bitte versuche es erneut.",
      update_story_title: "Fehler beim Aktualisieren der Geschichte",
      update_story_description:
        "Beim Aktualisieren der Geschichte ist ein Fehler aufgetreten. Bitte versuche es erneut.",
      add_task_title: "Fehler beim Hinzufügen der Aufgabe",
      add_task_description: "Beim Hinzufügen der Aufgabe ist ein Fehler aufgetreten. Bitte versuche es erneut.",
      update_task_title: "Fehler beim Aktualisieren der Aufgabe",
      update_task_description: "Beim Aktualisieren der Aufgabe ist ein Fehler aufgetreten. Bitte versuche es erneut.",
      approve_deduction_title: "Fehler beim Genehmigen des Abzugs",
      approve_deduction_description: "Beim Genehmigen des Abzugs ist ein Fehler aufgetreten. Bitte versuche es erneut.",
      reject_deduction_title: "Fehler beim Ablehnen des Abzugs",
      reject_deduction_description: "Beim Ablehnen des Abzugs ist ein Fehler aufgetreten. Bitte versuche es erneut.",
      unauthorized_title: "Nicht autorisiert",
      unauthorized_edit_description: "Du hast keine Berechtigung, diesen Benutzer zu bearbeiten.",
      unauthorized_add_description: "Du hast keine Berechtigung, Benutzer hinzuzufügen.",
      unauthorized_story_description: "Du hast keine Berechtigung, Geschichten zu verwalten.",
      unauthorized_task_description: "Du hast keine Berechtigung, Aufgaben zu verwalten.",
      unauthorized_approve_description: "Du hast keine Berechtigung, Abzüge zu genehmigen.",
      unauthorized_reject_description: "Du hast keine Berechtigung, Abzüge abzulehnen.",
    },
  },
}

