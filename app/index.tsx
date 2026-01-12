import InputWithLabel from '@/components/molecules/inputWithLabel';
import authContext from '@/contexts/auth/authContext';
import { useRouter } from "expo-router";
import React, { useContext, useState } from 'react';
import { Button, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";

export default function LoginScreen() {
  const { logIn } = useContext(authContext);

  const [inputUsername, setInputUsername] = useState<string>('');
  const [inputPassword, setInputPassword] = useState<string>('');
  const [error, setError] = useState<string | null>("");

  const router = useRouter();

  const handleLogin = async () => {
    if (!inputUsername || !inputPassword) {
      setError("Please fill in all field.");
      return false;
    }

    if (inputPassword.length < 6) {
      setError("Passwords must be at least 6 characters long.");
      return false;
    }

    setError(null);

    const success = await logIn({ username: inputUsername, password: inputPassword });
    console.log(success);
    if (success === true) { 
      router.replace("/home");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Ajusta el comportamiento según la plataforma
    >
      <View style={styles.innerContainer}>
        <Image
          source={require('@/assets/images/cuadrangular.png')} // URL del logo
          style={styles.logoLogin} // Tamaño del logo
        />

        <View style={styles.form}>
          <Text style={styles.titleLogin}>
            Inicio de sesión
          </Text>

          <Text style={{ marginBottom: 20 }}>
            Conéctate con tu territorio.
          </Text>

          <InputWithLabel
            labelText={"Usuario"}
            value={inputUsername}
            setValue={setInputUsername}
            styleContainer={{ marginVertical: 8, marginBottom: 10, width: "80%" }}
            styleLabel={{ fontSize: 16, marginBottom: 4, fontWeight: 'bold' }}
            styleInput={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 }}
          />

          <InputWithLabel
            labelText={"Contraseña"}
            password={true}
            value={inputPassword}
            setValue={setInputPassword}
            styleContainer={{ marginVertical: 8, marginBottom: 10, width: "80%" }}
            styleLabel={{ fontSize: 16, marginBottom: 4, fontWeight: 'bold' }}
            styleInput={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 }}
          />

          {error && <Text style={{ color: '#FFCDD2' }}>{error}</Text>}

          <View style={styles.contButton}>
            <Button title='Iniciar' onPress={handleLogin} />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red" 
  },
  logoLogin: {
    width: 100,
    height: 100,
    // top: -30,
  },
  form: {
    width: "100%",
    // marginBottom: 250,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "green" 
  },
  titleLogin: {
    fontSize: 35,
    fontFamily: "OpenSans-Regular",
    // marginBottom: 20,
  },
  contButton: {
    width: "80%",
    marginTop: 30,
  },
});
