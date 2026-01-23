import type { Routes } from "./routes";

export type RootStackParamList = {
  [Routes.ManagerHome]: undefined;
  [Routes.EmployeeHome]: undefined;

  [Routes.Reports]: undefined;
  [Routes.ReportsFavorite]: undefined;
  [Routes.Compare]: undefined;

  [Routes.WasteReport]: undefined;
  [Routes.Complaints]: undefined;
  [Routes.ComplaintsReplay]: undefined;
  [Routes.ComplaintsList]: undefined;
  [Routes.AddComplaint]: undefined;
  [Routes.Staff]: undefined;
  [Routes.StaffEdit]: undefined;
  [Routes.Menu]: undefined;
  [Routes.Settings]: undefined;
};
