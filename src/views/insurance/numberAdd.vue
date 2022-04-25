<template>
  <!-- eslint-disable -->
  <div class="number-add" v-loading="isLoading">
    <el-form ref="numberAdd" :model="form" :rules="rules" class="number-form" label-position="left" label-width="120px">
      <el-form-item label="配置地区：" prop="provinceCode">
        <el-select v-model="form.provinceCode" size="small" clearable filterable placeholder="全部地区" @change="setProvinceName">
          <el-option v-for="item in policyAreasList.data" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="isAnyAdminChannel" label="所属渠道：" prop="userSourceCode">
        <el-select v-model="form.userSourceCode" size="small" clearable filterable placeholder="所属渠道" @change="getChannelCode">
          <el-option v-for="item in formChannelSelectList.data" :key="item.code" :label="item.shortName" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="所属机构" prop="comcode">
        <my-tree-select :options="formOrgSelectList.data" :disabled="isAnyAdminChannel && !form.userSourceCode" :value="form.comcode" :normalizer="normalizer" no-options-text="无数据" no-children-text="" placeholder="选择机构" @open="getFormOrg" @select="getChoiceFormOrgan" @input="form.comcode = $event" />
      </el-form-item>
      <el-form-item label="保险公司分类：" prop="insureCompanySourceId">
        <el-select v-model="form.insureCompanySourceId" size="small" clearable filterable placeholder="选择保险公司分类" @change="setInsureCompanySource">
          <el-option v-for="item in companyList.data" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="isDaTong" label="所属保险公司：" class="number-company-brance" prop="issueOfficeData">
        <el-cascader :options="companyBrance.data" v-model="form.issueOfficeData" size="small" placeholder="选择保险公司" @focus="getClickCompany" @change="getSelectCompany" />
      </el-form-item>
      <el-form-item v-if="channelId" label="工号名称：" prop="insureChannelName">
        <el-input v-model="form.insureChannelName" placeholder="请输入工号名称" size="small" />
      </el-form-item>
      <el-form-item label="工号：" prop="jobNumber">
        <el-input v-model="form.jobNumber" placeholder="请输入工号" size="small" />
      </el-form-item>
      <el-form-item label="工号密码：" prop="jobNumberPassword">
        <el-input v-model="form.jobNumberPassword" placeholder="请输入工号密码" size="small" />
      </el-form-item>
      <el-form-item label="使用状态" prop="enable">
        <el-select v-model="form.enable" clearable filterable placeholder="使用状态" size="small">
          <el-option v-for="item in companyTypeList.data" :key="item.key" :label="item.value" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item label="登录地址：" prop="url">
        <el-input v-model="form.url" placeholder="请输入登录地址" size="small" />
      </el-form-item>
      <el-form-item v-if="form.insureCompanySourceId === 16" label="VPN地址：" prop="vpnAddress">
        <el-input v-model="form.vpnAddress" placeholder="请输入VPN地址" size="small" />
      </el-form-item>
      <el-form-item v-if="form.insureCompanySourceId === 16" label="VPN登录名：" prop="vpnUserName">
        <el-input v-model="form.vpnUserName" placeholder="请输入VPN登录名" size="small" />
      </el-form-item>
      <el-form-item v-if="form.insureCompanySourceId === 16" label="VPN密码：" prop="vpnPassword">
        <el-input v-model="form.vpnPassword" placeholder="请输入VPN密码" size="small" />
      </el-form-item>
      <el-form-item v-if="form.insureCompanySourceId === 10 || form.insureCompanySourceId === 1" label="代理地址：" prop="proxyAddress">
        <el-input v-model="form.proxyAddress" placeholder="请输入代理地址" size="small" />
      </el-form-item>
      <el-form-item label="描述：" prop="descript">
        <el-input v-model="form.descript" placeholder="请输入工号配置的说明" size="small" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import MyTreeSelect from '@/components/MyTreeSelect/index'
