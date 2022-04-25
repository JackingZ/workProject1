<template>
  <div class="search-container">
    <el-form ref="searchForm" :model="searchForm" label-position="top" class="search-form" label-width="120px">

      <el-form-item label="车架号：">
        <el-input v-model="searchForm.frameNo" placeholder="请输入车架号" size="small" />
      </el-form-item>

      <el-form-item label="联系电话：">
        <el-input v-model="searchForm.ownerPhone" placeholder="请输入联系电话" size="small" />
      </el-form-item>

      <el-form-item label="投保人：">
        <el-input v-model="searchForm.holderName" placeholder="请输入投保人" size="small" />
      </el-form-item>

      <el-form-item label="商业险到期：">
        <el-date-picker v-model="searchForm.comTime" type="month" placeholder="请选择商业险到期" size="small" />
      </el-form-item>

      <el-form-item label="交强险到期：">
        <el-date-picker v-model="searchForm.forceTime" type="month" placeholder="请选择交强险到期" size="small" />
      </el-form-item>

      <el-form-item label="任务状态：">
        <el-select v-model="searchForm.taskState" clearable filterable placeholder="请选择任务状态" size="small">
          <el-option v-for="item in taskData" :key="item.key" :label="item.value" :value="item.key" />
        </el-select>
      </el-form-item>

      <el-form-item label="分配时间：">
        <el-date-picker v-model="searchForm.alloTime" type="month" placeholder="请选择分配时间" size="small" />
      </el-form-item>

      <el-form-item v-permission="[permissionList.renewalAdmin, permissionList.renewalCarAdmin]" label="续保专员：">
        <el-select v-model="searchForm.salesmanId" clearable filterable placeholder="请选择续保专员" size="small">
          <el-option v-for="item in salerData" :key="item.id" :label="item.nickName" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="计划回访时间：">
        <el-date-picker v-model="searchForm.planReturnTime" :picker-options="pickerPlanday" type="date" value-format="yyyy-MM-dd" placeholder="请选择计划回访时间" size="small" />
      </el-form-item>

      <!-- <el-form-item label="续保状态：">
        <el-select v-model="searchForm.renewalState" clearable filterable placeholder="请选择续保状态" size="small">
          <el-option v-for="item in renewalData" :key="item.key" :label="item.value" :value="item.key" />
        </el-select>
      </el-form-item> -->

      <el-form-item label="报价状态：">
        <el-select v-model="searchForm.quoteFlag" clearable filterable placeholder="请选择报价状态" size="small">
          <el-option v-for="item in priceData" :key="item.key" :label="item.value" :value="item.key" />
        </el-select>
      </el-form-item>

      <el-form-item label="客户类型：">
        <el-select v-model="searchForm.type" clearable filterable placeholder="请选择客户类型" size="small">
          <el-option v-for="item in typeData" :key="item.key" :label="item.value" :value="item.key" />
        </el-select>
      </el-form-item>

      <el-form-item label="跟进状态：">
        <el-select v-model="searchForm.state" clearable filterable placeholder="请选择跟进状态" size="small">
          <el-option v-for="item in followData" :key="item.key" :label="item.value" :value="item.key" />
        </el-select>
      </el-form-item>

      <el-form-item label="品牌型号：">
        <el-input v-model="searchForm.brandName" placeholder="请选择品牌型号" size="small" />
      </el-form-item>

      <el-form-item label="录入方式：">
        <el-select v-model="searchForm.inputType" clearable filterable placeholder="请选择录入方式" size="small">
          <el-option v-for="item in inputData" :key="item.key" :label="item.value" :value="item.key" />
        </el-select>
      </el-form-item>

      <el-form-item label="注册时间：">
        <el-date-picker v-model="searchForm.enrollTime" type="month" placeholder="请选择注册时间" size="small" />
      </el-form-item>

      <el-form-item label="去年投保公司：">
        <el-select v-model="searchForm.lastCompanyId" :loading="companyData.loading" clearable filterable placeholder="请选择去年投保公司" size="small" @focus="getInsureCompany">
          <el-option v-for="item in companyData.data" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="客户电话：">
        <el-select v-model="searchForm.hasPhone" clearable filterable placeholder="请选择客户电话" size="small">
          <el-option v-for="item in phoneData" :key="item.key" :label="item.value" :value="item.key" />
        </el-select>
      </el-form-item>

    </el-form>

    <div type="flex" justify="space-around" align="middle" style="margin: 20px 0;">
      <el-button type="primary" size="small" @click="screen">确定</el-button>
      <el-button plain size="small" @click="reset">清空</el-button>
      <el-button plain size="small" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { getInsuredCompany } from '@/api/customer'
export default {
  props: {
    searchForm: {
      type: Object,
      default: null
    },
    salerData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      companyData: {
        loading: false,
        data: []
      },
      typeData: [
        { key: '0', value: '新转续' },
        { key: '1', value: '续转续' },
        { key: '2', value: '间转续' },
        { key: '3', value: '潜转续' }
      ],
      taskData: [
        { key: 0, value: '未分配' },
        { key: 1, value: '已分配' },
        { key: 2, value: '跟进中' },
        // { key: 3, value: '即将到期' },
        { key: 4, value: '申请报价' },
        { key: 5, value: '申请出单' },
        { key: 6, value: '转派' },
        { key: 7, value: '成交出单' },
        { key: 8, value: '战败' },
        { key: 9, value: '已报价' }
      ],
      followData: [
        { key: 0, value: '忙碌中待联系' },
        { key: 1, value: '考虑中(普通)' },
        { key: 2, value: '考虑中(重点)' },
        { key: 3, value: '其他' },
        { key: 4, value: '预约到店' },
        { key: 5, value: '无效数据' }
        // { key: 6, value: '成功出单' },
        // { key: 8, value: '战败' }
      ],
      renewalData: [
        { key: '0', value: '未处理' },
        { key: '1', value: '续保成功' },
        { key: '2', value: '只取到行驶证' },
        { key: '3', value: '续保失败' }
      ],
      priceData: [
        { key: '0', value: '未报价' },
        { key: '1', value: '报价成功' },
        { key: '2', value: '报价失败' }
      ],
      inputData: [
        { key: '0', value: '摄像头录入' },
        { key: '1', value: '批量录入' },
        { key: '2', value: '系统录入' },
        { key: '3', value: '系统报价' }
      ],
      phoneData: [
        { key: '0', value: '有联系方式' },
        { key: '1', value: '无联系方式' }
      ],
      pickerPlanday: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      }
    }
  },
  methods: {
    getInsureCompany() {
      this.companyData.loading = true
      getInsuredCompany().then(res => {
        this.companyData.data = res.data
        this.companyData.loading = false
      }).catch(err => {
        this.companyData.loading = false
        console.warn(err)
      })
    },
    screen() {
      this.$emit('screen')
    },
    reset() {
      this.$emit('reset')
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss">
.search-container {
  padding: 20px;
}
.search-form {
  .el-form-item {
    display: inline-block;
    width: 30%;
    padding-left: 20px;
    margin-bottom: 0px;
    .el-form-item__label {
      padding: 20px 5px 5px 5px;
      line-height: 1em;
    }
    .el-input,
    .el-select {
      width: 100%;
    }
  }
}
</style>
