import { driver } from "@rocket.chat/sdk";
import controller from "./ranking";
import { message } from "../mocks/rocket";

jest.mock("@rocket.chat/sdk");

describe("Ranking Controller", () => {
  describe("Command Index", () => {
    it("should return ranking to user", done => {
      controller.generalIndex = jest.fn().mockReturnValue({
        text: "Ranking do mês de Março não gerado ou encontrado"
      });
      driver.sendDirectToUser = jest.fn().mockReturnValue("mock value");
      const rankingMessage = {
        ...message,
        msg: "!ranking 1"
      };
      const mockCustomResponse = {
        msg: "Ranking do mês de Março não gerado ou encontrado",
        attachments: undefined
      };
      controller.commandIndex(rankingMessage).then(() => {
        expect(controller.generalIndex).toHaveBeenCalledTimes(1);
        expect(driver.sendDirectToUser).toHaveBeenCalledTimes(1);
        expect(jest.isMockFunction(driver.sendDirectToUser)).toBeTruthy();
        // await driver.sendDirectToUser(customResponse, message.u.username);
        expect(driver.sendDirectToUser).toHaveBeenCalledWith(
          mockCustomResponse,
          rankingMessage.u.username
        );
      });
      done();
    });
  });
});
