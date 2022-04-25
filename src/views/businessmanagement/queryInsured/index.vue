<template>
  <div class="app-container">
    <div class="query-insure-box">
      <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
        <el-menu-item v-permission="permissionList.businessQueryInsurance" index="1" style="font-size: 16px;">查询保单</el-menu-item>
        <el-menu-item v-permission="permissionList.businessQueryRecord" index="2" style="font-size: 16px;">查询记录</el-menu-item>
      </el-menu>
      <!-- 查询保单 -->
      <div v-show="isRecordShow" style="padding: 20px;">
        <div style="text-align: right;padding-bottom: 10px;">
          <el-select v-if="isAnyAdminChannel" v-model="insureForm.sourceId" filterable placeholder="所属渠道" class="search-item" style="width: 150px;" size="small">
            <el-option v-for="item in channelData" :label="item.shortName" :key="item.code" :value="item.code" />
          </el-select>
          <el-select slot="prepend" v-model="insureForm.timeType" class="search-time" size="small">
            <el-option label="录入时间" value="1" />
            <el-option label="签单时间" value="2" />
          </el-select>
          <el-date-picker
            v-model="selectDate"
            :clearable="false"
            type="daterange"
            align="right"
            class="search-date"
            size="small"
            value-format="yyyy-MM-dd"
            unlink-panels
            range-separator="~"
            start-placeholder="年/月/日"
            end-placeholder="年/月/日"/>
          <el-input v-model="selectValue" class="search-item" placeholder="请输入内容" size="small">
            <el-select slot="prepend" v-model="insureForm.keyType">
              <el-option label="车牌号" value="1" />
              <el-option label="保单号" value="2" />
            </el-select>
          </el-input>
          <el-button type="primary" icon="el-icon-search" class="search-item" size="small" @click="handleSearch">查询</el-button>
        </div>

        <el-table
          v-loading="insureLoading"
          :data="insureList"
          :cell-style="{padding: '4px 0'}"
          :header-cell-style="{background:'#fafafa',padding: '8px 0'}"
          height="calc(100vh - 320px)"
          border
          style="width: 100%;"
        >
          <el-table-column :resizable="false" prop="licenseNo" label="车牌号" fixed="left" width="100"/>
          <el-table-column :resizable="false" prop="policyNo" label="保单号" fixed="left" min-width="150"/>
          <el-table-column :resizable="false" prop="companyName" label="保险公司" min-width="100"/>
          <el-table-column :resizable="false" prop="insuredName" label="被保人" min-width="80"/>
          <el-table-column :resizable="false" prop="riskType" label="险种" width="80"/>
          <el-table-column :resizable="false" prop="premium" label="保费(元)" min-width="100"/>
          <el-table-column :resizable="false" prop="vehicleTax" label="车船税(元)" min-width="100"/>
          <el-table-column :resizable="false" :formatter="formatStart" prop="startDate" label="起保日期" width="120"/>
          <el-table-column :resizable="false" :formatter="formatPolicy" prop="policyTime" label="签单日期" width="160"/>
          <el-table-column :resizable="false" :formatter="formatInsure" prop="insureTime" label="录入时间" width="160" />
          <el-table-column :resizable="false" label="操作" fixed="right" min-width="100">
            <template slot-scope="scope">
              <el-button v-permission="permissionList.businessQueryDetail" type="text" size="medium" @click="handleDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="height: 50px;padding-top: 20px;">
          <el-pagination
            v-if="totalCount > 0"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="pageSize"
            :total="totalCount"
            layout="total, sizes, prev, pager, next, jumper"
            background
            style="text-align: right;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>
      </div>
      <!-- 查询记录 -->
      <div v-show="!isRecordShow" style="padding: 20px;overflow: hidden;">
        <el-button v-permission="permissionList.businessQueryInsureList" v-if="!isAnyAdminChannel" type="text" style="font-size: 14px;float: left;margin-bottom: 10px;" size="small" @click="getInsureDownload"><i class="el-icon-circle-plus-outline" />&nbsp;获取保单</el-button>
        <div style="text-align: right;padding-bottom: 10px;">
          <el-select v-if="isAnyAdminChannel" v-model="recordForm.sourceId" filterable placeholder="所属渠道" class="search-item" style="width: 150px;" size="small">
            <el-option v-for="item in channelData" :label="item.shortName" :key="item.code" :value="item.code" />
          </el-select>
          <el-select v-model="recordForm.state" clearable filterable placeholder="任务状态" class="search-item" style="width: 99px;" size="small">
            <el-option v-for="item in taskData" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
          <el-input v-model="selectInput" class="search-item" placeholder="请输入内容" size="small">
            <el-select slot="prepend" v-model="recordForm.keyType">
              <el-option label="工号账号" value="1" />
              <el-option label="查询ID" value="2" />
            </el-select>
          </el-input>
          <el-button type="primary" icon="el-icon-search" class="search-item" size="small" @click="getSearch">查询</el-button>
          <el-button class="search-item" icon="el-icon-refresh" size="small" @click="getSearch">刷新</el-button>
        </div>
        <div class="table-data">
          <el-table
            v-loading="recordLoading"
            :data="recordList"
            :cell-style="{padding: '4px 0'}"
            :header-cell-style="{background:'#fafafa',padding: '3px 0'}"
            border
            style="width: 100%;"
            height="calc(100vh - 320px)"
            tooltip-effect="dark">
            <el-table-column fixed="left" prop="id" label="ID" width="80"/>
            <el-table-column v-if="isAnyAdminChannel" prop="sourceName" label="所属渠道" min-width="100"/>
            <el-table-column prop="operatorName" label="操作人" min-width="110"/>
            <el-table-column prop="areaCodeName" label="地区" min-width="80"/>
            <el-table-column prop="companyName" label="保险公司" min-width="100"/>
            <el-table-column prop="channelName" label="出单工号" min-width="180"/>
            <el-table-column prop="num" label="总计" width="80"/>
            <el-table-column prop="successful" label="成功" width="80"/>
            <el-table-column :formatter="formatFail" prop="fail" label="失败" width="80"/>
            <el-table-column prop="percent" label="获取进度" width="184">
              <template slot-scope="scope">
                <!-- <my-progress v-if="scope.row.state === 0" :percentage="scope.row.percent" :stroke-width="14" /> -->
                <el-progress :text-inside="true" :stroke-width="14" :percentage="formatPercent(scope.row)" color="#67c23a"/>
              </template>
            </el-table-column>
            <el-table-column :formatter="formatState" prop="state" label="状态" width="80"/>
            <el-table-column sortable prop="createTime" label="上传时间" width="160"/>
            <el-table-column fixed="right" label="操作" min-width="180">
              <template slot-scope="scope">
                <el-button type="text" size="medium" @click="getDetail(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="height: 50px;padding-top: 20px;">
            <el-pagination
              v-if="pageTotal > 0"
              :current-page="page"
              :page-sizes="[10, 20, 30, 40, 50]"
              :page-size="size"
              :total="pageTotal"
              style="text-align: right;"
              background
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="getSizeChange"
              @current-change="getCurrentChange" />
          </div>
        </div>
      </div>
    </div>
    <app-drawer
      :is-show="isRecordSearch"
      :mask-closable="false"
      drawer-title="获取保单"
      drawer-style="width: 400px;"
      @drawerClose="close"
      @drawerConfirm="confirm">
      <record-search v-if="isRecordSearch" ref="recordSearch" :channel-data="channelData" />
    </app-drawer>
  </div>
