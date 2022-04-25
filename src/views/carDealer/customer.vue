<template>
  <div class="app-container customer">
    <div class="app-panel left-pane">
      <div :class="isTreeshow ? '' : 'hide'" class="tree-wrap">
        <el-tree :data="companyTreeData" :props="defaultProps" :highlight-current="true" :expand-on-click-node="false" @node-click="handleTreeClick" />
      </div>
      <div class="arrow-wrap">
        <img :src="isTreeshow? expandIcon.left : expandIcon.right" @click="isTreeshow = !isTreeshow">
      </div>
    </div>
    <div class="app-panel right-pane customer-box">
      <el-card v-permission="[permissionList.renewalAdmin, permissionList.renewalCarAdmin]">
        <div slot="header" style="line-height: 50px;font-size: 16px;">管理员</div>
        <div style="height: 20px;">
          <span style="font-size: 14px;margin-right: 30px;">任务分配设置</span>
          <el-radio-group v-model="assign" style="display: inline-block;" @change="setAdminAssign">
            <el-radio :label="2">手动分配</el-radio>
            <el-radio :label="1">自动分配</el-radio>
          </el-radio-group>
        </div>
        <div style="font-size: 10px; color: #ccc;">自动分配原则：有业务归属按业务归属原则分配，无业务归或业务归属人离职按平均分配原则</div>
      </el-card>

      <el-card>
        <div slot="header" style="line-height: 50px;font-size: 16px;">
          <span>数据筛选</span>
          <!-- <el-button style="float: right; padding: 0px;line-height: 50px;" type="text" @click=" isSearchShow = true ">高级搜索</el-button> -->
        </div>
        <div>
          <el-input v-model="searchForm.licenseNo" style="max-width: 200px;padding: 10px 5px 0 0" placeholder="请输入车牌号" size="small" />
          <el-input v-model="searchForm.ownerName" style="max-width: 200px;padding: 10px 5px 0 0" placeholder="请输入车主姓名" size="small" />
          <el-select v-model="searchForm.endDayNum" style="padding: 10px 5px 0 0" clearable filterable placeholder="请选择距离脱保天数" size="small">
            <el-option v-for="item in expiryData" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
          <el-select v-model="searchForm.type" style="padding: 10px 5px 0 0" clearable filterable placeholder="请选择客户类型" size="small">
            <el-option v-for="item in typeData" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
          <el-select v-model="searchForm.taskState" style="padding: 10px 5px 0 0" clearable filterable placeholder="请选择任务状态" size="small">
            <el-option v-for="item in taskData" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
          <el-select v-model="searchForm.state" style="padding: 10px 5px 0 0" clearable filterable placeholder="请选择跟进状态" size="small">
            <el-option v-for="item in followData" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
          <el-button type="primary" icon="el-icon-search" size="small" style="margin-top: 10px;" @click="selectData">查询</el-button>
          <el-button icon="el-icon-menu" size="small" style="margin-top: 10px;" @click="selectAdvanced">高级搜索</el-button>
          <el-button icon="el-icon-delete" size="small" style="margin-top: 10px;" @click="selectAll">清空搜索</el-button>
        </div>
      </el-card>

      <el-card style="margin-bottom: 0px;">
        <div slot="header">
          <span style="float:left;line-height: 50px;font-size: 16px;">数据列表</span>
          <div style="text-align:right;line-height: 50px;">
            <el-button type="success" icon="el-icon-circle-plus-outline" size="small" @click="addData">新增</el-button>
            <el-button v-permission="[permissionList.renewalIssue, permissionList.renewalAdmin, permissionList.renewalCarAdmin]" type="primary" icon="el-icon-share" size="small" @click="distributClick">分配</el-button>
            <el-button type="primary" icon="el-icon-refresh" size="small" @click="refreshRenewal">续保查询</el-button>
            <el-button icon="el-icon-refresh" size="small" @click="selectData">刷新</el-button>
            <el-button icon="el-icon-download" size="small" @click="exportIn">导入</el-button>
            <el-button v-permission="[permissionList.renewalAdmin, permissionList.renewalCarAdmin]" icon="el-icon-upload2" size="small" @click="exportOut">导出</el-button>
          </div>
        </div>
        <el-table v-loading="isLoading" ref="multipleTable" :data="tableData" :cell-style="{padding: '4px 0'}" :header-cell-style="{background:'#fafafa',padding: '8px 0'}" border @selection-change="handleSelectionChange">
          <el-table-column show-overflow-tooltip fixed="left" type="selection" width="60" />
          <el-table-column show-overflow-tooltip fixed="left" prop="licenseNo" label="车牌号" min-width="100" />
          <el-table-column show-overflow-tooltip fixed="left" prop="frameNo" label="车架号" min-width="160" />
          <el-table-column show-overflow-tooltip prop="ownerName" label="车主姓名" min-width="100" />
          <el-table-column show-overflow-tooltip prop="brandName" label="品牌型号" min-width="200" />
          <el-table-column show-overflow-tooltip prop="comEndDate" label="商业险到期日期" width="120" />
          <el-table-column show-overflow-tooltip prop="forceEndDate" label="交强险到期日期" width="120" />
          <el-table-column show-overflow-tooltip label="距离脱保天数" width="110">
            <template slot-scope="scope">
              {{ endDayFormatter(scope.row) }}&nbsp;
              <el-popover v-if="(scope.row.allocationEndDate !== scope.row.comEndDate) && (scope.row.allocationEndDate !== scope.row.forceEndDate) && (scope.row.endDate >= 0 && scope.row.endDate <= renewalDay)" placement="right" trigger="hover">
                <svg-icon slot="reference" icon-class="gantan" />
                <span style="line-height: 20px;">已自动修复至保险到期日{{ scope.row.allocationEndDate }}</span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="allocationTime" label="分配日期" width="160" />
          <el-table-column show-overflow-tooltip prop="taskStateDesc" label="任务状态" width="80" />
          <el-table-column show-overflow-tooltip prop="salesmanName" label="续保专员" width="80" />
          <el-table-column show-overflow-tooltip prop="typeDesc" label="客户标签" width="80" />
          <el-table-column show-overflow-tooltip prop="yesteryearCompany" label="往年投保" width="80" />
          <el-table-column show-overflow-tooltip fixed="right" label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="text" size="medium" @click="checkData(scope.row)">查看详情</el-button>
              <el-button v-permission="[permissionList.renewalAdmin, permissionList.renewalCarAdmin, permissionList.renewalIssue]" type="text" size="medium" @click="deleteData(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="count >= 0" style="text-align:right;margin-top:20px;">
          <el-pagination :current-page="current" :page-sizes="[10, 20, 30, 40, 50]" :page-size="size" :total="count" layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChange" @current-change="currentChange" />
        </div>
      </el-card>
    </div>

    <div v-if="outerVisible" class="customer-refresh">
      <div class="customer-refresh-title">
        <span>刷新的数据({{ refreshNum }})条</span>
        <span style="float: right;">
          <i class="el-icon-minus customer-refresh-minus" @click=" innerVisible = false, infoVisible = true" />
          <i class="el-icon-close customer-refresh-close" @click="refreshClose" />
        </span>
        <div v-show="infoVisible" class="customer-refresh-info" @click="innerVisible = true, infoVisible = false">点击查看详细刷新信息</div>
      </div>
      <el-table v-show="innerVisible" :data="refreshData" :cell-style="{padding: '4px 0'}" style="height: 250px;overflow: auto;font-size: 12px;">
        <el-table-column property="licenseNo" width="100" />
        <el-table-column property="statusValue" width="100" />
      </el-table>
    </div>

    <el-dialog v-if="dialogDistribut" :visible.sync="dialogDistribut" title="分配" width="50%">
      <div style="height: 45px;line-height: 45px;">
        <div style="float: left;">
          <el-radio-group v-model="distributForm.resource">
            <el-radio :label="true">平均分配</el-radio>
            <el-radio :label="false">固定分配</el-radio>
          </el-radio-group>
        </div>
        <div style="float: right;">
          <el-input v-model="distributForm.name" style="max-width: 150px;" placeholder="请输入名称" size="small" />
          <el-button type="primary" icon="el-icon-search" size="small" @click="distributSearch">查询</el-button>
        </div>
      </div>
      <el-table ref="multipleDistributData" :data="distributData" border style="width: 100%;" @selection-change="handleDistributData">
        <el-table-column fixed="left" type="selection" width="60" />
        <el-table-column prop="nickName" label="续保专员" width="180" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column label="数量" width="180">
          <template slot-scope="scope">
            <el-input v-model="scope.row.countNumber" :disabled="distributForm.resource===true" placeholder="请输入数量" size="small" @change="distriButChange(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <div style="padding-top:10px">可分配数据&nbsp;{{ distributForm.total }}&nbsp;条</div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogDistribut = false">取 消</el-button>
        <el-button size="small" type="primary" @click="distributConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogExportIn" title="导入数据" width="30%">
      <div style="margin-bottom: 20px;">
        <span>1、请先下载Excel模板：</span>
        <span style="color: #1890ff;cursor: pointer;" @click="downExcel">数据模板.xls</span>
      </div>
      <div>
        <span>2、将加工好的Excel导入：</span>
        <el-upload :file-list="customerFile" :limit="1" :on-success="customerUpload" :headers="{ 'Authorization':token }" :action="actionUrl" accept=".xls,.xlsx" style="margin: 10px 0px 0px 20px;">
          <el-button class="el-icon-upload2" size="small">浏览</el-button>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogExportIn = false">取 消</el-button>
        <el-button type="primary" size="small" @click="fileConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <app-drawer :is-show="isSearchShow" :mask-closable="false" drawer-title="高级搜索" drawer-style="width: 720px;" no-button @drawerClose="close">
      <advanced-search ref="advancedSearch" :search-form="searchForm" :saler-data="salersData" @screen="searchConfirm" @reset="searchReset" @cancel="close" />
    </app-drawer>
    <app-drawer :is-show="isEditShow" :mask-closable="false" drawer-title="新增信息" drawer-style="width: 500px;" @drawerConfirm="addConfirm" @drawerClose="close">
      <customer-edit ref="customerEdit" :title-name="activeName" :edit-form="editForm" :control-data="controlData" :loading="editLoading" :back-img="backImg" @sendBackImg="sendBackImg" />
    </app-drawer>
  </div>
