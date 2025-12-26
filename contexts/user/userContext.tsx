import { createContext } from 'react';

export interface DataUser {
  username: string;
  password: string;
  // active: boolean;
  person: number | null;
  userType: string;
  territory: string;
}

// interface ListUser {
//   id: number;
//   username: string;
//   email?: string;
//   active: boolean;
//   created_at: string;
//   person: {
//     photo?: string;
//     firstName: string;
//     lastName: string;
//     gender: string;
//     maritalStatus?: string;
//     idNumber: string;
//     educationLevel?: string;
//     phone?: string;
//     address?: string;
//     birthDate?: string;
//   };
//   userType: { title: string };
//   territory: { name: string; color: string };
// }


export interface listUser {
  id: number;
  username: string;
  active: boolean;
  person: {
    firstName: string;
    lastName: string;
    gender: string;
  };
  userType: {
    id: number;
    title: string;
  };
  territory: {
    id: number;
    name: string;
    male: boolean;
    color: string;
  };
}

export interface dataTheUser {
  username: null | string | undefined;
}

export interface ContextProps {
  user: {
    data: dataTheUser;
    existing: boolean;
  } | null;
  dataListUser: listUser[];
  registerUser: (data: DataUser) => Promise<boolean>;
  existingNameUser: (data: string) => Promise<boolean>;
  getListOfUser: () => Promise<boolean>;
}

const userContext = createContext<ContextProps>({
  user: null,
  dataListUser: [],
  registerUser: async () => false,
  existingNameUser: async () => false,
  getListOfUser: async () => false,
});

export default userContext;
