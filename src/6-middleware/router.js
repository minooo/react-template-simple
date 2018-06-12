// import { isAndroid, GetApi } from '../utils'
// import { setConfig } from '../utils/wxapi'

export default () => next => (action) => {
    if (action.type === '@@router/LOCATION_CHANGE') {
      console.info('路由变化了哦！')
      // if (isAndroid()) {
      //   GetApi('/wxconfig', { url: encodeURIComponent(window.location.href) }).then((data) => {
      //     if (data.wxconfig) {
      //       setConfig(data.wxconfig)
      //     }
      //   })
      // }
    }
    return next(action)
  }
  