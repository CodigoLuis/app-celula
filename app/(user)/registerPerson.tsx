import InputWithLabel from '@/components/molecules/inputWithLabel';
import SelectWithLabel from '@/components/molecules/selectWithLabel';
import TextAreaWithLabel from '@/components/molecules/textAreaWithLabel';
import personContext from '@/contexts/person/personContext';
import React, { useContext, useState } from 'react';
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

// Interfaces para estados 
interface FieldState {
  value: string;
  isValid: boolean;
}

const showToast = (message: string) => {
  Toast.show({
    type: 'info',
    text1: message,
    position: 'bottom',
    visibilityTime: 3000,
  });
};

// Helpers para validaciones (llamados en setters)
const validateName = (value: string): boolean => Boolean(value.trim() && /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ ]{2,50}$/.test(value.trim())); // Solo letras/espacios
// No vacío
const validateBoolean = (value: string): boolean => !!value;

const validateIdNumber = (value: string): boolean => {
  // Formato básico Cédula VE: V/E- XX.XXX.XXX (10-11 chars)
  return Boolean(value.trim() && /^(V|E)-\d{1,2}\.\d{3}\.\d{3}$/.test(value.trim().replace(/\s/g, '')) && value.length >= 10);
};
const validatePhone = (value: string): boolean => !value || /^\d+$/.test(value); // Opcional, solo dígitos si tiene
const validateLocation = (value: string): boolean => true; // Opcional, siempre válido (o agrega regex si necesitas)

