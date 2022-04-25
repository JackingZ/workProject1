<template>
  <span :class="{ 'is-checked': isActive, 'normal': !isActive, 'disabledColor': disabled }" class="my-switch" @click="toggle">
    <span v-if="isActive" class="text">{{ enableText }}</span>
    <span v-if="!isActive" class="text normalText">{{ disableText }}</span>
    <span class="ball"/>
  </span>
</template>
<script>
export default {
  props: {
    activeValue: {
      type: [String, Number, Boolean],
      default: true
    },
    inactiveValue: {
      type: [String, Number, Boolean],
      default: false
    },
    value: {
      type: [String, Number, Boolean],
      default: false
    },
    enableText: {
      type: String,
      default: '启用'
    },
    disableText: {
      type: String,
      default: '禁用'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isActive() {
      return this.value === this.activeValue
    }
  },
  methods: {
    toggle() {
      if (!this.disabled) {
        this.$emit('input', this.isActive ? this.inactiveValue : this.activeValue)
      }
    }
  }
}
</script>
<style lang="scss">
  .disabledColor {
    cursor: not-allowed!important;
  }
.my-switch{
  position: relative;
  display: inline-block;
  width: 60px;
  height: 22px;
  line-height: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 12px;
  cursor: pointer;
  &.is-checked{
    border-color: #409EFF;
    background-color: #409EFF;
    .text{
      color: white;
    }
    .ball{
      background: white;
      transform: translateX(38px);
    }
  }
  &.normal{
    background: white;
    .normalText{
      color: #999999;
      text-align: right;
    }
  }
  .text{
    display: inline-block;
    width: 100%;
    padding: 0 6px;
    font-size: 13px;
  }
  .ball{
    position: absolute;
    width: 16px;
    height: 16px;
    top: 2px;
    border-radius: 12px;
    transition: all 0.2s;
    background: #CDCDCD;
    left: 2px;
  }
}
</style>
