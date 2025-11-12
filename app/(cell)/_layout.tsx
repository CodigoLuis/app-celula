import authContext from '@/contexts/auth/authContext';
import { Drawer } from 'expo-router/drawer';
import React, { useContext } from 'react';
import { Pressable, Text } from 'react-native';

export default function TabsLayout() {
    const { signOut } = useContext(authContext);

    return (
        <Drawer
            screenOptions={{
                // headerShown: true,  // Necesario para mostrar el header
                headerStyle: { backgroundColor: "#f5f5f5" },
                headerShadowVisible: true,
                drawerStyle: {
                    backgroundColor: "#f5f5f5",
                },
                drawerActiveTintColor: "#6200ee",
                drawerInactiveTintColor: "#666666",
                drawerType: 'back',  // Oculta el Drawer por defecto; se abre deslizando desde el borde izquierdo
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



// import authContext from '@/contexts/auth/authContext';
// import { Stack } from 'expo-router/stack';  // Cambia Drawer por Stack
// import React, { useContext } from 'react';
// import { Pressable, Text } from 'react-native';

// export default function TabsLayout() {
//     const { signOut } = useContext(authContext);

//     return (
//         <Stack
//             screenOptions={{
//                 headerStyle: { backgroundColor: "#f5f5f5" },
//                 headerShadowVisible: true,
//                 headerRight: () => (
//                     <Pressable
//                         onPress={() => signOut()}
//                         style={{ marginRight: 15, padding: 8 }}
//                     >
//                         <Text style={{ color: 'blue' }}>Cerrar sesion</Text>
//                     </Pressable>
//                 ),
//             }}
//         >
//             <Stack.Screen
//                 name="home"
//                 options={{
//                     title: "Home",
//                     headerTitleAlign: 'center',
//                 }}
//             />
//             <Stack.Screen
//                 name="registerUser1"
//                 options={{
//                     title: "Registro de usuario",
//                     headerTitleAlign: 'center',
//                 }}
//             />
//             <Stack.Screen
//                 name="menu1"
//                 options={{
//                     title: "Menu",
//                     headerTitleAlign: 'center',
//                 }}
//             />
//         </Stack>
//     );
// }
