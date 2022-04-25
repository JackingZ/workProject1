<template>
  <!-- eslint-disable -->
  <div class="app-container sales-manager personer-tab">
    <div class="app-panel left-pane">
      <div class="tree-wrap organ-tree"
        :class="showLeftMenu ? '' : 'hide'"
        >
        <div class="tree-title">
          <p>机构列表</p>
          <div class="showtype">
            <el-select v-model="selectTreeType" placeholder="请选择" size="small" style="width:130px;" @change="handleSelectType">
              <el-option label="查看全部下级" value="1"></el-option>
              <el-option label="仅看当前机构" value="2"></el-option>
            </el-select>
          </div>
        </div>
        <el-tree :data="currentTableList" :props="defaultProps"
          :expand-on-click-node="false"
          :highlight-current="true"
          @node-click="handleNodeClick"></el-tree>
      </div>
      <div class="arrow-wrap">
        <img @click="showLeftMenu = !showLeftMenu"
          :src="showLeftMenu? expandIcon.left : expandIcon.right"/>
      </div>
    </div>
    <div v-loading="isRquestOrgList"
      class="app-panel personer-manage right-pane">
      <!-- <el-row>
        <el-col :span="24">
          <div class="sub-header">人员管理</div>
        </el-col>
      </el-row> -->
       <head-info
        title="人员管理"
        info="" />
      <el-row type="flex" align="middle" style="min-width: 430px;margin: 20px 0;">
        <el-col :span="4">
          <el-button v-permission="permissionList.personSalesADefault"
            style="font-size: 14px;" type="text" size="small" @click="addData">
            <i class="el-icon-circle-plus-outline" />&nbsp;新增账号
          </el-button>
        </el-col>
        <el-col :span="20">
          <div style="text-align:right;">
            <el-select v-if="isAnyAdminChannel"
              v-model="selectChannel" clearable filterable placeholder="所属渠道"
              size="small" style="width:140px;" @change="onChannelChange">
              <el-option v-for="item in channelList" :key="item.code" :label="item.shortName" :value="item.code" />
            </el-select>
            <el-select v-if="isAnyAdminChannel"
              v-model="salesType" clearable filterable placeholder="账号类型" size="small" style="width:120px;">
              <el-option v-for="item in salesTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="enableValue" clearable filterable placeholder="启用状态" size="small" style="width:100px;">
              <el-option v-for="item in enableOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-input class="personal-selected" v-model="searchTypeContent" placeholder="请输入内容" size="small" style="width:300px;">
              <el-select slot="prepend" v-model="selectSearchType">
                <el-option v-for="item in searchTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-input>
            <el-button v-permission="permissionList.personSalesSDefault" type="primary" icon="el-icon-search" size="small" @click="startQuery(true)" :loading="isLoading">查询</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row
        class="table-permission-tabs"
        type="flex" justify="space-between" style="height:56px;line-height:56px;background-color:#f5f7fa;padding-left:10px;font-size:14px;color:#666;">
        <el-col style="width:80px;">
          <span>角色组：</span>
        </el-col>
        <el-col>
          <span v-if="!selectChannel">请先选择渠道</span>
          <el-tabs v-else @tab-click="selectRole">
            <el-tab-pane :label="totalCounts" name="all" />
            <el-tab-pane v-for="item in rolesList" :label="item.nameWithCount" :name="item.id" :key="item.id" />
          </el-tabs>
        </el-col>
        <el-col :span="1" class="role-setting">
          <i v-permission="permissionList.roleManager" class="el-icon-setting" @click="goToRole" />
        </el-col>
      </el-row>
      <div class="table-personal-data">
        <el-table :data="tableData" border style="width: 100%"
          ref="tableList"
          @sort-change="tableOrderChange"
          v-loading="isLoading"
          :height="tableHeight"
          :default-sort="defaultOrder">
          <el-table-column v-if="isAnyAdminChannel"
            label="所属渠道" :resizable="false" min-width="110">
            <template slot-scope="scope">
              {{getChannelNameByCode(scope.row.channelCode)}}
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="登录账号" :resizable="false" min-width="150"/>
          <el-table-column prop="idName" label="姓名" :resizable="false" min-width="110"/>
          <!-- <el-table-column v-if="isCarDealerChannel"
            label="微信绑定" :resizable="false" min-width="110">
            <template slot-scope="scope">
              <img v-if="scope.row.weixinOpenId" src="@/assets/imgs/weixin_enable.png" class="weixin_icon">
              <img v-else src="@/assets/imgs/weixin_disable.png" class="weixin_icon">
            </template>
          </el-table-column> -->
          <el-table-column label="角色组" :resizable="false" min-width="110">
            <template slot-scope="scope">
              {{scope.row.roles && scope.row.roles[0] ? scope.row.roles[0].name : ''}}
              {{scope.row.roles && scope.row.roles.length > 1 ? '...' : ''}}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="agentCode" label="业务员编号" :resizable="false" min-width="120"/> -->
          <el-table-column label="所属机构" :resizable="false" min-width="200">
            <template slot-scope="scope">
              {{scope.row.belongCompanys | teamCompany}}
            </template>
          </el-table-column>
          <el-table-column prop="time" sortable="custom" label="添加时间" :resizable="false" min-width="160">
            <template slot-scope="scope">
              {{scope.row.createTime | formatTime}}
            </template>
          </el-table-column>
          <el-table-column label="启用状态" :resizable="false" min-width="80">
            <template slot-scope="scope">
              <!-- <el-switch :value="scope.row.status" @input="switchChange({value: $event, item: scope.row})"
                :active-value="0" :inactive-value="1"/> -->
                {{scope.row.status === 0 ? '正常' : (scope.row.status === 1 ? '已禁用' : '待审核' )}}
            </template>
          </el-table-column>
          <el-table-column label="操作" :resizable="false" :width="checkPermissions(permissionList.salesMockLogin) && isAnyAdminChannel ? 250 : 200" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="isAnyAdminChannel" v-permission="permissionList.salesMockLogin"
                type="text" size="medium" @click="showMockLogin(scope.row)">模拟登录
              </el-button>
              <el-button v-permission="permissionList.personSalesUReset"
                type="text" size="medium" @click="resetpwd(scope.row)">重置密码</el-button>
              <el-button v-permission="permissionList.personSalesUEdit"
                type="text" size="medium" @click="editData(scope.row)">编辑</el-button>
              <el-button v-permission="permissionList.personSalesDDefault"
                type="text" size="medium" @click="deleteData(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="totalCount > 0"
        class="el-pagination-wrap">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <app-drawer v-loading="isRequest"
      :is-show="isShow"
      :drawer-title="title"
      :mask-closable="false"
      @drawerClose="close"
      @drawerConfirm="confirm"
      drawer-style="width: 500px;"
      >
      <div v-if="isEdit" slot="afterTitle" class="head-btn" style="left: 120px;">
        <my-switch v-permission="permissionList.personSalesUDisable"
          :value="currentEditStatus"
          @input="onEditStatusChange"
          :active-value="0"
          :inactive-value="1"/>
      </div>
      <add-personnel
        v-if="isShow"
        v-loading="isRequest"
        ref="addPane"
        :areaList="areaList"
        :isShow="isShow"
        :sexConfig="sexConfig"
        :channelList="channelData"
        :isEdit="isEdit"/>
    </app-drawer>
    <el-dialog
      :title="`模拟登录 - 【${mockLoginInfo.channelName}-${mockLoginInfo.phone}】`"
      :visible.sync="mockLoginInfo.showModal"
      :close-on-click-modal="false"
      width="500px"
      >
      <div v-loading="mockLoginInfo.loading"
        class="mock-login_wrap">
        <div class="mock-login_item mock-login_pointer" @click="mockPCLogin">
          <qrcode :value="mockLoginInfo.qrcodeLink" :options="{ width: 161 }"></qrcode>
          <div>扫码/点击登录车险前端</div>
        </div>
        <div class="mock-login_item mock-login_pointer" @click="mockAdminLogin">
          <img src="@/assets/imgs/mock_computer.png"/>
          <div>点击模拟登录管理后台</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">模拟登录期间进行的所有增删改操作，都是实时有效的，请谨慎操作！</span>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import AddPersonnel from '@/views/organize/addPersonnel'
