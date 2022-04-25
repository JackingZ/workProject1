<template>
  <div class="wrap-content infoDisplay">
    <!--<div id="policyinfo" class="policyheader">-->
    <!--<img :src="companyAvatar" alt="">-->
    <!--<div class="policyheadermodal" />-->
    <!--<div class="policyheadinfo">-->
    <!--<span style="font-weight: 600;">{{ vehicleExt.licenseNo | filternulls }}</span>-->
    <!--<span>{{ policyHead }}</span>-->
    <!--<span style="color: #409EFF;cursor: pointer;margin-left: 10px;" @click="checkDetail">查看详情 ></span>-->
    <!--<span style="position: absolute;right: 10px;">投保地区：{{ policyExt.areaName | filternulls }}</span>-->
    <!--</div>-->
    <!--</div>-->
    <div id="policyinfo" class="item-header m-b mt-25">保单信息</div>

    <div class="item-wrap">
      <info-item :text="policyExt.sourceCodeName" title="所属渠道"/>
      <info-item :text="policyExt.companyName" title="保险公司"/>
      <info-item :text="policyExt.channelIdName" title="出单工号"/>
    </div>
    <div class="item-wrap">
      <info-item :text="policyExt.organizationName" title="所属机构"/>
      <!--<info-item :show-text="false" title="所属机构" style="width: 100%;align-items: center;">-->
      <!--<el-tree-select-->
      <!--v-model="policyExt.organizationId"-->
      <!--:data="policyDetail.belongCompanyList"-->
      <!--:default-expand-all="false"-->
      <!--disabled-->
      <!--clearable-->
      <!--filterable-->
      <!--size="mini"-->
      <!--placeholder="请选择"-->
      <!--@change="onBelongCompanyChange"-->
      <!--/>-->
      <!--</info-item>-->
      <info-item :show-text="false" title="业务员">
        <el-select
          v-model="policyExt.userId"
          :disabled="policyExt.switchUser"
          clearable
          filterable
          placeholder="请选择"
          size="mini"
        >
          <el-option
            v-for="item in policyDetail.policySalesmanList"
            :key="item.id"
            :label="item.idName"
            :value="item.id"
          />
        </el-select>
      </info-item>
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
      <info-item
        v-if="policyExt.policyStatus === 8 && canEdit"
        :text="formatTime(policyExt.policyTime)"
        :show-text="false"
        title="签单时间"
      >
        <el-date-picker
          v-model="policyExt.policyTime"
          :clearable="false"
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
    <!--<div class="item-wrap">-->
    <!--<info-item :text="policyExt.sourceCode" title="同步状态"/>-->
    <!--<info-item :show-text="false"/>-->
    <!--<info-item :show-text="false"/>-->
    <!--</div>-->
    <div class="divider m-tb"/>

    <template v-if="policyExt.policyTypeName !== '单商业'">
      <div class="item-wrap">
        <!--<info-item :show-text="false" title="交强险保单号">-->
        <!--<el-input v-model="policyExt.tciPolicyNo" size="mini" placeholder="请输入"/>-->
        <!--</info-item>-->
        <info-item :text="policyExt.tciPolicyNo" title="交强险保单号"/>
        <info-item :text="policyExt.tciProposalNo" title="交强险投保单号"/>
        <info-item :text="formatTime(policyExt.insureTime) " title="交强险核保时间"/>
      </div>
      <div class="item-wrap">
        <info-item :text="policyExt.tciPremium" title="交强险保费(元)"/>
        <info-item :text="policyExt.tciDiscount" title="交强险折扣系数"/>
        <info-item :text="formatOccurrence(policyExt.tciLossOccurredCount)" title="交强险出险次数"/>
      </div>
      <div class="item-wrap">
        <info-item :text="policyExt.tciStartDate" title="交强险保险起期"/>
        <info-item :text="policyExt.tciEndDate" title="交强险保险止期"/>
        <info-item :text="policyExt.vehicleTax" title="车船税(元)"/>
      </div>
      <div class="divider m-tb"/>
    </template>

    <template v-if="policyExt.policyTypeName !== '单交强'">
      <div class="item-wrap">
        <!--<info-item-->
        <!--:text="policyExt.vciPolicyNo"-->
        <!--:show-text="false"-->
        <!--title="商业险保单号">-->
        <!--<el-input v-model="policyExt.vciPolicyNo" size="mini" style="width: 100%;"/>-->
        <!--</info-item>-->
        <info-item :text="policyExt.vciPolicyNo" title="商业险保单号"/>
        <info-item :text="policyExt.vciProposalNo" title="商业险投保单号"/>
        <info-item :text="formatTime(policyExt.insureTime)" title="商业险核保时间"/>
      </div>
      <div class="item-wrap">
        <info-item :text="policyExt.vciPremium" title="商业险保费(元)"/>
        <info-item :text="policyExt.vciDiscount" title="商业险折扣系数"/>
        <info-item :text="formatOccurrence(policyExt.vciLossOccurredCount)" title="商业险出险次数"/>
      </div>
      <div class="item-wrap">
        <info-item :text="policyExt.vciStartDate" title="商业险保险起期"/>
        <info-item :text="policyExt.vciEndDate" title="商业险保险止期"/>
        <info-item :show-text="false"/>
      </div>
      <div class="divider m-tb"/>
    </template>

    <div class="item-wrap">
      <info-item :text="policyExt.receiveName" title="收件人"/>
      <info-item :text="policyExt.receivePhone" title="收件人手机"/>
      <info-item :text="policyExt.receiveAddress" title="邮寄地址"/>
    </div>

    <div id="carinfo" class="item-header m-b mt-25">车辆信息</div>
    <div class="item-wrap">
      <info-item :text="vehicleExt.newOrOldCar" title="车辆年限"/>
      <info-item :text="vehicleExt.licenseNo" title="车牌号"/>
      <info-item :text="vehicleExt.frameNo" title="车架号"/>
    </div>
    <div class="item-wrap">
      <info-item :text="vehicleExt.brandName" title="品牌型号"/>
      <info-item :text="vehicleExt.engineNo" title="发动机号"/>
      <info-item :text="vehicleExt.vehicleNature" title="车辆性质"/>
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
    <!--<div class="item-wrap mt-25 single-box">-->
    <!--<info-item :text="totalInfo" title="合计"/>-->
    <!--</div>-->

    <!--<div id="policymatch" class="item-header m-b mt-25">政策匹配信息</div>-->
    <!--<div class="item-wrap">-->
    <!--<info-item :text="formality.subStrategyName" title="子政策ID"/>-->
    <!--<info-item :text="formality.subStrategySequence" title="子政策名称"/>-->
    <!--<info-item :show-text="false"/>-->
    <!--</div>-->

    <div v-permission="permissionList.businessPolicyInfo">
      <div id="commission" class="item-header m-b mt-25">手续费&佣金</div>

      <template v-if="isSubAdminChannel">
        <div class="inner-header mt-25">
          <div class="title">上游手续费</div>
        </div>
        <div class="item-wrap">
          <info-item
            :text="settlementFormatter(upFormality.upFormalityCountType)"
            :title="upFormality.type === 1 ? '保司结算方式' : '机构结算方式'"
          />
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
      </template>

      <template v-if="!isSubAdminChannel">
        <div class="inner-header mt-25">
          <div class="title">上游手续费</div>
        </div>
        <div class="item-wrap">
          <info-item :show-text="false" :title="upformalityFormatter() + '结算方式'">
            <el-select
              v-model="upFormality.upFormalityCountType"
              :disabled="!isUpSettlementEdit"
              size="mini"
              placeholder="请选择"
              @change="upCalculateCommission"
            >
              <el-option
                v-for="item in settlementMethodList"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </info-item>
          <info-item :show-text="false" title="商业险手续费率">
            <el-input
              v-model="upFormality.upFormalityRate"
              :disabled="!isUpSettlementEdit"
              type="number"
              size="mini"
              placeholder="请输入"
              @change="upCalculateCommission"
            >
              <template slot="append">%</template>
            </el-input>
          </info-item>
          <info-item :show-text="false" title="商业险手续费(元)">
            <el-input v-model="upFormality.upFormality" disabled size="small" placeholder="请输入"/>
          </info-item>
        </div>
        <div class="item-wrap">
          <info-item :text="upFormality.name" :title="upformalityFormatter()"/>
          <info-item :show-text="false" title="交强险手续费率">
            <el-input
              v-model="upFormality.jqUpFormalityRate"
              :disabled="!isUpSettlementEdit"
              type="number"
              size="mini"
              placeholder="请输入"
              @change="upCalculateCommission"
            >
              <template slot="append">%</template>
            </el-input>
          </info-item>
          <info-item :show-text="false" title="交强险手续费(元)">
            <el-input v-model="upFormality.jqUpFormality" disabled size="mini" placeholder="请输入"/>
          </info-item>
        </div>
        <!-- downType (integer, optional): 1:下游机构, 2:下游业务员  -->
        <div class="inner-header mt-25">
          <div class="title">下游佣金</div>
          <el-radio-group :value="0" size="medium">
            <el-radio :label="0" size="medium">{{ upFormality.downType === 2 ? '业务员佣金' : '机构佣金' }}</el-radio>
          </el-radio-group>
        </div>
        <div v-if="upFormality.downType === 2" class="item-wrap">
          <info-item :show-text="false" title="业务员结算方式">
            <el-select
              v-model="saleFormality.saleFormalityCountType"
              :disabled="!isSaleSettlementEdit"
              style="width: 100%;"
              size="mini"
              placeholder="请选择"
              @change="downSaleCalculateCommission"
            >
              <el-option
                v-for="item in settlementMethodList"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </info-item>
          <info-item :show-text="false" title="商业险手续费率">
            <el-input
              v-model="saleFormality.saleFormalityRate"
              :disabled="!isSaleSettlementEdit"
              type="number"
              size="mini"
              placeholder="请输入"
              @change="downSaleCalculateCommission"
            >
              <template slot="append">%</template>
            </el-input>
          </info-item>
          <info-item :show-text="false" title="商业险佣金(元)">
            <el-input
              v-model="saleFormality.saleFormality"
              disabled
              size="small"
              placeholder="请输入"
            />
          </info-item>
        </div>
        <div v-if="upFormality.downType === 2" class="item-wrap">
          <info-item :text="policyExt.userName" title="业务员"/>
          <info-item :show-text="false" title="交强险佣金率">
            <el-input
              v-model="saleFormality.jqSaleFormalityRate"
              :disabled="!isSaleSettlementEdit"
              type="number"
              size="mini"
              placeholder="请输入"
              @change="downSaleCalculateCommission"
            >
              <template slot="append">%</template>
            </el-input>
          </info-item>
          <info-item :show-text="false" title="交强险佣金(元)">
            <el-input
              v-model="saleFormality.jqSaleFormality"
              disabled
              size="mini"
              placeholder="请输入"
            />
          </info-item>
        </div>
        <div v-if="upFormality.downType === 1" class="item-wrap">
          <info-item :show-text="false" title="机构结算方式">
            <el-select
              v-model="agencyFormality.agencyFormalityCountType"
              :disabled="!isAgencySettlementEdit"
              style="width: 100%;"
              size="mini"
              placeholder="请选择"
              @change="downOrgCalculateCommission"
            >
              <el-option
                v-for="item in settlementMethodList"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </info-item>
          <info-item :show-text="false" title="商业险佣金率">
            <el-input
              v-model="agencyFormality.agencyFormalityRate"
              :disabled="!isAgencySettlementEdit"
              type="number"
              size="mini"
              placeholder="请输入"
              @change="downOrgCalculateCommission"
            >
              <template slot="append">%</template>
            </el-input>
          </info-item>
          <info-item :show-text="false" title="商业险佣金(元)">
            <el-input
              v-model="agencyFormality.agencyFormality"
              disabled
              size="small"
              placeholder="请输入"
            />
          </info-item>
        </div>
        <div v-if="upFormality.downType === 1" class="item-wrap">
          <info-item :text="agencyFormality.childrenCompanyName" title="下游机构"/>
          <info-item :show-text="false" title="交强险佣金率">
            <el-input
              v-model="agencyFormality.jqAgencyFormalityRate"
              :disabled="!isAgencySettlementEdit"
              type="number"
              size="mini"
              placeholder="请输入"
              @change="downOrgCalculateCommission"
            >
              <template slot="append">%</template>
            </el-input>
          </info-item>
          <info-item :show-text="false" title="交强险佣金(元)">
            <el-input
              v-model="agencyFormality.jqAgencyFormality"
              disabled
              size="mini"
              placeholder="请输入"
            />
          </info-item>
        </div>
      </template>
    </div>

    <div id="pictureinfo" class="item-header m-b mt-25">图片信息</div>
    <div>
      <div v-if="imageList.length === 0" style="margin: 20px 0;font-size: 14px;color: #909399;">暂无数据</div>
      <!--遍历图片列表-->
      <div v-for="item in imageList" :key="item.name" class="imageinfo" style="margin-top: 20px;">
        <span class="title">{{ item.name }}：</span>
        <div v-for="(img, index) in item.images" :key="index" class="pic" @click="showimg(img.files, item.name)">
          <div class="modal">
            <i class="el-icon-zoom-in"/>
          </div>
          <img :src="img.files" alt="">
        </div>
      </div>
    </div>

    <template v-if="isBrowsingPolicy || isEditPolicy || isManualRecording">
      <div id="remarks" class="item-header m-b mt-25">备注信息</div>
      <div class="item-wrap">
        <info-item :show-text="false" title="备注信息">
          <el-input v-model="remark.remark" size="mini" placeholder="请输入"/>
        </info-item>
      </div>
    </template>

    <!--<template v-if="isBrowsingPolicy || isEditPolicy">-->
    <!--<div id="logger" class="item-header m-b mt-25">操作日志</div>-->
    <!--<div>-->
    <!--<div v-if="logs.length === 0" style="margin: 20px 0;font-size: 14px;color: #909399;">暂无数据</div>-->
    <!--<el-steps :active="1" direction="vertical" style="margin-top: 20px;">-->
    <!--<el-step-->
    <!--v-for="(item, index) in logs"-->
    <!--:key="index"-->
    <!--:title="item.createTime"-->
    <!--icon="el-icon-time"-->
    <!--status="process">-->
    <!--<div slot="description">{{ item.described }}</div>-->
    <!--</el-step>-->
    <!--</el-steps>-->
    <!--</div>-->
    <!--</template>-->
  </div>
