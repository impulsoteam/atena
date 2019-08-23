const getMonthFromMessage = async message => {
  let month = getCurrentMonth()
  const monthFromMessage = message.msg.replace(/[^0-9]+/g, '')

  if (await isValidMonth(monthFromMessage)) {
    month = monthFromMessage
  }

  return month
}

const getCurrentMonth = () => {
  return new Date(Date.now()).getMonth() + 1
}

const isValidMonth = async month => {
  const isValid = /(^0?[1-9]$)|(^1[0-2]$)/
  return isValid.test(month)
}

const getMonthName = number => {
  const names = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ]

  return names[number]
}

export default {
  getCurrentMonth,
  getMonthFromMessage,
  getMonthName,
  isValidMonth
}
