<template>
  <!--手动抓单 start -->
  <div v-loading="isLoading" class="grabAll">
    <div class="dialogWrap" style="padding-bottom:20px;width:100%;margin:auto;">
      <div style="text-align:center;padding-top:20px;">
        <el-radio-group v-model="grabTitle" @change="handleGrabTitle">
          <el-radio-button label="保单号" />
          <el-radio-button label="车牌号" />
        </el-radio-group>
      </div>
      <div class="DialogVisibleDGZD">
        <!-- <el-form ref="sdzdForm" :model="sdzdForm" :rules="zdRrules" label-width="100px"> -->
        <el-form ref="selectValue" :model="selectValue" :rules="rule1" :validate-on-rule-change="false" label-width="100px" class="demo-selectValue">
          <el-form-item v-if="isAnyAdminChannel" label="所属渠道" prop="channel">
            <el-select
              v-model="selectValue.channel"
              filterable
              clearable
              placeholder="请选择所属渠道"
              value-key="code"
              style="width:380px"
              @change="handleChannelChange">
              <el-option v-for="item in policyChannelList" :key="item.id" :label="item.shortName" :value="item"/>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isDistribution||isNetWork" label="投保地区" prop="area">
            <el-cascader
              ref="areas"
              :props="Areaprops"
              :options="policyAreaList"
              v-model="selectValue.area"
              clearable
              style="width:380px"
              @change="handleAreaChange"/>
          </el-form-item>
          <el-form-item v-if="isNetWork" label="机构网点" prop="network">
            <el-select
              ref="netWork"
              v-model="selectValue.netWork"
              :loading="netWorkList.loading"
              filterable
              clearable
              placeholder="请选择机构网点"
              style="width:380px"
              @change="handleNetWorkChange"
              @focus="handleNetWorkFocus">
              <el-option v-for="item in netWorkList.data" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="所属机构" prop="organ">
            <el-tree-select
              ref="treeList"
              v-model="selectValue.organ"
              :data="organOptions"
              :default-expand-all="false"
              clearable
              filterable
              placeholder="请选择机构"
              style="width: 380px;"
              @focus="queryOrgan"
              @change="handleOrganChange" />
          </el-form-item>
          <el-form-item label="保险公司" prop="company">
            <el-select
              ref="companySel"
              v-model="selectValue.company"
              :loading="policyCompanyList.loading"
              value-key="companyId"
              filterable
              clearable
              placeholder="请选择保险公司"
              style="width:380px"
              @focus="getCompanyList"
              @change="handleCompanyList">
              <el-option v-for="item in policyCompanyList.data" :key="item.companyId" :label="item.companyName" :value="item"/>
            </el-select>
          </el-form-item>
          <el-form-item label="出单工号" prop="account">
            <el-select
              ref="accountList"
              v-model="selectValue.account"
              :loading="acountList.loading"
              value-key="id"
              filterable
              clearable
              placeholder="请选择出单工号"
              style="width:380px"
              @focus="getAcount" >
              <el-option v-for="item in acountList.data" :label="item.channelName" :key="item.id" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="isAnyAdminChannel" label="出单员" prop="operator">
            <el-select
              v-model="selectValue.operator"
              :loading="operatorList.loading"
              value-key="id"
              filterable
              clearable
              placeholder="请选择出单员"
              style="width:380px" >
              <el-option v-for="item in operatorList.data" :key="item.id" :label="item.name" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="业务员" prop="salesman">
            <el-select
              v-model="selectValue.salesman"
              :loading="salemanList.loading"
              value-key="id"
              filterable
              clearable
              placeholder="请选择业务员"
              style="width:380px" >
              <el-option v-for="item in salemanList.data" :key="item.id" :label="item.name" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="grabTitle==='保单号'" label="保单号" prop="policyNo">
            <el-input v-model="selectValue.policyNo" :placeholder="policyInput" rows="6" type="textarea" style="width:380px;"/>
          </el-form-item>
          <el-form-item v-if="grabTitle==='车牌号'" label="车牌号" prop="license">
            <el-input v-model="selectValue.license" :placeholder="licenseInput" rows="6" type="textarea" style="width:380px;" />
          </el-form-item>
          <!-- <el-form-item >
            <el-button type="primary" style="width:380px" @click="getPolicy('selectValue')">获取保单</el-button>
          </el-form-item> -->
        </el-form>
        <!-- <el-form ref="sdzdForm" :model="sdzdForm" :rules="zdRrules" label-width="100px">
          <div class="grid-content">
            <el-form-item prop="companyId" label="保险公司">
              <el-select v-model="sdzdForm.companyId" filterable placeholder="请选择保险公司" size="small" @change="changeCompang">
                <el-option v-for="item in companylist" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item prop="channelId" label="选择工号">
              <el-select v-model="sdzdForm.channelId" filterable type="number" size="small" placeholder="请选择工号">
                <el-option v-for="item in channellist" :key="item.id" :label="item.channelName" :value="item.id" />
              </el-select>
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item prop="policyType" label="险种类型">
              <el-select v-model="sdzdForm.policyType" size="small" placeholder="选择险种类型">
                <el-option v-for="item in policyTypelist" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item ref="myTree" label="所属团队" prop="team">
            <my-tree-select v-model="sdzdForm.team" :options="treeAllList" :normalizer="normalizer" :disable-branch-nodes="true" class="ledger-select_organ" no-options-text="数据加载中..." placeholder="选择机构" no-results-text="未找到结果" @close="headleTeamClick" @open="getOrgan" />
          </el-form-item>
          <div class="grid-content">
            <el-form-item prop="userId" label="业务员">
              <el-select v-model="sdzdForm.userId" filterable placeholder="请选择业务员" size="small" @change="changeuserId">
                <el-option v-for="item in SalesByCompanylist" :key="item.id" :label="item.idName" :value="item.id" />
              </el-select>
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item v-if="grabTitle==='保单号'" label="保单号" prop="arrs">
              <el-input v-model="sdzdForm.arrs" size="small" placeholder="请输入保单号" />
            </el-form-item>
            <el-form-item v-else label="车牌号" prop="arrs">
              <el-input v-model="sdzdForm.arrs" size="small" placeholder="请输入车牌号" />
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item label="备注">
              <el-input v-model="sdzdForm.common" type="textarea" placeholder="请输入备注信息" />
            </el-form-item>
          </div>
        </el-form> -->
      </div>
    </div>
  </div>
