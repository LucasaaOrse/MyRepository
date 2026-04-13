import 'react-native-reanimated'
import React, { useState } from 'react'
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import Animated, { Layout } from 'react-native-reanimated'
import { useTransactions } from '../store/useTranssactions'
import { RootStackParamList } from '../types/navigation'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { auth } from '../services/firebase'
import { signOut } from 'firebase/auth'
import { PieChart } from 'react-native-chart-kit'
import { DonutChart } from '../components/DonutChart'
import { isSameWeek, isLastWeek, isSameMonth } from '../utils/dateFilters' // criaremos isso já já

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>

export default function Home() {
  const { transactions, getBalance } = useTransactions()
  const navigation = useNavigation<HomeScreenNavigationProp>()
  const [showList, setShowList] = useState(false)
  
  const colors = [
  '#e0ac2b',
  '#e85252',
  '#6689c6',
  '#9a6fb0',
  '#a53253',
  '#69b3a2',
]


  const [period, setPeriod] = useState<'week' | 'lastWeek' | 'month'>('month')

const filteredTransactions = transactions.filter((t) => {
  const date = new Date(t.date)
  if (period === 'week') return isSameWeek(date)
  if (period === 'lastWeek') return isLastWeek(date)
  return isSameMonth(date)
})

const { income, expense, total } = getBalance(filteredTransactions)

const chartData = filteredTransactions
  .filter((t) => t.type === 'expense')
  .reduce((acc, t) => {
    const existing = acc.find((item) => item.name === t.category)
    if (existing) {
      existing.value += t.amount
    } else {
      acc.push({
        name: t.category,
        value: t.amount,
        color: colors[acc.length % colors.length],
      })
    }
    return acc
  }, [] as { name: string; value: number; color: string }[])

  const getExpenseChartData = () => {
    const expenses = transactions.filter((t) => t.type === 'expense')
    const categories = expenses.reduce((acc, t) => {
      const existing = acc.find((item) => item.name === t.category)
      if (existing) {
        existing.amount += t.amount
      } else {
        acc.push({ name: t.category, amount: t.amount })
      }
      return acc
    }, [] as { name: string; amount: number }[])

    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#9C27B0', '#4CAF50', '#F44336']

    return categories.map((cat, index) => ({
      name: cat.name,
      population: cat.amount,
      color: colors[index % colors.length],
      legendFontColor: '#fff',
      legendFontSize: 14,
    }))
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      <View style={styles.header}>
        <Text style={styles.headerText}>Minhas finanças</Text>
        <TouchableOpacity onPress={() => signOut(auth)}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.balanceBox}>
        <Text style={styles.balanceLabel}>Disponível</Text>
        <Text style={styles.balanceValue}>R$ {total.toFixed(2)}</Text>
        <View style={styles.row}>
          <View>
            <Text style={styles.smallLabel}>Entrada</Text>
            <Text style={styles.income}>+ R$ {income.toFixed(2)}</Text>
          </View>
          <View>
            <Text style={styles.smallLabel}>Despesas</Text>
            <Text style={styles.expense}>- R$ {expense.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.filterRow}>
        {['week', 'lastWeek', 'month'].map((p) => (
          <TouchableOpacity
            key={p}
            onPress={() => setPeriod(p as any)}
            style={[
              styles.filterButton,
              period === p && styles.filterButtonActive,
            ]}
          >
            <Text style={styles.filterText}>
              {p === 'week' ? 'Semana' : p === 'lastWeek' ? 'Semana Passada' : 'Mês'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {chartData.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <DonutChart
            data={chartData}
            width={Dimensions.get('window').width}
            height={220}
            innerRadius={60}
            outerRadius={100}
          />
        </View>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Add')}
      >
        <Text style={styles.addText}>+ Transação</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowList((prev) => !prev)}
      >
        <Text style={styles.toggleText}>
          {showList ? 'Ocultar Despesas' : 'Mostrar Despesas'}
        </Text>
      </TouchableOpacity>

      {showList && (
        <Animated.FlatList
          layout={Layout.springify()}
          style={styles.list}
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Animated.View entering={Layout.springify()} style={styles.item}>
              <Text style={styles.desc}>{item.description}</Text>
              <Text
                style={[
                  styles.amount,
                  item.type === 'income' ? styles.income : styles.expense,
                ]}
              >
                {item.type === 'income' ? '+' : '-'} R$ {item.amount.toFixed(2)}
              </Text>
            </Animated.View>
          )}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  headerText: { color: '#fff', fontSize: 22, fontWeight: '700' },
  logoutText: { color: '#ff5252', fontSize: 16 },

  balanceBox: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: '#1f1f1f',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  balanceLabel: { color: '#bbb', fontSize: 14 },
  balanceValue: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  smallLabel: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 4,
  },
  income: { color: '#4caf50', fontSize: 16 },
  expense: { color: '#f44336', fontSize: 16 },

  addButton: {
    marginHorizontal: 20,
    backgroundColor: '#6200ea',
    borderRadius: 25,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  addText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  toggleButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  toggleText: {
    color: '#888',
    fontSize: 14,
  },

  list: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  item: {
    backgroundColor: '#1f1f1f',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  desc: { color: '#fff', fontSize: 16 },
  amount: { fontSize: 16, fontWeight: '600' },
  filterRow: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginTop: 10,
},
filterButton: {
  paddingVertical: 6,
  paddingHorizontal: 12,
  backgroundColor: '#1f1f1f',
  borderRadius: 8,
},
filterButtonActive: {
  backgroundColor: '#6200ea',
},
filterText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 12,
},
})
