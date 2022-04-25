<template>
  <div class="app-container">
    <head-info
      title="保险公司业绩分布"
      info="" />
    <div class="app-panel channel-right">

      <el-row type="flex" justify="start" align="middle">

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

        <el-checkbox
          v-model="formData.queryType"
          :disabled="isLoading"
          size="small"
          border
          style="margin-right: 10px;"
          @change="onQueryType">区分工号</el-checkbox>

        <el-select v-model="selectDateOption" placeholder="请选择日期类型" size="small" class="filter" style="margin-right: 10px;" @change="onDateOptionsChange">
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
          style="margin-right: 10px;"
          class="filter"
          @change="selectDateChange"
        />

        <el-button
          type="primary"
          size="small"
          @click="queryAll">查询</el-button>
        <el-button
          type="primary"
          size="small"
          @click="exportRecord">导出</el-button>

      </el-row>

      <el-table
        v-loading="isLoading"
        :data="tableData.list"
        height="calc(100vh - 310px)"
        max-height="100vh"
        border
        style="width: 100%;margin: 20px 0;">
        <el-table-column
          v-if="!formData.queryType"
          prop="companyName"
          label="保险公司"
          width="180"/>
        <el-table-column
          v-if="formData.queryType"
          prop="channelName"
          label="工号"
          width="180"/>
        <el-table-column
          prop="quoteCount"
          label="报价次数"
          width="180"/>
        <el-table-column
          prop="quoteSucceedLicenseNo"
          label="报价成功车牌量"/>
        <el-table-column
          prop="issueLicenseNo"
          label="成交车牌量"/>
        <el-table-column
          prop="issueCount"
          label="出单件数"/>
        <el-table-column
          prop="issuePremium"
          label="成交保费（元）"/>
        <el-table-column
          prop="avgPremium"
          label="件均保费（元）"/>
      </el-table>

      <el-pagination
        :current-page="formData.pageNum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="formData.pageSize"
        :total="tableData.total"
        style="text-align: right;"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>

    </div>
  </div>
</template>
<script>
import MyTreeSelect from '@/components/MyTreeSelect'
import { mapGetters } from 'vuex'
import { getOrgData } from '@/api/system'
import { getAllChannelData, getCompanyStat, companyExoprtstat } from '@/api/number'
import dayjs from 'dayjs'
import dateMixin from '@/views/report/dateMixin'
export default {
  name: 'Icpd',
  components: {
    MyTreeSelect
  },
  mixins: [dateMixin],
  data() {
    return {
      isLoading: false,
      tableData: {},
      channelList: [],
      orgList: [], // 机构列表
      formData: {
        sourceCode: [], // 渠道编码
        organizationId: undefined, // 机构编码
        queryType: false,
        pageNum: 1,
        pageSize: 10,
        operateType: '0'
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
    this.initSelectDate()
    this.getChannelList()
    this.queryAll()
  },
  methods: {
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
      if (!this.hasSetDate()) {
        this.showAlertMsg('请选择时间范围', 'error')
        return
      }
      this.isLoading = true
      this.formData.operateType = '0'
      const options = {
        ...this.getDateParams(),
        sourceCode: this.formData.sourceCode.length ? this.formData.sourceCode.join(',') : undefined,
        organizationId: this.formData.organizationId ? this.formData.organizationId : undefined,
        queryType: this.formData.queryType ? '1' : '0',
        operateType: this.formData.operateType,
        pageNum: this.formData.pageNum,
        pageSize: this.formData.pageSize
      }
      getCompanyStat(options)
        .then(res => {
          this.tableData = res.data
          this.isLoading = false
        })
        .catch(err => {
          console.warn(err)
          this.isLoading = false
        })
    },
    exportRecord() {
      this.isLoading = true
      this.formData.operateType = '1'
      const options = {
        ...this.getDateParams(),
        sourceCode: this.formData.sourceCode.length ? this.formData.sourceCode.join(',') : undefined,
        organizationId: this.formData.organizationId ? this.formData.organizationId : undefined,
        queryType: this.formData.queryType ? '1' : '0',
        operateType: this.formData.operateType,
        pageNum: this.formData.pageNum,
        pageSize: this.formData.pageSize
      }
      companyExoprtstat(options)
        .then(res => {
          this.isLoading = false
          const url = window.URL.createObjectURL(res)
          const a = document.createElement('a')
          document.body.appendChild(a)
          a.href = url
          a.download = '保司业绩-' + dayjs().format('YYYY-MM-DD HH_mm_ss') + '.xls'
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        })
        .catch(err => {
          console.warn(err)
          this.isLoading = false
        })
    },
    // 监听是否区分工号
    onQueryType(val) {
      this.queryAll()
    },
    // 分页
    handleCurrentChange(val) {
      this.formData.pageNum = val
      this.queryAll()
    },
    // 页宽
    handleSizeChange(val) {
      this.formData.pageNum = 1
      this.formData.pageSize = val
      this.queryAll()
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
