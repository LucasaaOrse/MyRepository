import React, { useEffect, useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebase'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../types/navigation'

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AuthLoading'>

export default function AuthLoading() {
  const navigation = useNavigation<NavigationProp>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false)
      if (user) {
        navigation.replace('Home')
      } else {
        navigation.replace('Login')
      }
    })

    return unsubscribe
  }, [])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  )
}
