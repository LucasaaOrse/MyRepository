// src/pages/PedidosEmPreparo.tsx
import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  SafeAreaView,
  Alert
} from "react-native";
import { api } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/app.routes";
import { io } from "socket.io-client";

type OrderSummary = {
  id: string;
  table: number;
  status: boolean;   // false = em preparo, true = pronto
  created_at: string;
};

type OrderDetailItem = {
  id: string;
  amount: number;
  product: {
    name: string;
    price: string;
  };
};

export default function PedidosEmPreparo() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [details, setDetails] = useState<OrderDetailItem[]>([]);
  const [selected, setSelected] = useState<OrderSummary | null>(null);

  const [showReady, setShowReady] = useState(true);
  const [showPending, setShowPending] = useState(true);

  const ordersReady = orders
  .filter(o => o.status)
  .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const ordersPending = orders
  .filter(o => !o.status)
  .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()); 

  const { signOut } = useContext(AuthContext);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // dentro do seu componente, antes de qualquer outro useEffect:
useEffect(() => {
  const socket = io("https://pizzaria-backend-production-bccd.up.railway.app");

  socket.on("connect", () => {
    console.log("🔌 Socket conectado (mobile garçom):", socket.id);
  });

  // Quando a cozinha emitir 'orderFinished', atualizamos o pedido na lista
  socket.on("orderFinished", ({ id }: { id: string }) => {
    setOrders(prev =>
      prev.map(o =>
        String(o.id) === String(id)
          ? { ...o, status: true }   // marca como pronto
          : o
      )
    );
  });

  // Quando um novo pedido for enviado para a cozinha
  socket.on("orderCreated", (newOrder: OrderSummary) => {
    setOrders(prev => [newOrder, ...prev]);
  });

  return () => {
    socket.off("orderFinished");
    socket.off("orderCreated");
    socket.disconnect();
  };
}, []);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      // busca todos em preparo (status=false)
      const prep = await api.get<OrderSummary[]>("/order/pending", {
        params: { cacheBuster: Date.now() },
      });
      // busca todos prontos (status=true)
      const done = await api.get<OrderSummary[]>("/order/finished", {
        params: { cacheBuster: Date.now() },
      });
      // combina em um só array (prep primeiro, depois done)
      setOrders([...prep.data, ...done.data]);
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível carregar pedidos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  async function showDetails(order: OrderSummary) {
    setSelected(order);
    setLoading(true);
    try {
      const res = await api.get<OrderDetailItem[]>("/order/details", {
        params: {
          order_id: order.id,
          cacheBuster: Date.now(),
        },
      });
      setDetails(res.data);
      setModalVisible(true);
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível carregar detalhes.");
    } finally {
      setLoading(false);
    }
  }

  function handleCloseModal() {
    setModalVisible(false);
    setSelected(null);
    setDetails([]);
    loadOrders(); // recarrega assim que fechar o detalhe
  }

  return (
    <SafeAreaView style={S.container}>
      <View style={S.header}>
        <Text style={S.title}>Pedidos em Preparo</Text>
        <View style={S.actions}>
          <TouchableOpacity onPress={loadOrders}>
            <Feather name="refresh-ccw" size={24} color="#3fffa3" />
          </TouchableOpacity>
          <TouchableOpacity onPress={signOut} style={S.logout}>
            <Feather name="log-out" size={24} color="#ff4f4b" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Dashboard")}
            style={S.logout}
          >
            <Feather name="plus-square" size={24} color="#3fd1ff" />
          </TouchableOpacity>
        </View>
      </View>

      {loading && <ActivityIndicator size="large" color="#3fffa3" />}

      <FlatList
  ListHeaderComponent={
    <>
      {/* PEDIDOS PRONTOS */}
      <TouchableOpacity onPress={() => setShowReady(!showReady)} style={S.sectionHeader}>
        <Text style={S.sectionTitle}>Pedidos Prontos</Text>
        <Feather name={showReady ? "chevron-up" : "chevron-down"} size={20} color="#3fffa3" />
      </TouchableOpacity>

      {showReady && ordersReady.map((item) => (
        <TouchableOpacity key={item.id} style={S.item} onPress={() => showDetails(item)}>
          <View style={[S.tag, { backgroundColor: "#3fffa3" }]} />
          <Text style={S.itemText}>
            Mesa {item.table} <Text style={S.sub}>pronto</Text>
          </Text>
        </TouchableOpacity>
      ))}

      {/* PEDIDOS EM PREPARO */}
      <TouchableOpacity onPress={() => setShowPending(!showPending)} style={S.sectionHeader}>
        <Text style={S.sectionTitle}>Pedidos em Preparo</Text>
        <Feather name={showPending ? "chevron-up" : "chevron-down"} size={20} color="#f1c40f" />
      </TouchableOpacity>

      {showPending && ordersPending.map((item) => (
        <TouchableOpacity key={item.id} style={S.item} onPress={() => showDetails(item)}>
          <View style={[S.tag, { backgroundColor: "#f1c40f" }]} />
          <Text style={S.itemText}>
            Mesa {item.table} <Text style={S.sub}>em preparo</Text>
          </Text>
        </TouchableOpacity>
      ))}

      {/* Se estiver vazio */}
      {ordersReady.length === 0 && ordersPending.length === 0 && !loading && (
        <Text style={S.empty}>Nenhum pedido encontrado.</Text>
      )}
    </>
  }
  data={[]} // necessário para FlatList funcionar mesmo com ListHeaderComponent
  renderItem={null}
  ListEmptyComponent={null}
  contentContainerStyle={{ paddingBottom: 32 }}
/>

      {/* Modal de detalhes */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={S.modalOverlay}>
          <View style={S.modalBox}>
            <Text style={S.modalTitle}>
              Detalhes Mesa {selected?.table}
            </Text>
            <FlatList
              data={details}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <Text style={S.modalItem}>
                  {item.amount}× {item.product.name} — R${" "}
                  {(parseFloat(item.product.price) * item.amount).toFixed(2)}
                </Text>
              )}
            />
            <TouchableOpacity
              style={S.modalClose}
              onPress={handleCloseModal}
            >
              <Text style={S.modalCloseText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1d1d2e" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  title: { fontSize: 24, color: "#fff", fontWeight: "bold" },
  actions: { flexDirection: "row", alignItems: "center", gap: 12 },
  logout: { marginLeft: 12 },

  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#101026",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 6,
    padding: 12,
  },
  tag: { width: 8, height: "100%", borderRadius: 4, marginRight: 12 },
  itemText: { color: "#fff", fontSize: 18 },
  sub: { color: "#ccc", fontSize: 14 },

  empty: {
    textAlign: "center",
    color: "#666",
    marginTop: 32,
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#1d1d2e",
    borderRadius: 8,
    padding: 16,
    maxHeight: "80%",
  },
  modalTitle: { fontSize: 20, color: "#fff", marginBottom: 12 },
  modalItem: { color: "#fff", fontSize: 16, marginVertical: 4 },
  modalClose: {
    marginTop: 16,
    alignSelf: "center",
    backgroundColor: "#3fffa3",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  modalCloseText: { color: "#101026", fontWeight: "bold" },
  sectionHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 16,
  paddingVertical: 12,
  backgroundColor: "#101026",
  marginHorizontal: 16,
  marginTop: 16,
  borderRadius: 6,
},
sectionTitle: {
  fontSize: 20,
  color: "#fff",
  fontWeight: "bold",
},
});
