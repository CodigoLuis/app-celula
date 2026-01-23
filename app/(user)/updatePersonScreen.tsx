import React, { useState, useEffect, useContext } from 'react';
import InputWithLabel from '@/components/molecules/inputWithLabel';
import SelectWithLabel from '@/components/molecules/selectWithLabel';
import TextAreaWithLabel from '@/components/molecules/textAreaWithLabel';
import InputDateWithLabel from '@/components/molecules/inputDateWithLabel ';
import LoadingModal from '@/components/molecules/loadingModal';
import personContext from '@/contexts/person/personContext';
import {
  validateFirstName, validateLastName, validateBoolean, validateIdNumber, validatePhone, validateAddress, validateEducationLevel,
  validationResponseFirstName, validationResponseLastName, validationResponseIdNumber, validationResponsePhone, validationResponseAddress, validationResponseEducationLevel,
  getInputStyle
} from '@/utils/helpers'
import { showNotification } from '@/utils/showNotification'
import { FieldState } from '@/interface/default'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface PersonFormState {
  idNumber?: { value: string, isValid: boolean | null };
  firstName?: { value: string, isValid: boolean | null };
  lastName?: { value: string, isValid: boolean | null };
  educationLevel?: { value: string, isValid: boolean | null };
  birthDate?: { value: Date | null, isValid: boolean | null };
  gender?: { value: string, isValid: boolean | null };
  maritalStatus?: { value: string, isValid: boolean | null };
  phone?: { value: string, isValid: boolean | null };
  address?: { value: string, isValid: boolean | null };
}

