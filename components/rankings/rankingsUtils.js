import moment from 'moment'

const getDateFromMessage = async ({ msg }) => {
  let year = moment().format('YYYY')
  let month = moment().format('M')
  const [, monthFromMessage, yearFromMessage] = msg.trim().split(' ')

  if (await isValidMonth(monthFromMessage)) {
    month = monthFromMessage
  }
  if (await isValidYear(yearFromMessage)) {
    year = yearFromMessage
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

const isValidYear = async year => {
  const isValid = /^20((1[8-9])|([2-9][0-9]))$/
  return isValid.test(year)
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
