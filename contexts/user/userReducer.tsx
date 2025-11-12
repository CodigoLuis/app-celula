import { dataTheUser, listUser } from './userContext'; // Reutilizando la interfaz exportada

type Action =
  | { type: 'GET_NAME_USER'; payload: { data: dataTheUser; existing: boolean } }
  | { type: 'GET_LIST_USER'; payload: { data: dataTheUser; existing: boolean } }
  | { type: 'ERROR_USER'; payload?: string }  // Nuevo: para errores
  | { type: string; payload?: any };  // Mantenido como fallback, pero usa los específicos


interface State {
  user: {
    data: dataTheUser;
    existing: boolean;
  };
  error: string | null;
  dataListUser: listUser[];
}

const initialState: State = {
  user: { data: {} as dataTheUser, existing: false },
  error: null,
  dataListUser: [],
};

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'GET_NAME_USER': {

      return {
        ...state,
        user: {
          data: action.payload.data,
          existing: action.payload.existing,
        },
        error: null,
      };
    }

    case 'GET_LIST_USER': {

      return {
        ...state,
        dataListUser: action.payload.data,
        error: null,
      };
    }

    case 'ERROR_USER': {
      return {
        ...state,
        user: { data: {} as dataTheUser, existing: false },
        error: action.payload || 'Error desconocido',
      };
    }
    default:
      return state;
  }
};

export default reducer;
export { initialState };

