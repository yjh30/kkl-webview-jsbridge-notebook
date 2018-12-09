# Native WebView桥接js的使用
- **h5与客户端新WebViewActivity交互图**
![avatar](../asserts/interaction.png)

- **js bridge 模块代码维护目录**  
h5 spa项目：koa-kkl-h5/src/common/utils/bridge/index.js  
h5 活动页：kkl-js-bridge/src/bridge/index.js  
cdn地址：[http://static.kaike.la/fe/libs/jsBridge.js](http://static.kaike.la/fe/libs/jsBridge.js)

- **普通方法的使用**
```javascript

// 调用客户端方法，如果需要用到客户端返回值，支持Promise语法进行处理

// es6 语法：
this.$bridge.call(methodName, params)
  .then(res => {
    // doSomething
  })

// es5语法，需要单独在页面中引用jsBridge.js cdn地址
// es5 语法：
window.KKLBridge.call(methodName, params)
  .then(function(res) {
    // doSomething
  })
```

- **事件交互的使用**
```javascript
{
  mounted() {
    // 监听native端viewOnPauses事件
    this.$bridge.$on('viewOnPause', this.viewOnPauseListener)
  },

  // 页面离开之前应该
  beforeRouteLeave(to, from, next) {
    // 移除针对native端viewOnPause事件监听器
    this.$bridge.$off('viewOnPause', this.viewOnPauseListener)
  }
}
```

- **Android返回键对路由的处理**
```javascript
// 点击安卓物理返回键native端执行JavaScript_HandleNativeBackAction全局函数
window.JavaScript_HandleNativeBackAction = () => {
  this.$bridge.emit('androidBackKey')
}

// from NavigationBar.vue
// NavigationBar.vue 设计思路：点击左上角返回按钮，点击安卓物理返回键执行this.to回调函数
{
  mounted() {
    if (this.$bridge) {
      this.$bridge.removeListener('androidBackKey', this.androidBackKeyListener)
      this.$bridge.on('androidBackKey', this.androidBackKeyListener)
    }
  }，
  methods: {
    androidBackKeyListener() {
      this.slide(this.to)
    }
  }
}
```

