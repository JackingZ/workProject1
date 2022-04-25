<template>
  <div id="insurancedetails" style="padding-top: 20px;">
    <span style="font-weight: 800;">险种明细</span>
    <app-form-group style="margin-top: 20px;">
      <app-form-item :span="8" label="商业险险种：" background/>
      <app-form-item :span="8" label="保险金额(元)"/>
      <app-form-item :span="8" label="保险费(元)"/>
    </app-form-group>
    <app-form-group
      v-for="(item, index) in riskList"
      :key="index">
      <app-form-item :span="8" :label="item.riskName" background/>
      <app-form-item :span="8" :label="getAmount(item)"/>
      <app-form-item :span="8" :label="getFee(item)"/>
    </app-form-group>
    <app-form-group>
      <app-form-item :span="8" label="合计：" background/>
      <app-form-item :span="16" :label="totalInfo"/>
    </app-form-group>
  </div>
</template>
<script>
export default {
  props: {
    riskList: {
      type: Array,
      default: () => []
    },
    policyExt: {
      type: Object,
      default: () => {}
    },
    tax: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    extraInfo() {
      const tax = this.tax
      const infoList = [
        '(',
        tax.payableFee ? `当年应缴${tax.payableFee}元，` : '',
        tax.arrearFee ? `往年应缴${tax.arrearFee}元，` : '',
        tax.lateFee ? `滞纳金${tax.lateFee}元` : '',
        ')'
      ]
      // 往年应缴  或者  滞纳金 不为空/不为0
      const isHasTwo = (tax.payableFee && tax.arrearFee) || (tax.payableFee && tax.lateFee)
      if (isHasTwo) return infoList.join('')
      return ''
    },
    taxInfo() {
      const policyExt = this.policyExt
      const taxInfo = policyExt.vehicleTax ? `，车船税${policyExt.vehicleTax}元` : ''
      return `${taxInfo} ${this.extraInfo}`
    },
    vciInfo() {
      const policyExt = this.policyExt
      return policyExt.vciPremium ? `商业险${policyExt.vciPremium}元，` : ''
    },
    tciInfo() {
      const policyExt = this.policyExt
      return policyExt.vciPremium ? `交强险${policyExt.tciPremium}元` : ''
    },
    totalInfo() {
      const policyExt = this.policyExt
      return `总保费${policyExt.totalPremium}元：${this.vciInfo}
        ${this.tciInfo} ${this.taxInfo}`
    }
  },
  methods: {
    isAssign(obj) {
      return obj !== null && obj !== undefined && obj !== ''
    },
    getAmount(item) {
      switch (item.riskCode) {
        // 乘客险
        case 'a4':
          if (item.quantity && item.unitAmount) return `${item.unitAmount} x ${item.quantity}`
          break
        // 玻璃险
        case 'a6':
          if (!this.isAssign(item.glassType)) return '--'
          return parseInt(item.glassType) === 0 ? '国产' : '进口'
      }
      return item.amount
    },
    getFee(item) {
      return item.premium || '--'
    }
  }
}
</script>
