<template>
  <!-- zhengjie - 2018-9-4 -->
  <div class="issue-start-app">
    <div ref="iframeContainer" class="issue-start-iframe">
      <iframe id="topFrame" :src="issueUrl" frameborder="0" name="startFrame" noresize="noresize" scrolling="No" width="480px" style="height:100%;"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMockLoginFunc } from '@/utils/mobileLogin'
export default {
  name: 'QuickIssue',
  data() {
    const getUrl = getMockLoginFunc(this)
    return {
      domElement: null,
      isCarDealer: false,
      carLicense: '',
      frameNo: '',
      issueUrl: getUrl()
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否管理员渠道
    ])
  }
  // created() {
  //   const salesman = sessionStorage.getItem('SalesmanInfo')
  //   window.site_title = salesman ? `移动出单-${salesman.idName}&${salesman.phone}` : '移动出单'
  // }
}
</script>

<style lang="scss">
  .issue-start-app {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #f5f7fa;
    overflow: auto;
    .issue-start-iframe {
      margin: 50px auto 0px;
      width: 480px;
      height: 90%;
      padding-bottom: 20px;
    }
  }
</style>
