import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, Switch, TextInput, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const PersonDetailModal = ({ visible, person, onClose, whenUpdating }: { visible: boolean, person: any, onClose: () => void, whenUpdating: any }) => {
    const router = useRouter();

    const [editEdu, setEditEdu] = useState(false);
    const [form, setForm] = useState<any>(null);

    useEffect(() => {
        if (person) setForm({ ...person });
    }, [person, visible]);

    if (!form) return null;


    const isBirthdayToday = () => {
        if (!form.birthDate) return false;
        const today = new Date();
        const bday = new Date(form.birthDate);
        return today.getUTCDate() === bday.getUTCDate() &&
            today.getUTCMonth() === bday.getUTCMonth();
    };

    const handleGoToEdit = () => {

        router.push({
            pathname: '/updatePersonScreen', // La ruta del archivo en /app
            params: form
        });

    };

    const saveEducation = () => {
        whenUpdating({
            id: form.education?.id,
            consolidationLevel: form.education?.consolidationLevel,
            leaderSchool: form.education?.leaderSchool,
            propheticSchool: form.education?.propheticSchool,
            person: form.id,
        });
        setEditEdu(false);
    };

    const isFemale = form.gender?.toLowerCase() === 'female' || form.gender?.toLowerCase() === 'femenino';

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>

                {/* --- HEADER --- */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.btnNavClose}>Cerrar</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Ficha Detallada</Text>
                    <View style={{ width: 60 }} />
                </View>

                <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

                    {/* --- SECCIÓN 1: PERFIL (IMAGEN) --- */}
                    <View style={[styles.profileHeader, { backgroundColor: isFemale ? '#fd79a77c' : '#0091ff93' }]}>
                        <View>
                            <Image
                                source={require('@/assets/images/cuadrangular.png')}
                                // source={{ uri: `https://ui-avatars.com/api/?name=${form.first_name}+${form.last_name}&background=random` }}
                                // source={{ uri: form.photo || `https://ui-avatars.com/api/?name=${form.first_name}+${form.last_name}&background=random` }}
                                style={[styles.bigPhoto, isBirthdayToday() && styles.photoBirthday]}
                            />
                            {isBirthdayToday() && <View style={styles.cakeBadge}><Text>🎂</Text></View>}
                        </View>
                        <Text style={styles.mainName}>{`${person.firstName} ${person.lastName}`}</Text>
                        <Text style={styles.subText}>Cédula de Identidad: {form.idNumber}</Text>
                        {isBirthdayToday() && <Text style={styles.bdayText}>¡Hoy es su cumpleaños!</Text>}
                    </View>

                    {/* --- SECCIÓN 2: DATOS DE LA PERSONA (LECTURA) --- */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionLabel}>Información Personal</Text>
                            <TouchableOpacity onPress={handleGoToEdit} style={styles.externalEditBtn}>
                                <Text style={styles.externalEditBtnText}>⚙️ Editar Datos</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.card}>
                            <InfoRow label="📞 Teléfono" value={form.phone} />
                            <InfoRow label="📍 Dirección" value={form.address} />
                            <InfoRow label="📅 F. Nacimiento" value={form.birthDate} />
                            <InfoRow label="👫 Género" value={form.gender} />
                            <InfoRow label="💍 Estado Civil" value={form.maritalStatus} />
                            <InfoRow label="🎓 Nivel Educativo" value={form.educationLevel} />
                            <InfoRow label="🕒 Miembro desde" value={new Date(form.createdAt).toLocaleDateString()} />
                        </View>
                    </View>

                    {/* --- SECCIÓN 3: FORMACIÓN (EDICIÓN LOCAL) --- */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionLabel, { color: '#6c5ce7' }]}>Formación Cristiana</Text>
                            <TouchableOpacity onPress={() => editEdu ? saveEducation() : setEditEdu(true)}>
                                <Text style={[styles.inlineEditBtnText, { color: editEdu ? '#00b894' : '#6c5ce7' }]}>
                                    {editEdu ? '✅ Guardar' : '🎓 Editar Formación'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: '#6c5ce7' }]}>
                            <SwitchRow
                                label="Escuela de Líderes"
                                value={form.education?.leaderSchool}
                                onValueChange={(v: boolean) => setForm({ ...form, education: { ...form.education, leaderSchool: v } })}
                                disabled={!editEdu}
                            />
                            <SwitchRow
                                label="Escuela Profética"
                                value={form.education?.propheticSchool}
                                onValueChange={(v: boolean) => setForm({ ...form, education: { ...form.education, propheticSchool: v } })}
                                disabled={!editEdu}
                            />
                            <View style={styles.switchRow}>
                                <Text style={styles.label}>Nivel de Consolidación</Text>
                                <TextInput
                                    style={[styles.miniInput, editEdu && styles.inputActive]}
                                    value={form.education?.consolidationLevel?.toString()}
                                    onChangeText={(v) => setForm({ ...form, education: { ...form.education, consolidationLevel: v } })}
                                    editable={editEdu}
                                    keyboardType="numeric"
                                    maxLength={2}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

