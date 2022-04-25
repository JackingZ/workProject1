<template>
  <el-dialog
    v-loading="loadingData"
    :visible="isShow"
    class="quote-list-info"
    width="950px"
    @close="$emit('close')">
    <div slot="title">报价详情</div>
    <div class="content">
      <div class="left-side">
        <left-item :content="baseInfo.licenseNo" title="车牌号"/>
        <left-item :content="baseInfo.frameNo" title="车架号"/>
        <left-item :content="baseInfo.engineNo" title="发动机号"/>
        <left-item :content="baseInfo.brandName" title="品牌型号"/>
        <left-item :content="baseInfo.enrollDate" title="注册日期"/>
        <left-item v-if="isAssign(baseInfo.vciLossOccurredCount)" :content="formatOccurrence(baseInfo.vciLossOccurredCount)" title="商业上年出险"/>
        <left-item v-if="isAssign(baseInfo.tciLossOccurredCount)" :content="formatOccurrence(baseInfo.tciLossOccurredCount)" title="交强上年出险"/>
        <left-item v-if="baseInfo.vciStartDate" :content="baseInfo.vciDiscount" title="商业折扣系数"/>
        <left-item v-if="baseInfo.tciStartDate" :content="baseInfo.tciDiscount" title="交强折扣系数"/>
        <left-item v-if="baseInfo.tciStartDate" :content="baseInfo.tciStartDate" title="交强起保日期"/>
        <left-item v-if="baseInfo.vciStartDate" :content="baseInfo.vciStartDate" title="商业起保日期"/>
        <div class="divider"/>
        <left-item :content="baseInfo.ownerName" title="车主姓名"/>
        <left-item :content="baseInfo.ownerPhone" title="车主手机"/>
        <left-item :content="`${baseInfo.ownerIdType} ${baseInfo.ownerIdNo}`" title="车主证件号"/>
        <left-item :content="baseInfo.ownerAddr" title="车主地址"/>
        <left-item :content="baseInfo.holderName" title="投保人姓名"/>
        <template v-if="!baseInfo.insuredCheck">
          <left-item :content="baseInfo.holderPhone" title="投保人手机"/>
          <left-item :content="`${baseInfo.holderIdType} ${baseInfo.holderIdNo}`" title="投保人证件号"/>
          <left-item :content="baseInfo.holderAddr" title="投保人地址"/>
        </template>
        <left-item :content="baseInfo.insuredName" title="被保人姓名"/>
        <template v-if="!baseInfo.holderCheck && !baseInfo.ownerCheck">
          <left-item :content="baseInfo.insuredPhone" title="被保人手机"/>
          <left-item :content="`${baseInfo.insuredIdType} ${baseInfo.insuredIdNo}`" title="被保人证件号"/>
          <left-item :content="baseInfo.insuredAddr" title="被保人地址"/>
        </template>
        <div class="divider"/>
        <left-item :content="baseInfo.teamName" title="所属团队"/>
        <left-item :content="baseInfo.phone" title="业务员手机"/>
        <left-item :content="baseInfo.idName" title="业务员姓名"/>
      </div>
      <div class="right-side">
        <div class="right-header">
          <div>
            <img :src="companyAvatar" class="icon">
            <span>{{ detail.companyName }} &nbsp; | &nbsp; {{ detail.province_city }} &nbsp; | &nbsp; {{ quoteTime }}</span>
          </div>
          <div class="quote-success">
            {{ isQuoteSuccess ? '报价成功' : '报价失败' }}
          </div>
        </div>
        <table
          v-if="isQuoteSuccess"
          class="right-item"
          width="520"
          border="0"
          cellspacing="1"
          cellpadding="0">
          <right-item
            title="险种名称"
            amount="保险金额(元)"
            fee="保险费(元)"/>
          <right-item
            v-for="(item, index) in riskList"
            :key="index"
            :title="item.riskName"
            :amount="getAmount(item)"
            :fee="getFee(item)"/>
        </table>
        <div v-if="isQuoteSuccess" class="bottom-content">
          <div class="to-right">
            <div class="item">
              <span class="item-title">商业险合计：</span>
              <span>{{ baseInfo.vciPremium }}元</span>
            </div>
            <div class="item">
              <span class="item-title">交强险合计：</span>
              <span>{{ baseInfo.tciPremium }}元</span>
            </div>
            <div class="item">
              <span class="item-title">车船税合计：</span>
              <span>{{ baseInfo.vehicleTax }}元</span>
            </div>
            <div class="item">
              <span class="item-title">总保费：</span>
              <span>{{ baseInfo.totalPremium }}元</span>
            </div>
            <div style="font-size: 13px; padding: 10px 0;text-align: right;"> {{ extraInfo }} </div>
          </div>
        </div>
        <div v-if="!isQuoteSuccess" class="quote-fail">
          {{ detail.reason }}
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import dayjs from 'dayjs'
import company from '@/views/businessmanagement/company.js'
export default {
  components: {
    LeftItem: {
      props: {
        title: String,
        content: [String, Number]
      },
      render(h) {
        return (
          <div class='left-item'>
            <div class='left-title'>{ this.title }：</div>
            <div class='left-content'>{ this.content }</div>
          </div>
        )
      }
    },
    RightItem: {
      props: {
        title: String,
        amount: [String, Number],
        fee: [String, Number]
      },
      render(h) {
        return (
          <tr>
            <td width='280' class='right-title'>{ this.title }</td>
            <td width='120'>{ this.amount }</td>
            <td width='120'>{ this.fee }</td>
          </tr>
        )
      }
    }
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    quoteInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loadingData: false
    }
  },
  computed: {
    detail() {
      return this.quoteInfo || {}
    },
    baseInfo() {
      return this.detail.baseInfo || {}
    },
    riskList() {
      return this.detail.riskList || []
    },
    quoteTime() {
      const quoteTime = this.detail.quoteTime
      if (quoteTime) return dayjs(quoteTime).format('YYYY-MM-DD HH:mm:ss')
      return ''
    },
    isQuoteSuccess() {
      return this.detail.policyStatus !== 0
    },
    // 保险公司头像
    companyAvatar() {
      const companyList = company()
      const id = this.detail.companyId
      const item = companyList.find(item => item.id === id)
      if (!item) return
      const src = require(`@/assets/companyavatar/c_${item.icon}.png`)
      return src
    },
    extraInfo() {
      const baseInfo = this.baseInfo
      const infoList = [
        baseInfo.payableFee ? `当年应缴${baseInfo.payableFee}元，` : '',
        baseInfo.arrearFee ? `往年应缴${baseInfo.arrearFee}元，` : '',
        baseInfo.lateFee ? `滞纳金${baseInfo.lateFee}元` : ''
      ]
      const isHasTwo = (baseInfo.payableFee && baseInfo.arrearFee) || (baseInfo.payableFee && baseInfo.lateFee)
      if (isHasTwo) {
        let str = infoList.join('')
        if (str.substr(str.length - 1, str.length) === '，') {
          str = str.substr(0, str.length - 1)
        }
        return str
      }
      return ''
    }
  },
  methods: {
    isAssign(obj) {
      return obj !== null && obj !== undefined && obj !== ''
    },
    // 格式化出险次数
    formatOccurrence(occurrence) {
      console.log('formatOccurrence', occurrence)
      if (occurrence === null || occurrence === undefined || occurrence === '') return '--'
      const count = parseInt(occurrence)
      switch (true) {
        case count === 0:
          return '新保或出险1次'
        case count <= 3 && count >= 0:
          return `出险${count}次`
        case count > 3:
          return '出险3次以上'
        case count === -1:
          return '上年未出险'
        case count < -1 && count >= -5:
          return `连续${-count}年未出险`
        case count < 5:
          return '5年以上未出险'
      }
      return `--`
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
    },
    formatIdNo(type, idNo) {
      let typeName = ''
      switch (type) {
        case '101':
          typeName = '身份证'
          break
        case '102':
          typeName = '护照'
          break
        case '103':
          typeName = '军人证'
          break
        case '104':
          typeName = '港澳通行证'
          break
        case '105':
          typeName = '台胞证'
          break
        case '201':
        case '301':
          typeName = '统一社会信用代码'
          break
        case '202':
        case '302':
          typeName = '组织机构代码'
          break
        case '203':
        case '303':
          typeName = '税务登记证'
          break
        case '204':
        case '304':
          typeName = '营业执照'
          break
        case '299':
        case '399':
          typeName = '其他'
          break
      }
      return `${typeName} | ${idNo}`
    }
  }
}
</script>
<style lang="scss">
.quote-list-info{
  .el-dialog__header{
    border-bottom: 1px solid #eee;
  }
  .el-dialog__body{
    padding: 0px;
  }
  .content{
    display: flex;
    max-height: 600px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .left-side{
    padding: 20px 0 20px 25px;
    font-size: 12px;
  }
  .left-item{
    display: flex;
    line-height: 26px;
    .left-title{
      width: 100px;
    }
    .left-content{
      width: 250px;
    }
  }
  .divider {
    background: #eee;
    height: 1px;
    margin: 5px 0;
  }
  .right-side{
    flex: 1;
    padding: 20px 25px 20px 30px;
    img {
      width: 30px;
      height: 30px;
      margin-right: 15px;
    }
    .right-header{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 20px;
      div {
        display: flex;
        align-items: center;
      }
    }
    .quote-success {
      color: #409EFF;
    }
    .quote-fail{
      color: #FF0000;
    }
  }
  table.right-item{
    background: #eee;
    font-size: 12px;
    tr {
      line-height: 30px;
    }
    td {
      padding-left: 10px;
      box-sizing: border-box;
      background: #fff;
    }
    .right-title {
      background: #F5F5F5;
    }
  }
  .bottom-content{
    position: relative;
    margin-top: 10px;
    // .to-right{
      // position: absolute;
      // top: 0;
      // right: 0;
    // }
    .item {
      line-height: 30px;
      text-align: right;
    }
    .item-title{
      font-weight: bold;
    }
  }
}
</style>
