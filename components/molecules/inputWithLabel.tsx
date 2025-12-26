import React from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';

interface CustomInputProps {
  labelText: string;
  value: string;
  setValue: (text: string) => void;
  password?: boolean;
  styleContainer: any;
  styleLabel?: any;
  styleInput?: any;
  placeholder?: string;
  mandatory?: boolean;
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number,
}

const InputWithLabel: React.FC<CustomInputProps> = ({
  labelText,
  value,
  setValue,
  password = false,
  styleContainer,
  styleLabel,
  styleInput,
  placeholder = '',
  mandatory = false,
  editable = true,
  keyboardType = 'default', // 'email' --> 'email-address'; 'phone' --> 'phone-pad'; 'age' --> 'number-pad';
  maxLength,
}) => {
  return (
    <View style={styleContainer ? styleContainer : styles.container}>
      <Text style={styleLabel ? styleLabel : styles.label}>{labelText} {mandatory === true ? <Text style={styles.inputMandatory}>*</Text> : null}</Text>
      <TextInput
        style={styleInput ? styleInput : styles.input}
        value={value}
        secureTextEntry={password}
        onChangeText={setValue}
        placeholder={placeholder}
        keyboardType={keyboardType}
        maxLength={maxLength}
        editable={editable}
      />
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputMandatory: {
    color: "red",
  }

});

export default InputWithLabel;
