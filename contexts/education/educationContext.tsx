import { createContext } from 'react';

export interface DataEducation {
  id: number;
  consolidationLevel: string;
  leaderSchool: boolean;
  propheticSchool: boolean;
  person: number;
}

export interface ContextProps {
  // person: {
  //   data: dataThePerson;
  //   existing: boolean;
  // } | null;
  // dataListPerson: dataThePerson[],
  registerEducation: (data: DataEducation) => Promise<boolean>;
  updateEducation: (data: DataEducation) => Promise<boolean>;
}

const educationContext = createContext<ContextProps>({
  // person: null,
  // dataListPerson: [],
  registerEducation: async () => false,
  updateEducation: async () => false,

});

export default educationContext;
