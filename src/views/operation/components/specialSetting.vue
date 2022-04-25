<template>
<!-- eslint-disable -->
  <div>
    <el-dialog
      title="特别约定 （人保工号可根据需要补充特约信息）"
      :visible.sync="show"
      width="840px"
      append-to-body
      :close-on-click-modal="false"
      class="speicial-set"
      @close="$emit('close')"
      center>
      <el-table
        :data="tableList"
        border
        style="width: 100%">
        <el-table-column
          label="约定代码"
          width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.proCode" placeholder="约定代码" style="width:175px;" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="特约名称"
          width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.proName" placeholder="特约名称" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="约定内容"
          width="300">
          <template slot-scope="scope">
            <el-input v-model="scope.row.proText" placeholder="特别约定内容" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          >
          <template slot-scope="scope">
            <i v-if="scope.$index === 0" class="el-icon-circle-plus icon" style="color:#409eff;" @click="addNewItem()"></i>
            <i v-if="scope.$index > 0" class="el-icon-remove-outline icon" @click="removeItem(scope.$index)"></i>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('close')">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  props: {
    show: Boolean
  },
  data() {
    return {
      tableList: []
    }
  },
  methods: {
    setData (tableData) {
      this.tableList = tableData || [this.createEmptyData()]
    },
    addNewItem () {
      this.tableList.push(this.createEmptyData())
    },
    removeItem (index) {
      this.tableList.splice(index, 1)
    },
    createEmptyData () {
      return {
        'proCode': '',
        'proName': '',
        'proText': ''
      }
    },
    isEmpty (object) {
      for (let key in object) if (object[key]) return false
      return true
    },
    confirm () {
      const tableList = this.tableList.filter(item => !this.isEmpty(item))
      this.$emit('confirm', tableList.length > 0 ? tableList : void 0)
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss">
.speicial-set{
  .icon{
    font-size: 32px;
  }
  .gap{
    height: 30px;
  }
  .el-header{
    height: 55px !important;
    line-height: 55px;
    border: 1px solid #ebeef5;
  }
  .el-dialog--center .el-dialog__footer{
    text-align: right;
  }
}
</style>
