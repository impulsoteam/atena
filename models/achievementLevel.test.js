import AchievementLevel from "./achievementLevel";

describe("[Models] AchievementLevel", () => {
  let achievement;
  beforeEach(() => {
    let record = {
      name: "Bronze",
      range: "II",
      level: 2,
      earnedDate: Date.now()
    };

    let ranges = [
      {
        name: "I",
        value: 1,
        earnedDate: null
      },
      {
        name: "II",
        value: 2,
        earnedDate: null
      }
    ];

    let ratings = [
      {
        name: "Bronze",
        xp: 3,
        ranges: ranges
      },
      {
        name: "Prata",
        xp: 5,
        ranges: ranges
      }
    ];

    achievement = new AchievementLevel({
      user: "F265CEB",
      record: record,
      ratings: ratings
    });
  });

  describe("validations", () => {
    it("should be valid with valid attributes", () => {
      expect(achievement.validate).toBeTruthy();
    });

    it("should be invalid if user is empty", () => {
      achievement.user = null;
      achievement.validate(err => {
        expect(err.errors.user).toBeTruthy();
      });
    });
  });
});
