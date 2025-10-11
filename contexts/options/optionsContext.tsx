import { createContext } from 'react';


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

interface ContextProps {
  typesUsers: {
    count: number | null;
    data: OptionDataTypesUsers[];
  };
  territories: {
    count: number | null;
    data: OptionDataTerritories[];
  };
  optionsUserType: () => Promise<boolean | undefined>;
  optionsTerritories: () => Promise<boolean | undefined>;
}

const optionsContext = createContext<ContextProps>({
  typesUsers: {
    count: null,
    data: []
  },
  territories: {
    count: null,
    data: []
  },
  optionsUserType: async () => false,
  optionsTerritories: async () => false,
});

export default optionsContext;