// src/routes/index.tsx
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../contexts/AuthContext";

import SignIn from "../pages/SignIn";
import PedidosEmPreparo from "../pages/PedidosEmPreparo";
import Dashboard from "../pages/Dashboard";
import Order from "../pages/Order";
import FinishOrder from "../pages/FinishOrder";

export type RootStackParamList = {
  SignIn: undefined;
  PedidosEmPreparo: undefined;
  Dashboard: undefined;
  Order: { number: string | number; order_id: string };
  FinishOrder: { number: string | number; order_id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    // opcional: splash screen, spinner etc.
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      { !isAuthenticated ? (
        // se não estiver logado, só SignIn
        <Stack.Screen name="SignIn" component={SignIn} />
      ) : (
        // usuário logado
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
              headerShadowVisible: false
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
