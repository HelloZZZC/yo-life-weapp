Page({
  data: {
    level: [{
      key: 0,
      value: '普通'
    },{
      key: 1,
      value: '中等'
    },{
      key: 2,
      value: '紧急'
    }],
    remindSetting: [{
      key: 'fiveMinEarly',
      value: '提早5分钟'
    },{
      key: 'tenMinEarly',
      value: '提早10分钟'
    }],
    currentLevel: '普通',
    executedStartTime: '',
    executedEndTime: '',
    currentRemindSetting: '',
    isDayPlan: false,
    planContent: ''
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
      currentLevel: e.detail.value
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
  formSubmit: function (e) {
    let remindSetting = getKeyByValue(this.data.remindSetting, this.data.currentRemindSetting)
    let level = getKeyByValue(this.data.level, this.data.currentLevel)

    let data = {
      executedStartTime: this.data.executedStartTime,
      executedEndTime: this.data.executedEndTime,
      content: this.data.planContent,
      isDayPlan: this.data.isDayPlan,
      remindSetting: remindSetting,
      level: level,
      thirdKey: wx.getStorageSync('thirdKey')     
    }

    wx.request({
      url: 'http://wechat-server.com/api/plan',
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
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
