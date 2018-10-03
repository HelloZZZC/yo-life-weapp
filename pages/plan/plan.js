Page({
  data: {
    level: [{
      key: 0,
      value: '普通'
    }, {
      key: 1,
      value: '中等'
    }, {
      key: 2,
      value: '紧急'
    }],
    remindSetting: [{
      key: 'noRemind',
      value: '不提醒'
    }, {
      key: 'fiveMinEarly',
      value: '提早5分钟'
    }],
    dayStyle: [
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#AAD4F5' },
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#AAD4F5' }
    ],
    currentLevelKey: 0,
    executedStartTime: '选择时间',
    executedEndTime: '',
    currentRemindSetting: '不提醒',
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
  },
  pickStartTime: function (e) {
    this.setData({
      executedStartTime: e.detail.value
    })
  },
  pickEndTime: function (e) {
    this.setData({
      executedEndTime: e.detail.value
    })
  },
  pickLevel: function (e) {
    this.setData({
      currentLevelKey: e.detail.value
    })
  },
  pickRemindSetting: function (e) {
    this.setData({
      currentRemindSetting: e.detail.value
    })
  },
  pickDayPlan: function (e) {
    this.setData({
      isDayPlan: e.detail.value
    })
  },
  inputPlanContent: function (e) {
    this.setData({
      planContent: e.detail.detail.value
    })
  },
  // about calendar
  dayClick (event) {
    let clickDay = event.detail.day;
    let changeDay = `dayStyle[1].day`;
    let changeBg = `dayStyle[1].background`;
    let changeMonth = `dayStyle[1].month`;
    this.setData({
      [changeMonth]: "current",
      [changeDay]: clickDay,
      [changeBg]: "#84e7d0"
    })
    console.log(this.data.dayStyle)
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
    console.log(event.detail)
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
    let remindSetting = getKeyByValue(this.data.remindSetting, this.data.currentRemindSetting)
    let level = getKeyByValue(this.data.level, this.data.currentLevel)
    let data = {
      executedStartTime: this.data.executedStartTime,
      executedEndTime: this.data.executedEndTime,
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
function getKeyByValue(group, value) {
  if (!value) {
    return '';
  }
  for (let index in group) {
    if (group[index].value == value) {
      return group[index].key;
    }
  }
}

function getValueByKey(group, key) {
  if (!key) {
    return '';
  }
  for (let index in group) {
    if (group[index].key == key) {
      return group[index].value;
    }
  }
}