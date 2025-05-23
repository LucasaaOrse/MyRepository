import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { FontAwesome5 } from "@expo/vector-icons"
import { useRoute, useNavigation, RouteProp  } from "@react-navigation/native"

import { api } from "../../services/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/app.routes";

type RouteDetailParams = {
    FinishOrder: {
        number: string | number,
        order_id: string
    }
}

type FinishOrderProp = RouteProp<RouteDetailParams, "FinishOrder">

export default function FinishOrder(){

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const router = useRoute<FinishOrderProp>()

    async function handleFinish() {
    try {
        await api.put("/order/send", {
            id: router.params.order_id 
        })

        navigation.navigate("PedidosEmPreparo");
    } catch (error) {
        console.log("erro ao finalizar", error) // Mostrar o erro para depurar
    }
}

    return(
        <View style={styles.container}>
            <Text style={styles.alert}>Você deseja finalizar esse pedido?</Text>
            <Text style={styles.title}>Mesa {router.params.number}</Text>
            <TouchableOpacity style={styles.button} onPress={handleFinish}>
                <Text style={styles.buttonText}>
                    Finalizar pedido
                </Text>
                <FontAwesome5 size={20} color="#0d0d0d" name="shopping-cart" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf8f5",      // var(--dark-900)
    paddingVertical: "5%",
    paddingHorizontal: "5%",
    alignItems: "center",
    justifyContent: "center",
  },
  alert: {
    fontSize: 20,
    color: "#0d0d0d",                 // var(--black)
    fontWeight: "bold",
    marginBottom: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0d0d0d",                 // var(--black)
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#d9a441",      // var(--primary)
    flexDirection: "row",
    width: "70%",
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  buttonText: {
    fontSize: 18,
    marginRight: 8,
    fontWeight: "bold",
    color: "#0d0d0d",                 // var(--black)
  },
});

