import moment from 'moment'

export default class RankingUtils {
  getDate({ year, month }) {
    if (!year || !month)
      return {
        date: moment().toDate(),
        monthName: moment()
          .locale('pt')
          .format('MMMM')
      }

    const fullDate = moment(`${year}/${month}`, 'YYYY/MM').toDate()

    return {
      date: fullDate,
      monthName: moment(fullDate)
        .locale('pt')
        .format('MMMM')
    }
  }
}
