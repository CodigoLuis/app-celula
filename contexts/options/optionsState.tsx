import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import React, { ReactNode, useReducer } from 'react';
import Toast from 'react-native-toast-message';

import optionsContext from '@/contexts/options/optionsContext';
import optionsReducer from '@/contexts/options/optionsReducer';

import clientAxios from '@/conf/axios/clientAxios';
import tokenAuth from '@/conf/axios/tokenAuth';

interface StateProps {
  children: ReactNode;
}

interface OptionDataTypesUsers {
  id: string;
  description: string;
  title: string;
}

interface OptionDataTerritories {
  id: string;
  name: string;
  male: boolean;
}

const initialState = {
  typesUsers: {
    count: null,
    data: [] as OptionDataTypesUsers[],
  },
  territories: {
    count: null,
    data: [] as OptionDataTerritories[],
  },
};

const OptionsState: React.FC<StateProps> = ({ children }) => {
  const [state, dispatch] = useReducer(optionsReducer, initialState);
  const router = useRouter();

  const showToast = (message: string, type: 'error' | 'info' = 'error') => {
    Toast.show({
      type,
      text1: message,
      position: 'bottom',
      visibilityTime: 3000,
    });
  };

  const optionsUserType = async () => {
    try {
      const tokenString = await AsyncStorage.getItem('token');
      if (tokenString) {
        const token = JSON.parse(tokenString);
        tokenAuth(token);
      } else {
        dispatch({ type: 'ERROR_TOKEN' });
        return;
      }

      const { data } = await clientAxios.get('/options/user-types');
      dispatch({ type: 'GET_TYPES_USERS', payload: data });

      return true;

    } catch (error: any) {
      // await AsyncStorage.multiRemove(['token']);
      console.log("error------------------------------------------------------------------");
      console.log(error);
      // dispatch({ type: 'ERROR_GET_USER' });
      // if (!error?.response) showToast('Sin conexión');
      return false;
    }

  };

  const optionsTerritories = async () => {
    try {
      const tokenString = await AsyncStorage.getItem('token');
      if (tokenString) {
        const token = JSON.parse(tokenString);
        tokenAuth(token);
      } else {
        dispatch({ type: 'ERROR_GET_USER' });
        return;
      }

      const { data } = await clientAxios.get('/options/territories');
      dispatch({ type: 'GET_TERRITORIES', payload: data });

      return true;

    } catch (error: any) {
      // await AsyncStorage.multiRemove(['token']);
      console.log("error------------------------------------------------------------------");
      console.log(error);
      // dispatch({ type: 'ERROR_GET_USER' });
      // if (!error?.response) showToast('Sin conexión');
      return false;
    }

  };

  return (
    <optionsContext.Provider
      value={{
        typesUsers: state.typesUsers,
        territories: state.territories,
        optionsUserType,
        optionsTerritories,
      }}
    >
      {children}
      <Toast />
    </optionsContext.Provider>
  );
};

export default OptionsState;