<template>
  <div class="container getpolicy">
    <head-info title="抓单方式"/>
    <div class="nav">
      <el-row :class="[ isNetWork||isDistribution ? 'netWork':'','tac']">
        <el-col :span="4">
          <el-menu
            :default-active="activeIndex"
            background-color="rgba(240, 242, 245, 1)"
            style=""
            @select="handleTypeSelect">
            <el-menu-item index="1">
              <span class="iconfont">&#xe6e5;</span>
              <span slot="title" style="margin-left:10px;">保单号</span>
            </el-menu-item>
            <el-menu-item index="2">
              <span class="iconfont">&#xe630;</span>
              <span slot="title" style="margin-left:10px;">车牌号</span>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="10" :offset="5" style="padding-top:50px;">
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
            <!-- <el-form-item label="所属机构" prop="organ">
              {{ selectValue.organ }}
              <my-tree-select
                :options="organOptions"
                :aync="true"
                v-model="selectValue.organ"
                :delete-removes="true"
                :normalizer="normalizer"
                :auto-load-root-options="false"
                :no-options-text="emptyData"
                style="width:380px;"
                placeholder="请选择机构"
                no-results-text="未找到结果"
                @select="organNodeClick"
                @open="openTree" />
            </el-form-item> -->
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
                @visible-change="isShow"
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
            <el-form-item v-if="isPolicyNo" label="保单号" prop="policyNo">
              <el-input v-model="selectValue.policyNo" :placeholder="policyInput" :rows="isNetWork ? 4 : 6" type="textarea" style="width:380px;"/>
            </el-form-item>
            <el-form-item v-if="!isPolicyNo" label="车牌号" prop="license">
              <el-input v-model="selectValue.license" :placeholder="licenseInput" :rows="isNetWork ? 4 : 6" type="textarea" style="width:380px;" />
            </el-form-item>
            <el-form-item >
              <el-button type="primary" style="width:380px" @click="getPolicy('selectValue')">获取保单</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
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
import MyTreeSelect from '@/components/MyTreeSelect/index'
import ElTreeSelect from '@/components/ElTreeSelect/index'
import { mapGetters } from 'vuex'
export default {
  components: {
    MyTreeSelect,
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
      policyInput: '请输入相同险种类型的保单号，单次最多支持输入20个。多个保单号请换行输入，如：\nPDZA20190101123446789\nPDZA20190101123446790'
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel'
    ])
  },
  watch: {
    'selectValue.organ': function(val) {
      // console.log(val)
      if (!val) {
        this.$refs.selectValue.validateField('organ')
        // console.log(this.$refs.selectValue)
      }
    }
  },
  created() {
    if (this.isAnyAdminChannel) {
      this.getPolicyChannelData() // 运维才能获取渠道信息
    }
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
          if (this.isPolicyNo) { // 保单号
            params.type = 1
            params.arrs = this.selectValue.policyNo.trim().split('\n')
          } else { // 车牌号
            params.type = 2
            params.arrs = this.selectValue.license.trim().split('\n')
          }
          console.log(params)
          this.$emit('handleSubmit', params)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleTypeSelect(key) {
      this.$refs['selectValue'].clearValidate() // 清除校验结果
      console.log(key, this.activeIndex)
      if (key === '1') {
        this.isPolicyNo = true
        if ('license' in this.selectValue) {
          delete this.selectValue.license
        }
      } else {
        this.isPolicyNo = false
        if ('policyNo' in this.selectValue) {
          delete this.selectValue.policyNo
        }
      }
    },
    // 获取抓单页面所属渠道
    getPolicyChannelData() {
      getPolicyChannel().then(res => {
        // console.log(res)
        this.policyChannelList = res.data
        // this.isDistribution = true
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
        // for (const i of result[0].children) {
        //   i.children = []
        // }
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
    // 获取所属机构
    // getOrgan() {
    //   // if (!isAnyAdminChannel) {
    //   //     this.selectValue.channel.code =
    //   // }
    //   console.log(this.selectValue.channel)
    //   this.emptyData = '加载中...'
    //   console.log('获取机构')
    //   console.log(this.selectValue.channel.code)
    //   if (!this.selectValue.channel) {
    //     this.organOptions = []
    //     this.emptyData = '暂无数据'
    //     return
    //   }
    //   getPolicyOrgan(this.selectValue.channel.code).then(res => {
    //     // console.log(res)
    //     this.organOptions = res.data
    //   })
    // },
    handleNetWorkFocus() {
      this.getNetWork()
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
        // companyId: this.selectValue.company.companyId, // 公司id
        // channelId: this.selectValue.account.id // 出单工号id
      }
      // const area = this.selectValue.area
      // if (this.channelType === 1) { // 省市分销渠道
      //   console.log('分销1')
      //   if (!area || area.length !== 2) {
      //     this.operatorList.loading = false
      //     this.operatorList.data = []
      //     return
      //   }
      //   params.province = area[0]
      //   params.city = area[1]
      // }
      // if (this.channelType === 2) { // 网点分销渠道
      //   if (!this.selectValue.area || !this.selectValue.netWork) {
      //     console.log('分销2')
      //     this.operatorList.loading = false
      //     this.operatorList.data = []
      //     return
      //   }
      //   params.province = area[0]
      //   params.city = area[1]
      //   params.netWork = this.selectValue.netWork
      // }
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
    // async selectOrgan(val) {
    //   console.log(val)
    //   this.selectValue.organ = val
    // },
    organNodeClick(node) {
      console.log(node)
      console.log('机构点击')
      // console.log(node)
      this.organName = node.title
      // console.log(this.$refs.selectValue)
      this.$refs.selectValue.clearValidate('organ')
    },
    // 投保地区
    handleAreaChange(value) {
      console.log(value)
    },
    // 机构网点选择回调
    handleNetWorkChange(val) {
    },
    // 选择渠道的回调
    handleChannelChange(val) {
      this.organName = ''
      // this.$refs.selectValue.resetFields('organ')
      console.log('机构树')
      console.log(this.$refs.treeList)
      if (this.selectValue.area) {
        // 清除级联的UI显示（解决数值清空，UI没有清除的bug）
        const obj = {}
        obj.stopPropagation = () => {}
        this.$refs.areas.clearValue(obj)
        this.selectValue.area = []
      }
      if (this.selectValue.organ) {
        this.selectValue.organ = ''
      }
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
      // this.$set(this.selectValue, 'organ', '')
      if (this.selectValue.organ && this.selectValue.organ.title) {
        this.selectValue.organ.title = ''
      }
      this.judgeChannelType(val.code)
      // this.queryOrgan()
      // this.getOrgan()
      // await this.getCompanyList()
      this.organOptions = []
    },
    // 机构变化时的处理
    handleOrganChange() {
      const selectNode = this.$refs.treeList.$refs.tree.getCurrentNode()
      console.log('选中的node')
      this.organName = selectNode.label
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
    isShow(val) {
      console.log(122)
      console.log('公司', val)
    },
    openTree() {
      console.log('展开树形结构')
      console.log(this.$refs.companySel)
      this.$refs.companySel.blur()
      this.$refs.accountList.blur()
    }
  }
}
</script>
<style lang="scss">
.container{
    position: relative;
    height:100%;
    padding: 15px;
    .nav{
        height:100%;
        .tac{
           height: calc(100vh - 265px);
          //  height:680px;
           overflow: auto;
           .el-col{
            height:100%;
            // height:calc(100vh - 265px)
           }
        }
        .tac.netWork{
          height: calc(100vh - 238px);
          overflow: auto;
          .el-col{
            height:100%;
         }
        }
        .el-menu{
            border-left:1px solid #cccccc;
          }
        .el-menu-item{
          border-bottom:1px solid #cccccc;
        }
     }
}
.getpolicy{
  .panel-info h3{
    color:#000;
    font-weight: bold;
    font-size:15px;
  }
  .el-col-4  .el-menu{
      width:180px;
      height:100%;
  }
  .vue-treeselect__control .vue-treeselect__input-container{
    height:40px;
  }
  .vue-treeselect__placeholder, .vue-treeselect__single-value{
    padding-left:10px;
    padding-top:4px;
  }
  // .vue-treeselect__control{
  //   border:1px solid #67c23a;
  // }
  // 统一边框样式
  .el-form-item.is-success .el-input__inner,
  .el-form-item.is-success .el-input__inner:focus,
  .el-form-item.is-success .el-textarea__inner,
  .el-form-item.is-success .el-textarea__inner:focus{
    border-color:#ddd !important;
  }
  .el-form-item.is-error .el-input__inner,
  .el-form-item.is-error .el-input__inner:focus,
  .el-form-item.is-error .el-textarea__inner,
  .el-form-item.is-error .el-textarea__inner:focus,
  .el-message-box__input input.invalid,
  .el-message-box__input input.invalid:focus{
    border-color:#ddd !important;
  }
}
  .el-tree-select-dropdown .el-tree>.el-tree-node{
    max-height: 500px;
    overflow: auto;
  }
</style>
