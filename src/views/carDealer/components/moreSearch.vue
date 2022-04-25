<template>
  <div class="moreSearch">
    <el-form v-loading="isLoading" ref="searchForm" :model="searchForm" label-position="top" class="search-form" label-width="120px">
      <el-form-item label="车架号" prop="frameNo">
        <el-input v-model="searchForm.frameNo" placeholder="请输入车架号" size="small" @change="handleframeNo" />
      </el-form-item>
      <el-form-item label="联系电话" prop="ownerPhone">
        <el-input v-model="searchForm.ownerPhone" placeholder="请输入联系电话" size="small" @change="handlePhone" />
      </el-form-item>
      <el-form-item label="投保人" prop="holderName">
        <el-input v-model="searchForm.holderName" placeholder="请输入投保人" size="small" />
      </el-form-item>
      <el-form-item label="商业险止期" prop="comEndDate">
        <el-date-picker v-model="searchForm.comEndDate" type="month" value-format="timestamp" placeholder="请选择商业险止期" size="small" />
      </el-form-item>
      <el-form-item label="交强险止期" prop="forceEndDate">
        <el-date-picker v-model="searchForm.forceEndDate" type="month" value-format="timestamp" placeholder="请选择交强险止期" size="small" />
      </el-form-item>
      <el-form-item v-if="routePath !== 'enterstore' && routePath === 'myTask'" label="任务状态" prop="taskState">
        <el-select v-model="searchForm.taskState" size="small" placeholder="请选择任务状态">
          <el-option v-for="item in taskOneStateList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="routePath !== 'enterstore' && routePath === 'myTask02'" label="任务状态" prop="taskState">
        <el-select v-model="searchForm.taskState" size="small" placeholder="请选择任务状态">
          <el-option v-for="item in taskTwoStateList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间" prop="allocationTime">
        <el-date-picker v-model="searchForm.allocationTime" type="month" value-format="timestamp" placeholder="请选择分配时间" size="small" />
      </el-form-item>
      <el-form-item label="计划回访时间" prop="planReturnTime">
        <el-date-picker v-model="searchForm.planReturnTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择计划回访时间" size="small" />
      </el-form-item>
      <el-form-item label="录入回访时间" prop="returnTime">
        <el-date-picker v-model="searchForm.returnTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择录入回访时间" size="small" />
      </el-form-item>
      <el-form-item v-if="routePath === 'myTask' || routePath === 'myTask02'" label="报价状态" prop="quoteFlag">
        <el-select v-model="searchForm.quoteFlag" clearable filterable placeholder="请选择报价状态" size="small">
          <el-option v-for="item in taskQuoteFlaglist" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="routePath === 'enterstore'" label="报价状态" prop="quoteFlag">
        <el-select v-model="searchForm.quoteFlag" clearable filterable placeholder="请选择报价状态" size="small">
          <el-option v-for="item in enterQuoteFlaglist" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户类型" prop="type">
        <el-select v-model="searchForm.type" clearable filterable placeholder="请选择客户类型" size="small">
          <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="跟进状态" prop="state">
        <el-select v-model="searchForm.state" clearable filterable placeholder="请选择跟进状态" size="small">
          <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="品牌型号" prop="brandName">
        <el-input v-model="searchForm.brandName" placeholder="请输入品牌型号" size="small" />
      </el-form-item>
      <el-form-item v-if="routePath !== 'enterstore'" label="录入方式" prop="inputType">
        <el-select v-model="searchForm.inputType" clearable filterable placeholder="请选择录入方式" size="small">
          <el-option v-for="item in inputTypeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="注册日期" prop="enrollDate">
        <el-date-picker v-model="searchForm.enrollDate" type="month" value-format="timestamp" placeholder="请选择注册时间" size="small" />
      </el-form-item>
      <el-form-item label="去年投保公司" prop="lastCompanyId">
        <el-select :loading="selectLoading" v-model="searchForm.lastCompanyId" clearable filterable placeholder="请选择去年投保公司" size="small">
          <el-option v-for="item in companylist" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户电话" prop="phoneType">
        <el-select v-model="searchForm.phoneType" clearable filterable placeholder="请选择客户电话" size="small">
          <el-option v-for="item in phoneTypeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <div type="flex" justify="space-around" align="middle" style="padding: 30px 0;">
      <el-button type="primary" size="small" @click="screen">确定</el-button>
      <el-button plain size="small" @click="reset">清空</el-button>
      <el-button plain size="small" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { getInsuredCompany } from '@/api/mytask'
