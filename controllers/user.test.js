import request from "supertest-as-promised";
// import userController from "./user";
// import app from "../routes/index";
import app from "../index";

describe("[Controllers] User", () => {
  // afterAll(() => setTimeout(() => process.exit(), 1000));
  describe("## Routes", () => {
    describe("### Bot", () => {
      describe("#### POST Score", () => {
        it("should return the ranking successfully", done => {
          request(app)
            .post("/bot/commands/score")
            .then(res => {
              expect(res.statusCode).toBe(200);
              done();
            });
        });
      });
      describe("#### POST Ranking", () => {
        it("should return the ranking successfully 2", done => {
          request(app)
            .post("/bot/commands/ranking")
            .then(res => {
              expect(res.statusCode).toBe(200);
              done();
            });
        });
      });
    });
  });
});
