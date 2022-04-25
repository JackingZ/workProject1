<template>
  <div class="app-container quoteList">
    <div class="app-panel left-pane">
      <div :class="showLeftMenu ? '' : 'hide'" class="tree-wrap">
        <el-tree
          :data="currentOrgList"
          :props="defaultProps"
          :expand-on-click-node="false"
          :highlight-current="true"
          @node-click="handleNodeClick"
        />
      </div>
      <div class="arrow-wrap">
        <img
          :src="showLeftMenu? expandIcon.left : expandIcon.right"
          @click="showLeftMenu = !showLeftMenu"
        >
      </div>
    </div>
    <div class="app-panel right-pane">
      <el-row>
        <el-col :span="24">
          <div class="sub-header">报价记录</div>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" style="min-width: 430px;margin-bottom: 20px;">
        <el-col>
          <div style="text-align:right;">
            <el-select
              v-if="isAnyAdminChannel"
              v-model="selectChannel"
              filterable
              placeholder="所属渠道"
              size="small"
              style="width:140px;"
              class="filter"
              @change="onChannelChange"
            >
              <el-option
                v-for="item in channelList"
                :key="item.code"
                :label="item.shortName"
                :value="item.code"
              />
            </el-select>
            <el-select
              v-model="selectCompany"
              :loading="loadingCompanyList"
              class="filter"
              clearable
              filterable
              placeholder="保险公司"
              size="small"
              style="width:140px;"
            >
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-select
              v-model="selectQuoteType"
              clearable
              filterable
              placeholder="报价状态"
              class="filter"
              size="small"
              style="width:100px;"
            >
              <el-option
                v-for="item in quoteTypeList"
                :key="item.value"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
            <el-date-picker
              v-model="selectDate"
              :default-time="['0:00:00', '23:59:59']"
              class="filter"
              size="small"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
            <el-input
              v-model="searchKeyword"
              class="filter"
              placeholder="请输入内容"
              size="small"
              style="width:300px;"
            >
              <el-select slot="prepend" v-model="selectSearchType" style="width:100px;">
                <el-option
                  v-for="item in searchTypeList"
                  :key="item.value"
                  :label="item.key"
                  :value="item.value"
                />
              </el-select>
            </el-input>
            <el-button
              :loading="isLoading"
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="queryTable()"
            >查询</el-button>
          </div>
        </el-col>
      </el-row>
      <div class="table-personal-data">
        <el-table
          v-loading="isLoading"
          ref="tableList"
          :data="tableList"
          height="calc(100vh - 320px)"
          border
          style="width: 100%"
        >
          <el-table-column :resizable="false" prop="licenseNo" label="车牌号" fixed="left" min-width="100"/>
          <el-table-column :resizable="false" prop="area" label="地区" min-width="80"/>
          <el-table-column :resizable="false" prop="ownerName" label="车主姓名" min-width="80"/>
          <el-table-column :resizable="false" prop="brandName" label="品牌型号" min-width="200"/>
          <el-table-column :resizable="false" prop="companyName" label="保险公司" min-width="100"/>
          <el-table-column :resizable="false" prop="totalPremium" label="总保费(元)" min-width="100"/>
          <el-table-column :resizable="false" prop="idName" label="业务员" min-width="100"/>
          <el-table-column :resizable="false" prop="team" label="所属机构" min-width="200"/>
          <!-- <el-table-column :resizable="false" label="所属渠道" min-width="110">{{ selectChannelName }}</el-table-column> -->
          <el-table-column :resizable="false" prop="quoteTime" label="报价时间" min-width="180">
            <template slot-scope="scope">{{ formatTime(scope.row.quoteTime) }}</template>
          </el-table-column>
          <el-table-column :resizable="false" prop="policyStatus" label="报价状态" min-width="100">
            <template slot-scope="scope">{{ scope.row.policyStatus === 0 ? '报价失败' : '报价成功' }}</template>
          </el-table-column>
          <el-table-column :resizable="false" prop="policyStatus" label="操作" fixed="right" min-width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showDetail(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="totalCount > 0" class="el-pagination-wrap">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="pageSize"
          :total="totalCount"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <quote-info :is-show="showQuoteInfo" :quote-info="quoteInfo" @close="closeQuoteDetail"/>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { getAllChannelData } from '@/api/number'
import { financeCompany } from '@/api/finance'
import { queryQuoteList, queryQuoteDetail } from '@/api/policy_management'
import { getOrgData } from '@/api/system'
import QuoteInfo from '@/views/businessmanagement/quoteList/quoteInfo'
import dayjs from 'dayjs'
export default {
  components: {
    QuoteInfo
  },
  data() {
    const start = new Date()
    start.setHours(0, 0, 0)
    const end = new Date()
    end.setHours(23, 59, 59)
    return {
      expandIcon: {
        left: require('@/assets/imgs/expand_select-left.png'),
        right: require('@/assets/imgs/expand_select-right.png')
      },
      showLeftMenu: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      currentOrgList: [],
      channelList: [],
      companyList: [],
      quoteTypeList: [
        { key: '报价成功', value: 1 },
        { key: '报价失败', value: 0 }
      ],
      searchTypeList: [
        { key: '车牌号', value: 1 },
        { key: '业务员', value: 2 }
      ],
      selectOrgLevel: '', // 机构层级
      selectOrgId: '', // 机构id
      selectSearchType: 1,
      searchKeyword: '',
      selectQuoteType: 1, // 报价状态
      selectCompany: '', // 保险公司
      selectChannel: '', // 所选渠道
      selectChannelName: '',
      selectDate: [start, end],
      isLoading: false, // 按钮进度条状态
      loadingCompanyList: false,
      tableList: [],
      totalCount: 0,
      pageSize: 20,
      currentPage: 1,
      showQuoteInfo: false,
      quoteInfo: {}
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否是管理员渠道
    ])
  },
  created() {
    if (this.isAnyAdminChannel) {
      getAllChannelData().then(res => {
        this.channelList = res.data
        this.selectChannel = this.channelList[0].code
        this.selectChannelName = this.channelList[0].shortName
        this.getOrgData(() => {
          const firstItem = this.currentOrgList[0]
          this.selectOrgId = firstItem.key
          this.selectOrgLevel = firstItem.level
        })
      })
    } else {
      this.selectChannel = this.$store.getters.userAll.data.channelCode
      getAllChannelData().then(res => {
        this.channelList = res.data
        const channelItem = this.channelList.find(item => {
          return item.code === this.selectChannel
        })
        if (channelItem) this.selectChannelName = channelItem.shortName
      })
      this.getOrgData(() => {
        const firstItem = this.currentOrgList[0]
        this.selectOrgId = firstItem.key
        this.selectOrgLevel = firstItem.level
      })
    }
    // 保险公司
    financeCompany().then(res => {
      if (res.status === 200) this.companyList = res.data
    })
  },
  methods: {
    onChannelChange() {
      this.selectOrgId = ''
      this.selectOrgLevel = ''
      this.selectChannelName = ''
      this.channelList.forEach(item => {
        if (item.code === this.selectChannel) { this.selectChannelName = item.shortName }
      })
      this.getOrgData()
      this.queryTable()
    },
    getOrgData(callback) {
      getOrgData({
        channelCode: this.selectChannel,
        areaCode: null,
        // filterTeamCompany: true,
        token: this.$store.getters.token
      }).then(res => {
        this.currentOrgList = res.data
        // this.showLeftMenu = true
        callback && callback()
      })
    },
    getTableParams() {
      const selectDate = this.selectDate
      const model = {
        startTime: selectDate[0].getTime(),
        endTime: selectDate[1].getTime(),
        sourceCode: this.selectChannel || '',
        keyType: this.selectSearchType,
        key: this.selectSearchType ? this.searchKeyword : '',
        policyStatus:
          this.selectQuoteType !== null && this.selectQuoteType !== undefined
            ? [this.selectQuoteType]
            : [], // 订单状态(0报价失败/1报价成功
        companyId: this.selectCompany, // 保险公司 ,
        comcode: this.selectOrgId, // 机构
        level: this.selectOrgLevel // 机构层级
      }
      const params = {
        page: this.currentPage,
        size: this.pageSize,
        model
      }
      return params
    },
    queryTable() {
      if (!this.selectDate || this.selectDate.length !== 2) {
        this.showMessage('请选择时间范围', 'error')
        return
      }
      this.isLoading = true
      queryQuoteList(this.getTableParams())
        .then(({ data, status }) => {
          this.isLoading = false
          if (status === 200) {
            if (data.count) this.totalCount = data.count
            else this.totalCount = data.model.length
            this.tableList = data.model
          }
        })
        .catch(e => {
          this.isLoading = false
        })
    },
    showDetail(item) {
      const { id } = item
      this.isLoading = true
      queryQuoteDetail(id)
        .then(({ status, data }) => {
          this.isLoading = false
          this.showQuoteInfo = true
          this.quoteInfo = { ...data, policyStatus: item.policyStatus }
        })
        .catch(e => {
          this.isLoading = false
        })
    },
    handleSizeChange(val) {
      console.log(`handleSizeChange 每页 ${val} 条`)
      this.pageSize = val
      this.queryTable()
    },
    handleCurrentChange(val) {
      console.log(`handleCurrentChange 当前页: ${val}`)
      this.currentPage = val
      this.queryTable()
    },
    handleNodeClick(object, node, treeNode) {
      this.selectOrgId = object.key
      this.selectOrgLevel = object.level
      this.queryTable()
    },
    closeQuoteDetail() {
      this.showQuoteInfo = false
      this.quoteInfo = {}
    },
    showMessage(msg, type) {
      Message({
        message: msg,
        type: type || 'success',
        duration: 2 * 1000
      })
    },
    // 时间格式化
    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>
<style lang="scss">
.quoteList {
  padding: 15px 15px 15px 0;
  display: flex;
  .filter {
    margin-right: 10px;
  }
  .el-range-separator {
    width: 30px;
    line-height: 28px;
  }
  .el-table th {
    background: #fafafa;
  }
  .sub-header {
    border-bottom: 1px solid #eee;
    line-height: 30px;
    color: #666;
    margin-bottom: 20px;
  }
  .el-table td,
  .el-table th {
    // padding: 3px 0;
    padding: 0;
    height: 40px;
    line-height: 40px;
  }
  .el-pagination-wrap {
    position: relative;
    height: 54px;
  }
  .el-pagination {
    position: absolute;
    top: 22px;
    right: 0;
  }
  .left-pane {
    display: flex;
    padding: 0;
    margin-right: 5px;
    background: transparent;
  }
  .right-pane {
    flex: 1;
    overflow: auto;
    height: calc(100vh - 114px);
    .sub-header {
      border-bottom: 1px solid #eee;
      line-height: 30px;
      color: #666;
      margin-bottom: 20px;
    }
  }
  .tree-wrap {
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
  .hide {
    width: 0;
    overflow: hidden;
    padding: 0px;
  }
  .arrow-wrap {
    display: flex;
    align-items: center;
    height: calc(100vh - 114px);
    box-sizing: border-box;
    padding-bottom: 40px;
    img {
      cursor: pointer;
      width: 12px;
    }
  }
  .el-tree-node > .el-tree-node__children {
    overflow: visible;
  }
}
</style>
