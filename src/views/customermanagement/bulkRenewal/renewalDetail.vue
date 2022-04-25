<template>
  <div class="renewal-detail">
    <div style="text-align: right;margin-top: 10px;">
      <el-select v-model="searchForm.state" clearable filterable placeholder="请选择状态" class="search-item" style="width: 120px;" size="small">
        <el-option v-for="item in taskData" :key="item.key" :label="item.value" :value="item.key" />
      </el-select>
      <el-input v-model="selectValue" placeholder="请输入内容" class="search-item" size="small">
        <el-select slot="prepend" v-model="selectInput" @change="selectValue = ''">
          <el-option label="车牌" value="1" />
          <el-option label="车架号" value="2" />
          <el-option label="车主姓名" value="3" />
        </el-select>
      </el-input>
      <el-button type="primary" icon="el-icon-search" class="search-item" size="small" @click="onSearch">查询</el-button>
      <el-button icon="el-icon-refresh" class="search-item" size="small" @click="refresh">刷新</el-button>
    </div>
    <div class="table-wrapper">
      <el-table v-loading="isLoading" :data="renewalDetailList" :header-cell-style="{background:'#fafafa',padding: '13px 0'}" height="400px" style="width: 100%;" border tooltip-effect="dark">
        <el-table-column fixed="left" prop="licenseNo" label="车牌号" width="90" show-overflow-tooltip/>
        <el-table-column fixed="left" prop="frameNo" label="车架号" width="180" show-overflow-tooltip/>
        <el-table-column prop="brandName" label="品牌型号" min-width="180" show-overflow-tooltip/>
        <el-table-column prop="ownerName" label="车主姓名" min-width="90" show-overflow-tooltip/>
        <el-table-column prop="ownerIdNo" label="车主证件号" min-width="160" show-overflow-tooltip/>
        <el-table-column prop="enrollDate" label="注册日期" width="120" show-overflow-tooltip/>
        <el-table-column prop="comEndDate" label="商业险到期日期" min-width="140" show-overflow-tooltip/>
        <el-table-column prop="forceEndDate" label="交强险到期日期" min-width="140" show-overflow-tooltip/>
        <el-table-column :formatter="formatCompany" prop="lastCompanyId" label="往年投保" width="90" show-overflow-tooltip/>
        <el-table-column fixed="right" prop="state" label="状态" width="110" show-overflow-tooltip/>
      </el-table>
      <el-pagination v-if="pageTotal" :current-page="page" :page-sizes="[10, 20, 30, 40, 50]" :page-size="size" :total="pageTotal" style="text-align: right;margin-top: 20px;" background layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChange" @current-change="getCurrentData" />
    </div>
  </div>
</template>

<script>
import { getBatchRenewalListPage } from '@/api/renewal'
import { clearString } from '@/utils/policydata'
export default {
  props: {
    batchNo: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      selectValue: null,
      selectInput: '1',
      searchForm: {
        batchNo: this.batchNo, // 批次号
        state: null, // 任务状态
        frameNo: null, // 车架号
        licenseNo: null, // 车牌
        ownerName: null // 车主姓名
      },
      taskData: [
        // { key: 0, value: '待查询' },
        { key: 1, value: '承保信息' },
        { key: 2, value: '车辆信息' },
        { key: 3, value: '查询失败' },
        { key: 4, value: '查询重复' },
        { key: 5, value: '已取消' }
      ],
      renewalDetailList: [],
      isLoading: false,
      pageTotal: 0, // 总条数
      page: 1, // 当前页码
      size: 10 // 页条数
    }
  },
  mounted() {
    this.getRenewalPageList()
  },
  methods: {
    getRenewalPageList() { // 列表数据
      this.isLoading = true
      getBatchRenewalListPage({
        current: this.page,
        size: this.size,
        params: this.searchForm
      }).then(res => {
        this.renewalDetailList = res.data.records
        this.pageTotal = res.data.total
        this.isLoading = false
      }).catch(err => {
        console.warn(err)
        this.isLoading = false
      })
    },
    formatEndDayNum(row) { // 计算距离脱保天数
      if (row.endDate >= 0) {
        return row.endDate
      } else {
        return ''
      }
    },
    formatType(row) {
      return row.type === 0 ? '新转续' : row.type === 1 ? '续转续' : row.type === 2 ? '间转续' : row.type === 3 ? '潜转续' : ''
    },
    formatCompany(row) {
      switch (row.lastCompanyId) {
        case 0:
          return '人保'
        case 1:
          return '平安'
        case 2:
          return '太平洋'
        case 3:
          return '富德'
        case 4:
          return '诚泰'
        case 5:
          return '华安'
        case 6:
          return '阳光'
        case 7:
          return '紫金'
        case 8:
          return '大地'
        case 9:
          return '安盛天平'
        case 10:
          return '人保'
        case 11:
          return '太平'
        case 12:
          return '中华'
        case 13:
          return '天安'
        case 14:
          return '利宝'
        case 15:
          return '安心'
        case 16:
          return '国寿财'
        case 17:
          return '永安'
        case 18:
          return '中煤'
        case 19:
          return '众安'
        case 20:
          return '太平洋'
        case 21:
          return '合众'
        case 22:
          return '安诚'
        case 23:
          return '泰山'
        case 24:
          return '华海'
        case 25:
          return '泰康在线'
        case 26:
          return '渤海'
        case 27:
          return '国寿财'
        case 28:
          return '中意'
        case 29:
          return ''
        case 30:
          return '亚太'
        case 31:
          return '人保'
        case 34:
          return '华泰'
        default:
          return ''
      }
    },
    refresh() { // 刷新列表
      this.reset()
      this.getRenewalPageList()
    },
    onSearch() { // 查询
      this.searchForm.frameNo = null
      this.searchForm.licenseNo = null
      this.searchForm.ownerName = null
      if (this.selectInput === '1') {
        this.searchForm.licenseNo = this.selectValue
      } else if (this.selectInput === '2') {
        this.searchForm.frameNo = this.selectValue
      } else {
        this.searchForm.ownerName = this.selectValue
      }
      clearString(this.searchForm)
      this.page = 1
      this.getRenewalPageList()
    },
    reset() { // 清空搜索条件
      this.selectValue = null
      this.selectInput = '1'
      this.searchForm = {
        batchNo: this.batchNo, // 批次号
        state: null, // 任务状态
        frameNo: null, // 车架号
        licenseNo: null, // 车牌
        ownerName: null // 车主姓名
      }
    },
    sizeChange(val) { // 改变每页条数
      this.size = val
      this.getRenewalPageList()
    },
    getCurrentData(val) { // 获取当前页码数据
      this.page = val
      this.getRenewalPageList()
    }
  }
}
</script>

<style lang="scss">
  .renewal-detail {
    .search-item {
      vertical-align: top;
      margin: 0px 0px 10px 7px;
    }
    .el-input-group--prepend {
      max-width: 270px;
      .el-input-group__prepend {
        width: 100px;
      }
    }
    .table-wrapper {
      padding: 10px 0 20px;
      background-color: #fff;
    }
  }
</style>
