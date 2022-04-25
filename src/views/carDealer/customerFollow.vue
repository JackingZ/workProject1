<template>
  <!-- eslint-disable -->
  <div v-loading="followLoading" class="follow-container">
    <el-form ref="followForm" :model="followForm" :rules="rules" label-width="120px" label-position="left" class="follow-form-box">
      <el-form-item label="跟进状态：" prop="state">
        <el-select v-model="followForm.state" clearable filterable placeholder="请选择" size="small" style="width: 220px;">
          <el-option v-for="item in followData" :key="item.key" :label="item.value" :value="item.key" />
        </el-select>
      </el-form-item>
      <div v-if="followForm.state === 6">
        <el-form-item label="保险公司：" prop="companyId">
          <el-select v-model="followForm.companyId" :loading="companyData.loading" placeholder="请选择保险公司" filterable size="small" style="width: 220px;" @focus="getInsureCompany" @change="changeCompang">
            <el-option v-for="item in companyData.data" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择工号：" prop="channelId">
          <el-select v-model="followForm.channelId" :loading="channelLoading" filterable clearable placeholder="请选择工号" size="small" style="width: 220px;">
            <el-option v-for="item in channellist" :key="item.id" :label="item.channelName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属团队：" prop="team">
          <my-tree-select :value="followForm.team" :options="treeAllList" :normalizer="normalizer" :disable-branch-nodes="true" no-options-text="数据加载中..." placeholder="选择机构" no-results-text="未找到结果" style="width: 220px;" @open="getOrgan" @input="followForm.team = $event" />
        </el-form-item>
        <el-form-item label="业务员：" prop="userId">
          <el-select v-model="followForm.userId" placeholder="请选择续保专员" size="small" filterable style="width: 220px;">
            <el-option v-for="item in salerData" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="保单种类：" prop="policyType">
          <el-select v-model="followForm.policyType" placeholder="请选择保单种类" size="small" style="width: 220px;" @change="handlePolicyType">
            <el-option v-for="item in policyTypelist" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <div v-if="followForm.policyType!==1">
          <div style="line-height: 40px;font-size: 16px;border-bottom: 1px solid #e8e8e8;margin-bottom: 20px;color: #999;">交强险：</div>
          <div class="grid-content">
            <el-form-item label="保单号：" prop="tciPolicyNo">
              <el-input v-model="followForm.tciPolicyNo" placeholder="请输入交强险保单号" style="width: 220px;" size="small" />
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item label="全保费：" prop="tciPremium">
              <el-input v-model="followForm.tciPremium" placeholder="请输入交强险全保费（元）" style="width: 220px;" size="small" />
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item label="车船税：" prop="vehicleTax">
              <el-input v-model="followForm.vehicleTax" placeholder="请输入车船税（元）" style="width: 220px;" size="small" />
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item label="保险起期：" prop="tciStartDate">
              <el-date-picker v-model="followForm.tciStartDate" type="date" placeholder="选择交强险保险起期" size="small" />
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item label="购买时间：" prop="tciPolicyTime">
              <el-date-picker v-model="followForm.tciPolicyTime" :picker-options="pickerTciPolicyTime" type="date" placeholder="选择交强险签单时间" size="small" />
            </el-form-item>
          </div>
        </div>
        <div v-if="followForm.policyType!==2">
          <div style="line-height: 40px;font-size: 16px;border-bottom: 1px solid #e8e8e8;margin-bottom: 20px;color: #999;">商业险：</div>
          <div class="grid-content">
            <el-form-item label="保单号：" prop="vciPolicyNo">
              <el-input v-model="followForm.vciPolicyNo" placeholder="请输入商业险保单号" style="width: 220px;" size="small" />
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item label="全保费：" prop="vciPremium">
              <el-input v-model="followForm.vciPremium" placeholder="请输入商业险全保费（元）" style="width: 220px;" size="small" />
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item label="保险起期：" prop="vciStartDate">
              <el-date-picker v-model="followForm.vciStartDate" type="date" placeholder="选择商业险保险起期" size="small" />
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item label="购买时间：" prop="vciPolicyTime">
              <el-date-picker v-model="followForm.vciPolicyTime" :picker-options="pickerVciPolicyTime" type="date" placeholder="选择商业险签单时间" size="small" />
            </el-form-item>
          </div>
        </div>
      </div>
      <div v-else-if="followForm.state === 8">
        <el-form-item label="战败原因：" prop="failReasonState">
          <el-select v-model="followForm.failReasonState" placeholder="请选择战败原因" size="small" filterable style="width: 220px;">
            <el-option v-for="item in failReason" :key="item.id" :label="item.value" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="补充说明：">
          <el-input v-model="followForm.mark" type="textarea" />
        </el-form-item>
      </div>
      <div v-else>
        <el-form-item v-if="followForm.state !== 5" label="下次跟进时间：" prop="planReturnTime">
          <div style="width: 360px;margin-bottom: 10px;">
            <el-button v-for="(item,index) in timeDay" :key="index" :type=" itemIndex === index? 'primary' : '' " size="small" @click="timeClick(item.key, index)">{{ item.value }}</el-button>
          </div>
          <el-date-picker v-model="followForm.planReturnTime" :clearable="false" :picker-options="pickerPlanReturnTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择下次更进时间" size="small" @change=" itemIndex = null " />
        </el-form-item>
        <el-form-item label="本次跟进内容：">
          <el-input v-model="followForm.mark" type="textarea" />
        </el-form-item>
      </div>
      <el-form-item class="follow-btn">
        <el-button type="primary" style="padding: 9px 30px;" size="small" @click="screen">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getChannelListData,
  // getquerySalesByCompanyId,
  YZpolicyExist
} from '@/api/mytask'
import { getCompanyEffective } from '@/api/ledger'
import { getInsuredCompany } from '@/api/customer'
import MyTreeSelect from '@/components/MyTreeSelect/index'
export default {
  components: {
    MyTreeSelect
  },
  props: {
    followForm: {
      type: Object,
      default: null
    },
    followData: {
      type: Array,
      default() {
        return []
      }
    },
    salerData: {
      type: Array,
      default() {
        return []
      }
    },
    followLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      itemIndex: null,
      channelLoading: false,
      userLoading: false,
      channellist: [],
      treeAllList: [],
      // salesByCompanylist: [],
      companyData: {
        loading: false,
        data: []
      },
      // followData: [
      //   { key: 0, value: '忙碌中待联系' },
      //   { key: 1, value: '考虑中(普通)' },
      //   { key: 2, value: '考虑中(重点)' },
      //   { key: 3, value: '其他' },
      //   { key: 4, value: '预约到店' },
      //   { key: 5, value: '无效数据' },
      //   { key: 6, value: '成功出单' },
      //   { key: 8, value: '战败' }
      // ],
      timeDay: [
        { key: 1, value: '明天' },
        { key: 2, value: '后天' },
        { key: 3, value: '三天后' },
        { key: 7, value: '一周后' },
        { key: 14, value: '两周后' }
      ],
      failReason: [
        { key: 1, value: '无效数据（停机、空号、电话错误）' },
        { key: 2, value: '已在别处投保' },
        { key: 3, value: '礼品不喜欢' },
        { key: 4, value: '保险公司不合适' },
        { key: 5, value: '熟人代办' },
        { key: 6, value: '价格太贵' },
        { key: 7, value: '车行服务问题' },
        { key: 8, value: '外地投保' },
        // { key: 9, value: '系统战败' },
        { key: 0, value: '其他' }
      ],
      pickerPlanReturnTime: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      pickerTciPolicyTime: {
        disabledDate: time => {
          if (this.followForm.tciStartDate) {
            return time.getTime() > this.followForm.tciStartDate
          }
        }
      },
      pickerVciPolicyTime: {
        disabledDate: time => {
          if (this.followForm.vciStartDate) {
            return time.getTime() > this.followForm.vciStartDate
          }
        }
      },
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
      rules: {
        state: [
          {
            required: true,
            message: '请选择跟进状态',
            trigger: 'change'
          }
        ],
        failReasonState: [
          {
            required: true,
            message: '请选择战败原因',
            trigger: 'change'
          }
        ],
        planReturnTime: [
          {
            required: true,
            message: '请选择下次跟进时间',
            trigger: 'change'
          }
        ],
        companyId: [
          {
            required: true,
            message: '请选择保险公司',
            trigger: 'change'
          }
        ],
        // channelId: [
        //   {
        //     required: true,
        //     message: '请选择工号',
        //     trigger: 'change'
        //   }
        // ],
        team: [
          {
            required: true,
            message: '请选择所属团队',
            trigger: 'change'
          }
        ],
        userId: [
          {
            required: true,
            message: '请选择续保专员',
            trigger: 'change'
          }
        ],
        policyType: [
          {
            required: true,
            message: '请选择保单种类',
            trigger: 'change'
          }
        ],
        tciPolicyNo: [
          {
            required: true,
            validator: this.validateTciPolicyNo,
            trigger: 'blur'
          }
        ],
        tciPremium: [
          {
            required: true,
            validator: this.validateTciPremium,
            trigger: 'blur'
          }
        ],
        vehicleTax: [
          {
            required: true,
            validator: this.validateVehicleTax,
            trigger: 'blur'
          }
        ],
        tciStartDate: [
          {
            required: true,
            message: '请选择交强险保险起期',
            trigger: 'change'
          }
        ],
        tciPolicyTime: [
          {
            required: true,
            message: '请选择交强险签单时间',
            trigger: 'change'
          }
        ],
        vciPolicyNo: [
          {
            required: true,
            validator: this.validateVciPolicyNo,
            trigger: 'blur'
          }
        ],
        vciPremium: [
          {
            required: true,
            validator: this.validateVciPremium,
            trigger: 'blur'
          }
        ],
        vciStartDate: [
          {
            required: true,
            message: '请选择商业险保险起期',
            trigger: 'change'
          }
        ],
        vciPolicyTime: [
          {
            required: true,
            message: '请选择商业险签单时间',
            trigger: 'change'
          }
        ]
      }
    }
  },
  watch: {
    'followForm.team'(val) {
      this.$refs.followForm.validateField('team')
    }
  },
  methods: {
    // 切换保单种类
    handlePolicyType(value) {
      if (value === 1) {
        this.followForm.tciPolicyNo = ''
        this.followForm.tciPolicyTime = ''
        this.followForm.tciPremium = ''
        this.followForm.tciStartDate = ''
        this.followForm.vehicleTax = ''
      } else if (value === 2) {
        this.followForm.vciPolicyNo = ''
        this.followForm.vciPremium = ''
        this.followForm.vciPolicyTime = ''
        this.followForm.vciStartDate = ''
      }
    },
    getInsureCompany() {
      this.companyData.loading = true
      getInsuredCompany().then(res => {
        this.companyData.data = res.data
        this.companyData.loading = false
      }).catch(err => {
        this.companyData.loading = false
        console.warn(err)
      })
    },
    // 获取工号
    changeCompang(data) {
      this.channelLoading = true
      this.followForm.channelId = null
      const blcs = this.$store.getters.userAll.data.belongCompanys
      const maxItem = blcs.sort((a, b) => b.level - a.level)[0]
      getChannelListData({ belongCompanys: [maxItem.id] }, data).then(res => {
        this.channellist = res.data
        this.channelLoading = false
      }).catch(err => {
        this.channelLoading = false
        console.warn(err)
      })
    },
    // 获取团队
    getOrgan() {
      getCompanyEffective()
        .then(res => {
          this.treeAllList = res.data
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // // 获取续保专员
    // setOrgan(val) {
    //   this.userLoading = true
    //   this.followForm.userId = null
    //   getquerySalesByCompanyId(val.key)
    //     .then(res => {
    //       this.salesByCompanylist = res.data
    //       this.userLoading = false
    //     })
    //     .catch(err => {
    //       console.warn(err)
    //       this.userLoading = false
    //     })
    // },
    // 提交
    screen() {
      this.$emit('screen')
    },
    // 跟进时间
    timeClick(key, index) {
      this.itemIndex = index
      this.followForm.planReturnTime = this.getDate(key)
    },
    getDate(AddDay) {
      const t = new Date()
      t.setDate(t.getDate() + AddDay) // 获取AddDay天后的日期
      var y = t.getFullYear()
      var m = t.getMonth() + 1
      var d = t.getDate()
      return y + '-' + m + '-' + d
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
    validateTciPolicyNo(rule, value, callback) {
      const reg = /^[A-Z0-9]+$/
      if (!value) {
        callback(new Error('请输入交强险保单号'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的交强险保单号'))
      } else {
        YZpolicyExist({ policyNo: value }).then(res => {
          if (res.data === true) {
            callback('交强险保单号已存在')
          } else {
            callback()
          }
        })
      }
    },
    validateVciPolicyNo(rule, value, callback) {
      const reg = /^[A-Z0-9]+$/
      if (!value) {
        callback(new Error('请输入商业险保单号'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的商业险保单号'))
      } else {
        YZpolicyExist({ policyNo: value }).then(res => {
          if (res.data === true) {
            callback('商业险保单号已存在')
          } else {
            callback()
          }
        })
      }
    },
    validateVehicleTax(rule, value, callback) {
      const reg = /^\d+(?=\.{0,1}\d+$|$)/
      if (!value) {
        callback(new Error('请输入车船税（元）'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的车船税数值'))
      } else {
        callback()
      }
    },
    validateTciPremium(rule, value, callback) {
      const reg = /^\d+(?=\.{0,1}\d+$|$)/
      if (!value) {
        callback(new Error('请输入交强险全保费（元）'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的交强险数值'))
      } else {
        callback()
      }
    },
    validateVciPremium(rule, value, callback) {
      const reg = /^\d+(?=\.{0,1}\d+$|$)/
      if (!value) {
        callback(new Error('请输入商业险全保费（元）'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的商业险数值'))
      } else {
        callback()
      }
    }
  }
}
</script>

<style lang="scss">
.follow-container {
  padding: 20px;
  .follow-form-box {
    .el-textarea__inner {
      height: 100px;
      width: 300px;
    }
    .follow-btn {
      .el-form-item__content {
        margin-left: 0px !important;
        text-align: center;
      }
    }
  }
}
</style>
