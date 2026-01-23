import InputWithLabel from '@/components/molecules/inputWithLabel';
import SelectWithLabel from '@/components/molecules/selectWithLabel';
import TextAreaWithLabel from '@/components/molecules/textAreaWithLabel';
import LoadingModal from '@/components/molecules/loadingModal';
import personContext from '@/contexts/person/personContext';
import React, { useContext, useState } from 'react';
import { FieldState } from '@/interface/default';
import { validateFirstName, validateLastName, validateBoolean, validateIdNumber, validatePhone, validateAddress, getInputStyle } from '@/utils/helpers'
import { showNotification } from '@/utils/showNotification'
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

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
    setFirstNameState({ value: newValue, isValid: validateFirstName(newValue) });
    return;
  };

  const setLastName = (value: string) => {
    const newValue = value;
    setLastNameState({ value: newValue, isValid: validateLastName(newValue) });
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
    setLocationState({ value: newValue, isValid: validateAddress(newValue) });
    return;
  };

  const setPhone = (value: string) => {
    const newValue = value;
    setPhoneState({ value: newValue, isValid: validatePhone(newValue) });
    return;
  };

  // ---- Fin ------ Wrappers para setters
  // ------------------------------------------------------------------------------------------------------


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

  // Función para mostrar error 
  const getErrorMessage = (field: FieldState, errorMsg: string) =>
    Boolean(field.value) && !field.isValid ? <Text style={styles.errorText}>{errorMsg}</Text> : null;

  const validateAndSubmit = async () => {

    if (!firstName.isValid) {
      showNotification({
        messageT: 'Error, El nombre es inválido (solo letras)',
        positionOfNotification: 'bottom',
        typeOfNotification: 'info',
      });
      return;
    }
    if (!lastName.isValid) {
      showNotification({
        messageT: 'Error, El apellido es inválido (solo letras)',
        positionOfNotification: 'bottom',
        typeOfNotification: 'info',
      });
      return;
    }
    if (!sex.isValid) {
      showNotification({
        messageT: 'Error, Selecciona el sexo',
        positionOfNotification: 'bottom',
        typeOfNotification: 'info',
      });
      return;
    }

    if (!maritalStatus.isValid) {
      showNotification({
        messageT: 'Error, Selecciona el estado civil',
        positionOfNotification: 'bottom',
        typeOfNotification: 'info',
      });
      return;
    }
    if (!idNumber.isValid) {
      showNotification({
        messageT: 'Error, La cédula debe tener formato válido (ej. V-10.204.305)',
        positionOfNotification: 'bottom',
        typeOfNotification: 'info',
      });
      return;
    }
    if (existingID === true) {
      showNotification({
        messageT: `Error, El titular de esta cédula " ${idNumber.value} " ya esta registrado`,
        positionOfNotification: 'bottom',
        typeOfNotification: 'info',
      });
      return;
    }
    if (!phone.isValid) {
      showNotification({
        messageT: 'Error, El teléfono solo debe contener dígitos',
        positionOfNotification: 'bottom',
        typeOfNotification: 'info',
      });
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
        styleInput={getInputStyle(styles.input, firstName)}
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
        styleInput={getInputStyle(styles.input, lastName)}
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
        stylePickerContainer2={getInputStyle({}, sex)}
      />
      {getErrorMessage(sex, 'Selecciona una opción')}

      {/* MaritalStatus */}
      <SelectWithLabel
        labelText={'Estado civil'}
        mandatory={true}
        theValue={maritalStatus.value}
        setValue={setMarital}
        sample={'Seleccione estado civil'}
        dataOption={[{ title: "Soltero/a", id: "Soltero/a" }, { title: "Concubinato", id: "Concubinato" }, { title: "Casado/a", id: "Casado/a" },
        { title: "Divorciado/a", id: "Divorciado/a" }, { title: "Viudo/a", id: "Viudo/a" }]}
        stylePickerContainer2={getInputStyle({}, maritalStatus)}
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
        styleInput={getInputStyle(styles.input, idNumber)}
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
        styleInput={getInputStyle(styles.input, phone)}
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
        styleInput={getInputStyle(styles.input, location)}
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

      <LoadingModal isLoading={isLoading} />

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

});
