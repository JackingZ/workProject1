<template>
  <!--手动录单 start -->
  <div v-loading="btnLoginShow" class="policyFormAll" style="padding-bottom:20px;width:100%;margin:auto">
    <el-form ref="policyForm" :model="policyForm" :rules="policyRrules" label-width="100px" class="demo-ruleForm">
      <div class="dialog-list">
        <div class="grid-content">
          <el-form-item prop="companyId" label="保险公司">
            <el-select v-model="policyForm.companyId" placeholder="请选择保险公司" filterable size="small" @change="changeCompang">
              <el-option v-for="item in companylist" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </div>
        <div class="grid-content">
          <el-form-item label="选择工号">
            <el-select v-model="policyForm.channelId" filterable clearable placeholder="请选择工号" size="small" @click.native="headlechannelId">
              <el-option v-for="item in channellist" :key="item.id" :label="item.channelName" :value="item.id" />
            </el-select>
          </el-form-item>
        </div>
        <div class="grid-content">
          <el-form-item v-if="treeShow" ref="myTree" prop="team" label="所属团队">
            <my-tree-select v-model="policyForm.team" :options="treeAllList" :normalizer="normalizer" :disable-branch-nodes="true" class="ledger-select_organ" no-options-text="数据加载中..." placeholder="选择机构" no-results-text="未找到结果" @open="getOrgan" />
          </el-form-item>
        </div>
        <div class="grid-content">
          <el-form-item label="业务员" prop="userId">
            <el-select v-model="policyForm.userId" placeholder="请选择业务员" size="small" filterable>
              <el-option v-for="item in SalesByCompanylist" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </div>
        <div class="grid-content">
          <el-form-item prop="policyType" label="保单种类">
            <el-select v-model="policyForm.policyType" placeholder="保单种类不能为空" size="small" @change="handlePolicyType">
              <el-option v-for="item in policyTypelist" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </div>
        <div v-if="policyForm.policyType!==1">
          <h2>交强险：</h2>
          <div class="grid-content">
            <el-form-item prop="tciPolicyNo" label="保单号">
              <el-input v-model="policyForm.tciPolicyNo" placeholder="请输入交强险保单号" size="small" @change="handeletciPolicyNo" />
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item prop="tciPremium" label="全保费">
              <el-input v-model="policyForm.tciPremium" placeholder="请输入交强险全保费（元）" maxlength="5" size="small" @change="handletciPremium" />
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item prop="vehicleTax" label="车船税">
              <el-input v-model="policyForm.vehicleTax" placeholder="请输入车船税（元）" maxlength="5" size="small" @change="handlevehicleTax" />
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item prop="tciStartDate" label="保险起期">
              <el-date-picker v-model="policyForm.tciStartDate" type="date" placeholder="选择交强险保险起期" value-format="yyyy-MM-dd" size="small" />
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item prop="tciPolicyTime" label="购买时间">
              <el-date-picker v-model="policyForm.tciPolicyTime" :picker-options="picOpttciPolicyTime" type="date" placeholder="选择交强险签单时间" value-format="yyyy-MM-dd" size="small" />
            </el-form-item>
          </div>
        </div>
        <div v-if="policyForm.policyType!==2">
          <h2>商业险：</h2>
          <div class="grid-content">
            <el-form-item prop="vciPolicyNo" label="保单号">
              <el-input v-model="policyForm.vciPolicyNo" placeholder="请输入商业险保单号" size="small" @change="handelevciPolicyNo" />
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item prop="vciPremium" label="全保费">
              <el-input v-model="policyForm.vciPremium" placeholder="请输入商业险全保费（元）" maxlength="5" size="small" @change="handlevciPremium" />
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item prop="vciStartDate" label="保险起期">
              <el-date-picker v-model="policyForm.vciStartDate" type="date" placeholder="选择商业险保险起期" value-format="yyyy-MM-dd" size="small" />
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item prop="vciPolicyTime" label="购买时间">
              <el-date-picker v-model="policyForm.vciPolicyTime" :picker-options="picOptvciPolicyTime" type="date" placeholder="选择商业险签单时间" value-format="yyyy-MM-dd" size="small" />
            </el-form-item>
          </div>
        </div>
        <!--
        <div v-if="false" style="clear:both; padding-top:10px;overflow:hidden;background:#f2f2f2;margin-bottom:10px;border-radius:8px;">
          <div class="grid-content">
            <el-form-item prop="receiveName" label="收件人">
              <el-input v-model="policyForm.receiveName" placeholder="请输入收件人姓名" size="small" />
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item prop="receivePhone" label="收件人电话">
              <el-input v-model.number="policyForm.receivePhone" placeholder="请输入收件人联系电话" size="small" @change="handlereceivePhone" />
            </el-form-item>
          </div>
          <div class="grid-content w-email-input">
            <el-form-item prop="receiveAddress" label="邮寄地址">
              <el-input v-model="policyForm.receiveAddress" placeholder="请输入保单邮寄地址" size="small" />
            </el-form-item>
          </div>
          <div class="grid-content w-common-input">
            <el-form-item prop="common" label="备注信息">
              <el-input v-model="policyForm.common" placeholder="请输入备注信息" size="small" />
            </el-form-item>
          </div>
        </div>
        -->
      </div>
      <div class="form-btn">
        <el-form-item>
          <el-button size="small" type="primary" @click="submitForm">提交保单</el-button>
          <el-button size="small" icon="el-icon-delete" @click="resetForm('policyForm')">清空信息</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import { policyForm, policyRrules } from '@/utils/policydata'
