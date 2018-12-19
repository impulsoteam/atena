import Achievement from "./Achievement";

describe("[Models] Achievement", () => {
  let achievement;
  beforeEach(() => {
    achievement = new Achievement({
      name: "Bronze",
      category: "Network",
      actions: ["Reaction"],
      xps: 12,
      ratings: [
        {
          name: "I",
          range: 40
        },
        {
          name: "II",
          range: 20
        },
        {
          name: "III",
          range: 10
        }
      ]
    });
  });

  describe("validations", () => {
    it("should be valid with valid attributes", () => {
      expect(achievement.validate).toBeTruthy();
    });
    it("should be invalid if name is empty", () => {
      achievement.name = null;
      achievement.validate(err => {
        expect(err.errors.name).toBeTruthy();
      });
    });
    it("should be invalid if category is empty", () => {
      achievement.category = null;
      achievement.validate(err => {
        expect(err.errors.category).toBeTruthy();
      });
    });
    it("should be invalid if actions is empty", () => {
      achievement.actions = null;
      achievement.validate(err => {
        expect(err.errors.actions).toBeTruthy();
      });
    });
    it("should be invalid if ratings is empty", () => {
      achievement.ratings = null;
      achievement.validate(err => {
        expect(err.errors.ratings).toBeTruthy();
      });
    });
    it("should be invalid if repeated ratings", () => {
      achievement.ratings = [
        {
          name: "I",
          range: 10
        },
        {
          name: "II",
          range: 10
        }
      ];
      achievement.validate(err => {
        expect(err.errors.ratings).toBeTruthy();
      });
    });
    it("should be invalid if xp is empty", () => {
      achievement.xp = null;
      achievement.validate(err => {
        expect(err.errors.xp).toBeTruthy();
      });
    });
  });
});
