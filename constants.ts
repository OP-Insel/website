// WICHTIG: Diese Anmeldedaten sind nur Beispiele und sollten in einer echten Anwendung
// sicher in einer Datenbank gespeichert werden!

export const RANK_CREDENTIALS = {
  owner: {
    username: "owner_minecraft",
    password: "OwnerSecure123!",
    permissions: ["all", "manage_points", "manage_users", "view_all"],
  },
  coowner: {
    username: "coowner_minecraft",
    password: "CoOwnerSecure123!",
    permissions: ["manage_points", "manage_users", "view_all"],
  },
  developer: {
    username: "dev_minecraft",
    password: "DevSecure123!",
    permissions: ["view_all", "suggest_points"],
  },
  admin: {
    username: "admin_minecraft",
    password: "AdminSecure123!",
    permissions: ["view_all", "suggest_points"],
  },
  jradmin: {
    username: "jradmin_minecraft",
    password: "JrAdminSecure123!",
    permissions: ["view_team", "suggest_points"],
  },
  moderator: {
    username: "mod_minecraft",
    password: "ModSecure123!",
    permissions: ["view_team", "suggest_points"],
  },
  jrmoderator: {
    username: "jrmod_minecraft",
    password: "JrModSecure123!",
    permissions: ["view_team", "suggest_points"],
  },
  srbuilder: {
    username: "srbuilder_minecraft",
    password: "SrBuilderSecure123!",
    permissions: ["view_team", "suggest_points"],
  },
  builder: {
    username: "builder_minecraft",
    password: "BuilderSecure123!",
    permissions: ["view_team", "suggest_points"],
  },
  supporter: {
    username: "supporter_minecraft",
    password: "SupporterSecure123!",
    permissions: ["view_team", "suggest_points"],
  },
  jrsupporter: {
    username: "jrsupporter_minecraft",
    password: "JrSupporterSecure123!",
    permissions: ["view_team", "suggest_points"],
  },
}

