<template>
  <!-- eslint-disable -->
  <div class="add-organ-manager">
    <div class="add-organ-form">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" label-position="left">
        <div class="add-organ-title">基础信息</div>
        <el-form-item v-if="isAnyAdminChannel" label="所属渠道：">
          <el-input v-model="currChannelName" size="small" :disabled="true"/>
        </el-form-item>
        <el-form-item label="机构名称：" prop="name">
          <el-input v-model="ruleForm.name" size="small" />
        </el-form-item>
        <el-form-item label="所在地区：" prop="area">
          <el-cascader :options="orgAreaInfo" v-model="ruleForm.area" size="small"/>
        </el-form-item>
        <el-form-item label="保单获取方式：" prop="disturType">
          <el-select v-model="ruleForm.disturType" filterable multiple collapse-tags placeholder="请选择保单获取方式" size="small">
            <el-option
            v-for="item in disturConfig" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="isEdit"
          label=" " prop="syncChildrenDisturType" class="delete-top">
          <el-checkbox v-model="ruleForm.syncChildrenDisturType">同步更新至所有下级子机构</el-checkbox>
        </el-form-item>
        <el-form-item label="报价佣金显示：" prop="enableCommission">
          <el-select v-model="ruleForm.enableCommission" filterable placeholder="请选择前端佣金可见方式" size="small">
            <el-option label="不显示" :value="0" />
            <el-option label="显示佣金额" :value="1" />
            <el-option label="显示百分比" :value="2" />
            <el-option label="显示佣金额与百分比" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="isEdit"
          label=" " prop="syncChildrenCommission" class="delete-top">
          <el-checkbox v-model="ruleForm.syncChildrenCommission">同步更新至所有下级子机构</el-checkbox>
        </el-form-item>
        <el-form-item v-if="!isEdit"
          label="启用状态" prop="enableStatus">
          <el-radio-group v-model="ruleForm.enableStatus">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="机构代码：" prop="companyCode">
          <el-input v-model="ruleForm.companyCode" size="small"/>
        </el-form-item>
        <el-form-item label="机构联系人：" prop="contact">
          <el-input v-model="ruleForm.contact" size="small" />
        </el-form-item>
        <el-form-item label="机构地址：" prop="addr">
          <el-input v-model="ruleForm.addr" size="small" />
        </el-form-item>
        <el-form-item label="机构电话：" prop="tel">
          <el-input v-model="ruleForm.tel" size="small" />
        </el-form-item>

        <div class="add-organ-title" v-if="isShenzhen">
          <div style="width: 120px;">深保通信息</div>
          <div>可选择复用直属上级机构的深保通信息</div>
        </div>
        <template v-if="isShenzhen">
          <el-form-item label="深保通信息：">
            <el-select v-model="ruleForm.sbtType" filterable placeholder="请选择深保通信息类型" size="small">
              <el-option label="暂不填写" :value="0" />
              <el-option label="自定义填写" :value="2" />
              <el-option label="复用上级" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="showSbtInfo" label="深保通账号：" prop="sbtAccount">
            <el-input v-model="ruleForm.sbtAccount" size="small" placeholder="请输入深保通账号" :disabled="useSbtParent"/>
          </el-form-item>
          <el-form-item v-if="showSbtInfo" label="深保通密码：" prop="sbtPassword">
            <el-input v-model="ruleForm.sbtPassword" size="small" placeholder="请输入深保通密码" :disabled="useSbtParent"/>
          </el-form-item>
          <el-form-item v-if="showSbtInfo" label="深保通姓名：" prop="sbtName">
            <el-input v-model="ruleForm.sbtName" size="small" placeholder="请输入深保通姓名" :disabled="useSbtParent"/>
          </el-form-item>
        </template>

        <div class="add-organ-title">摄像头信息</div>
        <el-form-item v-if="isAnyAdminChannel"
          label="公众号应用ID：" prop="weixinAppId">
          <el-input v-model="ruleForm.weixinAppId" size="small"/>
        </el-form-item>
        <el-form-item v-if="isAnyAdminChannel"
          label="公众号应用密钥：" prop="weixinAppSecret">
          <el-input v-model="ruleForm.weixinAppSecret" size="small"/>
        </el-form-item>
        <el-form-item label="是否安装摄像头：" prop="cameraStatus">
          <el-radio-group v-model="ruleForm.cameraStatus">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="showCamera">
          <el-form-item v-if="isEdit" label="进店关联提醒：" prop="notifyUsers">
            <el-select v-model="ruleForm.notifyUsers" multiple filterable collapse-tags placeholder="请选择" size="small">
              <el-option v-for="item in notifyData" :key="item.id" :label="item.idName" :value="item.id" />
            </el-select>
          </el-form-item>
          <template v-if="isAnyAdminChannel">
            <el-form-item
              v-for="(item, index) in ruleForm.cameraInfos"
              :key="index"
              class="special-item"
              :rules="cameraRules"
              label="摄像头信息："
              :prop="'cameraInfos[' + index + '].value'">
              <el-input v-model="item.value" size="small" placeholder="请按“代码-位置”格式填写"/>
              <img v-if="index === 0" src="@/assets/imgs/add.png" @click="addCameraItem()"/>
              <img v-else src="@/assets/imgs/remove.png" @click="removeCameraItem(index)"/>
            </el-form-item>
          </template>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { checkOrg, querySbtById } from '@/api/organization'
