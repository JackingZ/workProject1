<template>
  <!--查看 start -->
  <div v-loading="isLoading" ref="seeEdit" class="seeEdit">
    <div v-loading="isRefresh" class="seeEditAll" style="position:relative;padding-bottom:20px;width:100%;margin:auto">
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane v-for="(item,index) in seeEditList" :key="item.id" :name="index.toString()">
          <div slot="label" class="tabsNavbox">
            <h3>{{ item.qutote.companyName }}</h3>
            <p v-if="item.qutote.totalPremium">保费合计：{{ '￥'+ item.qutote.totalPremium }}</p>
            <p v-else>报价失败</p>
            <p>{{ item.qutote.quoteTime | timeFormat }}</p>
          </div>
          <div class="tabsmain">
            <div class="displayflex">
              <div class="tabsmainleft">
                <ul class="tabCarBase">
                  <li>
                    <span>车牌：</span>
                    {{ item.qutote.licenseNo||'--' }}
                  </li>
                  <li>
                    <span>车型：</span>
                    {{ item.qutote.brandName||'--' }}
                  </li>
                  <li>
                    <span>车架号：</span>
                    {{ item.qutote.frameNo||'--' }}
                  </li>
                  <li>
                    <span>发动机号：</span>
                    {{ item.qutote.engineNo||'--' }}
                  </li>
                  <li>
                    <span>注册时间：</span>
                    {{ item.qutote.enrollDate||'--' }}
                  </li>
                  <li>
                    <span>车主：</span>
                    {{ item.qutote.ownerName||'--' }}
                  </li>
                  <li>
                    <span>被保人：</span>
                    {{ item.qutote.insuredName||'--' }}
                  </li>
                  <li>
                    <span>被保人证件：</span>
                    {{ item.qutote.insuredIdNo||'--' }}
                  </li>
                  <li>
                    <span>被保人手机：</span>
                    {{ item.qutote.insuredPhone||'--' }}
                  </li>
                  <li>
                    <span>被保人地址：</span>
                    {{ item.qutote.insuredAddr||'--' }}
                  </li>
                  <li>
                    <span>交强险止期：</span>
                    {{ item.qutote.forceEndDate||'--' }}
                  </li>
                  <li>
                    <span>商业险止期：</span>
                    {{ item.qutote.comEndDate||'--' }}
                  </li>
                  <li v-if="isCarDealer">
                    <span>续保专员：</span>
                    {{ item.qutote.salesmanName||'--' }}
                  </li>
                  <li v-if="isCarDealer">
                    <span>续保专员手机：</span>
                    {{ item.qutote.salesmanPhone||'--' }}
                  </li>
                </ul>
              </div>
              <div class="tabsmainright">
                <!--<h3>
                  <span>{{ item.qutote.companyName }}</span>
                </h3>-->
                <div v-show="item.qutote.policyStatus === 0">
                  <p>{{ item.qutote.reason }}</p>
                </div>
                <div v-show="item.qutote.policyStatus !== 0" class="riskall">
                  <img v-show="handInput === 0" :src="item.qutote.imageUrl" style="width: 100%;height: 100%;" alt="">
                  <div v-show="handInput !== 0">
                    <ul class="riskbox">
                      <li v-for="riskitem in item.risks" :key="riskitem.id">
                        <span>{{ riskitem.risk_name }}</span>
                        <span style="text-align:center;">{{ riskitem.amount }}</span>
                        <span style="text-align:right;">{{ riskitem.premium }}</span>
                      </li>
                    </ul>
                    <div class="total">
                      <p>交强险合计 : {{ item.qutote.tciPremium }}</p>
                      <p>商业险合计 : {{ item.qutote.vciPremium }}</p>
                      <!--<p>车船税合计 : {{ item.qutote.vehicleTax }}</p>-->
                      <p>总合计 : {{ item.qutote.totalPremium }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="btnall">
        <div style="text-align:center;padding-top:20px;">
          <el-button type="primary" size="small" @click="hanldeSaveImg">保存图片</el-button>
          <el-button v-if="handInput !== 0" type="primary" size="small" @click="hanldeBaoXian">修改险种</el-button>
          <el-button type="primary" size="small" @click="hanldePrint">打印报价单</el-button>
          <!--notificationFlag === 'taskNotification'时说明是任务通知跳转过来，部分功能不可使用-->
          <el-button v-if="handInput !== 0 && !(notificationFlag === 'taskNotification')" type="primary" size="small" @click="refreshBtn">刷新报价</el-button>
          <el-button v-permission="permissionList.renewalIssue" type="primary" size="small" @click="handleToQuickissue">快速投保</el-button>
          <!--管理员角色，和续保专员角色，有出单员（申请出单），没有出单员（快速投保）。出单员角色（快速投保）-->
          <div v-permission="[permissionList.renewalAdmin, permissionList.renewalCarAdmin, permissionList.renewalInsurance]" style="display:inline-block; padding-left:10px">
            <span v-if="handInput === 0 && !(notificationFlag === 'taskNotification')">
              <el-button type="primary" size="small" @click="applyingForBtn">申请出单</el-button>
            </span>
            <span v-else>
              <el-button v-if="isUsersShow && !(notificationFlag === 'taskNotification')" type="primary" size="small" @click="applyingForBtn">申请出单</el-button>
              <el-button v-else-if="!isUsersShow && !(notificationFlag === 'taskNotification')" type="primary" size="small" @click="handleToQuickissue">快速投保</el-button>
            </span>
          </div>
          <!-- <el-button type="primary" size="small">生成二维码</el-button>
          <el-input v-model="phone" size="small" class="input-with-phone" placeholder="请输入手机号码">
            <el-button slot="append">发送短信</el-button>
          </el-input> -->
        </div>
      </div>
    </div>
    <!-- 申请出单弹窗 -->
    <el-dialog v-if="applyingForShow" :visible.sync="applyingForShow" title="申请出单" width="60%" class="dialogAll" append-to-body>
      <div class="dialogMain">
        <div class="dialogMainSearch">
          <span>出单员</span>
          <span>
            <el-input v-model="applyingForName" placeholder="请输入出单员" size="small" />
          </span>
          <span>
            <el-button type="primary" icon="el-icon-search" size="small" @click="applyingForSearch">查询</el-button>
          </span>
        </div>
        <el-table ref="multipleTable" :data="applyingTableList" highlight-current-row tooltip-effect="dark" class="dialogtable03" @current-change="applyingTableListChange">
          <el-table-column width="40">
            <template slot-scope="scope">
              <i :style="scope.row.id===applyingTableListId ?'color:#67c23a':'color:#aaa'" :class="scope.row.id===applyingTableListId ? 'el-icon-circle-check':'el-icon-circle-check-outline'" />
            </template>
          </el-table-column>
          <el-table-column prop="nickName" label="出单员" show-overflow-tooltip />
          <el-table-column prop="phone" label="手机号" show-overflow-tooltip />
        </el-table>
        <div v-loading="applyingForLoading" class="dialogMainCompany">
          <el-radio v-for="item in applyingCompanyList" :key="item.icar_poliy_id" v-model="companyNum" :label="item.icar_poliy_id" border @change="applyingCompanyChange">
            <strong>保险公司：{{ item.companyName }} 价格：{{ item.totalPremium }}</strong>
            <p>报价时间:{{ item.quoteTime }}</p>
          </el-radio>
        </div>
        <div class="dialogMainTops">
          <strong>备注</strong>
          <div>
            <el-input v-model="applyingForRemarks" placeholder="请输入备注" />
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align:center;padding-bottom:30px;">
        <el-button size="small" @click="applyingForShow = false">取 消</el-button>
        <el-button size="small" type="primary" @click="applyingForEnter">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 打印保存 -->
    <div ref="printCanvas" style="position: absolute;top: 0;z-index:-9999;width: 100%;padding: 10px;">
      <div style="width: 180px;border: 1px solid #e4e7ed;padding: 10px 20px;margin: 20px 0;">
        <div style="font-weight:bold;font-size: 16px;line-height: 30px;">{{ printDetail.companyName }}</div>
        <div v-if="printDetail.totalPremium" style="line-height: 20px;">保费合计：{{ '￥'+ printDetail.totalPremium }}</div>
        <div v-else style="line-height: 20px;">报价失败</div>
        <div style="line-height: 20px;">{{ printDetail.times }}</div>
      </div>
      <div style="overflow: hidden;border: 1px solid #e4e7ed;padding: 10px;display: flex;align-items: stretch;">
        <div style="width: 300px;">
          <div style="padding: 5px 0;color: #333;"><span style="color: #999;">车牌号：</span>{{ printDetail.licenseNo }}</div>
          <div style="padding: 5px 0;color: #333;"><span style="color: #999;">车架号：</span>{{ printDetail.frameNo | fontHidden }}</div>
          <div style="padding: 5px 0;color: #333;"><span style="color: #999;">车型：</span>{{ printDetail.brandName ||'--' }}</div>
          <div style="padding: 5px 0;color: #333;"><span style="color: #999;">发动机号：</span>{{ printDetail.engineNo | fontHidden }}</div>
          <div style="padding: 5px 0;color: #333;"><span style="color: #999;">注册时间：</span>{{ printDetail.enrollDate | fontHidden }}</div>
          <div style="padding: 5px 0;color: #333;"><span style="color: #999;">车主：</span>{{ printDetail.ownerName | fontHidden }}</div>
          <div style="padding: 5px 0;color: #333;"><span style="color: #999;">被保人：</span>{{ printDetail.insuredName | fontHidden }}</div>
          <div style="padding: 5px 0;color: #333;"><span style="color: #999;">被保人证件：</span>{{ printDetail.insuredIdNo | fontHidden }}</div>
          <div style="padding: 5px 0;color: #333;"><span style="color: #999;">被保人地址：</span>{{ printDetail.insuredAddr | fontHidden }}</div>
          <div style="padding: 5px 0;color: #333;"><span style="color: #999;">被保人手机：</span>{{ printDetail.insuredPhone | fontHidden }}</div>
          <div style="padding: 5px 0;color: #333;"><span style="color: #999;">交强险止期：</span>{{ printDetail.forceEndDate||'--' }}</div>
          <div style="padding: 5px 0;color: #333;"><span style="color: #999;">商业险止期：</span>{{ printDetail.comEndDate||'--' }}</div>
          <div v-if="isCarDealer" style="padding: 5px 0;color: #333;"><span style="color: #999;">续保专员：</span>{{ printDetail.salesmanName }}</div>
          <div v-if="isCarDealer" style="padding: 5px 0;color: #333;"><span style="color: #999;">续保专员手机：</span>{{ printDetail.salesmanPhone }}</div>
        </div>
        <div style="flex: 1;border-left: 1px solid #e4e7ed;padding-left: 20px;">
          <!--<div style="color: #409eff;line-height: 30px;">{{ printDetail.companyName }}</div>-->
          <div v-show="printDetail.policyStatus === 0">
            <p>{{ printDetail.reason }}</p>
          </div>
          <div v-show="printDetail.policyStatus !== 0">
            <div v-show="handInput === 0">
              <img :src="printDetail.imageUrl" alt="" style="display: inline-block;width: 100%;height: 100%;">
            </div>
            <div v-show="handInput !== 0">
              <div v-for="(itemR, indexR) in riskDetail" :key="indexR">
                <div style="padding: 5px 0;display: flex;border-bottom: 1px solid #e4e7ed;">
                  <span style="display: block;flex: 1;">{{ itemR.risk_name }}</span>
                  <span style="text-align: center;display: block;flex: 1;">{{ itemR.amount }}</span>
                  <span style="text-align: right;display: block;flex: 1;">{{ itemR.premium }}</span>
                </div>
              </div>
            </div>
            <div style="background-color: #fafafa;">
              <div style="text-align: right;padding: 5px 0;font-weight: 600;">交强险合计：<span>{{ printDetail.tciPremium }}</span></div>
              <div style="text-align: right;padding: 5px 0;font-weight: 600;">商业险合计：<span>{{ printDetail.vciPremium }}</span></div>
              <!--<div style="text-align: right;padding: 5px 0;font-weight: 600;">车船税合计：<span>{{ printDetail.vehicleTax }}</span></div>-->
              <div style="text-align: right;padding: 5px 0;font-weight: 600;">总合计：<span>{{ printDetail.totalPremium }}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getUsersOnCondition,
  putApplyInsurance,
  getAllOfferRecords,
  refreshQuotation,
  getQuetoInfoList
  // getQuoteInfo
} from '@/api/mytask'
import dayjs from 'dayjs'
import qs from 'qs'
import html2canvas from 'html2canvas'
import { mapGetters } from 'vuex'
export default {
  name: 'SeeEdit',
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
    },
    timeFormat(val) {
      if (!val) {
        return ''
      } else {
        return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  },
  props: {
    seeEditList: {
      type: Array,
      default: null
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    seeDetailsRow: {
      type: Object,
      default: null
    },
    notificationFlag: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      phone: '',
      activeName: '0',
      isApplyShow: false,
      distributForm: {
        resource: '',
        companyNum: '',
        name: ''
      },
      distributData: [],
      // 申请出单弹窗
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
      orderTab: this.seeEditList[0].qutote.orderid,
      handInput: this.seeEditList[0].flag, // 0 手动录入 1 正常录入
      riskDetail: this.seeEditList[0].risks,
      printDetail: this.seeEditList[0].qutote,
      licenseNoTab: this.seeEditList[0].qutote.licenseNo,
      insuredIdNoTab: this.seeEditList[0].qutote.insuredIdNo,
      companyIdTab: this.seeEditList[0].qutote.companyId,
      isCarDealer: false
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否是管理员渠道
    ])
  },
  watch: {
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
    this.getUserBtn()
  },
  methods: {
    // 获取是否有出单员，如果有出单员显示申请出单。没有就显示快速投保
    async getUserBtn() {
      const Paramsdata = {
        type: '3',
        sourceId: this.$store.getters.userAll.data.channelCode,
        name: ''
      }
      const resUsersData = await getUsersOnCondition(Paramsdata)
      if (resUsersData.data.length) {
        this.isUsersShow = true
      } else {
        this.isUsersShow = false
      }
    },
    hanldeBaoXian() {
      this.$emit('seeEditClose')
      window.openIssueUrl({
        carDealerId: this.seeDetailsRow.uuid, // 是否车商标识
        carLicense: this.licenseNoTab, // 车牌号
        frameNo: this.insuredIdNoTab // 车架号
      })
    },
    // 打印报价单
    hanldePrint() {
      this.$pricePrint(this.$refs.printCanvas)
    },
    // 快速投保
    handleToQuickissue() {
      this.$router.push({
        path: '/insurance/issuecenter',
        name: '电脑出单'
      })
    },
    // 申请出单
    applyingForBtn() {
      this.applyingForLoading = true
      this.applyingForSearch()
      getAllOfferRecords({ uuid: this.seeDetailsRow.uuid })
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
        uuid: this.seeDetailsRow.uuid,
        icarPoliyId: this.applyingIcarPoliyId, // icar_poliy_id:
        operatorId: this.applyingTableListId, // 选中的出单员id
        applyCompanyId: this.applyinglastCompanyId, // '申请报价保险公司的id'
        licenseNo: this.seeDetailsRow.licenseNo, // 这个是列表里面车牌号？我也不知道,据说是发送消息
        mark: this.applyingForRemarks
      }
      putApplyInsurance(Paramsdata)
        .then(res => {
          // console.log(res)
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
    // tab切换
    tabClick(val) {
      this.seeEditList.forEach((item, index) => {
        if (index === parseInt(val.index)) {
          this.orderTab = item.qutote.orderid
          this.licenseNoTab = item.qutote.licenseNo
          this.insuredIdNoTab = item.qutote.insuredIdNo
          this.companyIdTab = item.qutote.companyId
          this.handInput = item.flag
          this.riskDetail = item.risks
          this.printDetail = item.qutote
        }
      })
    },
    // 保存
    hanldeSaveImg() {
      html2canvas(this.$refs.printCanvas).then(canvas => {
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
    // 刷新报价
    async refreshBtn() {
      this.isRefresh = true
      try {
        const resR = await refreshQuotation({
          licenseNo: this.licenseNoTab,
          companyId: this.companyIdTab,
          icarPoliyId: this.orderTab,
          uuid: this.seeDetailsRow.uuid,
          sourceId: this.$store.getters.userAll.data.channelCode
        })
        if (resR.status === 200) {
          const resL = await getQuetoInfoList(
            qs.stringify({ orderId: this.seeDetailsRow.orderId })
          )
          if (resL.data.length > 0) {
            // 默认展示第一个报价数据
            this.$emit('refreshPriceOption', resL.data)
            this.isRefresh = false
            this.$message({
              type: 'success',
              message: '刷新成功'
            })
          } else {
            this.$message.warning('暂无报价记录')
            this.isRefresh = false
          }
        } else {
          this.isRefresh = false
          this.$message.error(resR.msg)
          this.$emit('failPriceAjax')
          this.getUserBtn()
        }
      } catch (e) {
        console.warn(e)
        this.isRefresh = false
      }
    }
  }
}
</script>
<style lang="scss">
  .seeEdit {
    .el-tabs__item {
      height: auto !important;
      padding: 0 !important;
    }
    .el-tabs__active-bar {
      height: 0px;
    }
    .el-tabs__nav-wrap::after {
      // background: #fff !important;
      height: 0px;
    }
    .el-tabs__nav-next,
    .el-tabs__nav-prev {
      line-height: 80px;
      background: rgba($color: #000000, $alpha: 0.1);
    }
    .input-with-phone {
      margin-left: 10px;
      margin-top: 10px;
      width: 280px;
      .el-input-group__append {
        height: 32px;
        background: #67c23a;
        border-top: 1px solid #4caf1a;
        border-right: 1px solid #4caf1a;
        border-bottom: 1px solid #4caf1a;
        color: #fff;
        button {
          margin-top: 0;
          padding: 0 20px;
        }
      }
      .el-input-group__append:hover {
        background: #4caf1a;
      }
    }
  }
</style>
<style lang="scss" scoped>
  @media screen and (max-width: 1200px) {
    .displayflex {
      display: block !important;
    }
    .tabsmainright {
      border-left: 0 !important;
      padding-left: 0px !important;
    }
  }
  .tabsNavbox {
    margin-bottom: 5px;
    margin-right: 10px;
    border: 1px solid #e4e7ed;
    padding: 10px 20px;
    overflow: hidden;
    border-radius: 4px;
    h3 {
      margin-block-start: 0em;
      margin-block-end: 0em;
      line-height: 1.2em;
      padding-bottom: 6px;
      font-size: 16px;
      color: #555;
    }
    p {
      margin-block-start: 0em;
      margin-block-end: 0em;
      line-height: 1.2em;
      padding-bottom: 4px;
      font-size: 12px;
      color: #888;
    }
  }
  .is-active {
    .tabsNavbox {
      background: #409eff;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      h3 {
        color: #fff !important;
      }
      p {
        color: #fff !important;
      }
    }
  }
  // .tabsmaintit{
  //   background:#f2f9ff;
  //   padding: 10px;
  //   font-size:16px;
  //   font-weight:bold;
  // }
  .tabsmain {
    overflow: hidden;
    border: 1px solid #e4e7ed;
    padding: 10px;
    .displayflex {
      display: flex;
      align-items: stretch;
    }
    .tabsmainleft {
      width: 360px;
    }
    .tabsmainright {
      flex: 1;
      border-left: 1px solid #e4e7ed;
      padding-left: 20px;
      h3 {
        margin-block-start: 0em;
        margin-block-end: 0.5em;
        font-size: 16px;
        line-height: 2em;
        border-bottom: 1px solid #e4e7ed;
        span {
          border-bottom: 3px solid #409eff;
          color: #409eff;
          padding: 5px;
        }
      }
      .total {
        text-align: right;
        padding-top: 5px;
        p {
          margin-block-start: 0em;
          margin-block-end: 0em;
          padding-bottom: 4px;
          font-size: 14px;
          font-weight: 700;
          color: #666;
        }
      }
    }
  }
  ul.tabCarBase {
    list-style: none;
    padding: 0;
    margin-block-start: 0em;
    margin-block-end: 0em;
    li {
      padding: 5px 0;
      color: #333;
      span {
        color: #888;
      }
    }
  }
  ul.riskbox {
    list-style: none;
    padding: 0;
    margin-block-start: 0em;
    margin-block-end: 0em;
    li {
      padding: 5px 0;
      display: flex;
      border-bottom: 1px solid #e4e7ed;
      span {
        display: block;
        flex: 1;
      }
    }
  }
  .btnall {
    padding-top: 0px;
    button {
      margin-top: 10px;
    }
  }
  .dialogMain {
    .dialogMainSearch {
      display: flex;
      align-items: center;

      span {
        display: block;
        height: 40px;
        line-height: 40px;
        padding-right: 10px;
      }
    }
    .dialogMainCompany {
      padding-top: 10px;
      .el-radio {
        height: auto;
        margin-bottom: 10px;
        margin-left: 0;
        margin-right: 10px;
        background: #f5f7fa;
      }
      strong {
      }

      p {
        padding-left: 24px;
        margin-block-start: 0.5em;
        margin-block-end: 0em;
        font-size: 12px;
        opacity: 0.8;
      }
    }

    .dialogMainList {
      padding: 10px 0 0 0;
      display: flex;

      .dialogMainListBox {
        padding-right: 10px;

        span {
          display: inline-block;
          font-weight: bold;
        }
      }
    }

    .dialogMainTops {
      padding-top: 10px;

      strong {
        display: block;
        padding-bottom: 10px;
      }
    }
  }
</style>
