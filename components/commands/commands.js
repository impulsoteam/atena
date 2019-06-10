'use strict'
import { driver } from '@rocket.chat/sdk'

const show = async req => {
  const username = req.u.username
  const response = {
    msg: '*Eis a nossa lista de comandos!*',
    attachments: [
      {
        text:
          'Digite *!meuspontos* para verificar teus pontos de experiência e nível!'
      },
      { text: 'Digite *!minhasconquistas* para verificar tuas conquistas!' },
      {
        text: 'Digite *!pro* para verificar o status do teu plano Impulser Pro!'
      },
      {
        text:
          'Digite *!rankinggeral* e veja o ranking geral e a tua posição nele!'
      },
      {
        text:
          'Digite *!ranking* e veja o ranking do mês atual e tua posição nele! Além disso, podes escolher um mês específico ao adicionar um número de 1 à 12 após o comando! Ex: !ranking 2 para o mês de Fevereiro.'
      }
    ]
  }

  driver.sendDirectToUser(response, username)
}

const exportFunctions = {
  show
}

export default exportFunctions
