import Achievement from "./achievement";

describe("[Models] Achievement", () => {
  let achievement;
  beforeEach(() => {
    let ranges = [
      {
        name: "I",
        value: 5,
        earnedDate: null
      },
      {
        name: "II",
        value: 10,
        earnedDate: null
      }
    ];

    let ratings = [
      {
        name: "Bronze",
        xp: 10,
        ranges: ranges
      },
      {
        name: "Bronze",
        xp: 10,
        ranges: ranges
      }
    ];

    achievement = new Achievement({
      name: "Network | Respostas Recebidas",
      kind: "network.reply.received",
      user: "F265CEB",
      total: 0,
      ratings: ratings
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

    it("should be invalid if kind is empty", () => {
      achievement.kind = null;
      achievement.validate(err => {
        expect(err.errors.kind).toBeTruthy();
      });
    });

    it("should be invalid if user is empty", () => {
      achievement.user = null;
      achievement.validate(err => {
        expect(err.errors.user).toBeTruthy();
      });
    });

    it("should be invalid if total is string", () => {
      achievement.total = "string";
      achievement.validate(err => {
        expect(err.errors.total).toBeTruthy();
      });
    });
  });
});
