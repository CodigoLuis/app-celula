// import { dataThePerson } from './educationContext'; // Reutilizando la interfaz exportada

type Action =
  // | { type: 'GET_PERSON'; payload: { data: dataThePerson; existing: boolean } }
  | { type: 'ERROR_PERSON'; payload?: string }  // Nuevo: para errores
  | { type: string; payload?: any };  // Mantenido como fallback, pero usa los específicos

interface State {
  person: {

  };
  error: string | null;
  // dataListPerson: dataThePerson[];
}

const initialState: State = {
  person: {},
  // { data: {} as dataThePerson, existing: false },
  error: null,
  // dataListPerson: [],
};

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
   
    // case 'ERROR_PERSON': {
    //   return {
    //     ...state,
    //     person: { data: {} as dataThePerson, existing: false },
    //     error: action.payload || 'Error desconocido',
    //   };
    // }

    default:
      return state;
  }
};

export default reducer;
export { initialState };

