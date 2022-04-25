<template>
  <!-- eslint-disable -->
  <div class="app-container stat-contain">
    <div v-loading="isYear" class="stat-box">
      <div class="stat-title">年度数据总览</div>
      <div style="overflow: hidden;margin-left: 50px;">
        <div v-for="(item, index) in viewData" :key="index" style="float: left;padding: 10px 5px;">
          <div style="display: flex;width: 250px;">
            <div :style="{'width': '6px','height': '96px', 'background-color': hueData[index]}"></div>
            <div style="flex: 1;padding: 10px 20px;background-color: #F5F7FA;font-size: 12px;color: #808080;">
              <div>{{ item.title }}</div>
              <div style="line-height: 50px;height: 50px;font-weight: 500;font-size: 26px;text-align: right;color: #404040;">{{ item.right }}</div>
              <div style="display: flex;">
                <span style="flex: 1;color: #404040;">{{ item.caption }}{{ item.left }}</span>
                <span style="width: 80px;text-align: right;">{{ item.info }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="stat-box">
      <div class="stat-title">数据筛选</div>
      <div>
        <!-- <el-button v-for="(item,index) in timeDay" :key="index" :type=" itemIndex === index? 'primary' : '' " size="small" style="padding: 9px 25px;margin-top: 15px;" @click="clickTime(item.key, index)">{{ item.value }}</el-button> -->
        <el-date-picker v-model="searchTime" :clearable="false" type="month" size="small" style="margin: 15px 5px 0 5px;" />
        <el-button :disabled="isRequire" :loading="isSearch" type="primary" icon="el-icon-search" size="small" style="margin-top: 15px;" @click="selectData">查询</el-button>
        <el-button :disabled="isRequire" :loading="isSearch" icon="el-icon-refresh" size="small" @click="selectData">刷新</el-button>
      </div>
    </div>

    <div style="overflow: hidden;">
      <div v-loading="isFunnel" class="stat-box" style="float: left;width: 49%;min-width: 460px;text-align: center;">
        <div class="stat-title">销售漏斗</div>
        <canvas ref="saleCanvas" width="460" height="444" />
      </div>
      <div v-loading="isFee" ref="premiumBox" class="stat-box" style="float: right;width: 50%;min-width: 460px;">
        <div class="stat-title">保单保费数</div>
        <div ref="insurePremium" style="width: 100%;height: 400px;" />
        <div style="text-align: center;">
          <el-row>
            <el-col :span="12">
              <div style="font-size: 12px;line-height: 20px;">总保费</div>
              <div style="font-size: 24px;font-weight: 600;">{{ insuredOption.totalFee }}</div>
            </el-col>
            <el-col :span="12">
              <div style="font-size: 12px;line-height: 20px;">总保单</div>
              <div style="font-size: 24px;font-weight: 600;">{{ insuredOption.totalCount }}</div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <div style="overflow: hidden;">
      <div v-loading="isNew" ref="originBox" class="stat-box" style="float: left;width: 49%;min-width: 460px;">
        <div class="stat-title">新增客户来源</div>
        <div ref="customerOrigin" style="width: 100%;height: 400px;" />
        <div style="width: 100%;display: flex;align-items: center;justify-content: center;height: 40px;">
          <el-button circle style="padding: 6px;backgroundColor: #409eff;borderColor: #409eff;" />
          <el-button type="text" style="padding: 0px 10px;color: #000;font-size: 12px;margin-left: 0px;">批量录入</el-button>
          <el-button circle style="padding: 6px;backgroundColor: #42d4c5;borderColor: #42d4c5;" />
          <el-button type="text" style="padding: 0px 10px;color: #000;font-size: 12px;margin-left: 0px;">摄像头录入</el-button>
          <el-button circle style="padding: 6px;backgroundColor: #42b983;borderColor: #42b983;" />
          <el-button type="text" style="padding: 0px 10px;color: #000;font-size: 12px;margin-left: 0px;">系统报价</el-button>
          <el-button circle style="padding: 6px;backgroundColor: #efbe2e;borderColor: #efbe2e;" />
          <el-button type="text" style="padding: 0px 10px;color: #000;font-size: 12px;margin-left: 0px;">系统录入</el-button>
        </div>
      </div>
      <div v-loading="isRate" ref="dayBox" class="stat-box" style="float: right;width: 50%;min-width: 460px;">
        <div class="stat-title">提前投保天数占比</div>
        <div ref="insuredDayPercent" style="width: 100%;height: 400px;" />
        <div style="width: 100%;display: flex;align-items: center;justify-content: center;height: 20px;">
          <el-button circle style="padding: 6px;backgroundColor: #409eff;borderColor: #409eff;" />
          <span style="color: #000;font-size: 12px;width: 200px;margin-left: 15px;">保险止期90天-60天内;</span>
          <el-button circle style="padding: 6px;backgroundColor: #42d4c5;borderColor: #42d4c5;" />
          <span style="color: #000;font-size: 12px;width: 200px;margin-left: 15px;">保险止期59天-30天内;</span>
        </div>
        <div style="width: 100%;display: flex;align-items: center;justify-content: center;height: 20px;">
          <el-button circle style="padding: 6px;backgroundColor: #42b983;borderColor: #42b983;" />
          <span style="color: #000;font-size: 12px;width: 200px;margin-left: 15px;">保险止期29天-15天内;</span>
          <el-button circle style="padding: 6px;backgroundColor: #efbe2e;borderColor: #efbe2e;" />
          <span style="color: #000;font-size: 12px;width: 200px;margin-left: 15px;">保险止期14天内</span>
        </div>
      </div>
    </div>

    <div v-loading="isVehicle" class="stat-box">
      <div class="stat-title">进站统计</div>
      <div ref="enterCount" style="width: 100%;height: 400px;" />
      <div style="width: 100%;display: flex;align-items: center;justify-content: center;">
        <el-button circle style="padding: 6px;backgroundColor: #409eff;borderColor: #409eff;" />
        <el-button type="text" style="padding: 0px 10px;color: #000;font-size: 12px;margin-left: 0px;">到店车辆</el-button>
        <el-button circle style="padding: 6px;backgroundColor: #42b983;borderColor: #42b983;" />
        <el-button type="text" style="padding: 0px 10px;color: #000;font-size: 12px;margin-left: 0px;">到店车辆续保期内</el-button>
      </div>
    </div>

    <div v-loading="isFail" class="stat-box">
      <div class="stat-title">战败原因分析</div>
      <div style="margin-top: 20px;margin-left: 50px;max-width: 1100px;">
        <el-card v-show="failOption.data.length > 0" shadow="never" style="width: 210px;display: inline-block;margin-right: 5px;margin-bottom: 10px;">
          <div>战败</div>
          <div style="font-size: 20px;font-weight: 600;height: 40px;line-height: 40px;">{{ failOption.total }}</div>
          <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="el-progress el-progress--line el-progress--text-inside">
            <div class="el-progress-bar">
              <div class="el-progress-bar__outer" style="height: 16px;overflow: hidden;">
                <div v-for="(item,index) in failOption.data" :key="index" class="zj-progress-inner" :style="{'width': item.width,'backgroundColor': colorData[index]}" />
              </div>
            </div>
          </div>
        </el-card>
        <el-card v-for="(item,index) in failOption.data" :key="index" shadow="never" style="width: 210px;display: inline-block;margin-right: 10px;margin-bottom: 10px;">
          <div><span>{{ item.name }}</span><span v-show="item.id === 1" style="font-size: 12px;font-weight: normal;">(停机.空号.电话错)</span></div>
          <div style="font-size: 20px;font-weight: 600;height: 40px;line-height: 40px;">
            <span>{{ item.count }}</span>
            <span v-show="item.id === 9" style="font-size: 12px;font-weight: normal;">(其他：{{ item.sys }})</span>
          </div>
          <el-progress :color="colorData[index]" :text-inside="true" :stroke-width="16" :percentage="item.percent"></el-progress>
        </el-card>
      </div>
    </div>

    <div v-loading="isPreview" class="stat-box">
      <div class="stat-title">数据明细</div>
      <div style="margin-left: 50px;">
        <el-table :data="detailData" :header-cell-style="{ textAlign: 'center' }" style="margin-top: 20px;text-align: center;">
          <el-table-column prop="name" label="续保专员" />
          <el-table-column prop="count" label="总客户" />
          <el-table-column prop="insuranceCount" label="续保期客户" />
          <el-table-column label="报价概况（选定时间续保期内报价情况）">
            <el-table-column prop="pricing" label="未报价" />
            <el-table-column prop="priced" label="已报价" />
            <el-table-column :formatter="setPricePercent" label="报价率" />
          </el-table-column>
          <el-table-column label="跟进概况（选定时间续保期内跟进情况）">
            <el-table-column prop="following" label="未跟进" />
            <el-table-column prop="followed" label="已跟进" />
            <el-table-column :formatter="setFollowPercent" label="跟进率" />
          </el-table-column>
          <el-table-column label="出单概况（选定时间内续保情况「车辆」）">
            <el-table-column prop="failure" label="已战败" />
            <el-table-column prop="success" label="已出单" />
            <el-table-column :formatter="setPercent" label="出单率" />
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getStatisticYearData,
  getStatisticSalesFunnel,
  getStatisticInsureFee,
  getStatisticNewCustomer,
  getStatisticInsuranceRates,
  getStatisticArrivalVehicle,
  getStatisticCustomerFail,
  getStatisticDetailPreview
} from '@/api/customer'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      itemIndex: 0,
      isRequire: false,
      isSearch: false,
      isYear: false,
      isFunnel: false,
      isFee: false,
      isNew: false,
      isRate: false,
      isVehicle: false,
      isFail: false,
      isPreview: false,
      searchTime: dayjs().format(),
      timeDay: [
        { key: 1, value: '本月' },
        { key: 2, value: '上月' },
        { key: 3, value: '全部' }
      ],
      viewData: [],
      saleData: [],
      insuredOption: {
        data: [],
        countNum: [],
        feeNum: [],
        totalCount: null,
        totalFee: null
      },
      originData: [],
      insureData: [],
      enterOption: {
        time: [],
        car: [],
        renewal: []
      },
      failOption: {
        data: [],
        count: null
      },
      hueData: [
        '#5340FF',
        '#EFBE2E',
        '#42B983',
        '#BB52E8'
      ],
      colorData: [
        '#ed4556',
        '#ffd823',
        '#79d751',
        '#42b983',
        '#42d4c5',
        '#409eff',
        '#5340ff',
        '#bb52e8',
        '#ef6ac7'
      ],
      detailData: [],
      searchOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  computed: {
    sidebarStatus() {
      return this.$store.getters.sidebar.opened
    }
  },
  watch: {
    sidebarStatus() {
      setTimeout(
        function() {
          this.echartsResize('insurePremium', 'premiumBox')
          this.echartsResize('customerOrigin', 'originBox')
          this.echartsResize('insuredDayPercent', 'dayBox')
          this.echartsResize('enterCount', 'enterCount')
        }.bind(this),
        500
      )
    },
    $route(val) {
      if (val.path === '/carDealer/statistic') {
        this.echartsResize('insurePremium', 'premiumBox', 'route1')
        this.echartsResize('customerOrigin', 'originBox', 'route1')
        this.echartsResize('insuredDayPercent', 'dayBox', 'route1')
        this.echartsResize('enterCount', 'enterCount', 'route2')
      }
    }
  },
  created() {
    this.selectData()
    window.addEventListener(
      'resize',
      function() {
        this.echartsResize('insurePremium', 'premiumBox')
        this.echartsResize('customerOrigin', 'originBox')
        this.echartsResize('insuredDayPercent', 'dayBox')
        this.echartsResize('enterCount', 'enterCount')
      }.bind(this)
    )
  },
  methods: {
    setPercent(val) {
      return val.percent + '%'
    },
    setFollowPercent(val) {
      return val.followPercent + '%'
    },
    setPricePercent(val) {
      return val.pricePercent + '%'
    },
    reset() {
      this.insuredOption.data = []
      this.insuredOption.countNum = []
      this.insuredOption.feeNum = []
      this.insuredOption.totalCount = null
      this.insuredOption.totalFee = null
      this.originData = []
      this.insureData = []
      this.saleData = []
      this.enterOption.time = []
      this.enterOption.car = []
      this.enterOption.renewal = []
    },
    // 查询
    selectData() {
      this.reset()
      this.isRequire = true
      this.isSearch = true
      setTimeout(() => {
        this.isRequire = false
      }, 3000)
      const lastMonthBegin = dayjs(this.searchTime)
        .startOf('month')
        .format('YYYY-MM-DD')
      const lastMonthEnd = dayjs(this.searchTime)
        .endOf('month')
        .format('YYYY-MM-DD')
      const formdata = new FormData()
      formdata.append('from', lastMonthBegin)
      formdata.append('to', lastMonthEnd)
      this.queryYearData(formdata)
      this.querySalesFunnel(formdata)
      this.queryInsureFee(formdata)
      this.queryNewCustomer(formdata)
      this.queryInsuranceRates(formdata)
      this.queryArrivalVehicle(formdata)
      this.queryCustomerFail(formdata)
      this.queryDetailPreview(formdata)
      this.isSearch = false
    },
    queryYearData(formdata) {
      this.isYear = true
      getStatisticYearData(formdata).then(res => {
        const json = JSON.parse(JSON.stringify(res.data))
        json.map(item => {
          item.rate = parseFloat(item.rate)
        })
        json[0].caption = '总客户：'
        json[0].info = '到店车辆'
        json[1].info = '总报价次数'
        json[2].info = '总跟进次数'
        json[3].caption = '已出单：'
        json[3].left = json[3].left + ' （保单）'
        json[3].info = '已战败'
        this.viewData = json
        this.isYear = false
      }).catch(err => {
        console.log(err)
        this.isYear = false
      })
    },
    querySalesFunnel(formdata) {
      this.isFunnel = true
      getStatisticSalesFunnel(formdata).then(res => {
        const json = JSON.parse(JSON.stringify(res.data))
        json.map(item => {
          item.rate = item.rate + '%'
        })
        this.saleData = json
        this.getSaleData()
        this.isFunnel = false
      }).catch(err => {
        console.log(err)
        this.isFunnel = false
      })
    },
    queryInsureFee(formdata) {
      this.isFee = true
      getStatisticInsureFee(formdata).then(res => {
        res.data.chatInfo.forEach(item => {
          this.insuredOption.data.push(item.date || item.month)
          this.insuredOption.feeNum.push(item.fee)
          this.insuredOption.countNum.push(item.count)
        })
        this.insuredOption.totalCount = res.data.totalCount
        this.insuredOption.totalFee = parseFloat(res.data.totalFee).toFixed(2)
        this.getPremiumData()
        this.isFee = false
      }).catch(err => {
        console.log(err)
        this.isFee = false
      })
    },
    queryNewCustomer(formdata) {
      this.isNew = true
      getStatisticNewCustomer(formdata).then(res => {
        res.data.forEach(item => {
          this.originData.push({
            name: item.title,
            value: parseFloat(item.count)
          })
        })
        this.getOriginData()
        this.isNew = false
      }).catch(err => {
        console.log(err)
        this.isNew = false
      })
    },
    queryInsuranceRates(formdata) {
      this.isRate = true
      getStatisticInsuranceRates(formdata).then(res => {
        res.data.forEach(item => {
          this.insureData.push({
            name: item.name,
            value: parseFloat(item.num),
            rate: item.rate
          })
        })
        this.getInsuredDayData()
        this.isRate = false
      }).catch(err => {
        console.log(err)
        this.isRate = false
      })
    },
    queryArrivalVehicle(formdata) {
      this.isVehicle = true
      getStatisticArrivalVehicle(formdata).then(res => {
        res.data.forEach(item => {
          this.enterOption.car.push(item.arrivalNum)
          this.enterOption.time.push(item.statisticsTime)
          this.enterOption.renewal.push(item.endTimeNum)
        })
        this.getEnterCountData()
        this.isVehicle = false
      }).catch(err => {
        console.log(err)
        this.isVehicle = false
      })
    },
    queryCustomerFail(formdata) {
      this.isFail = true
      getStatisticCustomerFail(formdata).then(res => {
        const resDO = res.data
        const arrS = resDO.data.filter(item => item.id === 0)
        resDO.data.map((item, index) => {
          if (item.id === 9) {
            item.sys = arrS[0].count
          }
          if (item.id === 1) {
            item.name = '无效数据'
          }
          if (resDO.total > 0) {
            item.width = parseInt((item.count / resDO.total) * 168) + 'px'
          } else {
            item.width = '0px'
          }
        })
        resDO.data.shift()
        this.failOption = resDO
        this.isFail = false
      }).catch(err => {
        console.log(err)
        this.isFail = false
      })
    },
    queryDetailPreview(formdata) {
      this.isPreview = true
      getStatisticDetailPreview(formdata).then(res => {
        this.detailData = res.data
        this.isPreview = false
      }).catch(err => {
        console.log(err)
        this.isPreview = false
      })
    },
    // echarts自调整宽度
    echartsResize(ele, box, way) {
      const flag = this.sidebarStatus ? 180 : 36 // 侧边栏宽度
      const myChart = this.$echarts.init(this.$refs[ele])
      const echartsBox = this.$refs[box]
      const echartsEle = this.$refs[ele]
      if (way === 'route1') {
        echartsEle.style.width = (window.innerWidth - flag - 50) * 0.5 + 'px'
      } else if (way === 'route2') {
        echartsEle.style.width = window.innerWidth - flag - 50 + 'px'
      } else {
        echartsEle.style.width = echartsBox.clientWidth + 'px'
      }
      myChart.resize()
    },
    // echarts自调整数值
    echartsPremiumFee(data) {
      let delta, max
      const arrMax = Math.max.apply(Math, data)
      if (arrMax > 10000) {
        max = Math.ceil(arrMax / 10000) * 10000
        delta = max / 10
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
    echartsPremiumCount(data) {
      let delta, max
      const arrMax = Math.max.apply(Math, data)
      if (arrMax > 10) {
        max = Math.ceil(arrMax / 10) * 10
        delta = max / 10
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
    echartsEnterCount(data) {
      let delta, max
      const arrMax = Math.max.apply(Math, data)
      if (arrMax > 100) {
        max = Math.ceil(arrMax / 100) * 100
        delta = max / 5
        return {
          max: max,
          delta: delta
        }
      } else {
        return {
          max: 100,
          delta: 20
        }
      }
    },
    // 销售漏斗
    getSaleData() {
      const canvas = this.$refs.saleCanvas
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, 460, 444)
      ctx.beginPath()
      ctx.moveTo(50, 50)
      ctx.lineTo(350, 50)
      ctx.lineTo(320, 105)
      ctx.lineTo(80, 105)
      ctx.closePath()
      ctx.strokeStyle = '#409eff'
      ctx.stroke()
      ctx.fillStyle = '#409eff'
      ctx.fill()
      // ctx.font = '14px Arial'
      // ctx.fillStyle = '#fff'
      // ctx.fillText(this.saleData[0].rate, 185, 83)
      ctx.moveTo(330, 80)
      ctx.lineTo(360, 80)
      ctx.stroke()
      ctx.font = '14px Arial'
      ctx.fillStyle = '#ccc'
      ctx.fillText(
        this.saleData[0].title + '  ' + this.saleData[0].count,
        370,
        85
      )

      ctx.beginPath()
      ctx.moveTo(80, 105)
      ctx.lineTo(320, 105)
      ctx.lineTo(290, 160)
      ctx.lineTo(110, 160)
      ctx.closePath()
      ctx.strokeStyle = '#42b983'
      ctx.stroke()
      ctx.fillStyle = '#42b983'
      ctx.fill()
      ctx.font = '14px Arial'
      ctx.fillStyle = '#fff'
      ctx.fillText(this.saleData[1].rate, 185, 140)
      ctx.moveTo(300, 135)
      ctx.lineTo(330, 135)
      ctx.stroke()
      ctx.font = '14px Arial'
      ctx.fillStyle = '#ccc'
      ctx.fillText(
        this.saleData[1].title + '  ' + this.saleData[1].count,
        340,
        140
      )

      ctx.beginPath()
      ctx.moveTo(110, 160)
      ctx.lineTo(290, 160)
      ctx.lineTo(250, 215)
      ctx.lineTo(150, 215)
      ctx.closePath()
      ctx.strokeStyle = '#efbe2e'
      ctx.stroke()
      ctx.fillStyle = '#efbe2e'
      ctx.fill()
      ctx.font = '14px Arial'
      ctx.fillStyle = '#fff'
      ctx.fillText(this.saleData[2].rate, 185, 192)
      ctx.moveTo(260, 190)
      ctx.lineTo(295, 190)
      ctx.stroke()
      ctx.font = '14px Arial'
      ctx.fillStyle = '#ccc'
      ctx.fillText(
        this.saleData[2].title + '  ' + this.saleData[2].count,
        305,
        195
      )

      ctx.beginPath()
      ctx.moveTo(150, 215)
      ctx.lineTo(250, 215)
      ctx.lineTo(230, 270)
      ctx.lineTo(170, 270)
      ctx.closePath()
      ctx.strokeStyle = '#5340ff'
      ctx.stroke()
      ctx.fillStyle = '#5340ff'
      ctx.fill()
      ctx.font = '14px Arial'
      ctx.fillStyle = '#fff'
      ctx.fillText(this.saleData[3].rate, 185, 247)
      ctx.moveTo(240, 243)
      ctx.lineTo(265, 243)
      ctx.stroke()
      ctx.font = '14px Arial'
      ctx.fillStyle = '#ccc'
      ctx.fillText(
        this.saleData[3].title + '  ' + this.saleData[3].count,
        275,
        248
      )

      ctx.beginPath()
      ctx.moveTo(170, 270)
      ctx.lineTo(230, 270)
      ctx.lineTo(230, 325)
      ctx.lineTo(170, 325)
      ctx.closePath()
      ctx.strokeStyle = '#bb52e8'
      ctx.stroke()
      ctx.fillStyle = '#bb52e8'
      ctx.fill()
      ctx.font = '14px Arial'
      ctx.fillStyle = '#fff'
      ctx.fillText(this.saleData[4].rate, 185, 300)
      ctx.moveTo(230, 295)
      ctx.lineTo(250, 295)
      ctx.stroke()
      ctx.font = '14px Arial'
      ctx.fillStyle = '#ccc'
      ctx.fillText(
        this.saleData[4].title + '  ' + this.saleData[4].count + ' （车辆）',
        260,
        300
      )
    },
    // 保单保费数
    getPremiumData() {
      const myChart = this.$echarts.init(this.$refs.insurePremium)
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        xAxis: [
          {
            type: 'category',
            data: this.insuredOption.data,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '保费数',
            min: 0,
            max: this.echartsPremiumFee(this.insuredOption.feeNum).max,
            interval: this.echartsPremiumFee(this.insuredOption.feeNum).delta,
            axisLabel: {
              formatter: '{value}'
            },
            splitLine: { show: false }
          },
          {
            type: 'value',
            name: '保单数',
            min: 0,
            max: this.echartsPremiumCount(this.insuredOption.countNum).max,
            interval: this.echartsPremiumCount(this.insuredOption.countNum)
              .delta,
            axisLabel: {
              formatter: '{value}'
            },
            splitLine: { show: false }
          }
        ],
        series: [
          {
            name: '保费数',
            type: 'bar',
            yAxisIndex: 0,
            itemStyle: {
              normal: {
                color: '#42b983'
              }
            },
            data: this.insuredOption.feeNum
          },
          {
            name: '保单数',
            type: 'bar',
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: '#44a0ff'
              }
            },
            data: this.insuredOption.countNum
          }
        ]
      }
      if (option && typeof option === 'object') {
        myChart.setOption(option, true)
      }
    },
    // 新增客户来源
    getOriginData() {
      const myChart = this.$echarts.init(this.$refs.customerOrigin)
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        color: ['#efbe2e', '#409eff', '#42b983', '#42d4c5'],
        series: [
          {
            name: '新增客户来源',
            type: 'pie',
            radius: ['40%', '60%'],
            startAngle: 180,
            label: {
              normal: {
                position: 'outside',
                formatter: '{b}: {d}%'
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: '#aaa'
                },
                smooth: 0.2,
                length: 20,
                length2: 0
              }
            },
            data: this.originData
          }
        ]
      }
      if (option && typeof option === 'object') {
        myChart.setOption(option, true)
      }
    },
    // 提前投保天数占比
    getInsuredDayData() {
      const myChart = this.$echarts.init(this.$refs.insuredDayPercent)
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        color: ['#409eff', '#42d4c5', '#42b983', '#efbe2e'],
        series: [
          {
            name: '提前投保天数占比',
            type: 'pie',
            radius: ['40%', '60%'],
            startAngle: 180,
            label: {
              normal: {
                position: 'outside',
                // formatter: '{b}: {d}%',
                formatter: function(val) {
                  return (
                    val.data.name.split('-').join('- \n') + val.data.rate + '%'
                  )
                },
                textStyle: {
                  align: 'left',
                  baseline: 'top'
                }
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: '#aaa'
                },
                smooth: 0.2,
                length: 20,
                length2: 0
              }
            },
            data: this.insureData
          }
        ]
      }
      if (option && typeof option === 'object') {
        myChart.setOption(option, true)
      }
    },
    // 进站统计
    getEnterCountData() {
      const myChart = this.$echarts.init(this.$refs.enterCount)
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          top: '8%',
          left: '3%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.enterOption.time
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            max: this.echartsEnterCount(this.enterOption.car).max,
            interval: this.echartsEnterCount(this.enterOption.car).delta
          }
        ],
        series: [
          {
            name: '到店车辆',
            type: 'line',
            areaStyle: {},
            itemStyle: {
              normal: {
                color: '#b7ddff',
                lineStyle: {
                  color: '#409eff'
                }
              }
            },
            data: this.enterOption.car
          },
          {
            name: '到店车辆续保期内',
            type: 'line',
            areaStyle: {},
            itemStyle: {
              normal: {
                color: '#b8edce',
                lineStyle: {
                  color: '#42b983'
                }
              }
            },
            data: this.enterOption.renewal
          }
        ]
      }
      if (option && typeof option === 'object') {
        myChart.setOption(option, true)
      }
    }
  }
}
</script>

<style lang="scss">
.stat-contain {
  min-width: 1000px;
  .zj-progress-inner {
    float: left;
    height: 100%;
    line-height: 1;
    white-space: nowrap;
  }
}
.stat-box {
  box-sizing: border-box;
  padding: 20px;
  border-color: #e8e8e8;
  background-color: #fff;
  margin-bottom: 15px;
}
.stat-title {
  font-size: 16px;
  line-height: 30px;
  font-weight: 800;
  text-align: left;
  border-bottom: 1px solid #ebeef5;
}
</style>

