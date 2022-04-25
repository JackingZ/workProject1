<template>
  <!-- eslint-disable -->
  <div class="app-container upstream">
    <div class="app-panel">
      <el-row type="flex" style="flex-flow: row wrap;">
        <my-tree-select
          v-if="type !== 1"
          :options="orgList"
          v-model="selectOrg"
          :normalizer="normalizer"
          no-options-text="数据加载中..."
          no-children-text=""
          style="width:250px;display: inline-block;vertical-align: top;"
          class="m"
          placeholder="选择机构"
          no-results-text="未找到结果"
          />
        <el-select
          v-model="formVal.selectCompany"
          clearable
          filterable
          value-key="name"
          style="width: 130px;"
          class="m"
          placeholder="保险公司"
          size="small"
          @change="onCompanyChange">
          <el-option
            v-for="item in formData.companyList"
            :key="item.id"
            :label="item.name"
            :value="item"/>
        </el-select>

        <el-select
          v-model="formVal.selectBindCompany"
          value-key="channelName"
          style="width: 130px;"
          class="m"
          filterable
          clearable
          placeholder="工号"
          size="small">
          <el-option
            v-for="(item, index) in formData.bindCompanyList"
            :key="index"
            :label="item.channelName"
            :value="item"/>
        </el-select>

        <el-input
          v-model="formVal.policyNo"
          style="width: 150px;"
          class="m"
          size="small"
          placeholder="请输入保(批)单号"
          clearable/>

        <el-input
          v-model="formVal.licenseNo"
          style="width: 130px;"
          class="m"
          size="small"
          placeholder="请输入车牌"
          clearable/>

        <el-input
          v-model="formVal.insuredName"
          style="width: 130px;"
          class="m"
          size="small"
          placeholder="请输入被保人"
          clearable/>

        <el-input
          v-model="formVal.userName"
          style="width: 130px;"
          class="m"
          size="small"
          placeholder="请输入业务员"
          clearable/>

        <el-input
          v-model="formVal.operatorName"
          style="width: 130px;"
          class="m"
          size="small"
          placeholder="请输入出单员"
          clearable/>

        <el-select
          v-model="formVal.riskType"
          style="width: 130px;"
          class="m"
          clearable
          placeholder="险种"
          size="small">
          <el-option
            v-for="item in formData.riskTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>

        <el-select
          v-model="formVal.settlementStatus"
          style="width: 130px;"
          class="m"
          clearable
          placeholder="结算状态"
          size="small">
          <el-option
            v-for="item in formData.settlementStatusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>

        <el-select
          v-model="formVal.timeType"
          style="width: 130px;"
          class="m"
          size="small">
          <el-option
            v-for="item in formData.timeTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>

        <el-date-picker
          v-model="formVal.date"
          class="m"
          size="small"
          :default-time="['0:00:00', '23:59:59']"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"/>

        <el-button v-permission="permissionList.settleQuery"
          type="primary" icon="el-icon-search" class="m" size="mini" :loading="isRequestList"
          @click="queryTableInfo">查询</el-button>
        <el-button v-permission="permissionList.settleExport" type="primary" class="m" size="mini" @click="exportFile">导出</el-button>
        <el-button v-permission="permissionList.settleBatch" type="primary" class="m" size="mini" @click="showBatchSettlement = true">批量结算</el-button>
      </el-row>
      <div style="margin: 10px 0;color: #606266;">
        全保费总额：{{amount.fullPremium | fixTwo}}元，
        净保费总额：{{amount.netPremium | fixTwo}}元，
        手续费总额：{{amount.formality | fixTwo}}元
      </div>
      <el-table
        v-loading="isRequestList"
        :data="tableData"
        border
        style="width: 100%;margin-top: 10px;">
        <el-table-column
          fixed
          prop="companyName"
          label="保险公司"
          width="80"/>
        <el-table-column
          prop="channelName"
          label="工号"
          min-width="180"/>
        <el-table-column
          prop="policyNo"
          label="保(批)单号"
          min-width="200"/>
        <el-table-column
          prop="licenseNo"
          label="车牌"
          min-width="100"/>
        <el-table-column
          prop="insuredName"
          label="被保人"/>
        <el-table-column
          prop="userName"
          label="业务员"/>
        <el-table-column
          prop="nickName"
          label="出单员"/>
        <el-table-column
          label="险种">
          <template slot-scope="scope">
            {{scope.row.riskType === 0 ? '交强' : '商业'}}
          </template>
        </el-table-column>
        <el-table-column
          min-width="160"
          label="起保时间">
          <template slot-scope="scope">
            {{scope.row.startDate | formatTime}}
          </template>
        </el-table-column>
        <el-table-column
          min-width="160"
          label="签单时间">
          <template slot-scope="scope">
            {{scope.row.policyTime | formatTime}}
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          label="全保费(元)">
          <template slot-scope="scope">
            {{scope.row.fullPremium | fixTwo}}
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          label="净保费(元)">
          <template slot-scope="scope">
            {{scope.row.netPremium | fixTwo}}
          </template>
        </el-table-column>
        <el-table-column
          prop="subStrategyName"
          label="子政策"
          min-width="150"/>
        <el-table-column
          prop="countTypeValue"
          label="结算方式"
          min-width="100"/>
        <el-table-column
          prop="formalityRate"
          label="费率(%)"/>
        <el-table-column
          prop="finishFormalityRate"
          label="已结费率(%)"
          min-width="100"/>
        <el-table-column
          prop="unFinishFormalityRate"
          label="未结费率(%)"
          min-width="100"/>
        <el-table-column
          prop="formality"
          label="手续费(元)"
          min-width="100"/>
        <el-table-column
          prop="finishFormality"
          label="已结金额(元)"
          min-width="110"/>
        <el-table-column
          prop="unFinishFormality"
          label="未结金额(元)"
          min-width="110"/>
        <el-table-column
          prop="settlementStatusValue"
          label="结算状态"/>
        <el-table-column
          fixed="right"
          label="操作"
          min-width="135">
          <template slot-scope="scope">
            <el-button v-permission="permissionList.settleSettleOperate"
              type="text" @click="settlement(scope.row)">结算</el-button>
            <el-button v-permission="permissionList.settleQueryRecord"
              type="text" @click="settlementRecord(scope.row)">结算记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="totalCount > 0"
        class="el-pagination-wrap">
        <el-pagination
          :small="isMobile"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>
    
    <el-dialog title="结算" :visible.sync="showSettlementModal"
      class="settlementModal"
      @close="closeSettlementModal">
      <div v-if="currentSelectItem">
        <el-row>
          <el-col :span="8">手续费：￥{{currentSelectItem.formality}}</el-col>
          <el-col :span="8">已结：￥{{currentSelectItem.finishFormality}}</el-col>
          <el-col :span="8">未结：￥{{currentSelectItem.unFinishFormality}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8">请输入{{type === 1 ? '上游手续费' :
            type === 2 ? '机构佣金' : '业务员佣金'}}结算金额：</el-col>
          <el-col :span="6">
            <el-input-number size="small" type="number"
              v-model="settlementModalVal.money"
              controls-position="right"/>
          </el-col>
          <el-col :span="10" style="text-align:center;">
            <el-button v-permission="permissionList.settleQueryRecord"
              @click="getAll()"
              type="text">全额结算</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">结算周期：</el-col>
          <el-col :span="20">
            <el-date-picker
              v-model="settlementModalVal.date"
              class="m"
              size="small"
              type="datetimerange"
              :default-time="['0:00:00', '23:59:59']"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"/>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">备注：</el-col>
          <el-col :span="18">
            <el-input
              v-model="settlementModalVal.backup"
              type="textarea"
              :rows="2"
              >
            </el-input>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSettlementModal()" size="small">取 消</el-button>
        <el-button type="primary" @click="confirmSettlement()" size="small" :loading="isRequestSettlement">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="结算记录" :visible.sync="showSettlementRecordModal"
      width="60%"
      @close="closeSettlementRecordModal">
      <el-table
        :data="settlementRecordList"
        border
        >
        <el-table-column
          prop="sequence"
          label="结算单号"
          min-width="120"/>
        <el-table-column
          prop="createTime"
          label="结算时间"
          min-width="100"/>
        <el-table-column
          prop="operateName"
          label="操作人"
          min-width="80"/>
        <el-table-column
          label="结算金额"
          min-width="100">
          <template slot-scope="scope">
            {{scope.row.bills[0].money}}
          </template>
        </el-table-column>
        <el-table-column
          prop="backup"
          label="备注"
          min-width="80"/>
        <el-table-column
          prop="statusTitle"
          label="状态"
          min-width="80"/>
      </el-table>
    </el-dialog>

    <el-dialog title="批量结算" :visible.sync="showBatchSettlement"
      class="settlementModal"
      custom-class="my-custom-dialog"
      @close="closeBatchSettlement">
      <el-row>
        <el-col :span="4">结算周期：</el-col>
        <el-col :span="20">
          <el-date-picker
            v-model="batchSettlementVal.date"
            class="m"
            size="small"
            type="datetimerange"
            :default-time="['0:00:00', '23:59:59']"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">备注：</el-col>
        <el-col :span="16">
          <el-input
            v-model="batchSettlementVal.backup"
            type="textarea"
            :rows="2"
            >
          </el-input>
        </el-col>
      </el-row>
      <br><br>
      <el-row>
        <el-col :span="type === 1 ? 12 : 24" style="text-align: center;">
          <el-upload
            action=""
            :limit="2"
            :auto-upload="false"
            :before-remove="removeFile"
            :on-change="addFile"
            :file-list="fileList">
            <el-button size="small" slot="trigger">导入Excel</el-button>
          </el-upload>
        </el-col>
        <el-col v-if="type === 1" :span="12" style="text-align: center;">
          <el-button size="small" @click="downloadTemplate">下载Excel模版</el-button>
        </el-col>
      </el-row>
      <div v-if="type === 1">
        <br><br>
        1、请先下载“Excel模板”，根据上游提供的清单，将数据加工到您刚下的模板Excel里。<br><br><br>
        2、点击"导入Excel”按钮，选择刚加工好数据的Excel文件，点击下方“结算”按钮，系统会自动按照对应的保单进行结算处理。<br><br><br>
      </div>
      <div v-else>
        <br><br>
        1、请先在列表页面导出需要结算的保单，可根据“签单时间”等条件进行筛选导出。<br><br><br>
        2、打开导出的Excel文件，填入本次结算的金额，然后保存文件。<br><br><br>
        3、点击“导入Excel”按钮，选择刚保存的Excel文件，再点击下方的“结算”按钮进行结算。<br><br>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeBatchSettlement()" size="small">取 消</el-button>
        <el-button type="primary" @click="confirmBatchSettlement()" size="small" :loading="isRequestSettlement">结 算</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { financeCompany, queryByBindingCompanys, offLineBindCompany, querySettlementList, queryTotalFormality,
 settlementExport, settlementInsert, querySettlementRecordById, upBatchSettlement, batchSettlement} from '@/api/finance'
