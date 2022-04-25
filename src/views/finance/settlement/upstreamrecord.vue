<template>
  <div class="app-container">
    <div class="app-panel">
      <el-row type="flex" style="flex-flow: row wrap;">
        <my-tree-select
          v-if="selectValue.type !== 1"
          :options="orgList"
          v-model="selectValue.companyIds[0]"
          :normalizer="normalizer"
          no-options-text="数据加载中..."
          no-children-text=""
          style="width:320px;display: inline-block;vertical-align: top;"
          class="m"
          placeholder="选择机构"
          no-results-text="未找到结果"
          @open="getOrg"/>

        <el-select
          v-model="selectValue.insureCompanyId"
          :loading="companyList.loading"
          size="small"
          clearable
          filterable
          placeholder="全部保险"
          style="width: 130px;"
          class="m"
          @focus="getCompanyList">
          <el-option
            v-for="item in companyList.data"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>

        <el-input
          v-model="selectValue.sequence"
          style="width: 139px;"
          class="m"
          size="small"
          placeholder="请输入结算单号"
          clearable/>

        <el-input
          v-model="selectValue.policyNo"
          style="width: 150px;"
          class="m"
          size="small"
          placeholder="请输入保(批)单号"
          clearable/>

        <el-select
          v-model="selectValue.status"
          style="width: 100px;"
          class="m"
          placeholder="状态"
          clearable
          size="small">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>

        <el-select
          v-model="selectValue.timeType"
          style="width: 100px;"
          class="m"
          placeholder="时间类型"
          clearable
          size="small">
          <el-option
            v-for="item in timeTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>

        <el-date-picker
          :clearable="false"
          v-model="date"
          class="m"
          size="small"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"/>

        <el-button type="primary" icon="el-icon-search" class="m" size="mini" @click="queryAll">查询</el-button>
        <el-button type="primary" class="m" size="mini" @click="exportRecord">导出</el-button>
      </el-row>

      <el-table
        v-loading="isTableLoading"
        :data="recordList.model"
        border
        style="width: 100%;margin: 20px 0;">
        <el-table-column
          prop="sequence"
          label="结算单号"
          width="180"/>
        <el-table-column
          prop="cycleTitle"
          label="结算周期"
          width="180"/>
        <el-table-column
          prop="policyNum"
          label="结算单数"/>
        <el-table-column
          :label="selectValue.type === 1 ? '手续费总额' : selectValue.type === 2 ? '机构佣金总额' : '业务员佣金总额'"
          prop="totalMoneyCount"/>
        <el-table-column
          prop="unSettlementMoneyCount"
          label="本次结算前待结总额"/>
        <el-table-column
          prop="moneyCount"
          label="本次实结总额"/>
        <el-table-column
          prop="operateName"
          label="操作人"/>
        <el-table-column
          prop="updateTime"
          label="操作时间"/>
        <el-table-column
          prop="backup"
          label="备注"/>
        <el-table-column
          prop="statusTitle"
          label="状态"/>
        <el-table-column
          prop="address"
          width="150"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="Number(scope.row.status) === 1" type="primary" size="mini" @click="check(scope)">查看</el-button>
            <el-button v-if="Number(scope.row.status) === 1" type="danger" size="mini" @click="revoke(scope)">撤销</el-button>
            <el-button v-if="Number(scope.row.status) === 2" type="danger" size="mini" @click="deleteRecord(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :total="recordList.count"
        :current-page.sync="page"
        style="text-align: right;"
        background
        layout="total, prev, pager, next"
        @current-change="getCurrentData"
        @prev-click="prevPage"
        @next-click="nextPage"/>

      <el-dialog
        :visible.sync="checkData.isShow"
        :before-close="checkCancel"
        title="结算明细"
        width="1200px">
        <el-button type="primary" size="mini" @click="exportBill">导出</el-button>
        <el-button type="primary" size="mini" @click="policyQuery">该批次下的保单</el-button>
        <div style="margin-top: 20px;font-size: 16px;">全保费总额：{{ checkData.totalList.fullPremium }}元，净保费总额：{{ checkData.totalList.netPremium }}元， 手续费总额：{{ checkData.totalList.formality }}元， 本次结算前待结总额：{{ checkData.totalList.unSettlementMoney }}元，本次结算总额：{{ checkData.totalList.money }}元。</div>
        <el-table
          v-loading="checkData.isLoading"
          :data="checkData.list.model"
          border
          style="width: 100%;margin: 20px 0;">
          <el-table-column
            prop="settlementVO.companyName"
            label="保险公司"
            width="180"/>
          <el-table-column
            prop="settlementVO.channelName"
            label="工号"
            width="180"/>
          <el-table-column
            prop="settlementVO.policyNo"
            label="保(批)单号"/>
          <el-table-column
            prop="settlementVO.licenseNo"
            label="车牌"/>
          <el-table-column
            prop="settlementVO.insuredName"
            label="被保人"/>
          <el-table-column
            prop="settlementVO.userName"
            label="业务员"/>
          <el-table-column
            prop="settlementVO.operatorName"
            label="出单员"/>
          <el-table-column
            prop="settlementVO.riskTypeValue"
            label="险种"/>
          <el-table-column
            :formatter="policyTimeFormat"
            prop="settlementVO.policyTime"
            label="签单时间"/>
          <el-table-column
            prop="settlementVO.fullPremium"
            label="全保费"/>
          <el-table-column
            prop="settlementVO.netPremium"
            label="净保费"/>
          <el-table-column
            prop="settlementVO.subStrategyName"
            label="子政策"/>
          <el-table-column
            prop="settlementVO.countTypeValue"
            label="结算方式"/>
          <el-table-column
            prop="settlementVO.formalityRate"
            label="费率(%)"/>
          <el-table-column
            prop="settlementVO.formality"
            label="手续费"/>
          <el-table-column
            prop="recordBill.unSettlementMoney"
            label="待结金额"/>
          <el-table-column
            prop="recordBill.money"
            label="本次实结"/>
        </el-table>

        <el-pagination
          :total="checkData.list.count"
          :current-page.sync="checkData.page"
          style="text-align: right;"
          background
          layout="total, prev, pager, next"
          @current-change="getListCurrentData"
          @prev-click="prevListPage"
          @next-click="nextListPage"/>

        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="checkCancel">关 闭</el-button>
        </span>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { getCompanysData } from '@/api/number'