export default function RegisterPersonScreen() {
  // Estados como objetos { value, isValid }
  const [firstName, setFirstNameState] = useState<FieldState>({ value: '', isValid: false });
  const [lastName, setLastNameState] = useState<FieldState>({ value: '', isValid: false });
  const [sex, setSexState] = useState<FieldState>({ value: '', isValid: false });
  const [maritalStatus, setMaritalStatus] = useState<FieldState>({ value: '', isValid: false });
  const [idNumber, setIdNumberState] = useState<FieldState>({ value: '', isValid: false });
  const [phone, setPhoneState] = useState<FieldState>({ value: '', isValid: true }); // Opcional
  const [location, setLocationState] = useState<FieldState>({ value: '', isValid: true }); // Opcional

  const [existingID, setExistingID] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { registerPerson, existingPerson } = useContext(personContext);

  // ---- Inicio ------ Wrappers para setters (actualizan value y calculan isValid en tiempo real)
  // ---------------------------------------------------------------------------------------------------
  const setFirstName = (value: string) => {
    const newValue = value;
    setFirstNameState({ value: newValue, isValid: validateName(newValue) });
    return;
  };

  const setLastName = (value: string) => {
    const newValue = value;
    setLastNameState({ value: newValue, isValid: validateName(newValue) });
    return;
  };

  const setSex = (value: string) => {
    setSexState({ value, isValid: validateBoolean(value) });
    return;
  };

  const setMarital = (value: string) => {
    setMaritalStatus({ value, isValid: validateBoolean(value) });
    return;
  };

  const setIdNumber = (value: string) => {
    let newValue = value;
    const primerChar = newValue.charAt(0); // Primer carácter

    if (!(/[a-zA-Z]/.test(primerChar)) && newValue !== "") {
      newValue = "V-" + newValue;
    }

    setIdNumberState({ value: newValue, isValid: validateIdNumber(newValue) });
    validatorIdNumber(newValue, validateIdNumber(newValue));
    return;
  };

  const setLocation = (value: string) => {
    const newValue = value;
    setLocationState({ value: newValue, isValid: validateLocation(newValue) });
    return;
  };

  const setPhone = (value: string) => {
    const newValue = value;
    setPhoneState({ value: newValue, isValid: validatePhone(newValue) });
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

    if (!firstName.isValid) {
      showToast('Error, El nombre es inválido (solo letras)');
      return;
    }
    if (!lastName.isValid) {
      showToast('Error, El apellido es inválido (solo letras)');
      return;
    }
    if (!sex.isValid) {
      showToast('Error, Selecciona el sexo');
      return;
    }

    if (!maritalStatus.isValid) {
      showToast('Error, Selecciona el estado civil');
      return;
    }
    if (!idNumber.isValid) {
      showToast('Error, La cédula debe tener formato válido (ej. V-10.204.305)');
      return;
    }
    if (existingID === true) {
      showToast(`Error, El titular de esta cédula " ${idNumber.value} " ya esta registrado`);
      return;
    }
    if (!phone.isValid) {
      showToast('Error, El teléfono solo debe contener dígitos');
      return;
    }

    await setIsLoading(true);

    const result = await registerPerson({
      "firstName": firstName.value,
      "lastName": lastName.value,
      "gender": sex.value,
      "idNumber": idNumber.value,
      "maritalStatus": maritalStatus.value,
      "phone": phone.value,
      "address": location.value
    });

    if (result === true) {
      setFirstNameState({ value: '', isValid: false });
      setLastNameState({ value: '', isValid: false });
      setSexState({ value: '', isValid: false });
      setMaritalStatus({ value: '', isValid: false });
      setIdNumberState({ value: '', isValid: false });
      setPhoneState({ value: '', isValid: false });
      setLocationState({ value: '', isValid: false });
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return;
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View>
        <Text style={styles.title}>Registra una persona</Text>
      </View>

      {/* Nombre */}
      <InputWithLabel
        labelText="Nombre"
        value={firstName.value}
        setValue={setFirstName}
        styleContainer={{ marginVertical: 10 }}
        styleLabel={styles.label}
        styleInput={getInputStyle(firstName)}
        mandatory={true}
      />
      {getErrorMessage(firstName, 'Solo letras')}

      {/* Apellido */}
      <InputWithLabel
        labelText="Apellido"
        value={lastName.value}
        setValue={setLastName}
        styleContainer={{ marginVertical: 10 }}
        styleLabel={styles.label}
        styleInput={getInputStyle(lastName)}
        mandatory={true}
      />
      {getErrorMessage(lastName, 'Solo letras')}

      {/* Sexo */}
      <SelectWithLabel
        labelText={'Sexo'}
        mandatory={true}
        theValue={sex.value}
        setValue={setSex}
        sample={'Seleccione sexo'}
        dataOption={[{ title: "Masculino", id: "Masculino" }, { title: "Femenino", id: "Femenino" }]}
        stylePickerContainer2={
          {
            borderColor: (Boolean(sex.value) && !sex.isValid) ? '#e74c3c' :
              sex.isValid ? '#4CAF50' : '#e0e0e0'
          }
        }
      />
      {getErrorMessage(sex, 'Selecciona una opción')}

      {/* MaritalStatus */}
      <SelectWithLabel
        labelText={'Estado civil'}
        mandatory={true}
        theValue={maritalStatus.value}
        setValue={setMarital}
        sample={'Seleccione estado civil'}
        dataOption={[{ title: "Soltero/a", id: "Soltero/a" }, { title: "Casado/a", id: "Casado/a" },
        { title: "Divorciado/a", id: "Divorciado/a" }, { title: "Viudo/a", id: "Viudo/a" }]}
        stylePickerContainer2={
          {
            borderColor: (Boolean(maritalStatus.value) && !maritalStatus.isValid) ? '#e74c3c' :
              maritalStatus.isValid ? '#4CAF50' : '#e0e0e0'
          }
        }
      />
      {getErrorMessage(maritalStatus, 'Selecciona una opción')}

      {/* Cédula */}
      <InputWithLabel
        labelText="Cédula"
        value={idNumber.value}
        setValue={setIdNumber}
        placeholder="Ej. V-00.000.000 o E-0.000.000"
        styleContainer={{ marginVertical: 10 }}
        styleLabel={styles.label}
        styleInput={getInputStyle(idNumber)}
        mandatory={true}
      />
      {getErrorMessage(idNumber, 'Formato: V-1.123.123 o E-12.123.123')}
      {existingID === true && idNumber.isValid ? <Text style={styles.errorText}>{`Error, El titular de esta cédula " ${idNumber.value} " ya esta registrado`}</Text> : null}

      {/* Teléfono */}
      <InputWithLabel
        labelText="Número de teléfono"
        value={phone.value}
        setValue={setPhone}
        styleContainer={{ marginVertical: 10 }}
        styleLabel={styles.label}
        styleInput={getInputStyle(phone)}
        keyboardType="phone-pad"
      />
      {getErrorMessage(phone, 'Solo dígitos numéricos')}

      {/* Ubicación */}
      <TextAreaWithLabel
        labelText="Ubicación"
        value={location.value}
        setValue={setLocation}
        styleContainer={{ marginVertical: 10 }}
        styleLabel={styles.label}
        styleInput={getInputStyle(location)}
      />
      {getErrorMessage(location, 'Ingresa una ubicación válida')}  {/* Por si lo pongo obligatorio */}

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
});
