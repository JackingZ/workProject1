<!--suppress ALL -->
<template>
  <!-- eslint-disable -->
  <div>
    <div class="app-container">
      <div class="app-panel">
        <el-row>
          <el-col :span="22">
            <el-select v-if="isAnyAdminChannel" v-model="selectData.usCode" size="small" clearable filterable placeholder="所属渠道" style="width: 130px;" @clear="getClear">
              <el-option v-for="item in channelSelectList.data" :key="item.code" :label="item.shortName" :value="item.code" />
            </el-select>

            <my-tree-select :options="orgSelectList.data" :disabled="isAnyAdminChannel && !selectData.usCode" :value="selectData.comcode" :normalizer="normalizer" no-options-text="数据加载中..." valueFormat="object" no-children-text="" style="width:200px;display: inline-block;vertical-align: top;" placeholder="选择机构" no-results-text="未找到结果" @input="selectData.comcode = $event" @open="getOrg" />

            <el-select v-model="selectData.provinceCode" size="small" clearable filterable placeholder="全部地区" style="width: 130px;">
              <el-option v-for="item in policyAreasList.data" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>

            <el-select v-model="selectData.insureCompanySourceId" size="small" clearable filterable placeholder="保险公司" style="width: 130px;">
              <el-option v-for="item in companyList.data" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>

            <el-select v-model="selectData.binded" size="small" clearable filterable placeholder="绑定状态" style="width: 130px;">
              <el-option v-for="item in stateList.data" :key="item.key" :label="item.value" :value="item.key" />
            </el-select>

            <el-select v-model="selectData.enable" size="small" clearable filterable placeholder="启用状态" style="width: 130px;">
              <el-option v-for="item in companyTypeList.data" :key="item.key" :label="item.value" :value="item.key" />
            </el-select>
            <el-input v-model="selectData.jobNumber" style="width: 120px;" placeholder="工号查询" size="small" />

            <el-button v-permission="permissionList.issueJobNumberSearch" type="primary" size="small" icon="el-icon-search" @click="handleQuery">查询</el-button>
          </el-col>
          <el-col :span="2">
            <el-row type="flex" justify="end">
              <el-button v-permission="permissionList.issueJobNumberAdd" type="primary" size="small" icon="el-icon-plus" @click="handleAdd">添加</el-button>
            </el-row>
          </el-col>
        </el-row>

        <el-table v-loading="isLoading" :data="numberList.model" border style="width: 100%;margin: 20px 0;">
          <el-table-column prop="cid" label="ID" width="60" fixed="left"/>
          <el-table-column :formatter="shortChannel" prop="userSourceName" label="所属渠道" />
          <el-table-column prop="jobNumber" label="工号" />
          <el-table-column :formatter="insureChannel" prop="insureName" label="保险公司" />
          <el-table-column :formatter="provinceArea" prop="provinceName" label="地区" width="80" />
          <el-table-column prop="companyName" label="所属机构" width="273" />
          <el-table-column :formatter="bindFormat" prop="binded" label="绑定状态" width="80" />
          <el-table-column :formatter="dataFormat" prop="createTime" label="添加时间" />
          <el-table-column prop="enable" label="使用状态" width="100">
            <template slot-scope="scope">
              <el-tooltip :content="'开启关闭工号'" placement="top">
                <el-switch v-model="scope.row.enable" :active-value="0" :inactive-value="1" @change="numberSwitch(scope.row, scope.row.enable)" />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="操作" fixed="right">
            <template slot-scope="scope">
              <span v-permission="permissionList.issueJobNumberUpdate" style="color: #1890ff;cursor: pointer;" @click="handleEdit(scope)">编辑</span>
              <span style="border-left:1px solid #ccc;margin-left: 5px;padding-right: 5px;" />
              <span v-permission="permissionList.issueJobNumberBind" style="color: #1890ff;cursor: pointer;" @click="handleBinding(scope.$index, scope.row)">绑定机构</span>
              <span style="border-left:1px solid #ccc;margin-left: 5px;padding-right: 5px;" />
              <span v-permission="permissionList.issueJobNumberBind" style="color: #1890ff;cursor: pointer;" @click="handleDelete(scope.$index, scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination :current-page="page" :page-sizes="[10, 20, 30, 40, 50]" :page-size="size" :total="numberList.count" background style="text-align: right;" layout="total, prev, pager, next, sizes" @size-change="getSizeChange" @current-change="getCurrentData" />

        <el-dialog :visible.sync="dialogChannelVisible" title="绑定机构" width="30%">
          <el-tree ref="tree" :data="companyTreeData" :props="defaultProps" :default-checked-keys="defaultCheckCompany" node-key="key" show-checkbox />
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogChannelVisible = false">取 消</el-button>
            <el-button type="primary" size="small" @click="bindingConfirm">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <app-drawer :is-show="isShow" :drawer-title="title" :drawer-style="drawerStyle" :mask-closable="false" @drawerClose="close" @drawerConfirm="confirm">
      <number-add v-if="isShow" ref="numberAdd" :channel-id="channelId" :edit-data="editData" />
    </app-drawer>
  </div>
