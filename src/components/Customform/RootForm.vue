<template>
  <my-form-creator ref="creator" :rules="rules" class="custom_form">
    <slot/>
  </my-form-creator>
</template>

<script>
import Validator from '@/components/Customform/public/validator'
import MyFormCreator from '@/components/Customform/MyFormCreator'
export default {
  name: 'RootForm',
  components: { MyFormCreator },
  provide() {
    return {
      myForm: new Validator()
    }
  },
  component: {
    MyFormCreator
  },
  props: {
    rules: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    validateForm(callback) {
      const creator = this.$refs.creator
      const myForm = creator ? creator.myForm : null
      if (myForm) {
        myForm.validateAll(callback)
      }
    }
  }
}
</script>

<style lang="scss">
  .custom_form{
    .err {
      .el-input__inner,
      .el-form-item.is-error .el-input__inner:focus,
      .el-form-item.is-error .el-textarea__inner,
      .el-form-item.is-error   .el-textarea__inner:focus,
      .el-message-box__input input.invalid,
      .el-message-box__input input.invalid:focus{
        border-color: #f56c6c;
      }
    }
    .el-input__inner {
      border-radius: 0;
      height: 38px;
      line-height: 38px;
      margin: 0;
      padding: 0 10px;
      box-sizing: border-box;
      position: relative;
      top: 3px;
      z-index: 10;
      border: 1px solid #409EFF;
      background: transparent;
    }
    .el-input__suffix{
      z-index: 11;
      top: 3px;
    }
    .el-input{
      top: -5px;
      width: 100%;
    }
  }
</style>
