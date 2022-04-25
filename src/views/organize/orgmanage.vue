<template>
  <!-- eslint-disable -->
  <div class="app-container orgList">
    <div v-loading="loadingData"
      class="app-panel">
      <!-- <div v-permission="[permissionList.companyManagerADefault]">asdasd</div> -->
      <el-row>
        <el-col :span="24">
          <div class="sub-header">机构管理</div>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle">
        <el-col :span="24">
          <el-row type="flex" justify="end">
            <el-select v-if="isAnyAdminChannel"
              v-model="selectChannel" clearable filterable placeholder="所属渠道" size="small" style="width:160px;"
              @change="onChannelChange()">
              <el-option v-for="item in channelList" :key="item.code" :label="item.shortName" :value="item.code" />
            </el-select>
            <el-input
              v-model="searchOrgVal"
              @input="searchOrgChange"
              size="small"
              style="margin-right: 10px;width: 300px;"
              placeholder="机构名称"
              prefix-icon="el-icon-search"/>
            <el-button type="primary" icon="el-icon-search" size="small" @click="queryList">查询</el-button>
          </el-row>
        </el-col>
      </el-row>
      <table class="title-table bottom-border top-off"
        style="background:#FAFAFA; border-top: 1px solid #ebeef5;">
        <tr class="table-header">
          <th style="min-width:180px;padding-left:10px;">机构名称</th>
          <th style="width:100px;">子机构数</th>
          <!-- <th style="width:100px;">机构类型</th> -->
          <th style="width:150px;">所在地区</th>
          <th style="width:100px;">启用/禁用</th>
          <th v-permission="permissionList.companyManagerReorder" style="width:100px;">排序</th>
          <th style="width:220px;">操作</th>
        </tr>
      </table>
      <my-tree v-loading="loadingTable"
        ref="myTree"
        :treeData="currentTableList"
        @output="output($event)">
          <div slot-scope="{item, isExpanded, canExpanded, depth, toggleExpanded, parentItem}"
            v-if="item.visible"
            class="tree-node__content bottom-border">
            <table class="title-table">
              <tr>
                <th class="" :style="{paddingLeft: `${depth * 30 + 5}px`}" style="min-width:150px;">
                  <div>
                    <span v-if="canExpanded" :class="['tree-node__expand-icon', isExpanded ? 'expanded': '']" @click="toggleExpanded"></span>
                    <span v-else :style="{marginLeft: '35px'}"></span>
                    <span>{{item.name}}</span>
                    <span>{{item.isExpanded ? '': ''}}</span>
                  </div>
                </th>
                <th style="width:100px;">{{item.childrenSize}}</th>
                <!-- <th style="width:100px;">{{parseInt(item.companyType) === 1 ? '机构' : '团队'}}</th> -->
                <th style="width:150px;">{{(item.province || '') + (item.city || '')}}</th>
                <th style="width:100px;">
                  <!-- <el-switch v-if="item.level > 0" :value="parseInt(item.status)" @input="switchChange({value: $event, item})"
                    :active-value="0" :inactive-value="1"></el-switch> -->
                    <span v-if="item.level > 0">{{parseInt(item.status) === 0 ? '正常' : '已禁用' }}</span>
                </th>
                <th v-permission="permissionList.companyManagerReorder" style="width:100px;">
                  <div v-if="item.level > 1">
                    <span class="up-arrow arrow" @click="sortOrg(1, item, parentItem)"></span>
                    <span class="down-arrow arrow" @click="sortOrg(2, item, parentItem)"></span>
                  </div>
                </th>
                <th style="width:220px;">
                  <!-- {{item.level}} -->
                  <span v-permission="permissionList.companyManagerADefault">
                    <span v-if="iShowAddBtn(item)" class="opertion"
                      @click="addNewOrg(item)">
                      <a>新增子机构</a>
                    </span>
                  </span>&nbsp;&nbsp;&nbsp;
                  <span v-permission="permissionList.companyManagerUEdit"
                    @click="editOrg(item)">
                    <span v-if="isShowEditBtn(item)" class="opertion">
                      <a>编辑</a>
                    </span>
                  </span>&nbsp;&nbsp;&nbsp;
                  <span v-permission="permissionList.companyManagerDDefault"
                    @click="deleteOrg(item, parentItem)">
                    <span v-if="item.level > 1" class="opertion">
                      <a>删除</a>
                    </span>
                  </span>
                </th>
              </tr>
            </table>
          </div>
      </my-tree>
    </div>
    <app-drawer :requestLoading="modalRequestLoading"
      :is-show="isShowModal" :drawer-title="title"
      :mask-closable="true" @drawerClose="close" @drawerConfirm="confirm"
      drawer-style="width: 500px;">
      <div v-if="isEdit" slot="afterTitle" class="head-btn">
        <my-switch v-permission="permissionList.companyManagerUDisable"
          :value="currentEditStatus"
          @input="onEditStatusChange"
          :active-value="0"
          :inactive-value="1"/>
      </div>
      <add-organ ref="orgInfoPane"
        :isEdit="isEdit"
        :currChannelName="currChannelName"
        :parentId="sbtParentId"
        :isShowModal="isShowModal"
        :disturConfig="disturConfig"
        :orgAreaInfo="areaList"
        :notifyData="parentUserData"
        :channelCode="channelCode"
        :isAnyAdminChannel="isAnyAdminChannel"
        :isCarDealerChannel="isCarDealerChannel"
        />
    </app-drawer>
  </div>
