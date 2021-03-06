import { Logger } from '../server/Logger';
export class HandlerManager {
    private _handlers: { [key: string]: Function[] | undefined } = {}

    logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    /**
     * @return handlers count
     */
    forEachHandler(key: string, ...args: any[]): (any | Promise<any>)[] {
        let handlers = this._handlers[key];
        if (!handlers) {
            return [];
        }

        let output: (any | Promise<any>)[] = [];
        for (let handler of handlers) {
            try {
                output.push(handler(...args));
            }
            catch (e) {
                this.logger.error('MsgHandlerError', e);
            }
        }
        return output;
    }

    addHandler(key: string, handler: Function) {
        let handlers = this._handlers[key];
        // 初始化Handlers
        if (!handlers) {
            handlers = this._handlers[key] = [];
        }
        // 防止重复监听
        else if (handlers.some(v => v === handler)) {
            return;
        }

        handlers.push(handler);
    }

    removeHandler(key: string, handler?: Function) {
        let handlers = this._handlers[key];
        if (!handlers) {
            return;
        }

        // 未指定handler，删除所有handler
        if (!handler) {
            delete this._handlers[key];
            return;
        }

        handlers.removeOne(v => v === handler);
    }
}