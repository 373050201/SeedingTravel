//app.js
App({
  globalData:{
    title:'',
    openid:'',
    thumb_openid:''
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
      env: 'env-4gfk5cxm59bbed99',
        traceUser: true,
      })
    }
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: function (res) {
        getApp().globalData.openid = res.result.openid
        console.log('GET!!!!!!!')   
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  }
  
})
