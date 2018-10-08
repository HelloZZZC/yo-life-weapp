//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    plans: {
      "data": {
        "id": 1,
        "userId": 1,
        "executedStartTime": "2018-09-18T05:00:00+0800", //DATE_ISO8601
        "executedDate": "2018-09-18",
        "content": "完成早上6点的晨练",
        "level": "0", //优先级 0:普通,1:重要,2:紧急
        "isDayPlan": 1, //是否每日计划 0:不是,1:是
        "remindSetting": "noRemind", //提醒设置 noRemind:不提醒,fiveMinEarly:提前5分钟
        "status": "unfinished", //unfinished:未完成,finished:完成
        "createdTime": "2018-09-18T21:13:32+0800", //DATE_ISO8601
        "updatedTime": "2018-09-18T21:13:32+0800" //DATE_ISO8601
      },
    },
    count: 4,
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
    ],
    dayStyle: [
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#AAD4F5' },
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#AAD4F5' }
    ],
    calendarShow: false,
    executedDate: ''
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
    let dateData = new Date();
    this.setData({
      executedDate: `${dateData.getFullYear()}-${dateData.getMonth() + 1}-${dateData.getDate()}`
    })
  },
  getUserInfo: function(e) {
    bind(e.detail, true)
  },
  addPlan: function(e) {
    wx.navigateTo({
      url: '../plan/plan?mode=create',
    })
  },
  openCalendar() {
    this.setData({
      calendarShow: !this.data.calendarShow
    })
  },
  // about calendar
  dayClick(event) {
    let clickDay = event.detail.day;
    let changeDay = `dayStyle[1].day`;
    let changeBg = `dayStyle[1].background`;
    let changeMonth = `dayStyle[1].month`;
    let date = `${event.detail.year}-${event.detail.month}-${event.detail.day}`;
    this.setData({
      [changeMonth]: "current",
      [changeDay]: clickDay,
      [changeBg]: "#84e7d0",
      executedDate: date,
      calendarShow: false
    })
  },
  openCalendar() {
    this.setData({
      calendarShow: !this.data.calendarShow
    })
  },
  dateChange(event) {
    console.log(event.detail);
  },
  calendarPrev(event) {
    let changeMonth = `dayStyle[1].month`;
    this.setData({
      [changeMonth]: 'prev',
    })
  },
  calendarNext(event) {
    let changeMonth = `dayStyle[1].month`;
    this.setData({
      [changeMonth]: 'next',
    })
  },
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