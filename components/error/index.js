const send = (file, method, error) => {
  console.log(`[${file.toUpperCase()}] Error on ${method}: `, error)
}

export default {
  send
}
