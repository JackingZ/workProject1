<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div style="display: flex;flex-flow: row nowrap;justify-content: center;align-items: center">
        <img :src="customLogo.avatar" style="width: 44px;height: 44px;margin-right: 10px;" alt>
        <h3 class="title">{{ customLogo.title }}</h3>
      </div>
      <el-form-item class="clear" prop="channel">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="source_icon"/>
        </span>
        <el-input
          :disabled="disabledChannelInput"
          v-model="loginForm.channel"
          name="channel"
          type="text"
          auto-complete="on"
          placeholder="请输入渠道号"
        />
        <el-button class="clear" size="small" icon="el-icon-circle-close" @click="clear"/>
      </el-form-item>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          v-model="loginForm.username"
          name="username"
          type="text"
          auto-complete="on"
          placeholder="请输入用户名"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container" style="padding-left: 15px;">
          <svg-icon icon-class="password"/>
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          placeholder="请输入密码"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye"/>
        </span>
      </el-form-item>
      <el-row style="margin-bottom: 22px;padding: 0 2px;">
        <el-col :span="12">
          <el-checkbox v-model="checked">
            <span style="color: #409EFF;">记住密码</span>
          </el-checkbox>
        </el-col>
        <el-col :span="12">
          <!-- <div style="text-align: right;color: #999999;font-size: 14px;">
            <router-link to="/findpassword">
              找回密码
            </router-link>
          </div>-->
        </el-col>
      </el-row>
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >登录</el-button>
      </el-form-item>
      <!-- <div style="font-size: 14px;color: #999999;text-align: center;position: relative;top: 30px;">Copyright © {{ currentYear }} 悦保科技</div> -->
    </el-form>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
// import { isMobileNumber } from '@/utils/pattern'
import { queryInnerCode } from '@/api/login'
import { Message } from 'element-ui'
import dayjs from 'dayjs'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      checked: true,
      loginForm: {
        channel: '',
        username: '',
        password: ''
      },
      loginRules: {
        channel: { required: true, trigger: 'blur', message: '请输入渠道号' },
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
          // {
          //   trigger: 'blur',
          //   validator: (rule, value, callback) => {
          //     if (!isMobileNumber.test(value)) callback()
          //     else callback(new Error('登录名不能是手机号码'))
          //   }
          // }
        ],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password',
      hasOldChannelCode: false // 第二次登录显示渠道简称 这个用来记录真正的渠道编码
    }
  },
  computed: {
    disabledChannelInput() {
      return this.hasOldChannelCode
    },
    currentYear() {
      return dayjs().year()
    },
    customLogo() {
      return JSON.parse(window.localStorage.getItem('customLogo'))
    }
  },
  created() {
    console.log('customLogo:', this.customLogo)
    const remember = localStorage.getItem('remember')
    if (!remember) return
    const result = JSON.parse(remember)
    this.checked = result.c
    this.loginForm.username = result.a
    this.loginForm.password = result.p
    if (result.channel) {
      this.hasOldChannelCode = true
      this.loginForm.channel = result.channel
    } else this.loginForm.channel = result.channel
    // 清除登陆状态
    this.$store.dispatch('FedLogOut')
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          queryInnerCode(this.loginForm.channel)
            .then(res => {
              if (res && res.status === 200) {
                this.$store
                  .dispatch('Login', {
                    userInfo: this.loginForm,
                    channelCode: res.data
                  })
                  .then(r => {
                    this.loading = false
                    // 获取用户信息
                    this.$store.dispatch('GetAll')
                    this.$store.dispatch('GetInfo').then(res => {
                      this.$router.replace({ path: '/' })
                      this.rememberPassword()
                    })
                  })
                  .catch(e => {
                    this.loading = false
                  })
              } else {
                this.loading = false
                Message({
                  message: '该渠道号不存在, 请输入正确的渠道号',
                  type: 'error',
                  duration: 5 * 1000
                })
              }
            })
            .catch(e => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 记住账号密码
    rememberPassword() {
      if (!this.checked) return
      const remember = {
        c: this.checked,
        a: this.loginForm.username,
        p: this.loginForm.password,
        channel: this.loginForm.channel
      }
      localStorage.setItem('remember', JSON.stringify(remember))
    },
    clear() {
      this.hasOldChannelCode = false
      this.loginForm.channel = ''
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #fafafa;
$light_gray: #333333;

/* reset element-ui css */
.login-container {
  .el-form-item__content {
    line-height: 30px;
    height: 34px;
  }
  .el-input {
    display: inline-block;
    height: 34px;
    width: 85%;
    padding: 0;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      color: $light_gray;
      height: 34px;
      line-height: 34px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $light_gray !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(217, 217, 217, 1);
    background-color: transparent;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
$bg: #efeff4;
$dark_gray: #333333;
$light_gray: #555555;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .clear {
    svg {
      width: 0.8em;
      height: 0.8em;
      margin-left: 2px;
    }
    .el-button {
      position: absolute;
      right: 0;
      top: 0;
      border: 1px solid transparent;
      background: transparent;
      padding-right: 10px;
      color: #808080;
      i {
        font-size: 16px;
      }
    }
    .el-input.is-disabled .el-input__inner {
      color: #606266;
      background-color: transparent;
    }
  }
  .login-form {
    background-color: #fafafa;
    position: absolute;
    left: 0;
    right: 0;
    width: 460px;
    height: 480px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 2px 12px 0px 12px;
    color: $dark_gray;
    vertical-align: top;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 33px;
    font-weight: 400;
    color: $light_gray;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
