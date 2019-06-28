import screens from '../screens'

const error = async (req, res) => {
  const initialData = {
    title: 'Erro durante autenticação'
  }
  screens.render(req, res, 'Error', initialData)
}

export default {
  error
}
