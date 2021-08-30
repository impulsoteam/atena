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

export const formatUser = data => {
  const {
    uuid,
    status,
    fullname,
    email,
    linkedin,
    google,
    github,
    photo_url,
    referrer,
    anonymized_at
  } = data

  const user = {
    uuid,
    status,
    name: fullname,
    email,
    avatar: photo_url,
    linkedin: { id: linkedin.uid },
    github,
    google: { id: google.uid },
    anonymizedAt: anonymized_at,
    referrer: referrer
      ? {
          type: referrer.type,
          identification: referrer.uuid
        }
      : null
  }

  removeEmptyValues(user)

  return user
}

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
