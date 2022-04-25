<template>
  <div class="app-container">
    <div class="app-panel">
      <div class="roles-set">
        <el-row>
          <el-col :span="24">
            <div style="border-bottom:1px solid #eee;line-height:30px;color:#666;margin-bottom: 20px;">角色设置</div>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <div v-if="isAnyAdminChannel" style="text-align:right;margin-bottom: 20px;">
              <el-select v-model="roleForm.channelCode" filterable placeholder="全部渠道" size="small" @change="getChannelRole">
                <el-option v-for="item in organData.data" :label="item.shortName" :key="item.code" :value="item.code" />
              </el-select>
            </div>
          </el-col>
        </el-row>

        <div style="line-height:50px;background-color:#f0f2f5;border-bottom:1px solid #ccc;font-size:14px;">
          <div style="width: 210px;float:left;">
            <span style="padding-left:20px;">角色组</span>
          </div>
          <div style="margin-left:210px;">
            <el-row>
              <el-col :xs="12" :sm="6" :lg="4">
                <div style="color:#666;padding-left:10px;">菜单页面</div>
              </el-col>
              <el-col :xs="12" :sm="18" :lg="20">
                <div style="color:#666;padding-left:20px;">操作权限</div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div :style="isAnyAdminChannel? 'height: calc(100vh - 310px);': 'height: calc(100vh - 257px);'" style="overflow-y: auto;background-color: #f0f2f5;width: 210px;float:left;">
          <el-menu :default-active="activeColor" background-color="#f0f2f5" style="border-right: none;" @select="getRolePermission">
            <!-- <el-menu-item index="admin" @click=" isAdd = false ">
              <span slot="title">
                <svg-icon icon-class="system" style="width:20px;height:20px;color:#707070;" />管理员<span style="font-size:12px;color:#ccc;">(系统默认)</span>
              </span>
            </el-menu-item> -->
            <el-menu-item v-for="(item, index) in rolesOptions.data" :key="item.id" :index="item.id" class="role-menu-item">
              <div slot="title" style="text-overflow: ellipsis;overflow:hidden;">
                <span v-if="isEdit === index" class="el-input el-input--small">
                  <input v-focus v-model="inputName" class="el-input__inner" type="text" maxlength="20" placeholder="请输入角色名称" @blur="setEditName">
                </span>
                <span v-else>
                  <svg-icon icon-class="role" style="width:18px;height:18px;color:#707070;" />{{ item.name }}
                  <span v-if="parseInt(item.systemCreate) === 0" style="font-size:12px;color:#ccc;">(系统默认)</span>
                </span>

                <div v-show="parseInt(item.systemCreate) !== 0 && selectRoleId === item.id" slot="reference" class="role-menu-icon" @click.stop=" isShow = true " @mouseleave=" isShow = false">
                  <i class="el-icon-caret-bottom" />
                  <div v-permission="permissionList.roleManagerUEdit || permissionList.roleManagerDDefault" v-show="isShow && selectRoleId === item.id" class="role-popover-box">
                    <div v-permission="permissionList.roleManagerUEdit" class="role-popover-div" @click.stop="getEditName(item.name, index)">编辑</div>
                    <div v-permission="permissionList.roleManagerDDefault" class="role-popover-div" @click.stop="deleteRole(item.id)">删除</div>
                  </div>
                </div>
              </div>
            </el-menu-item>
            <el-menu-item index="addRole" style="height:auto;padding:0;">
              <template slot="title">
                <div v-if="isAdd" style="padding:10px 20px 0px 20px;">
                  <el-input v-model="roleForm.name" style="display:block;line-height:32px;height:32px;" maxlength="20" placeholder="请输入角色名称" size="small" @keyup.enter.native="addRoleName" />
                  <el-button type="primary" size="mini" @click="addRoleName">确定</el-button>
                  <el-button size="mini" @click=" isAdd = false ">取消</el-button>
                </div>

                <div v-permission="permissionList.roleManagerADefault" v-else style="padding:0 20px;" @click=" isAdd = true ">
                  <el-button style="font-size: 14px;color: #303133;" type="text" size="small" class="role-menu-add">
                    <svg-icon icon-class="plus" style="color:#707070;margin-right:2px;margin-left:1px;" />新增角色
                  </el-button>
                </div>
              </template>
            </el-menu-item>
          </el-menu>
        </div>

        <div :style="isAnyAdminChannel? 'height: calc(100vh - 310px);': 'height: calc(100vh - 257px);'" style="overflow-y: auto;padding-left:10px;margin-left:210px;">
          <el-form class="role-item-line">
            <el-form-item v-for="(itemOne,indexOne) in permissData.render" :key="indexOne">
              <el-row :class="itemOne.children && itemOne.children.length > 0 ? '' : 'is-item-line'">
                <el-col :xs="24" :sm="6" :lg="4" :class="itemOne.children && itemOne.children.length > 0 ? 'is-item-line' : ''" style="padding-left: 10px;">
                  <el-checkbox v-model="itemOne.checked" :indeterminate="itemOne.selected" :label="itemOne.key" @change="setCheckedOne(itemOne)">{{ itemOne.title }}</el-checkbox>
                </el-col>

                <el-col v-if="itemOne.children" :xs="24" :sm="18" :lg="20" style="border-left:1px solid #eee;">
                  <el-row v-for="(itemTwo,indexTwo) in itemOne.children" :key="indexTwo" style="border-top:1px solid #eee;">
                    <el-col :xs="24" :sm="7" :md="5" :lg="4" style="padding-left: 10px;">
                      <el-checkbox v-model="itemTwo.checked" :indeterminate="itemTwo.selected" :label="itemTwo.key" @change="setCheckedTwo(itemTwo, itemOne)">{{ itemTwo.title }}</el-checkbox>
                    </el-col>

                    <el-col :xs="20" :sm="17" :md="19" :lg="20" style="border-left:1px solid #eee;">
                      <el-row v-if="itemTwo && itemTwo.children" style="padding-left: 10px;">
                        <el-col v-for="(itemThree,indexThree) in itemTwo.children" :key="indexThree" :xs="12" :sm="12" :md="6" :xl="3">
                          <el-checkbox v-model="itemThree.checked" :label="itemThree.key" @change="setCheckedThree(itemThree, itemTwo, itemOne)">{{ itemThree.title }}</el-checkbox>
                        </el-col>
                      </el-row>
                    </el-col>

                  </el-row>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
          <div v-show="canSave">
            <el-button v-permission="permissionList.roleManagerUEdit || permissionList.roleManagerADefault" type="primary" style="margin-top:20px;padding:12px 40px;" @click="addEditRole">保存</el-button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import {
  getPermissionTree,
  channelEffective,
  channelDetail,
  roleinsertLinked,
  roleQueryLinked,
  roleUpdatedLinked,
  roleDelete,
  roleUpdate,
  roleChannelCode
} from '@/api/rolesSet'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'PermissionRoles',
  directives: {
    focus: {
      // 自动聚焦
      inserted: function(el) {
        el.focus()
      }
    }
  },
  data() {
    return {
      organData: {
        data: []
      },
      rolesSearch: {
        organ: null
      },
      permissData: {
        data: [],
        render: [],
        genesis: []
      },
      rolesOptions: {
        data: []
      },
      rolePermissionData: {
        data: []
      },
      channelPermissionData: {
        data: []
      },
      roleForm: {
        channelCode: null,
        name: null,
        createTime: null,
        deleted: 1,
        description: null,
        id: '',
        roleRelatePermissions: [],
        status: 0,
        template: 1,
        updateTime: null
      },
      rolesData: {
        channelCode: '',
        code: '',
        createTime: 0,
        deleted: 0,
        description: '',
        id: '',
        name: '',
        permissions: [
          {
            children: [],
            code: '',
            createTime: 0,
            description: '',
            id: '',
            name: '',
            parentId: '',
            sort: '',
            status: 0,
            type: '',
            updateTime: 0
          }
        ],
        roleRelatePermissions: [
          {
            id: '',
            permissionId: '',
            roleId: ''
          }
        ],
        status: 0,
        template: 0,
        updateTime: 0
      },
      inputName: null,
      selectRoleId: '', // 所选角色id
      activeColor: '',
      isAdd: false,
      isShow: false,
      isEdit: null,
      isSystemCreate: true,
      adminId: '',
      isCarDealer: null,
      currentSelectItem: null
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否管理员渠道
    ]),
    ...mapState({
      channelId: state => state.system.channelID
    }),
    canSave() {
      if (!this.currentSelectItem) return false
      /**
       * 0000000001	管理员
       * 0000000002	续保专员
       * 0000000003	出单专员
       * 0000000004	业务员
       * 0000000005 车商管理员
       */
      console.log(this.currentSelectItem)
      const isSystemCreate = parseInt(this.currentSelectItem.systemCreate) === 0
      if (isSystemCreate) {
        const code = this.currentSelectItem.code || ''
        const allowList = ['0000000002', '0000000003', '0000000005'] // 这两个角色
        return allowList.some(item => item === code)
      }
      return true
    }
  },
  async created() {
    if (this.isAnyAdminChannel) {
      this.organData = await channelEffective()
      // 权限页跳转到角色页，vuex传值渠道号
      if (this.channelId) {
        this.roleForm.channelCode = this.channelId
        this.organData.data.forEach(item => {
          if (item.code === this.channelId) {
            this.isCarDealer = item.carDealer
          }
        })
      } else {
        this.roleForm.channelCode = this.organData.data[0].code
        this.isCarDealer = this.organData.data[0].carDealer
      }
    } else {
      this.roleForm.channelCode = this.$store.getters.userAll.data.channelCode
      channelDetail(this.roleForm.channelCode).then(res => {
        this.isCarDealer = res.data.carDealer
      })
    }
    this.getChannelRole()
  },
  methods: {
    // 保存权限
    addEditRole() {
      this.rolesData.roleRelatePermissions = this.recursionArr(
        this.permissData.render
      )
      roleUpdatedLinked(this.rolesData)
        .then(res => {
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: '更新成功!'
            })
          }
        })
        .catch(err => {
          console.warn(err)
          this.$message.error(err)
        })
    },
    // 获取渠道下的权限树和角色
    async getChannelRole(val) {
      this.organData.data.forEach(item => {
        if (item.code === val) {
          this.isCarDealer = item.carDealer
        }
      })
      Promise.all([
        getPermissionTree(this.roleForm.channelCode).then(res => res.data),
        roleChannelCode(this.roleForm.channelCode)
      ]).then(([treeData, roleOptions]) => {
        // 获取当前渠道所有权限树
        this.permissData.genesis = treeData
        this.permissData.data = JSON.parse(JSON.stringify(treeData))
        this.rolesOptions = roleOptions
        // 拿第一个管理员item
        const firstItem = this.rolesOptions.data[0]
        this.currentSelectItem = firstItem
        this.activeColor = firstItem.id
        this.isSystemCreate = parseInt(firstItem.systemCreate) === 0
        // 根据管理员角色id 获取权限勾选列表
        roleQueryLinked(firstItem.id).then(({ data }) => {
          this.rolesData = data
          this.permissData.render = JSON.parse(
            JSON.stringify(this.permissData.genesis)
          )
          if (
            !this.rolesData.roleRelatePermissions ||
          this.rolesData.roleRelatePermissions.length <= 0
          ) {
            return
          }
          const roleR = this.rolesData.roleRelatePermissions
          for (let i = 0, lenI = roleR.length; i < lenI; i++) {
            this.recursionRender(roleR[i].permissionId, this.permissData.render)
          }
          this.checkboxRender(this.permissData.render)
        })
      })
      // this.recursionChannelRender(this.permissData.data)
    },
    // 递归函数
    recursionChannelRender(data) {
      const getId = arr => {
        if (arr.length > 0) {
          arr.forEach(v => {
            v.checked = true
            if (v.children) {
              getId(v.children)
            }
          })
        }
      }
      getId(data)
    },
    // 获取该角色的权限
    async getRolePermission(key) {
      // 展示菜单栏操作图标
      this.selectRoleId = key
      this.activeColor = key
      // 新增没有权限
      if (key === 'addRole') {
        return
      } else {
        this.isAdd = false
      }
      const selectItem = this.rolesOptions.data.find(item => item.id === key)
      this.currentSelectItem = selectItem
      this.isSystemCreate = parseInt(selectItem.systemCreate) === 0
      const resQL = await roleQueryLinked(key)
      this.rolesData = resQL.data
      this.permissData.render = JSON.parse(
        JSON.stringify(this.permissData.genesis)
      )
      if (
        !this.rolesData.roleRelatePermissions ||
        this.rolesData.roleRelatePermissions.length <= 0
      ) {
        return
      }
      const roleR = this.rolesData.roleRelatePermissions
      for (let i = 0, lenI = roleR.length; i < lenI; i++) {
        this.recursionRender(roleR[i].permissionId, this.permissData.render)
      }
      this.checkboxRender(this.permissData.render)
    },
    // 删除角色
    async deleteRole(id) {
      try {
        await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        console.log(id)
        const res = await roleDelete(id)
        if (res.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.rolesOptions = await roleChannelCode(this.roleForm.channelCode)
          this.permissData.render = JSON.parse(
            JSON.stringify(this.permissData.genesis)
          )
        }
      } catch (error) {
        console.warn(error)
      }
    },
    // 获取角色名
    getEditName(name, index) {
      this.isEdit = index
      this.inputName = name
      console.log(name, index)
    },
    // 设置角色名
    async setEditName() {
      this.isEdit = null
      const reg = /[`~!@#$%^&*()+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）+={}|《》？：“”【】、；‘’，。、]/im
      if (!this.inputName) {
        this.$message.error('请输入角色姓名')
        return
      } else if (this.inputName.trim() === '') {
        this.$message.error('姓名不能全为空')
        return
      } else if (reg.test(this.inputName)) {
        this.$message.error('姓名不能为(-)(_)(——)( )之外的特殊字符')
        return
      }
      this.rolesData.name = this.inputName
      try {
        await roleUpdate(this.rolesData)
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        this.rolesOptions = await roleChannelCode(this.roleForm.channelCode)
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 新增角色名
    async addRoleName() {
      if (!this.roleForm.channelCode) {
        this.$message.error('请选择添加的渠道')
        return
      }
      const reg = /[`~!@#$%^&*()+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）+={}|《》？：“”【】、；‘’，。、]/im
      if (!this.roleForm.name) {
        this.$message.error('请输入角色姓名')
        return
      } else if (this.roleForm.name.trim() === '') {
        this.$message.error('姓名不能全为空')
        return
      } else if (reg.test(this.roleForm.name)) {
        this.$message.error('姓名不能为(-)(_)(——)( )之外的特殊字符')
        return
      }
      try {
        await roleinsertLinked(this.roleForm)
        this.$message({
          message: '新增成功',
          type: 'success'
        })
        this.isAdd = false
        this.rolesOptions = await roleChannelCode(this.roleForm.channelCode)
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 数据渲染
    checkboxRender(arr) {
      arr.forEach(itemOne => {
        if (itemOne.checked) {
          if (!itemOne.children || itemOne.children.length <= 0) {
            return
          }
          const resC = itemOne.children.filter(a => {
            return a.checked === true
          })
          if (resC.length < itemOne.children.length) {
            itemOne.checked = false
            itemOne.selected = true
          }
          itemOne.children.forEach((itemTwo, indexTwo) => {
            if (itemTwo.checked) {
              if (!itemTwo.children || itemTwo.children.length <= 0) {
                return
              }
              const resS = itemTwo.children.filter(a => {
                return a.checked === true
              })
              if (resS.length < itemTwo.children.length) {
                itemTwo.checked = false
                itemTwo.selected = true
                itemOne.checked = false
                itemOne.selected = true
              }
            }
          })
        }
      })
    },
    // 递归函数
    recursionRender(res, data) {
      const getId = arr => {
        arr.forEach(v => {
          if (res === v.key) {
            v.checked = true
          } else {
            if (v.children && v.children.length > 0) {
              getId(v.children)
            }
          }
        })
      }
      getId(data)
    },
    // 递归函数
    recursionArr(data) {
      const res = []
      const getId = arr => {
        arr.forEach(v => {
          if (v.checked || v.selected) {
            res.push({ permissionId: v.key })
          }
          if (v.children && v.children.length > 0) {
            getId(v.children)
          }
        })
      }
      getId(data)
      return res
    },
    // 递归函数
    recursionChildFalse(data) {
      const getId = arr => {
        if (arr.length <= 0) {
          return
        }
        arr.forEach(v => {
          v.checked = false
          v.selected = false
          if (v.children && v.children.length > 0) {
            getId(v.children)
          }
        })
      }
      getId(data)
    },
    // 递归函数
    recursionChild(data) {
      const getId = arr => {
        if (arr.length <= 0) {
          return
        }
        arr.forEach(v => {
          v.checked = true
          v.selected = false
          if (v.children && v.children.length > 0) {
            getId(v.children)
          }
        })
      }
      getId(data)
    },
    // 第一级
    setCheckedOne(item) {
      if (item.selected) {
        item.selected = false
        item.checked = true
      }
      if (item.checked) {
        this.recursionChild(item.children)
      } else {
        this.recursionChildFalse(item.children)
      }
    },
    // 第二级
    setCheckedTwo(item, itemOne) {
      if (item.selected) {
        item.selected = false
        item.checked = true
      }
      if (item.checked) {
        this.recursionChild(item.children)
      } else {
        this.recursionChildFalse(item.children)
      }
      const resC = itemOne.children.filter(a => {
        return a.checked === true
      })
      const resS = itemOne.children.filter(a => {
        return a.selected === true
      })
      if (resC.length <= 0 && resS.length <= 0) {
        itemOne.checked = false
        itemOne.selected = false
      }
      if (
        (resC.length > 0 && resC.length < itemOne.children.length) ||
        resS.length > 0
      ) {
        itemOne.checked = false
        itemOne.selected = true
      }
      if (resC.length >= itemOne.children.length) {
        itemOne.checked = true
        itemOne.selected = false
      }
    },
    // 第三级
    setCheckedThree(item, itemTwo, itemOne) {
      if (item.checked) {
        this.recursionChild(item.children)
      } else {
        this.recursionChildFalse(item.children)
      }
      const resTwo = itemTwo.children.filter(a => {
        return a.checked === true
      })
      if (resTwo.length <= 0) {
        itemTwo.checked = false
        itemTwo.selected = false
      }
      if (resTwo.length > 0 && resTwo.length < itemTwo.children.length) {
        itemTwo.checked = false
        itemTwo.selected = true
      }
      if (resTwo.length >= itemTwo.children.length) {
        itemTwo.checked = true
        itemTwo.selected = false
      }
      const resOneC = itemOne.children.filter(a => {
        return a.checked === true
      })
      const resOneS = itemOne.children.filter(a => {
        return a.selected === true
      })
      if (resOneC.length <= 0 && resOneS.length <= 0) {
        itemOne.checked = false
        itemOne.selected = false
      }
      if (
        (resOneC.length > 0 && resOneC.length < itemTwo.children.length) ||
        resOneS.length > 0
      ) {
        itemOne.checked = false
        itemOne.selected = true
      }
      if (resOneC.length >= itemOne.children.length) {
        itemOne.checked = true
        itemOne.selected = false
      }
    }
  }
}
</script>

<style lang="scss">
.roles-set {
  .el-menu {
    box-sizing: border-box;
    .role-menu-add {
      :hover {
        color: #409eff;
      }
    }
    .el-menu-item {
      border-left: 1px solid rgb(240, 242, 245);
      &:hover {
        background-color: #f0f2f5 !important;
        color: #409eff;
      }
    }
    .el-menu-item.is-active {
      color: #409eff;
      background-color: #fff !important;
    }
    .role-menu-item {
      position: relative;
      .role-menu-icon {
        position: absolute;
        right: 5px;
        top: 50%;
        margin-top: -8px;
        height: 16px;
        width: 16px;
        border: 1px solid #999;
        .el-icon-caret-bottom {
          position: absolute;
          top: 0;
          right: -1px;
          width: 16px;
          height: 16px;
          margin-right: 0;
          font-size: 14px;
          color: #999;
        }
        &:hover {
          border-color: #409eff;
          .el-icon-caret-bottom {
            color: #409eff;
          }
        }
        .role-popover-box {
          position: absolute;
          top: 16px;
          right: 0;
          z-index: 2000;
          display: inline-block;
          width: 80px;
          background-color: #fff;
          color: #000;
          text-align: center;
          box-shadow: 0px 0px 2px 0px #aaa;
          .role-popover-div {
            line-height: 30px;
            height: 30px;
            cursor: pointer;
            &:hover {
              background-color: #409eff;
              color: #fff;
            }
          }
        }
      }
    }
  }
  .role-item-line {
    .el-form-item {
      margin-bottom: 0px;
      &:last-child {
        border-bottom: 1px solid #eee;
      }
    }
  }
  .is-item-line {
    border-top: 1px solid #eee;
  }
}
</style>
