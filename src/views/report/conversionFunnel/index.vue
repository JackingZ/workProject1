<template>
  <div class="app-container conversion-funnel">
    <div class="app-panel">
      <el-row type="flex" style="flex-flow: row wrap;">
        <el-select
          v-model="formData.selectCompany"
          clearable
          filterable
          value-key="name"
          style="width: 180px;"
          class="filter"
          placeholder="保险公司"
          multiple
          collapse-tags
          size="small"
          @change="onCompanyChange">
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
        <el-select
          v-if="isAnyAdminChannel"
          v-model="formData.selectChannel"
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
        <my-tree-select
          v-if="isShowOrgList"
          :options="orgList"
          v-model="formData.selectOrg"
          :normalizer="normalizer"
          no-options-text="数据加载中..."
          no-children-text=""
          style="width:200px;display: inline-block;vertical-align: top;"
          class="filter"
          placeholder="选择机构"
          no-results-text="未找到结果"/>
        <el-select v-model="selectDateOption" placeholder="请选择日期类型" size="small" class="filter" @change="onDateOptionsChange">
          <el-option
            v-for="item in dateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <el-date-picker
          v-model="selectDate"
          :picker-options="datePickerOptions"
          :type="selectDateOption"
          :placeholder="getDatePlaceholder"
          :format="getDateFormat"
          size="small"
          class="filter"
          @change="selectDateChange"
        />
        <el-button type="primary" class="filter" size="mini" @click="queryData">查询</el-button>
      </el-row>
      <div v-loading="loading" style="position:relative;max-width:1000px;">
        <ve-funnel :settings="chartSettings" :tooltip="tooltip" :legend="legend" :series="chartSeries" width="800px" height="500px" />
        <div v-if="showBar" class="bar-wrap">
          <div class="top-text">{{ topVal }}</div>
          <div class="long-bar"/>
          <div class="vertical-text">总转化率</div>
          <div class="trangle"/>
          <div class="top-text">{{ bottomVal }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MyTreeSelect from '@/components/MyTreeSelect'
import { mapGetters } from 'vuex'
import { getOrgData } from '@/api/system'
import { getAllChannelData } from '@/api/number'
import { financeCompany } from '@/api/finance'
import { funnelData } from '@/api/report'
import dateMixin from '@/views/report/dateMixin'
let chartData
export default {
  components: {
    MyTreeSelect
  },
  mixins: [dateMixin],
  data() {
    return {
      orgList: [], // 机构列表
      companyList: [], // 保险公司
      channelList: [], // 渠道列表
      formData: {
        selectOrg: '', // 当前选择机构
        selectCompany: [], // 当前选择保险公司
        selectChannel: [] // 当前选择的渠道
      },
      legend: {
        show: false
      },
      chartSettings: {},
      chartSeries: [{
        type: 'funnel',
        sort: 'none', // 'none'（表示按 data 顺序）
        label: {
          formatter: (params) => {
            return `${params.name} ${params.value || 0}`
          }
        },
        left: '10%',
        width: '70%',
        data: []
      }, {
        type: 'funnel',
        sort: 'none', // 'none'（表示按 data 顺序）
        label: {
          position: 'inside',
          formatter: (params) => {
            // console.log('params', params)
            const index = params.dataIndex
            const data = chartData
            const calu = (value1 = 0, value2 = 0) => {
              // console.log('value1', value1, value2)
              if (value2 === 0) return 0
              return (value1 / value2) * 100
            }
            const getPercent = (index, value, data) => {
              if (index === 0) {
                if (value === 0) return 0
                return 100
              }
              // console.log('index', index - 1, data)
              return calu(value, data[index - 1].value)
            }
            const percent = getPercent(index, params.value, data)
            return `${percent.toFixed(1)}%`
            // return `${params.name} ${params.value || 0}`
          },
          textStyle: {
            color: '#000'
          }
        },
        left: '10%',
        width: '70%',
        data: []
      }],
      tooltip: {
        trigger: 'item',
        formatter: function(params) {
          return `${params.name} ${params.value || 0}`
        }
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否是管理员渠道
    ]),
    isShowOrgList() {
      return this.formData.selectChannel && this.formData.selectChannel.length === 1
    },
    showBar() {
      if (this.chartSeries && this.chartSeries[0].data.length > 0) return true
    },
    topVal() {
      if (this.chartSeries && this.chartSeries[0].data.length !== 6) return '0.00%'
      const chartData = this.chartSeries[0].data
      if (!chartData[0].value || !chartData[5].value || chartData[0].value === 0 || chartData[5].value === 0) return '0.00%'
      return '100.00%'
    },
    bottomVal() {
      if (this.chartSeries && this.chartSeries[0].data.length === 6) {
        const chartData = this.chartSeries[0].data
        if (chartData[5].value === 0 || !chartData[5].value) return '0.00%'
        const val = (chartData[5].value / chartData[0].value) * 100
        return `${val.toFixed(2)}%`
      }
      return '0.00%'
    }
  },
  watch: {
    'formData.selectChannel'(newVal) {
      if (!newVal || newVal.length === 0) this.formData.selectOrg = ''
    }
  },
  activated() {
    if (this.isAnyAdminChannel) this.getChannelList()
  },
  created() {
    this.initSelectDate()
    this.getOrgList()
    this.getChannelList()
    financeCompany().then(res => {
      if (res && res.data) this.companyList = res.data
    })
    // this.queryData()
  },
  methods: {
    getOrgList() {
      const selectChannel = this.formData.selectChannel
      if (selectChannel.length !== 1) return
      getOrgData({
        channelCode: selectChannel[0]
      }).then(res => {
        if (this.formData.selectChannel.length !== 1) return
        const result = res.data
        this.orgList = result
      })
    },
    getChannelList() {
      getAllChannelData().then(res => {
        this.channelList = res.data
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
    onCompanyChange() {},
    onChannelChange() {
      const selectChannel = this.formData.selectChannel
      this.formData.selectOrg = ''
      this.orgList = []
      // 单一渠道才获取机构列表
      if (selectChannel && selectChannel.length === 1) {
        this.getOrgList()
      }
      if (this.isAnyAdminChannel) {
        if (selectChannel.length > 9) {
          this.showAlertMsg('最多只能选择9个渠道', 'error')
          return
        }
      }
    },
    onTimeChange() {
    },
    queryData() {
      const selectChannel = this.formData.selectChannel
      if (selectChannel.length === 0) {
        this.showAlertMsg('请至少选一个渠道', 'error')
        return
      }
      if (selectChannel.length > 9) {
        this.showAlertMsg('最多只能选择9个渠道', 'error')
        return
      }
      if (!this.hasSetDate()) {
        this.showAlertMsg('请选择时间范围', 'error')
        return
      }

      let organizationId = ''
      // 运维渠道 单一渠道才传机构id
      if (this.isAnyAdminChannel) {
        if (selectChannel.length === 1) organizationId = this.formData.selectOrg || ''
      } else organizationId = this.formData.selectOrg || ''
      const params = {
        ...this.getDateParams(),
        organizationId, // 机构id
        sourceCode: selectChannel.join(',') || ''
      }
      const selectCompany = this.formData.selectCompany
      // 单个保险公司参数用companyId 多个用company
      if (selectCompany.length === 1) params.companyId = selectCompany[0]
      else params.company = selectCompany.length > 0 ? selectCompany.join(',') : ''
      this.remove(params)
      this.loading = true
      funnelData(params).then(res => {
        this.loading = false
        console.log('res', params)
        if (res.status !== 200) {
          return
        }
        const names = {
          0: '续保查询车牌量',
          1: '报价车牌量',
          2: '报价成功车牌量',
          3: '申请核保车牌量',
          4: '核保成功车牌量',
          5: '承保车牌量'
        }
        const { list } = res.data
        const temp = []
        list.forEach(item => {
          temp.push({
            name: names[item.type],
            value: item.value
          })
        })
        chartData = temp
        this.$set(this.chartSeries[0], 'data', temp)
        this.$set(this.chartSeries[1], 'data', temp)
      }).catch(e => {
        this.loading = false
      })
    },
    // 删除空参数
    remove(obj) {
      for (const key in obj) {
        if (obj[key] !== 0 && !obj[key]) delete obj[key]
      }
    }
  }
}
</script>
<style lang="scss">
.conversion-funnel{
  .filter {
    margin: 0 10px 10px 0;
  }
  .el-range-separator {
    width: 30px;
    line-height: 28px;
  }
  .bar-wrap{
    position: absolute;
    right: 50px;
    top: 70px;
  }
  .top-text{
    text-align: center;
    font-size: 14px;
    padding: 5px 0;
    width: 60px;
  }
  .long-bar{
    height: 270px;
    width: 15px;
    background: #1BE9BF;
    margin: auto;
  }
  .trangle{
    width: 0;
    height: 0;
    border-width: 30px 30px 0;
    border-style: solid;
    border-color: #1BE9BF transparent transparent;
    position: relative;
  }
  .vertical-text{
    position: absolute;
    z-index: 10;
    top: 120px;
    right: 0px;
    width: 16px;
    font-size: 15px;
  }
}
</style>