export default {
  name: 'Moresearch',
  props: {
    searchForm: {
      type: Object,
      default: null
    },
    routePath: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      isLoading: false,
      companylist: [],
      selectLoading: false,
      dateTypeList: [
        { label: '90天内到期', value: 0 },
        { label: '60天内到期', value: 1 },
        { label: '30天内到期', value: 2 },
        { label: '15天内到期', value: 3 },
        { label: '7天内到期', value: 4 }
      ],
      // 客户类型 列表
      typeList: [
        { label: '续转续', value: 1 },
        { label: '新转续', value: 0 },
        { label: '间转续', value: 2 },
        { label: '潜转续', value: 3 }
      ],
      // 任务状态 出单专员列表
      taskOneStateList: [
        // { label: '未分配', value: 0 },
        // { label: '已分配', value: 1 },
        { label: '申请报价', value: 0 },
        { label: '已报价', value: 1 },
        { label: '申请出单', value: 2 },
        // { label: '转派', value: 6 },
        { label: '成交出单', value: 3 }
        // { label: '跟进中', value: 2 },
        // { label: '即将到期', value: 3 },
        // { label: '申请报价', value: 4 },
        // { label: '已报价', value: 9 },
        // { label: '申请出单', value: 5 },
        // { label: '转派', value: 6 }
        // { label: '成交出单', value: 7 },
        // { label: '战败', value: 8 }
      ],
      // 任务状态 续保专员列表
      taskTwoStateList: [
        // { label: '未分配', value: 0 },
        { label: '未跟进', value: 1 },
        { label: '跟进中', value: 2 },
        // { label: '即将到期', value: 3 },
        { label: '申请报价', value: 4 },
        { label: '已报价', value: 9 },
        { label: '申请出单', value: 5 },
        { label: '转派', value: 6 },
        { label: '成交出单', value: 7 },
        { label: '战败', value: 8 }
      ],
      // 跟进状态 列表
      stateList: [
        { label: '忙碌中待联系', value: 0 },
        { label: '考虑中(普通)', value: 1 },
        { label: '考虑中(重点)', value: 2 },
        { label: '其他', value: 3 },
        { label: '预约到店', value: 4 },
        // { label: '成功出单', value: 6 },
        { label: '无效数据(停机/空号)', value: 5 },
        { label: '战败', value: 8 }
      ],
      // 续保状态 列表
      renewalStateList: [
        { label: '续保失败', value: 0 },
        { label: '续保成功', value: 1 },
        { label: '只取到行驶证(残缺数据)', value: 2 },
        { label: '未处理', value: 3 }
      ],
      // 报价状态 续保专员列表
      taskQuoteFlaglist: [
        { label: '未报价', value: -1 },
        { label: '报价成功', value: 1 },
        { label: '报价失败', value: 0 }
      ],
      // 报价状态 进站车辆列表
      enterQuoteFlaglist: [
        { label: '信息不全', value: 1 },
        { label: '保险未到期', value: 2 },
        { label: '报价失败', value: 3 },
        { label: '报价成功', value: 4 }
      ],
      // 录入方式 列表
      inputTypeList: [
        { label: '摄像头录入', value: 0 },
        { label: '批量录入', value: 1 },
        { label: '系统录入', value: 2 },
        { label: '系统报价', value: 3 }
      ],
      // 是否有客户电话 列表
      phoneTypeList: [
        { label: '有联系电话', value: 0 },
        { label: '无联系电话', value: 1 }
      ]
    }
  },
  created() {
    this.handleCompany()
  },
  methods: {
    screen() {
      this.$emit('screen')
    },
    reset() {
      this.$emit('reset')
    },
    cancel() {
      this.$emit('cancel')
    },
    // 车架号不能输入中文
    handleframeNo(value) {
      const reg = /^[a-z0-9]+$/i
      if (value && new RegExp(reg).test(value)) {
        this.errorTip = false
      } else {
        this.$message({
          message: '请输入正确的发动机号，只能是英文字母或数字，不能输入中文。',
          type: 'warning'
        })
        this.searchForm.frameNo = ''
      }
    },
    // 车主电话
    handlePhone(value) {
      const reg = /^[\d-]+$/
      if (value && new RegExp(reg).test(value)) {
        this.errorTip = false
      } else {
        this.$message({
          message: '请输入正确电话号码数字！不能包含符号和中文!',
          type: 'warning'
        })
        this.searchForm.ownerPhone = ''
      }
    },
    // 获取保险公司
    handleCompany() {
      getInsuredCompany()
        .then(res => {
          this.companylist = res.data
          this.selectLoading = false
        })
        .catch(err => {
          console.warn(err)
          this.selectLoading = false
        })
    }
  }
}
</script>

<style lang="scss">
.moreSearch {
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
