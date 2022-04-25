<template>
  <div>
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'MyFormCreator',
  inject: ['myForm'],
  props: {
    rules: {
      type: Object,
      default: () => {}
    }
  },
  created() {
    this.myForm.init(this.rules)
    this.myForm.on('onError', (val) => this.$emit('error', val))
  },
  beforeDestroy() {
    this.myForm.destroy()
  }
}
</script>

<style scoped>

</style>
