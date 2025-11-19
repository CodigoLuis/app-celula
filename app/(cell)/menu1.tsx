import React, { useRef, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { WebView } from 'react-native-webview';

// Interfaz para los datos de la ubicación
interface MeetingPlaceData {
  location: string;
  details: string;
  user_id: number;
}

// Interfaz para coordenadas del mapa
interface LatLng {
  lat: number;
  lng: number;
}

const MeetingPlaceForm: React.FC = () => {
  const [location, setLocation] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [selectedLatLng, setSelectedLatLng] = useState<LatLng | null>(null);
  const webViewRef = useRef<WebView>(null);

  // Función para guardar en DB (simulada)
  const saveMeetingPlace = async (data: MeetingPlaceData): Promise<void> => {
    try {
      const response = await fetch('https://tu-api.com/api/meeting-places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        Alert.alert('Éxito', 'Ubicación guardada');
        setLocation('');
        setDetails('');
        setSelectedLatLng(null);
      } else {
        throw new Error('Error al guardar');
      }
    } catch (error) {
      Alert.alert('Error');
    //   Alert.alert('Error', error.message);
    }
  };

  // Manejar selección en el mapa
  const onWebViewMessage = (event: any): void => {
    const { lat, lng }: LatLng = JSON.parse(event.nativeEvent.data);
    setSelectedLatLng({ lat, lng });
    setLocation(`${lat}, ${lng}`);
  };

  // HTML/JS para el mapa usando OpenStreetMap con Leaflet (centrado en Cumaná, Venezuela)
  const mapHtml: string = `
    <!DOCTYPE html>
    <html>
    <head>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>html, body { height: 100%; margin: 0; } #map { height: 100%; }</style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        let map, marker;
        map = L.map('map').setView([10.4665, -64.1667], 12); // Centro en Cumaná, Venezuela, con zoom cercano
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        map.on('click', (e) => {
          if (marker) map.removeLayer(marker);
          marker = L.marker(e.latlng).addTo(map);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            lat: e.latlng.lat,
            lng: e.latlng.lng,
          }));
        });
      </script>
    </body>
    </html>
  `;

  const handleSubmit = (): void => {
    if (!location || !details) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    const data: MeetingPlaceData = {
      location,
      details,
      user_id: 1, // Reemplaza con el ID real
    };
    saveMeetingPlace(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Ubicación de Reunión</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Ubicación (ej. Calle 123, Ciudad)"
        value={location}
        onChangeText={setLocation}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Detalles (ej. Descripción del lugar)"
        value={details}
        onChangeText={setDetails}
        multiline
      />
      
      <Text style={styles.subtitle}>Selecciona en el mapa:</Text>
      <WebView
        ref={webViewRef}
        source={{ html: mapHtml }}
        style={styles.map}
        onMessage={onWebViewMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
      
      <Button title="Guardar Ubicación" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  map: {
    height: 300,
    marginBottom: 20,
  },
});

export default MeetingPlaceForm;



// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';
// import { WebView } from 'react-native-webview';
// export default function MapScreen() {
//     // URL de OSM con coordenadas iniciales (puedes cambiarlas)
//     // Formato: https://www.openstreetmap.org/#map=zoom/lat/lon
//     const mapUrl = 'https://www.openstreetmap.org/#map=10/10.4806/-66.9036';  // Caracas, Venezuela
//     return (
//         <View style={styles.container}>
//             <View style={styles.boxContainer1}>
//                 <Text>hola</Text>

//             </View>
//             <View style={styles.boxContainer2}>
//                 <WebView
//                     source={{ uri: mapUrl }}
//                     style={styles.map}
//                     // Opcional: Permite interacciones como zoom, pero limita JavaScript si quieres seguridad
//                     javaScriptEnabled={true}
//                     domStorageEnabled={true}
//                 />
//             </View>
//         </View>
//     );
// }
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         flexDirection: 'column',
        
//     },
//     boxContainer1: {
//         flex: 1,
//         backgroundColor: 'red',
//         padding: 25,
//     },
//     boxContainer2: {
//         flex: 1,
//         minHeight: 300,
//         backgroundColor: 'green',
//     },
//     map: {
//         // flex: 1,
//         width: '100%',
//         height: '70%'
//     },
// });



//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------

// import React, { useState } from 'react';
// import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// const options = [
//     { id: '1', label: 'Java' },
//     { id: '2', label: 'JavaScript' },
//     { id: '3', label: 'Python' },
// ];

// export default function CustomDropdown() {
//     const [visible, setVisible] = useState(false);
//     const [selected, setSelected] = useState<string>('Selecciona un lenguaje');

//     const onSelect = (option: string) => {
//         setSelected(option);
//         setVisible(false);
//     };

//     return (
//         <View style={styles.container}>
//             <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
//                 <Text>{selected} hola </Text>
//             </TouchableOpacity>

//             <Modal transparent visible={visible} animationType="slide">
//                 <TouchableOpacity style={styles.modalOverlay} onPress={() => setVisible(false)}>
//                     <View style={styles.modalContent}>
//                         <FlatList
//                             data={options}
//                             keyExtractor={(item) => item.id}
//                             renderItem={({ item }) => (
//                                 <TouchableOpacity
//                                     style={styles.option}
//                                     onPress={() => onSelect(item.label)}
//                                 >
//                                     <Text>{item.label}</Text>
//                                 </TouchableOpacity>
//                             )}
//                         />
//                     </View>
//                 </TouchableOpacity>
//             </Modal>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { marginTop: 50, alignItems: 'center' },
//     button: {
//         padding: 15,
//         borderWidth: 1,
//         borderRadius: 5,
//         width: 200,
//         alignItems: 'center',
//     },
//     modalOverlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0,0,0,0.3)',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     modalContent: {
//         backgroundColor: 'white',
//         width: 250,
//         borderRadius: 10,
//         padding: 10,
//     },
//     option: {
//         padding: 15,
//         borderBottomWidth: 1,
//         borderColor: '#ccc',
//     },
// });

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