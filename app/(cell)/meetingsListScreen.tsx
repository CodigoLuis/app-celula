import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Platform,
    Dimensions,
    TouchableOpacity, // Importante para hacer la tarjeta clickeable
    Alert,
} from 'react-native';

const { width } = Dimensions.get('window');

// --- TIPOS DE FILTRO ---
type FilterType = 'MONTH' | 'QUARTER' | 'YEAR';

// --- INTERFACES (Reutilizadas) ---
interface MeetingDisplay {
    id: string;
    date: string; // YYYY-MM-DD
    title: string;
    start_time: string;
    end_time?: string;
    location?: string | null;
    guests: number;
    offering: number;
    hasDetails: { dynamic: boolean; praise: boolean; consolidation: boolean; };
}

interface Summary {
    totalMeetings: number;
    totalGuests: number;
    totalOffering: number;
}

// --- CONSTANTES Y HELPERS DE FECHA ---

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// Función auxiliar para obtener el trimestre
const getQuarter = (month: number): number => {
    if (month >= 1 && month <= 3) return 1;
    if (month >= 4 && month <= 6) return 2;
    if (month >= 7 && month <= 9) return 3;
    return 4; // Q4 (10, 11, 12)
};

// --- MOCK DATA CON MÚLTIPLES PERIODOS ---
const MOCK_REGISTERED_MEETINGS: MeetingDisplay[] = [
    // DICIEMBRE 2025 (Q4)
    { id: '1', date: '2025-12-05', title: 'Reunión Semanal de Célula', start_time: '19:00', guests: 2, offering: 15.50, location: null, hasDetails: { dynamic: true, praise: false, consolidation: true }, },
    { id: '2', date: '2025-12-10', title: 'Conferencia Especial', start_time: '10:00', guests: 15, offering: 150.00, location: 'Auditorio Central', hasDetails: { dynamic: true, praise: true, consolidation: true }, },
    // NOVIEMBRE 2025 (Q4)
    { id: '6', date: '2025-11-20', title: 'Cena de Acción de Gracias', start_time: '20:00', guests: 10, offering: 50.00, location: 'Casa Lider', hasDetails: { dynamic: false, praise: true, consolidation: false }, },
    // ENERO 2026 (Q1)
    { id: '4', date: '2026-01-15', title: 'Célula de Inicio de Año', start_time: '19:00', guests: 5, offering: 45.00, location: null, hasDetails: { dynamic: true, praise: true, consolidation: false }, },
    { id: '5', date: '2026-01-22', title: 'Reunión de Consejería', start_time: '17:00', guests: 0, offering: 0.00, location: null, hasDetails: { dynamic: false, praise: false, consolidation: true }, },
    // FEBRERO 2026 (Q1)
    { id: '7', date: '2026-02-01', title: 'Entrenamiento de Discípulos', start_time: '09:00', guests: 3, offering: 20.00, location: 'Salón B', hasDetails: { dynamic: true, praise: true, consolidation: true }, },
];

// --- LÓGICA DE FILTRADO UNIFICADA ---

/**
 * Filtra las reuniones y calcula el resumen basado en el tipo y periodo.
 * @param period Formato: 'MM/YYYY' | 'Q#/YYYY' | 'YYYY'
 */
const calculateSummary = (
    meetings: MeetingDisplay[],
    filterType: FilterType,
    period: string
): { summary: Summary, filteredList: MeetingDisplay[] } => {

    const filteredList = meetings.filter(meeting => {
        const [year, monthStr] = meeting.date.split('-');
        const month = parseInt(monthStr);

        if (filterType === 'YEAR') {
            return year === period;
        }

        if (filterType === 'MONTH') {
            const targetMonth = parseInt(period.split('/')[0]).toString().padStart(2, '0');
            const targetYear = period.split('/')[1];
            return year === targetYear && monthStr === targetMonth;
        }

        if (filterType === 'QUARTER') {
            // period es 'Q#/YYYY', e.g., 'Q4/2025'
            const targetQuarter = parseInt(period.split('/')[0].slice(1));
            const targetYear = period.split('/')[1];

            return year === targetYear && getQuarter(month) === targetQuarter;
        }

        return false;
    });

    const summary: Summary = filteredList.reduce((acc, meeting) => {
        acc.totalMeetings += 1;
        acc.totalGuests += meeting.guests;
        acc.totalOffering += meeting.offering;
        return acc;
    }, {
        totalMeetings: 0,
        totalGuests: 0,
        totalOffering: 0,
    });

    return { summary, filteredList };
};

