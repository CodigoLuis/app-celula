import { createContext } from 'react';

export interface DataPerson {
  firstName: string;
  lastName: string;
  gender: string;
  idNumber: string;
  maritalStatus: string;
  phone: string;
  address: string;
}

export interface dataThePerson {
  id: null | number;  // Corregido: removido el | extra
  photo: null | string | undefined;
  firstName: null | string | undefined;
  lastName: null | string | undefined;
  gender: null | string | undefined;
  maritalStatus: null | string | undefined;
  idNumber: null | string | undefined;
  educationLevel: null | string | undefined;
  phone: null | string | undefined;
  address: null | string | undefined;
  birthDate: null | string | undefined;
  createdAt: null | string | undefined;
  updatedAt: null | string | undefined;
  isUser: null | boolean | undefined;
}

export interface ContextProps {
  person: {
    data: dataThePerson;
    existing: boolean;
  } | null;
  dataListPerson: dataThePerson[],
  registerPerson: (data: DataPerson) => Promise<boolean>;
  existingPerson: (data: string) => Promise<boolean>;
  userDataCleansing: () => Promise<boolean>;
  getListOfPersons: () => Promise<boolean>;
}

const personContext = createContext<ContextProps>({
  person: null,
  dataListPerson: [],
  registerPerson: async () => false,
  existingPerson: async () => false,
  userDataCleansing: async () => false,
  getListOfPersons: async () => false,

});

export default personContext;
