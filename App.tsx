import { AuthProvider } from "./src/context/AuthContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import { LanguageProvider } from "./src/context/LanguageContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider> 
          <AppNavigator />
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}