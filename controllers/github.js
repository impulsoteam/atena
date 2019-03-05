import userController from "./user";
import mongoose from "mongoose";

const link_auth = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${
  process.env.GITHUB_CLIENT_ID
}`;

const updateUserData = (slackId, githubId) => {
  const UserModel = mongoose.model("User");
  return UserModel.findOne({ slackId: slackId }, (err, doc) => {
    if (err) {
      throw new Error("Error updating user");
    }
    doc.githubId = githubId;
    doc.lastUpdate = Date.now();
    doc.save();
    return doc;
  });
};

const index = async (req, res) => {
  let response = {};
  let user;
  let rocketId = req.body.id;
  let name = req.body.name;
  try {
    user = await userController.findBy({ rocketId: rocketId });
  } catch (e) {
    const obj = {
      rocketId: rocketId,
      name: name
    };
    user = await userController.save(obj);
  }
  if (user && user.githubId) {
    response.text = `Olá! Leal, ${
      user.name
    }, você já pode participar dos meus trabalhos open-source! Go coding!`;
  } else {
    response.text = `Olá! Parece que você ainda não pertence as nossas fileiras, Impulser! Mas você não viria tão longe se não quisesse participar dos trabalhos com open-source, certo?!
Portanto, tens o que é preciso para estar entre nós, ${
      user.name
    }! Mas para participar dos trabalhos com open-source, preciso que vá até o seguinte local: ${link_auth}&state=${
      user.rocketId
    }. Uma vez que conclua essa missão voltaremos a conversar!`;
  }
  res.json(response);
};

export default {
  updateUserData,
  index
};
