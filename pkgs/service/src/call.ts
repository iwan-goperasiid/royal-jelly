import {
  semanticJson as s,
  contract,
  requestType,
  notificationType,
} from '@hediet/json-rpc'

export const call = contract({
  name: 'MyRpcContract',
  // the interface for clients to interact with servers
  server: {
    calculate: requestType({
      // io-ts is used to specify types.
      // This might change in future major versions.
      params: s.sObject({
        data: s.sString(),
      }),
      result: s.sString(),
    }),
  },
  // the interface for servers to interact with clients
  client: {
    progress: notificationType({
      params: s.sObject({
        progress: s.sNumber(),
      }),
    }),
  },
})