// --- COMPONENTE DE TARJETA (MeetingCard) ---
// Modificado para aceptar la función onViewDetails
const MeetingCard: React.FC<{ meeting: MeetingDisplay, onViewDetails: (meetingId: string) => void }> = ({ meeting, onViewDetails }) => {
    
    // Alertas que simulan la navegación a otras pantallas
    const handleEdit = () => { Alert.alert('Modificar Reunión', `Navegar a edición: ${meeting.id}`); };
    const handleAttendance = () => { Alert.alert('Registrar Asistentes', `Navegar a asistencia: ${meeting.id}`); };

    const formattedDate = new Date(meeting.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', });
    const hasGuests = meeting.guests > 0;
    const hasOffering = meeting.offering > 0;

    // Utilizamos TouchableOpacity para hacer toda la tarjeta clickeable
    return (
        <TouchableOpacity style={styles.card} onPress={() => onViewDetails(meeting.id)}>
            <View style={styles.dateTimeContainer}>
                <Text style={styles.dateText}>{formattedDate}</Text>
                <View style={styles.timeBadge}>
                    <Text style={styles.timeText}>{meeting.start_time} - {meeting.end_time || 'N/A'}</Text>
                </View>
            </View>
            <Text style={styles.title}>{meeting.title}</Text>
            {meeting.location && (<Text style={styles.locationText}>📍 Ubicación: {meeting.location}</Text>)}
            <View style={styles.separator} />
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>👥 Invitados:</Text>
                <Text style={[styles.detailValue, hasGuests && styles.detailHighlight]}>{meeting.guests}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>💰 Ofrenda:</Text>
                <Text style={[styles.detailValue, hasOffering && styles.detailHighlight]}>${meeting.offering.toFixed(2)}</Text>
            </View>
            <View style={styles.activitiesContainer}>
                {meeting.hasDetails.dynamic && <Text style={styles.activityChip}>Dinámica ✅</Text>}
                {meeting.hasDetails.praise && <Text style={styles.activityChip}>Alabanza 🙏</Text>}
                {meeting.hasDetails.consolidation && <Text style={styles.activityChip}>Consolidación 🤝</Text>}
            </View>
            <View style={styles.separator} />
            <View style={styles.actionButtonsContainer}>
                {/* Los botones de acción deben estar envueltos en TouchableOpacity para ser interactivos */}
                <TouchableOpacity 
                    style={[styles.actionButton, styles.buttonEdit]} 
                    onPress={(e) => { 
                        // e.stopPropagation() se usaría en React Native Gesture Handler
                        // o si los botones no estuvieran dentro del TouchableOpacity padre.
                        // En este caso, el TouchableOpacity interno prevalece.
                        handleEdit(); 
                    }} 
                >
                    <Text style={styles.buttonText}>✏️ Modificar Datos</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.actionButton, styles.buttonAttendance]} 
                    onPress={(e) => { 
                        handleAttendance(); 
                    }} 
                >
                    <Text style={styles.buttonText}>➕ Asistentes</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity> // Cierre de TouchableOpacity
    );
};

