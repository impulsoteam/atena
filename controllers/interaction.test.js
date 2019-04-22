import interaction from "./interaction";
import interactionModel from "../models/interaction";
import {
  saveInteraction,
  message,
  responseEngagedSlash
} from "../mocks/rocket";
import userController from "./user";
import config from "config-yml";
jest.mock("../rocket/api");
jest.mock("../rocket/bot", () => jest.fn());
jest.mock("../utils");
jest.mock("./user");
jest.mock("./achievement");
jest.mock("./achievementTemporary");

describe("Interaction Controller", () => {
  afterEach(() => jest.restoreAllMocks());
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

  describe("engaged", () => {
    it("should return is not core team", async done => {
      const mockReq = {
        body: responseEngagedSlash
      };
      const mockRes = {
        json: jest.fn()
      };
      const mockResponse = {
        text:
          "Você não tem uma armadura de ouro, e não pode entrar nessa casa!",
        attachments: []
      };
      userController.isCoreTeam = jest
        .fn()
        .mockReturnValue(new Promise(resolve => resolve(false)));
      interaction.engaged(mockReq, mockRes).then(() => {
        expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
      });
      done();
    });

    it("should return wrong invalid dates", async done => {
      const mockReq = {
        body: {
          ...responseEngagedSlash,
          begin: "10/10/2019",
          end: "10/10/2019"
        }
      };
      const mockRes = {
        json: jest.fn()
      };
      const mockResponse = {
        text:
          "Datas em formatos inválidos por favor use datas com o formato ex: 10-10-2019",
        attachments: []
      };
      userController.isCoreTeam = jest
        .fn()
        .mockReturnValue(new Promise(resolve => resolve(true)));
      interaction.engaged(mockReq, mockRes).then(() => {
        expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
      });
      done();
    });

    it("should return date begin more than date end", async done => {
      const mockReq = {
        body: {
          ...responseEngagedSlash,
          begin: "01-02-2019",
          end: "01-01-2019"
        }
      };

      const mockRes = {
        json: jest.fn()
      };

      const mockResponse = {
        text: "Data de ínicio não pode ser maior que data final",
        attachments: []
      };

      userController.isCoreTeam = jest
        .fn()
        .mockReturnValue(new Promise(resolve => resolve(true)));

      interaction.engaged(mockReq, mockRes).then(() => {
        expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
      });
      done();
    });

    it("should return a list users engaged", async done => {
      const mockUsers = [
        {
          _id: {
            _id: 123456,
            name: "Ikki",
            rocketId: "H9kcNkWwXF92XxtTF",
            username: "ikki"
          },
          count: 6,
          date: "2019-04-13T13:00:12.000Z"
        }
      ];
      const mockReq = {
        body: responseEngagedSlash
      };
      const mockRes = {
        json: jest.fn()
      };
      const mockResponse = {
        text: "Total de 1 usuário engajados",
        attachments: [
          { text: "Username: @ikki | Name: Ikki | Qtd. interações: 6" }
        ]
      };
      userController.isCoreTeam = jest
        .fn()
        .mockReturnValue(new Promise(resolve => resolve(true)));
      interaction.mostActives = jest
        .fn()
        .mockReturnValue(new Promise(resolve => resolve(mockUsers)));
      interaction.engaged(mockReq, mockRes).then(() => {
        expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
      });
      done();
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
