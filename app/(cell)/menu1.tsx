import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const options = [
    { id: '1', label: 'Java' },
    { id: '2', label: 'JavaScript' },
    { id: '3', label: 'Python' },
];

export default function CustomDropdown() {
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState<string>('Selecciona un lenguaje');

    const onSelect = (option: string) => {
        setSelected(option);
        setVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
                <Text>{selected} hola </Text>
            </TouchableOpacity>

            <Modal transparent visible={visible} animationType="slide">
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setVisible(false)}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => onSelect(item.label)}
                                >
                                    <Text>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginTop: 50, alignItems: 'center' },
    button: {
        padding: 15,
        borderWidth: 1,
        borderRadius: 5,
        width: 200,
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        width: 250,
        borderRadius: 10,
        padding: 10,
    },
    option: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
});

//-------------------------------------------------------------------
//----------------------------------------------------------------------
//--------------------------------------------------------------------

// import React, { useEffect, useState } from 'react';
// import { Alert, PermissionsAndroid, Platform, StyleSheet, View } from 'react-native';
// import Geolocation from 'react-native-geolocation-service';
// import MapView, { Marker } from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';

// // Clave API de Google (reemplaza con la tuya)
// const GOOGLE_API_KEY = 'TU_CLAVE_API_AQUI';

// const MapScreen = () => {
//   // Estados para manejar la ubicación actual, destino y región del mapa
//   const [currentLocation, setCurrentLocation] = useState(null); // Ubicación del usuario
//   const [destination, setDestination] = useState({
//     latitude: 40.7128, // Ejemplo: Nueva York (puedes cambiarlo o hacerlo dinámico)
//     longitude: -74.0060,
//   });
//   const [region, setRegion] = useState({
//     latitude: 37.78825, // Región inicial (ej. San Francisco; se actualizará con la ubicación real)
//     longitude: -122.4324,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   });

//   // Función para solicitar permisos de ubicación (especialmente en Android)
//   const requestLocationPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Permiso de Ubicación',
//             message: 'Esta app necesita acceso a tu ubicación para mostrar el mapa.',
//             buttonNeutral: 'Preguntar Después',
//             buttonNegative: 'Cancelar',
//             buttonPositive: 'OK',
//           },
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true; // iOS maneja permisos automáticamente
//   };

//   // Función para obtener la ubicación actual
//   const getCurrentLocation = async () => {
//     const hasPermission = await requestLocationPermission();
//     if (!hasPermission) {
//       Alert.alert('Permiso Denegado', 'No se puede acceder a la ubicación.');
//       return;
//     }

//     Geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         setCurrentLocation({ latitude, longitude });
//         // Actualiza la región del mapa para centrar en la ubicación actual
//         setRegion({
//           latitude,
//           longitude,
//           latitudeDelta: 0.01, // Zoom cercano
//           longitudeDelta: 0.01,
//         });
//       },
//       (error) => {
//         console.log(error.code, error.message);
//         Alert.alert('Error', 'No se pudo obtener la ubicación.');
//       },
//       { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//     );
//   };

//   // useEffect para obtener la ubicación al montar el componente
//   useEffect(() => {
//     getCurrentLocation();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         region={region} // Región visible del mapa
//         showsUserLocation={true} // Muestra el punto azul del usuario (opcional, ya que tenemos marcador)
//         showsMyLocationButton={true} // Botón para centrar en ubicación
//         onRegionChangeComplete={(newRegion) => setRegion(newRegion)} // Actualiza región al mover el mapa
//       >
//         {/* Marcador en la ubicación actual */}
//         {currentLocation && (
//           <Marker
//             coordinate={currentLocation}
//             title="Tu Ubicación"
//             description="Punto de origen"
//             pinColor="blue" // Color personalizado
//           />
//         )}

//         {/* Marcador en el destino */}
//         <Marker
//           coordinate={destination}
//           title="Destino"
//           description="Punto de llegada"
//           pinColor="red"
//         />

//         {/* Traza la ruta entre origen y destino */}
//         {currentLocation && (
//           <MapViewDirections
//             origin={currentLocation} // Coordenadas de origen
//             destination={destination} // Coordenadas de destino
//             apikey={GOOGLE_API_KEY} // Clave API
//             strokeWidth={3} // Grosor de la línea
//             strokeColor="blue" // Color de la ruta
//             mode="DRIVING" // Modo: DRIVING, WALKING, BICYCLING, TRANSIT
//             onReady={(result) => {
//               console.log(`Distancia: ${result.distance} km, Duración: ${result.duration} min`);
//               // Aquí puedes mostrar info adicional, como distancia en un Text
//             }}
//             onError={(errorMessage) => {
//               Alert.alert('Error en Ruta', errorMessage);
//             }}
//           />
//         )}
//       </MapView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
// });

// export default MapScreen;