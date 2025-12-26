// Tipos existentes
export interface PersonData {
  id: number; // person_id
  first_name: string;
  last_name: string;
  id_number: string;
}

export interface CellPersonEntry {
  person: PersonData;
  person_id: number;
  member_type_id: string; // ID del tipo de miembro (ej: 'LD', 'M')
  active: boolean;
}


// /interface/types.ts

// Mapeo simple de territorios a colores para la franja lateral
export type TerritoryMap = {
    [key: string]: string; // Ejemplo: 'T1': '#FF5733'
};

// Mapeo de ejemplo:
export const TERRITORY_COLORS: TerritoryMap = {
    'T1': '#FF5733', // Rojo
    'T2': '#33FF57', // Verde
    'T3': '#3357FF', // Azul
    'T4': '#FF33A1', // Rosa
};

export interface Person {
    id: number;
    photo?: string;
    first_name: string;
    last_name: string;
    gender: string;
    marital_status?: string; // Nuevo dato a mostrar
    id_number: string;
    education_level?: string;
    phone?: string;
    address?: string; // Nuevo dato a mostrar
    birth_date?: Date;
    created_at: Date;
    updated_at?: Date;
    territory_id: string; // Campo nuevo para el territorio
    education: { leader_school: boolean; prophetic_school: boolean; consolidation_level: string; };
}

export interface PersonItemProps {
    person: Person;
    onEdit: (id: number) => void;
    onViewDetails: (id: number) => void;
    onAddEducation: (id: number) => void;
}