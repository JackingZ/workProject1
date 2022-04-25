<template>
  <div class="app-container renewal-box">
    <div class="app-panel left-pane">
      <div :class="showLeftMenu ? '' : 'hide'" class="tree-wrap">
        <div style="display: flex;margin: 0 0 10px 10px;padding-bottom: 5px;border-bottom: 1px solid #eee;">
          <div style="width: 90px;line-height: 32px;color: #999;">机构列表</div>
          <div style="flex: 1;">
            <el-select v-model="searchForm.keyType" placeholder="请选择" size="small" style="width:130px;" @change="handleType">
              <el-option label="查看全部下级" value="0" />
              <el-option label="仅看当前机构" value="1" />
            </el-select>
          </div>
        </div>
        <el-tree :data="currentTableList" :props="defaultProps" :expand-on-click-node="false" :highlight-current="true" @node-click="handleNodeClick" />
      </div>
      <div class="arrow-wrap">
        <img :src="showLeftMenu? expandIcon.left : expandIcon.right" @click="showLeftMenu = !showLeftMenu">
      </div>
    </div>
    <div class="con-panel right-pane">
      <head-info title="批量续保" />
      <div class="table-data-wrapper">
        <el-button v-permission="permissionList.bulkRenewalInput" type="text" style="font-size: 14px;" size="small" @click="dialogUp = true"><i class="el-icon-edit-outline" />&nbsp;批量导入</el-button>
        <div class="search-box">
          <el-select v-if="isAnyAdminChannel" v-model="searchForm.sourceId" clearable filterable placeholder="所属渠道" class="search-item" style="width: 150px;" size="small" @change="selectChannel">
            <el-option v-for="item in channelData" :label="item.shortName" :key="item.code" :value="item.code" />
          </el-select>
          <el-select v-model="searchForm.state" clearable filterable placeholder="任务状态" class="search-item" style="width: 99px;" size="small">
            <el-option v-for="item in taskStatus" :key="item.key" :label="item.value" :value="item.key" />
          </el-select>
          <el-date-picker
            v-model="uploadDate"
            :picker-options="pickerOptions"
            type="daterange"
            align="right"
            class="search-item"
            size="small"
            unlink-panels
            range-separator="~"
            start-placeholder="上传日期范围"
            end-placeholder="上传日期范围"/>
          <el-input v-model="selectValue" class="search-item" placeholder="请输入内容" size="small">
            <el-select slot="prepend" v-model="selectInput" @change="selectValue = ''">
              <el-option label="文件名称" value="1" />
              <el-option label="批续ID" value="2" />
            </el-select>
          </el-input>
          <el-button v-permission="permissionList.bulkRenewalFilter" type="primary" icon="el-icon-search" class="search-item" size="small" @click="onSearch">查询</el-button>
          <!-- <el-button icon="el-icon-delete" class="search-item" size="small" @click="clearSearch">清空搜索</el-button> -->
          <!-- <el-button :disabled="refreshLoading" :class="{'refresh-loading': refreshLoading}" class="refresh-class search-item" icon="el-icon-refresh" size="small" @click="refresh">刷新</el-button> -->
        </div>
        <div class="table-data">
          <el-table v-loading="isLoading" :data="renewalList" :cell-style="{padding: '4px 0'}" :header-cell-style="{background:'#fafafa',padding: '8px 0'}" border style="width: 100%;margin: 20px 0;" height="calc(100vh - 315px)" tooltip-effect="dark">
            <el-table-column fixed="left" prop="id" label="ID" width="80"/>
            <el-table-column v-if="isAnyAdminChannel" prop="sourceName" label="所属渠道" min-width="100"/>
            <el-table-column prop="operateName" label="操作人" min-width="110"/>
            <el-table-column prop="fileName" label="文件名" min-width="150"/>
            <el-table-column :formatter="formatSum" prop="sum" label="导入(总计/成功/失败)" width="160"/>
            <el-table-column prop="sSum" label="批续成功" width="80"/>
            <el-table-column prop="fSum" label="批续失败" width="80"/>
            <el-table-column v-if="isAnyAdminChannel" :formatter="formatHandle" prop="handle" label="批续成功率" width="100"/>
            <el-table-column prop="percent" label="批续进度" width="184">
              <template slot-scope="scope">
                <my-progress v-if="scope.row.state === 0" :percentage="scope.row.percent" :stroke-width="14" />
                <el-progress v-else :text-inside="true" :stroke-width="14" :percentage="scope.row.percent" color="#67c23a"/>
              </template>
            </el-table-column>
            <el-table-column :formatter="formatTime" sortable prop="time" label="上传时间" width="160"/>
            <el-table-column :formatter="formatState" prop="state" label="状态" width="80"/>
            <el-table-column fixed="right" label="操作" min-width="180">
              <template slot-scope="scope">
                <el-button v-permission="permissionList.bulkRenewalDetail" type="text" size="medium" @click="goDetail(scope.row.batchNo)">查看</el-button>
                <el-button v-permission="permissionList.bulkRenewalUpload" type="text" size="medium" @click="download(scope.row)">下载文件</el-button>
                <!-- <span v-show="!showCancelBtn(scope.row)" style="color: #ccc;">|</span> -->
                <!-- <el-button v-show="!showCancelBtn(scope.row)" type="text" size="medium" @click="delClick(scope.$index, scope.row)">删除</el-button> -->
                <el-button v-show="showCancelBtn(scope.row)" type="text" size="medium" @click="cancelClick(scope.$index, scope.row)">停止</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-if="pageTotal" :current-page="page" :page-sizes="[10, 20, 30, 40, 50]" :page-size="size" :total="pageTotal" style="text-align: right;" background layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChange" @current-change="getCurrentData" />
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogUp" :before-close="onUploadClose" class="dialog-upload" title="批量导入续保" width="35%">
      <div v-loading="dialogLoading">
        <div style="display: flex;backgroundColor: #f2f2f2;">
          <div style="width: 20px;text-align: center;">•</div>
          <div style="flex: 1;">为了更好的识别上传客户数据，请根据标准模板导入；由于批续查询会拖慢正常的续保及报价速度，批续执行时间统一为：<span style="color: red;">8:00-21:30</span></div>
        </div>
        <div style="display: flex;backgroundColor: #f2f2f2;">
          <div style="width: 20px;text-align: center;">•</div>
          <div style="backgroundColor: #f2f2f2;">当前批量续保查询上限：{{ uploadSum }} 条/天，今日已用：{{ uploadComplate }} 次，今日剩余：<span style="color: red;">{{ uploadSurplus }}次</span></div>
        </div>
        <div style="padding-left: 5px;">
          <span style="color: #000;">1.下载模板后填写：</span>
          <el-button size="small" style="font-size: 14px;" type="text" @click="downExcel">批量续保模板.xls</el-button>
        </div>
        <div style="display: flex;padding-left: 5px;">
          <div style="width: 145px;line-height: 34px;">
            <span style="color: #000;">2.选择Excel文件上传：</span>
          </div>
          <div style="flex: 1;">
            <el-upload
              ref="uploadfile"
              :on-success="onUploadSuccess"
              :headers="{ 'Authorization': token }"
              :action="uploadUrl"
              :file-list="uploadlist"
              :limit="1"
              :auto-upload="false"
              style="display: inline-block;"
              accept=".xls,.XLS">
              <el-button type="text" style="font-size: 14px;" size="small">选择文件</el-button>
            </el-upload>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="onUploadClose">取 消</el-button>
        <el-button type="primary" size="small" @click="onUploadConfirm">开始查询</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="showDetail" class="dialog-detail" title="批量续保详情" width="80%">
      <renewal-detail v-if="showDetail" :batch-no="batchNo"/>
    </el-dialog>
  </div>
