import express from 'express'
import users from './usersController'
import user from './user'

const router = express.Router()

router.get('/', async (req, res) => {
  let result = {}
  if (req.query.slack) {
    result = await users.findUsersWithSlack()
  } else if (req.query.name) {
    result = await users.findRocketUsersByName(req.query.name)
  }

  return res.json(result)
})

router.put('/:id/score', async (req, res) => {
  const { type, score } = req.body
  const result = await users.transferScore(req.params.id, type, score)
  return res.json(result)
})

router.get('/:uuid/profile', async (req, res) => {
  const result = await users.getUserProfileByUuid(req.params.uuid)
  return res.json(result)
})

router.delete('/delete-many/:field', async (req, res) => {
  if(!['username', 'uuid'].includes(req.params.field)) return res.status(405).send('Method not allowed')
  const conditions = { [req.params.field]: { $in: req.body } }

  try {
    const usersToRemove = await user.find(conditions).select('name email username')
    await user.deleteMany(conditions)
    res.send(usersToRemove)
  } catch (error) {
    res.sendStatus(500)
  }
})

router.delete('/delete-one/:val', async (req, res) => {
  const user = await user.deleteOne({
    $or: {
      username: req.params.val,
      uuid: req.param.val,
    }
  })
})

export default router
