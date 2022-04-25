<template>
  <el-dialog :visible.sync="show" :title="title" width="600px" class="imageView">
    <div class="img-wrap">
      <img v-if="url" :src="url" :alt="title">
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'Imageview',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: [String, Number],
      default: ''
    },
    url: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss">
.imageView{
  .img-wrap{
    text-align: center;
    height: 500px;
    overflow: auto;
  }
  img {
    width: 85%;
  }
  .el-dialog__body{
    text-align: center;
  }
}
</style>
