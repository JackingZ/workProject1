import BasicTree from '@/components/ElTreeSelectLib/tree/src/basic/basic-tree.vue'
import Tree from '@/components/ElTreeSelectLib/tree/src/tree.vue'

/* istanbul ignore next */
Tree.install = function(Vue) {
  Vue.component(Tree.name, Tree)
}

export { BasicTree }

export default Tree
