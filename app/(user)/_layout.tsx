import { useRouter } from "expo-router";
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { Pressable, Text } from 'react-native';

export default function TabsLayout() {
    const router = useRouter();

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
                        onPress={() => router.replace("/")}
                        style={{ marginRight: 15, padding: 8 }}
                    >
                        <Text style={{ color: 'blue' }}>Login</Text>
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
                name="registerUser"
                options={{
                    title: "Registro de usuario",
                    headerTitleAlign: 'center',
                }}
            />
            <Drawer.Screen
                name="menu"
                options={{
                    title: "Menu",
                    headerTitleAlign: 'center',
                }}
            />
        </Drawer>
    );
}
