
import React, { useState, useContext } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { StackPramsList } from "../../routes/app.routes";
import { api } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";

export default function Dashboard(){
    const navigation = useNavigation<NativeStackNavigationProp<StackPramsList>>()

    const [number, setNumber] = useState("")
    const { signOut } = useContext(AuthContext)

    async function openOrder() {

        if(number === ""){
            return
        }

        const response = await api.post("/order", {
            table: Number(number)
        })


        navigation.navigate("Order", { number: number, order_id: response.data.order.id })
        
        setNumber('')
    }

    return(
        <SafeAreaView style={styles.container} >
            <TouchableOpacity onPress={signOut}>
                <Text>AAAAAA</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Novo pedido</Text>

            <TextInput
            placeholder="Numero da mesa"
            placeholderTextColor="#f0f0f0"
            style={styles.input}
            keyboardType="numeric"
            value={number}
            onChangeText={setNumber}
            />

            <TouchableOpacity style={styles.button} onPress={openOrder} >
                <Text style={styles.buttonText} >Abrir mesa</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 15,
        backgroundColor: "#1d1d2e"
    },
    title:{
        fontSize: 30,
        fontWeight: "bold",
        color: "#FFF",
        marginBottom: 24,

    },
    input:{
        width: "90%",
        height: 40,
        backgroundColor: "#101026",
        borderRadius: 4,
        paddingHorizontal: 8,
        textAlign: "center",
        fontSize: 18,
        color: "#fff"
    },
    button:{
        width: "90%",
        height: 40,
        backgroundColor: "#3fffa3",
        borderRadius: 4,
        marginVertical: 12,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText:{
        fontSize: 18,
        color: "#101026",
        fontWeight: "bold"
    }
}) 