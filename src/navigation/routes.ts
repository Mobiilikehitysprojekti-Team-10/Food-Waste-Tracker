export const Routes = {
  ManagerHome: "ManagerHome",
  EmployeeHome: "EmployeeHome",

  Login: "Login",
  Notifications: "Notifications",

  Reports: "Reports",
  ReportsFavorite: "ReportsFavorite",
  Compare: "Compare",

  WasteReport: "WasteReport",
  Complaints: "Complaints",
  ComplaintsReplay: "ComplaintsReplay",
  AddComplaint: "AddComplaint",
  Staff: "Staff",
  StaffEdit: "StaffEdit",
  Menu: "Menu",
  Settings: "Settings",
  QuickNotes: "QuickNotes",
} as const;

export type RouteName = typeof Routes[keyof typeof Routes];
