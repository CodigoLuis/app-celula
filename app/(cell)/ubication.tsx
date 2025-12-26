import React, { useState, useRef, useMemo, useCallback } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Alert, 
    TouchableOpacity, 
    ScrollView,
    ActivityIndicator,
    Platform,
    Button 
} from 'react-native';
import { WebView } from 'react-native-webview';

// --- INTERFACES y MOCK DATA ---
interface MeetingPlace {
    id: number;
    title: string;
    lat: number;
    lng: number;
    details: string;
}

interface LatLng {
    lat: number;
    lng: number;
}

// Datos simulados de ubicaciones y posición del usuario
const MOCK_REGISTERED_PLACES: MeetingPlace[] = [
    { id: 1, title: "Casa de Lider Juan", lat: 10.4501, lng: -64.1850, details: "Cerca de la plaza principal" },
    { id: 2, title: "Salón de Reuniones", lat: 10.4735, lng: -64.1520, details: "Esquina con la Avenida 2" },
    { id: 3, title: "Cafetería 'El Encuentro'", lat: 10.4610, lng: -64.1670, details: "Segundo piso del centro comercial" },
];

// 🛑 Ubicación de Origen (Simulada)
const USER_START_POSITION: LatLng = { lat: 10.4665, lng: -64.1667 }; 

// --- CONSTANTES DE ESTILO ---
const PRIMARY_COLOR = '#1A237E'; 
const ACCENT_COLOR = '#4CAF50'; 

