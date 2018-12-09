let userAgent = ''
let canPostMessage

if (typeof window !== 'undefined') {
  userAgent = window.navigator.userAgent.toLowerCase()
  canPostMessage = window.webkit && window.webkit.messageHandlers &&
    window.webkit.messageHandlers.WebViewBridge &&
    window.webkit.messageHandlers.WebViewBridge.postMessage || false
}

const isIphone = userAgent.match(/iphone/)
const isAndroid = userAgent.match(/android/)

export default {
  canPostMessage,
  isIphone,
  isAndroid
}
