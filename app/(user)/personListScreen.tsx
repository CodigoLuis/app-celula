import React, { useState, useMemo, useContext, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Platform, Alert } from 'react-native';
// Componentes
import InputWithLabel from '@/components/molecules/inputWithLabel';
import SelectWithLabel from '@/components/molecules/selectWithLabel';
import PersonItem from '../../components/templates/personItem';
import PersonDetailModal from '../../components/templates/PersonDetailModal';
// Interfaces
import { Person } from '@/interface/types';
import { FieldState } from '@/interface/default';
//ContextS
import personContext from '@/contexts/person/personContext';


const MOCK_PERSONS: Person[] = [
    {
        id: 1, first_name: 'Ana', last_name: 'Pérez', gender: 'Femenino',
        marital_status: 'Casada', education_level: 'Universitario',
        id_number: '12345678', phone: '555-1234', address: 'Calle 1, Sector A',
        created_at: new Date(), territory_id: 'T1',
        education: { leader_school: true, prophetic_school: false, consolidation_level: 'L2' }
    },
    {
        id: 2, first_name: 'Juan', last_name: 'Gómez', gender: 'Masculino',
        marital_status: 'Soltero', education_level: 'Secundario',
        id_number: '87654321', phone: '555-5678', address: 'Av. Principal, Zona B',
        created_at: new Date(), territory_id: 'T2',
        education: { leader_school: false, prophetic_school: false, consolidation_level: 'P' }
    },
];

const PersonListScreen: React.FC = () => {
    //contexts
    const { getListOfPersons, dataListPerson } = useContext(personContext);

    const [persons, setPersons] = useState(dataListPerson);
    const [searchText, setSearchText] = useState<FieldState>({ value: '', isValid: null });
    const [filterGender, setFilterGender] = useState<FieldState>({ value: '', isValid: null });
    const [filterEducation, setFilterEducation] = useState<FieldState>({ value: '', isValid: null });

    // ESTADOS PARA LA MODAL
    const [selectedPerson, setSelectedPerson] = useState({});
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        getListOfPersons();
    }, []);

    // Opciones para los selectores
    const genderOptions = [{ title: 'Masculino', id: 'Male' }, { title: 'Femenino', id: 'Female' }];
    const educationOptions = [
        { title: 'Primario', id: 'Primario' },
        { title: 'Secundario', id: 'Secundario' },
        { title: 'Universitario', id: 'Universitario' }
    ];

    const filteredPersons = useMemo(() => {
        setPersons(dataListPerson);
        return persons.filter((person) => {
            const searchMatch =
                person.firstName?.toLowerCase().includes(searchText.value.toLowerCase()) ||
                person.lastName?.toLowerCase().includes(searchText.value.toLowerCase()) ||
                person.idNumber?.includes(searchText.value);
            const genderMatch = !filterGender.value || person.gender === filterGender.value;
            const educationMatch = !filterEducation.value || person.educationLevel === filterEducation.value;
            return searchMatch && genderMatch && educationMatch;
        });

    }, [searchText.value, filterGender.value, filterEducation.value, persons, dataListPerson]);


    // FUNCIONES DE ACCIÓN
    const handleViewDetails = (id: number) => {
        const person = persons.find(p => p.id === id);
        if (person) {
            setSelectedPerson(person);
            setModalVisible(true);
        }
    };

    const handleUpdatePerson = async (updatedData: Person) => {
        // Aquí simulas la petición al servidor (PUT/PATCH)
        try {
            const newPersons = persons.map(p => p.id === updatedData.id ? updatedData : p);
            // setPersons(newPersons);
            Alert.alert("Éxito", "Datos de la persona actualizados.");
            setModalVisible(false);
        } catch (error) {
            Alert.alert("Error", "No se pudo actualizar.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>📋 Listado de Personas</Text>

            <View style={styles.shadowedViewContent}>
                <InputWithLabel
                    labelText="Buscador (Nombre, Apellido o C.I)"
                    value={searchText.value}
                    setValue={(val) => setSearchText({ value: val, isValid: null })}
                    styleContainer={{ marginTop: 0, marginBottom: 20 }}
                    styleInput={styles.inputStyle}
                    styleLabel={styles.labelStyle}
                />

                <View style={styles.pickerRow}>
                    <SelectWithLabel
                        labelText={'Género'}
                        theValue={filterGender.value}
                        setValue={(val) => setFilterGender({ value: val, isValid: null })}
                        sample={'Todos'}
                        dataOption={genderOptions}
                        styleContainer={{ width: '48%' }}
                        styleLabel={styles.labelStyle}
                        stylePickerContainer={styles.pickerContainerStyle}
                    />
                    <SelectWithLabel
                        labelText={'Educación'}
                        theValue={filterEducation.value}
                        setValue={(val) => setFilterEducation({ value: val, isValid: null })}
                        sample={'Todos'}
                        dataOption={educationOptions}
                        styleContainer={{ width: '48%' }}
                        styleLabel={styles.labelStyle}
                        stylePickerContainer={styles.pickerContainerStyle}
                    />
                </View>
            </View>

            <FlatList
                data={filteredPersons}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <PersonItem
                        person={item}
                        onViewDetails={handleViewDetails}
                    // onEdit={handleViewDetails} // Reutilizamos detalle para abrir la misma modal
                    // onAddEducation={() => Alert.alert("Educación", "Ir a módulo académico")}
                    />
                )}
                ListEmptyComponent={<Text style={styles.noResults}>Sin coincidencias.</Text>}
                contentContainerStyle={styles.listContent}
            />

            {/* MODAL DE DETALLES Y EDICIÓN */}
            <PersonDetailModal
                visible={modalVisible}
                person={selectedPerson}
                onClose={() => setModalVisible(false)}
                onSave={handleUpdatePerson}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
    titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#1a1a1a' },
    shadowedViewContent: {
        backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 15, borderRadius: 12, marginBottom: 25,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 5 },
            android: { elevation: 4 },
        }),
    },
    inputStyle: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 14, height: 40 },
    labelStyle: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 5 },
    pickerRow: { flexDirection: 'row', justifyContent: 'space-between' },
    pickerContainerStyle: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8 },
    listContent: { paddingBottom: 20 },
    noResults: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#999' },
});

export default PersonListScreen;