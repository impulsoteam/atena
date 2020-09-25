export const removeEmptyValues = obj => {
  Object.keys(obj).forEach(function (key) {
    if (obj[key] && typeof obj[key] === 'object') {
      if (Object.keys(obj[key]).length) {
        removeEmptyValues(obj[key])
      } else {
        delete obj[key]
      }
    } else if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
      delete obj[key]
    }
  })
}

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
