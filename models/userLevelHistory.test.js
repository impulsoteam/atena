import mongoose from "mongoose";

import UserLevelHistory from "./userLevelHistory";

describe("[Models] UserLvelHistory", () => {
  let userLevelHistory;
  beforeEach(() => {
    userLevelHistory = new UserLevelHistory({
      user: mongoose.Types.ObjectId(),
      kind: "added",
      level: 1,
      earnedDate: Date.now
    });
  });

  describe("validations", () => {
    it("should be valid with valid attributes", () => {
      expect(userLevelHistory.validate).toBeTruthy();
    });

    it("should be invalid if user is empty", () => {
      userLevelHistory.name = null;
      userLevelHistory.validate(err => {
        expect(err.errors.name).toBeTruthy();
      });
    });

    it("should be invalid if level is empty", () => {
      userLevelHistory.level = null;
      userLevelHistory.validate(err => {
        expect(err.errors.level).toBeTruthy();
      });
    });

    it("should be invalid if kind is empty", () => {
      userLevelHistory.kind = null;
      userLevelHistory.validate(err => {
        expect(err.errors.kind).toBeTruthy();
      });
    });

    it("should be invalid if kind is different then 'added' or 'subtracted'", () => {
      userLevelHistory.kind = "teste123";
      userLevelHistory.validate(err => {
        expect(err.errors.kind).toBeTruthy();
      });
    });

    it("should be invalid if earnedDate is empty", () => {
      userLevelHistory.earnedDate = null;
      userLevelHistory.validate(err => {
        expect(err.errors.earnedDate).toBeTruthy();
      });
    });
  });
});
