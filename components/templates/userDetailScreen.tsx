// import React from 'react';
// import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native';

// // Definimos la interfaz basada en tu modelo
// interface ListUser {
//   id: number;
//   username: string;
//   active: boolean;
//   person: {
//     firstName: string;
//     lastName: string;
//     gender: string;
//   };
//   userType: {
//     id: number;
//     title: string;
//   };
//   territory: {
//     id: number;
//     name: string;
//     male: boolean;
//     color: string;
//   };
// }

// interface Props {
//   user: ListUser;
// }

// const UserDetailScreen = ({ user }: Props) => {
//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false}>

//         {/* Sección de Header con Imagen */}
//         <View style={styles.header}>
//           <View style={[styles.imageContainer, { borderColor: user.territory.color || '#ccc' }]}>
//             <Image
//               source={{ uri: `https://ui-avatars.com/api/?name=${user.person.firstName}+${user.person.lastName}&size=150&background=random` }} 
//               style={styles.profileImage}
//             />
//           </View>
//           <Text style={styles.name}>{`${user.person.firstName} ${user.person.lastName}`}</Text>
//           <View style={[styles.badge, { backgroundColor: user.active ? '#4CAF50' : '#F44336' }]}>
//             <Text style={styles.badgeText}>{user.active ? 'Activo' : 'Inactivo'}</Text>
//           </View>
//         </View>

//         {/* Información de Usuario */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Información de Cuenta</Text>
//           <InfoRow label="Username" value={`@${user.username}`} />
//           <InfoRow label="Tipo de Usuario" value={user.userType.title} />
//           <InfoRow label="Género" value={user.person.gender} />
//         </View>

//         {/* Información de Territorio */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Territorio y Asignación</Text>
//           <View style={styles.territoryCard}>
//             <View style={[styles.colorIndicator, { backgroundColor: user.territory.color }]} />
//             <View>
//               <Text style={styles.territoryName}>{user.territory.name}</Text>
//               <Text style={styles.territoryDetail}>ID: {user.territory.id}</Text>
//             </View>
//           </View>
//         </View>

//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// // Componente auxiliar para filas de información
// const InfoRow = ({ label, value }: { label: string; value: string }) => (
//   <View style={styles.infoRow}>
//     <Text style={styles.infoLabel}>{label}</Text>
//     <Text style={styles.infoValue}>{value}</Text>
//   </View>
// );

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     alignItems: 'center',
//     padding: 30,
//     backgroundColor: '#ffffff',
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   imageContainer: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 4,
//     padding: 3,
//     marginBottom: 15,
//   },
//   profileImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 60,
//   },
//   name: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   badge: {
//     marginTop: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 20,
//   },
//   badgeText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   section: {
//     margin: 20,
//     padding: 15,
//     backgroundColor: 'white',
//     borderRadius: 15,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#666',
//     marginBottom: 15,
//     textTransform: 'uppercase',
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 10,
//     borderBottomWidth: 0.5,
//     borderBottomColor: '#eee',
//   },
//   infoLabel: {
//     color: '#888',
//     fontSize: 14,
//   },
//   infoValue: {
//     color: '#333',
//     fontWeight: '500',
//     fontSize: 14,
//   },
//   territoryCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f9f9f9',
//     padding: 12,
//     borderRadius: 10,
//   },
//   colorIndicator: {
//     width: 12,
//     height: 40,
//     borderRadius: 6,
//     marginRight: 15,
//   },
//   territoryName: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   territoryDetail: {
//     fontSize: 12,
//     color: '#999',
//   },
// });

// export default UserDetailScreen;

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView,
  TouchableOpacity, TextInput, Alert, ActivityIndicator
} from 'react-native';