import AppDrawer from '@/components/Drawer/drawer'
import MyTreeSelect from '@/components/MyTreeSelect/index'
import { Message } from 'element-ui'
import { getAllChannelData } from '@/api/number'
import { getCompanyEffective } from '@/api/ledger'
import { roleChannelCode } from '@/api/system'
import { userRoleCount, userLinked, userInsertLinked } from '@/api/system'
import { queryByType, queryAreaList, querySalesList,
  userCompanyLinked, updateUserInfo, deleteUserInfo, resetUserPwd, userLoginDisable,
  userLoginRecovery, queryOrgInfo, getTokenByUserId } from '@/api/organization'
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
import { initBrowserUtil, openNewProcessUrl, openNewProcessUrlWithConfig } from '@/views/insurance/service/browserUtil'
import applicationStorageService from '@/views/insurance/service/application-storage.service'
import moment from 'moment'
const getMaxLevelOrg = (list) => {
  if (!list) return
  let item = list.reduce((item1, item2) => {
    return item1.level > item2.level  ? item1 : item2
  })
  return item
}
export default {
  components: {
    AddPersonnel,
    AppDrawer,
    MyTreeSelect
  },
  filters: {
    formatTime (val) {
      if (!val) return
       return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
    },
    teamCompany (val) {
      let item = getMaxLevelOrg(val)
      return item && item.name
    }
  },
  data() {
    return {
      selectTreeType:"1",
      defaultOrder: {
        prop: 'time',
        order: 'descending'
      },
      currentEditStatus: '',
      maxTreeHeight: 0,
      resizeCallback: null,
      showLeftMenu: false,
      isLoading: false,
      isRequest: false,
      isEdit: false,
      totalCount: 0,
      pageSize: 20,
      currentPage: 1,
      timeOrder: 'descending', // 默认降序
      orgList: [],
      searchTypeContent: '',
      selectSearchType: 'userName',
      searchTypeOptions: [
        {
          value: 'userName',
          label: '登录帐号'
        },
        {
          value: 'phone',
          label: '绑定手机'
        },
        {
          value: 'idName',
          label: '人员姓名'
        },
        {
          value: 'agentCode',
          label: '人员编号'
        }
      ],
      enableValue: '',
      enableOptions: [
        {
          value: 0,
          label: '已启用'
        },
        {
          value: 1,
          label: '已禁用'
        },
        {
          value: 2,
          label: '待审核'
        }
      ],
      salesType: '',
      salesTypeOptions: [
        {
          value: '1',
          label: '个人代理'
        },
        {
          value: '2',
          label: '渠道合作'
        }
      ],
      tableData: [],
      isShow: false,
      title: '新增账号',
      sexConfig: [],
      currentEditUserInfo: null, // 当前编辑的业务员信息
      areaList: [],
      channelList: [], // 渠道列表
      channelData: [],
      selectChannel: '',
      selectChannelName: '',
      lastSelectChannel: '',
      expandIcon: {
        left: require('@/assets/imgs/expand_select-left.png'),
        right: require('@/assets/imgs/expand_select-right.png')
      },
      currentTableList: [],
      selectCompanyId: '',
      tableHeight: 200,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      mockLoginInfo: {
        token: '',
        loading: false,
        channelName: '',
        phone: '',
        id: '',
        qrcodeLink: '',
        showModal: false
      },
      totalCounts: '',
      rolesList: [], // 角色列表
      isCarDealerChannel: false, // 是否车商渠道
      selectRoleId: ''
    }
  },
  activated() {
    if (this.isAnyAdminChannel) {
      getAllChannelData().then(res => {
        const arr = res.data
        this.channelList = arr
        if (!this.isRootAdminChannel) {
          this.channelData = JSON.parse(JSON.stringify(arr))
          this.channelData.forEach((item, index) => {
            if (item.code === 'yuebao-001') {
              this.channelData[index].disabled = true
            }
            if (item.code === 'yuebao-002') {
              this.channelData[index].disabled = true
            }
            if (item.code === 'yuebao-003') {
              this.channelData[index].disabled = true
            }
          })
        } else {
          this.channelData = arr
        }
      })
    }
  },
  created () {
    this.isRquestOrgList = true
    Promise.all([
      getCompanyEffective().then(data => {
        if (data && data.status === 200) {
          this.orgList = data.data
        }
      }),
      getAllChannelData().then(res => {
        const arr = res.data
        if (this.isAnyAdminChannel) {
          this.channelList = arr
          if (!this.isRootAdminChannel) {
            this.channelData = JSON.parse(JSON.stringify(arr))
            this.channelData.forEach((item, index) => {
              if (item.code === 'yuebao-001') {
                this.channelData[index].disabled = true
              }
              if (item.code === 'yuebao-002') {
                this.channelData[index].disabled = true
              }
              if (item.code === 'yuebao-003') {
                this.channelData[index].disabled = true
              }
            })
          } else {
            this.channelData = arr
          }
          if (this.channelList && this.channelList.length > 0) this.selectChannel = this.channelList[0].code
        } else {
          this.selectChannel = this.$store.getters.userAll.data.channelCode
        }
        this.getRoleInfo(this.selectChannel)
      })
    ])
    .then(res => {
      this.searchCurrentTableList()
      this.showLeftMenu = true
      this.isRquestOrgList = false
      this.startQuery()
    })
    .catch(e => {
      console.log('this', this)
      this.isRquestOrgList = false
      console.error('error', e)
    })
    // 查询性别字典
    queryByType('00009').then(data => {
      if (data && data.status === 200) {
        this.sexConfig = data.data.map(item => {
          return {
            key: item.code,
            name: item.value1
          }
        })
      }
    })
    queryAreaList().then(data => {
      if (data && data.status === 200) {
        this.areaList = data.data
      }
    })
    // 动态监听 修改table高度
    this.resizeCallback = () => {
      // console.log('resizeCallback')
      this.setTableHeight()
    }
    this.setTableHeight()
    window.addEventListener('resize', this.resizeCallback)
    initBrowserUtil()
    this.checkCarDealerChannel()
  },
  deactivated () {
  },
  mounted () {
  },
  beforeDestroy () {
    if (this.resizeCallback) window.removeEventListener('resize', this.resizeCallback)
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel', // 判断登陆用户是否是管理员渠道
      'isRootAdminChannel' // 判断登录用户是否是超级管理员渠道
    ])
  },
  methods: {
    // 检测非运维渠道帐号是否车商渠道
    checkCarDealerChannel () {
      if (!this.isAnyAdminChannel) {
        const carDealer = this.$store.getters.userAll.data.carDealer
        const isCarDealer = carDealer === 0 // 是否车商渠道帐号
        this.isCarDealerChannel = isCarDealer
      }
    },
    goToRole () {
      this.$router.push('/system/permissionRoles')
    },
    selectRole (val) {
      if (val.name === 'all') {
        this.selectRoleId = ''
      } else {
        this.selectRoleId = val.name
      }
      this.queryChannelList(this.currentPage, this.pageSize)
    },
    setTableHeight () {
      this.tableHeight = window.innerHeight - 410
      setTimeout(() => {
        this.$refs.tableList.$forceUpdate()
      })
    },
    searchCurrentTableList () {
      this.lastSelectChannel = this.selectChannel
      function searchItem (item, val) {
        if (item.channelCode === val) return item
        else if (item.children && item.children.length > 0) {
          for (let child of item.children) {
            let res = searchItem(child, val)
            if (res) return res
          }
        }
        return null
      }

      function searchList (list, val, callback) {
        for (let item of list) {
          const res = searchItem(item, val)
          if (res) callback && callback(res)
        }
      }
      const list = []
      searchList(this.orgList, this.selectChannel, (item) => {
        list.push(item)
      })
      this.currentTableList = this.copyData(list)
    },
    copyData(obj) {
      return JSON.parse(JSON.stringify(obj || {}))
    },
    resetpwd(row) {
      this.$confirm('确定要重置该账号的登录密码吗？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: action => {
          if (action === 'confirm') {
            this.resetPwdReq(row.id)
          }
        }
      })
    },
    resetPwdReq (id) {
      resetUserPwd({
        id,
        sendMessage: false
      }).then(res => {
        if (res && res.status == 200) {
          this.$alert(
          `密码重置成功！新密码：${res.data}`,
          '温馨提示',
          {
            confirmButtonText: '确定',
            type: 'success'
          })
        } else this.showMessage(res.msg, 'error')
      })
    },
    addData() {
      this.title = '新增账号'
      this.isShow = true
      this.isEdit = false
    },
    editData(row) {
      this.isShow = true
      this.title = '编辑账号'
      this.isEdit = true
      this.isRequest = true
      this.currentEditUserInfo = row
      this.currentEditStatus = row.status
      userCompanyLinked(row.id).then(res => {
        this.isRequest = false
        if (res && res.status === 200) {
          let info = res.data
          const team = this.getTeamInfo(info.belongCompanys)
          console.log('类型',info.effectiveDataType)
          let validDateArr = []
          let validDateType = 1
          if(info.effectiveDataType == 2){
                validDateArr[0] = info.startDate
                validDateArr[1] = info.expireDate
                validDateType = 4
          }
          let data = {
            team,
            userName: info.userName,
            idName: info.idName,
            phone: info.phone,
            validDateType: validDateType, //有效时间类型
            validDate:validDateArr,  // 有效时间
            salesType: info.salesType,
            channel: info.channelCode,
            status: info.status,
            agentCode: info.agentCode,
            email: info.email,
            idNum: info.idNo,
            saleNo: info.saleNo,
            encode: info.enNo,
            relatedChannel: [],
            bank: info.bank,
            card: info.bankNo,
            callAccount: info.callAccount,
            callPassword: info.callPassword,
            other: info.description,
            sbtAppName: info.sbtAppName,
            sbtAppIdNo: info.sbtAppIdNo,
            sbtPassword: info.sbtPassword,
            defaultManagerCompany: info.defaultManagerCompany
          }
          // 管辖机构
          if (info.managerCompanys && info.managerCompanys.length > 0) {
            const extra = info.managerCompanys.map(item => {
              return {
                 companyId: item.id,
                 linkType: '2'
              }
            })
            data.userRelateCompanys = [{
              companyId: team.key,
              linkType: '1'
            }, ...extra]
          } else {
            data.userRelateCompanys = [{
              companyId: team.key,
              linkType: '1'
            }]
          }

          if (info.roles) {
            // 车商渠道角色单选 其他多选
            if (this.isCarDealerChannel) {
              data.roles = info.roles.length > 0 ? info.roles[0].id : ''
              data.rolesList = []
            } else {
              data.rolesList = info.roles.map(item => item.id)
              data.roles = ''
            }
          }
          const salesChannels = info.salesChannels || []
          queryOrgInfo(team.key).then(res2 => {
            const orgData = res2.data
            this.$refs.addPane.setAreaInfo({
              city: orgData.city,
              province: orgData.province
            })
          })
          // 有效时间
          this.$refs.addPane.setData({
            data,
            channelCode: row.channelCode,
            userId: row.id,
            channelType: info.channelType,
            salesChannels
          })
        }
      }).catch(e => {
        console.error(e)
        this.isRequest = false
      })
    },
    getTeamInfo (belongCompanys) {
      let item = getMaxLevelOrg(belongCompanys)
      // console.log('item', item)
      if (item) return {
        key: item.id,
        title: item.name
      }
      return null
    },
    deleteData(row) {
      this.$confirm(
        '删除账号，会导致用户无法登录管理后台，仍继续删除吗？？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: action => {
            if (action === 'confirm') {
              this.deleteUserInfoReq(row)
            }
          }
        }
      )
    },
    deleteUserInfoReq (row) {
      let id = row.id
      deleteUserInfo(id).then(res => {
        if (res && res.status == 200) {
          let index = this.tableData.findIndex(item => {
            return item.id === row.id
          })
          this.tableData.splice(index, 1)
          this.startQuery()
        } else this.showMessage(res.msg, 'error')
      })
    },
    close() {
      this.isShow = false
      this.$refs.addPane.reset()
    },
    confirm() {
      this.$refs.addPane.submit((data) => {
        console.log('confirm', data)
        let currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
        let validDate1 = moment().add(60,'days').format('YYYY-MM-DD HH:mm:ss')
        console.log(validDate1)
        let validDate2 = moment().add(30,'days').format('YYYY-MM-DD HH:mm:ss')
        console.log(validDate2)
        let validDateType,startDate,expireDate
        switch(data.validDateType){
          case 1:  //永久
            validDateType = 1
            startDate = ''
            expireDate = ''
            break
          case 2:  // 60天
            validDateType = 2
            startDate = currentTime
            expireDate = validDate1
            break
          case 3: // 30天
            validDateType = 2
            startDate = currentTime
            expireDate = validDate2
            break
          case 4: // 自定义时间
            validDateType = 2
            startDate = data.validDate[0]
            expireDate = data.validDate[1].replace('00:00:00','23:59:59')
            break
          default: // 默认是永久
            validDateType = 1
            validDate = ''
        }
        let params = {
          roles: [],
          userRelateRoles: [],
          permissions: [],
          roleRelatePermissions: [],
          companies: [],
          userRelateCompanys: data.userRelateCompanys,
          salesType: data.salesType,
          belongCompanys: [],
          // managerCompanys: [],
          channelCode: data.channelCode,
          idName: data.idName, // 姓名
          userName: data.userName, // 登录账号
          phone: data.phone, // 手机账号
          effectiveDataType:validDateType,  //有效时间类型
          agentCode: data.agentCode, // 人员编码
          email: data.email, // 邮箱
          idNo: data.idNum, // 身份证号
          status: data.status, // 启用禁用
          bank: data.bank, // 开户行
          bankNo: data.card, // 银行卡号
          callAccount: data.callAccount,
          callPassword: data.callPassword,
          description: data.other, // 其他信息
          saleNo: data.saleNo, // 执业证号
          enNo: data.encode, // 设备号
          defaultManagerCompany: data.defaultManagerCompany,
          sbtAppName: data.sbtAppName || '', // 深保通姓名
          sbtAppIdNo: data.sbtAppIdNo || '', // 深保通账号
          sbtPassword: data.sbtPassword || '' // 深保通密码
        }
        if(validDateType == 2){
           params.startDate = startDate
           params.expireDate = expireDate
        }
        console.log('参数',params)
        let salesChannels
        if (data.relatedChannel) {
          salesChannels = []
          data.relatedChannel.forEach(item => {
            salesChannels.push({
              channelCode: item
            })
          })
        }
        if (salesChannels) params.salesChannels = salesChannels
        // 分配角色 车商渠道角色单选 其他多选
        if (data.roles && this.isCarDealerChannel) {
          params.userRelateRoles = [
            { roleId:data.roles }
          ]
        } else if (data.rolesList && data.rolesList.length > 0) {
          params.userRelateRoles = data.rolesList.map(item => ({ roleId: item }))
        }
        if (this.isEdit) {
          if (this.currentEditStatus === 1) {
            userLoginDisable(this.currentEditUserInfo.id)
          } else {
            userLoginRecovery(this.currentEditUserInfo.id)
          }
          this.updateUserInfoReq(params)
        } else this.addUserInfoReq(params)
      })
    },
    addUserInfoReq (params) {
      this.isRequest = true
      userInsertLinked(params).then(res => {
        this.isRequest = false
        if (res && res.status === 200) {
          this.$alert('账号初始密码为手机号后8位数字，请尽快登录完成修改!', '添加账号成功', {
            confirmButtonText: '确定',
            type: 'success',
            callback: action => {
              this.close()
              this.startQuery() // 刷新当前列表
            }
          })
        } else this.showMessage(res.msg, 'error')
      }).catch(e => this.isRequest = false)
    },
    updateUserInfoReq (params) {
      this.isRequest = true
      params.id = this.currentEditUserInfo.id
      // delete params.phone
      // 用户名无法编辑
      delete params.userName
      updateUserInfo(params).then(res => {
        this.isRequest = false
        if (res && res.status === 200) {
          this.showMessage('账号信息修改成功')
          this.close()
          this.$refs.addPane.reset()
          this.startQuery() // 刷新当前列表
        } else this.showMessage(res.msg, 'error')
      }).catch(e => this.isRequest = false)
    },
    resetOrder () {
      this.timeOrder = 'descending'
      this.defaultOrder = {
        prop: 'time',
        order: this.timeOrder
      }
      this.$refs.tableList.sort('time', this.timeOrder)
    },
    startQuery (reset) {
      if (reset) {
        this.resetOrder()
      }
      this.currentPage = 1
      if (this.lastSelectChannel !== this.selectChannel) this.searchCurrentTableList()
      this.searchChannelName()
      this.queryChannelList(this.currentPage, this.pageSize)
      if (this.selectChannel) this.getRoleInfo(this.selectChannel)
    },
    searchChannelName () {
      let item = this.channelList.find(item => item.code === this.selectChannel)
      if (item) this.selectChannelName = item.shortName
    },
    handleSelectType(){
      if(this.selectCompanyId.length === 0 ){
        return
      }
      this.startQuery() // 刷新当前列表
    },
    queryChannelList (page, size) {
      console.log('this.isLoading', this.isLoading)
      if (this.isLoading) return
      // let model = {
      //   agentCode: null,
      //   createTime: this.timeOrder === 'descending' ? 1 : 0, // 0升序 1降序
      //   idName: null,
      //   salesType: '2', // 业务员分类 1为个人业务员 2为渠道业务员
      //   userTypes: ['3'] // 用户类型  1-管理员 2- 用户 3-业务员
      // }
      let model = {
        createTime: this.timeOrder === 'descending' ? 1 : 0, // 0升序 1降序
        channelCode: this.selectChannel,
        salesType: this.salesType ? [this.salesType]: [],
        companyFilterType: this.selectTreeType
      }
      if (this.selectRoleId) model.roleId = this.selectRoleId
      // 机构没选 默认取全部那个
      if (this.selectCompanyId) model.companyIds = [this.selectCompanyId]
      if (this.enableValue >= 0) model.status = this.enableValue
      if (this.searchTypeContent) model[this.selectSearchType] = this.searchTypeContent
      let params = {
        model,
        page,
        size
      }
      // console.log('params', params)
      this.isLoading = true
      userLinked(params).then(data => {
        this.isLoading = false
        if (data && data.status === 200) {
          if (data.data.count) this.totalCount = data.data.count
          else this.totalCount = data.data.length
          let result = data.data
          this.tableData = result.model
        }
      }).catch(e => {
        this.isLoading = false
      })
    },
    // 时间排序
    tableOrderChange ({ column, prop, order }) {
      // 数据未初始化禁止调用
      if (!this.tableData || this.tableData.length ===0) return
      // 排序相同则不请求
      if (this.timeOrder === order) return
      this.timeOrder = order
      this.defaultOrder = {
        prop: 'time',
        order: this.timeOrder
      }
      this.queryChannelList(this.currentPage, this.pageSize)
    },
    handleSizeChange(val) {
      console.log(`handleSizeChange 每页 ${val} 条`)
      this.pageSize = val
      this.queryChannelList(this.currentPage, this.pageSize)
    },
    handleCurrentChange(val) {
      console.log(`handleCurrentChange 当前页: ${val}`)
      this.currentPage = val
      this.queryChannelList(this.currentPage, this.pageSize)
    },
    showMessage (msg, type) {
      Message({
        message: msg,
        type: type || 'success',
        duration: 2 * 1000
      })
    },
    switchChange ({value, item}) {
      if (value === 1) this.disableUser(item, value)
      else this.enableUser(item, value)
    },
    // 禁用用户
    disableUser (item, value) {
      this.currentEditStatus = value
      this.$refs.addPane.changeStatus(value)
      this.$alert('禁用操作完成！继续点击“确定”按钮保存后生效', '温馨提示', {
        confirmButtonText: '我知道了',
        type: 'success',
        callback: action => {
        }
      })
      // this.$confirm('禁用会导致该业务员账号无法登录手机H5页面, 仍要继续禁用吗？', '温馨提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning',
      //   callback: action => {
      //     if (action === 'confirm') {
      //       this.$refs.addPane.changeStatus(value)
      //       this.currentEditStatus = value
            // userLoginDisable(item.id).then(data => {
            //   if (data && data.status === 200) {
            //     item.status = value
            //   }
            // })
      //     }
      //   }
      // })
    },
    // 启用用户
    enableUser (item, value) {
      this.$refs.addPane.changeStatus(value)
      this.currentEditStatus = value
      this.$alert('启用操作完成！继续点击“确定”按钮保存后生效', '温馨提示', {
        confirmButtonText: '我知道了',
        type: 'success',
        callback: action => {
        }
      })
      // userLoginRecovery(item.id).then(data => {
      //   if (data && data.status === 200) {
      //     item.status = value
      //     this.$alert('业务员账号状态已启用！请确认该业务员账号信息完整性', '温馨提示', {
      //       confirmButtonText: '确定',
      //       type: 'success',
      //       callback: action => {
      //       }
      //     })
      //   }
      // })
    },
    onEditStatusChange (val) {
      this.switchChange({
        value: val,
        item: this.currentEditUserInfo
      })
    },
    handleNodeClick (object, node, treeNode) {
      this.selectCompanyId = object.key
      this.startQuery()
    },
    getRoleInfo (channelCode) {
      const params = {
        channelCode: channelCode,
        companyIds: this.selectCompanyId ? [this.selectCompanyId] : [],
        createTime: null,
        nickName: '',
        orderCase: '',
        roleId: '',
        status: this.enableValue,
        salesType: this.salesType ? [this.salesType]: [],
        userName: '',
        companyFilterType:this.selectTreeType
      }
      if (this.searchTypeContent) params[this.selectSearchType] = this.searchTypeContent
      Promise.all([
          userRoleCount(params).then(res => {
            const data = res.data
            this.totalCounts = '全部' + '(' + data.total + ')'
            return data.userRoleCounts
          }),
          roleChannelCode(channelCode).then(res => {
            return res.data
          })
        ]).then(res => {
          console.log('res', res)
          const countList = res[0]
          const roleList = res[1].map(item => {
            const searchItem = countList.find(countItem => countItem.roleId === item.id)
            if (searchItem) item.nameWithCount = `${item.name}(${searchItem.count})`
            else item.nameWithCount = `${item.name}(0)`
            return item
          })
          this.rolesList = roleList
        })
    },
    onChannelChange () {
      // 是否车商渠道
      const isCarDealer = () => {
        if (!this.selectChannel) {
          this.isCarDealerChannel = false
          this.selectRoleId = ''
        }
        const res = this.channelList.find(item => item.code === this.selectChannel)
        if (res) {
          this.isCarDealerChannel = res.carDealer === 0 // 是否车商渠道
        }
      }
      isCarDealer()
      this.selectCompanyId = ''
      this.selectRoleId = ''
      if (this.lastSelectChannel !== this.selectChannel) {
        this.searchCurrentTableList()
        // this.startQuery()
      }
    },
    getChannelNameByCode (code) {
      const item = this.channelList.find(item => item.code === code)
      if (item) return item.shortName
      return ''
    },
    showMockLogin (item) {
      if (item.status !== 0) {
        Message({
          message: '该账号已禁用，无法进行模拟登录',
          type: 'error',
          duration: 3 * 1000
        })
        return
      }
      let mockLoginInfo = this.mockLoginInfo
      mockLoginInfo.showModal = true
      mockLoginInfo.id = item.id
      mockLoginInfo.channelName = item.channelName
      mockLoginInfo.phone = item.phone
      mockLoginInfo.qrcodeLink = ' '
      mockLoginInfo.loading = true
      getTokenByUserId(item.id).then(res => {
        mockLoginInfo.loading = false
        if (res && res.access_token) {
          const operatorId = this.$store.getters.userAll.data.id
          let baseUrl = ''
          let params = `?s=${item.channelCode}&token=${res.access_token}&operatorId=${operatorId}`
          mockLoginInfo.token = res.access_token
          switch (process.env.BUILD_VER) {
            case 'prod':
              baseUrl = 'https://ybinsure.com/spa/newCar/mockLogin'
              break
            case 'test':
              baseUrl = 'https://ybinsure.com/spa/newCarTest/mockLogin'
              break
            case 'test2':
              baseUrl = 'https://ybinsure.com/spa/newCarTest2/mockLogin'
              break
          }
          mockLoginInfo.qrcodeLink = baseUrl + params
        } else if (res.status && res.status === 500) {
          mockLoginInfo.showModal = false
          Message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
        }
      }).catch(e => {
        mockLoginInfo.loading = false
        mockLoginInfo.showModal = false
        Message({
          message: '该账号异常，无法进行模拟登录',
          type: 'error',
          duration: 3 * 1000
        })
      })
    },
    // h5登录
    mockPCLogin () {
      window.site_title = '移动出单'
      let height = window.screen.height ? window.screen.height * 0.85 : 700
        height = height > 736 ? 736 : height
      console.log('this.mockLoginInfo.qrcodeLink', this.mockLoginInfo.qrcodeLink)
      openNewProcessUrlWithConfig(this.mockLoginInfo.qrcodeLink, `height=${height}, width=414`)
      // openNewProcessUrl(this.mockLoginInfo.qrcodeLink)
      setTimeout(() => {
        window.site_title = void 0
      }, 500)
    },
    // 后台登录
    mockAdminLogin () {
      if (!applicationStorageService.isApplication()) {
        this.$alert(
        `只允许在悦保浏览器打开`,
        '温馨提示',
        {
          confirmButtonText: '确定',
          type: 'warn'
        })
        return
      }
      const token_type = 'bearer'
      const access_token = this.mockLoginInfo.token
      window.site_title = '悦保科技'
      switch (process.env.BUILD_VER) {
        case 'prod':
          console.log(`https://www.ybinsure.com/spa/carManager/mocklogin?token=${access_token}&type=${token_type}`)
          openNewProcessUrl(`https://www.ybinsure.com/spa/carManager/mocklogin?token=${access_token}&type=${token_type}`)
          break
        case 'test':
          console.log(`http:localhost:8088/spa/carManagerTest/mocklogin?token=${access_token}&type=${token_type}`)
          openNewProcessUrl(`https://www.ybinsure.com/spa/carManagerTest/mocklogin?token=${access_token}&type=${token_type}`)
          // openNewProcessUrl(`//localhost:8088/spa/carManagerTest/mocklogin?token=${access_token}&type=${token_type}`)
          break
        case 'test2':
          console.log(`https://www.ybinsure.com/spa/carManagerTest2/mocklogin?token=${access_token}&type=${token_type}`)
          openNewProcessUrl(`https://www.ybinsure.com/spa/carManagerTest2/mocklogin?token=${access_token}&type=${token_type}`)
          // openNewProcessUrl(`http://localhost:8088/spa/carManagerTest/mocklogin?token=${access_token}&type=${token_type}`)
          break
      }
      setTimeout(() => {
        window.site_title = void 0
      }, 500)
    }
  }
}
</script>

