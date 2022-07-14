import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({
  data: {
    detailList:[],
    pictureList:[],
    title:''
  },

  onShow(){
    this.setData({
      title:getApp().globalData.title
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
         openid:getApp().globalData.openid
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
  },

  getPic(){
    let title=this.data.title
    let that=this;
    wx.request({
      url: 'http://49.232.130.45:8768/getType',
      method: 'GET',
      data: {
        title:title,
        openid:getApp().globalData.openid
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

  gototianjia(){
    wx.navigateTo({
      url: '/pages/newrecord/newrecord',
    })
  },

  deleteDetail(e){
    Dialog.confirm({
      title: '确认删除',
      message: '是否删除该记录',
    })
      .then(() => {
            wx.request({
      url: 'http://49.232.130.45:8767/deleteType',
      method: 'POST',
      data: {
        openid:getApp().globalData.openid,
        title: e.currentTarget.dataset.title,
        destination:e.currentTarget.dataset.destination
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log('delete success')
      }
    })
    console.log("已删除此detail:"+e.currentTarget.dataset.title+"-"
    +e.currentTarget.dataset.destination)
    this.onShow();// on confirm
      })
      .catch(() => {
        // on cancel
      });

  },

})