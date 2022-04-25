<template>
  <div id="app">
    <router-view v-if="isRouterActive"/>
  </div>
</template>

<script>
import mixin from '@/views/dashboard/mixin'
export default {
  name: 'App',
  mixins: [mixin],
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterActive: true
    }
  },
  computed: {
    customLogo() {
      if (window.c_fun_get_str) {
        const code = window.c_fun_get_str('Channel')
        if (code !== 'not found') {
          const codeList = code.split(',')
          const title = codeList.length >= 2 ? codeList[1] : codeList[0]
          const avatar = `//www.ybinsure.com/static/custom_logo/${codeList[0]}/avatar.png`
          const logo = `//www.ybinsure.com/static/custom_logo/${codeList[0]}/logo.png`
          return { avatar, logo, title }
        } else {
          return {
            avatar: '//www.ybinsure.com/static/custom_logo/yuebao/avatar.png',
            logo: '//www.ybinsure.com/static/custom_logo/yuebao/logo.png',
            title: '悦保科技'
          }
        }
      } else {
        return {
          avatar: '//www.ybinsure.com/static/custom_logo/yuebao/avatar.png',
          logo: '//www.ybinsure.com/static/custom_logo/yuebao/logo.png',
          title: '悦保科技'
        }
      }
    }
  },
  created() {
    this.initQuickIssue()
    window.document.querySelector('title').innerHTML = this.customLogo.title
    window.localStorage.setItem('customLogo', JSON.stringify(this.customLogo))
  },
  methods: {
    reload() {
      this.isRouterActive = false
      this.$nextTick(function() {
        this.isRouterActive = true
      })
    }
  }
}
</script>
<style lang="scss">
@import '~@/components/ElTreeSelectLib/style/tree-select.scss';
</style>
