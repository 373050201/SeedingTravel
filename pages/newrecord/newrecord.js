// pages/newrecord/newrecord.js
Page({
  data: {
    list: [],
    // 保存上传数据的变量
    title:'',
    destination:'',
    classification:'',
    date: '',
    content:'',
    // flag:0
    show: false,
    actions: [
      {name: '景区'},
      {name: '商场'},
      {name: '饭店'},
      {name: '旅馆'},
      {name: '街道'},
      {name: '学校'},
    ],
    show2: false,
    minDate: new Date(2022, 0, 1).getTime(),
    maxDate: new Date(2022, 12, 31).getTime()
  },
  
  onShow(){
    this.setData({
      title:getApp().globalData.title
    })
  },
  ontap(){
this.setData({
  show:true
})
},
onClose() {
  this.setData({ show: false });
},
  getDestination(e){
    this.setData({
      destination:e.detail
    })
  },

  getClassification(e){
    this.setData({
      classification:e.detail.name,
      value2:e.detail.name
    })
  },
  onDisplay() {
    this.setData({ show2: true });
  },
  onClose2() {
    this.setData({ show2: false });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日`;
  },
  onConfirm(event) {
    this.setData({
      show2: false,
      date: this.formatDate(event.detail),
    });
  },

  getDate(e){
    this.setData({
      date:e.detail.value
    })
  },

  getContent(e){
    this.setData({
      content:e.detail
    })
  },

  addDetail() {
    let title=this.data.title;
    let destination=this.data.destination;
    let classification=this.data.classification;
    let date=this.data.date;
    let content=this.data.content;
    // 判断输入是否为空
    if (destination == '') {
      wx.showToast({
        icon: 'none',
        title: '目的地未输入'
      })
    } else if (classification == '') {
      wx.showToast({
        icon: 'none',
        title: '分类未输入'
      })
    }else if (date == '') {
      wx.showToast({
        icon: 'none',
        title: '前往日期未输入'
      })
    }else if (content == '') {
      wx.showToast({
        icon: 'none',
        title: '评价和感想未输入'
      })
    }
    // 不为空则进行添加
    else {
      console.log("添加了一个细节："+title+"-"+destination+"-"+classification+"-"+date+"-"+content)
      //POST
      wx.request({
        url: 'http://49.232.130.45:8767/addType',
        method: 'POST',
        data: {
          openid:getApp().globalData.openid,
          title:title,
          destination:destination,
          classification:classification,
          date:date,
          content:content
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          console.log('add success')
        }
      })
      wx.navigateTo({
        url: '/pages/my_diary/my_diary'
      })//跳转回my_dairy
    }
  },
 // 获取图片并上传
 getPhoto() {
  let that = this
  // 获取图片
  wx.chooseImage({
    count: 1,
    sizeType: ['compressed', 'original'],
    sourceType: ['album', 'camera'],
    success(res) {
      // 上传图片
      wx.cloud.uploadFile(({
        cloudPath: getApp().globalData.openid+"/picture/"+Date.now(),
        filePath: res.tempFilePaths[0],
        success(res) {
          // console.log('图片上传成功', res)
          console.log('图片上传成功', res.fileID),
            wx.request({
              url: 'http://49.232.130.45:8768/addType',
              method: 'POST',
              data: {
                openid:getApp().globalData.openid,
                title: that.data.title,
                destination:that.data.destination,
                pic:res.fileID
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success(res) {
                console.log('add success')
              }
            })
          wx.showToast({
            title: '照片添加成功',
          })
          that.getnew()
        },
        fail(res) {
          console.log('图片上传失败', res)
        }
      }))
    }
  })
},

})