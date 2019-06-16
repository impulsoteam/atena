import dal from './rankingsDAL'

const getMonthFromMessage = message => {
  let month = new Date(Date.now()).getMonth() + 1
  const monthFromMessage = message.msg.replace(/[^0-9]+/g, '')
  if (
    monthFromMessage.length &&
    monthFromMessage > 0 &&
    monthFromMessage < 13
  ) {
    month = monthFromMessage
  }

  return month
}

const getRankingByMonth = async month => {
  if (!(await isValidMonth(month)))
    return { error: 'Digite um mês válido Ex: /ranking 1' }

  const today = new Date(Date.now())
  let query = new Date(today.getFullYear(), month - 1)

  const ranking = await dal.findOne({
    date: {
      $gte: query
    }
  })

  if (!ranking) {
    const monthName = getMonthName(month - 1)
    return {
      error: `Ranking do mês de ${monthName} não foi gerado ou encontrado`
    }
  }

  return ranking
}

const isValidMonth = async month => {
  const re = /(^0?[1-9]$)|(^1[0-2]$)/
  return re.test(month)
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
  getMonthFromMessage,
  getRankingByMonth,
  getMonthName
}
