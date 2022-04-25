<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <div v-if="!isCollapse" style="display: flex;background-color:rgb(48,65,86);">
      <img :src="customLogo.logo" style="width:100px;height:40px;margin:20px;" alt>
    </div>
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item
        v-permission="route.meta && route.meta.guard"
        v-for="route in routes"
        v-if="checkSpeicial(route.meta)"
        :key="route.name"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from '@/views/layout/components/Sidebar/SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(['sidebar']),
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否是管理员渠道
    ]),
    routes() {
      const routes = this.$router.options.routes
      // console.log('routes', routes)
      return routes
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    customLogo() {
      return JSON.parse(window.localStorage.getItem('customLogo'))
    }
  },
  methods: {
    checkSpeicial(meta) {
      if (meta) {
        if (meta.isAdmin) return this.isAnyAdminChannel
      }
      return true
    }
  }
}
</script>
