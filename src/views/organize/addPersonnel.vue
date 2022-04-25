<template>
  <!-- eslint-disable -->
  <div class="add-personal-manager">
    <div class="add-personal-form">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="110px" class="demo-ruleForm" label-position="left">
        <div class="add-personal-sub-title">基础信息</div>
        <el-form-item v-if="isAnyAdminChannel"
          label="所属渠道：" prop="channel">
          <el-select v-model="ruleForm.channel" clearable filterable placeholder="请选择"
            size="small" :disabled="isEdit || isLoadingList" @change="onChannelChange">
            <el-option v-for="item in channelList" :key="item.code" :label="item.shortName" :value="item.code" :disabled="item.disabled"/>
          </el-select>
        </el-form-item>
        <el-form-item label="所属机构：" prop="team">
          <my-tree-select
            :options="currentOrgList"
            :value="ruleForm.team"
            :normalizer="normalizer"
            valueFormat="object"
            @input="ruleForm.team = $event"
            noOptionsText="数据加载中..."
            style="width:280px;margin-top: 3px;"
            placeholder="请选择"
            @select="selectOrg"
            :disabled="isDisableOrgSelect"
            noResultsText="未找到结果"
            ></my-tree-select>
        </el-form-item>
        <el-form-item v-if="!isDistributionChannel && isAnyAdminChannel"
          label="账号类型：" prop="salesType">
          <el-select v-model="ruleForm.salesType" clearable filterable placeholder="请选择" size="small"
            :disabled="isEdit" @change="onSalesTypeChange">
            <el-option v-for="item in salesTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="isChannelSales"
          label="关联渠道：" prop="relatedChannel">
          <el-select multiple collapse-tags v-model="ruleForm.relatedChannel" placeholder="请选择" size="small" style="width:100%;">
            <el-option v-for="item in relatedChannelList" :key="item.code" :label="item.shortName" :value="item.code" />
          </el-select>
          <!-- <el-checkbox-group v-model="ruleForm.relatedChannel" size="small">
            <el-checkbox v-for="(item, index) in relatedChannelList"
              :label="item.code"
              :key="index">{{ item.shortName }}</el-checkbox>
          </el-checkbox-group> -->
        </el-form-item>
        <el-form-item label="人员姓名：" prop="idName">
          <el-input v-model="ruleForm.idName" size="small"/>
        </el-form-item>
        <el-form-item label="登录账号：" prop="userName">
          <el-input v-model="ruleForm.userName" size="small" :disabled="isEdit"/>
        </el-form-item>
        <el-form-item label="绑定手机：" prop="phone" >
          <el-input v-model="ruleForm.phone" size="small" />
        </el-form-item>
        <el-form-item v-if="isCarDeal" label="分配角色：" prop="roles">
          <el-select v-model="ruleForm.roles" placeholder="请选择" size="small" style="width:100%;">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-else label="分配角色：" prop="rolesList">
           <el-select multiple collapse-tags v-model="ruleForm.rolesList" placeholder="请选择" size="small" style="width:100%;">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.name" :value="item.id" :disabled="isDisableOption(item)"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isAnyAdminChannel"
          label="有效时间：" prop="validDateType">
          <el-radio-group v-model="ruleForm.validDateType">
            <el-radio :label="1">永久</el-radio>
            <el-radio :label="2" v-show="!isEdit">60天</el-radio>
            <el-radio :label="3" v-show="!isEdit">30天</el-radio>
            <el-radio :label="4">自定义</el-radio>
          </el-radio-group>
        </el-form-item>
         <el-form-item prop="validDate" v-if="ruleForm.validDateType==4">
            <el-date-picker
              style="width:280px;"
              size="small"
              v-model="ruleForm.validDate"
              type="daterange"
              range-separator="-"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="isEdit ? '' : pickerStart"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              >
            </el-date-picker>
        </el-form-item>
        <el-form-item v-if="!isEdit"
          label="启用状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="管辖机构：">
          <el-select v-model="ruleForm.defaultManagerCompany" size="small" style="width:100%;">
            <el-option v-for="item in jurisdictionData" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
          <el-tree v-show="ruleForm.defaultManagerCompany === 1" ref="tree" :data="jurisdictionTreeData" :props="defaultProps" :default-checked-keys="checkCompany" node-key="id" show-checkbox @check="companyClick" />
        </el-form-item>
        <el-form-item v-if="isSunrize"
          label="设备EN号：" prop="encode">
          <el-input v-model="ruleForm.encode" size="small"/>
        </el-form-item>
        <div class="add-personal-sub-title">其他信息</div>
        <el-form-item label="人员编号：" prop="agentCode" >
          <el-input v-model="ruleForm.agentCode" size="small" />
        </el-form-item>
        <el-form-item label="联系邮箱：" prop="email" >
          <el-input v-model="ruleForm.email" size="small" />
        </el-form-item>
        <el-form-item label="身份证号：" prop="idNum" >
          <el-input v-model="ruleForm.idNum" size="small" />
        </el-form-item>
        <el-form-item label="执业证号：" prop="saleNo" >
          <el-input v-model="ruleForm.saleNo" size="small" />
        </el-form-item>
        <el-form-item label="开户银行：" prop="bank" >
          <el-input v-model="ruleForm.bank" size="small" />
        </el-form-item>
        <el-form-item label="银行卡号：" prop="card" >
          <el-input v-model="ruleForm.card" size="small" />
        </el-form-item>
        <el-form-item label="坐席电话账号：" prop="callAccount" >
          <el-input v-model="ruleForm.callAccount" size="small" />
        </el-form-item>
        <el-form-item label="坐席电话密码：" prop="callPassword" >
          <el-input v-model="ruleForm.callPassword" size="small" />
        </el-form-item>
        <div class="add-personal-sub-title">深保通信息</div>
        <el-form-item v-if="isShowShenBaoTong"
          label="深保通姓名：" prop="sbtAppName" >
          <el-input v-model="ruleForm.sbtAppName" size="small" />
        </el-form-item>
        <el-form-item v-if="isShowShenBaoTong"
          label="深保通账号：" prop="sbtAppIdNo" >
          <el-input v-model="ruleForm.sbtAppIdNo" size="small" />
        </el-form-item>
        <el-form-item v-if="isShowShenBaoTong"
          label="深保通密码：" prop="sbtPassword" >
          <el-input v-model="ruleForm.sbtPassword" size="small" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import MyTreeSelect from '@/components/MyTreeSelect/index'
