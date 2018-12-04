import User from "./user";

describe("[Models] User", () => {
  let user;
  beforeEach(() => {
    user = new User({ name: "Joe Doe", level: 1, score: 0, slackId: "123456" });
  });

  describe("validations", () => {
    it("should be valid with valid attributes", () => {
      expect(user.validate).toBeTruthy();
    });

    it("should be invalid if name is empty", () => {
      user.name = null;
      user.validate(err => {
        expect(err.errors.name).toBeTruthy();
      });
    });

    it("should be invalid if score is empty", () => {
      user.score = null;
      user.validate(err => {
        expect(err.errors.score).toBeTruthy();
      });
    });
    it("should be invalid if slackId is empty", () => {
      user.slackId = null;
      user.validate(err => {
        expect(err.errors.slackId).toBeTruthy();
      });
    });
  });
});
