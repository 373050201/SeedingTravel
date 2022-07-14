import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
var util=require('../../utils/util.js')
const db = wx.cloud.database()
Page({
  data: {
    diaryList:[],
    communityList:[]
  },
  onShow() {
    this.getlist()
    console.log('[云函数] [login] user openid: ', getApp().globalData.openid)   
  },

   getlist(){
    //GET
    let that=this
    wx.request({
      url: 'http://49.232.130.45:8766/getType',
      method: 'GET',
      data: {
        openid:getApp().globalData.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          diaryList:res.data
        })
        console.log(that.data.diaryList);
      }
    })
    wx.request({
      url: 'http://49.232.130.45:8769/getType',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          communityList:res.data
        })
      }
    })
  },

  godetail(e) {
    getApp().globalData.title=e.currentTarget.dataset.title;
    wx.navigateTo({
       url: '/pages/my_diary/my_diary',
     })
     console.log("跳转至 "+e.currentTarget.dataset.title);
  },

  gototianjia(){
    wx.navigateTo({
      url: '/pages/newpage/newpage'
    })
  },

  deleteDairy(e){
    Dialog.confirm({
      title: '确认删除',
      message: '是否删除该日记本',
    })
      .then(() => {
      wx.request({
      url: 'http://49.232.130.45:8766/deleteType',
      method: 'POST',
      data: {
        openid:getApp().globalData.openid,
        title: e.currentTarget.dataset.title,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log('delete success')
      }
    })
    this.onShow();//刷新
        // on confirm
      })
      .catch(() => {
        // on cancel
      });

  },
// 分享功能按键
  share(e){
    Dialog.confirm({
      title: '确认分享 ',
      message: '是否分享这本日记到社区',
    })
      .then(() => {
        var isExist=0;
        //遍历communityList，若存在此项则不重复添加
        for(var i=0;i<this.data.communityList.length;i++)
        {
          if(getApp().globalData.openid==this.data.communityList[i].openid
              &&e.currentTarget.dataset.title==this.data.communityList[i].title)
              {
                console.log("已存在！！！")//这里前端换成一个提示框，注明存在
                isExist=1;
                break;
              }
        }
        if(isExist==0)
        {
          var date=util.formatTime(new Date())
          wx.request({
            url: 'http://49.232.130.45:8769/addType',
            method: 'POST',
            data: {
              openid:getApp().globalData.openid,
              title: e.currentTarget.dataset.title,
              share_time:date
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res) {
              console.log('add success')
            }
          })
        }
      })
      .catch(() => {
        // on cancel
      });
  }
})

