// pages/newpage/newpage.js
Page({
  data: {
    // 界面所有数据保存的数组
    list: [],
    // 保存上传数据的变量
    cover: 'cloud://env-4gfk5cxm59bbed99.656e-env-4gfk5cxm59bbed99-1300287086/1645071481(1).jpg',//默认
    title: '',
    date: '',
    description:'',
    // flag:0
    //日历里面的一些数据
    show: false,
    minDate: new Date(2022, 0, 1).getTime(),
    maxDate: new Date(2022, 12, 31).getTime()
  },
//显示日历功能
  onDisplay() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  },
  onConfirm(event) {
    this.setData({
      show: false,
      date: this.formatDate(event.detail),
    });
  },

  // 日记题目获取
  gettitle(e) {
    this.setData({
      title: e.detail
    })
  },

  // 日记撰写时间获取
  getdate(e) {
    this.setData({
      date: e.detail.value
    })
  },
  // 日记撰写时间获取
  getdescription(e) {
    this.setData({
      description: e.detail
    })
  },
  // 获取图片并上传
  getphoto() {
    let that = this
    // 获取图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success(res) {
        // 上传图片
        wx.cloud.uploadFile(({

          cloudPath:getApp().globalData.openid+"/cover/"+Date.now(),
          filePath: res.tempFilePaths[0],
          success(res) {
            // console.log('图片上传成功', res)
            console.log('图片上传成功', res.fileID),
              that.setData({
                cover: res.fileID,
                // flag: 1
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
// 新建日记本
  adddiary() {
    let title=this.data.title;
    let date=this.data.date;
    let description=this.data.description;
    let cover=this.data.cover;
    // 判断输入是否为空
    if (title == '') {
      wx.showToast({
        icon: 'none',
        title: '旅行日记名字没输入'
      })
    } else if (date == '') {
      wx.showToast({
        icon: 'none',
        title: '日记创建时间没输入'
      })
    }else if (description == '') {
      wx.showToast({
        icon: 'none',
        title: '旅行日记概述没输入'
      })
    }
    // 不为空则进行添加
    else {
      console.log("添加了一个日记："+title+"-"+date+"-"+description)
      //POST
      wx.request({
        url: 'http://49.232.130.45:8766/addType',//http://localhost:3000/addType
        method: 'POST',
        data: {
          title: title,
          date:date,
          description:description,
          cover:cover,
          openid:getApp().globalData.openid
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          console.log('add success')
        }
      })
      wx.switchTab({
        url: '/pages/share/share'
      })//跳转回share
    }
  },

})