TurnContext {
  _respondedRef: { responded: false },
  _turnState: TurnContextStateCollection(10) [Map] {
    Symbol(BotIdentity) => ClaimsIdentity { claims: [Array], authenticationType: true },
    Symbol(ConnectorClient) => ConnectorClient {
      _withCredentials: false,
      _httpClient: [AxiosHttpClient],
      _requestPolicyOptions: [RequestPolicyOptions],
      _requestPolicyFactories: [Array],
      baseUri: 'http://localhost:59629',
      requestContentType: 'application/json; charset=utf-8',
      credentials: [MicrosoftAppCredentials],
      attachments: [Attachments],
      conversations: [Conversations]
    },
    Symbol(UserTokenClient) => UserTokenClientImpl {
      appId: 'f4e3b433-289c-4c4d-ab10-e294243d973f',
      client: [TokenApiClient]
    },
    'botCallbackHandler' => [Function (anonymous)],
    Symbol(ConnectorFactory) => ConnectorFactoryImpl {
      appId: 'f4e3b433-289c-4c4d-ab10-e294243d973f',
      toChannelFromBotOAuthScope: 'https://api.botframework.com',
      loginEndpoint: 'https://login.microsoftonline.com/botframework.com',
      validateAuthority: true,
      credentialFactory: [ConfigurationServiceClientCredentialFactory],
      connectorClientOptions: {}
    },
    Symbol(OAuthScope) => 'https://api.botframework.com',
    Symbol(state) => { state: [Object], hash: '{}' },
    'DialogStateManagerConfiguration' => { memoryScopes: [Array], pathResolvers: [Array] },       
    'turn' => { activity: [Object] },
    Symbol(ActivityReceivedEmitted) => true,
    turn: { locale: 'en-US' }
  },
  _onSendActivities: [],
  _onUpdateActivity: [],
  _onDeleteActivity: [],
  _turn: 'turn',
  _locale: 'locale',
  bufferedReplyActivities: [],
  _adapter: CloudAdapter {
    middleware: MiddlewareSet { middleware: [] },
    BotIdentityKey: Symbol(BotIdentity),
    ConnectorClientKey: Symbol(ConnectorClient),
    OAuthScopeKey: Symbol(OAuthScope),
    botFrameworkAuthentication: ConfigurationBotFrameworkAuthentication {
      inner: [ParameterizedBotFrameworkAuthentication]
    },
    ConnectorFactoryKey: Symbol(ConnectorFactory),
    UserTokenClientKey: Symbol(UserTokenClient),
    turnError: [AsyncFunction (anonymous)]
  },
  _activity: {
    channelData: {
      clientActivityID: '1655010606959vpfgs0uoyv',
      clientTimestamp: '2022-06-12T05:10:06.959Z'
    },
    text: 'vsf',
    textFormat: 'plain',
    type: 'message',
    channelId: 'emulator',
    from: {
      id: '1dca141e-2d1c-4f19-9db4-724f6e822076',
      name: 'User',
      role: 'user'
    },
    locale: 'en-US',
    localTimestamp: 2022-06-12T05:10:07.000Z,
    localTimezone: 'Asia/Calcutta',
    timestamp: 2022-06-12T05:10:07.059Z,
    conversation: { id: '429d3970-ea0c-11ec-a183-b5d6d2d95aaf|livechat' },
    id: 'ecd66230-ea0d-11ec-aab4-290ffd44cab0',
    recipient: {
      id: '8d4753f0-ea09-11ec-a183-b5d6d2d95aaf',
      name: 'Bot',
      role: 'bot'
    },
    serviceUrl: 'http://localhost:59629',
    rawTimestamp: '2022-06-12T05:10:07.059Z',
    rawLocalTimestamp: '2022-06-12T10:40:07+05:30',
    callerId: 'urn:botframework:azure'
  }
}