import { AuthProvider } from "./src/context/AuthContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import { LanguageProvider } from "./src/context/LanguageContext";
import AppNavigator from "./src/navigation/AppNavigator";
import "./src/location/backgroundTask";
import { LocationProvider } from "./src/context/LocationContext";


export default function App() {
  return (
    <LocationProvider>
      <AuthProvider>
        <LanguageProvider>
          <ThemeProvider> 
            <AppNavigator />
          </ThemeProvider>
        </LanguageProvider>
      </AuthProvider>
    </LocationProvider>
  );
}