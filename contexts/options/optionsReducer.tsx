import AsyncStorage from '@react-native-async-storage/async-storage';

type Action =
  | { type: 'SUCCESSFUL_LOGIN'; payload: any }
  | { type: 'ERROR_GET_USER'; payload: any }
  | { type: string; payload?: any };


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

interface State {
  typesUsers: {
    count: number | null;
    data: OptionDataTypesUsers[];
  };
  territories: {
    count: number | null;
    data: OptionDataTerritories[];
  };
}

const reducer = (state: State, action: Action): State => {

  switch (action.type) {

    case 'GET_TYPES_USERS': {

      return {
        ...state,
        typesUsers: {
          count: action.payload.count,
          data: action.payload.data
        },
      };
    }

    case 'GET_TERRITORIES': {

      return {
        ...state,
        territories: {
          count: action.payload.count,
          data: action.payload.data
        },
      };
    }

    case 'ERROR_TOKEN': {

      AsyncStorage.multiRemove(['token']);
      return {
        ...state,
        typesUsers: {
          count: null,
          data: []
        },
        territories: {
          count: null,
          data: []
        },
      };
    }

    default:
      return state;
  }

};

export default reducer;