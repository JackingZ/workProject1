<template>
  <div class="app-container notification-page">
    <head-info
      title="发送通知"
      info="" />
    <div class="app-panel">
      <div class="table-record-header">
        <el-button
          v-permission="permissionList.addNotification"
          style="font-size: 14px;"
          type="text"
          size="small"
          @click="insertData"
        >
          <i class="el-icon-circle-plus-outline"/>&nbsp;新增
        </el-button>
      </div>
      <el-table v-loading="isLoading" :data="tableList" height="calc(100vh - 310px)" max-height="100vh" border style="width: 100%;margin: 20px 0;" @row-dblclick="handleTableClick">
        <el-table-column prop="name" label="操作员" min-width="150"/>
        <el-table-column prop="title" label="标题" min-width="150"/>
        <el-table-column prop="releaseTime" label="发布时间" sortable min-width="120"/>
        <el-table-column prop="status" label="状态" min-width="100"/>
      </el-table>
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
    <!-- 新增 -->
    <app-drawer :is-show="isShow" :mask-closable="false" drawer-title="新增通知" drawer-style="width: 500px;" @drawerClose="close" @drawerConfirm="confirm">
      <add-inform ref="addData" :channellist="channelSelectList.data" :channelloading="channelSelectList.loading"/>
      <!-- <add-edit-number ref="numberEdit" :is-edit="isEdit" /> -->
    </app-drawer>
    <!-- 日志详情弹窗 -->
    <el-dialog
      :visible.sync="isDetailShow"
      width="600px"
      title="日志详情"
      center>
      <div v-loading="del_loading" class="InformDetail">
        <dl>
          <dd>操作员：{{ informDetail.name }}</dd>
          <dd>标题：{{ informDetail.title }}</dd>
          <dd>创建时间：{{ informDetail.createTime }}</dd>
          <dd>状态：{{ informDetail.status }}</dd>
          <dd>发送范围：{{ informDetail.range }}</dd>
          <dd>
            <p>内容：</p>
            <el-input
              v-model="informDetail.content"
              :rows="6"
              style="width:95%;"
              type="textarea" />
          </dd>
        </dl>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getInformData,
  getInformChannellist,
  addInformInfo,
  getInformDetail
} from '@/api/notification'
import { AppDrawer } from '@/components/Drawer'
import AddInform from '@/views/operation/components/addInform'
// import moment from 'moment'
export default {
  name: 'OperateLog',
  components: {
    AppDrawer,
    AddInform
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
      tableList: [],
      isDetailShow: false,
      count: 50,
      page: 1,
      size: 20,
      isShow: false,
      del_loading: false, // 详情加载
      informDetail: {
        name: '',
        title: '',
        createTime: '',
        status: '',
        range: '',
        content: ''
      }
    }
  },
  computed: {
    // ...mapGetters([
    //   'isAnyAdminChannel' // 判断登陆用户是否管理员渠道
    // ])
  },
  created() {
    this.isLoading = false
    this.getChannel()
    // this.getCompanyList()
    this.queryList()
  },
  methods: {
    //   获取表格信息
    queryList() {
      this.isLoading = true
      const params = {
        page: this.page,
        size: this.size
      }
      getInformData(params).then(res => {
        console.log(res)
        this.isLoading = false
        this.count = res.data.count
        const result = res.data.model
        result.forEach(item => {
          if (item.status === 0) {
            item.status = '暂存'
          } else {
            item.status = '已发布'
          }
        })
        this.tableList = result
      })
    },
    //   处理表格行点击事件
    handleTableClick(scope) {
      this.del_loading = true
      console.log(scope)
      this.isDetailShow = true
      const params = {
        id: scope.id
      }
      getInformDetail(params).then(res => {
        this.del_loading = false
        const result = res.data
        result.status = result.status === 1 ? '已发布' : '暂存'
        this.informDetail = result
        console.log(res)
      })
    },
    // 获取所属渠道
    getChannel() {
      this.channelSelectList.loading = true
      getInformChannellist()
        .then(res => {
          // console.log(res)
          this.channelSelectList.data = res.data
          this.channelSelectList.data.unshift({
            id: -1,
            explains: '所有'
          })
          this.channelSelectList.loading = false
        })
        .catch(err => {
          this.channelSelectList.loading = false
          console.warn(err)
        })
    },
    // 获取保险公司列表
    getCompanyList() {
      this.companyList.loading = true
    },
    // 新增数据
    insertData() {
      // 清除之前添加的信息
      this.$refs.addData.$refs.addInform.clearValidate()
      this.$refs.addData.$refs.addInform.resetFields()
      this.isShow = true
    },
    // 确认提交
    confirm() {
      const checkData = this.$refs.addData.$refs.addInform
      console.log(this.$refs.addData['selectData'])
      checkData.validate(valid => {
        if (valid) {
          const params = {
            ...this.$refs.addData['selectData']
          }
          console.log(params)
          if (params.type === '按区域发送') {
            delete params.type
            if (!params.corporation) {
              params.corporation = -1
            }
            params.touids = ''
          } else {
            delete params.type
            params.tosourceid = ''
            params.corporation = ''
          }
          params.status = params.status === '存草稿' ? 0 : 1
          addInformInfo(params).then(res => {
            console.log(res)
            this.isShow = false
            this.queryList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 关闭新增窗口
    close() {
      this.isShow = false
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
.operateLog-page{
    .drawer-wrap{
      width:460px !important;
  }
  .logDetail{
        dd{
          // height:30px;
          line-height: 27px;
          font-size:14px;
           p{
            line-height:18px;
          }
        }

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
    .notification-page{
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
        .InformDetail{
        dd{
          // height:30px;
          line-height: 27px;
          font-size:14px;
           p{
            line-height:18px;
          }
        }

      }
    }

</style>