import { getCompanyEffective } from '@/api/ledger'
import { querySettlementRecord, revokeSettlementRecord, exportRecordExcel, querySettlementDetail, queryStatistics, exportBillExcel, deleteRecord } from '@/api/finance'
import dayjs from 'dayjs'
import MyTreeSelect from '@/components/MyTreeSelect'

export default {
  name: 'Upstreamrecord',
  components: {
    MyTreeSelect
  },
  props: {
    recordType: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      size: 10,
      page: 1,
      isTableLoading: false,
      companyList: { // 保险公司列表
        loading: false,
        data: []
      },
      orgList: [],
      statusOptions: [
        { label: '结算成功', value: '1' },
        { label: '已撤销', value: '2' }
      ],
      timeTypes: [
        { label: '签单时间', value: '1' },
        { label: '结算时间', value: '2' }
      ],
      checkData: {
        isShow: false,
        isLoading: false,
        list: {},
        id: null,
        totalList: {},
        page: 1,
        size: 10
      },
      selectValue: {
        companyIds: [],
        timeType: '',
        salesId: null,
        insureCompanyId: null,
        sequence: null,
        policyNo: null,
        status: null,
        type: this.recordType
      },
      recordList: {},
      value: '',
      date: ''
    }
  },
  watch: {
    recordType: function(val) {
      this.selectValue.type = val
    }
    // '$route'() {
    //   const s = dayjs().set('month', dayjs().month() - 1).format('YYYY-MM-DD 00:00:00')
    //   const e = dayjs().format('YYYY-MM-DD 23:59:59')
    //   this.date = [s, e]
    //   // 获取列表
    //   const params = {
    //     endDate: this.date[1],
    //     model: this.selectValue,
    //     page: this.page,
    //     size: this.size,
    //     startDate: this.date[0]
    //   }
    //   this.isTableLoading = true
    //   querySettlementRecord(params)
    //     .then(res => {
    //       this.recordList = res.data
    //       this.isTableLoading = false
    //     })
    //     .catch(err => {
    //       this.isTableLoading = false
    //       console.warn(err)
    //     })
    // }
  },
  created() {
    const s = dayjs().set('month', dayjs().month() - 1).format('YYYY-MM-DD 00:00:00')
    const e = dayjs().format('YYYY-MM-DD 23:59:59')
    this.date = [s, e]
    // 获取列表
    const params = {
      endDate: this.date[1],
      model: this.selectValue,
      page: this.page,
      size: this.size,
      startDate: this.date[0]
    }
    this.isTableLoading = true
    querySettlementRecord(params)
      .then(res => {
        this.recordList = res.data
        this.isTableLoading = false
      })
      .catch(err => {
        this.isTableLoading = false
        console.warn(err)
      })
  },
  methods: {
    policyTimeFormat(r) {
      return dayjs(r.settlementVO.policyTime).format('YYYY-MM-DD HH:mm:ss')
    },
    // 下一页
    nextPage(e) {
      this.page = e
      const params = {
        endDate: this.date[1],
        model: this.selectValue,
        page: this.page,
        size: this.size,
        startDate: this.date[0]
      }
      this.isTableLoading = true
      querySettlementRecord(params)
        .then(res => {
          this.recordList = res.data
          this.isTableLoading = false
        })
        .catch(err => {
          console.warn(err)
          this.isTableLoading = false
        })
    },
    // 弹窗内分页下一页
    nextListPage(e) {
      this.checkData.page = e
      this.checkData.isLoading = true
      querySettlementDetail({
        model: this.checkData.id,
        page: this.checkData.page,
        size: this.checkData.size
      })
        .then(res => {
          this.checkData.list = res.data
          this.checkData.isLoading = false
        })
        .catch(err => {
          console.warn(err)
          this.checkData.isLoading = false
        })
    },
    // 上一页
    prevPage(e) {
      this.page = e
      const params = {
        endDate: this.date[1],
        model: this.selectValue,
        page: this.page,
        size: this.size,
        startDate: this.date[0]
      }
      this.isTableLoading = true
      querySettlementRecord(params)
        .then(res => {
          this.recordList = res.data
          this.isTableLoading = false
        })
        .catch(err => {
          console.warn(err)
          this.isTableLoading = false
        })
    },
    // 弹窗内分页上一页
    prevListPage(e) {
      this.checkData.page = e
      this.checkData.isLoading = true
      querySettlementDetail({
        model: this.checkData.id,
        page: this.checkData.page,
        size: this.checkData.size
      })
        .then(res => {
          this.checkData.list = res.data
          this.checkData.isLoading = false
        })
        .catch(err => {
          console.warn(err)
          this.checkData.isLoading = false
        })
    },
    // 点击分页码
    getCurrentData(e) {
      this.page = e
      const params = {
        endDate: this.date[1],
        model: this.selectValue,
        page: this.page,
        size: this.size,
        startDate: this.date[0]
      }
      this.isTableLoading = true
      querySettlementRecord(params)
        .then(res => {
          this.recordList = res.data
          this.isTableLoading = false
        })
        .catch(err => {
          console.warn(err)
          this.isTableLoading = false
        })
    },
    // 弹窗内分页点击分页码
    getListCurrentData(e) {
      this.checkData.page = e
      this.checkData.isLoading = true
      querySettlementDetail({
        model: this.checkData.id,
        page: this.checkData.page,
        size: this.checkData.size
      })
        .then(res => {
          this.checkData.list = res.data
          this.checkData.isLoading = false
        })
        .catch(err => {
          console.warn(err)
          this.checkData.isLoading = false
        })
    },
    // 获取保险公司
    getCompanyList() {
      this.companyList.loading = true
      getCompanysData()
        .then(res => {
          this.companyList.loading = false
          this.companyList.data = res.data
        })
        .catch(err => {
          this.companyList.loading = false
          console.warn(err)
        })
    },
    // 查询
    queryAll() {
      // this.page = 1
      for (const i in this.selectValue) {
        if (this.selectValue[i] === '' || this.selectValue[i] === undefined) {
          this.selectValue[i] = null
        }
      }
      console.log(this.selectValue)
      const params = {
        endDate: this.date ? dayjs(this.date[1]).format('YYYY-MM-DD 23:59:59') : '',
        model: this.selectValue,
        page: this.page,
        size: this.size,
        startDate: this.date ? dayjs(this.date[0]).format('YYYY-MM-DD 00:00:00') : ''
      }
      this.isTableLoading = true
      querySettlementRecord(params)
        .then(res => {
          this.recordList = res.data
          this.isTableLoading = false
        })
        .catch(err => {
          console.warn(err)
          this.isTableLoading = false
        })
    },
    // 撤销
    async revoke(scope) {
      try {
        await this.$confirm('确定要撤销本次结算吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await revokeSettlementRecord(scope.row.id)
        await this.queryAll()
      } catch (e) {
        if (e !== 'cancel') {
          this.$message.error(e)
          console.warn(e)
        }
      }
    },
    // 导出
    exportRecord() {
      const params = {
        endDate: this.date[1],
        model: this.selectValue,
        page: this.page,
        size: this.size,
        startDate: this.date[0]
      }
      exportRecordExcel(params)
        .then(res => {
          const url = window.URL.createObjectURL(res)
          const a = document.createElement('a')
          document.body.appendChild(a)
          a.href = url
          a.download = '结算记录-' + dayjs().format('YYYY-MM-DD HH_mm_ss') + '.xls'
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 查看
    check(scope) {
      this.checkData.isShow = true
      this.checkData.isLoading = true
      this.checkData.id = scope.row.id
      querySettlementDetail({
        model: scope.row.id,
        page: this.checkData.page,
        size: this.checkData.size
      })
        .then(res => {
          this.checkData.list = res.data
          this.checkData.isLoading = false
        })
        .catch(err => {
          console.warn(err)
          this.checkData.isLoading = false
        })
      queryStatistics(scope.row.id)
        .then(res => {
          this.checkData.totalList = res.data
        })
        .catch(err => {
          this.$message.error(err)
          console.warn(err)
        })
    },
    // 删除记录
    async deleteRecord(scope) {
      try {
        await this.$confirm('您确定要删除该结算记录么？（删除结算记录后将不可恢复，请谨慎操作！）', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await deleteRecord(scope.row.id)
        await this.queryAll()
      } catch (e) {
        if (e !== 'cancel') {
          this.$message.error(e)
          console.warn(e)
        }
      }
    },
    // 查看弹窗确认按钮
    checkConfirm() {
      console.log(1)
      this.checkCancel()
    },
    // 查看弹窗取消按钮
    checkCancel() {
      this.checkData = {
        isShow: false,
        isLoading: false,
        list: {},
        id: null,
        totalList: {},
        page: 1,
        size: 10
      }
    },
    // 导出结算明细弹窗的excel
    exportBill() {
      exportBillExcel(this.checkData.id)
        .then(res => {
          const url = window.URL.createObjectURL(res)
          const a = document.createElement('a')
          document.body.appendChild(a)
          a.href = url
          a.download = '结算明细-' + dayjs().format('YYYY-MM-DD') + '.xls'
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 该批次下的保单
    async policyQuery() {
      try {
        const result = await querySettlementDetail({
          model: this.checkData.id,
          page: 1,
          size: this.checkData.list.count
        })
        const policyNoList = []
        for (const i of result.data.model) {
          policyNoList.push(i.settlementVO.policyNo)
        }
        console.log(policyNoList)
        this.checkData.isShow = false
        window.globalPolicyNoList = [...policyNoList]
        if (this.recordType === 1) {
          this.$router.push({ name: '上游手续费结算', query: { fromExternal: true }})
        }
        if (this.recordType === 2) {
          this.$router.push({ name: '机构佣金结算', query: { fromExternal: true }})
        }
        if (this.recordType === 3) {
          this.$router.push({ name: '业务员佣金结算', query: { fromExternal: true }})
        }
      } catch (e) {
        console.warn(e)
      }
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
    // 获取机构
    getOrg() {
      getCompanyEffective()
        .then(res => {
          const result = res.data
          for (const i of result[0].children) {
            i.children = []
          }
          this.orgList = result
        })
        .catch(err => {
          console.warn(err)
        })
    }
  }
}
</script>

<style scoped>
  .m {
    margin: 0 10px 10px 0;
  }
</style>
