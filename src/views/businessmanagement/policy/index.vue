<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <app-slide
      v-loading="orgSelectList.isSideLoading"
      v-if="!isChackAndEditShow"
      :is-active="isActive"
    >
      <el-input v-model="orgSelectList.model" size="small" placeholder="输入关键字进行过滤"/>

      <el-tree
        ref="orgtree"
        :data="orgSelectList.data"
        :props="orgProps"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :empty-text="selectValue.channel ? '暂无数据' : '请先选择渠道'"
        class="filter-tree"
        @node-click="selOrg"
      />
    </app-slide>
    <div v-show="!isChackAndEditShow" style="display: flex;align-items: center;z-index: 999;">
      <div class="btn" @click="toggle">
        <img :class="{ arrow: !isActive}" src="@/assets/imgs/arrow_left.png" alt>
      </div>
    </div>
    <div v-show="!isChackAndEditShow" class="app-container" style="width: 100%;overflow: auto;">
      <head-info title="保单台账" info/>
      <div class="app-panel channel-right">
        <el-row>
          <el-col :span="8">
            <el-row>
              <el-button
                v-permission="permissionList.businessPolicyRecord"
                type="text"
                icon="el-icon-circle-plus-outline"
                style="margin-right: 10px;"
                @click="navToRecord()"
              >手动录入</el-button>
              <el-button
                v-permission="permissionList.businessPolicyExport"
                type="text"
                icon="el-icon-sold-out"
                style="margin-right: 10px;"
                @click="exportExcel(true)"
              >导出本页</el-button>
              <el-button
                v-permission="permissionList.businessPolicyExportAll"
                type="text"
                icon="el-icon-sold-out"
                style="margin-right: 10px;"
                @click="exportExcel(false)"
              >导出全部</el-button>
              <el-button
                v-permission="permissionList.businessPolicySetHead"
                type="text"
                icon="el-icon-setting"
                style="margin-right: 10px;"
                @click="setTableHead"
              >设置表头</el-button>
            </el-row>
          </el-col>
          <el-col :span="16">
            <el-row style="text-align: right;">
              <el-select
                v-if="isSubAdminChannel"
                v-model="selectValue.sourceId"
                :loading="channelSelectList.loading"
                size="small"
                filterable
                placeholder="所属渠道"
                style="margin-right: 10px;width: 130px;flex: 0 0 auto;"
                @focus="getChannel()"
                @change="getOrg"
              >
                <el-option
                  v-for="item in channelSelectList.data"
                  :key="item.code"
                  :label="item.shortName"
                  :value="item.code"
                />
              </el-select>
              <el-select
                v-model="selectValue.timeType"
                size="small"
                placeholder="时间类型"
                style="width: 130px;margin-right: 10px;"
              >
                <el-option
                  v-for="item in timeType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-date-picker
                v-model="selectValue.date"
                :clearable="false"
                size="small"
                style="width: 230px;margin-right: 10px;"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
              <el-input
                v-model="selectValue.keywords"
                placeholder="请输入内容"
                size="small"
                style="width: 300px;"
              >
                <el-select
                  slot="prepend"
                  v-model="selectValue.keywordType"
                  placeholder="请选择"
                  size="small"
                  style="width: 90px;"
                >
                  <el-option :value="0" label="车牌号"/>
                  <el-option :value="1" label="保单号"/>
                  <el-option :value="2" label="业务员"/>
                  <el-option :value="3" label="出单员"/>
                </el-select>
              </el-input>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                style="margin-left: 10px;"
                @click="queryAll"
              >查询</el-button>
              <el-button icon="el-icon-menu" size="small" @click="screenShow">筛选</el-button>
            </el-row>
          </el-col>
        </el-row>

        <el-table
          v-loading="isLoading"
          :data="table.model"
          height="calc(100vh - 320px)"
          max-height="100vh"
          border
          style="width: 100%;margin: 20px 0;"
        >
          <el-table-column
            v-for="(item, index) in table.titles"
            :key="index"
            :label="item.fieldDesc"
            :prop="item.fieldText"
            :width="item.width"
            :fixed="index === 0 ? 'left' : false"
            min-width="100"
          />
          <el-table-column label="操作" width="120" fixed="right">
            <template slot-scope="scope">
              <el-button
                v-permission="permissionList.businessPolicyCheck"
                size="mini"
                type="text"
                style="font-size: 14px;"
                @click="checkPolicy(scope)"
              >查看</el-button>
              <el-button
                v-permission="permissionList.businessPolicyEdit"
                size="mini"
                type="text"
                style="font-size: 14px;"
                @click="editPolicy(scope)"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          :total="table.count"
          :current-page.sync="selectValue.page"
          :page-size="selectValue.size"
          :page-sizes="[10, 20, 30, 40, 50]"
          style="text-align: right;"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="getCurrentData"
        />
      </div>
    </div>
    <!--<div v-if="isChackAndEditShow" class="app-container" style="width: 100%;overflow: auto;">-->
    <!--<head-info-->
    <!--title="保单列表"-->
    <!--info="" />-->
    <!--<check-and-edit-policy v-loading="isLoading" :policy-detail="policyDetail" :is-edit="isEdit" @onSubmit="submitPolicy" @onClose="close" @onBelongCompanyChange="onBelongCompanyChange"/>-->
    <!--</div>-->

    <policy-details
      v-if="isChackAndEditShow"
      :policy-id="policyId"
      :check-type="checkType"
      :is-manual-entry="isManualEntry"
      @cancel="close"
      @confirm="close"
    />

    <!--表头设置-->
    <custom-header
      v-if="isCustomHeaderShow"
      :is-show="isCustomHeaderShow"
      @close="closeTableHead"
      @onSub="getPolicyByPage"
    />

    <!--筛选侧滑窗口-->
    <app-drawer
      :is-show="isScreenShow"
      :mask-closable="false"
      drawer-title="保单筛选"
      drawer-style="width: 500px;"
      no-button
      @drawerClose="screenClose"
    >
      <policy-screen
        ref="policyScreen"
        :select-value="selectValue"
        @screen="screen"
        @reset="reset"
      />
    </app-drawer>
  </div>