export default function UpdatePersonScreen() {
  const { updatePersonData } = useContext(personContext);

  const params = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPicker, setShowPicker] = useState<boolean>(false); // Controla la visibilidad del picker

  const [idPerson, setIdPerson] = useState<number>(Number(params.id))
  const [formData, setFormData] = useState<PersonFormState>({
    idNumber: { value: params.idNumber as string || '', isValid: null },
    firstName: { value: params.firstName as string || '', isValid: null },
    lastName: { value: params.lastName as string || '', isValid: null },
    educationLevel: { value: params.educationLevel as string || '', isValid: null },
    birthDate: { value: new Date(params.birthDate as string) ?? null, isValid: null },
    gender: { value: params.gender as string || '', isValid: null },
    maritalStatus: { value: params.maritalStatus as string || '', isValid: null },
    phone: { value: params.phone as string || '', isValid: null },
    address: { value: params.address as string || '', isValid: null },
  });

  // Función para cargar o resetear los datos del estado inicial (params)
  const loadInitialData = () => {
    setIdPerson(Number(params.id))
    setFormData({
      idNumber: { value: params.idNumber as string, isValid: validateIdNumber(params.idNumber as string || "") },
      firstName: { value: params.firstName as string, isValid: validateFirstName(params.firstName as string || "") },
      lastName: { value: params.lastName as string, isValid: validateLastName(params.lastName as string || "") },
      educationLevel: { value: params.educationLevel as string, isValid: validateEducationLevel(params.educationLevel as string || "") },
      birthDate: { value: new Date(params.birthDate as string) ?? null, isValid: validateBoolean(params.birthDate as string || "") },
      gender: { value: params.gender as string, isValid: validateBoolean(params.gender as string || "") },
      maritalStatus: { value: params.maritalStatus as string, isValid: validateBoolean(params.maritalStatus as string || "") },
      phone: { value: params.phone as string, isValid: validatePhone(params.phone as string || "") },
      address: { value: params.address as string, isValid: validateAddress(params.address as string || "") },
    });
  };

  useEffect(() => {
    loadInitialData();
  }, [params.id]);



  const setIdNumber = (value: string) => {
    let newValue = value;
    const primerChar = newValue.charAt(0); // Primer carácter

    if (!(/[a-zA-Z]/.test(primerChar)) && newValue !== "") {
      newValue = "V-" + newValue;
    }

    setFormData((prevData) => ({
      ...prevData,
      idNumber: {
        // ...prevData.idNumber,
        value: newValue,
        isValid: validateIdNumber(newValue)
      },
    }) as PersonFormState);

    return;
  };

  const setFirstName = (value: string) => {
    const newValue = value;
    setFormData((prevData) => ({
      ...prevData,
      firstName: {
        // ...prevData.firstName,
        value: newValue,
        isValid: validateFirstName(newValue)
      },
    }) as PersonFormState);

    return;
  };

  const setLastName = (value: string) => {
    const newValue = value;
    setFormData((prevData) => ({
      ...prevData,
      lastName: {
        // ...prevData.lastName,
        value: newValue,
        isValid: validateLastName(newValue)
      },
    }) as PersonFormState);

    return;
  };

  const setEducationLevel = (value: string) => {
    const newValue = value;
    setFormData((prevData) => ({
      ...prevData,
      educationLevel: {
        // ...prevData.educationLevel,
        value: newValue,
        isValid: validateEducationLevel(newValue)
      },
    }) as PersonFormState);

    return;
  };

  const setBirthDate = (evet: any, value?: Date) => {
    const currentDate = value || formData.birthDate?.value;
    setShowPicker(Platform.OS === 'ios'); // En iOS, el picker se queda abierto; en Android, se cierra

    setFormData((prevData) => ({
      ...prevData,
      birthDate: {
        // ...prevData.birthDate,
        value: currentDate,
        isValid: validateBoolean(String(currentDate))
      },
    }) as PersonFormState);

    return;
  };

  const showDatepicker = () => {
    setShowPicker(true);
  };

  const setGender = (value: string) => {
    const newValue = value;
    setFormData((prevData) => ({
      ...prevData,
      gender: {
        // ...prevData.gender,
        value: newValue,
        isValid: validateBoolean(newValue)
      },
    }) as PersonFormState);

    return;
  };

  const setMaritalStatus = (value: string) => {
    const newValue = value;
    setFormData((prevData) => ({
      ...prevData,
      maritalStatus: {
        // ...prevData.maritalStatus,
        value: newValue,
        isValid: validateBoolean(newValue)
      },
    }) as PersonFormState);

    return;
  };

  const setPhone = (value: string) => {
    const newValue = value;
    setFormData((prevData) => ({
      ...prevData,
      phone: {
        // ...prevData.phone,
        value: newValue,
        isValid: validatePhone(newValue)
      },
    }) as PersonFormState);

    return;
  };

  const setAddress = (value: string) => {
    const newValue = value;
    setFormData((prevData) => ({
      ...prevData,
      address: {
        // ...prevData.address,
        value: newValue,
        isValid: validateAddress(newValue)
      },
    }) as PersonFormState);

    return;
  };

  // Función para mostrar error 
  const getErrorMessage = (field: { value: any; isValid: boolean | null } | undefined, errorMsg: string) => {
    if (!field) return;
    return Boolean(field.value) && !field.isValid ? <Text style={styles.errorText}>{errorMsg}</Text> : null;
  }

  const handleDiscard = () => {
    Alert.alert(
      "Confirmar",
      "¿Deseas descartar los cambios?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Descartar", style: "destructive", onPress: () => router.push({ pathname: '/personListScreen', }) }
      ]
    );
  };

  const validateAndSubmit = async () => {

    setLoading(true);

    if (!formData.idNumber?.isValid) {
      showNotification({
        messageT: 'Error, La cédula debe tener formato válido (ej. V-10.204.305)',
        positionOfNotification: 'bottom',
        typeOfNotification: 'info',
      });

      await setTimeout(() => {
        setLoading(false);
      }, 1800);

      return;
    }

    if (!formData.firstName?.isValid) {
      showNotification({
        messageT: 'Error, El nombre es inválido (solo letras)',
        positionOfNotification: 'bottom',
        typeOfNotification: 'info',
      });

      await setTimeout(() => {
        setLoading(false);
      }, 1800);
      return;
    }

    if (!formData.lastName?.isValid) {
      showNotification({
        messageT: 'Error, El apellido es inválido (solo letras)',
        positionOfNotification: 'bottom',
        typeOfNotification: 'info',
      });

      await setTimeout(() => {
        setLoading(false);
      }, 1800);
      return;
    }

    if (!formData.educationLevel?.isValid) {
      showNotification({
        messageT: 'Error, El nivel educativo debe tener entre 5 a 50 caracteres',
        positionOfNotification: 'bottom',
        typeOfNotification: 'info',
      });

      await setTimeout(() => {
        setLoading(false);
      }, 1800);
      return;
    }

    if (!formData.birthDate?.isValid) {
      showNotification({
        messageT: 'Error, ingrese una fecha de nacimiento validad',
        positionOfNotification: 'bottom',
        typeOfNotification: 'info',
      });

      await setTimeout(() => {
        setLoading(false);
      }, 1800);
      return;
    }

    if (!formData.gender?.isValid) {
      showNotification({
        messageT: 'Error, Selecciona el sexo',
        positionOfNotification: 'bottom',
        typeOfNotification: 'info',
      });

      await setTimeout(() => {
        setLoading(false);
      }, 1800);
      return;
    }

    if (!formData.maritalStatus?.isValid) {
      showNotification({
        messageT: 'Error, Selecciona el estado civil',
        positionOfNotification: 'bottom',
        typeOfNotification: 'info',
      });

      await setTimeout(() => {
        setLoading(false);
      }, 1800);
      return;
    }

    if (!formData.phone?.isValid) {
      showNotification({
        messageT: 'Error, El teléfono solo debe contener dígitos',
        positionOfNotification: 'bottom',
        typeOfNotification: 'info',
      });

      await setTimeout(() => {
        setLoading(false);
      }, 1800);
      return;
    }


    if (!formData.address?.isValid) {
      showNotification({
        messageT: 'Error, La Ubicación debe tener entre 5 a 150 caracteres',
        positionOfNotification: 'bottom',
        typeOfNotification: 'info',
      });

      await setTimeout(() => {
        setLoading(false);
      }, 1800);
      return;
    }

    await setIsLoading(true);

    const result = await updatePersonData(idPerson, {
      idNumber: formData.idNumber?.value as string,
      firstName: formData.firstName?.value as string,
      lastName: formData.lastName?.value as string,
      educationLevel: formData.educationLevel?.value as string,
      birthDate: formData.birthDate?.value,
      gender: formData.gender?.value as string,
      maritalStatus: formData.maritalStatus?.value as string,
      phone: formData.phone?.value as string,
      address: formData.address?.value as string,
    });


    await setTimeout(() => {
      setLoading(false);
    }, 1800);

    await setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    if (result === true) {
      router.push({
        pathname: '/personListScreen', // La ruta del archivo en /app
        params: { "update": "true" }
      });
    }

    return;
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.header}>
          <Text style={styles.title}>Actualizar Registro</Text>
          {/* <Text style={styles.idText}>ID Interno: PERSONA-#{idPerson}</Text> */}
        </View>

        {/* --- SECCIÓN 1: IDENTIDAD --- */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Documentación e Identidad</Text>


          {/* Cédula */}
          <InputWithLabel
            labelText="Cédula"
            value={formData.idNumber?.value}
            setValue={setIdNumber}
            placeholder="Ej. V-00.000.000 o E-0.000.000"
            styleContainer={{ marginVertical: 10 }}
            styleLabel={styles.label}
            styleInput={getInputStyle(styles.input, formData.idNumber)}
            mandatory={true}
          />
          {getErrorMessage(formData.idNumber, validationResponseIdNumber(formData.idNumber?.value as string || ""))}

          {/* Nombre */}
          <InputWithLabel
            labelText="Nombre"
            value={formData.firstName?.value}
            setValue={setFirstName}
            styleContainer={{ marginVertical: 10 }}
            styleLabel={styles.label}
            styleInput={getInputStyle(styles.input, formData.firstName)}
            mandatory={true}
          />
          {getErrorMessage(formData.firstName, validationResponseFirstName(formData.firstName?.value as string || ""))}

          {/* Apellido */}
          <InputWithLabel
            labelText="Apellido"
            value={formData.lastName?.value}
            setValue={setLastName}
            styleContainer={{ marginVertical: 10 }}
            styleLabel={styles.label}
            styleInput={getInputStyle(styles.input, formData.lastName)}
            mandatory={true}
          />
          {getErrorMessage(formData.lastName, validationResponseLastName(formData.lastName?.value as string || ""))}


          {/* --- SECCIÓN 2: INFORMACIÓN PERSONAL --- */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Información Personal</Text>

          {/* Nivel Educativo */}
          <InputWithLabel
            labelText="Nivel Educativo"
            value={formData.educationLevel?.value}
            setValue={setEducationLevel}
            styleContainer={{ marginVertical: 10 }}
            styleLabel={styles.label}
            styleInput={getInputStyle(styles.input, formData.educationLevel)}
            mandatory={true}
          />
          {getErrorMessage(formData.educationLevel, validationResponseEducationLevel(formData.educationLevel?.value as string || ""))}

          {/* Fecha de Nacimiento */}
          <InputDateWithLabel
            labelText="Fecha de Nacimiento"
            value={formData.birthDate?.value ?? null}
            setValue={setBirthDate}
            showDatepicker={showDatepicker}
            showPicker={showPicker}
            styleContainer={{ marginVertical: 10 }}
            styleInput={{
              borderWidth: formData.birthDate?.isValid === false ? 1.5 :
                formData.birthDate?.isValid === true ? 1.5 : 2.5,
              borderColor: formData.birthDate?.isValid === false ? '#e74c3c' :
                formData.birthDate?.isValid === true ? '#4CAF50' : '#e0e0e0'
            }}
            mandatory={true}
          />
          {getErrorMessage(formData.birthDate, 'Ingresa una fecha valida')}

          {/* Sexo */}
          <SelectWithLabel
            labelText={'Sexo'}
            mandatory={true}
            theValue={formData.gender?.value}
            setValue={setGender}
            sample={'Seleccione sexo'}
            dataOption={[{ title: "Masculino", id: "Masculino" }, { title: "Femenino", id: "Femenino" }]}
            stylePickerContainer2={getInputStyle({}, formData.gender)}
          />
          {getErrorMessage(formData.gender, 'Selecciona una opción')}

          {/* MaritalStatus */}
          <SelectWithLabel
            labelText={'Estado civil'}
            mandatory={true}
            theValue={formData.maritalStatus?.value}
            setValue={setMaritalStatus}
            sample={'Seleccione estado civil'}
            dataOption={[{ title: "Soltero/a", id: "Soltero/a" }, { title: "Concubinato", id: "Concubinato" }, { title: "Casado/a", id: "Casado/a" },
            { title: "Divorciado/a", id: "Divorciado/a" }, { title: "Viudo/a", id: "Viudo/a" }]}
            stylePickerContainer2={getInputStyle({}, formData.maritalStatus)}
          />
          {getErrorMessage(formData.maritalStatus, 'Selecciona una opción')}



          {/* --- SECCIÓN 3: CONTACTO --- */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Contacto</Text>


          {/* Teléfono */}
          <InputWithLabel
            labelText="Número de teléfono"
            value={formData.phone?.value}
            setValue={setPhone}
            styleContainer={{ marginVertical: 10 }}
            styleLabel={styles.label}
            styleInput={getInputStyle(styles.input, formData.phone)}
            keyboardType="phone-pad"
          />
          {getErrorMessage(formData.phone, validationResponsePhone(formData.phone?.value as string || ""))}


          {/* Ubicación */}
          <TextAreaWithLabel
            labelText="Ubicación"
            value={formData.address?.value}
            setValue={setAddress}
            styleContainer={{ marginVertical: 10 }}
            styleLabel={styles.label}
            styleInput={getInputStyle(styles.input, formData.address)}
          />
          {getErrorMessage(formData.address, validationResponseAddress(formData.address?.value as string || ""))}


        </View>

        {/* --- BOTONES DE ACCIÓN --- */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveBtn} onPress={validateAndSubmit}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>GUARDAR CAMBIOS</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.discardBtn} onPress={handleDiscard}>
            <Text style={styles.discardBtnText}>DESECHAR CAMBIOS</Text>
          </TouchableOpacity>
        </View>

        {
          //--------------------------------------------------------------------------------------------
          //--------------------------MODAL------------------------------------------------------------------
          //--------------------------------------------------------------------------------------------
        }

        <LoadingModal isLoading={isLoading} />


      </ScrollView>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  scroll: { padding: 20 },
  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1E293B' },
  idText: { fontSize: 13, color: '#94A3B8', marginTop: 4 },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#4F46E5', textTransform: 'uppercase', marginBottom: 15, letterSpacing: 0.5 },
  label: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 6 },
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
  row: { flexDirection: 'row' },
  selectorBtn: { backgroundColor: '#F8FAFC', borderRadius: 10, padding: 14, marginBottom: 15, borderWidth: 1, borderColor: '#E2E8F0' },
  selectorBtnText: { fontSize: 15, color: '#1E293B' },
  footer: { marginTop: 10, marginBottom: 50 },
  saveBtn: { backgroundColor: '#4F46E5', padding: 18, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  discardBtn: { padding: 16, alignItems: 'center', borderWidth: 1.5, borderColor: '#EF4444', borderRadius: 12 },
  discardBtnText: { color: '#EF4444', fontWeight: 'bold' },
  // Estilos Modal
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 25, maxHeight: '40%' },
  modalTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  modalOption: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  optionLabel: { fontSize: 16, textAlign: 'center', color: '#334155' },
  closeBtn: { marginTop: 15, alignItems: 'center' }
});