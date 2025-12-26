import React, { useState, useCallback, useEffect } from 'react';
import { Modal, View, Text, Button, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { PersonData, CellPersonEntry } from '../../interface/types'; 
import { Picker } from '@react-native-picker/picker'; 

// ** SIMULACIÓN DE DATOS (Deberían ser llamados a tu API) **
const TIPOS_MIEMBRO = [
  { id: 'LD', title: 'Líder' },
  { id: 'M', title: 'Miembro' },
  { id: 'I', title: 'Invitado' },
];

// Simulamos la base de datos de personas
const FAKE_PERSONS: PersonData[] = [
  { id: 1, first_name: 'Carlos', last_name: 'Gómez', id_number: '111' },
  { id: 2, first_name: 'María', last_name: 'López', id_number: '222' },
  { id: 3, first_name: 'Juan', last_name: 'Pérez', id_number: '333' },
  { id: 4, first_name: 'Ana', last_name: 'Rodríguez', id_number: '444' },
];
// -------------------------------------------------------------------------

interface ModalPropsPeopleSelector {
  visible: boolean;
  onClose: () => void;
  // Función para actualizar la lista en el componente padre (Vista Principal)
  onAddPersons: React.Dispatch<React.SetStateAction<CellPersonEntry[]>>; 
  existingPersonIds: number[]; // IDs que ya están en la lista
}

const ModalForSelectingPerson = ({ visible, onClose, onAddPersons, existingPersonIds }: ModalPropsPeopleSelector) => {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState<PersonData[]>([]);
  const [seleccionadosTemp, setSeleccionadosTemp] = useState<PersonData[]>([]);
  const [tipoMiembroSeleccionado, setTipoMiembroSeleccionado] = useState(TIPOS_MIEMBRO[1].id); // M de Miembro por defecto
  const [isLoading, setIsLoading] = useState(false);

  // Lógica de BÚSQUEDA/FILTRADO
  useEffect(() => {
    if (!busqueda) {
      setResultados([]);
      return;
    }
    
    setIsLoading(true);
    // SIMULACIÓN: Filtrar la lista local por nombre/cédula después de un pequeño retraso
    const timer = setTimeout(() => {
      const filtered = FAKE_PERSONS.filter(p =>
        (p.first_name.toLowerCase().includes(busqueda.toLowerCase()) || 
         p.last_name.toLowerCase().includes(busqueda.toLowerCase()) ||
         p.id_number.includes(busqueda)) &&
        !existingPersonIds.includes(p.id) // Excluir a los ya agregados
      );
      setResultados(filtered);
      setIsLoading(false);
    }, 500); // Debounce de 500ms
    
    return () => clearTimeout(timer);
  }, [busqueda, existingPersonIds]);

  // Lógica de SELECCIÓN TEMPORAL
  const handleToggleSeleccion = (person: PersonData) => {
    setSeleccionadosTemp(prev => {
      if (prev.find(p => p.id === person.id)) {
        return prev.filter(p => p.id !== person.id); // Deseleccionar
      } else {
        return [...prev, person]; // Seleccionar
      }
    });
  };

  // Lógica de CONFIRMAR Y AÑADIR
  const handleConfirmar = () => {
    const nuevasEntradas: CellPersonEntry[] = seleccionadosTemp.map(person => ({
      person,
      person_id: person.id,
      member_type_id: tipoMiembroSeleccionado,
      active: true,
    }));
    
    onAddPersons(prev => [...prev, ...nuevasEntradas]);
    
    // Limpiar y cerrar
    setSeleccionadosTemp([]);
    setBusqueda('');
    onClose();
  };

  // Renderiza el ítem en la lista de resultados
  const renderItem = ({ item }: { item: PersonData }) => {
    const isSelected = seleccionadosTemp.find(p => p.id === item.id);
    return (
      <TouchableOpacity 
        style={[styles.itemResultado, isSelected && styles.itemSeleccionado]} 
        onPress={() => handleToggleSeleccion(item)}
      >
        <Text style={styles.itemTexto}>{item.first_name} {item.last_name} ({item.id_number})</Text>
        <Text>{isSelected ? '✅' : '➕'}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>🔎 Buscar y Seleccionar Integrantes</Text>

        {/* ----------------- BARRA DE BÚSQUEDA/FILTRO ----------------- */}
        <TextInput
          style={styles.inputBusqueda}
          placeholder="Buscar por Nombre, Apellido o Cédula..."
          value={busqueda}
          onChangeText={setBusqueda}
        />
        
        {/* ----------------- SELECTOR DE TIPO DE MIEMBRO ----------------- */}
        <Text style={styles.label}>Tipo de Miembro para seleccionados:</Text>
        <Picker
          selectedValue={tipoMiembroSeleccionado}
          onValueChange={(itemValue: string) => setTipoMiembroSeleccionado(itemValue)}
          style={styles.picker}
        >
          {TIPOS_MIEMBRO.map(type => (
            <Picker.Item key={type.id} label={type.title} value={type.id} />
          ))}
        </Picker>

        {/* ----------------- RESULTADOS DE LA BÚSQUEDA ----------------- */}
        <View style={styles.listContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={resultados}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              ListEmptyComponent={() => <Text style={styles.emptyResults}>Ingresa un criterio de búsqueda.</Text>}
            />
          )}
        </View>

        {/* ----------------- PIE DE LA MODAL ----------------- */}
        <View style={styles.footer}>
          <Text style={styles.seleccionCount}>Seleccionados: **{seleccionadosTemp.length}**</Text>
          <View style={styles.footerButtons}>
            <Button title="Cancelar" onPress={onClose} color="#aaa" />
            <Button 
              title={`Añadir (${seleccionadosTemp.length})`} 
              onPress={handleConfirmar}
              disabled={seleccionadosTemp.length === 0}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ... estilos para la Modal ...
const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#f9f9f9',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  inputBusqueda: { 
    borderWidth: 1, borderColor: '#ccc', 
    padding: 10, marginBottom: 15, 
    backgroundColor: '#fff' 
  },
  label: { fontSize: 14, marginBottom: 5 },
  picker: { width: '100%', height: 50, marginBottom: 20 },
  listContainer: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', padding: 5 },
  itemResultado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemSeleccionado: { backgroundColor: '#e6f7ff', borderColor: '#91d5ff', borderWidth: 1 },
  itemTexto: { flex: 1 },
  emptyResults: { textAlign: 'center', color: '#666', padding: 20 },
  footer: { borderTopWidth: 1, borderTopColor: '#ccc', paddingTop: 10, marginTop: 10 },
  seleccionCount: { fontSize: 16, marginBottom: 10, fontWeight: 'bold' },
  footerButtons: { flexDirection: 'row', justifyContent: 'space-between' },
});

export default ModalForSelectingPerson;