import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, TextInput } from 'react-native';
// Asume que tienes un componente Select/Picker o que usarás TextInput
import InputWithLabel from '@/components/molecules/inputWithLabel'; 
import SelectWithLabel from '@/components/molecules/selectWithLabel'; 
import { ProfileData } from '@/interface/profileTypes'; 

// Opciones de ejemplo para Selects
const MARITAL_STATUS_OPTIONS = [
    { title: 'Soltero/a', id: 'Soltero' },
    { title: 'Casado/a', id: 'Casado' },
    { title: 'Divorciado/a', id: 'Divorciado' },
    { title: 'Viudo/a', id: 'Viudo' },
];

const EDUCATION_OPTIONS = [
    { title: 'Primario', id: 'Primario' },
    { title: 'Secundario', id: 'Secundario' },
    { title: 'Universitario', id: 'Universitario' },
];

// Datos MOCK iniciales para simular la carga
const INITIAL_PROFILE: ProfileData = {
    id: 1,
    username: 'jperez',
    email: 'jperez@ejemplo.com',
    territory_id: 'T1',
    person: {
        id: 101,
        photo: 'https://via.placeholder.com/150',
        first_name: 'Juan',
        last_name: 'Pérez',
        gender: 'Masculino',
        marital_status: 'Soltero',
        phone: '555-1234',
        address: 'Calle Falsa 123',
        education_level: 'Universitario',
        birth_date: new Date(),
    }
};

