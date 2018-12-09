/**
 * created by yangjunhua on 2018/01/16
 * 外网地址文档：https://github.com/yjh30/kkl-webview-jsbridge-notebook
 * 内网地址文档：http://git.mistong.com/fe/kkl-jsbridge-notebook
 * 客户端整理文档：http://wiki.ikuko.com/pages/viewpage.action?pageId=13273715
 */

import Bridge from './bridge'
import instances from './instances'
import responseHandle from './responseHandle'
import compatibilityHandle from './compatibilityHandle'

class WebViewBridge extends Bridge {
  constructor(urlScheme) {
    super(urlScheme)
    instances.push(this)
  }
}

const bridge = new WebViewBridge()
compatibilityHandle(bridge)
responseHandle()

export default bridge
