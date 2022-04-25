<template>
  <div :style="boxHeight" class="renewal-error">
    <div :style="boxTranslateY" class="error-content">
      <img class="error-img" src="@/assets/404_images/404_renewal_error.png" alt="404_renewal_error">
      <div class="error-tips">
        <h3 class="title">数据加载失败</h3>
        <p class="desc">非常抱歉，您的数据加载失败</p>
        <p class="desc">请刷新后重试</p>
        <el-button class="btn" type="primary" size="small" @click="onReset">点击刷新</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    boxHeight: {
      type: String,
      default: 'height: 500px;'
    },
    boxTranslateY: {
      type: String,
      default: 'transform: translateY(50%);'
    }
  },
  methods: {
    onReset() {
      this.$emit('reset')
    }
  }
}
</script>
<style lang="scss">
  .renewal-error {
    width: 100%;
    .error-content {
      display: flex;
      align-items: center;
      justify-content: center;
      .error-img {
        width: 280px;
        height: 230px;
      }
      .error-tips {
        margin-left: 50px;
        color: #A3B1BF;
        .title {
          font-size: 26px;
        }
        .desc {
          font-size: 16px;
          margin: 8px 0;
        }
        .btn {
          margin-top: 18px;
        }
      }
    }
  }
</style>
