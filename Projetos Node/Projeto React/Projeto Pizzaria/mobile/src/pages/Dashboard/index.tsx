import React, { useState, useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/app.routes";
import { api } from "../../services/api";
import { Feather } from "@expo/vector-icons";
import { socket } from "../../services/socket";

export default function Dashboard() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);

  async function openOrder() {
    if (number === "") return;

    setLoading(true);
    try {
      const response = await api.post("/order", {
        table: Number(number)
      });

      const orderId = response.data.order.id;
      const roomName = `mesa-${orderId}`;
      socket.emit("joinRoom", { room: roomName });

      setNumber("");
      navigation.navigate("Order", {
        number: number,
        order_id: orderId
      });
    } catch (error) {
      console.log("Erro ao abrir mesa:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Botão de voltar para PedidosEmPreparo */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("PedidosEmPreparo")}
      >
        <Feather name="arrow-left" size={24} color="#0d0d0d" />
      </TouchableOpacity>

      <Text style={styles.title}>Novo pedido</Text>

      <TextInput
        placeholder="Número da mesa"
        placeholderTextColor={styles.inputPlaceholder.color}
        style={styles.input}
        keyboardType="numeric"
        value={number}
        onChangeText={setNumber}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={openOrder}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={styles.loading.color} />
        ) : (
          <Text style={styles.buttonText}>Abrir mesa</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#faf8f5", // var(--dark-900): branco levemente quente
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    padding: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0d0d0d", // var(--black)
    marginBottom: 24,
  },
  input: {
    width: "90%",
    height: 44,
    backgroundColor: "#fde9c3",        // var(--beige-100)
    borderWidth: 1,
    borderColor: "#d9a441",            // var(--gold-500)
    borderRadius: 8,
    paddingHorizontal: 12,
    textAlign: "center",
    fontSize: 18,
    color: "#0d0d0d",                  // var(--black)
    marginBottom: 16,
  },
  inputPlaceholder: {
    color: "#8a8a8a", // var(--gray-100)
  },
  button: {
    width: "90%",
    height: 44,
    backgroundColor: "#d9a441", // var(--primary) dourado
    borderRadius: 8,
    marginVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    color: "#0d0d0d", // var(--black)
    fontWeight: "bold",
  },
  loading: {
    color: "#0d0d0d", // cor do spinner: preto
  },
});