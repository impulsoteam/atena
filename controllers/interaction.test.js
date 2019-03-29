import interaction from "./interaction";
import interactionModel from "../models/interaction";
import { saveInteraction, message } from "../mocks/rocket";
import userController from "./user";
import config from "config-yml";
// import mockHistory from "../mocks/rocket/history_impulso_network.json";
// import hours from '../../../../internals/fixtures/hours.json';

// jest.mock("../rocket/api", () => jest.fn());
jest.mock("../rocket/api");
jest.mock("../rocket/bot", () => jest.fn());
jest.mock("../utils");
jest.mock("./user");
jest.mock("./achievement");
jest.mock("./achievementTemporary");
// jest.mock("../models/interaction");

describe("Interaction Controller", () => {
  afterEach(() => jest.restoreAllMocks());
  // describe("normalize", () => {});
  /*
  describe("history", () => {
    describe("attachments", () => {
      it("should returns successfuly interaction with reactions", done => {
        const messages = JSON.stringify(mockHistory);
        console.log("mockHistory ===> ", messages.length);
        interaction.todayScore = jest.fn().mockReturnValue(0);
        let data = messageAttachmentFromHistory;
        data.origin = "rocket";
        interaction.save(data).then(response => {
          expect(response).toEqual({});
        }).catch(() => {
          console.log("error");
        });
        done();
      });
    });
  });
  */

  const mockFullUser = {
    username: "ikki",
    reactions: { positives: 0, negatives: 0, others: 0 },
    level: 0,
    score: 0,
    messages: 0,
    replies: 0,
    isCoreTeam: false,
    teams: ["network"],
    _id: "5c9d08cd4d5cb631a30741e3",
    rocketId: "2BQ3wWnRBh7vXGYdP",
    __v: 0,
    lastUpdate: "2019-03-28T17:47:57.760Z",
    name: "Ikki de Fênix"
  };

  describe("todayScore", () => {
    it("should return score equal 0", async () => {
      const mockInteractions = [{ score: 0 }];
      const user = "123456";
      const spy = jest
        .spyOn(interactionModel, "find")
        .mockImplementationOnce(() => Promise.resolve(mockInteractions));
      interaction.todayScore(user).then(res => {
        expect(spy).toHaveBeenCalled();
        expect(res).toEqual(0);
      });
    });

    it("should return score not equal zero", async () => {
      const mockInteractions = [{ score: 2 }];
      const score = config.xprules.messages.send;
      const user = "123456";
      const spy = jest
        .spyOn(interactionModel, "find")
        .mockImplementationOnce(() => Promise.resolve(mockInteractions));
      interaction.todayScore(user).then(res => {
        expect(spy).toHaveBeenCalled();
        expect(res).toEqual(score);
      });
    });
  });

  describe("validInteraction", () => {
    const mockLastMessage = {
      _id: "5c9bfa0fac7f535bc808da67",
      date: "2019-03-27T22:32:46.000Z"
    };

    it("should return rocket user", async () => {
      const data = message;
      interaction.lastMessage = jest
        .fn()
        .mockReturnValue(Promise.resolve(mockLastMessage));
      userController.valid = jest
        .fn()
        .mockReturnValue(new Promise(resolve => resolve(mockFullUser)));
      interaction.validInteraction(data).then(response => {
        expect(response).toEqual(mockFullUser);
      });
    });

    it("should return user makes flood", async () => {
      const data = message;
      interaction.lastMessage = jest
        .fn()
        .mockReturnValue(Promise.reject("usuario fez flood"));
      userController.valid = jest
        .fn()
        .mockReturnValue(new Promise(resolve => resolve(mockFullUser)));
      interaction.validInteraction(data).then(response => {
        expect(response).toEqual("usuario fez flood");
      });
    });
  });

  describe("save", () => {
    describe("rocket origin", () => {
      // afterEach(() => jest.restoreAllMocks());
      it("should return reject promise when user not in rocket database", async () => {
        const data = message;
        data.origin = "rocket";
        await expect(interaction.save(message)).rejects.toEqual(
          "add new interaction"
        );
      });

      it("should return successfully when user is on rocket database", async () => {
        const data = message;
        data.origin = "rocket";
        jest
          .spyOn(interactionModel.prototype, "save")
          .mockImplementationOnce(() => Promise.resolve(saveInteraction));
        interaction.validInteraction = jest
          .fn()
          .mockReturnValue(new Promise(resolve => resolve(mockFullUser)));
        interaction.todayScore = jest.fn().mockReturnValue(0);
        interaction.save(message).then(response => {
          expect(response).toEqual(saveInteraction);
        });
      });

      it("should return interaction whitout update score", async () => {
        const data = message;
        const score = 0;
        data.origin = "rocket";
        const spy = jest
          .spyOn(interactionModel.prototype, "save")
          .mockImplementationOnce(() => Promise.resolve(saveInteraction));

        interaction.validInteraction = jest
          .fn()
          .mockReturnValue(new Promise(resolve => resolve(mockFullUser)));
        interaction.save(data).then(res => {
          expect(spy).toHaveBeenCalled();
          expect(res.score).toEqual(score);
        });
      });

      it("should return interaction whith update score", async () => {
        const data = message;
        const score = config.xprules.messages.send;
        data.origin = "rocket";
        const customSaveInteraction = {
          ...saveInteraction,
          score: 2
        };
        jest
          .spyOn(interactionModel.prototype, "save")
          .mockImplementationOnce(() => Promise.resolve(customSaveInteraction));
        interaction.validInteraction = jest
          .fn()
          .mockReturnValue(new Promise(resolve => resolve(mockFullUser)));
        interaction.save(data).then(res => {
          expect(res.score).toEqual(score);
        });
      });
    });
  });
  // describe("find", () => {});
  // describe("todayScore", () => {});
  // describe("remove", () => {});
  // describe("lastMessage", () => {});
  // describe("manualInteractions", () => {});
  // describe("findAll", () => {});
  // describe("findBy", () => {});
  // describe("calculate", () => {});
  // describe("dayScore", () => {});
  // describe("normalizeScore", () => {});
  // describe("aggregateBy", () => {});
  // describe("byDate", () => {});
});