import {
  getInsuredCompany,
  getChannelListData,
  // getquerySalesByCompanyId,
  YZpolicyExist,
  getBdinput
} from '@/api/mytask'
import { getCompanyEffective } from '@/api/ledger'
import { getCustomerEnterState } from '@/api/customer'
import MyTreeSelect from '@/components/MyTreeSelect/index'
import dayjs from 'dayjs'
export default {
  name: 'Edit',
  components: {
    MyTreeSelect
  },
  props: {
    // 这个是父组件点击列表的的那一条数据信息
    rowAddEditList: {
      type: Object,
      default: null
    },
    // 这个是父组件接口获取的保险基本信息
    getAddEditFor: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      policyForm: policyForm(),
      policyRrules,
      picOpttciPolicyTime: {
        disabledDate: time => {
          const beginDateValtci = policyForm.tciStartDate
          if (beginDateValtci) {
            return time.getTime() > beginDateValtci
          }
        }
      },
      picOptvciPolicyTime: {
        disabledDate: time => {
          const beginDateValvci = policyForm.vciStartDate
          if (beginDateValvci) {
            return time.getTime() > beginDateValvci
          }
        }
      },
      pickerOptionsOLD: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      companylist: [],
      channellist: [],
      treeAllList: [],
      SalesByCompanylist: [],
      // 保单种类循环
      policyTypelist: [
        {
          label: '商业险',
          value: 1
        },
        {
          label: '交强险',
          value: 2
        },
        {
          label: '交商共保',
          value: 3
        }
      ],
      isHideBox: false,
      btnLoginShow: false,
      treeShow: true
    }
  },
  watch: {
    'policyForm.team'(val) {
      this.$refs.policyForm.validateField('team')
    }
  },
  async created() {
    // 保险公司列表
    const resData = await getInsuredCompany()
    this.companylist = resData.data
    this.SalesByCompanylist = [
      {
        name: this.rowAddEditList.salesmanName,
        id: this.rowAddEditList.salesmanId
      }
    ]
    // 回填保单信息
    this.policyForm.tciPolicyTime = dayjs().format('YYYY-MM-DD')
    this.policyForm.vciPolicyTime = dayjs().format('YYYY-MM-DD')
    this.policyForm.tciStartDate = this.rowAddEditList.forceEndDate
      ? dayjs(this.rowAddEditList.forceEndDate)
        .add(1, 'day')
        .format('YYYY-MM-DD')
      : null
    this.policyForm.vciStartDate = this.rowAddEditList.comEndDate
      ? dayjs(this.rowAddEditList.comEndDate)
        .add(1, 'day')
        .format('YYYY-MM-DD')
      : null
  },
  methods: {
    // 根据保单号验证保单是否存在
    handeletciPolicyNo(data) {
      const Paramsdata = data
      YZpolicyExist(Paramsdata).then(res => {
        if (res.data === true) {
          this.$alert('<strong>该条保单已存在请不要重复提交</strong>', '警告', {
            dangerouslyUseHTMLString: true
          })
        }
      })
      const reg = /^[^\u4e00-\u9fa5]*$/
      if (data && new RegExp(reg).test(data)) {
        this.errorTip = false
      } else {
        this.$message({
          message: '不能输入中文！',
          type: 'warning'
        })
        this.policyForm.tciPolicyNo = ''
      }
    },
    // 交强险车船税保留两位数
    handlevehicleTax(value) {
      const reg = /^\d+(?=\.{0,1}\d+$|$)/
      if (value && new RegExp(reg).test(value)) {
        this.errorTip = false
        this.policyForm.vehicleTax = parseFloat(
          this.policyForm.vehicleTax
        ).toFixed(2)
      } else {
        this.$message({
          message: '请输入正确的数值（大于0的正数）。',
          type: 'warning'
        })
        this.policyForm.vehicleTax = ''
      }
    },
    // 交强险全保费保留两位数
    handletciPremium(value) {
      const reg = /^\d+(?=\.{0,1}\d+$|$)/
      if (value && new RegExp(reg).test(value)) {
        this.policyForm.tciPremium = parseFloat(
          this.policyForm.tciPremium
        ).toFixed(2)
      } else {
        this.$message({
          message: '请输入正确的数值（大于0的正数）。',
          type: 'warning'
        })
        this.policyForm.tciPremium = ''
      }
    },
    handelevciPolicyNo(data) {
      const Paramsdata = data
      YZpolicyExist(Paramsdata).then(data => {
        if (data.data === true) {
          this.$alert('<strong>该条保单已存在请不要重复提交</strong>', '警告', {
            dangerouslyUseHTMLString: true
          })
        }
      })
      const reg = /^[^\u4e00-\u9fa5]*$/
      if (data && new RegExp(reg).test(data)) {
        this.errorTip = false
      } else {
        this.$message({
          message: '不能输入中文！',
          type: 'warning'
        })
        this.policyForm.vciPolicyNo = ''
      }
    },
    // 商业险全保费保留两位小数
    handlevciPremium(value) {
      const reg = /^\d+(?=\.{0,1}\d+$|$)/
      if (value && new RegExp(reg).test(value)) {
        this.errorTip = false
        this.policyForm.vciPremium = parseFloat(
          this.policyForm.vciPremium
        ).toFixed(2)
      } else {
        this.$message({
          message: '请输入正确的数值（大于0的正数）。',
          type: 'warning'
        })
        this.policyForm.vciPremium = ''
      }
    },
    // 收件人电话
    handlereceivePhone(value) {
      const reg = /^[\d-]+$/
      if (value && new RegExp(reg).test(value)) {
        this.errorTip = false
      } else {
        this.$message({
          message: '请输入正确电话号码数字！',
          type: 'warning'
        })
        this.policyForm.receivePhone = ''
      }
    },
    // 切换保单种类清空其他的保险选项
    handlePolicyType(value) {
      // 1交强，2商业，3，交商共保
      if (value === 1) {
        this.policyForm.tciPolicyNo = '' // 交强保单号 string
        this.policyForm.tciPolicyTime = '' // 交强险签单时间 string
        this.policyForm.tciPremium = '' // 交强险全保费 number
        this.policyForm.tciStartDate = '' // 交强险保险起期 ,string
        this.policyForm.vehicleTax = '' // 车船税number
      } else if (value === 2) {
        this.policyForm.vciPolicyNo = ''
        this.policyForm.vciPremium = ''
        this.policyForm.vciPolicyTime = ''
        this.policyForm.vciStartDate = ''
      }
    },
    // 选择工号如果没有选择保险公司提示选择保险公司
    headlechannelId() {
      if (this.policyForm.companyId === '') {
        this.$message.error('请先选择保险公司！')
      }
    },
    // 根据保险公司ID获取工号列表
    changeCompang(data) {
      const blcs = this.$store.getters.userAll.data.belongCompanys
      const maxItem = blcs.sort((a, b) => b.level - a.level)[0]
      getChannelListData({ belongCompanys: [maxItem.id] }, data).then(res => {
        this.channellist = res.data
      })
    },
    // 团队获取
    getOrgan() {
      getCompanyEffective()
        .then(res => {
          this.treeAllList = res.data
        })
        .catch(err => {
          console.warn(err)
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
    // 获取团队id  给业务员
    // headleTeamClick(value) {
    //   if (!value) {
    //     return
    //   }
    //   getquerySalesByCompanyId(value)
    //     .then(res => {
    //       this.SalesByCompanylist = res.data
    //     })
    //     .catch(err => {
    //       console.warn(err)
    //     })
    // },
    resetForm() {
      // 初始化表单选项
      this.$refs.policyForm.resetFields()
      this.treeShow = false
      setTimeout(() => {
        this.treeShow = true
      }, 100)
    },
    // 提交保单
    submitForm() {
      this.btnLoginShow = true
      this.uuidNum = this.setuuid()
      this.policyForm.tciEndDate = this.policyForm.tciStartDate
        ? dayjs(this.policyForm.tciStartDate)
          .add(1, 'year')
          .subtract(1, 'day')
          .format('YYYY-MM-DD')
        : null
      this.policyForm.vciEndDate = this.policyForm.vciStartDate
        ? dayjs(this.policyForm.vciStartDate)
          .add(1, 'year')
          .subtract(1, 'day')
          .format('YYYY-MM-DD')
        : null
      const policydata = {
        sourceCode: this.$store.getters.userAll.data.channelCode,
        operatorId: this.$store.getters.userAll.data.id,
        companyId: this.policyForm.companyId, // 保险公司Id string
        channelId: this.policyForm.channelId ? this.policyForm.channelId : 999999, // 工号 integer
        policyType: this.policyForm.policyType, // 保单种类
        businessType: '2', // 业务类型 string 1新保，2续保， 3交商转保共保， 4旧车首保
        receiveAddress: this.policyForm.receiveAddress, // 保单邮寄地址string
        receiveName: this.policyForm.receiveName, // 收件人 string
        receivePhone: this.policyForm.receivePhone, // 收件人联系电话 string
        tciEndDate: this.policyForm.tciEndDate, // 交强险保险止期
        tciPolicyNo: this.policyForm.tciPolicyNo, // 交强保单号 string
        tciPolicyTime: this.policyForm.tciPolicyTime, // 交强险签单时间 string
        tciPremium: this.policyForm.tciPremium, // 交强险全保费 number
        tciStartDate: this.policyForm.tciStartDate, // 交强险保险起期 ,string
        team: this.policyForm.team, // 所属团队,string
        userId: this.policyForm.userId, // 业务员,string
        vciEndDate: this.policyForm.vciEndDate, // 商业险保险止期
        vciPolicyNo: this.policyForm.vciPolicyNo, // 商业保单号 string
        vciPolicyTime: this.policyForm.vciPolicyTime, // 商业险签单时间string
        vciPremium: this.policyForm.vciPremium, // 商业险全保费number
        vciStartDate: this.policyForm.vciStartDate, // 商业险保险起期 string
        vehicleTax: this.policyForm.vehicleTax, // 车船税number
        isOffline: 5,
        common: this.policyForm.common, // 备注信息
        orderId: this.uuidNum // 标识符
      }
      const vehicledata = {
        isNew: 0, // 是否为新车
        licenseNo: this.getAddEditFor.licenseNo || '新车', // 车牌号
        brandName: this.getAddEditFor.brandName, // 厂牌型号
        frameNo: this.getAddEditFor.frameNo || '0', // 车架号
        engineNo: this.getAddEditFor.engineNo || '0', // 发动机号
        vehicleCategory: this.getAddEditFor.vehicleCategory || '101', // 车辆类型
        vehicleType: this.getAddEditFor.vehicleType || 'K33', // 交管车辆类型
        // plateType: '', // 号牌种类
        // plateColor: '', // 号牌底色
        useNature: this.getAddEditFor.useNature || '100', // 使用性质
        attachNature: this.getAddEditFor.attachNature, // 使用性质细分
        // energyType: '', // 能源类型
        // modelCode: this.modelCode, // 车型编码
        seatCount: 5, // 核定座位数
        tonnage: '', // 核载质量
        curbWeight: '', // 整备质量
        displacement: '', // 排量/功率
        purchasePrice: this.getAddEditFor.purchasePrice || '0', // 新车价格
        enrollDate: this.getAddEditFor.enrollDate || new Date().getTime(), // 初登日期
        transfer: '', // 是否过户
        transferDate: '' // 过户日期
      }
      const applicantdata = {
        ownerName: this.getAddEditFor.ownerName || '张三', // 车主
        ownerOptions: [null, this.getAddEditFor.ownerIdType] || ['100', '101'], // 所属性质
        ownerIdType: this.getAddEditFor.ownerIdType || '101', // 车主证件类型
        ownerIdNo: this.getAddEditFor.ownerIdNo || '0', // 车主证件号码
        ownerPhone: this.getAddEditFor.holderPhone || '0', // 车主联系电话
        ownerAddr: '', // 车主联系地址
        ownerSex: null, // 车主性别
        ownerBirthday: '', // 出生日期
        ownerAge: '', // 车主年龄
        linkmanName: '', // 双录执行人姓名
        linkmanIdNo: '', // 双录执行人身份证号
        salesmanName: '', // 销售人员姓名
        salesmanIdNo: '', // 销售人员身份证
        insuredName: this.getAddEditFor.insuredName || '张三', // 被保人名称
        insuredOptions: [null, this.getAddEditFor.insuredIdType] || [
          '100',
          '101'
        ], // 被保人所属性质
        insuredIdType: this.getAddEditFor.insuredIdType || '101', // 被保人证件类型
        insuredIdNo: this.getAddEditFor.insuredIdNo || '0', // 被保人证件号码
        insuredBirthday: '', // 被保人出生日期
        insuredAddr: '', // 被保人联系地址
        insuredPhone: this.getAddEditFor.insuredPhone || '0', // 被保人联系电话
        insuredSex: null, // 被保人性别
        insuredAge: '', // 被保人年龄
        holderName: this.getAddEditFor.holderName || '张三', // 投保人名称
        holderOptions: [null, this.getAddEditFor.holderIdType] || [
          '100',
          '101'
        ], // 投保人所属性质
        holderIdType: this.getAddEditFor.holderIdType || '101', // 投保人证件类型
        holderIdNo: this.getAddEditFor.holderIdNo || '0', // 投保人证件号码
        holderBirthday: '', // 投保人出生日期
        holderAddr: '', // 投保人联系地址
        holderPhone: this.getAddEditFor.holderPhone || '0', // 投保人联系电话
        holderSex: null, // 投保人性别
        holderAge: '' // 投保人年龄
      }
      const risksdata = []
      const person = {}
      person.policy = policydata
      person.vehicle = vehicledata
      person.applicant = applicantdata
      person.risks = risksdata
      this.$refs.policyForm.validate(valid => {
        if (valid) {
          getBdinput(person)
            .then(res => {
              this.$message({
                message: '恭喜你，保单录入成功！',
                type: 'success'
              })
              // 写进记录
              getCustomerEnterState({
                icarPoliyId: this.uuidNum,
                id: this.rowAddEditList.id,
                uuid: this.rowAddEditList.uuid,
                applyId: this.rowAddEditList.rId,
                tciEndDate: this.policyForm.tciEndDate,
                vciEndDate: this.policyForm.vciEndDate,
                companyId: this.policyForm.companyId,
                state: 6
              }).then(res => {
                this.$emit('getBdOk', true)
              })
              this.btnLoginShow = false
            })
            .catch(err => {
              this.btnLoginShow = false
              console.warn(err)
            })
        } else {
          alert('提交失败，信息不完整!')
          this.btnLoginShow = false
          return false
        }
      })
    },
    // 自动生成32位唯一标识符
    setuuid() {
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
        ''
      )
      const uuid = []
      for (var i = 0; i < 32; i++) {
        uuid[i] = chars[0 | (Math.random() * 16)]
      }
      return uuid.join('')
    }
  }
}
</script>
<style lang="scss">
.policyFormAll {
  .el-select {
    width: 100%;
  }
  .el-date-editor {
    width: 100%;
  }
}
</style>
<style lang="scss" scoped>
.policyFormAll {
  padding: 10px;
  .dialog-list {
    overflow: hidden;
    .grid-content {
      width: 360px;
      float: left;
      align-items: center;
      .grid-content-name {
        white-space: nowrap;
        padding: 0 8px;
      }
    }
    h2 {
      font-size: 14px;
      color: #409eff;
      clear: both;
      padding: 0 10px 0 20px;
      margin-block-start: 0.35em;
      margin-block-end: 0.35em;
    }
  }
  .form-btn {
    text-align: center;
    padding: 30px 0;
  }
}
</style>
