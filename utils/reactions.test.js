import {
  isPositiveReaction,
  isNegativeReaction,
  isAtenaReaction
} from "./reactions"

describe("Test reactions", () => {
  const positiveReaction = {
    description: "+1"
  }

  const negativeReaction = {
    description: "-1"
  }

  const atenaReaction = {
    description: "atena"
  }

  const noValidReaction = {
    description: "test"
  }

  it("should not undefined", () => {
    expect(isPositiveReaction).not.toBeUndefined()
    expect(isNegativeReaction).not.toBeUndefined()
    expect(isAtenaReaction).not.toBeUndefined()
  })

  describe("Test isPositiveReaction", () => {
    it("should return true to description +1", () => {
      expect(isPositiveReaction(positiveReaction)).toBeTruthy()
    })

    it("should return false to description -1", () => {
      expect(isPositiveReaction(negativeReaction)).toBeFalsy()
    })

    it("should return false to description atena", () => {
      expect(isPositiveReaction(atenaReaction)).toBeFalsy()
    })

    it("should return false to description test", () => {
      expect(isPositiveReaction(noValidReaction)).toBeFalsy()
    })
  })

  describe("Test isNegativeReaction", () => {
    it("should return true to description -1", () => {
      expect(isNegativeReaction(negativeReaction)).toBeTruthy()
    })

    it("should return false to description +1", () => {
      expect(isNegativeReaction(positiveReaction)).toBeFalsy()
    })

    it("should return false to description atena", () => {
      expect(isNegativeReaction(atenaReaction)).toBeFalsy()
    })

    it("should return false to description test", () => {
      expect(isNegativeReaction(noValidReaction)).toBeFalsy()
    })
  })

  describe("Test isAtenaReaction", () => {
    it("should return true to description atena", () => {
      expect(isAtenaReaction(atenaReaction)).toBeTruthy()
    })

    it("should return false to description -1", () => {
      expect(isAtenaReaction(negativeReaction)).toBeFalsy()
    })

    it("should return false to description +1", () => {
      expect(isAtenaReaction(positiveReaction)).toBeFalsy()
    })

    it("should return false to description test", () => {
      expect(isAtenaReaction(noValidReaction)).toBeFalsy()
    })
  })
})
