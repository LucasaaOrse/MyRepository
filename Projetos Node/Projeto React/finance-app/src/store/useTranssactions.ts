import { create } from 'zustand'

type Transaction = {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
}

type State = {
  transactions: Transaction[]
  getBalance: (transactions?: Transaction[]) => { income: number; expense: number; total: number }
  addTransaction: (transaction: Transaction) => void
}

export const useTransactions = create<State>((set, get) => ({
  transactions: [
],
  getBalance: (customTransactions) => {
  const transactions = customTransactions ?? get().transactions
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)
  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)
  return { income, expense, total: income - expense }
},
  addTransaction: (transaction) =>
    set((state) => ({ transactions: [transaction, ...state.transactions] })),
}))
