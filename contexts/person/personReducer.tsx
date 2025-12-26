import { dataThePerson } from './personContext'; // Reutilizando la interfaz exportada

type Action =
  | { type: 'GET_PERSON'; payload: { data: dataThePerson; existing: boolean } }
  | { type: 'ERROR_PERSON'; payload?: string }  // Nuevo: para errores
  | { type: string; payload?: any };  // Mantenido como fallback, pero usa los específicos

interface State {
  person: {
    data: dataThePerson;
    existing: boolean;
  };
  error: string | null;
  dataListPerson: dataThePerson[];
}

const initialState: State = {
  person: { data: {} as dataThePerson, existing: false },
  error: null,
  dataListPerson: [],
};

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'GET_PERSON': {

      return {
        ...state,
        person: {
          data: action.payload.data,
          existing: action.payload.existing,
        },
        error: null,
      };
    }

    case 'USER_DATA_CLEANSING': {
      return {
        ...state,
        person: { data: {} as dataThePerson, existing: false },
        error: null,
      };
    }

    case 'GET_LIST_PERSONS': {

      return {
        ...state,
        dataListPerson: action.payload.data,
        error: null,
      };
    }

    case 'ERROR_PERSON': {
      return {
        ...state,
        person: { data: {} as dataThePerson, existing: false },
        error: action.payload || 'Error desconocido',
      };
    }
    default:
      return state;
  }
};

export default reducer;
export { initialState };

