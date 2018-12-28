import request from "supertest";
import mongoose from "mongoose";
import sinon from "sinon";
import factory from "factory-girl";
import app from "../index";
import User from "../models/user";
require("sinon-mongoose");

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

    factory.define("User", User, user);

    describe("### Slash Github Slack", () => {
      it("should return successfully when user not yet make points on game", done => {
        factory.build("User", user).then(userDocument => {
          user = userDocument;
          let mock = sinon
            .mock(UserModel)
            .expects("findOne")
            .chain("exec")
            .resolves(null);

          request(app)
            .post("/integrations/disqus")
            .send(MOCK_SLACK_SLASH)
            .then(res => {
              expect(res.text).toContain(
                "Olá! Parece que você ainda não pertence as nossas fileiras, Impulser! Mas você não viria tão longe se não quisesse participar da discussão, certo?!"
              );
              expect(res.statusCode).toBe(200);
              mock.restore();
              done();
            });
        });
      });
    });
  });
});
/*
 *expect(res.text).toContain(
                "Olá! Parece que você ainda não pertence as nossas fileiras, Impulser! Mas você não viria tão longe se não quisesse participar da discussão, certo?!"
              );
              */
