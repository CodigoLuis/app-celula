import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface CustomInputProps {
  labelText: string;
  value: string;
  setValue: (text: string) => void;
  password: boolean; 
  styleContainer: any;
  styleLabel: any;
  styleInput: any;
  placeholder?: string;
}

const InputLabel: React.FC<CustomInputProps> = ({
  labelText,
  value,
  setValue,
  password,
  styleContainer,
  styleLabel,
  styleInput,
  placeholder = '',
}) => {
  return (
    <View style={styleContainer ? styleContainer : styles.container}>
      <Text style={styleLabel ? styleLabel : styles.label}>{labelText}</Text>
      <TextInput
        style={styleInput ? styleInput : styles.input}
        value={value}
        secureTextEntry={password}
        onChangeText={setValue}
        placeholder={placeholder}
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
    marginBottom: 4,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});

export default InputLabel;
