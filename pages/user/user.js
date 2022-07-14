// pages/user/user.js

var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    headerPic: "http://picture.ik123.com/uploads/allimg/180917/12-1P91G41302.jpg",
    scrollheight: 0,
    listHeight1: 0,
    listHeight1: 0,
    listHeight2: 1000,
    user: {
      avatar: "https://img0.baidu.com/it/u=4049826530,2181649644&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
      nickname: "用户",
      follow: 0,
      members: 0,
      description: "点击头像获取信息"
    },
    choose: 0,
    shareCards: [{
      title: "暂无",
    }],
    collectCards: [{
      title: "暂无",
    }]
  },

  onShow: function () {
    var that=this
    wx.request({
      url: 'http://49.232.130.45:8769/getByMe',
      method: 'GET',
      data:{
        openid:app.globalData.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          shareCards:res.data
        })
        console.log(res.data)
      }
    })
    wx.request({
      url: 'http://49.232.130.45:8771/getByMe',
      method: 'GET',
      data:{
        openid:app.globalData.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          collectCards:res.data
        })
        console.log(res.data)
      }
    })
    wx.request({
      url: 'http://49.232.130.45:8770/getType',
      method: 'GET',
      data:{
        openid:getApp().globalData.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          [`user.nickname`]:res.data[0].nickname,
          [`user.avatar`]:res.data[0].avatar_url
        })
      }
    })
  },

  change: function (e) {
      let current = e.detail.current;
      this.setData({
        choose: current
      })

      if (!current) {
        let query1 = wx.createSelectorQuery()
        query1.select('.list1').boundingClientRect(rect => {

          this.setData({
            listHeight1: rect.height
          })
        }).exec()
      } else {
        let query1 = wx.createSelectorQuery()
        query1.select('.list2').boundingClientRect(rect => {

          this.setData({
            listHeight2: rect.height
          })
        }).exec()
      }
    }

    ,
  /**
   * 生命周期函数--监听页面加载
   */


  setUserInfoAndNext(res) {
    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    if (this.userInfoReadyCallback) {
      this.userInfoReadyCallback(res)
    }
    wx.hideLoading()
    // 跳转首页
    app.globalData.userInfo=res.userInfo
    if(this.data.user.avatar=='https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132')
    {
      wx.request({
        url: 'http://49.232.130.45:8770/addType',
        method: 'POST',
        data: {
          openid:getApp().globalData.openid,
          nickname: res.userInfo.nickName,
          avatar_url:res.userInfo.avatarUrl
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          console.log('add success')
        }
      })
      this.setData({
        ['user.avatar']:res.userInfo.avatarUrl,
        ['user.nickname']:res.userInfo.nickName
    })
    }
  },
  setting(e){
    wx.showLoading({
      title: '授权中'
    })
    wx.getSetting({
      success: res => {
        
        if (res.authSetting['scope.userInfo'] === true) { // 成功授权
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserProfile({desc: '展示用户信息',
            success: res => {
              console.log(res)
              this.setUserInfoAndNext(res)
            },
            fail: res => {
              console.log(res)
            }
          })

        } else if (res.authSetting['scope.userInfo'] === false) { // 授权弹窗被拒绝
          wx.openSetting({
            success: res => {
              console.log(res)
            },
            fail: res => {
              console.log(res)
            }
          })
        } else { // 没有弹出过授权弹窗
          wx.getUserInfo({
            success: res => {
              console.log(res)
              this.setUserInfoAndNext(res)
            },
            fail: res => {
              console.log(res)
              wx.openSetting({
                success: res => {
                  console.log(res)
                },
                fail: res => {
                  console.log(res)
                }
              })
            }
          })
        }
      }
    })
  },
  onLoad: function () {
//paiban
    let query = wx.createSelectorQuery()
    wx.getSystemInfo({
      success: resp => {
        query.selectAll('.scroll').boundingClientRect(rect => {
          let height = rect[0].top
          console.log(resp.windowHeight);
          this.setData({
            scrollheight: resp.windowHeight - height
          })
        }).exec();
        let query1 = wx.createSelectorQuery()
        query1.select('.list1').boundingClientRect(rect => {

          this.setData({
            listHeight1: rect.height
          })
        }).exec()
      }
    })


  },
})