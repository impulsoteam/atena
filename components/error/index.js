const _throw = (file, method, error) => {
  const text = error.message || error
  console.log(`[${file.toUpperCase()}] Error on ${method}: `, text)
}

export default {
  _throw
}
