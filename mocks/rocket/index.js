export const apiGetInfoUserByUserId = {
  user: {
    _id: "2BQ3wWnRBh7vXGYdP",
    type: "user",
    status: "online",
    active: true,
    name: "Ikki de Fênix",
    utcOffset: -3,
    username: "ikki"
  },
  success: true
};

export const responseOpensourceSlash = {
  id: "2BQ3wWnRBh7vXGYdP",
  username: "ikki",
  emails: [
    {
      address: "ikki@impulso.network",
      verified: false
    }
  ],
  type: 0,
  isEnabled: true,
  name: "Ikki de Fênix",
  roles: ["user", "admin"],
  status: "online",
  statusConnection: "online",
  utcOffset: -3,
  createdAt: "2019-01-22T16:29:53.473Z",
  updatedAt: "2019-03-04T11:40:54.709Z",
  lastLoginAt: "2019-03-04T10:58:46.701Z"
};

export const responseEngagedSlash = {
  id: "H9kcNkWwXF92XxtTF",
  username: "ikki",
  emails: [{ address: "ikki@impulso.network", verified: false }],
  type: 0,
  isEnabled: true,
  name: "Ikki",
  roles: ["admin"],
  status: "online",
  statusConnection: "online",
  utcOffset: -3,
  createdAt: "2019-02-09T18:29:53.208Z",
  updatedAt: "2019-04-12T16:24:53.234Z",
  lastLoginAt: "2019-04-12T12:27:01.872Z",
  begin: "10-10-2019",
  end: "20-10-2019"
};

export const headerOpensourceSlash = {
  host: "atena.herokuapp.com",
  "user-agent": "Go-http-client/1.1",
  "content-length": "371",
  "content-type": "application/json",
  origin: "rocket",
  "x-forwarded-for": "68.183.136.70"
};

// prettier-ignore
export const message = {
  _id: "9iu48nfao3xPWLrkp",
  rid: "GENERAL",
  msg: "msg mock",
  ts: { "$date": 1551699287633 },
  u: {
    _id: "2BQ3wWnRBh7vXGYdP",
    username: "ikki",
    name: "Ikki de Fênix"
  },
  _updatedAt: { "$date": 1551699287653 },
  mentions: [],
  channels: [],
  origin: "rocket"
};

export const messageAttachmentFromHistory = {
  _id: "Mdi4Rkt53yaKX5d8r",
  rid: "Aa6fSXib23WpHjof7",
  ts: "2019-01-15T13:46:05.345Z",
  msg: "",
  file: {
    _id: "aA6Pa8MsuBTnywSHY",
    name: "sENwDOVAR7kv3nbTYcm4.jpeg",
    type: "image/jpeg"
  },
  groupable: false,
  attachments: [
    {
      ts: "1970-01-01T00:00:00.000Z",
      title: "sENwDOVAR7kv3nbTYcm4.jpeg",
      title_link: "/file-upload/aA6Pa8MsuBTnywSHY/sENwDOVAR7kv3nbTYcm4.jpeg",
      title_link_download: true,
      image_url: "/file-upload/aA6Pa8MsuBTnywSHY/sENwDOVAR7kv3nbTYcm4.jpeg",
      type: "file",
      description: ""
    }
  ],
  u: {
    _id: "2BQ3wWnRBh7vXGYdP",
    username: "ikki",
    name: "Ikki de Fênix"
  },
  _updatedAt: "2019-01-15T16:08:41.103Z",
  mentions: [],
  channels: [],
  reactions: {
    ":joy:": {
      usernames: [
        "lazaro.alvarenga",
        "thays",
        "maisa",
        "anderson-roberto-de-oliveira",
        "raquelfonseca.pmp",
        "luiz-gustavo-sampaio-mafra-de-santana"
      ]
    },
    ":temer:": {
      usernames: ["renato"]
    }
  }
};

export const saveInteraction = {
  _id: "5c97bb78079546634e30a20",
  thread: false,
  score: 0,
  type: "type",
  channel: "test",
  description: "desccription",
  user: "2BQ3wWnRBh7vXGYdP",
  lastUpdate: "2019-03-23T20:25:14.889Z",
  date: "2019-03-23T20:25:14.889Z",
  __v: 0
};

export default message;