</template>

<script>
import {
  getChannelEffective,
  getQueryInsure,
  getInsureRecord,
  getRecordList
} from '@/api/queryInsure'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import MyProgress from '@/components/MyProgress'
import appDrawer from '@/components/Drawer/drawer'
import recordSearch from '@/views/businessmanagement/queryInsured/component/recordSearch'
export default {
  name: 'QueryInsured',
  inject: ['reload'],
  components: {
    MyProgress,
    appDrawer,
    recordSearch
  },
  data() {
    return {
      activeIndex: '1',
      isRecordShow: true,
      isRecordSearch: false,
      channelData: [],
      taskData: [
        { key: '0', value: '进行中' },
        { key: '1', value: '已完成' }
      ],
      selectDate: [],
      selectValue: '',
      selectInput: '',
      insureLoading: false,
      recordLoading: false,
      insureList: [],
      recordList: [],
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      page: 1,
      size: 10,
      pageTotal: 0,
      insureForm: {
        sourceId: '',
        time: null,
        timeType: '1',
        keyType: '1'
      },
      recordForm: {
        sourceId: '',
        state: null,
        keyType: '1'
      },
      isSearch: false
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否是管理员渠道
    ]),
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    }
  },
  async created() {
    if (!this.permissionList.businessQueryInsurance) {
      this.activeIndex = '2'
    }
    if (this.isAnyAdminChannel) {
      const resC = await getChannelEffective()
      this.channelData = resC.data
      this.insureForm.sourceId = resC.data[0].code
      this.recordForm.sourceId = resC.data[0].code
    } else {
      this.insureForm.sourceId = this.$store.getters.userAll.data.channelCode
      this.recordForm.sourceId = this.$store.getters.userAll.data.channelCode
    }
    this.initTime()
    this.handleSearch()
    this.getSearch()
  },
  methods: {
    // 初始化时间
    initTime() {
      const bt = dayjs().format('YYYY-MM-DD')
      const et = dayjs().add(1, 'day').format('YYYY-MM-DD')
      this.selectDate = [bt, et]
    },
    formatStart(val) {
      return dayjs(val.startDate).format('YYYY-MM-DD')
    },
    formatInsure(val) {
      return dayjs(val.insureTime).format('YYYY-MM-DD HH:mm:ss')
    },
    formatPolicy(val) {
      return dayjs(val.policyTime).format('YYYY-MM-DD HH:mm:ss')
    },
    formatFail(val) {
      return val.error + val.repeatful
    },
    formatPercent(val) {
      if (val.num > 0) {
        return parseFloat(((val.successful + val.error + val.repeatful) * 100 / val.num).toFixed(2))
      } else {
        return 0
      }
    },
    formatState(val) {
      if (val.finished === 0) {
        return '进行中'
      } else if (val.finished === 1) {
        return '已完成'
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.handleSearch()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.handleSearch()
    },
    // menu菜单切换
    handleSelect(key) {
      if (key === '1') {
        this.isRecordShow = true
      } else if (key === '2') {
        this.isRecordShow = false
      }
    },
    // 保单查询
    handleSearch() {
      console.log(this.selectDate)
      this.insureLoading = true
      const params = {
        page: this.currentPage,
        size: this.pageSize,
        model: {
          key: this.selectValue,
          keyType: this.insureForm.keyType,
          sourceCode: this.insureForm.sourceId,
          timeType: this.insureForm.timeType,
          startTime: dayjs(this.selectDate[0] + '00:00:00').valueOf(),
          endTime: dayjs(this.selectDate[1] + '23:59:59').valueOf()
        }
      }
      getQueryInsure(params).then(res => {
        this.insureList = res.data.model
        this.totalCount = res.data.count
        this.insureLoading = false
      }).catch(err => {
        this.insureLoading = false
        console.warn(err)
      })
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
    // 保单详情
    handleDetail(row) {
      const policyProps = {
        checkType: 6,
        policyId: row.id
      }
      sessionStorage.setItem('policyProps', JSON.stringify(policyProps))
      this.openPolicyByNewWindow()
    },
    getSizeChange(val) {
      this.size = val
      this.getSearch()
    },
    getCurrentChange(val) {
      this.page = val
      this.getSearch()
    },
    // 获取保单
    getInsureDownload() {
      this.isRecordSearch = true
    },
    close() {
      this.isRecordSearch = false
    },
    confirm() {
      if (this.isSearch) return
      this.isSearch = true
      const formData = this.$refs.recordSearch.searchForm
      this.recordForm.sourceId = formData.sourceCode
      this.$refs.recordSearch.$refs.searchForm.validate((valid) => {
        if (!valid) return
        getInsureRecord(formData).then(res => {
          if (res.status === 200) {
            this.isRecordSearch = false
            this.isSearch = false
            this.getSearch()
          } else {
            this.$message.error(res.msg)
            this.isSearch = false
          }
        })
      })
    },
    // 查询记录
    getSearch() {
      this.recordLoading = true
      const params = {
        page: this.page,
        size: this.size,
        model: {
          key: this.selectInput,
          keyType: this.recordForm.keyType,
          sourceCode: this.recordForm.sourceId,
          taskStatus: this.recordForm.state
        }
      }
      getRecordList(params).then(res => {
        this.recordList = res.data.model
        this.pageTotal = res.data.count
        this.recordLoading = false
      }).catch(err => {
        this.recordLoading = false
        console.warn(err)
      })
    },
    closeSelectedTag(view) {
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
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    // 记录查看
    getDetail(row) {
      this.reload()
    }
  }
}
</script>

<style lang="scss">
.query-insure-box {
  background-color: #fff;
  .search-item {
    vertical-align: top;
    margin: 0px 0px 10px 7px;
  }
  .search-time {
    width: 100px;
    margin-left: 7px;
    margin-right: -4px;
    .el-input__inner {
      background-color: #f5f7fa;
      color: #909399;
      border-right: 0px;
      border-radius: 4px 0px 0px 4px;
    }
  }
  .search-date {
    border-left: 0px;
    border-radius: 0px 4px 4px 0px;
    width: 250px;
    .el-range-input {
      width: 50%;
    }
  }
  .el-input-group--prepend {
    max-width: 270px;
    .el-input-group__prepend {
      width: 100px;
    }
  }
  .table-data {
    .progress-color {
      .el-progress-bar {
        .el-progress-bar__outer {
          background-color: #ccc;
        }
      }
    }
  }
}
</style>
