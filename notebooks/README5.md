# 桥接js在业务中的运用
- **精确统计h5页面停留时长**（h5答题时长轮询上报，都应加上对客户端viewOnPause，viewOnResume的处理）

```javascript
// from getDataBury.js
{
  mounted() {
    setTimeout(() => {
      this.$bridge.call('registerEvent', { eventName: 'viewOnResume' })
      this.$bridge.call('registerEvent', { eventName: 'viewOnPause' })

      this.$bridge.on('viewOnPause', this.viewOnPauseForBury)
      this.$bridge.on('viewOnResume', this.viewOnResumeForBury)
    }, 1000)
  },
  methods: {
    viewOnPauseForBury() {
      // ...
    },
    viewOnResumeForBury() {
      // ...
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$bridge.removeListener("viewOnPause", this.viewOnPauseForBury);
    this.$bridge.removeListener("viewOnResume", this.viewOnResumeForBury);
    next()
  }
}
```

- 大数据埋点 处理WebView onPause 与 onDestroy生命周期的关系
```javascript
// from bridge.js
export default class extends EventEmitter {
  call() {
    // 由于我们对客户端viewOnPause事件及quitWebView行为都做了埋点请求，当quitWebView行为发生时，我们需要移除客户端注册的事件监听，避免二次发送埋点请求
    if(method === 'quitWebView') {
      this.call('unRegisterEvent', { eventName: 'viewOnPause' })
    }
  }
}
```