<template>
  <div class="add-ledger">
    <el-form v-loading="isLoading" ref="ledgerForm" :model="form" :rules="rules" label-width="130px">
      <el-row :gutter="5">
        <el-col :span="8">
          <!-- <el-form-item label="机构：" prop="selectCompanyId">
            <my-tree-select :value="form.selectCompanyId" :options="organOptions" :disabled="editStatus" :normalizer="normalizer" no-options-text="数据加载中..." placeholder="选择机构" no-results-text="未找到结果" @input="form.selectCompanyId = $event" @select="getSalersData" />
          </el-form-item> -->
          <el-form-item label="机构：" prop="teamName">
            <el-input v-model="form.teamName" disabled size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- <el-form-item label="业务员：" prop="userId">
            <el-select v-model="form.userId" :disabled="editStatus" clearable filterable placeholder="请选择业务员" size="small">
              <el-option v-for="item in salerOptions" :key="item.id" :label="item.idName" :value="item.id" />
            </el-select>
          </el-form-item> -->
          <el-form-item label="业务员：" prop="userName">
            <el-input v-model="form.userName" disabled size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出单员：">
            <el-input v-model="form.operatorName" disabled size="small" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="保险公司：" prop="companyId">
            <el-select v-model="form.companyId" disabled clearable filterable placeholder="保险公司" size="small" @change="companyChange">
              <el-option v-for="item in companyOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工号：">
            <el-select v-model="form.channelId" :loading="numberOptions.loading" disabled clearable filterable placeholder="工号" size="small">
              <el-option v-for="item in numberOptions.render" :key="item.id" :label="item.channelName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="保(批)单号：" prop="policyNo">
            <el-input v-model="form.policyNo" disabled size="small" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="车牌：" prop="licenseNo">
            <el-input v-model="form.licenseNo" disabled size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="被保人：" prop="insuredName">
            <el-input v-model="form.insuredName" disabled size="small" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="起保时间：" prop="startDate">
            <el-date-picker v-model="form.startDate" disabled type="date" placeholder="请选择起保时间" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="签单时间：" prop="policyTime">
            <el-date-picker v-model="form.policyTime" :picker-options="pickerStart" disabled type="date" placeholder="请选择签单时间" size="small" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="保险类型：" prop="riskType">
            <el-select v-model="form.riskType" disabled clearable placeholder="请选择保险类型" size="small">
              <el-option v-for="item in ristData" :key="item.key" :label="item.value" :value="item.key" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="全保费(元)：" prop="fullPremium">
            <el-input v-model="form.fullPremium" disabled type="number" size="small" @blur="fixedFullPremium" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="净保费(元)：" prop="netPremium">
            <el-input v-model="form.netPremium" disabled type="number" size="small" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="上游结算方式：" prop="billCommission.upFormalityCountType">
            <el-select v-model="form.billCommission.upFormalityCountType" clearable placeholder="请选择结算方式" size="small">
              <el-option v-for="item in upTypeData" :key="item.key" :label="item.value" :value="item.key" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="上游手续费费率：" prop="billCommission.upFormalityRate" class="up-charge-rate">
            <el-input v-model="form.billCommission.upFormalityRate" type="number" size="small" @blur="upFormalityRateFixed" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="上游手续费(元)：" prop="billCommission.upFormality">
            <el-input v-model="form.billCommission.upFormality" disabled size="small" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item label="下游结算方式：" prop="downFormalityCountType">
            <el-select v-model="form.downFormalityCountType" clearable placeholder="请选择结算方式" size="small">
              <el-option v-for="item in formalityTypeData" :key="item.key" :label="item.value" :value="item.key" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-row :gutter="5">
            <el-col :span="12">
              <el-form-item label-width="0" prop="agencySalerType">
                <el-select v-model="form.agencySalerType" clearable placeholder="请选择" size="small">
                  <el-option v-for="item in agencySalerData" :key="item.key" :label="item.value" :value="item.key" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="0" prop="agencySalerRate">
                <el-input v-model="form.agencySalerRate" type="number" size="small" @blur="agencySalerRateFixed" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="form.agencySalerType === 1 ? '业务员佣金(元)：' : '机构佣金(元)：'" prop="agencySalerFormality">
            <el-input v-model="form.agencySalerFormality" disabled type="number" size="small" />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>

