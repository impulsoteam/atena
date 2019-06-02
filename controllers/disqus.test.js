import request from "supertest"
import axios from "axios"
import mongoose from "mongoose"
import sinon from "sinon"
import factory from "factory-girl"
import app from "../index"
import User from "../models/user"
import disqusController from "../controllers/disqus"
require("sinon-mongoose")

describe("[Controllers] Disqus Integration", () => {
  let MOCK_SLACK_SLASH = {
    token: "4l0c3fKgSeeDGqniR30aQf1O",
    team_id: "TCXCXJC5S",
    team_domain: "impulso-sandbox",
    channel_id: "CCWSMJZ6U",
    channel_name: "general",
    user_id: "ABCDEFG",
    user_name: "yoda",
    command: "/atena-github",
    text: "",
    response_url:
      "https://hooks.slack.com/commands/TCXCXJC5S/506575017716/WQE2yFJMSsl0uEQ7YEFx90KZ",
    trigger_id: "506639243347.439439624196.44ef1b0ed344e5c6555fb42590afaf67"
  }

  describe("## Routes", () => {
    let UserModel
    beforeEach(() => {
      UserModel = mongoose.model("User")
    })

    afterEach(() => {
      UserModel.findOne.restore()
    })

    let user = {
      name: "Seya",
      level: 1,
      score: 0,
      slackId: "ABCDEFG",
      avatar: ""
    }

    let userDisqus = {
      name: "Seya Disqus",
      level: 1,
      score: 0,
      slackId: "ABCDEFG",
      avatar: "",
      disqusUsername: "disqus"
    }

    factory.define("User", User, user)
    factory.define("UserDisqus", User, userDisqus)

    describe("### Slash Github Slack", () => {
      it("should return successfully when user not yet make points on game", done => {
        factory.build("User", user).then(userDocument => {
          user = userDocument
          let mock = sinon
            .mock(UserModel)
            .expects("findOne")
            .chain("exec")
            .resolves(null)

          request(app)
            .post("/integrations/disqus")
            .send(MOCK_SLACK_SLASH)
            .then(res => {
              expect(res.text).toContain(
                "Olá! Parece que você ainda não pertence as nossas fileiras, Impulser! Mas você não viria tão longe se não quisesse participar da discussão, certo?!"
              )
              expect(res.statusCode).toBe(200)
              mock.restore()
              done()
            })
        })
      })

      it("should return successfully", done => {
        factory.build("User", user).then(userDocument => {
          user = userDocument
          let mock = sinon
            .mock(UserModel)
            .expects("findOne")
            .chain("exec")
            .resolves(user)

          request(app)
            .post("/integrations/disqus")
            .send(MOCK_SLACK_SLASH)
            .then(res => {
              expect(res.text).toContain(
                "Olá! Parece que você ainda não pertence as nossas fileiras, Impulser! Mas você não viria tão longe se não quisesse participar da discussão, certo?!"
              )
              expect(res.statusCode).toBe(200)
              mock.restore()
              done()
            })
        })
      })

      it("should return successfully when user has disqus Username", done => {
        factory.build("UserDisqus", userDisqus).then(userDocument => {
          user = userDocument
          let mock = sinon
            .mock(UserModel)
            .expects("findOne")
            .chain("exec")
            .resolves(user)

          request(app)
            .post("/integrations/disqus")
            .send(MOCK_SLACK_SLASH)
            .then(res => {
              expect(res.text).toContain(
                `Olá! Leal, ${
                  user.name
                }, você já pode participar fazendo comentários no nosso blog!`
              )
              expect(res.statusCode).toBe(200)
              mock.restore()
              done()
            })
        })
      })
    })

    describe("### Disqus Callback", () => {
      // https://disqus.com/api/oauth/2.0/access_token/
      it("should return an sucessfully callback when user have disqus username", done => {
        factory.build("UserDisqus", userDisqus).then(userDocument => {
          user = userDocument
          let mock = sinon
            .mock(UserModel)
            .expects("findOne")
            .chain("exec")
            .resolves(user)

          const url = `/integrations/disqus/callback?code=9123456&state=${
            user.slackId
          }`
          request(app)
            .get(url)
            .send(MOCK_SLACK_SLASH)
            .then(res => {
              expect(res.text).toContain(
                `Olá novamente, nobre Impulser! Sua dedicação foi posta a prova e você passou com honrarias`
              )
              expect(res.statusCode).toBe(200)
              mock.restore()
              done()
            })
        })
      })

      it("should return an sucessfully callback when user no has disqus username", done => {
        factory.build("User", user).then(userDocument => {
          user = userDocument
          const url = `/integrations/disqus/callback?code=9123456&state=${
            user.slackId
          }`

          let mock = sinon
            .mock(UserModel)
            .expects("findOne")
            .chain("exec")
            .resolves(user)

          let mockController = sinon
            .mock(disqusController)
            .expects("updateUserData")
            .resolves(null)

          const axiosStub = sinon
            .mock(axios)
            .expects("post")
            .resolves({ data: { username: "disqus" } })

          request(app)
            .get(url)
            .send(MOCK_SLACK_SLASH)
            .then(res => {
              expect(res.text).toContain(
                `Olá novamente, nobre Impulser! Sua dedicação foi posta a prova e você passou com honrarias`
              )
              expect(res.statusCode).toBe(200)
              mock.restore()
              mockController.restore()
              axiosStub.restore()
              done()
            })
        })
      })

      it("should return an comment on disqus", done => {
        factory.build("User", user).then(userDocument => {
          user = userDocument
          const url = `/integrations/disqus/events`
          let mock = sinon
            .mock(UserModel)
            .expects("findOne")
            .chain("exec")
            .resolves(user)

          request(app)
            .post(url)
            .send({ disqusUsername: "disqus", id: 123 })
            .then(res => {
              expect(res.statusCode).toBe(200)
              mock.restore()
              done()
            })
        })
      })
    })
  })
})
