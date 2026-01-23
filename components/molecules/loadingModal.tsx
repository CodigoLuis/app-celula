import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Modal } from 'react-native';

interface CustomInputProps {
    isLoading?: boolean;
}

const LoadingModal: React.FC<CustomInputProps> = ({
    isLoading = false,
}) => {
    return (
        <Modal visible={isLoading} transparent animationType="fade">
            <View style={styles.overlay}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.mensajeCarga}>Guardando datos...</Text>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
    },
    mensajeCarga: {
        marginTop: 10,
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LoadingModal;

