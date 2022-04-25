<template>
  <div :style="{height: _strokeWidth + 'px'}" class="my_progress_wrap">
    <div
      :style="{width: _percentage + '%', lineHeight: _strokeWidth + 'px'}"
      :class="{progress_animate: isActive}"
      class="progress"
    >
      <div class="text">{{ _percentage }}%</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyProgress',
  props: {
    /**
     * Pass in the percentage to be displayed
     */
    percentage: {
      type: Number,
      default: 0
    },
    /**
     * The width of the progress bar
     */
    strokeWidth: {
      type: Number,
      default: 6
    }
  },
  computed: {
    isActive() {
      return this.percentage < 100
    },
    _percentage() {
      return this.percentage <= 100 ? this.percentage : 100
    },
    _strokeWidth() {
      return this.strokeWidth
    }
  }
}
</script>

<style lang="scss" scoped>
.my_progress_wrap {
  width: 100%;
  border-radius: 100px;
  overflow: hidden;
  vertical-align: middle;
  position: relative;
  background-color: #ebeef5;
  .progress {
    position: absolute;
    left: 0;
    top: 0;
    font-size: 12px;
    color: #fff;
    height: 100%;
    background-color: #67c23a;
    text-align: right;
    border-radius: 100px;
    white-space: nowrap;
    transition: width 0.6s ease;
    .text {
      margin: 0 5px;
      vertical-align: middle;
      display: inline-block;
    }
  }
  .progress_animate {
    background-image: repeating-linear-gradient(
      -45deg,
      #67c23a,
      #67c23a 10px,
      rgba(255, 255, 255, 0.3) 10px,
      rgba(255, 255, 255, 0.3) 20px
    );
    animation: barberpole 12s linear infinite;
  }
}
@keyframes barberpole {
  0% {
    background-position: 0%, 0%;
  }
  100% {
    background-position: 600px 0%;
  }
}
</style>
