export const Routes = {
  ManagerHome: "ManagerHome",
  EmployeeHome: "EmployeeHome",

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
} as const;

export type RouteName = typeof Routes[keyof typeof Routes];
