<template>
<!-- eslint-disable -->
  <div>
    <el-dialog
      title="费用拆分（人保广东需要补充费用拆分信息）"
      :visible.sync="show"
      width="1400px"
      append-to-body
      class="cost-sp"
      @close="$emit('close')"
      center>
      <el-header>商业险</el-header>
      <el-table
        :data="comlTableData"
        border
        style="width: 100%">
        <el-table-column
          label="职业证号"
          width="350">
          <template slot-scope="scope">
            <el-input v-model="scope.row.profCode" placeholder="职业证号" style="width:175px;" size="small"></el-input>
            <el-input v-model="scope.row.profName" placeholder="姓名" style="width:140px;" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="销售人员代码"
          width="180">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sellCode" placeholder="销售人员代码" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="渠道类型"
          width="160">
          <template slot-scope="scope">
            <el-select v-model="scope.row.channelType" filterable placeholder="请选择" size="small">
              <el-option v-for="item in comlList.channelType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="渠道代码"
          width="345">
          <template slot-scope="scope">
            <el-input v-model="scope.row.channelCode" placeholder="渠道代码" style="width:160px;" size="small"></el-input>
            <el-input v-model="scope.row.channel" placeholder="渠道" style="width:160px;" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="费用类型"
          width="160">
          <template slot-scope="scope">
            <el-select v-model="scope.row.costType" filterable placeholder="请选择" size="small">
              <el-option v-for="item in comlList.feeType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="初始手续费比例"
          width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.initCommRate" placeholder="" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="销售费用"
          width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sellMoney" placeholder="" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="主渠道"
          width="90">
          <template slot-scope="scope">
             <el-select v-model="scope.row.hostChannel" filterable placeholder="请选择" size="small">
              <el-option label="是" value="1" />
              <el-option label="否" value="2" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="70">
          <template slot-scope="scope">
            <i v-if="scope.$index === 0" class="el-icon-circle-plus icon" style="color:#409eff;" @click="addNewItem(0)"></i>
            <i v-if="scope.$index > 0" class="el-icon-remove-outline icon" @click="removeItem(0, scope.$index)"></i>
          </template>
        </el-table-column>
      </el-table>
      <div class="gap"></div>
      <el-header>交强险</el-header>
      <el-table
        :data="forceTableData"
        border
        style="width: 100%">
        <el-table-column
          label="职业证号"
          width="350">
          <template slot-scope="scope">
            <el-input v-model="scope.row.profCode" placeholder="职业证号" style="width:175px;" size="small"></el-input>
            <el-input v-model="scope.row.profName" placeholder="姓名" style="width:140px;" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="销售人员代码"
          width="180">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sellCode" placeholder="销售人员代码" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="渠道类型"
          width="160">
          <template slot-scope="scope">
            <el-select v-model="scope.row.channelType" filterable placeholder="请选择" size="small">
              <el-option v-for="item in comlList.channelType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="渠道代码"
          width="345">
          <template slot-scope="scope">
            <el-input v-model="scope.row.channelCode" placeholder="渠道代码" style="width:160px;" size="small"></el-input>
            <el-input v-model="scope.row.channel" placeholder="渠道" style="width:160px;" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="费用类型"
          width="160">
          <template slot-scope="scope">
            <el-select v-model="scope.row.costType" filterable placeholder="请选择" size="small">
              <el-option v-for="item in comlList.feeType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="初始手续费比例"
          width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.initCommRate" placeholder="" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="销售费用"
          width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sellMoney" placeholder="" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="主渠道"
          width="90">
          <template slot-scope="scope">
             <el-select v-model="scope.row.hostChannel" filterable placeholder="请选择" size="small">
              <el-option label="是" value="1" />
              <el-option label="否" value="2" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="70">
          <template slot-scope="scope">
            <i v-if="scope.$index === 0" class="el-icon-circle-plus icon" style="color:#409eff;" @click="addNewItem(1)"></i>
            <i v-if="scope.$index > 0" class="el-icon-remove-outline icon" @click="removeItem(1, scope.$index)"></i>
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
      centerDialogVisible: false,
      comlTableData: [],
      forceTableData: [],
      comlList: {
        channelType: [
          {
            value: '1',
            label: '专业代理业务'
          },
          {
            value: '2',
            label: '个人代理业务'
          },
          {
            value: '3',
            label: '传统直销业务'
          },
          {
            value: '4',
            label: '兼业代理业务'
          },
          {
            value: '5',
            label: '经济业务'
          }
        ],
        feeType: [
          {
            value: '1',
            label: '手续费'
          },
          {
            value: '2',
            label: '经纪费'
          },
          {
            value: '3',
            label: '业务绩效'
          },
          {
            value: '4',
            label: '渠道管理费'
          }
        ]
      }
    }
  },
  methods: {
    setData ({ comlTableData, forceTableData }) {
      this.comlTableData = comlTableData || [this.createEmptyData()]
      this.forceTableData = forceTableData || [this.createEmptyData()]
    },
    addNewItem (type) {
      switch (type) {
        case 0:
          this.comlTableData.push(this.createEmptyData())
          break
        case 1:
          this.forceTableData.push(this.createEmptyData())
          break
      }
    },
    removeItem (type, index) {
      switch (type) {
        case 0:
          this.comlTableData.splice(index, 1)
          break
        case 1:
          this.forceTableData.splice(index, 1)
          break
      }
    },
    createEmptyData () {
      return {
        'profCode': '',
        'profName': '',
        'sellCode': '',
        'channelType': '',
        'channelCode': '',
        'channel': '',
        'costType': '',
        'initCommRate': '',
        'sellMoney': '',
        'hostChannel': ''
      }
    },
    isEmpty (object) {
      for (let key in object) if (object[key]) return false
      return true
    },
    confirm () {
      const comlTableData = this.comlTableData.filter(item => !this.isEmpty(item))
      const forceTableData = this.forceTableData.filter(item => !this.isEmpty(item))
      console.log('confirm', comlTableData, forceTableData)
      let res = {
        comInsur:  comlTableData.length > 0 ? comlTableData : void 0,
        saliInsur: forceTableData.length > 0 ? forceTableData : void 0,
      }
      if (!res.comInsur && !res.saliInsur) res = null
      this.$emit('confirm', res)
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss">
.cost-sp{
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
