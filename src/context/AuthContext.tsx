import { createContext, useState, ReactNode } from 'react';

type User = {
  name: string;
  role: 'manager' | 'employee';
};

type AuthContextType = {
  user: User | null;
  loginAsManager: () => void;
  loginAsEmployee: () => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const loginAsManager = () => {
    setUser({ name: 'Esihenkilö', role: 'manager' });
  };

  const loginAsEmployee = () => {
    setUser({ name: 'Työntekijä', role: 'employee' });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loginAsManager, loginAsEmployee, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
