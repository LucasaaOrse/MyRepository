import 'react-native-reanimated'
import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { useTransactions } from '../store/useTranssactions'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../types/navigation'
import uuid from 'react-native-uuid'
import Animated, { FadeInLeft } from 'react-native-reanimated'

type AddScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Add'>

const categories = ['Alimentação', 'Transporte', 'Lazer', 'Contas', 'Saúde', 'Outros']

export default function AddTransaction() {
  const navigation = useNavigation<AddScreenNavigationProp>()
  const addTransaction = useTransactions((state) => state.addTransaction)

  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('income')
  const [category, setCategory] = useState('Outros')

  const handleAdd = () => {
    if (!description || !amount) return alert('Preencha todos os campos')

    addTransaction({
      id: String(uuid.v4()),
      description,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toISOString(),
    })

    navigation.goBack()
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View entering={FadeInLeft.delay(100)} style={styles.backContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.title}>Nova Transação</Text>

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Supermercado"
        placeholderTextColor="#777"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Valor</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 100.00"
        placeholderTextColor="#777"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Tipo</Text>
      <View style={styles.typeRow}>
        <TouchableOpacity
          style={[styles.typeButton, type === 'income' && styles.typeSelectedGreen]}
          onPress={() => setType('income')}
        >
          <Text style={styles.typeText}>Entrada</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type === 'expense' && styles.typeSelectedRed]}
          onPress={() => setType('expense')}
        >
          <Text style={styles.typeText}>Saída</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Categoria</Text>
      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.category,
              category === cat && styles.categorySelected,
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text style={styles.categoryText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleAdd}>
        <Text style={styles.saveText}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#121212',
    flexGrow: 1,
  },
  backContainer: {
    marginBottom: 10,
  },
  backText: {
    color: '#bbb',
    fontSize: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    color: '#bbb',
    fontSize: 14,
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeSelectedGreen: {
    backgroundColor: '#4CAF50',
  },
  typeSelectedRed: {
    backgroundColor: '#F44336',
  },
  typeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  category: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
  },
  categorySelected: {
    backgroundColor: '#6200ea',
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: '#6200ea',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
})
