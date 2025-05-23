import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { AuthContext } from "../../contexts/AuthContext";

export default function SignIn() {
  const { signIn, loadingAuth } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (email === "" || password === "") {
      return;
    }

    await signIn({ email, password });
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require("../../assets/Logo forno di vino.png")}
              resizeMode="contain"
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Bem-vindo de volta</Text>

            <TextInput
              placeholder="Digite seu Email..."
              style={styles.input}
              placeholderTextColor="#333"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />

            <TextInput
              placeholder="Digite sua senha..."
              style={styles.input}
              placeholderTextColor="#333"
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              {loadingAuth ? (
                <ActivityIndicator size={25} color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Acessar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf8f5", // --dark-900
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoContainer: {
    backgroundColor: "#fef9f0", // --beige-100
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 220,
    height: 150,
  },
  formContainer: {
    backgroundColor: "#f2e8d5", // --dark-800
    paddingVertical: 36,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#a7342f", // --red-wine
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    height: 46,
    backgroundColor: "#fff",
    borderColor: "#d9a441", // --gold-500
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 16,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#a7342f", // --red-wine
    height: 46,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerLink: {
    marginTop: 20,
    textAlign: "center",
    color: "#0d0d0d", // --black
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
