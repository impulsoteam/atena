import model from './interaction'

const save = interaction => {
  return model(interaction).save()
}

export default {
  save
}
