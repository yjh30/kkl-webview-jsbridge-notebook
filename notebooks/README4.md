# 客户端WebView与js桥接原理
- **Android WebView addJavascriptInterface方法**  
  该方法注册可供JavaScript调用的Java对象，以用于增强JavaScript的功能，需要注意的是在安卓4.2及以上版本中，只有被JavascriptInterface注解过的对象公共的方法才能被JavaScript所访问到，而在安卓4.2以下版本中，被注入的Java对象的所有公共方法都能被JavaScript所访问到，导致攻击者可以利用反射机制调用未注册的其它任何Java类，最终导致JavaScript能力的无限增强。攻击者利用该漏洞可以根据客户端能力为所欲为。  

  **官方示例：**  
```java
  class JsObject {
    @JavascriptInterface
    public String toString() { return "injectedObject"; }
 }

 webview.getSettings().setJavaScriptEnabled(true);
 webView.addJavascriptInterface(new JsObject(), "injectedObject");
 webView.loadData("", "text/html", null);
 webView.loadUrl("javascript:alert(injectedObject.toString())");
```

- **安卓4.2以下版本漏洞解决方案**
```java
webview.loadUrl("javascript:if(window.WebViewBridge === undefined) { window.WebViewBridge = { call: function(jsonString) { window.prompt(jsonString); }}};");
```
在webview中通过loadUrl定义一个window.WebViewBridge及call通用方法，方法体内执行了window.prompt，然后在WebChromeClient类中处理onJsPrompt，设置拦截规则，onJsPrompt返回true，将不处理dialog；[推荐文章](https://mp.weixin.qq.com/s/4XRB7nqTVftL5K2jAMGVVg)

- **与ios交互**  
ios8系统及以上版本可以通过注入  window.webkit.messageHandlers.XXX.postMessage方法，我们可以使用这个方法直接向 Native 层传值，非常方便。  
推荐文章：[postMessage技术](https://lvwenhan.com/ios/461.html) [ios官方webkit网站](https://developer.apple.com/documentation/webkit)  
ios7开始，还可以使用[javascriptcore](https://developer.apple.com/documentation/javascriptcore)注入Java对象到js上下文对象window中  
最后一种 ios也支持URL scheme  
推荐文章：[WKWebview相关](https://www.cnblogs.com/cynthia-wuqian/p/6268359.html)
