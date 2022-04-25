<template>
  <div class="issue-wrap">
    <el-dialog
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      title="移动出单【选择业务员登录】"
      width="500px"
      center
      @close="closeruleForm" >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        class="demo-ruleForm">
        <el-form-item
          v-if="isAnyAdminChannel"
          :label-width="formLabelWidth"
          prop="currentChannel"
          label="所属渠道">
          <el-select
            v-model="ruleForm.currentChannel"
            placeholder="请选择所属渠道"
            size="small"
            filterable
            @change="handleCheckChannel">
            <el-option
              v-for="item in ruleForm.channelList"
              :key="item.code"
              :label="item.shortName"
              :value="item.code"/>
          </el-select>
        </el-form-item>

        <el-form-item
          :label-width="formLabelWidth"
          prop="currentOrgan"
          label="所属机构">
          <el-tree-select
            v-model="ruleForm.currentOrgan"
            :disabled="!ruleForm.currentChannel || !ruleForm.OrganList.length>0"
            :data="ruleForm.OrganList"
            :default-expand-all="false"
            clearable
            filterable
            size="small"
            class="filter"
            placeholder="请选择所属机构"
            @change="handleCheckOrgan"
          />
        </el-form-item>

        <el-form-item
          :label-width="formLabelWidth"
          prop="currentSalesman"
          label="业务员">
          <el-select
            v-model="ruleForm.currentSalesman"
            :disabled="!ruleForm.currentOrgan"
            placeholder="请选择业务员"
            size="small"
            filterable
            @change="getCheckToken">
            <el-option
              v-for="item of ruleForm.salesmanList"
              :key="item.id"
              :label="item.idName +'-'+ item.phone"
              :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="!isDatongChannel"
          size="small"
          target="_blank"
          @click="checkSelfLogin($event)">不了，使用自己账号登录</el-button>
        <el-button
          type="primary"
          size="small"
          target="_blank"
          @click="submitForm('ruleForm', $event)">立即登录</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  postRealSalesmanID,
  getCurrentChannel,
  postCurrentOrgan
} from '@/api/policy'
import { getTokenBySalesId } from '@/api/organization'
import { getMockLoginFunc } from '@/utils/mobileLogin'
import ElTreeSelect from '@/components/ElTreeSelect/index'
const getMaxLevelOrg = (list) => {
  if (!list) return
  const item = list.reduce((item1, item2) => {
    return item1.level > item2.level ? item1 : item2
  })
  return item
}
export default {
  name: 'QuickIssue',
  components: {
    ElTreeSelect
  },
  filters: {
    teamCompany(val) {
      const item = getMaxLevelOrg(val)
      return item && item.name
    }
  },
  data() {
    return {
      issueUrl: null,
      // onlyOneChild: null,
      getUrl: null,
      autoLoginIns: false,
      centerDialogVisible: true,
      params: null,
      dialogFormVisible: true,
      ruleForm: {
        channelList: [], // 渠道列表
        currentChannel: '',
        OrganList: [], // 机构列表
        currentOrgan: '',
        salesmanList: [], // 用户列表
        currentSalesman: null,
        currentToken: null
      },
      channelCode: JSON.parse(localStorage.getItem('userAll')).data.channelCode,
      formLabelWidth: '180px',
      rules: {
        currentChannel: [
          { required: true, message: '请选择所属机构', trigger: 'blur' }
        ],
        currentOrgan: [
          { required: true, message: '请选择所属机构', trigger: 'blur' }
        ],
        currentSalesman: [
          { required: true, message: '请选择业务员', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否管理员渠道
    ]),
    // 是否大童渠道
    isDatongChannel() {
      return JSON.parse(localStorage.getItem('userAll')).data.channelCode === '001'
    },
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    }
  },
  created() {
    this.channelCode = JSON.parse(localStorage.getItem('userAll')).data.channelCode
    const user = JSON.parse(localStorage.getItem('userAll')).data.roles
    console.log('user', user)
    if (user && user.length === 1 && (user[0].code === '0000000002' || user[0].code === '0000000003')) this.autoSelfLogin()
    if (this.isAnyAdminChannel) {
      this.getChannelList()
    } else {
      this.ruleForm.currentChannel = this.channelCode
      this.postCurrentOrgan(this.channelCode)
    }
  },
  methods: {
    // 表单验证
    submitForm(formName, e) {
      console.log(this.$refs[formName])
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.checkIdLogin(e)
        } else {
          console.log('请选择所属机构业务员再进行登录')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    // 选择业务员登录
    checkIdLogin(e) {
      this.dialogFormVisible = false
      e.preventDefault()
      this.QuickIssue()
    },
    // 使用当前账号登录
    checkSelfLogin(e) {
      this.dialogFormVisible = false
      if (e) e.preventDefault()
      const getUrl = getMockLoginFunc(this)
      window.getIssueUrl = (query = {}) => {
        return getUrl(query)
      }
      // console.log(window.getIssueUrl)
      window.openIssueUrl()
    },
    // 使用当前账号登录 ( 出单，续保专员 自动登录)
    autoSelfLogin() {
      this.dialogFormVisible = false
      const getUrl = getMockLoginFunc(this)
      window.getIssueUrl = (query = {}) => {
        return getUrl(query)
      }
      console.log('出单专员', window.getIssueUrl)
      window.openIssueUrl()
      this.closeruleForm()
    },
    // 获取当前所选业务员token
    getCheckToken() {
      getTokenBySalesId(this.ruleForm.currentSalesman)
        .then(res => {
          if (res && res.access_token) {
            this.ruleForm.currentToken = res.access_token
          }
          // console.log('token', this.ruleForm.currentSalesman, res)
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 获取当前权限内所有渠道
    getChannelList() {
      getCurrentChannel()
        .then(res => {
          const { data: channelList } = res
          this.ruleForm.channelList = channelList
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 获取当前渠道内 所有机构节点
    postCurrentOrgan(param) {
      const params = {
        channelCode: param
      }
      postCurrentOrgan(params)
        .then(res => {
          // console.log('res', res)
          const { data: OrganList } = res
          // console.log('OrganList', OrganList)
          this.ruleForm.OrganList = JSON.parse(JSON.stringify(OrganList).replace(/title/g, 'label').replace(/key/g, 'value'))
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 获取当前机构内 所有业务员账号信息
    postRealSalesmanID(param) {
      const params = {
        channelCode: this.ruleForm.currentChannel,
        companyIds: [param]
      }
      postRealSalesmanID(params)
        .then(res => {
          const { data: salesmanList } = res
          if (salesmanList.length < 1) {
            this.ruleForm.salesmanList = []
            return
          }
          this.ruleForm.salesmanList = salesmanList
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 选择渠道
    handleCheckChannel(value) {
      this.ruleForm.currentOrgan = ''
      this.ruleForm.currentSalesman = ''
      this.postCurrentOrgan(value)
    },
    // 选择机构
    handleCheckOrgan() {
      this.postRealSalesmanID(this.ruleForm.currentOrgan)
    },
    QuickIssue() {
      this.params = {
        channelCode: this.ruleForm.currentChannel,
        operatorId: this.ruleForm.currentSalesman,
        token: this.ruleForm.currentToken
      }
      const getUrl = getMockLoginFunc(this)
      window.getIssueUrl = (query = {}) => {
        return getUrl(query, this.params)
      }
      // console.log(window.getIssueUrl)
      // const salesman = this.ruleForm.salesmanList.find(item => item.id === this.ruleForm.currentSalesman)
      // sessionStorage.setItem('SalesmanInfo', salesman)
      // window.site_title = salesman ? `移动出单-${salesman.idName}&${salesman.phone}` : '移动出单'
      window.openIssueUrl()
    },
    // 关闭当前页面在nav的标签
    closeruleForm() {
      const arr = Array.from(this.visitedViews)
      const view = arr.find(item => item.path === '/insurance/quickissueModal')
      console.log(view)
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView)
          } else {
            this.$router.push('/')
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" >
  .issue-wrap {
    .el-dialog {
      margin-top: 22vh !important;
    }
    .el-dialog__header {
      padding: 20px 20px 20px;
      text-align: left;
      border-bottom: 1px solid #aba6a6b5;
    }
    .el-dialog__footer {
      padding-top: 20px;
      text-align: right;
      border-top: 1px solid #aba6a6b5;
    }
    .el-input {
      width: 200px;
    }
    .el-form-item__label {
      width: 150px;
      text-align: center;
    }
    .redItem .el-form-item__label{
      color: red;
    }

  }
  .el-tree-select-dropdown {
    z-index: 9999 !important;
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