const ProfileScreen: React.FC = () => {
    // Estado para los datos que se van a modificar
    const [editableData, setEditableData] = useState({
        email: INITIAL_PROFILE.email,
        marital_status: INITIAL_PROFILE.person.marital_status,
        phone: INITIAL_PROFILE.person.phone,
        address: INITIAL_PROFILE.person.address,
        education_level: INITIAL_PROFILE.person.education_level,
    });
    
    // Estado para la contraseña (manejo separado por seguridad)
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    // --- Handlers de Cambio ---
    const handleChange = (field: keyof typeof editableData, value: string) => {
        setEditableData(prev => ({ ...prev, [field]: value }));
    };

    const handlePasswordChange = (field: keyof typeof passwordData, value: string) => {
        setPasswordData(prev => ({ ...prev, [field]: value }));
    };

    // --- Handler de Guardar Datos Personales ---
    const handleSaveProfile = async () => {
        // Validación básica (puedes expandir esto)
        if (!editableData.email || !editableData.phone) {
            Alert.alert("Error", "El email y el teléfono son obligatorios.");
            return;
        }

        setIsLoading(true);
        // Aquí llamas a tu API: await api.updateProfile(editableData);
        console.log("Datos a enviar al backend:", editableData);

        setTimeout(() => { // Simulación de API
            setIsLoading(false);
            Alert.alert("Éxito", "Tu perfil ha sido actualizado.");
        }, 1500);
    };

    // --- Handler de Cambiar Contraseña ---
    const handleSavePassword = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmNewPassword) {
            Alert.alert("Error", "Verifica la contraseña actual y que las nuevas contraseñas coincidan.");
            return;
        }
        
        setIsLoading(true);
        // Aquí llamas a tu API: await api.changePassword(passwordData);
        console.log("Cambio de contraseña iniciado.");

        setTimeout(() => { // Simulación de API
            setIsLoading(false);
            Alert.alert("Éxito", "Tu contraseña ha sido actualizada.");
            setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        }, 1500);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.header}>Perfil de {INITIAL_PROFILE.username}</Text>

            {/* --- Sección 1: Foto y Datos Fijos (Identidad) --- */}
            <View style={styles.card}>
                <Image source={{ uri: INITIAL_PROFILE.person.photo }} style={styles.profileImage} />
                <TouchableOpacity style={styles.photoButton}>
                    <Text style={styles.photoButtonText}>Cambiar Foto</Text>
                </TouchableOpacity>

                <Text style={styles.name}>{`${INITIAL_PROFILE.person.first_name} ${INITIAL_PROFILE.person.last_name}`}</Text>
                <Text style={styles.staticDetail}>Cédula: V-22.555.888</Text>
                {/* <Text style={styles.staticDetail}>Cédula: {INITIAL_PROFILE.person.id_number}</Text> */}
                <Text style={styles.staticDetail}>Género: {INITIAL_PROFILE.person.gender}</Text>
                <Text style={styles.staticDetail}>Territorio: {INITIAL_PROFILE.territory_id}</Text>
            </View>

            {/* --- Sección 2: Datos Editables (Contacto y Personales) --- */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Información de Contacto y Personal</Text>

                {/* EMAIL */}
                <InputWithLabel
                    labelText="Email"
                    value={editableData.email}
                    setValue={(value) => handleChange('email', value)}
                    styleContainer={styles.inputContainer}
                />
                
                {/* TELÉFONO */}
                <InputWithLabel
                    labelText="Teléfono"
                    value={editableData.phone || ''}
                    setValue={(value) => handleChange('phone', value)}
                    styleContainer={styles.inputContainer}
                    keyboardType="phone-pad"
                />

                {/* DIRECCIÓN */}
                <InputWithLabel
                    labelText="Dirección"
                    value={editableData.address || ''}
                    setValue={(value) => handleChange('address', value)}
                    styleContainer={styles.inputContainer}
                />
                
                {/* ESTADO CIVIL (Select) */}
                <SelectWithLabel
                    labelText="Estado Civil"
                    theValue={editableData.marital_status || ''}
                    setValue={(value) => handleChange('marital_status', value)}
                    dataOption={MARITAL_STATUS_OPTIONS}
                    sample="Selecciona Estado Civil"
                    styleContainer={styles.inputContainer}
                />
                
                {/* NIVEL EDUCATIVO (Select) */}
                <SelectWithLabel
                    labelText="Nivel Educativo"
                    theValue={editableData.education_level || ''}
                    setValue={(value) => handleChange('education_level', value)}
                    dataOption={EDUCATION_OPTIONS}
                    sample="Selecciona Nivel Educativo"
                    styleContainer={styles.inputContainer}
                />

                <TouchableOpacity 
                    style={styles.saveButton} 
                    onPress={handleSaveProfile}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>{isLoading ? 'Guardando...' : 'Guardar Cambios'}</Text>
                </TouchableOpacity>
            </View>

            {/* --- Sección 3: Cambio de Contraseña (Manejo de Seguridad) --- */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Cambiar Contraseña</Text>

                <InputWithLabel
                    labelText="Contraseña Actual"
                    value={passwordData.currentPassword}
                    setValue={(value) => handlePasswordChange('currentPassword', value)}
                    password={true}
                    styleContainer={styles.inputContainer}
                />
                <InputWithLabel
                    labelText="Nueva Contraseña"
                    value={passwordData.newPassword}
                    setValue={(value) => handlePasswordChange('newPassword', value)}
                    password={true}
                    styleContainer={styles.inputContainer}
                />
                <InputWithLabel
                    labelText="Confirmar Nueva Contraseña"
                    value={passwordData.confirmNewPassword}
                    setValue={(value) => handlePasswordChange('confirmNewPassword', value)}
                    password={true}
                    styleContainer={styles.inputContainer}
                />

                <TouchableOpacity 
                    style={[styles.saveButton, styles.passwordButton]} 
                    onPress={handleSavePassword}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>Cambiar Contraseña</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

// --- ESTILOS ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
        borderWidth: 3,
        borderColor: '#007bff',
    },
    photoButton: {
        marginBottom: 20,
        padding: 8,
        borderRadius: 5,
        backgroundColor: '#eee',
    },
    photoButtonText: {
        color: '#007bff',
        fontWeight: '600',
    },
    name: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 5,
        color: '#333',
    },
    staticDetail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        alignSelf: 'flex-start',
        color: '#007bff',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 15,
    },
    saveButton: {
        backgroundColor: '#28a745', // Verde para guardar
        padding: 12,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    passwordButton: {
        backgroundColor: '#ffc107', // Amarillo para contraseña
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ProfileScreen;