</template>
<script>
import InfoItem from '@/views/businessmanagement/policy/components/infoItem'
import company from '@/views/businessmanagement/company.js'
import dayjs from 'dayjs'
import { formmixin } from '@/views/businessmanagement/formmixin.js'
import ElTreeSelect from '@/components/ElTreeSelect/index'
import { mapGetters } from 'vuex'
// 传入打开类型，1.保单查看，2.保单编辑，3.订单查看，4.订单编辑，5.手动录单
const typeFlag = {
  browsingPolicy: 1,
  editPolicy: 2,
  browsingOrder: 3,
  editOrder: 4,
  manualRecording: 5
}
export default {
  components: {
    InfoItem,
    ElTreeSelect
  },
  mixins: [formmixin],
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
        { key: -1, value: '请选择' },
        { key: 1, value: '按净保费' },
        { key: 2, value: '按全保费' }
      ],
      // 下游佣金类型
      downstreamCommissionType: 0,
      policyStatus: undefined
    }
  },
  computed: {
    ...mapGetters(['isSubAdminChannel']),
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
      const channel = JSON.parse(localStorage.getItem('userAll')).data
        .channelCode
      return channel === '001'
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
    isUpSettlementEdit() {
      // 上游手续费是否可编辑，状态不为1都不可编辑
      return this.upFormality.upSettlementStatus === 1
    },
    isAgencySettlementEdit() {
      // 下游机构是否可编辑，状态不为1都不可编辑
      return this.agencyFormality.agencySettlementStatus === 1
    },
    isSaleSettlementEdit() {
      // 下游业务员是否可编辑，状态不为1都不可编辑
      return this.saleFormality.saleSettlementStatus === 1
    }
  },
  watch: {
    detail() {
      this.policyStatus = this.policyDetail.policyExt.policyStatus
    }
  },
  created() {
    console.log('isSubAdminChannel', this.isSubAdminChannel)
  },
  methods: {
    // 下游机构自动计算手续费
    downOrgCalculateCommission() {
      const a = this.agencyFormality.agencyFormalityCountType // 机构结算方式
      const b = this.agencyFormality.agencyFormalityRate // 商业险手续费率
      // const c = this.agencyFormality.childrenCompanyName // 商业险手续费
      const d = this.agencyFormality.jqAgencyFormalityRate // 交强险手续费率
      // const e = this.saleFormality.jqSaleFormality // 交强险手续费
      const f = this.policyExt.vciPremium // 商业险保费
      const g = this.policyExt.tciPremium // 交强险保费

      // 下游商业险手续费计算
      if (a > 0 && b) {
        if (a === 1) {
          this.agencyFormality.agencyFormality = (
            ((f / 1.06) * b) /
            100
          ).toFixed(2)
        }
        if (a === 2) {
          this.agencyFormality.agencyFormality = ((f * b) / 100).toFixed(2)
        }
      } else {
        this.agencyFormality.agencyFormality = 0
      }

      // 交强险手续费计算
      if (a > 0 && d) {
        if (a === 1) {
          this.agencyFormality.jqAgencyFormality = (
            ((g / 1.06) * d) /
            100
          ).toFixed(2)
        }
        if (a === 2) {
          this.agencyFormality.jqAgencyFormality = ((g * d) / 100).toFixed(2)
        }
      } else {
        this.agencyFormality.jqAgencyFormality = 0
      }
    },
    // 下游业务员自动计算手续费
    downSaleCalculateCommission() {
      console.log('asdf0-0-0-0-0-00-0-0')
      const a = this.saleFormality.saleFormalityCountType // 业务员结算方式
      const b = this.saleFormality.saleFormalityRate // 商业险手续费率
      // const c = this.saleFormality.saleFormality // 商业险手续费
      const d = this.saleFormality.jqSaleFormalityRate // 交强险手续费率
      // const e = this.saleFormality.jqSaleFormality // 交强险手续费
      const f = this.policyExt.vciPremium // 商业险保费
      const g = this.policyExt.tciPremium // 交强险保费

      // 下游商业险手续费计算
      if (a > 0 && b) {
        if (a === 1) {
          this.saleFormality.saleFormality = (((f / 1.06) * b) / 100).toFixed(2)
        }
        if (a === 2) {
          this.saleFormality.saleFormality = ((f * b) / 100).toFixed(2)
        }
      } else {
        this.saleFormality.saleFormality = 0
      }

      // 交强险手续费计算
      if (a > 0 && d) {
        if (a === 1) {
          this.saleFormality.jqSaleFormality = (((g / 1.06) * d) / 100).toFixed(
            2
          )
        }
        if (a === 2) {
          this.saleFormality.jqSaleFormality = ((g * d) / 100).toFixed(2)
        }
      } else {
        this.saleFormality.jqSaleFormality = 0
      }
    },
    // 上游自动计算手续费
    upCalculateCommission() {
      const a = this.upFormality.upFormalityCountType // 上游结算方式
      const b = this.upFormality.upFormalityRate // 商业险手续费率
      // const c = this.upFormality.upFormality // 商业险手续费
      const d = this.upFormality.jqUpFormalityRate // 交强险手续费率
      // const e = this.upFormality.jqUpFormality // 交强险手续费
      const f = this.policyExt.vciPremium // 商业险保费
      const g = this.policyExt.tciPremium // 交强险保费

      // 上游商业险手续费计算
      if (a > 0 && b) {
        if (a === 1) {
          this.upFormality.upFormality = (((f / 1.06) * b) / 100).toFixed(2)
        }
        if (a === 2) {
          this.upFormality.upFormality = ((f * b) / 100).toFixed(2)
        }
      } else {
        this.upFormality.upFormality = 0
      }

      // 交强险手续费计算
      if (a > 0 && d) {
        if (a === 1) {
          this.upFormality.jqUpFormality = (((g / 1.06) * d) / 100).toFixed(2)
        }
        if (a === 2) {
          this.upFormality.jqUpFormality = ((g * d) / 100).toFixed(2)
        }
      } else {
        this.upFormality.jqUpFormality = 0
      }
    },
    // 判断上游机构/保险公司
    upformalityFormatter() {
      if (this.upFormality.type === 1) {
        return '保司'
      }
      if (this.upFormality.type === 2) {
        return '机构'
      }
    },
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
      return type.key === -1 ? '--' : type.value || '--'
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
