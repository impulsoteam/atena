"use strict";
import { driver } from "@rocket.chat/sdk";
import userController from "../../controllers/user";

const show = async req => {
  const username = req.u.username;
  const isCoreTeam = await userController.isCoreTeam({ username });
  const response = {
    msg: "*Eis a nossa lista de comandos!*",
    attachments: [
      {
        text:
          "Digite *!meuspontos* para verificar teus pontos de experiência e nível!"
      },
      { text: "Digite *!minhasconquistas* para verificar tuas conquistas!" },
      {
        text: "Digite *!pro* para verificar o status do teu plano Impulser Pro!"
      },
      {
        text:
          "Digite *!rankinggeral* e veja o ranking geral e a tua posição nele!"
      },
      {
        text:
          "Digite *!ranking* e veja o ranking do mês atual e tua posição nele! Além disso, podes escolher um mês específico ao adicionar um número de 1 à 12 após o comando! Ex: !ranking 2 para o mês de Fevereiro."
      }
    ]
  };

  const coreTeamAttachments = [
    {
      text: `Digite ${"`!darpontos`"} ${"`@nome-usuario`"} ${"`pontos`"} ${"`motivo`"} para dar pontos ao usuário. `
    }
  ];

  if (isCoreTeam) {
    coreTeamAttachments.map(attachment =>
      response.attachments.push(attachment)
    );
  }

  driver.sendDirectToUser(response, username);
};

const givePoints = async data => {
  const { msg, u } = data;
  const isCoreTeam = await userController.isCoreTeam({ username: u.username });
  // eslint-disable-next-line no-useless-escape
  const checkFields = /(@[a-z\-]+) ([\d]+) (`.+`)/g;
  const result = checkFields.exec(msg);
  let user;
  let errorMessage;

  if (!isCoreTeam) {
    errorMessage = {
      msg: "Opa!! *Não tens acesso* a esta operação!"
    };
  } else if (!result) {
    errorMessage = {
      msg: `Opa, tem algo *errado* no seu comando!
      Tente usar desta forma:
      ${"`!darpontos`"} ${"`@nome-usuario`"} ${"`pontos`"} ${"`motivo`"}
      Ah! E o motivo deve estar entre acentos agudos!`
    };
  }

  if (errorMessage) {
    driver.sendDirectToUser(errorMessage, u.username);
    return;
  }

  try {
    user = await userController.findBy({
      username: result[1].replace("@", "")
    });
  } catch (error) {
    errorMessage = {
      msg: "Usuario *não* encontrado!"
    };
    driver.sendDirectToUser(errorMessage, u.username);
    return;
  }
  const oldScore = user.score;
  const score = parseInt(result[2]);
  const messageToUser = result[3].replace("`", "").slice(0, -1);

  const sucess = await userController.updateScore(user, score);

  if (sucess.score > oldScore) {
    const confirmMessage = {
      msg: `Sucesso! Enviaste *${score} pontos de experiencia* para ${
        user.name
      }!`
    };
    const notificationMessage = {
      msg: `Acabaste de receber *${score} pontos* de experiência por *${messageToUser}*.`
    };

    driver.sendDirectToUser(confirmMessage, u.username);
    driver.sendDirectToUser(notificationMessage, user.username);
  } else {
    errorMessage = {
      msg: "Opa, aconteceu algo inesperado. Tua pontuação não foi enviada!"
    };
    driver.sendDirectToUser(errorMessage, u.username);
  }
};

const exportFunctions = {
  show,
  givePoints
};

export default exportFunctions;
