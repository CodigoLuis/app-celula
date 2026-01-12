import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import React, { ReactNode, useReducer } from 'react';
import Toast from 'react-native-toast-message';

import educationContext, { DataEducation } from '@/contexts/education/educationContext'; // Importa interfaces
// import educationReducer, { initialState } from '@/contexts/education/educationReducer'; // Usa initialState exportado

import clientAxios from '@/conf/axios/clientAxios';
import tokenAuth from '@/conf/axios/tokenAuth';

interface StateProps {
  children: ReactNode;
}

const EducationState: React.FC<StateProps> = ({ children }) => {
  // const [state, dispatch] = useReducer(educationReducer, initialState);  // Usa initialState del reducer
  const router = useRouter();

  const showToast = (message: string, type: 'error' | 'info' = 'error') => {
    Toast.show({
      type,
      text1: message,
      position: 'bottom',
      visibilityTime: 3000,
    });
  };

  const registerEducation = async (dataEducation: DataEducation): Promise<boolean> => {

    try {
      const tokenString = await AsyncStorage.getItem('token');
      if (tokenString) {
        const token = JSON.parse(tokenString);
        tokenAuth(token);
      } else {
        showToast("Error, error de validacion", 'error');
        return false;
      }  
       console.log("holassssss 1")

      const { data: result } = await clientAxios.post('/education/create', dataEducation);
    console.log("holassssss2")

      // Opcional: Si el registro retorna datos de la persona, actualiza el estado
      // if (result.data) {
      //   dispatch({ type: 'GET_PERSON', payload: result });
      // }

      showToast("Registro exitoso", 'info');  // Mejora: Feedback positivo
      return true;

    } catch (error: any) {
    console.log("holasssss12222s")

      const message = error?.response?.data?.message || 'Sin conexión o error en registro';
      showToast(message);
      // dispatch({ type: 'ERROR_PERSON', payload: message });  // Nuevo: Dispatch error
      return false;
    }
  };

   const updateEducation = async (dataEducation: DataEducation): Promise<boolean> => {
    try {
      const tokenString = await AsyncStorage.getItem('token');
      if (tokenString) {
        const token = JSON.parse(tokenString);
        tokenAuth(token);
      } else {
        showToast("Error, error de validacion", 'error');
        return false;
      }

      const { data: result } = await clientAxios.post('/education/update', dataEducation);

      // Opcional: Si el registro retorna datos de la persona, actualiza el estado
      // if (result.data) {
      //   dispatch({ type: 'GET_PERSON', payload: result });
      // }

      showToast("Registro exitoso", 'info');  // Mejora: Feedback positivo
      return true;

    } catch (error: any) {
      const message = error?.response?.data?.message || 'Sin conexión o error en registro';
      showToast(message);
      // dispatch({ type: 'ERROR_PERSON', payload: message });  // Nuevo: Dispatch error
      return false;
    }
  };

 

  return (
    <educationContext.Provider
      value={{
        // person: state.person,
        // dataListPerson: state.dataListPerson,
        registerEducation,
        updateEducation,
      }}
    >
      {children}
      <Toast />
    </educationContext.Provider>
  );
};

export default EducationState;
