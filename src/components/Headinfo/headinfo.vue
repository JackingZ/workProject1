<template>
  <div class="panel-info">
    <h3>{{ title }}</h3>
    <p>{{ info }}</p>
  </div>
</template>

<script>
export default {
  name: 'Headinfo',
  props: {
    title: {
      type: String,
      default: ''
    },
    info: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>
