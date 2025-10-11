import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import React, { ReactNode, useEffect, useReducer, useState } from 'react';
import Toast from 'react-native-toast-message';

import authContext from '@/contexts/auth/authContext';
import authReducer from '@/contexts/auth/authReducer';

import clientAxios from '@/conf/axios/clientAxios';
import tokenAuth from '@/conf/axios/tokenAuth';

interface StateProps {
  children: ReactNode;
}

interface LoginData {
  username: string;
  password: string;
}

const initialState = {
  token: null as string | null,
  authenticated: null as boolean | null,
  user: null as any,  // ← Mejora: Usa User de reducer
  type: null as any,
  isLoading: true,  // ← NUEVO: true al inicio (verificación pendiente)
};

const AuthState: React.FC<StateProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [hasChecked, setHasChecked] = useState(false);  // ← NUEVO: Flag para verificación única
  const router = useRouter();

  const showToast = (message: string, type: 'error' | 'info' = 'error') => {
    Toast.show({
      type,
      text1: message,
      position: 'bottom',
      visibilityTime: 3000,
    });
  };

  const logIn = async (dataUser: LoginData): Promise<boolean> => {
    try {
      const { data: result } = await clientAxios.post('/auth/login', dataUser );
      await AsyncStorage.setItem('token', JSON.stringify(result.data.access_token));
      dispatch({ type: 'SUCCESSFUL_LOGIN', payload: result });
      return true;
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Sin conexión o error en login';
      showToast(message);
      dispatch({ type: 'LOGIN_ERROR' });  // ← Agregado: Dispatch para consistencia
      return false;
    }
  };

  const authenticatedUser = async () => {
    if (hasChecked) return;  
    try {
      const tokenString = await AsyncStorage.getItem('token');
      
      if (tokenString) {
        const token = JSON.parse(tokenString);
        tokenAuth(token);  
      } else {
        
        dispatch({ type: 'ERROR_GET_USER' });
        return;
      }

      const { data } = await clientAxios.get('/auth/authentication');
      dispatch({ type: 'GET_USER', payload: data });  
    
    } catch (error: any) {
      await AsyncStorage.multiRemove(['token']);
      console.log("error-----------------------------------");
      console.log(error);
      dispatch({ type: 'ERROR_GET_USER' });
      if (!error?.response) showToast('Sin conexión');
    } finally {
      setHasChecked(true);  
    }
  };

  // ← NUEVO: Llama UNA VEZ al montar el provider
  useEffect(() => {
    authenticatedUser();
  }, []);  // Dependencias vacías: Solo al inicio

  const signOut = async () => {
    await AsyncStorage.multiRemove(['token']);
    dispatch({ type: 'CERRAR_SESION' });
    showToast('Cerrando sesión', 'info');
    router.replace("/");
  };

  return (
    <authContext.Provider
      value={{
        token: state.token,
        authenticated: state.authenticated,
        user: state.user,
        type: state.type,
        isLoading: state.isLoading,  
        logIn,
        authenticatedUser,  
        signOut,
      }}
    >
      {children}
      <Toast />
    </authContext.Provider>
  );
};

export default AuthState;