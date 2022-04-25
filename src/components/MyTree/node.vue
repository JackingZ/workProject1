<template>
  <!-- eslint-disable -->
  <div>
    <!-- <div class="tree-node__content" :style="{paddingLeft: `${this.depth * 30}px`}">
      <span v-if="data.children"
        :class="['tree-node__expand-icon', isExpanded ? 'expanded': '']"
        @click="toggle"></span>
      <span v-else :style="{marginLeft: '20px'}"></span>
    </div> -->
    <node-content :isExpanded="isExpanded"
      :canExpanded="canExpanded"
      :depth="depth"
      :toggleExpanded="toggle"
      ></node-content>
    <template v-if="data.children && isExpanded">
      <my-tree-node v-for="item in data.children"
        :key="item.id"
        :data="item"
        :depth="depth + 1"
        :parentItem="data"
        :scopeRender="scopeRender"></my-tree-node>
    </template>
  </div>
</template>
<script>
/* eslint-disable */
import Vue from 'vue'
export default {
  name: 'MyTreeNode',
  components: {
    NodeContent: {
      props: {
        isExpanded: Boolean,
        canExpanded: Boolean,
        depth: Number,
        toggleExpanded: Function
      },
      render (h) {
        let parent = this.$parent
        let scopeRender = parent.scopeRender
        let item = parent.data
        let param = {
          item,
          isExpanded: this.isExpanded,
          canExpanded: this.canExpanded,
          depth: this.depth,
          toggleExpanded: this.toggleExpanded,
          parentItem: parent.parentItem
        }
        return scopeRender(param)
      }
    }
  },
  props: {
    data: Object,
    depth: {
      type: Number,
      default: 0
    },
    scopeRender: Function,
    parentItem: Object
  },
  data () {
    return {
      // isExpanded: false,
    }
  },
  computed: {
    canExpanded () {
      return this.data.children && this.data.children.length > 0
    },
    isExpanded () {
      return this.data.isExpanded
    }
  },
  methods: {
    toggle () {
      console.log('toggle')
      Vue.set(this.data, 'isExpanded', !this.data.isExpanded)
    }
  }
}
</script>
