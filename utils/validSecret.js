import crypto from "crypto"
import qs from "qs"

const slackSecret = process.env.SLACK_SIGNIN_EVENTS
const validSlackSecret = (req, res) => {
  const timeStamp = req.headers["x-slack-request-timestamp"]
  const slackSignature = req.headers["x-slack-signature"]

  if (!slackSecret) {
    return res.status(400).send("Slack signing secret is empty.")
  }
  if (!slackSignature) return res.status(400).send("Slack Signature not found")
  const time = Math.floor(new Date().getTime() / 1000)
  if (Math.abs(time - timeStamp) > 300) {
    return res.status(400).send("Ignore this request.")
  }
  const requestBody = qs.stringify(req.body, { format: "RFC1738" })
  const sigBaseString = `v0:${timeStamp}:${requestBody}`
  const hmac = crypto
    .createHmac("sha256", slackSecret)
    .update(sigBaseString, "utf8")
    .digest("hex")
  const mySignature = `v0=${hmac}`
  if (
    crypto.timingSafeEqual(
      Buffer.from(mySignature, "utf8"),
      Buffer.from(slackSignature, "utf8")
    )
  ) {
    return
  } else {
    return res.status(400).send("Verification failed")
  }
}

export default validSlackSecret
