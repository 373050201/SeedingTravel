// pages/hot/hot.js
Page({

  /**
   * 页面的初始数据
   */
  data: {cityNum:0,
    city:[{name:"北京",text:"首都都市生活真他妈的好",pic:"https://pic2.zhimg.com/8abdbec44411df9539f90c5af2b027a1_1200x500.jpg"},{name:"北京",text:"首都都市生活",pic:"https://pic2.zhimg.com/8abdbec44411df9539f90c5af2b027a1_1200x500.jpg",select:0},{name:"北京",text:"首都都市生活",pic:"https://pic2.zhimg.com/8abdbec44411df9539f90c5af2b027a1_1200x500.jpg"},{name:"北京",text:"首都都市生活",pic:"https://pic2.zhimg.com/8abdbec44411df9539f90c5af2b027a1_1200x500.jpg",select:0},{name:"北京",text:"首都都市生活",pic:"https://pic2.zhimg.com/8abdbec44411df9539f90c5af2b027a1_1200x500.jpg"},{name:"北京",text:"首都都市生活",pic:"https://pic2.zhimg.com/8abdbec44411df9539f90c5af2b027a1_1200x500.jpg",select:0},{name:"北京",text:"首都都市生活",pic:"https://pic2.zhimg.com/8abdbec44411df9539f90c5af2b027a1_1200x500.jpg"},{name:"北京",text:"首都都市生活",pic:"https://pic2.zhimg.com/8abdbec44411df9539f90c5af2b027a1_1200x500.jpg",select:0},{name:"北京",text:"首都都市生活",pic:"https://pic2.zhimg.com/8abdbec44411df9539f90c5af2b027a1_1200x500.jpg",select:0},{name:"北京",text:"首都都市生活",pic:"https://pic2.zhimg.com/8abdbec44411df9539f90c5af2b027a1_1200x500.jpg",select:0},{name:"北京",text:"首都都市生活真他妈的好",pic:"https://pic2.zhimg.com/8abdbec44411df9539f90c5af2b027a1_1200x500.jpg"},{name:"北京",text:"首都都市生活",pic:"https://pic2.zhimg.com/8abdbec44411df9539f90c5af2b027a1_1200x500.jpg",select:0},{name:"北京",text:"首都都市生活",pic:"https://pic2.zhimg.com/8abdbec44411df9539f90c5af2b027a1_1200x500.jpg"},{name:"北京",text:"首都都市生活",pic:"https://pic2.zhimg.com/8abdbec44411df9539f90c5af2b027a1_1200x500.jpg",select:0},{name:"北京",text:"首都都市生活",pic:"https://pic2.zhimg.com/8abdbec44411df9539f90c5af2b027a1_1200x500.jpg"},{name:"北京",text:"首都都市生活",pic:"https://pic2.zhimg.com/8abdbec44411df9539f90c5af2b027a1_1200x500.jpg",select:0},{name:"北京",text:"首都都市生活",pic:"https://pic2.zhimg.com/8abdbec44411df9539f90c5af2b027a1_1200x500.jpg"},{name:"北京",text:"首都都市生活",pic:"https://pic2.zhimg.com/8abdbec44411df9539f90c5af2b027a1_1200x500.jpg",select:0},{name:"北京",text:"首都都市生活",pic:"https://pic2.zhimg.com/8abdbec44411df9539f90c5af2b027a1_1200x500.jpg",select:0},{name:"北京",text:"首都都市生活",pic:"https://pic2.zhimg.com/8abdbec44411df9539f90c5af2b027a1_1200x500.jpg",select:0}]
    ,list:[]

  },
  return:function(){
    wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  check:function (e) {
    let index= e.currentTarget.dataset.id
    
    let city=this.data.city
    city[index].select=! city[index].select
    this.setData({city:city
    })
  },
  onLoad: function (options) {
    let list=[]
    let cityNum=this.data.city.length
    for (let i=0;i<cityNum;i+=9){
      list.push(i)
    }
   
    this.setData({cityNum:cityNum,list:list
    })
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})