</template>

<script>
/* eslint-disable */
import addOrgan from '@/views/organize/addOrgan'
import AppDrawer from '@/components/Drawer/drawer'
import { getAllChannelData } from '@/api/number'
import { getOrgList, enableOrg, disableOrg, queryOrgInfo, queryOrgConfig, queryByType,
  queryAreaList, queryProvinceList, updateOrg, addOrg, checkOrgUser, deleteOrg, sortOrg, queryParentOrgUser} from '@/api/organization'
import MyTree from '@/components/MyTree/index'
import { Message } from 'element-ui'
import Vue from 'vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    addOrgan,
    AppDrawer,
    MyTree
  },
  data() {
    return {
      test: '',
      loadingData: false,
      loadingTable: false,
      channelList: [], // 渠道列表
      selectChannel: '',
      searchOrgVal: '',
      currentTableList: [],
      isShowModal: false,
      title: '',
      orgList: [],
      isEdit: false,
      disturConfig: [], // 保单配送方式配置,
      areaList: [], // 城市省份列表
      provinceAreaCodeList: [], // 省份区域代码 传参用
      channelCode: '',
      currentEditInfo : {}, // 接口返回的机构信息对象
      currentEditItem: {}, // 编辑的Item
      currentParentItem: {}, // 当前添加子机构的父节点Item
      modalRequestLoading: false,
      currentEditStatus: '',
      isOrgListChange: false,
      currChannelName: '', // 当前渠道简称
      sbtParentId: '', // 深保通父级机构id
      parentUserData: []
    }
  },
  activated() {
    if (this.isAnyAdminChannel) {
      getAllChannelData().then(res => {
        this.channelList = res.data
      })
    }
  },
  created() {
    this.initData()
  },
  activated() {
    if (this.isAnyAdminChannel) {
      getAllChannelData().then(res => {
        this.channelList = res.data
      })
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否管理员渠道
    ]),
    editItemStatus () {
      const pane = this.$refs.orgInfoPane
      if (!pane) return ''
      return pane.ruleForm.enableStatus
    },
    //  是否车商渠道
    isCarDealerChannel () {
      if (this.isAnyAdminChannel) {
        const res = this.channelList.find(item => item.code === this.selectChannel)
        if (res) {
          return res.carDealer === 0
        }
      } else {
        const carDealer = this.$store.getters.userAll.data.carDealer
        const isCarDealer = carDealer === 0 // 是否车商渠道帐号
        return isCarDealer
      }
      return false
    }
  },
  methods: {
    initData () {
      this.loadingData = true
      Promise.all(
        [
          this.getOrgList(),
          getAllChannelData().then(res => {
            this.channelList = res.data
            if (this.isAnyAdminChannel) {
              if (res.data && res.data.length > 0) this.selectChannel = res.data[0].code
            } else {
              this.selectChannel = this.$store.getters.userAll.data.channelCode
            }
            this.searchChannelName()
          })
        ]
      ).then(res => {
        this.queryList()
        this.loadingData = false
      }).catch(e => {
        console.error(e)
        this.loadingData = false
      })
      // 查询保单寄送方式字典
      queryByType('00106').then(data => {
        if (data && data.status === 200) {
          this.disturConfig = []
          for (let item of data.data) {
            this.disturConfig.push({
              value: item.code,
              name: item.value1
            })
          }
        }
      })
      queryAreaList().then(data => {
        if (data && data.status === 200) {
          this.areaList = data.data
        }
      })
      queryProvinceList().then(data => {
        if (data && data.status === 200) {
          this.provinceAreaCodeList = data.data
        }
      })
    },
    searchChannelName() {
      const item = this.channelList.find(item => item.code === this.selectChannel)
      if (item) this.currChannelName = item.shortName
    },
    getOrgList () {
      return getOrgList().then((data) => {
        if (data && data.status === 200) {
          this.isOrgListChange = false
          this.orgList = data.data
        }
      })
    },
    queryList () {
      if (this.isOrgListChange) {
        if (this.loadingTable) return
        this.loadingTable = true
        this.getOrgList().then(res => {
          this.queryListImplement()
          this.loadingTable = false
        }).catch(e => this.loadingTable = false)
      } else this.queryListImplement()
    },
    queryListImplement () {
      this.searchCurrentTableList()
      const val = this.searchOrgVal.replace(/ /g, '')
      console.log('queryList', val.length)
      if (val) this.filter(this.currentTableList, val)
      else this.setAllVisible(this.currentTableList)
    },
    onChannelChange () {
      this.searchCurrentTableList()
      this.setAllVisible(this.currentTableList)
      this.searchChannelName()
    },
    searchCurrentTableList () {
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
      // this.currentTableList = [res]
    },
    setAllVisible (arr) {
      arr.forEach(item => {
        // item.visible = true
        this.$set(item, 'visible', true)
        if (item.children && item.children.length > 0) {
          this.setAllVisible(item.children)
        }
      })
    },
    filter (list, val) {
      if (!val) return
      const search = (value, item) => {
        return item.name.indexOf(value) >= 0
      }
      const traverse = (node) => {
        const childNodes = node.children || []
        childNodes.forEach((item) => {
          const visible = search(val, item)
          this.$set(item, 'visible', visible)
          traverse(item)
        })
        if (childNodes.length ===  0) return
        let allHidden = true
        childNodes.forEach((child) => {
          if (child.visible) allHidden = false
        })
        if (!node.visible) {
          this.$set(node, 'visible', allHidden === false)
        } else {
          this.setAllVisible(childNodes)
        }
        if (node.visible && !allHidden) this.$set(node, 'isExpanded', true)
      }
      list.forEach(item => {
        traverse(item)
      })
    },
    copyData(obj) {
      return JSON.parse(JSON.stringify(obj || {}))
    },
    close() {
      this.isShowModal = false
      this.$refs.orgInfoPane.reset()
    },
    confirm() {
      this.$refs.orgInfoPane.submit((data) => {
        console.log('data', data)
        let province = data.area[0]
        let city = data.area[1]
        let areaItem = this.provinceAreaCodeList.find((item) => {
          return item.districtCode === city
        }) || this.provinceAreaCodeList.find((item) => {
          return item.districtCode === province
        })
        // areacode先找城市 再找省份
        let areaCode = areaItem.areaCode
        let company = {
          name: data.name,
          areaCode,
          province,
          city: data.area[1],
          status: data.enableStatus,
          oldCode: data.companyCode,
          principal: data.contact,
          address: data.addr,
          phone: data.tel,
          userParentSbt: data.sbtType === 1 ? 0 : 1,
          // cameraInfo: data.cameraInfo,
          weixinAppId: data.weixinAppId || '',
          weixinAppSecret: data.weixinAppSecret || '',
          notifyUsers: data.notifyUsers || []
        }
        // 暂不填写时 清空
        if (data.sbtType === 0) {
          company.sbtAppIdNo = ''
          company.sbtAppPassword = ''
          company.sbtAppName = ''
        }else if (data.sbtType !== 1) {
          // 深保通信息
          company.sbtAppIdNo = data.sbtAccount,
          company.sbtAppPassword = data.sbtPassword,
          company.sbtAppName = data.sbtName
        }
        if (this.isEdit) company = {...this.currentEditInfo, ...company}
        else {
          company = {
            ...company,
            deleted: 1,
            level: this.currentParentItem.level + 1,
            parentId: this.currentParentItem.id,
            channelCode: this.channelCode
          }
          // 全部0级不能新增子机构
          if (this.currentParentItem.level === 0) delete company.level
        }
        
        // 摄像头信息
        if (data.cameraInfos) {
          company.cameraInfos = []
          data.cameraInfos.forEach(item => {
            const split = item.value.split('-')
            if (split && split.length === 2) {
              company.cameraInfos.push({
                code: split[0],
                location: split[1]
              }) 
            }
          })
          if (company.cameraInfos.length > 0) company.cameraInfo = ''
        }

        let webConfigs = [
          {
            code: '00106',
            flag: null,
            data: JSON.stringify(data.disturType), // 是字符串
            syncChildren: data.syncChildrenDisturType ? 0 : 1
          },
          {
            code: '00111',
            data: data.enableCommission,
            flag: null,
            syncChildren: data.syncChildrenCommission ? 0 : 1
          }
        ]
        
        let params = {
          company,
          webConfigs
        }
        console.log('params', params)
        if (this.isEdit) {
          if (this.currentEditStatus === 1) {
            disableOrg(this.currentEditItem.id)
          } else {
            enableOrg(this.currentEditItem.id)
          }
          this.updateOrgInfo(params)
        } else this.addOrgInfo(params)
      })
    },
    refreshEditItemUI (params) {
      let company = params.company
      let provinceCode = company.province
      let cityCode = company.city
      const {province, city} = this.getProvinceAndCityNameByCode(provinceCode, cityCode)
      let item = this.currentEditItem
      item.province = province
      item.city = city
      item.status = company.status
      item.name = company.name
      this.currentEditItem = {}
      this.currentEditInfo = {}
    },
    updateOrgInfo (params) {
      this.modalRequestLoading = true
      updateOrg(params).then(res => {
        this.modalRequestLoading = false
        if (res && res.status === 200) {
          this.isOrgListChange = true
          this.close()
          this.refreshEditItemUI(params)
          this.showMessage('机构信息更新成功')
        } else this.showMessage(res.msg, 'error')
      }).catch(e => {
        console.error(e)
        this.showMessage(e, 'error')
        this.modalRequestLoading = false
      })
    },
    addOrgInfo (params) {
      this.modalRequestLoading = true
      Promise.all([
        addOrg(params).then(res => {
          if (res && res.status === 200) {
            this.isOrgListChange = true
            this.close()
            this.$nextTick(() => this.refreshAddItemUI(params, res.data))
            this.showMessage('机构添加成功')
          } else this.showMessage(res.msg, 'error')
        })
      ])
      .then(res => this.modalRequestLoading = false)
      .catch(e => {
        this.showMessage(e, 'error')
        this.modalRequestLoading = false
      })
    },
    // 刷新新增机构UI
    refreshAddItemUI (params, id) {
      let company = params.company
      let provinceCode = company.province
      let cityCode = company.city
      const {province, city} = this.getProvinceAndCityNameByCode(provinceCode, cityCode)
      if (!this.currentParentItem.children) Vue.set(this.currentParentItem, 'children', [])
      const item = {
        channelCode: company.channelCode,
        city,
        id,
        level: company.level,
        name: company.name,
        parentId: company.parentId,
        province,
        root: false,
        status: company.status,
        sort: 100,
        childrenSize: 0,
        visible: true
      }
      if (!this.currentParentItem.isExpanded) Vue.set(this.currentParentItem, 'isExpanded', true)
      this.currentParentItem.children.push(item)
      this.currentParentItem = {}
    },
    // 根据代码查找名字 城市省份名字
    getProvinceAndCityNameByCode (provinceCode, cityCode) {
      let areaItem = this.areaList.find(item => {
        return item.value === provinceCode
      })
      let province = areaItem.label
      let cityItem = areaItem.children.find(item => {
        return item.value === cityCode
      })
      return {province, city: cityItem ? cityItem.label : ''}
    },
    showMessage (msg, type) {
      Message({
        message: msg,
        type: type || 'success',
        duration: 2 * 1000
      })
    },
    onSelect (selectedKeys, info) {
      console.log('selected', selectedKeys, info)
    },
    switchChange ({value, item}) {
      if (value === 1) this.disableOrg(item, value)
      else this.enableOrg(item, value)
    },
    // 禁用机构
    disableOrg (item, value) {
      this.currentEditStatus = value
      this.$refs.orgInfoPane.changeStatus(value)
      this.$alert('禁用操作完成！继续点击“确定”按钮保存后生效', '温馨提示', {
        confirmButtonText: '我知道了',
        type: 'success',
        callback: action => {
        }
      })
      // this.$confirm('禁用机构会导致无法登录、无法出单，仍继续禁用吗?', '温馨提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning',
      //   callback: action => {
      //     if (action === 'confirm') {
      //       this.currentEditStatus = value
      //       this.$refs.orgInfoPane.changeStatus(value)
            // item.status = value
            // disableOrg(item.id).then(data => {
            //   if (data && data.status === 200) {
            //     item.status = value
            //   }
            // })
        //   }
        // }
      // })
    },
    // 启用机构
    enableOrg (item, value) {
      this.currentEditStatus = value
      this.$refs.orgInfoPane.changeStatus(value)
      this.$alert('启用操作完成！继续点击“确定”按钮保存后生效', '温馨提示', {
        confirmButtonText: '我知道了',
        type: 'success',
        callback: action => {
        }
      })
      // enableOrg(item.id).then(data => {
      //   if (data && data.status === 200) {
      //     // item.status = value
      //     this.$alert('机构状态已成功启用，请尽快设置和关联相关的登录账户和工号密码', '温馨提示', {
      //       confirmButtonText: '确定',
      //       type: 'success',
      //       callback: action => {
      //       }
      //     })
      //   }
      // })
    },
    onEditStatusChange (val) {
      if (this.$refs.orgInfoPane.ruleForm.enableStatus === '') return
      this.switchChange({
        value: val,
        item: this.currentEditItem
      })
    },
    addNewOrg (item) {
      // if (item.level === 0) {
      //   this.showMessage('该机构不能添加子机构', 'error')
      //   return
      // }
      this.title = '添加机构'
      this.channelCode = item.channelCode
      this.isShowModal = true
      this.isEdit = false
      this.currentParentItem = item
      this.sbtParentId = item.id
      this.$nextTick(() => {
        if (item && item.city && item.province) {
          this.$refs.orgInfoPane.setParentArea({
            province: item.province,
            city: item.city
          })
        }
      })
    },
    editOrg (item) {
      console.log(item)
      this.title = '修改机构'
      this.isShowModal = true
      this.isEdit = true
      let orgId = item.id
      this.sbtParentId = item.parentId
      this.currentEditItem = item // 给当前编辑item赋值 方便刷新UI
      this.currentEditStatus = item.status
      Promise.all(
        [
          queryOrgInfo(orgId)
          .then(data => {
            if (data && data.status === 200)  return data.data
            return null
          }), 
          queryOrgConfig(orgId)
          .then(data => {
            if (data && data.status === 200)  return data.data
            return null
          }),
          queryParentOrgUser(orgId)
          .then(data => {
            if (data && data.status === 200)  return data.data
            return null
          })
        ]
      ).then((res) => {
        let orgInfo = res[0]
        let orgConfig = res[1] && res[1].find(item => {
          return item.code === '00106'
        })
        // 佣金显示配置
        let commissionConfig = res[1] && res[1].find(item => {
          return item.code === '00111'
        })
        this.parentUserData = res[2]
        console.log('orgInfo', orgInfo)
        console.log('orgConfig', orgConfig)
        let area = []
        if (orgInfo.province && orgInfo.city) area = [orgInfo.province, orgInfo.city]
        // orgConfig.data 是字符串
        let disturType = orgConfig && orgConfig.data ? [...JSON.parse(orgConfig.data)] : []
        let formData = {
          name: orgInfo.name, // 机构名称
          enableStatus: orgInfo.status, // 启用状态
          enableCommission: commissionConfig ? parseInt(commissionConfig.data || 0) : 0, // 佣金显示默认不可见
          area, // 所在地区
          disturType , // 保单获取方式
          companyCode: orgInfo.oldCode || '', // 机构代码
          contact: orgInfo.principal || '', // 机构联系人
          addr: orgInfo.address || '', // 机构地址
          tel: orgInfo.phone || '', // 机构电话
          syncChildrenDisturType: false,
          syncChildrenCommission: false,
          weixinAppId: orgInfo.weixinAppId,
          weixinAppSecret: orgInfo.weixinAppSecret,
          sbtAccount: orgInfo.sbtAppIdNo || '',
          sbtPassword: orgInfo.sbtAppPassword || '',
          sbtName: orgInfo.sbtAppName || '',
          notifyUsers: orgInfo.notifyUsers || []
        }
        const hasCameraInfoList = () => {
          if (!orgInfo.cameraInfos) return false
          if (orgInfo.cameraInfos.length === 0) return false
          return orgInfo.cameraInfos.length > 0
        }
        const hasCameraNotifyUsers = () => {
          if (!orgInfo.notifyUsers) return false
          if (orgInfo.notifyUsers.length === 0) return false
          return orgInfo.notifyUsers.length > 0
        }
        // 车商渠道摄像头信息
        if (hasCameraInfoList()) {
          formData.cameraInfos = []
          orgInfo.cameraInfos.forEach((item, index) => {
            formData.cameraInfos.push({
              value: `${item.code}-${item.location}`
            })
          })
        } else {
          const value = orgInfo.cameraInfo || ''
          formData.cameraInfos = [
            { value }
          ]
        }
        if (hasCameraInfoList() || hasCameraNotifyUsers()) {
          formData.cameraStatus = 1
        } else {
          formData.cameraStatus = 0
        }
        // 是否复用上级
        if (orgInfo.userParentSbt === 0) {
          formData.sbtType = 1
        } else if (orgInfo.sbtAppIdNo || orgInfo.sbtAppPassword || orgInfo.sbtAppName) {
          formData.sbtType = 2
        } else formData.sbtType = 0
        this.channelCode = orgInfo.channelCode
        this.$refs.orgInfoPane.setData(formData)
        this.currentEditInfo = { ...orgInfo }
      })
    },
    deleteOrg (item, parentItem) {
      checkOrgUser(item.id).then(res => {
        if (!res || res.status !== 200) {
          this.showMessage(res.msg || '请求失败' ,'error')
          return
        }
        if (res.data) {
          this.$alert('请在转移与机构关联的业务员和管理账号后，再执行机构删除操作。', '温馨提示', {
            confirmButtonText: '确定',
            type: 'info',
            callback: action => {
            }
          })
        } else {
          this.$confirm('删除机构会连带删除关联保单、报价等历史数据，仍要继续删除吗？', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            callback: action => {
              if (action === 'confirm') {
                this.deleteOrgRequest(item.id, parentItem)
              }
            }
          })
        }
      })
    },
    deleteOrgRequest (id, parentItem) {
      deleteOrg(id).then(res => {
        if (res && res.status === 200) {
          this.isOrgListChange = true
          let index = parentItem.children.findIndex((item) => {
            return item.id === id
          })
          if (index >= 0) parentItem.children.splice(index, 1)
        } else this.showMessage(res.msg, 'error')
      })
    },
    searchOrgChange (val) {
      console.log('searchOrgChange', val)
    },
    // 1 向上 2向下
    sortOrg (type, item, parentItem) {
      console.log('sortOrg', arguments)
      const childCount = parentItem.children.length
      console.log('childCount', childCount)
      if (childCount < 2) return
      const index = parentItem.children.findIndex(child => child.id === item.id)
      console.log('index', index)
      let sortType
      let swtichIndex
      switch (type) {
        case 1:
          // 第一个或不动
          if (index === 0) return
          swtichIndex = index - 1
          sortType = 1
          break
        case 2:
          // 最后一个不动
          if (index === childCount -1) return
          swtichIndex = index + 1
          sortType = 2
          break
      }
      this.loadingTable = true
      sortOrg({
        id: item.id,
        sortType
      }).then(res => {
        this.loadingTable = false
        if (res && res.status === 200) {
          this.isOrgListChange = true
          const switchItem = parentItem.children[swtichIndex]
          this.$set(parentItem.children, swtichIndex, item)
          this.$set(parentItem.children, index, switchItem)
        }
      }).catch(e => this.loadingTable = false)
    },
    iShowAddBtn (item) {
      return item.level < 6
    },
    isShowEditBtn (item) {
      return item.level >= 0
    }
  }
}
</script>

