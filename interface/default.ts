// Interfaces para estado  
export interface FieldState {
  value: string;
  isValid: boolean | null;
}

// Interfaces para estado de fecha  
export interface DateFieldState {
  value: Date | null;
  isValid: boolean | null;
}







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
    title: string;
  };
  territory: {
    id: string;
    name: string;
    male: boolean;
  };
}