<template>
  <div class="share-wrap">
    <div id="quoteDetail" ref="imageTofile">
      <div class="header-title">
        <span>{{ baseInfo.licenseNo }}</span>
        <span>{{ baseInfo.ownerName }}</span>
      </div>
      <div class="vehicle-info">
        <div class="">
          <div class="info1" >{{ baseInfo.brandName }}</div>
          <div class="info2">
            <span class="">排量:{{ baseInfo.displacement }}</span>
            <span
              v-if="true"
              style="margin:0 20px;">{{ baseInfo.seatCount }}座</span>
            <span>年款:{{ baseInfo.issueYear }} </span>
          </div>
          <div class="info1">车型编码:{{ baseInfo.modelCode }} </div>
          <div class="info2">新车购置价:{{ baseInfo.purchasePrice }}</div>
        </div>
      </div>
      <div class="insure-content">
        <div style="display:flex;align-items:center">
          <img :src="getCompanyAvatar(customerQuoteRecord.companyId)" width="42px" height="42px;" alt="">
          <span style="line-height:30px;height:30px;margin-left:10px;">{{ customerQuoteRecord.companyName }}</span>
        </div>
        <div class="insure-date">
          <div v-if="baseInfo.tciStartDate" class="date">交强险起期：<span class="date-value">{{ baseInfo.tciStartDate ? formateDate(baseInfo.tciStartDate):'--' }}</span></div>
          <div v-if="baseInfo.vciStartDate" class="date">商业险起期：<span class="date-value">{{ baseInfo.vciStartDate ? formateDate(baseInfo.vciStartDate):'--' }}</span></div>
        </div>
      </div>
      <div v-if="!customerQuoteRecord.reason" class="risk-list">
        <div class="premium-title" style="line-height:50px;height:50px;">
          <div class="clearfix" style="font-weight:600;font-size:16px;">
            <img height="25px;" style="float: left;margin-top: 12px;" src="@/assets/imgs/quote-total-red.png" alt="">
            <div style="float: left; margin-left:10px;">
              <span>保费合计</span>
            </div>
          </div>
          <div style="font-weight:600;font-size:16px;" class="theme-red">￥{{ baseInfo.totalPremium }}</div>
        </div>
        <div v-if="baseInfo.tciPremium" class="premium-title bold-text">
          <div>交强险</div>
          <div class="theme-red">￥{{ baseInfo.tciPremium }}</div>
        </div>
        <div v-if="baseInfo.tciPremium">
          <div style="border-bottom: 1px solid #e8e8e8;">
            <div class="premium-title bold-text">
              <div>车船税</div>
              <div class="theme-red">￥{{ baseInfo.vehicleTax }}</div>
            </div>
            <div class="premium-title">
              <div>当年应缴</div>
              <div>￥{{ baseInfo.payableFee }}</div>
            </div>
            <div class="premium-title">
              <div>往年应缴</div>
              <div>￥{{ baseInfo.arrearFee }}</div>
            </div>
            <div class="premium-title">
              <div>滞纳金</div>
              <div>￥{{ baseInfo.lateFee }}</div>
            </div>
          </div>
        </div>

        <div v-if="baseInfo.vciPremium" class="com-insure">
          <div class="risks-detail bold-text" style="border-top: 1px solid #e8e8e8;">
            <div class="">商业险合计</div>
            <div class="theme-red">￥{{ baseInfo.vciPremium }}</div>
          </div>
          <div class="risks-detail">
            <div>商业险折扣</div>
            <div>{{ baseInfo.vciDiscount }}</div>
          </div>
          <div class="risks-detail">
            <div>商业险出险情况</div>
            <div>{{ formatOccurrence(baseInfo.tciLossOccurredCount) }}</div>
          </div>
          <div v-for="item in riskList" :key="item.riskName" class="risks-detail">
            <div>{{ item.riskCode ==='m' ? '不计免赔险' : item.riskName }}</div>
            <div>￥{{ item.premium }}</div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="quoteDetail-page_header common-padding">
          <div class="quoteDetail-page_header flex-v-center">
            <span class="quoteDetail-page_header-left_label theme-red-bg"/>
            <span>失败详情</span>
          </div>
        <div class="flex-v-center">报价失败</div></div>
        <div class="reason-txt">{{ customerQuoteRecord.reason }}</div>
      </div>
    </div>
    <div class="qrcode">
      <div class="qr-border">
        <div class="qrcode-img">
          <!-- <img src="@/assets/imgs/u17537.png" alt=""> -->
          <div id="qrcodeImg" ref="qrcodeImg"/>
          <!-- <div class="qrcode"><div ref="qrcodeImg" class="qrcodeImg"/></div> -->
        </div>
        <div class="txt">扫描微信二维码分享</div>
      </div>
      <div class="btn">
        <el-button type="success" size="small" style="width:170px" @click="toImage">下载图片</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import QRCode from 'qrcodejs2'