<style lang="scss">
.orgList {
  .el-select {
    margin-right: 15px;
  }
  .up-arrow{
    background-image: url(~@/assets/imgs/up.png);
    &:hover{
      background-image: url(~@/assets/imgs/up_hover.png);
    }
  }
  .down-arrow{
    background-image: url(~@/assets/imgs/down.png);
    &:hover{
      background-image: url(~@/assets/imgs/down_hover.png);
    }
  }
  .arrow{
    display: inline-block;
    width: 30px;
    height: 30px;
    padding: 5px;
    background-repeat: no-repeat;
    background-size:20px 20px;
    background-position:center;
    cursor: pointer;
  }
  .sub-header{
    border-bottom:1px solid #eee;
    line-height:30px;
    color:#666;
    margin-bottom: 20px;
  }
  .opertion {
    a {
      color: #409EFF;
      background-color: transparent;
      text-decoration: none;
      outline: 0;
      cursor: pointer;
    }
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
  .bottom-border{
    border-bottom: 1px solid #eee;
  }
  .top-off{
    margin-top: 20px;
  }
  .title-table{
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    text-align: left;
    font-weight: normal;
    height: 40px;
    font-size: 14px;
    border-left: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
    color: #606266;
    th {
      font-weight: normal;
      padding:0 10px;
      // border-right: 1px solid #ebeef5;
    }
    .table-header{
      th{
        color: #909399;
        font-weight: bold;
        // border-right: 1px solid #ebeef5;
      }
    }
  }
  .el-row{
    display: flex;
    flex: 1;
  }
  .tree-node__content{
    display: flex;
    align-items: center;
    height: 40px;
  }
  .tree-node__content:hover{background-color:#eef7fd}
  .tree-node__expand-icon{
    padding: 6px;
    cursor: pointer;
    color: #c0c4cc;
    font-size: 12px;
    background: transparent;
    &::before{
      content: "+";
      color: #333;
      border: 1px solid #eee;
      width: 20px;
      height: 20px;
      display: inline-block;
      text-align: center;
      background: transparent;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      font-size: 16px;
      line-height: 18px;
    }
  }
  .tree-node__expand-icon.expanded{
    &::before{
      content: "-";
    }
  }
}
</style>