// --- COMPONENTES AUXILIARES ---

const InfoRow = ({ label, value }: { label: string, value: string }) => (
    <View style={styles.row}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value || '—'}</Text>
    </View>
);

const SwitchRow = ({ label, value, onValueChange, disabled }: any) => (
    <View style={styles.switchRow}>
        <Text style={styles.label}>{label}</Text>
        <Switch
            value={!!value}
            onValueChange={onValueChange}
            disabled={disabled}
            trackColor={{ false: "#dfe6e9", true: "#a29bfe" }}
        />
    </View>
);

const styles = StyleSheet.create({
    // Estilos de Contenedor y Header
    container: { flex: 1, backgroundColor: '#f5f6fa' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 18,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    btnNavClose: { fontSize: 16, color: '#e74c3c', fontWeight: '500' },
    headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#2d3436' },

    // Estilos del Cuerpo y Perfil
    body: { padding: 15 },
    profileHeader: { alignItems: 'center', marginBottom: 25, marginTop: 10, padding: 20, borderRadius: 20 },
    bigPhoto: { width: 120, height: 120, borderRadius: 60, marginBottom: 12, borderWidth: 4, borderColor: '#fff' },
    photoBirthday: { borderColor: '#ff613aa1' },
    cakeBadge: { position: 'absolute', bottom: 15, right: 5, backgroundColor: '#fff', borderRadius: 12, padding: 3, elevation: 3 },
    mainName: { fontSize: 22, fontWeight: 'bold', color: '#2d3436' },
    subText: { color: '#41484bff', fontSize: 14, marginTop: 2 },
    bdayText: { color: '#ff613ad7', fontWeight: 'bold', marginTop: 6, fontSize: 14 },

    // Estilos de Secciones
    section: { marginBottom: 25 },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 5
    },
    sectionLabel: { fontSize: 11, fontWeight: 'bold', color: '#b2bec3', textTransform: 'uppercase', letterSpacing: 0.5 },

    // Estilos de Botones
    externalEditBtn: { backgroundColor: '#dfe6e9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    externalEditBtnText: { fontSize: 11, fontWeight: '700', color: '#2d3436' },
    inlineEditBtnText: { fontSize: 12, fontWeight: 'bold' },

    // Estilos de Tarjetas y Filas
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f9f9f9'
    },
    rowLabel: { color: '#b2bec3', fontSize: 13, fontWeight: '500' },
    rowValue: { fontWeight: '600', color: '#2d3436', fontSize: 13, flex: 1, textAlign: 'right', marginLeft: 20 },

    // Estilos de Formación (Inputs y Switches)
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
    label: { fontSize: 14, color: '#2d3436', fontWeight: '500' },
    miniInput: { backgroundColor: '#f1f2f6', padding: 8, borderRadius: 8, width: 50, textAlign: 'center', fontWeight: 'bold', color: '#2d3436' },
    inputActive: { backgroundColor: '#e1f5fe', borderWidth: 1, borderColor: '#6c5ce7' }
});

export default PersonDetailModal;