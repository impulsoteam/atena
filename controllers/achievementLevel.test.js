import controller from "./achievementLevel";
import model from "../models/achievementLevel";
import * as utils from "../utils/achievements";
import * as utilsLevel from "../utils/achievementsLevel";
import { achievementLevel } from "../mocks/achievements/level";
import { user } from "../mocks/user";

jest.mock("@rocket.chat/sdk");

describe("Achievement Level Controller", () => {
  afterEach(() => jest.restoreAllMocks());
  describe("Find All", () => {
    it("should return all achievements", done => {
      const mockAchievements = [achievementLevel, achievementLevel];
      const exec = jest.fn(() => Promise.resolve(mockAchievements));
      const populate = jest.fn(() => {
        return {
          exec
        };
      });
      const spy = jest.spyOn(model, "find").mockImplementationOnce(() => {
        return {
          populate
        };
      });

      controller.findAll().then(res => {
        expect(spy).toHaveBeenCalled();
        expect(Array.isArray(res)).toBeTruthy();
        expect(res).toEqual(mockAchievements);
        done();
      });
    });
  });

  describe("Find By User", () => {
    it("should return all achievements for an user", done => {
      const achievementLevelWithoutUser = JSON.parse(
        JSON.stringify(achievementLevel)
      );
      delete achievementLevelWithoutUser.user;
      const exec = jest.fn(() => Promise.resolve(achievementLevelWithoutUser));
      const spy = jest.spyOn(model, "findOne").mockImplementationOnce(() => {
        return {
          exec
        };
      });

      controller.findByUser(user._id).then(res => {
        expect(spy).toHaveBeenCalled();
        expect(typeof res).toBe("object");
        expect(res).toEqual(achievementLevelWithoutUser);
        done();
      });
    });
  });

  describe("Save", () => {
    it("should return undefined for not supplying userId", done => {
      controller.save(null, null, null).then(res => {
        expect(typeof res).toBe("undefined");
        done();
      });
    });

    it("should return a new achievement create", done => {
      controller.generateNewAchievement = jest
        .fn()
        .mockImplementationOnce(() => Promise.resolve(achievementLevel));

      utils.getLevelRecord = jest
        .fn()
        .mockImplementationOnce(() => achievementLevel.record);

      achievementLevel.save = jest
        .fn()
        .mockImplementationOnce(() => Promise.resolve(achievementLevel));

      controller.createAchievement(user._id, 2).then(res => {
        expect(controller.generateNewAchievement).toHaveBeenCalled();
        expect(utils.getLevelRecord).toHaveBeenCalled();
        expect(achievementLevel.save).toHaveBeenCalled();
        expect(res).toBe(achievementLevel);
        done();
      });
    });

    it("should return a new achievement on update", done => {
      utilsLevel.setRangesEarnedDates = jest
        .fn()
        .mockImplementationOnce(() => achievementLevel);

      utils.getLevelRecord = jest
        .fn()
        .mockImplementationOnce(() => achievementLevel.record);

      achievementLevel.save = jest
        .fn()
        .mockImplementationOnce(() => Promise.resolve(achievementLevel));

      controller.updateAchievement(achievementLevel, 3).then(res => {
        expect(utilsLevel.setRangesEarnedDates).toHaveBeenCalled();
        expect(utils.getLevelRecord).toHaveBeenCalled();
        expect(achievementLevel.save).toHaveBeenCalled();
        expect(res).toBe(achievementLevel);
        done();
      });
    });

    it("should return a new achievement on save (create)", done => {
      const exec = jest.fn(() => Promise.resolve(undefined));
      const spy = jest.spyOn(model, "findOne").mockImplementationOnce(() => {
        return {
          exec
        };
      });

      controller.createAchievement = jest
        .fn()
        .mockImplementationOnce(() => Promise.resolve(achievementLevel));

      controller.save(user._id, 1, 2).then(res => {
        expect(spy).toHaveBeenCalled();
        expect(controller.createAchievement).toHaveBeenCalled();
        expect(res).toBe(achievementLevel);
        done();
      });
    });

    it("should return a achievement on save (update)", done => {
      const exec = jest.fn(() => Promise.resolve(achievementLevel));
      const spy = jest.spyOn(model, "findOne").mockImplementationOnce(() => {
        return {
          exec
        };
      });

      controller.updateAchievement = jest
        .fn()
        .mockImplementationOnce(() => Promise.resolve(achievementLevel));

      controller.save(user._id, 1, 2).then(res => {
        expect(spy).toHaveBeenCalled();
        expect(controller.updateAchievement).toHaveBeenCalled();
        expect(res).toBe(achievementLevel);
        done();
      });
    });
  });
});
