import InputWithLabel from '@/components/molecules/inputWithLabel';
import SelectWithLabel from '@/components/molecules/selectWithLabel';
import optionsContext from '@/contexts/options/optionsContext';
import personContext from '@/contexts/person/personContext';
import userContext from '@/contexts/user/userContext';
import React, { useContext, useEffect, useState } from 'react';
import { FieldState } from '@/interface/default';
import {
    ActivityIndicator,
    Button,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';

const showToast = (message: string) => {
    Toast.show({
        type: 'info',
        text1: message,
        position: 'bottom',
        visibilityTime: 3000,
    });
};

// Helpers para validaciones (llamados en setters)
const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_.-]{2,19}$/;
const validateUserName = (value: string): boolean => Boolean(value.trim() && USERNAME_REGEX.test(value.trim()));
const validateUsernameDetailed = (username: string): string => {
    if (!username) return 'El nombre de usuario es requerido.';
    if (username.length < 3) return 'El nombre de usuario debe tener al menos 3 caracteres.';
    if (username.length > 20) return 'El nombre de usuario no puede exceder 20 caracteres.';
    if (!/^[a-zA-Z]/.test(username)) return 'El nombre de usuario debe comenzar con una letra (no con número o símbolo).';
    if (!USERNAME_REGEX.test(username)) return 'El nombre de usuario solo puede contener letras, números, guiones bajos (_), guiones (-) y puntos (.). No se permiten espacios ni caracteres especiales.';
    return ''; // Válido
};

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const validatePassword = (value: string): boolean => Boolean(value.trim() && PASSWORD_REGEX.test(value.trim()));
const validatePasswordDetailed = (password: string): string => {
    if (!password) return 'La contraseña es requerida.';
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (/\s/.test(password)) return 'La contraseña no puede contener espacios.';
    if (!/(?=.*[a-z])/.test(password)) return 'La contraseña debe incluir al menos una letra minúscula (a-z).';
    if (!/(?=.*[A-Z])/.test(password)) return 'La contraseña debe incluir al menos una letra mayúscula (A-Z).';
    if (!/(?=.*\d)/.test(password)) return 'La contraseña debe incluir al menos un número (0-9).';
    if (!/(?=.*[@$!%*?&])/.test(password)) return 'La contraseña debe incluir al menos un símbolo especial (por ejemplo: @, $, !, %, *, ?, &).';
    if (!PASSWORD_REGEX.test(password)) return 'La contraseña no cumple con los requisitos de seguridad.';
    return ''; // Válido
};

// No vacío
const validateBoolean = (value: string): boolean => !!value;

const validateIdNumber = (value: string): boolean => {
    // Formato básico Cédula VE: V/E- XX.XXX.XXX (10-11 chars)
    return Boolean(value.trim() && /^(V|E)-\d{1,2}\.\d{3}\.\d{3}$/.test(value.trim().replace(/\s/g, '')) && value.length >= 10);
};


