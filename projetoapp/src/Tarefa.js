import React from "react"

import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { FontAwesome } from "@expo/vector-icons"

export default function Tarefa({data, deleteItem }){
    return(
        <View>
            <Text style={styles.container} >
                <TouchableOpacity style={styles.button} onPress={deleteItem}>
                    <FontAwesome name="trash" size={20} color="#22272e" />
                </TouchableOpacity>
               {data.item}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flexDirection: "row",
        backgroundColor: "rgba(196,196,196, 0.20 )",
        marginTop: 12,
        padding: 12,
        borderRadius: 4,
        
    },
    button:{
        marginRight: 8
    }
})
