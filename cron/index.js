import cronRanking from './ranking'
import cronWorkers from './workers'
import cronCheckPoints from './checkpoints'

export default () => {
  cronRanking()
  cronWorkers()
  cronCheckPoints()
}
