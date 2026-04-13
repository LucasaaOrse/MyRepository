import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Home from "./src/screens/Home"
import AddTransaction from "./src/screens/AddTransaction"
import { RootStackParamList } from "./src/types/navigation"
import Login from "./src/screens/Login"
import Register from "./src/screens/Register"
import AuthLoading from "./src/screens/AuthLoading"

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthLoading">
        <Stack.Screen name="AuthLoading" component={AuthLoading} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Add" component={AddTransaction} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
