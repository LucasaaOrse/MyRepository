import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Alert
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { api } from "../../services/api";
import { ModalPicker } from "../../components/ModalPicker";
import { ListItem } from "../../components/ListItem";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/app.routes";
import { ChatModal } from '../../components/ChatModal/ChatModal';

type RouteDetailParams = {
  Order: {
    number: string | number;
    order_id: string;
  };
};

type MissingIngredient = {
  ingredient_id: number;
  required: number;
  available: number;
};

export type CategoryProps = {
  id: string | number;
  name: string;
};

export type ProductProps = {
  id: string | number;
  name: string;
  price: string;
  available: boolean;
  missing: MissingIngredient[];
};

type OrderRouteProp = RouteProp<RouteDetailParams, "Order">;
type ItemProps = {
  id: string;
  product_id: string;
  name: string;
  amount: string | number;
};

export default function Order() {
  const router = useRoute<OrderRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [category, setCategory] = useState<CategoryProps[]>([]);
  const [categorySelected, setCategorySelected] =
    useState<CategoryProps>();
  const [modalCategoryVisible, setModalCategoryVisible] =
    useState(false);

  const [products, setProducts] = useState<ProductProps[]>([]);
  const [productSelected, setProductSelected] =
    useState<ProductProps>();
  const [modalProductVisible, setModalProductVisible] =
    useState(false);

  const [amount, setAmount] = useState("1");
  const [items, setItems] = useState<ItemProps[]>([]);

  useEffect(() => {
    async function loadCategories() {
      const response = await api.get("/category");
      setCategory(response.data);
      setCategorySelected(response.data[0]);
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      if (!categorySelected?.id) return;
      const response = await api.get("/product", {
        params: { category: categorySelected.id }
      });
      setProducts(response.data);
      setProductSelected(response.data[0]);
    }
    loadProducts();
  }, [categorySelected]);

  function checkProductAvailability(product: ProductProps) {
    return product.missing.every(missing => {
      return missing.required <= missing.available;
    });
  }

   async function handleAdd() {
  // Verifica se já existe o produto na lista
  const existingIndex = items.findIndex(item => item.product_id === productSelected?.id);

  // Se já existe, apenas atualiza a quantidade
  if (existingIndex !== -1) {
    const updatedItems = [...items];
    const existingItem = updatedItems[existingIndex];

    const newAmount = Number(existingItem.amount) + Number(amount);
    updatedItems[existingIndex] = {
      ...existingItem,
      amount: newAmount,
    };

    setItems(updatedItems);
    return;
  }

  // Se não existe, faz a requisição para adicionar
  const response = await api.post("/order/item", {
    order_id: router.params?.order_id,
    product_id: productSelected?.id,
    amount: Number(amount),
  });

  console.log("ID recebido da API:", response.data.id);

  const data = {
    id: response.data.id, // esse id é único para a adição do produto no pedido
    product_id: productSelected?.id as string,
    name: productSelected?.name as string,
    amount: Number(amount),
  };

  setItems(oldArray => [...oldArray, data]);
}

  async function handleDeleteItem(item_id: string) {
  try {
    const { data } = await api.delete("/order/item", {
      params: { id: item_id }
    });

    if (data.action === "decrement") {
      setItems(items =>
        items.map(i =>
          i.id === item_id ? { ...i, amount: data.amount } : i
        )
      );
    } else if (data.action === "delete") {
      setItems(items => items.filter(i => i.id !== item_id));
    }
  } catch (err) {
    console.error("Erro ao remover item da lista", err);
  }
}

  function handleFinishOrder(){
        navigation.navigate("FinishOrder",{number: router.params.number, order_id: router.params.order_id})
    }

  function handleChangeCategory(item: CategoryProps) {
    setCategorySelected(item);
  }

  function handleChangeProduct(item: ProductProps) {
    setProductSelected(item);
  }


   // novo handler que chamará a API de delete e depois voltará
  async function handleDeleteOrder() {
    try {
      // chamar rota DELETE /order/:order_id
      await api.delete(`/order/${router.params.order_id}`);
      // volta para a tela anterior
      navigation.goBack();
    } catch (err) {
      console.error("Erro ao deletar pedido:", err);
      Alert.alert("Erro", "Não foi possível cancelar o pedido.");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mesa {router.params.number}</Text>
        {items.length === 0 && (
          <TouchableOpacity onPress={handleDeleteOrder}>
            <Feather name="trash-2" size={28} color="#ff4f4b" />
          </TouchableOpacity>
        )}
      </View>

      {category.length > 0 && (
        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalCategoryVisible(true)}
        >
          <Text style={styles.inputText}>
            {categorySelected?.name}
          </Text>
        </TouchableOpacity>
      )}

      {products.length > 0 && (
        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalProductVisible(true)}
        >
          <Text style={[styles.inputText, { color: productSelected && !checkProductAvailability(productSelected) ? 'red' : '#0d0d0d' }]}>
            {productSelected?.name}
          </Text>
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
        <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { opacity: items.length === 0 ? 0.3 : 1 }]}
          disabled={items.length === 0}
          onPress={handleFinishOrder}
        >
          <Text style={styles.buttonText}>Avançar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ListItem key={item.id} data={item} deleteItem={handleDeleteItem} />
        )}
        style={{ flex: 1, marginTop: 24 }}
      />

      <Modal visible={modalCategoryVisible} transparent animationType="fade">
        <ModalPicker<CategoryProps>
          options={category}
          handleCloseModal={() => setModalCategoryVisible(false)}
          selectedItem={handleChangeCategory}
        />
      </Modal>

      <Modal visible={modalProductVisible} transparent animationType="fade">
        <ModalPicker<ProductProps>
          options={products}
          handleCloseModal={() => setModalProductVisible(false)}
          selectedItem={handleChangeProduct}
        />
      </Modal>

      <ChatModal
        roomId={router.params.order_id}    // AQUI: sala = order_id (string)
        tableNumber={Number(router.params.number)} // só para exibir “Mesa XX”
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf8f5",      // var(--dark-900)
    paddingVertical: "5%",
    paddingHorizontal: "4%",
  },
  header: {
    flexDirection: "row",
    marginVertical: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0d0d0d",                 // var(--black)
    marginRight: 14,
  },
  input: {
    backgroundColor: "#e9d4b0",      // var(--dark-700) – mais escuro
    borderRadius: 4,
    height: 40,
    marginBottom: 12,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  inputText: {
    color: "#0d0d0d",                 // var(--black)
    fontSize: 18,
    fontWeight: "600",                // texto mais grosso
  },
  qtdContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  qtdText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0d0d0d",                 // var(--black)
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  buttonAdd: {
    width: "20%",
    backgroundColor: "#3fffa3",      // verde de ação
    borderRadius: 4,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "75%",
    backgroundColor: "#d9a441",      // var(--primary)
    borderRadius: 4,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0d0d0d",                 // var(--black)
  },
});

