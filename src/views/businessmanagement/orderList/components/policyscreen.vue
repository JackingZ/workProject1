<template>
  <div class="app-container">

    <el-row type="flex" justify="space-around" align="middle" style="margin: 20px 0;">
      <el-col :span="6">
        <span>保险公司:</span>
      </el-col>
      <el-col :span="18">
        <el-select
          v-model="selectValue.company"
          size="small"
          clearable
          filterable
          placeholder="请选择"
          style="width: 100%;">
          <el-option
            v-for="item in companyList.data"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-col>
    </el-row>

    <el-row type="flex" justify="space-around" align="middle" style="margin: 20px 0;">
      <el-col :span="6">
        <span>出单工号:</span>
      </el-col>
      <el-col :span="18">
        <el-select
          v-model="selectValue.workNo"
          size="small"
          clearable
          filterable
          placeholder="请选择"
          style="width: 100%;">
          <el-option
            v-for="item in workNoList.data"
            :key="item.id"
            :label="item.channelName"
            :value="item.id"/>
        </el-select>
      </el-col>
    </el-row>

    <el-row type="flex" justify="space-around" align="middle" style="margin: 20px 0;">
      <el-col :span="6">
        <span>承保类型:</span>
      </el-col>
      <el-col :span="18">
        <el-select
          v-model="selectValue.insureType"
          size="small"
          clearable
          filterable
          placeholder="请选择"
          style="width: 100%;">
          <el-option
            v-for="item in insureTypeList"
            :key="item.key"
            :label="item.value"
            :value="item.key"/>
        </el-select>
      </el-col>
    </el-row>

    <!--<el-row type="flex" justify="space-around" align="middle" style="margin: 20px 0;">-->
    <!--<el-col :span="6">-->
    <!--<span>保单获取:</span>-->
    <!--</el-col>-->
    <!--<el-col :span="18">-->
    <!--<el-select-->
    <!--v-model="value"-->
    <!--size="small"-->
    <!--clearable-->
    <!--filterable-->
    <!--placeholder="请选择"-->
    <!--style="width: 100%;">-->
    <!--<el-option-->
    <!--v-for="item in options"-->
    <!--:key="item.value"-->
    <!--:label="item.label"-->
    <!--:value="item.value"/>-->
    <!--</el-select>-->
    <!--</el-col>-->
    <!--</el-row>-->

    <el-row type="flex" justify="space-around" align="middle" style="margin: 20px 0;">
      <el-col :span="6">
        <span>录入来源:</span>
      </el-col>
      <el-col :span="18">
        <el-select
          v-model="selectValue.policyType"
          size="small"
          clearable
          filterable
          placeholder="请选择"
          style="width: 100%;">
          <el-option
            v-for="item in policyTypeList"
            :key="item.key"
            :label="item.value"
            :value="item.key"/>
        </el-select>
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
import { getCompanysData } from '@/api/number'
import { getChannelNames } from '@/api/policy_management'

export default {
  name: 'Policyscreen',
  props: {
    selectValue: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      companyList: {
        loading: false,
        data: []
      },
      insureTypeList: [
        { key: 0, value: '单交强' },
        { key: 1, value: '单商业' },
        { key: 2, value: '交商共保' }
      ],
      policyTypeList: [
        { key: 0, value: '移动出单' },
        { key: 1, value: '保存保单' },
        { key: 2, value: '手动录入' },
        { key: 3, value: '手动抓单' },
        { key: 4, value: '自动抓单' }
      ],
      workNoList: {
        loading: false,
        data: []
      },
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: ''
    }
  },
  created() {
    // 获取公司列表
    getCompanysData()
      .then(res => {
        this.companyList.loading = false
        this.companyList.data = res.data
      })
      .catch(err => {
        this.companyList.loading = false
        console.warn(err)
      })
    // 获取出单工号
    getChannelNames()
      .then(res => {
        this.workNoList.loading = false
        this.workNoList.data = res.data
        console.log(res.data)
      })
      .catch(err => {
        this.workNoList.loading = false
        console.warn(err)
      })
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
  span {
    font-size: 14px;
  }
</style>
