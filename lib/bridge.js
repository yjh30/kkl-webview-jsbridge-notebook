import utils from './utils/index';

const EventEmitter = require('events');

export default class extends EventEmitter {
  constructor(urlScheme) {
    super();
    this.urlScheme = urlScheme;
    this.callQueue = [];
  }

  registerEvent(params) {
    utils.registerEvent(params, callbackName => {
      window[callbackName] = res => {
        if (typeof res === 'string') {
          try {
            res = JSON.parse(res);
          } catch (e) {
            // ...
          }
        }

        res = res || {};

        // 处理老的响应格式，所有回调格式统一
        // wiki: http://wiki.ikuko.com/pages/viewpage.action?pageId=13273713
        if (typeof res.code === 'undefined' && typeof res.args === 'object') {
          res.code = 0;
          res.msg = '';
          res.data = res.args;
        }
        this.emit(params.eventName, res);
      };
    });
  }

  // 注册客户端Native事件监听器
  $on(eventName, eventCallback) {
    this.registerEvent({ eventName });
    this.on(eventName, eventCallback);
  }

  // 移除客户端Native事件监听器
  $off(eventName, eventListener) {
    if (eventListener) {
      this.removeListener(eventName, eventListener);
    } else {
      this.removeAllListeners(eventName);
    }
    this.call('unRegisterEvent', { eventName });
  }

  async call(method, params) {
    if (typeof window === 'undefined') {
      return;
    }

    if (method === 'registerEvent') {
      return this.registerEvent(params);
    }

    if (method === 'quitWebView') {
      this.call('unRegisterEvent', { eventName: 'viewOnPause' });
      this.emit('quitWebView');

      // 预留200ms执行 quitWebView事件监听器代码
      await new Promise(resolve => {
        setTimeout(resolve, 200);
      });
    }

    utils.invoke(method, params, this.urlScheme);
    return new Promise(resolve => {
      this.callQueue[method] = res => {
        resolve(res || {});
        delete this.callQueue[method];
      };
    });
  }
}
