<template>
  <div v-loading="isLoading" class="customer-price">
    <el-tabs v-loading="refreshLoading" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in priceData" :key="index" :name="index.toString()">
        <div slot="label" class="price-tab-pane">
          <div style="font-weight:bold;font-size: 16px;line-height: 30px;">{{ item.companyName }}</div>
          <div v-if="item.totalPremium" style="line-height: 20px;">保费合计：{{ '￥'+ item.totalPremium }}</div>
          <div v-else style="line-height: 20px;">报价失败</div>
          <div style="line-height: 20px;">{{ item.quoteTime }}</div>
        </div>
        <div style="overflow: hidden;border: 1px solid #e4e7ed;padding: 10px;display: flex;align-items: stretch;">
          <div style="width: 300px;">
            <div style="padding: 5px 0;color: #333;"><span style="color: #999;">车牌号：</span>{{ priceDetail.licenseNo||'--' }}</div>
            <div style="padding: 5px 0;color: #333;"><span style="color: #999;">车架号：</span>{{ priceDetail.frameNo||'--' }}</div>
            <div style="padding: 5px 0;color: #333;"><span style="color: #999;">车型：</span>{{ priceDetail.brandName||'--' }}</div>
            <div style="padding: 5px 0;color: #333;"><span style="color: #999;">发动机号：</span>{{ priceDetail.engineNo||'--' }}</div>
            <div style="padding: 5px 0;color: #333;"><span style="color: #999;">注册时间：</span>{{ priceDetail.enrollDate||'--' }}</div>
            <div style="padding: 5px 0;color: #333;"><span style="color: #999;">车主：</span>{{ priceDetail.ownerName||'--' }}</div>
            <div style="padding: 5px 0;color: #333;"><span style="color: #999;">被保人：</span>{{ priceDetail.insuredName||'--' }}</div>
            <div style="padding: 5px 0;color: #333;"><span style="color: #999;">被保人证件号：</span>{{ priceDetail.insuredIdNo||'--' }}</div>
            <div style="padding: 5px 0;color: #333;"><span style="color: #999;">地址：</span>{{ priceDetail.insuredAddr||'--' }}</div>
            <div style="padding: 5px 0;color: #333;"><span style="color: #999;">手机号：</span>{{ priceDetail.insuredPhone||'--' }}</div>
            <div style="padding: 5px 0;color: #333;"><span style="color: #999;">交强险止期：</span>{{ priceDetail.forceEndDate||'--' }}</div>
            <div style="padding: 5px 0;color: #333;"><span style="color: #999;">商业险止期：</span>{{ priceDetail.comEndDate||'--' }}</div>
            <div v-if="isCarDealer" style="padding: 5px 0;color: #333;"><span style="color: #999;">续保专员：</span>{{ priceDetail.renewalName||'--' }}</div>
            <div v-if="isCarDealer" style="padding: 5px 0;color: #333;"><span style="color: #999;">续保专员手机：</span>{{ priceDetail.renewalPhone||'--' }}</div>
          </div>

          <div style="flex: 1;border-left: 1px solid #e4e7ed;padding-left: 20px;">
            <div style="color: #409eff;line-height: 30px;border-bottom: 1px solid #e4e7ed;font-weight: 600;font-size: 16px;">
              <span style="display: inline-block;line-height: 30px;height: 30px;border-bottom: 2px solid #409eff;">{{ priceDetail.companyName }}</span>
            </div>
            <div v-show="priceDetail.policyStatus === 0">
              <p>{{ priceDetail.reason }}</p>
            </div>
            <div v-show="priceDetail.policyStatus !== 0">
              <img v-show="!isHandInput" :src="priceDetail.imageUrl" style="width: 100%;height: 100%;" alt="">
              <div v-show="isHandInput">
                <div v-for="(itemR, indexR) in priceRisks" :key="indexR">
                  <div style="padding: 5px 0;display: flex;border-bottom: 1px solid #e4e7ed;">
                    <span style="display: block;flex: 1;">{{ itemR.risk_name }}</span>
                    <span style="text-align: center;display: block;flex: 1;">{{ itemR.amount }}</span>
                    <span style="text-align: right;display: block;flex: 1;">{{ itemR.premium }}</span>
                  </div>
                </div>
              </div>
              <div style="background-color: #fafafa;">
                <div style="text-align: right;padding: 5px 0;font-weight: 600;">商业险合计：<span>{{ priceDetail.vciPremium }}</span></div>
                <div style="text-align: right;padding: 5px 0;font-weight: 600;">强制险合计：<span>{{ priceDetail.tciPremium }}</span></div>
                <div style="text-align: right;padding: 5px 0;font-weight: 600;">车船税合计：<span>{{ priceDetail.vehicleTax }}</span></div>
                <div style="text-align: right;padding: 5px 0;font-weight: 600;">保费合计：<span>{{ priceDetail.totalPremium }}</span></div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <div>
        <div style="text-align:center;padding-top:20px;">
          <el-button type="primary" size="small" @click="hanldeSaveImg">保存图片</el-button>
          <el-button v-if="isHandInput" type="primary" size="small" @click="hanldeUpdate">修改险种</el-button>
          <el-button type="primary" size="small" @click="hanldePrint">打印报价单</el-button>
          <span v-if="!isApplyIssue" style="padding: 0 10px;">
            <el-button v-if="isHandInput" type="primary" size="small" @click="refreshPrice">刷新报价</el-button>
          </span>
          <el-button type="primary" size="small" @click="hanldeUpdate">移动出单</el-button>
          <el-button v-permission="permissionList.renewalIssue" type="primary" size="small" @click="handleToQuickissue">电脑出单</el-button>
          <div v-permission="[permissionList.renewalAdmin, permissionList.renewalCarAdmin, permissionList.renewalInsurance]" style="display:inline-block; padding-left:10px">
            <span v-if="!isHandInput">
              <el-button type="primary" size="small" @click="applyingForBtn">申请出单</el-button>
            </span>
            <span v-else>
              <el-button v-if="isUsersShow" type="primary" size="small" @click="applyingForBtn">申请出单</el-button>
              <el-button v-else type="primary" size="small" @click="handleToQuickissue">电脑出单</el-button>
            </span>
          </div>
        </div>
      </div>
    </el-tabs>

    <!-- 申请出单 -->
    <el-dialog v-if="applyingForShow" :visible.sync="applyingForShow" title="申请出单" width="60%" class="dialogAll" append-to-body>
      <div>
        <div style="display: flex;align-items: center;">
          <span style="display: block;height: 40px;line-height: 40px;padding-right: 10px;">出单员</span>
          <el-input v-model="applyingForName" placeholder="请输入出单员" size="small" style="width: 220px;padding-right: 10px;" />
          <el-button type="primary" icon="el-icon-search" size="small" @click="applyingForSearch">查询</el-button>
        </div>
        <el-table ref="multipleTable" :data="applyingTableList" highlight-current-row tooltip-effect="dark" @current-change="applyingTableListChange">
          <el-table-column width="40">
            <template slot-scope="scope">
              <i :style="scope.row.id===applyingTableListId ?'color:#67c23a':'color:#aaa'" :class="scope.row.id===applyingTableListId ? 'el-icon-circle-check':'el-icon-circle-check-outline'" />
            </template>
          </el-table-column>
          <el-table-column prop="nickName" label="出单员" show-overflow-tooltip />
          <el-table-column prop="phone" label="手机号" show-overflow-tooltip />
        </el-table>
        <div v-loading="applyingForLoading">
          <el-radio v-for="item in applyingCompanyList" :key="item.icar_poliy_id" v-model="companyNum" :label="item.icar_poliy_id" border style="height: 50px;margin-top: 10px;" @change="applyingCompanyChange">
            <span style="font-weight: 600;">保险公司：{{ item.companyName }} 价格：{{ item.totalPremium }}</span>
            <div style="margin-left: 25px;">报价时间:{{ item.quoteTime }}</div>
          </el-radio>
        </div>
        <div style="padding-top: 10px;">
          <div style="font-weight: 600;line-height: 30px;">备注</div>
          <el-input v-model="applyingForRemarks" placeholder="请输入备注" size="small" />
        </div>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align:center;padding-bottom:30px;">
        <el-button size="small" @click="applyingForShow = false">取 消</el-button>
        <el-button size="small" type="primary" @click="applyingForEnter">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 打印保存 -->
    <div ref="printImg" style="position: absolute;top: 0;z-index:-9999;width: 100%;padding: 10px;">
      <div style="width: 180px;border: 1px solid #e4e7ed;padding: 10px;margin: 20px 0;">
        <div style="font-weight:bold;font-size: 16px;line-height: 30px;">{{ priceDetail.companyName }}</div>
        <div v-if="priceDetail.totalPremium" style="line-height: 20px;">保费合计：{{ '￥'+ priceDetail.totalPremium }}</div>
        <div v-else style="line-height: 20px;">报价失败</div>
        <div style="line-height: 20px;">{{ priceDetail.times }}</div>
      </div>
      <div style="overflow: hidden;border: 1px solid #e4e7ed;padding: 10px;display: flex;align-items: stretch;">
        <div style="width: 300px;">
          <div style="padding: 5px 0;color: #333;"><span style="color: #999;">车牌号：</span>{{ priceDetail.licenseNo }}</div>
          <div style="padding: 5px 0;color: #333;"><span style="color: #999;">车架号：</span>{{ priceDetail.frameNo | fontHidden }}</div>
          <div style="padding: 5px 0;color: #333;"><span style="color: #999;">车型：</span>{{ priceDetail.brandName ||'--' }}</div>
          <div style="padding: 5px 0;color: #333;"><span style="color: #999;">发动机号：</span>{{ priceDetail.engineNo | fontHidden }}</div>
          <div style="padding: 5px 0;color: #333;"><span style="color: #999;">注册时间：</span>{{ priceDetail.enrollDate | fontHidden }}</div>
          <div style="padding: 5px 0;color: #333;"><span style="color: #999;">车主：</span>{{ priceDetail.ownerName | fontHidden }}</div>
          <div style="padding: 5px 0;color: #333;"><span style="color: #999;">被保人：</span>{{ priceDetail.insuredName | fontHidden }}</div>
          <div style="padding: 5px 0;color: #333;"><span style="color: #999;">被保人证件号：</span>{{ priceDetail.insuredIdNo | fontHidden }}</div>
          <div style="padding: 5px 0;color: #333;"><span style="color: #999;">地址：</span>{{ priceDetail.insuredAddr | fontHidden }}</div>
          <div style="padding: 5px 0;color: #333;"><span style="color: #999;">手机号：</span>{{ priceDetail.insuredPhone | fontHidden }}</div>
          <div style="padding: 5px 0;color: #333;"><span style="color: #999;">交强险止期：</span>{{ priceDetail.forceEndDate||'--' }}</div>
          <div style="padding: 5px 0;color: #333;"><span style="color: #999;">商业险止期：</span>{{ priceDetail.comEndDate||'--' }}</div>
          <div v-if="isCarDealer" style="padding: 5px 0;color: #333;"><span style="color: #999;">续保专员：</span>{{ priceDetail.renewalName }}</div>
          <div v-if="isCarDealer" style="padding: 5px 0;color: #333;"><span style="color: #999;">续保专员手机：</span>{{ priceDetail.renewalPhone }}</div>
        </div>
        <div style="flex: 1;border-left: 1px solid #e4e7ed;padding-left: 20px;">
          <div style="color: #409eff;line-height: 30px;">{{ priceDetail.companyName }}</div>
          <div v-show="priceDetail.policyStatus === 0">
            <p>{{ priceDetail.reason }}</p>
          </div>
          <div v-show="priceDetail.policyStatus !== 0">
            <div v-show="!isHandInput">
              <img :src="priceDetail.imageUrl" alt="" style="display: inline-block;width: 100%;height: 100%;">
            </div>
            <div v-show="isHandInput">
              <div v-for="(itemR, indexR) in priceRisks" :key="indexR">
                <div style="padding: 5px 0;display: flex;border-bottom: 1px solid #e4e7ed;">
                  <span style="display: block;flex: 1;">{{ itemR.risk_name }}</span>
                  <span style="text-align: center;display: block;flex: 1;">{{ itemR.amount }}</span>
                  <span style="text-align: right;display: block;flex: 1;">{{ itemR.premium }}</span>
                </div>
              </div>
            </div>
            <div style="background-color: #fafafa;">
              <div style="text-align: right;padding: 5px 0;font-weight: 600;">商业险合计：<span>{{ priceDetail.vciPremium }}</span></div>
              <div style="text-align: right;padding: 5px 0;font-weight: 600;">强制险合计：<span>{{ priceDetail.tciPremium }}</span></div>
              <div style="text-align: right;padding: 5px 0;font-weight: 600;">车船税合计：<span>{{ priceDetail.vehicleTax }}</span></div>
              <div style="text-align: right;padding: 5px 0;font-weight: 600;">保费合计：<span>{{ priceDetail.totalPremium }}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import { getQuoteInfo } from '@/api/customer'
