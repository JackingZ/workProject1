<template>
  <div class="app-container enter-store-box">
    <div class="app-panel left-pane">
      <div :class="showLeftMenu ? '' : 'hide'" class="tree-wrap">
        <div style="display: flex;margin: 0 0 10px 10px;padding-bottom: 5px;border-bottom: 1px solid #eee;">
          <div style="width: 90px;line-height: 32px;color: #999;">机构列表</div>
          <div style="flex: 1;">
            <el-select v-model="searchForm.companyType" placeholder="请选择" size="small" style="width:130px;" @change="handleType">
              <el-option label="查看全部下级" value="0" />
              <el-option label="仅看当前机构" value="1" />
            </el-select>
          </div>
        </div>
        <el-tree :data="currentTableList" :props="defaultProps" :expand-on-click-node="false" :highlight-current="true" @node-click="handleNodeClick" />
      </div>
      <div class="arrow-wrap">
        <img v-show="!isCarDealer" :src="showLeftMenu? expandIcon.left : expandIcon.right" @click="showLeftMenu = !showLeftMenu">
      </div>
    </div>
    <div class="bpp-panel right-pane">
      <div class="posterday-contain">
        <div v-loading="menuLoading" class="posterday-main">
          <div
            v-for="(item, index) in posterData"
            :key="index"
            :style="menuboxnum === index ? { 'border-color': posterColor[index], 'color': posterColor[index] } : ''"
            class="posterday-box"
            @click="handleMenu(index)">
            <div style="display: flex;">
              <div style="flex: 1;">
                <div class="posterday-count">{{ item.value }}</div>
                <div>{{ item.name }}</div>
              </div>
              <div style="width: 70px;height:70px;">
                <el-progress :percentage="item.percent" :width="70" :stroke-width="9" :color="posterColor[index]" type="circle" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tab-box">
        <div class="tab-title">车辆进店</div>
        <div class="tab-main">
          <div style="display: flex;">
            <el-button
              v-permission="[permissionList.renewalAdmin, permissionList.renewalCarAdmin]"
              v-if="isCarDealer"
              type="text"
              icon="el-icon-share"
              size="small"
              style="padding-left: 10px;"
              @click="handleAllocate">分配</el-button>
            <div style="flex: 1;text-align: right;">
              <el-select v-if="isAnyAdminChannel" v-model="searchForm.sourceId" filterable placeholder="所属渠道" class="tab-item" size="small" @change="handleChannel">
                <el-option v-for="item in channelData" :label="item.shortName" :key="item.code" :value="item.code" />
              </el-select>
              <el-select v-model="searchForm.expireType" clearable filterable size="small" placeholder="距离到期" class="tab-item">
                <el-option v-for="item in searchDateTypeList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <el-select v-show="isCarDealer" v-model="searchForm.customerType" clearable filterable size="small" placeholder="客户标签" class="tab-item">
                <el-option v-for="item in searchTypeList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <el-select v-model="selectTime" filterable size="small" placeholder="进店时间" class="tab-enter" @change="handleEnterDate">
                <el-option v-for="item in menuday" :key="item.value" :label="item.name" :value="item.value" />
              </el-select>
              <el-date-picker
                v-model="dateArr"
                :clearable="false"
                :picker-options="pickerOptions"
                type="daterange"
                unlink-panels
                range-separator="~"
                start-placeholder="年/月/日"
                end-placeholder="年/月/日"
                size="small"
                class="tab-date-picker"
                @change="dateArrChange" />
              <el-input v-model="searchForm.keyword" placeholder="请输入内容" size="small" style="width: 270px;margin: 0px 10px 15px 0;">
                <el-select slot="prepend" v-model="searchForm.keywordType" style="width: 100px;" @change="searchForm.keyword = ''">
                  <el-option :value="0" label="车牌号" />
                  <el-option :value="1" label="车主姓名" />
                </el-select>
              </el-input>
              <el-button type="primary" icon="el-icon-search" size="small" @click="searchbtn">查询</el-button>
              <el-button icon="el-icon-refresh" size="small" @click="refreshPage">刷新</el-button>
            </div>
          </div>
          <div class="tab-table">
            <el-table
              v-loading="esdLoading"
              ref="multipleTable"
              :data="enterStoreList"
              :header-cell-style="{background:'#fff'}"
              border
              height="calc(100vh - 410px)"
              tooltip-effect="dark"
              @selection-change="enterStoreListChange">
              <el-table-column :selectable="checkSelectable" type="selection" fixed="left" width="45" />
              <el-table-column prop="time" label="进店时间" width="180" fixed="left" show-overflow-tooltip />
              <el-table-column prop="licenseNo" label="车牌号" show-overflow-tooltip fixed="left" width="120" />
              <el-table-column prop="ownerName" label="车主姓名" show-overflow-tooltip min-width="100" />
              <el-table-column prop="ownerPhone" label="联系电话" show-overflow-tooltip width="140" />
              <el-table-column prop="comEndDate" label="商业险到期日期" width="140" show-overflow-tooltip />
              <el-table-column prop="forceEndDate" label="交强险到期日期" width="140" show-overflow-tooltip />
              <el-table-column label="距离到期(天)" width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ formatEndDayNum(scope.row) }}&nbsp;
                  <el-popover v-if="(scope.row.allocationEndDate !== scope.row.comEndDate) && (scope.row.allocationEndDate !== scope.row.forceEndDate) && (scope.row.endDate >= 0 && scope.row.endDate <= renewalDay)" placement="right" trigger="hover">
                    <svg-icon slot="reference" icon-class="gantan" />
                    <span style="line-height: 20px;">已自动修复至保险到期日{{ scope.row.allocationEndDate }}</span>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="authCompanyName" label="所属机构" min-width="140" show-overflow-tooltip />
              <el-table-column v-if="isCarDealer" label="续保专员" prop="salesmanName" show-overflow-tooltip min-width="120" />
              <el-table-column v-if="isCarDealer" label="客户标签" show-overflow-tooltip width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.type===0">新转续</span>
                  <span v-else-if="scope.row.type===1">续转续</span>
                  <span v-else-if="scope.row.type===2">间转续</span>
                  <span v-else-if="scope.row.type===3">潜转续</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column label="报价状态" fixed="right" show-overflow-tooltip min-width="120">
                <!--这个是自己写的循环 0 报价成功，1 待查续保， 2 未在续保期内 3 查询续保失败，4 信息不全，5，报价失败-->
                <template slot-scope="scope">
                  <div v-if="scope.row.definedQuote === 0">
                    <el-button type="text" size="small" @click="seeDetails(scope.row)">报价成功</el-button>
                  </div>
                  <div v-else-if="scope.row.definedQuote === 1">
                    <el-button type="text" size="small" style="color: #606266; cursor: default;">待查续保</el-button>
                  </div>
                  <div v-else-if="scope.row.definedQuote === 2">
                    <el-button type="text" size="small" style="color: #606266; cursor: default;">未在续保期内</el-button>
                  </div>
                  <div v-else-if="scope.row.definedQuote === 3">
                    <el-button v-if="isCarDealer" type="text" size="small" @click="editBaseData(scope.row)">待补全信息</el-button>
                    <el-button v-else type="text" size="small" style="color: #606266; cursor: default;">信息不完整</el-button>
                  </div>
                  <div v-else-if="scope.row.definedQuote === 4">
                    <el-button v-if="isCarDealer" type="text" size="small" @click="editBaseData(scope.row)">待补全信息</el-button>
                    <el-button v-else type="text" size="small" style="color: #606266; cursor: default;">信息不完整</el-button>
                  </div>
                  <div v-else>
                    <el-button type="text" size="small" @click="quoteFailHandle(scope.row)">报价失败</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div v-if="count > 0" class="table-page">
              <el-pagination :current-page="page" :page-sizes="[10, 20, 30, 40, 50]" :page-size="size" :total="count" layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChange" @current-change="currentChange" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--分配弹窗-->
    <el-dialog v-if="allocateDialog" :visible.sync="allocateDialog" title="分配" width="50%">
      <div style="overflow:hidden;padding-bottom:8px;" class="row-bg">
        <div style="float:left;padding:6px 0;">
          <el-radio-group v-model="distributForm.resource">
            <el-radio :label="true">固定分配</el-radio>
          </el-radio-group>
        </div>
        <div style="float:right; width:230px;">
          <el-input v-model="distributForm.name" style="max-width: 150px;" placeholder="请输入续保专员姓名" size="small" />
          <el-button type="primary" icon="el-icon-search" size="small" @click="distributBtn">查询</el-button>
        </div>
      </div>
      <el-table ref="multipleDistributData" :data="distributData" border style="width: 100%;" @selection-change="handleDistributData">
        <el-table-column fixed="left" type="selection" width="60" />
        <el-table-column prop="nickName" label="续保专员" width="180" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column label="数量" width="180">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.countNumber" placeholder="请输入数量" size="small" @change="distriButChange(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <div style="padding-top:10px">可分配数据&nbsp;{{ distributForm.total }}&nbsp;条</div>
      <div slot="footer">
        <el-button size="small" @click="allocateDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="allocateEnter">确 定</el-button>
      </div>
    </el-dialog>
    <!--查看报价详情-->
    <el-dialog v-if="seeDetailsShow" :visible.sync="seeDetailsShow" title="报价详情" width="60%" class="dialogAll">
      <see-edit v-if="seeDetailsShow" ref="seeEditFor" :see-edit-list="seeEditList" :see-details-row="seeDetailsRow" :is-loading="isLoading" @seeEditClose="seeEditClose" @refreshPriceOption="refreshPriceOption" @failPriceAjax="failPriceAjax" />
    </el-dialog>
    <!--补全信息-->
    <app-drawer :is-show="isEditShow" :mask-closable="false" :drawer-title="editTitle" drawer-style="width: 500px;" @drawerConfirm="editConfirm" @drawerClose="searchClose">
      <customer-edit ref="customerEdit" :is-edit="isEdit" :edit-form="editForm" :title-name="activeName" :license-disable="licenseDisable" :control-data="controlData" :loading="editLoading" :type-option="typeData" :back-img="backImg" @sendBackImg="sendBackImg" />
    </app-drawer>
  </div>
</template>
<script>
import seeEdit from '@/views/carDealer/components/seeEdit'
import appDrawer from '@/components/Drawer/drawer'
import customerEdit from '@/views/carDealer/customerEdit'
import {
  getArrivalPlateInfoNew,
  getArrivalVehicleListNew,
  getQuetoInfoList,
  getUsersOnCondition,
  setEnterCarEdit,
  carDistributeRenewalPeople,
  getLicenseNoInfo
} from '@/api/mytask'
import { getControlCarType, getCustomerCarType } from '@/api/customer'
import { getRenewalStantandDay, getChannelEffective } from '@/api/renewal'
import { getCompanyEffective } from '@/api/ledger'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import qs from 'qs'
export default {
  name: 'Enterstore',
  components: {
    appDrawer,
    seeEdit,
    customerEdit
  },
  data() {
    return {
      backImg: null,
      isLoading: false,
      menuLoading: false,
      showLeftMenu: false,
      selectTime: 0,
      menuboxnum: null,
      lastSelectChannel: '',
      currentTableList: [],
      channelData: [],
      expandIcon: {
        left: require('@/assets/imgs/expand_select-left.png'),
        right: require('@/assets/imgs/expand_select-right.png')
      },
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      menuday: [
        { name: '进店时间', value: -1 },
        { name: '今天', value: 0 },
        { name: '本周', value: 1 },
        { name: '本月', value: 2 },
        { name: '上月', value: 3 }
      ],
      searchDateTypeList: [
        { label: '7天内到期', value: 0 },
        { label: '15天内到期', value: 1 },
        { label: '30天内到期', value: 2 },
        { label: '60天内到期', value: 3 },
        { label: '90天内到期', value: 4 }
      ],
      searchTypeList: [
        { label: '新转续', value: 0 },
        { label: '续转续', value: 1 },
        { label: '间转续', value: 2 },
        { label: '潜转续', value: 3 }
      ],
      dateArr: [dayjs(), dayjs()],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      posterColor: [
        '#409eff',
        '#67c23a',
        '#e6a23c',
        '#f56c6c',
        '#909399'
      ],
      posterData: [
        { name: '全部进店车辆', value: 0, percent: 0 },
        { name: '续保期内-报价成功', value: 0, percent: 0 },
        { name: '续保期内-报价失败', value: 0, percent: 0 },
        { name: '未到续保期', value: 0, percent: 0 },
        { name: '信息不完整', value: 0, percent: 0 }
      ],
      searchForm: {
        companyId: '',
        companyType: '0',
        sourceId: '',
        plateModule: null, // 面板项
        start: null,
        end: null,
        expireType: null,
        customerType: null,
        keywordType: 0,
        keyword: ''
      },
      esdLoading: false,
      enterStoreList: [],
      page: 1,
      size: 10,
      count: null,
      enterStoreListSelection: [], // 表格选择
      isSearchShow: false,
      allocateDialog: false,
      distributForm: {
        name: '',
        resource: true,
        total: 0
      },
      countNumber: '',
      distributData: [],
      totalNumTJ: null,
      enterStoreIdList: [],
      DistributPutlist: [],
      // 查看报价详情
      seeDetailsShow: false,
      seeEditList: [],
      appointForShow: false,
      multipleSelection: [],
      timer: null, // 定时器
      // 新增任务
      isEditShow: false,
      isEdit: false,
      editLoading: false,
      activeName: '',
      licenseDisable: false,
      editTitle: '',
      editForm: {},
      controlData: [],
      typeData: [],
      renewalDay: 90,
      isCarDealer: false
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否是管理员渠道
    ])
  },
  async created() {
    if (this.isAnyAdminChannel) {
      const resC = await getChannelEffective()
      this.channelData = resC.data
      this.searchForm.sourceId = resC.data[0].code
      this.isCarDealer = resC.data[0].carDealer.toString() === '0' // 是车商渠道
    } else {
      this.searchForm.sourceId = this.$store.getters.userAll.data.channelCode
      this.isCarDealer = this.$store.getters.userAll.data.carDealer.toString() === '0'
    }
    this.getRenewalDay()
    const resO = await getCompanyEffective()
    if (this.isAnyAdminChannel) {
      this.orgList = resO.data
      this.searchCurrentTableList()
    } else {
      this.currentTableList = resO.data
    }
    this.actTime()
    this.searchTime()
    this.searchbtn()
  },
  beforeDestroy() {
    // 停止定时器
    clearInterval(this.timer)
  },
  methods: {
    // 选取机构树节点
    handleNodeClick(object) {
      this.searchForm.companyId = object.key
      this.page = 1
      this.searchTime()
      this.searchbtn()
    },
    // 选取机构树级别
    handleType() {
      this.searchTime()
      this.searchbtn()
    },
    // 选取渠道
    handleChannel() {
      if (this.lastSelectChannel !== this.searchForm.sourceId) {
        this.searchCurrentTableList()
      }
      this.channelData.forEach(item => {
        if (item.code === this.searchForm.sourceId) {
          this.isCarDealer = item.carDealer.toString() === '0'
        }
      })
      this.searchForm.companyId = ''
      this.page = 1
      this.searchTime()
      this.searchbtn()
    },
    copyData(obj) {
      return JSON.parse(JSON.stringify(obj || {}))
    },
    // 渠道关联机构
    searchCurrentTableList() {
      this.lastSelectChannel = this.searchForm.sourceId
      function searchItem(item, val) {
        if (item.channelCode === val) return item
        else if (item.children && item.children.length > 0) {
          for (const child of item.children) {
            const res = searchItem(child, val)
            if (res) return res
          }
        }
        return null
      }

      function searchList(list, val, callback) {
        for (const item of list) {
          const res = searchItem(item, val)
          if (res) callback && callback(res)
        }
      }
      const list = []
      searchList(this.orgList, this.searchForm.sourceId, (item) => {
        list.push(item)
      })
      this.currentTableList = this.copyData(list)
    },
    // 获取地区脱保天数规定值
    getRenewalDay() {
      getRenewalStantandDay().then(res => {
        this.renewalDay = res.data.daysConfig
      })
    },
    sendBackImg(val) {
      this.backImg = val
    },
    // 计算距离脱保天数
    formatEndDayNum(row) {
      if (row.endDate > this.renewalDay) {
        return ''
      } else if (row.endDate <= this.renewalDay && row.endDate >= 0) {
        return row.endDate
      } else {
        return ''
      }
    },
    // 禁用复选框
    checkSelectable(row) {
      return row.quoteFlag !== 3 && row.quoteFlag !== 4
    },
    // 时间不超过一年提示
    dateArrChange(val) {
      this.selectTime = -1
      this.page = 1
      if (dayjs(val[1]).diff(dayjs(val[0]), 'month') > 11) {
        this.$message({
          duration: 4000,
          message: '最多只可选择一年的时间长度进行查询！'
        })
        this.selectTime = 0
        this.dateArr = [dayjs(), dayjs()]
      }
      this.searchTime()
      this.searchbtn()
    },
    // 刷新
    refreshPage() {
      // 初始化看台信息
      this.menuboxnum = null
      this.selectTime = 0
      this.page = 1
      this.searchForm.companyType = '0'
      if (this.isAnyAdminChannel) {
        this.searchForm.sourceId = this.channelData[0].code
        this.isCarDealer = this.channelData[0].carDealer.toString() === '0'
        this.searchCurrentTableList()
      }
      this.searchForm.companyId = ''
      this.searchForm.plateModule = null
      this.searchForm.start = null
      this.searchForm.end = null
      this.searchForm.expireType = null
      this.searchForm.customerType = null
      this.searchForm.keywordType = 0
      this.searchForm.keyword = ''
      this.menuLoading = true
      this.dateArr = [dayjs(), dayjs()]
      this.searchTime()
      this.searchbtn()
    },
    actTime() {
      this.timer = setInterval(() => {
        this.searchTime()
        this.searchbtn()
      }, 300000)
    },
    handleMenu(index) {
      if (this.menuboxnum !== index) {
        this.menuboxnum = index
        this.searchForm.plateModule = index
      } else {
        this.menuboxnum = null
        this.searchForm.plateModule = null
      }
      this.page = 1
      this.searchbtn()
    },
    // 查询面板数据
    searchTime() {
      this.getClearForm(this.searchForm)
      this.plateInfoAjax(this.selectTime)
    },
    // 进店时间实时请求
    handleEnterDate() {
      this.page = 1
      this.searchTime()
      this.searchbtn()
    },
    plateInfoAjax(index) {
      this.menuLoading = true
      switch (index) {
        case -1:
          break
        case 0: // 今天
          this.dateArr = [dayjs().format('YYYY-MM-DD 00:00:00'), dayjs().format('YYYY-MM-DD 23:59:59')]
          break
        case 1: // 本周
          this.dateArr = [dayjs(dayjs(dayjs().startOf('week')).valueOf() + 24 * 3600000), dayjs(dayjs(dayjs().startOf('week')).valueOf() + 7 * 24 * 3600000)]
          break
        case 2: // 本月
          this.dateArr = [dayjs().startOf('month'), dayjs().endOf('month')]
          break
        case 3: // 上月
          this.dateArr = [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
          break
      }
      this.getPanelState(this.dateArr)
      getArrivalPlateInfoNew({
        companyId: this.searchForm.companyId,
        companyType: this.searchForm.companyType,
        sourceId: this.searchForm.sourceId,
        start: this.searchForm.start,
        end: this.searchForm.end
      })
        .then(res => {
          const obj = res.data
          this.posterData = [
            { name: '全部进店车辆', value: obj.arrival, percent: obj.arrival > 0 ? 100 : 0 },
            { name: '续保期内-报价成功', value: obj.RenewalPeriodAndQuoteSuccess, percent: obj.arrival > 0 ? parseFloat((obj.RenewalPeriodAndQuoteSuccess / obj.arrival * 100).toFixed(1)) : 0 },
            { name: '续保期内-报价失败', value: obj.RenewalPeriodAndQuoteFail, percent: obj.arrival > 0 ? parseFloat((obj.RenewalPeriodAndQuoteFail / obj.arrival * 100).toFixed(1)) : 0 },
            { name: '未到续保期', value: obj.notRenewalPeriod, percent: obj.arrival > 0 ? parseFloat((obj.notRenewalPeriod / obj.arrival * 100).toFixed(1)) : 0 },
            { name: '信息不完整', value: obj.incomplete, percent: obj.arrival > 0 ? parseFloat((obj.incomplete / obj.arrival * 100).toFixed(1)) : 0 }
          ]
          this.menuLoading = false
        })
        .catch(err => {
          this.menuLoading = false
          console.warn(err)
        })
    },
    // 获取与数据列表联动的时间
    getPanelState(dateArr) {
      this.searchForm.start = dayjs(dayjs(dateArr[0]).format('YYYY-MM-DD 00:00:00')).valueOf()
      this.searchForm.end = dayjs(dayjs(dateArr[1]).format('YYYY-MM-DD 23:59:59')).valueOf()
    },
    // 设置特定参数为null
    getClearForm(data) {
      data.customerType = data.customerType === '' ? null : data.customerType
      data.expireType = data.expireType === '' ? null : data.expireType
    },
    // 搜索
    searchbtn() {
      this.getPanelState(this.dateArr)
      this.getClearForm(this.searchForm)
      this.esdLoading = true
      const Paramsdata = {
        current: this.page,
        size: this.size,
        params: this.searchForm
      }
      getArrivalVehicleListNew(Paramsdata)
        .then(res => {
          this.esdLoading = false
          this.count = res.data.total
          this.enterStoreList = res.data.records
          this.enterStoreList.forEach(element => {
            element.time = dayjs(element.time).format('YYYY-MM-DD HH:mm:ss')
            element.salesmanName = element.salesmanName
            // 状态查询
            // 自定义状态 0 报价成功，1 待查续保， 2 未在续保期内 3 查询续保失败，4 查询信息不全，5，报价失败
            const endDate = element.endDate
            const quoteFlag = element.quoteFlag
            const infoState = element.infoState
            if (infoState === 0) {
              element.definedQuote = 4 // '查询信息不全'
            } else {
              if (endDate > 0 && endDate <= this.renewalDay) {
                if (quoteFlag === 1) {
                  element.definedQuote = 0 // '报价成功'
                } else {
                  element.definedQuote = 5 // '报价失败'
                }
              } else {
                element.definedQuote = 2 // '未在续保期内'
              }
            }
          })
        })
        .catch(err => {
          this.esdLoading = false
          console.warn(err)
        })
    },
    // 翻页
    sizeChange(val) {
      this.size = val
      this.searchbtn()
    },
    currentChange(val) {
      this.page = val
      this.searchbtn()
    },
    // 这个是进店车辆表格选择
    enterStoreListChange(val) {
      this.enterStoreListSelection = val
      this.distributForm.total = val.length
      this.enterStoreIdList = []
      val.forEach(element => {
        this.enterStoreIdList.push(element.id)
      })
    },
    // 分配 弹窗
    handleAllocate() {
      if (Number(this.distributForm.total) > 0) {
        this.allocateDialog = true
        this.distributBtn()
      } else {
        this.$message({
          message: '请先勾选需要分配的数据!',
          type: 'warning'
        })
      }
    },
    // 查询分配人员
    distributBtn() {
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
    // 选择分配方式
    handleDistributData(val) {
      // 获取分配的信息
      this.multipleSelection = val
    },
    distriButChange(row) {
      // 分配只能输入数字
      const reg = /^\d+$/
      if (row.countNumber && new RegExp(reg).test(row.countNumber)) {
        row.countNumber = parseInt(row.countNumber)
        // 自动勾选
        this.$refs.multipleDistributData.toggleRowSelection(row, true)
      } else {
        row.countNumber = null
        this.$refs.multipleDistributData.toggleRowSelection(row, false)
        this.$message({
          message: '请输入正确的数值（大于0的正数）。',
          type: 'warning'
        })
      }
    },
    // 分配确定
    allocateEnter() {
      this.totalNumTJ = null
      this.DistributPutlist = []
      this.multipleSelection.forEach(element => {
        this.totalNumTJ += Number(element.countNumber)
        this.DistributPutlist.push({
          salesmanId: element.id,
          num: element.countNumber
        })
      })
      // 获取 分配列表的id
      // console.log(this.totalNumTJ)
      if (!this.totalNumTJ) {
        this.$message.error(`分配数据为空！请选择分配人员，或者填写分配数据`)
      } else if (
        this.distributForm.total === 1 &&
        this.multipleSelection[0].id ===
          this.enterStoreListSelection[0].salesmanId
      ) {
        // 如果勾选一条数据是不可以分配给自己的
        this.$message.error('重复分配，请选择其他的续保员进行分配！')
      } else if (
        this.totalNumTJ !== this.distributForm.total &&
        this.totalNumTJ
      ) {
        if (Number(this.distributForm.total) - Number(this.totalNumTJ) > 0) {
          const differTotal =
            Number(this.distributForm.total) - Number(this.totalNumTJ)
          this.$message.error(
            `您共有数据 ${
              this.distributForm.total
            } 条，还有 ${differTotal} 条数据未分配`
          )
        } else {
          const differTotal =
            Number(this.totalNumTJ) - Number(this.distributForm.total)
          this.$message.error(
            `您共有数据 ${
              this.distributForm.total
            } 条，多出 ${differTotal} 条数据，请减少 ${differTotal} 个数据。`
          )
        }
      } else {
        // 执行提交函数
        const Paramsdata = {
          average: false,
          customerIdList: this.enterStoreIdList, // 客户id
          renewalPeopleList: this.DistributPutlist // 列表里面的id
        }
        carDistributeRenewalPeople(Paramsdata)
          .then(res => {
            this.allocateDialog = false
            this.$message({
              message: '恭喜你，分配成功！',
              type: 'success'
            })
            this.searchbtn()
            // console.log(res)
          })
          .catch(err => {
            console.warn(err)
          })
      }
    },
    // 报价失败跳转
    quoteFailHandle(row) {
      // this.$router.push({
      //   path: '/insurance/quickissue',
      //   name: '移动出单',
      //   query: {
      //     carDealerId: row.uuid, // 是否车商标识
      //     carLicense: row.licenseNo, // 车牌号
      //     frameNo: row.frameNo // 车架号
      //   }
      // })
      window.openIssueUrl({
        carDealerId: row.uuid, // 是否车商标识
        carLicense: row.licenseNo, // 车牌号
        frameNo: row.frameNo // 车架号
      })
    },
    // 快速投保
    handleToQuickissue(row) {
      this.$router.push({
        /* path: '/insurance/quickissue',
        name: '移动出单',
        query: {
          carDealerId: row.uuid, // 是否车商标识
          carLicense: row.licenseNo, // 车牌号
          frameNo: row.frameNo // 车架号
        } */
        path: '/insurance/issuecenter',
        name: '电脑出单'
      })
    },
    // 编辑窗口
    // 基本详情
    async editBaseData(row) {
      this.backImg = null
      for (const key in this.editForm) {
        delete this.editForm[key]
      }
      const resD = await getLicenseNoInfo(row.licenseNo)
      if (resD.status === 200) {
        this.editTitle = '编辑信息'
        this.isEditShow = true
        this.isEdit = true
        this.editLoading = true
        this.activeName = 'first'
        this.licenseDisable = true
        if (resD.data.ownerIdType) {
          const strO = resD.data.ownerIdType.slice(0, 1) + '00'
          resD.data.ownerCardType = [strO, resD.data.ownerIdType]
        } else {
          resD.data.ownerCardType = []
        }
        if (resD.data.holderIdType) {
          const strH = resD.data.holderIdType.slice(0, 1) + '00'
          resD.data.holderCardType = [strH, resD.data.holderIdType]
        } else {
          resD.data.holderCardType = []
        }
        if (resD.data.insuredIdType) {
          const strI = resD.data.insuredIdType.slice(0, 1) + '00'
          resD.data.insureCardType = [strI, resD.data.insuredIdType]
        } else {
          resD.data.insureCardType = []
        }
        if (resD.data.transferDate) {
          resD.data.transfer = 0
        } else {
          resD.data.transfer = 1
        }
        if (resD.data.holderName === resD.data.ownerName) {
          resD.data.insuringPerson = 0
        } else {
          resD.data.insuringPerson = 1
        }
        if (resD.data.insuredName === resD.data.ownerName) {
          resD.data.insuredPerson = 0
        } else if (resD.data.insuredName === resD.data.holderName) {
          resD.data.insuredPerson = 1
        } else {
          resD.data.insuredPerson = 2
        }
        let arrFiles = []
        if (resD.data.fileList) {
          arrFiles = resD.data.fileList
        }
        arrFiles.forEach(item => {
          if (item.flag === 0) {
            resD.data.imageIdface = item.files
          }
          if (item.flag === 1) {
            resD.data.imageIdback = item.files
          }
          if (item.flag === 2) {
            resD.data.imagelicenseface = item.files
          }
          if (item.flag === 3) {
            resD.data.imagelicenseback = item.files
          }
        })
        this.editForm = resD.data
        this.editForm.cardName = resD.data.ownerName
        this.backImg = this.editForm.imagelicenseback
        this.editForm.licenseNo = row.licenseNo
        this.editForm.vehicleType = this.editForm.vehicleType
          ? this.editForm.vehicleType
          : 'K33'
        this.getCarType(this.editForm.frameNo)
      } else {
        this.isEditShow = true
        this.isEdit = false
        this.editLoading = true
        this.editTitle = '新增信息'
        this.activeName = 'first'
        this.licenseDisable = true
        this.editForm.licenseNo = row.licenseNo
        console.log(this.editForm)
      }
      const resC = await getControlCarType()
      this.controlData = resC.data.vehicleTypeList
      this.editLoading = false
    },
    getCarType(frameNo) {
      if (frameNo) {
        getCustomerCarType(qs.stringify({ frameNo: frameNo }))
          .then(res => {
            if (res.status === 200) {
              this.typeData = res.data.list
              this.typeData.forEach(item => {
                if (item.modelCode === this.editForm.modelCode) {
                  this.editForm.purchasePrice = item.purchasePrice
                  this.editForm.seatCount = item.seatCount
                }
              })
            }
          })
          .catch(error => {
            console.warn(error)
            this.$message.error('未查询到车型信息，请核实车架号')
          })
      }
    },
    // 跟进窗口
    editFollowData() {
      this.isFollowShow = true
    },
    searchClose() {
      this.isEditShow = false
    },
    // 编辑保存
    editConfirm() {
      const formData = this.$refs.customerEdit.editForm
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
      if (formData.ownerIdType && formData.ownerIdNo) {
        this.activeName = 'second'
      } else {
        this.activeName = 'first'
      }
      this.$refs.customerEdit.$refs.ruleForm.validate(valid => {
        if (!valid) return
        setEnterCarEdit(fd)
          .then(res => {
            console.log(res)
            if (res.status === 200) {
              this.isEditShow = false
              if (this.isEdit) {
                this.$message({
                  type: 'success',
                  message: '编辑成功'
                })
              } else {
                this.$message({
                  type: 'success',
                  message: '新增成功'
                })
              }
              this.routerlicenseNo = formData.licenseNo
              this.searchbtn()
              this.$refs.customerEdit.$refs.ruleForm.resetFields()
              this.editForm.imageIdface = null
              this.editForm.imageIdback = null
              this.editForm.imagelicenseface = null
              this.editForm.imagelicenseback = null
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(err => {
            console.warn(err)
          })
      })
    },
    // 查看详情弹窗关闭
    seeEditClose() {
      this.seeDetailsShow = false
    },
    // 刷新续保后数据更新
    refreshPriceOption(val) {
      this.seeEditList = val
    },
    // 刷新续保失败后数据更新
    failPriceAjax() {
      this.seeDetails(this.seeDetailsRow)
    },
    // 点击查看详情
    async seeDetails(row) {
      this.seeDetailsRow = row
      const resL = await getQuetoInfoList(qs.stringify({ orderId: row.orderId }))
      this.seeEditList = resL.data
      if (this.seeEditList.length > 0) {
        this.seeDetailsShow = true
        this.isLoading = false
        this.seeEditList.map(item => {
          item.qutote.salesmanName = item.salesmanName
          item.qutote.salesmanPhone = item.salesmanPhone
          item.qutote.times = dayjs(parseInt(item.qutote.times)).format('YYYY-MM-DD HH:mm:ss')
        })
      } else {
        this.$message.warning('暂无报价记录')
        return
      }
    }
  }
}
</script>
<style lang="scss">
.enter-store-box {
  padding-left: 0px;
  display: flex;
  .app-panel{
    overflow: initial;
  }
  .bpp-panel{
    overflow: initial;
  }
  .el-tree-node>.el-tree-node__children{
    overflow: visible;
  }
  .el-tree-node__label{
    padding-right: 10px;
  }
  .left-pane{
    display: flex;
    padding: 0;
    margin-right: 5px;
    background: transparent;
  }
  .right-pane{
    flex: 1;
    overflow: auto;
    height: calc(100vh - 114px);
  }
  .tree-wrap{
    width: 260px;
    padding: 10px;
    padding-top: 25px;
    overflow: auto;
    box-sizing: border-box;
    border-color: #e8e8e8;
    background-color: #fff;
    transition: all 0.3s ease;
    height: calc(100vh - 114px);
  }
  .hide{
    width: 0;
    overflow: hidden;
    padding: 0px;
  }
  .arrow-wrap {
    display: flex;
    align-items: center;
    height: calc(100vh - 114px);
    width: 12px;
    box-sizing: border-box;
    padding-bottom: 40px;
    img {
      cursor: pointer;
      width: 12px;
    }
  }
  .right-pane {
    flex: 1;
    overflow: auto;
    height: calc(100vh - 114px);
  }
  .posterday-contain {
    .posterday-main {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .posterday-box {
        width: 19%;
        min-width: 250px;
        padding: 15px;
        margin-bottom: 15px;
        display: inline-block;
        background-color: #fff;
        border-radius: 6px;
        box-sizing: border-box;
        border: 1px solid #fff;
        color: #666;
        font-size: 14px;
        cursor: pointer;
        .posterday-count {
          font-size: 30px;
          vertical-align: top;
          height: 50px;
        }
      }
    }
  }
  .tab-box {
    background: #fff;
    .tab-title {
      font-size: 16px;
      color: #666;
      padding: 15px;
      border-bottom: 1px solid #f2f2f2;
    }
    .tab-main {
      padding: 15px;
      .tab-item {
        width: 150px;
        margin: 0px 10px 15px 0px;
      }
      .tab-enter {
        width: 100px;
        margin-bottom: 15px;
        margin-right: 0px;
        .el-input__inner {
          border-radius: 4px 0px 0px 4px;
        }
      }
      .tab-date-picker {
        width: 250px;
        border-radius: 0px 4px 4px 0px;
        margin: 0px 10px 15px 0px;
      }
      .tab-table {
        table {
          width: 100%;
        }
        .table-page {
          text-align: right;
          margin-top: 20px;
        }
      }
    }
  }
}

.dialogAll {
  .el-dialog {
    border-radius: 4px 4px 0 0;
    overflow: hidden;
    margin: 0vh auto 15vh auto;
    .el-dialog__body {
      padding: 25px 25px 20px;
    }
    .el-radio {
      height: auto;
      background: #f5f7fa;
    }
    .upload-demo {
      padding-top: 10px;
      ul.el-upload-list {
        overflow: hidden;
        li {
          width: 240px;
          float: left;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
