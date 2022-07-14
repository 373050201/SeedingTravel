// pages/Map/map.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
const app = getApp()

Page({
  data: {
    scroll:true,
    height: 'auto',
    placeName: '',
    viewTop: -150,
    startPoint: [0, 0],
    mask: true,
    points:[]
  },

  onLoad: function () {
    var that = this
    //调用wx.getSystemInfo接口，然后动态绑定组件高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      }

    });

    qqmapsdk = new QQMapWX({
      key: 'RTNBZ-OVFKJ-XNRFE-FRCX3-N2LIV-EQBWJ'
    });

    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      //定位成功，更新定位结果      
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        that.setData({ //赋值
          longitude: longitude,
          latitude: latitude,
          Mylongitude:longitude,
          Mylatitude:latitude,
          speed: speed,
          accuracy: accuracy
        })
        app.globalData.latitude = latitude;
        app.globalData.longitude = longitude;
      }, //定位失败回调      
      fail: function () {
        wx.hideLoading();
        console.log("getLocationFail")
      },
      complete: function () {
        //隐藏定位中信息进度       
        wx.hideLoading()
      }
    })

    that.getBaiduTaken();

  },

  nearby_search: function (name) {
    var _this = this;
    var loc = [this.data.latitude, this.data.longitude]
    // 调用接口
    qqmapsdk.search({
      keyword: name, //搜索关键词
      location: loc.toString(), //设置周边搜索中心点
      success: function (res) { //搜索成功后的回调
        var mks = []
        for (var i = 0; i < res.data.length; i++) {
          mks.push({ // 获取返回结果，放到mks数组中
            title: res.data[i].title,
            id: res.data[i].id,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng,
            iconPath: "/resources/images/mapPage/pos.png", //图标路径
            width: 45,
            height: 50
          })
        }
        _this.setData({ //设置markers属性，将搜索结果显示在地图中
          markers: mks
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },

  placeInput: function (e) {
    this.setData({
      placeName: e.detail.value
    });
  },

  onSearch: function () {
    console.log("Searching...");
    var that = this;
    var name = that.data.placeName;
    console.log(name);
    if (name == '') {
      that.setData({
        markers: null
      })
    } else {
      that.nearby_search(name);
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    var pic=app.globalData.pic;
    //console.log(pic);
    if(pic==null || pic=="undefined"){
      return ;
    }

    var mks = []
    var points = [];
    mks.push({ // 获取返回结果，放到mks数组中
      title: pic.name,
      id: pic.id,
      latitude: pic.latitude,
      longitude: pic.longitude,
      iconPath: "/resources/images/mapPage/pos.png", //图标路径
      width: 45,
      height: 50
    })

    points.push({
      latitude: pic.latitude,
      longitude: pic.longitude
    })

    points.push({
      latitude: _this.data.Mylatitude,
      longitude:_this.data.Mylongitude
    })

    _this.setData({
      markers:mks,
      points:points,
    })

    app.globalData.pic=null;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      markers: null
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    wx.request({
      url: app.globalData.urlHome + '/task/finishTask',
      header: {
        "accept": "*/*",
        "content-type": "application/json",
        "x-auth-token": app.globalData.token
      },

      data: {
        "openid": app.globalData.openid,
        "type": 9
      },
      method: 'POST',

      success(r) {
        console.log(r.data);
      },
      fail(e) {

      }
    })
  },

  mytouchstart: function (e) {
    this.setData({
      startPoint: [e.touches[0].pageX, e.touches[0].pageY],
      scroll:false
    })
  },

  mytouchmove: function (e) {
   
    var curPoint = [e.touches[0].pageX, e.touches[0].pageY];
    var startPoint = this.data.startPoint;

    var addValue = Math.abs(curPoint[1] - startPoint[1]) * 1.05;

    if (curPoint[0] <= startPoint[0]) {
      if (Math.abs(curPoint[0] - startPoint[0]) >= Math.abs(curPoint[1] - startPoint[1])) {
        //console.log(e.timeStamp+"-touch left move");
      } else {
        if (curPoint[1] >= startPoint[1]) {
          //console.log(e.timeStamp+"-touch down move");
          if (this.data.viewTop >= -150) {
            return;
          }
          var viewTop = this.data.viewTop;
          var resTop = viewTop + addValue;
          this.setData({
            viewTop: resTop
          })
        } else {
          //console.log(e.timeStamp+"-touch up move");
          if (this.data.viewTop <= -500) {
            return;
          }
          var viewTop = this.data.viewTop;
          var resTop = viewTop - addValue;
          this.setData({
            viewTop: resTop
          })
        }
      }
    } else {
      if (Math.abs(curPoint[0] - startPoint[0]) >= Math.abs(curPoint[1] - startPoint[1])) {
        //console.log(e.timeStamp+"-touch right move");
      } else {
        if (curPoint[1] >= startPoint[1]) {
          //console.log(e.timeStamp+"-touch down move");
          if (this.data.viewTop >= -150) {
            return;
          }
          var viewTop = this.data.viewTop;
          var resTop = viewTop + addValue;
          this.setData({
            viewTop: resTop
          })
        } else {
          //console.log(e.timeStamp+"-touch up move");
          if (this.data.viewTop <= -500) {
            return;
          }
          var viewTop = this.data.viewTop;
          var resTop = viewTop - addValue;
          this.setData({
            viewTop: resTop
          })
        }
      }
    }

    startPoint[0] = curPoint[0];
    startPoint[1] = curPoint[1];
  },

  mytouchend: function () {
    var viewTop = this.data.viewTop;
    if (viewTop <= -370) {
      while (viewTop > -500) {
        var lastvalue = this.data.viewTop;
        this.setData({
          viewTop: lastvalue - 1.8
        })
        viewTop = this.data.viewTop;
      }

    } else {
      while (viewTop < -150) {
        var lastvalue = this.data.viewTop;
        this.setData({
          viewTop: lastvalue + 1.8
        })
        viewTop = this.data.viewTop;
      }
    }
    this.setData({
      scroll:true
    })
  },

  stopTouch: function () {},

  goTohuacao: function () {
    wx.navigateTo({
      url: '/pages/zhiwu/zhiwu',
    })
  },

  goToshumu: function () {
    wx.navigateTo({
      url: '/pages/zhiwu/zhiwu',
    })
  },

  goTodongwu: function () {
    wx.navigateTo({
      url: '/pages/dongwu/dongwu',
    })
  },

  goTogoods: function () {
    wx.navigateTo({
      url: '/pages/wupin/wupin',
    })
  },

  goToGuider: function () {
    wx.navigateTo({
      url: '/pages/guiderHelp/guider',
    })
  },

  //获取百度taken
  getBaiduTaken: function () {
    const tokenUrl = "https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=Ea23fRADac6dMhOxQxbBaphV&client_secret=1Q5vQ2K5qrbL69a4EcPyu8reUSEKXvSp";

    var that = this;
    wx.request({
      url: tokenUrl,
      method: 'POST',
      dataType: "json",
      header: {
        'content-type': 'application/json; charset=UTF-8'
      },
      success: function (res) {
        if (!res.data.access_token) {
          console.log("【getBaiduTaken提示失败,无效的id&key】");
        } else {
          console.log("【getBaiduTaken成功】");
          getApp().globalData.baiduToken = res.data.access_token
        }
      },
      fail: function (res) {
        console.log("【getBaiduTaken提示失败】", res);
      }
    })
  },

  voiceHelp:function(){
    wx.showToast({
      title: '功能暂未开放',
      icon: 'error'
    });
  }
})

export function delay(milSec) {
  return new Promise(resolve => {
    setTimeout(resolve, milSec)
  })
}