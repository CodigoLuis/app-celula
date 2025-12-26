import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface CustomInputProps {
  labelText: string;
  value: string;
  setValue: (text: string) => void;
  styleContainer?: any;
  styleLabel?: any;
  styleInput?: any;
  placeholder?: string;
  mandatory?: boolean;
}

const TextAreaWithLabel: React.FC<CustomInputProps> = ({
  labelText,
  value,
  setValue,
  styleContainer,
  styleLabel,
  styleInput,
  placeholder = '',
  mandatory = false,
}) => {
  return (
    <View style={styleContainer ? styleContainer : styles.container}>
      <Text style={styleLabel ? styleLabel : styles.label}>{labelText} {mandatory === true ? <Text style={styles.inputMandatory}>*</Text> : null}</Text>
      <TextInput
        style={styleInput ? styleInput : styles.input}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        multiline={true}
        numberOfLines={4}
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
  inputMandatory: {
    color: "red",
  }

});

export default TextAreaWithLabel;
