import React, { useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    ScrollView,
    Switch,
    Alert,
    Platform,
} from 'react-native';
import { FieldState, DateFieldState } from '../../interface/default';
import InputWithLabel from '@/components/molecules/inputWithLabel';
import InputDateWithLabel from '@/components/molecules/inputDateWithLabel ';
import SelectWithLabel from '@/components/molecules/selectWithLabel';
import optionsContext from '@/contexts/options/optionsContext';

// --- MOCK DATA PARA SELECTORES ---
const MOCK_TITLES = [
    { id: 'T1', name: 'Reunión Semanal de Célula' },
    { id: 'T2', name: 'Reunión de Liderazgo' },
    { id: 'T3', name: 'Conferencia Especial' },
];

const MOCK_LOCATIONS = [
    { id: 'L1', name: 'Auditorio Central' },
    { id: 'L2', name: 'Sala de Capacitación 1' },
    { id: 'L3', name: 'Parque Los Tulipanes' },
];

// Definición de las interfaces basadas en tus tablas
interface Meeting {
    date: string; // Formato YYYY-MM-DD
    start_time: string; // Formato HH:MM
    end_time: string; // Opcional

    // IDs de llaves foráneas:
    cell_id: number;
    user_id: number;
    title_id: string; // <--- Campo Select 1
    location_id: string; // <--- Campo Select 2 (Nuevo)
}

interface MeetingDetails {
    dynamic: boolean;
    praise: boolean;
    message: boolean;
    offering: string;
    consolidation: boolean;
    guests: string;
}

// Valores iniciales
const INITIAL_MEETING_STATE: Meeting = {
    date: new Date().toISOString().split('T')[0],
    start_time: '19:00',
    end_time: '',
    cell_id: 1,
    user_id: 101,
    title_id: MOCK_TITLES[0].id, // Valor por defecto
    location_id: '',
};

const INITIAL_DETAILS_STATE: MeetingDetails = {
    dynamic: false,
    praise: false,
    message: false,
    offering: '0.00',
    consolidation: false,
    guests: '0',
};

// No vacío
const validateBoolean = (value: string): boolean => !!value;

