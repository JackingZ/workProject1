<template>
  <!-- zhengjie 2018-9-4 -->
  <div class="app-container permission">
    <div class="app-panel left-pane">
      <div :class="isTreeshow ? '' : 'hide'" class="tree-wrap">
        <el-tree :data="companyTreeData.data" :props="defaultProps" :highlight-current="true" :expand-on-click-node="false" @node-click="handleTreeClick" />
      </div>
      <div class="arrow-wrap">
        <img :src="isTreeshow? expandIcon.left : expandIcon.right" @click="isTreeshow = !isTreeshow">
      </div>
    </div>
    <div class="app-panel right-pane">
      <el-row>
        <el-col>
          <div>
            <div class="table-permission-tabs">
              <el-row>
                <el-col :span="24">
                  <div style="border-bottom:1px solid #eee;line-height:30px;color:#666;">账号设置</div>
                </el-col>
              </el-row>
              <el-row style="margin:20px 0px;">
                <el-col :span="4">
                  <el-button v-permission="permissionList.accountManagerADefault" style="font-size: 14px;" type="text" size="small" @click="addUserData">
                    <i class="el-icon-circle-plus-outline" />&nbsp;新增账号
                  </el-button>
                </el-col>
                <el-col :span="20">
                  <div style="text-align:right;">
                    <el-select v-if="isAnyAdminChannel" v-model="accountManage.channelCode" clearable filterable placeholder="全部渠道" size="small" @change="getChannelKey">
                      <el-option v-for="item in channelData.data" :label="item.shortName" :key="item.code" :value="item.code" />
                    </el-select>
                    <el-select v-model="accountManage.status" clearable filterable placeholder="账号状态" style="max-width:120px;" size="small" @change="handleStatusClick">
                      <el-option label="已启用" value="0" />
                      <el-option label="已禁用" value="1" />
                    </el-select>
                    <el-input v-model="accountManage.value" placeholder="请输入内容" size="small">
                      <el-select slot="prepend" v-model="accountManage.name">
                        <el-option label="姓名" value="nickName" />
                        <el-option label="登录账号" value="userName" />
                      </el-select>
                    </el-input>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="queryUserData">查询</el-button>
                  </div>
                </el-col>
              </el-row>
              <el-row type="flex" justify="space-between" style="height:56px;line-height:56px;background-color:#f5f7fa;padding-left:10px;font-size:14px;color:#666;">
                <el-col style="width:80px;">
                  <span>角色组：</span>
                </el-col>
                <el-col>
                  <span v-if="!accountManage.channelCode">请先选择渠道</span>
                  <el-tabs v-else @tab-click="handleRoleClick">
                    <el-tab-pane :label="totalCounts" name="all" />
                    <el-tab-pane v-for="(item) in rolesData.data" :label="item.numName" :name="item.id" :key="item.id" />
                  </el-tabs>
                </el-col>
                <el-col :span="1" class="role-setting">
                  <i v-permission="permissionList.roleManager" class="el-icon-setting" @click="goToRole" />
                </el-col>
              </el-row>
            </div>
            <div>
              <el-table v-loading="isLoading" :data="userManageData" :cell-style="{padding: '4px 0'}" :header-cell-style="{background:'#fafafa',padding: '8px 0'}" border height="calc(100vh - 368px)">
                <el-table-column v-if="isAnyAdminChannel" prop="channelName" label="所属渠道" min-width="120" />
                <el-table-column prop="userName" label="登录账号" min-width="150" />
                <el-table-column prop="nickName" label="姓名" min-width="100" />
                <el-table-column prop="belongChannelName" label="所属机构" min-width="200" />
                <el-table-column prop="rolesName" label="角色组" min-width="150" />
                <el-table-column :formatter="setStatus" prop="statusWord" label="启用状态" width="80" />
                <el-table-column :formatter="createFormat" prop="createTime" sortable label="添加时间" width="180" />
                <el-table-column fixed="right" label="操作" width="280">
                  <template slot-scope="scope">
                    <el-button v-permission="permissionList.mockLogin" v-if="isAnyAdminChannel" style="font-size:14px;" type="text" size="small" @click="onMockLogin(scope.row)">模拟登录</el-button>
                    <span v-permission="permissionList.mockLogin" v-if="isAnyAdminChannel" style="color:#ccc;">|</span>
                    <el-button v-permission="permissionList.accountManagerUReset" style="font-size:14px;" type="text" size="small" @click="userResetPWD(scope.row)">重置密码</el-button>
                    <span v-permission="permissionList.accountManagerUReset" style="color:#ccc;">|</span>
                    <el-button v-permission="permissionList.accountManagerUEdit" style="font-size:14px;" type="text" size="small" @click="editUserData(scope.row)">编辑</el-button>
                    <span v-permission="permissionList.accountManagerUEdit || permissionList.accountManagerDDefault" style="color:#ccc;">|</span>
                    <el-button v-permission="permissionList.accountManagerDDefault" style="font-size:14px;" type="text" size="small" @click="deleteUserData(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-if="userCount > 0" style="text-align:right;margin-top:20px;">
              <el-pagination :current-page="userCurrentPage" :page-sizes="[10, 20, 30, 40, 50]" :page-size="userPageSize" :total="userCount" layout="total, sizes, prev, pager, next, jumper" @size-change="userSizeChange" @current-change="userCurrentChange" />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <app-drawer :is-show="isShow" :drawer-title="title" :drawer-style="drawerStyle" :mask-closable="false" @drawerClose="close" @drawerConfirm="confirm">
      <div v-permission="permissionList.accountManagerUDisable" v-if="isEdit" slot="afterTitle" class="head-btn">
        <my-switch v-model="editStatus" :active-value="0" :inactive-value="1" @input="updateStatus" />
      </div>
      <permiss-edit v-if="isShow" ref="permissEdit" :is-edit="isEdit" :edit-option="editOption" />
    </app-drawer>
  </div>
