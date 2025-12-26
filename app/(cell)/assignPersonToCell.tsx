import React, { useState, useCallback, useContext } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    TouchableOpacity, 
    Alert, 
    Platform,
    ScrollView // Para manejar mejor el contenido superior
} from 'react-native';
// Nota: Se reemplaza 'Button' por TouchableOpacity estilizado para mejor control visual

import ModalForSelectingPerson from '../../components/templates/modalForSelectingPerson'; // Nuevo nombre para la Modal
import { FieldState } from '../../interface/default';
import { CellPersonEntry } from '../../interface/types';
import SelectWithLabel from '@/components/molecules/selectWithLabel';
import optionsContext from '@/contexts/options/optionsContext';

// ** SIMULACIÓN DE DATOS **
const CELL_ID_ACTUAL = 42;
const validateBoolean = (value: string): boolean => !!value;

// --- CONSTANTES DE ESTILO ---
const PRIMARY_COLOR = '#1A237E'; // Azul oscuro/Indigo
const ACCENT_COLOR = '#4CAF50'; // Verde
const DANGER_COLOR = '#E53935'; // Rojo
const DISABLED_COLOR = '#CCCCCC';

// --- COMPONENTE MEJORADO DE ÍTEM DE LISTA ---
const PersonListItem: React.FC<{ item: CellPersonEntry, onRemove: (personId: number) => void }> = ({ item, onRemove }) => {
    // Simulación: Determinar el rol/tipo de miembro para mostrar en el chip
    const getMemberTypeLabel = (id: number | string) => {
        switch (id) {
            case 1: return { label: 'Líder', color: PRIMARY_COLOR };
            case 2: return { label: 'Discípulo', color: '#007BFF' };
            default: return { label: 'Miembro', color: '#888' };
        }
    };

    const type = getMemberTypeLabel(item.member_type_id);

    return (
        <View style={improvedStyles.itemContainer}>
            <View style={improvedStyles.itemInfo}>
                <Text style={improvedStyles.itemNombre}>
                    {item.person.first_name} {item.person.last_name}
                </Text>
                <View style={[improvedStyles.typeChip, { backgroundColor: type.color }]}>
                    <Text style={improvedStyles.typeChipText}>{type.label}</Text>
                </View>
            </View>
            
            <TouchableOpacity 
                style={improvedStyles.deleteButton} 
                onPress={() => onRemove(item.person_id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Text style={improvedStyles.deleteButtonText}>🗑️ Eliminar</Text>
            </TouchableOpacity>
        </View>
    );
};
// ----------------------------------------------------

const ScreenAssignPersonToCell = () => {
    // Lista de personas que serán guardadas en cells_persons
    const [cellId, setCellId] = useState<FieldState>({ value: "", isValid: null });
    const [personasAgregadas, setPersonasAgregadas] = useState<CellPersonEntry[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    // Simulando el Contexto (Asegúrate de que estas props sean correctas)
    // const { territories, optionsTerritories } = useContext(optionsContext);
    const territories = {
        data: [
            { id: '101', name: 'Célula Alfa', male: true },
            { id: '102', name: 'Célula Beta', male: false },
            { id: '103', name: 'Célula Gamma', male: true },
        ]
    };

    const changeCell = (value: string) => {
        setCellId({ value, isValid: validateBoolean(value) });
        return;
    };

    const arrayConstructorTerritories = () => {
        let dataArray: { title: string; id: string }[] = [];

        for (const element of territories.data) {
            // El componente SelectWithLabel probablemente espera un array de { title, id }
            const value1 = `${element.name} - ${element.male ? "Hombres" : "Mujeres"}`;
            const value2 = element.id;

            dataArray.push({
                "title": value1,
                "id": value2
            })
        }
        return dataArray;
    };

    // Función para eliminar un ítem de la vista principal
    const handleEliminarPersona = useCallback((personId: number) => {
        setPersonasAgregadas(prev => prev.filter(p => p.person_id !== personId));
    }, []);

    const handleGuardarTodo = () => {
        if (!cellId.isValid || cellId.value === "") {
            Alert.alert('Advertencia', 'Por favor, selecciona una célula válida antes de guardar.');
            return;
        }

        if (personasAgregadas.length === 0) {
            Alert.alert('Advertencia', 'No hay personas para asignar a esta célula.');
            return;
        }
        
        const dataToSend = personasAgregadas.map(entry => ({
            cell_id: cellId.value, // Usamos el ID seleccionado
            person_id: entry.person_id,
            member_type_id: entry.member_type_id,
            active: entry.active,
        }));
        
        console.log('Datos a enviar para guardar:', dataToSend);
        Alert.alert(
            "Guardado Exitoso",
            `Se asignaron ${dataToSend.length} personas a la Célula ID: ${cellId.value}.`,
            [{ text: "OK" }]
        );
        // setPersonasAgregadas([]); // Limpiar después de guardar
    };

    const renderItem = ({ item }: { item: CellPersonEntry }) => (
        <PersonListItem 
            item={item} 
            onRemove={handleEliminarPersona} 
        />
    );

    const isSaveDisabled = personasAgregadas.length === 0 || !cellId.isValid;

    return (
        <View style={improvedStyles.container}>
            <ScrollView contentContainerStyle={improvedStyles.scrollContent}>
                
                <Text style={improvedStyles.header}>
                    📝 Asignar Integrantes a Célula
                </Text>

                {/* SELECTOR DE CÉLULA */}
                <View style={improvedStyles.sectionCard}>
                    <Text style={improvedStyles.sectionTitle}>1. Selecciona la Célula</Text>
                    <SelectWithLabel
                        labelText={'Célula Destino'}
                        mandatory={true}
                        theValue={cellId.value}
                        setValue={changeCell}
                        sample={'Selecciona una Célula'}
                        dataOption={arrayConstructorTerritories()}
                        // Mejoramos la lógica de color del borde
                        stylePickerContainer2={
                            {
                                borderColor: cellId.isValid === false ? DANGER_COLOR :
                                            cellId.isValid === true ? ACCENT_COLOR : '#E0E0E0',
                                borderWidth: 2,
                            }
                        }
                    />
                </View>

                {/* ----------------- LISTA DE INTEGRANTES AGREGADOS ----------------- */}
                <View style={[improvedStyles.sectionCard, improvedStyles.listSection]}>
                    <Text style={improvedStyles.sectionTitle}>
                        2. Personas Asignadas ({personasAgregadas.length})
                    </Text>

                    {personasAgregadas.length > 0 ? (
                        <FlatList
                            data={personasAgregadas}
                            renderItem={renderItem}
                            keyExtractor={item => item.person_id.toString()}
                            scrollEnabled={false} // Deshabilitamos el scroll interno para usar el ScrollView padre
                            ListFooterComponent={<View style={{ height: 10 }} />}
                        />
                    ) : (
                        <View style={improvedStyles.emptyBox}>
                            <Text style={improvedStyles.emptyText}>
                                ⚠️ Presiona "Añadir Personas" para comenzar a asignar.
                            </Text>
                        </View>
                    )}
                </View>

                {/* ----------------- BOTÓN PARA ABRIR EL SELECTOR/MODAL ----------------- */}
                <TouchableOpacity
                    style={[improvedStyles.actionButton, improvedStyles.addButton]}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={improvedStyles.actionButtonText}>➕ Buscar y Añadir Integrantes</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* ----------------- BOTÓN DE GUARDAR FIJO ----------------- */}
            <TouchableOpacity
                style={[
                    improvedStyles.actionButton, 
                    improvedStyles.saveButton, 
                    isSaveDisabled && improvedStyles.disabledButton
                ]}
                onPress={handleGuardarTodo}
                disabled={isSaveDisabled}
            >
                <Text style={improvedStyles.actionButtonText}>
                    {isSaveDisabled ? 'Selecciona Célula y Personas' : '💾 Guardar Asignaciones'}
                </Text>
            </TouchableOpacity>

            {/* ----------------- MODAL SELECTORA ----------------- */}
            <ModalForSelectingPerson
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onAddPersons={setPersonasAgregadas} // Función que añade las personas seleccionadas
                existingPersonIds={personasAgregadas.map(p => p.person_id)} // IDs ya agregados
            />
        </View>
    );
};

// --- ESTILOS MEJORADOS ---
const improvedStyles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#F7F7F7' // Fondo claro para resaltar tarjetas
    },
    scrollContent: {
        padding: 15,
        paddingBottom: 100, // Espacio para el botón flotante de guardar
    },
    header: { 
        fontSize: 24, 
        fontWeight: '700', 
        color: PRIMARY_COLOR,
        marginBottom: 20,
        textAlign: 'center',
    },
    sectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, },
            android: { elevation: 3, },
        }),
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: PRIMARY_COLOR,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingBottom: 8,
    },
    listSection: {
        flex: 1,
        minHeight: 100,
    },
    
    // --- Estilos de Ítem de Lista (PersonListItem) ---
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    itemInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1,
    },
    itemNombre: { 
        fontSize: 16, 
        fontWeight: '500', 
        color: '#333',
        marginRight: 10,
    },
    typeChip: {
        borderRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    typeChipText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: DANGER_COLOR,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    deleteButtonText: { 
        fontSize: 14, 
        color: 'white', 
        fontWeight: '600'
    },
    
    // --- Mensaje Vacío ---
    emptyBox: {
        padding: 20,
        backgroundColor: '#FFFBEA', // Fondo amarillo claro
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FFD700',
        alignItems: 'center',
    },
    emptyText: { 
        textAlign: 'center', 
        color: '#A0522D', // Tonalidad marrón
        fontSize: 15,
        fontStyle: 'italic',
    },
    
    // --- Botones de Acción ---
    actionButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 15,
    },
    actionButtonText: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#007BFF', // Azul vibrante para añadir
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: ACCENT_COLOR,
        // Botón flotante al final de la pantalla
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        marginHorizontal: 15,
        marginBottom: 15,
        zIndex: 10,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.2, shadowRadius: 5, },
            android: { elevation: 10, },
        }),
    },
    disabledButton: {
        backgroundColor: DISABLED_COLOR,
    }
});

export default ScreenAssignPersonToCell;