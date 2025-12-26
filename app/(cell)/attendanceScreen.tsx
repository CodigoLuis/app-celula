import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    Platform,
    Switch, // Para marcar la asistencia
} from 'react-native';

// --- INTERFACES ---
interface MeetingDetails {
    id: string; 
    date: string; // YYYY-MM-DD
    title: string;
}

interface Member {
    id: string;
    name: string;
    isCoreMember: boolean;
}

// --- MOCK DATA ---
const MOCK_MEETING_DETAILS: MeetingDetails = {
    id: '1',
    date: '2025-12-05',
    title: 'Reunión Semanal de Célula',
};

const MOCK_MEMBERS: Member[] = [
    { id: 'm1', name: 'Juan Pérez (Líder)', isCoreMember: true },
    { id: 'm2', name: 'María García', isCoreMember: true },
    { id: 'm3', name: 'Roberto López', isCoreMember: false },
    { id: 'm4', name: 'Ana Mendoza', isCoreMember: true },
    { id: 'm5', name: 'David Torres', isCoreMember: false },
];

/**
 * Tarjeta individual para marcar la asistencia de un miembro.
 */
const MemberAttendanceItem: React.FC<{ member: Member, onToggle: (id: string, attended: boolean) => void, isAttended: boolean }> = ({ member, onToggle, isAttended }) => {
    return (
        <View style={styles.memberItem}>
            <Text style={[styles.memberName, member.isCoreMember && styles.coreMemberName]}>
                {member.name}
            </Text>
            <Switch
                trackColor={{ false: "#767577", true: "#4CAF50" }}
                thumbColor={isAttended ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(value) => onToggle(member.id, value)}
                value={isAttended}
            />
        </View>
    );
};


/**
 * Componente principal para registrar la asistencia.
 */
const AttendanceScreen: React.FC = () => {
    const [attendedMembers, setAttendedMembers] = useState<Record<string, boolean>>({});
    const [guestCount, setGuestCount] = useState<number>(0);
    
    // Formatear la fecha
    const formattedDate = new Date(MOCK_MEETING_DETAILS.date).toLocaleDateString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    // 1. Manejar el cambio de asistencia de un miembro
    const handleToggleAttendance = (id: string, attended: boolean) => {
        setAttendedMembers(prev => ({ ...prev, [id]: attended }));
    };

    // 2. Manejar el incremento/decremento de invitados
    const handleGuestChange = (delta: number) => {
        setGuestCount(prev => Math.max(0, prev + delta));
    };

    // 3. Guardar el registro
    const handleSaveAttendance = () => {
        const totalMembersAttended = Object.values(attendedMembers).filter(isAttended => isAttended).length;
        const totalAttendance = totalMembersAttended + guestCount;
        
        Alert.alert(
            "Registro Guardado",
            `Reunión: ${MOCK_MEETING_DETAILS.title}\n` +
            `Miembros Asistentes: ${totalMembersAttended}\n` +
            `Invitados (Otros): ${guestCount}\n` +
            `Asistencia Total: ${totalAttendance}`,
            [{ text: "OK" }]
        );
        // Aquí iría tu lógica de API para guardar los datos.
    };
    
    // Conteo de asistentes ya marcados (para el resumen en el encabezado)
    const currentAttendedCount = Object.values(attendedMembers).filter(a => a).length;
    
    return (
        <View style={styles.container}>
            {/* ENCABEZADO Y DETALLES DE LA REUNIÓN */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Registro de Asistencia</Text>
                <Text style={styles.meetingTitle}>{MOCK_MEETING_DETAILS.title}</Text>
                <Text style={styles.meetingDate}>🗓️ {formattedDate}</Text>
                
                <View style={styles.summaryBadge}>
                    <Text style={styles.summaryText}>Asistencia Total: {currentAttendedCount + guestCount}</Text>
                </View>
            </View>

            {/* SECCIÓN DE INVITADOS (NO MIEMBROS) */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>👥 Invitados / Otros</Text>
                <Text style={styles.sectionSubtitle}>Personas no registradas en la lista de miembros.</Text>
                <View style={styles.guestCounter}>
                    <TouchableOpacity style={styles.counterButton} onPress={() => handleGuestChange(-1)}>
                        <Text style={styles.counterButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.guestCountText}>{guestCount}</Text>
                    <TouchableOpacity style={styles.counterButton} onPress={() => handleGuestChange(1)}>
                        <Text style={styles.counterButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            <View style={styles.separator} />
            
            {/* LISTA DE MIEMBROS */}
            <Text style={styles.sectionTitle}>Lista de Miembros (Marcar)</Text>
            
            <FlatList
                data={MOCK_MEMBERS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <MemberAttendanceItem
                        member={item}
                        onToggle={handleToggleAttendance}
                        isAttended={!!attendedMembers[item.id]}
                    />
                )}
                contentContainerStyle={styles.listContent}
            />

            {/* BOTÓN DE GUARDAR */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveAttendance}>
                <Text style={styles.saveButtonText}>💾 Guardar Registro</Text>
            </TouchableOpacity>
        </View>
    );
};

// --- ESTILOS DE LA VISTA ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
        paddingHorizontal: 15,
    },
    headerContainer: {
        paddingVertical: 20,
        backgroundColor: '#1a237e',
        marginHorizontal: -15, // Extender el color
        alignItems: 'center',
        marginBottom: 10,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, },
            android: { elevation: 8, },
        }),
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    meetingTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#f0f0f0',
    },
    meetingDate: {
        fontSize: 14,
        color: '#ccc',
        marginTop: 5,
    },
    summaryBadge: {
        backgroundColor: '#4CAF50',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginTop: 10,
    },
    summaryText: {
        color: 'white',
        fontWeight: 'bold',
    },
    sectionContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, }, android: { elevation: 2, }, }),
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a237e',
        marginBottom: 5,
    },
    sectionSubtitle: {
        fontSize: 13,
        color: '#777',
        marginBottom: 10,
    },
    // --- Contador de Invitados ---
    guestCounter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    counterButton: {
        backgroundColor: '#007bff',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 15,
    },
    counterButtonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    guestCountText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        minWidth: 40,
        textAlign: 'center',
    },
    separator: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 10,
        marginHorizontal: -15,
    },
    // --- Lista de Miembros ---
    listContent: {
        paddingBottom: 20,
    },
    memberItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    memberName: {
        fontSize: 16,
        color: '#333',
    },
    coreMemberName: {
        fontWeight: '600',
        color: '#1a237e', // Destacar si es miembro núcleo/líder
    },
    // --- Botón de Guardar ---
    saveButton: {
        backgroundColor: '#4CAF50', // Verde para guardar
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 15,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AttendanceScreen;