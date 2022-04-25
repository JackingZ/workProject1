<template>
  <div class="batch-container">
    <div class="batch-wrap">
      <el-menu
        :default-active="activeIndex"
        background-color="rgba(240, 242, 245, 1)"
        style="width: 200px;border-right: none;"
        @select="onSelect"
      >
        <el-menu-item :class="{isActive: activeIndex === '1'}" index="1">
          <span slot="title" style="margin-left:10px;">续保查询设置</span>
        </el-menu-item>
        <el-menu-item :class="{isActive: activeIndex === '2'}" index="2">
          <span slot="title" style="margin-left:10px;">移动出单设置</span>
        </el-menu-item>
        <el-menu-item :class="{isActive: activeIndex === '3'}" index="3">
          <span slot="title" style="margin-left:10px;">移动出单开关</span>
        </el-menu-item>
        <el-menu-item :class="{isActive: activeIndex === '4'}" index="4">
          <span slot="title" style="margin-left:10px;">电脑出单开关</span>
        </el-menu-item>
      </el-menu>
      <div v-show="activeIndex === '1'" class="pane">
        <el-checkbox-group v-model="checkList1" :max="1">
          <el-checkbox
            v-for="(item, index) in list1"
            :key="index"
            :label="item.value"
          >{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div v-show="activeIndex === '2'" class="pane">
        <el-checkbox-group v-model="checkList2">
          <el-checkbox label="0050200000">报价</el-checkbox>
          <el-checkbox label="0050300000">核保</el-checkbox>
          <el-checkbox label="0050400000">支付</el-checkbox>
        </el-checkbox-group>
      </div>
      <div v-show="activeIndex === '3'" class="pane">
        <el-checkbox-group v-model="checkList3" :max="1">
          <el-checkbox
            v-for="(item, index) in list3"
            :key="index"
            :label="item.value"
            :checked="item.checked"
          >{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div v-show="activeIndex === '4'" class="pane">
        <el-checkbox-group v-model="checkList4" :max="1">
          <el-checkbox
            v-for="(item, index) in list4"
            :key="index"
            :label="item.value"
            :checked="item.checked"
          >{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <p style="font-size: 12px;color: red;margin-left: 15px;">注：此操作将批量修改选中的工号相关设置，请谨慎操作！！！</p>
  </div>
</template>

<script>
import { batchNumber } from '@/api/number.js'
export default {
  name: 'BatchOperation',
  props: {
    ids: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      activeIndex: '1',
      checkList1: [],
      checkList2: [],
      checkList3: [],
      checkList4: [],
      list1: [
        { label: '开启', value: '1', checked: false },
        { label: '关闭', value: '0', checked: false }
      ],
      list3: [
        { label: '开启', value: '1', checked: false },
        { label: '关闭', value: '0', checked: false }
      ],
      list4: [
        { label: '开启', value: '1', checked: false },
        { label: '关闭', value: '0', checked: false }
      ]
    }
  },
  methods: {
    clear() {
      this.checkList1 = []
      this.checkList2 = []
      this.checkList3 = []
      this.checkList4 = []
    },
    onSelect(index) {
      this.clear()
      this.activeIndex = index
    },
    save() {
      if (this.ids.length === 0) {
        this.$message.error('请先选择要操作的工号')
        this.$emit('close')
        return
      }
      const index = parseInt(this.activeIndex)
      const data = {
        ids: this.ids,
        index: this.activeIndex,
        switchDto: {
          mobile: index === 3 ? this.checkList3.join('') : '',
          renewal: index === 1 ? this.checkList1.join('') : '',
          permissions: index === 2 ? this.checkList2.join(',') : '',
          pc: index === 4 ? this.checkList4.join('') : ''
        }
      }
      batchNumber(data)
        .then(res => {
          console.log('res', res)
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.clear()
          this.$emit('close')
        })
        .catch(err => {
          console.warn(err)
        })
    }
  }
}
</script>

<style lang="scss">
.batch-container {
  .pane {
    width: calc(100% - 200px);
    padding: 0 15px;
    text-align: center;
  }
  .isActive {
    background-color: #ffffff !important;
    border-right: none !important;
  }
  .batch-wrap {
    margin: 0 15px;
    border: 1px solid #e6e6e6;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }
  .el-menu-item {
    border-right: 1px solid #e6e6e6;
  }
}
</style>
