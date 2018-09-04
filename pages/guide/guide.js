//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    //在没有open-type="getUserInfo"做兼容处理
    wx.getUserInfo({
      success: res => {
        wx.request({
          url: 'http://wechat-server.com/api/bind',
          method: 'POST',
          data: {
            encryptedData: res.encryptedData,
            iv: res.iv,
            data: res.rawData,
            thirdKey: wx.getStorageSync('thirdKey')
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: res => {
            app.globalData.userInfo = res.data
            //跳转至index
            wx.redirectTo({
              url: '../index/index',
            })
          },
          fail: () => {
            console.log('bind failed');
          }
        })
      }
    })
  },
  getUserInfo: function (e) {
    wx.request({
      url: 'http://wechat-server.com/api/bind',
      method: 'POST',
      data: {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        data: e.detail.rawData,
        thirdKey: wx.getStorageSync('thirdKey')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        app.globalData.userInfo = res.data
        //跳转至index
        wx.redirectTo({
          url: '../index/index',
        })
      },
      fail: () => {
        console.log('bind failed');
      }
    })
  },
})