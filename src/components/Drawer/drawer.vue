<template>
  <div :class="isShow ? '' : 'drawer-disable'" class="drawer-container">
    <!-- <transition name="modal"> -->
    <div :class="isShow ? 'drawer-open' : ''" class="modal" @click="maskClosable ? close() : false"/>
    <!-- </transition> -->
    <!-- <transition name="mod"> -->
    <div :style="drawerStyle" :class="isShow ? '' : 'move-out'" class="drawer-wrap">
      <div class="drawer-header">
        <div class="title">{{ drawerTitle }}</div>
        <slot name="afterTitle" />
        <div class="close" @click="close">✖</div>
      </div>
      <div class="drawer-body">
        <slot/>
      </div>
      <div v-if="!noButton" class="drawer-footer">
        <template v-if="onlyClose">
          <el-button size="small" type="primary" @click="close">关闭</el-button>
        </template>
        <template v-else>
          <el-button size="small" @click="close">{{ cancelText }}</el-button>
          <el-button :loading="requestLoading" type="primary" size="small" @click="confirm">{{ confirmText }}</el-button>
        </template>
      </div>
    </div>
    <!-- </transition> -->
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    onlyClose: {
      type: Boolean,
      default: false
    },
    noButton: {
      type: Boolean,
      default: false
    },
    isShow: {
      type: Boolean,
      default: false
    },
    drawerTitle: {
      type: String,
      default: '标题'
    },
    drawerStyle: {
      type: String,
      default: 'width: 720px;'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    maskClosable: {
      type: Boolean,
      default: true
    },
    requestLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    close() {
      this.$emit('drawerClose')
    },
    confirm() {
      this.$emit('drawerConfirm')
    }
  }
}
</script>

<style scoped lang="scss">
  .drawer-disable{
    pointer-events: none;
  }
  .drawer-container{
    .modal{
      height: 100%;
      width: 100%;
      position: fixed;
      overflow: hidden;
      background-color: #000000;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 2000;
      opacity: 0;
      transition: opacity .3s cubic-bezier(.78,.14,.15,.86);
      &.drawer-open{
        opacity: 0.3;
      }
    }
    .drawer-wrap{
      height: 100%;
      position: fixed;
      right: 0;
      top: 0;
      background-color: #ffffff;
      box-shadow: -2px 0 8px rgba(0,0,0,.15);
      z-index: 2000;
      transition: transform .3s cubic-bezier(.78,.14,.15,.86);
    }
    .move-out{
      transform: translateX(100%);
    }
    .drawer-body{
      height: calc(100% - 110px);
      overflow: auto;
      scroll-behavior: smooth;
    }
    .drawer-footer{
      padding: 0 16px;
      text-align: right;
      line-height: 55px;
      border-top: 1px solid #e8e8e8;
    }
    .drawer-header{
      padding: 16px 24px;
      position: relative;
      border-bottom: 1px solid #e8e8e8;
      .title{
        margin: 0;
        font-size: 16px;
        line-height: 22px;
        font-weight: 500;
        color: rgba(0,0,0,.85);
      }
      .head-btn {
        position: absolute;
        left: 100px;
        top: 16.5px;
      }
      .close{
        cursor: pointer;
        border: 0;
        background: 0 0;
        width: 56px;
        height: 56px;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 10;
        font-weight: 400;
        line-height: 56px;
        font-size: 20px;
        text-align: center;
        text-decoration: none;
        color: rgba(0,0,0,.45);
        outline: 0;
        padding: 0;
      }
    }
  }
  .mod-enter-active{
    // transition: transform .3s cubic-bezier(.78,.14,.15,.86);
    will-change: transform;
    transition: transform .3s ease;
  }
  .mod-leave-active{
    // transition: transform .25s cubic-bezier(.78,.14,.15,.86);;
    will-change: transform;
    transition: transform .25s ease;
  }
  .mod-enter, .mod-leave-to{
    // will-change: transform;
    transform: translate3d(100%, 0, 0);
    /*opacity: 0;*/
  }
  .modal-enter-active, .modal-leave-active{
    transition: all .3s ease;
  }
  .modal-enter, .modal-leave-to{
    opacity: 0;
  }
</style>
