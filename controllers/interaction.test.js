// import sinon from "sinon";
import interaction from "./interaction";
import interactionModel from "../models/interaction";

jest.mock("../rocket/api", () => jest.fn());
jest.mock("../rocket/bot", () => jest.fn());
jest.mock("../utils");
jest.mock("./user");
jest.mock("./achievement");
jest.mock("./achievementTemporary");

describe("Interaction Controller", () => {
  // describe("normalize", () => {});
  describe("save", () => {
    beforeEach(() => {
      // sinon.stub(interactionModel.prototype, "save");
    });
    it("should return successfully", done => {
      const mockInteraction = {
        type: "type",
        channel: "channel",
        description: "description",
        user: "123456"
      };
      const mockInstance = interactionModel(mockInteraction);
      mockInstance.save();
      // console.log(mockInstance);
      interaction.todayScore = jest.fn().mockReturnValue("mock value");
      interaction.normalize = jest.fn().mockReturnValue(mockInteraction);
      interactionModel.save = jest.fn().mockReturnValue(mockInstance);
      const data = {};
      interaction.save(data).then(response => {
        expect(jest.isMockFunction(interaction.todayScore)).toBeTruthy();
        expect(jest.isMockFunction(interactionModel.save)).toBeTruthy();
        expect(jest.isMockFunction(interaction.save)).toBeFalsy();
        expect(response).toEqual({});
      });
      done();
      // expect(jest.isMockFunction(interaction.todayScore)).toBeTruthy();
      // expect(jest.isMockFunction(interactionModel.save)).toBeTruthy();
      // expect(jest.isMockFunction(interaction.save)).toBeFalsy();
      // expect(response).toEqual({});
    });
  });
  // describe("find", () => {});
  // describe("todayScore", () => {});
  // describe("remove", () => {});
  // describe("lastMessage", () => {});
  // describe("manualInteractions", () => {});
  // describe("findAll", () => {});
  // describe("findBy", () => {});
  // describe("calculate", () => {});
  // describe("dayScore", () => {});
  // describe("normalizeScore", () => {});
  // describe("aggregateBy", () => {});
  // describe("byDate", () => {});
});
