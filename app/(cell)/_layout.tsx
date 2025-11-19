// import authContext from '@/contexts/auth/authContext';
// import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
// import { useRouter } from 'expo-router';
// import { Drawer } from 'expo-router/drawer';
// import React, { useContext } from 'react';
// import { Pressable, Text, View } from 'react-native';

// function CustomDrawerContent(props: any) {
//   const router = useRouter();
//   const { signOut } = useContext(authContext);

//   return (
//     <DrawerContentScrollView {...props}>
//       <View style={{ padding: 20 }}>
//         <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Mi App - Drawer Secundario</Text>
//       </View>
//       <DrawerItem label="Home" onPress={() => router.push('/home')} />
//       <DrawerItem label="Registro de usuario" onPress={() => router.push('/registerUser2')} />
//       <DrawerItem label="Menu" onPress={() => router.push('/menu1')} />
//       <DrawerItem label="Volver a Raíz" onPress={() => router.push('/')} />  // Ruta absoluta para salir del grupo
//       <View style={{ padding: 10 }}>
//         <Pressable onPress={() => signOut()} style={{ padding: 8 }}>
//           <Text style={{ color: 'blue' }}>Cerrar sesión</Text>
//         </Pressable>
//       </View>
//     </DrawerContentScrollView>
//   );
// }

// export default function TabsLayout() {
//   return (
//     <Drawer
//       drawerContent={(props) => <CustomDrawerContent {...props} />}
//       screenOptions={{
//         headerStyle: { backgroundColor: "#f5f5f5" },
//         headerShadowVisible: true,
//         drawerStyle: {
//           backgroundColor: "#f5f5f5",
//         },
//         drawerActiveTintColor: "#6200ee",
//         drawerInactiveTintColor: "#666666",
//         drawerType: 'back',  // Oculta el Drawer por defecto; se abre deslizando desde el borde izquierdo
//         // Nota: headerRight se elimina porque ahora está en el drawer personalizado
//       }}
//     >
//       <Drawer.Screen
//         name="home"
//         options={{
//           title: "Home",
//           headerTitleAlign: 'center',
//         }}
//       />
//       <Drawer.Screen
//         name="registerUser2"
//         options={{
//           title: "Registro de usuario",
//           headerTitleAlign: 'center',
//         }}
//       />
//       <Drawer.Screen
//         name="menu1"
//         options={{
//           title: "Menu",
//           headerTitleAlign: 'center',
//         }}
//       />
//     </Drawer>
//   );
// }















import authContext from '@/contexts/auth/authContext';
import { Drawer } from 'expo-router/drawer';
import React, { useContext } from 'react';
import { Pressable, Text } from 'react-native';

export default function TabsLayoutCell() {
    const { signOut } = useContext(authContext);

    console.log('*********************************TabsLayout renderizado');  // Log para verificar carga
    console.log('TabsLayout renderizado');  // Log para verificar carga
    console.log('TabsLayout renderizado');  // Log para verificar carga
    console.log('TabsLayout renderizado');  // Log para verificar carga
    console.log('TabsLayout renderizado');  // Log para verificar carga
    console.log('TabsLayout renderizado');  // Log para verificar carga
    console.log('TabsLayout renderizado');  // Log para verificar carga
    console.log('TabsLayout renderizado');  // Log para verificar carga
    console.log('TabsLayout renderizado');  // Log para verificar carga
    console.log('TabsLayout renderizado');  // Log para verificar carga
    console.log('TabsLayout renderizado');  // Log para verificar carga
    console.log('TabsLayout renderizado');  // Log para verificar carga
    console.log('TabsLayout renderizado');  // Log para verificar carga
    console.log('TabsLayout renderizado');  // Log para verificar carga
    console.log('TabsLayout renderizado');  // Log para verificar carga
    console.log('TabsLayout renderizado');  // Log para verificar carga
    console.log('TabsLayout renderizado');  // Log para verificar carga
    console.log('TabsLayout renderizado');  // Log para verificar carga
    console.log('TabsLayout renderizado');  // Log para verificar carga
    console.log('TabsLayout renderizado');  // Log para verificar carga
    console.log('TabsLayout renderizado*******************************************');  // Log para verificar carga

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
                drawerType: 'back',  // Prueba cambiar a 'slide' o 'front' para ver si aparece
                headerRight: () => (
                    <Pressable
                        onPress={() => {
                            console.log('Botón Cerrar sesión presionado');  // Log para interacción
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





// import { Drawer } from 'expo-router/drawer';
// import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
// import { useRouter } from 'expo-router';
// import { View, Text } from 'react-native';

// function CustomDrawerContent(props: any) {
//   const router = useRouter();
//   return (
//     <DrawerContentScrollView {...props}>
//       <View style={{ padding: 20 }}>
//         <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Mi App - Drawer Secundario</Text>
//       </View>
//       <DrawerItem label="Inicio" onPress={() => router.push('index')} />  // Ruta relativa dentro del grupo
//       <DrawerItem label="Perfil" onPress={() => router.push('profile')} />  // Ruta relativa
//       <DrawerItem label="Volver a Raíz" onPress={() => router.push('/')} />  // Ruta absoluta para salir del grupo
//       <DrawerItem label="Cerrar Sesión" onPress={() => console.log('Logout')} />
//     </DrawerContentScrollView>
//   );
// }

// export default function Layout() {
//   return (
//     <Drawer
//       drawerContent={(props) => <CustomDrawerContent {...props} />}
//       drawerStyle={{ backgroundColor: '#c6cbef', width: 240 }}
//       drawerType="slide"
//     >
//       <Drawer.Screen name="index" options={{ title: 'Inicio' }} />
//       <Drawer.Screen name="profile" options={{ title: 'Perfil' }} />
//       {/* Agrega más pantallas aquí si es necesario */}
//     </Drawer>
//   );
// }






































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
