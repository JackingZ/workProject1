<template>
  <div class="card-wrap">
    <card-info
      v-for="(item, key) in data"
      :key="key">
      <div class="title">{{ item.title }}</div>
      <div class="count">{{ item.count }}</div>
      <div class="qoq">
        环比
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
          {{ item.percent }}%
        </span>
        <span v-else-if="item.percent === 'loading'" style="font-size: 13px;color:#888;">未查询</span>
        <span v-else style="font-size: 13px;color:#888;">上期数据为空，无法环比</span>
      </div>
    </card-info>
  </div>
</template>
<script>
import CardInfo from '@/views/dashboard/cardInfo'
export default {
  components: {
    CardInfo
  },
  props: {
    data: {
      type: Object,
      default: () => {}
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
 .dashboard {
  .card-wrap{
    margin: 15px 0;
    white-space: nowrap;
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
      font-size: 15px;
    }
    .percent{
      margin-left: 10px;
    }
    .increase{
      margin-left: 10px;
      color: #ff0000;
    }
    .decrease{
      margin-left: 10px;
      color: #009900;
      .icon{
      }
    }
    .icon{
      width: 14px;
    }
  }
}
</style>
