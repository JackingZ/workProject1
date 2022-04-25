<template>
  <vue-treeselect v-bind="$attrs" v-on="$listeners"/>
</template>
<script>
import VueTreeselect from '@riophae/vue-treeselect'
export default {
  components: {
    VueTreeselect
  },
  inheritAttrs: false
}
</script>
<style lang="scss">
  .vue-treeselect__label {
    overflow: initial;
  }
  .vue-treeselect__list-item {
    display: inline-block;
  }
  .vue-treeselect__menu {
    max-width: 100%;
    overflow: auto;
  }
  .vue-treeselect__control-arrow{
    display: none;
  }
  .vue-treeselect--open {
    .vue-treeselect__control-arrow-container {
      transform: rotateZ(0deg);
    }
  }
  .vue-treeselect__control-arrow-container {
    font-family: element-icons!important;
    speak: none;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    // vertical-align: baseline;
    // display: inline-block;
    -webkit-font-smoothing: antialiased;
    font-size: 14px;
    color: #c0c4cc;
    width: 25px;
    transform: rotateZ(180deg);
    transition: transform .3s;
    &:before{
      content: "\E605";
    }
  }
  .vue-treeselect__placeholder, .vue-treeselect__single-value, .vue-treeselect__input {
    font-size: 13px;
  }
  .vue-treeselect__single-value, .vue-treeselect__input {
    color: #606266;
  }
  .vue-treeselect__option--selected{
     background: transparent;
  }
  .vue-treeselect--focused{
    .vue-treeselect__control{
      border-radius: 5px !important;
      border-color: #409eff;
    }
  }
  .vue-treeselect__option {
    background: transparent;
    &:hover{
      background: #f5f7fa;
    }
  }
  .vue-treeselect__menu-container{
    margin-top: 3px;
  }
  .vue-treeselect__menu{
    border-radius: 5px;
    border: 1px solid #dcdfe6;
  }
  .vue-treeselect__label{
    font-weight: normal;
    font-size: 13px;
  }
  .vue-treeselect__control{
    // display: block;
    height: 30px;
    line-height: 30px;
    .vue-treeselect__input-container{
      height: 30px;
    }
  }
</style>
