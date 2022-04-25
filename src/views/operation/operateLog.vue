<template>
  <div class="app-container operateLog-page">
    <head-info
      title="操作日志"
      info="查询系统所有渠道的操作日志信息" />
    <div class="app-panel">
      <div class="table-record-header">
        <el-row>
          <div style="text-align:right">
            <el-select
              v-model="selectData.channelCode"
              size="small"
              filterable
              clearable
              placeholder="所属渠道"
              style="width: 130px;margin-right: 5px;">
              <el-option
                v-for="item in channelSelectList.data"
                :key="item.code"
                :label="item.shortName"
                :value="item.code"
              />
            </el-select>
            <el-select
              v-model="selectData.level"
              size="small"
              placeholder="选择类型"
              style="margin-right: 5px;width: 130px;flex: 0 0 auto;"
            >
              <el-option value="-1" label="所有" />
              <el-option value="1" label="业务异常" />
              <el-option value="2" label="系统异常" />
            </el-select>
            <el-select
              v-model="selectData.companyId"
              size="small"
              clearable
              filterable
              placeholder="保险公司"
              style="margin-right: 5px;width: 130px;flex: 0 0 auto;"
            >
              <el-option
                v-for="item in companyList.data"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-select
              v-model="selectData.actionType"
              size="small"
              clearable
              filterable
              placeholder="选择类型"
              style="margin-right: 5px;width: 130px;flex: 0 0 auto;"
            >
              <el-option
                v-for="(item,index) in typeList"
                :key="index"
                :value="item.value"
                :label="item.label" />
            </el-select>

            <el-date-picker
              v-model="querytime"
              type="daterange"
              size="small"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:300px;"/>
            <el-input
              v-model="selectData.keyWord"
              placeholder="请输入内容"
              size="small"
              style="width:260px; margin-right: 5px;"
            >
              <el-select slot="prepend" v-model="selectData.keyType" style="width:100px">
                <el-option :value="0" label="车牌"/>
                <el-option :value="1" label="用户名"/>
                <el-option :value="2" label="手机号"/>
              </el-select>
            </el-input>
            <el-button type="primary" icon="el-icon-search" size="small" @click="queryList">查询</el-button>
          </div>
        </el-row>
      </div>
      <el-table v-loading="isLoading" :data="tableList" height="calc(100vh - 310px)" max-height="100vh" border style="width: 100%;margin: 20px 0;" @row-dblclick="handleTableClick">
        <el-table-column prop="licenseNo" label="车牌" width="100" fixed/>
        <el-table-column prop="channelName" label="所属渠道" width="120"/>
        <el-table-column prop="name" label="用户名" width="120"/>
        <el-table-column prop="cell" label="登录账户" width="120"/>
        <el-table-column prop="operate" label="访问接口" width="200"/>
        <el-table-column prop="module" label="操作描述" width="200" show-overflow-tooltip/>
        <el-table-column prop="time" label="操作时间" sortable width="180" />
        <el-table-column prop="runTime" label="耗时(ms)" sortable width="110"/>
        <el-table-column prop="errMsg" label="异常信息" min-width="300" show-overflow-tooltip />
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
        @current-change="getCurrentData"/>
    </div>
    <!-- 日志详情弹窗 -->
    <el-dialog
      :visible.sync="isDetailShow"
      width="700px"
      title="日志详情"
      center>
      <div class="logDetail">
        <dl>
          <dd>车牌：{{ logDetail.licenseNo }}</dd>
          <dd>ID：{{ logDetail.uid }}</dd>
          <dd>登录名：{{ logDetail.name }}</dd>
          <dd>操作描述：{{ logDetail.module }}</dd>
          <dd>来源IP：{{ logDetail.clientIp }}</dd>
          <dd>手机号码：{{ logDetail.cell }}</dd>
          <dd>访问方法名：{{ logDetail.operate }}</dd>
          <dd>访问时间：{{ logDetail.time }}</dd>
          <dd>
            <p>输入参数：</p>
            <el-input
              :rows="6"
              v-model="logDetail.requestParam"
              type="textarea" />
          </dd>
          <dd>
            <p>错误信息：</p>
            <el-input
              :rows="6"
              v-model="logDetail.errMsg"
              type="textarea" />
          </dd>
        </dl>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllChannelData,
  getCompanysData,
  getOperateLog,
  getOperateLogById
} from '@/api/operateLog'
import { AppDrawer } from '@/components/Drawer'
import AddConfigInfo from '@/views/operation/components/addConfigInfo'
import moment from 'moment'
export default {
  name: 'OperateLog',
  components: {
    AppDrawer,
    AddConfigInfo
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
      typeList: [
        {
          value: 7,
          label: '续保查询'
        },
        {
          value: 0,
          label: '车型查询'
        },
        {
          value: 1,
          label: '报价'
        },
        {
          value: 2,
          label: '核保'
        },
        {
          value: 3,
          label: '支付'
        },
        {
          value: 4,
          label: '承保回调'
        },
        {
          value: 5,
          label: '支付回调'
        },
        {
          value: 6,
          label: '撤单'
        }

      ],
      querytime: [],
      selectData: {
        level: '-1',
        companyId: '',
        actionType: '',
        keyType: 0,
        keyWord: '',
        channelCode: '001'
      }
    }
  },
  computed: {
    // ...mapGetters([
    //   'isAnyAdminChannel' // 判断登陆用户是否管理员渠道
    // ])
  },
  async created() {
    this.isLoading = true
    const { data: channelList } = await getAllChannelData()
    this.channelSelectList.data = channelList
    this.getCompanyList()
    this.querytime = [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
    this.queryList()
  },
  methods: {
    //   获取表格信息
    queryList() {
      this.isLoading = true
      const model = Object.assign({}, this.selectData)
      model.startDate = this.querytime[0]
      model.endDate = this.querytime[1]
      const params = {
        model,
        page: this.page,
        size: this.size
      }
      getOperateLog(params).then(res => {
        this.isLoading = false
        const result = res.data.model
        this.count = res.data.count
        result.forEach(item => {
          item.time = moment(item.time).format('YYYY-MM-DD HH:mm:ss')
          const channelData = this.channelSelectList.data.find(info => {
            console.log(info.shortName)
            return info.code === item.sourceId
          })
          item.channelName = channelData ? channelData.shortName : '--'
        })
        this.tableList = result
      }).catch(err => {
        console.warn(err)
        this.isLoading = false
      })
    },
    //   处理表格行点击事件
    handleTableClick(scope) {
      console.log(scope)
      this.isDetailShow = true
      const id = scope.id
      getOperateLogById(id).then(res => {
        console.log(res)
        const result = res.data
        result.time = moment(result.time).format('YYYY-MM-DD HH:mm:ss')
        this.logDetail = result
      })
    },
    // 获取所属渠道
    getChannel() {
      getAllChannelData()
        .then(res => {
          // console.log(res)
          this.channelList = res.data
          // this.channelSelectList.data = res.data
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 获取保险公司列表
    getCompanyList() {
      this.companyList.loading = true
      getCompanysData()
        .then(res => {
          // console.log('保险公司' + JSON.stringify(res))
          this.companyList.loading = false
          this.companyList.data = res.data
        })
        .catch(err => {
          this.companyList.loading = false
          console.warn(err)
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
    .operateLog-page{
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
    }

</style>
