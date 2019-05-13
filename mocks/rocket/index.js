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

export const apiGetChannels = {
  channels: [
    {
      _id: "hJEoEF9Etxa9HaqnY",
      name: "channel-jose",
      fname: "channel-jose",
      t: "c",
      msgs: 1,
      usersCount: 2,
      u: {
        _id: "7xQoephgRzEGcBaN8",
        username: "lulu"
      },
      customFields: {},
      ts: "2019-04-03T18:32:31.700Z",
      ro: false,
      sysMes: true,
      default: false,
      _updatedAt: "2019-04-03T18:41:05.267Z"
    },
    {
      _id: "RbAZGqre7m2bGN8aN",
      name: "comunicados",
      fname: "comunicados",
      t: "c",
      msgs: 648,
      usersCount: 5,
      u: {
        _id: "2BQ3wWnRBh7vXGYdP",
        username: "eduardo.junior"
      },
      customFields: {},
      broadcast: false,
      encrypted: false,
      ts: "2019-02-03T21:28:25.704Z",
      ro: false,
      sysMes: true,
      default: false,
      _updatedAt: "2019-04-27T09:00:10.307Z",
      lm: "2019-02-11T12:29:27.502Z",
      lastMessage: {
        msg:
          ":medal: Ikki de Fênix acabou de conquistar Bronze em Network | Mensagens Enviadas",
        bot: {
          i: "js.SDK"
        },
        rid: "RbAZGqre7m2bGN8aN",
        ts: "2019-02-11T12:29:27.502Z",
        u: {
          _id: "EbMkCCoJzqrNf9uzK",
          username: "atena-thais-bot",
          name: "Atena Thais Bot"
        },
        _id: "nHs5WPriCPNKDQhMw",
        _updatedAt: "2019-02-11T12:29:27.524Z",
        mentions: [],
        channels: [],
        sandstormSessionId: null
      }
    },
    {
      _id: "GENERAL",
      ts: "2019-01-22T16:18:11.980Z",
      t: "c",
      name: "general",
      usernames: [],
      msgs: 1225,
      usersCount: 45,
      default: true,
      _updatedAt: "2019-04-26T14:08:45.246Z",
      lm: "2019-04-26T14:08:36.604Z",
      jitsiTimeout: "2019-02-01T15:55:25.913Z",
      lastMessage: {
        _id: "4GgqrGYaGMm6HoAyP",
        rid: "GENERAL",
        msg: "!meuspontos",
        ts: "2019-04-26T12:55:57.778Z",
        u: {
          _id: "ueofoughzADn6uA3T",
          username: "emir",
          name: "emir segundo"
        },
        _updatedAt: "2019-04-26T12:55:57.796Z",
        mentions: [],
        channels: []
      },
      muted: []
    },
    {
      _id: "kqXAv69KbQqBJFsrY",
      name: "impulso-network",
      fname: "impulso-network",
      t: "c",
      msgs: 770,
      usersCount: 13,
      u: {
        _id: "2GcRwb7Hh4pwTFf8q",
        username: "thais.martins"
      },
      customFields: {},
      broadcast: false,
      encrypted: false,
      ts: "2019-02-11T14:34:55.701Z",
      ro: false,
      sysMes: true,
      default: false,
      _updatedAt: "2019-04-24T12:53:55.771Z",
      lm: "2019-04-24T12:53:55.742Z",
      lastMessage: {
        _id: "bxaMCsrx3PJcFguq9",
        rid: "kqXAv69KbQqBJFsrY",
        msg: "!meuspontos",
        ts: "2019-04-24T12:53:55.742Z",
        u: {
          _id: "ueofoughzADn6uA3T",
          username: "emir",
          name: "emir segundo"
        },
        _updatedAt: "2019-04-24T12:53:55.758Z",
        mentions: [],
        channels: [],
        sandstormSessionId: null
      },
      topic: "teste de topico"
    }
  ],
  count: 9,
  offset: 1,
  total: 10,
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
