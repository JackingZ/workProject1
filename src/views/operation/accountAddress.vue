<template>
  <div class="app-container">
    <head-info title="工号地址" info="查询和编辑工号地址，支持新增和批量替换功能"/>
    <div class="app-panel">
      <div class="table-record-header">
        <el-row>
          <el-col :span="4">
            <el-button
              v-permission="permissionList.addAccountUrlManager"
              style="font-size: 14px;"
              type="text"
              size="small"
              @click="addAddr"
            >
              <i class="el-icon-circle-plus-outline"/>&nbsp;新增地址
            </el-button>
            <el-button
              v-permission="permissionList.replaceAccountUrlManager"
              style="font-size: 14px;"
              type="text"
              size="small"
              @click="replaceAddr"
            >
              <i class="el-icon-sort"/>&nbsp;批量替换
            </el-button>
          </el-col>
          <el-col :span="20" type="flex" justify="end">
            <div style="text-align:right">
              <el-select
                v-if="isAnyAdminChannel"
                v-model="selectData.sourceCode"
                size="small"
                clearable
                filterable
                placeholder="所属渠道"
                style="width: 130px;margin-right: 5px;"
                @clear="getClear"
              >
                <el-option
                  v-for="item in channelSelectList.data"
                  :key="item.code"
                  :label="item.shortName"
                  :value="item.code"
                />
              </el-select>
              <el-select
                v-model="selectData.areaCode"
                size="small"
                clearable
                filterable
                placeholder="选择地区"
                style="margin-right: 5px;width: 130px;flex: 0 0 auto;"
              >
                <el-option
                  v-for="item in policyAreasList.data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
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
              <el-input
                v-model="selectData.key"
                placeholder="请输入内容"
                size="small"
                style="width:260px; margin-right: 5px;"
              >
                <el-select slot="prepend" v-model="selectData.keyType" style="width:100px">
                  <el-option label="代理地址" value="1"/>
                  <el-option label="请求地址" value="2"/>
                </el-select>
              </el-input>
              <el-button type="primary" icon="el-icon-search" size="small" @click="queryList">查询</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- <el-table v-loading="isLoading" :data="channelList.model" :height="tableHeight" max-height="100vh" border style="width: 100%;margin: 20px 0;" @sort-change="channelSort"> -->
      <el-table
        v-loading="isLoading"
        :data="addressList.model"
        :height="tableHeight"
        max-height="100vh"
        border
        style="width: 100%;margin: 20px 0;"
      >
        <el-table-column v-if="isAnyAdminChannel" prop="sourceCode_" label="所属渠道" min-width="120"/>
        <el-table-column prop="areaCode_" label="地区" width="120"/>
        <el-table-column prop="companyId_" label="保险公司" width="120"/>
        <el-table-column prop="proxyUrl" label="代理地址" min-width="240"/>
        <el-table-column prop="reqUrl" label="请求地址" min-width="240"/>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip width="180"/>
        <el-table-column prop="createTime" label="添加时间" sortable width="180"/>
        <el-table-column prop="id" label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-permission="permissionList.editAccountUrlManager"
              v-if="isAnyAdminChannel"
              size="mini"
              type="text"
              style="font-size: 14px;"
              @click="editAddressInfo(scope)"
            >编辑</el-button>
            <el-button
              v-permission="permissionList.deleteAccountUrlManager"
              v-if="isAnyAdminChannel"
              size="mini"
              type="text"
              style="font-size: 14px;"
              @click="deleteAddress(scope)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        :total="addressList.count"
        :current-page.sync="page"
        :page-size="size"
        :page-sizes="[10, 20, 30, 40, 50]"
        style="text-align: right;"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="getCurrentData"
      />
      <!-- 批量替换弹窗 -->
      <el-dialog :visible.sync="replaceFormVisible" title="批量替换" width="520px">
        <el-form
          ref="replaceForm"
          :model="replaceForm"
          :rules="rule2"
          style="border-top:1px solid #cccccc;padding-top:20px"
        >
          <el-form-item label-width="120px" label="查找地址" prop="addressType" style="margin-top:20px">
            <el-select v-model="replaceForm.addressType" placeholder="请选择" style="width:300px;">
              <el-option label="代理地址" value="1"/>
              <el-option label="请求地址" value="2"/>
            </el-select>
          </el-form-item>
          <el-form-item label-width="120px" label prop="sourceAddress">
            <el-select
              v-model="replaceForm.sourceAddress"
              filterable
              clearable
              placeholder="请选择"
              style="width:300px;"
              @focus="getAccountUrlList"
            >
              <el-option
                v-for="(item,index) in getUrlList.data"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="替换为" label-width="120px" prop="targetAddress">
            <el-input v-model="replaceForm.targetAddress" auto-complete="off" style="width:300px;"/>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
          style="border-top:1px solid #cccccc; padding-top:20px"
        >
          <el-button @click="replaceCancel">取 消</el-button>
          <el-button type="primary" @click="replaceConfirm()">确 定</el-button>
        </div>
      </el-dialog>
      <app-drawer
        :is-show="isAddShow"
        :mask-closable="false"
        drawer-title="新增地址"
        drawer-style="width: 500px;"
        @drawerClose="drawerClose"
        @drawerConfirm="drawerConfirm"
      >
        <div v-if="false" slot="afterTitle" class="head-btn">
          <my-switch
            v-model="accountUrlState"
            :active-value="0"
            :inactive-value="1"
            @input="stateMsg"
          />
        </div>
        <add-address
          ref="addData"
          :is-edit="isEdit"
          :channellist="channelSelectList.data"
          :arealist="policyAreasList.data"
          :companylist="companyList.data"
        />
      </app-drawer>
      <app-drawer
        :is-show="isEditShow"
        :mask-closable="false"
        drawer-title="编辑地址"
        drawer-style="width: 500px;"
        @drawerClose="drawerClose"
        @drawerConfirm="drawerConfirm"
      >
        <div v-if="false" slot="afterTitle" class="head-btn">
          <my-switch
            v-model="accountUrlState"
            :active-value="0"
            :inactive-value="1"
            @input="stateMsg"
          />
        </div>
        <edit-address
          ref="editData"
          :is-edit="isEdit"
          :edit-data.sync="editData"
          :channellist="channelSelectList.data"
          :arealist="policyAreasList.data"
          :companylist="companyList.data"
        />
      </app-drawer>
    </div>
  </div>