<style lang="scss">
.personer-tab{
    .app-panel{
    overflow: initial;
    .tree-title{
      margin-left:10px;
      margin-bottom:10px;
      height:41px;
      line-height:41px;
      border-bottom:1px solid #e6e6e6;
      display:flex;
      justify-content:space-around;
      align-items: center;
      .slide-active{
        width:320px;
        min-width: 240px;
     }
      p {
        flex:1;
        font-size: 16px;
        color:#909399;
      }
      .showtype{
         flex:1;
      }
      .el-input--small .el-input__inner{
        height:28px;
      }
    }
  }
  .personer-manage{
    padding: 0 20px 20px 20px;
  }
}

  .tree-wrap.organ-tree {
    // padding: 10px 10px 10px 0 !important;
  }
  .table-personal-header {
    .personal-select_company,
    .personal-select_organ,
    .personal-selected,
    .personal-input,
    .btn-search-personal {
      display: inline-block;
      vertical-align: top;
      margin-right: 10px;
      margin-bottom: 10px;
    }

    .btn-add-personal {
      float: right;
      vertical-align: top;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
  // .table-personal-data {
  //   // margin-top: 20px;
  // }
  .sales-manager{
    padding: 15px 15px 15px 0;
    .weixin_icon{
      width: 23px;
      height: 23px;
      margin-top: 4px;
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
    .divider{
      margin: 0 3px;
      display: inline-block;
      height: .9em;
      width: 1px;
      vertical-align: middle;
      position: relative;
      top: -.06em;
      background: #ccc;
    }
    .right-pane{
      flex: 1;
      overflow: auto;
      // overflow-y:hidden;
      height: calc(100vh - 114px);
      // .el-table__body-wrapper{
      //   height: calc(100vh - 340px);
      //   overflow: auto;
      // }
      .el-table th {
        background: #fafafa;
      }
      .sub-header{
        border-bottom:1px solid #eee;
        line-height:30px;
        color:#909399;
        margin-bottom: 20px;
      }

      .el-table td, .el-table th{
        // padding: 3px 0;
        padding: 0;
        height: 40px;
        line-height: 40px;
      }
    }
    .tree-wrap{
      width: 260px;
      padding: 10px;
      // padding-top: 25px;
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
    display: flex;
    .select-wrap{
      margin-right: 10px;
    }
    .personal-selected {
      .el-input-group__prepend {
        background-color: #f5f7fa;
        width: 120px;
        .el-input__inner{
          width: 120px;
        }
      }

      // .el-input__inner{
      //   // max-width: 185px;
      // }
    }
    .el-pagination-wrap{
      position: relative;
      height: 54px;
    }
    .el-pagination{
      position: absolute;
      top: 22px;
      right: 0;
    }
    .el-dialog__title {
      font-size: 16px;
    }
    .el-dialog__header{
      border-bottom: 1px solid #ddd;
      padding: 15px 20px;
    }
    .el-dialog__footer{
      background: #F0F2F5;
      font-size: 12px;
      color: #888;
      padding: 10px;
      text-align: center;
    }
    .mock-login_wrap{
      display: flex;
    }
    .mock-login_item {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      img {
        width: 70%;
      }
    }
    .mock-login_pointer{
      cursor: pointer;
    }
    .table-permission-tabs {
      .el-input-group--prepend {
        max-width: 270px;
        margin-right: 5px;
        .el-input-group__prepend {
          background-color: #fff;
          width: 100px;
        }
      }
      .el-tabs__nav-wrap::after,
      .el-tabs__active-bar {
        height: 0;
      }
      .el-tabs__nav-prev,
      .el-tabs__nav-next {
        line-height: 56px;
      }
      .role-setting {
        cursor: pointer;
        font-size: 18px;
        text-align: center;
        :hover {
          color: #409eff;
        }
      }
    }
  }

</style>
