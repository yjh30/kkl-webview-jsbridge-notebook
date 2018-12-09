# 桥接js在业务中的运用
- **精确统计h5页面停留时长**（h5答题时长轮询上报，都应加上对客户端viewOnPause，viewOnResume的处理）

```javascript
// from getDataBury.js
{
  mounted() {
    // 延时针对uiWebview，native端升级为WkWebview后可移除
    setTimeout(() => {
      this.$bridge.$on('viewOnPause', this.viewOnPauseForBury)
      this.$bridge.$on('viewOnResume', this.viewOnResumeForBury)
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

- **英语听口事件交互，记录音频播放状态**
```javascript
const eventNames = ['english_loadingData', 'english_startPlay', 'english_playPause', 'english_playError', 'english_stopPlay']

// vue component
{
  data() {
    return {
      audioStatus: -1 // 1 加载中 2 播放中 3 暂停 4 播放错误 5 播放完毕
    }
  },
  registerEnglishEvent() {
    const fn = (eventName, callback) => {
      this.$bridge.$on(eventName, res => {
        callback && callback(res);
      });
    }
    eventNames.forEach((eventName, i) => {
      fn(eventName, () => {
        this.audioStatus = i + 1
        if (i === 3) {
          Toast({ message: '播放失败', iconClass: 'error' })
        }
      })
    })
  }
}
```

- **大数据埋点 处理WebView onPause 与 onDestroy生命周期的关系**
```javascript
// from bridge.js
export default class extends EventEmitter {
  call() {
    // 由于我们对客户端viewOnPause事件及quitWebView行为都做了埋点请求   // 当quitWebView行为发生时，我们需要移除客户端注册的事件监听，避免二次发送埋点请求
    if(method === 'quitWebView') {
      this.call('unRegisterEvent', { eventName: 'viewOnPause' })
    }
  }
}
```