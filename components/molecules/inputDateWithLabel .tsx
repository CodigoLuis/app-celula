import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface CustomInputProps {
  numberTestID?: string;
  labelText?: string;
  value: Date | null;
  setValue: (event: any, selectedDate?: Date) => void;
  showDatepicker: () => void;
  placeholder?: string;
  mandatory?: boolean;
  showPicker?: boolean;
  styleContainer: any;
  styleLabel?: any;
  styleInput?: any;
  typeMode?: 'date' | 'time' | 'datetime';
  minDate?: any;
  maxDate?: any;
  is24H?: boolean;
}

const InputWithLabel: React.FC<CustomInputProps> = ({
  numberTestID = "dateTimePicker",
  labelText,
  value,
  setValue,
  showDatepicker,
  placeholder = 'Fecha: DD-MM-YYYY',
  mandatory = false,
  showPicker = false,
  styleContainer,
  styleLabel,
  styleInput = {},
  typeMode = 'date',
  minDate = new Date(1990, 0, 1),
  maxDate = new Date(),
  is24H = true,
}) => {

  return (
    <View style={styleContainer ? styleContainer : styles.container}>
      {/* Título arriba */}
      <Text style={styleLabel ? styleLabel : styles.label}>
        {labelText} {mandatory === true ? <Text style={styles.inputMandatory}>*</Text> : null}
      </Text>

      {/* Fila horizontal: Botón e Input */}
      {/* <View style={styles.rowContainer}> */}
      <View style={{}}>
        {/* <View style={[styles.buttonContainer, { display: "none" }]}>
          <Button onPress={showDatepicker} title="Fecha" />
        </View> */}

        <TouchableOpacity
          // 2. Aquí aplicamos el 'onClick' móvil (onPress)
          onPress={showDatepicker}
        // activeOpacity={0.7} // Retroalimentación visual al presionar
        >
          <TextInput
            // style={[styles.input, styles.inputInRow, styleInput, { flex: 1 }]}  // Combina estilos 
            style={[styles.input, styleInput, { flex: 1 }]}  // Combina estilos
            value={value === null ? "" : typeMode === 'date' ? value.toLocaleDateString() : typeMode === 'time' ? value.toLocaleTimeString() : value.toLocaleString()}
            placeholder={placeholder}
            editable={false}
          // onPress={}
          />
        </TouchableOpacity>

        {/* DateTimePicker se muestra cuando showPicker es true */}
        {showPicker && (
          <DateTimePicker
            testID={numberTestID}
            value={value === null ? new Date() : value}
            mode={typeMode} // Modo fecha ("date": Solo fecha (día/mes/año), "time": Solo hora (hora/minutos), "datetime": Fecha y hora combinadas)
            is24Hour={is24H}
            display="default" // "default": Usa el estilo nativo predeterminado, "spinner" (Android): Selector giratorio, "calendar" (Android): Vista de calendario, "clock" (Android): Vista de reloj, "compact" (iOS): Compacto, "inline" (iOS): Inline en la vista.
            onChange={setValue}
            minimumDate={minDate}  // Fecha mínima
            maximumDate={maxDate}  // Fecha máxima
            // textColor="blue"  // Color del texto (iOS)
            // accentColor="green"  // Color de acento (iOS)
            locale="es-ES"  // Formatos: "en-US" (Estados Unidos), "es-MX" (México), "es-ES" (España), "fr-FR" (Francia), "de-DE" (Alemania), "ja-JP" (Japón), "zh-CN" (China), "en-AU" (Australia), "mi-NZ" (Nueva Zelanda, con influencia maorí).
            disabled={false}  // Habilita/desabilita
          />
        )}

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginBottom: 10,
    width: "80%",
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  // rowContainer: {
  //   flexDirection: 'row',  // Alinea en fila horizontal
  //   alignItems: 'center',  // Centra verticalmente
  //   justifyContent: 'space-between',  // Espacio entre botón e input
  // },
  // buttonContainer: {
  //   flex: 0.3,  // Botón ocupa ~30% del ancho
  //   marginRight: 8,  // Espacio entre botón e input
  //   // padding: 5,
  //   // borderRadius: 50,
  //   // backgroundColor: "red",
  // },
  input: {
    borderColor: '#ccc',
    borderRadius: 7,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 15.5,
  },
  // inputInRow: {
  //   flex: 0.7,  // Input ocupa ~70% del ancho
  // },
  inputMandatory: {
    color: "red",
  },
});

export default InputWithLabel;