const cameraRules = {
  required: true,
  message: '请按“代码-位置”格式填写',
  trigger: 'change',
  pattern: /^\S{1,}-\S{1,}$/
}
export default {
  props: {
    parentId: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    disturConfig: {
      type: Array,
      default: () => []
    },
    orgAreaInfo: {
      type: Array,
      default: () => []
    },
    notifyData: {
      type: Array,
      default: () => []
    },
    channelCode: {
      type: String,
      default: ''
    },
    isShowModal: {
      type: Boolean,
      default: false
    },
    // 是否车商渠道
    isCarDealerChannel: {
      type: Boolean,
      default: false
    },
    // 是否运维管理员
    isAnyAdminChannel: {
      type: Boolean,
      default: false
    },
    currChannelName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      cameraRules,
      isOldCodeExist: false,
      originalCompanyCode: '',
      isShenzhen: false,
      // area: ['110000', '110106'],
      ruleForm: {
        channelName: '',
        name: '',
        area: [],
        enableStatus: 0,
        companyCode: '',
        disturType: [],
        contact: '',
        addr: '',
        tel: '',
        cameraInfo0: '',
        cameraInfos: [
          {
            value: ''
          }
        ],
        enableCommission: 0,
        syncChildrenDisturType: false,
        syncChildrenCommission: false,
        weixinAppId: '',
        weixinAppSecret: '',
        sbtAccount: '',
        sbtPassword: '',
        sbtName: '',
        sbtType: 0,
        notifyUsers: [],
        cameraStatus: 0
      },
      rules: {
        notifyUsers: [
          {
            required: true,
            message: '请选择进店关联提醒',
            trigger: 'blur'
          }
        ],
        channelName: [
          {
            required: true,
            message: '',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入机构名称',
            trigger: 'change'
          },
          {
            min: 2,
            message: '机构名称长度至少2个字符',
            trigger: 'change'
          }
        ],
        area: [
          {
            required: true,
            message: '请输入机构地址',
            trigger: 'change'
          }
        ],
        enableStatus: [
          {
            required: true,
            message: '请选择启用状态',
            trigger: 'change'
          }
        ],
        enableCommission: [
          {
            required: true,
            message: '请选择前端佣金可见状态',
            trigger: 'change'
          }
        ],
        disturType: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个寄送方式',
            trigger: 'change'
          }
        ],
        companyCode: [
          {
            validator: (rule, value, callback) => {
              this.companyCodeCheck(callback)
            },
            trigger: 'change'
          }
        ],
        // cameraInfo0: [
        //   {
        //     required: false,
        //     message: '请按“代码-位置”格式填写',
        //     trigger: 'change',
        //     pattern: /^\S{1,}-\S{1,}$/
        //   }
        // ],
        sbtAccount: [
          {
            required: true,
            message: '请输入深保通账号',
            trigger: 'change'
          }
        ],
        sbtPassword: [
          {
            required: true,
            message: '请输入深保通密码',
            trigger: 'change'
          }
        ],
        sbtName: [
          {
            required: true,
            message: '请输入深保通姓名',
            trigger: 'change'
          }
        ]
      },
      orgOptions: [
        {
          value: 'zhinan',
          label: '广东',
          children: [
            {
              value: 'shejiyuanze',
              label: '深圳'
            }
          ]
        }
      ]
    }
  },
  computed: {
    // 复用上级机构
    useSbtParent() {
      return this.ruleForm.sbtType === 1
    },
    showSbtInfo() {
      return this.ruleForm.sbtType !== 0
    },
    showCamera() {
      return this.ruleForm.cameraStatus !== 0
    }
  },
  watch: {
    isShowModal(newVal) {
    },
    'ruleForm.area'(newVal) {
      if (newVal && newVal.length === 2) {
        this.checkShenzhen({
          province: newVal[0],
          city: newVal[1]
        })
      }
    },
    'ruleForm.sbtType'(newVal) {
      if (!this.isShowModal) return
      if (newVal === 1) this.checkHighLevelSbtInfo()
      else if (newVal === 2) this.recoverCacheInfo()
    },
    ruleForm: {
      deep: true,
      handler(newVal) {
        // 默认使用上级机构深保通资料时 不缓存输入框的深保通信息
        if (this.ruleForm.sbtType !== 2) return
        const info = this.ruleForm
        this.cacheSbtInfo({
          sbtAccount: info.sbtAccount,
          sbtPassword: info.sbtPassword,
          sbtName: info.sbtName
        })
      }
    }
  },
  methods: {
    // 检查上级机构深保通信息
    checkHighLevelSbtInfo() {
      // 保存
      const info = this.ruleForm
      this.cacheSbtInfo({
        sbtAccount: info.sbtAccount,
        sbtPassword: info.sbtPassword,
        sbtName: info.sbtName
      }, true)
      querySbtById(this.parentId).then(res => {
        if (!this.useSbtParent) return
        if (res.status === 200 && res.data) {
          const info = res.data
          this.ruleForm.sbtAccount = info.sbtAppIdNo || ''
          this.ruleForm.sbtPassword = info.sbtAppPassword || ''
          this.ruleForm.sbtName = info.sbtAppName || ''
        }
      })
    },
    // 检测区域代码是否深圳地区
    checkShenzhen({ province, city }) {
      this.isShenzhen = false
      const parent = this.orgAreaInfo.find(item => {
        return item.value === province
      })
      if (parent) {
        const child = parent.children.find(item => {
          return item.value === city
        })
        // console.log('child.label', child.label)
        if (child && child.label === '深圳') this.isShenzhen = true
      }
    },
    // 编辑的时候手动修改state
    changeStatus(status) {
      this.ruleForm.enableStatus = status
    },
    handleChange(value) {
      console.log(value)
    },
    submit(callback) {
      if (!this.isShenzhen) {
        this.ruleForm.sbtAccount = ''
        this.ruleForm.sbtPassword = ''
        this.ruleForm.sbtName = ''
      }
      return this.validateNormalForm().then(isValidate => {
        if (isValidate && callback) {
          callback({
            ...this.ruleForm
          })
        }
      })
    },
    // 校验非深保通以外的表单
    validateNormalForm() {
      return new Promise((resovle, reject) => {
        this.$refs.ruleForm.validate(valid => {
          if (valid && !this.isOldCodeExist) resovle(true)
          else resovle(false)
        })
      })
    },
    setData(data) {
      if (data) this.ruleForm = { ...data }
      this.originalCompanyCode = data.companyCode
      this.initSbtInfo()
    },
    // 初始化深保通信息
    initSbtInfo() {
      const info = this.ruleForm
      const sbtAccount = info.sbtAccount
      const sbtPassword = info.sbtPassword
      const sbtName = info.sbtName
      this.cacheSbtInfo({
        sbtAccount,
        sbtPassword,
        sbtName
      })
      // 是否使用上级机构信息
      if (this.useSbtParent) this.checkHighLevelSbtInfo()
    },
    // 缓存当前机构的深保通信息 notCheck 表示不检测参数有效性
    cacheSbtInfo({ sbtAccount, sbtPassword, sbtName }, notCheck) {
      const params = {
        sbtAccount: sbtAccount || '',
        sbtPassword: sbtPassword || '',
        sbtName: sbtName || ''
      }
      if (notCheck || sbtAccount || sbtPassword || sbtName) {
        sessionStorage.setItem('sbtCompanyCache', JSON.stringify(params))
      }
    },
    recoverCacheInfo() {
      const json = sessionStorage.getItem('sbtCompanyCache')
      if (json) {
        const info = JSON.parse(json)
        this.ruleForm.sbtAccount = info.sbtAccount || ''
        this.ruleForm.sbtPassword = info.sbtPassword || ''
        this.ruleForm.sbtName = info.sbtName || ''
      }
    },
    reset() {
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
      this.isOldCodeExist = false
      this.isDataInit = false
      this.originalCompanyCode = ''
      this.ruleForm.enableCommission = 0
      this.ruleForm.enableStatus = 0
      this.$set(this.ruleForm, 'disturType', [])
      this.$set(this.ruleForm, 'notifyUsers', [])
      this.isShenzhen = false
      this.ruleForm.sbtType = 0
      this.ruleForm.cameraInfo0 = ''
      this.ruleForm.cameraInfos = [{ value: '' }]
      this.ruleForm.cameraStatus = 0
      sessionStorage.removeItem('sbtCompanyCache')
    },
    companyCodeCheck(callback) {
      const companyCode = this.ruleForm.companyCode
      // 编辑状态 与带入机构代码一样时不进行检测
      if (this.isEdit && this.originalCompanyCode === companyCode) {
        callback && callback()
        return
      }
      return checkOrg({
        channelCode: this.channelCode,
        oldCode: companyCode
      }).then(data => {
        if (data && data.status === 200) {
          this.isOldCodeExist = data.data
          if (data.data) callback && callback(new Error('机构代码已经存在'))
          else callback && callback()
        }
      })
    },
    // 添加的时候复用父级区域
    setParentArea({ province, city }) {
      // 校验区域代码是否有效
      let isFind = false
      let provinceCode = ''
      let cityCode = ''
      const parent = this.orgAreaInfo.find(item => {
        return item.label === province
      })
      if (parent) {
        provinceCode = parent.value
        const child = parent.children.find(item => {
          return item.label === city
        })
        if (child && child.label) {
          isFind = true
          cityCode = child.value
        }
      }
      if (isFind && provinceCode && cityCode) this.ruleForm.area = [provinceCode, cityCode]
    },
    addCameraItem() {
      this.ruleForm.cameraInfos.push({
        value: ''
      })
    },
    removeCameraItem(index) {
      this.ruleForm.cameraInfos.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
.add-organ-manager {
  .el-form-item__label{
    padding: 0;
  }
  margin: 20px;
  .add-organ-form {
    padding-left: 10px;
    .add-organ-title {
      display: flex;
      font-size: 14px;
      color: #aaa;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
      margin-bottom: 15px;
    }
  }
  .el-input,
  .el-select,
  .el-cascader {
    max-width: 320px;
  }
  .el-select,
  .el-cascader {
    width: 100%;
  }
  .sbt-hint{
    margin-top: 5px;
    color: #606266;
    font-size: 13px;
  }
  .sbt-ckbox{
    margin-top: 10px;
    margin-bottom: 20px;
  }
  .sbt-info-wrap{
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    padding: 10px;
    margin-top: 15px;
  }
  .delete-top{
    .el-form-item__content{
      margin-top: -15px;
      margin-bottom: -10px;
    }
  }
  .special-item{
    .el-form-item__content{
      margin-left: 120px;
      display: flex;
      align-items: center;
    }
    img {
      width: 20px;
      height: 20px;
      margin-left: 10px;
    }
  }
}
</style>

