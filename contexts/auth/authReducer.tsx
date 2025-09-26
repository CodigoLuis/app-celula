// import AsyncStorage from '@react-native-async-storage/async-storage';

type Action =
  | { type: 'SUCCESSFUL_LOGIN'; payload: any }
  | { type: 'GET_USER'; payload: any }
  | { type: 'ERROR_GET_USER' }
  | { type: 'CERRAR_SESION' }
  | { type: 'LOGIN_ERROR' }
  | { type: 'REGISTRO_ERROR' }
  | { type: string; payload?: any };

// Mejora: Tipa user y type (ajusta según tu backend)
interface User {
  firstName: string;
  lastName: string;
}

type UserType = 'Pastor' | 'Admin' | null;  // Ejemplos; expande

interface State {
  token: string | null;
  authenticated: boolean | null;
  user: User | null;
  type: UserType;
  isLoading: boolean;  // ← NUEVO: Para verificación
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SUCCESSFUL_LOGIN': {
      return {
        ...state,
        token: action.payload.data.access_token,
        authenticated: true,
        type: action.payload.data.type,
        user: {
          firstName: action.payload.data.person.firstName,
          lastName: action.payload.data.person.lastName,
        },
        isLoading: false,  // ← NUEVO: Fin de loading
      };
    }

    case 'GET_USER': {
      // Ajuste: Response de /auth/authentication es { firstName, lastName, type } (sin 'data.person')
      return {
        ...state,
        authenticated: true,
        type: action.payload.type,  // ← Fix: Directo de payload (no .data.type)
        user: {
          firstName: action.payload.firstName,  // ← Fix: Directo
          lastName: action.payload.lastName,
        },
        isLoading: false,  // ← NUEVO
      };
    }

    case 'ERROR_GET_USER': {
      return {
        ...state,
        authenticated: false,  // ← Cambio: false en lugar de false (consistencia)
        type: null,
        user: null,
        isLoading: false,  // ← NUEVO
      };
    }

    case 'CERRAR_SESION':
    case 'LOGIN_ERROR':
    case 'REGISTRO_ERROR': {
      return {
        ...state,
        token: null,
        authenticated: false,  // ← Cambio: false (no null, para redirección clara)
        user: null,
        type: null,
        isLoading: false,  // ← NUEVO
      };
    }

    default:
      return state;
  }
};

export default reducer;