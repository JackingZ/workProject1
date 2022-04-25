<template>
<!-- eslint-disable -->
  <div>
    <my-tree-node v-for="item in treeData"
      :key="item.id"
      :data="item"
      :scopeRender="$scopedSlots.default"></my-tree-node>
  </div>
</template>

<script>
import MyTreeNode from '@/components/MyTree/node'
/* eslint-disable */
export default {
  components: {
    MyTreeNode
  },
  props: {
    treeData: Array
  }
}
</script>
