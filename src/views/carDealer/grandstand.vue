<template>
  <div class="app-container">
    <head-info title="看台"/>
    <div class="wrapper">
      <div class="header">
        <h2 class="title">应用概述</h2>
        <div v-loading="totalDataLoad" v-if="totalDataShow" class="data-overview">
          <ul v-if="overviewDetail != null" class="add-up">
            <li class="add-up-item">
              <div class="total-box">
                <p class="item-title">
                  <span class="font">累计客户数</span>
                  <span class="unit unit-customer-color">单位:人</span>
                </p>
                <p class="item-num">{{ overviewDetail.customerTotal }}</p>
              </div>
              <div class="change-box">
                <p class="item-title">本周平均新增客户</p>
                <p class="item-num">
                  <span class="font">{{ overviewDetail.addCustomerAverageByWeek.sum }}</span>
                  <span v-show="overviewDetail.addCustomerAverageByWeek.rate !== 0" class="unit">环比 {{ overviewDetail.addCustomerAverageByWeek.rate }}% <svg-icon v-show="overviewDetail.addCustomerAverageByWeek.rate > 0" icon-class="renewal_arrow_up" style="width: 14px;height: 14px;" /><svg-icon v-show="overviewDetail.addCustomerAverageByWeek.rate < 0" icon-class="renewal_arrow_down" style="width: 14px;height: 14px;" /></span>
                </p>
              </div>
            </li>
            <li class="add-up-item">
              <div class="total-box">
                <p class="item-title">
                  <span class="font">累计进站数</span>
                  <span class="unit unit-enter-color">单位:辆</span>
                </p>
                <p class="item-num">{{ overviewDetail.arrivalTotal }}</p>
              </div>
              <div class="change-box">
                <p class="item-title">本周平均进站数</p>
                <p class="item-num">
                  <span class="font">{{ overviewDetail.arrivalAverageByWeek.sum }}</span>
                  <span v-show="overviewDetail.arrivalAverageByWeek.rate !== 0" class="unit">环比 {{ overviewDetail.arrivalAverageByWeek.rate }}% <svg-icon v-show="overviewDetail.arrivalAverageByWeek.rate > 0" icon-class="renewal_arrow_up" style="width: 14px;height: 14px;" /><svg-icon v-show="overviewDetail.arrivalAverageByWeek.rate < 0" icon-class="renewal_arrow_down" style="width: 14px;height: 14px;" /></span>
                </p>
              </div>
            </li>
            <li class="add-up-item">
              <div class="total-box">
                <p class="item-title">
                  <span class="font">累计保单</span>
                  <span class="unit unit-deal-color">单位:单</span>
                </p>
                <p class="item-num">{{ overviewDetail.insuredTotal }}</p>
              </div>
              <div class="change-box">
                <p class="item-title">本周平均出单</p>
                <p class="item-num">
                  <span class="font">{{ overviewDetail.insuredAverageByWeek.sum }}</span>
                  <span v-show="overviewDetail.insuredAverageByWeek.rate !== 0" class="unit">环比 {{ overviewDetail.insuredAverageByWeek.rate }}% <svg-icon v-show="overviewDetail.insuredAverageByWeek.rate > 0" icon-class="renewal_arrow_up" style="width: 14px;height: 14px;" /><svg-icon v-show="overviewDetail.insuredAverageByWeek.rate < 0" icon-class="renewal_arrow_down" style="width: 14px;height: 14px;" /></span>
                </p>
              </div>
            </li>
            <li class="add-up-item">
              <div class="total-box">
                <p class="item-title">
                  <span class="font">累计保费数</span>
                  <span class="unit unit-money-color">单位:元</span>
                </p>
                <p class="item-num">{{ overviewDetail.premiumTotal }}</p>
              </div>
              <div class="change-box">
                <p class="item-title">本周平均保费数</p>
                <p class="item-num">
                  <span class="font">{{ overviewDetail.premiumAverageByWeek.sum }}</span>
                  <span v-show="overviewDetail.premiumAverageByWeek.rate !== 0" class="unit">环比 {{ overviewDetail.premiumAverageByWeek.rate }}% <svg-icon v-show="overviewDetail.premiumAverageByWeek.rate > 0" icon-class="renewal_arrow_up" style="width: 14px;height: 14px;" /><svg-icon v-show="overviewDetail.premiumAverageByWeek.rate < 0" icon-class="renewal_arrow_down" style="width: 14px;height: 14px;" /></span>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <v-renewal-page-error v-if="!totalDataShow" box-height="height: 300px;" box-translate-y="'transform: translateY(0);'" @reset="overviewReset"/>
    </div>
    <div ref="statisticalWrapper" class="wrapper top-space">
      <div class="header">
        <h2 class="title">续保统计分析</h2>
        <div class="date-picker">
          <el-date-picker
            v-model="statisticalValue"
            :picker-options="statisticalOptions"
            :clearable="false"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="statisticalDate"/>
          <span class="tips">注：目前仅支持按月份查询</span>
        </div>
      </div>
      <div v-loading="statisticalLoad" v-if="statisticalShow" ref="statistical" class="statistical-chart" style="width: 100%;height: 500px;"/>
      <v-renewal-page-error v-if="!statisticalShow" @reset="statisticalReset"/>
    </div>
    <div v-if="false" class="wrapper top-space conversion">
      <div class="header">
        <h2 class="title">续保转化率分析</h2>
      </div>
      <div v-loading="renewalRateLoad" v-if="renewalRateShow" ref="conversion" class="conversion-chart">
        <div class="arrival-box">
          <div class="arrival-title">
            <div class="title">到店续保客户</div>
            <div class="title">转化率
              <el-tooltip :content="arrivalTips" class="item" effect="light" placement="bottom" popper-class="conversion-tips">
                <i class="el-icon-info info-color"/>
              </el-tooltip>
            </div>
          </div>
          <ul class="arrival-list">
            <li v-for="(item, index) in arrivalList" :key="item.id" class="arrival-item">
              <div class="item-left">
                <p class="number">{{ item.num }}</p>
                <p class="date">{{ item.date }}</p>
              </div>
              <div class="item-right">
                <div class="arrival-data">
                  <v-circle :circle-id="'arrival' + index" :circle-percent="item.percent"/>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="follow-box">
          <div class="follow-title">
            <div class="title">续保任务截止</div>
            <div class="title">转化率
              <el-tooltip :content="followTips" class="item" effect="light" placement="bottom" popper-class="conversion-tips">
                <i class="el-icon-info info-color"/>
              </el-tooltip>
            </div>
          </div>
          <ul class="follow-list">
            <li v-for="(item, index) in followList" :key="item.id" class="follow-item">
              <div class="item-left">
                <p class="number">{{ item.num }}</p>
                <p class="date">{{ item.date }}</p>
              </div>
              <div class="item-right">
                <div class="follow-data">
                  <v-circle :circle-id="'follow' + index" :circle-percent="item.percent"/>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <v-renewal-page-error v-if="!renewalRateShow" @reset="renewalRateReset"/>
    </div>
    <div v-if="false" ref="companyWrapper" class="wrapper top-space company">
      <div class="header">
        <h2 class="title">保险公司续保分析</h2>
        <div class="date-picker">
          <el-date-picker
            v-model="companyValue"
            :picker-options="companyOptions"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="companyDate"/>
          <span class="tips">注：目前仅支持按月份查询</span>
        </div>
      </div>
      <div v-loading="companyLoad" v-if="companyShow" ref="company" class="company-chart" style="width: 100%;height: 500px;"/>
      <v-renewal-page-error v-if="!companyShow" @reset="companyReset"/>
    </div>
    <div ref="employeeWrapper" class="wrapper top-space clear">
      <div class="header">
        <h2 class="title">续保专员续保分析</h2>
        <div class="date-picker">
          <el-date-picker
            v-model="employeeValue"
            :picker-options="employeeOptions"
            :clearable="false"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="employeeDate"/>
          <span class="tips">注：目前仅支持按月份查询</span>
        </div>
      </div>
      <div v-loading="employeeLoad" v-if="employeeShow" ref="employee" class="employee-chart" style="width: 100%;height: 500px;"/>
      <v-renewal-page-error v-if="!employeeShow" @reset="employeeReset"/>
    </div>
    <div ref="renewalWrapper" class="wrapper top-space">
      <div class="header">
        <h2 class="title">续保转化率分析</h2>
      </div>
      <div v-loading="renewalLoad" v-if="renewalShow" ref="renewals" class="renewal-chart" style="width: 100%;height: 500px;"/>
      <v-renewal-page-error v-if="!renewalShow" @reset="renewalReset"/>
    </div>
  </div>
