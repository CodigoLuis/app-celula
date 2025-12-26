import InputWithLabel from '@/components/molecules/inputWithLabel';
import TextAreaWithLabel from '@/components/molecules/textAreaWithLabel';
import React, { useRef, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { FieldState } from '@/interface/default';

// Interfaz para los datos de la ubicación
interface MeetingPlaceData {
  location: string;
  details: FieldState;
  user_id: number;
}

// Interfaz para coordenadas del mapa
interface LatLng {
  lat: number;
  lng: number;
}

const MeetingPlaceScreen: React.FC = () => {
  const [title, setTitle] = useState<FieldState>({ value: '', isValid: false });
  const [details, setDetails] = useState<FieldState>({ value: '', isValid: false });
  const [location, setLocation] = useState<string>('');
  const [selectedLatLng, setSelectedLatLng] = useState<LatLng | null>(null);
  const [hasMarker, setHasMarker] = useState<boolean>(false); // Nuevo: Estado para saber si hay marcador
  const webViewRef = useRef<WebView>(null);

  // Función para guardar en DB (simulada)
  // const saveMeetingPlace = async (data: MeetingPlaceData): Promise<void> => {
  //   try {
  //     const response = await fetch('https://tu-api.com/api/meeting-places', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(data),
  //     });
  //     if (response.ok) {
  //       Alert.alert('Éxito', 'Ubicación guardada');
  //       setLocation('');
  //       setDetails('');
  //       setSelectedLatLng(null);
  //       setHasMarker(false); // Resetear marcador al guardar
  //     } else {
  //       throw new Error('Error al guardar');
  //     }
  //   } catch (error) {
  //     Alert.alert('Error');
  //   //   Alert.alert('Error', error.message);
  //   }
  // };

  const validateTitle = (value: string): boolean => Boolean(value.trim() && /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9 ]{3,30}$/.test(value.trim())); // Solo letras, espacios y números
  const validateDescripcion = (value: string): boolean => Boolean(value.trim() && /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9 ]{5,60}$/.test(value.trim())); // Solo letras, espacios y números

  const getInputStyle = (field: FieldState) => [
    styles.input,
    {
      borderColor: Boolean(field.value) && !field.isValid ? '#e74c3c' : // ← FIJO: Boolean() coerce a boolean
        field.isValid ? '#4CAF50' : '#ccc', // Verde si válido, gris default
    },
  ];

  const changeDetails = (value: string) => {
    const newValue = value;
    setDetails({ value: newValue, isValid: validateDescripcion(newValue) });
    return;
  };

  const changeTitle = (value: string) => {
    const newValue = value;
    setTitle({ value: newValue, isValid: validateTitle(newValue) });
    return;
  };

  // Manejar selección en el mapa (sin cambios)
  const onWebViewMessage = (event: any): void => {
    const message = JSON.parse(event.nativeEvent.data);
    if (message.type === 'markerPlaced') {
      const { lat, lng }: LatLng = message;
      setSelectedLatLng({ lat, lng });
      setLocation(`${lat}, ${lng}`);
      setHasMarker(true);
    }
  };

  // Nuevo: Función para enviar comandos al WebView
  const sendCommandToMap = (command: string): void => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`receiveCommand('${command}');`);
    }
  };

  // Nuevo: Manejadores para botones
  const handleMarkCenter = (): void => {
    sendCommandToMap('markCenter');
  };

  const handleRemoveMarker = (): void => {
    if (hasMarker) {
      sendCommandToMap('removeMarker');
      setSelectedLatLng(null);
      setLocation('');
      setHasMarker(false);
    } else {
      Alert.alert('No hay marcador', 'Primero selecciona o marca una ubicación.');
    }
  };

  // HTML/JS para el mapa (modificado para recibir comandos)
  //   // Formato: https://www.openstreetmap.org/#map=zoom/lat/lon
  //   const mapUrl = 'https://www.openstreetmap.org/#map=10/10.4806/-66.9036';  // Caracas, Venezuela

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
        map = L.map('map').setView([10.4665, -64.1667], 12); // Centro en Cumaná, Venezuela
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Función para recibir comandos desde React Native
        window.receiveCommand = function(command) {
          if (command === 'markCenter') {
            const center = map.getCenter();
            if (marker) map.removeLayer(marker);
            marker = L.marker(center).addTo(map);
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'markerPlaced',
              lat: center.lat,
              lng: center.lng,
            }));
          } else if (command === 'removeMarker') {
            if (marker) {
              map.removeLayer(marker);
              marker = null;
            }
          }
        };
        
        // Evento de clic (sin cambios, pero ahora envía 'type' para distinguir)
        map.on('click', (e) => {
          if (marker) map.removeLayer(marker);
          marker = L.marker(e.latlng).addTo(map);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'markerPlaced',
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
    // saveMeetingPlace(data);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

      {/* <View style={styles.container}> */}
      <Text style={styles.title}>Agregar Ubicación de Reunión</Text>

      <InputWithLabel
        labelText="Título de la ubicación"
        value={title.value}
        setValue={changeTitle}
        placeholder="ej. nombre o titulo del lugar"
        styleContainer={{ marginVertical: 5 }}
        styleLabel={styles.label}
        styleInput={getInputStyle(title)}
        mandatory={true}
      />

      <TextAreaWithLabel
        labelText="Descripción"
        value={details.value}
        placeholder='Detalles (ej. Descripción del lugar)'
        setValue={changeDetails}
        // styleContainer={{ marginVertical: 5 }}
        styleLabel={styles.label}
        styleInput={getInputStyle(details)}
        mandatory={true}
      />

      <InputWithLabel
        labelText="Ubicación"
        value={location}
        setValue={setLocation}
        // placeholder="Ej. V-00.000.000 o E-0.000.000"
        styleContainer={{ marginVertical: 5 }}
        styleLabel={styles.label}
        // styleInput={getInputStyle(idNumber)}
        // mandatory={true}
        editable={false}
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

      {/* Nuevos botones de marcado */}
      <View style={styles.buttonContainer}>
        <Button title="Marcar Centro del Mapa" onPress={handleMarkCenter} />
        <Button title="Eliminar Marcador" onPress={handleRemoveMarker} color="red" />
      </View>

      <Button title="Guardar Ubicación" onPress={handleSubmit} />
   
    </ScrollView>
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    letterSpacing: 0.2,
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
  // Nuevo: Estilos para los botones
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

export default MeetingPlaceScreen;