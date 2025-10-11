import authContext from '@/contexts/auth/authContext';
// import { useRouter } from "expo-router";
import { Drawer } from 'expo-router/drawer';
import React, { useContext } from 'react';
import { Pressable, Text } from 'react-native';

export default function TabsLayout() {
    // const router = useRouter();
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
                name="home2"
                options={{
                    title: "Home 2",
                    headerTitleAlign: 'center',
                }}
            />
            <Drawer.Screen
                name="registerPerson"
                options={{
                    title: "Registrar persona",
                    headerTitleAlign: 'center',
                }}
            />
            <Drawer.Screen
                name="registerUser"
                options={{
                    title: "Registrar usuario",
                    headerTitleAlign: 'center',
                }}
            />
        </Drawer>
    );
}