</template>

<script>
import appDrawer from '@/components/Drawer/drawer'
import numberAdd from '@/views/insurance/numberAdd'
import {
  getBadgeList,
  setBadgeInsert,
  setBadgeUpdate,
  setBadgeDelete,
  setBadgeDelEffect,
  setBadgeDisable,
  setBadgeRecovery,
  getChannelEffective,
  getcompanyEffective,
  getOrgData,
  getBindChannel,
  getBindChannelParents,
  getBindChannelInsert,
  getPolicyAreasData,
  getCompanysData,
  getBindChannelId
} from '@/api/badgenum'
import { formatDate } from '@/utils'
import MyTreeSelect from '@/components/MyTreeSelect/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Number',
  components: {
    MyTreeSelect,
    numberAdd,
    appDrawer
  },
  data() {
    return {
      channelId: '',
      editData: {},
      isLoading: false,
      page: 1,
      size: 10,
      numberList: {},
      channelSelectList: {
        loading: false,
        data: []
      },
      policyAreasList: {
        loading: false,
        data: []
      },
      companyList: {
        loading: false,
        data: []
      },
      stateList: {
        data: [{ key: 1, value: '未绑定' }, { key: 0, value: '已绑定' }]
      },
      companyTypeList: {
        data: [{ key: 0, value: '可用' }, { key: 1, value: '禁用' }]
      },
      orgSelectList: {
        model: '请选择机构',
        props: { value: 'key', label: 'title', children: 'children' },
        data: []
      },
      selectData: {
        comcode: null, // 所属机构选择的值
        companyIds: [], // 所属渠道
        usCode: null, // 所属渠道
        userSourceCode: this.$store.getters.userAll.data.channelCode, // 所属渠道
        company: {}, // 所属机构
        provinceCode: null, // 保监地区
        insureCompanySourceId: null, // 保险公司
        binded: null, // 绑定状态
        enable: null, // 启用状态
        jobNumber: null // 工号
      },
      dialogChannelVisible: false,
      isShow: false,
      title: '',
      drawerStyle: '',
      defaultCheckCompany: [], // 选中的所辖机构（id）
      companyTreeData: [], // 机构树el-tree
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      bindingId: '',
      bindingData: []
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否管理员渠道
    ])
  },
  watch: {},
  created() {
    this.getChannel()
    this.getPolicyArea()
    this.getCompanyList()
    this.handleQuery()
  },
  methods: {
    // 获取所属渠道
    getChannel() {
      getChannelEffective()
        .then(res => {
          this.channelSelectList.data = res.data
        })
        .catch(err => {
          console.warn(err)
        })
    },
    getClear() {
      this.selectData.comcode = null
      this.selectData.company = {}
    },
    //  获取保监地区
    getPolicyArea() {
      getPolicyAreasData()
        .then(res => {
          this.policyAreasList.data = res.data
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 获取保险公司列表
    getCompanyList() {
      getCompanysData()
        .then(res => {
          const arr = []
          for (let i = 0, len = res.data.length; i < len; i++) {
            if (res.data[i]['name'] === '平安.') {
              arr.push(res.data[i])
            }
            if (res.data[i]['name'] === '中银.') {
              arr.push(res.data[i])
            }
            if (res.data[i]['isMock'] === 0) {
              if (res.data[i]['name'] === '富德') {
                arr.push(res.data[i])
              }
              if (res.data[i]['name'] === '诚泰') {
                arr.push(res.data[i])
              }
              if (res.data[i]['name'] === '利宝') {
                arr.push(res.data[i])
              }
              if (res.data[i]['name'] === '人保') {
                arr.push(res.data[i])
              }
              if (res.data[i]['name'] === '太平洋') {
                arr.push(res.data[i])
              }
              if (res.data[i]['name'] === '亚太') {
                arr.push(res.data[i])
              }
              if (res.data[i]['name'] === '太平') {
                arr.push(res.data[i])
              }
              if (res.data[i]['name'] === '安盛天平') {
                arr.push(res.data[i])
              }
              if (res.data[i]['name'] === '国寿财') {
                arr.push(res.data[i])
              }
              if (res.data[i]['name'] === '华安') {
                arr.push(res.data[i])
              }
              if (res.data[i]['name'] === '阳光') {
                arr.push(res.data[i])
              }
              // if(res.data[i]['name'] === '中煤'){
              //     arr.push(res.data[i]);
              // }
            }
          }
          this.companyList.data = arr
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 分页
    getCurrentData(val) {
      this.page = val
      this.handleQuery()
    },
    getSizeChange(val) {
      this.size = val
      this.handleQuery()
    },
    // 格式化表格时间
    dataFormat(r) {
      return formatDate(r.createTime)
    },
    // 格式化表格渠道
    shortChannel(r) {
      const len = this.channelSelectList.data.length
      const arr = this.channelSelectList.data
      for (let i = 0; i < len; i++) {
        if (r.userSourceCode === arr[i].code) {
          r.userSourceName = arr[i].shortName
        }
      }
      return r.userSourceName
    },
    // 格式化保险公司
    insureChannel(r) {
      const len = this.companyList.data.length
      const arr = this.companyList.data
      for (let i = 0; i < len; i++) {
        if (Number(r.insureCompanySourceId) === arr[i].id) {
          r.insureName = arr[i].name
        }
      }
      return r.insureName
    },
    // 格式化保险地区
    provinceArea(r) {
      const len = this.policyAreasList.data.length
      const arr = this.policyAreasList.data
      for (let i = 0; i < len; i++) {
        if (r.provinceCode === arr[i].id) {
          r.provinceName = arr[i].name
        }
      }
      return r.provinceName
    },
    // 格式化绑定状态
    bindFormat(r) {
      if (Number(r.binded) === 0) {
        return '已绑定'
      }
      if (Number(r.binded) === 1) {
        return '未绑定'
      }
    },
    // 工号开关
    numberSwitch(row, enable) {
      console.log(row, enable)
      if (enable === 1) {
        setBadgeDisable(row)
          .then(res => {
            this.$message({
              message: '工号已关闭',
              type: 'success'
            })
          })
          .catch(err => {
            console.warn(err)
          })
      } else {
        setBadgeRecovery(row)
          .then(res => {
            this.$message({
              message: '工号已开启',
              type: 'success'
            })
          })
          .catch(err => {
            console.warn(err)
          })
      }
    },

    // 点击获取机构
    getOrg() {
      if (!this.isAnyAdminChannel) {
        getcompanyEffective().then(res => {
          this.orgSelectList.data = res.data
        })
      } else {
        getOrgData({
          channelCode: this.selectData.usCode,
          areaCode: null,
          filterTeamCompany: true,
          token: this.$store.getters.token
        }).then(res => {
          this.orgSelectList.data = res.data.data
        })
      }
    },
    // 查询
    handleQuery() {
      this.numberList.model = []
      const val = this.selectData.comcode
      console.log(val)
      if (val) {
        this.selectData.company = {}
        if (val.level === 0) {
          this.selectData.company.company0 = val.key
        } else if (val.level === 1) {
          this.selectData.company.company1 = val.key
        } else if (val.level === 2) {
          this.selectData.company.company2 = val.key
        } else if (val.level === 3) {
          this.selectData.company.company3 = val.key
        } else if (val.level === 4) {
          this.selectData.company.company4 = val.key
        } else if (val.level === 5) {
          this.selectData.company.company5 = val.key
        } else if (val.level === 6) {
          this.selectData.company.company6 = val.key
        }
      } else {
        this.selectData.company = {}
      }
      const blcs = this.$store.getters.userAll.data.belongCompanys
      const maxItem = blcs.sort((a, b) => b.level - a.level)[0]
      this.selectData.companyIds = [maxItem.id]
      if (this.selectData.usCode) {
        this.selectData.userSourceCode = this.selectData.usCode
        this.selectData.queryType = 'search'
      } else {
        this.selectData.userSourceCode = this.$store.getters.userAll.data.channelCode
        this.selectData.queryType = null
      }
      for (const key in this.selectData) {
        if (this.selectData[key] === '') {
          this.selectData[key] = null
        }
      }
      this.isLoading = true
      getBadgeList({
        page: this.page,
        size: this.size,
        model: this.selectData
      })
        .then(res => {
          this.numberList = res.data
          this.isLoading = false
        })
        .catch(err => {
          console.warn(err)
          this.isLoading = false
        })
    },
    // 打开编辑
    handleEdit(scope) {
      this.isShow = true
      this.editData = scope.row
      this.channelId = scope.row.userSourceCode
      this.title = '工号编辑 (电脑出单专用)'
      this.drawerStyle = 'width: 500px;'
    },
    // 提交编辑
    submitEdit(val) {
      setBadgeUpdate(val)
        .then(res => {
          this.isShow = false
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.handleQuery()
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 打开新增
    handleAdd() {
      this.isShow = true
      this.editData = {}
      this.channelId = ''
      this.title = '工号新增 (电脑出单专用)'
      this.drawerStyle = 'width: 500px;'
    },
    // 提交新增
    submitAdd(val) {
      setBadgeInsert(val)
        .then(res => {
          this.isShow = false
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.handleQuery()
        })
        .catch(err => {
          console.warn(err)
        })
    },
    close() {
      this.isShow = false
    },
    // 编辑、新增确定
    confirm() {
      const formData = this.$refs.numberAdd.form
      console.log(formData)
      // formData.insureChannelName =
      //   formData.provinceName +
      //   formData.insureCompanySourceName +
      //   '-' +
      //   formData.jobNumber
      this.$refs.numberAdd.$refs.numberAdd.validate(valid => {
        if (!valid) {
          return
        }
        if (this.channelId) {
          this.submitEdit(formData)
        } else {
          this.submitAdd(formData)
        }
      })
    },
    // 删除
    handleDelete(index, row) {
      setBadgeDelEffect(row.id)
        .then()
        .catch(err => {
          console.warn(err)
        })
      this.$confirm('确定删除 ' + row.jobNumber + '工号?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          row.enable = 2
          setBadgeDelete(row)
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.numberList.model.splice(index, 1)
            })
            .catch(err => {
              this.$message.error(err)
            })
        })
        .catch(() => {})
    },
    // 绑定机构
    handleBinding(index, row) {
      this.bindingData = row
      this.bindingId = row.id
      this.dialogChannelVisible = true
      const treeRequest = getBindChannel({
        areaCode: row.provinceCode,
        channelCode: row.userSourceCode,
        filteTeamCompany: true,
        token: this.$store.getters.token
      }).then(res => {
        const json = JSON.parse(JSON.stringify(res).replace(/title/g, 'label'))
        this.companyTreeData = json.data.data
      })
      const getIdRequest = getBindChannelId({
        insureCompanyChannelId: row.id
      }).then(res => {
        return res.data
      })
      Promise.all([treeRequest, getIdRequest])
        .then(res => {
          if (!res[1]) return
          const array = res[1]
          const keys = []
          for (const item of array) {
            const id = this.getChildCompanyId(item)
            keys.push(id)
          }
          this.$refs.tree.setCheckedKeys(keys)
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 提交机构树
    bindingConfirm() {
      const keys = this.getChildNodeKeys()
      if (keys.length > 0) {
        this.bindingData.binded = 0
      } else {
        this.bindingData.binded = 1
      }
      getBindChannelParents(keys)
        .then(res => {
          const datas = this.createOrgListParams(res.data.data)
          return getBindChannelInsert({
            datas,
            insureCompanyChannelId: this.bindingId
          })
        })
        .then(res => {
          this.dialogChannelVisible = false
          this.companyTreeData = []
          this.submitEdit(this.bindingData)
        })
        .catch(err => {
          console.warn(err)
          this.dialogChannelVisible = false
          this.companyTreeData = []
        })
    },
    getChildCompanyId(item) {
      return (
        item.company6 ||
        item.company5 ||
        item.company4 ||
        item.company3 ||
        item.company2 ||
        item.company1 ||
        item.company0
      )
    },
    createOrgListParams(data) {
      const sortArray = function(item1, item2) {
        return item1.level - item2.level
      }
      const paramsArray = []
      const insureCompanyChannelId = this.bindingId
      Object.keys(data).forEach(key => {
        const list = data[key].sort(sortArray)
        const insertItem = { insureCompanyChannelId }
        list.forEach((item, index) => {
          insertItem[`company${index}`] = item.id
        })
        paramsArray.push(insertItem)
      })
      return paramsArray
    },
    // 所选的子key
    getChildNodeKeys() {
      const nodes = this.$refs.tree.getCheckedNodes()
      const res = []
      nodes.forEach(item => {
        if (item.children && item.children.length) return
        res.push(item.key)
      })
      return res
    },
    // 处理树选择Key
    normalizer(node) {
      if (node.children && node.children.length === 0) {
        delete node.children
      }
      return {
        id: node.key,
        label: node.title,
        children: node.children
      }
    }
  }
}
</script>

<style lang="scss">
.el-table .warning-row {
  color: #f14535;
}

.el-table .close-row {
  color: #c0c0c0;
}
.number-form {
  .el-form-item__content {
    max-width: 286px;
  }
  .el-select,
  .el-cascader {
    width: 100%;
  }
}
</style>

