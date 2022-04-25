<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="logo"><svg-icon icon-class="logosvg" /></div>
      <h3 class="title"><span>欢迎使用悦保科技保险系统平台</span></h3>
      <!-- <h3 class="title">悦保科技</h3> -->
      <el-form-item prop="username" class="hoverbg">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="loginForm.username" name="username" type="text" auto-complete="on" placeholder="用户名" />
      </el-form-item>
      <el-form-item prop="password" class="hoverbg">
        <span class="svg-container">
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
          <svg-icon v-if="pwdType=='password'" icon-class="eye02" />
          <svg-icon v-else icon-class="eye" />
        </span>
      </el-form-item>
      <el-row style="margin-bottom: 22px;padding: 0 2px;">
        <el-col :span="12">
          <el-checkbox v-model="checked"><span style="color: #555;">记住密码</span></el-checkbox>
        </el-col>
        <el-col :span="12">
          <div style="text-align: right;color: #555;font-size: 14px;">
            <router-link to="/findpassword">
              找回密码
            </router-link>
          </div>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
      <div style="font-family:arial;font-size:14px;color:#888; text-align:center;">Copyright &copy; 2019 悦保科技</div>
    </el-form>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import { isMobileNumber } from '@/utils/pattern'
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
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!isMobileNumber.test(value)) callback()
              else callback(new Error('登录名不能是手机号码'))
            }
          }
        ],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  created() {
    const remember = localStorage.getItem('remember')
    if (!remember) return
    const result = JSON.parse(remember)
    this.checked = result.c
    this.loginForm.username = result.a
    this.loginForm.password = result.p
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
          this.$store
            .dispatch('Login', this.loginForm)
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
        p: this.loginForm.password
      }
      localStorage.setItem('remember', JSON.stringify(remember))
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #888;
      height: 47px;
      font-weight: 600;
      &:-webkit-autofill {
        transition: all 0.5s linear;
        -webkit-box-shadow: 0 0 0px 1000px #e5e5e5 inset !important;
        -webkit-text-fill-color: #555 !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .el-button--primary:focus,
  .el-button--primary:hover {
    background: #007dff;
  }
}
.hoverbg:hover{
  background: #fff;
 input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: #555 !important;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 520px;
    padding: 35px 35px 25px 35px;
    margin: -300px auto auto -260px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
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
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    display: inline-block;
    border-right: 1px solid #cfd2d6;
    width: 46px;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 20px;
    font-weight: 400;
    color: #555;
    margin: 0px auto 30px auto;
    text-align: center;
    font-weight: bold;
    span {
      background: #409eff;
      padding: 4px 20px;
      border-radius: 80px;
      color: #fff;
    }
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
.login-container:before {
  // background: url(https://api.i-meto.com/bing) center center no-repeat;
  background: url(~@/assets/imgs/indexbg.jpg) center center no-repeat;
  background-attachment: fixed;
  background-size: cover;
  width: 100%;
  height: 100%;
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1; /*-1 可以当背景*/
  opacity: 0.8;
  // -webkit-filter: blur(3px);
  // filter: blur(3px);
}
.logo {
  width: 100%;
  text-align: center;
  .svg-icon {
    font-size: 240px;
    height: 120px;
    color: #409eff;
  }
}
.hoverbg {
  transition: all 0.5s linear;
}
.hoverbg:hover {
  border: 1px solid #aaa;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1) inset;
}
.loginbtn {
  width: 100%;
  padding: 16px 20px;
  font-size: 18px;
  transition: all 0.5s linear;
}
.loginbtn:hover {
  border: 1px solid #3496fb;
  font-weight: bold;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>

