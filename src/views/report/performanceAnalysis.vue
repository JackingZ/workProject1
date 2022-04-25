<template>
  <div class="app-container">
    <head-info
      title="业绩分析"
      info="出单波动概况" />
    <div class="app-panel channel-right">

      <el-row type="flex" justify="start" align="middle" style="margin-bottom: 20px;">

        <el-select
          v-if="isAnyAdminChannel"
          id="channel"
          v-model="formData.issueType"
          size="small"
          clearable
          filterable
          collapse-tags
          placeholder="出单方式"
          style="margin-right: 10px;min-width: 200px;">
          <el-option
            v-for="item in billingList"
            :key="item.key"
            :label="item.value"
            :value="item.key"/>
        </el-select>

        <el-select
          v-model="formData.companyValue"
          size="small"
          clearable
          filterable
          multiple
          placeholder="保险公司"
          style="margin-right: 10px;min-width: 200px;">
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>

        <el-select
          v-if="isAnyAdminChannel"
          id="channel"
          v-model="formData.sourceCode"
          size="small"
          clearable
          filterable
          multiple
          collapse-tags
          placeholder="所属渠道"
          style="margin-right: 10px;min-width: 260px;"
          @change="onChannelChange">
          <el-option
            v-for="item in channelList"
            :key="item.code"
            :label="item.shortName"
            :value="item.code"/>
        </el-select>

        <my-tree-select
          v-if="isShowOrgList"
          :options="orgList"
          v-model="formData.organizationId"
          :normalizer="normalizer"
          no-options-text="数据加载中..."
          no-children-text=""
          style="width:200px;display: inline-block;vertical-align: top;margin-right: 10px;"
          class="filter"
          placeholder="选择机构"
          no-results-text="未找到结果"/>

        <el-date-picker
          :picker-options="datepickerOptions"
          :default-time="['0:00:00', '23:59:59']"
          v-model="formData.date"
          :clearable="false"
          class="filter"
          size="small"
          style="margin-right: 10px;"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="onTimeChange"/>

        <el-button
          type="primary"
          size="small"
          @click="queryAll">查询</el-button>

      </el-row>

      <div style="width: 100%;height: calc(100vh - 258px);overflow-y: auto;">
        <el-row type="flex" justify="space-between" align="middle">
          <div v-loading="isLoadingCommand" style="min-width: 380px;width: 32%;height: 300px;border: 1px solid #DCDFE6;padding: 10px;">
            <div style="display: flex;flex-flow: row nowrap;justify-content: space-between;align-items: center">
              <div>成交保费</div>
              <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                  {{ dealPremiumQueryTitle }}<i class="el-icon-arrow-down el-icon--right"/>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="2">按日</el-dropdown-item>
                  <el-dropdown-item :command="3">按周</el-dropdown-item>
                  <el-dropdown-item :command="4">按月</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div style="font-size: 14px;color: #909399;margin-top: 5px;">{{ stime }}至{{ etime }}</div>
            <!--<div style="text-align: center;margin-top: 5px;">{{ today }}</div>-->
            <div style="text-align: center;margin-top: 5px;">累计：<span style="color: #409EFF;">{{ premiumTotal }}元</span></div>
            <ve-line :data="graphData.dealPremium" :legend-visible="false" :events="chartEvents" height="250px"/>
          </div>
          <div v-loading="isLoadingPremium" style="min-width: 380px;width: 32%;height: 300px;border: 1px solid #DCDFE6;padding: 10px;">
            <div>{{ channelOrOrg }}分布（保费）</div>
            <ve-ring
              :data="graphData.channelPremium"
              :legend-visible="false"
              :settings="ringChartSetting"/>
          </div>
          <div v-loading="isLoadingPremium" style="min-width: 380px;width: 32%;height: 300px;border: 1px solid #DCDFE6;padding: 10px;">
            <div>保险公司分布（保费）</div>
            <ve-ring
              :data="graphData.companyPremium"
              :legend-visible="false"
              :settings="ringChartSetting"/>
          </div>
        </el-row>

        <el-row type="flex" justify="space-between" align="middle" style="margin-top: 10px;">
          <div v-loading="isLoadingLicense" style="min-width: 380px;width: 32%;height: 300px;border: 1px solid #DCDFE6;padding: 10px;">
            <div style="display: flex;flex-flow: row nowrap;justify-content: space-between;align-items: center">
              <div>成交车牌量</div>
              <el-dropdown trigger="click" @command="handleLicense">
                <span class="el-dropdown-link">
                  {{ licenseNoCountTitle }}<i class="el-icon-arrow-down el-icon--right"/>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="5">按日</el-dropdown-item>
                  <el-dropdown-item :command="6">按周</el-dropdown-item>
                  <el-dropdown-item :command="7">按月</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div style="font-size: 14px;color: #909399;margin-top: 5px;">{{ stime }}至{{ etime }}</div>
            <!--<div style="text-align: center;margin-top: 5px;">{{ today }}</div>-->
            <div style="text-align: center;margin-top: 5px;">累计：<span style="color: #409EFF;">{{ dealLicenseTotal }}辆</span></div>
            <ve-line :data="graphData.dealLicense" :legend-visible="false" :y-axis="pcYaxis" height="250px"/>
          </div>
          <div v-loading="isLoadingCars" style="min-width: 380px;width: 32%;height: 300px;border: 1px solid #DCDFE6;padding: 10px;">
            <div>{{ channelOrOrg }}分布（车牌量）</div>
            <ve-ring
              :data="graphData.dealChannel"
              :legend-visible="false"
              :settings="ringChartSetting"/>
          </div>
          <div v-loading="isLoadingCars" style="min-width: 380px;width: 32%;height: 300px;border: 1px solid #DCDFE6;padding: 10px;">
            <div>保险公司分布（车牌量）</div>
            <ve-ring
              :data="graphData.dealCompany"
              :legend-visible="false"
              :settings="ringChartSetting"/>
          </div>
        </el-row>
      </div>

    </div>
  </div>
