# 业务代码的优化
- **js bridge 事件交互的优化**
优化点：js与客户端事件交互更简单

```javascript

// this.$bridge.call('registerEvent', { eventName: 'viewOnPause' })
// this.$bridge.on('viewOnPause', this.viewOnPauseListener)

// 上面两行代码优化为下面一行代码
this.$bridge.$on('viewOnPause', this.viewOnPauseListener)

```

- **执行quitWebView时埋点方式的优化**
优化点：
1、移除所有项目中的代码行 Vue.prototype.$bus = new Vue()
2、bridge.js模块代码更加独立，无任何第三方依赖
3、getDataBury.js对quitWebView的处理更加清晰

```javascript
// from getDataBury.js
{
  mounted() {
    this.$bridge.on('quitWebView', this.buryDataForQuitWebView)
  },
  methods: {
    buryDataForQuitWebView() {
      //... 退出WebView的数据埋点逻辑
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$bridge.removeListener('quitWebView', this.buryDataForQuitWebView)
  }
}
// from bridge.js
export default class extends EventEmitter {
  call(method, params) {
    if (method === 'quitWebView') {
      this.emit('quitWebView')
    }
  }
}
```

- **Android返回键对路由的优化处理**
```javascript
// from NavigationBar.vue
// 使用removeListener替代removeAllListeners，避免代码逻辑丢失
{
  mounted() {
    if (this.$bridge) {
      this.$bridge.removeAllListeners('androidBackKey')
      this.$bridge.on('androidBackKey', () => {
        this.slide(this.to)
      })
    }
  }
}
```

