import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

interface CustomInputProps {
    labelText: string;
    theValue: string;
    setValue: (text: string) => void;
    dataOption?: { title: string; id: string }[];
    sample?: string;
    mandatory?: boolean;
    styleContainer?: any;
    styleLabel?: any;
    stylePickerContainer?: any;
    stylePickerContainer2?: any;
    styleSelect?: any;
    styleSelectPickerItem?: any;
}

// theValue.isValid === null ? null : {
//                     borderColor: (Boolean(theValue.value) && !theValue.isValid) ? '#e74c3c' : // ← FIJO: Boolean() para condición booleana
//                         theValue.isValid ? '#4CAF50' : '#e0e0e0'
//                 }

const SelectWithLabel: React.FC<CustomInputProps> = ({
    labelText,
    theValue,
    setValue,
    dataOption,
    sample = '',
    mandatory = false,
    styleContainer,
    styleLabel,
    stylePickerContainer,
    stylePickerContainer2,
    styleSelect,
    styleSelectPickerItem = null,
}) => {

    return (
        <View style={!!styleContainer ? styleContainer : styles.fieldContainer}>
            <Text style={styleLabel ? styleLabel : styles.label}>
                {labelText} {mandatory === true ? <Text style={styles.requiredAsterisk}>*</Text> : null}
            </Text>
            <View style={[
                stylePickerContainer ? stylePickerContainer : styles.pickerContainer,
                stylePickerContainer2
            ]}>
                <Picker
                    selectedValue={theValue}
                    onValueChange={setValue}
                    style={styleSelect ? styleSelect : styles.picker}
                    itemStyle={styleSelectPickerItem ? styleSelectPickerItem : styles.pickerItem}
                >
                    
                    <Picker.Item label={sample} value="" style={{ fontSize: 13.5 }} />
                    {dataOption && dataOption.length > 0 ? (
                        dataOption.map((op) => (
                            <Picker.Item key={op.id} label={op.title} value={op.id} style={{ fontSize: 13.5 }} />
                        ))
                    ) : null}

                </Picker>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    fieldContainer: {
        marginVertical: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        letterSpacing: 0.2,
    },
    requiredAsterisk: {
        color: '#e74c3c',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 2,
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 0,
        // Sombra sutil 
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    picker: {
        color: '#333',
        borderColor: 'rgba(255, 255, 255, 0.02)',
        fontSize: 10,
        ...Platform.select({
            android: { backgroundColor: 'transparent' },
        }),
    },
    pickerItem: {
        fontSize: 10,
        color: '#555',
        backgroundColor: '#fafafa',
        fontWeight: '500',
    },


});

export default SelectWithLabel;
