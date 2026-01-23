import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import React, { ReactNode, useReducer } from 'react';
import Toast from 'react-native-toast-message';

import personContext, { DataPerson } from '@/contexts/person/personContext'; // Importa interfaces
import personReducer, { initialState } from '@/contexts/person/personReducer'; // Usa initialState exportado

import clientAxios from '@/conf/axios/clientAxios';
import tokenAuth from '@/conf/axios/tokenAuth';

interface StateProps {
  children: ReactNode;
}

const PersonState: React.FC<StateProps> = ({ children }) => {
  const [state, dispatch] = useReducer(personReducer, initialState);  // Usa initialState del reducer
  const router = useRouter();

  const showToast = (message: string, type: 'error' | 'info' = 'error') => {
    Toast.show({
      type,
      text1: message,
      position: 'bottom',
      visibilityTime: 3000,
    });
  };

  const registerPerson = async (dataPerson: DataPerson): Promise<boolean> => {
    try {
      const tokenString = await AsyncStorage.getItem('token');
      if (tokenString) {
        const token = JSON.parse(tokenString);
        tokenAuth(token);
      } else {
        showToast("Error, error de validacion", 'error');
        return false;
      }

      const { data: result } = await clientAxios.post('/person/register', dataPerson);

      // Opcional: Si el registro retorna datos de la persona, actualiza el estado
      // if (result.data) {
      //   dispatch({ type: 'GET_PERSON', payload: result });
      // }

      showToast("Registro exitoso", 'info');  // Mejora: Feedback positivo
      return true;

    } catch (error: any) {
      const message = error?.response?.data?.message || 'Sin conexión o error en registro';
      showToast(message);
      dispatch({ type: 'ERROR_PERSON', payload: message });  // Nuevo: Dispatch error
      return false;
    }
  };

  const updatePersonData = async (id: number, personData: DataPerson): Promise<boolean> => {
    try {

      const tokenString = await AsyncStorage.getItem('token');
      if (tokenString) {
        const token = JSON.parse(tokenString);
        tokenAuth(token);
      } else {
        showToast("Error, error de validacion", 'error');
        return false;
      }

      const { data: result } = await clientAxios.put(`/person/update/${id}`, personData);

      showToast("Actualización exitosa", 'info');  // Mejora: Feedback positivo
      return true;

    } catch (error: any) {
      let message = error?.response?.data?.message || 'Sin conexión o error en registro';
      if (error.response && error.response.status === 404) {
        message = 'Error: La persona no existe en la base de datos.';
      }
      showToast(message);
      dispatch({ type: 'ERROR_PERSON', payload: message });  // Nuevo: Dispatch error
      return false;
    }
  };

  const existingPerson = async (idNumber: string): Promise<boolean> => {  // Corregido: Promise<boolean>
    try {
      const tokenString = await AsyncStorage.getItem('token');
      if (tokenString) {
        const token = JSON.parse(tokenString);
        tokenAuth(token);
      } else {
        showToast("Error, error de validacion", 'error');
        return false;
      }

      const { data: result } = await clientAxios.post('/person/existing', { idNumber });
      console.log(result)
      // Corregido: Dispatch con estructura completa {data, existing}
      // Asume que result = { data: personObj, existing: bool }
      dispatch({ type: 'GET_PERSON', payload: { data: result.data || {}, existing: result.existing || false } });

      return result.existing || false;

    } catch (error: any) {
      console.log("error----------------------------------------------------------");
      console.log(error);
      console.log("error----------------------------------------------------------");
      const message = error?.response?.data?.message || 'Sin conexión';
      showToast(message);
      dispatch({ type: 'ERROR_PERSON', payload: message });  // Nuevo: Dispatch error
      return false;
    }
  };

  const userDataCleansing = async (): Promise<boolean> => {
    dispatch({ type: 'USER_DATA_CLEANSING' });
    return true;
  };


  const getListOfPersons = async (): Promise<boolean> => {

    try {
      const tokenString = await AsyncStorage.getItem('token');
      if (tokenString) {
        const token = JSON.parse(tokenString);
        tokenAuth(token);
      } else {
        showToast("Error, error de validacion", 'error');
        return false;
      }

      const { data: result } = await clientAxios.post('/person/get-list');

      await dispatch({ type: 'GET_LIST_PERSONS', payload: { data: result } });

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
    <personContext.Provider
      value={{
        person: state.person,
        dataListPerson: state.dataListPerson,
        registerPerson,
        updatePersonData,
        existingPerson,
        userDataCleansing,
        getListOfPersons,
      }}
    >
      {children}
      <Toast />
    </personContext.Provider>
  );
};

export default PersonState;