</template>

<script>
import vCircle from '@/views/carDealer/components/circlePercent'
import vRenewalPageError from '@/views/carDealer/components/renewalPage404'
import { getInsureStatistics, getInsureConversionRate, getCompanyInsureConversionRate, getRenewalUserStatistics, getOverview, getInsureConversionRateList } from '@/api/renewal'
import dayjs from 'dayjs'
export default {
  name: 'Grandstand',
  components: {
    vCircle, vRenewalPageError
  },
  data() {
    return {
      isLoading: false,
      followList: [],
      arrivalList: [],
      totalDataLoad: false,
      totalDataShow: true,
      overviewDetail: null,
      statisticalLoad: false,
      statisticalShow: true,
      statisticalOldValue: [dayjs().startOf('month'), dayjs().endOf('month')], // 存放上次选择的日期
      statisticalValue: [dayjs().startOf('month'), dayjs().endOf('month')],
      statisticalOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        },
        shortcuts: [
          {
            text: '本月',
            onClick(picker) {
              const start = dayjs().startOf('month')
              const end = dayjs().endOf('month')
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '上月',
            onClick(picker) {
              const start = dayjs().subtract(1, 'month').startOf('month')
              const end = dayjs().subtract(1, 'month').endOf('month')
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '今年',
            onClick(picker) {
              const start = dayjs().startOf('year')
              const end = dayjs().endOf('month')
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '去年',
            onClick(picker) {
              const start = dayjs().subtract(1, 'year').startOf('year')
              const end = dayjs().subtract(1, 'year').endOf('year')
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      renewalRateLoad: false,
      renewalRateShow: true,
      companyLoad: false,
      companyShow: true,
      companyOldValue: [dayjs().startOf('month'), dayjs().endOf('month')], // 存放上次选择的日期
      companyValue: [dayjs().startOf('month'), dayjs().endOf('month')],
      companyOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        },
        shortcuts: [
          {
            text: '本月',
            onClick(picker) {
              const start = dayjs().startOf('month')
              const end = dayjs().endOf('month')
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '上月',
            onClick(picker) {
              const start = dayjs().subtract(1, 'month').startOf('month')
              const end = dayjs().subtract(1, 'month').endOf('month')
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '今年',
            onClick(picker) {
              const start = dayjs().startOf('year')
              const end = dayjs().endOf('month')
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '去年',
            onClick(picker) {
              const start = dayjs().subtract(1, 'year').startOf('year')
              const end = dayjs().subtract(1, 'year').endOf('year')
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      colorArr: ['#efbe2e', '#ffd823', '#79d751', '#42b983', '#42d4c5', '#409eff', '#5340ff', '#bb52e8', '#ef6ac7', '#ed4556'],
      employeeLoad: false,
      employeeShow: true,
      employeeOldValue: [dayjs().startOf('month'), dayjs().endOf('month')], // 存放上次选择的日期
      employeeValue: [dayjs().startOf('month'), dayjs().endOf('month')],
      employeeOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        },
        shortcuts: [
          {
            text: '本月',
            onClick(picker) {
              const start = dayjs().startOf('month')
              const end = dayjs().endOf('month')
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '上月',
            onClick(picker) {
              const start = dayjs().subtract(1, 'month').startOf('month')
              const end = dayjs().subtract(1, 'month').endOf('month')
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '今年',
            onClick(picker) {
              const start = dayjs().startOf('year')
              const end = dayjs().endOf('month')
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '去年',
            onClick(picker) {
              const start = dayjs().subtract(1, 'year').startOf('year')
              const end = dayjs().subtract(1, 'year').endOf('year')
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      arrivalTips: '转化率(设定时间内)：成交出单(到店) / 续保期内到店客户 * 100%',
      followTips: '转化率(设定时间内)：成交出单 / (续保任务中成功 + 战败 + 脱保) * 100%',
      renewalLoad: false,
      renewalShow: true
    }
  },
  computed: {
    sidebarStatus() {
      return this.$store.getters.sidebar.opened
    }
  },
  watch: {
    sidebarStatus() {
      setTimeout(function() {
        this.echartsResize('statisticalWrapper', 'statistical')
        // this.echartsResize('companyWrapper', 'company')
        this.echartsResize('employeeWrapper', 'employee')
        this.echartsResize('renewalWrapper', 'renewals')
      }.bind(this), 500)
    },
    '$route'(val) {
      if (val.path === '/carDealer/grandstand') {
        this.echartsResize('statisticalWrapper', 'statistical', 'route')
        // this.echartsResize('companyWrapper', 'company', 'route')
        this.echartsResize('employeeWrapper', 'employee', 'route')
        this.echartsResize('renewalWrapper', 'renewals', 'route')
      }
    }
  },
  mounted() {
    this.init()
    window.addEventListener('resize', function() {
      this.echartsResize('statisticalWrapper', 'statistical')
      // this.echartsResize('companyWrapper', 'company')
      this.echartsResize('employeeWrapper', 'employee')
      this.echartsResize('renewalWrapper', 'renewals')
    }.bind(this))
  },
  methods: {
    init() {
      this.getOverviewAjax()
      this.statisticalAjax()
      // this.renewalRateAjax()
      // this.companyAjax()
      this.employeeAjax()
      this.renewalAjax()
    },
    costHandle(data) { // 总保费 费用小于1万默认最高值1万分为10份 大于1万则加原来的10%分为10份
      let delta, max
      const arrMax = Math.max.apply(Math, data) // 数组中最大的数
      if (arrMax > 10000) {
        max = Math.floor(arrMax + 0.1 * arrMax)
        delta = Math.floor(max / 10)
        return {
          max: max,
          delta: delta
        }
      } else {
        return {
          max: 10000,
          delta: 1000
        }
      }
    },
    taskHandle(data) { // 续保任务 小于10默认最高值10分为10份 大于10则加50或100分为10份
      let delta, max
      const arrMax = Math.max.apply(Math, data) // 数组中最大的数
      if (arrMax > 10) {
        if (arrMax % 100 < 50) {
          max = Math.floor(arrMax / 100) * 100 + 50
        } else {
          max = Math.floor(arrMax / 100) * 100 + 100
        }
        delta = Math.floor(max / 10)
        return {
          max: max,
          delta: delta
        }
      } else {
        return {
          max: 10,
          delta: 1
        }
      }
    },
    echartsResize(elemWrapper, elem, way) { // 用于使chart自适应高度,通过窗体宽计算容器宽
      const flag = this.sidebarStatus ? 180 : 36 // 侧边栏宽度
      const myChart = this.$echarts.init(this.$refs[elem])
      const echartsWarp = this.$refs[elemWrapper]
      const echartsBox = this.$refs[elem]
      if (way === 'route') {
        if (elem === 'company') {
          echartsBox.style.width = (window.innerWidth - flag - 50) - ((window.innerWidth - flag) * 0.51) + 'px'
        } else {
          echartsBox.style.width = (window.innerWidth - flag - 50) + 'px'
        }
      } else {
        echartsBox.style.width = echartsWarp.clientWidth + 'px'
      }
      myChart.resize()
    },
    getOverviewAjax() { // 应用概述
      this.totalDataLoad = true
      getOverview().then(res => {
        if (res.status === 200) {
          this.overviewDetail = res.data
          this.totalDataShow = true
        }
        this.totalDataLoad = false
      }).catch(err => {
        console.warn(err)
        this.totalDataLoad = false
        this.totalDataShow = false
      })
    },
    statisticalAjax() { // 续保统计分析请求
      this.statisticalLoad = true
      getInsureStatistics({
        start: dayjs(this.statisticalValue[0]).startOf('month').format('YYYY-MM-DD'),
        end: dayjs(this.statisticalValue[1]).endOf('month').format('YYYY-MM-DD')
      }).then(res => {
        if (res.status === 200) {
          this.statisticalShow = true
          this.statisticalInit(res.data)
        }
        this.statisticalLoad = false
      }).catch(err => {
        console.warn(err)
        this.statisticalLoad = false
        this.statisticalShow = false
      })
    },
    statisticalInit(data) { // 续保统计分析图表初始化
      const width = data.x.length > 12 ? 13 : 30
      let myChart = null
      myChart = this.$echarts.init(this.$refs.statistical) // 基于准备好的dom，初始化echarts实例
      let option = null
      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#0f0'
            }
          }
        },
        legend: {
          bottom: 10,
          itemWidth: 50,
          itemGap: 50,
          data: ['总保费', '新增任务', '成交保单']
        },
        grid: {
          left: '5%',
          right: '5%',
          top: '7%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: data.x,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '总保费(元)',
            min: 0,
            max: this.costHandle(data.totalPremium).max,
            interval: this.costHandle(data.totalPremium).delta,
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '新增任务(项)/成交保单(份)',
            min: 0,
            max: this.taskHandle(data.renewal).max,
            interval: this.taskHandle(data.renewal).delta,
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '总保费',
            type: 'line',
            yAxisIndex: 0,
            smooth: true,
            data: data.totalPremium,
            itemStyle: {
              normal: {
                color: '#AE1D78',
                lineStyle: {
                  color: '#AE1D78'
                }
              }
            }
          },
          {
            name: '新增任务',
            type: 'bar',
            yAxisIndex: 1,
            barGap: 0,
            barWidth: width, // 柱图宽度
            data: data.renewal,
            itemStyle: {
              normal: {
                color: '#46ADFF',
                lineStyle: {
                  color: '#46ADFF'
                }
              }
            }
          },
          {
            name: '成交保单',
            type: 'bar',
            yAxisIndex: 1,
            barGap: 0,
            barWidth: width, // 柱图宽度
            data: data.totalSum,
            itemStyle: {
              normal: {
                color: '#847DDE',
                lineStyle: {
                  color: '#847DDE'
                }
              }
            }
          }
        ]
      }
      if (option && typeof option === 'object') {
        myChart.setOption(option, true)
      }
    },
    renewalRateAjax() { // 续保转化率分析请求
      this.renewalRateLoad = true
      getInsureConversionRate().then(res => {
        if (res.status === 200) {
          this.renewalRateShow = true
          this.followList = res.data.takeList
          this.arrivalList = res.data.arrivalList
        }
        this.renewalRateLoad = false
      }).catch(err => {
        console.warn(err)
        this.renewalRateLoad = false
        this.renewalRateShow = false
      })
    },
    companyAjax() { // 保险公司续保分析请求
      this.companyLoad = true
      getCompanyInsureConversionRate({
        start: dayjs(this.companyValue[0]).startOf('month').format('YYYY-MM-DD'),
        end: dayjs(this.companyValue[1]).endOf('month').format('YYYY-MM-DD')
      }).then(res => {
        if (res.status === 200) {
          this.companyShow = true
          this.companyInit(this, res.data)
        }
        this.companyLoad = false
      }).catch(err => {
        console.warn(err)
        this.companyLoad = false
        this.companyShow = false
      })
    },
    companyInit(_this, data) { // 保险公司续保分析图表初始化
      let companyNames
      let statistics
      if (!data.companyNames.length && !data.statistics.length) {
        companyNames = ['暂无数据']
        statistics = [{ name: '暂无数据', value: 0 }]
      } else {
        companyNames = data.companyNames
        statistics = data.statistics
      }
      let myChart = null
      myChart = this.$echarts.init(this.$refs.company) // 基于准备好的dom，初始化echarts实例
      let option = null
      option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: '10%',
          top: 'middle',
          bottom: 20,
          data: companyNames,
          selected: companyNames
        },
        series: [
          {
            name: '姓名',
            type: 'pie',
            radius: '60%',
            center: ['40%', '50%'],
            data: statistics,
            label: {
              fontSize: 16
            },
            itemStyle: {
              normal: {
                color: function(data) { // 随机显示颜色
                  if (companyNames.length === 1 && statistics[0].name === '暂无数据') {
                    return '#ccc'
                  } else {
                    return _this.choiceColor(data.dataIndex)
                  }
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      if (option && typeof option === 'object') {
        myChart.setOption(option, true)
      }
    },
    employeeAjax() { // 续保专员续保分析请求
      this.employeeLoad = true
      getRenewalUserStatistics({
        start: dayjs(this.employeeValue[0]).startOf('month').format('YYYY-MM-DD'),
        end: dayjs(this.employeeValue[1]).endOf('month').format('YYYY-MM-DD')
      }).then(res => {
        if (res.status === 200) {
          this.employeeShow = true
          this.employeeInit(res.data)
        }
        this.employeeLoad = false
      }).catch(err => {
        console.warn(err)
        this.employeeLoad = false
        this.employeeShow = false
      })
    },
    employeeInit(data) { // 续保专员续保分析图表初始化
      const width = data.x.length > 12 ? 13 : 30
      let myChart = null
      myChart = this.$echarts.init(this.$refs.employee) // 基于准备好的dom，初始化echarts实例
      let option = null
      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#0f0'
            }
          }
        },
        legend: {
          bottom: 10,
          itemWidth: 50,
          itemGap: 50,
          data: ['续保保费', '新增任务', '成交保单']
        },
        grid: {
          left: '5%',
          right: '5%',
          top: '7%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: data.x,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '总保费(元)',
            min: 0,
            max: this.costHandle(data.totalPremium).max,
            interval: this.costHandle(data.totalPremium).delta,
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '新增任务(项)/成交保单(份)',
            min: 0,
            max: this.taskHandle(data.renewal).max,
            interval: this.taskHandle(data.renewal).delta,
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '续保保费',
            type: 'bar',
            yAxisIndex: 0,
            barGap: 0,
            barWidth: width, // 柱图宽度
            data: data.totalPremium,
            itemStyle: {
              normal: {
                color: '#847DDE',
                lineStyle: {
                  color: '#847DDE'
                }
              }
            }
          },
          {
            name: '新增任务',
            type: 'bar',
            yAxisIndex: 1,
            barGap: 0,
            barWidth: width, // 柱图宽度
            data: data.renewal,
            itemStyle: {
              normal: {
                color: '#46ADFF',
                lineStyle: {
                  color: '#46ADFF'
                }
              }
            }
          },
          {
            name: '成交保单',
            type: 'bar',
            yAxisIndex: 1,
            barGap: 0,
            barWidth: width, // 柱图宽度
            data: data.totalSum,
            itemStyle: {
              normal: {
                color: '#9A62C2',
                lineStyle: {
                  color: '#9A62C2'
                }
              }
            }
          }
        ]
      }
      if (option && typeof option === 'object') {
        myChart.setOption(option, true)
      }
    },
    choiceColor(index) { // 圆形图颜色选择
      if (index > this.colorArr.length - 1) {
        const r = Math.floor(Math.random() * 256) // 随机生成256以内r值
        const g = Math.floor(Math.random() * 256) // 随机生成256以内g值
        const b = Math.floor(Math.random() * 256) // 随机生成256以内b值
        this.colorArr.push(`rgb(${r},${g},${b})`)
      }
      return this.colorArr[index]
    },
    statisticalDate(data) { // 续保统计分析时间选择
      if (this.monthChange(this.statisticalValue)) {
        this.statisticalOldValue = this.statisticalValue
        this.changeDate(this, 'statisticalValue', data)
        this.statisticalAjax()
      } else {
        this.changeDate(this, 'statisticalValue', this.statisticalOldValue)
      }
    },
    companyDate(data) { // 保险公司续保分析时间选择
      if (this.monthChange(this.companyValue)) {
        this.companyOldValue = this.companyValue
        this.changeDate(this, 'companyValue', data)
        this.companyAjax()
      } else {
        this.changeDate(this, 'companyValue', this.companyOldValue)
      }
    },
    employeeDate(data) { // 续保专员续保分析时间选择
      if (this.monthChange(this.employeeValue)) {
        this.employeeOldValue = this.employeeValue
        this.changeDate(this, 'employeeValue', data)
        this.employeeAjax()
      } else {
        this.changeDate(this, 'employeeValue', this.employeeOldValue)
      }
    },
    monthChange(arr) { // 选择超过12个月不可请求
      if (dayjs(arr[1]).diff(dayjs(arr[0]), 'month') > 11) {
        this.$message({
          duration: 4000,
          message: '最多只可选择一年的时间长度进行查询！'
        })
        return false
      } else {
        return true
      }
    },
    changeDate(_this, val, data) { // 改变日期选择器的值
      setTimeout(() => {
        _this[val] = [dayjs(dayjs(data[0]).startOf('month')).toDate(), dayjs(dayjs(data[1]).endOf('month')).toDate()]
      }, 10)
    },
    overviewReset() {
      this.totalDataShow = true
      this.getOverviewAjax()
    },
    statisticalReset() {
      this.statisticalShow = true
      this.statisticalAjax()
    },
    renewalRateReset() {
      this.renewalRateShow = true
      this.renewalRateAjax()
    },
    companyReset() {
      this.companyShow = true
      this.companyAjax()
    },
    employeeReset() {
      this.employeeShow = true
      this.employeeAjax()
    },
    renewalAjax() { // 续保转化率分析请求
      this.renewalLoad = true
      getInsureConversionRateList().then(res => {
        if (res.status === 200) {
          this.renewalShow = true
          this.renewalInit(res.data)
        }
        this.renewalLoad = false
      }).catch(err => {
        console.warn(err)
        this.renewalLoad = false
        this.renewalShow = false
      })
    },
    renewalInit(data) { // 续保转化率分析图表初始化
      let myChart = null
      myChart = this.$echarts.init(this.$refs.renewals) // 基于准备好的dom，初始化echarts实例
      let option = null
      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            // type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            type: 'cross',
            crossStyle: {
              color: '#0f0'
            }
          },
          formatter: function(params) {
            let showHtml = ''
            let date, color1, color2, color3
            for (let i = 0; i < params.length; i++) {
              let dotHtml, name
              switch (params[i].seriesName) {
                case '续保期内客户(基盘)':
                  color1 = params[i].color
                  break
                case '战败(基盘)':
                  color2 = params[i].color
                  break
                case '成功出单(基盘)':
                  color3 = params[i].color
                  break
              }
              switch (params[i].seriesName) {
                case '续保期内客户(新增)':
                  dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' + color1 + '"></span>'
                  break
                case '战败(新增)':
                  dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' + color2 + '"></span>'
                  break
                case '成功出单(新增)':
                  dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' + color3 + '"></span>'
                  break
                default:
                  dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' + params[i].color + '"></span>'
              }
              switch (params[i].seriesName) {
                case '上年续保率':
                  name = params[i].value + '%'
                  break
                case '本年续保率':
                  name = params[i].value + '%'
                  break
                default:
                  name = params[i].value
              }
              date = params[i].name
              showHtml += dotHtml + ' ' + params[i].seriesName + ': ' + name + '<br>'
            }
            return date + '<br>' + showHtml
          }
        },
        legend: {
          width: '800',
          bottom: 10,
          itemWidth: 30,
          itemGap: 10,
          formatter: [
            '{line2|{name}}'
          ].join('\n'),
          textStyle: {
            rich: {
              line2: {
                width: 150,
                lineHeight: 5,
                align: 'left'
              }
            }
          },
          data: ['上年续保率', '续保期内客户(基盘)', '战败(基盘)', '成功出单(基盘)', '本年续保率', '续保期内客户(新增)', '战败(新增)', '成功出单(新增)']
        },
        grid: {
          left: '5%',
          right: '5%',
          top: '7%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          data: data.xAxis
        },
        yAxis: [
          // splitLine: { show: false }
          {
            type: 'value',
            name: '客户(车)/战败(单)/成功出单(保单)',
            nameTextStyle: {
              padding: [0, 0, 0, 80]
            },
            min: 0,
            max: this.renewalTaskHandle(data).max,
            interval: this.renewalTaskHandle(data).delta,
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '续保率(%)',
            min: 0,
            max: this.renewalPercentHandle(data).max,
            interval: this.renewalPercentHandle(data).delta,
            axisLabel: {
              formatter: '{value}%'
            }
          }
        ],
        series: [
          {
            name: '本年续保率',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            showAllSymbol: true,
            symbol: 'emptyCircle',
            symbolSize: 8,
            data: data.thisYearInsureRate,
            itemStyle: {
              normal: {
                color: '#FF8F9F',
                lineStyle: {
                  color: '#FF8F9F'
                }
              }
            }
          },
          {
            name: '上年续保率',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            showAllSymbol: true,
            symbol: 'emptyCircle',
            symbolSize: 8,
            data: data.lastYearInsureRate,
            itemStyle: {
              normal: {
                color: '#AE1D78',
                lineStyle: {
                  color: '#AE1D78'
                }
              }
            }
          },
          {
            name: '续保期内客户(基盘)',
            type: 'bar',
            stack: '续保期内客户(基盘)',
            data: data.baseCustomerRenewal,
            itemStyle: {
              normal: {
                color: '#46ADFF'
              }
            }
          },
          {
            name: '续保期内客户(新增)',
            type: 'bar',
            stack: '续保期内客户(基盘)',
            barWidth: 13, // 柱图宽度
            data: data.newCustomerRenewal,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: 'rgba(70,173,255,0.8)' },
                    { offset: 0.3, color: 'rgba(70,173,255,0.6)' },
                    { offset: 1, color: 'rgba(70,173,255,0.4)' }
                  ]
                )
              }
            }
          },
          {
            name: '战败(基盘)',
            type: 'bar',
            stack: '战败(基盘)',
            data: data.baseCustomerInsureDefeat,
            itemStyle: {
              normal: {
                color: '#9A62C2'
              }
            }
          },
          {
            name: '战败(新增)',
            type: 'bar',
            stack: '战败(基盘)',
            barGap: '20%',
            barWidth: 13, // 柱图宽度
            data: data.newCustomerInsureDefeat,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: 'rgba(154, 98, 194, 0.8)' },
                    { offset: 0.3, color: 'rgba(154, 98, 194, 0.6)' },
                    { offset: 1, color: 'rgba(154, 98, 194, 0.4)' }
                  ]
                )
              }
            }
          },
          {
            name: '成功出单(基盘)',
            type: 'bar',
            stack: '成功出单(基盘)',
            data: data.baseCustomerInsure,
            itemStyle: {
              normal: {
                color: '#847DDE'
              }
            }
          },
          {
            name: '成功出单(新增)',
            type: 'bar',
            stack: '成功出单(基盘)',
            barWidth: 13, // 柱图宽度
            data: data.newCustomerInsure,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: 'rgba(132, 125, 222, 0.8)' },
                    { offset: 0.3, color: 'rgba(132, 125, 222, 0.6)' },
                    { offset: 1, color: 'rgba(132, 125, 222, 0.4)' }
                  ]
                )
              }
            }
          }
        ]
      }
      if (option && typeof option === 'object') {
        myChart.setOption(option, true)
      }
    },
    renewalReset() {
      this.renewalShow = true
      this.renewalAjax()
    },
    renewalPercentHandle(data) { // 续保率 小于95%最高值+5%分为10份 大于95%则最高值为100%
      let delta, max
      const arr = [
        ...data.lastYearInsureRate,
        ...data.thisYearInsureRate
      ]
      const arrMax = Math.max.apply(Math, arr) // 最大数
      if (arrMax < 0.95) {
        max = Math.ceil(arrMax + 0.05)
        delta = max / 10
        return {
          max: max,
          delta: delta
        }
      } else {
        return {
          max: 100,
          delta: 10
        }
      }
    },
    renewalTaskHandle(data) { // 续保率分析 小于10默认最高值10分为10份 大于10则加50或100分为10份
      let delta, max
      const arr = [
        ...data.baseCustomerInsureDefeat,
        ...data.baseCustomerInsure,
        ...data.baseCustomerRenewal,
        ...data.newCustomerInsure,
        ...data.newCustomerInsureDefeat,
        ...data.newCustomerRenewal
      ]
      const arrMax = Math.max.apply(Math, arr) * 2 // 最大数
      if (arrMax > 10) {
        if (arrMax / 100 < 50) {
          max = Math.floor(arrMax / 100) * 100 + 50
        } else {
          max = Math.floor(arrMax / 100) * 100 + 100
        }
        delta = Math.floor(max / 10)
        return {
          max: max,
          delta: delta
        }
      } else {
        return {
          max: 10,
          delta: 1
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .app-container {
    width: 100%;
    min-width: 960px!important;
    .wrapper {
      overflow: hidden;
      width: 100%;
      background-color: #fff;
      .header {
        margin: 20px 0 20px;
        .title {
          display: inline-block;
          font-size: 16px;
          color: #666;
          padding-left: 20px;
        }
        .data-overview {
          .add-up {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            overflow: hidden;
            margin: 0;
            padding: 0 40px;
            box-sizing: border-box;
            .add-up-item {
              flex: 0 0 23%;
              width: 23%;
              min-width: 300px;
              padding: 30px 40px;
              margin-bottom: 10px;
              box-sizing: border-box;
              list-style: none;
              background-color: #F5F7FA;
              border-radius: 10px;
              .total-box {
                color: #808080;
                .item-title {
                  overflow: hidden;
                  margin: 0;
                  .font {
                    float: left;
                  }
                  .unit {
                    float: right;
                    height: 22px;
                    line-height: 22px;
                    padding: 0 10px;
                    border-radius: 11px;
                    font-size: 10px;
                    color: #fff;
                    &.unit-customer-color {
                      background-color: #409EFF;
                    }
                    &.unit-enter-color {
                      background-color: #67C23A;
                    }
                    &.unit-deal-color {
                      background-color: #E6A23C;
                    }
                    &.unit-money-color {
                      background-color: #F56C6C;
                    }
                  }
                }
                .item-num {
                  font-size: 26px;
                  margin: 10px 0;
                  color: #404040;
                }
              }
              .change-box {
                margin-top: 20px;
                color: #808080;
                .item-title {
                  margin: 0;
                }
                .item-num {
                  overflow: hidden;
                  margin: 10px 0 0 0;
                  .font {
                    float: left;
                    font-size: 26px;
                    color: #404040;
                  }
                  .unit {
                    float: right;
                    font-size: 14px;
                    margin-top: 12px;
                  }
                }
              }
            }
          }
        }
        .date-picker {
          position: relative;
          // display: inline-block;
          float: right;
          margin-right: 20px;
          .tips {
            position: absolute;
            left: 0;
            bottom: -20px;
            font-size: 12px;
            color: #909399;
          }
        }
      }
      &.top-space {
        margin-top: 20px;
      }
      &.conversion, &.company {
        // display: inline-block;
        float: left;
        width: 49%;
      }
      &.conversion {
        margin-right: 2%;
        margin-bottom: 20px;
        .info-color {
          color: #666;
          cursor: pointer;
        }
        .conversion-chart {
          display: flex;
          overflow: hidden;
          width: 100%;
          height: 500px;
          // min-width: 650px;
          .follow-box, .arrival-box {
            flex: 1;
            display: inline-block;
            width: 50%;
            margin-top: 20px;
            .follow-title, .arrival-title {
              overflow: hidden;
              display: flex;
              .title {
                display: inline-block;
                flex: 1;
                font-size: 16px;
                line-height: 30px;
                color: #404040;
                text-align: center;
              }
            }
            .follow-list, .arrival-list {
              width: 100%;
              padding: 0;
              .follow-item, .arrival-item {
                display: flex;
                list-style: none;
                .item-left, .item-right {
                  flex: 1;
                  padding: 20px 0;
                  p {
                    overflow: hidden;
                    font-size: 16px;
                    margin: 0;
                    line-height: 30px;
                    color: #404040;
                    text-align: center;
                  }
                  .follow-data, .arrival-data {
                    width: 60px;
                    height: 60px;
                    margin: 0 auto;
                  }
                }
              }
            }
          }
        }
      }
      &.clear {
        clear: both;
      }
    }
  }
  .conversion-tips {
    &.el-tooltip__popper {
      &.is-light {
        width: 220px;
      }
    }
  }
</style>
