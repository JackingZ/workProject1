<template>
  <!-- eslint-disable -->
  <!-- <div v-if="treeData && treeData.length === 1">
    <div>{{treeData[0].name}}</div>
    <div v-if="treeData[0].children">
      <div v-for="(item, index) in treeData[0].children">{{item}}</div>
      <MyTree v-for="(item, index) in treeData[0].children"
        :treeData="item"
        :key="index"></MyTree>
    </div>
  </div> -->
  <div>
    <div v-for="(item, index) in treeData"
      :key="index">
      <slot :item="item"></slot>
      <div>{{depth}}</div>
      <div v-if="item.children">
        <MyTree :treeData="item.children"
          :depth="depth + 1">
        </MyTree>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  name: 'MyTree',
  props: {
    treeData: Array,
    depth: {
      type: Number,
      default: 0
    }
  }
}
</script>