import { mapGetters } from 'vuex'
import {
  getinsureCompanyInfo,
  getChannelEffective,
  getOrgData,
  getBindChannelParents,
  getPolicyAreasData,
  getCompanysData
} from '@/api/badgenum'
export default {
  components: {
    MyTreeSelect
  },
  props: {
    editData: {
      type: Object,
      default() {
        return {}
      }
    },
    channelId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      isLoading: false,
      isDaTong: false,
      formChannelSelectList: {
        data: []
      },
      policyAreasList: {
        data: []
      },
      companyList: {
        data: []
      },
      companyBrance: {
        data: []
      },
      companyTypeList: {
        data: [{ key: 0, value: '可用' }, { key: 1, value: '禁用' }]
      },
      formOrgSelectList: {
        disabled: true,
        model: '请选择机构',
        props: { value: 'key', label: 'title', children: 'children' },
        data: []
      },
      form: {
        company0: null, // 所属机构
        company1: null, // 所属机构
        company2: null, // 所属机构
        company3: null, // 所属机构
        company4: null, // 所属机构
        company5: null, // 所属机构
        company6: null, // 所属机构
        comcode: null, // 所属机构选择的值
        userSourceCode: null, // 所属渠道
        provinceCode: null, // 保监地区
        provinceName: null, // 保监地区
        proxyAddress: null, // 代理地址
        insureCompanySourceId: null, // 保险公司分类
        insureCompanySourceName: null, // 保险公司分类
        issueOfficeData: [], // 所属保险公司
        branchOfficeName: null, // 所属保险公司2
        branchOfficeId: null, // 所属保险公司2
        centerSubOfficeId: null, // 所属保险公司3
        centerSubOfficeName: null, // 所属保险公司3
        headOfficeId: null, // 所属保险公司1
        headOfficeName: null, // 所属保险公司1
        subOfficeId: null, // 所属保险公司4
        subOfficeName: null, // 所属保险公司4
        enable: null, // 启用状态
        insureChannelName: null, // 工号名称
        jobNumber: null, // 工号
        jobNumberPassword: null, // 工号密码
        url: null, // 地址
        descript: null, // 描述
        selectedCompanyLoca: [],
        vpnAddress: null,
        vpnPassword: null,
        vpnUserName: null
      },
      rules: {
        comcode: [{ required: true, message: '请选择机构', trigger: 'blur' }],
        userSourceCode: [
          { required: true, message: '请选择渠道', trigger: 'change' }
        ],
        provinceCode: [
          { required: true, message: '请选择地区', trigger: 'change' }
        ],
        insureCompanySourceId: [
          { required: true, message: '请选择保险公司', trigger: 'change' }
        ],
        issueOfficeData: [
          {
            validator: this.validateIssueOffice,
            trigger: 'change'
          }
        ],
        enable: [
          { required: true, message: '请选择使用状态', trigger: 'change' }
        ],
        insureChannelName: [
          { required: true, message: '请输入工号名称', trigger: 'blur' }
        ],
        jobNumber: [{ required: true, message: '请输入工号', trigger: 'blur' }],
        jobNumberPassword: [
          { required: true, message: '请输入工号密码', trigger: 'blur' }
        ],
        url: [{ required: true, message: '请输入登录地址', trigger: 'blur' }],
        vpnAddress: [
          { required: true, message: '请输入VPN地址', trigger: 'blur' }
        ],
        vpnUserName: [
          { required: true, message: '请输入VPN登录名', trigger: 'blur' }
        ],
        vpnPassword: [
          { required: true, message: '请输入VPN密码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否是管理员渠道
    ])
  },
  watch: {
    'form.comcode'(val) {
      this.$refs.numberAdd.validateField('comcode')
    },
    'form.issueOfficeData'(val) {
      this.$refs.numberAdd.validateField('issueOfficeData')
    }
  },
  async created() {
    const code = this.$store.getters.userAll.data.channelCode
    if (code === '001') {
      this.isDaTong = true
    }
    this.formChannelSelectList = await getChannelEffective()
    this.policyAreasList = await getPolicyAreasData()
    const resCom = await getCompanysData()
    const arr = []
    for (let i = 0, len = resCom.data.length; i < len; i++) {
      if (resCom.data[i]['name'] === '平安.') {
        arr.push(resCom.data[i])
      }
      if (resCom.data[i]['name'] === '中银.') {
        arr.push(resCom.data[i])
      }
      if (resCom.data[i]['isMock'] === 0) {
        if (resCom.data[i]['name'] === '富德') {
          arr.push(resCom.data[i])
        }
        if (resCom.data[i]['name'] === '诚泰') {
          arr.push(resCom.data[i])
        }
        if (resCom.data[i]['name'] === '利宝') {
          arr.push(resCom.data[i])
        }
        if (resCom.data[i]['name'] === '人保') {
          arr.push(resCom.data[i])
        }
        if (resCom.data[i]['name'] === '太平洋') {
          arr.push(resCom.data[i])
        }
        if (resCom.data[i]['name'] === '亚太') {
          arr.push(resCom.data[i])
        }
        if (resCom.data[i]['name'] === '太平') {
          arr.push(resCom.data[i])
        }
        if (resCom.data[i]['name'] === '安盛天平') {
          arr.push(resCom.data[i])
        }
        if (resCom.data[i]['name'] === '国寿财') {
          arr.push(resCom.data[i])
        }
        if (resCom.data[i]['name'] === '华安') {
          arr.push(resCom.data[i])
        }
        if (resCom.data[i]['name'] === '阳光') {
          arr.push(resCom.data[i])
        }
        // if(resCom.data[i]['name'] === '中煤'){
        //     arr.push(resCom.data[i]);
        // }
      }
    }
    this.companyList.data = arr
    if (this.channelId) {
      this.isLoading = true
      this.companyBrance = await getinsureCompanyInfo({
        company: this.editData.insureCompanySourceId,
        sourceId: this.editData.userSourceCode
      })
      const orgRes = await getOrgData({
        areaCode: this.editData.provinceCode,
        channelCode: this.editData.userSourceCode,
        filterTeamCompany: true,
        token: this.$store.getters.token
      })
      this.formOrgSelectList.data = orgRes.data.data
      this.form = this.editData
      this.form.insureCompanySourceId = parseInt(
        this.editData.insureCompanySourceId
      )
      this.form.comcode = await this.getChoiceOrgan(this.editData)
      setTimeout(() => {
        this.$refs.numberAdd.validateField('comcode')
      })
      const arr = [
        this.editData.headOfficeId,
        this.editData.branchOfficeId,
        this.editData.centerSubOfficeId,
        this.editData.subOfficeId
      ]
      this.form.issueOfficeData = arr
      if (!this.editData.insureChannelName) {
        this.form.insureChannelName =
          this.editData.provinceName +
          this.editData.insureName +
          '-' +
          this.editData.jobNumber
      }
      this.isLoading = false
    }
  },
  methods: {
    validateIssueOffice(value, rule, callback) {
      if (!this.form.issueOfficeData || this.form.issueOfficeData.length <= 0) {
        callback(new Error('请选择所属保险公司'))
      } else {
        callback()
      }
    },
    getChannelCode(val) {
      if (val === '001') {
        this.isDaTong = true
      }
    },
    // 渲染渠道
    getChoiceOrgan(data) {
      let val = ''
      if (data.company0) {
        val = data.company0
      }
      if (data.company1) {
        val = data.company1
      }
      if (data.company2) {
        val = data.company2
      }
      if (data.company3) {
        val = data.company3
      }
      if (data.company4) {
        val = data.company4
      }
      if (data.company5) {
        val = data.company5
      }
      if (data.company6) {
        val = data.company6
      }
      return val
    },
    // 选择地区
    setProvinceName(val) {
      console.log(val)
      this.policyAreasList.data.map(item => {
        if (item.id === val) {
          this.form.provinceName = item.name
        }
      })
    },
    // 选择保险公司分类
    setInsureCompanySource(val) {
      this.companyList.data.map(item => {
        if (item.id === val) {
          this.form.insureCompanySourceName = item.name
        }
      })
    },
    // 选取所属渠道
    getChoiceFormOrgan(val) {
      console.log(val)
      const comArr = [val.key]
      getBindChannelParents(comArr)
        .then(res => {
          const pareArr = res.data.data[val.key]
          this.form.company0 = null
          this.form.company1 = null
          this.form.company2 = null
          this.form.company3 = null
          this.form.company4 = null
          this.form.company5 = null
          this.form.company6 = null
          for (let i = 0; i < pareArr.length; i++) {
            if (pareArr[i].level === 0) {
              this.form.company0 = pareArr[i].id
            }
            if (pareArr[i].level === 1) {
              this.form.company1 = pareArr[i].id
            }
            if (pareArr[i].level === 2) {
              this.form.company2 = pareArr[i].id
            }
            if (pareArr[i].level === 3) {
              this.form.company3 = pareArr[i].id
            }
            if (pareArr[i].level === 4) {
              this.form.company4 = pareArr[i].id
            }
            if (pareArr[i].level === 5) {
              this.form.company5 = pareArr[i].id
            }
            if (pareArr[i].level === 6) {
              this.form.company6 = pareArr[i].id
            }
          }
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 点击获取表单机构
    getFormOrg() {
      if (!this.isAnyAdminChannel) {
        this.form.userSourceCode = this.$store.getters.userAll.data.channelCode
      }
      getOrgData({
        channelCode: this.form.userSourceCode,
        areaCode: this.form.provinceCode,
        filterTeamCompany: true,
        token: this.$store.getters.token
      })
        .then(res => {
          this.formOrgSelectList.data = res.data.data
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 点击获取所属保险公司
    getClickCompany() {
      if (!this.isAnyAdminChannel) {
        this.form.userSourceCode = this.$store.getters.userAll.data.channelCode
      }
      getinsureCompanyInfo({
        company: this.form.insureCompanySourceId,
        sourceId: this.form.userSourceCode
      })
        .then(res => {
          this.companyBrance.data = res.data
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 选取归属保险公司
    getSelectCompany(val) {
      this.form.selectedCompanyLoca = val
      const arr = []
      for (let i = 0; i < val.length; i++) {
        this.getArray(this.companyBrance.data, val[i], arr)
      }
      if (arr.length > 0) {
        if (arr[0]) {
          this.form.headOfficeId = arr[0].value
          this.form.headOfficeName = arr[0].label
        }
        if (arr[1]) {
          this.form.branchOfficeId = arr[1].value
          this.form.branchOfficeName = arr[1].label
        }
        if (arr[2]) {
          this.form.centerSubOfficeId = arr[2].value
          this.form.centerSubOfficeName = arr[2].label
        }
        if (arr[3]) {
          this.form.subOfficeId = arr[3].value
          this.form.subOfficeName = arr[3].label
        }
      }
    },
    // 递归函数
    getArray(data, id, arr) {
      for (var i in data) {
        if (data[i].id === id) {
          arr.push(data[i])
          return data[i]
        } else {
          this.getArray(data[i].children, id, arr)
        }
      }
    },
    // 处理树选择Key
    normalizer(node) {
      if (node.children && node.children.length === 0) {
        delete node.children
      }
      return {
        id: node.key,
        label: node.title,
        children: node.children
      }
    }
  }
}
</script>

<style lang="scss">
.number-add {
  padding: 40px;
  .number-company-brance {
    .el-form-item__label::before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }
}
</style>

