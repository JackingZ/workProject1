<template>
  <el-dialog
    :visible="isShow"
    class="custom-header"
    width="600px"
    @close="cancel">
    <div slot="title">
      <span>设置表头</span>
      <span class="s-blue pointer" @click="initDefault()">恢复默认</span>
    </div>
    <div v-loading="loadingData" class="content">
      <div class="item-wrap item-header">
        <div
          v-for="(item, index) in headerList"
          :key="index">
          {{ item.title }} {{ item.count ? '(' + item.count + ')' : '' }}
          <img v-if="item.isSelect" src="@/assets/imgs/select_down.png" @click="resort(index)">
          <img v-else src="@/assets/imgs/not_select_down.png" @click="resort(index)">
        </div>
      </div>
      <draggable
        v-model="itemList"
        :options="{animation: 150}"
        :move="moveCallback"
        @update="onListChange()"
      >
        <div
          v-for="item in itemList"
          :key="item.fieldName"
          class="item-wrap item-layout">
          <div>{{ item.fieldDepict }}</div>
          <div><el-checkbox v-model="item.listChecked" @change="checkChange(1)"/></div>
          <div><el-checkbox v-model="item.checked" @change="checkChange(2)"/></div>
        </div>
      </draggable>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel">取 消</el-button>
      <el-button :loading="isCommitingData" type="primary" size="small" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import draggable from 'vuedraggable'
import { getPolicyExportList, commitExportField } from '@/api/policy_management'
export default {
  components: {
    draggable
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loadingData: false,
      isCommitingData: false,
      headerList: [
        { title: '保单字段', isSelect: false },
        { title: '列表显示', isSelect: false, count: 0 },
        { title: 'Excel导出', isSelect: false, count: 0 }
      ],
      dialogVisible: false,
      defaultList: [],
      itemList: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.loadingData = true
      Promise.all([
        getPolicyExportList().then(res => {
          this.itemList = res || []
          this.itemList = this.itemList.map(item => {
            if (item.fieldName === 'licenseNo') item.fixed = true
            return item
          })
        }),
        getPolicyExportList({ reset: 0 }).then(res => {
          this.defaultList = res || []
          this.defaultList = this.defaultList.map(item => {
            if (item.fieldName === 'licenseNo') item.fixed = true
            return item
          })
        })
      ]).then(res => {
        this.loadingData = false
        let listCount = 0
        let excelCount = 0
        this.itemList.forEach(item => {
          if (item.listChecked) listCount++
          if (item.checked) excelCount++
        })
        this.$set(this.headerList[1], 'count', listCount)
        this.$set(this.headerList[2], 'count', excelCount)
      }).catch(e => {
        this.loadingData = false
      })
    },
    // 默认列表深拷贝
    copyList() {
      return JSON.parse(JSON.stringify(this.defaultList))
    },
    initDefault() {
      this.itemList = [].concat(this.copyList()).map(item => {
        if (item.fieldName === 'licenseNo') item.fixed = true
        return item
      })
    },
    // 控制是否可以拖动
    moveCallback({ draggedContext }) {
      const moveIndex = draggedContext.futureIndex
      const moveItem = this.itemList[moveIndex]
      return draggedContext.element && !draggedContext.element.fixed && !moveItem.fixed
    },
    // 拖动结果
    onListChange() {
      const newList = this.itemList.map((item, index) => {
        item.sorted = index + 1
        return item
      })
      this.resetList(newList)
    },
    resetList(newList) {
      this.$set(this, 'itemList', newList)
    },
    checkChange(type) {
      let count = 0
      switch (type) {
        case 1:
          this.itemList.forEach(item => {
            if (item.listChecked) count++
          })
          break
        case 2:
          this.itemList.forEach(item => {
            if (item.checked) count++
          })
          break
      }
      this.$set(this.headerList[type], 'count', count)
    },
    resort(index) {
      const selectItem = this.headerList[index]
      this.$set(selectItem, 'isSelect', true)
      this.headerList.forEach((item, itemIndex) => {
        if (itemIndex !== index) this.$set(this.headerList[itemIndex], 'isSelect', false)
      })
      let newList
      const copyDefaultList = this.copyList()
      switch (index) {
        case 0:
          newList = [].concat(this.itemList)
            .map(item => {
              const res = copyDefaultList.find(child => item.fieldName === child.fieldName)
              if (res) item.sorted = res.sorted
              return item
            })
            .sort((item1, item2) => item1.sorted - item2.sorted)
          this.resetList(newList)
          break
        case 1:
          newList = this.itemList
            .filter(item => item.fixed)
            .concat(
              this.itemList
                .filter(item => !item.fixed)
                .sort((item1, item2) => {
                  const item1Priority = item1.sorted + (item1.listChecked ? 0 : 9999)
                  const item2Priority = item2.sorted + (item2.listChecked ? 0 : 9999)
                  return item1Priority - item2Priority
                })
            ).map((item, index) => {
              item.sorted = index + 1
              return item
            })
          this.resetList(newList)
          break
        case 2:
          newList = this.itemList
            .filter(item => item.fixed)
            .concat(
              this.itemList
                .filter(item => !item.fixed)
                .sort((item1, item2) => {
                  const item1Priority = item1.sorted + (item1.checked ? 0 : 9999)
                  const item2Priority = item2.sorted + (item2.checked ? 0 : 9999)
                  return item1Priority - item2Priority
                })
            ).map((item, index) => {
              item.sorted = index + 1
              return item
            })
          this.resetList(newList)
          break
      }
    },
    cancel() {
      this.$emit('close')
    },
    confirm() {
      this.isCommitingData = true
      this.loadingData = true
      commitExportField(this.itemList).then(({ status }) => {
        this.isCommitingData = false
        this.loadingData = false
        if (status === 200) {
          this.cancel()
          this.$emit('onSub')
        }
      }).catch(e => {
        this.isCommitingData = false
        this.loadingData = false
      })
    }
  }
}
</script>
<style lang="scss">
.custom-header{
  .pointer{
    cursor: pointer;
  }
  .el-dialog__header{
    border-bottom: 1px solid #eee;
  }
  .s-blue{
    margin-left: 15px;
    font-size: 13px;
    color: rgb(64, 158, 255);
  }
  .el-dialog__footer{
    border-top: 1px solid #eee;
    padding: 10px 20px;
  }
  .el-dialog__body{
    min-height: 300px;
    max-height: 500px;
    overflow: auto;
    padding: 0px;
  }
  .item-wrap{
    display: flex;
    & > div {
      display: flex;
      align-items: center;
      flex: 1;
      padding-left: 20px;
      font-size: 12px;
    }
  }
  .item-layout{
    line-height: 30px;
    cursor: move;
  }
  .item-header{
    line-height: 40px;
    background: #f6f6f6;
    border-bottom: 1px solid #eee;
    img {
      margin-left: 5px;
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
  }
}
</style>