// --- COMPONENTE PRINCIPAL ---
const FindMeetingPlaceScreen: React.FC = () => {
    const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
    const [loadingMap, setLoadingMap] = useState<boolean>(true);
    const [routeStats, setRouteStats] = useState<{ distance: string, duration: string } | null>(null);
    const webViewRef = useRef<WebView>(null);

    const selectedPlace = useMemo(() => 
        MOCK_REGISTERED_PLACES.find(p => p.id === selectedPlaceId),
        [selectedPlaceId]
    );

    const sendCommandToMap = useCallback((command: string, args: any): void => {
        if (webViewRef.current) {
            const jsCode = `
                receiveCommand('${command}', ${JSON.stringify(args)});
                true;
            `;
            webViewRef.current.injectJavaScript(jsCode);
        }
    }, []);

    // 💡 NUEVA FUNCIÓN: Limpia la selección y la ruta.
    const handleClearSelection = useCallback(() => {
        setSelectedPlaceId(null);
        setRouteStats(null);
        
        // Enviar comando al WebView para borrar la ruta y restablecer marcadores
        sendCommandToMap('clearMapSelection', {
            user: USER_START_POSITION,
            places: MOCK_REGISTERED_PLACES,
            selectedId: null,
        });
        
    }, [sendCommandToMap]);


    // Manejar la selección de un lugar (Activa el trazado de ruta)
    const handleSelectPlace = useCallback((place: MeetingPlace) => {
        setSelectedPlaceId(place.id);
        setRouteStats(null); 
        
        if (!webViewRef.current) return;

        // Trazar ruta
        sendCommandToMap('drawRouteAndPlaces', {
            user: USER_START_POSITION,
            start: USER_START_POSITION, 
            end: { lat: place.lat, lng: place.lng }, 
            places: MOCK_REGISTERED_PLACES,
            selectedId: place.id,
        });

    }, [sendCommandToMap]);

    // Manejar mensajes desde el WebView
    const onWebViewMessage = (event: any): void => {
        const message = JSON.parse(event.nativeEvent.data);
        
        if (message.type === 'mapReady') {
            setLoadingMap(false);
            sendCommandToMap('drawInitialMarkers', {
                user: USER_START_POSITION,
                places: MOCK_REGISTERED_PLACES,
                selectedId: selectedPlaceId, 
            });
            
        } else if (message.type === 'markerClicked') {
            const place = MOCK_REGISTERED_PLACES.find(p => p.id === message.id);
            if (place) {
                handleSelectPlace(place);
            }
        } else if (message.type === 'routeDrawn') {
            setRouteStats({
                distance: message.distance,
                duration: message.duration
            });
        }
    };

    // --- HTML/JS para el mapa de navegación (ACTUALIZADO) ---
    const mapHtml: string = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
            <style>
                html, body { height: 100%; margin: 0; } 
                #map { height: 100%; }
                /* Clases CSS para marcadores */
                .leaflet-marker-icon.user-marker { background-color: blue; border-radius: 50%; border: 3px solid white; }
                .leaflet-marker-icon.place-marker { background-color: ${PRIMARY_COLOR}; border-radius: 50%; border: 3px solid white; }
                .leaflet-marker-icon.selected-place { background-color: ${ACCENT_COLOR}; border-radius: 50%; border: 3px solid white; }
            </style>
        </head>
        <body>
            <div id="map"></div>
            <script>
                const PRIMARY_COLOR_JS = '${PRIMARY_COLOR}';
                
                let map, userMarker, placeMarkers = {}, routeLayer;
                
                map = L.map('map').setView([${USER_START_POSITION.lat}, ${USER_START_POSITION.lng}], 13);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                const createCustomIcon = (className) => L.divIcon({ className: className, iconSize: [15, 15] });

                const drawMarker = (lat, lng, id, title, iconClass, isUser = false) => {
                    const markerIcon = createCustomIcon(iconClass);
                    
                    if (isUser) {
                        return L.marker([lat, lng], { 
                            icon: markerIcon,
                            zIndexOffset: 1000,
                        }).addTo(map).bindPopup('<b>Tu Posición Actual</b>');
                    } 
                    else {
                        const marker = L.marker([lat, lng], { 
                            icon: markerIcon
                        }).addTo(map).bindPopup(\`<b>\${title}</b><br>ID: \${id}\`);

                        marker.on('click', () => {
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'markerClicked',
                                id: id
                            }));
                        });
                        return marker;
                    }
                };

                const clearRoute = () => {
                    if (routeLayer) {
                        map.removeLayer(routeLayer);
                        routeLayer = null;
                    }
                };

                const drawRoute = (start, end) => {
                    clearRoute();
                    const url = \`https://router.project-osrm.org/route/v1/driving/\${start.lng},\${start.lat};\${end.lng},\${end.lat}?overview=full&geometries=geojson\`;
                    
                    fetch(url)
                        .then(response => response.json())
                        .then(data => {
                            if (data.routes && data.routes.length > 0) {
                                const route = data.routes[0];
                                const geojson = route.geometry;
                                
                                routeLayer = L.geoJSON(geojson, {
                                    style: {
                                        color: PRIMARY_COLOR_JS,
                                        weight: 5,
                                        opacity: 0.8
                                    }
                                }).addTo(map);

                                map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });

                                const distance = (route.distance / 1000).toFixed(2);
                                const duration = Math.round(route.duration / 60);
                                
                                window.ReactNativeWebView.postMessage(JSON.stringify({
                                    type: 'routeDrawn',
                                    distance: distance,
                                    duration: duration
                                }));

                            } else {
                                window.ReactNativeWebView.postMessage(JSON.stringify({
                                    type: 'routeError',
                                    message: 'No se pudo encontrar una ruta entre los puntos.'
                                }));
                            }
                        })
                        .catch(error => console.error('Error fetching route:', error));
                };

                // Función que recibe los comandos de React Native
                window.receiveCommand = function(command, args) {
                    
                    // Limpiar marcadores y ruta existentes
                    Object.values(placeMarkers).forEach(m => map.removeLayer(m));
                    placeMarkers = {};
                    if(userMarker) map.removeLayer(userMarker);
                    clearRoute();

                    // 1. Dibujar marcador de usuario (Origen)
                    userMarker = drawMarker(args.user.lat, args.user.lng, 'user', 'Tú', 'user-marker', true);

                    // 2. Dibujar marcadores de lugares (Destino y otros)
                    args.places.forEach(p => {
                        const isSelected = p.id === args.selectedId;
                        // Si es 'clearMapSelection', selectedId será null, usando 'place-marker'
                        const iconClass = isSelected ? 'selected-place' : 'place-marker'; 
                            
                        placeMarkers[p.id] = drawMarker(p.lat, p.lng, p.id, p.title, iconClass, false);
                    });
                    
                    // 3. Trazar la ruta si el comando lo indica
                    if (command === 'drawRouteAndPlaces') {
                        drawRoute(args.start, args.end);
                    }
                    // Si el comando es 'clearMapSelection', solo limpiamos y redibujamos marcadores por defecto.
                };

                // Notificar a React Native que el mapa está listo
                map.whenReady(() => {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapReady' }));
                });
            </script>
        </body>
        </html>
    `;

    return (
        <View style={findStyles.container}>
            <Text style={findStyles.header}>📍 Encontrar Ubicación de Reunión</Text>
            
            {/* 1. SECCIÓN DE MAPA */}
            <View style={findStyles.mapContainer}>
                {loadingMap && (
                    <View style={findStyles.loadingOverlay}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                        <Text style={{ marginTop: 10, color: PRIMARY_COLOR }}>Cargando mapa...</Text>
                    </View>
                )}
                <WebView
                    ref={webViewRef}
                    source={{ html: mapHtml }}
                    style={findStyles.map}
                    onMessage={onWebViewMessage}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    originWhitelist={['*']}
                />
            </View>

            {/* 2. DETALLES DE RUTA */}
            <View style={findStyles.detailsContainer}>
                <Text style={findStyles.subtitle}>Ruta de Navegación:</Text>
                {selectedPlace ? (
                    <View>
                        <Text style={findStyles.placeTitle}>Destino: **{selectedPlace.title}**</Text>
                        <Text style={findStyles.placeDetails}>
                            Detalles: {selectedPlace.details}
                        </Text>
                        {routeStats ? (
                             <Text style={findStyles.routeInfo}>
                                **Ruta Calculada:** {routeStats.distance} km / {routeStats.duration} min. 
                            </Text>
                        ) : (
                            <Text style={findStyles.emptyText}>Trazando ruta...</Text>
                        )}
                        <View style={{ marginTop: 10 }}>
                            <Button 
                                title="❌ Limpiar Selección / Ruta" 
                                onPress={handleClearSelection} 
                                color="#E53935" // Rojo
                            />
                        </View>
                    </View>
                ) : (
                    <Text style={findStyles.emptyText}>Selecciona una ubicación de la lista inferior para trazar la ruta.</Text>
                )}
            </View>

            {/* 3. LISTA DE LUGARES REGISTRADOS */}
            <ScrollView style={findStyles.listScrollView}>
                <Text style={findStyles.subtitle}>Ubicaciones Registradas:</Text>
                {MOCK_REGISTERED_PLACES.map(place => (
                    <TouchableOpacity
                        key={place.id}
                        style={[
                            findStyles.placeCard,
                            selectedPlaceId === place.id && findStyles.selectedPlaceCard
                        ]}
                        onPress={() => handleSelectPlace(place)}
                    >
                        <Text style={findStyles.cardTitle}>{place.title}</Text>
                        <Text style={findStyles.cardDetails}>
                            {place.details}
                        </Text>
                        <Text style={findStyles.cardAction}>
                            {selectedPlaceId === place.id ? '✅ RUTA ACTIVA' : 'Trazar ruta ➔'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// --- ESTILOS ---
const findStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
        marginBottom: 15,
        textAlign: 'center',
    },
    mapContainer: {
        height: 350,
        marginBottom: 15,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ddd',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, },
            android: { elevation: 5, },
        }),
    },
    map: {
        flex: 1,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '700',
        color: PRIMARY_COLOR,
        marginBottom: 8,
    },
    detailsContainer: {
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#eee',
    },
    placeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    placeDetails: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
    },
    routeInfo: {
        fontSize: 15,
        fontWeight: 'bold',
        color: ACCENT_COLOR,
        marginTop: 5,
    },
    emptyText: {
        color: '#888',
        fontStyle: 'italic',
        fontSize: 14,
    },
    listScrollView: {
        flex: 1,
    },
    placeCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderLeftWidth: 5,
        borderLeftColor: '#ccc',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, },
            android: { elevation: 2, },
        }),
    },
    selectedPlaceCard: {
        borderLeftColor: ACCENT_COLOR,
        backgroundColor: '#e8f5e9',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: PRIMARY_COLOR,
    },
    cardDetails: {
        fontSize: 13,
        color: '#666',
        marginTop: 3,
    },
    cardAction: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#007bff',
        marginTop: 5,
    },
});

export default FindMeetingPlaceScreen;