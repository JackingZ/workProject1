<template>
  <el-card class="cardInfo" shadow="hover">
    <slot/>
  </el-card>
</template>
<style lang="scss">
.dashboard{
  .cardInfo{
    display: inline-block;
    width: 220px;
    height: 130px;
    margin-right: 10px;
    cursor: pointer;
  }
}
</style>
