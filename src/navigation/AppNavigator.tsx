import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from '../screens/LoginScreen';
import ManagerHome from '../screens/ManagerHome';
import EmployeeHome from '../screens/EmployeeHome';
import MenuScreen from "../screens/MenuScreen";
import ReportsScreen from "../screens/ReportsScreen";
import ComplaintsScreen from "../screens/ComplaintsScreen";
import StaffScreen from "../screens/StaffScreen";
import SettingsScreen from "../screens/SettingsScreen";
import WasteReportScreen from "../screens/WasteReportScreen";



const Stack = createNativeStackNavigator();

function ManagerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ManagerHome" component={ManagerHome} options={{ title: "Esihenkilö", headerTitleAlign: "center", }} />
      <Stack.Screen name="Reports" component={ReportsScreen} />
      <Stack.Screen name="Complaints" component={ComplaintsScreen} />
      <Stack.Screen name="Staff" component={StaffScreen} />
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

function EmployeeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="EmployeeHome" component={EmployeeHome} options={{ title: "Työntekijä", headerTitleAlign: "center", }} />
      <Stack.Screen name="WasteReport" component={WasteReportScreen} options={{ title: "Waste report", headerTitleAlign: "center", }} />
      <Stack.Screen name="Complaints" component={ComplaintsScreen} />
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

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