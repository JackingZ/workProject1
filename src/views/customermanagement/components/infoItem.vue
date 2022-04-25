<template>
  <div class="info-item">
    <div v-if="title" class="info-item-title">{{ title }}：</div>
    <div class="info-item-content">
      <template v-if="showText">
        {{ isAssignStr(text) ? text : '--' }}
      </template>
      <slot/>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    text: {
      type: [String, Number],
      default: ''
    },
    showText: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    isAssignStr(data) {
      return data !== undefined && data !== null && data !== ''
    }
  }
}
</script>
<style lang="scss">
.risk-detail {
  .info-item{
    display: flex;
    flex: 1;
    font-size: 14px;
    line-height: 32px;
  }
  .info-item-title{
    width: 120px;
    text-align: right;
  }
  .info-item-content{
    flex: 1;
  }
}
</style>
