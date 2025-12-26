import InputWithLabel from '@/components/molecules/inputWithLabel';
import InputDateWithLabel from '@/components/molecules/inputDateWithLabel ';
import SelectWithLabel from '@/components/molecules/selectWithLabel';
import React, { useState, useContext, useEffect } from 'react';
import { Button, StyleSheet, Text, TextInput, View, Platform, ScrollView } from 'react-native';
import { FieldState, DateFieldState } from '@/interface/default';
import userContext from '@/contexts/user/userContext';
import optionsContext from '@/contexts/options/optionsContext';

// import DateTimePicker from '@react-native-community/datetimepicker';


// Asumiendo que tienes listas de datos foráneos (puedes obtenerlas de tu API o estado)
const cellTypes = [
    { id: '01', title: 'Tipo 1 celula' },
    { id: '02', title: 'Tipo 2 celula' },
    // Agrega más según tus datos
];

const validateTitle = (value: string): boolean => Boolean(value.trim() && /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9 ]{5,50}$/.test(value.trim())); // Solo letras, números y espacios
// No vacío
const validateBoolean = (value: string): boolean => !!value;

const RegisterCellScreen = () => {
    const { territories, optionsTerritories } = useContext(optionsContext);
    const { getListOfUser, dataListUser } = useContext(userContext);

    const [title, setTitle] = useState<FieldState>({ value: "", isValid: null });
    const [cellTypeId, setCellTypeId] = useState<FieldState>({ value: "", isValid: null });
    const [territoryId, setTerritoryId] = useState<FieldState>({ value: "", isValid: null });
    const [leaderId, setLeaderId] = useState<FieldState>({ value: "", isValid: null });
    const [date, setDate] = useState<DateFieldState>({ value: null, isValid: null }); // Estado para la fecha
    const [showPicker, setShowPicker] = useState<boolean>(false); // Controla la visibilidad del picker

    useEffect(() => {
        optionsTerritories();
        getListOfUser();
    }, []);


    const changeDate = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date.value;
        setShowPicker(Platform.OS === 'ios'); // En iOS, el picker se queda abierto; en Android, se cierra
        setDate({ value: currentDate, isValid: validateBoolean(String(currentDate)) });
    };

    const showDatepicker = () => {
        setShowPicker(true);
    };

    const changeTitle = (value: string) => {
        const newValue = value;
        setTitle({ value: newValue, isValid: validateTitle(newValue) });
        return;
    };

    const changeType = (value: string) => {
        setCellTypeId({ value, isValid: validateBoolean(value) });
        return;
    };

    const changeTerritorie = (value: string) => {
        setTerritoryId({ value, isValid: validateBoolean(value) });
        return;
    };

    const changeLeaderId = (value: string) => {
        setLeaderId({ value, isValid: validateBoolean(value) });
        return;
    };

    const getInputStyle = (field: FieldState) => [
        styles.input,
        {
            borderColor: Boolean(field.value) && !field.isValid ? '#e74c3c' : // ← FIJO: Boolean() coerce a boolean
                field.isValid ? '#4CAF50' : '#ccc', // Verde si válido, gris default
        },
    ];

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


    const arrayConstructorUser = () => {

        let dataArray: { title: string; id: string }[] = [];

        for (const element of dataListUser) {
            const value1 = `${element.username} - ${element.person.firstName} - ${element.person.lastName}`;
            const value2 = element.id;

            dataArray.push({
                "title": value1,
                "id": String(value2),
            })
        }

        return dataArray;
    }


    const handleSubmit = () => {
        // Validación básica
        // if (!title.trim() || !cellTypeId || !territoryId || !userId) {
        //     Alert.alert('Error', 'Todos los campos son obligatorios.');
        //     return;
        // }

        // // Aquí puedes enviar los datos a tu API (Nest JS)
        // const cellData = {
        //     title,
        //     cell_type_id: cellTypeId,
        //     territory_id: territoryId,
        //     user_id: parseInt(userId),
        //     created_at: createdAt, // Solo si tu API permite setearlo manualmente
        // };

        // console.log('Datos a enviar:', cellData);
        // // Ejemplo: fetch('http://tu-servidor/api/cells', { method: 'POST', body: JSON.stringify(cellData), headers: { 'Content-Type': 'application/json' } });
        // Alert.alert('Éxito', 'Celda creada exitosamente.');
    };

    return (
        <ScrollView style={styles.container}>

            <View>
                <Text style={styles.title}>Registro de célula</Text>
            </View>

            <InputWithLabel
                labelText="Título de la célula"
                value={title.value}
                setValue={changeTitle}
                styleContainer={{ marginVertical: 10 }}
                styleLabel={styles.label}
                styleInput={getInputStyle(title)}
                mandatory={true}
            />

            {/* Tipo de célula */}
            <SelectWithLabel
                labelText={'Tipo de célula'}
                mandatory={true}
                theValue={cellTypeId.value}
                setValue={changeType}
                sample={'Selecciona un tipo'}
                dataOption={cellTypes}
                stylePickerContainer2={
                    {
                        borderColor: (Boolean(cellTypeId.value) && !cellTypeId.isValid) ? '#e74c3c' :
                            cellTypeId.isValid ? '#4CAF50' : '#e0e0e0'
                    }
                }
            />

            {/* Ubicacion */}
            <SelectWithLabel
                labelText={'Ubicación de la célula'}
                mandatory={true}
                theValue={territoryId.value}
                setValue={changeTerritorie}
                sample={'Ubicación'}
                dataOption={arrayConstructorTerritories()}
                stylePickerContainer2={
                    {
                        borderColor: (Boolean(territoryId.value) && !territoryId.isValid) ? '#e74c3c' :
                            territoryId.isValid ? '#4CAF50' : '#e0e0e0'
                    }
                }
            />

            {/* territories */}
            <SelectWithLabel
                labelText={'Territorio'}
                mandatory={true}
                theValue={territoryId.value}
                setValue={changeTerritorie}
                sample={'Territorio'}
                dataOption={arrayConstructorTerritories()}
                stylePickerContainer2={
                    {
                        borderColor: (Boolean(territoryId.value) && !territoryId.isValid) ? '#e74c3c' :
                            territoryId.isValid ? '#4CAF50' : '#e0e0e0'
                    }
                }
            />

            {/* Usuario */}
            <SelectWithLabel
                labelText={'Líder de la célula'}
                mandatory={true}
                theValue={leaderId.value}
                setValue={changeLeaderId}
                sample={'Selecciona un usuario'}
                dataOption={arrayConstructorUser()}
                stylePickerContainer2={
                    {
                        borderColor: (Boolean(territoryId.value) && !territoryId.isValid) ? '#e74c3c' :
                            territoryId.isValid ? '#4CAF50' : '#e0e0e0'
                    }
                }
            />

            <InputDateWithLabel
                labelText="Fecha de inicio"
                value={date.value}
                setValue={changeDate}
                showDatepicker={showDatepicker}
                showPicker={showPicker}
                styleContainer={{ marginVertical: 10 }}
                styleInput={{
                    borderWidth: date.isValid === false ? 1.5 :
                        date.isValid === true ? 1.5 : 2.5,
                    borderColor: date.isValid === false ? '#e74c3c' :
                        date.isValid === true ? '#4CAF50' : '#e0e0e0'
                }}
                mandatory={true}
            />

            <View style={{ marginTop: 40, marginBottom: 70 }}>
                <Button title="Registrar célula" onPress={handleSubmit} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 15,
    },
});

export default RegisterCellScreen;
