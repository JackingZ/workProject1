<template>
  <div class="refresh-card">
    <el-card v-if="isLargeCard" class="box-card">
      <div slot="header" class="clearfix">
        <span>刷新续保（{{ completeCount }}/{{ totalCount }}）</span>
        <el-button v-show="completeCount===totalCount" class="refresh-btn" type="text" @click="closeCard"><i class="el-icon-close" /></el-button>
        <el-button class="refresh-btn" style="margin-right:10px;" type="text" @click="shrinkCard"><i class="el-icon-minus"/></el-button>
      </div>
      <div v-for="item in refreshList" :key="item.id" class="text item">
        <div style="width:70px;">{{ item.licenseNo ? item.licenseNo : '----' }}{{ item.status }}</div>
        <div style="flex=1">
          <div v-if="item.type === '1'" style="text-align:center;width:79px;">
            <i><img src="@/assets/imgs/loading.gif" alt=""></i>
            <span>正在查询</span>
          </div>
          <div v-else-if="item.type === '2'">
            <i><img src="@/assets/imgs/loading.gif" alt=""></i>
            <span style="margin-left:5px;">排队中...</span>
          </div>
          <div v-else-if="item.type==='3'" style="color: #00BC0D;">
            <i class="el-icon-check"/>
            <span>刷新完成</span>
          </div>
          <div v-else-if="item.type==='4'" style="color: #FF0000;">
            <i class="el-icon-close"/>
            <span>续保失败</span>
          </div>
        </div>
        <div style="width:14px;"><i v-show="item.type==='2'" class="el-icon-delete" @click="deleteClick(item.licenseNo)" /></div>
      </div>
    </el-card>
    <el-card v-if="!isLargeCard" class="tiny-card">
      <div class="infresh clearfix">
        <span>正在刷新续保 ({{ completeCount }}/{{ totalCount }})</span>
        <el-button v-show="completeCount===totalCount" class="refresh-btn" type="text" @click="closeCard"><i class="el-icon-close" /></el-button>
        <el-button class="refresh-btn" style="margin-right:10px;" type="text" @click="shrinkCard"><span class="iconfont">&#xe792;</span></el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'RefreshRenew',
  props: {
    refreshInfo: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      isLargeCard: true,
      refreshList1: [
        {
          status: '3',
          licenseNo: 'test'

        }
      ]
    }
  },
  computed: {
    ...mapGetters(['refreshList']),
    // refreshList() {
    //   return this.refreshInfo || []
    // },
    totalCount() {
      return this.refreshList.length
    },
    completeCount() {
      const arr = this.refreshList.filter(item => {
        return item.type === '3' || item.type === '4'
      })
      return arr.length
    }
  },
  watch: {
    // 'refreshInfo': {
    //   deep: true,
    //   handler(newVal) {
    //     console.log('刷新续保监听', newVal)
    //   }
    // },
    // refreshList(newVal) {
    //   console.log('数据变化了')
    // }
  },
  methods: {
    // 关闭刷新续保的窗口
    closeCard() {
      this.$emit('close')
    },
    // 缩小刷新续保窗口
    shrinkCard() {
      this.isLargeCard = !this.isLargeCard
    },
    // 删除排队中的数据
    deleteClick(val) {
      console.log('需要删除的车牌号', val)
      this.$emit('deleteRefreshData', val)
    }
  }
}
</script>
<style lang="scss">
.refresh-card{
    position: fixed;
    right:10px;
    bottom:20px;
    z-index:99;
    .text {
        font-size: 14px;
    }
    .item {
        // margin-bottom: 18px;
        height:35px;
        line-height:35px;
        border-bottom:1px solid #e6e6e6;
        display:flex;
        justify-content:space-between;
        align-items:center;
    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
    .refresh-btn{
        float: right;
        padding: 3px 0;
        font-size:20px;
        color:#333333;
    }
    .box-card {
        width: 300px;
        height:400px;
    }
    .el-card__header{
        padding:10px 18px;
    }
    .clearfix{
        // vertical-align: middle;
        line-height:30px;
        height:30px;
    }
    .el-card__body{
        padding:10px 20px;
    }
    .tiny-card{
        width: 300px;
        height:50px;
        // line-height:50px;
        position: fixed;
        right:10px;
        bottom:20px;
        z-index:99;
        .clearfix:before,
        .clearfix:after {
            display: table;
            content: "";
        }
        .clearfix:after {
            clear: both
        }
    }
    .el-card__body{
      height: 360px;
      overflow: auto;
    }
}

</style>
