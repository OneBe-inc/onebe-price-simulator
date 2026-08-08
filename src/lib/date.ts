const pad = (value: number) => String(value).padStart(2, '0')

export const toLocalDateInput = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

export const addDays = (date: Date, days: number) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const formatJapaneseDate = (dateString: string) => {
  if (!dateString) return '未入力'
  const [year, month, day] = dateString.split('-')
  return `${year}年${Number(month)}月${Number(day)}日`
}
