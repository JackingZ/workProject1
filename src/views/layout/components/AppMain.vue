<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- or name="fade" -->
      <!-- <router-view :key="key"></router-view> -->
      <keep-alive :exclude="['Issuecenter','Upstreamrecord','PermissionRoles','Upstream','Orgstream','Salestream', 'QuickIssue', 'Mytask', 'Mytask02', 'CustomerDetail', 'Grandstand', 'Orderlist', 'Policylist', 'QueryInsured']">
        <router-view :key="$route.fullPath"/>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
/**
 * 排除缓存
 * ['Issuecenter','Upstreamrecord','PermissionRoles','Upstream','Orgstream','Salestream', 'QuickIssue', 'Mytask', 'Mytask02', 'CustomerDetail', 'Renewal', 'Grandstand', 'Orderlist', 'Policylist']
 */
export default {
  name: 'AppMain',
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 84px);
  position: relative;
  overflow: hidden;
}
</style>
