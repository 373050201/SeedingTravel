import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
var util=require('../../utils/util.js')
Page({
  data: {
    thumb_state:false,
    detailList:[],
    pictureList:[],
    commentList:[],
    userOpenid:'',
    title:'',
    content:''
  },

  onShow(){
    this.setData({
      title:getApp().globalData.title,
      userOpenid:getApp().globalData.openid
    })
    this.getList();
  },

  getList(){
     //GET
     let that=this
     let title=this.data.title
     wx.request({
       url: 'http://49.232.130.45:8767/getType',
       method: 'GET',
       data: {
         title:title,
         openid:getApp().globalData.thumb_openid//view_openid
       },
       header: {
         'content-type': 'application/x-www-form-urlencoded'
       },
       success(res) {
         that.setData({
           detailList:res.data
         })
         console.log(that.data.detailList);
         that.getPic();
       }
     })
     wx.request({
      url: 'http://49.232.130.45:8772/getType',
      method: 'GET',
      data: {
        comment_title:title,
        comment_openid:getApp().globalData.thumb_openid//view_openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          commentList:res.data
        })
        console.log(that.data.commentList);
      }
    })
    wx.request({
      url: 'http://49.232.130.45:8771/getType',
      method: 'GET',
      data: {
        openid:getApp().globalData.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        //遍历，若在thumb表查到点赞记录，则设置thumb_state为true，否则为false
        for(var i=0;i<res.data.length;i++)
        {
          if(that.data.title==res.data[i].thumb_title
            &&getApp().globalData.thumb_openid==res.data[i].thumb_openid)
            {
              that.setData({
                thumb_state:true
              })
              break;
            }
        }
      }
    })
  },

  getPic(){
    let title=this.data.title
    let that=this;
    wx.request({
      url: 'http://49.232.130.45:8768/getType',
      method: 'GET',
      data: {
        title:title,
        openid:getApp().globalData.thumb_openid//view_openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          pictureList:res.data
        })
        console.log(that.data.pictureList)
        that.merge();
      }
    })
  },

  //合并picture入detail对应属性
  merge(){
    for(var i=0;i<this.data.detailList.length;i++)
    {
      let list=[];//临时数组存储pic
      for(var j=0;j<this.data.pictureList.length;j++)
      {
        if(this.data.detailList[i].destination==this.data.pictureList[j].destination)
        {
          list.push(this.data.pictureList[j].pic)
        }
      }
      this.setData({
        [`detailList[${i}].pic`]:list
      })
    }
    console.log(this.data.detailList)
  },

  thumb_add(){
    wx.request({
      url: 'http://49.232.130.45:8771/addType',
      method: 'POST',
      data: {
        openid:getApp().globalData.openid,
        thumb_title: this.data.title,//getApp().globalData.title
        thumb_openid:getApp().globalData.thumb_openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log('add successs')
      }
    })
    wx.request({
      url: 'http://49.232.130.45:8769/updateType_thumb',
      method: 'POST',
      data: {
        openid:getApp().globalData.thumb_openid,
        title: this.data.title,//getApp().globalData.title
        delta:1//add
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log('update successs')
      }
    })
    this.setData({
      thumb_state:true
    })
    this.onShow();
  },

  thumb_reduce(){
    wx.request({
      url: 'http://49.232.130.45:8771/deleteType',
      method: 'POST',
      data: {
        openid:getApp().globalData.openid,
        thumb_title: this.data.title,//getApp().globalData.title
        thumb_openid:getApp().globalData.thumb_openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log('delete successs')
      }
    })
    wx.request({
      url: 'http://49.232.130.45:8769/updateType_thumb',
      method: 'POST',
      data: {
        openid:getApp().globalData.thumb_openid,
        title: this.data.title,//getApp().globalData.title
        delta:-1//reduce
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log('update successs')
      }
    })
    this.setData({
      thumb_state:false
    })
    this.onShow();
  },
  comment(){
  Dialog.confirm({
    title: '确认评论',
    message: '是否发送该评论',
  })
    .then(() => {
      // on confirm
      var time=util.formatTime(new Date())
      console.log("已发送评论："+this.data.content)
      wx.request({
        url: 'http://49.232.130.45:8772/addType',
        method: 'POST',
        data: {
          openid:getApp().globalData.openid,
          time:time,
          comment_title:this.data.title,
          comment_openid:getApp().globalData.thumb_openid,
          content:this.data.content
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          console.log('add successs')
        }
      })
      wx.request({
        url: 'http://49.232.130.45:8769/updateType_comment',
        method: 'POST',
        data: {
          openid:getApp().globalData.thumb_openid,//comment_openid
          title: this.data.title,//getApp().globalData.title
          delta:1//add
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          console.log('update successs')
        }
      })
      this.onShow();
    })
    .catch(() => {
      // on cancel
    });
},
  del_com(e){
  Dialog.confirm({
    title: '确认删除',
    message: '是否删除该评论',
  })
    .then(() => {
      wx.request({
        url: 'http://49.232.130.45:8772/deleteType',
        method: 'POST',
        data: {
          openid:e.currentTarget.dataset.openid,
          comment_title:this.data.title,
          comment_openid:getApp().globalData.thumb_openid,
          time:e.currentTarget.dataset.time
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          console.log('delete successs')
        }
      })
      wx.request({
        url: 'http://49.232.130.45:8769/updateType_comment',
        method: 'POST',
        data: {
          openid:getApp().globalData.thumb_openid,//comment_openid
          title: this.data.title,//getApp().globalData.title
          delta:-1//reduce
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          console.log('update successs')
        }
      })
      this.onShow();
    })
    .catch(() => {
      // on cancel
    });
  },
  getContent(e)
  {
    this.setData({
      content:e.detail.value
    })
  }
})