</template>
<script>
import {
  getPolicyChannel,
  judgeNetWork,
  getPolicyArea,
  getPolicyNetWork,
  getPolicyOrgan,
  getPolicyCompany,
  getPolicyAcount,
  getPolicyOperator,
  getPolicySalesman } from '@/api/findPolicy'
// import { zdRrules } from '@/utils/policydata'
import ElTreeSelect from '@/components/ElTreeSelect/index'
// import {
//   // 保险公司
//   policyBelongCompany,
//   // 工号列表
//   getChannelListData,
//   // 业务员
//   getquerySalesByCompanyId
// } from '@/api/mytask'
// 机构树
// import { getCompanyEffective } from '@/api/ledger'
// import MyTreeSelect from '@/components/MyTreeSelect/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Edit',
  components: {
    ElTreeSelect
  },
  data() {
    return {
      treeflag: true,
      emptyData: '暂无数据',
      organName: '', // 机构名称
      policyChannelList: [],
      channelType: 0,
      isDistribution: false, // 分销渠道 投保地区
      isNetWork: false, // 是否网点机构
      activeIndex: '1', // 当前激活的index
      isPolicyNo: true,
      companyList: {
        loading: false,
        data: []
      },
      Areaprops: {
        value: 'value',
        label: 'name',
        children: 'children'
      },
      netWorkList: {
        loading: false,
        data: []
      },
      // 模拟保险公司
      policyCompanyList: {
        loading: false,
        data: []
      },
      // 出单工号
      acountList: {
        loading: false,
        data: []
      },
      // 出单员
      operatorList: {
        loading: false,
        data: []
      },
      // 业务员
      salemanList: {
        loading: false,
        data: []
      },
      organOptions: [],
      organLoading: false,
      policyAreaList: [],
      selectValue: {
        channel: '',
        company: '',
        account: '',
        operator: '',
        organ: '',
        salesman: '',
        policyNo: '',
        license: ''
      },
      rule1: {
        channel: [
          { required: true, message: '请选择所属渠道', trigger: 'change' }
        ],
        area: [
          { required: true, message: '请选择投保地区', trigger: 'change' }
        ],
        netWork: [
          { required: true, message: '请选择机构网点', trigger: 'change' }
        ],
        company: [
          { required: true, message: '请选择保险公司', trigger: 'change' }
        ],
        account: [
          { required: true, message: '请选择出单工号', trigger: 'change' }
        ],
        operator: [
          { required: true, message: '请选择出单员', trigger: 'change' }
        ],
        organ: [
          { required: true, message: '请选择所属机构', trigger: 'change' }
        ],
        salesman: [
          { required: true, message: '请选择所属业务员', trigger: 'change' }
        ],
        policyNo: [
          { required: true, message: '保单号不能为空', trigger: 'bur' }
        ],
        license: [
          { required: true, message: '车牌号不能为空', trigger: 'bur' }
        ]
      },
      licenseInput: '请输入车牌号，单次最多支持输入20个。多个车牌号号请换行输入，如：\n京A123456\n京A123456',
      policyInput: '请输入相同险种类型的保单号，单次最多支持输入20个。多个保单号请换行输入，如：\nPDZA20190101123446789\nPDZA20190101123446790',
      isLoading: false,
      grabTitle: '保单号'
      // zdRrules,
      // comuserName: '',
      // DGZDactiveName: 'first',
      // companylist: [],
      // channellist: [],
      // SalesByCompanylist: [],
      // treeAllList: [],
      // // 保单种类循环
      // policyTypelist: [
      //   {
      //     label: '商业险',
      //     value: 1
      //   },
      //   {
      //     label: '交强险',
      //     value: 2
      //   },
      //   {
      //     label: '交商共保',
      //     value: 3
      //   }
      // ],
      // sdzdForm: {
      //   companyId: '', // 保险公司
      //   channelId: '', // 工号
      //   policyType: '', // 险种类型 1:交商共保  2:单交强  3:单商业
      //   team: '', // 所属团队
      //   userId: '', // 业务员
      //   arrs: '', // 列表
      //   common: '' // 说明
      //   // "type":1  1:保单号  2:车牌号
      // },
      // sdzdFormarrs: '',
      // btnLoginShow: false,
      // grabTitle: '保单号',

    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel'
    ])
  },
  watch: {
    'sdzdForm.team': function(val) {
      const myTree = this.$refs.myTree
      if (myTree.unFristRender) {
        myTree.$emit.apply(myTree, ['el.form.change'].concat(val))
      } else {
        myTree.unFristRender = true
      }
    }
  },
  created() {
    if (this.isAnyAdminChannel) {
      this.getPolicyChannelData() // 运维才能获取渠道信息
    }
    this.handleGrabTitle()
    // this.btnPLZD()
    // this.$emit('GrabTitle', this.grabTitle)
  },
  methods: {
    // 获取保单
    getPolicy() {
      this.$refs['selectValue'].validate((valid) => {
        if (valid) {
          console.log('submit!')
          const params = {
            channelId: this.selectValue.account.id, // 工号ID ,
            channelName: this.selectValue.account.channelName, // 工号名称 ,
            companyId: this.selectValue.company.companyId, // 保险公司Id
            companyName: this.selectValue.company.companyName, // 保险公司名称 ,
            operatorId: this.selectValue.operator.id, // 出单员ID ,
            operatorName: this.selectValue.operator.idName, // 出单员名称
            sourceCode: this.selectValue.channel.code, // 渠道编码 ,
            sourceName: this.selectValue.channel.shortName, // 渠道名称 ,
            team: this.organName, // 机构名称 ,
            teamId: this.selectValue.organ, // 机构Id ,
            userId: this.selectValue.salesman.id, // 业务员ID ,
            userName: this.selectValue.salesman.name // 业务员名称
          }
          if (this.channelType === 1) {
            if (this.selectValue.area.length !== 0) {
              params.province = this.selectValue.area[0]
              params.city = this.selectValue.area[1]
            }
          }
          if (this.channelType === 2) {
            if (this.selectValue.area.length !== 0) {
              params.province = this.selectValue.area[0]
              params.city = this.selectValue.area[1]
            }
            params.netWork = this.selectValue.netWork
          }
          if (this.grabTitle === '保单号') { // 保单号
            params.type = 1
            params.arrs = this.selectValue.policyNo.replace(/\s/gm, '').split('\n')
            // params.arrs = this.selectValue.policyNo.trim().split('\n')
          } else { // 车牌号
            params.type = 2
            params.arrs = this.selectValue.license.replace(/\s/gm, '').split('\n')
          }
          console.log(params)
          this.$emit('handleSubmit', params)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 判断是否投保地区还是机构网点
    judgeChannelType(sourceCode) {
      if (!this.selectValue.channel) {
        return
      }
      console.log('判断')
      judgeNetWork(this.selectValue.channel.code).then(res => {
        // console.log(res)
        this.channelType = res.data
        if (this.channelType === 1) {
          this.isDistribution = true
          this.isNetWork = false
          this.getPolicyArea()
        } else if (this.channelType === 2) {
          this.isDistribution = true
          this.isNetWork = true
          this.getPolicyArea()
        } else {
          this.isDistribution = false
          this.isNetWork = false
        }
      })
    },
    // 获取抓单页面所属渠道
    getPolicyChannelData() {
      getPolicyChannel().then(res => {
        // console.log(res)
        this.policyChannelList = res.data
        // this.isDistribution = true
      })
    },
    // 获取抓单页面投保地区
    getPolicyArea() {
      console.log('投保地区')
      const sourceCode = this.selectValue.channel.code || ''
      getPolicyArea(sourceCode).then(res => {
        // console.log(res)
        this.policyAreaList = res.data
        // return res.data
      })
    },
    // 获取机构网点
    getNetWork() {
      this.netWorkList.loading = true
      // console.log(this.selectValue.area)
      const area = this.selectValue.area
      if (!this.selectValue.area) {
        this.netWorkList.loading = false
        this.netWorkList.data = []
        return
      }
      const params = {
        sourceCode: this.selectValue.channel.code,
        province: area[0],
        city: area[1]
      }
      getPolicyNetWork(params).then(res => {
        // console.log(res)
        this.netWorkList.data = res.data
        this.netWorkList.loading = false
      }).catch(e => {
        this.netWorkList.loading = false
        console.log(e)
      })
    },
    // 获取机构
    queryOrgan() {
      this.organLoading = true
      // 非运维的取token里面的渠道
      let channelCode
      if (!this.isAnyAdminChannel) {
        channelCode = JSON.parse(localStorage.getItem('userAll')).data.channelCode
        this.channelType = JSON.parse(localStorage.getItem('userAll')).data.channelType
      } else {
        if (!this.selectValue.channel) {
          this.organOptions = []
          // this.emptyData = '暂无数据'
          return
        }
        channelCode = this.selectValue.channel.code
      }
      getPolicyOrgan(channelCode).then(res => {
        this.organLoading = false
        const result = res.data
        const json = JSON.parse(
          JSON.stringify(result)
            .replace(/title/g, 'label')
            .replace(/key/g, 'value')
        )
        this.organOptions = json
        console.log(this.organOptions)
      }).catch(e => {
        this.organLoading = false
        console.log(e)
      })
    },
    // 获取保险公司
    getCompanyList() {
      console.log('获取保险公司')
      this.policyCompanyList.loading = true
      const area = this.selectValue.area
      let channelCode // 渠道编码
      if (!this.isAnyAdminChannel) { // 是否运维
        channelCode = JSON.parse(localStorage.getItem('userAll')).data.channelCode
      } else {
        channelCode = this.selectValue.channel.code
      }
      if (!this.selectValue.organ || !channelCode) {
        console.log('通用')
        this.policyCompanyList.loading = false
        this.policyCompanyList.data = []
        return
      }
      const params = {
        sourceCode: channelCode,
        teamId: this.selectValue.organ
      }
      if (this.channelType === 1) { // 省市分销渠道
        console.log('分销1')
        if (this.selectValue.area.length !== 2) {
          this.policyCompanyList.loading = false
          this.policyCompanyList.data = []
          return
        }
        params.province = area[0]
        params.city = area[1]
      }
      if (this.channelType === 2) { // 网点分销渠道
        if (!this.selectValue.area || !this.selectValue.netWork) {
          console.log('分销2')
          this.policyCompanyList.loading = false
          this.policyCompanyList.data = []
          return
        }
        params.netWork = this.selectValue.netWork
        params.province = area[0]
        params.city = area[1]
      }
      getPolicyCompany(params).then(res => {
        this.policyCompanyList.loading = false
        // console.log(res)
        this.policyCompanyList.data = res.data.filter(v => {
          if (v.mock === 1) return true
        })
      }).catch(e => {
        this.policyCompanyList.loading = false
        console.log(e)
      })
    },
    // 获取出单工号
    getAcount() {
      let channelCode // 渠道编码
      if (!this.isAnyAdminChannel) { // 是否运维
        channelCode = JSON.parse(localStorage.getItem('userAll')).data.channelCode
      } else {
        channelCode = this.selectValue.channel.code
      }
      if (!this.selectValue.company) {
        this.acountList.loading = false
        this.acountList.data = []
        console.log('先选择保险公司')
        return
      }
      if (!channelCode || !this.selectValue.organ) {
        console.log('通用')
        this.acountList.loading = false
        this.acountList.data = []
        return
      }
      // 必填部分
      const params = {
        sourceCode: channelCode,
        teamId: this.selectValue.organ,
        companyId: this.selectValue.company.companyId
      }
      this.acountList.loading = true
      const area = this.selectValue.area
      if (this.channelType === 1) { // 省市分销渠道
        console.log('分销1')
        if (area.length !== 2) {
          this.acountList.loading = false
          this.acountList.data = []
          return
        }
        params.province = area[0]
        params.city = area[1]
      }
      if (this.channelType === 2) { // 网点分销渠道
        if (!this.selectValue.area || !this.selectValue.netWork) {
          console.log('分销2')
          this.acountList.loading = false
          this.acountList.data = []
          return
        }
        params.province = area[0]
        params.city = area[1]
        params.netWork = this.selectValue.netWork
      }
      getPolicyAcount(params).then(res => {
        this.acountList.loading = false
        // console.log(res)
        this.acountList.data = res.data
      }).catch(e => {
        this.acountList.loading = false
        console.log(e)
      })
    },
    // 获取出单员
    getOperator() {
      this.operatorList.loading = true
      console.log('获取出单员')
      let channelCode
      if (!this.isAnyAdminChannel) { // 是否运维
        channelCode = JSON.parse(localStorage.getItem('userAll')).data.channelCode
      } else {
        channelCode = this.selectValue.channel.code
      }
      if (!channelCode || !this.selectValue.organ) {
        console.log('通用')
        this.operatorList.loading = false
        this.operatorList.data = []
        return
      }
      // 必填部分
      const params = {
        sourceCode: channelCode, // 所属渠道
        teamId: this.selectValue.organ // 所属机构
      }
      getPolicyOperator(params).then(res => {
        this.operatorList.loading = false
        const operatorData = res.data
        operatorData.forEach(item => {
          if (item.idName) {
            var fullName = item.idName + '--'
          } else {
            fullName = ''
          }
          item.name = fullName + item.phone
        })
        this.operatorList.data = operatorData
        // console.log(this.operatorList.data)
      }).catch(e => {
        this.operatorList.loading = false
        console.log(e)
      })
    },
    // 获取业务员
    getSaleman() {
      this.salemanList.loading = true
      console.log('获取业务员')
      let channelCode // 渠道编码
      if (!this.isAnyAdminChannel) { // 是否运维
        channelCode = JSON.parse(localStorage.getItem('userAll')).data.channelCode
      } else {
        channelCode = this.selectValue.channel.code
      }
      if (!channelCode || !this.selectValue.organ) {
        console.log('通用')
        this.salemanList.loading = false
        this.salemanList.data = []
        return
      }
      // 必填部分
      const params = {
        sourceCode: channelCode, // 所属渠道
        teamId: this.selectValue.organ // 所属机构
      }
      getPolicySalesman(params).then(res => {
        this.salemanList.loading = false
        // console.log(res)
        const salesmanData = res.data
        salesmanData.forEach(item => {
          if (item.idName) {
            var fullName = item.idName + '--'
          } else {
            fullName = ''
          }
          item.name = fullName + item.phone
        })
        this.salemanList.data = salesmanData
        // console.log(this.salemanList.data)
      }).catch(e => {
        this.salemanList.loading = false
        console.log(e)
      })
    },
    normalizer(node) {
      console.log(node)
      if (node.children && node.children.length === 0) {
        delete node.children
      }
      return {
        id: node.key,
        label: node.title,
        children: node.children
      }
    },
    // 机构变化时的处理
    handleOrganChange() {
      const selectNode = this.$refs.treeList.$refs.tree.getCurrentNode()
      console.log('选中的node')
      this.organName = selectNode.label
      this.$emit('getOrganName', this.organName)
      console.log(selectNode)
      if (this.selectValue.company) {
        this.selectValue.company = null
      }
      if (this.selectValue.account) {
        this.selectValue.account = ''
      }
      if (this.selectValue.operator) {
        this.selectValue.operator = ''
      }
      if (this.selectValue.salesman) {
        this.selectValue.salesman = ''
      }
      this.getOperator() // 获取出单员
      this.getSaleman() // 获取业务员
    },
    // 保险公司变化后的处理
    handleCompanyList() {
      if (this.selectValue.account) {
        this.selectValue.account = ''
      }
    },
    openTree() {
      console.log('展开树形结构')
      console.log(this.$refs.companySel)
      this.$refs.companySel.blur()
      this.$refs.accountList.blur()
    },
    // 把头信息传给父组件
    handleGrabTitle() {
      // console.log(this.grabTitle)
      this.$emit('GrabTitle', this.grabTitle)
    }
    // // 根据保险公司ID获取工号列表
    // changeCompang(data) {
    //   const blcs = this.$store.getters.userAll.data.belongCompanys
    //   const maxItem = blcs.sort((a, b) => b.level - a.level)[0]
    //   getChannelListData({ belongCompanys: [maxItem.id] }, data).then(res => {
    //     this.channellist = res.data
    //   })
    // },
    // // 获取点击的业务员这个是为了传给后台用的。
    // changeuserId(data) {
    //   const userIdItem = this.SalesByCompanylist.filter(
    //     item => item.id === data
    //   )[0]
    //   this.$emit('comuserName', userIdItem.idName)
    // },
    // // 团队获取
    // getOrgan() {
    //   getCompanyEffective()
    //     .then(res => {
    //       this.treeAllList = res.data
    //     })
    //     .catch(err => {
    //       console.warn(err)
    //     })
    // },
    // normalizer(node) {
    //   if (node.children && node.children.length === 0) {
    //     delete node.children
    //   }
    //   return {
    //     id: node.key,
    //     label: node.title,
    //     children: node.children
    //   }
    // },
    // // 获取团队id  给业务员
    // headleTeamClick(value) {
    //   getquerySalesByCompanyId(value)
    //     .then(res => {
    //       this.SalesByCompanylist = res.data
    //     })
    //     .catch(err => {
    //       console.warn(err)
    //     })
    // },
    // // 点击展开录入保单
    // btnPLZD() {
    //   // 保险公司列表
    //   const blcs = this.$store.getters.userAll.data.belongCompanys
    //   const maxItem = blcs.sort((a, b) => b.level - a.level)[0]
    //   policyBelongCompany({ belongCompanys: [maxItem.id] })
    //     .then(res => {
    //       this.companylist = res.data
    //     })
    //     .catch(err => {
    //       console.warn(err)
    //     })
    // }
  }
}
</script>
<style lang="scss">
.grabAll {
  // .el-form-item__content {
  //   height: 44px;
  //   padding: 6px;
  //   .el-form-item__error {
  //     padding-top: 0 !important;
  //   }
  // }
  // .el-select {
  //   width: 100%;
  // }
  // .PLZDtextarea textarea {
  //   min-height: 240px !important;
  // }
  // .el-form-item {
  //   margin-bottom: 14px;
  // }
}
</style>
<style lang="scss" scoped>
.grabAll {
  p {
    margin-block-start: 0.15em;
    margin-block-end: 0.15em;
    line-height: 1.2em;
    color: #888;
    font-size: 14px;
  }
  .DialogVisibleDGZD {
    padding: 10px 20px 10px 10px;
  }
}
</style>
