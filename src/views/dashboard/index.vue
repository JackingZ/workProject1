<template>
  <div class="app-container dashboard">
    <div class="app-panel">
      <div class="dashboard-container">
        <div class="dashboard-text">{{ username }}，{{ greeting }}</div>
      </div>
      <div v-if="showReportChart">
        <div class="top-content">
          <div v-loading="loading.card" class="left-side" @click="goToStatistic">
            <div class="side-title">{{ isAnyAdminChannel ? '今日数据' : '本月数据' }}</div>
            <card-info-list :data="cardInfoData" />
          </div>
          <div v-if="isAnyAdminChannel" class="right-side">
            <div class="side-title">渠道商数据</div>
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr height="43">
                <td width="100">渠道类型</td>
                <td width="100">累计数量</td>
                <td width="100">本月新增</td>
                <td width="100">现存合作</td>
              </tr>
              <tr
                v-for="(item, index) in statisticsList"
                :key="index"
                height="43">
                <td width="100">{{ item.typeName }}</td>
                <td width="100">{{ item.count }}</td>
                <td width="100">{{ item.addCount }}</td>
                <td width="100">{{ item.cooperationCount }}</td>
              </tr>
            </table>
          </div>
        </div>
        <div v-loading="loading.normalOrder" v-if="!isAnyAdminChannel" @click="goToPerformanceAnalysis">
          <div class="side-title">出单波动概况：</div>
          <ve-histogram
            :y-axis="normalYaxis"
            :colors="chartColors"
            :legend="disableLegend"
            :data="normalOrderChartData"
            :settings="normalOrderChartSetting"
            :extend="lineExtend"/>
        </div>
        <div v-loading="loading.mobileOrder" v-if="isAnyAdminChannel" @click="goToPerformanceAnalysis">
          <div class="side-title">移动出单波动概况：</div>
          <ve-histogram
            :y-axis="mobileYaxis"
            :colors="chartColors"
            :data="mobileChartData"
            :legend="disableLegend"
            :settings="mobileChartSettings"
            :extend="lineExtend"/>
        </div>
        <div v-loading="loading.pcOrder" v-if="isAnyAdminChannel" @click="goToPerformanceAnalysis">
          <div class="side-title">电脑出单波动概况：</div>
          <ve-histogram
            :y-axis="pcYaxis"
            :data="pcChartData"
            :legend="disableLegend"
            :settings="pcChartSettings"
            :extend="lineExtend"/>
        </div>
        <div v-loading="loading.expire" @click="goToCustomer">
          <div class="side-title">车辆到期分布</div>
          <div style="text-align: center;margin: 15px;">累计车牌量:{{ customerCount }}</div>
          <ve-ring
            :data="ringChartData"
            :legend="ringLegend"
            :settings="ringChartSetting"
            height="300px"/>
        </div>
        <div v-loading="loading.area" v-if="isAnyAdminChannel">
          <div>保司地区分布</div>
          <el-row type="flex" style="flex-flow: row wrap;">
            <el-select
              v-model="mapFilter.selectChannel"
              clearable
              filterable
              multiple
              collapse-tags
              placeholder="所属渠道"
              size="small"
              class="filter"
              style="width:200px;"
              @change="onChannelChange">
              <el-option v-for="item in channelList" :key="item.code" :label="item.shortName" :value="item.code" />
            </el-select>
            <el-select
              v-model="mapFilter.channelType"
              clearable
              filterable
              placeholder="工号类型"
              size="small"
              class="filter"
              style="width:140px;"
              @change="onChannelTypeChange">
              <el-option v-for="item in channelTypeList" :key="item.value" :label="item.key" :value="item.value" />
            </el-select>
            <el-select
              v-model="mapFilter.permissionType"
              clearable
              filterable
              placeholder="权限类型"
              size="small"
              class="filter"
              style="width:140px;"
              @change="onPermissionTypeChange">
              <el-option v-for="item in permissionTypeList" :key="item.value" :label="item.key" :value="item.value" />
            </el-select>
          </el-row>
          <div class="center map-wrap">
            <ve-map
              :data="mapChartData"
              :settings="mapChartSettings"
              :visual-map="mapChartVisualMap"
              :tooltip="mapTooltip"
              :legend="mapLegend"
              width="900px"
              height="700px"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getChannelInfo } from '@/api/organization'
