import { ApiCall, MsgCall, ApiCallOptions, MsgCallOptions } from '../BaseCall';
import { HttpConnection } from './HttpConnection';
import { Pool } from '../../models/Pool';
import { TransportDataUtil } from '../../models/TransportDataUtil';
import { BaseServiceType, TsrpcError } from 'tsrpc-proto';

export interface ApiCallHttpOptions<ServiceType extends BaseServiceType> extends ApiCallOptions {
    conn: HttpConnection<ServiceType>;
}
export class ApiCallHttp<Req = any, Res = any, ServiceType extends BaseServiceType = any> extends ApiCall<Req, Res, ApiCallHttpOptions<ServiceType>> {

    conn!: HttpConnection<ServiceType>;

    reset(options: ApiCallHttpOptions<ServiceType>) {
        super.reset(options);
        this.conn = options.conn;
    }

    clean() {
        super.clean();
        this.conn.destroy();
        this.conn = undefined as any;
    }

    succ(res: Res): void {
        if (this.res) {
            return;
        }

        let buf = TransportDataUtil.encodeApiSucc(this.conn.server.tsbuffer, this.service, res);
        this.conn.server.options.debugBuf && this.logger.debug('[SendBuf]', buf);
        if (this.conn.server.options.encrypter) {
            buf = this.conn.server.options.encrypter(buf);
            this.conn.server.options.debugBuf && this.logger.debug('[EncryptedBuf]', buf);
        }
        this.conn.options.httpRes.end(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength));

        this.options.res = {
            isSucc: true,
            data: res,
            usedTime: Date.now() - this.startTime
        };
    }

    error(message: string, info?: any): void {
        if (this.res) {
            return;
        }

        // Error SN
        if (this.conn.server.options.showErrorSn) {
            message += ` [#${this.sn.toString(36)}]`;
        }

        let buf = TransportDataUtil.encodeApiError(this.service, message, info, 0);
        this.conn.server.options.debugBuf && this.logger.debug('[SendBuf]', buf);
        if (this.conn.server.options.encrypter) {
            buf = this.conn.server.options.encrypter(buf);
            this.conn.server.options.debugBuf && this.logger.debug('[EncryptedBuf]', buf);
        }
        this.conn.options.httpRes.end(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength));

        this.options.res = {
            isSucc: false,
            error: new TsrpcError(message, info),
            usedTime: Date.now() - this.startTime
        };
    }

    destroy(): void {
        this.conn.server['_poolApiCall'].put(this);
    }
}

export interface MsgCallHttpOptions<ServiceType extends BaseServiceType> extends MsgCallOptions {
    conn: HttpConnection<ServiceType>;
}
export class MsgCallHttp<Msg = any, ServiceType extends BaseServiceType = any> extends MsgCall<Msg, MsgCallHttpOptions<ServiceType>> {

    conn!: HttpConnection<ServiceType>;

    reset(options: MsgCallHttpOptions<ServiceType>) {
        super.reset(options);
        this.conn = options.conn;
    }

    clean() {
        super.clean();
        this.conn.destroy();
    }

    destroy(): void {
        this.conn.server['_poolMsgCall'].put(this);
    }

}

export type HttpCall = ApiCallHttp | MsgCallHttp;