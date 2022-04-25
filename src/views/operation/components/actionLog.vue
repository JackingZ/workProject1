<template>
  <div>
    <el-row type="flex">
      <el-col :span="8">
        <el-date-picker
          v-model="logData.date"
          :clearable="false"
          size="small"
          style="width: 100%;"
          type="daterange"
          range-separator="至"
          start-placeholder="起始时间"
          end-placeholder="过期时间"
          value-format="timestamp"/>
      </el-col>
      <el-col :span="16">
        <el-row type="flex" justify="end">
          <el-cascader
            :options="logData.options"
            :props="logData.props"
            v-model="logData.form.model.operators"
            clearable
            size="small"
            style="margin-right: 10px;width: 230px;"/>
          <el-input
            v-model="logData.form.model.keyWord"
            size="small"
            placeholder="IP地址/操作人"
            class="input-with-select"
            prefix-icon="el-icon-search"
            style="margin-right: 10px;width: 230px;"/>
          <el-button type="primary" icon="el-icon-search" size="small" @click="logQuery">查询</el-button>
        </el-row>
      </el-col>
    </el-row>

    <el-table v-loading="logData.isLoading" :data="logData.logForm.model" height="50vh" border style="width: 100%;margin: 20px 0;">
      <el-table-column prop="id" label="编号" min-width="20"/>
      <el-table-column :formatter="addTimeFormat" prop="createTime" label="操作时间" min-width="65"/>
      <el-table-column prop="userName" label="操作人" min-width="50"/>
      <el-table-column prop="ip" label="IP地址" min-width="60"/>
      <el-table-column prop="operatorType" label="操作类型" min-width="30" />
      <el-table-column prop="fieldText" label="操作对象" min-width="50" />
      <el-table-column prop="fieldDesc" label="操作详情" width="350">
        <template slot-scope="scope">
          <div v-html="scope.row.fieldDesc"/>
        </template>
      </el-table-column>
      <!--<el-table-column label="查看详情" width="80px">-->
      <!--<template slot-scope="scope">-->
      <!--<el-button type="text">查看详情</el-button>-->
      <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'ActionLog',
  props: {
    logData: {
      type: Object,
      default: null
    }
  },
  methods: {
    logQuery() {
      this.$emit('query')
    },
    sss(a) {
      console.log(a)
    },
    addTimeFormat(r) {
      return dayjs(r.createTime).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style scoped>
</style>
