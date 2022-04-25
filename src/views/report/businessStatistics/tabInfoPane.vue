<template>
  <div>
    <div v-loading="loadingData" style="overflow-x: auto;">
      <div class="card-wrap">
        <card-info v-for="(item, index) in cardInfoData" :key="index" :date="date" :item="item"/>
      </div>
    </div>
    <el-table v-loading="loadingList" v-show="isSingleChannel" :data="tableData" border>
      <el-table-tree-column
        :expand-all="false"
        :show-overflow-tooltip="true"
        :indent-size="20"
        :remote="remoteGetChild"
        tree-key="organizationId"
        child-key="children"
        file-icon="icon"
        folder-icon="icon"
        child-num-key="subOrganizationCount"
        prop="label"
        label="机构"
        width="320"
      >
        <template slot-scope="scope">{{ scope.row.organizationName }}</template>
      </el-table-tree-column>
      <el-table-column
        v-for="item in tableColumnList"
        :key="item.key"
        :label="item.name"
        :prop="item.key"
        min-width="180"
      />
    </el-table>
    <el-table v-loading="loadingList" v-show="!isSingleChannel" :data="tableData" border>
      <el-table-column label="渠道" prop="sourceName" min-width="180"/>
      <el-table-column
        v-for="item in tableColumnList"
        :key="item.key"
        :label="item.name"
        :prop="item.key"
        min-width="180"
      />
    </el-table>
  </div>
</template>
<script>
import CardInfo from '@/views/report/businessStatistics/cardInfo'
import {
  getDataByType,
  getListByType
} from '@/views/report/businessStatistics/data'
export default {
  components: {
    CardInfo
  },
  props: {
    date: {
      type: Array,
      default: () => []
    },
    type: {
      type: Number,
      default: -1
    },
    isSingleChannel: {
      type: Boolean,
      default: false
    },
    loadingData: {
      type: Boolean,
      default: false
    },
    loadingList: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cardInfoData: [
        // {
        //   title: '新增业务员',
        //   count: '999,999,999.99',
        //   percent: -25.36
        // }
      ],
      tableData: [],
      tableColumnList: []
    }
  },
  created() {
    const cardData = getDataByType(this.type)
    if (cardData) {
      const res = cardData.map(item => {
        return {
          title: item.title,
          count: '',
          percent: 'loading',
          type: item.type
        }
      })
      this.cardInfoData = [...res]
    }
    const columnList = getListByType(this.type)
    if (columnList) this.tableColumnList = [...columnList]
  },
  methods: {
    setData(data) {
      if (!data) return
      this.cardInfoData.forEach(item => {
        const temp = data.find(dataChild => dataChild.type === item.type)
        if (!temp) return
        this.$set(item, 'count', temp.value)
        this.$set(item, 'percent', temp.chain)
      })
    },
    setList(list) {
      if (!list) return
      this.tableData = list.map(item => {
        return {
          ...item,
          depth: 0
        }
      })
    },
    remoteGetChild(row, callback) {
      this.$emit('requestChild', { row, callback, type: this.type })
    }
  }
}
</script>

