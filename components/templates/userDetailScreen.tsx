import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView,
  TouchableOpacity, TextInput, Alert, ActivityIndicator, Switch
} from 'react-native';

const UserDetailScreen = ({ user, onUpdate }: { user: any, onUpdate?: (data: any) => Promise<void> }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    first_name: user.person.first_name,
    last_name: user.person.last_name,
    phone: user.person.phone,
    email: user.email,
    active: user.active,
  });

  // Colores Corporativos
  const corporateColor = {
    primary: '#1e272e',    // Gris muy oscuro / Azul noche
    secondary: '#2f3542',  // Gris pizarra
    accent: '#0984e3',     // Azul corporativo
    background: '#f1f2f6'
  };

  const institutionalPalette = {
  primary: '#512DA8',    // Morado para headers o títulos
  secondary: '#2f3542',  // Gris pizarra para textos
  accent: '#0288D1',     // Azul para botones de acción
  danger: '#D32F2F',     // Rojo para cancelar o eliminar
  warning: '#FBC02D',    // Amarillo para avisos o estados
  background: '#f1f2f6'
};

  const handleSave = async () => {
    setLoading(true);
    try {
      if (onUpdate) await onUpdate(form);
      Alert.alert("Éxito", "Cambios guardados en el servidor.");
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el registro.");
    } finally {
      setLoading(false);
    }
  };

  const InfoRow = ({ label, value, field, editable = true }: any) => (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      {isEditing && editable ? (
        <TextInput
          style={styles.inlineInput}
          value={form[field as keyof typeof form]?.toString()}
          onChangeText={(text) => setForm({ ...form, [field]: text })}
        />
      ) : (
        <Text style={styles.rowValue}>{value || '—'}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* --- HEADER CORPORATIVO --- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SISTEMA DE GESTIÓN DE USUARIOS</Text>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        
        {/* --- SECCIÓN PERFIL SERIO --- */}
        <View style={styles.profileHeader}>
          {/* Fondo decorativo de la tarjeta de perfil */}
          <View style={styles.profileBackground} />
          
          <View style={styles.photoWrapper}>
            <Image
              source={require('@/assets/images/cuadrangular.png')}
              // source={{ uri: user.person.photo || `https://ui-avatars.com/api/?name=${form.first_name}+${form.last_name}&background=2f3542&color=fff` }}
              style={styles.bigPhoto}
            />
            {/* <View style={[styles.statusIndicator, { backgroundColor: form.active ? '#2ecc71' : '#95a5a6' }]} /> */}
          </View>

          <View style={styles.nameContainer}>
            <Text style={styles.mainName}>{`${form.first_name} ${form.last_name}`.toUpperCase()}</Text>
            <View style={styles.badgeContainer}>
               <Text style={styles.roleBadge}>{user.user_type?.name || 'EMPLEADO'}</Text>
               <Text style={styles.idText}>ID: {user.person.id_number || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.actionContainer}>
            {!isEditing ? (
              <TouchableOpacity style={styles.corporateEditBtn} onPress={() => setIsEditing(true)}>
                <Text style={styles.corporateEditBtnText}>MODIFICAR REGISTRO</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.editingGroup}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Text style={styles.btnTextWhite}>GUARDAR</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEditing(false)}>
                  <Text style={styles.btnTextDark}>CANCELAR</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* --- DATOS PERSONALES --- */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Información del Sujeto</Text>
          <View style={styles.card}>
            <InfoRow label="NOMBRES" value={form.first_name} field="first_name" />
            <InfoRow label="APELLIDOS" value={form.last_name} field="last_name" />
            <InfoRow label="GÉNERO" value={user.person.gender} editable={false} />
            <InfoRow label="TELÉFONO" value={form.phone} field="phone" />
          </View>
        </View>

        {/* --- DATOS DE CUENTA --- */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Credenciales y Sistema</Text>
          <View style={[styles.card, styles.cardEnterprise]}>
            <InfoRow label="EMAIL CORPORATIVO" value={form.email} field="email" />
            <InfoRow label="USUARIO" value={user.username} editable={false} />
            <InfoRow label="TERRITORIO ASIGNADO" value={user.territory?.name} editable={false} />
            <InfoRow label="ALTA EN SISTEMA" value={new Date(user.created_at).toLocaleDateString()} editable={false} />
            
            <View style={styles.switchRow}>
              <Text style={styles.rowLabel}>ESTADO DEL ACCESO</Text>
              <Switch
                value={form.active}
                onValueChange={(v) => setForm({ ...form, active: v })}
                disabled={!isEditing}
                trackColor={{ false: "#dfe6e9", true: "#2f3542" }}
                thumbColor={form.active ? "#0288D1" : "#f4f3f4"}
              />
            </View>
          </View>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f2f6' },
  header: {
    paddingVertical: 15,
    backgroundColor: '#512DA8',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 12, fontWeight: 'bold', color: '#fff', letterSpacing: 2 },
  body: { padding: 20 },
  
  // Perfil Empresarial
  profileHeader: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    paddingBottom: 25, 
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 3,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#dcdde1'
  },
  profileBackground: {
    height: 80,
    width: '100%',
    backgroundColor: '#2f3542', // Fondo oscuro serio
    position: 'absolute',
    top: 0,
  },
  photoWrapper: {
    marginTop: 25,
    position: 'relative',
  },
  bigPhoto: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, // Menos circular, más cuadrado redondeado (tipo LinkedIn)
    borderWidth: 4, 
    borderColor: '#fff',
    backgroundColor: '#f1f2f6'
  },
  statusIndicator: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#fff'
  },
  nameContainer: { alignItems: 'center', marginTop: 10 },
  mainName: { fontSize: 18, fontWeight: '800', color: '#512DA8', letterSpacing: 0.5 },
  badgeContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 5 },
  roleBadge: { backgroundColor: '#f1f2f6', color: '#2f3542', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: '#dcdde1' },
  idText: { fontSize: 11, color: '#7f8c8d', fontWeight: '500' },
  
  // Botones Empresa
  actionContainer: { width: '80%', marginTop: 20 },
  corporateEditBtn: { backgroundColor: '#512DA8', paddingVertical: 12, borderRadius: 6, alignItems: 'center' },
  corporateEditBtnText: { color: '#fff', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  editingGroup: { flexDirection: 'row', gap: 10 },
  saveBtn: { flex: 1, backgroundColor: '#0288D1', paddingVertical: 12, borderRadius: 6, alignItems: 'center' },
  cancelBtn: { flex: 1, backgroundColor: '#f1f2f6', paddingVertical: 12, borderRadius: 6, alignItems: 'center', borderWidth: 1, borderColor: '#dcdde1' },
  btnTextWhite: { color: '#fff', fontWeight: 'bold', fontSize: 11 },
  btnTextDark: { color: '#2f3542', fontWeight: 'bold', fontSize: 11 },

  // Secciones
  section: { marginBottom: 25 },
  sectionLabel: { fontSize: 11, fontWeight: 'bold', color: '#7f8c8d', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 },
  
  card: { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 5, elevation: 1, borderWidth: 1, borderColor: '#dcdde1' },
  cardEnterprise: { borderTopWidth: 3, borderTopColor: '#0288D1' },
  
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f1f2f6' },
  rowLabel: { color: '#7f8c8d', fontSize: 11, fontWeight: '700' },
  rowValue: { fontWeight: '600', color: '#2f3542', fontSize: 13, flex: 1, textAlign: 'right' },
  
  inlineInput: { fontWeight: '700', color: '#0288D1', fontSize: 13, flex: 1, textAlign: 'right', backgroundColor: '#f8f9fa', padding: 5, borderRadius: 4, borderWidth: 1, borderColor: '#dcdde1' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 }
});

export default UserDetailScreen;