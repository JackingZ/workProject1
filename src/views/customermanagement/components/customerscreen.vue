<template>
  <div class="app-container">
    <el-form ref="ruleForm2" :model="selectValue" status-icon label-width="100px" class="demo-ruleForm">
      <el-form-item label="商业险止期" prop="businessDate">
        <el-date-picker
          v-model="selectValue.businessDate"
          :default-time="['00:00:00', '23:59:59']"
          clearable
          size="small"
          style="width: 100%;margin-right: 10px;"
          type="daterange"
          range-separator="-"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="交强险止期" prop="trafficDate">
        <el-date-picker
          v-model="selectValue.trafficDate"
          :default-time="['00:00:00', '23:59:59']"
          clearable
          size="small"
          style="width: 100%; margin-right: 10px;"
          type="daterange"
          range-separator="-"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="往年投保" prop="lastInsureCompany">
        <el-select
          v-model="selectValue.lastInsureCompany"
          :loading="companyList.loading"
          size="small"
          clearable
          filterable
          placeholder="请选择"
          style="width: 100%;"
          @focus="getCompanyList"
        >
          <el-option
            v-for="item in companyList.data"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="录入来源" prop="source">
        <el-select
          v-model="selectValue.source"
          :loading="sourceList.loading"
          size="small"
          clearable
          filterable
          placeholder="请选择"
          style="width: 100%;"
          @focus="geFollowUpType('00202','sourceList')"
        >
          <el-option
            v-for="item in sourceList.data"
            :key="item.code"
            :value="item.code"
            :label="item.value1" />
        </el-select>
      </el-form-item>
      <el-form-item label="分配状态" prop="distriStatus">
        <el-select
          v-model="selectValue.distriStatus"
          :loading="companyList.loading"
          size="small"
          clearable
          filterable
          placeholder="请选择"
          style="width: 100%;"
        >
          <el-option :value="1" label="已分配" />
          <el-option :value="2" label="未分配" />
        </el-select>
      </el-form-item>
      <el-form-item label="分配时间" prop="assignTime">
        <el-date-picker
          v-model="selectValue.assignTime"
          :default-time="['00:00:00', '23:59:59']"
          clearable
          size="small"
          style="width: 100%; margin-right: 10px;"
          type="daterange"
          range-separator="-"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="业务员" prop="saleman">
        <el-select
          v-model="selectValue.saleman"
          :loading="salemanList.loading"
          size="small"
          clearable
          filterable
          placeholder="请选择"
          style="width: 100%;"
          @focus="getSaleman"
        >
          <el-option
            v-for="item in salemanList.data"
            :key="item.id"
            :value="item.id"
            :label="item.fullName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="客户状态" prop="customerStatus">
        <el-select
          v-model="selectValue.customerStatus"
          :loading="companyList.loading"
          size="small"
          clearable
          filterable
          placeholder="请选择"
          style="width: 100%;"
        >
          <el-option :value="1" label="无" />
          <el-option :value="2" label="未到期" />
          <el-option :value="3" label="待跟进" />
          <el-option :value="4" label="已报价" />
          <el-option :value="5" label="已出单" />
        </el-select>
      </el-form-item>
      <el-form-item label="跟进状态" prop="followStatus">
        <el-select
          v-model="selectValue.followStatus"
          :loading="followStatus.loading"
          size="small"
          clearable
          filterable
          placeholder="请选择"
          style="width: 100%;"
          @focus="geFollowUpType('00201','followStatus')">
          <el-option
            v-for="item in followStatus.data"
            :key="item.code"
            :label="item.value1"
            :value="item.code"
          />
      </el-select></el-form-item>
      <el-form-item label="客户电话" prop="hasCell">
        <el-select
          v-model="selectValue.hasCell"
          :loading="companyList.loading"
          size="small"
          clearable
          filterable
          placeholder="请选择"
          style="width: 100%;"
        >
          <el-option :value="1" label="有" />
          <el-option :value="2" label="无" />
        </el-select>
      </el-form-item>
      <el-form-item label="初登日期" prop="firstDate">
        <el-date-picker
          v-model="selectValue.firstDate"
          :default-time="['00:00:00', '23:59:59']"
          clearable
          size="small"
          style="width: 100%; margin-right: 10px;"
          type="daterange"
          range-separator="-"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="品牌型号" prop="brandCode">
        <el-input v-model="selectValue.brandCode" size="small" />
      </el-form-item>
      <el-form-item style="margin-top:10px;">
        <div style="">
          <el-button size="medium" @click="reset('ruleForm2')" >重置</el-button>
          <el-button size="medium" type="primary" style="margin-left:10px;" @click="screen">确定</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getCompanysData
} from '@/api/customerManage'
import {
  queryCustomerStatus,
  queryCustomerSaleman
} from '@/api/newCustomer'
import { mapGetters } from 'vuex'

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
      value: '',
      followStatus: {
        data: [],
        loading: false
      },
      sourceList: {
        data: [],
        loading: false
      },
      salemanList: {
        data: [],
        loading: false
      }
    }
  },
  computed: {
    ...mapGetters(['isAnyAdminChannel']),
    // 是否大童渠道
    isDatongChannel() {
      return JSON.parse(localStorage.getItem('userAll')).data.channelCode === '001'
    }
  },
  created() {
  },
  methods: {
    // 获取保险公司列表
    getCompanyList() {
      this.companyList.loading = true
      getCompanysData()
        .then(res => {
          this.companyList.loading = false
          // const companys = res.data.filter(v => {
          //   return v.isMock !== 1
          // })
          this.companyList.data = res.data
        })
        .catch(err => {
          this.companyList.loading = false
          console.warn(err)
        })
    },
    // 获取跟进状态
    // 获取客户类型
    geFollowUpType(typeCode, key) {
      // typeCode 为0021表示查询客户跟进状态，00202表示查询录入来源
      this[key].loading = true
      queryCustomerStatus(typeCode).then(res => {
        this[key].loading = false
        this[key].data = res.data
      }).catch(err => {
        this[key].loading = false
        console.warn(err)
      })
    },
    // 获取业务员
    getSaleman() {
      console.log('获取业务员')
      console.log('所属机构' + this.selectValue.companyId)
      if (!this.selectValue.companyId) {
        console.log('获取业务员')
        this.$message({
          message: '请先选择所属机构',
          type: 'warning'
        })
        this.$emit('openTree')
        return
      }
      this.getSalemanList()
    },
    // 获取业务员
    getSalemanList() {
      this.salemanList.loading = true
      const params = [this.selectValue.companyId]
      queryCustomerSaleman(params).then(res => {
        console.log(res)
        res.data.forEach(item => {
          item.fullName = item.idName + '--' + item.phone
        })
        this.salemanList.data = res.data
        this.salemanList.loading = false
      }).catch(err => {
        this.salemanList.loading = false
        console.warn(err)
      })
    },
    screen() {
      console.log(this.selectValue)
      //   console.log(this.$refs.ruleForm2)
      this.$emit('screen')
    },
    reset(formName) {
      this.$refs[formName].resetFields()
    //   console.log(this.$refs.ruleForm2)
    //   this.$refs.ruleForm2.resetFields()
    //   this.$emit('reset')
    }
  }
}
</script>

<style scoped>
span {
  font-size: 14px;
}
</style>
