//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    plans: [],
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
    ],
    dayStyle: [
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#AAD4F5' },
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#AAD4F5' }
    ],
    calendarShow: false,
    executedDate: '',
    existPlan: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let todayDate = new Date();
    let today = `${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-${todayDate.getDate()}`;
    this.setData({
      executedDate: today
    })
    if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: true,
        existPlan: true
      })
      this.getPlanList(today)
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          hasUserInfo: true,
          existPlan: true
        })
        this.getPlanList(today)
      }
    } else {
      //在没有open-type="getUserInfo"做兼容处理
      wx.getUserInfo({
        success: res => {
          bind(res);
          this.setData({
            hasUserInfo: true,
            existPlan: true
          })
          this.getPlanList(today)
        }
      })
    }
  },
  getPlanList(date) {
    let todayDate = new Date();
    let today = `${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-${todayDate.getDate()}`;
    wx.request({
      url: 'http://wechat-server.com/api/plans',
      method: 'GET',
      header: {
        'auth-key': wx.getStorageSync('thirdKey')
      },
      data: {
        executedDate: date,
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
  },
  getUserInfo: function(e) {
    bind(e.detail, true)
  },
  addPlan: function(e) {
    wx.navigateTo({
      url: '../plan/plan?mode=create',
    })
  },
  checkboxChange(e) {
    let index = e.currentTarget.dataset.index
    let items = this.data.plans;
    let id = items[index].id;
    let date = items[index].executedDate;
    let status = (items[index].status === 'finished') ? 'unfinished' : 'finished';
    this.setData({
      [`plans[${index}].status`]: status
    })
    wx.request({
      url: 'http://wechat-server.com/api/plans/' + id + '/status/' + status,
      method: 'PUT',
      header: {
        'auth-key': wx.getStorageSync('thirdKey')
      },
      data: {
        executedDate: date,
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
  },
  getAllPlans() {
    this.setData({
      calendarShow: false,
      executedDate: '全部计划'
    })
    this.getPlanList()
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
      calendarShow: false,
    })
    this.getPlanList(date)
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