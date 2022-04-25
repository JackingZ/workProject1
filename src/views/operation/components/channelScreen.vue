<template>
  <div v-loading="isLoading" class="app-container">
    <el-row type="flex" justify="space-around" align="middle" style="margin: 20px 0;">
      <el-col :span="6">
        <span>客户类型:</span>
      </el-col>
      <el-col :span="18">
        <el-select
          v-model="searchValue.customerType"
          clearable
          size="small"
          placeholder="客户类型"
          style="width: 100%;">
          <el-option
            :value="1"
            label="正式客户"/>
          <el-option
            :value="2"
            label="试用客户"/>
        </el-select>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-around" align="middle" style="margin: 20px 0;">
      <el-col :span="6">
        <span>客户性质:</span>
      </el-col>
      <el-col :span="18">
        <el-select
          v-model="searchValue.customerProperty"
          clearable
          filterable
          size="small"
          placeholder="客户性质"
          style="width: 100%;">
          <el-option :value="1" label="经代公司"/>
          <el-option :value="2" label="科技公司"/>
          <el-option :value="3" label="车商"/>
          <el-option :value="4" label="其他"/>
          <!-- <el-option :value="5" label="其他"/> -->
        </el-select>
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-around" align="middle" style="margin: 20px 0;">
      <el-col :span="6">
        <span>计费方式:</span>
      </el-col>
      <el-col :span="18">
        <!-- multiple
          collapse-tags -->
        <el-select
          v-model="searchValue.chargeType"
          clearable
          size="small"
          placeholder="计费方式"
          style="width: 100%;">
          <el-option
            value="1"
            label="年费"/>
          <el-option
            value="2"
            label="流量费"/>
            <!-- <el-option
            value="3"
            label="其他"/> -->
        </el-select>
      </el-col>
    </el-row>

    <!-- <el-row type="flex" justify="space-around" align="middle" style="margin: 20px 0;">
      <el-col :span="6">
        <span>渠道类型:</span>
      </el-col>
      <el-col :span="18">
        <el-select
          v-model="searchValue.carDealer"
          clearable
          filterable
          size="small"
          placeholder="请选择"
          style="width: 100%;">
          <el-option
            v-for="item in carDealerList"
            :key="item.key"
            :label="item.value"
            :value="item.key"/>
        </el-select>
      </el-col>
    </el-row> -->

    <!-- <el-row type="flex" justify="space-around" align="middle" style="margin: 20px 0;">
      <el-col :span="6">
        <span>总部地区:</span>
      </el-col>
      <el-col :span="18">
        <el-cascader
          :options="areaList"
          v-model="searchValue.area"
          change-on-select
          clearable
          size="small"
          style="width: 100%;"/>
      </el-col>
    </el-row> -->

    <el-row type="flex" justify="space-around" align="middle" style="margin: 20px 0;">
      <el-col :span="6">
        <span>启用状态：</span>
      </el-col>
      <el-col :span="18">
        <el-select
          v-model="searchValue.status"
          clearable
          filterable
          size="small"
          placeholder="启用状态"
          style="width: 100%;">
          <el-option
            v-for="item in status"
            :key="item.key"
            :label="item.value"
            :value="item.key"/>
        </el-select>
      </el-col>
    </el-row>

    <!-- <el-row type="flex" justify="space-around" align="middle" style="margin: 20px 0;">
      <el-col :span="6">
        <span>渠道分级：</span>
      </el-col>
      <el-col :span="18">
        <el-select
          v-model="searchValue.level"
          clearable
          filterable
          size="small"
          placeholder="请选择渠道分级"
          style="width: 100%;"
          @focus="getGardingList">
          <el-option
            v-for="item in gardingList"
            :key="item.code"
            :label="item.value1"
            :value="item.code"/>
        </el-select>
      </el-col>
    </el-row> -->

    <el-row type="flex" justify="space-around" align="middle" style="margin: 20px 0;">
      <el-col :span="6">
        <span>商务负责人：</span>
      </el-col>
      <el-col :span="18">
        <el-select
          v-model="searchValue.businessPrincipalId"
          clearable
          filterable
          size="small"
          placeholder="请选择商务负责人"
          style="width: 100%;"
          @focus="getBusinessLeaderList">
          <el-option
            v-for="item in businessLeaderList"
            :key="item.id"
            :label="item.idName"
            :value="item.id"/>
        </el-select>
      </el-col>
    </el-row>

    <el-row type="flex" justify="space-around" align="middle" style="margin: 20px 0;">
      <el-col :span="6">
        <span>起始时间：</span>
      </el-col>
      <el-col :span="18">
        <el-date-picker
          v-model="searchValue.startTimes"
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
      <el-col :span="6">
        <span>截止时间：</span>
      </el-col>
      <el-col :span="18">
        <el-date-picker
          v-model="searchValue.endTimes"
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
import { queryBusinessLeaderList, mGetDictionary } from '@/api/number'
export default {
  name: 'ChannelScreen',
  props: {
    channelType: {
      type: Array,
      default: null
    },
    searchValue: {
      type: Object,
      default: null
    },
    status: {
      type: Array,
      default: null
    },
    isBillChannel: {
      type: Array,
      default: null
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    areaList: {
      type: [Array, String, Object],
      default: function() {
        return []
      }
    },
    carDealerList: {
      type: [Array, String, Object],
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      businessLeaderList: [],
      gardingList: []
    }
  },
  methods: {
    getBusinessLeaderList() {
      queryBusinessLeaderList('yuebao-002')
        .then(res => {
          const { data: businessLeaderList } = res
          this.businessLeaderList = businessLeaderList
        })
        .catch(err => {
          console.warn(err)
        })
    },
    getGardingList() {
      mGetDictionary('00119')
        .then(res => {
          const { data: gardingList } = res
          this.gardingList = gardingList
        })
        .catch(err => {
          console.warn(err)
        })
    },
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
  span {
    font-size: 14px;
  }
</style>
