export default function(bridge) {
  if (typeof window !== 'undefined') {
    const definedFn = window.JavaScript_HandleNativeBackAction

    // 处理安卓返回键
    window.JavaScript_HandleNativeBackAction = () => {
      try {
        definedFn && definedFn()
      } catch (e) {
        console.log(e)
      }

      bridge.emit('androidBackKey')
    }
  }
}
