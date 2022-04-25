<template>
  <div class="app-container config-page">
    <head-info
      title="配置信息"
      info="查询和编辑线下的配置信息" />
    <div class="app-panel">
      <div class="table-record-header">
        <el-row>
          <el-col :span="4">
            <el-button v-permission="permissionList.insertConfigManager" style="font-size: 14px;" type="text" size="small" @click="addInfo">
              <i class="el-icon-circle-plus-outline" />&nbsp;新增配置
            </el-button>
          </el-col>
          <el-col :span="20" type="flex" justify="end">
            <div style="text-align:right">
              <el-select
                :loading = "typeCodeList.loading"
                v-model="selectData.typeCode"
                size="small"
                filterable
                placeholder="编码类型"
                style="width: 145px;margin-right: 5px;" >
                <el-option
                  v-for="item in typeCodeList.data"
                  :key="item.id"
                  :label="item.text"
                  :value="item.code" />
              </el-select>
              <el-input v-model="selectData.searchText" placeholder="请输入筛选内容" size="small" style="width:150px; margin-right: 5px;"/>
              <el-button type="primary" icon="el-icon-search" size="small" @click="queryList">查询</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- <el-table v-loading="isLoading" :data="channelList.model" :height="tableHeight" max-height="100vh" border style="width: 100%;margin: 20px 0;" @sort-change="channelSort"> -->
      <el-table v-loading="isLoading" :data="tableList" height="calc(100vh - 310px)" max-height="100vh" border style="width: 100%;margin: 20px 0;">
        <el-table-column prop="code" label="编码" min-width="100"/>
        <el-table-column prop="typeCode" label="类型" min-width="60"/>
        <el-table-column prop="text" label="信息" min-width="200"/>
        <el-table-column prop="enable" label="状态" min-width="50"/>
        <el-table-column prop="description" label="描述" min-width="125" show-overflow-tooltip/>
        <el-table-column prop="sort" label="排序" sortable min-width="100"/>
        <el-table-column prop="create_time" label="添加时间" sortable min-width="140"/>
        <el-table-column prop="update_time" label="更新时间" sortable min-width="140"/>
        <el-table-column prop="extend1" label="拓展信息1" min-width="90"/>
        <el-table-column prop="extend2" label="拓展信息2" min-width="90"/>
        <el-table-column prop="extend3" label="拓展信息3" min-width="90"/>
        <el-table-column prop="extend4" label="拓展信息4" min-width="90"/>
        <el-table-column prop="extend5" label="拓展信息5" min-width="90"/>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-permission="permissionList.editConfigManager"
              v-if="isAnyAdminChannel"
              size="mini"
              type="text"
              style="font-size: 14px;"
              @click="editConfigInfo(scope)">编辑</el-button>
            <!-- <span style="color:#ccc;">|</span> -->
            <el-button
              v-permission="permissionList.deleteConfigManager"
              v-if="isAnyAdminChannel"
              size="mini"
              type="text"
              style="font-size: 14px;"
              @click="deleteConfig(scope)">删除</el-button>
          </template>
        </el-table-column>
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
      <!-- 批量替换弹窗 -->
      <app-drawer :is-show="drawer.isShow" :drawer-title="isEdit ? '编辑' : '新增配置'" :mask-closable="false" drawer-style="width: 500px;" @drawerClose="close" @drawerConfirm="confirm">
        <add-config-info ref="infoAddEdit" :is-edit="isEdit" :type-data="typeCodeList.data" :edit-data.sync="editData" />
        <!-- <add-edit-number ref="numberEdit" :is-edit="isEdit" /> -->
      </app-drawer>
    </div>
  </div>
</template>
<script>
import {
  getInfoConfigData,
  getTypeCode,
  insetConfig,
  updateConfig,
  deleteConfig
} from '@/api/infoConfig'
import { AppDrawer } from '@/components/Drawer'
import AddConfigInfo from '@/views/operation/components/addConfigInfo'
import { mapGetters } from 'vuex'
// import dayjs from 'dayjs'

