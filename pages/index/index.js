//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
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
              this.setData({
                userInfo: res.data,
                hasUserInfo: true
              })
            },
            fail: () => {
              console.log('bind failed');
            }
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
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
        this.setData({
          userInfo: res.data,
          hasUserInfo: true
        })
      },
      fail: () => {
        console.log('bind failed');
      }
    })
  },
})
