import utils from './index'

let iframe, eventCallbackId = 0
const alphabetStr = 'abcdefghijklmnopqrstuvwxyz'

const isString = arg => {
  return typeof arg === 'string' &&
    arg.trim() !== ''
}

const isObject = arg => {
  return Object.prototype.toString.call(arg) === '[object Object]' &&
    Object.keys(arg).length > 0
}

const getEventCallbackName = () => {
  const nowTimeStr = Date.now().toString()
  const timeName = [].map.call(nowTimeStr, s => alphabetStr.charAt(Number(s))).join('')
  return `KklJsBridgeEventCallback_${timeName}_${eventCallbackId++}`
}

const getMsg = (method, params) => {
  const msg = {
    method
  }
  if (isObject(params)) {
    msg.params = JSON.stringify(params)
  } else if (isString(params)) {
    msg.params = JSON.stringify({
      message: params
    })
  }
  return JSON.stringify(msg)
}

function compatibility(urlScheme, msg) {
  if (!iframe) {
    iframe = window.document.createElement('iframe')
    iframe.setAttribute('style', 'display:none')
    window.document.body.appendChild(iframe)
  }
  iframe.src = `${urlScheme.replace(/\/$/, '')}/${encodeURIComponent(msg)}`
}

function registerEvent(params, callback) {
  if (isObject(params) && isString(params.eventName)) {
    params.callback = getEventCallbackName()
    invoke('registerEvent', params)
    if (typeof callback === 'function') {
      callback(params.callback)
    }
  }
}

function invoke(method, params, urlScheme) {
  const msg = getMsg(method, params)

  if (utils.canPostMessage) {
    window.webkit.messageHandlers.WebViewBridge.postMessage(msg)
  } else if (window.WebViewBridge) {
    if (typeof window.WebViewBridge.call === 'function') {
      window.WebViewBridge.call(msg)
    } else if (window.WebViewBridge[method]) {
      if (isString(params)) {
        window.WebViewBridge[method](params)
      } else {
        window.WebViewBridge[method]()
      }
    }
  } else if (urlScheme) {
    compatibility(urlScheme, msg)
  }
}

export default {
  registerEvent,
  invoke
}
