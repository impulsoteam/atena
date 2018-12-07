// import request from "supertest-as-promised";
import request from "supertest";
import crypto from "crypto";
import qs from "qs";
// import userController from "./user";
// import app from "../routes/index";
import app from "../index";
// import { clearDataBase } from "../helpers/ClearDB";

describe("[Controllers] User", () => {
  // afterAll(() => setTimeout(() => process.exit(), 1000));
  describe("## Routes", () => {
    let MOCK_BODY = {
      token: "4l0c3fKgSeeDGqniR30aQf1O",
      team_id: "TCXCXJC5S",
      team_domain: "impulso-sandbox",
      channel_id: "CCWSMJZ6U",
      channel_name: "general",
      user_id: "UCZCQH7CG",
      user_name: "goldblade",
      command: "/meuspontos-goldblade",
      text: "",
      response_url:
        "https://hooks.slack.com/commands/TCXCXJC5S/495910309186/CqLIVC5j2Q8f6zVYwkbjRQ14",
      trigger_id: "495742047108.439439624196.324159fbe295cb6754006b3afb523a1c"
    };

    let time;
    let slackSignature;

    beforeEach(() => {
      time = Math.floor(new Date().getTime() / 1000);
      const requestBody = qs.stringify(MOCK_BODY, { format: "RFC1738" });
      const sigBaseString = `v0:${time}:${requestBody}`;
      const slackSecret = process.env.SLACK_SIGNIN_EVENTS;
      const hmac = crypto
        .createHmac("sha256", slackSecret)
        .update(sigBaseString, "utf8")
        .digest("hex");
      slackSignature = `v0=${hmac}`;
    });
    describe("### Bot", () => {
      describe("#### POST Score", () => {
        it("should return the message user has not scored points yet", done => {
          request(app)
            .post("/bot/commands/score")
            .set("x-slack-request-timestamp", time)
            .set("x-slack-signature", slackSignature)
            .set("Content-Type", "application/x-www-form-urlencoded")
            .send(MOCK_BODY)
            .then(res => {
              expect(res.body.text).toEqual(
                "Ops! Você ainda não tem pontos registrados."
              );
              expect(res.statusCode).toBe(200);
              done();
            });
        });
      });

      describe("#### POST Ranking", () => {
        it("should return the ranking successfully", done => {
          request(app)
            .post("/bot/commands/ranking")
            .set("x-slack-request-timestamp", time)
            .set("x-slack-signature", slackSignature)
            .set("Content-Type", "application/x-www-form-urlencoded")
            .send(MOCK_BODY)
            .then(res => {
              expect(res.statusCode).toBe(200);
              done();
            });
        });

        describe("### POST CoreTeamRanking", () => {
          it("alguma coisa", done => {
            request(app)
              .post("/bot/commands/coreteamranking")
              .set("x-slack-request-timestamp", time)
              .set("x-slack-signature", slackSignature)
              .set("Content-Type", "application/x-www-form-urlencoded")
              .send(MOCK_BODY)
              .then(res => {
                expect(res.statusCode).toBe(200);
                done();
              });
          });
        });
      });
    });
  });
});
