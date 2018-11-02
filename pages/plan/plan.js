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
    isDayPlan: 0,
    planContent: '',
    calendarShow: false,
    currentRemindSettingKey: 'noRemind',
    editId: null,
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

    // 编辑复原
    if (option.editItem) {
      let editItem = JSON.parse(option.editItem);
      let remindIndex = editItem.remindSetting == 'noRemind' ? 0 : 1;
      this.setData({
        editId: editItem.id,
        executedDate: editItem.executedDate,
        executedStartTime: editItem.executedSpecificTime,
        planContent: editItem.content,
        [`level[${editItem.level}].checked`]: true ,
        isDayPlan: editItem.isDayPlan,
        [`remindSetting[${remindIndex}].checked`]: true
      })
    }
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
      currentRemindSettingKey: key
    })
  },
  pickDayPlan: function (e) {
    let isDayPlan = e.detail.value ? 1 : 0;
    this.setData({
      isDayPlan: isDayPlan,
      [`remindSetting[0].checked`]: true,
      [`remindSetting[1].checked`]: false,
      currentRemindSettingKey: 'noRemind'
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
      executedDate: date,
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
      executedStartTime: this.data.executedStartTime == '选择时间' ? '' : this.data.executedStartTime,
      content: this.data.planContent,
      isDayPlan: this.data.isDayPlan,
      remindSetting: this.data.currentRemindSettingKey,
      level: level,
      formId: 1
    }
    console.log(data)
    let url = 'http://wechat-server.com/api/plans';
    let method = 'POST';
    if (this.data.editId) {
      data.id = this.data.editId;
      url = 'http://wechat-server.com/api/plans/' + this.data.editId;
      method = 'PUT';
    }
    console.log(this.data.editId, url, method)
    wx.request({
      url: url,
      method: method,
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
