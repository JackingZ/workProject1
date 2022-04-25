<template>
  <div class="record-wrap">
    <div class="quote-record" style="height:635px;">
      <div class="left-menu" style="width:220px;float:left;">
        <el-menu
          :default-active="activeIndex"
          style="height:630px;"
          @select="handleRecordSelect">
          <el-menu-item
            v-for="(item,index) in quoteList"
            :key="item.orderId"
            :index="String(index)"
            @click="handleMenuClick(item.orderId,item.quoteStatusText)"
          >
            <div class="recordLogo" style="display:flex;">
              <div><img :src="companyAvatar(item.insureCompanyId)" width="60px" alt=""></div>
              <div style="text-align:left;margin-left:10px;">
                <div slot="title" class="info" style="font-size: 14px;color: #606266;font-weight:700;">{{ getCompanyName(item.insureCompanyId) }}</div>
                <div :class="[ item.quoteStatusText==='报价失败' ?'failed':'','info']" style="font-size: 12px;color: #606266;font-weight:400;">{{ item.quoteStatusText }}  |  ¥{{ item.totalPremium }}
                </div>
                <div class="info" style="font-size: 12px;color: #606266;weight:400;">{{ item.quoteDate }}</div>
              </div>
            </div>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="record-content" >
        <!-- <el-card class="box-card" style="width:1200px;margin:20px auto;"> -->
        <div v-loading="quoloading" style="display:flex; justify-content:space-around; height:560px;overflow:auto; max-width:1100px; margin:0 auto;">
          <div style="width:350px;line-height:30px;font-size: 14px;color: #606266;margin-left:20px;padding-top:20px;">
            <div>车牌号：{{ baseInfo.licenseNo }}</div>
            <div>车架号：{{ baseInfo.frameNo }}</div>
            <div>品牌型号：{{ baseInfo.brandName }}</div>
            <div>初登日期：{{ baseInfo.enrollDate }}</div>
            <div>商业上年出险：{{ formatOccurrence(baseInfo.vciLossOccurredCount) }}</div>
            <div>交强上年出险：{{ formatOccurrence(baseInfo.tciLossOccurredCount) }}</div>
            <div>商业折扣系数：{{ baseInfo.vciDiscount }}</div>
            <div>交强折扣系数：{{ baseInfo.tciDiscount }}</div>
            <div>商业起保日期：{{ baseInfo.vciStartDate }}</div>
            <div>交强起保日期：{{ baseInfo.tciStartDate }}</div>
            <div>车主姓名：{{ baseInfo.ownerName }}</div>
            <div>车主证件号：{{ baseInfo.ownerIdType }} {{ baseInfo.ownerIdNo }}</div>
            <div>车主手机：{{ baseInfo.ownerPhone }}</div>
            <div>车主地址：{{ baseInfo.ownerAddr }}</div>
            <div v-if="baseInfo.ownerCheck">被保人信息：<el-radio value="1" label="1">同车主</el-radio></div>
            <div v-else>
              <div>被保人姓名：{{ baseInfo.insuredName }}</div>
              <div>被保人证件号：{{ baseInfo.insuredIdType }}|{{ baseInfo.insuredIdNo }}</div>
              <div>被保人手机：{{ baseInfo.insuredPhone }}</div>
              <div>被保人地址：{{ baseInfo.insuredAddr }}</div>
              <div>所属机构：{{ baseInfo.teamName }}</div>
              <div>业务员：{{ baseInfo.idName }}</div>
            </div>
            <div v-if="baseInfo.insuredRadio===1">投保人信息：<el-radio value="1" label="1">同车主</el-radio></div>
            <div v-if="baseInfo.insuredRadio===2">投保人信息：<el-radio value="1" label="1">同被保人</el-radio></div>
            <div v-if="baseInfo.insuredRadio===3">
              <div>投保人姓名：{{ baseInfo.holderName }}</div>
              <div>投保人证件号：{{ baseInfo.holderIdType }}|{{ baseInfo.holderIdNo }}</div>
              <div>投保人手机：{{ baseInfo.holderPhone }}</div>
              <div>投保人地址：{{ baseInfo.holderAddr }}</div>
            </div>
          </div>
          <div class="right-table" style="width:600px;margin-top:30px;">
            <div v-if="isQuoteSuccess &&!customerQuoteRecord.reason">

              <el-table :data="riskList" border style="margin-top:10px;">
                <el-table-column :formatter="riskformatter" property="riskName" label="商业险险种" min-width="200" />
                <el-table-column property="amount" label="保险金额(元)" min-width="100"/>
                <el-table-column property="premium" label="保险费(元)" min-width="80"/>
              </el-table>
              <div class="risk-fee">
                <div class="item">
                  <span class="title">总保费：</span>
                  <span class="amount">{{ baseInfo.totalPremium }}元</span>
                </div>
                <div class="item">
                  <span class="title">商业险合计：</span>
                  <span class="amount">{{ baseInfo.vciPremium }}元</span>
                </div>
                <div class="item">
                  <span class="title">交强险合计：</span>
                  <span class="amount">{{ baseInfo.tciPremium }}元</span>
                </div>
                <div class="item">
                  <span class="title">车船税合计：</span>
                  <span class="amount">{{ baseInfo.vehicleTax }}元</span>
                </div>
                <div class="tax">当年应缴{{ baseInfo.payableFee }}元，往年应缴{{ baseInfo.arrearFee }}元，滞纳金{{ baseInfo.lateFee }}元</div>
              </div>
            </div>
            <div v-if="!isQuoteSuccess || customerQuoteRecord.reason" class="quote-failed" style="min-wdith:500px;">
              <div syle="color:#606266;">报价失败，返回提示信息如下：</div>
              <div style="color:#FF0000;min-wdith:500px;" >
                {{ customerQuoteRecord.reason }}
              </div>
            </div>
          </div>
        </div>
        <!-- </el-card> -->
        <div class="operate">
          <el-button type="primary" @click="reQuote">重新报价</el-button>
          <el-button type="primary" style="margin-left:20px;" @click="shareQuote">分享报价</el-button>
          <el-button type="primary" style="margin-left:20px;" @click="reQuote">申请核保</el-button>
          <el-button type="primary" style="margin-left:20px;" @click="reQuotePC">电脑出单</el-button>
        </div>
      </div>
    </div>

    <el-dialog :visible.sync="isShareShow" title="报价详情" width="414px" height="736px" class="share-detail">
      <share-detail
        :order-id="orderId2"/>
    </el-dialog>
  </div>