import { mapGetters } from 'vuex'
import { getCompanyEffective } from '@/api/ledger'
import { getRoleCodes, getCompanyTreeEffective, checkUserName } from '@/api/system'
import {
  checkOrgExistUser,
  checkExistAgentCode,
  queryChannelByCode,
  queryOrgInfo,
  getChannelInfo
} from '@/api/organization'
import {getRules} from '@/views/organize/rules'
export default {
  components: {
    MyTreeSelect
  },
  props: {
    sexConfig: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isShow: Boolean,
    areaList: Array,
    channelList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const self = this
    return {
       pickerStart: {
        disabledDate(time) {
          return time.getTime() + 60*60*24*1000 < Date.now()
        }
      },
      labelPosition: 'left',
      isShenzhen: false, //深圳显示深保通信息
      value: {},
      orgList: [],
      currentOrgList: [],
      rolesList: [], // 角色列表
      selectOrgItem: {}, // 选中的机构item
      originalPhone: '',
      userId: '', // 业务员用户id
      originalAgentCode: '',
      initialName: '',
      ruleForm: {
        team: null,
        userName: '',
        idName: '',
        phone: '',
        validDateType: 1,
        validDate:'',
        salesType: '',
        channel: '',
        status: 0,
        encode: '',
        relatedChannel: [],
        agentCode: '',
        email: '',
        idNum: '',
        saleNo: '',
        bank: '',
        card: '',
        callAccount: '',
        callPassword: '',
        sbtAppName: '',
        sbtAppIdNo: '',
        sbtPassword: '',
        roles: '',
        rolesList: [],
        defaultManagerCompany: 0,
        userRelateCompanys: []
      },
      managerCompanys: [],
      checkCompany: [],
      jurisdictionTreeData: [],
      selectTreeData: [],
      jurisdictionData: [
        { key: 0, value: '默认管辖，与所属机构一致' },
        { key: 1, value: '特殊管辖，请选择管辖机构' }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      isLoadingList: false,
      channelType: '', // 渠道类型 代理 分销
      salesTypeOptions: [
        {
          value: '1',
          label: '个人代理'
        },
        {
          value: '2',
          label: '渠道合作'
        }
      ],
      relatedChannelList: [],
      rules: {...getRules(self)},
      isCarDeal: false // 是否车商渠道
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否管理员渠道
    ]),
    isDisableOrgSelect () {
      if (this.isAnyAdminChannel) {
        if (!this.ruleForm.channel) return true
      }
      return false
    },
    // 是否森锐渠道
    isSunrize () {
      return this.ruleForm.channel === '132'
    },
    // 是否显示深保通 深圳代理渠道才需要填写
    isShowShenBaoTong () {
      return this.isShenzhen && this.channelType === '1'
    },
    // 是否分销渠道
    isDistributionChannel () {
      return this.channelType === '2'
    },
    // 是否渠道业务员
    isChannelSales () {
      return this.ruleForm.salesType === '2'
    }
  },
  created() {
    if (!this.isEdit) this.initData()
  },
  methods: {
    // 编辑的时候手动修改state
    changeStatus(status) {
      this.ruleForm.status = status
    },
    setAreaInfo ({province, city}) {
      this.isShenzhen = false
      const parent = this.areaList.find(item => {
        return item.value === province
      })
      if (parent) {
        const child = parent.children.find(item => {
          return item.value === city
        })
        
        if (child && child.label === '深圳') {
          // console.log('child.label', child.label)
          this.isShenzhen = true
        }
      }
    },
    selectOrg(node, instanceId) {
      console.log('node', node)
      this.selectOrgItem = node
      // 触发单个校验
      setTimeout(() => {
        let result = this.$refs.ruleForm.validateField('team', error => {
          setTimeout(() => {
            if (this.ruleForm.agentCode) this.$refs.ruleForm.validateField('agentCode')
            if (this.ruleForm.phone) this.$refs.ruleForm.validateField('phone')
          })
          if (!error) {
            this.initRelatedChannel()
          }
        })
      })
      queryOrgInfo(node.key).then(res2 => {
        const orgData = res2.data
        this.channelType = orgData.channelType
        this.setAreaInfo({
          city: orgData.city,
          province: orgData.province
        })
      })
      const arrTree = this.ruleForm.userRelateCompanys
      const index = arrTree.findIndex(item => item.linkType === '1')
      if (index >= 0) arrTree.splice(index, 1)
      const obj = { companyId: node.key, linkType: '1' }
      this.ruleForm.userRelateCompanys.push(obj)
    },
    // 分销渠道自动设置为个人业务员 并隐藏业务员类型
    setSalesTypeChannelType () {
      if (this.channelType === '2') {
        this.ruleForm.salesType = '1'
      }
    },
    normalizer(node) {
      const res = {
        id: node.key,
        label: node.title
      }
      if (node.children && node.children.length > 0) res.children = node.children
      else delete node.children
      return res
    },
    submit(callback) {
      // 清空其他管辖机构
      this.$refs.ruleForm.validate().then(valid => {
        console.log('submit = ', !!valid)
        if (valid) {
          if (this.ruleForm.defaultManagerCompany === 0 && this.ruleForm.userRelateCompanys) {
            const res = this.ruleForm.userRelateCompanys.filter(item => parseInt(item.linkType) === 1)
            this.$set(this.ruleForm, 'userRelateCompanys', res)
            this.$set(this, 'checkCompany', [])
          }
          if (callback) {
            callback({
              ...this.ruleForm,
              channelCode: this.selectOrgItem.channelCode
            })
          }
        }
        else return false
      })
    },
    // 检查业务员编码是否存在
    agentCodeCheck(callback) {
      if (!this.ruleForm.agentCode) {
        callback()
        return
      }
      // 编辑状态 与带入业务员编码一样时不进行检测
      if (this.isEdit && this.originalAgentCode === this.ruleForm.agentCode) {
        callback && callback()
        return
      }
      if (!this.ruleForm.team) {
        callback(new Error('未选择机构'))
        return
      }
      checkExistAgentCode({
        agentCode: this.ruleForm.agentCode,
        channelCode: this.selectOrgItem.channelCode
      }).then(res => {
        if (res && res.status === 200) {
          if (res.data) callback(new Error('业务员编码已经存在'))
          else callback()
        }
      })
    },
    reset() {
      this.$refs.ruleForm.resetFields()
      this.clearInfo()
      this.ruleForm.team = null
      this.originalPhone = ''
      this.originalAgentCode = ''
      this.userId = ''
      this.channelType = ''
      this.selectOrgItem = {}
      this.relatedChannelList = []
      this.orgList = []
      // this.rules = {...getRules(this)}
      this.isShenzhen = false
      this.isLoadingList = false
      this.channelCode = ''
      this.ruleForm.channel = ''
      this.ruleForm.status = 0
      this.ruleForm.rolesList = []
      this.ruleForm.defaultManagerCompany = 0
      this.isCarDeal = false
      this.rolesList = []
      this.checkCompany = []
    },
    clearInfo () {
      this.ruleForm.sbtAppName = ''
      this.ruleForm.sbtAppIdNo = ''
      this.ruleForm.sbtPassword = ''
    },
    setData({ data, channelCode, userId, channelType, salesChannels }) {
      if (data) this.ruleForm = { ...data }
      this.initialName = data.userName
      if (data.userRelateCompanys) {
        this.checkCompany = data.userRelateCompanys
          .filter(item => item.linkType === '2')
          .map(item => item.companyId)
      }
      this.originalPhone = data.phone
      this.originalAgentCode = data.agentCode
      this.userId = userId
      this.channelType = channelType
      if (channelCode) {
        this.initRelatedChannel(salesChannels)
      }
      // 非运维渠道默认 个人业务员
      if (!this.isAnyAdminChannel || this.isDistributionChannel) this.ruleForm.salesType = '1'
      if (this.ruleForm.team) this.$refs.ruleForm.validateField('team')
      setTimeout(() => {
        if (this.ruleForm.team) this.$refs.ruleForm.validateField('team')
      }, 100)
      this.checkCarDealerChannel()
      this.initData()
    },
    assginPermission(permissions) {
      permissions.forEach(permission => {
        let saleChannelCode = permission.saleChannelCode
        let item = this.relatedChannel.find(channel => {
          return saleChannelCode === channel.code
        })
        if (item) item.permissionConfig.push(permission.permissionId)
      })
    },
    searchOrg() {
      let searchItem = this.ruleForm.team
      const search = list => {
        for (let item of list) {
          // console.log('8888',list)
          // console.log('8888',item)
          if (item && searchItem && item.key && item.key === searchItem.key && item.title === searchItem.title) {
            this.selectOrgItem = item
            return
          }
          if (item.children) search(item.children)
        }
      }
      search(this.orgList)
      setTimeout(() => {
        if(this.$refs.ruleForm){ //解决取消时候的报错
          this.$refs.ruleForm.validateField('team')
        } 
      })
    },
    getList() {
      this.isLoadingList = true
      if (this.isAnyAdminChannel) this.currentOrgList = []
      else {
        this.ruleForm.channel = this.$store.getters.userAll.data.channelCode
      }
      this.getRolesList()
      getCompanyEffective().then(data => {
        this.isLoadingList = false
        if (data && data.status === 200) {
          this.orgList = data.data
          if (this.isEdit) {
            this.searchCurrentOrgList()
            this.searchOrg()
            setTimeout(() => {
              if (this.ruleForm.team) this.$refs.ruleForm.validateField('team')
            }, 50)
          } else {
            if (!this.isAnyAdminChannel) this.searchCurrentOrgList()
          }
        }
      }).catch(e => {
        console.error(e)
        this.isLoadingList = false
      })
      getCompanyTreeEffective().then(res => {
        if (res.data) {
          this.jurisdictionTreeData = JSON.parse(
            JSON.stringify(res.data)
              .replace(/title/g, 'label')
              .replace(/key/g, 'id')
          )
          this.selectTreeData = this.copyData(this.jurisdictionTreeData)
        }
      })
    },
    searchCurrentOrgList () {
      function searchItem (item, val) {
        if (item.channelCode === val) return item
        else if (item.children && item.children.length > 0) {
          for (let child of item.children) {
            let res = searchItem(child, val)
            if (res) return res
          }
        }
        return null
      }

      function searchList (list, val, callback) {
        for (let item of list) {
          const res = searchItem(item, val)
          if (res) callback && callback(res)
        }
      }
      const list = []
      const res = searchList(this.orgList, this.ruleForm.channel, (item) => {
        list.push(item)
      })
      this.currentOrgList = this.copyData(list)
    },
    onChannelChange () {
      this.ruleForm.team = null
      this.currentOrgList = []
      this.initRelatedChannel()
      this.searchChannelType()
      this.searchCurrentOrgList()
      setTimeout(() => {
        console.log('onChannelChange')
        this.$refs.ruleForm.clearValidate('team')
        this.$refs.ruleForm.validateField('userName')
        if (this.ruleForm.channel) this.$refs.ruleForm.validateField('channel')
      }, 50)
      this.checkCarDealerChannel()
      this.getRolesList()
    },
    // 检查是否车商渠道
    checkCarDealerChannel () {
      const channelItem = this.channelList.find(item => item.code === this.ruleForm.channel)
      if (channelItem && channelItem.carDealer === 0) this.isCarDeal = true
      else this.isCarDeal = false
    },
    onSalesTypeChange () {
      this.initRelatedChannel()
    },
    // 查找渠道类型
    searchChannelType () {
      const item = this.channelList.find(item => item.code === this.ruleForm.channel)
      if (!item) return
      this.channelType = item.type
      this.setSalesTypeChannelType()
    },
    initData () {
      this.getList()
      // 非运维渠道默认或者分销渠道
      if (!this.isAnyAdminChannel || this.isDistributionChannel) this.ruleForm.salesType = '1'
      this.checkIsCarDeal()
    },
    // 非运维检测账号渠道是否车商
    checkIsCarDeal () {
      if (this.isAnyAdminChannel) return
      const channelCode = this.$store.getters.userAll.data.channelCode
      getChannelInfo(channelCode).then(res => {
        if (res && res.status === 200) {
          this.isCarDeal = res.data.carDealer === 0
        }
      })
    },
    // 获取分配角色列表
    getRolesList (callback) {
      const channelCode = this.isAnyAdminChannel ? 
        this.ruleForm.channel : this.$store.getters.userAll.data.channelCode
      getRoleCodes(channelCode).then(res => {
        if (res && res.status === 200) {
          this.rolesList = [...res.data]
          callback && callback()
        }
      })
    },
    // 初始化关联渠道
    initRelatedChannel (salesChannels) {
      const channel = this.isAnyAdminChannel ? this.ruleForm.channel : this.selectOrgItem.channelCode
      if (this.ruleForm.salesType !== '2' || !channel) {
        this.ruleForm.relatedChannel = []
        return
      }
      // 查询关联渠道
      queryChannelByCode(channel).then(res => {
        this.relatedChannelList = res.data
        if (salesChannels) {
          this.ruleForm.relatedChannel = []
          salesChannels.forEach(item => {
            this.ruleForm.relatedChannel.push(item.channelCode)
          })
        }
      })
    },
    // 选取所辖机构
    companyClick() {
      // 先清除所辖机构再添加
      const arrTree = this.ruleForm.userRelateCompanys
      for (let i = arrTree.length - 1; i >= 0; i--) {
        if (arrTree[i].linkType === '2') {
          arrTree.splice(i, 1)
        }
      }
      const arr = this.$refs.tree.getCheckedKeys()
      this.selectTreeData = this.copyData(this.jurisdictionTreeData)
      arr.forEach(item => {
        this.recursion(item, this.selectTreeData)
      })
      const arrR = this.recursionArr(this.selectTreeData)
      // 所辖机构树集合
      arrR.forEach(item => {
        const obj = { companyId: item, linkType: '2' }
        this.ruleForm.userRelateCompanys.push(obj)
      })
    },
    // 递归函数
    recursion(res, data) {
      const getId = arr => {
        arr.forEach(v => {
          if (res === v.id) {
            v.checked = true
          } else {
            if (v.children && v.children.length > 0) {
              getId(v.children)
            }
          }
        })
      }
      getId(data)
    },
    // 递归函数
    recursionArr(data) {
      const res = []
      const getId = arr => {
        arr.forEach(v => {
          if (v.checked) {
            res.push(v.id)
            return
          }
          if (v.children && v.children.length > 0) {
            getId(v.children)
          }
        })
      }
      getId(data)
      return res
    },
    async validateUserName(rule, value, callback) {
      const reg = /^(\w|\-|\_){2,40}$/
      const regN = /^\d{11}$/
      if (!this.ruleForm.channel) {
        callback(new Error('请选择渠道'))
        return
      }
      if (!value) {
        callback(new Error('请输入登录账号'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入2-40位数字 字母 下划线(_) 连字符(-)'))
      } else if (value !== this.initialName) {
        const res = await checkOrgExistUser({
          userName: this.ruleForm.userName,
          channelCode: this.ruleForm.channel
        })
        if (res.data === true) {
          callback(new Error('登录账号已存在'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    copyData(obj) {
      return JSON.parse(JSON.stringify(obj || {}))
    },
    isDisableOption(item) {
      // datong-001 渠道，在悦保后台添加和编辑人员账号时，【分配角色】一项子候选项中，将系统默认的业务员角色设为禁用样式
      if (item && item.channelCode === '001' && item.name === '业务员') return true
      return false
    }
  },
  watch: {
    isShow(newVal) {
      if (newVal && !this.isEdit) {
      }
    },
    'ruleForm.team'(newVal) {
      if (this.orgList.length > 0) this.$refs.ruleForm.validateField('team')
    },
    // 分销渠道默认为个人业务员
    isDistributionChannel (newVal) {
      if (!newVal) {
        this.ruleForm.salesType = ''
        setTimeout(() => {
          this.$refs.ruleForm.clearValidate('salesType')
        })
      }
    }
  }
}
</script>

<style lang="scss">
.add-personal-sub-title {
  color: #999;
  font-size: 14px;
  padding: 10px 10px 10px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;
}
.add-personal-manager {
  margin: 20px;
  .el-form-item__content {
    width: 250px;
  }
  .add-personal-form {
    padding-left: 10px;
    .add-personal-title {
      font-size: 14px;
      color: #aaa;
    }
  }
  .el-form-item {
    width: 50%;
  }
  .el-input,
  .el-select {
    max-width: 320px;
  }
  .el-select {
    width: 100%;
  }
  .el-checkbox+.el-checkbox {
    margin-left: 0;
  }
  .el-checkbox__label{
    width: 120px;
  }
}

.el-radio+.el-radio{
  margin-left:15px;
}
.add-personal-manager .el-form-item__content {
    width: 280px;
}
</style>

