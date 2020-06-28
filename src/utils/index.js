export const removeEmptyValues = obj => {
  Object.keys(obj).forEach(function (key) {
    if (obj[key] && typeof obj[key] === 'object') removeEmptyValues(obj[key])
    else if (obj[key] === null || obj[key] === undefined || obj[key] === '')
      delete obj[key]
  })
}

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
