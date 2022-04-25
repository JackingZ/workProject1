<template>
  <div class="wrap-content infoDisplay">
    <div id="policyinfo" class="policyheader">
      <img :src="companyAvatar" alt>
      <div class="policyheadermodal"/>
      <div class="policyheadinfo">
        <span style="font-weight: 600;">{{ vehicleExt.licenseNo | filternulls }}</span>
        <span>{{ policyHead }}</span>
        <span style="color: #409EFF;cursor: pointer;margin-left: 10px;" @click="checkDetail">查看详情 ></span>
        <span style="position: absolute;right: 10px;">投保地区：{{ policyExt.areaName | filternulls }}</span>
      </div>
    </div>

    <div class="item-wrap">
      <info-item :text="policyExt.sourceCodeName" title="所属渠道"/>
      <info-item :text="policyExt.companyName" title="保险公司"/>
      <info-item :text="policyExt.channelIdName" title="出单工号"/>
    </div>
    <div class="item-wrap">
      <info-item :text="policyExt.organizationName" title="所属机构"/>
      <info-item :text="policyExt.userName" title="业务员"/>
      <info-item :text="policyExt.operatorIdName" title="出单员"/>
    </div>
    <div class="item-wrap">
      <info-item :text="policyExt.policyTypeName" title="投保类型"/>
      <info-item :text="policyExt.businessTypeName" title="业务类型"/>
      <info-item :text="policyExt.policyFrom" title="录入来源"/>
    </div>
    <div class="item-wrap">
      <info-item
        v-if="!canEdit"
        :text="policyStatusFormatter(policyExt.policyStatus)"
        title="订单状态"
      />
      <info-item v-if="canEdit" :show-text="false" title="订单状态">
        <el-select
          v-model="policyExt.policyStatus"
          prop="policyStatus"
          size="mini"
          style="width: 100%;"
        >
          <el-option
            v-for="item in getPolicyStatusList(policyStatus)"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </info-item>
      <info-item
        v-if="policyExt.policyStatus !== 8 || !canEdit"
        :text="formatTime(policyExt.policyTime)"
        title="签单时间"
      />
      <info-item v-if="policyExt.policyStatus === 8 && canEdit" :show-text="false" title="签单时间">
        <el-date-picker
          v-model="policyTime"
          :clearable="false"
          :picker-options="disabledDate"
          size="mini"
          style="width: 100%;"
          type="datetime"
          prefix-icon="time_ico"
          placeholder="选择日期"
          value-format="timestamp"
        />
      </info-item>
      <info-item :text="policyExt.inputTime" title="录入时间"/>
    </div>
    <div v-if="policyExt.policyStatus !== 8" class="item-wrap">
      <info-item :text="policyExt.reason" title="审核意见"/>
    </div>
    <div class="item-wrap">
      <info-item
        v-if="policyExt.policyStatus === 8 && isDatongChannel"
        :show-text="false"
        title="同步状态"
      >
        <el-button
          :type="policyExt.syncStatus === 1 ? 'info' : 'primary'"
          :disabled="policyExt.syncStatus === 1"
          :loading="btnLoading"
          size="mini"
          icon="el-icon-refresh"
          round
          @click="synchronize"
        >{{ syncStatusText }}</el-button>
      </info-item>
      <info-item v-else-if="isDatongChannel" title="同步状态"/>
      <info-item :show-text="false"/>
      <info-item :show-text="false"/>
    </div>
    <div class="divider m-tb"/>

    <template v-if="policyExt.policyTypeName !== '单商业'">
      <div class="item-wrap">
        <info-item
          v-if="policyExt.policyStatus !== 8 || !canEdit"
          :text="policyExt.tciPolicyNo"
          title="交强险保单号"
        />
        <info-item
          v-if="policyExt.policyStatus === 8 && canEdit"
          :text="policyExt.tciPolicyNo"
          :show-text="false"
          title="交强险保单号"
        >
          <el-input v-model="policyExt.tciPolicyNo" size="mini" style="width: 100%;"/>
        </info-item>
        <info-item :text="policyExt.tciProposalNo" title="交强险投保单号"/>
        <info-item :text="formatTime(policyExt.insureTime) " title="交强险核保时间"/>
      </div>
      <div class="item-wrap">
        <info-item :text="policyExt.tciPremium" title="交强险保费(元)"/>
        <info-item :text="handleDiscount(policyExt.tciDiscount)" title="交强险折扣系数"/>
        <info-item :text="formatOccurrence(policyExt.tciLossOccurredCount)" title="交强险出险次数"/>
      </div>
      <div class="item-wrap">
        <info-item :text="policyExt.tciStartDate" title="交强险保险起期"/>
        <info-item :text="policyExt.tciEndDate" title="交强险保险止期"/>
        <info-item :show-text="false"/>
      </div>
      <div class="divider m-tb"/>
    </template>

    <template v-if="policyExt.policyTypeName !== '单交强'">
      <div class="item-wrap">
        <info-item
          v-if="policyExt.policyStatus !== 8 || !canEdit"
          :text="policyExt.vciPolicyNo"
          title="商业险保单号"
        />
        <info-item
          v-if="policyExt.policyStatus === 8 && canEdit"
          :text="policyExt.vciPolicyNo"
          :show-text="false"
          title="商业险保单号"
        >
          <el-input v-model="policyExt.vciPolicyNo" size="mini" style="width: 100%;"/>
        </info-item>
        <info-item :text="policyExt.vciProposalNo" title="商业险投保单号"/>
        <info-item :text="formatTime(policyExt.insureTime)" title="商业险核保时间"/>
      </div>
      <div class="item-wrap">
        <info-item :text="policyExt.vciPremium" title="商业险保费(元)"/>
        <info-item :text="handleDiscount(policyExt.vciDiscount)" title="商业险折扣系数"/>
        <info-item :text="formatOccurrence(policyExt.vciLossOccurredCount)" title="商业险出险次数"/>
      </div>
      <div class="item-wrap">
        <info-item :text="policyExt.vciStartDate" title="商业险保险起期"/>
        <info-item :text="policyExt.vciEndDate" title="商业险保险止期"/>
        <info-item :show-text="false"/>
      </div>
      <div class="divider m-tb"/>
    </template>

    <info-item :text="policyAcquisitionMethod" title="保单获取方式"/>
    <div id="carinfo" class="item-header m-b mt-25">车辆信息</div>
    <div class="item-wrap">
      <info-item :text="vehicleExt.newOrOldCar" title="车辆年限"/>
      <info-item :text="vehicleExt.licenseNo" title="车牌号"/>
      <info-item :text="vehicleExt.frameNo" title="车架号"/>
    </div>
    <div class="item-wrap">
      <info-item :text="vehicleExt.brandName" title="品牌型号"/>
      <info-item :text="vehicleExt.engineNo" title="发动机号"/>
      <info-item v-if="isDatongChannel" :text="vehicleExt.vehicleNature" title="车辆性质"/>
      <info-item v-else :show-text="false"/>
    </div>
    <div class="item-wrap">
      <info-item :text="`${vehicleExt.vehicle_type} | ${vehicleExt.vehicleType}`" title="交管车辆类型"/>
      <info-item :text="vehicleExt.vehicleType_" title="车辆种类"/>
      <!--TODO: 车辆种类细分后台没返回，暂时和车辆种类用同一个字段-->
      <info-item :text="vehicleExt.vehicleCategory" title="车辆种类细分"/>
    </div>
    <div class="item-wrap">
      <info-item :text="vehicleExt.modelCode" title="车型编码"/>
      <info-item :text="vehicleExt.useNature" title="使用性质"/>
      <info-item :text="vehicleExt.attachNature" title="使用性质细分"/>
    </div>
    <div class="item-wrap">
      <info-item :text="vehicleExt.enrollDate" title="初登日期"/>
      <info-item :text="vehicleExt.purchasePrice" title="新车购置价(元)"/>
      <info-item :text="vehicleExt.seatCount" title="核定座位数(座)"/>
    </div>
    <div class="item-wrap">
      <info-item :text="vehicleExt.energyType" title="能源类型"/>
      <info-item :text="vehicleExt.plateColor" title="号牌底色"/>
      <info-item :text="vehicleExt.plateType" title="号牌种类"/>
    </div>
    <div class="item-wrap">
      <info-item :text="vehicleExt.curbWeight" title="整备质量(吨)"/>
      <info-item :text="vehicleExt.tonnage" title="核定载重量(吨)"/>
      <info-item :text="vehicleExt.displacement" title="排量/功率(L/KW)"/>
    </div>
    <div class="item-wrap">
      <info-item :text="vehicleExt.transfer" title="车辆过户"/>
      <info-item v-if="vehicleExt.transferDate" :text="vehicleExt.transferDate" title="过户日期"/>
      <info-item :show-text="false"/>
    </div>

    <div id="personinfo" class="item-header m-b mt-25">关系人信息</div>
    <div class="inner-header mt-25 m-b">
      <div class="title">车主信息</div>
    </div>
    <div class="item-wrap">
      <info-item :text="applicantExt.ownerName" title="客户姓名"/>
      <info-item :text="applicantExt.ownerIdType" title="证件类型"/>
      <info-item :text="applicantExt.ownerIdNo" title="证件号码"/>
    </div>
    <div class="item-wrap">
      <info-item :text="applicantExt.ownerPhone" title="手机号"/>
      <info-item :text="applicantExt.ownerEmail" title="联系邮箱"/>
      <info-item :text="applicantExt.ownerAddr" title="联系地址"/>
    </div>
    <div class="inner-header mt-25 m-b">
      <div class="title">被保人信息</div>
      <el-radio-group v-if="applicantExt.ownerCheck" :value="1" size="medium">
        <el-radio :label="1" size="medium">与车主一致</el-radio>
      </el-radio-group>
    </div>
    <template v-if="!applicantExt.ownerCheck">
      <div class="item-wrap">
        <info-item :text="applicantExt.insuredName" title="客户姓名"/>
        <info-item :text="applicantExt.insuredIdType" title="证件类型"/>
        <info-item :text="applicantExt.insuredIdNo" title="证件号码"/>
      </div>
      <div class="item-wrap">
        <info-item :text="applicantExt.insuredPhone" title="手机号"/>
        <info-item title="联系邮箱"/>
        <info-item :text="applicantExt.insuredAddr" title="联系地址"/>
      </div>
    </template>

    <div class="inner-header mt-25 m-b">
      <div class="title">投保人信息</div>
      <el-radio-group
        v-if="applicantExt.insuredCheck || applicantExt.holderCheck"
        :value="1"
        size="medium"
      >
        <el-radio :label="1" size="medium">{{ applicantExt.insuredCheck ? '与车主一致': '与被保人一致' }}</el-radio>
      </el-radio-group>
    </div>
    <template v-if="!applicantExt.insuredCheck && !applicantExt.holderCheck">
      <div class="item-wrap">
        <info-item :text="applicantExt.holderName" title="客户姓名"/>
        <info-item :text="applicantExt.holderIdType" title="证件类型"/>
        <info-item :text="applicantExt.holderIdNo" title="证件号码"/>
      </div>
      <div class="item-wrap">
        <info-item :text="applicantExt.holderPhone" title="手机号"/>
        <info-item title="联系邮箱"/>
        <info-item :text="applicantExt.holderAddr" title="联系地址"/>
      </div>
    </template>

    <div id="insurancedetails" class="item-header m-b mt-25">险种明细信息</div>
    <template v-if="policyExt.policyTypeName !== '单交强'">
      <template v-if="mainInsureCount > 0">
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
        <div v-for="(item, index) in riskList" :key="index">
          <div v-if="isMainInsure(item)" class="risk-display-item border-t">
            <div class="item1">{{ item.riskName }}</div>
            <div class="item2">{{ getAmount(item) }}</div>
            <div class="item2">{{ getFee(item) }}</div>
            <div class="item3">{{ hasDeductible(item) }}</div>
            <div class="item3">{{ item.deductPremium }}</div>
          </div>
        </div>
      </template>

      <template v-if="extraInsureCount > 0">
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
        <div v-for="item in riskList" :key="item.riskCode">
          <div v-if="!isMainInsure(item)" class="risk-display-item border-t">
            <div class="item1">{{ item.riskName }}</div>
            <div class="item2">{{ getAmount(item) }}</div>
            <div class="item2">{{ getFee(item) }}</div>
            <div class="item3">{{ hasDeductible(item) }}</div>
            <div class="item3">{{ item.deductPremium }}</div>
          </div>
        </div>
      </template>
    </template>
    <div class="item-wrap mt-25 single-box">
      <info-item :text="totalInfo" title="合计"/>
    </div>

    <div v-permission="policyPermission" v-show="!isQueryInsured">
      <div id="policymatch" class="item-header m-b mt-25">政策匹配信息</div>
      <div class="item-wrap">
        <info-item :text="formality.subStrategyName" title="子政策ID"/>
        <info-item :text="formality.subStrategySequence" title="子政策名称"/>
        <info-item :show-text="false"/>
      </div>
    </div>

    <div v-permission="policyPermission" v-show="!isQueryInsured">
      <div id="commission" class="item-header m-b mt-25">手续费&佣金</div>
      <div class="inner-header mt-25">
        <div class="title">上游手续费</div>
      </div>
      <div class="item-wrap">
        <info-item :text="settlementFormatter(upFormality.upFormalityCountType)" :title="upFormality.type === 1 ? '保司结算方式' : '机构结算方式'"/>
        <info-item :text="upFormality.upFormalityRate" title="商业险手续费率"/>
        <info-item :text="upFormality.upFormality" title="商业险手续费(元)"/>
      </div>
      <div class="item-wrap">
        <info-item :text="upFormality.name" :title="upFormality.type === 1 ? '保险公司' : '上游机构'"/>
        <info-item :text="upFormality.jqUpFormalityRate" title="交强险手续费率"/>
        <info-item :text="upFormality.jqUpFormality" title="交强险手续费(元)"/>
      </div>
      <!-- downType (integer, optional): 1:下游机构, 2:下游业务员  -->
      <div class="inner-header mt-25">
        <div class="title">下游佣金</div>
        <el-radio-group :value="0" size="medium">
          <el-radio :label="0" size="medium">{{ upFormality.downType === 2 ? '业务员佣金' : '机构佣金' }}</el-radio>
        </el-radio-group>
      </div>
      <div v-if="upFormality.downType === 2" class="item-wrap">
        <info-item
          :text="settlementFormatter(saleFormality.saleFormalityCountType)"
          title="业务员结算方式"
        />
        <info-item :text="saleFormality.saleFormalityRate" title="商业险手续费率"/>
        <info-item :text="saleFormality.saleFormality" title="商业险手续费(元)"/>
      </div>
      <div v-if="upFormality.downType === 2" class="item-wrap">
        <info-item :text="policyExt.userName" title="业务员"/>
        <info-item :text="saleFormality.jqSaleFormalityRate" title="交强险手续费率"/>
        <info-item :text="saleFormality.jqSaleFormality" title="交强险手续费(元)"/>
      </div>
      <div v-if="upFormality.downType === 1" class="item-wrap">
        <info-item
          :text="settlementFormatter(agencyFormality.agencyFormalityCountType)"
          title="机构结算方式"
        />
        <info-item :text="agencyFormality.agencyFormalityRate" title="商业险手续费率"/>
        <info-item :text="agencyFormality.agencyFormality" title="商业险手续费(元)"/>
      </div>
      <div v-if="upFormality.downType === 1" class="item-wrap">
        <info-item :text="agencyFormality.childrenCompanyName" title="下游机构"/>
        <info-item :text="agencyFormality.jqAgencyFormalityRate" title="交强险手续费率"/>
        <info-item :text="agencyFormality.jqAgencyFormality" title="交强险手续费(元)"/>
      </div>
    </div>

    <div v-show="!isQueryInsured" id="pictureinfo" class="item-header m-b mt-25">图片信息</div>
    <div v-show="!isQueryInsured">
      <div v-if="imageList.length === 0" style="margin: 20px 0;font-size: 14px;color: #909399;">暂无数据</div>
      <!--遍历图片列表-->
      <div v-for="item in imageList" :key="item.name" class="imageinfo" style="margin-top: 20px;">
        <span class="title">{{ item.name }}：</span>
        <div
          v-for="(img, index) in item.images"
          :key="index"
          class="pic"
          @click="showimg(img.files, item.name)"
        >
          <div class="modal">
            <i class="el-icon-zoom-in"/>
          </div>
          <img :src="img.files" alt>
        </div>
      </div>
    </div>

    <template v-if="isBrowsingPolicy || isEditPolicy || isManualRecording">
      <div id="remarks" class="item-header m-b mt-25">备注信息</div>
      <div class="item-wrap">
        <info-item :text="remark.remark" title="备注信息"/>
      </div>
    </template>

    <template v-if="isBrowsingPolicy || isEditPolicy">
      <div id="logger" class="item-header m-b mt-25">操作日志</div>
      <div>
        <div v-if="logs.length === 0" style="margin: 20px 0;font-size: 14px;color: #909399;">暂无数据</div>
        <el-steps :active="1" direction="vertical" style="margin-top: 20px;">
          <el-step
            v-for="(item, index) in logs"
            :key="index"
            :title="item.createTime"
            icon="el-icon-time"
            status="process"
          >
            <div slot="description">{{ item.described }}</div>
          </el-step>
        </el-steps>
      </div>
    </template>
  </div>
