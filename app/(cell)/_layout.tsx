import authContext from '@/contexts/auth/authContext';
import { Drawer } from 'expo-router/drawer';
import React, { useContext } from 'react';
import { Pressable, Text } from 'react-native';

export default function TabsLayoutCell() {
    const { signOut } = useContext(authContext);

    return (
        <Drawer
            screenOptions={{
                headerStyle: { backgroundColor: "#f5f5f5" },
                headerShadowVisible: true,
                drawerStyle: {
                    backgroundColor: "#f5f5f5",
                },
                drawerActiveTintColor: "#6200ee",
                drawerInactiveTintColor: "#666666",
                drawerType: 'back',  // 'back', 'slide' o 'front' 
                headerRight: () => (
                    <Pressable
                        onPress={() => {
                            // console.log('Botón Cerrar sesión presionado');
                            signOut();
                        }}
                        style={{ marginRight: 15, padding: 8 }}
                    >
                        <Text style={{ color: 'blue' }}>Cerrar sesion</Text>
                    </Pressable>
                ),
            }}
        >
            <Drawer.Screen
                name="home"
                options={{
                    title: "Home",
                    headerTitleAlign: 'center',
                }}
            />
            <Drawer.Screen
                name="registerUser2"
                options={{
                    title: "Registro de usuario",
                    headerTitleAlign: 'center',
                }}
            />
            <Drawer.Screen
                name="meetingPlaceScreen" 
                options={{
                    title: "Registro de ubicaciones",
                    headerTitleAlign: 'center',
                }}
            />

                <Drawer.Screen
                name="registerCell" 
                options={{
                    title: "Registro de celula",
                    headerTitleAlign: 'center',
                }}
            />

              <Drawer.Screen
                name="assignPersonToCell" 
                options={{
                    title: "asignar persona",
                    headerTitleAlign: 'center',
                }}
            />

            <Drawer.Screen
                name="meetingRegistrationScreen" 
                options={{
                    title: "Registrar reunion",
                    headerTitleAlign: 'center',
                }}
            />

        </Drawer>
    );
}