</template>

<script>
import { getBatchList, exportBathRenwalList, getTodayUplodSum, deleteBatchById, cancelBatchByBatchNo, getChannelEffective } from '@/api/renewal'
import { getCompanyEffective } from '@/api/ledger'
import { getToken, getTokenType } from '@/utils/auth'
import { mapGetters } from 'vuex'
import appDrawer from '@/components/Drawer/drawer'
import MyProgress from '@/components/MyProgress'
import renewalDetail from '@/views/customermanagement/bulkRenewal/renewalDetail'
import dayjs from 'dayjs'
// import { clearString } from '@/utils/policydata'
export default {
  name: 'Renewal',
  components: {
    appDrawer,
    renewalDetail,
    MyProgress
  },
  data() {
    return {
      token: `${getTokenType()} ${getToken()}`,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      uploadUrl: `${process.env.SERVER_URL}${process.env.API_ENV}/dealer/auth/batch/importExcelForRenewal`,
      uploadDate: [dayjs().startOf('month'), dayjs().endOf('month')],
      uploadSum: 0,
      uploadComplate: 0,
      uploadSurplus: 0,
      uploadlist: [],
      selectInput: '1',
      selectValue: '',
      lastSelectChannel: '',
      searchForm: {
        key: '',
        keyType: '0',
        sourceId: '',
        fileName: '',
        fileId: '',
        state: null,
        from: null,
        to: null
      },
      taskStatus: [
        { key: 0, value: '进行中' },
        { key: 1, value: '已完成' },
        { key: 2, value: '已取消' }
      ],
      renewalList: [],
      isLoading: false,
      dialogLoading: false,
      pageTotal: 0, // 总条数
      page: 1, // 当前页码
      size: 20, // 页条数
      showDetail: false,
      batchNo: '',
      refreshLoading: false,
      timer: null,
      dialogUp: false,
      channelData: [],
      showLeftMenu: false,
      currentTableList: [],
      orgList: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      expandIcon: {
        left: require('@/assets/imgs/expand_select-left.png'),
        right: require('@/assets/imgs/expand_select-right.png')
      }
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否是管理员渠道
    ])
  },
  created() {
    if (this.isAnyAdminChannel) {
      this.getChannel()
    } else {
      this.searchForm.sourceId = this.$store.getters.userAll.data.channelCode
    }
    this.getOrgan()
  },
  mounted() {
    this.onSearch()
    this.getTodayUploadSum()
  },
  beforeDestroy() {
    this.refreshLoading = false
    clearInterval(this.timer)
  },
  methods: {
    // 选取机构树节点
    handleNodeClick(object) {
      this.searchForm.key = object.key
      this.onSearch()
    },
    // 选取机构树级别
    handleType() {
      this.onSearch()
    },
    // 获取机构树
    getOrgan() {
      getCompanyEffective().then(res => {
        if (this.isAnyAdminChannel) {
          this.orgList = res.data
        } else {
          this.currentTableList = res.data
        }
      })
    },
    // 渠道
    getChannel() {
      getChannelEffective()
        .then(res => {
          this.channelData = res.data
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 选取渠道
    selectChannel() {
      if (this.lastSelectChannel !== this.searchForm.sourceId) {
        this.searchCurrentTableList()
      }
      this.searchForm.key = ''
      this.onSearch()
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
    copyData(obj) {
      return JSON.parse(JSON.stringify(obj || {}))
    },
    showCancelBtn(row) { // 显示取消续保按钮
      if (row.state === 0) {
        return true
      } else {
        return false
      }
    },
    getRenewalList() { // 列表数据
      this.isLoading = true
      // this.refreshLoading = true
      getBatchList({
        current: this.page,
        size: this.size,
        params: this.searchForm
      }).then(res => {
        this.renewalList = res.data.data.records
        this.pageTotal = res.data.data.total
        this.addNewKey(this.renewalList)
        this.isLoading = false
        if (res.data.refreshFlag) {
          this.timer = setTimeout(() => {
            this.keepRenewalFefresh()
          }, 10000)
        } else {
          this.refreshLoading = false
          this.getTodayUploadSum()
          clearInterval(this.timer)
        }
      }).catch(err => {
        console.warn(err)
        this.refreshLoading = false
        this.isLoading = false
      })
    },
    keepRenewalFefresh() { // 持续刷新
      getBatchList({
        current: this.page,
        size: this.size,
        params: this.searchForm
      }).then(res => {
        this.renewalList = res.data.data.records
        this.pageTotal = res.data.data.total
        this.addNewKey(this.renewalList)
        if (res.data.refreshFlag) {
          this.timer = setTimeout(() => {
            this.keepRenewalFefresh()
          }, 10000)
        } else {
          this.refreshLoading = false
          this.getTodayUploadSum()
          clearInterval(this.timer)
        }
      }).catch(err => {
        console.warn(err)
      })
    },
    getTodayUploadSum() { // 获取可上传总数和今天还可以上传的数
      getTodayUplodSum().then(res => {
        this.uploadSum = res.data.sum
        this.uploadComplate = res.data.completed
        this.uploadSurplus = res.data.sum - res.data.completed
      }).catch(err => {
        console.warn(err)
      })
    },
    addNewKey(arr) { // 新增需要的新字段
      for (let i = 0; i < arr.length; i++) {
        const successSum = arr[i].successSum // 上传成功数
        const finish = arr[i].sSum + arr[i].fSum // 已处理数
        const handle = successSum - finish // 待处理数
        let percent
        if (arr[i].state === 1) {
          percent = 100
        } else if (handle === 0 || successSum === 0) {
          percent = 100
        } else if (handle === successSum) {
          percent = 0
        } else {
          percent = ((finish / successSum) * 100).toFixed(2)
        }
        arr[i].percent = Number(percent) // 用于显示进度条
      }
    },
    formatTime(row) {
      return dayjs(row.time).format('YYYY-MM-DD HH:mm:ss')
    },
    formatSum(row) {
      return ` ${row.sum} / ${row.successSum} / ${row.failSum} `
    },
    formatHandle(row) {
      if (row.fSum <= 0 && row.sSum <= 0) {
        return '--'
      } else {
        return (100 * row.sSum / (row.sSum + row.fSum)).toFixed(2) + '%'
      }
    },
    formatState(row) {
      return row.state === 0 ? '进行中' : row.state === 1 ? '已完成' : row.state === 2 ? '已取消' : '进行中'
    },
    onSearch() { // 查询
      if (this.selectInput === '1') {
        this.searchForm.fileName = this.selectValue
        this.searchForm.fileId = ''
      } else {
        this.searchForm.fileId = this.selectValue
        this.searchForm.fileName = ''
      }
      if (this.uploadDate) {
        this.searchForm.from = dayjs(dayjs(this.uploadDate[0]).format('YYYY-MM-DD 00:00:01')).valueOf()
        this.searchForm.to = dayjs(dayjs(this.uploadDate[1]).format('YYYY-MM-DD 23:59:59')).valueOf()
      } else {
        this.searchForm.from = null
        this.searchForm.to = null
      }
      if (this.searchForm.state === '') {
        this.searchForm.state = null
      }
      this.page = 1
      this.getRenewalList()
    },
    goDetail(data) { // 跳转详情
      this.batchNo = data
      this.showDetail = true
    },
    refresh() { // 刷新列表
      this.reset()
      this.onSearch()
    },
    downExcel() { // 批量续保数据模板下载
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.href = `//ybinsure.com/${process.env.API_ENV}/dealer/%E6%89%B9%E9%87%8F%E7%BB%AD%E4%BF%9D%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xls`
      a.download = '批量续保导入模板'
      a.click()
      document.body.removeChild(a)
    },
    download(row) { // 下载
      if (row.state === 1 || row.state === 2) {
        exportBathRenwalList(row.batchNo).then(res => {
          const url = window.URL.createObjectURL(res)
          const a = document.createElement('a')
          document.body.appendChild(a)
          a.href = url
          // a.download = '批量续保查询-' + dayjs().format('YYYY-MM-DD HH_mm_ss') + '.xls'
          a.download = row.fileName
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        }).catch(err => {
          console.warn(err)
        })
      } else {
        this.$message({
          duration: 4000,
          message: '续保查询进度为100%后才可下载，请稍后！',
          type: 'error'
        })
      }
    },
    reset() {
      this.uploadDate = [dayjs().startOf('month'), dayjs().endOf('month')]
      this.selectValue = ''
      this.selectInput = '1'
      this.searchForm = {
        key: '',
        keyType: '0',
        fileName: '',
        fileId: '',
        state: null,
        from: null,
        to: null
      }
      if (this.isAnyAdminChannel) {
        this.searchForm.sourceId = ''
      } else {
        this.searchForm.sourceId = this.$store.getters.userAll.data.channelCode
      }
    },
    onBeforeUpload(file) { // 限制上传格式
      const isType = file.type === 'application/vnd.ms-excel'
      if (!isType) {
        this.$message.error('上传文件只能是Excel2003!')
      }
      return isType
    },
    onUploadSuccess(res, file) {
      console.log(res)
      this.dialogLoading = false
      if (res.status === 200) {
        this.dialogUp = false
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.getRenewalList()
        this.getTodayUploadSum()
        this.uploadlist = []
      } else {
        this.$message({
          showClose: true,
          duration: 0,
          type: 'error',
          message: res.msg
        })
        this.uploadlist = []
      }
    },
    // 批量导入
    onUploadConfirm() {
      if (this.dialogLoading) return
      this.dialogLoading = true
      this.$refs.uploadfile.submit()
    },
    onUploadClose(done) {
      if (this.dialogLoading) {
        this.$message.error('正在批量导入中，请稍后。')
      } else {
        this.dialogUp = false
        this.uploadlist = []
      }
    },
    delClick(index, row) { // 删除
      this.$confirm('确定要删除该数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBatchById(row.id).then(res => {
          if (res.status === 200) {
            this.renewalList.splice(index, 1)
            --this.pageTotal
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          }
        }).catch(err => {
          console.warn(err)
        })
      }).catch(() => {})
    },
    cancelClick(index, row) { // 取消
      this.$confirm('确定要停止续保查询吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelBatchByBatchNo(row.batchNo).then(res => {
          if (res.status === 200) {
            clearInterval(this.timer)
            this.refresh()
            this.$message({
              type: 'success',
              duration: 5000,
              message: '正在停止续保查询，请稍后。'
            })
          }
        }).catch(err => {
          console.warn(err)
        })
      }).catch(() => {})
    },
    sizeChange(val) { // 改变每页条数
      this.size = val
      this.getRenewalList()
    },
    getCurrentData(val) { // 获取当前页码数据
      this.page = val
      this.getRenewalList()
    }
  }
}
</script>

