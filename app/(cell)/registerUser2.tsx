import React from 'react';
import { StyleSheet, Text, View } from "react-native";


export default function HomeScreen() {

  return (
    <View
      style={styles.container}
    >
      <View style={styles.bandaSuperior} >

        <Text style={styles.colorText} >Territorio negro ssssssss</Text>

      </View>

      <View style={styles.contentRow} >

        <View style={styles.cajaIndicador} >
          <Text style={styles.colorText} >Aqui indicador por semana</Text>
        </View>

        <View style={styles.cajaIndicadorEstatico} >
          <Text style={styles.textLine} >Registradas</Text>
          <Text style={styles.textValue} >500 P</Text>
          <Text style={styles.textLine} >Lideres</Text>
          <Text style={styles.textValue} >22 P</Text>
        </View>

      </View>

      <View style={{ padding: 10 }} >

        <View style={styles.card} >

          <Text>Tipo: Celula</Text>
          <Text>Fecha: 11/08/2025</Text>
          <Text>Personas: 12</Text>

        </View>

        <View style={styles.card} >

          <Text>Tipo: Celula</Text>
          <Text>Fecha: 11/08/2025</Text>
          <Text>Personas: 12</Text>

        </View>

        <View style={styles.card} >

          <Text>Tipo: Celula</Text>
          <Text>Fecha: 11/08/2025</Text>
          <Text>Personas: 12</Text>

        </View>

      </View>

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    // backgroundColor: '#ffffff',
  },
  bandaSuperior: {
    width: "100%",
    alignItems: "center",
    padding: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    backgroundColor: '#000000',
  },
  colorText: {
    color: '#ffffff',
  },
  contentRow: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-around',

  },
  cajaIndicador: {
    width: 220,
    height: 150,
    borderRadius: 10,
    marginLeft: 10,
    backgroundColor: '#005AAC',
  },
  textLine: {
    borderBottomWidth: 1,
    color: '#ffffff',
  },

  textValue: {
    color: '#ffffff',
    borderBottomWidth: 1,
    borderRadius: 20,
    marginTop: 5,
    marginLeft: 10,
  },
  cajaIndicadorEstatico: {
    width: 120,
    height: 150,
    padding: 15,
    marginLeft: 10,
    borderRadius: 7,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
    backgroundColor: '#005AAC',
  },

  card: {
    marginBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 18,
    backgroundColor: "#f7f2fa",
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)',
    elevation: 4,
  },

});