const MeetingRegistrationScreen: React.FC = () => {
    const [typeCellId, setTypeCellId] = useState<FieldState>({ value: "", isValid: null });
    const [date, setDate] = useState<DateFieldState>({ value: null, isValid: null }); // Estado para la fecha
    const [showPicker01, setShowPicker01] = useState<boolean>(false); // Controla la visibilidad del picker
    const [startTime, setStartTime] = useState<DateFieldState>({ value: null, isValid: null }); // Estado para la fecha
    const [showPicker02, setShowPicker02] = useState<boolean>(false); // Controla la visibilidad del picker
    const [endTime, setEndTime] = useState<DateFieldState>({ value: null, isValid: null }); // Estado para la fecha
    const [showPicker03, setShowPicker03] = useState<boolean>(false); // Controla la visibilidad del picker

    const [guest, setGuest] = useState<FieldState>({ value: "", isValid: null });
    const [offering, setOffering] = useState<FieldState>({ value: "", isValid: null });

    const [meeting, setMeeting] = useState<Meeting>(INITIAL_MEETING_STATE);
    const [showDetails, setShowDetails] = useState(false);
    const [showLocation, setShowLocation] = useState(false); // Nuevo estado para Ubicación
    const [details, setDetails] = useState<MeetingDetails>(INITIAL_DETAILS_STATE);
    const [loading, setLoading] = useState(false);

    const { territories, optionsTerritories } = useContext(optionsContext);

    useEffect(() => {
        optionsTerritories();
    }, []);



    const changeDate = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date.value;
        setShowPicker01(Platform.OS === 'ios'); // En iOS, el picker se queda abierto; en Android, se cierra
        setDate({ value: currentDate, isValid: validateBoolean(String(currentDate)) });
    };

    const showDatepicker01 = () => {
        setShowPicker01(true);
    };

    const changeStartTime = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || startTime.value;
        setShowPicker02(Platform.OS === 'ios'); // En iOS, el picker se queda abierto; en Android, se cierra
        setStartTime({ value: currentDate, isValid: validateBoolean(String(currentDate)) });
    };

    const showDatepicker02 = () => {
        setShowPicker02(true);
    };

    const changeEndTime = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || endTime.value;
        setShowPicker03(Platform.OS === 'ios'); // En iOS, el picker se queda abierto; en Android, se cierra
        setEndTime({ value: currentDate, isValid: validateBoolean(String(currentDate)) });
    };

    const showDatepicker03 = () => {
        setShowPicker03(true);
    };

    const changeTypeCell = (value: string) => {
        setTypeCellId({ value, isValid: validateBoolean(value) });
        return;
    };

    const arrayConstructorTerritories = () => {

        let dataArray: { title: string; id: string }[] = [];

        for (const element of territories.data) {
            const value1 = `${element.name} - ${element.male === true ? "Hombres" : "Mujeres"}`;
            const value2 = element.id;

            dataArray.push({
                "title": value1,
                "id": value2
            })
        }

        return dataArray;
    }

    const changeGuest = (value: string) => {
        const newValue = value;
        setGuest({ value: newValue, isValid: Number(value) > 0 ? true : false });
        return;
    };

    const changeOffering = (value: string) => {
        const newValue = value;
        setOffering({ value: newValue, isValid: Number(value) >= 0 ? true : false });
        return;
    };

    const getInputStyle = (field: FieldState) => [
        styles.input,
        {
            borderColor: Boolean(field.value) && !field.isValid ? '#e74c3c' : // ← FIJO: Boolean() coerce a boolean
                field.isValid ? '#4CAF50' : '#ccc', // Verde si válido, gris default
        },
    ];




    // Manejador genérico de cambios+++++++++++++++++++++++++++++++
    const handleChange = (key: keyof Meeting, value: string | number) => {
        setMeeting(prev => ({ ...prev, [key]: value }));
    };

    // Manejador genérico para detalles ++++++++++++++++++++++++++
    const handleDetailsChange = (key: keyof MeetingDetails, value: string | boolean) => {
        setDetails(prev => ({ ...prev, [key]: value }));
    };


    // Lógica de Guardado (Simulada) +++++++++++++++++++++++++++++
    const handleSubmit = async () => {
        if (!meeting.date || !meeting.start_time) {
            Alert.alert('Error', 'Por favor, complete la Fecha y la Hora de Inicio.');
            return;
        }

        // Si se activó la ubicación pero no se seleccionó ninguna
        if (showLocation && !meeting.location_id) {
            Alert.alert('Error', 'Por favor, seleccione una Ubicación para el Evento Especial.');
            return;
        }

        setLoading(true);

        try {
            // 1. Preparar los datos de Reunión
            const meetingData = {
                ...meeting,
                completed: true,
                // Remover location_id si no es un evento especial para evitar guardar un campo vacío
                location_id: showLocation ? meeting.location_id : null
            };

            let dataToSave: any = { meeting: meetingData };

            // 2. Añadir Detalles si están activos
            if (showDetails) {
                const numericOffering = parseFloat(details.offering.replace(',', '.')) || 0;
                dataToSave.details = {
                    ...details,
                    offering: numericOffering,
                };
            }

            console.log('Datos a enviar (Reunión):', meetingData);
            if (showDetails) {
                console.log('Datos a enviar (Detalles):', dataToSave.details);
            }

            await new Promise(resolve => setTimeout(resolve, 1500)); // Simula retraso de red

            Alert.alert('Éxito', '¡Reunión registrada exitosamente!');

            // Resetear la vista
            setMeeting(INITIAL_MEETING_STATE);
            setDetails(INITIAL_DETAILS_STATE);
            setShowDetails(false);
            setShowLocation(false);

        } catch (error) {
            console.error('Error al registrar:', error);
            Alert.alert('Error', 'Ocurrió un error al intentar guardar la reunión.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>✨ Registro de Reunión</Text>
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Información Básica de la Reunión</Text>

                {/* --- CAMPO SELECT 1: TIPO DE REUNIÓN (TITLE_ID) --- */}
                {/* <Text style={styles.label}>Tipo de Reunión (Título):</Text>
                <View style={styles.pickerContainer}>
                <Text style={styles.pickerValue}>
                {MOCK_TITLES.find(t => t.id === meeting.title_id)?.name || 'Seleccione...'}
                </Text>
                </View> */}

                {/* Cell */}
                <SelectWithLabel
                    labelText={'Célula'}
                    mandatory={true}
                    theValue={typeCellId.value}
                    setValue={changeTypeCell}
                    sample={'célula'}
                    dataOption={arrayConstructorTerritories()}
                    stylePickerContainer2={
                        {
                            borderColor: (Boolean(typeCellId.value) && !typeCellId.isValid) ? '#e74c3c' :
                                typeCellId.isValid ? '#4CAF50' : '#e0e0e0'
                        }
                    }
                />

                {/* Type of meeting */}
                <SelectWithLabel
                    labelText={'Tipo de Reunión:'}
                    mandatory={true}
                    theValue={typeCellId.value}
                    setValue={changeTypeCell}
                    sample={'Tipo'}
                    dataOption={arrayConstructorTerritories()}
                    stylePickerContainer2={
                        {
                            borderColor: (Boolean(typeCellId.value) && !typeCellId.isValid) ? '#e74c3c' :
                                typeCellId.isValid ? '#4CAF50' : '#e0e0e0'
                        }
                    }
                />

                {/*   <Text style={styles.hint}>* En la app real, esto sería un Picker o Dropdown.</Text> */}

                {/* --- FECHA Y HORA --- */}
                {/* <Text style={styles.label}>Fecha (YYYY-MM-DD):</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ej: 2025-12-31"
                    value={meeting.date}
                    onChangeText={text => handleChange('date', text)}
                    /> */}

                <InputDateWithLabel
                    numberTestID='dateOfMeeting'
                    labelText="Fecha de reunion"
                    value={date.value}
                    setValue={changeDate}
                    showDatepicker={showDatepicker01}
                    showPicker={showPicker01}
                    styleContainer={{ marginVertical: 10 }}
                    styleInput={{
                        borderWidth: date.isValid === false ? 1.5 :
                            date.isValid === true ? 1.5 : 2.5,
                        borderColor: date.isValid === false ? '#e74c3c' :
                            date.isValid === true ? '#4CAF50' : '#e0e0e0'
                    }}
                    mandatory={true}
                />

                <InputDateWithLabel
                    numberTestID='meetingStartTime'
                    labelText="Hora de inicio"
                    typeMode="time"
                    is24H={false}
                    value={startTime.value}
                    setValue={changeStartTime}
                    showDatepicker={showDatepicker02}
                    showPicker={showPicker02}
                    styleContainer={{ marginVertical: 10 }}
                    placeholder='Hora: 00:00 AM/PM'
                    styleInput={{
                        borderWidth: startTime.isValid === false ? 1.5 :
                            startTime.isValid === true ? 1.5 : 2.5,
                        borderColor: startTime.isValid === false ? '#e74c3c' :
                            startTime.isValid === true ? '#4CAF50' : '#e0e0e0'
                    }}
                    mandatory={true}
                />

                <InputDateWithLabel
                    numberTestID='meetingEndTime'
                    labelText="Hora de fin"
                    typeMode="time"
                    is24H={false}
                    value={endTime.value}
                    setValue={changeEndTime}
                    showDatepicker={showDatepicker03}
                    showPicker={showPicker03}
                    styleContainer={{ marginVertical: 10 }}
                    placeholder='Hora: 00:00 AM/PM'
                    styleInput={{
                        borderWidth: endTime.isValid === false ? 1.5 :
                            endTime.isValid === true ? 1.5 : 2.5,
                        borderColor: endTime.isValid === false ? '#e74c3c' :
                            endTime.isValid === true ? '#4CAF50' : '#e0e0e0'
                    }}
                    mandatory={true}
                />

                {/* <Text style={styles.hint}>Líder: "Luis" Integrantes: 013.</Text> */}


                {/* --- TOGGLE DE UBICACIÓN ESPECIAL --- */}
                <View style={[styles.section, styles.detailsToggle, { marginTop: 20 }]}>
                    <Text style={styles.toggleText}>📍 ¿Evento Especial?</Text>
                    <Switch
                        onValueChange={(value) => {
                            setShowLocation(value);
                            if (!value) {
                                handleChange('location_id', ''); // Limpiar si se desactiva
                            } else {
                                // Asignar una ubicación por defecto al activar, si existe
                                handleChange('location_id', MOCK_LOCATIONS[0].id);
                            }
                        }}
                        value={showLocation}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={showLocation ? '#f5dd4b' : '#f4f3f4'}
                    />
                </View>

                {/* --- CAMPO SELECT 2: UBICACIÓN (LOCATION_ID) --- */}
                {showLocation && (
                    // <View style={styles.section}>
                    <View style={{ paddingHorizontal: 5 }}>
                        <Text style={styles.sectionHeader}>Ubicación del Evento Especial</Text>
                        <View style={{ marginBottom: 20, paddingHorizontal: 15 }}>
                            {/* Evento especial */}
                            <SelectWithLabel
                                labelText={'Seleccionar Ubicación'}
                                // mandatory={true}
                                theValue={typeCellId.value}
                                setValue={changeTypeCell}
                                sample={'Ubicación'}
                                dataOption={arrayConstructorTerritories()}
                                stylePickerContainer2={
                                    {
                                        borderColor: (Boolean(typeCellId.value) && !typeCellId.isValid) ? '#e74c3c' :
                                            typeCellId.isValid ? '#4CAF50' : '#e0e0e0'
                                    }
                                }
                            />
                        </View>
                    </View>
                )}

                {/* --- TOGGLE DE DETALLES ADICIONALES --- */}
                <View style={[styles.section, styles.detailsToggle]}>
                    <Text style={styles.toggleText}>📝 ¿Registrar Detalles Adicionales?</Text>
                    <Switch
                        onValueChange={setShowDetails}
                        value={showDetails}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={showDetails ? '#f5dd4b' : '#f4f3f4'}
                    />
                </View>

                {/* --- CAMPOS DE DETALLES --- */}
                {showDetails && (
                    // <View style={styles.section}>
                    <View>
                        <Text style={styles.sectionHeader}>Detalles Adicionales (meeting_details)</Text>


                        {/* Numero de invitados */}
                        <InputWithLabel
                            labelText="Número de Invitados"
                            keyboardType="numeric"
                            placeholder='Ej: 3'
                            maxLength={3}
                            value={guest.value}
                            setValue={changeGuest}
                            styleContainer={{ marginVertical: 10 }}
                            // styleLabel={styles.label}
                            styleInput={getInputStyle(guest)}
                        // mandatory={true}
                        />


                        {/* Ofrenda */}
                        <InputWithLabel
                            labelText="Monto de la Ofrend"
                            keyboardType="numeric"
                            placeholder='Ej: 50.50'
                            maxLength={5}
                            value={offering.value}
                            setValue={changeOffering}
                            styleContainer={{ marginVertical: 10 }}
                            // styleLabel={styles.label}
                            styleInput={getInputStyle(offering)}
                        // mandatory={true}
                        />





                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>¿Hubo Dinámica?</Text>
                            <Switch
                                onValueChange={val => handleDetailsChange('dynamic', val)}
                                value={details.dynamic}
                            />
                        </View>
                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>¿Hubo Alabanza/Adoración?</Text>
                            <Switch
                                onValueChange={val => handleDetailsChange('praise', val)}
                                value={details.praise}
                            />
                        </View>
                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>¿Se hizo Consolidación?</Text>
                            <Switch
                                onValueChange={val => handleDetailsChange('consolidation', val)}
                                value={details.consolidation}
                            />
                        </View>
                    </View>
                )}

            </View>

            <View style={styles.buttonContainer}>
                <Button
                    title={loading ? 'Guardando...' : 'Guardar Reunión'}
                    onPress={handleSubmit}
                    disabled={loading}
                    color="#007bff"
                />
            </View>

            <View style={{ height: 50 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f8f8f8',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    section: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#007bff',
    },
    label: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 10,
    },
    hint: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
        marginTop: 5,
    },
    detailsToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#e6f0ff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        borderColor: '#b3d9ff',
        borderWidth: 1,
    },
    toggleText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    switchLabel: {
        fontSize: 14,
        color: '#333',
    },
    buttonContainer: {
        marginTop: 20,
        paddingHorizontal: 15,
    },
    // Estilos para simular el Picker/Select
    pickerContainer: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        justifyContent: 'center',
        height: 40,
        backgroundColor: '#fff',
    },
    pickerValue: {
        paddingHorizontal: 10,
        fontSize: 14,
        color: '#333',
    }
});

export default MeetingRegistrationScreen;