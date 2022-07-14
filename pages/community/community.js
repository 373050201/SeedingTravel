// pages/share/share.js path/to/@vant/weapp/dist/dialog/dialog
const db = wx.cloud.database()
Page({
  data: {
    diaryList:[]
  },
  onShow() {
    this.getlist()
    console.log('[云函数] [login] user openid: ', getApp().globalData.openid)   
  },

   getlist(){
    //GET
    let that=this
    wx.request({
      url: 'http://49.232.130.45:8769/getType',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          diaryList:res.data
        })
        console.log(res.data);
      }
    })
  },

  godetail(e) {
    getApp().globalData.title=e.currentTarget.dataset.title;
    getApp().globalData.thumb_openid=e.currentTarget.dataset.thumb_openid
    wx.navigateTo({
       url: '/pages/cm_detail/cm_detail',
     })
     console.log("跳转至 "+e.currentTarget.dataset.title);
     wx.request({
      url: 'http://49.232.130.45:8769/updateType_view',
      method: 'POST',
      data: {
        openid:e.currentTarget.dataset.openid,
        title: e.currentTarget.dataset.title,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log('update successs')
      }
    })
  },


})