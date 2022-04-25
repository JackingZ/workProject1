<template>
  <div class="app-container">
    <div class="app-panel">
      <div class="detail-container">
        <el-form ref="baseForm" :model="baseForm" label-width="140px" label-position="left" class="baseForm-box">
          <div class="detail-title">
            <svg-icon icon-class="baseinfo" />
            <span>基本信息</span>
            <span style="color: #409eff;float: right;cursor: pointer;" @click="editBaseData('1')">
              <i class="el-icon-edit-outline" />&nbsp;编辑
            </span>
          </div>
          <div style="width: 90%;border: 1px solid #ebeef5;margin-left: 25px;display: flex;align-items: center;">
            <div style="width: 160px;text-align:center;padding: 20px;">
              <el-button type="text" style="font-size: 20px;font-weight: 600;color: #000;">{{ baseForm.licenseNo }}</el-button>
              <el-button v-show="baseForm.typeDesc" type="warning" round size="mini" style="background-color: #e6a23c;">{{ baseForm.typeDesc }}</el-button>
              <el-button v-show="baseForm.numberIntoShop" type="primary" round size="mini" style="margin-top: 15px;">本年进店{{ baseForm.numberIntoShop }}次</el-button>
            </div>
            <div style="flex: 1;padding: 10px;border-left: 1px solid #ebeef5;">
              <el-form-item label="车主姓名：">
                <span>{{ baseForm.ownerName }}</span>
              </el-form-item>
              <el-form-item label="性别：">
                <span>{{ baseForm.ownerSex }}</span>
              </el-form-item>
              <el-form-item label="联系电话：">
                <span>{{ baseForm.ownerPhone }}</span>
              </el-form-item>
              <el-form-item :label="baseForm.ownerIdTypeDesc? baseForm.ownerIdTypeDesc + '：' : '身份证：'">
                <span>{{ baseForm.ownerIdNo }}</span>
              </el-form-item>
              <el-form-item style="width:800px;" label="联系地址：">
                <span>{{ baseForm.ownerAddr }}</span>
              </el-form-item>
              <el-form-item label="邮箱：">
                <span>{{ baseForm.ownerEmail }}</span>
              </el-form-item>
              <el-form-item label="信息来源：">
                <span>{{ baseForm.inputTypeDesc }}</span>
              </el-form-item>
              <el-form-item label="录入时间：">
                <span>{{ baseForm.time }}</span>
              </el-form-item>
              <el-form-item label="最新进店时间：">
                <span>{{ baseForm.recentTime }}</span>
              </el-form-item>
              <el-form-item label="续保专员：">
                <span>{{ baseForm.salesmanName }}</span>
              </el-form-item>
              <el-form-item label="投保人：">
                <span>{{ baseForm.holderName }}</span>
              </el-form-item>
              <el-form-item :label="baseForm.holderIdTypeDesc? baseForm.holderIdTypeDesc + '：' : '身份证：'">
                <span>{{ baseForm.holderIdNo }}</span>
              </el-form-item>
              <el-form-item label="被保人：">
                <span>{{ baseForm.insuredName }}</span>
              </el-form-item>
              <el-form-item :label="baseForm.insuredIdTypeDesc? baseForm.insuredIdTypeDesc + '：' : '身份证：'">
                <span>{{ baseForm.insuredIdNo }}</span>
              </el-form-item>
              <el-form-item label="证件相片：">
                <el-popover v-show="isIdface" placement="bottom-start" width="230" trigger="hover">
                  <img :src="baseForm.idfaceImg" alt style="width: 200px;height: 150px;display: block;">
                  <el-button slot="reference" type="text" style="padding: 0px 5px;">证件相片正面</el-button>
                </el-popover>
                <el-popover v-show="isIdback" placement="bottom-start" width="230" trigger="hover">
                  <img :src="baseForm.idbackImg" alt style="width: 200px;height: 150px;display: block;">
                  <el-button slot="reference" type="text" style="padding: 0px 5px;">证件相片反面</el-button>
                </el-popover>
              </el-form-item>
            </div>
          </div>

          <div class="detail-title">
            <svg-icon icon-class="carinfo" />
            <span>车辆信息</span>
            <span style="color: #409eff;float: right;cursor: pointer;" @click="editBaseData('2')">
              <i class="el-icon-edit-outline" />&nbsp;编辑
            </span>
          </div>
          <div style="margin-left: 25px;width: 90%;border: 1px solid #ebeef5;padding: 10px;">
            <el-form-item label="品牌型号：">
              <span>{{ baseForm.brandName }}</span>
            </el-form-item>
            <el-form-item label="车型：">
              <span>{{ baseForm.modelCode }}</span>
            </el-form-item>
            <el-form-item label="车架号：">
              <span>{{ baseForm.frameNo }}</span>
            </el-form-item>
            <el-form-item label="发动机号：">
              <span>{{ baseForm.engineNo }}</span>
            </el-form-item>
            <el-form-item label="车辆使用性质：">
              <span>{{ baseForm.useNature }}</span>
            </el-form-item>
            <el-form-item v-show="baseForm.useNature === '营运'" label="使用性质细分：">
              <span>{{ baseForm.attachNature }}</span>
            </el-form-item>
            <el-form-item label="座位数：">
              <span>{{ baseForm.seatCount }}</span>
            </el-form-item>
            <el-form-item label="新车价格：">
              <span>{{ baseForm.purchasePrice }}元</span>
            </el-form-item>
            <el-form-item label="注册日期：">
              <span>{{ baseForm.enrollDate }}</span>
            </el-form-item>
            <el-form-item label="商业险止期：">
              <span>{{ baseForm.comEndDate }}</span>
            </el-form-item>
            <el-form-item label="交强险止期：">
              <span>{{ baseForm.forceEndDate }}</span>
            </el-form-item>
            <el-form-item label="是否一年内过户：">
              <span>{{ baseForm.transferDesc }}</span>
            </el-form-item>
            <el-form-item label="交管车辆类型：">
              <span>{{ baseForm.vehicleType }}</span>
            </el-form-item>
            <el-form-item label="车牌底色：">
              <span>{{ baseForm.plateColor }}</span>
            </el-form-item>
            <el-form-item label="证件相片：">
              <el-popover v-show="isLicenseface" placement="bottom-start" width="230" trigger="hover">
                <img :src="baseForm.licensefaceImg" alt style="width: 200px;height: 150px;display: block;">
                <el-button slot="reference" type="text" style="padding: 0px 5px;">行驶证正面</el-button>
              </el-popover>
              <el-popover v-show="isLicenseback" placement="bottom-start" width="230" trigger="hover">
                <img :src="baseForm.licensebackImg" alt style="width: 200px;height: 150px;display: block;">
                <el-button slot="reference" type="text" style="padding: 0px 5px;">行驶证反面</el-button>
              </el-popover>
            </el-form-item>
          </div>
        </el-form>

        <div class="detail-title">
          <svg-icon icon-class="insurerecord" />
          <span>投保记录</span>
        </div>
        <el-table :data="insuredTable" :cell-style="{padding: '4px 0'}" :header-cell-style="{background:'#fafafa',padding: '8px 0'}" border style="margin-left: 25px;width: 90%;">
          <el-table-column prop="insureType" label="保险类型" align="center" width="100" />
          <el-table-column prop="policyNo" label="保单号" align="center" min-width="100" />
          <el-table-column prop="startDate" label="起期日期" align="center" width="150" />
          <el-table-column :formatter="shopTimeFormatter" prop="policyTime" label="购买时间" align="center" width="150" />
          <el-table-column prop="companyName" label="投保公司" align="center" min-width="100" />
          <el-table-column :formatter="premiumUnitFormatter" prop="premium" label="金额" align="center" width="150" />
          <el-table-column prop="salesmanName" label="续保专员" align="center" width="150" />
        </el-table>

        <div class="detail-title">
          <svg-icon icon-class="enterrecord" />
          <span>进站记录</span>
        </div>
        <el-table :data="enterTable" :cell-style="{padding: '4px 0'}" :header-cell-style="{background:'#fafafa',padding: '8px 0'}" border style="width: 90%;margin-left: 25px;">
          <el-table-column :formatter="enterTimeFormatter" prop="time" label="进店时间" align="center" />
          <el-table-column prop="shopName" label="店面名称" align="center" />
          <el-table-column :formatter="quoteFlagFormatter" prop="quoteFlag" label="报价状态" align="center" />
        </el-table>
        <div v-show="count > 0" style="text-align:right;margin-top:5px;width: 90%;">
          <el-pagination :current-page="page" :page-sizes="[10, 20, 30, 40, 50]" :page-size="size" :total="count" layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChange" @current-change="pageChange" />
        </div>

        <div class="detail-title">
          <svg-icon icon-class="followrecord" />
          <span>续保跟进记录</span>
        </div>
        <div v-for="(item, index) in renewalTable" :key="item.id" class="renewal-list">
          <span class="renewal-time">{{ item.time }}</span>
          <el-button style="width: 100px;margin: 0px 20px;" type="danger" size="small">{{ item.actionTypeDesc }}</el-button>
          <el-button v-if="item.isMarkShow" type="text" class="renewal-mark">{{ item.actionMark }}</el-button>
          <el-popover v-else :content="item.actionMark" placement="right" style="margin-left: 10px;" width="300" trigger="hover">
            <el-button slot="reference" type="text" class="renewal-mark">{{ item.actionMark }}</el-button>
          </el-popover>
          <span v-permission="[permissionList.renewalAdmin, permissionList.renewalCarAdmin, permissionList.renewalInsurance]">
            <el-button v-show="baseForm.taskState !== 7 && item.actionType === 5 && item.actionMark !== '申请出单(已撤回)'" style="margin-left: 20px;" type="text" @click="recallFollow(item, index)">撤回</el-button>
          </span>
        </div>

        <div class="fixed-record">
          <div v-if="routerName">
            <div v-permission="permissionList.renewalInsurance" v-if="baseForm.endDayNum >= 0 && baseForm.endDayNum <= renewalDay" class="follow-record" @click="editFollowData">
              <svg-icon icon-class="xbbj" />跟进结果录入
            </div>
          </div>
          <div v-else>
            <div v-permission="permissionList.renewalInsurance" v-if="baseForm.endDayNum >= 0 && baseForm.endDayNum <= renewalDay" class="follow-record" @click="editFollowData">
              <svg-icon icon-class="xbbj" />跟进结果录入
            </div>
          </div>
          <div v-loading="autoLoading" :class="isAuto? 'price-record-disabled' : 'price-record'" @click="checkPrice">
            <svg-icon icon-class="bjjl" />{{ isRecord ? '历史报价记录' : '自动报价' }}
          </div>
        </div>

        <el-dialog :visible.sync="failShow" title="报价失败" width="30%">
          <div style="font-size: 14px;word-break: break-all;">原因：{{ failReason }}</div>
          <div style="padding:10px 0 30px;">您可以完善信息重新报价或手动报价!</div>
          <div class="dialog-footer">
            <el-button size="small" @click="failShow = false">取 消</el-button>
            <el-button size="small" type="primary" @click="handleErrBJ">去手动报价</el-button>
          </div>
        </el-dialog>

        <el-dialog :visible.sync="priceShow" title="报价详情" width="60%">
          <customer-price v-if="priceShow" :price-list="priceList" :price-option="priceOption" :price-id="priceId" :is-loading="priceLoading" @priceClose="priceClose" @priceOption="setPriceOption" @reNewPrice="reNewPrice"/>
        </el-dialog>

        <app-drawer :is-show="isEditShow" :mask-closable="false" drawer-title="编辑信息" drawer-style="width: 500px;" @drawerConfirm="editConfirm" @drawerClose="searchClose">
          <customer-edit ref="customerEdit" :is-edit="isEdit" :title-name="activeName" :edit-form="editForm" :control-data="controlData" :type-option="typeData" :loading="editLoading" :back-img="backImg" @sendBackImg="sendBackImg" />
        </app-drawer>

        <app-drawer :is-show="isFollowShow" :mask-closable="false" drawer-title="跟进结果录入" drawer-style="width: 530px;" no-button @drawerClose="searchClose">
          <customer-follow ref="customerFollow" :follow-form="renewalForm" :follow-data="followData" :saler-data="salerData" :follow-loading="followLoading" @screen="followConfirm" />
        </app-drawer>
      </div>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import {
  getCustomerDetailById,
  getCustomerSelectId,
  setCustomerEditImgs,
  getCustomerEnterPage,
  getCustomerEnterState,
  getCustomerRecallInsure,
  getControlCarType,
  getCustomerCarType,
  getQuoteInfo
} from '@/api/customer'
import {
  getBdinput,
  getAllOfferRecords,
  getUsersOnCondition,
  autoQuotation
} from '@/api/mytask'
import { getRenewalStantandDay } from '@/api/renewal'
import customerEdit from '@/views/carDealer/customerEdit'
import customerPrice from '@/views/carDealer/customerPrice'
import customerFollow from '@/views/carDealer/customerFollow'
import appDrawer from '@/components/Drawer/drawer'
import { formatDate } from '@/utils/index'
import qs from 'qs'
import dayjs from 'dayjs'
export default {
  name: 'CustomerDetail',
  components: {
    appDrawer,
    customerEdit,
    customerFollow,
    customerPrice
  },
  data() {
    return {
      backImg: null, // 行驶证背面
      routerId: null,
      routerName: null,
      uuidNum: '',
      baseForm: {}, // 基本信息
      renewalForm: {
        id: null,
        uuid: '',
        state: null, // 续保状态
        planReturnTime: '', // 续保时间
        failReasonState: '', // 战败原因
        mark: '', // 续保备注
        companyId: '', // 保险公司Id
        channelId: '', // 工号
        policyType: 3, // 保单种类
        businessType: '', // 业务类型
        tciDiscount: '', // 交强险折扣
        tciEndDate: '', // 交强险保险止期
        tciLossOccurredCount: null, // 交强险出险次数
        tciPolicyNo: '', // 交强保单号
        tciPolicyTime: '', // 交强险签单时间
        tciPremium: '', // 交强险全保费
        tciStartDate: '', // 交强险保险起期
        team: null, // 所属团队
        userId: '', // 业务员
        vciDiscount: '', // 商业险折扣
        vciEndDate: '', // 商业险保险止期
        vciLossOccurredCount: '', // 商业险出险次数
        vciPolicyNo: '', // 商业保单号
        vciPolicyTime: '', // 商业险签单时间
        vciPremium: '', // 商业险全保费
        vciProposalNo: '',
        vciStartDate: '', // 商业险保险起期
        vehicleTax: '', // 车船税
        organization: '', // 出单机构团队返回值
        common: '' // 备注信息
      }, // 续保编辑
      priceLoading: false,
      priceList: [], // 报价列表
      priceOption: {}, // 报价记录
      renewalTable: [], // 续保记录
      insuredTable: [], // 投保记录
      enterTable: [], // 进站记录
      followData: [],
      salerData: [], // 业务员
      followLoading: false,
      count: 0,
      page: 1,
      size: 10,
      priceId: '',
      priceShow: false,
      isEditShow: false,
      isEdit: false,
      isFollowShow: false,
      activeName: '',
      editForm: {},
      controlData: [],
      typeData: [],
      editLoading: false,
      isIdface: false,
      isIdback: false,
      isLicenseface: false,
      isLicenseback: false,
      isRecord: false,
      isAuto: false,
      autoLoading: false,
      failShow: false,
      failReason: '',
      renewalDay: 90
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    // '$route': 'getDetailAllData'
  },
  async created() {
    this.getRenewalDay()
    this.routerId = this.$route.query.id
    this.routerName = this.$route.query.name
    this.getCustomerDetail()
  },
  methods: {
    getRenewalDay() {
      getRenewalStantandDay().then(res => {
        this.renewalDay = res.data.daysConfig
      })
    },
    sendBackImg(val) {
      this.backImg = val
    },
    // 格式化
    enterTimeFormatter(val) {
      return formatDate(val.time).slice(0, 10)
    },
    shopTimeFormatter(val) {
      return formatDate(val.policyTime).slice(0, 10)
    },
    premiumUnitFormatter(val) {
      if (val.premium) {
        return val.premium + '元'
      }
    },
    quoteFlagFormatter(val) {
      if (val.quoteFlag === 0) {
        return '待报价'
      } else if (val.quoteFlag === 1) {
        return '报价成功'
      } else if (val.quoteFlag === 2) {
        return '报价失败'
      }
    },
    // 分页
    sizeChange(val) {
      this.size = val
      this.getCustomerEnterTable()
    },
    pageChange(val) {
      this.page = val
      this.getCustomerEnterTable()
    },
    // 进站记录
    async getCustomerEnterTable() {
      if (this.baseForm.licenseNo) {
        const resEnter = await getCustomerEnterPage({
          params: { licenseNo: this.baseForm.licenseNo },
          current: this.page,
          size: this.size
        })
        this.enterTable = resEnter.data.records
        this.count = resEnter.data.total
      }
    },
    // 报价记录窗口
    async checkPrice() {
      if (this.isAuto) return
      if (this.isRecord) {
        this.priceShow = true
        this.priceLoading = true
        // 默认展示第一个报价数据
        const resD = await getQuoteInfo({
          orderId: this.priceList[0].icar_poliy_id
        })
        this.priceOption = resD.data
        this.priceLoading = false
      } else {
        this.isAuto = true
        this.autoLoading = true
        const resA = await autoQuotation({
          licenseNo: this.baseForm.licenseNo ? this.baseForm.licenseNo : '',
          frameNo: this.baseForm.frameNo ? this.baseForm.frameNo : '',
          sourceId: this.$store.getters.userAll.data.channelCode
        })
        if (resA.status === 200) {
          this.$message.success('自动报价成功!')
          this.isAuto = false
          this.autoLoading = false
        } else {
          this.isAuto = false
          this.autoLoading = false
          this.failReason = resA.msg
          this.failShow = true
        }
        this.getCustomerDetail()
      }
    },
    // 手动报价
    handleErrBJ() {
      this.failShow = false
      window.openIssueUrl({
        carDealerId: this.baseForm.uuid,
        carLicense: this.baseForm.licenseNo,
        frameNo: this.baseForm.frameNo
      })
    },
    // 查看详情弹窗关闭
    priceClose() {
      this.priceShow = false
    },
    setPriceOption(val) {
      this.priceOption = val
    },
    reNewPrice(val) {
      if (val === 'new') {
        this.getCustomerDetail()
        this.checkPrice()
      }
    },
    // 基本详情
    async getCustomerDetail() {
      const resDetail = await getCustomerDetailById(this.routerId)
      this.baseForm = JSON.parse(JSON.stringify(resDetail.data.customerVO))
      this.priceId = resDetail.data.customerVO.uuid
      const resL = await getAllOfferRecords({ uuid: this.priceId })
      this.priceList = resL.data
      if (this.priceList.length > 0) {
        this.isRecord = true
      } else {
        this.isRecord = false
      }
      const arrSort = resDetail.data.workflowRecordList.sort(
        (a, b) => b.id - a.id
      )
      this.renewalTable = JSON.parse(JSON.stringify(arrSort))
      this.renewalTable.map((item, index) => {
        if (item.actionMark && item.actionMark.length > 10) {
          this.renewalTable[index].isMarkShow = false
        } else {
          this.renewalTable[index].isMarkShow = true
        }
      })
      // console.log(this.renewalTable)
      const arrFiles = resDetail.data.fileList
      arrFiles.forEach(item => {
        if (item.flag === 0 && item.files) {
          this.baseForm.idfaceImg = item.files
          this.isIdface = true
        }
        if (item.flag === 1 && item.files) {
          this.baseForm.idbackImg = item.files
          this.isIdback = true
        }
        if (item.flag === 2 && item.files) {
          this.baseForm.licensefaceImg = item.files
          this.isLicenseface = true
        }
        if (item.flag === 3 && item.files) {
          this.baseForm.licensebackImg = item.files
          this.isLicenseback = true
        }
      })
      this.insuredTable = resDetail.data.insureRecordList
      this.renewalForm.id = resDetail.data.customerVO.id
      this.renewalForm.uuid = resDetail.data.customerVO.uuid

      if (this.baseForm.ownerSex === 1) {
        this.baseForm.ownerSex = '男'
      } else if (this.baseForm.ownerSex === 2) {
        this.baseForm.ownerSex = '女'
      } else {
        this.baseForm.ownerSex = '保密'
      }
      if (this.baseForm.holderSex === 1) {
        this.baseForm.holderSex = '男'
      } else if (this.baseForm.holderSex === 2) {
        this.baseForm.holderSex = '女'
      } else {
        this.baseForm.holderSex = '保密'
      }
      if (this.baseForm.insuredSex === 1) {
        this.baseForm.insuredSex = '男'
      } else if (this.baseForm.insuredSex === 2) {
        this.baseForm.insuredSex = '女'
      } else {
        this.baseForm.insuredSex = '保密'
      }
      if (this.baseForm.recentTime) {
        this.baseForm.recentTime = formatDate(this.baseForm.recentTime).slice(
          0,
          10
        )
      }
      if (this.baseForm.useNature === '100') {
        this.baseForm.useNature = '非营运'
      } else {
        this.baseForm.useNature = '营运'
      }
      if (this.baseForm.transferDate) {
        this.baseForm.transferDesc = '是'
      } else {
        this.baseForm.transferDesc = '否'
      }
      if (this.baseForm.attachNature === '201') {
        this.baseForm.attachNature = '出租租赁'
      } else if (this.baseForm.attachNature === '202') {
        this.baseForm.attachNature = '城市公交'
      } else if (this.baseForm.attachNature === '203') {
        this.baseForm.attachNature = '公路客运'
      } else if (this.baseForm.attachNature === '204') {
        this.baseForm.attachNature = '旅游客运'
      }
      if (this.baseForm.plateColor === '101') {
        this.baseForm.plateColor = '蓝'
      } else if (this.baseForm.plateColor === '102') {
        this.baseForm.plateColor = '黑'
      } else if (this.baseForm.plateColor === '103') {
        this.baseForm.plateColor = '白'
      } else if (this.baseForm.plateColor === '104') {
        this.baseForm.plateColor = '黄'
      } else if (this.baseForm.plateColor === '105') {
        this.baseForm.plateColor = '白蓝'
      } else if (this.baseForm.plateColor === '106') {
        this.baseForm.plateColor = '黄绿'
      } else if (this.baseForm.plateColor === '107') {
        this.baseForm.plateColor = '渐变绿'
      } else if (this.baseForm.plateColor === '199') {
        this.baseForm.plateColor = '其他'
      }
      this.getCustomerEnterTable()
      const resC = await getControlCarType()
      this.controlData = resC.data.vehicleTypeList
      this.controlData.forEach(item => {
        if (this.baseForm.vehicleType === item.code) {
          this.baseForm.vehicleType = item.name
        } else {
          this.baseForm.vehicleType = '轿车'
        }
      })
    },
    // 编辑窗口
    async editBaseData(num) {
      this.isEditShow = true
      this.isEdit = true
      this.editLoading = true
      if (num === '1') {
        this.activeName = 'first'
      } else {
        this.activeName = 'second'
      }
      const resD = await getCustomerSelectId(this.routerId)
      if (resD.data.ownerIdType) {
        const strO = resD.data.ownerIdType.slice(0, 1) + '00'
        resD.data.ownerCardType = [strO, resD.data.ownerIdType]
      } else {
        resD.data.ownerCardType = []
      }
      if (resD.data.holderIdType) {
        const strH = resD.data.holderIdType.slice(0, 1) + '00'
        resD.data.holderCardType = [strH, resD.data.holderIdType]
      } else {
        resD.data.holderCardType = []
      }
      if (resD.data.insuredIdType) {
        const strI = resD.data.insuredIdType.slice(0, 1) + '00'
        resD.data.insureCardType = [strI, resD.data.insuredIdType]
      } else {
        resD.data.insureCardType = []
      }
      if (resD.data.transferDate) {
        resD.data.transfer = 0
      } else {
        resD.data.transfer = 1
      }
      if (resD.data.holderName === resD.data.ownerName) {
        resD.data.insuringPerson = 0
      } else {
        resD.data.insuringPerson = 1
      }
      if (resD.data.insuredName === resD.data.ownerName) {
        resD.data.insuredPerson = 0
      } else if (resD.data.insuredName === resD.data.holderName) {
        resD.data.insuredPerson = 1
      } else {
        resD.data.insuredPerson = 2
      }
      const arrFiles = resD.data.fileList
      arrFiles.forEach(item => {
        if (item.flag === 0) {
          resD.data.imageIdface = item.files
        }
        if (item.flag === 1) {
          resD.data.imageIdback = item.files
        }
        if (item.flag === 2) {
          resD.data.imagelicenseface = item.files
        }
        if (item.flag === 3) {
          resD.data.imagelicenseback = item.files
        }
      })
      this.editForm = resD.data
      this.editForm.cardName = this.editForm.ownerName
      this.backImg = this.editForm.imagelicenseback
      this.editForm.vehicleType = this.editForm.vehicleType
        ? this.editForm.vehicleType
        : 'K33'
      this.getCarType(resD.data.frameNo)
      this.editLoading = false
    },
    getCarType(frameNo) {
      if (frameNo) {
        getCustomerCarType(qs.stringify({ frameNo: frameNo }))
          .then(res => {
            if (res.status === 200) {
              this.typeData = res.data.list
              this.typeData.forEach(item => {
                if (item.modelCode === this.editForm.modelCode) {
                  this.editForm.purchasePrice = item.purchasePrice
                  this.editForm.seatCount = item.seatCount
                }
              })
            }
          })
          .catch(err => {
            console.warn(err)
            this.$message.error('未查询到车型信息，请核实车架号')
          })
      }
    },
    // 编辑保存
    editConfirm() {
      const formData = this.$refs.customerEdit.editForm
      if (formData.insuringPerson === 0) {
        formData.holderName = formData.ownerName
        formData.holderIdType = formData.ownerIdType
        formData.holderIdNo = formData.ownerIdNo
        formData.holderSex = formData.ownerSex
        formData.holderAddr = formData.ownerAddr
        formData.holderPhone = formData.ownerPhone
      }
      if (formData.insuredPerson === 0) {
        formData.insuredName = formData.ownerName
        formData.insuredIdType = formData.ownerIdType
        formData.insuredIdNo = formData.ownerIdNo
        formData.insuredSex = formData.ownerSex
        formData.insuredAddr = formData.ownerAddr
        formData.insuredPhone = formData.ownerPhone
      }
      if (formData.insuredPerson === 1) {
        formData.insuredName = formData.holderName
        formData.insuredIdType = formData.holderIdType
        formData.insuredIdNo = formData.holderIdNo
        formData.insuredSex = formData.holderSex
        formData.insuredAddr = formData.holderAddr
        formData.insuredPhone = formData.holderPhone
      }
      const fd = new FormData()
      fd.append('data', JSON.stringify(formData))
      if (formData.file0) {
        fd.append('file0', formData.file0)
      }
      if (formData.file1) {
        fd.append('file1', formData.file1)
      }
      if (formData.file2) {
        fd.append('file2', formData.file2)
      }
      if (formData.file3) {
        fd.append('file3', formData.file3)
      }
      if (formData.ownerIdType && formData.ownerIdNo) {
        this.activeName = 'second'
      } else {
        this.activeName = 'first'
      }
      this.$refs.customerEdit.$refs.ruleForm.validate(valid => {
        if (!valid) return
        // if (formData.cardName !== formData.ownerName) {
        //   this.$message.error('车主姓名不一致')
        //   return
        // }
        setCustomerEditImgs(fd)
          .then(res => {
            console.log(res)
            if (res.status === 200) {
              this.isEditShow = false
              this.$message({
                type: 'success',
                message: '编辑成功'
              })
              this.getCustomerDetail()
              this.$refs.customerEdit.$refs.ruleForm.resetFields()
              this.editForm.imageIdface = null
              this.editForm.imageIdback = null
              this.editForm.imagelicenseface = null
              this.editForm.imagelicenseback = null
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(err => {
            console.warn(err)
            this.$message.error(err)
          })
      })
    },
    // 跟进窗口
    async editFollowData() {
      this.isFollowShow = true
      this.followLoading = true
      // 判断是否有出单员
      const resN = await getUsersOnCondition({
        type: '3',
        sourceId: this.$store.getters.userAll.data.channelCode
      })
      this.salerData = [
        {
          name: this.baseForm.salesmanName,
          id: this.baseForm.salesmanId
        }
      ]
      if (resN.data && resN.data.length > 0) {
        this.followData = [
          { key: 0, value: '忙碌中待联系' },
          { key: 1, value: '考虑中(普通)' },
          { key: 2, value: '考虑中(重点)' },
          { key: 3, value: '其他' },
          { key: 4, value: '预约到店' },
          { key: 5, value: '无效数据' },
          { key: 8, value: '战败' }
          // { key: 10, value: '申请报价' },
          // { key: 11, value: '任务转派' }
        ]
      } else {
        this.followData = [
          { key: 0, value: '忙碌中待联系' },
          { key: 1, value: '考虑中(普通)' },
          { key: 2, value: '考虑中(重点)' },
          { key: 3, value: '其他' },
          { key: 4, value: '预约到店' },
          { key: 5, value: '无效数据' },
          { key: 6, value: '成功出单' },
          { key: 8, value: '战败' }
          // { key: 10, value: '申请报价' },
          // { key: 11, value: '任务转派' }
        ]
      }
      this.renewalForm.tciPolicyTime = dayjs().format('YYYY-MM-DD')
      this.renewalForm.vciPolicyTime = dayjs().format('YYYY-MM-DD')
      if (this.baseForm.comEndDate) {
        this.renewalForm.tciStartDate = dayjs(this.baseForm.comEndDate)
          .add(1, 'day')
          .format('YYYY-MM-DD')
      }
      if (this.baseForm.forceEndDate) {
        this.renewalForm.vciStartDate = dayjs(this.baseForm.forceEndDate)
          .add(1, 'day')
          .format('YYYY-MM-DD')
      }
      console.log(this.renewalForm)
      this.followLoading = false
    },
    // 跟进保存
    followConfirm() {
      const formData = this.$refs.customerFollow.followForm
      formData.tciEndDate = formData.tciStartDate? dayjs(formData.tciStartDate).add(1, 'year').subtract(1, 'day')
      .format('YYYY-MM-DD') : ''
      formData.vciEndDate = formData.vciStartDate? dayjs(formData.vciStartDate).add(1, 'year').subtract(1, 'day')
      .format('YYYY-MM-DD') : ''
      this.$refs.customerFollow.$refs.followForm.validate(valid => {
        if (!valid) return
        if (formData.state === 6) {
          this.followLoading = true
          const person = {}
          this.uuidNum = this.setuuid()
          person.policy = {
            sourceCode: this.$store.getters.userAll.data.channelCode,
            operatorId: this.$store.getters.userAll.data.id,
            companyId: formData.companyId,
            channelId: formData.channelId ? formData.channelId : 999999,
            policyType: formData.policyType,
            businessType: '2',
            receiveAddress: '',
            receiveName: '',
            receivePhone: '',
            tciEndDate: new Date(
              dayjs(formData.tciStartDate).add(1, 'year').subtract(1, 'day')
            ).getTime(),
            tciPolicyNo: formData.tciPolicyNo,
            tciPolicyTime: formData.tciPolicyTime,
            tciPremium: formData.tciPremium ? parseFloat(formData.tciPremium).toFixed(2) : '',
            tciStartDate: formData.tciStartDate,
            team: formData.team,
            userId: formData.userId,
            vciEndDate: new Date(
              dayjs(formData.vciStartDate).add(1, 'year').subtract(1, 'day')
            ).getTime(),
            vciPolicyNo: formData.vciPolicyNo,
            vciPolicyTime: formData.vciPolicyTime,
            vciPremium: formData.vciPremium ? parseFloat(formData.vciPremium).toFixed(2) : '',
            vciStartDate: formData.vciStartDate,
            vehicleTax: formData.vehicleTax ? parseFloat(formData.vehicleTax).toFixed(2) : '',
            isOffline: 5,
            common: '',
            orderId: this.uuidNum
          }
          person.vehicle = {
            isNew: 0,
            licenseNo: this.baseForm.licenseNo || '新车',
            brandName: this.baseForm.brandName,
            frameNo: this.baseForm.frameNo || '0',
            engineNo: this.baseForm.engineNo || '0',
            vehicleCategory: this.baseForm.vehicleCategory || '101',
            vehicleType: this.baseForm.vehicleType || 'K33',
            useNature: this.baseForm.useNature || '100',
            attachNature: this.baseForm.attachNature,
            seatCount: this.baseForm.seatCount || 5,
            tonnage: this.baseForm.tonnage || 0,
            curbWeight: this.baseForm.curbWeight || 0,
            displacement: this.baseForm.displacement || 0,
            purchasePrice: this.baseForm.purchasePrice || 0,
            enrollDate: this.baseForm.enrollDate || new Date().getTime(),
            transfer: '',
            transferDate: this.baseForm.transferDate
          }
          person.applicant = {
            ownerName: this.baseForm.ownerName || '',
            ownerOptions: this.baseForm.ownerIdType
              ? [
                  this.baseForm.ownerIdType.slice(0, 1) + '00',
                  this.baseForm.ownerIdType
                ]
              : ['100', '101'],
            ownerIdType: this.baseForm.ownerIdType || '101',
            ownerIdNo: this.baseForm.ownerIdNo || '0',
            ownerPhone: this.baseForm.holderPhone || '0',
            ownerAddr: '',
            ownerSex: null,
            ownerBirthday: '',
            ownerAge: '',
            linkmanName: '',
            linkmanIdNo: '',
            salesmanName: '',
            salesmanIdNo: '',
            insuredName: this.baseForm.insuredName || '',
            insuredOptions: this.baseForm.insuredIdType
              ? [
                  this.baseForm.insuredIdType.slice(0, 1) + '00',
                  this.baseForm.insuredIdType
                ]
              : ['100', '101'],
            insuredIdType: this.baseForm.insuredIdType || '101',
            insuredIdNo: this.baseForm.insuredIdNo || '0',
            insuredPhone: this.baseForm.insuredPhone || '0',
            insuredBirthday: '',
            insuredAddr: '',
            insuredSex: null,
            insuredAge: '',
            holderName: this.baseForm.holderName || '',
            holderOptions: this.baseForm.holderIdType
              ? [
                  this.baseForm.holderIdType.slice(0, 1) + '00',
                  this.baseForm.holderIdType
                ]
              : ['100', '101'],
            holderIdType: this.baseForm.holderIdType || '101',
            holderIdNo: this.baseForm.holderIdNo || '0',
            holderPhone: this.baseForm.holderPhone || '0',
            holderBirthday: '',
            holderAddr: '',
            holderSex: null,
            holderAge: ''
          }
          person.risks = []
          getBdinput(person)
            .then(res => {
              this.$message({
                message: '保单录入成功',
                type: 'success'
              })
              this.followLoading = false
              this.isFollowShow = false
              formData.icarPoliyId = this.uuidNum
              getCustomerEnterState(formData).then(res => {
                this.resetFollow()
                this.$refs.customerFollow.$refs.followForm.resetFields()
              })
              this.getCustomerDetail()
            })
            .catch(err => {
              // this.isFollowShow = false
              this.followLoading = false
              console.warn(err)
            })
        } else {
          getCustomerEnterState(formData)
            .then(res => {
              this.$message({
                message: '跟进录入成功',
                type: 'success'
              })
              this.isFollowShow = false
              this.getCustomerDetail()
              this.resetFollow()
              this.$refs.customerFollow.$refs.followForm.resetFields()
            })
            .catch(err => {
              console.warn(err)
            })
        }
      })
    },
    // 自动生成32位唯一标识符
    setuuid() {
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
        ''
      )
      const uuid = []
      for (var i = 0; i < 32; i++) {
        uuid[i] = chars[0 | (Math.random() * 16)]
      }
      return uuid.join('')
    },
    // 重置跟单数据
    resetFollow() {
      this.renewalForm.state = null
      this.renewalForm.planReturnTime = ''
      this.renewalForm.mark = ''
      this.renewalForm.companyId = ''
      this.renewalForm.channelId = ''
      this.renewalForm.policyType = 3
      this.renewalForm.businessType = ''
      this.renewalForm.tciDiscount = ''
      this.renewalForm.tciEndDate = ''
      this.renewalForm.tciLossOccurredCount = null
      this.renewalForm.tciPolicyNo = ''
      this.renewalForm.tciPolicyTime = ''
      this.renewalForm.tciPremium = ''
      this.renewalForm.tciStartDate = ''
      this.renewalForm.team = null
      this.renewalForm.userId = ''
      this.renewalForm.vciDiscount = ''
      this.renewalForm.vciEndDate = ''
      this.renewalForm.vciLossOccurredCount = ''
      this.renewalForm.vciPolicyNo = ''
      this.renewalForm.vciPolicyTime = ''
      this.renewalForm.vciPremium = ''
      this.renewalForm.vciProposalNo = ''
      this.renewalForm.vciStartDate = ''
      this.renewalForm.vehicleTax = ''
      this.renewalForm.organization = ''
      this.renewalForm.common = ''
    },
    // 撤回申请出单
    recallFollow(item, index) {
      this.$confirm('确定要撤回该数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          getCustomerRecallInsure(
            qs.stringify({
              customerId: this.baseForm.id,
              uuid: this.baseForm.uuid,
              workId: item.id
            })
          ).then(res => {
            console.log(res.data)
            if (res.status === 200) {
              this.renewalTable[index].actionMark = '申请出单(已撤回)'
              this.$message({
                type: 'success',
                message: '撤回成功'
              })
            }
          })
        })
        .catch(() => {})
    },
    // 关闭
    searchClose() {
      this.isEditShow = false
      this.isFollowShow = false
    }
  }
}
</script>

<style lang="scss">
.detail-container {
  height: calc(100vh - 155px);
  overflow: auto;
  .detail-title {
    line-height: 30px;
    color: #409eff;
    padding-left: 10px;
    margin-top: 10px;
    width: 90%;
  }
  .baseForm-box {
    .el-form-item {
      margin-bottom: 0px;
      display: inline-block;
      width: 400px;
      .el-form-item__label {
        font-weight: normal;
        color: #000;
        line-height: 22px;
      }
      .el-form-item__content {
        line-height: 22px;
        color: #666;
      }
    }
  }
  .el-steps--vertical {
    height: auto;
  }
  .renewal-list {
    margin-left: 25px;
    height: 50px;
    .renewal-time {
      width: 180px;
      line-height: 50px;
      display: inline-block;
      border-right: 1px solid #999;
      color: #333;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        top: 19px;
        right: -5px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 1px solid #999;
        background-color: #999;
      }
    }
    .renewal-mark {
      width: 200px;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-align: left;
      overflow: hidden;
      color: #666;
    }
  }
  .fixed-record {
    position: fixed;
    top: 50%;
    margin-top: -180px;
    right: 60px;
    z-index: 1000;
    width: 40px;
    .price-record {
      padding: 25px 13px;
      background-color: #67c23a;
      color: #fff;
      cursor: pointer;
    }
    .price-record-disabled {
      padding: 25px 13px;
      background-color: #999;
      color: #fff;
      cursor: not-allowed;
    }
    .follow-record {
      padding: 25px 13px;
      background-color: #409eff;
      color: #fff;
      cursor: pointer;
    }
  }
}
// /*滚动条样式*/
// .detail-container::-webkit-scrollbar {
//   /*滚动条整体样式*/
//   width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
//   height: 4px;
// }
// .detail-container::-webkit-scrollbar-thumb {
//   /*滚动条里面小方块*/
//   border-radius: 5px;
//   -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
//   background: rgba(0, 0, 0, 0.2);
// }
// .detail-container::-webkit-scrollbar-track {
//   /*滚动条里面轨道*/
//   -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
//   border-radius: 0;
//   background: rgba(0, 0, 0, 0.1);
// }
</style>
