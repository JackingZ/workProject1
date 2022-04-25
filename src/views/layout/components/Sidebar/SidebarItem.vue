<template>
  <div v-if="!item.hidden&&item.children" class="menu-wrapper">

    <template v-if="hasOneShowingChild(item.children) && !onlyOneChild.children&&!item.alwaysShow">
      <a v-permission="item.meta && item.meta.guard" v-if="checkSpeicial(item.meta)" :href="changeUrl(onlyOneChild.path)" target="_blank" @click="clickLink(onlyOneChild.path,$event)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item v-if="onlyOneChild.meta" :icon="onlyOneChild.meta.icon" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </a>
    </template>

    <el-submenu v-else :index="item.name||item.path">
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta.icon" :title="item.meta.title" />
      </template>

      <template v-for="child in item.children" v-if="!child.hidden">
        <sidebar-item v-if="child.children&&child.children.length>0" :is-nest="true" :item="child" :key="child.path" :base-path="resolvePath(child.path)" class="nest-menu" />
        <template v-else>
          <a v-permission="child.meta && child.meta.guard" v-if="checkSpeicial(child.meta)" :href="changeUrl(child.path)" :key="child.name" target="_blank" @click="clickLink(child.path,$event)">
            <el-menu-item :index="resolvePath(child.path)">
              <item v-if="child.meta" :icon="child.meta.icon" :title="child.meta.title" />
            </el-menu-item>
          </a>
        </template>
      </template>
    </el-submenu>

  </div>
</template>

<script>
import path from 'path'
import { validateURL } from '@/utils/validate'
import Item from '@/views/layout/components/Sidebar/Item'
import { mapGetters } from 'vuex'
import { getMockLoginFunc } from '@/utils/mobileLogin'
export default {
  name: 'SidebarItem',
  components: { Item },
  props: {
    // route配置json
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      onlyOneChild: null,
      getUrl: null
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否是管理员渠道
    ])
  },
  methods: {
    hasOneShowingChild(children) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // temp set(will be used if only has one showing child )
          this.onlyOneChild = item
          return true
        }
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    },
    resolvePath(routePath) {
      return path.resolve(this.basePath, routePath)
    },
    isExternalLink(routePath) {
      return validateURL(routePath)
    },
    changeUrl(url) {
      if (url === '//quickissue') return this.getIssueUrl()
      if (url.indexOf('?token=') >= 0) {
        return url + this.$store.state.user.token
      }
      return url
    },
    clickLink(routePath, e) {
      if (routePath === '//quickissue') {
        e.preventDefault()
        window.openIssueUrl()
        return
      }
      if (!this.isExternalLink(routePath)) {
        e.preventDefault()
        const path = this.resolvePath(routePath)
        this.$router.push(path)
      }
    },
    checkSpeicial(meta) {
      if (meta) {
        if (meta.isAdmin) return this.isAnyAdminChannel
      }
      return true
    },
    getIssueUrl(query = {}) {
      if (!this.getUrl) this.getUrl = getMockLoginFunc(this)
      return this.getUrl(query)
    }
  }
}
</script>
