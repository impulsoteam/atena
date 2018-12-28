import request from "supertest";
import mongoose from "mongoose";
import axios from "axios";
import sinon from "sinon";
import factory from "factory-girl";
import interactionController from "../controllers/interaction";
import User from "../models/user";
import app from "../index";
require("sinon-mongoose");

describe("[Controllers] GitHub Integration", () => {
  let MOCK_SLASH = {
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
  };
  let UserModel;
  beforeEach(() => {
    UserModel = mongoose.model("User");
  });
  afterEach(() => {
    UserModel.findOne.restore();
  });

  describe("## Routes", () => {
    let user = {
      name: "Seya",
      level: 1,
      score: 0,
      slackId: "ABCDEFG",
      avatar: ""
    };

    let userGithub = {
      name: "Seya",
      level: 1,
      score: 0,
      slackId: "ABCDEFG",
      avatar: "",
      githubId: 12345
    };
    let userWithoutName = {
      level: 1,
      score: 0,
      slackId: "ABCDEFG",
      avatar: ""
    };
    factory.define("User", User, user);
    factory.define("UserGithub", User, userGithub);
    factory.define("UserWithoutName", User, userWithoutName);

    describe("### Slash Github Slack", () => {
      it("should return successfully when user without name", done => {
        factory.build("UserWithoutName", userWithoutName).then(userDocument => {
          user = userDocument;
          let mock = sinon
            .mock(UserModel)
            .expects("findOne")
            .chain("exec")
            .resolves(user);
          let stub = sinon.stub(interactionController, "save").returns(true);

          request(app)
            .post("/integrations/github")
            .send(MOCK_SLASH)
            .then(res => {
              expect(res.text).toBe("");
              expect(res.statusCode).toBe(200);
              done();
              mock.restore();
              stub.restore();
            });
        });
      });

      it("should return successfully when user not yet make points on game", done => {
        factory.build("User", user).then(userDocument => {
          user = userDocument;
          let mock = sinon
            .mock(UserModel)
            .expects("findOne")
            .chain("exec")
            .resolves(user);
          request(app)
            .post("/integrations/github")
            .send(MOCK_SLASH)
            .then(res => {
              expect(res.text).toContain(
                "Olá! Parece que você ainda não pertence as nossas fileiras, Impulser! Mas você não viria tão longe se não quisesse participar dos trabalhos com open-source, certo?!"
              );
              expect(res.statusCode).toBe(200);
              done();
              mock.restore();
            });
        });
      });

      it("should return successfully when user has github id", done => {
        factory.build("UserGithub", userGithub).then(userDocument => {
          user = userDocument;
          sinon
            .mock(UserModel)
            .expects("findOne")
            .chain("exec")
            .resolves(user);
          request(app)
            .post("/integrations/github")
            .send(MOCK_SLASH)
            .then(res => {
              expect(res.text).toEqual(
                `Olá! Leal, ${
                  user.name
                }, você já pode participar dos meus trabalhos open-source! Go coding!`
              );
              expect(res.statusCode).toBe(200);
              done();
            });
        });
      });
    });

    describe("### Github Callback", () => {
      it("should return an sucessfully callback error on access github api", done => {
        factory.build("UserGithub", userGithub).then(userDocument => {
          user = userDocument;
          const url = `/integrations/github/callback?code=123456&state=${
            user.slackId
          }`;
          const mock = sinon
            .mock(UserModel)
            .expects("findOne")
            .chain("exec")
            .resolves(user);
          const axiosStub = sinon
            .mock(axios)
            .expects("post")
            .throws();
          request(app)
            .get(url)
            .send(MOCK_SLASH)
            .then(res => {
              expect(res.text).toContain(
                `Ops! parece que você entrou na caverna errada. Que falta faz um GPS, não é? Siga esse caminho e não vai errar`
              );
              expect(res.statusCode).toBe(200);
              mock.restore();
              axiosStub.restore();
              done();
            });
          axios.post.restore();
        });
      });

      // `Não conseguimos localizar seu e-mail público ou privado na API do GITHUB, Seu esse recurso sua armadura de cavaleiro não está pronta para ganhar bonificações na contribuição do projeto Atena!`

      it("should return an successfully callback", done => {
        factory.build("User", user).then(userDocument => {
          user = userDocument;
          const url = `/integrations/github/callback?code=9123456&state=${
            user.slackId
          }`;
          const mock = sinon
            .mock(UserModel)
            .expects("findOne")
            .chain("exec")
            .resolves(user);
          const axiosStub = sinon
            .mock(axios)
            .expects("post")
            .resolves({ data: "access_token=12345" });
          const axiosStubGet = sinon
            .mock(axios)
            .expects("get")
            .resolves({ data: { id: 123 } });
          request(app)
            .get(url)
            .send(MOCK_SLASH)
            .then(res => {
              expect(res.text).toContain(
                `Olá novamente, nobre Impulser! Sua dedicação foi posta a prova e você passou com honrarias!`
              );
              expect(res.statusCode).toBe(200);
              mock.restore();
              axiosStub.restore();
              axiosStubGet.restore();
              done();
            });
        });
      });
    });
  });
});
