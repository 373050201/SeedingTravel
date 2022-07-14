// miniprogram/pages/dongwu/dongwu.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: '/resources/images/AIPage/animal.png',
    items: null,
  },

  onLoad: function (options) {
  },

  doClickWork: function () {
    var that = this;
    var score = 2;
    //清空数据
    that.setData({
      items: null
    })

    that.selectImage().then(res => {
      console.log("[图片数据]", res);

      that.scanImageInfo(res.data).then(res => {
        console.log("[识别动物]", res);
        if (res.data.result) {
          that.setData({
            items: res.data.result
          })

        } else {
          wx: wx.showToast({
            title: res.data.error_msg,
            icon: 'none',
            mask: true,
          })
        }
        
      })
    })
  },

  //获取本地图片
  selectImage: function () {
    var that = this;
    // 选择图片
    return new Promise(function (resolve, reject) {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: res => {

          console.log("[选择图片]", res);
          that.setData({
            imgPath: res.tempFilePaths[0]
          })

          //获取图片数据
          wx.getFileSystemManager().readFile({
            filePath: res.tempFilePaths[0],
            encoding: "base64",
            success: resolve,
            fail: reject
          })

        },
        fail: reject
      })

    })
  },

  //扫描图片中的数据
  scanImageInfo: function (imageData) {
    var that = this;
    const detectUrl = `https://aip.baidubce.com/rest/2.0/image-classify/v1/animal?access_token=${getApp().globalData.baiduToken}`;

    //显示加载界面
    wx.showLoading({
      title: '加载中',
      mask: true,
    });

    return new Promise(function (resolve, reject) {
      wx.request({
        url: detectUrl,
        data: {
          image: imageData,
          baike_num:5
        },
        method: 'POST',
        dataType: "json",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          //隐藏加载界面
          wx.hideLoading()
          resolve(res);
          that.taskFinish();
        },
        fail: res => {
          wx: wx.showToast({
            title: '忙碌,稍后再试',
            icon: 'none',
            mask: true,
            duration: 2000
          })
          reject(res);
        },
      })
    })
  },

  jumpBaike:function(e){
    var url=e.currentTarget.dataset['url'];
    wx.navigateTo({
      url: '../baike/baike?baike_url=' + url
    })
  },

  taskFinish: function () {
    wx.request({
      url: app.globalData.urlHome + '/task/finishTask',
      header: {
        "accept": "*/*",
        "content-type": "application/json",
        "x-auth-token": app.globalData.token
      },

      data: {
        "openid": app.globalData.openid,
        "type": 6
      },
      method: 'POST',

      success(r) {
        console.log(r.data);
      },
      fail(e) {

      }
    })
  },
})