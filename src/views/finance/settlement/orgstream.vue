<template>
  <!-- eslint-disable -->
  <upstream v-bind="$attrs" v-on="$listeners"/>
</template>
<script>
// eslint-disable
import Upstream from '@/views/finance/settlement/upstream'
export default {
  name: 'Orgstream',
  components: {
    Upstream
  },
  inheritAttrs: false
}
</script>
