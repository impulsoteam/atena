import express from "express"
import bodyParser from "body-parser"
import axios from "axios"
import userController from "../controllers/user"
import interactionController from "../controllers/interaction"
import disqusController from "../controllers/disqus"
import querystring from "querystring"
import { getStyleLog } from "../utils"
// var querystring = require("querystring");

const router = express.Router()

const link_auth = `https://disqus.com/api/oauth/2.0/authorize/?client_id=${
  process.env.DISQUS_PUBLIC_KEY
}&scope=email&response_type=code&redirect_uri=${
  process.env.DISQUS_CALLBACK_URL
}`

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

export const getUser = async user_id => {
  let user = null
  try {
    user = await userController.find(user_id)
  } catch (e) {
    /* instanbul ignore next */
  }
  return user
}

router.post("/events", async (req, res) => {
  let data = req.body
  let user = {}
  data.type = "comment"
  try {
    user = await userController.findBy({ disqusUsername: data.disqusUsername })
  } catch (e) {
    /* instabul ignore next */
  }

  data.user = user.slackId
  /* istanbul ignore else */
  if (user) {
    interactionController.save(data)
  } else {
    // bot send message to user
    console.log(getStyleLog("yellow"), `\n-- user not yet in the game`)
  }
  res.json(req.body)
})

router.get("/callback", async (req, res) => {
  const code = req.query.code
  let user = {}
  let response
  const slackId = req.query.state
  user = await getUser(slackId)
  const url = `https://disqus.com/api/oauth/2.0/access_token/`
  response = `Olá novamente, nobre Impulser! Sua dedicação foi posta a prova e você passou com honrarias!<br><br>
          A partir de agora você pode desempenhar trabalhos junto ao *nosso* blog!<br><br>
          Ainda está em dúvida de como funcionam?! Não tem problema, dá uma olhadinha aqui neste papiro: <a href="https://blog.impulso.network/">https://blog.impulso.network</a>`
  if (!user.disqusUsername) {
    let disqusUsername
    await axios
      .post(
        url,
        querystring.stringify({
          grant_type: "authorization_code",
          client_id: process.env.DISQUS_PUBLIC_KEY,
          client_secret: process.env.DISQUS_SECRET_KEY,
          redirect_uri: process.env.DISQUS_CALLBACK_URL,
          code: code
        })
      )
      .then(res => {
        disqusUsername = res.data.username
      })
    /* istanbul ignore else */
    if (disqusUsername) disqusController.updateUserData(slackId, disqusUsername)
  }

  res.render("disqus", {
    title: "Batalha dos comentários | Impulso Network",
    response
  })
})

router.use("/", async (req, res) => {
  let user = {}
  user = await getUser(req.body.user_id)
  if (!user) {
    const data = {
      channel: req.body.channel_id,
      text: "first on disqus integration +1",
      ts: null,
      user: req.body.user_id
    }
    await interactionController.save(data)
    user = await getUser(req.body.user_id)
  }

  let string = `Olá! Parece que você ainda não pertence as nossas fileiras, Impulser! Mas você não viria tão longe se não quisesse participar da discussão, certo?!
Portanto, tens o que é preciso para estar entre nós, ${user &&
    user.name}! Mas para participar dos trabalhos com open-source, preciso que vá até o seguinte local: ${link_auth}&state=${user &&
    user.slackId}. Uma vez que conclua essa missão voltaremos a conversar!`

  if (user && user.disqusUsername) {
    string = `Olá! Leal, ${
      user.name
    }, você já pode participar fazendo comentários no nosso blog!`
  }

  res.send(string)
})

export default router