const UserDetailScreen = ({ user, onUpdate }: { user: any, onUpdate?: (data: any) => Promise<void> }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estado local para los campos editables (ejemplos basados en tus tablas)
  const [formData, setFormData] = useState({
    firstName: user.person.firstName,
    lastName: user.person.lastName,
    phone: user.person.phone,
    address: user.person.address,
    email: user.email,
    active: user.active
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // Aquí llamarías a tu API o al método del contexto
      if (onUpdate) {
        await onUpdate(formData);
      }
      Alert.alert("Éxito", "Los datos han sido actualizados correctamente.");
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Error", "No se pudieron guardar los cambios.");
    } finally {
      setLoading(false);
    }
  };

  const DetailRow = ({ label, value, field, editable = true }: any) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      {isEditing && editable ? (
        <TextInput
          style={styles.input}
          value={formData[field as keyof typeof formData]?.toString()}
          onChangeText={(text) => setFormData({ ...formData, [field]: text })}
          placeholder={`Ingresar ${label.toLowerCase()}`}
        />
      ) : (
        <Text style={styles.detailValue}>{value || 'No registrado'}</Text>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} bounces={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={[styles.photoContainer, { borderColor: user.territory.color }]}>
            <Image
              source={{ uri: user.person.photo || `https://ui-avatars.com/api/?name=${user.person.firstName}+${user.person.lastName}` }}
              style={styles.photo}
            />
          </View>
          <Text style={styles.fullName}>{`${formData.firstName} ${formData.lastName}`}</Text>

          {/* BOTONES DE ACCIÓN PRINCIPAL */}
          <View style={styles.actionRow}>
            {!isEditing ? (
              <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
                <Text style={styles.btnText}>✏️ Editar Perfil</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={() => setIsEditing(false)}>
                  <Text style={styles.btnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.saveBtn]} onPress={handleSave} disabled={loading}>
                  {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>Guardar</Text>}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* SECCIÓN DATOS PERSONALES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Datos Personales (Editables)</Text>
          <View style={styles.card}>
            <DetailRow label="Nombre" value={formData.firstName} field="firstName" />
            <DetailRow label="Apellido" value={formData.lastName} field="lastName" />
            <DetailRow label="Teléfono" value={formData.phone} field="phone" />
            <DetailRow label="Dirección" value={formData.address} field="address" />
          </View>
        </View>

        {/* SECCIÓN CUENTA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔑 Información de Cuenta</Text>
          <View style={styles.card}>
            <DetailRow label="Email" value={formData.email} field="email" />
            <DetailRow label="Usuario" value={`@${user.username}`} editable={false} />
            <DetailRow label="Territorio" value={user.territory.name} editable={false} />
          </View>
        </View>
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  header: { backgroundColor: '#FFF', alignItems: 'center', paddingVertical: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 4 },
  photoContainer: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, padding: 2, marginBottom: 10 },
  photo: { width: '100%', height: '100%', borderRadius: 55 },
  fullName: { fontSize: 20, fontWeight: 'bold', color: '#2D3436' },
  actionRow: { flexDirection: 'row', marginTop: 15, gap: 10 },
  btn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, minWidth: 100, alignItems: 'center' },
  editBtn: { backgroundColor: '#3498db', paddingHorizontal: 25, paddingVertical: 10, borderRadius: 20 },
  saveBtn: { backgroundColor: '#2ecc71' },
  cancelBtn: { backgroundColor: '#e74c3c' },
  btnText: { color: 'white', fontWeight: 'bold' },
  section: { paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#636E72', marginBottom: 8, textTransform: 'uppercase' },
  card: { backgroundColor: '#FFF', borderRadius: 15, padding: 15, shadowOpacity: 0.05 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F2F6' },
  detailLabel: { fontSize: 13, color: '#B2BEC3', flex: 1 },
  detailValue: { fontSize: 14, color: '#2D3436', fontWeight: '600', flex: 2, textAlign: 'right' },
  input: { 
    flex: 2, 
    backgroundColor: '#f9f9f9', padding: 8, borderRadius: 5, textAlign: 'right', 
    // borderWeight: 1, 
    borderColor: '#ddd', color: '#3498db', fontWeight: 'bold' }
});

export default UserDetailScreen;