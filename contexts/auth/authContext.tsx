import { createContext } from 'react';

interface AuthContextProps {
  token: string | null;
  authenticated: boolean | null;
  user: any;  // Mejora: User interface
  type: any;
  isLoading: boolean;  // ← NUEVO
  logIn: (data: { username: string; password: string }) => Promise<boolean>;
  authenticatedUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

const authContext = createContext<AuthContextProps>({
  token: null,
  authenticated: null,
  user: null,
  type: null,
  isLoading: true,  // ← NUEVO: Default true
  logIn: async () => false,
  authenticatedUser: async () => {},
  signOut: async () => {},
});

export default authContext;