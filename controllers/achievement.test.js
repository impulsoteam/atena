import achievement from "./achievement";
jest.mock("../rocket/api");
jest.mock("../rocket/bot", () => jest.fn());
jest.mock("../utils");
jest.mock("../utils/achievements", () => ({
  getInteractionType: jest.fn().mockReturnValue("message")
}));
jest.mock("../utils/reactions");
jest.mock("./user");
jest.mock("./achievementTemporary");

describe("Achievement Controller", () => {
  describe("Save", () => {
    it("return an user achievement", async done => {
      const mockInteraction = {
        parentUser: null,
        user: "Ikki"
      };
      const mockUser = {};
      const mockType = "message";
      achievement.saveUserAchievement = jest.fn();
      achievement.save(mockInteraction, mockUser).then(() => {
        expect(achievement.saveUserAchievement).toHaveBeenCalledWith(
          mockType,
          mockInteraction,
          mockUser
        );
        expect(achievement.saveUserAchievement).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });
});
