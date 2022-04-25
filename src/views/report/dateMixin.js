import dayjs from 'dayjs'
export default {
  data() {
    const _2018 = new Date(2018, 0, 1, 0, 0, 0, 0)
    return {
      selectDate: '',
      selectDateOption: 'week',
      dateOptions: [{
        value: 'week',
        label: '按周'
      }, {
        value: 'month',
        label: '按月'
      }, {
        value: 'year',
        label: '按年'
      }],
      datePickerOptions: {
        disabledDate: function(time) {
          return time.getTime() < _2018.getTime()
        },
        firstDayOfWeek: 1
      }
    }
  },
  computed: {
    getDatePlaceholder() {
      switch (this.selectDateOption) {
        case 'week':
          return '请选择时间'
        case 'month':
          return '请选择月份'
        case 'year':
          return '请选择年份'
      }
    },
    getDateFormat() {
      switch (this.selectDateOption) {
        case 'week':
          return 'yyyy-MM-dd到周末'
        case 'month':
          return 'yyyy年MM月'
        case 'year':
          return 'yyyy年'
      }
    }
  },
  methods: {
    initSelectDate() {
      const nowYear = new Date().getFullYear()
      const nowMonth = new Date().getMonth()
      const nowDate = new Date().getDate()
      const nowDay = new Date().getDay()
      this.selectDate = new Date(nowYear, nowMonth, nowDate - nowDay + 1, 0, 0, 0)
    },
    onDateOptionsChange() {
      this.selectDate = ''
    },
    hasSetDate() {
      return this.selectDate
    },
    selectDateChange() {
      if (!this.selectDate) return
      // element-ui bug 周会提前一天 特殊处理
      switch (this.selectDateOption) {
        case 'week':
          this.selectDate.setDate(this.selectDate.getDate() - 1)
          break
      }
    },
    getDateParams() {
      let startDate
      let endDate
      // dateType查询日期类型：0日期（默认）/1周/2年月/3年
      switch (this.selectDateOption) {
        case 'week':
          startDate = this.selectDate
          endDate = new Date(startDate.getTime())
          endDate.setDate(endDate.getDate() + 6)
          endDate.setHours(23, 59, 59, 999)
          return {
            dateType: 1,
            startDate: dayjs(startDate).format('YYYY-MM-DD'),
            endDate: dayjs(endDate).format('YYYY-MM-DD')
          }
        case 'month':
          startDate = this.selectDate
          return {
            dateType: 2,
            year: startDate.getFullYear(),
            month: startDate.getMonth() + 1
          }
        case 'year':
          startDate = this.selectDate
          return {
            dateType: 3,
            year: startDate.getFullYear()
          }
      }
    },
    getDateArray() {
      let startDate
      let endDate
      switch (this.selectDateOption) {
        case 'week':
          startDate = this.selectDate
          endDate = new Date(startDate.getTime())
          endDate.setDate(endDate.getDate() + 6)
          endDate.setHours(23, 59, 59, 999)
          return [
            dayjs(startDate).format('YYYY-MM-DD'),
            dayjs(endDate).format('YYYY-MM-DD')
          ]
        case 'month':
          startDate = this.selectDate
          endDate = new Date(startDate.getTime())
          endDate.setMonth(endDate.getMonth() + 1, 0)
          endDate.setHours(23, 59, 59, 999)
          return [
            dayjs(startDate).format('YYYY-MM-DD'),
            dayjs(endDate).format('YYYY-MM-DD')
          ]
        case 'year':
          startDate = this.selectDate
          endDate = new Date(startDate.getTime())
          endDate.setMonth(12, 0)
          endDate.setHours(23, 59, 59, 999)
          return [
            dayjs(startDate).format('YYYY-MM-DD'),
            dayjs(endDate).format('YYYY-MM-DD')
          ]
      }
    }
  }
}