import { mapGetters } from 'vuex'
import CardInfoList from '@/views/dashboard/cardInfoList'
import { mapData } from '@/views/dashboard/chinaMapData'
import { getAllChannelData } from '@/api/number'
import { channelStatistics, homeTopData, homeOrderChange, homeCustomer, homeCompany } from '@/api/report'
import dayjs from 'dayjs'
let companyList = [] // mapTooltip拿不到组件this设置的变量
import mixin from '@/views/dashboard/mixin'
import { checkPermissions } from '@/router/guard'
import { initBrowserUtil } from '@/views/insurance/service/browserUtil'
export default {
  name: 'Dashboard',
  components: {
    CardInfoList
  },
  mixins: [mixin],
  data() {
    return {
      rangList: [0, 10, 100, 500, 1000, 2500, 5000, 10 * 1000, 25 * 1000, 50 * 1000, 100 * 1000, 250 * 1000, 500 * 1000, 1000 * 1000, 2500 * 1000, 5000 * 1000, 10 * 1000 * 1000],
      loading: {
        card: false,
        normalOrder: false,
        pcOrder: false,
        mobileOrder: false,
        expire: false,
        area: false
      },
      cardInfoData: {
        quote: {
          title: '报价成功车牌量',
          count: '',
          percent: void 0
        },
        finsh: {
          title: '成交车牌量',
          count: '',
          percent: void 0
        },
        pay: {
          title: '出单件数',
          count: '',
          percent: void 0
        },
        amount: {
          title: '成交保费(元)',
          count: '',
          percent: void 0
        }
      },
      statisticsList: [], // 渠道数据列表
      lineExtend: {
        series: {
          smooth: false,
          // 折线图圆点 设置
          symbol: 'circle',
          symbolSize: 6
        }
      },
      chartColors: ['#FF7F50', '#87CEFA', '#DA70D6'],
      normalOrderChartSetting: {
        showLine: ['成交保费'],
        axisSite: { right: ['成交保费'] },
        yAxisType: ['normal', 'normal'],
        yAxisName: ['(单位：辆)', '(单位：元)']
      },
      normalOrderChartData: {
        columns: ['date', '成交车牌量', '成交保费'],
        rows: []
      },
      normalYaxis: [
        {
          max: 10
        },
        {
          max: 10000
        }
      ],
      mobileChartSettings: {
        showLine: ['成交保费'],
        axisSite: { right: ['成交保费'] },
        yAxisType: ['normal', 'normal'],
        yAxisName: ['(单位：辆)', '(单位：元)']
      },
      mobileChartData: {
        columns: ['date', '查询续保车牌量', '成交车牌量', '成交保费'],
        rows: []
      },
      mobileYaxis: [
        {
          max: 10
        },
        {
          max: 10000
        }
      ],
      pcYaxis: [
        {
          max: 10
        },
        {
          max: 10000
        }
      ],
      pcChartSettings: {
        showLine: ['成交保费'],
        axisSite: { right: ['成交保费'] },
        yAxisType: ['normal', 'normal'],
        yAxisName: ['(单位：辆)', '(单位：元)']
      },
      pcChartData: {
        columns: ['date', '成交车牌量', '成交保费'],
        rows: []
      },
      ringChartSetting: {
        radius: [60, 90],
        offsetY: 160,
        label: {
          formatter: function(params) {
            // console.log('params', params)
            return `${params.name}\n${params.value}\n${params.percent}%`
          }
        }
      },
      ringChartData: {
        columns: ['title', '访问用户'],
        rows: [
          // { 'title': '30天内到期', '访问用户': 1393 },
        ]
      },
      disableLegend: {
        show: true,
        selectedMode: false
      },
      ringLegend: {
        show: false
      },
      customerCount: 0,
      mapChartData: {
        columns: ['position', 'company', 'list'],
        rows: [
          // { 'position': '吉林', 'company': 123 }
        ]
      },
      mapChartSettings: {
        position: 'china',
        itemStyle: {
          areaColor: '#CCECFF',
          borderColor: '#FBFDFF'
        },
        mapOrigin: mapData // 地图坐标数据
        // roam: true // 滚轮缩放平移
      },
      mapChartVisualMap: {
        min: 0,
        max: 20,
        show: false,
        inRange: {
          color: ['#e0ffff', '#FFC000']
        }
      },
      mapLegend: {
        show: false
      },
      mapTooltip: {
        formatter: function(params) {
          const index = params.dataIndex
          const item = companyList[index]
          if (index >= 0 && item && item.list) {
            if (item.list.length === 1) return item.list[0].name
            const getPrevious = (item) => {
              if (item.name) return item.name + '<br>'
              if (typeof item === 'string') return item + '<br>'
              return ''
            }
            return item.list.reduce((previous, next) => {
              return `${getPrevious(previous)} ${next.name || ''}`
            })
          }
          return null
        }
      },
      channelList: [],
      channelTypeList: [
        { key: '全部', value: '0' },
        { key: '移动端', value: '1' },
        { key: '电脑端', value: '2' }
      ],
      permissionTypeList: [
        { key: '查续保', value: '0' },
        { key: '报价', value: '1' },
        { key: '核保', value: '2' },
        { key: '支付', value: '3' }
      ],
      mapFilter: {
        selectChannel: [],
        channelType: '', // 工号类型 0全部/1线上/2线下，不传默认0
        permissionType: '' // 0查续保/1报价/2核保/3支付
      },
      hasPermission: false
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否是管理员渠道
    ]),
    isCarDealer() {
      const carDealer = this.$store.getters.userAll.data.carDealer
      return carDealer === 0 // 是否车商渠道帐号
    },
    showReportChart() {
      return this.hasPermission && !this.isCarDealer
    }
  },
  created() {
    this.username = JSON.parse(localStorage.getItem('userInfo')).user_name
    this.username = JSON.parse(localStorage.getItem('userAll')).data.userName
    const hour = new Date().getHours()
    if ((hour >= 0) && (hour <= 4)) { this.greeting = '已经夜深了，请注意休息哦！' }
    if ((hour >= 4) && (hour < 7)) { this.greeting = '美好的一天从清晨开始，早安！ ' }
    if ((hour >= 7) && (hour < 12)) { this.greeting = '上午好，祝您保持心情愉快！' }
    if ((hour >= 12) && (hour <= 13)) { this.greeting = '现在是午饭时间，你做什么好吃的了吗？' }
    if ((hour >= 13) && (hour <= 14)) { this.greeting = '该午休了，希望您能够劳逸结合！ ' }
    if ((hour >= 14) && (hour <= 18)) { this.greeting = '下午好，中午养足了精神吗?！' }
    if ((hour >= 18) && (hour <= 19)) { this.greeting = '今晚时分，天空好美。' }
    if ((hour >= 19) && (hour <= 23)) { this.greeting = '一天又快过去了，你今天收获很多吧？' }

    this.hasPermission = checkPermissions(this.permissionList.reportFormIndex)
    if (this.hasPermission && !this.isCarDealer) this.getData()
    this.initQuickIssue()
    initBrowserUtil()
  },
  methods: {
    getData() {
      if (this.isAnyAdminChannel) {
        // 渠道数据统计
        channelStatistics()
          .then(res => res.status === 200 && res.data && (this.statisticsList = [...res.data]))
      }
      this.getTopList()
      this.getOrderChangeList()
      this.getCustomerData()
      this.getCompanyData()
      this.getChannelList()
      // 获取当前登录渠道简称
      const channelCode = this.$store.getters.userAll.data.channelCode
      getChannelInfo(channelCode).then(res => {
        if (res && res.status === 200) {
          if (res.data.shortName) localStorage.setItem('channel_shortName', res.data.shortName)
        }
      })
    },
    getTopList() {
      let params = {}
      // 运维显示今日数据
      if (this.isAnyAdminChannel) {
        const now = new Date()
        params = {
          startDate: dayjs(now).format('YYYY-MM-DD'),
          endDate: dayjs(now).format('YYYY-MM-DD')
        }
      } else {
        const start = new Date()
        start.setDate(1) // 本月1号
        start.setHours(0, 0, 0)
        const end = new Date()
        params = {
          startDate: dayjs(start).format('YYYY-MM-DD'),
          endDate: dayjs(end).format('YYYY-MM-DD')
        }
      }
      this.loading.card = true
      homeTopData(params).then(res => {
        this.loading.card = false
        const list = res && res.data && res.data.list
        if (!list) return
        list.forEach(item => {
          const cardInfoData = this.cardInfoData
          const keys = {
            15: 'quote',
            20: 'finsh',
            23: 'pay',
            28: 'amount'
          }
          const key = keys[item.type]
          // switch (item.type) {
          //   case 0:
          //     key = 'quote'
          //     break
          //   case 1:
          //     key = 'finsh'
          //     break
          //   case 2:
          //     key = 'pay'
          //     break
          //   case 3:
          //     key = 'amount'
          //     break
          // }
          cardInfoData[key].count = item.value
          cardInfoData[key].percent = item.chain
        })
      }).catch(e => {
        this.loading.card = false
      })
    },
    // 出单波动
    getOrderChangeList() {
      if (this.isAnyAdminChannel) {
        // 移动出单
        this.loading.mobileOrder = true
        this.queryOrderChangeImplement(1, (array) => {
          this.loading.mobileOrder = false
          if (!array) return
          // 优化y坐标显示
          this.$set(this, 'mobileYaxis', [
            {
              max: Math.max(
                this.getMaxYaxis({
                  array,
                  key: '成交车牌量'
                }),
                this.getMaxYaxis({
                  array,
                  key: '查询续保车牌量'
                })
              ),
              axisTick: {
                show: false
              }
            },
            {
              max: this.getMaxYaxis({
                array,
                key: '成交保费'
              }),
              axisTick: {
                show: false
              }
            }
          ])
          this.$nextTick(() => {
            this.$set(this.mobileChartData, 'rows', array)
          })
        })
        // pc出单
        this.loading.pcOrder = true
        this.queryOrderChangeImplement(2, (array) => {
          this.loading.pcOrder = false
          if (!array) return
          // 优化y坐标显示
          this.$set(this, 'pcYaxis', [
            {
              max: this.getMaxYaxis({
                array,
                key: '成交车牌量'
              }),
              axisTick: {
                show: false
              }
            },
            {
              max: this.getMaxYaxis({
                array,
                key: '成交保费'
              }),
              axisTick: {
                show: false
              }
            }
          ])
          this.$set(this.pcChartData, 'rows', array)
        })
        return
      } else {
        // 全部
        this.loading.normalOrder = true
        this.queryOrderChangeImplement(0, (array) => {
          this.loading.normalOrder = false
          if (!array) return
          // 优化y坐标显示
          this.$set(this, 'normalYaxis', [
            {
              max: this.getMaxYaxis({
                array,
                key: '成交车牌量'
              }),
              axisTick: {
                show: false
              }
            },
            {
              max: this.getMaxYaxis({
                array,
                key: '成交保费'
              }),
              axisTick: {
                show: false
              }
            }
          ])
          this.$set(this.normalOrderChartData, 'rows', array)
        })
      }
    },
    getMaxYaxis({ array, key }) {
      const list = this.rangList
      const maxValue = this.getMaxValue({ array, key })
      const res = list.find((item, index) => {
        if (index === 0) return false
        if (maxValue >= list[index - 1] && maxValue <= item) return item
      })
      return res
    },
    getMaxValue({ array, key }) {
      const valueList = array.map(item => parseFloat(item[key]))
      return Math.max(...valueList)
    },
    queryOrderChangeImplement(queryType, callback) {
      // 本月
      const start = new Date()
      start.setDate(1) // 本月1号
      start.setHours(0, 0, 0)
      const end = new Date()
      homeOrderChange({
        startDate: dayjs(start).format('YYYY-MM-DD'),
        endDate: dayjs(end).format('YYYY-MM-DD'),
        queryType
      }).then(res => {
        console.log('homeOrderChange', res)
        if (res.status === 200 && res.data) {
          const { list } = res.data
          const temp = list.map(item => {
            return {
              date: dayjs(item.date).format('MM-DD'),
              '成交车牌量': item.issueLicenseNo || 0,
              '成交保费': item.issuePremium || 0,
              '查询续保车牌量': item.renewalLicenseNo || 0
            }
          })
          callback && callback(temp)
        } else callback && callback()
      }).catch(e => {
        callback && callback()
      })
    },
    getCustomerData() {
      const mapFunc = (item) => {
        const titles = ['30天内到期', '30-90天内到期', '未到期', '其他']
        return {
          title: titles[item.type],
          '访问用户': item.value
        }
      }
      this.loading.expire = true
      homeCustomer().then(res => {
        this.loading.expire = false
        console.log('homeCustomer', res)
        if (res.status === 200 && res.data) {
          const { list, total } = res.data
          this.customerCount = total || 0
          const array = list.map(mapFunc)
          this.$set(this.ringChartData, 'rows', array)
        }
      }).catch(e => {
        this.loading.expire = false
      })
    },
    getCompanyData() {
      if (!this.isAnyAdminChannel) return
      const mapFunc = (item) => {
        return {
          position: item.province,
          company: item.companyList.length,
          list: [...item.companyList]
        }
      }
      const params = {}
      const condition = this.mapFilter
      if (condition.selectChannel.length > 0) params.sourceCode = condition.selectChannel.join(',')
      if (condition.channelType) params.channelType = condition.channelType
      if (condition.permissionType) params.permissionType = condition.permissionType
      this.loading.area = true
      homeCompany(params).then(res => {
        this.loading.area = false
        if (res.status === 200 && res.data) {
          const { list } = res.data
          const array = list.map(mapFunc)
          companyList = [...array]
          this.$set(this.mapChartData, 'rows', array)
        }
      }).catch(e => {
        this.loading.area = false
      })
    },
    getChannelList() {
      if (!this.isAnyAdminChannel) return
      getAllChannelData().then(res => {
        this.channelList = res.data
      })
    },
    onChannelChange() {
      this.getCompanyData()
    },
    onChannelTypeChange() {
      this.getCompanyData()
    },
    onPermissionTypeChange() {
      this.getCompanyData()
    },
    // 跳转到业务统计
    goToStatistic() {
      if (!this.checkPermissions(this.permissionList.businessStatistics)) return
      this.$router.push({ path: '/report/businessState', query: { fromExternal: true }})
    },
    // 跳转到业绩分析
    goToPerformanceAnalysis() {
      if (!this.checkPermissions(this.permissionList.businessAnalyze)) return
      this.$router.push({ path: '/report/PerformanceAnalysis', query: { fromExternal: true }})
    },
    // 跳到业务管理的客户管理
    goToCustomer() {
      const version = process.env.BUILD_VER
      const prefix = (function() {
        switch (version) {
          case 'test':
            return 'newManagerTest'
          case 'test2':
            return 'newManagerTest2'
          default:
            return 'newManager'
        }
      }())
      const host = process.env.NODE_ENV === 'production' ? '' : '//ybinsure.com'
      const token = this.$store.state.user.token
      const url = `${host}/spa/${prefix}/?token=${token}&tab=business`
      // const a = document.createElement('a')
      // document.body.appendChild(a)
      // a.href = url
      // a.target = '_blank'
      // a.click()
      // document.body.removeChild(a)
      window.open(url)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.dashboard {
  .filter {
    margin: 10px 10px 10px 0;
  }
  .center{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .app-panel{
    overflow: auto;
    height: calc(100vh - 120px);
  }
  .side-title{
    font-size: 15px;
    padding-left: 5px;
  }
  .top-content{
    white-space: nowrap;
  }
  .left-side{
    display: inline-block;
  }
  .right-side{
    display: inline-block;
    vertical-align: top;
    width: 400px;
    margin-right: 20px;
    table{
      margin: 15px 0;
      table-layout: fixed;
      border-top: 1px solid #ebeef5;
      border-left: 1px solid #ebeef5;
    }
    td {
      border-bottom: 1px solid #ebeef5;
      border-right: 1px solid #ebeef5;
      text-align: center;
      font-size: 14px;
    }
  }
  .map-wrap{
    min-width: 900px;
  }

  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
