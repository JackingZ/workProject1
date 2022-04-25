<template>
  <div class="left-pane customerManage" style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <app-slide v-loading="orgSelectList.isSideLoading" v-if="!isChackAndEditShow" :is-active="isActive">
      <div class="tree-title">
        <p>机构列表</p>
        <div class="showtype">
          <el-select
            v-model="selectTreeType"
            placeholder="请选择"
            size="small"
            style="width:130px;"
            @change="queryAll"
          >
            <el-option :value="1" label="查看全部下级"/>
            <el-option :value="2" label="仅看当前机构"/>
          </el-select>
        </div>
      </div>
      <el-tree
        ref="orgtree"
        :data="orgSelectList.data"
        :props="orgProps"
        :expand-on-click-node="false"
        :empty-text="selectValue.channel ? '暂无数据' : '请先选择渠道'"
        class="filter-tree"
        @node-click="selOrg"
      />
    </app-slide>
    <div v-show="!isChackAndEditShow" style="display: flex;align-items: center;">
      <div class="arrow-wrap" style="z-index:1;margin-right: -12px;">
        <img :src="isActive ? expandIcon.left : expandIcon.right" style="width:10px;height:32px;" @click="isActive = !isActive">
      </div>
    </div>
    <div v-show="!isChackAndEditShow" class="app-container" style="width: 100%;overflow: auto;">
      <head-info title="客户管理" info/>
      <div class="app-panel channel-right">
        <el-row>
          <el-col :span="7">
            <el-row>
              <el-button
                v-permission="permissionList.newCustomerManageInsert"
                type="text"
                icon="el-icon-circle-plus-outline"
                style=""
                @click="insertData"
              >新增</el-button>
              <el-button
                v-permission="permissionList.newCustomerManageAllot"
                type="text"
                icon="el-icon-sort"
                style=""
                @click="distributeData"
              >分配</el-button>
              <el-button
                v-permission="permissionList.newCustomerManageDelete"
                type="text"
                icon="el-icon-delete"
                style=""
                @click="deleteData"
              >删除</el-button>
              <el-button
                v-permission="permissionList.newCustomerManageRefresh"
                v-if="isDistributionChannel"
                type="text"
                icon="el-icon-refresh"
                style=""
                @click="handlerRefreshClick"
              >刷新续保</el-button>
              <el-button
                v-if="false"
                type="text"
                icon="el-icon-download"
                style=""
                @click="exportIn"
              >导入</el-button>
              <el-button
                v-if="false"
                type="text"
                icon="el-icon-upload2"
                style=""
                @click="exportExcel"
              >导出</el-button>
            </el-row>
          </el-col>
          <el-col :span="17" style="float: right;">
            <el-row style="text-align: right;">
              <el-select
                v-if="isAnyAdminChannel"
                v-model="selectValue.channelCode"
                size="small"
                filterable
                placeholder="所属渠道"
                style="margin-right: 10px;width: 130px;flex: 0 0 auto;"
                @change="getOrg"
              >
                <el-option
                  v-for="item in channelSelectList"
                  :key="item.code"
                  :label="item.shortName"
                  :value="item.code"
                />
              </el-select>
              <el-select
                v-model="timeType"
                size="small"
                placeholder="时间类型"
                style="width: 100px;"
              >
                <el-option :value="1" label="录入时间"/>
                <el-option :value="2" label="更新时间"/>
                <el-option :value="3" label="回访时间"/>
              </el-select>
              <el-date-picker
                v-model="selectValue.date"
                :default-time="['00:00:00', '23:59:59']"
                clearable
                size="small"
                style="width: 248px;margin-right: 10px;"
                type="daterange"
                range-separator="-"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
              <el-input
                v-model="selectValue.keywords"
                placeholder="请输入内容"
                size="small"
                style="width: 270px;"
              >
                <el-select
                  slot="prepend"
                  v-model="keywordType"
                  placeholder="请选择"
                  size="small"
                  style="width: 100px;"
                >
                  <el-option :value="1" label="车牌号"/>
                  <el-option :value="2" label="车架号"/>
                  <el-option :value="3" label="车主姓名"/>
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
          :data="tableList"
          height="calc(100vh - 320px)"
          max-height="100vh"
          border
          style="width: 100%;margin: 20px 0;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" fixed="left"/>
          <el-table-column prop="areaName" label="地区" width="80"/>
          <el-table-column prop="licenseNo" label="车牌号" width="100"/>
          <el-table-column prop="ownerName" label="车主姓名" min-width="100"/>
          <el-table-column prop="frameNo" label="车架号" width="175"/>
          <el-table-column prop="brandName" label="品牌型号" min-width="220" />
          <el-table-column prop="salesName" label="业务员" width="115"/>
          <el-table-column :formatter="formatter" prop="insureCompanyId" label="往年投保" width="90"/>
          <el-table-column label="距离到期 (天)" width="110">
            <template slot-scope="scope">
              <div>
                <span style="margin-right:5px;">{{ scope.row.expireDay }}</span>
                <el-tooltip v-if="scope.row.isRepairExpireDay" :content="'已自动修复保险止期至'+scope.row.repairExpireDay" class="item" effect="light" placement="left-end">
                  <i style="font-size:12px;" class="el-icon-info"/>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="statusText" label="客户状态" width="80"/>
          <el-table-column prop="entryDate" label="录入时间" sortable width="160"/>
          <el-table-column label="操作" width="80" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                style="font-size: 14px;"
                @click="gotoDetail(scope)"
              >详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分配窗口 -->
        <el-dialog
          :visible.sync="isDistributeShow"
          :title="isfirstStepShow ? '选择业务员':'选择分配方式'"
          width="600px"
          @close = "handleFirstStepClose">
          <div v-if="isfirstStepShow">
            <el-select
              v-model="distributeInfo.hasSelect"
              size="small"
              placeholder="时间类型"
              style="width: 130px;margin-right: 10px;"
            >
              <el-option :value="1" label="全部" />
              <el-option :value="2" label="已选择" />
              <el-option :value="3" label="未选择" />
            </el-select>
            <el-input
              v-model="distributeInfo.keywords"
              placeholder="请输入内容"
              size="small"
              style="width: 260px;"
            >
              <el-select
                slot="prepend"
                v-model="distributeInfo.keywordType"
                placeholder="请选择"
                size="small"
                style="width: 100px;"
              >
                <el-option :value="1" label="业务员"/>
                <el-option :value="2" label="登录账号"/>
              </el-select>
            </el-input>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              style="margin-left: 10px;"
              @click="querySelectData"
            >查询</el-button>
            <el-table
              v-loading="salemanList.loading"
              ref="firstStep"
              :data="selectDistributeInfo"
              :row-key="getRowKeys"
              height="300px"
              border
              style="margin-top:20px;"
              @selection-change="handleDistributeSelect">
              <el-table-column :reserve-selection="true" type="selection" width="55"/>
              <el-table-column property="idName" label="业务员" min-width="80"/>
              <el-table-column property="phone" label="登录账户" min-width="120"/>
            </el-table>
          </div>
          <span v-if="isfirstStepShow" slot="footer" class="dialog-footer">
            <div class="footer" style="display:flex;justify-content:space-between;align-items:center;padding-top:10px;width:100%;">
              <span class="txt">已选择待分配客户{{ nodistributeCount }}条</span>
              <el-button size="small" @click="gotoNextStep" >下一步，选择分配方式</el-button>
            </div>
          </span>
          <div v-if="!isfirstStepShow" class="distribute-type" style="text-align:center;">
            <div style="height:353px; display: flex;align-items: center;justify-content: center; ">
              设置分配方式：
              <el-radio-group v-model="distributeInfo.type">
                <el-radio :label="1">平均分配</el-radio>
                <el-radio :label="2">固定分配</el-radio>
              </el-radio-group>
            </div>
          </div>
          <span v-if="!isfirstStepShow" slot="footer" class="dialog-footer" style="display:flex;justify-content:flex-end;align-items:center;padding-top:10px;">
            <el-button size="small" @click="isfirstStepShow = true" >上一步</el-button>
            <el-button size="small" @click="distributeConfirm" >下一步，进行分配客户</el-button>
          </span>
        </el-dialog>
        <!-- 进行分配客户 -->
        <el-dialog :visible.sync="dialogSecDistribute" title="分配客户" width="550px" >
          <div>{{ distributeInfo.type === 1 ? '平均分配' : '固定分配' }} | 已选择分配数据{{ nodistributeCount }}，已选择业务员人数{{ distriSelectRow.length }}，获得数量如下所示</div>
          <el-table ref="multipleTable" :data="distriSelectRow" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" min-height="200px" max-height="300px" border style="margin-top:20px;text-align:center;">
            <!-- <el-table-column type="selection" width="55"/> -->
            <el-table-column property="idName" label="业务员" min-width="100"/>
            <el-table-column property="phone" label="登录账户" min-width="100"/>
            <el-table-column label="获得数量" min-width="100" fixed="right">
              <template slot-scope="scope">
                <span v-show="distributeInfo.type === 1">{{ scope.row.count }}</span>
                <el-input-number
                  v-show="distributeInfo.type === 2"
                  v-model="scope.row.count"
                  :min="1"
                  :max="nodistributeCount"
                  :step = "1"
                  :controls="false"
                  size="small"
                  style="width:100px;"
                  @change="handleChange(scope)" />
              </template>
            </el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="reSelectDistribute">重新选择</el-button>
            <el-button type="primary" size="small" @click="seDistributeConfirm">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 导入 -->
        <el-dialog :visible.sync="dialogExportIn" title="导入数据" width="500px" >
          <div style="margin-bottom: 20px;">
            <span>1、请先下载Excel模板：</span>
            <span style="color: #1890ff;cursor: pointer;" @click="downExcel">数据模板.xls</span>
          </div>
          <div>
            <span>2、将加工好的Excel导入：</span>
            <el-upload
              :file-list="customerFile"
              :limit="1"
              :on-success="customerUpload"
              :headers="{ 'Authorization':token }"
              :action="actionUrl"
              accept=".xls,.xlsx"
              style="margin: 10px 0px 0px 20px;">
              <el-button class="el-icon-upload2" size="small">浏览</el-button>
            </el-upload>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogExportIn = false">取 消</el-button>
            <el-button type="primary" size="small" @click="fileConfirm">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 刷新续保 -->
        <refresh-renew
          v-show="isRefreshShow"
          :refresh-info="refreshData"
          @deleteRefreshData="deleteRefreshData"
          @close="closeRefeshCard"
          @delete="handleRefreshDelete" />
        <el-pagination
          :total="count"
          :current-page.sync="page"
          :page-size="size"
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
    <!-- 新增 -->
    <customer-insert
      v-if="isChackAndEditShow && isInsertDetailShow === 1"
      @cancel="close"
      @confirm="confirm"
    />
    <!-- 客户详情 -->
    <customer-details
      v-if="isChackAndEditShow && isInsertDetailShow === 2"
      :customer-id="customerId"
      :is-loading="detailLoading"
      :customer-detail-data.sync="customerDetailData"
      :car-info-list.sync="carInfoList"
      @refreshDetail = "gotoDetail"
      @cancel="close"
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
      <customer-screen
        ref="policyScreen"
        :select-value="selectValue"
        @openTree="openOrganTree"
        @screen="screen"
        @reset="reset"
      />
    </app-drawer>
  </div>
