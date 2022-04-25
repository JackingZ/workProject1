<template>
  <div class="app-container">
    <div class="app-panel">
      <div class="ledger-list-header">
        <div style="display:inline-block;width: 250px;margin-bottom: 10px;">
          <el-tree-select v-model="ledgerData.selectCompanyId" :data="organOptions" :default-expand-all="false" clearable filterable placeholder="选择机构" size="small" style="line-height:32px;" />
        </div>
        <!-- <my-tree-select v-model="ledgerData.selectCompanyId" :options="organOptions" :normalizer="normalizer" class="ledger-select_organ" no-options-text="数据加载中..." placeholder="选择机构" no-results-text="未找到结果" @open="getOrgan" /> -->
        <div class="ledger-select">
          <el-select v-model="ledgerData.companyId" :loading="companyOptions.loading" class="ledger-select_company" clearable filterable placeholder="保险公司" size="small" @change="filterCompany">
            <el-option v-for="item in companyOptions.data" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <el-select v-model="ledgerData.channelId" class="ledger-select_workNumber" clearable filterable placeholder="工号" size="small">
            <el-option v-for="(item, index) in numberOptions.render" :key="index" :label="item.channelName" :value="item.id" />
          </el-select>
        </div>
        <div class="ledger-input">
          <el-input v-model="ledgerData.policyNo" placeholder="请输入保(批)单号" size="small" />
          <el-input v-model="ledgerData.licenseNo" placeholder="请输入车牌" size="small" />
          <el-input v-model="ledgerData.insuredName" placeholder="请输入被保人" size="small" />
          <el-input v-model="ledgerData.userName" placeholder="请输入业务员" size="small" />
          <el-input v-model="ledgerData.operatorName" placeholder="请输入出单员" size="small" />
        </div>
        <div class="ledger-select_two">
          <el-select v-model="ledgerData.riskType" clearable placeholder="险种" size="small">
            <el-option v-for="item in ristData" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
          <el-select v-model="ledgerData.policyTimeStatus" placeholder="时间" size="small">
            <el-option v-for="item in timeData" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
          <el-date-picker v-model="dateArr" type="daterange" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" size="small" />
        </div>
        <div class="ledger-btns">
          <el-button type="primary" icon="el-icon-search" size="small" @click="query">查询</el-button>
          <el-button v-permission="permissionList.billListExport" type="primary" size="small" @click="exporte">导出</el-button>
          <!-- <el-button v-permission="permissionList.billListAdd" type="primary" icon="el-icon-plus" size="small" @click="gain">添加</el-button> -->
          <!-- <el-button v-permission="permissionList.billListBatchImport" type="primary" icon="el-icon-plus" size="small" @click="manyAdd">批量添加</el-button> -->
          <el-button v-permission="permissionList.billListReconciliations" type="primary" size="small" @click="upCharge">上游手续费对账</el-button>
        </div>
      </div>
      <div class="ledger-list-table">
        <div class="table-ledger-data">
          <el-table v-loading="isLoading" :data="ledgerResult" :cell-style="{padding: '4px 0'}" :header-cell-style="{background:'#fafafa',padding: '5px 0'}" border style="width: 100%" height="calc(100vh - 302px)">
            <el-table-column fixed prop="companyName" label="保险公司" />
            <el-table-column prop="channelName" label="工号" min-width="150" />
            <el-table-column prop="policyNo" label="保(批)单号" min-width="120" />
            <el-table-column prop="licenseNo" label="车牌" width="100" />
            <el-table-column prop="insuredName" label="被保人" />
            <el-table-column prop="userName" label="业务员" />
            <el-table-column prop="nickName" label="出单员" />
            <el-table-column :formatter="issueFormat" label="险种" width="60" />
            <el-table-column :formatter="startFormat" prop="startDate" label="起保时间" width="100" />
            <el-table-column :formatter="signFormat" prop="policyTime" label="签单时间" width="100" />
            <el-table-column :formatter="fullFormat" prop="fullPremium" label="全保费" width="110" />
            <el-table-column :formatter="netFormat" prop="netPremium" label="净保费" width="110" />
            <el-table-column prop="subStrategyName" label="子政策" min-width="100" />
            <el-table-column :formatter="upTypeFormat" label="上游结算方式" width="80" />
            <el-table-column :formatter="upRateFormat" label="上游手续费费率" width="80" />
            <el-table-column :formatter="upChargeFormat" label="上游手续费" width="110" />
            <el-table-column :formatter="organFormat" label="机构结算方式" width="80" />
            <el-table-column :formatter="agencyRateFormat" label="机构佣金率" width="80" />
            <el-table-column :formatter="agencyChargeFormat" label="机构佣金" width="110" />
            <el-table-column :formatter="salerFormat" label="业务员结算方式" width="80" />
            <el-table-column :formatter="salerRateFormat" label="业务员佣金率" width="80" />
            <el-table-column :formatter="salerChargeFormat" label="业务员佣金" width="110" />
            <el-table-column fixed="right" prop="operate" label="操作">
              <template slot-scope="scope">
                <div v-permission="permissionList.billListUpdate" style="color: #1890ff;cursor: pointer;" @click="edit(scope.row)">编辑</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="table-ledger-footer">
          <el-pagination v-if="count > 0" :current-page="currentPage" :page-sizes="[10, 20, 30, 40, 50]" :page-size="pageSize" :total="count" layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChange" @current-change="currentChange" />
        </div>
      </div>
    </div>

    <el-dialog :visible.sync="dialogBetch" class="dialog-ledger" title="导入台账" width="30%">
      <div>
        <span>1、请先下载Excel模板：</span>
        <span style="color: #1890ff;cursor: pointer;" @click="downExcel">台账模板.xls</span>
      </div>
      <div>
        <span>2、将加工好的Excel导入 </span>
        <el-upload :file-list="ledgerFileList" :on-success="ledgerUpload" :headers="{ 'Authorization':token }" accept=".xls,.xlsx" action="https://www.ybinsure.com/t/finance/bill/batchImport" style="display: inline;">
          <el-button class="el-icon-upload2" size="small">浏览</el-button>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogBetch = false">取 消</el-button>
        <el-button type="primary" size="small" @click="fileConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogUp" class="dialog-ledger" title="批量结算" width="30%">
      <div>
        <el-row type="flex" style="margin: 10px 0;" justify="space-around">
          <el-col :span="8">
            <el-upload :file-list="balanceFileList" :on-success="balanceUpload" :headers="{ 'Authorization':token }" accept=".xls,.xlsx" action="https://www.ybinsure.com/t/finance/bill/reconciliations" style="display: inline;">
              <el-button class="el-icon-upload2" size="small" type="primary">导入Excel</el-button>
            </el-upload>
          </el-col>
          <el-col :span="8">
            <el-button size="small" type="primary" @click="downChargeExcel">下载导入模板</el-button>
          </el-col>
        </el-row>

      </div>
      <div>1、请先下载“导入模板”，根据上游提供的清单，将数据加工到您刚下的模板Excel里。</div>
      <div>2、点击"导入Excel”按钮，选择刚加工好数据的Excel文件，点击下方“对账”按钮，系统会自动按照对应的保单进行对账，并显示对账结果。</div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogUp = false">取 消</el-button>
        <el-button type="primary" size="small" @click="fileConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogCheck" title="对账结果" width="80%">
      <el-row>
        <el-col :span="12">
          <div style="text-align:center;">
            <span>以下保(批)单手续费对账不通过</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="text-align:center;">
            <el-button type="primary" size="small" @click="countExporte">导出</el-button>
          </div>
        </el-col>
      </el-row>
      <el-table :data="balanceData">
        <el-table-column property="policyNo" label="保(批)单号" />
        <el-table-column property="licenseNo" label="车牌" />
        <el-table-column property="insuredName" label="被保人" />
        <el-table-column :formatter="ristTypeFormat" property="ristType" label="险种" />
        <el-table-column :formatter="policyFormat" property="policyTime" label="签单时间" />
        <el-table-column property="userName" label="业务员" />
        <el-table-column property="nickName" label="出单员" />
        <el-table-column property="subStrategyName" label="子政策" />
        <el-table-column :formatter="upFormat" property="upFormalityCountType" label="结算方式" />
        <el-table-column label="全保费">
          <template slot-scope="scope">
            <span :style="fullPremiumRed(scope.row)? 'color:red;' : ''">{{ scope.row.fullPremium }}</span>
          </template>
        </el-table-column>
        <el-table-column label="净保费">
          <template slot-scope="scope">
            <span :style="netPremiumRed(scope.row)? 'color:red;' : ''">{{ scope.row.netPremium }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上游手续费费率">
          <template slot-scope="scope">
            <span :style="formalityRate(scope.row)? 'color:red;' : ''">{{ scope.row.billCommission.upFormalityRate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="保费（导入）">
          <template slot-scope="scope">
            <span :style="importPremiumRed(scope.row)? 'color:red;' : ''">{{ scope.row.importPremium }}</span>
          </template>
        </el-table-column>
        <el-table-column label="费率（导入）">
          <template slot-scope="scope">
            <span :style="formalityRate(scope.row)? 'color:red;' : ''">{{ scope.row.importRate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="原因">
          <template slot-scope="scope">
            <span style="color:red;">{{ recoFormat(scope.row) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:center;margin-top: 20px;">
        <el-button size="small" type="primary" @click="updateAll">全部修正</el-button>
        <el-button size="small" type="primary" @click="dialogCheck = false">取消</el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button size="small" @click="dialogCheck = false">取 消</el-button>
        <el-button size="small" type="primary">确 定</el-button> -->
      </div>
    </el-dialog>

    <app-drawer :is-show="isDoShow" :drawer-style="drawerStyle" :drawer-title="title" :mask-closable="false" @drawerClose="close" @drawerConfirm="confirm">
      <add-ledger v-if="isDoShow" ref="ledgerForm" :b-id="billId" :c-id="commossionId" />
    </app-drawer>
  </div>
</template>

<script>
import MyTreeSelect from '@/components/MyTreeSelect/index'
import ElTreeSelect from '@/components/ElTreeSelect/index'
import appDrawer from '@/components/Drawer/drawer'
import addLedger from '@/views/finance/addLedger'
import { formatDate } from '@/utils/index'
import dayjs from 'dayjs'
import { getToken, getTokenType } from '@/utils/auth'
import {
  getCompanyEffective,
  getPolicyAllCompany,
  getFinanceBindNum,
  getFinancePage,
  getFinanceExporte,
  getFinanceUpdate,
  getFinanceInsert,
  getFinanceCountExporte,
  getFinanceBatchUpdate
} from '@/api/ledger'
export default {
  components: {
    MyTreeSelect,
    ElTreeSelect,
    appDrawer,
    addLedger
  },
  data() {
    return {
      ledgerFileList: [],
      balanceFileList: [],
      balanceData: [],
      token: `${getTokenType()} ${getToken()}`,
      ledgerData: {
        selectCompanyId: '',
        companyId: '',
        channelId: '',
        insuredName: '',
        licenseNo: '',
        operatorName: '',
        policyNo: '',
        userName: '',
        riskType: '',
        policyTimeStatus: 1,
        startTime: null,
        endTime: null,
        startDate: null,
        policyTime: null
      },
      organOptions: [],
      companyOptions: {
        loading: false,
        data: []
      },
      numID: [], // token中的工号最高级
      numberOptions: {
        render: [],
        data: []
      },
      ristData: [{ key: 0, value: '交强险' }, { key: 1, value: '商业险' }],
      timeData: [{ key: 0, value: '起保时间' }, { key: 1, value: '签单时间' }],
      dateArr: [],
      isLoading: false,
      ledgerResult: [],
      currentPage: 1,
      pageSize: 20,
      count: 0,
      isDoShow: false,
      billId: '',
      commossionId: '',
      title: '',
      drawerStyle: '',
      dialogBetch: false,
      dialogUp: false,
      dialogCheck: false
    }
  },
  created() {
    const sbs = this.$store.getters.userAll.data.belongCompanys
    const dex = Math.max.apply(
      Math,
      sbs.map(function(val) {
        return val.level
      })
    )
    const res = sbs.find(item => {
      if (item.level === dex) {
        return item
      }
    })
    this.numID.push(res.id)
    this.getCompany()
    this.getNum()
    this.getOrgan()
    this.query()
  },
  methods: {
    // 上传台账
    ledgerUpload(res, file, ledgerFileList) {
      console.log(res)
      if (res.status === 200) {
        this.$message({
          message: '对账成功',
          type: 'success'
        })
        this.dialogBetch = false
        this.ledgerFileList = []
        this.query()
      } else {
        this.$message.error(res.msg)
      }
    },
    // 上传对账
    balanceUpload(res, file, balanceFileList) {
      console.log(res)
      if (res.status === 200) {
        if (res.data && res.data.length <= 0) {
          this.$message({
            message: '对账成功',
            type: 'success'
          })
          this.dialogUp = false
          this.balanceFileList = []
          this.query()
        } else {
          this.balanceData = res.data
          this.dialogCheck = true
          this.dialogUp = false
          this.balanceFileList = []
        }
      } else {
        this.$message.error(res.msg)
        this.balanceFileList = []
      }
    },
    sizeChange(val) {
      this.pageSize = val
      this.query()
    },
    currentChange(val) {
      this.currentPage = val
      this.query()
    },
    // 格式化表格时间
    startFormat(val) {
      return formatDate(val.startDate).slice(0, 10)
    },
    signFormat(val) {
      return formatDate(val.policyTime).slice(0, 10)
    },
    policyFormat(val) {
      if (val.policyTime) {
        return formatDate(val.policyTime)
      }
    },
    fullFormat(val) {
      return '￥' + val.fullPremium
    },
    netFormat(val) {
      return '￥' + val.netPremium
    },
    issueFormat(val) {
      if (val.riskType === 0) {
        return '交强'
      } else {
        return '商业'
      }
    },
    upTypeFormat(val) {
      if (
        val.billCommission.upFormalityCountType !== 0 &&
        val.billCommission.upFormalityCountType !== 1
      ) {
        return '--'
      } else {
        return val.billCommission.upFormalityCountType === 0
          ? '全保费'
          : '净保费'
      }
    },
    upRateFormat(val) {
      return val.billCommission.upFormalityRate === undefined ||
        (val.billCommission.upFormalityCountType !== 0 &&
          val.billCommission.upFormalityCountType !== 1)
        ? '--'
        : val.billCommission.upFormalityRate + '%'
    },
    agencyRateFormat(val) {
      return val.billCommission.agencyFormalityRate === undefined ||
        (val.billCommission.agencyFormalityCountType !== 0 &&
          val.billCommission.agencyFormalityCountType !== 1)
        ? '--'
        : val.billCommission.agencyFormalityRate + '%'
    },
    salerRateFormat(val) {
      return val.billCommission.saleFormalityRate === undefined ||
        (val.billCommission.saleFormalityCountType !== 0 &&
          val.billCommission.saleFormalityCountType !== 1)
        ? '--'
        : val.billCommission.saleFormalityRate + '%'
    },
    upChargeFormat(val) {
      return val.billCommission.upFormality === undefined ||
        (val.billCommission.upFormalityCountType !== 0 &&
          val.billCommission.upFormalityCountType !== 1)
        ? '--'
        : '￥' + val.billCommission.upFormality
    },
    agencyChargeFormat(val) {
      return val.billCommission.agencyFormality === undefined ||
        (val.billCommission.agencyFormalityCountType !== 0 &&
          val.billCommission.agencyFormalityCountType !== 1)
        ? '--'
        : '￥' + val.billCommission.agencyFormality
    },
    salerChargeFormat(val) {
      return val.billCommission.saleFormality === undefined ||
        (val.billCommission.saleFormalityCountType !== 0 &&
          val.billCommission.saleFormalityCountType !== 1)
        ? '--'
        : '￥' + val.billCommission.saleFormality
    },
    organFormat(val) {
      if (
        val.billCommission.agencyFormalityCountType !== 0 &&
        val.billCommission.agencyFormalityCountType !== 1
      ) {
        return '--'
      } else {
        return val.billCommission.agencyFormalityCountType === 0
          ? '全保费'
          : '净保费'
      }
    },
    salerFormat(val) {
      if (
        val.billCommission.saleFormalityCountType !== 0 &&
        val.billCommission.saleFormalityCountType !== 1
      ) {
        return '--'
      } else {
        return val.billCommission.saleFormalityCountType === 0
          ? '全保费'
          : '净保费'
      }
    },
    ristTypeFormat(val) {
      if (val.recoStatus === 1) {
        return ''
      } else {
        return val.riskType === 0 ? '交强' : '商业'
      }
    },
    upFormat(val) {
      if (val.recoStatus === 1) {
        return ''
      } else {
        return val.billCommission.upFormalityCountType === 0
          ? '全保费'
          : '净保费'
      }
    },
    recoFormat(val) {
      if (val.recoStatus === 1) {
        return '系统内无此保单'
      }
      if (val.recoStatus === 0) {
        if (this.formalityRate(val) && this.importPremiumRed(val)) {
          return '保费，费率对账失败'
        } else if (this.formalityRate(val)) {
          return '费率对账失败'
        } else if (this.importPremiumRed(val)) {
          return '保费对账失败'
        } else {
          return ''
        }
      }
    },
    // 全保费否变红
    fullPremiumRed(param) {
      if (param.billCommission.upFormalityCountType === 0) {
        // 0全保费 1净保费
        return param.fullPremium !== param.importPremium
      } else {
        return false
      }
    },

    // 净保费否变红
    netPremiumRed(param) {
      if (param.billCommission.upFormalityCountType === 1) {
        // 0全保费 1净保费
        return param.netPremium !== param.importPremium
      } else {
        return false
      }
    },

    // 导入保费是否变红
    importPremiumRed(param) {
      if (this.fullPremiumRed(param) || this.netPremiumRed(param)) {
        return true
      } else {
        return false
      }
    },

    // 费率是否变红
    formalityRate(param) {
      return param.billCommission.upFormalityRate !== param.importRate
    },
    getOrgan() {
      getCompanyEffective()
        .then(res => {
          const result = res.data
          for (const i of result[0].children) {
            i.children = []
          }
          const json = JSON.parse(
            JSON.stringify(result)
              .replace(/title/g, 'label')
              .replace(/key/g, 'value')
          )
          this.organOptions = json
        })
        .catch(err => {
          console.warn(err)
        })
    },
    getCompany() {
      getPolicyAllCompany()
        .then(res => {
          this.companyOptions.data = res.data
        })
        .catch(err => {
          console.warn(err)
        })
    },
    filterCompany() {
      this.ledgerData.channelId = null
      this.numberOptions.render = this.numberOptions.data.filter(item => {
        return item.companyId === this.ledgerData.companyId
      })
    },
    getNum() {
      getFinanceBindNum(this.numID).then(res => {
        const resStr = JSON.parse(JSON.stringify(res.data))
        resStr.map(item => {
          item.id = item.id.toString()
        })
        this.numberOptions.data = resStr
      })
    },
    // 查询
    query() {
      this.isLoading = true
      if (this.dateArr && this.dateArr.length > 0) {
        this.ledgerData.startTime = new Date(this.dateArr[0]).getTime()
        this.ledgerData.endTime = new Date(this.dateArr[1]).getTime()
      } else {
        this.ledgerData.startTime = null
        this.ledgerData.endTime = null
      }
      getFinancePage({
        model: this.ledgerData,
        page: this.currentPage,
        size: this.pageSize
      })
        .then(res => {
          this.isLoading = false
          this.count = res.data.count
          this.ledgerResult = res.data.model
        })
        .catch(err => {
          this.isLoading = false
          console.warn(err)
        })
    },
    edit(row) {
      if (
        row.billCommission.agencySettlementStatus === 1 &&
        row.billCommission.saleSettlementStatus === 1 &&
        row.billCommission.upSettlementStatus === 1
      ) {
        this.billId = row.billCommission.billId
        this.commossionId = row.billCommission.id
        this.isDoShow = true
        this.drawerStyle = 'width: 1000px;'
        this.title = '编辑'
      } else {
        this.$message({
          message: '该保单已结算，请先通知财务人员撤销结算后再编辑',
          type: 'warning'
        })
        return
      }
    },
    // 导出
    exporte() {
      if (this.dateArr.length > 0) {
        this.ledgerData.startTime = new Date(this.dateArr[0]).getTime()
        this.ledgerData.endTime = new Date(this.dateArr[1]).getTime()
      }
      getFinanceExporte({
        model: this.ledgerData,
        page: this.currentPage,
        size: this.pageSize
      })
        .then(res => {
          console.log(res)
          const url = window.URL.createObjectURL(res)
          const a = document.createElement('a')
          document.body.appendChild(a)
          a.href = url
          a.download =
            '结算记录-' + dayjs().format('YYYY-MM-DD HH_mm_ss') + '.xls'
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 对账
    countExporte() {
      const arr = []
      this.balanceData.map(item => {
        const obj = {}
        obj.policyNo = item.policyNo
        obj.licenseNo = item.licenseNo
        obj.insuredName = item.insuredName
        obj.riskType = this.ristTypeFormat(item)
        obj.policyTime = formatDate(item.policyTime)
        obj.userName = item.userName
        obj.operatorName = item.nickName
        obj.subStrategyName = item.subStrategyName
        obj.upFormalityCountType = this.upFormat(item)
        obj.fullPremium = item.fullPremium
        obj.netPremium = item.netPremium
        obj.upFormalityRate = item.billCommission.upFormalityRate
        obj.importPremium = item.importPremium
        obj.importRate = item.importRate
        obj.reason = this.recoFormat(item)
        arr.push(obj)
      })
      getFinanceCountExporte(arr)
        .then(res => {
          const url = window.URL.createObjectURL(res)
          const a = document.createElement('a')
          document.body.appendChild(a)
          a.href = url
          a.download =
            '对账记录-' + dayjs().format('YYYY-MM-DD HH_mm_ss') + '.xls'
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 修正
    updateAll() {
      getFinanceBatchUpdate({
        wrap: this.balanceData
      }).then(res => {
        this.$message({
          message: '更新成功',
          type: 'success'
        })
        this.dialogCheck = false
        this.query()
      })
    },
    normalizer(node) {
      if (node.children && node.children.length === 0) {
        delete node.children
      }
      return {
        id: node.key,
        label: node.title,
        children: node.children
      }
    },
    gain() {
      this.isDoShow = true
      this.drawerStyle = 'width: 1000px;'
      this.billId = ''
      this.commossionId = ''
      this.title = '添加'
    },
    manyAdd() {
      this.dialogBetch = true
    },
    fileConfirm() {
      this.$message.error('需要上传文件')
    },
    upCharge() {
      this.dialogUp = true
    },
    // 批量下载
    downExcel() {
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.href = `//ybinsure.com/spa/commonManagerTest/assets/template/台账模板.xls`
      a.download = `上游结算模板-${dayjs(new Date()).format(
        'YYYY-MM-DD HH_mm_ss'
      )}.xls`
      a.click()
      document.body.removeChild(a)
    },
    downChargeExcel() {
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.href =
        '//ybinsure.com/spa/commonManagerTest/assets/template/对账模板.xls'
      a.download = '对账模板'
      a.click()
      document.body.removeChild(a)
    },
    close() {
      this.isDoShow = false
    },
    confirm() {
      const lerdgerData = this.$refs.ledgerForm.form

      lerdgerData.billCommission.belongCompanyId = lerdgerData.selectCompanyId
      if (lerdgerData.billCommission.agencySalerType === 0) {
        lerdgerData.billCommission.agencyFormalityCountType =
          lerdgerData.billCommission.downFormalityCountType
        lerdgerData.billCommission.agencyFormalityRate =
          lerdgerData.billCommission.agencySalerRate
        lerdgerData.billCommission.agencyFormality =
          lerdgerData.billCommission.agencySalerFormality
      } else if (lerdgerData.billCommission.agencySalerType === 1) {
        lerdgerData.billCommission.saleFormalityCountType =
          lerdgerData.billCommission.downFormalityCountType
        lerdgerData.billCommission.saleFormalityRate =
          lerdgerData.billCommission.agencySalerRate
        lerdgerData.billCommission.saleFormality =
          lerdgerData.billCommission.agencySalerFormality
      }
      lerdgerData.startDate = new Date(lerdgerData.startDate).getTime()
      lerdgerData.policyTime = new Date(lerdgerData.policyTime).getTime()
      console.log(lerdgerData)
      this.$refs.ledgerForm.$refs.ledgerForm.validate(valid => {
        if (!valid) return
        if (this.billId === '' || this.commossionId === '') {
          getFinanceInsert(lerdgerData)
            .then(res => {
              this.isDoShow = false
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.query()
            })
            .catch(err => {
              console.warn(err)
              this.$message.error(err)
            })
        } else {
          getFinanceUpdate(lerdgerData)
            .then(res => {
              this.isDoShow = false
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
              this.query()
            })
            .catch(err => {
              console.warn(err)
              this.$message.error(err)
            })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.app-panel {
  overflow: visible;
}
.ledger-list-header {
  vertical-align: top;
  .ledger-select_organ {
    max-width: 250px;
    display: inline-block;
    .vue-treeselect__menu {
      height: 300px;
    }
  }
  .ledger-select {
    .ledger-select_company,
    .ledger-select_workNumber {
      max-width: 100px;
      margin-left: 10px;
    }
  }
  .ledger-input {
    .el-input {
      max-width: 165px;
      margin-right: 10px;
      &:last-of-type {
        margin-right: 0px;
      }
    }
  }
  .ledger-select_two {
    .el-select:first-of-type {
      margin-right: 10px;
    }
    .el-select {
      max-width: 100px;
    }
  }
  .ledger-select,
  .ledger-input,
  .ledger-select_two,
  .ledger-select-block,
  .ledger-btns {
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 10px;
    vertical-align: top;
  }
}
.ledger-list-table {
  .table-ledger-data {
    margin-top: 10px;
  }
  .table-ledger-footer {
    text-align: right;
    height: 52px;
    padding-top: 20px;
  }
}
.dialog-ledger {
  .el-dialog__body {
    padding: 10px 20px;
    line-height: 30px;
  }
}
.el-tree-select-dropdown {
  .el-tree {
    width: 250px;
    height: 300px;
    overflow: auto;
  }
  .el-tree-node > .el-tree-node__children {
    overflow: visible;
  }
}
</style>
