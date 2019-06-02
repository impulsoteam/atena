import { calculateReactions as calc } from "./calculateReactions"

describe("Test CalculateReactions", () => {
  const positiveReactionAdded = {
    type: "reaction_added",
    description: "+1"
  }
  const positiveReactionRemoved = {
    type: "reaction_removed",
    description: "+1"
  }

  const negativeReactionAdded = {
    type: "reaction_added",
    description: "-1"
  }
  const negativeReactionRemoved = {
    type: "reaction_removed",
    description: "-1"
  }

  const atenaReactionAdded = {
    type: "reaction_added",
    description: "atena"
  }
  const atenaReactionRemoved = {
    type: "reaction_removed",
    description: "atena"
  }

  const noValidReactionAdded = {
    type: "reaction_added",
    description: "test"
  }
  const noValidReactionRemoved = {
    type: "reaction_removed",
    description: "test"
  }

  it("should not undefined", () => {
    expect(calc).not.toBeUndefined()
  })

  describe("Test converting to new reaction's format", () => {
    const oldReactionsFormat = 3

    it("should return an object with new format when receive an old format for no valid reaction added", () => {
      expect(calc(noValidReactionAdded, oldReactionsFormat)).toEqual(
        expect.objectContaining({
          positives: 0,
          negatives: 0,
          others: 3
        })
      )
    })
    it("should return an object with new format when receive an old format for no valid reaction removed", () => {
      expect(calc(noValidReactionRemoved, oldReactionsFormat)).toEqual(
        expect.objectContaining({
          positives: 0,
          negatives: 0,
          others: 3
        })
      )
    })
    it("should return an object with new format when receive an old format for positive reaction added", () => {
      expect(calc(positiveReactionAdded, oldReactionsFormat)).toEqual(
        expect.objectContaining({
          positives: 1,
          negatives: 0,
          others: 3
        })
      )
    })
    it("should return an object with new format when receive an old format for positive reaction removed", () => {
      expect(calc(positiveReactionRemoved, oldReactionsFormat)).toEqual(
        expect.objectContaining({
          positives: 0,
          negatives: 0,
          others: 3
        })
      )
    })
    it("should return an object with new format when receive an old format for negative reaction added", () => {
      expect(calc(negativeReactionAdded, oldReactionsFormat)).toEqual(
        expect.objectContaining({
          positives: 0,
          negatives: 1,
          others: 3
        })
      )
    })
    it("should return an object with new format when receive an old format for negative reaction removed", () => {
      expect(calc(negativeReactionRemoved, oldReactionsFormat)).toEqual(
        expect.objectContaining({
          positives: 0,
          negatives: 0,
          others: 3
        })
      )
    })
    it("should return an object with new format when receive an old format for atena reaction added", () => {
      expect(calc(atenaReactionAdded, oldReactionsFormat)).toEqual(
        expect.objectContaining({
          positives: 0,
          negatives: 0,
          others: 4
        })
      )
    })
    it("should return an object with new format when receive an old format for atena reaction removed", () => {
      expect(calc(atenaReactionRemoved, oldReactionsFormat)).toEqual(
        expect.objectContaining({
          positives: 0,
          negatives: 0,
          others: 2
        })
      )
    })
  })

  describe("Test interaction with positive reaction", () => {
    it("should return object with 1 more positive when positive reaction was added", () => {
      const reactions = {
        positives: 2,
        negatives: 2,
        others: 1
      }
      expect(calc(positiveReactionAdded, reactions)).toEqual(
        expect.objectContaining({
          positives: 3,
          negatives: 2,
          others: 1
        })
      )
    })
    it("should return object with 1 less positive when positive reaction was removed", () => {
      const reactions = {
        positives: 5,
        negatives: 2,
        others: 3
      }
      expect(calc(positiveReactionRemoved, reactions)).toEqual(
        expect.objectContaining({
          positives: 4,
          negatives: 2,
          others: 3
        })
      )
    })
  })

  describe("Test interaction with negative reaction", () => {
    it("should return object with 1 more negative when negative reaction was added", () => {
      const reactions = {
        positives: 2,
        negatives: 2,
        others: 9
      }
      expect(calc(negativeReactionAdded, reactions)).toEqual(
        expect.objectContaining({
          positives: 2,
          negatives: 3,
          others: 9
        })
      )
    })
    it("should return object with 1 less negative when negative reaction was removed", () => {
      const reactions = {
        positives: 5,
        negatives: 2,
        others: 7
      }
      expect(calc(negativeReactionRemoved, reactions)).toEqual(
        expect.objectContaining({
          positives: 5,
          negatives: 1,
          others: 7
        })
      )
    })
  })

  describe("Test interaction with no valid reaction", () => {
    it("should return a same object with when no valid reaction was added", () => {
      const reactions = {
        positives: 2,
        negatives: 4,
        others: 6
      }
      expect(calc(negativeReactionAdded, reactions)).toEqual(
        expect.objectContaining(reactions)
      )
    })
    it("should return a same object with when no valid reaction was removed", () => {
      const reactions = {
        positives: 5,
        negatives: 2,
        others: 6
      }
      expect(calc(negativeReactionRemoved, reactions)).toEqual(
        expect.objectContaining(reactions)
      )
    })
  })

  describe("Test interaction with atena reaction", () => {
    it("should return a same object with when atena reaction was added", () => {
      const reactions = {
        positives: 2,
        negatives: 3,
        others: 4
      }
      expect(calc(atenaReactionAdded, reactions)).toEqual(
        expect.objectContaining({
          positives: 2,
          negatives: 3,
          others: 5
        })
      )
    })
    it("should return a same object with when atena reaction was removed", () => {
      const reactions = {
        positives: 5,
        negatives: 2,
        others: 3
      }
      expect(calc(atenaReactionRemoved, reactions)).toEqual(
        expect.objectContaining({
          positives: 5,
          negatives: 2,
          others: 2
        })
      )
    })
  })
})
