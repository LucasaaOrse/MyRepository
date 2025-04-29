
import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList } from "react-native"

import { useRoute, RouteProp, useNavigation } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { api } from "../../services/api";
import { ModalPicker } from "../../components/ModalPicker";
import { ListItem } from "../../components/ListItem";
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { StackPramsList } from "../../routes/app.routes";

type RouteDetailParams = {
    Order: {
        number: string | number;
        order_id: string
    }
}

export type CategoryProps ={
    id: string
    name: string
}

type ProductProps ={
    id: string,
    name: string
}
type OrderRouteProp = RouteProp<RouteDetailParams, "Order">

type ItemProps = {
    id: string,
    product_id: string,
    name: string,
    amount: string | number
}

export default function Order(){
    const router = useRoute<OrderRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<StackPramsList>>()

    const [category, setCategory] = useState<CategoryProps[] | []>([])
    const [categorySelected, setCategorySelected] = useState<CategoryProps | undefined>()
    const [modalCategoryVisible, setModalCategoryVisible] = useState(false)

    const [products, setProducts] = useState<ProductProps[] | []>([])
    const [productSelected, setProductSelected] = useState<ProductProps | undefined>()
    const [modalProdutVisible, setModalProductVisible] = useState(false)

    const [amount, setAmount] = useState("1")
    const [items, setItems] = useState<ItemProps[]>([])

    console.log('Items recebidos:', items);

    useEffect(() => {

        async function loadinfo() {
            const response = await api.get("/category")
            
            setCategory(response.data)
            setCategorySelected(response.data[0])
        }

        loadinfo()
    },[])

    useEffect(() => {
        async function loadProducts() {
            if (!categorySelected?.id) return; // <-- evita requisição inválida
            const response = await api.get("/product", {
                params:{
                    category: categorySelected?.id
                }
            }) 
            
            setProducts(response.data)
            setProductSelected(response.data[0])
        }

        loadProducts()
    }, [categorySelected])

    async function handleCloseOrder() {
        try {
            await api.delete("/order",{
                params:{
                    id: router.params.order_id
                }
            }) 
            navigation.goBack()
        } catch (error) {  
            console.log(error)
        }
    }

    function handleChangeCategory(item: CategoryProps){
        setCategorySelected(item)
    }

    function handleChangeProduct(item: ProductProps){
        setProductSelected(item)
    }

    async function handleAdd() {
        const response = await api.post("/order/add",{
            order_id: router.params?.order_id,
            product_id: productSelected?.id,
            amount: Number(amount)
        })
        console.log("ID recebido da API:", response.data.id);
        let data = {
            id: response.data.id,
            product_id: productSelected?.id as string,
            name: productSelected?.name as string,
            amount: amount
        }

        setItems(oldArray => [...oldArray, data])

    }

    async function handledeleteItem(item_id:string) {
        try {
            const response = await api.delete("/order/remove", {
                params: {
                    id: item_id,
                }
            });
    
            // Se a resposta tiver id (order_id), só reduzimos a quantidade
            if (response.data.id) {
                const updatedItems = items.map(item => {
                    if (item.id === item_id) {
                        return {
                            ...item,
                            amount: Number(item.amount) - 1,
                        };
                    }
                    return item;
                });
                setItems(updatedItems);
            } else {
                // Se não tiver id, foi removido de fato
                const updatedItems = items.filter(item => item.id !== item_id);
                setItems(updatedItems);
            }
    
        } catch (error) {
            console.log("Erro ao remover item da lista", error);
        }
    }

    function handleFinishOrder(){
        navigation.navigate("FinishOrder",{number: router.params.number, order_id: router.params.order_id})
    }

    return(
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.title} >Mesa {router.params.number} </Text>
                {items.length === 0 && (
                    <TouchableOpacity onPress={handleCloseOrder} >
                        <Feather name="trash-2" size={28} color="#ff4f4b" />
                    </TouchableOpacity>
                )}
            </View>
            
            {category.length !== 0 && (
                <TouchableOpacity style={styles.input} onPress={() => setModalCategoryVisible(true)} >
                    <Text style={{color: "#fff"}} >{categorySelected?.name}</Text>
                </TouchableOpacity>
            )}

            {products.length !== 0 && (
                <TouchableOpacity style={styles.input} onPress={() => setModalProductVisible(true)}>
                    <Text style={{color: "#fff"}} >{productSelected?.name}</Text>
                </TouchableOpacity>
            )}

            <View style={styles.qtdContainer}>
                <Text style={styles.qtdText}>Quantidade</Text>
                <TextInput 
                style={[styles.input, { width: "60%", textAlign: "center" }]} 
                placeholderTextColor="#f0f0f0" 
                keyboardType="numeric" 
                value={amount}
                onChangeText={setAmount}
                />
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd} >
                    <Text style={styles.buttonText} >+</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.button, { opacity: items.length === 0 ? 0.3 : 1}]} 
                    disabled={items.length === 0}
                >
                    <Text style={styles.buttonText} onPress={handleFinishOrder}>Avançar</Text>
                </TouchableOpacity>
            </View>
            
            <FlatList
                showsHorizontalScrollIndicator={false}
                style={{flex: 1, marginTop: 24,}}
                data={items}
                keyExtractor={(item) => item.id.toString() }
                renderItem={({item}) => <ListItem data={item} deleteItem={handledeleteItem} />}
            />

            <Modal
                transparent={true}
                visible={modalCategoryVisible}
                animationType="fade"
            >
                <ModalPicker
                    handleCloseModal={() => setModalCategoryVisible(false)}
                    options={category}
                    selectedItem={handleChangeCategory}
                />
            </Modal>

            <Modal
                transparent={true}
                visible={modalProdutVisible}
                animationType="fade"
            >
                <ModalPicker
                    handleCloseModal={() => setModalProductVisible(false)}
                    options={products}
                    selectedItem={handleChangeProduct}
                />
            </Modal>

        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#1d1d2e",
        paddingVertical: "5%",
        paddingEnd: "4%",
        paddingStart: "4%"
        
    },
    header:{
        flexDirection: "row",
        marginBottom: 12,
        alignItems: "center",
        marginTop: 24
    },
    title:{
        fontSize: 30,
        fontWeight: "bold",
        color: "#fff",
        marginRight: 14
    },
    input:{
        backgroundColor: "#101026",
        borderRadius: 4,
        width: "100%",
        height: 40,
        marginBottom: 12,
        justifyContent: "center",
        paddingHorizontal: 8,
        color: "#fff",
        fontSize: 20
    },
    qtdContainer:{
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-between"
    },
    qtdText:{
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff"
    },
    actions:{
        flexDirection: "row",
        width: "100%",
        justifyContent: 'space-between'
    },
    buttonAdd:{
        width: "20%",
        backgroundColor: "#3fd1ff",
        borderRadius: 4,
        height: 40,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText:{
        color: "#101026",
        fontSize: 18,
        fontWeight: "bold"
    },
    button:{
        backgroundColor: "#3fffa3",
        borderRadius: 4,
        height: 40,
        width: "75%",
        alignItems: "center",
        justifyContent: "center",
        
    }
})