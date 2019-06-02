import config from "config-yml"

export const calculateReceivedScore = interaction => {
  let score = 0
  if (interaction.type === "reaction_added") {
    if (interaction.description === "+1") {
      score = config.xprules.reactions.receive.positive
    } else if (interaction.description === "-1") {
      score = config.xprules.reactions.receive.negative
    } else if (interaction.description === "atena") {
      score = config.xprules.reactions.atena
    }
  } else if (interaction.type === "reaction_removed") {
    if (interaction.description === "+1") {
      score = config.xprules.reactions.receive.positive * -1
    } else if (interaction.description === "-1") {
      score = config.xprules.reactions.receive.negative * -1
    } else if (interaction.description === "atena") {
      score = config.xprules.reactions.atena * -1
    }
  } else if (interaction.type === "thread") {
    score = config.xprules.threads.receive
  }
  return score
}
