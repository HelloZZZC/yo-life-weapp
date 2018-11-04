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
      this.getPlanList()
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          hasUserInfo: true,
          existPlan: true
        })
        this.getPlanList()
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
          this.getPlanList()
        }
      })
    }
    this.initEleWidth();
  },
  getPlanList(date) {
    let todayDate = new Date();
    let today = `${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-${todayDate.getDate()}`;
    if(!date) {
      date = today
    }
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
    let index = parseInt(e.currentTarget.dataset.index);
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
  editPlan(e) {
    let index = parseInt(e.currentTarget.dataset.index);
    let editItem = JSON.stringify(this.data.plans[index]);
    wx.navigateTo({
      url: '../plan/plan?editItem=' + editItem,
    })
  },
  deletePlan(e) {
    let index = parseInt(e.currentTarget.dataset.index);
    let item = this.data.plans;
    let id = item[index].id;
    wx.request({
      url: 'http://wechat-server.com/api/plans/' + id,
      method: 'DELETE',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'auth-key': wx.getStorageSync('thirdKey')
      },
      success: res => {
        item.splice(index, 1);
        this.setData({
          plans: item
        })
      },
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
  // 左滑操作
  touchS: function (e) {
    console.log(e.touches, 123123)
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    if (e.touches.length) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，说明向右滑动，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var plans = this.data.plans;
      plans[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        plans: plans
      });
    }
  },
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var plans = this.data.plans;
      plans[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        plans: plans
      });
    }
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
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