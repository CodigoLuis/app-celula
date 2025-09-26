import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const options = [
    { id: '1', label: 'Java' },
    { id: '2', label: 'JavaScript' },
    { id: '3', label: 'Python' },
];

export default function CustomDropdown() {
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState<string>('Selecciona un lenguaje');

    const onSelect = (option: string) => {
        setSelected(option);
        setVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
                <Text>{selected}</Text>
            </TouchableOpacity>

            <Modal transparent visible={visible} animationType="slide">
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setVisible(false)}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => onSelect(item.label)}
                                >
                                    <Text>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginTop: 50, alignItems: 'center' },
    button: {
        padding: 15,
        borderWidth: 1,
        borderRadius: 5,
        width: 200,
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        width: 250,
        borderRadius: 10,
        padding: 10,
    },
    option: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
});