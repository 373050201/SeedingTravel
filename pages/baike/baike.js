// pages/baike/baike.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        condition:'false',
        url:"呜呜暂时未找到本物的百科介绍，换一个看看吧！",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that=this;
        console.log(options)
        if(!options.baike_url||options.baike_url=="undefined"){
            this.setData({
                condition:true
            })
        }
        else{
            var tmpUrl=options.baike_url;
            var Url="https://"+tmpUrl.substr(7);
            this.setData({
                condition:false,
                baike_url: Url
            })
            console.log(this.data.condition)
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

    },
})