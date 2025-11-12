import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import React, { ReactNode, useReducer } from 'react';
import Toast from 'react-native-toast-message';

import userContext, { DataUser } from '@/contexts/user/userContext';
import userReducer, { initialState } from '@/contexts/user/userReducer';

import clientAxios from '@/conf/axios/clientAxios';
import tokenAuth from '@/conf/axios/tokenAuth';

interface StateProps {
  children: ReactNode;
}

const UserState: React.FC<StateProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);  // Usa initialState del reducer
  const router = useRouter();

  const showToast = (message: string, type: 'error' | 'info' = 'error') => {
    Toast.show({
      type,
      text1: message,
      position: 'bottom',
      visibilityTime: 3000,
    });
  };

  const registerUser = async (dataUser: DataUser): Promise<boolean> => {
    try {
      const tokenString = await AsyncStorage.getItem('token');
      if (tokenString) {
        const token = JSON.parse(tokenString);
        tokenAuth(token);
      } else {
        showToast("Error, error de validacion", 'error');
        return false;
      }

      const { data: result } = await clientAxios.post('/user/register', dataUser);

      // Opcional: Si el registro retorna datos de la persona, actualiza el estado
      // if (result.data) {
      //   dispatch({ type: 'GET_PERSON', payload: result });
      // }

      showToast("Registro exitoso", 'info');  // Mejora: Feedback positivo
      return true;

    } catch (error: any) {
      const message = error?.response?.data?.message || 'Sin conexión o error en registro';
      showToast(message);
      dispatch({ type: 'ERROR_USER', payload: message });  // Nuevo: Dispatch error
      return false;
    }
  };

  const existingNameUser = async (nameUser: string): Promise<boolean> => {
    try {
      const tokenString = await AsyncStorage.getItem('token');
      if (tokenString) {
        const token = JSON.parse(tokenString);
        tokenAuth(token);
      } else {
        showToast("Error, error de validacion", 'error');
        return false;
      }

      const { data: result } = await clientAxios.get('/user/existing-name', { "params": { nameUser } });

      dispatch({ type: 'GET_NAME_USER', payload: { data: result.data || {}, existing: result.existing || false } });

      return result.existing || false;

    } catch (error: any) {
      console.log("error----------------------------------------------------------");
      console.log(error);
      console.log("error----------------------------------------------------------");
      const message = error?.response?.data?.message || 'Sin conexión';
      showToast(message);
      dispatch({ type: 'ERROR_USER', payload: message });  // Nuevo: Dispatch error
      return false;
    }
  };

  const getListOfUser = async (): Promise<boolean> => {
    try {
      const tokenString = await AsyncStorage.getItem('token');
      if (tokenString) {
        const token = JSON.parse(tokenString);
        tokenAuth(token);
      } else {
        showToast("Error, error de validacion", 'error');
        return false;
      }

      const { data: result } = await clientAxios.post('/user/get-list');

      await dispatch({ type: 'GET_LIST_USER', payload: { data: result } });

      return true;

    } catch (error: any) {
      console.log("error----------------------------------------------------------");
      console.log(error);
      console.log("error----------------------------------------------------------");
      const message = error?.response?.data?.message || 'Sin conexión';
      showToast(message);
      dispatch({ type: 'ERROR_USER', payload: message });  // Nuevo: Dispatch error
      return false;
    }
  };

  return (
    <userContext.Provider
      value={{
        user: state.user,
        dataListUser: state.dataListUser,
        registerUser,
        existingNameUser,
        getListOfUser,
      }}
    >
      {children}
      <Toast />
    </userContext.Provider>
  );
};

export default UserState;


// {
//     "id": 1,
//     "username": "johnpastor",
//     "active": true,
//     "person": {
//         "firstName": "John",
//         "lastName": "Pastor",
//         "gender": "Male"
//     },
//     "userType": {
//         "title": "Pastor"
//     },
//     "territory": {
//         "id": "Z1",
//         "name": "Azul rey",
//         "male": true
//     }
// }
