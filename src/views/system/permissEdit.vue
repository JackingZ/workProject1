<template>
  <div v-loading="isLoading" class="permiss-edit">
    <el-form ref="permissEdit" :model="userForm" :rules="rules" label-position="left" label-width="100px">
      <el-form-item label="姓名：" prop="nickName">
        <el-input v-model="userForm.nickName" :disabled="isEdit" size="small" />
      </el-form-item>
      <el-form-item label="登录账号：" prop="userName">
        <el-input v-model="userForm.userName" :disabled="isEdit" size="small" />
      </el-form-item>
      <el-form-item label="手机号：" prop="phone">
        <el-input v-model="userForm.phone" size="small" />
      </el-form-item>
      <el-form-item v-if="isAnyAdminChannel" label="所属渠道：" prop="channelCode">
        <el-select v-model="userForm.channelCode" :disabled="isEdit" clearable filterable placeholder="请选择" size="small" style="width:100%;" @change="getChannelCode">
          <el-option v-for="item in channelData.data" :label="item.shortName" :key="item.code" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="所属机构：" prop="companyCode">
        <my-tree-select :options="companyTreeData" :value="userForm.companyCode" :disabled="!userForm.channelCode" :normalizer="normalizer" clearable no-options-text="数据加载中..." placeholder="请选择" @select="companyToggle" @input="userForm.companyCode = $event" />
      </el-form-item>
      <el-form-item label="分配角色：" prop="dealRole">
        <el-select v-model="userForm.dealRole" multiple collapse-tags placeholder="请选择" size="small" style="width:100%;" @change="rolesClick">
          <el-option v-for="item in rolesData.data" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="!isEdit" label="启用状态：" prop="status">
        <el-radio-group v-model="userForm.status">
          <el-radio v-for="item in statusList" :label="item.key" :key="item.key">{{ item.value }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="管辖机构：">
        <el-select v-model="userForm.defaultManagerCompany" size="small" style="width:100%;">
          <el-option v-for="item in jurisdictionData" :key="item.key" :label="item.value" :value="item.key" />
        </el-select>
        <el-tree v-show="userForm.defaultManagerCompany === 1" ref="tree" :data="jurisdictionTreeData" :props="defaultProps" :default-checked-keys="checkCompany" node-key="id" show-checkbox @check="companyClick" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  channelEffective,
  getCompanyEffective,
  // getLimitCompanyEffective,
  getOrgData,
  getUserAccount,
  getRoleSelectId,
  // getRoleAllCodes,
  getRoleCodes,
  checkUserName
} from '@/api/system'
import MyTreeSelect from '@/components/MyTreeSelect/index'
import { mapGetters } from 'vuex'
export default {
  components: {
    MyTreeSelect
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    editOption: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isLoading: false,
      checkCompany: [],
      initialName: '',
      companyTreeData: [],
      jurisdictionTreeData: [],
      selectTreeData: [],
      channelData: {
        data: []
      },
      rolesData: {
        data: []
      },
      statusList: [{ key: 0, value: '已启用' }, { key: 1, value: '已禁用' }],
      jurisdictionData: [
        { key: 0, value: '默认管辖，与所属机构一致' },
        { key: 1, value: '特殊管辖，请选择管辖机构' }
      ],
      userForm: {
        id: null,
        channelCode: null,
        roles: [],
        dealRole: [],
        belongCompanys: [],
        managerCompanys: [],
        companies: [],
        permissions: [],
        roleRelatePermissions: [],
        companyCode: null,
        userName: null,
        nickName: null,
        phone: null,
        defaultManagerCompany: 0,
        userRelateCompanys: [], // 机构集合
        userRelateRoles: [], // 角色集合
        status: 0
      },
      rules: {
        userName: [
          {
            required: true,
            validator: this.validateUserName,
            trigger: 'blur'
          }
        ],
        nickName: [
          {
            required: true,
            validator: this.validateNickName,
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            validator: this.validatePhone,
            trigger: 'blur'
          }
        ],
        channelCode: [
          {
            required: true,
            message: '请选择所属渠道',
            trigger: 'change'
          }
        ],
        companyCode: [
          {
            required: true,
            message: '请选择所属机构',
            trigger: 'change'
          }
        ],
        dealRole: [
          {
            required: true,
            message: '请选择分配角色',
            trigger: 'change'
          }
        ],
        status: [
          {
            required: true,
            message: '请选择状态',
            trigger: 'blur'
          }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否管理员渠道
    ])
  },
  watch: {
    'userForm.companyCode'(newVal) {
      this.$refs.permissEdit.validateField('companyCode')
    }
  },
  async created() {
    this.isLoading = true
    // 编辑
    if (this.isEdit) {
      const resU = await getUserAccount(this.editOption.id)
      this.initialName = resU.data.userName
      this.userForm.channelCode = resU.data.channelCode
      this.userForm.id = resU.data.id
      this.userForm.userName = resU.data.userName
      this.userForm.nickName = resU.data.nickName
      this.userForm.phone = resU.data.phone
      this.userForm.defaultManagerCompany = resU.data.defaultManagerCompany
      this.userForm.status = resU.data.status
      if (this.isAnyAdminChannel) {
        this.channelData = await channelEffective()
      }
      this.rolesData = await getRoleCodes(resU.data.channelCode)

      const resD = await getOrgData({
        channelCode: resU.data.channelCode,
        areaCode: null,
        filterTeamCompany: true,
        token: this.$store.getters.token
      })
      const json = JSON.parse(
        JSON.stringify(resD.data)
          .replace(/title/g, 'label')
          .replace(/key/g, 'id')
      )
      this.companyTreeData = json
      const resJ = await getCompanyEffective()
      const jsonJ = JSON.parse(
        JSON.stringify(resJ.data)
          .replace(/title/g, 'label')
          .replace(/key/g, 'id')
      )
      this.jurisdictionTreeData = jsonJ
      this.selectTreeData = JSON.parse(JSON.stringify(jsonJ))

      const maxItem = resU.data.belongCompanys.sort(
        (a, b) => b.level - a.level
      )[0]
      this.userForm.companyCode = maxItem.id
      setTimeout(() => {
        this.$refs.permissEdit.validateField('companyCode')
      })
      const arrC = [{ companyId: maxItem.id, linkType: '1' }]
      const arrD = []

      if (resU.data.managerCompanys && resU.data.managerCompanys.length > 0) {
        for (let i = 0; i < resU.data.managerCompanys.length; i++) {
          arrD.push(resU.data.managerCompanys[i].id)
          arrC.push({
            companyId: resU.data.managerCompanys[i].id,
            linkType: '2'
          })
        }
      }
      this.checkCompany = arrD
      // console.log(this.checkCompany)
      this.userForm.userRelateCompanys = arrC
      const resR = await getRoleSelectId(this.editOption.id)
      const arrR = []
      const arrI = []
      if (resR.data && resR.data.length > 0) {
        for (let i = 0; i < resR.data.length; i++) {
          arrR.push({ roleId: resR.data[i].roleId })
          arrI.push(resR.data[i].roleId)
        }
      }
      this.userForm.dealRole = arrI
      this.userForm.userRelateRoles = arrR
    } else {
      // 新增
      if (this.isAnyAdminChannel) {
        this.channelData = await channelEffective()
      } else {
        this.userForm.channelCode = this.$store.getters.userAll.data.channelCode
        const resD = await getOrgData({
          channelCode: this.userForm.channelCode,
          areaCode: null,
          filterTeamCompany: true,
          token: this.$store.getters.token
        })
        const json = JSON.parse(
          JSON.stringify(resD.data)
            .replace(/title/g, 'label')
            .replace(/key/g, 'id')
        )
        this.companyTreeData = json
        this.rolesData = await getRoleCodes(this.userForm.channelCode)
      }
      const resJ = await getCompanyEffective()
      const jsonJ = JSON.parse(
        JSON.stringify(resJ.data)
          .replace(/title/g, 'label')
          .replace(/key/g, 'id')
      )
      this.jurisdictionTreeData = jsonJ
      this.selectTreeData = JSON.parse(JSON.stringify(jsonJ))
    }
    this.isLoading = false
  },
  methods: {
    isvalidPhone(str) {
      const reg = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/
      return reg.test(str)
    },
    validatePhone(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!this.isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    },
    validateNickName(rule, value, callback) {
      const reg = /[`~!@#$%^&*()+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——+={}|《》？：“”【】、；‘’，。、]/im
      if (!value) {
        callback(new Error('请输入姓名'))
      } else if (reg.test(value)) {
        callback(new Error('姓名不能为特殊字符'))
      } else {
        callback()
      }
    },
    async validateUserName(rule, value, callback) {
      const reg = /^(\w|\-|\_){2,40}$/
      const regN = /^\d{11}$/
      if (!value) {
        callback(new Error('请输入登录账号'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入2-40位数字 字母 下划线(_) 连字符(-)'))
      } else if (regN.test(Number(value))) {
        // callback(new Error('登录账号不能为11位纯数字'))
      } else if (value !== this.initialName) {
        const res = await checkUserName(value)
        if (res.data === true) {
          callback(new Error('登录账号已存在'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    normalizer(node) {
      if (node.children && node.children.length === 0) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children
      }
    },
    // 选取渠道获取机构和角色
    async getChannelCode(key) {
      const resD = await getOrgData({
        channelCode: key,
        areaCode: null,
        filterTeamCompany: true,
        token: this.$store.getters.token
      })
      const json = JSON.parse(
        JSON.stringify(resD.data)
          .replace(/title/g, 'label')
          .replace(/key/g, 'id')
      )
      this.companyTreeData = json
      this.rolesData = await getRoleCodes(key)
    },
    // 选取所属机构
    companyToggle(node) {
      const arrTree = this.userForm.userRelateCompanys
      for (let i = arrTree.length - 1; i >= 0; i--) {
        if (arrTree[i].linkType === '1') {
          arrTree.splice(i, 1)
        }
      }
      const obj = { companyId: node.id, linkType: '1' }
      this.userForm.userRelateCompanys.push(obj)
    },
    // 选取所辖机构
    companyClick() {
      // 先清除所辖机构再添加
      const arrTree = this.userForm.userRelateCompanys
      for (let i = arrTree.length - 1; i >= 0; i--) {
        if (arrTree[i].linkType === '2') {
          arrTree.splice(i, 1)
        }
      }
      const arr = this.$refs.tree.getCheckedKeys()
      console.log(arr)
      this.selectTreeData = JSON.parse(JSON.stringify(this.jurisdictionTreeData))
      arr.forEach(item => {
        this.recursion(item, this.selectTreeData)
      })
      const arrR = this.recursionArr(this.selectTreeData)
      // 所辖机构树集合
      arrR.forEach(item => {
        const obj = { companyId: item, linkType: '2' }
        this.userForm.userRelateCompanys.push(obj)
      })
      console.log(this.userForm.userRelateCompanys)
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
    // 选取角色
    rolesClick(val) {
      const arr = []
      for (let i = 0; i < val.length; i++) {
        arr.push({ roleId: val[i] })
      }
      this.userForm.userRelateRoles = arr
    }
  }
}
</script>

<style lang="scss">
.permiss-edit {
  padding: 20px 40px;
  .el-form-item.is-success .el-input__inner {
    border-color: #dcdfe6;
  }
}
</style>