</template>

<script>
import {
  getCustomerCarStoreEffective,
  getCustomerTable,
  getCustomerConfig,
  setCustomerConfig,
  setCustomerDeleteId,
  setCustomerEditImgs,
  getCustomerExport,
  getUsersOnCondition,
  // getCustomerFollowSaler,
  setCustomerUpdateInsure,
  getControlCarType
} from '@/api/customer'
import { distributeRenewalPeople } from '@/api/mytask'
import { getRenewalStantandDay } from '@/api/renewal'
import advancedSearch from '@/views/carDealer/advancedSearch'
import customerEdit from '@/views/carDealer/customerEdit'
import appDrawer from '@/components/Drawer/drawer'
import { getToken, getTokenType } from '@/utils/auth'
import dayjs from 'dayjs'
import qs from 'qs'
export default {
  components: {
    advancedSearch,
    customerEdit,
    appDrawer
  },
  data() {
    return {
      backImg: null, // 行驶证背面
      isTreeshow: false,
      companyTreeData: [],
      outIds: [], // 导出数组
      assign: null, // 管理员分配
      searchForm: {
        ids: null, // 勾选项
        licenseNo: '', // 车牌号
        ownerName: null, // 车主
        endDayNum: null, // 距离脱保天数
        frameNo: null, // 车架号
        ownerPhone: null, // 联系电话
        holderName: null, // 投保人
        comTime: null,
        comStartDate: null, // 商业险起期
        comEndDate: null, // 商业险到期
        forceTime: null,
        forceStartDate: null, // 交强险起期
        forceEndDate: null, // 交强险到期
        taskState: null, // 任务状态
        alloTime: null,
        allocationStartTime: null, // 分配时间
        allocationEndTime: null, // 分配时间
        salesmanId: null, // 续保专员
        planReturnTime: null, // 计划回访时间
        renewalState: null, // 续保状态
        quoteFlag: null, // 报价状态
        type: null, // 客户类型
        state: null, // 跟进状态
        brandName: null, // 品牌型号
        inputType: null, // 录入方式
        enrollTime: null,
        enrollStartDate: null, // 注册时间
        enrollEndDate: null, // 注册时间
        lastCompanyId: null, // 去年投保公司
        hasPhone: null, // 客户电话
        companyId: null // 机构树id
      },
      editForm: {
        name: null,
        insuringPerson: 0, // 投保人
        insuredPerson: 0, // 被保人
        transfer: 1, // 是否一年过户
        // id: null, // 用户id
        uuid: null,
        cardName: null,
        ownerName: null, // 车主姓名
        ownerPhone: null, // 联系电话
        ownerIdType: null, // 证件类型
        ownerCardType: null, // 数组
        ownerIdNo: null, // 证件号
        ownerAddr: null, // 联系地址
        ownerBirthday: null, // 出生日期
        ownerSex: null, // 车主性别
        ownerEmail: null, // 车主邮箱
        holderName: null, // 投保人姓名
        holderPhone: null, // 联系电话
        holderIdType: null, // 证件类型
        holderCardType: null, // 数组
        holderIdNo: null, // 证件号
        holderAddr: null, // 联系地址
        holderBirthday: null, // 出生日期
        holderSex: null, // 投保人性别
        insuredName: null, // 被保人姓名
        insuredPhone: null, // 联系电话
        insuredIdType: null, // 证件类型
        insureCardType: null, // 数组
        insuredIdNo: null, // 证件号
        insuredAddr: null, // 联系地址
        insuredBirthday: null, // 出生日期
        insuredSex: null, // 被保人性别
        licenseNo: '', // 车牌号
        useNature: null, // 车辆使用性质
        attachNature: null, // 使用性质细分
        brandName: null, // 品牌型号
        modelCode: null, // 车型编码
        frameNo: null, // 车架号
        engineNo: null, // 发动机号
        enrollDate: null, // 注册日期
        issueYear: null, // 年款
        purchasePrice: null, // 新车价格
        actualPrice: null,
        seatCount: null, // 座位数
        transferDate: null, // 过户日期
        displacement: null, // 排量/功率
        curbWeight: null, // 整备质量
        tonnage: null, // 核定载质量
        vehicleType: null, // 交管车辆类型
        vehicleCategory: null,
        type: null, // 客户类型
        allocationTime: null, // 分配时间
        salesmanId: null, // 续保员id
        operatorId: null,
        taskState: null, // 任务状态
        state: null, // 跟进状态
        mark: null,
        renewalState: null, // 续保状态
        planReturnTime: null, // 下次更进时间
        returnTime: null,
        inputType: null, // 录入方式
        time: null,
        updateTime: null,
        sourceId: null,
        plateColor: null, // 车牌底色
        forceEndDate: null, // 交强险到期日期
        comEndDate: null, // 商业险到期日期
        updator: null,
        del: null,
        lastCompanyId: null,
        file0: null,
        file1: null,
        file2: null,
        file3: null,
        imageIdface: null,
        imageIdback: null,
        imagelicenseface: null,
        imagelicenseback: null
      },
      expiryData: [
        { key: '90', value: '90天内到期' },
        { key: '60', value: '60天内到期' },
        { key: '30', value: '30天内到期' },
        { key: '15', value: '15天内到期' },
        { key: '7', value: '7天内到期' }
      ],
      typeData: [
        { key: '0', value: '新转续' },
        { key: '1', value: '续转续' },
        { key: '2', value: '间转续' },
        { key: '3', value: '潜转续' }
      ],
      taskData: [
        { key: 0, value: '未分配' },
        { key: 1, value: '已分配' },
        { key: 2, value: '跟进中' },
        // { key: 3, value: '即将到期' },
        { key: 4, value: '申请报价' },
        { key: 5, value: '申请出单' },
        { key: 6, value: '转派' },
        { key: 7, value: '成交出单' },
        { key: 8, value: '战败' },
        { key: 9, value: '已报价' }
      ],
      followData: [
        { key: 0, value: '忙碌中待联系' },
        { key: 1, value: '考虑中(普通)' },
        { key: 2, value: '考虑中(重点)' },
        { key: 3, value: '其他' },
        { key: 4, value: '预约到店' },
        { key: 5, value: '无效数据' }
        // { key: 6, value: '成功出单' },
        // { key: 8, value: '战败' }
      ],
      distributForm: {
        name: '',
        resource: true, // 是否平均分配
        total: 0
      },
      countNumber: '',
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      expandIcon: {
        left: require('@/assets/imgs/expand_select-left.png'),
        right: require('@/assets/imgs/expand_select-right.png')
      },
      isLoading: false,
      customerFile: [],
      actionUrl: `${process.env.SERVER_URL}${
        process.env.API_ENV
      }/dealer/auth/customer/importCustomer`,
      token: `${getTokenType()} ${getToken()}`,
      tableData: [],
      controlData: [],
      salersData: [],
      distributData: [],
      distributPutlist: [],
      distributSelection: [],
      enterStoreListSelection: [],
      totalNumTJ: null,
      refreshSelection: [],
      refreshData: [],
      refreshNum: null,
      refreshArr: [], // 刷新完成的纪录
      refreshTitle: null,
      hasRefresh: false,
      current: 1,
      size: 10,
      count: null,
      activeName: '',
      isSearchShow: false,
      isEditShow: false,
      dialogDistribut: false,
      dialogExportIn: false,
      outerVisible: false,
      innerVisible: false,
      infoVisible: false,
      editLoading: false,
      renewalDay: 90
    }
  },
  watch: {
    'distributForm.resource'(val) {
      this.$refs.multipleDistributData.clearSelection()
      this.distributData.forEach(element => {
        element.countNumber = ''
      })
    }
  },
  async created() {
    this.getRenewalDay()
    this.getCompanyCarStore()
    this.getAdminAssign()
    this.getTableData()
  },
  methods: {
    getRenewalDay() {
      getRenewalStantandDay().then(res => {
        this.renewalDay = res.data.daysConfig
      })
    },
    sendBackImg(val) {
      this.backImg = val
    },
    // 分页
    sizeChange(val) {
      this.size = val
      this.getTableData()
    },
    currentChange(val) {
      this.current = val
      this.getTableData()
    },
    // 标准化
    endDayFormatter(row) {
      if (row.endDate > this.renewalDay) {
        return ''
      } else if (row.endDate <= this.renewalDay && row.endDate >= 0) {
        return row.endDate
      } else {
        return ''
      }
    },
    // 获取机构树
    async getCompanyCarStore() {
      const blcs = this.$store.getters.userAll.data.belongCompanys
      const maxItem = blcs.sort((a, b) => b.level - a.level)[0]
      // const resT = await getCustomerCarStoreEffective(this.$store.getters.userAll.data.id)
      const resT = await getCustomerCarStoreEffective(maxItem.id)
      this.companyTreeData = resT.data
    },
    // 获取管理员分配状态
    async getAdminAssign() {
      const resA = await getCustomerConfig()
      this.assign = resA.data
    },
    // 管理员分配
    setAdminAssign() {
      setCustomerConfig(this.assign).then(res => {
        if (res.status === 200) {
          this.$message({
            message: '设置成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 查看详情
    checkData(row) {
      this.$router.push({
        path: '/carDealer/customerDetail',
        query: { id: row.id, licenseNo: row.licenseNo }
      })
    },
    // 查询
    selectData() {
      this.size = 10
      this.current = 1
      this.getTableData()
    },
    // 高级搜索窗口
    selectAdvanced() {
      this.isSearchShow = true
      getUsersOnCondition({
        type: '2',
        sourceId: this.$store.getters.userAll.data.channelCode,
        name: ''
      })
        .then(res => {
          this.salersData = res.data
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 清空搜索
    selectAll() {
      for (const key in this.searchForm) {
        this.searchForm[key] = null
      }
      this.searchForm.licenseNo = '' // 车牌
      this.size = 10
      this.current = 1
      this.getTableData()
    },
    // 列表数据
    async getTableData() {
      this.isLoading = true
      delete this.searchForm.ids
      this.searchForm.licenseNo = this.searchForm.licenseNo.toString().trim()
      const resT = await getCustomerTable({
        current: this.current,
        size: this.size,
        params: this.searchForm
      }).catch(err => {
        console.warn(err)
        this.isLoading = false
      })
      this.tableData = resT.data.records
      this.count = resT.data.total
      this.isLoading = false
    },
    // 分配窗口
    distributClick() {
      if (Number(this.distributForm.total) > 0) {
        this.dialogDistribut = true
        this.distributSearch()
      } else {
        this.$message.warning('请先勾选需要分配的数据!')
      }
    },
    // 分配-查询
    distributSearch() {
      // 1续保和出单一体专员、2续保专员、3出单专员
      const Paramsdata = {
        type: '2',
        sourceId: this.$store.getters.userAll.data.channelCode,
        name: this.distributForm.name
      }
      getUsersOnCondition(Paramsdata)
        .then(res => {
          this.distributData = res.data
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 选择分配人员
    handleDistributData(val) {
      // 平均分配方法
      if (this.distributForm.resource === true) {
        this.distributData.forEach(element => {
          element.countNumber = ''
        })
        if (Number.isInteger(this.distributForm.total / val.length)) {
          val.forEach(item => {
            item.countNumber = this.distributForm.total / val.length
          })
        } else {
          const ysNum = this.distributForm.total % val.length
          const allNum = this.distributForm.total - ysNum
          for (let i = 0; i < val.length; i++) {
            val[i].countNumber = allNum / val.length
            if (i === val.length - 1) {
              val[i].countNumber = allNum / val.length + ysNum
            }
          }
        }
      } else {
        if (val.length === 1) {
          val[0].countNumber = this.distributForm.total
        }
      }
      // 获取分配的信息
      this.distributSelection = val
    },
    distriButChange(row) {
      // 分配只能输入数字
      const reg = /^\d+$/
      if (row.countNumber && new RegExp(reg).test(row.countNumber)) {
        row.countNumber = parseInt(row.countNumber)
        // 自动勾选
        this.$refs.multipleDistributData.toggleRowSelection(row, true)
      } else {
        row.countNumber = ''
        this.$refs.multipleDistributData.toggleRowSelection(row, false)
        this.$message.error('请输入正确的数值(大于0的正整数)')
      }
    },
    // 分配确定
    distributConfirm() {
      this.totalNumTJ = null
      this.distributPutlist = []
      const arrN = this.distributSelection.filter(item => {
        return !item.countNumber
      })
      if (arrN.length > 0) {
        this.$message.error('分配数据为空，请选择分配人员或填写分配数据')
        return
      }
      this.distributSelection.forEach(element => {
        this.totalNumTJ += Number(element.countNumber)
        this.distributPutlist.push({
          salesmanId: element.id,
          num: element.countNumber
        })
      })
      if (!this.totalNumTJ) {
        this.$message.error('分配数据为空，请选择分配人员或填写分配数据')
      } else if (
        this.distributForm.total === 1 &&
        this.distributSelection[0].id ===
          this.enterStoreListSelection[0].salesmanId
      ) {
        // 如果勾选一条数据是不可以分配给自己的
        this.$message.error('重复分配，请选择其他的续保员进行分配！')
      } else if (
        this.distributForm.resource === false &&
        this.totalNumTJ !== this.distributForm.total &&
        this.totalNumTJ
      ) {
        if (this.distributForm.total - this.totalNumTJ > 0) {
          const differTotal = this.distributForm.total - this.totalNumTJ
          this.$message.error(`分配数据错误，还有 ${differTotal} 条数据未分配`)
        } else {
          const differTotal = this.totalNumTJ - this.distributForm.total
          this.$message.error(`分配数据错误，多出 ${differTotal} 条数据`)
        }
      } else {
        // 执行提交函数
        const Paramsdata = {
          average: this.distributForm.resource,
          customerIdList: this.enterStoreIdList, // 客户id
          renewalPeopleList: this.distributPutlist
        }
        distributeRenewalPeople(Paramsdata)
          .then(res => {
            this.dialogDistribut = false
            this.$message({
              message: '分配成功',
              type: 'success'
            })
            this.getTableData()
            console.log(res)
          })
          .catch(err => {
            console.warn(err)
            this.$message.error(err)
          })
      }
    },
    // 列表勾选项
    handleSelectionChange(val) {
      const arr = JSON.parse(JSON.stringify(val))
      this.refreshSelection = arr
      this.enterStoreListSelection = arr
      this.distributForm.total = arr.length
      this.enterStoreIdList = []
      this.outIds = []
      arr.forEach(element => {
        this.enterStoreIdList.push(element.id)
        this.outIds.push(element.id)
      })
    },
    // 续保刷新
    async refreshRenewal() {
      if (this.hasRefresh) {
        this.$message.error('正在刷新中,请稍后')
        return
      }
      this.refreshData = []
      const resArr = this.refreshSelection
      const arr = []
      resArr.forEach(item => {
        const obj = {}
        obj.frameNo = item.frameNo
        obj.uuid = item.uuid
        obj.licenseNo = item.licenseNo
        obj.statusValue = '排队中...'
        arr.push(obj)
      })
      if (arr.length <= 0) {
        this.$message.warning('请勾选所要刷新的数据')
        return
      }
      if (arr.length > 20) {
        this.$message.error('每次刷新的数据不能超过10条')
        return
      }
      this.hasRefresh = true
      resArr.forEach(item => {
        const obj = {}
        obj.frameNo = item.frameNo
        obj.uuid = item.uuid
        obj.licenseNo = item.licenseNo
        obj.statusValue = '排队中...'
        this.refreshData.push(obj)
      })
      this.refreshNum = this.refreshData.length
      this.outerVisible = true
      this.innerVisible = true
      this.infoVisible = false
      this.$refs.multipleTable.clearSelection()
      this.refreshArr = []
      for (let i = 0; i < arr.length; i++) {
        try {
          await setCustomerUpdateInsure(
            qs.stringify({
              frameNo: arr[i].frameNo,
              uuid: arr[i].uuid,
              licenseNo: arr[i].licenseNo
            })
          )
          this.refreshData[i].statusValue = '刷新成功'
          this.refreshArr.push('1')
        } catch (error) {
          this.refreshData[i].statusValue = '刷新失败'
          this.refreshArr.push('-1')
        }
      }

      if (this.refreshArr.length === this.refreshNum) {
        this.$message({
          message: '刷新完成',
          type: 'success'
        })
        // this.outerVisible = false
        this.hasRefresh = false
        this.getTableData()
      }
    },
    // 刷新关闭
    refreshClose() {
      if (this.refreshArr.length < this.refreshNum) {
        this.$confirm('刷新未完成，您需要关闭吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.outerVisible = false
          })
          .catch(() => {})
      } else {
        this.outerVisible = false
      }
    },
    // 导入
    exportIn() {
      this.dialogExportIn = true
    },
    // 数据模板
    downExcel() {
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.href = `//ybinsure.com/${
        process.env.API_ENV
      }/dealer/%E5%AE%A2%E6%88%B7%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xls`
      a.download = '数据模板'
      a.click()
      document.body.removeChild(a)
    },
    // 导入数据
    customerUpload(res, file, customerFile) {
      if (res.status === 200) {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.dialogExportIn = false
        this.customerFile = []
        this.getTableData()
      } else {
        this.$message.error(res.msg)
        this.customerFile = []
      }
    },
    // 导入确定
    fileConfirm() {
      this.customerFile = []
      this.dialogExportIn = false
    },
    // 导出
    async exportOut() {
      if (this.outIds.length <= 0) {
        this.outIds = null
      }
      this.searchForm.ids = this.outIds
      this.$refs.multipleTable.clearSelection()
      const resC = await getCustomerExport({ params: this.searchForm })
      const url = window.URL.createObjectURL(resC)
      // var binaryData = []
      // binaryData.push(resC)
      // const url = window.URL.createObjectURL(
      //   new Blob(binaryData, { type: 'application/vnd.ms-excel' })
      // )
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.href = url
      a.download = '客户数据-' + dayjs().format('YYYY-MM-DD HH_mm_ss') + '.xls'
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    },
    // 新增窗口
    addData() {
      this.isEditShow = true
      this.isEdit = false
      this.editLoading = true
      this.activeName = 'first'
      getControlCarType()
        .then(res => {
          this.controlData = res.data.vehicleTypeList
          this.editLoading = false
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 关闭、取消
    close() {
      this.isSearchShow = false
      this.isEditShow = false
      // this.searchReset()
      // this.$refs.customerEdit.$refs.ruleForm.resetFields()
    },
    // 新增保存
    addConfirm() {
      const formData = this.editForm
      console.log(formData)
      if (formData.insuringPerson === 0) {
        formData.holderName = formData.ownerName
        formData.holderIdType = formData.ownerIdType
        formData.holderIdNo = formData.ownerIdNo
        formData.holderSex = formData.ownerSex
        formData.holderAddr = formData.ownerAddr
        formData.holderPhone = formData.ownerPhone
      }
      if (formData.insuredPerson === 0) {
        formData.insuredName = formData.ownerName
        formData.insuredIdType = formData.ownerIdType
        formData.insuredIdNo = formData.ownerIdNo
        formData.insuredSex = formData.ownerSex
        formData.insuredAddr = formData.ownerAddr
        formData.insuredPhone = formData.ownerPhone
      }
      if (formData.insuredPerson === 1) {
        formData.insuredName = formData.holderName
        formData.insuredIdType = formData.holderIdType
        formData.insuredIdNo = formData.holderIdNo
        formData.insuredSex = formData.holderSex
        formData.insuredAddr = formData.holderAddr
        formData.insuredPhone = formData.holderPhone
      }
      console.log(formData)
      const fd = new FormData()
      fd.append('data', JSON.stringify(formData))
      if (formData.file0) {
        fd.append('file0', formData.file0)
      }
      if (formData.file1) {
        fd.append('file1', formData.file1)
      }
      if (formData.file2) {
        fd.append('file2', formData.file2)
      }
      if (formData.file3) {
        fd.append('file3', formData.file3)
      }
      if (
        formData.ownerIdType &&
        formData.ownerIdNo
      ) {
        this.activeName = 'second'
      } else {
        this.activeName = 'first'
      }
      this.$refs.customerEdit.$refs.ruleForm.validate(valid => {
        if (!valid) return
        // if (formData.cardName !== formData.ownerName) {
        //   this.$message.error('车主姓名不一致')
        //   return
        // }
        setCustomerEditImgs(fd)
          .then(res => {
            console.log(res)
            if (res.status === 200) {
              this.isEditShow = false
              this.$message({
                type: 'success',
                message: '新增成功'
              })
              this.getTableData()
              this.$refs.customerEdit.$refs.ruleForm.resetFields()
              this.editForm.imageIdface = null
              this.editForm.imageIdback = null
              this.editForm.imagelicenseface = null
              this.editForm.imagelicenseback = null
              this.editForm.insuringPerson = 0 // 投保人
              this.editForm.insuredPerson = 0 // 被保人
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(err => {
            console.warn(err)
            this.$message.error(err)
          })
      })
    },
    // 删除
    deleteData(index, row) {
      this.$confirm('确定要删除该数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setCustomerDeleteId(row.id).then(res => {
            console.log(res)
            if (res.status === 200) {
              this.tableData.splice(index, 1)
              --this.count
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            }
          })
        })
        .catch(() => {})
    },
    // 点击机构树
    handleTreeClick(val) {
      console.log(val)
      this.searchForm.companyId = val.key
      this.getTableData()
    },
    // 高级搜索重置清空
    searchReset() {
      this.searchForm.endDayNum = null
      this.searchForm.frameNo = null
      this.searchForm.ownerPhone = null
      this.searchForm.holderName = null
      this.searchForm.comTime = null
      this.searchForm.comStartDate = null
      this.searchForm.comEndDate = null
      this.searchForm.forceTime = null
      this.searchForm.forceStartDate = null
      this.searchForm.forceEndDate = null
      this.searchForm.taskState = null
      this.searchForm.alloTime = null
      this.searchForm.allocationStartTime = null
      this.searchForm.allocationEndTime = null
      this.searchForm.salesmanId = null
      this.searchForm.planReturnTime = null
      this.searchForm.renewalState = null
      this.searchForm.quoteFlag = null
      this.searchForm.type = null
      this.searchForm.state = null
      this.searchForm.brandName = null
      this.searchForm.inputType = null
      this.searchForm.enrollTime = null
      this.searchForm.enrollStartDate = null
      this.searchForm.enrollEndDate = null
      this.searchForm.lastCompanyId = null
      this.searchForm.hasPhone = null
    },
    // 高级搜索保存
    searchConfirm() {
      console.log(this.searchForm)
      this.isSearchShow = false
      if (this.searchForm.comTime) {
        this.searchForm.comStartDate = dayjs(this.searchForm.comTime)
          .startOf('month')
          .format('YYYY-MM-DD')
        this.searchForm.comEndDate = dayjs(this.searchForm.comTime)
          .endOf('month')
          .format('YYYY-MM-DD')
      } else {
        this.searchForm.comStartDate = null
        this.searchForm.comEndDate = null
      }
      if (this.searchForm.forceTime) {
        this.searchForm.forceStartDate = dayjs(this.searchForm.forceTime)
          .startOf('month')
          .format('YYYY-MM-DD')
        this.searchForm.forceEndDate = dayjs(this.searchForm.forceTime)
          .endOf('month')
          .format('YYYY-MM-DD')
      } else {
        this.searchForm.forceStartDate = null
        this.searchForm.forceEndDate = null
      }
      if (this.searchForm.alloTime) {
        this.searchForm.allocationStartTime = dayjs(this.searchForm.alloTime)
          .startOf('month')
          .format('YYYY-MM-DD')
        this.searchForm.allocationEndTime = dayjs(this.searchForm.alloTime)
          .endOf('month')
          .format('YYYY-MM-DD')
      } else {
        this.searchForm.allocationStartTime = null
        this.searchForm.allocationEndTime = null
      }
      if (this.searchForm.enrollTime) {
        this.searchForm.enrollStartDate = dayjs(this.searchForm.enrollTime)
          .startOf('month')
          .format('YYYY-MM-DD')
        this.searchForm.enrollEndDate = dayjs(this.searchForm.enrollTime)
          .endOf('month')
          .format('YYYY-MM-DD')
      } else {
        this.searchForm.enrollStartDate = null
        this.searchForm.enrollEndDate = null
      }
      // this.searchReset()
      this.size = 10
      this.current = 1
      this.getTableData()
    }
  }
}
</script>

<style lang="scss">
.customer {
  display: flex;
  padding: 15px 15px 15px 0;
  .left-pane {
    display: flex;
    padding: 0;
    margin-right: 5px;
    background: transparent;
    .tree-wrap {
      width: 260px;
      padding: 25px 10px;
      overflow: auto;
      box-sizing: border-box;
      border-color: #e8e8e8;
      background-color: #fff;
      transition: all 0.3s ease;
      min-height: calc(100vh - 114px);
    }
    .hide {
      width: 0;
      overflow: hidden;
      padding: 0px;
    }
    .arrow-wrap {
      display: flex;
      align-items: center;
      min-height: calc(100vh - 114px);
      box-sizing: border-box;
      padding-bottom: 40px;
      cursor: pointer;
      img {
        width: 12px;
      }
    }
    .el-tree-node > .el-tree-node__children {
      overflow: visible;
    }
    .el-tree-node__label {
      padding-right: 10px;
    }
  }
  .right-pane {
    flex: 1;
    overflow: auto;
    min-height: calc(100vh - 114px);
  }
}
.customer-box {
  .el-card {
    margin-bottom: 10px;
    .el-card__header {
      padding: 0px 20px;
      font-size: 14px;
      font-weight: 900;
    }
  }
}
.customer-refresh {
  position: fixed;
  right: 20px;
  bottom: 0px;
  z-index: 2000;
  width: 250px;
  background-color: #fff;
  box-shadow: 0px 0px 2px 0px #ccc;
  border-radius: 5px;
  padding: 10px 10px 20px 10px;
  .customer-refresh-title {
    height: 50px;
    padding: 10px 10px 0px 10px;
    font-size: 14px;
    color: #333;
  }
  .customer-refresh-close {
    cursor: pointer;
    font-size: 16px;
    width: 20px;
    opacity: 0.7;
    &:hover {
      opacity: 1;
    }
  }
  .customer-refresh-minus {
    cursor: pointer;
    font-size: 14px;
    width: 20px;
    opacity: 0.8;
    &:hover {
      opacity: 1;
    }
  }
  .customer-refresh-info {
    font-size: 10px;
    line-height: 20px;
    color: #aaa;
    cursor: pointer;
  }
  .el-table__header-wrapper {
    display: none;
  }
}
</style>