export default {
  name: 'InfoConfig',
  components: {
    AppDrawer,
    AddConfigInfo
  },
  data() {
    // const checkUrl = (rule, value, callback) => {
    //   if (!value) callback()
    //   // const regExp = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/
    //   const regExp = /[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/
    //   if (!regExp.test(value)) {
    //     callback(new Error('输入的地址格式不正确'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      isLoading: false,
      isEdit: false,
      selectData: {
        typeCode: '00001',
        searchText: ''
      },
      typeCodeList: { // 类型编码
        data: [],
        loading: false
      },
      tableList: [],
      count: 0,
      page: 1, // 当前页码
      size: 20, // 每页数据条数
      drawer: {
        isShow: false,
        title: '编辑'
      },
      editData: {} // 编辑的数据
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否管理员渠道
    ])
  },
  created() {
    this.isLoading = true
    this.getCodeType()
    this.queryList()
  },
  methods: {
    //   获取表格信息
    queryList() {
      this.isLoading = true
      const params = {
        page: this.page,
        size: this.size,
        model: {
          typeCode: this.selectData.typeCode,
          description: this.selectData.searchText
        }
      }
      getInfoConfigData(params).then(res => {
        // console.log(res)
        this.count = res.data.count
        this.tableList = res.data.model
        console.log('关闭加载动画')
        this.isLoading = false
      }).catch(err => {
        console.warn(err)
        this.isLoading = false
      })
    },
    // 获取编码类型
    getCodeType() {
      this.typeCodeList.loading = true
      getTypeCode().then(res => {
        console.log(res)
        this.typeCodeList.loading = false
        this.typeCodeList.data = res.data
      }).catch(err => {
        console.warn(err)
        this.isLoading = false
      })
    },
    // 新增信息
    addInfo() {
      this.isEdit = false
      this.drawer.isShow = true
      this.drawer.title = '新增配置'
    },
    // 关闭窗口
    close() {
      this.drawer.isShow = false
      if (!this.isEdit) {
        this.$refs.infoAddEdit.$refs.ruleForm.clearValidate()
        this.$refs.infoAddEdit.$refs.ruleForm.resetFields()
      } else {
        this.$refs.infoAddEdit.$refs.ruleForm.clearValidate()
      }
    },
    // 点击确认
    confirm() {
      const checkData = this.$refs.infoAddEdit.$refs.ruleForm
      console.log(checkData)
      console.log(this.$refs.infoAddEdit['ruleForm'])
      checkData.validate(valid => {
        if (valid) {
          const params = this.$refs.infoAddEdit['ruleForm']
          params.text = params.text.trim()
          if (!this.isEdit) { // 新增页面
            insetConfig(params).then(res => {
              console.log(res)
              this.drawer.isShow = false
              this.queryList()
            }).catch(err => {
              console.warn(err)
            })
          } else { // 编辑页面
            const params = {
              ...this.$refs.infoAddEdit['ruleForm'],
              id: this.editData.id
            }
            updateConfig(params).then(res => {
              console.log(res)
              this.drawer.isShow = false
              this.queryList()
            }).catch(err => {
              console.warn(err)
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
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
    },
    // 编辑
    editConfigInfo(scope) {
      this.$refs.infoAddEdit.$refs.ruleForm.clearValidate()
      this.drawer.isShow = true
      this.isEdit = true
      this.editData = scope.row
      this.editData = {
        id: scope.row.id,
        typeCode: scope.row.typeCode,
        text: scope.row.text,
        description: scope.row.description
      }
      // this.editData.isLoading = true
      console.log(this.editData)
    },
    deleteConfig(scope) {
      this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: scope.row.id
        }
        deleteConfig(params).then(res => {
          console.log(res)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.queryList()
        }).catch(err => {
          console.warn(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style lang="scss">
.config-page{
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
