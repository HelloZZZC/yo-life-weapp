//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    plans: {},
    count: 0,
    actions: [
      {
        name: '删除',
        color: '#fff',
        fontsize: '20',
        width: 100,
        icon: 'like',
        background: '#ed3f14'
      },
      {
        name: '编辑',
        width: 100,
        color: '#80848f',
        fontsize: '20',
        icon: 'undo'
      }
    ]
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
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          hasUserInfo: true
        })
      }
    } else {
      //在没有open-type="getUserInfo"做兼容处理
      wx.getUserInfo({
        success: res => {
          bind(res);
          this.setData({
            hasUserInfo: true
          })
        }
      })
    }
    if (this.data.hasUserInfo) {
      wx.request({
        url: 'http://wechat-server.com/api/plans',
        method: 'GET',
        header: {
          'auth-key': wx.getStorageSync('thirdKey')
        },
        data: {
          offset: 0,
          limit: 10
        },
        success: res => {
          this.setData({
            plans: res.data.items,
            count: res.data.count
          });
        }
      })
    }
  },
  getUserInfo: function(e) {
    bind(e.detail, true)
  },
  addPlan: function(e) {
    wx.navigateTo({
      url: '../plan/plan?mode=create',
    })
  }
})
function bind(response, needRedirect = false) {
  wx.request({
    url: 'http://wechat-server.com/api/bind',
    method: 'POST',
    data: {
      encryptedData: response.encryptedData,
      iv: response.iv,
      data: response.rawData,
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'auth-key': wx.getStorageSync('thirdKey')
    },
    success: res => {
      app.globalData.userInfo = res.data
      //跳转至新增plan页面
      if (needRedirect) {
        wx.navigateTo({
          url: '../plan/plan?mode=create',
        })
      }
    },
    fail: () => {
      console.log('bind failed');
    }
  })
}