</template>
<script>
import {
  getQuoteRecord,
  getCustomerTokenByUserId
} from '@/api/newCustomer'
import ShareDetail from './sharecomponent/shareDetail'
import company from '@/views/businessmanagement/company.js'
import {
  // openNewProcessUrl,
  openNewProcessUrlWithConfig
} from '@/views/insurance/service/browserUtil'
// import { getTokenByUserId } from '@/api/organization'

import { mapState, mapGetters } from 'vuex'
export default {
  components: {
    ShareDetail
  },
  props: {
    quoteRecord: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      isQuoteSuccess: true,
      isShareShow: false,
      carInfo: {},
      // quotoInfo: {},
      activeIndex: '0',
      currentStatus: '',
      orderId: '',
      orderId2: '',
      quoloading: false // 报价记录加载动画
    }
  },
  computed: {
    ...mapState({
      quotoInfo: 'customerQuoteRecord'
    }),
    ...mapGetters(['baseInfo',
      'riskList',
      'customerR',
      'quoteRecords',
      'customerQuoteRecord']),
    quoteList() {
      const result = this.quoteRecord.filter((item, index) => {
        return index < 6
      })
      return result
    }
    // baseInfo() {
    //   return this.baseInfo || {}
    // }
  },
  created() {
  },
  methods: {
    // 报价记录点击
    handleRecordSelect(key, keyPath) {
      console.log(key, keyPath)
      // key = parseInt(key)
      // this.quoteRecordList.forEach(item => {
      //   if (item.id === key) {
      //     this.currentStatus = item.quoteStatus
      //   }
      // })
    },
    // 保险公司头像
    companyAvatar(id) {
      console.log('触发')
      const companyList = company()
      // const id = this.policyExt.companyId
      const item = companyList.find(item => item.id === parseInt(id))
      if (!item) return ''
      const src = require(`@/assets/companyavatar/c_${item.icon}.png`)
      return src
    },
    reQuotePC() {
      this.$router.push('/insurance/issuecenter')
    },
    reQuote(val) {
      const id = this.customerR.salesId
      // const id = '99a52e7cdf1011e880a300163e08a24e'
      if (!this.customerR.salesName) {
        this.$message({
          message: '该客户没有分配到业务员，无法进行模拟登录',
          type: 'warning'
        })
        return
      }
      getCustomerTokenByUserId(id).then(res => {
        console.log(res)
        if (res && res.access_token) {
          let baseUrl = ''
          const operatorId = this.$store.getters.userAll.data.id
          console.log('渠道编码', this.$store.state.customer.customerChannelCode)
          const channelCode = this.$store.state.customer.customerChannelCode
          const params = `?s=${channelCode}&token=${res.access_token}&operatorId=${operatorId}&licenseNo=${this.baseInfo.licenseNo}`
          switch (process.env.BUILD_VER) {
            case 'prod':
              baseUrl = 'https://ybinsure.com/spa/newCar/mockLogin'
              break
            case 'test':
              baseUrl = 'https://ybinsure.com/spa/newCarTest/mockLogin'
              break
            case 'test2':
              baseUrl = 'https://ybinsure.com/spa/newCarTest2/mockLogin'
              break
          }
          const loginLink = baseUrl + params
          this.mockPCLogin(loginLink)
        } else {
          this.$message({
            message: '该账号异常，无法进行模拟登录',
            type: 'error',
            duration: 3 * 1000
          })
          return false
        }
      }).catch(e => {
        console.log(e)
        this.$message({
          message: '该账号异常，无法进行模拟登录',
          type: 'error',
          duration: 3 * 1000
        })
      })

      // if (val === 'mobile') {
      //   window.openIssueUrl()
      //   return
      // } else if (val === 'pc') {
      //   this.$router.push('/insurance/issuecenter')
      // }
    },
    // 格式化险种
    riskformatter(row, column) {
      if (row.riskCode === 'm') {
        row.riskName = '不计免赔险'
      }
      return row.riskName
    },
    // 模拟登陆
    mockPCLogin(url) {
      window.site_title = '移动出单'
      let height = window.screen.height ? window.screen.height * 0.85 : 700
      height = height > 736 ? 736 : height
      console.log('url', url)
      openNewProcessUrlWithConfig(url, `height=${height}, width=414`)
      // openNewProcessUrl(this.mockLoginInfo.qrcodeLink)
      setTimeout(() => {
        window.site_title = void 0
      }, 500)
    },
    // 通过id查找保险公司名称
    getCompanyName(id) {
      const companyList = company()
      const item = companyList.find(item => item.id === parseInt(id))
      return item.name
    },
    // 分享报价
    shareQuote() {
      this.isShareShow = true
      // if (!this.orderId) { // 没有点击列表按钮时取第一个orderId
      //   this.orderId = this.quoteRecords && this.quoteRecords.length > 0 ? this.quoteRecords[0].orderId : ''
      // }
      // this.orderId = 'Q057800390001703013728'
      // this.getQuoteShareData(this.orderId)
    },
    // 列表点击事件
    handleMenuClick(orderId, status) {
      this.quoloading = true
      this.orderId = orderId
      if (status.indexOf('成功') > -1) {
        this.isQuoteSuccess = true
      } else {
        this.isQuoteSuccess = false
      }
      console.log(orderId)
      getQuoteRecord(orderId).then(res => {
        this.quoloading = false
        const quotoInfo = res.data
        this.$store.commit('setQuoteRecord', quotoInfo)
        this.orderId2 = res.data.orderId
        console.log(res)
      }).catch(err => {
        this.quoloading = false
        console.warn(err)
      })
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
    }
  }
}
</script>
<style lang="scss">
.record-wrap{
  // width:100%;
    .quote-record{
    border:1px solid #E4E4E4;
    border-left:none;
    // overflow: auto;
    .el-menu-item {
    height:100px;
    border-bottom:1px solid #cccccc;
  }
  .el-menu-item.is-active{
    background:#ffffff;
    border-left:1px solid #409EFF;
  }
  .el-menu{
      border-left:1px solid #cccccc;
      background:rgba(240, 242, 245, 1)
    }
  .left-menu{
    .recordLogo{
      display:flex;
      height:100px;
      align-items:center;
      .info{
        height:20px;
        line-height:20px;
      }
      .failed.info{
        color: #FF0000 !important;
      }
    }
  }
  .record-content{
      margin-left:240px;
       .right-table{
        padding: 0 30px;
        .risk-fee{
            text-align:right;
            margin-top:20px;
            .item{
                height:30px;
                line-height: 30px;
                .title{
                font-weight: 700;
                font-size: 14px;
                color: #606266;
                    }
                .amount{
                    font-size: 14px;
                    color: #606266;
                }
            }
            .tax{
                font-size: 12px;
                color: #00BC0D;
                height:30px;
                line-height: 30px;
            }
        }
        .quote-failed{
           min-width: 500px;
           max-width: 600px;
           font-size: 14px;
           line-height: 26px;
           padding:0 50px;
        }
    }
  }

 }
 .operate{
     height:70px;
     line-height:70px;
     text-align:center;
 }
 .customerManage.el-dialog__body{
    padding: 0 20px !important;
 }
 .el-dialog__body{
    //  padding: 0 20px !important;
 }
 .premium-title{
   display:flex;
   justify-content:space-between;
   height:30px;
   line-height:30px;
 }
 .com-insure{
    .risks-detail{
       display:flex;
       justify-content:space-between;
       height:30px;
       line-height:30px;
    }
 }
 .right-table{
    .el-table td,
  .el-table th {
    padding: 0;
    height: 30px;
    line-height: 30px;
  }
  .el-table th {
    background: #fafafa;
  }
 }
}

</style>
