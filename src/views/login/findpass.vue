<template>
  <div class="findpass">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div style="display: flex;flex-flow: row nowrap;justify-content: center;align-items: center">
        <img src="@/assets/imgs/login-logo.png" style="width: 44px;height: 44px;margin-right: 10px;" alt="">
        <h3 class="title">悦保科技</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="loginForm.username" name="username" type="text" auto-complete="on" placeholder="请输入登录名" />
      </el-form-item>
      <el-row>
        <el-col :span="17">
          <el-form-item prop="code">
            <span class="svg-container svg-container_login">
              <svg-icon icon-class="user" />
            </span>
            <el-input v-model="loginForm.code" name="username" type="text" auto-complete="on" placeholder="请输入验证码" />
          </el-form-item>
        </el-col>
        <el-col :span="7" style="text-align: right;">
          <el-button class="get-code" @click="getCode">获取验证码</el-button>
        </el-col>
      </el-row>
      <el-form-item prop="password">
        <span class="svg-container" style="padding-left: 15px;">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          placeholder="密码"
          @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
          提交
        </el-button>
      </el-form-item>
      <el-row style="margin-bottom: 22px;padding: 0 2px;">
        <el-col :span="24">
          <div style="text-align: right;color: #409EFF;font-size: 14px;">
            <router-link to="/login">
              返回登录
            </router-link>
          </div>
        </el-col>
      </el-row>
      <div style="font-size: 14px;color: #999999;text-align: center;position: relative;top: -10px;">Copyright © 2019 悦保科技</div>
    </el-form>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import { getFindPassCode, subFindPass } from '@/api/number'
import MD5 from 'md5.js'

export default {
  name: 'Findpass',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error('验证码必须是6位'))
      } else {
        callback()
      }
    }
    return {
      checked: true,
      loginForm: {
        username: '',
        password: '',
        code: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'change', validator: validateUsername }],
        password: [{ required: true, trigger: 'change', validator: validatePass }],
        code: [{ required: true, trigger: 'change', validator: validateCode }]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  created() {
    console.log(process.env)
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
        if (!valid) return
        const pwd = new MD5().update(this.loginForm.password).digest('hex')
        subFindPass({
          captcha: this.loginForm.code,
          password: pwd,
          userName: this.loginForm.username
        })
          .then(res => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.$router.replace('login')
          })
          .catch(err => {
            this.$message.error(err)
          })
      })
    },
    getCode() {
      if (this.loginForm.username === '' || this.loginForm.username === null) {
        this.$message.error('请先填写登陆名')
        return
      }
      getFindPassCode(this.loginForm.username)
        .then(res => {
          this.$message({
            message: '发送成功',
            type: 'success'
          })
        })
        .catch(err => {
          this.$message.error(err)
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg:#fafafa;
  $light_gray:#333333;

  /* reset element-ui css */
  .findpass {
    .el-form-item__content{
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

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg:#efeff4;
  $dark_gray:#333333;
  $light_gray:#555555;
  .findpass {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .get-code{
      height: 36px;
      line-height: 36px;
      padding: 0px 20px;
    }
    .login-form {
      background-color: #fafafa;
      position: absolute;
      left: 0;
      right: 0;
      width: 460px;
      height: 460px;
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
