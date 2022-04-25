<template>
  <el-card class="cardInfo" shadow="hover">
    <div class="title">{{ item.title }}</div>
    <div class="count">{{ item.count }}</div>
    <div class="qoq">
      环比{{ date.length === 2 ? `(${date[0]}至${date[1]})` : '' }}
      <!-- 上期数据为0，无法环比 -->
      <span
        v-if="parseFloat(item.percent) === 0"
        class="percent">持平</span>
      <span
        v-else-if="isNumber(item.percent)"
        :class="parseFloat(item.percent) > 0 ? 'increase' : 'decrease'">
        <img
          v-if="parseFloat(item.percent) > 0"
          src="@/assets/imgs/increase.svg"
          class="icon">
        <img
          v-if="parseFloat(item.percent) < 0"
          src="@/assets/imgs/decrease.svg"
          class="icon">
        {{ parseFloat(item.percent) >= 0 ? item.percent : item.percent.toString().replace('-', '') }}%
      </span>
      <span v-else-if="item.percent === 'loading'" style="font-size: 13px;color:#888;">未查询</span>
      <span v-else style="font-size: 13px;color:#888;">上期数据为空，无法环比</span>
    </div>
  </el-card>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    date: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    isNumber(val) {
      val = parseFloat(val)
      return typeof val === 'number' && !isNaN(val)
    }
  }
}
</script>

<style lang="scss">
.business-state{
  .cardInfo{
    display: inline-block;
    width: 305px;
    height: 130px;
    margin-right: 10px;
    cursor: pointer;
    .title{
      font-size: 14px;
      font-weight: bold;
      margin-top: 5px;
    }
    .count{
      font-size: 22px;
      margin-top: 5px;
    }
    .qoq{
      margin-top: 10px;
      font-size: 14px;
    }
    .percent{
      margin-left: 10px;
    }
    .increase{
      margin-left: 3px;
      color: #ff0000;
    }
    .decrease{
      margin-left: 3px;
      color: #009900;
      .icon{
        vertical-align: bottom;
      }
    }
    .icon{
      width: 14px;
    }
  }
}
</style>