</template>
<script>
import InfoItem from '@/views/businessmanagement/policy/components/infoItem'
import company from '@/views/businessmanagement/company.js'
import { synchronize } from '@/api/policy_management'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
// 传入打开类型，1.保单查看，2.保单编辑，3.订单查看，4.订单编辑，5.手动录单
const typeFlag = {
  browsingPolicy: 1,
  editPolicy: 2,
  browsingOrder: 3,
  editOrder: 4,
  manualRecording: 5,
  queryInsured: 6
}
export default {
  components: {
    InfoItem
  },
  props: {
    // 传入打开类型，1.保单查看，2.保单编辑，3.订单查看，4.订单编辑，5.手动录单
    checkType: {
      type: [String, Number],
      default: null
    },
    // 传入保单id
    policyId: {
      type: String,
      default: null
    },
    policyDetail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      policyStatusList: [
        { key: 0, value: '报价失败' },
        { key: 1, value: '报价成功' },
        { key: 2, value: '下发修改' },
        { key: 3, value: '人工审核' },
        { key: 4, value: '核保成功' },
        { key: 5, value: '支付失败' },
        { key: 6, value: '支付成功' },
        { key: 7, value: '承保失败' },
        { key: 8, value: '已承保' },
        { key: 9, value: '已撤单' }
      ],
      settlementMethodList: [
        { key: -1, value: this.isEdit ? '请选择' : '--' },
        { key: 1, value: '按净保费' },
        { key: 2, value: '按全保费' }
      ],
      // 下游佣金类型
      downstreamCommissionType: 0,
      policyStatus: undefined,
      btnLoading: false
    }
  },
  computed: {
    detail() {
      return this.policyDetail || {}
    },
    // 投被保人信息
    applicantExt() {
      return this.detail.applicantExt || {}
    },
    // 政策费率信息
    finance() {
      return this.detail.finance || []
    },
    // 图片
    imageList() {
      return this.detail.imageList || []
    },
    // 保单主体信息
    policyExt() {
      return this.detail.policyExt || {}
    },
    // 险别信息
    riskList() {
      return this.detail.riskList || []
    },
    // 车辆信息
    vehicleExt() {
      return this.detail.vehicleExt || {}
    },
    // 备注信息
    remark() {
      return this.detail.remark || {}
    },
    // 车船税应缴信息
    tax() {
      return this.detail.tax || {}
    },
    // 操作日志
    logs() {
      return this.detail.logs || []
    },
    // 保单获取方式
    receive() {
      return this.detail.receive || {}
    },
    // 上游手续费相关
    upFormality() {
      return this.detail.upFormality || {}
    },
    // 下游机构相关
    agencyFormality() {
      return this.detail.agencyFormality || {}
    },
    // 下游机构业务员相关
    saleFormality() {
      return this.detail.saleFormality || {}
    },
    // 政策信息
    formality() {
      return this.detail.formality || {}
    },
    // 保单信息头部
    policyHead() {
      const policyExt = this.policyExt
      const vehicleExt = this.vehicleExt
      return `( ${vehicleExt.brandName ||
        '--'} ) | 总保费 ${policyExt.totalPremium ||
        '--'} 元：商业险 ${policyExt.vciPremium || '--'} 元，
      交强险 ${policyExt.tciPremium ||
        '--'} 元，车船税 ${policyExt.vehicleTax || '--'} 元`
    },
    // 是否大童渠道
    isDatongChannel() {
      return this.policyExt.sourceCode === '001'
    },
    // 保险公司头像
    companyAvatar() {
      const companyList = company()
      const id = this.policyExt.companyId
      const item = companyList.find(item => item.id === id)
      if (!item) return ''
      const src = require(`@/assets/companyavatar/c_${item.icon}.png`)
      return src
    },
    // 车辆信息相关字典
    carInfoDictionary() {
      return this.carInfoList.data || {}
    },
    // 证件类型
    applicantNatureList() {
      return this.carInfoDictionary.applicantNatureList || []
    },
    // 车辆种类细分
    vehicleCategoryList() {
      return this.carInfoDictionary.vehicleCategoryList || []
    },
    // 号牌底色
    plateColorList() {
      return this.carInfoDictionary.plateColorList || []
    },
    // 交管车辆类型
    vehicleTypeList() {
      return this.carInfoDictionary.vehicleTypeList || []
    },
    // 使用性质
    useNatureList() {
      return this.carInfoDictionary.useNatureList || []
    },
    // 能源类型
    energyTypeList() {
      return this.carInfoDictionary.energyTypeList || []
    },
    // 使用性质细分
    attachNatureList() {
      return this.carInfoDictionary.attachNatureList || []
    },
    // 号牌种类
    plateTypeList() {
      return this.carInfoDictionary.plateTypeList || []
    },
    isBrowsingPolicy() {
      return this.checkType === typeFlag.browsingPolicy
    },
    isEditPolicy() {
      return this.checkType === typeFlag.editPolicy
    },
    isBrowsingOrder() {
      return this.checkType === typeFlag.browsingOrder
    },
    isEditOrder() {
      return this.checkType === typeFlag.editOrder
    },
    isManualRecording() {
      return this.checkType === typeFlag.manualRecording
    },
    isQueryInsured() {
      return this.checkType === typeFlag.queryInsured
    },
    canEdit() {
      return this.checkType === typeFlag.editOrder
    },
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
      const isHasTwo =
        (tax.payableFee && tax.arrearFee) || (tax.payableFee && tax.lateFee)
      if (isHasTwo) return infoList.join('')
      return ''
    },
    taxInfo() {
      const policyExt = this.policyExt
      const taxInfo = policyExt.vehicleTax
        ? `，车船税${policyExt.vehicleTax}元`
        : ''
      return `${taxInfo} ${this.extraInfo}`
    },
    vciInfo() {
      const policyExt = this.policyExt
      return policyExt.vciPremium ? `商业险${policyExt.vciPremium}元` : ''
    },
    tciInfo() {
      const policyExt = this.policyExt
      return policyExt.tciPremium ? `交强险${policyExt.tciPremium}元` : ''
    },
    deductiblePremiumInfo() {
      const policyExt = this.policyExt
      return policyExt.deductiblePremium
        ? ` |  (其中不计免赔险${policyExt.deductiblePremium.toFixed(2)}元), `
        : `, `
    },
    totalInfo() {
      const policyExt = this.policyExt
      return `总保费${policyExt.totalPremium}元 ${this.vciInfo} ${
        this.deductiblePremiumInfo
      }
        ${this.tciInfo} ${this.taxInfo}`
    },
    // 主险个数
    mainInsureCount() {
      return this.riskList.filter(item => {
        return this.isMainInsure(item)
      }).length
    },
    // 附加险个数
    extraInsureCount() {
      return this.riskList.filter(item => {
        return !this.isMainInsure(item)
      }).length
    },
    policyTime: {
      get() {
        return this.policyExt.policyTime || ''
      },
      set(val) {
        this.policyExt.policyTime = val
      }
    },
    syncStatusText() {
      if (this.btnLoading) return '正在同步'
      // 0未同步/1已同步/2同步异常
      switch (this.policyExt.syncStatus) {
        case 0:
          return '立即同步'
        case 1:
          return '已同步'
        case 2:
          return '立即同步'
      }
    },
    ...mapGetters(['isAnyAdminChannel']),
    disabledDate() {
      const tci = new Date(this.policyExt.tciStartDate).getTime() || 0
      const vci = new Date(this.policyExt.vciStartDate).getTime() || 0
      const insureTime = tci > vci ? tci : vci
      // if (insureTime > 0) insureTime = insureTime - 24 * 60 * 60 * 1000
      return {
        disabledDate: time => {
          return time.getTime() > insureTime
        }
      }
    },
    policyAcquisitionMethod() {
      function getReceiveType(n) {
        if (parseInt(n) === 1) {
          return '机构自取'
        }
        if (parseInt(n) === 2) {
          return '快递邮寄'
        }
        if (parseInt(n) === 3) {
          return '电子邮箱'
        }
      }
      if (
        this.receive.receiveAddress ||
        this.receive.receiveName ||
        this.receive.receivePhone
      ) {
        return `${getReceiveType(this.receive.receiveType)} | ${this.receive.receiveName} ${this.receive.receivePhone} ${this.receive.receiveAddress}`
      }
    },
    policyPermission() {
      if (this.isBrowsingPolicy || this.isEditPolicy) {
        return this.permissionList.businessPolicyInfo
      }
      if (this.isEditOrder || this.isBrowsingOrder) {
        return this.permissionList.businessPolicyInfoOrder
      }
    }
  },
  watch: {
    detail() {
      this.policyStatus = this.policyDetail.policyExt.policyStatus
    }
  },
  methods: {
    // 查看详情
    checkDetail() {
      document.querySelector('a[href="#insurancedetails"]').click()
    },
    // 时间格式化
    formatTime(time) {
      if (!time) return ''
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    },
    // 订单状态格式化
    policyStatusFormatter(r) {
      if (r === null || r === undefined || r === '') return '--'
      const val = this.policyStatusList.find(item => Number(item.key) === r)
        .value
      return val
    },
    // 是否主险
    isMainInsure(item) {
      if (item && /^(a0|a1|a2|a3|a4)$/.test(item.riskCode)) return true
      return false
    },
    getAmount(item) {
      switch (item.riskCode) {
        // 乘客险
        case 'a4':
          if (item.quantity && item.unitAmount) {
            return `${item.unitAmount} x ${item.quantity}`
          }
          break
        case 'a3':
          if (item.unitAmount) {
            return `${item.unitAmount}`
          }
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
    hasDeductible(item) {
      if (item.isDeductible && parseInt(item.isDeductible) === 1) return '是'
      return ''
    },
    isAssign(obj) {
      return obj !== null && obj !== undefined && obj !== ''
    },
    // 上游保司手续费格式化
    settlementFormatter(count) {
      const settlementMethodList = this.settlementMethodList
      const type =
        settlementMethodList.find(item => item.key === Number(count)) || {}
      return type.value || '--'
    },
    // 图片预览
    showimg(url, title) {
      this.$imageview.show({
        title,
        url
      })
    },
    // 获取订单状态list
    getPolicyStatusList(status) {
      const policyStatusList = this.policyStatusList
      const left = [status, 4, 8]
      const right = [status, 8]
      let result = []
      // 处理撤单
      if (status === 9) {
        result = policyStatusList.find(item => item.key === 9)
        return result
      }
      if (status < 4) {
        result = policyStatusList.filter(item => left.some(c => item.key === c))
      } else {
        result = policyStatusList.filter(item =>
          right.some(c => item.key === c)
        )
      }
      return result
    },
    // 格式化出险次数
    formatOccurrence(occurrence) {
      if (
        occurrence === null ||
        occurrence === undefined ||
        occurrence === ''
      ) {
        return '--'
      }
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
    formatNature(code) {
      switch (code) {
        case '0000400002':
          return '家用车常规'
        case '0000400003':
          return '家用车其他'
        case '0000400004':
          return '货车'
        case '0000400005':
          return '团车'
        case '0000400006':
          return '公户车'
      }
    },
    // 立即同步
    synchronize() {
      this.btnLoading = true
      synchronize(this.policyDetail.policyExt.id)
        .then(res => {
          this.btnLoading = false
          this.policyExt.syncStatus = 1
          console.log(res)
        })
        .catch(err => {
          this.btnLoading = false
          this.policyExt.syncStatus = 2
          console.warn(err)
          this.showAlertMsg('同步异常', 'error')
        })
    },
    handleDiscount(val) {
      if (Number(val) === 0) return '--'
      return val
    }
  }
}
</script>

<style lang="scss">
.infoDisplay {
  .policyheader {
    width: 100%;
    height: 50px;
    margin: 10px 0;
    position: relative;
    font-size: 14px;
    img {
      width: 50px;
      height: 50px;
      margin-right: 10px;
      position: absolute;
      left: 0;
      top: 0;
      border-radius: 50%;
      z-index: 10;
    }
    .policyheadinfo {
      width: calc(100% - 50px);
      height: 50px;
      background-color: #f2f2f2;
      position: absolute;
      left: 50px;
      top: 0;
      line-height: 50px;
      padding: 0 10px 0 30px;
      z-index: 1;
    }
    .policyheadermodal {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #ffffff;
      position: absolute;
      left: 15px;
      top: 0;
      z-index: 2;
    }
  }
  .item-wrap {
    display: flex;
  }
  .single-box {
    border: 1px solid #e4e4e4;
    padding: 15px 0;
  }
  .imageinfo {
    display: flex;
    align-items: flex-start;
    flex-flow: row wrap;
    font-size: 14px;
    .title {
      padding: 0 6px;
      width: 140px;
      border-left: 5px solid rgb(64, 158, 255);
    }
    .pic {
      width: 120px;
      height: 120px;
      margin: 0 10px;
      display: flex;
      overflow: hidden;
      border-radius: 7px;
      position: relative;
      cursor: pointer;
      margin-bottom: 10px;
      img {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 1;
        object-fit: cover;
      }
      .modal {
        position: absolute;
        display: none;
        width: 100%;
        height: 100%;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.3);
        z-index: 10;
        i {
          margin-top: 40%;
          font-size: 22px;
          color: #ffffff;
        }
      }
      &:hover {
        .modal {
          display: block;
        }
      }
    }
  }
}
</style>
