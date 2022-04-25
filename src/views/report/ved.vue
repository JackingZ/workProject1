<template>
  <div class="app-container">
    <head-info
      title="车辆到期分布"
      info="数据截止到当前时间" />
    <div class="app-panel channel-right">

      <el-row type="flex" justify="start" align="middle">

        <el-select
          id="channel"
          v-model="formData.sourceCode"
          size="small"
          clearable
          filterable
          multiple
          collapse-tags
          placeholder="所属渠道"
          style="margin-right: 10px;width: 200px;"
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

        <el-button
          type="primary"
          size="small"
          @click="getCustomerData">查询</el-button>

      </el-row>

      <div>
        <div style="text-align: center;margin: 15px;">累计车牌量:{{ customerCount }}</div>
        <ve-ring
          v-loading="isLoading"
          :data="ringChartData"
          :legend="ringLegend"
          :settings="ringChartSetting"/>
      </div>

    </div>
  </div>
</template>
<script>
import { options } from '@/views/report/dateOptions'
import MyTreeSelect from '@/components/MyTreeSelect'
import { mapGetters } from 'vuex'
import { getOrgData } from '@/api/system'
import { getAllChannelData, homeCustomer } from '@/api/number'

export default {
  name: 'Ved',
  components: {
    MyTreeSelect
  },
  data() {
    this.chartSettings = {
      radius: [80, 120],
      offsetY: 230
    }
    return {
      isLoading: false,
      channelList: [],
      orgList: [], // 机构列表
      datepickerOptions: {
        shortcuts: [...options]
      },
      formData: {
        sourceCode: [], // 渠道编码
        organizationId: undefined
      },
      ringChartData: {
        columns: ['title', '访问用户'],
        rows: [
          // { 'title': '30天内到期', '访问用户': 1393 },
        ]
      },
      ringLegend: {
        show: false
      },
      ringChartSetting: {
        radius: [60, 100],
        offsetY: 150,
        label: {
          formatter: function(params) {
            // console.log('params', params)
            return `${params.name}\n${params.value}\n${params.percent}%`
          }
        }
      },
      customerCount: 0
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
    if (this.isAnyAdminChannel) {
      // 初始化默认时间
      const nowYear = new Date().getFullYear()
      const nowMonth = new Date().getMonth()
      const nowDay = new Date().getDate()
      const end = new Date(nowYear, nowMonth, nowDay, 23, 59, 59)
      const start = new Date(nowYear, nowMonth, nowDay, 0, 0, 0)
      this.formData.date = [start, end]
    } else {
      // 初始化默认时间
      const start = new Date()
      start.setDate(1) // 本月1号
      start.setHours(0, 0, 0)
      const end = new Date()
      end.setHours(23, 59, 59)
      this.formData.date = [start, end]
    }

    this.getCustomerData()
  },
  methods: {
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
    getCustomerData() {
      const params = {
        sourceCode: this.formData.sourceCode.length ? this.formData.sourceCode.join(',') : undefined,
        organizationId: this.formData.organizationId ? this.formData.organizationId : undefined
      }
      this.isLoading = true
      const mapFunc = (item) => {
        const titles = ['30天内到期', '30-90天内到期', '未到期', '其他']
        return {
          title: titles[item.type],
          '访问用户': item.value
        }
      }
      homeCustomer(params)
        .then(res => {
          this.isLoading = false
          if (res.status === 200 && res.data) {
            const { list, total } = res.data
            this.customerCount = total || 0
            const array = list.map(mapFunc)
            this.$set(this.ringChartData, 'rows', array)
          }
        })
        .catch(e => {
          this.isLoading = false
        })
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
