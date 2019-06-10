export const _throw = message => {
  throw new Error(String(message))
}

const date = new Date()
export const _today = {
  start: date.setHours(0, 0, 0, 0),
  end: date.setHours(23, 59, 59, 999)
}