// --- COMPONENTE PRINCIPAL ---
const MeetingsListScreen: React.FC = () => {

    // --- NUEVO MANEJADOR DE DETALLES ---
    const handleViewDetails = (meetingId: string) => {
        Alert.alert('Ver Detalles Completos', `Navegar a la pantalla de detalles de la reunión ID: ${meetingId}`);
        // Aquí iría tu lógica de navegación real (e.g., navigation.navigate('MeetingDetails', { id: meetingId }))
    };
    // ------------------------------------

    // Estado para el tipo de filtro (Inicial: Mes)
    const [currentFilterType, setCurrentFilterType] = useState<FilterType>('MONTH');
    // Estado para el periodo seleccionado (Inicial: Diciembre 2025)
    const [selectedDatePeriod, setSelectedDatePeriod] = useState<string>('12/2025');

    // 1. CÁLCULO MEMORIZADO DEL RESUMEN Y LA LISTA FILTRADA
    const { summary, filteredList } = useMemo(() =>
        calculateSummary(MOCK_REGISTERED_MEETINGS, currentFilterType, selectedDatePeriod),
        [currentFilterType, selectedDatePeriod]
    );

    // 2. Lógica para mostrar el periodo actual en el botón de selección
    const getDisplayPeriod = (): string => {
        if (currentFilterType === 'MONTH') {
            const [month, year] = selectedDatePeriod.split('/');
            return `${monthNames[parseInt(month) - 1]} ${year}`;
        }
        if (currentFilterType === 'QUARTER') {
            const [quarter, year] = selectedDatePeriod.split('/');
            return `Trimestre ${quarter.slice(1)} de ${year}`;
        }
        if (currentFilterType === 'YEAR') {
            return selectedDatePeriod;
        }
        return 'Seleccionar Periodo';
    };

    // 3. Simulación del selector de Periodo (Mes/Trimestre/Año)
    const openPeriodSelector = () => {
        let options: { text: string, onPress: () => void }[] = [];

        if (currentFilterType === 'MONTH') {
            options = [
                { text: 'Diciembre 2025', onPress: () => setSelectedDatePeriod('12/2025') },
                { text: 'Enero 2026', onPress: () => setSelectedDatePeriod('1/2026') },
                { text: 'Noviembre 2025', onPress: () => setSelectedDatePeriod('11/2025') },
            ];
        } else if (currentFilterType === 'QUARTER') {
            options = [
                { text: 'Q4 2025 (Oct-Dic)', onPress: () => setSelectedDatePeriod('Q4/2025') },
                { text: 'Q1 2026 (Ene-Mar)', onPress: () => setSelectedDatePeriod('Q1/2026') },
            ];
        } else if (currentFilterType === 'YEAR') {
            options = [
                { text: 'Año 2025', onPress: () => setSelectedDatePeriod('2025') },
                { text: 'Año 2026', onPress: () => setSelectedDatePeriod('2026') },
            ];
        }

        Alert.alert(
            `Cambiar ${currentFilterType}`,
            "Selecciona el periodo que deseas visualizar:",
            [...options, { text: "Cancelar", style: "cancel" }]
        );
    };

    if (MOCK_REGISTERED_MEETINGS.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Aún no hay reuniones registradas.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>📅 Mis Reuniones Registradas</Text>

            {/* --- SELECTOR DE TIPO DE FILTRO (Segmented Control) --- */}
            <View style={styles.filterTypeSelector}>
                {(['MONTH', 'QUARTER', 'YEAR'] as FilterType[]).map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[
                            styles.filterTypeButton,
                            currentFilterType === type && styles.filterTypeButtonActive,
                        ]}
                        onPress={() => {
                            setCurrentFilterType(type);
                            // Resetear el periodo al cambiar el tipo
                            if (type === 'MONTH') setSelectedDatePeriod('12/2025');
                            if (type === 'QUARTER') setSelectedDatePeriod('Q4/2025');
                            if (type === 'YEAR') setSelectedDatePeriod('2025');
                        }}
                    >
                        <Text style={[
                            styles.filterTypeButtonText,
                            currentFilterType === type && styles.filterTypeButtonTextActive,
                        ]}>
                            {type === 'MONTH' ? 'MES' : type === 'QUARTER' ? 'TRIMESTRE' : 'AÑO'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* --- SELECTOR DE PERIODO (Botón) --- */}
            <TouchableOpacity
                style={styles.periodButton}
                onPress={openPeriodSelector}
            >
                <Text style={styles.periodButtonText}>{getDisplayPeriod()} ▼</Text>
            </TouchableOpacity>

            {/* --- DASHBOARD DE INDICADORES (USA LOS DATOS FILTRADOS) --- */}
            <View style={styles.dashboard}>
                <View style={styles.indicatorCard}>
                    <Text style={styles.indicatorValue}>{summary.totalMeetings}</Text>
                    <Text style={styles.indicatorLabel}>Total Reuniones</Text>
                </View>
                <View style={styles.indicatorCard}>
                    <Text style={styles.indicatorValue}>{summary.totalGuests}</Text>
                    <Text style={styles.indicatorLabel}>Total Invitados</Text>
                </View>
                <View style={styles.indicatorCard}>
                    <Text style={styles.indicatorValue}>${summary.totalOffering.toFixed(2)}</Text>
                    <Text style={styles.indicatorLabel}>Total Ofrenda</Text>
                </View>
            </View>
            <View style={styles.separatorBig} />
            {/* --------------------------------- */}

            <Text style={styles.listSubtitle}>
                Mostrando {filteredList.length} reuniones:
            </Text>

            <FlatList
                data={filteredList} // Usa la lista FILTRADA
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <MeetingCard 
                        meeting={item} 
                        onViewDetails={handleViewDetails} // Pasamos la función de ver detalles
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View style={{ marginTop: 50, alignItems: 'center' }}>
                        <Text style={{ color: '#777', fontSize: 16 }}>No hay reuniones registradas para este periodo.</Text>
                    </View>
                )}
            />
        </View>
    );
};