import {
  getUsersOnCondition,
  putApplyInsurance,
  getAllOfferRecords,
  refreshQuotation
} from '@/api/mytask'
import { formatDate } from '@/utils/index'
import html2canvas from 'html2canvas'
import { mapGetters } from 'vuex'
export default {
  filters: {
    fontHidden(val) {
      if (!val) {
        return '--'
      } else {
        const length = val.toString().length
        if (length === 1) {
          return val
        } else if (length === 2) {
          return val.substr(0, 1) + '*'
        } else {
          let start = ''
          for (let i = 0; i < length - 2; i++) {
            start += '*'
          }
          const newVal = val.substr(0, 1) + start + val.substr(length - 1)
          return newVal
        }
      }
    }
  },
  props: {
    priceList: {
      type: Array,
      default() {
        return []
      }
    },
    priceOption: {
      type: Object,
      default() {
        return {}
      }
    },
    priceId: {
      type: String,
      default: ''
    },
    isApplyIssue: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeName: '0',
      priceIndex: 0,
      priceData: [],
      priceDetail: {},
      priceRisks: [],
      isHandInput: false,
      refreshLoading: false,
      applyingForShow: false,
      companyNum: '1',
      applyingForName: '',
      applyingTableList: [],
      applyingCompanyList: [],
      applyingForId: '',
      applyingTableListId: '',
      applyingForRemarks: '',
      applyingForlicenseNo: '',
      applyingIcarPoliyId: '',
      applyingLastCompanyId: '',
      applyingCompanyId: '',
      applyingForLoading: false,
      isRefresh: false,
      isUsersShow: false,
      dataURL: null,
      icarPoliyId: '',
      isCarDealer: false
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否是管理员渠道
    ])
  },
  watch: {
    priceList: {
      immediate: true, // 立即执行
      handler: function(newVal) {
        this.priceData = newVal
      }
    },
    priceOption(val) {
      if (val.flag === 1) {
        this.isHandInput = true
      } else {
        this.isHandInput = false
      }
      this.priceDetail = JSON.parse(JSON.stringify(val.qutote))
      this.priceDetail.times = formatDate(val.qutote.times)
      this.priceDetail.renewalName = val.salesmanName
      this.priceDetail.renewalPhone = val.salesmanPhone
      this.priceRisks = val.risks
    },
    activeName(val) {
      this.priceIndex = parseInt(val)
    }
  },
  async created() {
    if (this.isAnyAdminChannel) {
      this.isCarDealer = true
    } else {
      this.isCarDealer = this.$store.getters.userAll.data.carDealer.toString() === '0'
    }
    const roleArr = this.$store.getters.userInfo.authorities
    if (roleArr.includes(this.permissionList.renewalIssue)) {
      return
    }
    // 获取是否有出单员，如果有出单员显示申请出单。没有就显示快速投保
    const resUsersData = await getUsersOnCondition({
      type: '3',
      sourceId: this.$store.getters.userAll.data.channelCode,
      name: ''
    })
    if (resUsersData.data.length > 0) {
      this.isUsersShow = true
    } else {
      this.isUsersShow = false
    }
  },
  methods: {
    // 选择险种
    handleClick(val) {
      this.priceData.forEach((item, index) => {
        if (index === parseInt(val.index)) {
          getQuoteInfo({ orderId: item.icar_poliy_id }).then(res => {
            if (res.data.flag === 1) {
              this.isHandInput = true
            } else {
              this.isHandInput = false
            }
            this.priceDetail = JSON.parse(JSON.stringify(res.data.qutote))
            this.priceDetail.times = formatDate(res.data.qutote.times)
            this.priceDetail.renewalName = res.data.salesmanName
            this.priceDetail.renewalPhone = res.data.salesmanPhone
            this.priceRisks = res.data.risks
          })
        }
      })
    },
    // 保存
    hanldeSaveImg() {
      // if (window.location.host.indexOf('localhost' || '127.0.0.1') > -1) {
      // const imgUrl = `${process.env.SERVER_URL}/priceDetail.imageUrl`
      // } else {
      // const arr = priceDetail.imageUrl.split('/')
      // arr = arr.splice(0,1)
      // const imgUrl = arr.join('/')
      // }
      html2canvas(this.$refs.printImg).then(canvas => {
        this.dataURL = canvas.toDataURL('image/png')
        if (window.navigator.msSaveOrOpenBlob) {
          var bstr = atob(this.dataURL.split(',')[1])
          var n = bstr.length
          var u8arr = new Uint8Array(n)
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
          }
          var blob = new Blob([u8arr])
          window.navigator.msSaveOrOpenBlob(blob, '报价' + '.' + 'png')
        } else {
          // 这里就按照chrome等新版浏览器来处理
          const a = document.createElement('a')
          a.href = this.dataURL
          a.setAttribute('download', '报价')
          a.click()
        }
      })
    },
    // 修改险种
    hanldeUpdate() {
      this.$emit('priceClose')
      // this.$router.push({
      //   path: '/insurance/quickissue',
      //   name: '移动出单',
      //   query: {
      //     carDealerId: this.priceId || this.priceDetail.id, // 是否车商标识
      //     carLicense: this.priceDetail.licenseNo,
      //     frameNo: this.priceDetail.insuredIdNo
      //   }
      // })
      window.openIssueUrl({
        carDealerId: this.priceId || this.priceDetail.id, // 是否车商标识
        carLicense: this.priceDetail.licenseNo,
        frameNo: this.priceDetail.insuredIdNo
      })
    },
    // 打印报价单
    hanldePrint() {
      this.$pricePrint(this.$refs.printImg)
    },
    // 刷新报价
    async refreshPrice() {
      this.refreshLoading = true
      const resR = await refreshQuotation({
        licenseNo: this.priceDetail.licenseNo,
        companyId: this.priceDetail.companyId,
        icarPoliyId: this.priceData[this.priceIndex].icar_poliy_id,
        uuid: this.priceId,
        sourceId: this.$store.getters.userAll.data.channelCode
      })
      if (resR.status === 200) {
        const resL = await getAllOfferRecords({ uuid: this.priceId })
        this.priceData = resL.data
        if (this.priceData.length > 0) {
          // 默认展示第一个报价数据
          const resD = await getQuoteInfo({
            orderId: this.priceData[0].icar_poliy_id
          })
          // this.priceOption = resD.data
          this.$emit('priceOption', resD.data)
          this.refreshLoading = false
          this.$message({
            type: 'success',
            message: '刷新成功'
          })
        } else {
          this.$message.warning('暂无报价记录')
          this.refreshLoading = false
        }
      } else {
        this.refreshLoading = false
        this.$message.error(resR.msg)
        this.$emit('reNewPrice', 'new')
      }
    },
    // 申请出单
    applyingForBtn() {
      this.applyingForLoading = true
      this.applyingForSearch()
      getAllOfferRecords({ uuid: this.priceId })
        .then(res => {
          if (res.data.length) {
            this.applyingForShow = true
            this.applyingCompanyList = res.data
            this.applyingForLoading = false
          } else {
            this.$message.error('未获取到可以申请报价的保险公司!')
            this.applyingForLoading = false
          }
          // console.log(res)
        })
        .catch(err => {
          this.applyingForLoading = false
          console.warn(err)
        })
    },
    applyingForSearch() {
      // 1续保和出单一体专员、2续保专员、3出单专员
      const Paramsdata = {
        type: '3',
        sourceId: this.$store.getters.userAll.data.channelCode,
        name: this.applyingForName
      }
      getUsersOnCondition(Paramsdata)
        .then(res => {
          this.applyingTableList = res.data
          // console.log(res)
        })
        .catch(err => {
          console.warn(err)
        })
    },
    applyingTableListChange(val) {
      this.applyingTableListId = val.id
    },
    applyingCompanyChange(val) {
      this.applyingIcarPoliyId = val
      // 这个是通过icar_poliy_id 获取选择的 item
      this.applyingCompanyList.forEach(element => {
        if (element.icar_poliy_id === val) {
          this.applyinglastCompanyId = element.lastCompanyId
        }
      })
    },
    applyingForEnter() {
      if (!this.applyingTableListId) {
        this.$message.warning('请选择出单员!')
        return
      }
      if (!this.applyingIcarPoliyId) {
        this.$message.warning('请选择保险公司!')
        return
      }
      const Paramsdata = {
        uuid: this.priceId,
        icarPoliyId: this.applyingIcarPoliyId,
        operatorId: this.applyingTableListId,
        applyCompanyId: this.applyinglastCompanyId,
        licenseNo: this.priceDetail.licenseNo,
        mark: this.applyingForRemarks
      }
      putApplyInsurance(Paramsdata)
        .then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.applyingForShow = false
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 快速投保
    handleToQuickissue() {
      this.$router.push({
        /* path: '/insurance/quickissue',
        name: '移动出单',
        query: {
          carDealerId: this.priceId,
          carLicense: this.priceDetail.licenseNo,
          frameNo: this.priceDetail.frameNo
        } */
        path: '/insurance/issuecenter',
        name: '电脑出单'
      })
    }
  }
}
</script>
<style lang="scss">
.customer-price {
  position: relative;
  width: 100%;
  margin: auto;
  .price-tab-pane {
    margin-right: 10px;
    border: 1px solid #e4e7ed;
    padding: 10px 20px;
    overflow: hidden;
    border-radius: 4px;
    font-size: 12px;
    color: #333;
    background-color: #ccc;
  }
  .is-active {
    .price-tab-pane {
      background-color: #409eff;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      color: #fff;
    }
  }
  .el-tabs__header {
    .el-tabs__item {
      height: auto !important;
      padding: 0;
    }
    .el-tabs__active-bar {
      height: 0px;
    }
    .el-tabs__nav-wrap::after {
      background: #fff;
      height: 0;
    }
  }
}
</style>
