import githubController from "./github";
import { responseOpensourceSlash } from "../mocks/rocket";
import user from "./user";

jest.mock("./interaction", () => jest.fn());
jest.mock("../rocket/api", () => jest.fn());
jest.mock("../rocket/bot", () => jest.fn());
jest.mock("./user");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = body => ({
  body
});

const link_auth = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${
  process.env.GITHUB_CLIENT_ID
}`;

describe("Github Controller", () => {
  describe("Index", () => {
    const req = mockRequest(responseOpensourceSlash);
    const res = mockResponse();
    const name = req.body.name;
    const rocketId = req.body.id;
    it("should return text the user is not on the gamification", async () => {
      const text = `Olá! Parece que você ainda não pertence as nossas fileiras, Impulser! Mas você não viria tão longe se não quisesse participar dos trabalhos com open-source, certo?!
Portanto, tens o que é preciso para estar entre nós, ${name}! Mas para participar dos trabalhos com open-source, preciso que vá até o seguinte local: ${link_auth}&state=${rocketId}. Uma vez que conclua essa missão voltaremos a conversar!`;
      user.findBy.mockRejectedValueOnce(new Error("Async error"));
      user.save.mockResolvedValue({
        name: "Ikki de Fênix",
        rocketId: rocketId
      });
      await githubController.index(req, res);
      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ text: text });
    });

    it("should return text the user is on the gamification", async () => {
      user.findBy.mockResolvedValue({
        name: "Ikki de Fênix",
        rocketId: rocketId,
        githubId: "123456"
      });
      const text = `Olá! Leal, ${name}, você já pode participar dos meus trabalhos open-source! Go coding!`;
      await githubController.index(req, res);
      expect(res.json).toHaveBeenCalledWith({ text: text });
    });
  });
});
