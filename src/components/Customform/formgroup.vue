<template>
  <div class="formgroup">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'Formgroup'
}
</script>

<style scoped>
  .formgroup {
    width: 100%;
    background-color: #ffffff;
    border: 1px solid #e4e4e4;
    display: flex;
    flex-flow: row nowrap;
    margin-bottom: -1px;
  }
</style>