// --- ESTILOS ADICIONALES/MODIFICADOS (Reutilizados) ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
        paddingHorizontal: 10,
    },
    listContent: {
        paddingBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1a237e',
        marginTop: 20,
        marginBottom: 15,
        textAlign: 'center',
    },
    listSubtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    
    // --- ESTILOS DE SELECTOR DE TIPO (Segmented Control) ---
    filterTypeSelector: {
        flexDirection: 'row',
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        marginBottom: 15,
        padding: 3,
    },
    filterTypeButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    filterTypeButtonActive: {
        backgroundColor: '#1a237e', // Azul oscuro
    },
    filterTypeButtonText: {
        color: '#333',
        fontWeight: '600',
        fontSize: 13,
    },
    filterTypeButtonTextActive: {
        color: 'white',
    },
    
    // --- ESTILOS DEL SELECTOR DE PERIODO ---
    periodButton: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#007bff',
        alignSelf: 'flex-start',
        marginBottom: 15,
        minWidth: width * 0.4,
    },
    periodButtonText: {
        color: '#007bff',
        fontWeight: 'bold',
        fontSize: 15,
    },
    
    // --- DASHBOARD STYLES ---
    dashboard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        marginBottom: 5,
    },
    indicatorCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        width: (width - 40) / 3,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, },
            android: { elevation: 2, },
        }),
    },
    indicatorValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a237e',
    },
    indicatorLabel: {
        fontSize: 11,
        color: '#777',
        marginTop: 3,
        textAlign: 'center',
    },
    separatorBig: {
        height: 10,
        backgroundColor: '#eee',
        marginHorizontal: -10,
        marginBottom: 15,
    },
    
    // --- Card Styles (AHORA ES UN TOUCHABLEOPACITY) ---
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        // Añadido efecto de elevación para sugerir clickeabilidad
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, },
            android: { elevation: 4, },
        }),
    },
    dateTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dateText: { fontSize: 16, fontWeight: 'bold', color: '#1a237e', },
    timeBadge: { backgroundColor: '#e6f0ff', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, },
    timeText: { fontSize: 14, fontWeight: '600', color: '#007bff', },
    title: { fontSize: 18, fontWeight: '800', color: '#333', marginBottom: 5, },
    locationText: { fontSize: 14, color: '#777', marginBottom: 10, fontStyle: 'italic', },
    separator: { height: 1, backgroundColor: '#eee', marginVertical: 10, },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 3, },
    detailLabel: { fontSize: 15, color: '#555', },
    detailValue: { fontSize: 15, fontWeight: '600', color: '#333', },
    detailHighlight: { color: '#4CAF50', },
    activitiesContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, paddingTop: 10, },
    activityChip: {
        backgroundColor: '#e3f3e3',
        color: '#2e7d32',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 15,
        marginRight: 8,
        marginBottom: 5,
        fontSize: 13,
        fontWeight: '600',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    buttonEdit: {
        backgroundColor: '#007bff',
    },
    buttonAttendance: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f7fa',
    },
    emptyText: {
        fontSize: 18,
        color: '#777',
        textAlign: 'center',
    },
});

export default MeetingsListScreen;