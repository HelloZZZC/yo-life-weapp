Page({
  data: {
    level: [{
      key: 0,
      value: '普通',
      checked: true
    }, {
      key: 1,
      value: '中等'
    }, {
      key: 2,
      value: '紧急'
    }],
    remindSetting: [{
      key: 'noRemind',
      value: '不提醒',
      checked: true
    }, {
      key: 'fiveMinEarly',
      value: '提早5分钟'
    }],
    executedDate: '',
    dayStyle: [
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#AAD4F5' },
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#AAD4F5' }
    ],
    executedStartTime: '选择时间',
    isDayPlan: false,
    planContent: '',
    calendarShow: false
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (option) {
    let dateData = new Date();
    this.setData({
      executedDate: `${dateData.getFullYear()}-${dateData.getMonth()+1}-${dateData.getDate()}`
    })
  },
  pickStartTime: function (e) {
    this.setData({
      executedStartTime: e.detail.value
    })
  },
  pickLevel: function (e) {
    let index = e.detail.value;
    let arr = this.data.level;
    for (let i = 0; i < arr.length; i++) {
      if(index.indexOf(arr[i].key) != -1) {
        arr[i].checked = true;
      } else {
        arr[i].checked = false;
      }
    }
    this.setData({
      level: arr
    })
  },
  pickRemindSetting: function (e) {
    let key = e.detail.value;
    let items = this.data.remindSetting;
    for (let i = 0; i < items.length; i++) {
      if (key.indexOf(items[i].key) != -1) {
        items[i].checked = true;
      } else {
        items[i].checked = false;
      }
    }
    this.setData({
      remindSetting: items,
      currentRemindSetting: key
    })
  },
  pickDayPlan: function (e) {
    this.setData({
      isDayPlan: e.detail.value
    })
  },
  inputPlanContent (e) {
    this.setData({
      planContent: e.detail.value
    })
  },
  // about calendar
  dayClick (event) {
    let clickDay = event.detail.day;
    let changeDay = `dayStyle[1].day`;
    let changeBg = `dayStyle[1].background`;
    let changeMonth = `dayStyle[1].month`;
    let date = `${event.detail.year}-${event.detail.month}-${event.detail.day}`;
    this.setData({
      [changeMonth]: "current",
      [changeDay]: clickDay,
      [changeBg]: "#84e7d0",
      date: date,
      calendarShow: false
    })
  },
  openCalendar() {
    this.setData({
      calendarShow: !this.data.calendarShow
    })
  },
  dateChange (event) {
    console.log(event.detail);
  },
  calendarPrev (event) {
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

  formSubmit: function (e) {
    let remindSetting = getKeyByValue(this.data.remindSetting)
    let level = getKeyByValue(this.data.level)
    let data = {
      executedDate: this.data.executedDate,
      executedStartTime: this.data.executedStartTime,
      content: this.data.planContent,
      isDayPlan: this.data.isDayPlan,
      remindSetting: remindSetting,
      level: level
    }
    wx.request({
      url: 'http://wechat-server.com/api/plans',
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'auth-key': wx.getStorageSync('thirdKey')
      },
      success: res => {
        wx.navigateTo({
          url: '../index/index',
        })
      },
      fail: () => {
        console.log('plan add failed');
      }
    })
  }
})
function getKeyByValue(group) {
  for (let i = 0; i < group.length; i++) {
    if (group[i].checked) {
      return group[i].key;
    }
  }
}
