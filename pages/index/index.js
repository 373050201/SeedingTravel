//index.js
const app = getApp()
const db=wx.cloud.database()
//loading 时禁止跳转
Page({
  data: {
    loadding:0,
    current:0,
    temppics:["https://img.zcool.cn/community/01c807554b60cb000001bf7221cfec.jpg@1280w_1l_2o_100sh.jpg",
  "https://img95.699pic.com/photo/50073/5515.jpg_wh860.jpg","https://656e-env-4gfk5cxm59bbed99-1300287086.tcb.qcloud.la/570ef24b719cb.jpg?sign=0ab8da438e53f49c463b4ad8eb6a74ac&t=1649754119","https://656e-env-4gfk5cxm59bbed99-1300287086.tcb.qcloud.la/5a16b676e0cd8.jpg?sign=746cb106a83ffe9b157998d12e6c0cd0&t=1649754313"],
  animationData: {},
  animationData2: {},
  cards:[{image:"https://img1.baidu.com/it/u=1100380860,1837934547&fm=253&fmt=auto&app=138&f=JPEG?w=354&h=500",avatar:"https://img0.baidu.com/it/u=1461158162,3281682659&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400",name:"梅西",like:3020,liked:1,title:"北京之旅",brief:"不愧是首都，很不错"},{image:"https://img2.baidu.com/it/u=3982174126,1902966137&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889",avatar:"https://img0.baidu.com/it/u=325674188,3280397254&fm=253&fmt=auto&app=138&f=JPEG?w=501&h=500",name:"虎哥",like:920,liked:0,title:"上海之旅",brief:"风景很美，我很喜欢。"},{image:"https://img1.baidu.com/it/u=1100380860,1837934547&fm=253&fmt=auto&app=138&f=JPEG?w=354&h=500",avatar:"https://img0.baidu.com/it/u=1461158162,3281682659&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400",name:"化工厂",like:3020,liked:1,title:"美国之旅",brief:"疫情很严重，还是不要去了"},{image:"https://img2.baidu.com/it/u=3982174126,1902966137&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889",avatar:"https://img0.baidu.com/it/u=325674188,3280397254&fm=253&fmt=auto&app=138&f=JPEG?w=501&h=500",name:"虎哥",like:920,liked:0,title:"上海之旅",brief:"风景很美，我很喜欢。"}],
  cardsL:[],
  cardsR:[],
  diaryList:[]
  },
  onShow() {
    this.getlist()
    console.log('[云函数] [login] user openid: ', getApp().globalData.openid)   
  },
  onLoad: function() { 
    
    this.stretch(180)
    
    this.shrink(120)

    this.appendcards()
   
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
        openid:getApp().globalData.openid,
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

whichHigher: function(){
    return new Promise((res,rej)=>{
      let query = wx.createSelectorQuery();
      let query1 = wx.createSelectorQuery();
      query.select('.foot-left').boundingClientRect(rectLeft=>{
        query1.select('.foot-right').boundingClientRect(rectRight=>{
        //返回该在哪里添加：‘左’‘右’的字符串
        
        rectLeft.height<=rectRight.height?res('left'):res('right')
      }).exec();
      
    } ).exec();
    })
  },
appendcards(){
  let _this=this; //存储外部的this，用于获取外部的方法whichHigher，以及data内的数据
  _this.setData({loading:1})
  let index=0; //定义判断递归的初始变量
  let cards=this.data.cards;
  let left = _this.data.cardsR;
  let right = _this.data.cardsL;
 
  (function showData(){ //此方法实现了渲染数据的分类，并实时渲染
    _this.whichHigher().then(res=>{  //此处res携带的是promise对象返回的左或右的字符串
          
          /*根据较短列，放置图文数据*/
          if(res==='left'){ // 放在左边的数据里
            left.push(cards[index]);
          }
          else if(res==='right'){ // 放在右边的数据里
            right.push(cards[index]);
          }
          else{
            console.log("代码出错了")
          }
          /*实时渲染*/
         
          _this.setData(  {
            cardsL:left,
            cardsR:right
          })
          /*进行递归*/
          index++; //递归条件自增   
           
          if(index<cards.length)
          {showData()}
          else
          {
            _this.setData({loading:0})

          }; //递归终止判断
        })
  })() //匿名函数自执行
},
  


  change(e){ 
    this.setData({
     
      current: e.detail.current
    })

  },
  stretch(h){
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.height(h).width(h+200).step()
 
    this.setData({
      animationData: animation.export(),
    })
  },
  // 展开
  shrink(h){
    var animation2 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation2 = animation2
    animation2.height(h).width(h).step()
    
    this.setData({
      animationData2: animation2.export()
    })
  },

jumpToMore(e){
  wx.navigateTo({
    url: '../community/community'
  })
},
jumpToCM(){
  wx.navigateTo({
    url: '../community/community'
  })
},
jumpToMap(){
  wx.navigateTo({
    url: '../Map/map'
  })
}
,jumpToHot:function(){
  if (this.data.loading===0){
    wx.navigateTo({
    url: '../hot/hot'
  })}

},
})
