import authContext from '@/contexts/auth/authContext';
import { Drawer } from 'expo-router/drawer';
import React, { useContext } from 'react';
import { Pressable, Text } from 'react-native';

export default function TabsLayout() {
    const { signOut } = useContext(authContext);

    return (
        <Drawer
            screenOptions={{
                headerStyle: { backgroundColor: "#f5f5f5" },
                headerShadowVisible: false,
                drawerStyle: {
                    backgroundColor: "#f5f5f5",
                },
                drawerActiveTintColor: "#6200ee",
                drawerInactiveTintColor: "#666666",
                headerRight: () => (
                    <Pressable
                        onPress={() => signOut()}
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
            // name="settings"  // Coincide con settings.tsx
            // options={{
            //     title: 'Ajustes',
            //     tabBarIcon: ({ color, size }) => (
            //         <Ionicons name="settings" color={color} size={size} />
            //     ),
            //     // Puedes agregar: presentation: 'modal' para abrir como modal
            // }
            />
            <Drawer.Screen
                name="registerUser1"
                options={{
                    title: "Registro de usuario",
                    headerTitleAlign: 'center',
                }}
            />
            <Drawer.Screen
                name="menu1"
                options={{
                    title: "Menu",
                    headerTitleAlign: 'center',
                }}
            />
        </Drawer>
    );
}
