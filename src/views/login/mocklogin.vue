<template>
  <div v-loading="isLoading" class="login-container" style="width: 100%; height: 100vh;"/>
</template>

<script>
import { queryInnerCode } from '@/api/login'
import { Message } from 'element-ui'
import { setToken, setTokenType } from '@/utils/auth'
export default {
  name: 'Login',
  data() {
    return {
      isLoading: true
    }
  },
  async created() {
    console.log(this.$route.query)
    if (this.$route.query.token && this.$route.query.type) {
      setToken(this.$route.query.token)
      setTokenType(this.$route.query.type)
      this.$store.commit('SET_TOKEN', this.$route.query.token)
      this.$store.commit('SET_TOKEN_TYPE', this.$route.query.type)
      this.$store.dispatch('GetAll')
      this.$store.dispatch('GetInfo').then(res => {
        this.$router.replace({ path: '/' })
      })
    } else {
      this.$router.replace('dashboard')
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          queryInnerCode(this.loginForm.channel).then(res => {
            if (res && res.status === 200) {
              this.$store.dispatch('Login', {
                userInfo: this.loginForm,
                channelCode: res.data
              }).then((r) => {
                this.loading = false
                // 获取用户信息
                this.$store.dispatch('GetAll')
                this.$store.dispatch('GetInfo').then(res => {
                  this.$router.replace({ path: '/' })
                  this.rememberPassword()
                })
              }).catch((e) => {
                this.loading = false
              })
            } else {
              this.loading = false
              Message({
                message: '渠道号不存在, 请输入正确的渠道号',
                type: 'error',
                duration: 3 * 1000
              })
            }
          }).catch(e => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
</style>
