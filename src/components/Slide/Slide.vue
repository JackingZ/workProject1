<template>
  <div :class="[isActive ? 'slide-active' : 'slide-close']" style="margin: 15px 0;position: relative;background-color: #fff;transition: all .3s ease;">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'Slide',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggle() {
      this.isActive = !this.isActive
    }
  }
}
</script>

<style lang="scss">
  .slide-active {
    height: calc(100vh - 114px);
    width: 270px;
    padding: 15px;
    overflow: auto;
    .el-tree-node>.el-tree-node__children{
      overflow: visible;
    }
  }
  .slide-close {
    height: calc(100vh - 123px);
    width: 0;
    opacity: 0;
  }
</style>