</template>
<script>
import { options } from '@/views/report/dateOptions'
import MyTreeSelect from '@/components/MyTreeSelect'
import { mapGetters } from 'vuex'
import { getOrgData } from '@/api/system'
import { getAllChannelData, getPerformance, getCompanysData } from '@/api/number'
import dayjs from 'dayjs'
export default {
  name: 'PerformanceAnalysis',
  components: {
    MyTreeSelect
  },
  data() {
    // const self = this
    this.chartEvents = {
      click: function(e) {
        // self.name = e.name
        console.log(e)
      }
    }
    return {
      dealPremiumQueryTitle: '按日',
      premiumInfoType: 2,
      licenseNoCountTitle: '按日',
      licenseNoCountInfo: 5,
      premiumTotal: 0,
      dealLicenseTotal: 0,
      stime: '',
      etime: '',
      today: '',
      channelOrOrg: '渠道',
      ringChartSetting: {
        radius: [60, 90],
        offsetY: 130
      },
      pcYaxis: {
        minInterval: 1,
        axisTick: {
          show: false
        }
      },
      graphData: {
        dealPremium: { // 成交保费
          columns: ['日期', '成交保费'],
          rows: []
        },
        dealLicense: {
          columns: ['日期', '成交车牌量'],
          rows: []
        },
        companyPremium: {
          columns: ['保险公司', '保费'],
          rows: []
        },
        channelPremium: {
          columns: ['渠道', '保费'],
          rows: []
        },
        dealChannel: {
          columns: ['渠道', '车牌量'],
          rows: []
        },
        dealCompany: {
          columns: ['保险公司', '车牌量'],
          rows: []
        }
      },
      isLoadingCommand: false,
      isLoadingLicense: false,
      isLoadingPremium: false,
      isLoadingCars: false,
      channelList: [],
      companyList: [],
      orgList: [], // 机构列表
      datepickerOptions: {
        shortcuts: [...options]
      },
      billingList: [
        { key: 1, value: '移动出单' },
        { key: 2, value: '电脑出单' }
      ], // 出单方式
      formData: {
        sourceCode: [], // 渠道编码
        organizationId: undefined, // 机构编码
        companyValue: undefined, // 保险公司
        date: undefined,
        issueType: undefined // 出单方式
      }
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否是管理员渠道
    ]),
    isShowOrgList() {
      return this.formData.sourceCode && this.formData.sourceCode.length === 1
    }
  },
  watch: {
    'formData.sourceCode'(newVal) {
      if (!newVal || newVal.length === 0) this.formData.organizationId = ''
    }
  },
  activated() {
    if (this.isAnyAdminChannel) this.getChannelList()
  },
  created() {
    this.getChannelList()
    getCompanysData()
      .then(res => {
        this.companyList = res.data
      })
    if (this.isAnyAdminChannel) {
      // 初始化默认时间
      const nowYear = new Date().getFullYear()
      const nowMonth = new Date().getMonth()
      const nowDay = new Date().getDate()
      const end = new Date(nowYear, nowMonth, nowDay, 23, 59, 59)
      const start = new Date(nowYear, nowMonth, nowDay, 0, 0, 0)
      this.formData.date = [start, end]
    } else {
      // 初始化默认渠道
      this.formData.sourceCode = [JSON.parse(localStorage.getItem('userAll')).data.channelCode]
      this.getOrgList()
      // 初始化默认时间
      const start = new Date()
      start.setDate(1) // 本月1号
      start.setHours(0, 0, 0)
      const end = new Date()
      end.setHours(23, 59, 59)
      this.formData.date = [start, end]
    }
    this.queryAll()
  },
  methods: {
    handleCommand(c) {
      this.premiumInfoType = c
      if (c === 2) {
        this.dealPremiumQueryTitle = '按日'
      }

      if (c === 3) {
        this.dealPremiumQueryTitle = '按周'
      }

      if (c === 4) {
        this.dealPremiumQueryTitle = '按月'
      }
      const data = this.formData
      const startDate = data.date ? dayjs(data.date[0]).format('YYYY-MM-DD') : undefined
      const endDate = data.date ? dayjs(data.date[1]).format('YYYY-MM-DD') : undefined
      function getParams(type = 0) {
        return {
          startDate,
          endDate,
          sourceCode: data.sourceCode.length ? data.sourceCode.join(',') : undefined,
          organizationId: data.organizationId ? data.organizationId : undefined,
          queryType: type,
          issueType: data.issueType ? data.issueType : undefined,
          companyId: data.companyValue && data.companyValue.length === 1 ? data.companyValue[0] : undefined,
          company: data.companyValue && data.companyValue.length === 2 ? data.companyValue.join(',') : undefined
        }
      }
      this.isLoadingCommand = true
      getPerformance(getParams(c))
        .then(res => {
          this.isLoadingCommand = false
          const { premiumInfo } = res.data
          // 设置成交保费
          this.graphData.dealPremium.rows = premiumInfo.list && premiumInfo.list.length ? premiumInfo.list.map(item => ({ '日期': this.filterYear(c, c === 4 || c === 7 ? item.name : item.date), '成交保费': item.value })) : []
          this.premiumTotal = premiumInfo.total
        })
        .catch(err => {
          this.isLoadingCommand = false
          console.warn(err)
        })
    },
    handleLicense(c) {
      this.licenseNoCountInfo = c
      if (c === 5) {
        this.licenseNoCountTitle = '按日'
      }

      if (c === 6) {
        this.licenseNoCountTitle = '按周'
      }

      if (c === 7) {
        this.licenseNoCountTitle = '按月'
      }
      const data = this.formData
      const startDate = data.date ? dayjs(data.date[0]).format('YYYY-MM-DD') : undefined
      const endDate = data.date ? dayjs(data.date[1]).format('YYYY-MM-DD') : undefined
      function getParams(type = 0) {
        return {
          startDate,
          endDate,
          sourceCode: data.sourceCode.length ? data.sourceCode.join(',') : undefined,
          organizationId: data.organizationId ? data.organizationId : undefined,
          queryType: type,
          issueType: data.issueType ? data.issueType : undefined,
          companyId: data.companyValue && data.companyValue.length === 1 ? data.companyValue[0] : undefined,
          company: data.companyValue && data.companyValue.length === 2 ? data.companyValue.join(',') : undefined
        }
      }
      this.isLoadingLicense = true
      getPerformance(getParams(c))
        .then(res => {
          this.isLoadingLicense = false
          const { licenseNoCountInfo } = res.data
          // 设置成交车牌量
          this.graphData.dealLicense.rows = licenseNoCountInfo.list && licenseNoCountInfo.list.length ? licenseNoCountInfo.list.map(item => ({ '日期': this.filterYear(c, c === 4 || c === 7 ? item.name : item.date), '成交车牌量': item.value })) : []
          this.dealLicenseTotal = licenseNoCountInfo.total
        })
        .catch(err => {
          this.isLoadingLicense = false
          console.warn(err)
        })
    },
    onTimeChange() {
    },
    getOrgList() {
      const sourceCode = this.formData.sourceCode
      if (!sourceCode) return
      getOrgData({
        channelCode: sourceCode[0]
      }).then(res => {
        const result = res.data
        this.orgList = result
      })
    },
    // 处理树选择Key
    normalizer(node) {
      if (node.children.length === 0) {
        delete node.children
      }
      return {
        id: node.key,
        label: node.title,
        children: node.children
      }
    },
    getChannelList() {
      getAllChannelData().then(res => {
        this.channelList = res.data
      })
    },
    onChannelChange() {
      this.orgList = []
      this.getOrgList()
    },
    queryAll() {
      const data = this.formData
      const startDate = data.date ? dayjs(data.date[0]).format('YYYY-MM-DD') : undefined
      const endDate = data.date ? dayjs(data.date[1]).format('YYYY-MM-DD') : undefined
      const timeDiff = dayjs(endDate).diff(startDate, 'day')
      if (timeDiff >= 365) {
        this.$message.error('时间范围不能超出一年')
        return
      }
      function getParams(type = 0) {
        return {
          startDate,
          endDate,
          sourceCode: data.sourceCode.length ? data.sourceCode.join(',') : undefined,
          organizationId: data.organizationId ? data.organizationId : undefined,
          queryType: type,
          issueType: data.issueType ? data.issueType : undefined,
          companyId: data.companyValue && data.companyValue.length === 1 ? data.companyValue[0] : undefined,
          company: data.companyValue && data.companyValue.length === 2 ? data.companyValue.join(',') : undefined
        }
      }

      this.stime = dayjs(data.date[0]).format('YYYY年MM月DD日')
      this.etime = dayjs(data.date[1]).format('YYYY年MM月DD日')
      this.today = `${dayjs().format('MM月DD日')}(${this.formatWeek(dayjs().day())})`

      const mapFunc = (key1, key2) => (item) => ({ [key1]: item.name, [key2]: item.value })
      this.isLoadingPremium = true
      getPerformance(getParams(0))
        .then(res => {
          this.isLoadingPremium = false
          const { sourcePremium, companyPremium, organizationPremium } = res.data
          // 设置成交保费
          // this.graphData.dealPremium.rows = premiumInfo.list && premiumInfo.list.length ? premiumInfo.list.map(item => ({ '日期': this.filterYear(item.date), '成交保费': item.value })) : []
          // this.premiumTotal = premiumInfo.total

          if (this.isAnyAdminChannel) {
            this.channelOrOrg = '渠道'
            this.graphData.channelPremium.rows = sourcePremium ? sourcePremium.map(mapFunc('渠道', '保费')) : []
            if (data.sourceCode.length !== 1) {
              this.channelOrOrg = '渠道'
              this.graphData.channelPremium.rows = sourcePremium ? sourcePremium.map(mapFunc('渠道', '保费')) : []
            } else {
              this.channelOrOrg = '机构'
              this.graphData.channelPremium.rows = organizationPremium ? organizationPremium.map(mapFunc('渠道', '保费')) : []
            }
          } else {
            this.channelOrOrg = '机构'
            this.graphData.channelPremium.rows = organizationPremium ? organizationPremium.map(mapFunc('渠道', '保费')) : []
          }

          this.graphData.companyPremium.rows = companyPremium ? companyPremium.map(mapFunc('保险公司', '保费')) : []
        })
        .catch(e => {
          this.isLoadingPremium = false
          console.warn(e)
        })
      this.isLoadingCars = true
      getPerformance(getParams(1))
        .then(res => {
          this.isLoadingCars = false
          const { sourceLicenseNoCount, organizationLicenseNoCount, companyLicenseNoCount } = res.data
          // 设置成交车牌量
          // this.graphData.dealLicense.rows = licenseNoCountInfo.list && licenseNoCountInfo.list.length ? licenseNoCountInfo.list.map(item => ({ '日期': this.filterYear(item.date), '成交车牌量': item.value })) : []
          // this.dealLicenseTotal = licenseNoCountInfo.total

          if (this.isAnyAdminChannel) {
            this.channelOrOrg = '渠道'
            this.graphData.dealChannel.rows = sourceLicenseNoCount ? sourceLicenseNoCount.map(mapFunc('渠道', '车牌量')) : []
            if (data.sourceCode.length !== 1) {
              this.channelOrOrg = '渠道'
              this.graphData.dealChannel.rows = sourceLicenseNoCount ? sourceLicenseNoCount.map(mapFunc('渠道', '车牌量')) : []
            } else {
              this.channelOrOrg = '机构'
              this.graphData.dealChannel.rows = organizationLicenseNoCount ? organizationLicenseNoCount.map(mapFunc('渠道', '车牌量')) : []
            }
          } else {
            this.channelOrOrg = '机构'
            this.graphData.dealChannel.rows = organizationLicenseNoCount ? organizationLicenseNoCount.map(mapFunc('渠道', '车牌量')) : []
          }

          this.graphData.dealCompany.rows = companyLicenseNoCount ? companyLicenseNoCount.map(mapFunc('保险公司', '车牌量')) : []
        })
        .catch(e => {
          this.isLoadingCars = false
          console.warn(e)
        })
      this.isLoadingCommand = true
      getPerformance(getParams(this.premiumInfoType))
        .then(res => {
          this.isLoadingCommand = false
          const c = this.premiumInfoType
          const { premiumInfo } = res.data
          // 设置成交保费
          this.graphData.dealPremium.rows = premiumInfo.list && premiumInfo.list.length ? premiumInfo.list.map(item => ({ '日期': this.filterYear(null, c === 4 || c === 7 ? item.name : item.date), '成交保费': item.value })) : []
          this.premiumTotal = premiumInfo.total
        })
        .catch(err => {
          this.isLoadingCommand = false
          console.warn(err)
        })
      this.isLoadingLicense = true
      getPerformance(getParams(this.licenseNoCountInfo))
        .then(res => {
          this.isLoadingLicense = false
          const c = this.licenseNoCountInfo
          const { licenseNoCountInfo } = res.data
          // 设置成交车牌量
          this.graphData.dealLicense.rows = licenseNoCountInfo.list && licenseNoCountInfo.list.length ? licenseNoCountInfo.list.map(item => ({ '日期': this.filterYear(null, c === 4 || c === 7 ? item.name : item.date), '成交车牌量': item.value })) : []
          this.dealLicenseTotal = licenseNoCountInfo.total
        })
        .catch(err => {
          this.isLoadingLicense = false
          console.warn(err)
        })
    },
    filterYear(type, str) {
      console.log('filter', type, str)
      switch (type) {
        case 4:
        case 7:
          return str
        default:
          return str.match(/\d\d-\d\d$/).toString()
      }
    },
    formatWeek(n) {
      const arr = [
        { num: 0, weed: '周日' },
        { num: 1, week: '周一' },
        { num: 2, week: '周二' },
        { num: 3, week: '周三' },
        { num: 4, week: '周四' },
        { num: 5, week: '周五' },
        { num: 6, week: '周六' }
      ]
      return arr.find(item => item.num === n).week
    }
  }
}
</script>
<style lang="scss" scoped>
  .screen-tag {
    margin: 20px 0;
    padding: 10px;
    background-color: #f2f6fc;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .rechargeinfo {
    .info {
      background-color: rgba(245, 245, 245, 1);
      padding: 10px 20px;
      border-radius: 10px;
      div {
        margin: 10px 0;
      }
    }
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
</style>
<style lang="scss">
  .channel-right {
    .el-table td, .el-table th{
      padding: 0;
      height: 40px;
      line-height: 40px;
    }
    .el-table th {
      background: #fafafa;
    }
  }
</style>
