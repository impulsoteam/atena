import axios from 'axios'
import queryString from 'querystring'
import userController from './user'
import { renderScreen } from '../utils/ssr'

const link_auth = `${
  process.env.GITHUB_OAUTH_URL
}authorize?scope=user:email&client_id=${process.env.GITHUB_CLIENT_ID}`

const accessToken = async code => {
  const url = `${process.env.GITHUB_OAUTH_URL}access_token`
  let res = await axios.post(url, {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code: code,
    accept: 'json'
  })
  return await queryString.parse(res.data)
}

const info = async (access_token, user) => {
  await axios
    .get(`${process.env.GITHUB_API_URL}user`, {
      params: {
        access_token: access_token
      }
    })
    .then(res_token => {
      const githubId = res_token.data.id
      if (!user.githubId) {
        user.githubId = githubId
        user.save()
      }
    })
    .catch(e => {
      console.log('Error: ', e)
    })
}

const callback = async (req, res) => {
  let response
  let user
  const code = req.query.code
  const rocketId = req.query.state
  try {
    user = await userController.findBy({ rocketId: rocketId })
  } catch (e) {
    /* instanbul ignore next */
  }
  let data = await accessToken(code)
  if (data.access_token) {
    response = `Olá novamente, nobre Impulser! Sua dedicação foi posta a prova e você passou com honrarias!<br><br>
          A partir de agora você pode desempenhar trabalhos junto aos *nossos* projetos open-source!<br><br>
          Ainda está em dúvida de como funcionam?! Não tem problema, dá uma olhadinha aqui neste papiro: <a href="${
            process.env.ATENA_SOURCE_URL
          }">${process.env.ATENA_SOURCE_URL}</a>`
    await info(data.access_token, user)
  } else if (data.error) {
    response = `Ops! parece que você entrou na caverna errada. Que falta faz um GPS, não é? Siga esse caminho e não vai errar: <a href="${link_auth}&state=${rocketId}">${link_auth}&state=${rocketId}</a> para tentar novamente.`
  } else {
    response =
      'Não conseguimos localizar seu e-mail público ou privado na API do GITHUB, Seu esse recurso sua armadura de cavaleiro não está pronta para ganhar bonificações na contribuição do projeto Atena!'
  }

  const inititalData = {
    title: 'Batalha do Open Source | Impulso Network',
    response
  }

  renderScreen(req, res, 'Github', inititalData)
}

export default {
  callback
}
