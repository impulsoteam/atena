import axios from "axios"
import githubController from "./github"
import { responseOpensourceSlash } from "../mocks/rocket"
import { newIssue } from "../mocks/github"
import { renderScreen } from "../utils/ssr"
import user from "./user"
import interaction from "./interaction"

jest.mock("./interaction")
jest.mock("../rocket/api", () => jest.fn())
jest.mock("../rocket/bot", () => jest.fn())
jest.mock("./user")
jest.mock("../utils/ssr")
jest.mock("axios")

const mockResponse = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

const mockRequest = body => ({
  body
})

const link_auth = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${
  process.env.GITHUB_CLIENT_ID
}`

describe("Github Controller", () => {
  describe("Index", () => {
    const req = mockRequest(responseOpensourceSlash)
    const res = mockResponse()
    const name = req.body.name
    const rocketId = req.body.id
    it("should return text the user is not on the gamification", async () => {
      const text = `Olá! Parece que você ainda não pertence as nossas fileiras, Impulser! Mas você não viria tão longe se não quisesse participar dos trabalhos com open-source, certo?!
Portanto, tens o que é preciso para estar entre nós, ${name}! Mas para participar dos trabalhos com open-source, preciso que vá até o seguinte local: ${link_auth}&state=${rocketId}. Uma vez que conclua essa missão voltaremos a conversar!`
      user.findBy.mockRejectedValueOnce(new Error("Async error"))
      user.save.mockResolvedValue({
        name: "Ikki de Fênix",
        rocketId: rocketId
      })
      await githubController.index(req, res)
      expect(res.json).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({ text: text })
    })

    it("should return text the user is on the gamification", async () => {
      user.findBy.mockResolvedValue({
        name: "Ikki de Fênix",
        rocketId: rocketId,
        githubId: "123456"
      })
      const text = `Olá! Leal, ${name}, você já pode participar dos meus trabalhos open-source! Go coding!`
      await githubController.index(req, res)
      expect(res.json).toHaveBeenCalledWith({ text: text })
    })
  })

  describe("Callback", () => {
    const rocketId = responseOpensourceSlash.id
    const req = {
      query: { code: "code", state: rocketId },
      body: {}
    }
    const res = mockResponse()
    const title = "Batalha do Open Source | Impulso Network"
    beforeEach(() => {
      user.findBy.mockResolvedValue({
        name: "Ikki de Fênix",
        rocketId: rocketId,
        githubId: "123456"
      })
    })
    it("should return successfully", async () => {
      axios.post.mockResolvedValue({
        data: "access_token=token&scope=user%3Aemail&token_type=bearer"
      })
      axios.get.mockResolvedValue({ data: { id: "123456" } })
      const text = `Olá novamente, nobre Impulser! Sua dedicação foi posta a prova e você passou com honrarias!<br><br>
          A partir de agora você pode desempenhar trabalhos junto aos *nossos* projetos open-source!<br><br>
          Ainda está em dúvida de como funcionam?! Não tem problema, dá uma olhadinha aqui neste papiro: <a href="${
            process.env.ATENA_SOURCE_URL
          }">${process.env.ATENA_SOURCE_URL}</a>`

      const initialData = { title: title, response: text }
      await githubController.callback(req, res)
      expect(renderScreen).toHaveBeenCalled()
      expect(renderScreen).toHaveBeenCalledWith(req, res, "Github", initialData)
    })
    it("should return try again", async () => {
      axios.post.mockResolvedValue({
        data: "error=bad_verification_code"
      })
      const text = `Ops! parece que você entrou na caverna errada. Que falta faz um GPS, não é? Siga esse caminho e não vai errar: <a href="${link_auth}&state=${rocketId}">${link_auth}&state=${rocketId}</a> para tentar novamente.`
      await githubController.callback(req, res)
      const initialData = { title: title, response: text }
      expect(renderScreen).toHaveBeenCalled()
      expect(renderScreen).toHaveBeenCalledWith(req, res, "Github", initialData)
    })
    it("should return error", async () => {
      axios.post.mockResolvedValue({})
      const text =
        "Não conseguimos localizar seu e-mail público ou privado na API do GITHUB, Seu esse recurso sua armadura de cavaleiro não está pronta para ganhar bonificações na contribuição do projeto Atena!"
      const initialData = { title: title, response: text }
      await githubController.callback(req, res)
      expect(renderScreen).toHaveBeenCalled()
      expect(renderScreen).toHaveBeenCalledWith(req, res, "Github", initialData)
    })
  })

  describe("Events", () => {
    it("should return successfully", async () => {
      const req = mockRequest(newIssue)
      const res = mockResponse()
      interaction.save.mockResolvedValue()
      await githubController.events(req, res)
      expect(res.json).toHaveBeenCalled()
    })
  })
})
