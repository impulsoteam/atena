import moment from 'moment'

const getDateFromMessage = async message => {
  const year = moment().format('YYYY')
  let month = moment().format('M')
  const monthFromMessage = message.msg.replace(/[^0-9]+/g, '')

  if (await isValidMonth(monthFromMessage)) {
    month = monthFromMessage
  }
  return {
    date: moment(`${year}/${month}`, 'YYYY/MM').toDate(),
    monthName: getMonthName(month)
  }
}

const getDate = async ({ year, month }) => {
  if (!year || !month)
    return {
      date: moment().toDate(),
      monthName: getMonthName(moment().format('M'))
    }

  return {
    date: moment(`${year}/${month}`, 'YYYY/MM').toDate(),
    monthName: getMonthName(month)
  }
}

const isValidMonth = async month => {
  const isValid = /(^0?[1-9]$)|(^1[0-2]$)/
  return isValid.test(month)
}

const getMonthName = number => {
  const names = [
    null,
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
  getDateFromMessage,
  getDate,
  isValidMonth
}
