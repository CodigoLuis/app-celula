// interface/profileTypes.ts

export interface ProfileData {
    // Datos de Users
    id: number;
    username: string; // Mostrar, pero no modificar
    email: string; // Modificable
    territory_id: string; // Mostrar
    
    // Datos de Persons (Anidados)
    person: {
        id: number;
        photo?: string; // Modificable
        first_name: string; // Mostrar
        last_name: string; // Mostrar
        gender: string; // Mostrar
        marital_status: string; // Modificable
        phone?: string; // Modificable
        address?: string; // Modificable
        education_level?: string; // Modificable
        birth_date: Date; // Mostrar
    }
}