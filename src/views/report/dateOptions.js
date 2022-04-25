export const options = [{
  text: '昨日',
  onClick(picker) {
    const nowYear = new Date().getFullYear()
    const nowMonth = new Date().getMonth()
    const nowDay = new Date().getDate()
    const end = new Date(nowYear, nowMonth, nowDay - 1, 23, 59, 59)
    const start = new Date(nowYear, nowMonth, nowDay - 1, 0, 0, 0)
    picker.$emit('pick', [start, end])
  }
}, {
  text: '今日',
  onClick(picker) {
    const nowYear = new Date().getFullYear()
    const nowMonth = new Date().getMonth()
    const nowDay = new Date().getDate()
    const end = new Date(nowYear, nowMonth, nowDay, 23, 59, 59)
    const start = new Date(nowYear, nowMonth, nowDay, 0, 0, 0)
    picker.$emit('pick', [start, end])
  }
}, {
  text: '上周',
  onClick(picker) {
    const start = new Date()
    start.setDate(start.getDate() - start.getDay()) // 上周日
    start.setDate(start.getDate() - 6) // 上周一
    start.setHours(0, 0, 0)
    const end = new Date()
    end.setDate(end.getDate() - end.getDay()) // 上周日
    end.setHours(23, 59, 59)
    picker.$emit('pick', [start, end])
  }
}, {
  text: '本周',
  onClick(picker) {
    const start = new Date()
    start.setDate(start.getDate() - start.getDay() + 1) // 本周一
    start.setHours(0, 0, 0)
    const end = new Date()
    end.setHours(23, 59, 59)
    picker.$emit('pick', [start, end])
  }
}, {
  text: '上月',
  onClick(picker) {
    const start = new Date()
    start.setMonth(start.getMonth() - 1)
    start.setDate(1) // 上月1号
    start.setHours(0, 0, 0)
    const end = new Date()
    end.setDate(0) // 上月底
    end.setHours(23, 59, 59)
    picker.$emit('pick', [start, end])
  }
}, {
  text: '本月',
  onClick(picker) {
    const start = new Date()
    start.setDate(1) // 本月1号
    start.setHours(0, 0, 0)
    const end = new Date()
    end.setHours(23, 59, 59)
    picker.$emit('pick', [start, end])
  }
}, {
  text: '过去7天',
  onClick(picker) {
    const start = new Date()
    start.setDate(start.getDate() - 6)
    start.setHours(0, 0, 0)
    const end = new Date()
    end.setHours(23, 59, 59)
    picker.$emit('pick', [start, end])
  }
}, {
  text: '过去30天',
  onClick(picker) {
    const start = new Date()
    start.setDate(start.getDate() - 29)
    start.setHours(0, 0, 0)
    const end = new Date()
    end.setHours(23, 59, 59)
    picker.$emit('pick', [start, end])
  }
}]
