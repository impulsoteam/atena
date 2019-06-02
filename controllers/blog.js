import axios from "axios"
import config from "config-yml"
import InteractionModel from "../models/interaction"
import interactionController from "../controllers/interaction"
import userController from "../controllers/user"

const index = async data => {
  const response = true

  try {
    if (isValidPost(data)) {
      const hasInteraction = await findInteractionByPostId(data.post_id)
      if (!hasInteraction) {
        const user = await findUser(data)
        if (user) {
          const obj = {
            id: data.post_id,
            origin: "blog",
            type: "article",
            title: data.post.post_title,
            user: user.rocketId
          }
          await interactionController.save(obj)
        } else {
          console.log("Error user not found on blog to save interaction")
        }
      }
    }
  } catch (error) {
    console.log("error", error)
    console.log("Error on save blog interaction")
  }

  return response
}

const isValidPost = data => {
  return (
    data.post &&
    data.post.post_type === "post" &&
    data.post.post_status === "publish"
  )
}

const findInteractionByPostId = async postId => {
  const post = await InteractionModel.findOne({
    messageIdentifier: postId
  }).exec()

  return post || false
}

const getUserById = async userId => {
  const url = `${process.env.BLOG_API_URL}/users/${userId}`
  let res = await axios.get(url, {
    accept: "json"
  })
  return res ? res.data : false
}

const findUser = async data => {
  let user

  const blogUser = await getUserById(data.post.post_author)
  if (blogUser) {
    user = await userController.findBy({
      email: blogUser.user_email
    })
  }

  return user
}

const normalize = data => {
  if (data.type == "comment") {
    return {
      origin: "blog",
      type: data.type,
      user: data.user,
      thread: false,
      description: "comment on blog",
      channel: data.id,
      category: config.categories.network.type,
      action: config.actions.blog.type,
      score: config.xprules.blog.comment
    }
  } else if (data.type == "article") {
    return {
      origin: "blog",
      type: "article",
      channel: data.id,
      date: new Date(),
      description: data.title,
      messageIdentifier: data.id,
      parentMessage: null,
      thread: false,
      user: data.user,
      category: config.categories.network.type,
      action: config.actions.blog.type,
      score: config.xprules.blog.post
    }
  }
}

export default {
  index,
  normalize
}
