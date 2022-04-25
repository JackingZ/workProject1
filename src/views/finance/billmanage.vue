<template>
  <div class="app-container">
    <head-info
      title="账单管理"
      info="支持查询续保，报价，承保次数及费用" />
    <div class="app-panel channel-right">
      <div class="table-count-header">
        <div class="table-count-nav">
          <div v-if="isAnyAdminChannel" class="balande-select_company">
            <el-select v-model="organ" filterable placeholder="所属渠道" size="small" @change="getFinanceReCord">
              <el-option v-for="item in organData" :key="item.code" :label="item.shortName" :value="item.code" />
            </el-select>
          </div>
          <div class="block">
            <el-date-picker v-model="dateArr" :clearable="false" type="daterange" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" size="small" />
          </div>
          <div class="btn-count">
            <el-button type="primary" icon="el-icon-search" size="small" @click="getFinanceCount">查询</el-button>
          </div>
        </div>
        <div class="info-count">
          <svg-icon icon-class="gantan" />
          账户余额：<span>¥ {{ formatFix(totalCount.balance) }}</span>元&nbsp;|&nbsp;
          总计费：<span>¥ {{ formatFix(record.expense) }}</span>元，
          其中续保查询计费<span>{{ formatFix(record.insuranceSum) }}</span>元，
          报价计费<span>{{ formatFix(record.quoteSum) }}</span>元，
          承保计费<span>{{ formatFix(record.underwriteSum) }}</span>元，
          短信计费<span>{{ formatFix(record.quoteSMSSum) }}</span>元
        </div>
      </div>
      <div class="table-count-data">
        <el-table v-loading="isLoading" :data="billData" :cell-style="{padding: '4px 0'}" :header-cell-style="{background:'#fafafa',padding: '10px 0'}" border style="width: 100%; margin: 20px 0;" height="calc(100vh - 380px)" max-height="100vh">
          <el-table-column :formatter="formatDate" prop="countDate" label="日期" />
          <el-table-column :formatter="formatExpense" prop="expense" label="计费总额(元)" />
          <el-table-column :formatter="formatInsureSum" prop="insuranceSum" label="续保查询计费(元)" />
          <el-table-column :formatter="formatQuoteSum" prop="quoteSum" label="报价计费(元)" />
          <el-table-column :formatter="formatUnderSum" prop="underwriteSum" label="承保计费(元)" />
          <el-table-column :formatter="formatSmsSum" prop="quoteSMSSum" label="短信计费(元)" />
        </el-table>
      </div>
      <div class="table-count-footer el-pagination-wrap">
        <el-pagination v-if="count > 0" :current-page="currentPage" :page-sizes="[10, 20, 30, 40, 50]" :page-size="pageSize" :total="count" layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChange" @current-change="currentChange" />
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import constant from '@/api/constant'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      isLoading: true,
      organ: '',
      organData: [],
      record: [],
      totalCount: [],
      dateArr: [],
      billData: [],
      currentPage: 0,
      pageSize: 20,
      count: 0
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否管理员渠道
    ])
  },
  created() {
    this.dateArr[0] = dayjs().startOf('month')
    this.dateArr[1] = dayjs()
    this.getChannelEffective()
  },
  methods: {
    // 分页..
    sizeChange(val) {
      this.isLoading = true
      this.pageSize = val
      this.getFinanceCount()
    },
    currentChange(val) {
      this.isLoading = true
      this.currentPage = val
      this.getFinanceCount()
    },
    formatFix(val) {
      if (val) {
        return parseFloat(val).toFixed(2)
      } else {
        return '0.00'
      }
    },
    formatDate(val) {
      return dayjs(val.countDate).format('YYYY-MM-DD')
    },
    formatExpense(val) {
      if (val.expense) {
        return parseFloat(val.expense).toFixed(2)
      } else {
        return '0.00'
      }
    },
    formatInsureSum(val) {
      if (val.insuranceSum) {
        return parseFloat(val.insuranceSum).toFixed(2)
      } else {
        return '0.00'
      }
    },
    formatQuoteSum(val) {
      if (val.quoteSum) {
        return parseFloat(val.quoteSum).toFixed(2)
      } else {
        return '0.00'
      }
    },
    formatUnderSum(val) {
      if (val.underwriteSum) {
        return parseFloat(val.underwriteSum).toFixed(2)
      } else {
        return '0.00'
      }
    },
    formatSmsSum(val) {
      if (val.quoteSMSSum) {
        return parseFloat(val.quoteSMSSum).toFixed(2)
      } else {
        return '0.00'
      }
    },
    // 获取机构
    async getChannelEffective() {
      request({
        url: `${constant.channelEffective}?cacheKey=channelQueryAllOfEffective`,
        method: 'get'
      }).then(res => {
        if (res.status === 200) {
          this.organData = res.data
          this.organ = this.organData[0].code
          this.getFinanceReCord()
          this.getFinanceCount()
        }
      })
    },
    // 获取记录统计..
    getFinanceReCord() {
      this.getRecord()
      this.getBalance()
    },
    getRecord() {
      request({
        url: `${constant.financeRecord}/${this.organ}`,
        method: 'get'
      }).then(res => {
        this.record = res.data
      })
    },
    getBalance() {
      request({
        url: `${constant.financeBalance}/${this.organ}`,
        method: 'get'
      }).then(res => {
        this.totalCount = res.data
      })
    },
    // 查询
    getFinanceCount() {
      this.isLoading = true
      this.dateArr.map((item, index) => {
        const data = new Date(item)
        const time = data.getTime()
        this.dateArr[index] = time
      })
      request({
        url: `${constant.financeCount}`,
        method: 'post',
        data: {
          endTime: this.dateArr[1] + 1 * 24 * 60 * 60 * 1000 - 1,
          model: this.organ,
          page: this.currentPage,
          size: this.pageSize,
          startTime: this.dateArr[0]
        }
      }).then(res => {
        this.isLoading = false
        this.count = res.data.count
        this.billData = res.data.model
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-panel {
  overflow: hidden;
}
.table-count-header {
  .table-count-nav{
      display: flex;
      justify-content:flex-end;
      flex-wrap:wrap;
      .balande-select_company {
      display: inline-block;
      vertical-align: top;
      margin-right: 10px;
      width:150px;
    }
  }
  .block {
    width:260px;
    display: inline-block;
    vertical-align: top;
    margin-right: 10px;
    .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner{
      width:260px;
    }
  }
  .btn-count {
    display: inline-block;
    vertical-align: top;
  }
  .info-count {
    height: 38px;
    line-height: 38px;
    color: #999;
    font-size: 14px;
  }
}
.table-count-data {
  margin-top: 20px;
}
.table-count-footer {
  text-align: right;
  height: 52px;
  padding-top: 20px;
}
</style>

