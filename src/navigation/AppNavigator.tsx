import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./types";
import { Routes } from "./routes";

import LoginScreen from '../screens/LoginScreen';
import ManagerHome from '../screens/ManagerHome';
import EmployeeHome from '../screens/EmployeeHome';
import MenuScreen from "../screens/MenuScreen";
import ReportsScreen from "../screens/ReportsScreen";
import ComplaintsScreen from "../screens/ComplaintsScreen";
import StaffScreen from "../screens/StaffScreen";
import SettingsScreen from "../screens/SettingsScreen";
import WasteReportScreen from "../screens/WasteReportScreen";
import AddComplaintScreen from "../screens/AddComplaintScreen";
import ReportsFavoriteScreen from "../screens/ReportsFavoriteScreen";
import ComplaintsReplay from '../screens/ComplaintsReplay';
import StaffEdit from '../screens/StaffEdit';
import CompareScreen from "../screens/CompareScreen";



const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user } = useContext(AuthContext);


  if (!user) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer>
      {user.role === "manager" ? <ManagerStack /> : <EmployeeStack />}
    </NavigationContainer>
  );
}

function ManagerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={Routes.ManagerHome} component={ManagerHome} options={{ title: "Esihenkilö", headerTitleAlign: "center", }} />
      <Stack.Screen name={Routes.Reports} component={ReportsScreen} />
      <Stack.Screen name={Routes.ReportsFavorite} component={ReportsFavoriteScreen} options={{ title: "Reports - Create Favorite", headerTitleAlign: "center", }} />

      <Stack.Screen name={Routes.Complaints} component={ComplaintsScreen} options={{ title: "Complaints", headerTitleAlign: "center" }} />
      <Stack.Screen name={Routes.ComplaintsReplay} component={ComplaintsReplay} options={{ title: "Complaints - Replay", headerTitleAlign: "center" }} />
      <Stack.Screen name={Routes.AddComplaint} component={AddComplaintScreen} options={{ title: "Complaints - Add New Complaint", headerTitleAlign: "center" }} />

      <Stack.Screen name={Routes.Staff} component={StaffScreen} options={{ title: "Staff", headerTitleAlign: "center" }} />
      <Stack.Screen name={Routes.StaffEdit} component={StaffEdit} options={{ title: "Staff - Edit", headerTitleAlign: "center" }}/>

      <Stack.Screen name={Routes.Menu} component={MenuScreen} />
      <Stack.Screen name={Routes.Settings} component={SettingsScreen} />
      <Stack.Screen name={Routes.Compare} component={CompareScreen} options={{ title: "Compare data", headerTitleAlign: "center" }} />
    </Stack.Navigator>
  );
}

function EmployeeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={Routes.EmployeeHome} component={EmployeeHome} options={{ title: "Työntekijä", headerTitleAlign: "center", }} />
      <Stack.Screen name={Routes.WasteReport} component={WasteReportScreen} options={{ title: "Waste report", headerTitleAlign: "center", }} />
      <Stack.Screen name={Routes.Complaints} component={ComplaintsScreen} />
      <Stack.Screen name={Routes.ComplaintsList} component={ComplaintsReplay} options={{ title: "Valitukset", headerTitleAlign: "center" }} />
      <Stack.Screen name={Routes.AddComplaint} component={AddComplaintScreen} options={{ title: "Uusi valitus", headerTitleAlign: "center" }} />
      <Stack.Screen name={Routes.Menu} component={MenuScreen} />
      <Stack.Screen name={Routes.Settings} component={SettingsScreen} />
    </Stack.Navigator>
  );
}