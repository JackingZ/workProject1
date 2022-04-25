<template>
  <div v-loading="isLoading" class="app-container">
    <el-row v-if="isSubAdmin" type="flex" justify="space-around" align="middle" style="margin: 20px 0;">
      <el-col :span="6">
        <span>使用类型:</span>
      </el-col>
      <el-col :span="18">
        <el-select
          v-model="selectValue.type"
          size="small"
          clearable
          filterable
          placeholder="使用类型"
          style="width: 100%;">
          <el-option
            v-for="item in typeList.data"
            :key="item.key"
            :label="item.value"
            :value="item.key"/>
        </el-select>
      </el-col>
    </el-row>

    <el-row v-if="isSubAdmin" type="flex" justify="space-around" align="middle" style="margin: 20px 0;">
      <el-col :span="6">
        <span>工号类型:</span>
      </el-col>
      <el-col :span="18">
        <el-select
          v-model="selectValue.companyType"
          size="small"
          clearable
          filterable
          placeholder="工号类型"
          style="width: 100%;">
          <el-option
            v-for="item in companyTypeList.data"
            :key="item.key"
            :label="item.value"
            :value="item.key"/>
        </el-select>
      </el-col>
    </el-row>

    <el-row v-if="isSubAdmin" type="flex" justify="space-around" align="middle" style="margin: 20px 0;">
      <el-col :span="6">
        <span>续保查询:</span>
      </el-col>
      <el-col :span="18">
        <el-select
          v-model="selectValue.renewal"
          size="small"
          clearable
          filterable
          placeholder="续保查询"
          style="width: 100%;">
          <el-option
            v-for="item in renewalList.data"
            :key="item.key"
            :label="item.value"
            :value="item.key"/>
        </el-select>
      </el-col>
    </el-row>

    <el-row v-if="isSubAdmin" type="flex" justify="space-around" align="middle" style="margin: 20px 0;">
      <el-col :span="6">
        <span>出单设置:</span>
      </el-col>
      <el-col :span="18">
        <el-select
          v-model="selectValue.invoiceType"
          size="small"
          clearable
          filterable
          placeholder="出单设置"
          style="width: 100%;">
          <el-option
            v-for="item in billingType.data"
            :key="item.key"
            :label="item.value"
            :value="item.key"/>
        </el-select>
      </el-col>
    </el-row>

    <el-row v-if="isSubAdmin" type="flex" justify="space-around" align="middle" style="margin: 20px 0;">
      <el-col :span="6">
        <span>启用状态:</span>
      </el-col>
      <el-col :span="18">
        <el-select
          v-model="selectValue.state"
          size="small"
          clearable
          filterable
          placeholder="启用状态"
          style="width: 100%;">
          <el-option
            v-for="item in stateList.data"
            :key="item.key"
            :label="item.value"
            :value="item.key"/>
        </el-select>
      </el-col>
    </el-row>

    <el-row type="flex" justify="space-around" align="middle" style="margin: 20px 0;">
      <el-col :span="6">
        <span>绑定状态:</span>
      </el-col>
      <el-col :span="18">
        <el-select
          v-model="selectValue.bingding"
          size="small"
          clearable
          filterable
          placeholder="绑定状态"
          style="width: 100%;">
          <el-option
            v-for="item in bingdingState.data"
            :key="item.key"
            :label="item.value"
            :value="item.key"/>
        </el-select>
      </el-col>
    </el-row>

    <el-row type="flex" justify="space-around" align="middle" style="margin: 20px 0;">
      <el-col :span="6">
        <span>起止时间：</span>
      </el-col>
      <el-col :span="18">
        <el-date-picker
          v-model="selectValue.date"
          type="daterange"
          value-format="timestamp"
          size="small"
          clearable
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 100%;"/>
      </el-col>
    </el-row>

    <el-row type="flex" justify="space-around" align="middle" style="margin: 20px 0;">
      <el-col :span="6"/>
      <el-col :span="18">
        <el-button type="primary" size="small" @click="screen">确定</el-button>
        <el-button plain size="small" @click="reset">重置</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'NumberScreen',
  props: {
    selectValue: {
      type: Object,
      default: null
    },
    companyTypeList: {
      type: Object,
      default: null
    },
    renewalList: {
      type: Object,
      default: null
    },
    billingType: {
      type: Object,
      default: null
    },
    stateList: {
      type: Object,
      default: null
    },
    typeList: {
      type: Object,
      default: null
    },
    bingdingState: {
      type: Object,
      default: null
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isSubAdmin: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    screen() {
      this.$emit('screen')
    },
    reset() {
      this.$emit('reset')
    }
  }
}
</script>

<style scoped>
</style>
