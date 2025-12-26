import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
// Asumiendo que UserData está en '@/interface/default' o creas una interfaz aquí
// interface UserData { id: number; username: string; user_type_id: string; person: { firstName: string, lastName: string, gender: string }; userType: { title: string } } 

interface UserListItemProps {
    user: any; // Usamos 'any' por ahora, idealmente tipar con UserData
    territoryColor: string;
    onViewDetails: (userId: number) => void;
    // onEdit?: (id: number) => void; // Si agregas botones
}

const UserListItem: React.FC<UserListItemProps> = ({ user, territoryColor, onViewDetails }) => {

    // Obtener los datos de la persona asociada
    const person = user.person || {};

    return (
        <TouchableOpacity style={styles.cardContainer} onPress={ () => onViewDetails(user.id) } >
            
            {/* <View style={styles.cardContainer}> */}
                {/* --- Franja Lateral de Territorio --- */}
                <View style={[styles.territoryStrip, { backgroundColor: territoryColor }]} />

                <View style={styles.cardContent}>
                    {/* --- Bloque 1: Nombre de Usuario y Tipo --- */}
                    <View style={styles.mainInfo}>
                        <Text style={styles.username}>{user.territory.male === true ? "👨‍💼" : "👩‍💼"} {user.username}</Text>
                        <Text style={styles.userType}>Tipo: {user.userType?.title || 'N/A'}</Text>
                    </View>

                    {/* --- Bloque 2: Información de la Persona --- */}
                    <View style={styles.personInfo}>
                        <Text style={styles.personName}>
                            {person.firstName} {person.lastName}
                        </Text>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailText}>
                                <Text style={styles.detailLabel}>Género: </Text>
                                {person.gender || 'N/A'}
                            </Text>
                            <Text style={styles.detailText}>
                                <Text style={styles.detailLabel}>Territorio: </Text>
                                {user.territory.name}
                            </Text>
                        </View>
                    </View>

                    {/* Si necesitas botones de acción, agrégalos aquí */}
                </View>
            {/* </View> */}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({

    cardContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        marginVertical: 4, // Menos espacio vertical que el anterior
        marginHorizontal: 2,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.15,
                shadowRadius: 2,
            },
            android: {
                elevation: 3,
            },
        }),
        overflow: 'hidden',
    },
    territoryStrip: {
        width: 8,
    },
    cardContent: {
        flex: 1,
        padding: 12,
    },
    mainInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8,
        marginBottom: 8,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    userType: {
        fontSize: 12,
        color: '#007bff',
        fontWeight: '600',
        backgroundColor: '#e6f0ff',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    personInfo: {
        paddingTop: 5,
    },
    personName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
        marginBottom: 4,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 20, // Espacio entre los detalles
    },
    detailText: {
        fontSize: 12,
        color: '#666',
    },
    detailLabel: {
        fontWeight: 'bold',
        color: '#444',
    },
});

export default UserListItem;