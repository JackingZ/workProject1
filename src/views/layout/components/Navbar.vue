<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <breadcrumb />
    <el-dropdown class="avatar-container" trigger="click">
      <!-- <div class="avatar-wrapper">
        <img src="@/assets/imgs/right-logo.png" class="user-avatar">
        <div>asdasd</div>
        <i class="el-icon-caret-bottom"/>
      </div> -->
      <div class="user-wrap">
        <img :src="customLogo.avatar" class="icon">
        <span class="username">{{ channelName }} - {{ nickName }}</span>
        <i class="el-icon-caret-bottom"/>
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            首页
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span style="display:block;" @click="updatePassword">修改密码</span>
        </el-dropdown-item>
        <el-dropdown-item>
          <span style="display:block;" @click="logout">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      title="提示"
      width="30%">
      <el-form ref="pwdForm" :model="inputForm" :rules="rules" label-width="100px">
        <el-form-item label="当前密码" prop="old">
          <el-input v-model="inputForm.old"/>
        </el-form-item>
        <el-form-item label="新密码" prop="new1">
          <el-input v-model="inputForm.new1"/>
        </el-form-item>
        <el-form-item label="确认新密码" prop="new2">
          <el-input v-model="inputForm.new2"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePassword } from '@/api/login'
import MD5 from 'md5.js'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    const checkPass = (rule, value, callback) => {
      if (value !== this.inputForm.new1) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      inputForm: {
        old: '',
        new1: '',
        new2: ''
      },
      pwdForm: {
        sourcePassWord: null,
        newPassword: null
      },
      rules: {
        old: [
          { required: true, message: '请输入旧密码', trigger: 'change' },
          { min: 6, message: '密码至少6位', trigger: 'change' }
        ],
        new1: [
          { required: true, message: '请输入新密码', trigger: 'change' },
          { min: 6, message: '密码至少6位', trigger: 'change' }
        ],
        new2: [
          { required: true, message: '请确认新密码', trigger: 'change' },
          { min: 6, message: '密码至少6位', trigger: 'change' },
          { validator: checkPass, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
    nickName() {
      const data = this.$store.state.user.userAll.data
      return data.idName || data.nickName
    },
    channelName() {
      return JSON.parse(localStorage.getItem('userAll')).data.belongCompanys[0].name || ''
    },
    customLogo() {
      return JSON.parse(window.localStorage.getItem('customLogo'))
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('FedLogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    updatePassword() {
      console.log(12)
      this.dialogVisible = true
    },
    handleClose() {
      this.$refs.pwdForm.resetFields()
      this.dialogVisible = false
    },
    handleConfirm() {
      this.$refs.pwdForm.validate(valid => {
        if (!valid) return
        const sourcePassWord = new MD5().update(this.inputForm.old).digest('hex')
        const newPassword = new MD5().update(this.inputForm.new1).digest('hex')
        updatePassword(sourcePassWord, newPassword)
          .then(res => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.handleClose()
          })
          .catch(err => {
            this.$message({
              message: err,
              type: 'warning'
            })
          })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .user-wrap{
    display: flex;
    align-items: center;
    &:active{
      background: #eee;
    }
    .icon{
      width: 30px;
      height: 30px;
      margin-right: 5px;
    }
    .username {
      margin-right: 5px;
    }
    i {
      font-size: 18px;
    }
  }
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

