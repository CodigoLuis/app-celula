import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Platform, StyleSheet, Text, View, FlatList, Modal, TouchableOpacity } from 'react-native';
import InputWithLabel from '@/components/molecules/inputWithLabel';
import SelectWithLabel from '@/components/molecules/selectWithLabel';
import optionsContext from '@/contexts/options/optionsContext';
import userContext from '@/contexts/user/userContext';
import { FieldState } from '@/interface/default'; 

// Componentes
import UserListItem from '../../components/templates/userListItem'; 
import UserDetailScreen from '../../components/templates/userDetailScreen'; 

const ViewUserDataList: React.FC = () => {
    const [territorie, setTerritorie] = useState<FieldState>({ value: '', isValid: false });
    const [userType, setUserType] = useState<FieldState>({ value: '', isValid: false });
    const [searchData, setSearchData] = useState<FieldState>({ value: '', isValid: false });
    
    // --- ESTADOS PARA EL DETALLE ---
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const { getListOfUser, dataListUser } = useContext(userContext);
    const { typesUsers, territories, optionsUserType, optionsTerritories } = useContext(optionsContext);

    useEffect(() => {
        optionsUserType();
        getListOfUser();
        optionsTerritories();
    }, []);

    const setSearch = (value: string) => setSearchData({ value, isValid: null });
    const changeTerritorie = (value: string) => setTerritorie({ value, isValid: null });
    const changeTypeUser = (value: string) => setUserType({ value, isValid: null });

    const filteredData = useMemo(() => {
        if (!dataListUser || dataListUser.length === 0) return [];
        return dataListUser.filter((item) => {
            const searchTextLower = searchData.value.toLowerCase();
            const matchesText =
                item.username.toLowerCase().includes(searchTextLower) ||
                (item.person && item.person.firstName.toLowerCase().includes(searchTextLower)) ||
                (item.person && item.person.lastName.toLowerCase().includes(searchTextLower));

            const matchesTerritorie = !territorie.value || String(item.territory.id) === territorie.value;
            const matchesUserType = !userType.value || String(item.userType.id) === userType.value;

            return matchesText && matchesTerritorie && matchesUserType;
        });
    }, [dataListUser, searchData.value, territorie.value, userType.value]);

    // --- LÓGICA PARA VER DETALLES ---
    const handleViewDetails = (userId: number) => {
        const user = dataListUser.find(u => u.id === userId);
        if (user) {
            setSelectedUser(user);
            setModalVisible(true);
        } else {
            setSelectedUser(null);
            setModalVisible(false);

            //añadir un menjase de error
        }
    };

    const arrayConstructorTerritories = () => {
        let dataArray: { title: string; id: string }[] = [];
        for (const element of territories.data) {
            const value1 = `${element.name} - ${element.male === true ? "Hombres" : "Mujeres"}`;
            dataArray.push({ "title": value1, "id": String(element.id) })
        }
        return dataArray;
    }

    const arrayConstructorTypeUser = () => {
        let dataArray: { title: string; id: string }[] = [];
        for (const element of typesUsers.data) {
            dataArray.push({ "title": element.title, "id": String(element.id) })
        }
        return dataArray;
    }

    // Dentro de ViewUserDataList
const handleUpdateUser = async (updatedFields: any) => {
    // Aquí invocas la función de tu userContext
    // Ejemplo: await updateUserInfo(selectedUser.id, updatedFields);
    console.log("Datos a enviar al backend:", updatedFields);
    
    // Opcional: Recargar la lista para ver los cambios
    // getListOfUser();
};

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>👥 Usuarios Registrados</Text>

            {/* --- Filtros --- */}
            <View style={styles.shadowedViewContent}>
                <InputWithLabel
                    labelText="Buscador (Usuario, Nombre o Apellido)"
                    value={searchData.value}
                    setValue={setSearch}
                    styleContainer={{ marginTop: 0, marginBottom: 20 }}
                    styleInput={styles.inputStyle}
                    styleLabel={styles.labelStyle}
                />

                <View style={styles.pickerRow}>
                    <SelectWithLabel
                        labelText={'Territorio'}
                        theValue={territorie.value}
                        setValue={changeTerritorie}
                        sample={'Seleccionar Territorio'}
                        dataOption={arrayConstructorTerritories()}
                        styleContainer={{ width: '48%' }}
                        styleLabel={styles.labelStyle}
                        stylePickerContainer={styles.pickerContainerStyle}
                    />
                    <SelectWithLabel
                        labelText={'Tipo de usuario'}
                        theValue={userType.value}
                        setValue={changeTypeUser}
                        sample={'Seleccionar Tipo'}
                        dataOption={arrayConstructorTypeUser()}
                        styleContainer={{ width: '48%' }}
                        styleLabel={styles.labelStyle}
                        stylePickerContainer={styles.pickerContainerStyle}
                    />
                </View>
            </View>

            {/* --- Lista --- */}
            {filteredData.length === 0 ? (
                <Text style={styles.noResults}>No se encontraron resultados.</Text>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <UserListItem
                            user={item}
                            territoryColor={item.territory.color || '#9e9e9e'}
                            onViewDetails={handleViewDetails}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                />
            )}

            {/* --- MODAL DE DETALLES --- */}
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{ flex: 1 }}>
                    {/* Botón para cerrar el modal */}
                    <TouchableOpacity 
                        style={styles.closeButton} 
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.closeButtonText}>✕ Cerrar</Text>
                    </TouchableOpacity>
                    
                    {selectedUser && <UserDetailScreen user={selectedUser} onUpdate={handleUpdateUser} />}
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#1a1a1a',
    },
    listContent: {
        paddingBottom: 20,
    },
    noResults: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#999',
    },
    shadowedViewContent: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 12,
        marginBottom: 25,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 5 },
            android: { elevation: 4 },
        }),
    },
    inputStyle: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 14, height: 40 },
    labelStyle: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 5 },
    pickerRow: { flexDirection: 'row', justifyContent: 'space-between' },
    pickerContainerStyle: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8 },
    
    // Estilos para el botón de cerrar modal
    closeButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 20,
        right: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    }
});

export default ViewUserDataList;