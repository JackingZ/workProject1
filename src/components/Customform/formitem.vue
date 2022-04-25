<template>
  <div :class="{background: background}" :style="{width: itemWidth, padding: noPadding ? '0' : void 0 }" class="formitem">
    <span v-if="formatter" class="label">{{ formatter ? formatter(label) : label }}</span>
    <span v-else class="label">{{ label | filternulls }}</span>
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'Formitem',
  props: {
    background: {
      type: Boolean,
      default: false
    },
    noPadding: {
      type: Boolean,
      default: false
    },
    span: {
      type: Number,
      default: 24
    },
    label: {
      type: [Number, String],
      default: '--'
    },
    formatter: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      proportion: 100 / 24
    }
  },
  computed: {
    itemWidth() {
      return `${this.span * this.proportion}%`
    }
  }
}
</script>

<style lang="scss" scoped>
  .formitem {
    height: 36px;
    line-height: 36px;
    padding: 0 10px;
    /*min-width: 310px;*/
    border-right: 1px solid #e4e4e4;
  }
  .formitem:last-child {
    border: none;
  }
  .background{
    background-color: #f2f2f2;
    /*min-width: 136px!important;*/
  }
  .label {
    font-size: 12px;
  }
</style>
