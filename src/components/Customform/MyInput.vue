<template>
  <el-input
    ref="formItem"
    v-bind="$attrs"
    :class="{ err: hasError }"
    v-model="myValue"
    v-on="$listeners"
    @input="onTrigger($event,'change')"
    @focus="onTrigger($event.target.value,'focus')"
    @blur="onTrigger($event.target.value,'blur')"/>
</template>

<script>
import formItemMixin from '@/components/Customform/public/mixin'
export default {
  name: 'MyInput',
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

</style>