import { getCompanyEffective } from '@/api/ledger'
import { policyAddCompany } from '@/api/policy'
import { Message } from 'element-ui'
import MyTreeSelect from '@/components/MyTreeSelect'
import dayjs from 'dayjs'
export default {
  name: 'Upstream',
  components: {
    MyTreeSelect
  },
  props: {
    type: Number, // 结算类型 1上游结算 2机构结算 3业务员结算,
  },
  filters: {
    formatTime (val) {
      if (!val) return
       return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  data() {
    let isMobile = 'ontouchend' in window
    return {
      orgList: [],
      selectOrg: '',
      fileList: [],
      currentSelectItem: null,
      showSettlementModal: false,
      showSettlementRecordModal: false,
      showBatchSettlement: false,
      settlementModalVal: {
        money: 0,
        date: '',
        backup: '' // 备注
      },
      batchSettlementVal: {
        date: '',
        backup: ''
      },
      settlementRecordList: [],
      isRequestList: false,
      isRequestSettlement: false,
      isMobile,
      amount: {
        formality: 0, // 手续费总额
        fullPremium: 0, // 全保费总额
        netPremium: 0 // 净保费总额
      },
      formVal: {
        selectCompany: '',
        selectBindCompany: '',
        timeType: 1, // 0出单时间 1承保时间
        policyNo: '', // 保(批)单号
        licenseNo: '', // 车牌
        insuredName: '', // 被保人
        userName: '', // 业务员
        operatorName: '', // 出单员
        riskType: '', // 险种
        settlementStatus: '', // 结算状态
        date: null // 选择时间段
      },
      formData: {
        companyList: [], // 保险公司
        bindCompanyList: [], // 工号列表
        backupBindCompanyList: [], // 工号列表b备份
        timeTypeList: [
          {
            value: 0,
            label: '起保时间'
          },
          {
            value: 1,
            label: '签单时间'
          }
        ],
        riskTypeList: [
          {
            value: 0,
            label: '交强险'
          },
          {
            value: 1,
            label: '商业险'
          }
        ],
        settlementStatusList: [
          {
            value: 1,
            label: '未结算'
          },
          {
            value: 2,
            label: '部分结算'
          },
          {
            value: 3,
            label: '已结算'
          },
          {
            value: 4,
            label: '超额计算'
          }
        ]
      },
      tableData: [],
      totalCount: 0,
      pageSize: 10,
      currentPage: 1
    }
  },
  created () {
    this.initDefaultVal()
    this.initCompanyList()
    this.queryTableInfo()
  },
  methods: {
    initDefaultVal () {
      let previous = new Date()
      previous.setMonth(previous.getMonth() -1)
      previous.setHours(0)
      previous.setMinutes(0)
      previous.setSeconds(0)
      previous.setMilliseconds(0)
      let now = new Date()
      now.setHours(23)
      now.setMinutes(59)
      now.setSeconds(59)
      this.formVal = {
        selectCompany: '',
        selectBindCompany: '',
        timeType: 1, // 0出单时间 1承保时间
        policyNo: '', // 保(批)单号
        licenseNo: '', // 车牌
        insuredName: '', // 被保人
        userName: '', // 业务员
        operatorName: '', // 出单员
        riskType: '', // 险种
        settlementStatus: '', // 结算状态
        date: [
          previous,
          now
        ] // 选择时间段
      }
    },
    initCompanyList () {
      let company = this.$store.state.user.userInfo.company // 所属机构
      Promise.all([
        policyAddCompany(company).then(res => {
          if (res && res.status === 200) return res.data
        }),
        queryByBindingCompanys(company).then(res => {
          if (res && res.status === 200) return res.data
        }),
        offLineBindCompany(company).then(res => {
          if (res && res.status === 200) return res.data ? 
            res.data.map((item) => {
              return {
                // ...item,
                channelName: item.insureChannelName,
                cid: item.cid,
                id: item.cid,
                companyId: parseInt(item.insureCompanySourceId)
              }
            }) : []
        }),
        financeCompany()
      ])
      .then(res => {
        this.formData.bindCompanyList = []
        for(let i = 0; i < 3; i++) {
          if (res[i]) this.formData.bindCompanyList.push(...res[i])
        }
        this.formData.backupBindCompanyList = [...this.formData.bindCompanyList]
        if (res[3] && res[3].status === 200) {
          const companyList = res[3].data
          this.formData.companyList = companyList
            .filter(item => this.formData.bindCompanyList.some(value => value.companyId === item.id))
        }
      })

      getCompanyEffective().then(res => {
        const result = res.data
        for (const i of result[0].children) {
          i.children = []
        }
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
    onCompanyChange () {
      if (!this.formVal.selectCompany) {
        this.formVal.selectBindCompany = ''
        this.formData.bindCompanyList = [...this.formData.backupBindCompanyList]
        return
      }
      this.formData.bindCompanyList = this.formData.backupBindCompanyList
        .filter(item => this.formVal.selectCompany.id === item.companyId)
      if (this.formVal.selectBindCompany) {
        let isFind = this.formData.bindCompanyList.some(item => item.id === this.formVal.selectBindCompany.id)
        if (!isFind) this.formVal.selectBindCompany = ''
      }
      
    },
    createModelParams () {
      let policyNoList = this.formVal.policyNo.split(',')
      console.log('policyNoList', policyNoList, this.formVal.policyNo)
      let formVal = this.formVal
      let startTime = formVal.date ? formVal.date[0].getTime() : null
      let endTime = formVal.date ? formVal.date[1].getTime() : null
      let selectCompanyId = this.selectOrg || null
      let model = {
        channelId: formVal.selectBindCompany ? formVal.selectBindCompany.id : null, // 工号id
        companyId: formVal.selectCompany ? formVal.selectCompany.id : null, // 保险公司
        companyLilst: [],
        endTime,
        insuredName: formVal.insuredName, // 被保人
        licenseNo: formVal.licenseNo, // 车牌
        operatorName: formVal.operatorName, // 出单员
        policyNo: policyNoList && policyNoList.length === 1 ? policyNoList[0] : null, // 保(批)单号
        policyTimeStatus: formVal.timeType, // 前端选择 0出单时间 1承保时间
        riskType: formVal.riskType, // 险种
        selectCompanyId: this.type !== 1 ? selectCompanyId : null,
        settlementStatus: formVal.settlementStatus ? formVal.settlementStatus : null, // 结算状态 1未结算 2部分结算 3已结算 4超额计算
        startTime,
        teamList: null,
        type: this.type, // 结算类型 1上游结算 2机构结算 3业务员结算
        userName: formVal.userName, // 业务员
        policyNoList: policyNoList && policyNoList.length > 1 ? policyNoList: null 
      }

      delete this.$route.params.policyNoList
      return model
    },
    queryTableInfo () {
      this.isRequestList = true
      let model = this.createModelParams()
      this.queryList(model)
      queryTotalFormality(model).then(res => {
        if (res && res.status === 200) {
          this.amount = {...res.data}
        }
      })
    },
    queryList (model) {
      querySettlementList({
        page: this.currentPage,
        size: this.pageSize,
        model
      }).then(res => {
        this.isRequestList = false
        if (res.count >= 0) {
          this.totalCount = res.count
          this.tableData = res.model || []
        }
      }).catch(e => this.isRequestList = false)
    },
    startQuery () {
      this.currentPage = 1
      this.queryTableInfo()
    },
    handleSizeChange(val) {
      console.log(`handleSizeChange 每页 ${val} 条`)
      this.pageSize = val
      this.queryTableInfo()
      // this.queryPersonList(this.currentPage, this.pageSize)
    },
    handleCurrentChange(val) {
      console.log(`handleCurrentChange 当前页: ${val}`)
      this.currentPage = val
      this.queryTableInfo()
      // this.queryPersonList(this.currentPage, this.pageSize)
    },
    //结算导出
    exportFile () {
      settlementExport(this.createModelParams()).then(data => {
        this.createDownloadFile(data)
      })
    },
    createDownloadFile (data) {
      const url = window.URL.createObjectURL(data)
      console.log('url', url)
      let a = document.createElement('a')
      document.body.appendChild(a)
      a.href = url
      let fileName = this.type === 1 ? '上游结算' :
        this.type === 2 ?  '机构结算' : '业务员结算'
      a.download = `${fileName}-${dayjs(new Date()).format('YYYY-MM-DD HH_mm_ss')}.xls`
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    },
    downloadTemplate () {
      let a = document.createElement('a')
      document.body.appendChild(a)
      a.href = `//ybinsure.com/assets/fileTemplate/上游结算模板.xls`
      a.download = `上游结算模板-${dayjs(new Date()).format('YYYY-MM-DD HH_mm_ss')}.xls`
      a.click()
      document.body.removeChild(a)
    },
    settlement (item) {
      this.currentSelectItem = item
      this.showSettlementModal = true
    },
    settlementRecord (item) {
      this.currentSelectItem = item
      this.showSettlementRecordModal = true
      querySettlementRecordById({
        billId: item.id,
        type: this.type // 结算类型 1上游结算 2机构结算 3业务员结算
      }).then(res => {
        if (res && res.status === 200) {
          this.settlementRecordList = res.data
        }
      })
    },
    closeSettlementModal () {
      this.showSettlementModal = false
      // 重置数据
      this.settlementModalVal = {
        money: 0,
        date: '',
        backup: '' // 备注
      }
    },
    closeSettlementRecordModal () {
      this.showSettlementRecordModal = false
      this.settlementRecordList = []
    },
    closeBatchSettlement () {
      this.showBatchSettlement = false
      this.fileList = []
      this.batchSettlementVal = {
        date: '',
        backup: ''
      }
    },
    // 批量结算确定
    confirmBatchSettlement () {
      if (!this.fileList || this.fileList.length === 0) {
        this.showMessage('请导入Excel', 'warning')
        return
      }
      const data = new FormData()
      data.append('file', this.fileList[0].raw)
      let params = {}
      let val = this.batchSettlementVal
      if (val.date) {
        params.startDate = dayjs(val.date[0]).format('YYYY-MM-DD HH:mm:ss')
        params.endDate = dayjs(val.date[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      if (val.backup) params.backup = val.backup
      if (this.type === 1) {
        upBatchSettlement(data, params).then(res => {
          if (res && res.status === 200) {
            this.showMessage('批量结算成功')
            this.closeBatchSettlement()
            this.queryTableInfo()
          } else this.showMessage(res.msg, 'error')
        }).catch(e => {
          this.showMessage(e, 'error')
        })
      } else {
        data.append('type', this.type)
        batchSettlement(data, params).then(res => {
          if (res && res.status === 200) {
            this.showMessage('批量结算成功')
            this.closeBatchSettlement()
            this.queryTableInfo()
          } else this.showMessage(res.msg, 'error')
        }).catch(e => {
          this.showMessage(e, 'error')
        })
      }
    },
    // 结算确定
    confirmSettlement () {
      let val = this.settlementModalVal
      console.log('val.money', val.money, typeof val.money)
      if (!val.money || parseFloat(val.money) <= 0) {
        this.showMessage('请输入正确的结算金额', 'warning')
        return
      }
      let pointVal = val.money.toString().split(".")[1] //小数
      if (pointVal && pointVal.length > 2) {
        this.showMessage('金额只支持2位小数！', 'warning')
        return
      }
      let startTime = val.date ? dayjs(val.date[0]).format('YYYY-MM-DD HH:mm:ss') : null
      let endTime = val.date ? dayjs(val.date[1]).format('YYYY-MM-DD HH:mm:ss') : null
      let params = {
        bills:[
          {
            billId: this.currentSelectItem.id,
            money: val.money,
            type: this.type // 结算类型 1上游结算 2机构结算 3业务员结算
          }
        ],
        backup: val.backup || null, //备注
        startTime,
        endTime
      }
      this.isRequestSettlement = true
      settlementInsert(params).then(res => {
        this.isRequestSettlement = false
        if (res && res.status === 200) {
          this.showMessage('添加成功')
          this.closeSettlementModal()
          this.queryTableInfo()
        }
      }).catch(e => {
        this.isRequestSettlement = false
      })
    },
    showMessage (msg, type) {
      Message({
        message: msg,
        type: type || 'success',
        duration: 2 * 1000
      })
    },
    addFile (file, fileList) {
      // console.log('addFile', arguments)
      if (file) this.fileList = [file]
      // 大于1删除最后一个
      if (this.fileList.length > 1) this.fileList.splice(this.fileList.length -1, 1)
    },
    removeFile (file, fileList) {
      // 清空文件
      if (!fileList || fileList.length === 1) this.fileList = []
    },
    checkExternalQuery () {
      console.log('this.$route.query', this.$route.query)
      if (!window.globalPolicyNoList) return
      this.initDefaultVal()
      this.formVal.policyNo = [...window.globalPolicyNoList].join(',')
      delete window.globalPolicyNoList
      this.queryTableInfo()
    },
    getAll () {
      let res = parseFloat(this.currentSelectItem.unFinishFormality)
      if (res >= 0) this.settlementModalVal.money = res
    }
  },
  activated () {
    this.checkExternalQuery()
  }
}
</script>

<style lang="scss">
  .upstream {
    .star{
      color: #f56c6c;
      margin-right: 4px;
    }
    .m {
      margin: 0 10px 10px 0;
    }
    .el-pagination-wrap {
      position: relative;
      height: 52px;
    }
    .el-pagination {
      position: absolute;
      top: 20px;
      right: 0;
    }
    .el-range-separator {
      width: 30px;
      line-height: 28px;
    }
    .settlementModal{
      .el-row {
        line-height: 40px;
      }
    }
    .my-custom-dialog{
      width: 60%;
      min-width: 360px;
      max-width: 640px;
    }
  }
</style>
