class CommandController {
  constructor() {
    this.commands = {
      '!ranking': this.monthlyRanking,
      '!rankinggeral': this.generalRanking,
      '!meuspontos': this.userScore,
      '!minhasconquistas': this.userAchievements,
      '!pro': this.checkPro,
      '!comandos': this.sendCommands,
      '!darpontos': this.givePoints,
      '!checkinfos': this.checkInfos,
      '!hey': this.sendMessage
    }
  }

  handle(payload) {
    console.log('-=-=-=-=-=-=-=COMMAND-=-=-=-=-=-=-=-=')
    const command = payload.text.split(' ')[0]
    this.commands[command](command)
  }

  monthlyRanking(payload) {
    console.log(payload)
  }

  generalRanking(payload) {
    console.log(payload)
  }

  userScore(payload) {
    console.log(payload)
  }

  userAchievements(payload) {
    console.log(payload)
  }

  checkPro(payload) {
    console.log(payload)
  }

  sendCommands(payload) {
    console.log(payload)
  }

  givePoints(payload) {
    console.log(payload)
  }

  checkInfos(payload) {
    console.log(payload)
  }

  sendMessage(payload) {
    console.log(payload)
  }
}

export default new CommandController()
