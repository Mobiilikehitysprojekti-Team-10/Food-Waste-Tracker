import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import ManagerHome from '../screens/ManagerHome';
import EmployeeHome from '../screens/EmployeeHome';

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <LoginScreen />;
  }

  if (user.role === 'manager') {
    return <ManagerHome />;
  }

  return <EmployeeHome />;
}