<style lang="scss">
  .renewal-box {
    padding: 15px 15px 15px 0;
    display: flex;
    .app-panel{
      overflow: initial;
    }
    .con-panel{
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
      box-sizing: border-box;
      padding-bottom: 40px;
      img {
        cursor: pointer;
        width: 12px;
      }
    }
    .panel-info {
      padding: 0 20px;
    }
    .table-data-wrapper {
      background-color: #fff;
      padding: 20px;
      // .el-icon-file-export{
      //   background: url('@/assets/imgs/renewal-file-export.svg') center no-repeat;
      //   background-size: cover;
      //   &::before{
      //     content: "\66ff";
      //     font-size: 14px;
      //     visibility: hidden;
      //   }
      // }
      .search-box {
        float: right;
      }
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
      .refresh-class {
        &.refresh-loading {
          border-color: #409EFF;
          color: #409EFF;
          .el-icon-refresh {
            animation: refreshBtn 1s linear infinite;
          }
          @keyframes refreshBtn {
            0% {
              transform: rotate(360deg);
            }
            100% {
              transform: rotate(0deg);
            }
          }
          @-webkit-keyframes refreshBtn {
            0% {
              transform: rotate(360deg);
            }
            100% {
              transform: rotate(0deg);
            }
          }
        }
      }
      .title {
        display: inline-block;
        font-size: 16px;
        color: #404040;
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
    .dialog-upload {
      .el-dialog__header {
        border-bottom: 1px solid #ccc;
      }
      .el-dialog__body {
        padding: 10px 20px;
        line-height: 25px;
      }
      .el-dialog__footer {
        border-top: 1px solid #ccc;
      }
    }
    .dialog-detail {
      .el-dialog__header {
        background-color: #f2f2f2;
      }
      .el-dialog__body {
        padding: 10px 20px;
        line-height: 25px;
      }
    }
  }
</style>
