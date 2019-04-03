import rankingController from "./ranking";
import { message } from "../mocks/rocket";

jest.mock("@rocket.chat/sdk");

describe("Ranking Controller", () => {
  describe("Command Index", () => {
    it("should return ranking to user", async done => {
      const rankingMessage = {
        ...message,
        msg: "!ranking 1"
      };
      await rankingController.commandIndex(rankingMessage);
      done();
    });
  });
});
