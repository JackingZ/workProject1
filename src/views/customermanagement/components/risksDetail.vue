<template>
  <div v-loading="loading" class="risk-detail">
    <div class="customerheader">
      <div class="item-wrap">
        <info-item :text="policy.companyName" title="保险公司"/>
        <info-item :text="policy.organizationName" title="出单机构"/>
        <info-item :text="policy.ownerName" title="车主姓名"/>
      </div>
      <div class="item-wrap">
        <info-item :text="policy.vciPolicyNo" title="商业险保单号"/>
        <info-item :text="policy.tciPolicyNo" title="交强险保单号"/>
        <info-item :text="policy.insuredName" title="被保人姓名"/>
      </div>
      <div class="item-wrap">
        <info-item :text="policy.vciEndDate ? policy.vciEndDate:'--'" title="商业险止期"/>
        <info-item :text="policy.tciEndDate ? policy.tciEndDate:'--'" title="交强险止期"/>
        <info-item :text="`${policy.insuredIdTypeName} ${policy.insuredIdNo}`" title="被保人证件号"/>
      </div>
    </div>
    <template v-if="insureType !==1">
      <div class="inner-header mt-25">
        <div class="title">主险</div>
      </div>
      <div class="risk-display-item">
        <div class="item1">险种项目</div>
        <div class="item2">保险金额(元)</div>
        <div class="item2">保费(元)</div>
        <div class="item3">是否投保不计免</div>
        <div class="item3">不计免保费(元)</div>
      </div>
      <div v-for="item in risks" :key="item.orderId">
        <div v-if="isMainInsure(item)" class="risk-display-item border-t">
          <div class="item1">{{ item.riskName }}</div>
          <div class="item2">{{ item.amount }}</div>
          <div class="item2">{{ item.premium }}</div>
          <div class="item3">{{ item.isDeductible ? '是':'否' }}</div>
          <div class="item3">{{ item.deductPremium ? item.deductPremium : '--' }}</div>
        </div>
      </div>
      <!-- 特约险 -->
      <div class="inner-header mt-25">
        <div class="title">附加险&特约险</div>
      </div>
      <div class="risk-display-item">
        <div class="item1">险种项目</div>
        <div class="item2">保险金额(元)</div>
        <div class="item2">保费(元)</div>
        <div class="item3">是否投保不计免</div>
        <div class="item3">不计免保费(元)</div>
      </div>
      <div v-for="item in risks" :key="item.riskCode">
        <div v-if="!isMainInsure(item)" class="risk-display-item border-t">
          <div class="item1">{{ item.riskName ? item.riskName : '其他' }}</div>
          <div class="item2">{{ item.amount || item.amount===0 ? item.amount : '--' }}</div>
          <div class="item2">{{ item.premium }}</div>
          <div class="item3">{{ item.isDeductible===1 ? '是' :'否' }}</div>
          <div class="item3">{{ item.deductPremium ? item.deductPremium : '--' }}</div>
        </div>
      </div>
    </template>
    <div class="commonInfo">合计：总保费{{ policy.totalPremium }}元 : <span v-if="insureType !==1"> 商业险{{ policy.vciPremium }} 元（其中不计免赔险{{ deductibleToalPremium }}元） </span>  <span v-if="insureType === 1">交强险{{ policy.tciPremium }}元，车船税{{ policy.vehicleTax }}元</span></div>
    <!-- <div v-if="isMainInsure(item)" class="risk-display-item border-t">
          <div class="item1">{{ item.riskName }}</div>
          <div class="item2">{{ getAmount(item) }}</div>
          <div class="item2">{{ getFee(item) }}</div>
          <div class="item3">{{ hasDeductible(item) }}</div>
          <div class="item3">{{ item.deductPremium }}</div>
        </div> -->
  </div>
</template>
<script>
import InfoItem from '@/views/customermanagement/components/infoItem'
import company from '@/views/businessmanagement/company.js'
// import { mapGetters } from 'vuex'
export default {
  name: 'RiskDetail',
  components: {
    InfoItem
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    prevInsureData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    riskType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      insureinfo: {
        oragn: '大童'
      }
    }
  },
  computed: {
    // ...mapGetters(['prevRisks', 'prevPolicy']),
    risks() {
      return this.prevInsureData.risks || []
    },
    policy() {
      return this.prevInsureData || {}
    },
    insureType() { // 是否单交强
      if (this.riskType === '单交强') {
        return 1
      } else if (this.riskType === '单商业') {
        return 2
      } else {
        return 3
      }
    },
    // applicant() {
    //   return this.prevInsureData.applicant || {}
    // },
    deductibleToalPremium() {
      let result = 0
      this.risks.forEach(item => {
        if (item.isDeductible) {
          result += item.deductPremium
        }
      })
      return result.toFixed(2)
    }
  },
  methods: {
    // 是否主险
    isMainInsure(item) {
      if (item && /^(a0|a1|a2|a3|a4)$/.test(item.riskCode)) return true
      return false
    },
    //   获取保额
    getAmount(item) {
      switch (item.riskCode) {
        // 乘客险
        case 'a4':
          if (item.quantity && item.unitAmount) { return `${item.unitAmount} x ${item.quantity}` }
          break
        case 'a3':
          if (item.unitAmount) { return `${item.unitAmount}` }
          break
        // 玻璃险
        case 'a6':
          if (!this.isAssign(item.glassType)) return '--'
          return parseInt(item.glassType) === 0 ? '国产' : '进口'
      }
      return item.amount
    },
    getCompanyName(companyId) {
      const companyList = company()
      const companyinfo = companyList.find(item => {
        return item.id === companyId
      })
      if (!companyinfo) {
        return ''
      }
      return companyinfo.name
    },
    // 获取保费
    getFee(item) {
      return item.premium || '--'
    },
    // 是否有不计免
    hasDeductible(item) {
      if (item.isDeductible && parseInt(item.isDeductible) === 1) return '是'
      return ''
    }
  }
}
</script>
<style lang="scss">
.risk-detail{
 .item-wrap {
    display: flex;
  }
  .commonInfo{
    width:100%;
    height:60px;
    line-height:60px;
    border-radius:3px;
    font-size:14px;
    background:	#F2F2F2;
    padding-left: 80px;
    margin-top:30px;

  }
}

</style>
