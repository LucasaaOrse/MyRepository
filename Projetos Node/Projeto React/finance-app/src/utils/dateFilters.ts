export const isSameWeek = (date: Date) => {
  const now = new Date()
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(endOfWeek.getDate() + 6)

  return date >= startOfWeek && date <= endOfWeek
}

export const isLastWeek = (date: Date) => {
  const now = new Date()
  const startOfLastWeek = new Date(now.setDate(now.getDate() - now.getDay() - 7))
  const endOfLastWeek = new Date(startOfLastWeek)
  endOfLastWeek.setDate(endOfLastWeek.getDate() + 6)

  return date >= startOfLastWeek && date <= endOfLastWeek
}

export const isSameMonth = (date: Date) => {
  const now = new Date()
  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  )
}
