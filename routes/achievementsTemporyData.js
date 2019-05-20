import express from "express";
import bodyParser from "body-parser";
import achievementTemporaryDataController from "../controllers/achievementTemporaryData";
import interactionController from "../controllers/interaction";
import usersModel from "../models/user";
import usersLevelModel from "../models/userLevelHistory";

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/test", async (req, res) => {
  const args = [
    {
      $group: {
        _id: { rocketId: "$rocketId" },
        uniqueIds: { $addToSet: "$_id" },
        lastUpdates: { $addToSet: "$lastUpdate" },
        count: { $sum: 1 }
      }
    },
    {
      $match: {
        count: { $gt: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ];

  let achievementsTemporaryData = await usersModel.aggregate(args).exec();
  achievementsTemporaryData = await Promise.all(
    achievementsTemporaryData.map(async data => {
      if (data._id.rocketId != null) {
        const users = await usersModel
          .find({ rocketId: data._id.rocketId })
          .exec();

        const emptyUsers = await deleteUsers(users);

        const obj = {};
        // obj.users = users;
        // obj.totalUsers = users.length;
        obj.emptyUsers = emptyUsers;
        obj.totalEmptyUsers = emptyUsers.length;
        return obj;
      }

      return false;
    })
  );

  res.json(achievementsTemporaryData);
});

const deleteUsers = async users => {
  return Promise.all(
    users.map(async user => {
      if (user.level == 1 && user.score === 0 && user.messages === 0) {
        // TODO: delete usersLevelHistory
        // TODO: delete user
        // await usersLevelModel.remove({ user: user._id }).exec();
        await user.remove();
        return true;
      }

      return false;
    })
  );
};

// router.get("/test", async (req, res) => {
//   const data = {
//     _id: "9HTffrJn5dErFxmug",
//     t: "au",
//     rid: "CrX5SXfM6YTFwWyTL",
//     ts: { $date: 1557870881784 },
//     msg: "alex-aguiar",
//     u: {
//       _id: "ia95zDfgNSXebWhiN",
//       username: "mergulhao",
//       name: "Sylvestre Mergulhão"
//     },
//     groupable: false,
//     _updatedAt: { $date: 1557870881804 },
//     origin: "rocket"
//   };
//   let achievementsTemporaryData = await interactionController.save(data);
//   res.json(achievementsTemporaryData);
// });

router.get("/", async (req, res) => {
  let achievementsTemporaryData = await achievementTemporaryDataController.getAll();
  res.json(achievementsTemporaryData);
});

router.get("/:id", async (req, res) => {
  let achievementTemporaryData = await achievementTemporaryDataController.getById(
    req.params.id
  );
  res.json(achievementTemporaryData);
});

router.post("/", async (req, res) => {
  let achievementsTemporaryData = await achievementTemporaryDataController.save(
    req.body
  );
  res.json(achievementsTemporaryData);
});

router.put("/:id", async (req, res) => {
  let achievementTemporaryData = await achievementTemporaryDataController.update(
    req.params.id,
    req.body
  );
  res.json(achievementTemporaryData);
});

router.delete("/:id", async (req, res) => {
  let achievementTemporaryData = await achievementTemporaryDataController.disable(
    req.params.id
  );
  res.json(achievementTemporaryData);
});

export default router;