import html2canvas from 'html2canvas'
import moment from 'moment'
import { mapGetters } from 'vuex'
import company from '@/views/businessmanagement/company.js'
export default {
  name: 'ShareDetail',
  props: {
    orderId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      shareUrl: '',
      htmlUrl: ''
    }
  },
  computed: {
    ...mapGetters(['customerQuoteRecord', 'baseInfo', 'riskList']),
    // shareId() {
    //   return this.customerQuoteRecord.orderId
    // },
    // 判断是险种类型
    quoteType() {
      if (this.baseInfo.ticPremium && !this.baseInfo.vicPremium) { // 单交强
        return 1
      } else if (!this.baseInfo.ticPremium && this.baseInfo.vicPremium) { // 单商业
        return 2
      } else if (this.baseInfo.ticPremium && this.baseInfo.vicPremium) { // 交商共保
        return 3
      } else {
        return 'error'
      }
    }
  },
  watch: {
    orderId(newVal) {
      if (newVal) {
        // console.log('shareId变化了' + newVal)
        this.createWeChatShare()
      }
    }
  },
  mounted() {
    this.createWeChatShare()
  },
  methods: {
    // 生成二维码链接
    createWeChatShare() {
      let url
      switch (process.env.BUILD_VER) {
        case 'prod':
          url = 'https://ybinsure.com/spa/newCar/quoteDetail'
          break
        case 'test':
          url = 'https://ybinsure.com/spa/newCarTest/quoteDetail'
          break
      }
      const index = url.lastIndexOf('/')
      console.log(this.customerQuoteRecord)
      const shareId = encodeURIComponent(this.customerQuoteRecord.orderId)
      const endFix = `quoteDetail?orderId=${shareId}&isShare=true`
      const shareUrl = url.substring(0, index + 1) + endFix
      this.createQrcode(shareUrl)
      console.log('分享链接地址', shareUrl)
      this.shareUrl = shareUrl
      // this.createQrcode('https://ybinsure.com/spa/newCarTest/quoteDetail?orderId=ax7VsV0irm3fttSHs1CrswzPYZVd0pTfrhZ%2B4hCOeMZLS95Tuu%2FlWSeHY2b41HQNQ9M68YfOlzjvxpFbbwlrzWc6a0M%2FUIbMFWJYLA%2BkYW2dADH%2F1RA0yPhON0gjRzLJoow1hOMnA9AmSOq8z%2FBN%2F7ZEhqnI8ZiGQJUP%2F6ZDTl8%3D&isShare=true&s=001')
    },
    // 创建二维码
    createQrcode(text) {
    // 生成二维码
      // const qrcodeImgEl = document.getElementById('qrcodeImg')
      const qrcodeImgEl = this.$refs.qrcodeImg
      console.log('this.$refs.qrcodeImg', this.$refs.qrcodeImg)
      qrcodeImgEl.innerHTML = ''
      const qrcode = new QRCode(qrcodeImgEl, {
        width: 150,
        height: 150,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
      qrcode.makeCode(text)
    },
    formateDate(date) {
      return moment(date).format('YYYY-MM-DD')
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
    // 保险公司头像
    getCompanyAvatar(id) {
      // this.$emit('companyAvatar', id)
      const companyList = company()
      // const id = this.policyExt.companyId
      const item = companyList.find(item => item.id === parseInt(id))
      if (!item) return ''
      const src = require(`@/assets/companyavatar/c_${item.icon}.png`)
      return src
    },
    // 获取报价详情截图
    toImage() {
      // 第一个参数是需要生成截图的元素,第二个是自己需要配置的参数,宽高等
      html2canvas(this.$refs.imageTofile, {
        backgroundColor: '#ffffff'
      }).then((canvas) => {
        const url = canvas.toDataURL('image/jpeg')
        this.htmlUrl = url
        this.download()
      })
    },
    // 下载图片
    download() {
      var link = document.createElement('a')
      link.setAttribute('type', 'hidden') // make it hidden if needed
      link.href = this.htmlUrl
      document.body.appendChild(link)
      link.download = `报价详情-${moment().format('YYYY-MM-DD HH_mm_ss')}.jpg`
      link.click()
      // link.remove()
      document.body.removeChild(link)
    }
  }
}

</script>
<style lang="scss">
.share-detail{
    .customerManage .el-dialog__body{
        padding:0 !important;
    }
    .record-wrap .el-dialog__body{
        padding:0 !important;
    }
    .el-dialog__body{
        padding:0 !important;
    }
    .share-wrap{
        height:600px;
        overflow:auto;
      .header-title{
        display:flex;
        justify-content:space-between;
        height:40px;
        line-height: 40px;
        border-bottom:1px solid #f5f5fa;
        padding:0 20px;
        font-size:15px;
        font-weight:400;
    }
    .vehicle-info{
        padding:20px;
        line-height: 26px;
        font-size:15px;
        border-bottom:10px solid #f5f5fa;
        .info1{
            color: #404040
        }
        .info2{
            color:grey;
        }
    }
    .insure-content{
        display:flex;
        justify-content:space-between;
        align-items:center;
        padding:0 20px;
        height: 100px;
        font-size:14px;
        border-bottom: 1px solid #e6e6e6;
        .insure-date{
            color:#404040;
            .date{
                height:30px;
                line-height:30px;
                .date-value{
                    color:#f95454;
                }
            }
        }
    }
    .risk-list{
        color:#404040;
        padding:0 20px;
     }
    }
    .bold-text{
        font-size: 15px;
      font-weight: 700;
    }
    .theme-red{
        color:#f95454;
    }
    .clearfix:after {
        display: block;
        content: "";
        height: 0;
        font-size: 0;
        width: 0;
        clear: both;
  }
  .qrcode{
    background-color:#fff;
    position: fixed;
    width:200px;
    height:280px;
    left:50%;
    top:0;
    margin-top: 13vh;
    margin-left:208px;
    .qr-border{
        width:170px;
        margin:0 auto;
        margin-top:15px;
        padding:10px;
        border:1px solid #e6e6e6;
        .qrcode-img{
        width:150px;
        height:150px;
        margin:0 auto;
        .qrcode{
           width:150px;
           height:150px;
           .qrcodeImg{
             width:150px;
             height:150px;
             margin:0 auto;
             padding: 25px;
             background: #f95454;
           }
        }
     }
     .txt{
        text-align: center;
         height:40px;
         line-height: 40px;
         font-size:15px;
     }
    }
    .btn{
        width:170px;
        margin: 0 auto;
        text-align:center;
        margin-top:10px;
    }
  }
  .quoteDetail-page_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 45px;
    border-bottom: 1px solid #eee;
    font-family: Arial;
    color: #404040;
}
.quoteDetail-page_header-left_label {
    display: inline-block;
    width: 3px;
    height: 16px;
    margin-right: 5px;
}
.common-padding {
    padding: 0 15px;
}
.theme-red-bg {
    background: #f95454!important;
}
.flex-v-center{
  display: flex;
}
.quoteDetail-page_fail_info {
    padding: 15px;
}
.change-line {
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
}
.reason-txt{
  padding:15px;
  color: #404040;
  font-family: Arial;
}
.el-dialog{
  margin-top: 13vh !important;
 }
}

</style>
