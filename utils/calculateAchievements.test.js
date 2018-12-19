import { calculateAchievements as calc } from "./calculateAchievements";

describe("Test calculateAchievements", () => {
  it("should not undefined", () => {
    expect(calc).not.toBeUndefined();
  });

  describe("Test find reward with category 'Network' and action 'Reaction'", () => {
    it("should return object with 1 more positive when positive reaction was added", () => {});
  });
});
