<template>
  <div />
</template>

<script>
export default {
  name: 'Business',
  data() {
    return {}
  },
  beforeCreate() {
    console.log(this.$store.state.user.token)
    window.open(`https://ybinsure.com/spa/newManagerTest?token=${this.$store.state.user.token}`)
    location.href = '/'
  }
}
</script>

<style scoped>

</style>