</template>

<script>
import { getOrgData, queryAuthChannel } from '@/api/number'
import {
  getPolicyByPage,
  updatePolicyOrOrder,
  exportPolicy,
  getPolicySalesman,
  getPolicyExportList
} from '@/api/policy_management'
import { AppSlide } from '@/components/Slide'
import CheckAndEditPolicy from '@/views/businessmanagement/policy/components/checkandeditpolicy'
import { mapGetters } from 'vuex'
import customHeader from '@/views/businessmanagement/policy/components/customHeader'
import { AppDrawer } from '@/components/Drawer'
import PolicyScreen from '@/views/businessmanagement/policy/components/policyscreen'
import PolicyDetails from '@/views/businessmanagement/policy/recording/index'

import dayjs from 'dayjs'

export default {
  name: 'Policylist',
  components: {
    AppSlide,
    CheckAndEditPolicy,
    customHeader,
    AppDrawer,
    PolicyScreen,
    PolicyDetails
  },
  data() {
    return {
      checkType: null,
      policyId: null,
      isManualEntry: false,
      isChackAndEditShow: false,
      isLoading: true,
      isEdit: false,
      isCustomHeaderShow: false,
      isScreenShow: false,
      table: {
        count: 0,
        model: [],
        titles: []
      },
      policyDetail: {},
      selectValue: {
        page: 1,
        size: 20,
        sourceId: undefined,
        timeType: 0,
        date: [],
        keywordType: 0,
        keywords: '',
        comcode: undefined,
        level: undefined,
        company: undefined,
        insureType: undefined,
        policyType: [],
        workNo: undefined,
        cid: undefined,
        syncStatus: undefined,
        receiveType: undefined
      },
      isActive: false, // 机构侧滑
      orgSelectList: {
        isSideLoading: false,
        model: '',
        data: [],
        disabled: false
      },
      orgProps: {
        label: 'title',
        children: 'children'
      },
      channelSelectList: {
        // 所属渠道下拉选择
        loading: false,
        data: []
      },
      timeType: [
        { value: 0, label: '录入时间' },
        { value: 1, label: '签单时间' },
        { value: 2, label: '起保时间' }
      ]
    }
  },
  computed: {
    ...mapGetters(['isSubAdminChannel'])
  },
  watch: {
    'selectValue.sourceId': function(val) {
      if (!val || val === '') {
        this.orgSelectList.disabled = true
      } else {
        this.orgSelectList.disabled = false
      }
    },
    'orgSelectList.model': function(val) {
      this.$refs.orgtree.filter(val)
    }
  },
  async created() {
    // 初始化默认时间
    // const s = dayjs().set('month', dayjs().month() - 1).format('YYYY-MM-DD 00:00:00')
    const s = dayjs().format('YYYY-MM-DD 00:00:00')
    const e = dayjs().format('YYYY-MM-DD 23:59:59')
    this.selectValue.date = [s, e]
    this.close() // 为防止在查看详情页面直接刷新后，地址仍然有hash，初始化页面先清除一次
    const sourceId = JSON.parse(localStorage.getItem('userAll')).data
      .channelCode
    const { channelCode, createTime, id } = this.$route.params
    try {
      await getPolicyExportList()
      const { data: channelList } = await queryAuthChannel(undefined)
      this.channelSelectList.data = []
      this.channelSelectList.data = channelList
      if (this.isSubAdminChannel) {
        this.selectValue.sourceId = channelList[0].code
      } else {
        this.selectValue.sourceId = sourceId
      }
      if (channelCode && createTime && id) {
        this.selectValue.sourceId = channelCode
        this.selectValue.date = createTime
        this.selectValue.cid = id
        this.getPolicyByPage()
        return
      }
      // this.getOrg()
      const orgList = await getOrgData({
        channelCode: this.selectValue.sourceId
      })
      this.orgSelectList.data = orgList.data
      this.selectValue.comcode = this.orgSelectList.data[0].key
      this.selectValue.level = this.orgSelectList.data[0].level

      // 获取筛选框组件实例
      const screen = this.$refs.policyScreen
      await screen.setCompanyList()
      await screen.setNumber()
      // this.isActive = true
    } catch (e) {
      console.warn(e)
    }
    this.getPolicyByPage()
  },
  methods: {
    // 查询
    queryAll() {
      this.selectValue.cid = undefined // 手动抓单跳转过来后清除cid
      this.getPolicyByPage()
    },
    // 改变每页条数触发的事件
    handleSizeChange(val) {
      this.selectValue.size = val
      this.getPolicyByPage()
    },
    // 页码发生变化的事件
    getCurrentData() {
      this.getPolicyByPage()
    },
    // 获取保单列表
    getPolicyByPage() {
      this.isLoading = true
      const val = this.selectValue
      const key = val.keywords
      const s = dayjs(val.date[0]).format('YYYY-MM-DD 00:00:00')
      const e = dayjs(val.date[1]).format('YYYY-MM-DD 23:59:59')
      const startTime = new Date(s).getTime()
      const endTime = new Date(e).getTime()
      const params = {
        page: val.page,
        size: val.size,
        model: {
          startTime,
          endTime,
          comcode: val.comcode || undefined,
          level: val.level || undefined,
          timeType: val.timeType,
          keyType: key ? val.keywordType : undefined,
          key: key || undefined,
          sourceId: val.sourceId ? val.sourceId : undefined,
          company: val.company === 0 || val.company ? val.company : undefined,
          insureType:
            val.insureType === 0 || val.insureType ? val.insureType : undefined,
          policyType: val.policyType || val.policyType ? val.policyType : [],
          workNo: val.workNo === 0 || val.workNo ? val.workNo : undefined,
          cid: val.cid ? val.cid : undefined,
          syncStatus:
            val.syncStatus === 0 || val.syncStatus ? val.syncStatus : undefined,
          receiveType: val.receiveType
        }
      }
      getPolicyByPage(params)
        .then(res => {
          const { model, titles, count } = res.data
          this.table.count = count
          this.table.model = model
          this.table.titles = titles
          this.isLoading = false
          console.log(res)
        })
        .catch(err => {
          this.isLoading = false
          console.warn(err)
        })
    },
    // 渠道改变时触发，获取机构，重新请求保险公司，出单工号
    async getOrg() {
      this.selectValue.comcode = undefined
      // 获取机构
      getOrgData({
        channelCode: this.selectValue.sourceId
      })
        .then(res => {
          this.orgSelectList.data = res.data
        })
        .catch(err => {
          console.warn(err)
        })
      // 获取保险公司,获取出单工号
      this.selectValue.company = undefined // 清除保险公司的值
      this.selectValue.workNo = undefined // 清除出单工号的值
      const screen = this.$refs.policyScreen
      await screen.setCompanyList()
      await screen.setNumber()
    },
    // 获取所属渠道
    getChannel(params = undefined) {
      this.channelSelectList.loading = true
      // this.orgSelectList.data = []
      // this.selectValue.comcode = undefined
      queryAuthChannel(params)
        .then(res => {
          this.channelSelectList.loading = false
          this.channelSelectList.data = []
          this.channelSelectList.data = res.data
          // this.orgSelectList.data = []
          // this.selectValue.comcode = undefined
        })
        .catch(err => {
          this.channelSelectList.loading = false
          console.warn(err)
        })
    },
    toggle() {
      // 左侧机构侧滑
      this.isActive = !this.isActive
    },
    selOrg(val) {
      if (val) {
        this.selectValue.comcode = val.key
        this.selectValue.level = val.level
        this.queryAll()
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },

    // 获取打开新窗口的链接
    getPolicyLink() {
      const version = process.env.BUILD_VER
      switch (version) {
        case 'test':
          return '/spa/carManagerTest/checkPolicyDetails'
        case 'test2':
          return '/spa/carManagerTest2/checkPolicyDetails'
        default:
          return '/spa/carManager/checkPolicyDetails'
      }
    },

    // 新窗口打开保单的方法
    openPolicyByNewWindow() {
      const link = this.getPolicyLink()
      const iHeight = 700
      const iWidth = 1200
      // 获得窗口的垂直位置
      const iTop = (window.screen.availHeight - 30 - iHeight) / 2
      // 获得窗口的水平位置
      const iLeft = (window.screen.availWidth - 10 - iWidth) / 2
      // window.open(link, '_blank', 'top=0,left=0,width=1000,height=1000')
      window.open(
        link,
        '_blank',
        `height=${iHeight}, innerHeight=${iHeight}, width=${iWidth}, innerWidth=${iWidth}, top=${iTop}, left=${iLeft}`
      )
    },

    // 查看
    async checkPolicy(d) {
      // this.checkType = 1
      // this.policyId = d.row.id
      // console.log(this.policyId)
      // this.isChackAndEditShow = true
      const policyProps = {
        checkType: 1,
        policyId: d.row.id
      }
      sessionStorage.setItem('policyProps', JSON.stringify(policyProps))
      this.openPolicyByNewWindow()
      // this.isLoading = true
      // this.isEdit = false
      // const val = d.row
      // try {
      //   const { data } = await queryPolicyById(val.id)
      //   this.policyDetail = data
      //   this.isChackAndEditShow = true
      //   console.log(data)
      // } catch (e) {
      //   console.warn(e)
      // }
      // this.isLoading = false
    },
    // 编辑
    async editPolicy(d) {
      this.isManualEntry = parseInt(d.row.isOffline) === 2
      this.checkType = 2
      this.policyId = d.row.id
      this.isChackAndEditShow = true
      // this.isLoading = true
      // this.isEdit = true
      // const val = d.row
      // try {
      //   const { data } = await queryPolicyById(val.id)
      //   this.policyDetail = data
      //   const { data: belongCompanyList } = await getBelongCompanyList(this.policyDetail.policyExt.sourceCode, this.policyDetail.policyExt.areaCode)
      //   this.policyDetail.belongCompanyList = JSON.parse(JSON.stringify(belongCompanyList).replace(/title/g, 'label').replace(/key/g, 'value'))
      //   const salesman = await getPolicySalesman({ teamId: this.policyDetail.policyExt.organizationId })
      //   console.log(salesman)
      //   this.policyDetail.policySalesmanList = null
      //   this.isChackAndEditShow = true
      // } catch (e) {
      //   console.warn(e)
      // }
      // this.isLoading = false
    },
    // 关闭
    close() {
      history.replaceState(null, '', `${location.pathname}${location.search}`)
      this.isChackAndEditShow = false
    },
    // 编辑保单提交
    submitPolicy() {
      this.isLoading = true
      const policyDetail = this.policyDetail
      const policyExt = policyDetail.policyExt
      const {
        organizationName,
        organizationId,
        vciPolicyNo,
        tciPolicyNo,
        userName,
        userId,
        id: policyId
      } = policyExt
      const params = {
        identity: 2,
        policyId,
        organizationName,
        organizationId,
        vciPolicyNo,
        tciPolicyNo,
        userName,
        userId,
        up: policyDetail.upFormality,
        agency: policyDetail.agencyFormality,
        sale: policyDetail.saleFormality
      }
      updatePolicyOrOrder(params)
        .then(res => {
          this.isChackAndEditShow = false
          this.isLoading = false
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.queryAll()
        })
        .catch(err => {
          this.isLoading = false
          this.$message.error('保存失败')
          console.log(err)
        })
    },
    // 当保单机构选择发生变化时，重新请求业务员接口
    onBelongCompanyChange(val) {
      getPolicySalesman({ teamId: val }).then(res => {
        console.log('*******************')
        console.log(res)
      })
    },
    // 导出保单
    exportExcel(exportCurrentPage = false) {
      const val = this.selectValue
      const key = val.keywords
      const s = dayjs(val.date[0]).format('YYYY-MM-DD 00:00:00')
      const e = dayjs(val.date[1]).format('YYYY-MM-DD 23:59:59')
      const startTime = new Date(s).getTime()
      const endTime = new Date(e).getTime()
      const params = {
        page: val.page,
        size: val.size,
        model: {
          startTime,
          endTime,
          comcode: val.comcode || undefined,
          level: val.level || undefined,
          timeType: val.timeType,
          keyType: key ? val.keywordType : undefined,
          key: key || undefined,
          sourceId: val.sourceId ? val.sourceId : undefined,
          company: val.company === 0 || val.company ? val.company : undefined,
          insureType:
            val.insureType === 0 || val.insureType ? val.insureType : undefined,
          policyType:
            val.policyType === 0 || val.policyType ? val.policyType : undefined,
          workNo: val.workNo === 0 || val.workNo ? val.workNo : undefined,
          exportCurrentPage
        }
      }
      exportPolicy(params)
        .then(res => {
          const url = window.URL.createObjectURL(res)
          const a = document.createElement('a')
          document.body.appendChild(a)
          a.href = url
          a.download =
            '保单台账-' + dayjs().format('YYYY-MM-DD HH_mm_ss') + '.xls'
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 设置表头
    setTableHead() {
      this.isCustomHeaderShow = true
    },
    closeTableHead() {
      this.isCustomHeaderShow = false
    },
    // 打开筛选
    screenShow() {
      this.isScreenShow = true
    },
    // 关闭筛选
    screenClose() {
      this.isScreenShow = false
    },
    // 筛选提交
    screen() {
      this.queryAll()
      this.screenClose()
    },
    reset() {
      const val = {
        company: undefined,
        insureType: undefined,
        policyType: [],
        workNo: undefined,
        receiveType: undefined
      }
      this.selectValue = { ...this.selectValue, ...val }
    },
    navToRecord() {
      this.checkType = 5
      this.isManualEntry = true
      this.isChackAndEditShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
.btn {
  width: 10px;
  height: 32px;
  overflow: hidden;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: -10px;
  cursor: pointer;
  transition: all 0.3s ease;
  img {
    width: 10px;
    height: 10px;
    transition: all 0.5s ease;
  }
}
.btn:hover {
  background-color: rgba(0, 0, 0, 0.7);
}
.arrow {
  transform: rotateZ(180deg);
}
</style>

<style lang="scss">
.channel-right {
  .el-table td,
  .el-table th {
    padding: 0;
    height: 40px;
    line-height: 40px;
  }
  .el-table th {
    background: #fafafa;
  }
}
</style>