<script>
// import MyTreeSelect from '@/components/MyTreeSelect/index'
import {
  getPolicyAllCompany,
  getFinanceBindNum,
  // getFinanceComNum,
  // getFinanceIdsNum,
  getFinanceEdit
  // getFinanceSaler,
  // getFinanceOneSaler
} from '@/api/ledger'
import { formatDate } from '@/utils/index'
export default {
  // components: {
  //   MyTreeSelect
  // },
  props: {
    bId: {
      type: String,
      default: ''
    },
    cId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      bcID: '',
      editStatus: false,
      agencyOrSaleStatus: false,
      isLoading: false,
      organOptions: [],
      salerOptions: [],
      companyOptions: [],
      numID: [],
      numberOptions: {
        loading: false,
        data: [],
        render: []
      },
      ristData: [{ key: 0, value: '交强险' }, { key: 1, value: '商业险' }],
      upTypeData: [{ key: 0, value: '全保费' }, { key: 1, value: '净保费' }],
      formalityTypeData: [
        { key: 0, value: '全保费' },
        { key: 1, value: '净保费' }
      ],
      agencySalerData: [
        { key: 0, value: '机构佣金率' },
        { key: 1, value: '业务员佣金率' }
      ],
      pickerStart: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      form: {
        selectCompanyId: null,
        companyId: '', // 保险公司
        channelId: '', // 工号
        insuredName: '', // 被保人
        licenseNo: '', // 车牌
        operatorName: '',
        fullPremium: null, // 全保费
        netPremium: null, // 净保费
        policyNo: '', // 保批单号
        userId: '',
        riskType: '',
        userName: '',
        teamName: '',
        startDate: null,
        policyTime: null,
        downFormalityCountType: null, // 下游结算方式
        agencySalerType: 1, // 机构、业务员费率选择
        agencySalerRate: null, // 机构、业务员费率值
        agencySalerFormality: null, // 佣金值
        billCommission: {
          agencyFormality: null, // 机构佣金
          agencyFormalityCountType: null, // 下游机构结算方式
          agencyFormalityRate: null, // 机构佣金率
          belongCompanyId: '',
          saleFormality: null, // 业务员佣金
          saleFormalityRate: null, // 业务员佣金率
          saleFormalityCountType: null, // 下游业务员结算方式
          upFormality: null, // 上游手续费
          upFormalityCountType: null, // 上游结算方式
          upFormalityRate: null // 上游手续费率
        }
      },
      rules: {
        // selectCompanyId: [
        //   { required: true, message: '请选择机构', trigger: 'blur' }
        // ],
        teamName: [{ required: true, message: '请选择机构', trigger: 'blur' }],
        // userId: [{ required: true, message: '请选择业务员', trigger: 'blur' }],
        userName: [
          { required: true, message: '请选择业务员', trigger: 'blur' }
        ],
        companyId: [
          { required: true, message: '请选择保险公司', trigger: 'change' }
        ],
        channelId: [
          { required: true, message: '请选择工号', trigger: 'change' }
        ],
        insuredName: [
          { required: true, message: '请输入被保人', trigger: 'change' }
        ],
        licenseNo: [
          { required: true, message: '请输入车牌', trigger: 'change' }
        ],
        policyNo: [
          { required: true, message: '请输入保(批)单号', trigger: 'change' }
        ],
        riskType: [
          { required: true, message: '请选择保险类型', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: '请选择起保时间', trigger: 'change' }
        ],
        policyTime: [
          { required: true, message: '请选择签单时间', trigger: 'change' }
        ],
        fullPremium: [
          { required: true, message: '请输入全保费', trigger: 'change' }
        ],
        netPremium: [
          { required: true, message: '请输入净保费', trigger: 'change' }
        ],
        'billCommission.upFormalityCountType': [
          { required: true, message: '请选择上游结算方式', trigger: 'change' }
        ],
        'billCommission.upFormalityRate': [
          { required: true, message: '请输入上游手续费费率', trigger: 'change' }
        ],
        'billCommission.upFormality': [
          { required: true, message: '请输入上游手续费', trigger: 'change' }
        ],
        downFormalityCountType: [
          { required: true, message: '请选择下游结算方式', trigger: 'change' }
        ],
        agencySalerRate: [
          { required: true, message: '请输入佣金费率', trigger: 'change' }
        ],
        agencySalerType: [
          { required: true, message: '请选择佣金费率方式', trigger: 'change' }
        ],
        agencySalerFormality: [
          { required: true, message: '请输入佣金', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    'form.fullPremium'(val) {
      this.calcNet()
      this.calcUpFormality()
      this.calcFormaltiy()
    },
    'form.billCommission.upFormalityCountType'(val) {
      // if (val !== 0 || val !== 1) this.form.billCommission.upFormality = null
      this.calcUpFormality()
    },
    'form.billCommission.upFormalityRate'(val) {
      this.calcUpFormality()
    },
    'form.downFormalityCountType'(val) {
      this.calcFormaltiy()
    },
    'form.agencySalerType'(val) {
      this.calcFormaltiy()
    },
    'form.agencySalerRate'(val) {
      this.calcFormaltiy()
    }
  },
  async created() {
    // 编辑信息
    if (this.bId || this.cId) {
      this.isLoading = true
      getFinanceEdit(this.bId, this.cId)
        .then(res => {
          this.isLoading = false
          this.agencyOrSaleStatus = true
          this.form.channelId = res.data.channelId
          this.form.companyId = Number(res.data.companyId)
          this.form.fullPremium = res.data.fullPremium
          this.form.id = res.data.id
          this.form.insuredName = res.data.insuredName
          this.form.operatorName = res.data.operatorName
          this.form.licenseNo = res.data.licenseNo
          this.form.netPremium = res.data.netPremium
          this.form.policyNo = res.data.policyNo
          this.form.riskType = res.data.riskType
          this.form.userId = res.data.userId
          this.form.userName = res.data.userName
          this.form.teamName = res.data.teamName
          this.form.startDate = formatDate(res.data.startDate)
          this.form.policyTime = formatDate(res.data.policyTime)
          this.form.billCommission.belongCompanyId =
            res.data.billCommission.belongCompanyId
          this.form.billCommission.id = res.data.billCommission.id
          if (
            res.data.billCommission.upFormalityCountType === 0 ||
            res.data.billCommission.upFormalityCountType === 1
          ) {
            this.form.billCommission.upFormality =
              res.data.billCommission.upFormality
            this.form.billCommission.upFormalityCountType =
              res.data.billCommission.upFormalityCountType
            this.form.billCommission.upFormalityRate =
              res.data.billCommission.upFormalityRate
          }
          // // 编辑，系统创建的账单，只能编辑费率
          // if (res.data && res.data.sourceType === 0) {
          //   this.editStatus = true
          //   getFinanceOneSaler([res.data.userId]).then(res => {
          //     this.salerOptions = res.data
          //   })
          // } else {
          //   getFinanceSaler(this.form.selectCompanyId).then(res => {
          //     this.salerOptions = res.data
          //   })
          // }
          // this.form.selectCompanyId = this.organOptions[0].id
          // this.form.operatorName = this.$store.getters.userAll.data.nickName
          if (
            res.data.billCommission.agencyFormalityCountType === 0 ||
            res.data.billCommission.agencyFormalityCountType === 1
          ) {
            // 机构
            this.form.downFormalityCountType =
              res.data.billCommission.agencyFormalityCountType
            this.form.agencySalerType = 0
            this.form.agencySalerRate =
              res.data.billCommission.agencyFormalityRate
            this.form.agencySalerFormality =
              res.data.billCommission.agencyFormality
          } else if (
            res.data.billCommission.saleFormalityCountType === 0 ||
            res.data.billCommission.saleFormalityCountType === 1
          ) {
            // 业务员
            this.form.downFormalityCountType =
              res.data.billCommission.saleFormalityCountType
            this.form.agencySalerType = 1
            this.form.agencySalerRate =
              res.data.billCommission.saleFormalityRate
            this.form.agencySalerFormality =
              res.data.billCommission.saleFormality
          }
        })
        .catch(err => {
          console.warn(err)
        })
    }
    this.isLoading = true
    // 获取机构
    const blcs = this.$store.getters.userAll.data.belongCompanys
    const maxItem = blcs.sort((a, b) => b.level - a.level)[0]
    this.bcID = maxItem.id
    this.numID.push(maxItem.id)
    // this.organOptions.push(maxItem)
    // this.form.operatorName = this.$store.getters.userAll.data.nickName

    const resC = await getPolicyAllCompany()
    this.companyOptions = resC.data

    // 获取工号
    // const resCom = await getFinanceComNum(this.numID)
    const resBind = await getFinanceBindNum(this.numID)
    // const resIds = await getFinanceIdsNum(this.numID)
    // const arr = [
    //   ...resCom.data.map(item => {
    //     return {
    //       id: item.id,
    //       channelName: item.channelName
    //     }
    //   }),
    //   ...resBind.data.map(item => {
    //     return {
    //       id: item.cid,
    //       channelName: item.channelName
    //     }
    //   }),
    //   ...resIds.data.map(item => {
    //     return {
    //       id: item.cid.toString(),
    //       channelName: item.insureChannelName
    //     }
    //   })
    // ]
    // var hash = {}
    // const arrNum = arr.reduce(function(item, next) {
    //   hash[next.id] ? '' : (hash[next.id] = true && item.push(next))
    //   return item
    // }, [])
    const resStr = JSON.parse(JSON.stringify(resBind.data))
    resStr.map(item => {
      item.id = item.id.toString()
    })
    this.numberOptions.data = resStr
    this.numberOptions.render = resStr
    this.isLoading = false
  },
  methods: {
    // 获取业务员
    // getSalersData(val) {
    //   getFinanceSaler(val.id).then(res => {
    //     this.salerOptions = res.data
    //   })
    // },
    calcFormaltiy() {
      const netPremium = this.form.netPremium // 净保费
      const fullPremium = this.form.fullPremium // 全保费
      const agencySalerType = this.form.agencySalerType // 费率类型
      const agencySalerRate = this.form.agencySalerRate // 佣金率
      const downFormalityCountType = this.form.downFormalityCountType // 结算方式
      if (
        typeof downFormalityCountType === 'number' &&
        typeof agencySalerType === 'number' &&
        agencySalerRate &&
        netPremium &&
        fullPremium
      ) {
        if (downFormalityCountType === 0) {
          this.form.agencySalerFormality = (
            (fullPremium * agencySalerRate) /
            100
          ).toFixed(2)
        }
        if (downFormalityCountType === 1) {
          this.form.agencySalerFormality = (
            (netPremium * agencySalerRate) /
            100
          ).toFixed(2)
        }
        if (agencySalerType === 0) {
          // 机构
          this.form.billCommission.agencyFormalityCountType = downFormalityCountType
          this.form.billCommission.agencyFormalityRate = agencySalerRate
          this.form.billCommission.agencyFormality = this.form.agencySalerFormality
        } else {
          // 业务员
          this.form.billCommission.saleFormalityCountType = downFormalityCountType
          this.form.billCommission.saleFormalityRate = agencySalerRate
          this.form.billCommission.saleFormality = this.form.agencySalerFormality
        }
      }
    },
    companyChange() {
      const companyId = this.form.companyId
      this.numberOptions.render = this.numberOptions.data.filter(
        channel => channel.companyId === companyId
      )
    },
    calcNet() {
      const fullPremium = this.form.fullPremium // 全保费
      if (fullPremium) {
        this.form.netPremium =
          (fullPremium / 1.06) % 1 === 0
            ? fullPremium / 1.06
            : (fullPremium / 1.06).toFixed(2)
      } else {
        this.form.netPremium = null
      }
    },
    calcUpFormality() {
      const netPremium = this.form.netPremium // 净保费
      const fullPremium = this.form.fullPremium // 全保费
      const upFormalityRate = this.form.billCommission.upFormalityRate // 上游手续费费率
      const upFormalityCountType = this.form.billCommission.upFormalityCountType // 上游结算方式
      if (
        netPremium &&
        fullPremium &&
        upFormalityRate &&
        typeof upFormalityCountType === 'number'
      ) {
        if (upFormalityCountType === 0) {
          this.form.billCommission.upFormality = (
            (fullPremium * upFormalityRate) /
            100
          ).toFixed(2)
        }
        if (upFormalityCountType === 1) {
          this.form.billCommission.upFormality = (
            (netPremium * upFormalityRate) /
            100
          ).toFixed(2)
        }
      }
    },
    fixedFullPremium() {
      if (this.form.fullPremium) {
        this.form.fullPremium = Number(this.form.fullPremium).toFixed(2)
      }
    },
    upFormalityRateFixed() {
      if (this.form.billCommission.upFormalityRate) {
        const data = Number(this.form.billCommission.upFormalityRate).toFixed(2)
        if (data < 0) {
          this.form.billCommission.upFormalityRate = 0.01
        } else if (data > 100) {
          this.form.billCommission.upFormalityRate = 100
        } else {
          this.form.billCommission.upFormalityRate = data
        }
      }
    },
    agencySalerRateFixed() {
      if (this.form.agencySalerRate) {
        const data = Number(this.form.agencySalerRate).toFixed(2)
        if (data < 0) {
          this.form.agencySalerRate = 0.01
        } else if (data > 100) {
          this.form.agencySalerRate = 100
        } else {
          this.form.agencySalerRate = data
        }
      }
    }
    // normalizer(node) {
    //   return {
    //     id: node.id,
    //     label: node.name
    //   }
    // }
  }
}
</script>

<style lang="scss">
.add-ledger {
  padding: 24px;
  .el-date-editor {
    width: 100%;
  }
  .up-charge-rate {
    .el-form-item__label {
      text-align: left;
      white-space: nowrap;
    }
  }
}
</style>
