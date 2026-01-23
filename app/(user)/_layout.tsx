import React, { useContext, useState } from 'react';
import { View, Text, Pressable, TouchableOpacity, StyleSheet } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import authContext from '@/contexts/auth/authContext';
import { MaterialIcons } from '@expo/vector-icons'; // Iconos estándar en Expo

// --- COMPONENTE DEL CONTENIDO PERSONALIZADO ---
function CustomDrawerContent(props: any) {
  const { signOut } = useContext(authContext);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (menuName: string) => {
    setOpenMenus(prev => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      <View style={styles.headerSection}>
        <Text style={styles.userNameText}>Menú Principal</Text>
      </View>

      {/* SUBMENÚ: GESTIÓN DE USUARIOS */}
      <TouchableOpacity 
        style={styles.menuItem} 
        onPress={() => toggleMenu('users')}
      >
        <View style={styles.menuLabelContainer}>
          <MaterialIcons name="group" size={22} color="#6200ee" />
          <Text style={styles.menuLabel}>Usuarios</Text>
        </View>
        <MaterialIcons 
          name={openMenus['users'] ? 'expand-less' : 'expand-more'} 
          size={24} color="#666" 
        />
      </TouchableOpacity>

      {openMenus['users'] && (
        <View style={styles.subMenuContainer}>
          <DrawerItem
            label="Lista de Usuarios"
            icon={({ color, size }) => <MaterialIcons name="list" size={size} color={color} />}
            onPress={() => props.navigation.navigate('userListScreem')}
          />
          <DrawerItem
            label="Registrar Usuario"
            icon={({ color, size }) => <MaterialIcons name="person-add" size={size} color={color} />}
            onPress={() => props.navigation.navigate('registerUserScreen')}
          />
        </View>
      )}

      {/* SUBMENÚ: GESTIÓN DE PERSONAS */}
      <TouchableOpacity 
        style={styles.menuItem} 
        onPress={() => toggleMenu('persons')}
      >
        <View style={styles.menuLabelContainer}>
          <MaterialIcons name="contacts" size={22} color="#6200ee" />
          <Text style={styles.menuLabel}>Personas</Text>
        </View>
        <MaterialIcons 
          name={openMenus['persons'] ? 'expand-less' : 'expand-more'} 
          size={24} color="#666" 
        />
      </TouchableOpacity>

      {openMenus['persons'] && (
        <View style={styles.subMenuContainer}>
          <DrawerItem
            label="Lista de Personas"
            icon={({ color, size }) => <MaterialIcons name="format-list-bulleted" size={size} color={color} />}
            onPress={() => props.navigation.navigate('personListScreen')}
          />

          <DrawerItem
            label="Registrar Persona"
            icon={({ color, size }) => <MaterialIcons name="add-circle-outline" size={size} color={color} />}
            onPress={() => props.navigation.navigate('registerPersonScreen')}
          />

          {/* <DrawerItem
            label="Actulizar Persona"
            icon={({ color, size }) => <MaterialIcons name="add-circle-outline" size={size} color={color} />}
            onPress={() => props.navigation.navigate('updatePersonScreen')}
          /> */}

        </View>
      )}

      {/* ACCESOS DIRECTOS */}
      <DrawerItem
        label="Mi Perfil"
        labelStyle={styles.menuLabel}
        icon={({ color, size }) => <MaterialIcons name="account-circle" size={size} color="#6200ee" />}
        onPress={() => props.navigation.navigate('profileScreen')}
      />

      {/* BOTÓN CERRAR SESIÓN AL FINAL */}
      <View style={styles.footer}>
         <DrawerItem
          label="Cerrar sesión"
          labelStyle={{ color: '#d32f2f' }}
          icon={({ size }) => <MaterialIcons name="logout" size={size} color="#d32f2f" />}
          onPress={() => signOut()}
        />
      </View>
    </DrawerContentScrollView>
  );
}

// --- LAYOUT PRINCIPAL ---
export default function TabsLayoutUser() {
    const { signOut } = useContext(authContext);

    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerStyle: { backgroundColor: "#f5f5f5" },
                headerShadowVisible: false,
                drawerActiveTintColor: "#6200ee",
                drawerInactiveTintColor: "#666666",
                headerTitleAlign: 'center',
                headerRight: () => (
                    <Pressable onPress={() => signOut()} style={{ marginRight: 15, padding: 8 }}>
                        <MaterialIcons name="logout" size={22} color="blue" />
                    </Pressable>
                ),
            }}
        >
            {/* Ocultamos los nombres del drawer automático para que solo mande el CustomDrawerContent */}
            <Drawer.Screen name="userListScreem" options={{ title: "Lista de Usuarios", drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="registerUserScreen" options={{ title: "Registrar Usuario", drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="personListScreen" options={{ title: "Lista de Personas", drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="registerPersonScreen" options={{ title: "Registrar Persona", drawerItemStyle: { display: 'none' } }} />
            {/* <Drawer.Screen name="updatePersonScreen" options={{ title: "Actulizar Persona", drawerItemStyle: { display: 'none' } }} /> */}
            <Drawer.Screen name="profileScreen" options={{ title: "Perfil", drawerItemStyle: { display: 'none' } }} />
        </Drawer>
    );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  headerSection: {
    padding: 20,
    backgroundColor: '#6200ee',
    marginBottom: 10,
  },
  userNameText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 15,
    color: '#333',
  },
  subMenuContainer: {
    backgroundColor: '#f9f9f9',
    paddingLeft: 10,
  },
  footer: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  }
});