</template>
<script>
import {
  getCompanysData,
  getAcountUrl,
  deleteAccountAddr,
  addAccountAddr,
  getAllChannelData,
  getPolicyAreasData,
  replaceAccountAddr,
  getAccountUrl
} from '@/api/accounturl'
import { AppDrawer } from '@/components/Drawer'
import { EditAddress, AddAddress } from '@/views/operation/components'
import { mapGetters } from 'vuex'
// import dayjs from 'dayjs'

export default {
  name: 'Channel',
  components: {
    AppDrawer,
    EditAddress,
    AddAddress
  },
  data() {
    const checkUrl = (rule, value, callback) => {
      if (!value) callback()
      // const regExp = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/
      const regExp = /[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/
      if (!regExp.test(value)) {
        callback(new Error('输入的地址格式不正确'))
      } else {
        callback()
      }
    }
    return {
      // 替换地址弹窗
      replaceFormVisible: false,
      replaceForm: {
        addressType: '1',
        sourceAddress: '',
        targetAddress: ''
      },
      channelSelectList: {
        loading: false,
        data: []
      },
      policyAreasList: {
        // 保监地区列表
        loading: false,
        data: []
      },
      companyList: {
        // 保险公司列表
        loading: false,
        data: []
      },
      // 渠道列表
      selectData: {
        areaCode: '', // 保监地区选择的值
        companyId: undefined, // 保险公司ID
        key: '', // 代理地址/请求地址查询值
        keyType: '1', // 1:代理地址 2:请求地址 ,
        sourceCode: '' // 所属渠道选择的值
      },
      tableHeight: 'calc(100vh - 310px)',
      getUrlList: {
        loading: false,
        data: []
      }, // 地址列表
      addressList: [], // 工号地址列表
      accountUrlState: 0, // 工号地址开关
      isEdit: false, // 是否是编辑
      editData: {
        isLoading: false
      }, // 编辑带过去的数据
      isAddEditShow: false, // 添加编辑窗口
      isAddShow: false,
      isEditShow: false,
      page: 1,
      size: 20,
      isLoading: false, // 表格loading动画
      channelList: {}, // 工号列表
      channelType: [], // 渠道
      inputValue: '',
      status: [{ key: 0, value: '已启用' }, { key: 1, value: '已禁用' }], // 状态
      areaList: [],
      rule2: {
        targetAddress: [
          { required: true, message: '替换的地址不能为空', trigger: 'blur' },
          { validator: checkUrl, trigger: 'blur' }
        ],
        sourceAddress: [
          { required: true, message: '请选择要替换的地址', trigger: 'change' }
        ],
        addressType: [
          { required: true, message: '请选择地址方式', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否管理员渠道
    ])
  },
  created() {
    this.isLoading = true
    this.queryList()
    // 获取查询渠道列表
    this.getChannel()
    this.getPolicyArea()
    this.getCompanyList()
  },
  methods: {
    // 查询列表数据
    queryList() {
      console.log('查询列表数据')
      console.log(JSON.stringify(this.selectData))
      // parseInt(this.selectData.keyType)
      const model = {
        areaCode: this.selectData.areaCode,
        key: this.selectData.key.trim(),
        keyType: parseInt(this.selectData.keyType),
        sourceCode: this.selectData.sourceCode,
        companyId: this.selectData.companyId
      }
      this.isLoading = true
      getAcountUrl({
        page: this.page,
        size: this.size,
        model: model
      })
        .then(res => {
          this.addressList = res.data
          this.isLoading = false
        })
        .catch(err => {
          console.warn(err)
          this.isLoading = false
        })
    },
    // 获取所属渠道
    getChannel() {
      getAllChannelData()
        .then(res => {
          // console.log(res)
          if (res.status === 200) {
            this.channelSelectList.data = res.data
          } else {
            this.$message.error(res.msg)
            return false
          }
        })
        .catch(err => {
          console.warn(err)
        })
    },
    //  获取保监地区
    getPolicyArea() {
      getPolicyAreasData()
        .then(res => {
          // console.log(res)
          if (res.status === 200) {
            this.policyAreasList.data = res.data
          } else {
            this.$message.error(res.msg)
            return false
          }
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
          const companys = res.data.filter(v => {
            return v.isMock === 1
          })
          this.companyList.data = companys
        })
        .catch(err => {
          this.companyList.loading = false
          console.warn(err)
        })
    },
    // 新增地址
    addAddr() {
      this.isEdit = false
      console.log('新增地址')
      this.isShow = true
      this.isEditShow = false
      this.isAddShow = true
      this.title = '新增地址'
      this.drawerStyle = 'width: 500px;'
      // addAccountAddr({})
    },
    // 批量替换
    replaceAddr() {
      console.log('批量替换')
      this.replaceFormVisible = true
    },
    // 批量替换取消
    replaceCancel() {
      this.replaceFormVisible = false
      this.$refs.replaceForm.clearValidate() // 清除校验结果
    },
    // 批量替换确认
    replaceConfirm() {
      console.log(this.$refs.replaceForm)
      this.$refs['replaceForm'].validate(valid => {
        if (valid) {
          replaceAccountAddr({
            select: this.replaceForm.sourceAddress,
            replace: this.replaceForm.targetAddress.trim(),
            type: parseInt(this.replaceForm.addressType)
          }).then(res => {
            this.replaceFormVisible = false
            console.log(res)
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取工号地址和代理地址
    getAccountUrlList() {
      this.getUrlList.loading = true
      getAccountUrl({
        type: this.replaceForm.addressType
      })
        .then(res => {
          // console.log(res)
          this.getUrlList.loading = false
          this.getUrlList.data = res.data
        })
        .catch(err => {
          this.getUrlList.loading = false
          console.warn(err)
        })
    },
    // 删除信息
    deleteAddress(scope) {
      console.log(scope)
      console.log('删除地址')
      this.$confirm('此操作将删除该条数据, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteAccountAddr(scope.row.id).then(res => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.queryList()
            } else {
              this.$message.error(res.msg)
              return false
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 清除输入查询的信息
    getClear() {
      // this.selectData.comcode = null
      // this.selectData.company = {}
    },
    stateMsg() {
      switch (this.accountUrlState) {
        case 0:
          this.$confirm('启用操作完成！继续点击“确定”按钮保存后生效', '提示', {
            confirmButtonText: '我知道了',
            showCancelButton: false,
            type: 'success'
          })
          break
        case 1:
          this.$confirm('禁用操作完成！继续点击“确定”按钮保存后生效', '提示', {
            confirmButtonText: '我知道了',
            showCancelButton: false,
            type: 'success'
          })
          break
        default:
          return
      }
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
    // 增加或编辑地址确认
    drawerConfirm() {
      // 校验新增地址数据是否有效
      var data, checkData
      if (this.isEdit) {
        checkData = this.$refs.editData.$refs.eidtAddress
        // console.log(checkData)
        data = this.$refs.editData['selectInfo']
      } else {
        console.log('新增页面')
        checkData = this.$refs.addData.$refs.addAddress
        data = this.$refs.addData['selectInfo']
        // console.log(this.$refs.addData)
      }
      checkData.validate(valid => {
        console.log(valid)
        if (valid) {
          const params = {
            sourceCode: data.sourceCode1,
            areaCode: data.areaCode1,
            companyId: data.companyId1,
            proxyUrl: data.proxyUrl1,
            reqUrl: data.reqUrl1,
            remark: data.remark1
          }
          // 编辑地址
          if (this.isEdit) {
            params.id = this.editData.id
            params.isDelete = this.editData.delete
          }
          addAccountAddr(params).then(res => {
            console.log(res)
            if (res.status === 200) {
              this.isAddShow = false
              this.isEditShow = false
              this.queryList()
            } else {
              this.queryList()
              this.isAddShow = false
              this.isEditShow = false
              this.$message.error(res.msg)
              return false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 编辑地址
    editAddressInfo(scope) {
      console.log(scope)
      // this.editData.isLoading = true
      // this.editData = scope.row
      this.editData = {
        sourceCode: scope.row.sourceCode,
        areaCode: scope.row.areaCode,
        companyId: scope.row.companyId,
        proxyUrl: scope.row.proxyUrl,
        reqUrl: scope.row.reqUrl,
        remark: scope.row.remark,
        id: scope.row.id
      }
      // this.edit.Data
      this.isEdit = true
      this.isAddShow = false
      this.isEditShow = true
    },
    // 关闭编辑窗口或者添加窗口
    drawerClose() {
      if (!this.isEdit) {
        console.log(this.$refs.addData.$refs.addAddress)
        this.$refs.addData.$refs.addAddress.clearValidate()
        this.$refs.addData.$refs.addAddress.resetFields()
      } else {
        this.$refs.editData.$refs.eidtAddress.clearValidate()
      }
      // this.queryList()
      this.isAddShow = false
      this.isEditShow = false
      console.log('关闭编辑窗口')
      this.isEditShow = false
    }
  }
}
</script>
<style lang="scss">
.app-panel {
  overflow: hidden;
}
.app-panel {
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
