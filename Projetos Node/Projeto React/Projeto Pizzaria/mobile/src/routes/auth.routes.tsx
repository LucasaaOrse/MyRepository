import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PedidosEmPreparo from "../pages/PedidosEmPreparo";
import Dashboard from "../pages/Dashboard";
import Order from "../pages/Order";
import FinishOrder from "../pages/FinishOrder";

export type RootStackParamList = {
  PedidosEmPreparo: undefined;
  Dashboard: undefined;
  Order: { number: string | number; order_id: string };
  FinishOrder: { number: string | number; order_id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
  // desabilitando o loading e autenticacao
  // const { isAuthenticated, loading } = useContext(AuthContext);

  // Força isAuthenticated true
  const isAuthenticated = true;
  const loading = false;

  if (loading) {
    return null; // ou uma splash screen
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <>
        <Stack.Screen
          name="PedidosEmPreparo"
          component={PedidosEmPreparo}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Order" component={Order} options={{ headerShown: false }} />
        <Stack.Screen
          name="FinishOrder"
          component={FinishOrder}
          options={{
            title: "Finalizando",
            headerStyle: { backgroundColor: "#1d1d2e" },
            headerTintColor: "#fff",
            headerShadowVisible: false,
          }}
        />
      </>
    </Stack.Navigator>
  );
}