</template>

<script>
import {
  getAllChannelData
} from '@/api/customerManage'
import {
  queryCustomerStatus,
  queryCustomerDetail,
  deleteCustomersData,
  queryCustomerData,
  queryCustomerSaleman,
  // queryNoDistriCustomers,
  getQuoteRecord,
  getPreviInsureData,
  distributeCustomers,
  refreshCustomerRenew
} from '@/api/newCustomer'
import {
  getCarInfoList
} from '@/api/policy_management'
import { getOrgData } from '@/api/number'
import { AppSlide } from '@/components/Slide'
// import CheckAndEditPolicy from './components/checkandeditpolicy'
import { mapGetters } from 'vuex'
import { AppDrawer } from '@/components/Drawer'
import CustomerScreen from './components/customerscreen'
// import PolicyDetails from '@/views/businessmanagement/policy/recording/index'
import CustomerDetails from './components/customerDetails'
import CustomerInsert from './components/customerinsert'
import RefreshRenew from './components/refreshRenew'
import { getToken, getTokenType } from '@/utils/auth'
import company from '@/views/businessmanagement/company.js'
import dayjs from 'dayjs'

export default {
  name: 'CustomerManage',
  components: {
    AppSlide,
    AppDrawer,
    CustomerScreen,
    CustomerInsert,
    CustomerDetails,
    RefreshRenew
  },
  data() {
    return {
      customerId: '',
      isInsertShow: false, // 新增页面是否显示
      isLoading: false,
      selectTreeType: 1, // 树形结构类型 默认全部
      isScreenShow: false,
      isChackAndEditShow: false,
      isDistributeShow: false, // 分配窗口的显示与隐藏
      dialogSecDistribute: false,
      distributeInfo: {
        hasSelect: 1,
        keywordType: 1,
        keyword: '',
        type: 1
      },
      selectDistributeInfo: [],
      distributeCountData: [], // 固定分配后的分配的数据
      isfirstStepShow: true,
      dialogExportIn: false, // 导入模板窗口显示隐藏
      isInsertDetailShow: 1,
      customerFile: [], // 上传的文件列表
      actionUrl: `${process.env.SERVER_URL}${
        process.env.API_ENV
      }/dealer/auth/customer/importCustomer`,
      token: `${getTokenType()} ${getToken()}`,
      selectRows: [],
      distriSelectRow: [],
      refreshData: [],
      isRefreshShow: false,
      followStatus: [],
      customerDetailData: { // 客户详情的数据
      },
      detailLoading: false,
      count: 0,
      page: 1, // 当前页码
      size: 20, // 每页数据条数
      tableList: [],
      gridData: [],
      policyDetail: {},
      timeType: 1, // 时间类型
      keywordType: 1, // 关键字类型
      selectValue: {
        channelCode: '',
        companyId: '',
        businessDate: [],
        trafficDate: [],
        lastInsureCompany: '',
        source: '',
        distriStatus: '',
        assignTime: [],
        saleman: '',
        customerStatus: '',
        followUpStatus: '',
        hasCell: '',
        firstDate: [],
        brandCode: '',
        date: [],
        keyword: ''
      },
      distributeParams: {},
      nodistributeCount: 0,
      nodistributeData: [], // 未分配客户id
      multipleSelection: [],
      // 侧滑树形结构的开关按钮
      expandIcon: {
        left: require('@/assets/imgs/expand_select-left.png'),
        right: require('@/assets/imgs/expand_select-right.png')
      },
      salemanList: { // 业务员
        data: [],
        loading: false
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
      channelSelectList: [],
      carInfoList: {} // 车辆信息列表
    }
  },
  computed: {
    ...mapGetters(['isAnyAdminChannel', 'isDistributionChannel'])
  },
  watch: {
    // 'selectValue.channelCode': {
    //   handler: function(newVal) { // 特别注意，不能用箭头函数，箭头函数，this指向全局
    //     console.log(newVal)
    //     // if (!newVal || newVal.length === 0) {
    //     //   this.selectValue.companyId = ''
    //     // }
    //     this.getOrg()
    //   },
    //   deep: true
    // }
  },
  async created() {
    if (!this.isAnyAdminChannel) {
      this.selectValue.channelCode = JSON.parse(localStorage.getItem('userAll')).data.channelCode
    }
    this.closeHash() // 关掉hash
    const { data: channelList } = await getAllChannelData() // 查询所属渠道
    this.channelSelectList = channelList
    this.selectValue.channelCode = channelList[0].code
    const { data: organList } = await getOrgData({
      channelCode: this.selectValue.channelCode
    })
    this.orgSelectList.data = organList
    this.selectValue.companyId = organList[0].key
    this.isActive = true
    this.getCutomerType()
    this.queryAll()
  },
  methods: {
    // 查询
    queryAll() {
      console.log('查询列表')
      if (!this.selectValue.companyId) {
        this.$message({
          message: '请先选择所属机构',
          type: 'warning'
        })
        return
      }
      this.isLoading = true
      const model = {
        channelCode: this.selectValue.channelCode, // 渠道id
        companyId: this.selectValue.companyId, // 机构ID
        entryDateSort: 2, // 录入时间排序规则, 1-升序, 2-降序
        vciEndDateStart: this.selectValue.businessDate && this.selectValue.businessDate.length > 0 ? this.selectValue.businessDate[0] : '', // 商业险起期
        vciEndDateClose: this.selectValue.businessDate && this.selectValue.businessDate.length > 0 ? this.selectValue.businessDate[1] : '', // 商业险止期
        tciEndDateStart: this.selectValue.trafficDate && this.selectValue.trafficDate.length > 0 ? this.selectValue.trafficDate[0] : '', // 交强险起期
        tciEndDateClose: this.selectValue.trafficDate && this.selectValue.trafficDate.length > 0 ? this.selectValue.trafficDate[1] : '', // 交强险止期
        insureCompanyId: this.selectValue.lastInsureCompany,
        entrySource: this.selectValue.source,
        allocationStatus: this.selectValue.distriStatus,
        allocationDateStart: this.selectValue.assignTime && this.selectValue.assignTime.length > 0 ? this.selectValue.assignTime[0] : '',
        allocationDateClose: this.selectValue.assignTime && this.selectValue.assignTime.length > 0 ? this.selectValue.assignTime[1] : '',
        salesId: this.selectValue.saleman,
        status: this.selectValue.customerStatus,
        followUpStatus: this.selectValue.followStatus,
        phoneStatus: this.selectValue.hasCell,
        enrollDateStart: this.selectValue.firstDate && this.selectValue.firstDate.length > 0 ? this.selectValue.firstDate[0] : '',
        enrollDateClose: this.selectValue.firstDate && this.selectValue.firstDate.length > 0 ? this.selectValue.firstDate[1] : '',
        brandName: this.selectValue.brandCode,
        companyFilterType: this.selectTreeType
      }
      // 根据时间类型来确定要传字段
      if (this.selectValue.date && this.selectValue.date.length > 0) {
        switch (this.timeType) {
          case 1:
            model.entryDateStart = this.selectValue.date[0]
            model.entryDateClose = this.selectValue.date[1]
            break
          case 2:
            model.updateDateStart = this.selectValue.date[0]
            model.updateDateClose = this.selectValue.date[1]
            break
          case 3:
            model.visitDateStart = this.selectValue.date[0]
            model.visitDateClose = this.selectValue.date[1]
            break
        }
      }
      // 根据关键字类型来传字段
      switch (this.keywordType) {
        case 1:
          model.licenseNo = this.selectValue.keywords
          break
        case 2:
          model.frameNo = this.selectValue.keywords
          break
        case 3:
          model.ownerName = this.selectValue.keywords
          break
      }
      // this.distributeParams = model // 查询未分配客户id参数
      // this.queryNodispatch(this.distributeParams)
      const params = {
        page: this.page,
        size: this.size,
        model: model
      }
      queryCustomerData(params).then(res => {
        console.log(res)
        this.tableList = res.data.model
        this.count = res.data.count
        this.isLoading = false
      }).catch(err => {
        console.warn(err)
        this.isLoading = false
      })
    //   this.selectTreeType
    },
    // 格式或截止时间格式
    // formateEndDate(date) {
    //   return dayjs(date).format('YYYY-MM-DD 23:59:59')
    // },
    // 改变每页条数触发的事件
    handleSizeChange(val) {
      this.size = val
      this.queryAll()
    },
    // 页码发生变化的事件
    getCurrentData() {
      this.queryAll()
    },
    closeHash() {
      history.replaceState(null, '', `${location.pathname}${location.search}`)
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
      console.log('筛选提交确认按钮')
      console.log(this.selectValue)
      this.queryAll()
      this.screenClose()
    },
    reset() {
      const val = {
        company: undefined,
        insureType: undefined,
        policyType: undefined,
        workNo: undefined
      }
      this.selectValue = { ...this.selectValue, ...val }
    },
    // 新增
    insertData() {
      this.isChackAndEditShow = true
      this.isInsertDetailShow = 1
      this.getSalemanList() // 获取业务员信息
    },
    selOrg(val) {
      if (val) {
        console.log(val)
        this.selectValue.companyId = val.key
        // this.selectValue.sourceId = JSON.parse(localStorage.getItem('userAll')).data.channelCode
        this.queryAll()
      }
    },
    // 获取机构
    getOrg() {
      this.selectValue.companyId = undefined
      if (!this.isAnyAdminChannel) {
        // 判断是否运维
        var channelCode = JSON.parse(localStorage.getItem('userAll')).data.channelCode
        console.log('渠道编号', channelCode)
      } else {
        channelCode = this.selectValue.channelCode
      }
      getOrgData({
        channelCode: channelCode
      })
        .then(res => {
          // console.log(res)
          this.orgSelectList.data = res.data
          console.log(this.orgSelectList.data)
          // this.queryAll()
        })
        .catch(err => {
          console.warn(err)
        })
    },
    close() {
      this.isChackAndEditShow = false
    },
    confirm() {
      this.isChackAndEditShow = false
      // this.selectValue.companyId = companyId
      if (!this.selectValue.companyId) {
        return
      }
      this.queryAll()
    },
    // 获取车辆相关基础信息字典
    getCarInfo() {
      getCarInfoList()
        .then(res => {
          this.carInfoList = res.data
        })
        .catch(err => {
          console.warn(err)
        })
    },
    formatter(row, column) {
      const companyList = company()
      const info = companyList.find(item => {
        return item.id === parseInt(row.insureCompanyId)
      })
      // console.log('最终的info', info)
      if (!info) {
        return ''
      }
      return info.name
    },
    // 查看详情
    gotoDetail(scope) {
      this.detailLoading = true
      this.isChackAndEditShow = true
      this.isInsertDetailShow = 2
      if (scope) {
        this.customerId = scope.row.id // 客户id
        this.$store.commit('setChannelCode', scope.row.channelCode)
        const params = {
          licenseNo: scope.row.licenseNo,
          // licenseNo: '粤L70X75',
          // licenseNo: '皖EB0300',
          frameNo: scope.row.frameNo,
          channelCode: scope.row.channelCode
          // channelCode: '001'
        }
        this.getPreviInsure(params) // 获取往年投保
      }
      queryCustomerDetail(this.customerId).then(res => {
        // this.detailLoading = false
        // console.log(res)
        this.customerDetailData = res.data
        this.getSalemanList() // 获取业务员信息
        this.getCarInfo() // 获取车辆信息
        this.detailLoading = false
        // this.customerDetailData.quoteRecords = [
        //   {
        //     insureCompanyId: '2',
        //     insureCompanyName: '太平洋',
        //     quoteStatusText: '报价成功',
        //     totalPremium: '4999.00',
        //     quoteDate: '2018-12-29 22:00:00',
        //     orderId: 'QSHZF07Y1419F019126B',
        //     policyId: ''
        //   },
        //   {
        //     insureCompanyId: '1',
        //     insureCompanyName: '人保',
        //     quoteStatusText: '报价成功',
        //     totalPremium: '4888.00',
        //     quoteDate: '2018-12-29 22:00:00',
        //     orderId: 'FDZA201911010001275563',
        //     policyId: ''
        //   }
        // ]
        if (this.customerDetailData.quoteRecords.length > 0) {
          this.handleQuoteClick(this.customerDetailData.quoteRecords[0].orderId) // 获取详情页面报价记录数据
        }

        // this.customerDetailData.carInfo.transfer = this.customerDetailData.carInfo.transfer ? '是' : '否'
        this.customerDetailData.customer.insureCompanyId = parseInt(this.customerDetailData.customer.insureCompanyId)
        const followUpList = this.customerDetailData.followUps
        // 数组结构重组
        const followData = []
        followUpList.forEach(item => {
          item.time = item.createDate.split(' ')[1].trim()
          followData.push({
            title: item.createDate.slice(0, 10),
            descipt: [item]
          })
        })
        console.log('followData', followData)
        const temp = []
        const narr = []
        followData.forEach((item, index) => {
          const n = temp.indexOf(item.title)
          if (n === -1) {
            temp.push(item.title)
            narr.push({
              title: item.title,
              descipt: item.descipt
            })
            console.log('temp', temp)
          } else {
            console.log('重复的项', item.descipt)
            // item.descipt.forEach(info => {
            //   narr[n].descipt.push(item)
            // })
            narr[n].descipt.push(item.descipt[0])

            // const i = followData.indexOf(item.title)
            // // item.descipt.forEach(ITWM)
            // followData[index].descipt.push(item.descipt[0])
            // followData.splice(index, 1)
          }
        })
        // this.customerDetailData.followData = followData
        this.customerDetailData.followData = narr
        // console.log(this.customerDetailData)
        // localStorage.setItem('customerDetailInfo', JSON.stringify(this.customerDetailData))
        this.$store.commit('setCustomer', JSON.stringify(this.customerDetailData))
      }).catch(err => {
        this.detailLoading = false
        console.warn(err)
      })
    },
    // 详情页面报价记录点击事件
    handleQuoteClick(val) {
      getQuoteRecord(val).then(res => {
        const quotoInfo = res.data
        this.$store.commit('setQuoteRecord', quotoInfo)
        // this.quotoInfo.carInfo = res.data.baseInfo
        // this.quotoInfo.riskList = res.data.riskList
        console.log(res)
      }).catch(err => {
        console.warn(err)
      })
    },
    // 查看往年投保
    getPreviInsure(params) {
      getPreviInsureData(params).then(res => {
        // console.log(res)
        const result = res.data
        if (String(result) === '{}') {
          console.log('没有往年投保信息 ')
        }
        this.$store.commit('setPreviInsure', result)
      })
    },
    // 获取业务员
    getSalemanList() {
      this.salemanList.loading = true
      const params = [this.selectValue.companyId]
      queryCustomerSaleman(params).then(res => {
        // console.log(res)
        // res.data.forEach(item => {
        //   // item.fullName = item.idName + '--' + item.phone
        //   if (item.agentCode) {
        //     delete item.agentCode
        //   }
        // })
        this.salemanList.data = res.data
        this.selectDistributeInfo = this.salemanList.data.concat()
        this.salemanList.loading = false
      }).catch(err => {
        this.salemanList.loading = false
        console.warn(err)
      })
    },
    // 选中行数回调
    handleSelectionChange(val) {
      console.log(val)
      this.selectRows = val
    },
    // 分配表格筛选
    handleDistributeSelect(val) {
      console.log('选择的数据1', val)
      this.distriSelectRow = val
    },
    // 分配操作
    distributeData() {
      const isDistribute = this.selectRows.some(item => {
        if (item.salesName) {
          return true
        }
      })
      // console.log('是否有业务员', isDistribute)
      if (isDistribute || this.selectRows.length === 0) { // 分配前需要选择未分配的客户 （即没有业务员的客户）
        this.$message({
          message: '请先筛选未分配的客户数据',
          type: 'warning'
        })
        this.selectTreeType = 2
        return
      }
      // console.log('选择的结构', this.selectValue.companyId)
      if (!this.selectValue.companyId) {
        this.$message({
          message: '请先选中确定的机构层级',
          type: 'warning'
        })
        this.isActive = true
        return
      }
      this.nodistributeCount = this.selectRows.length
      // if (this.nodistributeCount === 0) {
      //   this.$message({
      //     message: '没有查询到未分配的客户',
      //     type: 'warning'
      //   })
      //   return
      // }
      this.isDistributeShow = true
      this.getSalemanList()
      // queryNoDistriCustomers(this.distributeParams).then(res => {
      //   this.nodistributeData = res.data
      //   this.nodistributeCount = res.data.length
      // }).catch(err => {
      //   // this.salemanList.loading = false
      //   console.warn(err)
      // })
    },

    // 查询未分配的客户
    // queryNodispatch(params) {
    //   queryNoDistriCustomers(params).then(res => {
    //     this.nodistributeData = res.data
    //     this.nodistributeCount = res.data.length
    //   }).catch(err => {
    //     // this.salemanList.loading = false
    //     console.warn(err)
    //   })
    // },
    getRowKeys(row) {
      return row.id
    },
    // 查询分配操作
    querySelectData() {
      // 取要进行分配的数据
      switch (this.distributeInfo.hasSelect) {
        case 1: // 全部
          this.selectDistributeInfo = this.salemanList.data.concat()
          // this.selectDistributeInfo = this.salemanList.data
          break
        case 2: // 已选择
          this.selectDistributeInfo = this.distriSelectRow
          break
        case 3: // 未选择
          this.selectDistributeInfo = this.salemanList.data.filter(item => {
            const isExist = this.distriSelectRow.find(info => {
              return info.id === item.id
            })
            return !isExist
          })
      }
      // console.log('已选择的数据', this.selectDistributeInfo)
      //  查询关键字
      if (this.distributeInfo.keywords) {
        if (this.distributeInfo.keywordType === 1) {
          this.selectDistributeInfo = this.salemanList.data.filter(item => {
            return item.idName.indexOf(this.distributeInfo.keywords) > -1
          })
        } else {
          this.selectDistributeInfo = this.salemanList.data.filter(item => {
            return item.phone === this.distributeInfo.keywords.trim()
          })
        }
      }
    },
    // 下一步分配方式
    gotoNextStep() {
      if (this.distriSelectRow.length === 0) {
        this.$message({
          message: '请选择需要分配的业务员',
          type: 'warning'
        })
        return
      }
      if (this.distriSelectRow.length > this.nodistributeCount) {
        this.$message({
          message: '已超过待分配客户数',
          type: 'warning'
        })
        return
      }
      this.isfirstStepShow = false
    },
    // 分配方式选择
    distributeConfirm() {
      this.isDistributeShow = false
      this.dialogSecDistribute = true

      if (this.distributeInfo.type === 1) { // 平均分配
        const total = this.nodistributeCount
        const count = this.distriSelectRow.length
        const base = Math.floor(total / count)
        const rest = total % count

        this.distriSelectRow.forEach((item, index) => {
          item.count = base + (index < rest ? 1 : 0)
        })
        console.log(this.distriSelectRow)
      } else { // 固定分配
        this.distriSelectRow.forEach(item => {
          item.count = 1
          // this.maxCount = this.nodistributeCount
        })
      }
    },
    seDistributeConfirm() {
      // this.distriSelectRow = [{
      //   agentCode: '',
      //   count: 1,
      //   id: '001',
      //   idName: '业务员B',
      //   phone: '13418599999'
      // },
      // {
      //   agentCode: '',
      //   count: 3,
      //   id: '002',
      //   idName: '业务员A',
      //   phone: '13418599999'
      // },
      // {
      //   agentCode: '',
      //   count: 2,
      //   id: '003',
      //   idName: '业务员C',
      //   phone: '13418599999'
      // }]
      // this.nodistributeData = ['111', '222', '333', '555', '6666', '777']
      this.nodistributeData = []
      this.selectRows.forEach(item => {
        if (item.id) {
          this.nodistributeData.push(item.id)
        }
      })
      console.log('选择的客户this.nodistributeData', this.nodistributeData)
      let sum = 0
      this.distriSelectRow.forEach(item => {
        sum += item.count
      })
      console.log('选中的总数', sum)
      if (sum > this.nodistributeCount) {
        this.$message({
          message: '填写的客户分配数量不能超过待分配客户总量',
          type: 'warning'
        })
        return
      }
      // 重组数据接口，组成 客户id和业务员id一对一格式
      const customerData = []
      this.distriSelectRow.forEach(item => {
        for (let i = 0; i < item.count; i++) {
          console.log(this.nodistributeData)
          const temp = {}
          temp.id = this.nodistributeData.pop()
          temp.salesId = item.id
          customerData.push(temp)
        }
      })
      const params = []
      customerData.forEach(item => {
        params.push({
          customer: item
        })
      })
      console.log('分配的数据', customerData)
      distributeCustomers(params).then(res => {
        // console.log(res)
        this.dialogSecDistribute = false
        this.$message({
          message: '分配成功',
          type: 'success'
        })
      })
    },
    // 重新选择
    reSelectDistribute() {
      this.isDistributeShow = true
      this.isfirstStepShow = true
      this.distriSelectRow = []
    },
    // 固定分配数量变化回调
    handleChange(scope) {
      console.log(scope)
      // this.maxCount -= scope.row.count
      // console.log('最大值', this.maxCount)
      console.log('选择的数据', this.distriSelectRow)
    },
    // 第一个窗口关闭的回调
    handleFirstStepClose() {
      this.isfirstStepShow = true
      // this.distriSelectRow = []
    },
    // 关闭第二个窗口
    handleSecondDilogClose() {
      this.distriSelectRow = []
    },
    // 删除数据
    deleteData() {
      if (this.selectRows.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择需要删除的数据'
        })
        return
      }
      console.log(this.selectRows)
      this.$confirm('此操作将删除该选中数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = []
        this.selectRows.forEach(item => {
          params.push(item.id)
        })
        deleteCustomersData(params).then(res => {
          this.queryAll()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(err => {
          console.warn(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 导入
    exportIn() {
      this.dialogExportIn = true
    },
    // 导入确定
    fileConfirm() {
      this.customerFile = []
      this.dialogExportIn = false
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
    // 导入数据 成功的钩子
    customerUpload(res, file, customerFile) {
      if (res.status === 200) {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.dialogExportIn = false
        this.customerFile = []
        this.queryAll()
      } else {
        this.$message.error(res.msg)
        this.customerFile = []
      }
    },
    // 导出数据
    exportExcel() {
      const res = '' // 此处需要发送请
      const url = window.URL.createObjectURL(res)
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.href = url
      a.download =
            '客户信息-' + dayjs().format('YYYY-MM-DD HH_mm_ss') + '.xls'
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    },
    // 刷新续保刷新
    handlerRefreshClick() {
      if (this.selectRows.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择需要刷新续保的数据'
        })
        return
      }
      if (!this.selectValue.companyId) {
        this.$message({
          message: '请先选中确定的机构层级',
          type: 'warning'
        })
        this.isActive = true
        return
      }
      this.selectRows.forEach(item => {
        item.type = '2' // 默认状态
      })
      this.refreshData = this.selectRows.concat() // 数组的深拷贝
      // 最多选择20条
      if (this.refreshData.length > 20) {
        this.$message({
          type: 'warning',
          message: '最多只能选择20条数据'
        })
        return
      }
      // 判断当天查询续保次数是否达到上限
      // const currentDayTimes = 60
      // if (currentDayTimes > 100) {
      //   this.$message({
      //     type: 'warning',
      //     message: '今日刷新续保剩余0次，请明天再试'
      //   })
      //   return
      // }
      this.isRefreshShow = true
      this.refreshInsure(0)
    },
    // 刷新续保操作
    refreshInsure(index) {
      if (index > this.refreshData.length - 1) { // 递归退出的条件
        console.log('最新的刷新续保数据', this.refreshData)
        this.$store.commit('setRefreshData', this.refreshData)
        // this.refreshData.splice(0, 0, {})
        return
      }
      console.log('this.refreshData[index]', this.refreshData[index])
      const params = {
        licenseNo: this.refreshData[index].licenseNo && this.refreshData[index].licenseNo !== '新车' ? this.refreshData[index].licenseNo : undefined,
        frameNo: this.refreshData[index].frameNo ? this.refreshData[index].frameNo : undefined,
        queryMode: 2
      }
      console.log('params', params)
      this.refreshData[index].type = '1' // 查询中的状态
      this.$store.commit('setRefreshData', this.refreshData)
      refreshCustomerRenew(params).then(res => {
        if (res.message === '成功') {
          this.refreshData[index].type = '3' // 查询成功状态
          this.$store.commit('setRefreshData', this.refreshData)
        } else {
          this.refreshData[index].type = '4' // 查询失败状态
          this.$store.commit('setRefreshData', this.refreshData)
        }
        this.refreshInsure((index + 1))
        console.log(res)
      }).catch(err => {
        this.refreshData[index].type = '4' // 失败的状态
        this.$store.commit('setRefreshData', this.refreshData)
        console.warn(err)
      })
    },
    // 删除待刷新续保的数据
    deleteRefreshData(val) {
      console.log('待删除的数据列表', val)
      this.refreshData.forEach((item, index) => {
        if (item.licenseNo === val) {
          this.refreshData.splice(index, 1)
        }
      })
    },
    // 关闭续保刷新窗口
    closeRefeshCard() {
      this.isRefreshShow = false
    },
    // 删除续保刷新操作
    handleRefreshDelete() {

    },
    // 打开机构树
    openOrganTree() {
      this.isScreenShow = false
      this.isActive = true
    },
    // 获取客户类型
    getCutomerType() {
      const typeCode = '00120'
      queryCustomerStatus(typeCode).then(res => {
        this.followStatus = res.data
      })
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
.customerManage{
     .tree-title {
      margin-left: 10px;
      margin-bottom: 10px;
      height: 37px;
      line-height: 37px;
      border-bottom: 1px solid #e6e6e6;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .el-input--small .el-input__inner{
        height:30px;
      }
      p {
        flex: 1;
        font-size: 400;
        color: #909399;
        // display:inline-block;
      }
      .showtype {
        flex: 1;
      }
    }
    .el-button+.el-button{
        margin-left: 5px;
    }
    .slide-active {
    width: 320px;
    margin: 10px 0;
    // min-width: 240px;
    }
     .el-dialog__header {
    border-bottom: 1px solid #c6c6c6;
  }
  .el-dialog__footer {
    border-top: 1px solid #c6c6c6;
    .footer{
        .txt{
            font-size:14px;
            color: #606266;
        }
    }
  }
  .el-dialog__body{
      padding:20px;
  }
  .distribute-type{
      .el-dialog__footer {
        border-top: 1px solid #c6c6c6;
     }
  }
}
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
