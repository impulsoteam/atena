import { calculateAchievementsPosition as calc } from "./calculateAchievementsPosition"

describe("Test CalculateAchievementsPosition", () => {
  const achievements = {
    name: "Network | Reações Recebidas",
    kind: "network.reaction.received",
    user: "UEKPNV91C",
    total: 1,
    ratings: []
  }

  const ratings = [
    {
      name: "Bronze",
      xp: 5,
      ranges: [
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
      ]
    },
    {
      name: "Prata",
      xp: 10,
      ranges: [
        {
          name: "I",
          value: 3,
          earnedDate: null
        },
        {
          name: "II",
          value: 4,
          earnedDate: null
        }
      ]
    }
  ]

  it("should not undefined", () => {
    expect(calc).not.toBeUndefined()
  })

  describe("Test achievements positions", () => {
    it("should return an object with first rating.range if was no earnedDate", () => {
      const ratingWithoutEarnedDate = JSON.parse(JSON.stringify(ratings))
      achievements.ratings = ratingWithoutEarnedDate
      const achievementsWithoutEarnedDate = [achievements]

      const rating = achievementsWithoutEarnedDate[0].ratings[0]
      const range = rating.ranges[0]

      const achievementReturn = {
        name: achievements.name,
        total: achievements.total,
        rating: {
          name: `${rating.name} ${range.name}`,
          value: range.value
        }
      }

      expect(calc(achievementsWithoutEarnedDate)).toEqual(
        expect.arrayContaining([achievementReturn])
      )
    })

    it("should return an object with rating.range first earnedDate is null", () => {
      const ratingWithEarnedDate = JSON.parse(JSON.stringify(ratings))
      ratingWithEarnedDate[0].ranges[0].earnedDate = Date.now()
      ratingWithEarnedDate[0].ranges[1].earnedDate = Date.now()
      achievements.ratings = ratingWithEarnedDate
      const achievementsWithEarnedDate = [achievements]

      const rating = achievementsWithEarnedDate[0].ratings[1]
      const range = rating.ranges[0]

      const achievement = {
        name: achievements.name,
        total: achievements.total,
        rating: {
          name: `${rating.name} ${range.name}`,
          value: range.value
        }
      }

      expect(calc(achievementsWithEarnedDate)).toEqual(
        expect.arrayContaining([achievement])
      )
    })

    it("should return an object with last rating.range when all earnedDate filled", () => {
      const ratingWithAllEarnedDate = JSON.parse(JSON.stringify(ratings))
      const ratingsWithAllEarnedDate = ratingWithAllEarnedDate.map(rating => {
        rating.ranges = rating.ranges.map(range => {
          range.earnedDate = Date.now()
          return range
        })

        return rating
      })

      achievements.ratings = ratingsWithAllEarnedDate
      const achievementsWithAllEarnedDate = [achievements]

      const rating = achievementsWithAllEarnedDate[0].ratings[1]
      const range = rating.ranges[1]

      const achievement = {
        name: achievements.name,
        total: achievements.total,
        rating: {
          name: `${rating.name} ${range.name}`,
          value: range.value
        }
      }

      expect(calc(achievementsWithAllEarnedDate)).toEqual(
        expect.arrayContaining([achievement])
      )
    })
  })
})
