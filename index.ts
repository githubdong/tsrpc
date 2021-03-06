import 'k8w-extend-native';
import { HttpServer, ApiHandlerHttp, MsgHandlerHttp } from './src/server/http/HttpServer';
import { WsServer, ApiHandlerWs, MsgHandlerWs } from './src/server/ws/WsServer';
import { ApiCall, MsgCall } from './src/server/BaseCall';
import { ApiCallHttp, MsgCallHttp } from './src/server/http/HttpCall';
import { ApiCallWs, MsgCallWs } from './src/server/ws/WsCall';
import { HttpClient } from './src/client/http/HttpClient';
import { ApiHandler, MsgHandler, consoleColorLogger } from './src/server/BaseServer';
import { PrefixLogger, Logger } from './src/server/Logger';
import { tsrpcVersion } from './tsrpcVersion';
import { TsrpcError } from 'tsrpc-proto';

export { HttpServer as TsrpcServer, HttpClient as TsrpcClient };
export { WsServer as TsrpcServerWs };
export { ApiCall, ApiCallHttp, ApiCallWs };
export { MsgCall, MsgCallHttp, MsgCallWs };
export { ApiHandler, ApiHandlerHttp, ApiHandlerWs };
export { MsgHandler, MsgHandlerHttp, MsgHandlerWs };

export { TsrpcError };

export { consoleColorLogger, PrefixLogger, Logger };

export { tsrpcVersion };