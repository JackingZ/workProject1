<template>
  <div class="app-container feedback-page">
    <head-info
      title="意见反馈"
      info="" />
    <div class="app-panel">
      <div class="table-record-header">
        <el-row>
          <el-col :span="4" type="flex" justify="start">
            <span class="pending-count">待处理 {{ pendingCount }} 条</span>
          </el-col>
          <el-col :span="20" type="flex" justify="end">
            <div style="text-align:right">
              <el-select
                v-model="selectData.status"
                size="small"
                placeholder="选择类型"
                style="margin-right: 5px;width: 130px;flex: 0 0 auto;"
              >
                <el-option :value="-1" label="所有状态" />
                <el-option :value="0" label="待处理" />
                <el-option :value="1" label="处理中" />
                <el-option :value="2" label="已处理" />
                <el-option :value="3" label="已忽略" />
              </el-select>
              <el-input
                v-model="selectData.key"
                placeholder="请输入手机号码"
                size="small"
                clearable
                style="width:200px; margin-right: 5px;"
              />
              <el-button type="primary" icon="el-icon-search" size="small" @click="queryList">查询</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-table v-loading="isLoading" :default-sort = "{prop: 'createtime', order: 'descending'}" :data="tableList" height="calc(100vh - 320px)" max-height="100vh" border style="width: 100%;margin: 20px 0;">
        <el-table-column prop="id" label="编号" width="100"/>
        <el-table-column prop="cell" label="登录账号" min-width="120"/>
        <el-table-column prop="named" label="用户名" min-width="120"/>
        <el-table-column prop="content" label="反馈内容" min-width="500" show-overflow-tooltip />
        <el-table-column prop="createtime" label="提交时间" sortable width="180"/>
        <el-table-column prop="replytime" label="最后更新" width="180"/>
        <el-table-column prop="status" label="处理状态" width="100"/>
        <!-- <el-table-column prop="runTime" label="处理流程" sortable min-width="80"/> -->
        <el-table-column prop="name" label="操作人" min-width="150" />
        <el-table-column label="操作" width="130" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-permission="permissionList.adviceFeedbackEdit"
              size="mini"
              type="text"
              style="font-size: 14px;"
              @click="editList(scope)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑窗口 -->
      <app-drawer :is-show="isDrewerShow" :mask-closable="false" drawer-title="编辑" drawer-style="width: 500px;" @drawerClose="close" @drawerConfirm="confirm">
        <!-- <add-config-info ref="infoAddEdit" :is-edit="isEdit" :type-data="typeCodeList.data" :edit-data.sync="editData" /> -->
        <edit-feedback ref="infoEdit" :edit-data.sync="editData" />
      </app-drawer>
      <!-- 分页 -->
      <el-pagination
        :total="count"
        :current-page.sync="page"
        :page-size="size"
        :page-sizes="[10, 20, 30, 40, 50]"
        style="text-align: right;"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="getCurrentData" />
    </div>
  </div>
</template>
<script>
import {
  getFeedbackData,
  queryFeedbackDetail,
  updateFeedbackData
} from '@/api/feedback'
import { AppDrawer } from '@/components/Drawer'
import EditFeedback from '@/views/operation/components/editFeedback'
// import moment from 'moment'
export default {
  name: 'AdviceFeedback',
  components: {
    AppDrawer,
    EditFeedback
  },
  data() {
    return {
      inputParams: '',
      errInfo: '',
      isLoading: false,
      channelSelectList: {
        data: [],
        loading: false
      },
      isDetailShow: false,
      companyList: {
        data: [],
        loading: false
      },
      count: 50,
      page: 1,
      size: 20,
      logDetail: {
        licenseNo: '',
        requestParam: '',
        errMsg: '',
        uid: '',
        name: '',
        module: '',
        clientIp: '',
        cell: '',
        operate: '',
        time: ''
      },
      tableList: [],
      querytime: [],
      selectData: {
        sourceId: '001',
        status: -1,
        key: ''
      },
      editData: {
        data: {},
        loading: false
      },
      pendingCount: 0,
      isDrewerShow: false // 侧滑窗是否显示
    }
  },
  computed: {
    // ...mapGetters([
    //   'isAnyAdminChannel' // 判断登陆用户是否管理员渠道
    // ])
  },
  created() {
    // this.isLoading = true
    this.queryList()
  },
  methods: {
    //   获取表格信息
    queryList() {
      this.isLoading = true
      const params = {
        ...this.selectData,
        page: this.page,
        count: this.size
      }
      getFeedbackData(params).then(res => {
        this.isLoading = false
        const result = res.data.model.r
        this.count = res.data.count
        this.pendingCount = res.data.model.sum
        result.forEach(item => {
          switch (item.status) {
            case 0:
              item.status = '待处理'
              break
            case 1:
              item.status = '处理中'
              break
            case 2:
              item.status = '已处理'
              break
            case 3:
              item.status = '已忽略'
              break
          }
        })
        this.tableList = result
      }).catch(err => {
        console.warn(err)
        this.isLoading = false
      })
    },
    // 编辑数据
    editList(scope) {
      this.isDrewerShow = true
      this.editData.loading = true
      this.$refs.infoEdit.$refs.eidtFeedback.clearValidate()
      this.$refs.infoEdit.$refs.eidtFeedback.resetFields()
      const params = {
        id: scope.row.id
      }
      queryFeedbackDetail(params).then(res => {
        console.log(res)
        this.editData.loading = false
        this.editData.data = res.data
      }).catch(err => {
        console.warn(err)
        this.isLoading = false
        this.editData.loading = false
      })
    },
    close() {
      this.isDrewerShow = false
    },
    // 确认
    confirm() {
    //   const checkData = this.$refs.infoEdit.$refs.eidtFeedback
      const data = this.$refs.infoEdit['selectData']
      console.log(data)
      const params = {
        id: data.id,
        status: data.status,
        reply: data.reply,
        uid: data.uid
      }
      updateFeedbackData(params).then(res => {
        this.isDrewerShow = false
        this.queryList()
      }).catch(err => {
        console.warn(err)
        this.isLoading = false
        this.editData.loading = false
      })
    },
    // 点击页码
    getCurrentData() {
      this.isLoading = true
      this.queryList()
    },
    // 修改每页显示的数据条数
    handleSizeChange(val) {
      this.isLoading = true
      this.size = val
      this.queryList()
    }
  }
}
</script>
<style lang="scss">
.feedback-page{
    .drawer-wrap{
      width:460px !important;
  }
}
  .app-panel {
    overflow: hidden;
  }
  .app-panel {
    .el-table td, .el-table th{
        padding: 0;
        height: 40px;
        line-height: 40px;
    }
    .el-table th {
        background: #fafafa;
      }
  }
</style>
<style lang="scss">
    .feedback-page{
        .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
        width: 230px !important;
        }
        .el-date-editor .el-range-separator{
            width: 13%;
        }
        .el-dialog__title{
            color: #20a0ff;
            font-weight: 600;
            font-size:18px;
        }
         .el-dialog__header{
           border-bottom:1px solid #e6e6e6;
        }
        .pending-count{
            font-size: 16px;
            height: 33px;
            line-height: 33px;
        }
    }

</style>
