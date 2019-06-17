import axios from 'axios'
import interactions from '../interactions'
import users from '../users'

const isValidPost = data => {
  return (
    data.post &&
    data.post.post_type === 'post' &&
    data.post.post_status === 'publish'
  )
}

const findInteractionByPostId = async postId => {
  const post = await interactions.findOne({
    messageIdentifier: postId
  })

  return post || false
}

const findUser = async data => {
  let user

  const blogUser = await getUserInfo(data.post.post_author)
  if (blogUser) user = await findOrCreateUser(blogUser)

  return user
}

const findOrCreateUser = async blogUser => {
  if (!blogUser) return false

  const query = {
    email: blogUser.user_email
  }

  const args = {
    $set: {
      name: blogUser.name,
      email: blogUser.user_email
    },
    $setOnInsert: {
      level: 1,
      score: 0
    }
  }

  const options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  }

  return users.findOneAndUpdate(query, args, options)
}

const getUserInfo = async userId => {
  const url = `${process.env.BLOG_API_URL}/users/${userId}`
  let res = await axios.get(url, {
    accept: 'json'
  })
  return res ? res.data : false
}

export default {
  findInteractionByPostId,
  isValidPost,
  findUser,
  getUserInfo
}