</template>

<script>
import {
  userLinked,
  getOrgData,
  channelEffective,
  userResetPassword,
  // userLoginDisable,
  // userLoginRecovery,
  userDelete,
  userInsertLinked,
  userUpdateLinked,
  userRoleCount,
  roleChannelCode
} from '@/api/system'
import permissEdit from '@/views/system/permissEdit'
import appDrawer from '@/components/Drawer/drawer'
import qs from 'qs'
import { formatDate } from '@/utils'
import { getTokenByUserId } from '@/api/organization'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { initBrowserUtil, openNewProcessUrl } from '@/views/insurance/service/browserUtil'
import { Message } from 'element-ui'
import applicationStorageService from '@/views/insurance/service/application-storage.service'
export default {
  name: 'PermissionSystem',
  components: {
    permissEdit,
    appDrawer
  },
  data() {
    return {
      isLoading: true,
      expandIcon: {
        left: require('@/assets/imgs/expand_select-left.png'),
        right: require('@/assets/imgs/expand_select-right.png')
      },
      companyTreeData: {
        data: []
      },
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      channelData: {
        data: []
      },
      rolesData: {
        data: []
      },
      rolesCounts: {
        data: []
      },
      accountManage: {
        channelCode: null,
        companyIds: [],
        status: null,
        role: null,
        name: 'userName',
        value: null,
        nickValue: null,
        userValue: null
      },
      totalCounts: '',
      userCount: 0,
      userCurrentPage: 1,
      userPageSize: 20,
      userManageData: [],
      isTreeshow: false,
      isShow: false,
      isEdit: false,
      editOption: {},
      editStatus: null,
      title: '',
      drawerStyle: ''
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否管理员渠道
    ]),
    ...mapState({
      channelId: state => state.system.channelID
    })
  },
  activated() {
    if (this.isAnyAdminChannel) {
      channelEffective().then(res => {
        this.channelData = res
      })
    }
  },
  async created() {
    if (this.isAnyAdminChannel) {
      this.channelData = await channelEffective()
      if (this.channelId) {
        this.accountManage.channelCode = this.channelId
      } else {
        this.accountManage.channelCode = this.channelData.data[0].code
        this.setChannelId(this.accountManage.channelCode)
      }
    } else {
      this.accountManage.channelCode = this.$store.getters.userAll.data.channelCode
    }
    this.rolesData = await roleChannelCode(this.accountManage.channelCode)
    this.rolesCounts = await userRoleCount({
      channelCode: this.accountManage.channelCode,
      companyIds: [],
      createTime: null,
      nickName: '',
      orderCase: '',
      roleId: '',
      status: null,
      userName: ''
    })
    this.totalCounts = '全部' + '(' + this.rolesCounts.data.total + ')'
    this.rolesData.data.map((item, index) => {
      this.rolesData.data[index].numName = item.name + '(0)'
      this.rolesCounts.data.userRoleCounts.map(itemC => {
        if (item.id === itemC.roleId) {
          this.rolesData.data[index].numName =
            item.name + '(' + itemC.count + ')'
        }
      })
    })
    this.companyTreeData = await getOrgData({
      channelCode: this.accountManage.channelCode,
      areaCode: null,
      filterTeamCompany: true,
      token: this.$store.getters.token
    })
    this.isTreeshow = true
    this.getUserLinkedData()
    initBrowserUtil()
  },
  methods: {
    ...mapMutations(['setChannelId']),
    async onMockLogin(val) {
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
      if (val.status !== 0) {
        Message({
          message: '该账号已禁用，无法进行模拟登录',
          type: 'error',
          duration: 3 * 1000
        })
        return
      }
      const { access_token, token_type } = await getTokenByUserId(val.id)
      this.$confirm('模拟登录期间进行的所有增删改操作\n' +
        '\n' +
        '都是实时有效的，请谨慎操作！', `模拟登录-【${val.channelName}-${val.userName}】`, {
        confirmButtonText: '我知道了',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.site_title = '悦保科技'
        switch (process.env.BUILD_VER) {
          case 'prod':
            console.log(`https://www.ybinsure.com/spa/carManager/mocklogin?token=${access_token}&type=${token_type}`)
            openNewProcessUrl(`https://www.ybinsure.com/spa/carManager/mocklogin?token=${access_token}&type=${token_type}`)
            break
          case 'test':
            console.log(`https://www.ybinsure.com/spa/carManagerTest/mocklogin?token=${access_token}&type=${token_type}`)
            openNewProcessUrl(`https://www.ybinsure.com/spa/carManagerTest/mocklogin?token=${access_token}&type=${token_type}`)
            break
          case 'test2':
            console.log(`https://www.ybinsure.com/spa/carManagerTest2/mocklogin?token=${access_token}&type=${token_type}`)
            openNewProcessUrl(`https://www.ybinsure.com/spa/carManagerTest2/mocklogin?token=${access_token}&type=${token_type}`)
            break
        }
        setTimeout(() => {
          window.site_title = void 0
        }, 500)
      }).catch(e => {
      })
    },
    // 分页
    userSizeChange(val) {
      this.isLoading = true
      this.userPageSize = val
      this.getUserLinkedData()
    },
    userCurrentChange(val) {
      this.isLoading = true
      this.userCurrentPage = val
      this.getUserLinkedData()
    },
    // 格式化表格时间
    createFormat(val) {
      return formatDate(val.createTime)
    },
    updateFormat(val) {
      return formatDate(val.updateTime)
    },
    setStatus(val) {
      if (val.status === 0) {
        return '正常'
      } else {
        return '已禁用'
      }
    },
    // 获取账户表格内容
    getUserLinkedData() {
      this.isLoading = true
      if (this.accountManage.name === 'nickName') {
        this.accountManage.nickValue = this.accountManage.value
        this.accountManage.userValue = null
      } else {
        this.accountManage.userValue = this.accountManage.value
        this.accountManage.nickValue = null
      }
      if (!this.isAnyAdminChannel) {
        this.accountManage.channelCode = this.$store.getters.userAll.data.channelCode
      }
      userLinked({
        page: this.userCurrentPage,
        size: this.userPageSize,
        model: {
          channelCode: this.accountManage.channelCode,
          companyIds: this.accountManage.companyIds,
          companyName: null,
          createTime: 1,
          linkType: '1',
          roleId: this.accountManage.role,
          status: this.accountManage.status,
          nickName: this.accountManage.nickValue,
          userName: this.accountManage.userValue,
          userTypes: ['1', '2']
        }
      }).then(res => {
        if (res.status === 200) {
          this.isLoading = false
        }
        this.userCount = res.data.count
        this.userManageData = res.data.model
        this.userManageData.map((item, index) => {
          if (item.belongCompanys && item.belongCompanys.length > 0) {
            const maxItem = item.belongCompanys.sort(
              (a, b) => b.level - a.level
            )[0]
            this.userManageData[index].belongChannelName = maxItem.name
          }
          if (item.roles && item.roles.length > 0) {
            if (item.roles.length > 1) {
              this.userManageData[index].rolesName = item.roles[0].name + '等'
            } else {
              this.userManageData[index].rolesName = item.roles[0].name
            }
          }
        })
        // console.log(this.userManageData)
      })
    },
    // 根据渠道获取机构和角色
    async getChannelKey(val) {
      this.accountManage.companyIds = []
      this.accountManage.role = null
      this.accountManage.status = null
      if (this.isAnyAdminChannel) {
        this.setChannelId(val)
      }
      this.companyTreeData = await getOrgData({
        channelCode: val,
        areaCode: null,
        filterTeamCompany: true,
        token: this.$store.getters.token
      })
      this.rolesCounts = await userRoleCount({
        channelCode: val,
        companyIds: [],
        createTime: null,
        nickName: '',
        orderCase: '',
        roleId: '',
        status: null,
        userName: ''
      })
      this.rolesData = await roleChannelCode(val)
      this.totalCounts = '全部' + '(' + this.rolesCounts.data.total + ')'
      this.rolesData.data.map((item, index) => {
        this.rolesData.data[index].numName = item.name + '(0)'
        this.rolesCounts.data.userRoleCounts.map(itemC => {
          if (item.id === itemC.roleId) {
            this.rolesData.data[index].numName =
              item.name + '(' + itemC.count + ')'
          }
        })
      })
      this.getUserLinkedData()
    },
    // 点击角色组
    handleRoleClick(val) {
      if (val.name === 'all') {
        this.accountManage.role = null
      } else {
        this.accountManage.role = val.name
      }
      this.getUserLinkedData()
    },
    // 点击状态
    async handleStatusClick() {
      this.rolesCounts = await userRoleCount({
        channelCode: this.accountManage.channelCode,
        companyIds: this.accountManage.companyIds,
        createTime: null,
        nickName: '',
        orderCase: '',
        roleId: '',
        status: this.accountManage.status,
        userName: ''
      })
      this.totalCounts = '全部' + '(' + this.rolesCounts.data.total + ')'
      this.rolesData.data.map((item, index) => {
        this.rolesData.data[index].numName = item.name + '(0)'
        this.rolesCounts.data.userRoleCounts.map(itemC => {
          if (item.id === itemC.roleId) {
            this.rolesData.data[index].numName =
              item.name + '(' + itemC.count + ')'
          }
        })
      })
      this.getUserLinkedData()
    },
    // 点击机构树
    async handleTreeClick(data) {
      this.accountManage.companyIds = [data.key]
      this.rolesCounts = await userRoleCount({
        channelCode: this.accountManage.channelCode,
        companyIds: this.accountManage.companyIds,
        createTime: null,
        nickName: '',
        orderCase: '',
        roleId: '',
        status: this.accountManage.status,
        userName: ''
      })
      this.totalCounts = '全部' + '(' + this.rolesCounts.data.total + ')'
      this.rolesData.data.map((item, index) => {
        this.rolesData.data[index].numName = item.name + '(0)'
        this.rolesCounts.data.userRoleCounts.map(itemC => {
          if (item.id === itemC.roleId) {
            this.rolesData.data[index].numName =
              item.name + '(' + itemC.count + ')'
          }
        })
      })
      this.getUserLinkedData()
    },
    // 跳转角色设置
    goToRole() {
      this.$router.push('/system/permissionRoles')
    },
    // 重置密码
    userResetPWD(row) {
      this.$confirm('确定要重置该账号的登录密码吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const str = qs.stringify({
            id: row.id,
            sendMessage: false
          })
          userResetPassword(str).then(res => {
            if (res.status === 200) {
              this.$alert(`密码重置成功！新密码：${res.data}`, '提示', {
                confirmButtonText: '确定'
              })
            }
          })
        })
        .catch(() => {})
    },
    // 更改用户状态
    updateStatus() {
      // console.log(this.editStatus)
      if (this.editStatus === 1) {
        this.$alert('禁用操作完成！继续点击“确定”按钮保存后生效', '温馨提示', {
          confirmButtonText: '我知道了',
          type: 'success'
        })
      } else {
        this.$alert('启用操作完成！继续点击“确定”按钮保存后生效', '温馨提示', {
          confirmButtonText: '我知道了',
          type: 'success'
        })
      }
    },
    // 增删改查
    queryUserData() {
      for (const key in this.accountManage) {
        if (this.accountManage[key] === '') {
          this.accountManage[key] = null
        }
      }
      this.getUserLinkedData()
    },
    addUserData() {
      this.isEdit = false
      this.isShow = true
      this.title = '新增账号'
      this.drawerStyle = 'width: 500px;'
    },
    editUserData(row) {
      this.isEdit = true
      this.editOption = row
      this.editStatus = row.status
      this.isShow = true
      this.title = '编辑账号'
      this.drawerStyle = 'width: 500px;'
    },
    deleteUserData(row) {
      this.$confirm(
        '删除后台账号，会导致用户无法登录管理后台，仍继续删除吗？',
        '温馨提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        userDelete(row.id).then(() => {
          userRoleCount({
            channelCode: this.accountManage.channelCode,
            companyIds: this.accountManage.companyIds,
            createTime: null,
            nickName: '',
            orderCase: '',
            roleId: '',
            status: this.accountManage.status,
            userName: ''
          }).then(res => {
            this.rolesCounts = res
            this.totalCounts = '全部' + '(' + this.rolesCounts.data.total + ')'
            this.rolesData.data.map((item, index) => {
              this.rolesData.data[index].numName = item.name + '(0)'
              this.rolesCounts.data.userRoleCounts.map(itemC => {
                if (item.id === itemC.roleId) {
                  this.rolesData.data[index].numName =
                    item.name + '(' + itemC.count + ')'
                }
              })
            })
          })
          this.getUserLinkedData()
        })
      })
    },
    close() {
      this.isShow = false
    },
    // 保存
    async confirm() {
      const formData = this.$refs.permissEdit.userForm
      if (this.isEdit) {
        formData.status = this.editStatus
      }
      this.$refs.permissEdit.$refs.permissEdit.validate(valid => {
        if (!valid) return
        if (!this.isEdit) {
          userInsertLinked(formData).then(res => {
            if (res.status === 200) {
              this.$alert(
                `账号初始密码为手机号后8位数字，请尽快登录完成修改!`,
                '添加账号成功',
                {
                  confirmButtonText: '确定'
                }
              )
              this.isShow = false
              userRoleCount({
                channelCode: this.accountManage.channelCode,
                companyIds: this.accountManage.companyIds,
                createTime: null,
                nickName: '',
                orderCase: '',
                roleId: '',
                status: this.accountManage.status,
                userName: ''
              }).then(res => {
                this.rolesCounts = res
                this.totalCounts =
                  '全部' + '(' + this.rolesCounts.data.total + ')'
                this.rolesData.data.map((item, index) => {
                  this.rolesData.data[index].numName = item.name + '(0)'
                  this.rolesCounts.data.userRoleCounts.map(itemC => {
                    if (item.id === itemC.roleId) {
                      this.rolesData.data[index].numName =
                        item.name + '(' + itemC.count + ')'
                    }
                  })
                })
              })
              this.getUserLinkedData()
            }
          })
        } else {
          userUpdateLinked(formData).then(res => {
            if (res.status === 200) {
              console.log(res.msg)
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.isShow = false
              userRoleCount({
                channelCode: this.accountManage.channelCode,
                companyIds: this.accountManage.companyIds,
                createTime: null,
                nickName: '',
                orderCase: '',
                roleId: '',
                status: this.accountManage.status,
                userName: ''
              }).then(res => {
                this.rolesCounts = res
                this.totalCounts =
                  '全部' + '(' + this.rolesCounts.data.total + ')'
                this.rolesData.data.map((item, index) => {
                  this.rolesData.data[index].numName = item.name + '(0)'
                  this.rolesCounts.data.userRoleCounts.map(itemC => {
                    if (item.id === itemC.roleId) {
                      this.rolesData.data[index].numName =
                        item.name + '(' + itemC.count + ')'
                    }
                  })
                })
              })
              this.getUserLinkedData()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.permission {
  display: flex;
  padding: 15px 15px 15px 0;
  .left-pane {
    display: flex;
    padding: 0;
    margin-right: 5px;
    background: transparent;
    .tree-wrap {
      width: 260px;
      padding: 25px 10px;
      overflow: auto;
      box-sizing: border-box;
      border-color: #e8e8e8;
      background-color: #fff;
      transition: all 0.3s ease;
      height: calc(100vh - 114px);
    }
    .hide {
      width: 0;
      overflow: hidden;
      padding: 0px;
    }
    .arrow-wrap {
      display: flex;
      align-items: center;
      height: calc(100vh - 114px);
      box-sizing: border-box;
      // padding-bottom: 40px;
      cursor: pointer;
      img {
        width: 12px;
      }
    }
    .el-tree-node > .el-tree-node__children {
      overflow: visible;
    }
    .el-tree-node__label {
      padding-right: 10px;
    }
  }
  .right-pane {
    flex: 1;
    overflow: auto;
    height: calc(100vh - 114px);
  }
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
</style>