export default function RegisterUserScreen() {
    const [idNumber, setIdNumberState] = useState<FieldState>({ value: '', isValid: false });
    const [userName, setUserName] = useState<FieldState>({ value: '', isValid: false });
    const [Password, setPassword] = useState<FieldState>({ value: '', isValid: false });
    const [repeatPassword, setRepeatPassword] = useState<FieldState>({ value: '', isValid: false });
    const [territorie, setTerritorie] = useState<FieldState>({ value: '', isValid: false });
    const [userType, setUserType] = useState<FieldState>({ value: '', isValid: false });

    const [existingID, setExistingID] = useState<boolean>(false);
    const [existingName, setExistingName] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { person, existingPerson, userDataCleansing } = useContext(personContext);
    const { existingNameUser, registerUser } = useContext(userContext);
    const { typesUsers, territories, optionsUserType, optionsTerritories } = useContext(optionsContext);

    useEffect(() => {
        optionsUserType();
        optionsTerritories();
    }, [])

    // ---- Inicio ------ Wrappers para setters (actualizan value y calculan isValid en tiempo real)
    // ---------------------------------------------------------------------------------------------------
    const setNameUser = async (value: string) => {
        const newValue = value;
        setUserName({ value: newValue, isValid: validateUserName(newValue) });
        if (validateUserName(newValue) === true) {
            const isValid = await existingNameUser(newValue)
            if (isValid === false) setExistingName(false);
            else setExistingName(true);
        }
        return;
    };

    const changePassword = (value: string) => {
        const newValue = value;
        setPassword({ value: newValue, isValid: validatePassword(newValue) });
        return;
    };

    const changeRepeatPassword = (value: string) => {
        const newValue = value;
        setRepeatPassword({ value: newValue, isValid: Boolean((newValue === Password.value) && newValue.trim()) });
        return;
    };

    const changeTerritorie = (value: string) => {
        setTerritorie({ value, isValid: validateBoolean(value) });
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

    const changeTypeUser = (value: string) => {
        setUserType({ value, isValid: validateBoolean(value) });
        return;
    };

    const arrayConstructorTypeUser = () => {

        let dataArray: { title: string; id: string }[] = [];

        for (const element of typesUsers.data) {
            dataArray.push({
                "title": element.title,
                "id": element.id
            })
        }

        return dataArray;
    }

    const setIdNumber = (value: string) => {

        let newValue = value;
        const primerChar = newValue.charAt(0); // Primer carácter

        if (!(/[a-zA-Z]/.test(primerChar)) && newValue !== "") {
            newValue = "V-" + newValue;
        }

        setIdNumberState({ value: newValue, isValid: validateIdNumber(newValue) });
        validatorIdNumber(newValue, validateIdNumber(newValue));
        if (validateIdNumber(newValue) && person?.data) {
            setExistingID(false); // ******* revisar********************************************************************************
            userDataCleansing();
        }
        return;
    };

    // ---- Fin ------ Wrappers para setters
    // ------------------------------------------------------------------------------------------------------

    // Función para obtener estilo dinámico del input (borde verde/rojo)
    // ------------------------------------------------------------------------------------------------------
    const getInputStyle = (field: FieldState) => [
        styles.input,
        {
            borderColor: Boolean(field.value) && !field.isValid ? '#e74c3c' : // ← FIJO: Boolean() coerce a boolean
                field.isValid ? '#4CAF50' : '#ccc', // Verde si válido, gris default
        },
    ];
    // ------------------------------------------------------------------------------------------------------

    const validatorIdNumber = async (dataIdNumber: string, isValid: boolean) => {
        if (isValid) {
            const existing = await existingPerson(dataIdNumber);
            if (existing === true) {
                setExistingID(true);
            } else {
                setExistingID(false);
            }
        }
        return;
    }

    // Función para mostrar error (solo si tocado e inválido)
    const getErrorMessage = (field: FieldState, errorMsg: string) =>
        Boolean(field.value) && !field.isValid ? <Text style={styles.errorText}>{errorMsg}</Text> : null;

    const validateAndSubmit = async () => {

        if (!idNumber.isValid) {
            showToast('Error, la cédula debe tener formato válido (ej. V-10.204.305)');
            return;
        }
        if (existingID === false) {
            showToast(`Error, es necesario que la cédula " ${idNumber.value} " esté registrada`);
            return;
        }
        if (person && person.data.isUser === true) {
            showToast(`Error, la persona ya tiene un usuario`);
            return;
        }
        if (!userName.isValid) {
            showToast('Error, introduzca un nombre de usuario valido');
            return;
        }
        if (!Password.isValid) {
            showToast('Error, introduzca una contraseña valida');
            return;
        }
        if (!repeatPassword.isValid) {
            showToast('Error, confirme la contraseña');
            return;
        }
        if (!territorie.isValid) {
            showToast('Error, es necesario que seleccione el territorio');
            return;
        }
        if (!userType.isValid) {
            showToast('Error, es necesario que seleccione el tipo de usuario');
            return;
        }

        const idPerson = person && person.data.id ? Number(person.data.id) : null;

        await setIsLoading(true);

        const result = await registerUser({
            username: userName.value,
            password: Password.value,
            person: idPerson,
            userType: userType.value,
            territory: territorie.value,
        })

        if (result === true) {
            userDataCleansing();
            setIdNumberState({ value: '', isValid: false });
            setUserName({ value: '', isValid: false });
            setPassword({ value: '', isValid: false });
            setRepeatPassword({ value: '', isValid: false });
            setTerritorie({ value: '', isValid: false });
            setUserType({ value: '', isValid: false });
            setExistingID(false);
        }

        setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return;
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View>
                <Text style={styles.title}>Usuario</Text>
            </View>

            {/* Cédula */}
            <InputWithLabel
                labelText="Cédula de la persona"
                value={idNumber.value}
                setValue={setIdNumber}
                placeholder="Ej. V-00.000.000 o E-0.000.000"
                styleContainer={{ marginVertical: 10 }}
                styleLabel={styles.label}
                styleInput={getInputStyle(idNumber)}
                mandatory={true}
            />
            {getErrorMessage(idNumber, 'Formato: V-1.123.123 o E-12.123.123')}
            {existingID === false && idNumber.isValid ? <Text style={styles.errorText}>{`Error, esta cédula " ${idNumber.value} " no esta registrada`}</Text> : null}

            {/* Card de resultados */}
            {existingID ? (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Datos de la persona</Text>
                    {person && person.data.isUser === true ? <Text style={styles.cardTitle2}>La persona ya tiene un usuario</Text> : null}

                    <View style={styles.infoRow}>
                        <Text style={styles.labelCard}>Nombre:</Text>
                        <Text style={styles.valueCard}>{person && person.data.firstName?.length !== 0 ? person.data.firstName : null}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.labelCard}>Apellido:</Text>
                        <Text style={styles.valueCard}>{person && person.data.lastName?.length !== 0 ? person.data.lastName : null}</Text>
                    </View>

                </View>
            ) : null}

            {/* Nombre del usuario */}
            <InputWithLabel
                labelText="Usuario"
                value={userName.value}
                setValue={setNameUser}
                styleContainer={{ marginVertical: 10 }}
                styleLabel={styles.label}
                styleInput={getInputStyle(userName)}
                mandatory={true}
            />
            {getErrorMessage(userName, validateUsernameDetailed(userName.value))}
            {existingName ? <Text style={styles.errorText}>{'Error, el nombre de usuario ya está en uso'}</Text> : null}

            {/* contraseña */}
            <InputWithLabel
                labelText="Contraseña"
                value={Password.value}
                setValue={changePassword}
                styleContainer={{ marginVertical: 10 }}
                styleLabel={styles.label}
                styleInput={getInputStyle(Password)}
                mandatory={true}
                password={true}
            />
            {getErrorMessage(Password, validatePasswordDetailed(Password.value))}

            {/* contraseña R*/}
            <InputWithLabel
                labelText="Repetir contraseña"
                value={repeatPassword.value}
                setValue={changeRepeatPassword}
                styleContainer={{ marginVertical: 10 }}
                styleLabel={styles.label}
                styleInput={getInputStyle(repeatPassword)}
                mandatory={true}
                password={true}
            />
            {getErrorMessage(repeatPassword, 'La contraseña no coincide')}

            {/* territories */}
            <SelectWithLabel
                labelText={'Territorio'}
                mandatory={true}
                theValue={territorie.value}
                setValue={changeTerritorie}
                sample={'Territorio'}
                dataOption={arrayConstructorTerritories()}
                stylePickerContainer2={
                    {
                        borderColor: (Boolean(territorie.value) && !territorie.isValid) ? '#e74c3c' :
                            territorie.isValid ? '#4CAF50' : '#e0e0e0'
                    }
                }
            />
            {getErrorMessage(territorie, 'Selecciona una opción')}

            {/* Tipo de usuario */}
            <SelectWithLabel
                labelText={'Tipo de usuario'}
                mandatory={true}
                theValue={userType.value}
                setValue={changeTypeUser}
                sample={'Tipo de usuario'}
                dataOption={arrayConstructorTypeUser()}
                stylePickerContainer2={
                    {
                        borderColor: (Boolean(userType.value) && !userType.isValid) ? '#e74c3c' :
                            userType.isValid ? '#4CAF50' : '#e0e0e0'
                    }
                }
            />
            {getErrorMessage(userType, 'Selecciona una opción')}


            <View style={styles.buttonContainer}>
                <Button title="Registrar" onPress={validateAndSubmit} />
            </View>

            {
                //--------------------------------------------------------------------------------------------
                //--------------------------MODAL------------------------------------------------------------------
                //--------------------------------------------------------------------------------------------
            }

            <Modal visible={isLoading} transparent animationType="fade">
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.mensajeCarga}>Guardando datos...</Text>
                </View>
            </Modal>


        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,  // flexGrow para ScrollView
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    buttonContainer: {
        marginTop: 34,
        marginBottom: 20,
    },


    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        letterSpacing: 0.2,
    },

    //---------------------------------------------------------------
    //---------------------------------------------------------------
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
    },
    mensajeCarga: {
        marginTop: 10,
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },

    //----------------------------------------------------------------------

    card: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        elevation: 4,  // Sombra en Android
        shadowColor: '#000',  // Sombra en iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        color: '#007AFF',
    },
    cardTitle2: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#d43108ad',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingVertical: 5,
    },
    labelCard: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
        flex: 1,
    },
    valueCard: {
        fontSize: 16,
        color: '#333',
        flex: 2,
        textAlign: 'right',
    },

});












