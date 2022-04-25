<template>
  <el-select
    ref="formItem"
    v-bind="$attrs"
    :class="{ err: hasError }"
    v-model="myValue"
    class="app_my_input"
    v-on="$listeners"
    @input="onTrigger($event,'change')"
    @focus="onTrigger($event.target.value,'focus')"
    @blur="onTrigger($event.target.value,'blur')">
    <slot />
  </el-select>
</template>

<script>
import formItemMixin from '@/components/Customform/public/mixin'
export default {
  name: 'MySelect',
  mixins: [formItemMixin],
  inheritAttrs: false,
  props: {
    prop: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number, Array],
      default: ''
    }
  },
  inject: ['myForm']
}
</script>

<style lang="scss">
  .app_my_input.err {
    .el-input__inner, .el-form-item.is-error .el-input__inner:focus, .el-form-item.is-error .el-textarea__inner, .el-form-item.is-error   .el-textarea__inner:focus, .el-message-box__input input.invalid, .el-message-box__input input.invalid:focus{
      border-color: #f56c6c;
    }
  }
</style>
