<template>
  <div class="app-panel checkandeditpolicy">

    <scrollactive
      :offset="84"
      :scroll-offset="82"
      class="menu"
      active-class="a_active"
      scroll-container-selector=".policywrap">
      <a href="#policyinfo" class="scrollactive-item">保单信息</a>
      <a href="#carinfo" class="scrollactive-item">车辆信息</a>
      <a href="#personinfo" class="scrollactive-item">关系人信息</a>
      <a href="#insurancedetails" class="scrollactive-item">险种明细</a>
      <a href="#policymatch" class="scrollactive-item">政策匹配信息</a>
      <a href="#commission" class="scrollactive-item">手续费&佣金</a>
      <a href="#pictureinfo" class="scrollactive-item">图片信息</a>
      <a href="#remarks" class="scrollactive-item">备注信息</a>
      <a href="#logger" class="scrollactive-item">操作日志</a>
    </scrollactive>

    <div class="policywrap">

      <app-root-form ref="policyForm" :rules="rules">
        <div class="policyitem">
          <!--保单信息-->
          <div id="policyinfo" style="padding-top: 10px;">
            <div class="policyheader">
              <img :src="companyAvatar" alt="">
              <div class="policyheadermodal" />
              <div class="policyheadinfo">
                <span style="font-weight: 800;">{{ vehicleExt.licenseNo | filternulls }}</span>
                <span>{{ policyHead }}</span>
                <span style="color: #409EFF;cursor: pointer;margin-left: 10px;" @click="checkDetail">查看详情 ></span>
                <span style="position: absolute;right: 10px;">投保地区：{{ policyExt.areaName | filternulls }}</span>
              </div>
            </div>
            <app-form-group style="margin-top: 20px;">
              <app-form-item :span="2" label="保险公司" background/>
              <app-form-item :span="6" :label="policyExt.companyName"/>
              <app-form-item :span="2" label="出单工号(渠道)：" background/>
              <app-form-item :span="6" :label="policyExt.channelIdName"/>
              <app-form-item :span="2" label="被保人：" background/>
              <app-form-item :span="6" :label="applicantExt.insuredName "/>
            </app-form-group>
            <app-form-group>
              <app-form-item :span="2" label="出单机构：" background/>

              <app-form-item v-if="!isEdit" :span="6" :label="policyExt.organizationName"/>
              <app-form-item v-if="isEdit" :span="6" label="@" no-padding>
                <root-tree-select v-model="policyExt.organizationId" :data="policyDetail.belongCompanyList" :props="treeProps" node-key="value" clearable prop="organizationId" size="mini" placeholder="请输入" @change="onBelongCompanyChange" />
              </app-form-item>

              <app-form-item :span="2" label="业务员：" background/>

              <app-form-item v-if="!isEdit" :span="6" :label="policyExt.userName"/>
              <app-form-item v-if="isEdit" :span="6" no-padding label="@">
                <my-select v-model="policyExt.userName" prop="userName" size="mini" style="width: 100%;">
                  <el-option
                    v-for="item in policyExt.salesman"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </my-select>
              </app-form-item>

              <app-form-item :span="2" label="出单员：" background/>
              <app-form-item :span="6" :label="policyExt.operatorIdName"/>
            </app-form-group>
            <app-form-group>
              <app-form-item :span="2" label="保单种类：" background/>
              <app-form-item :span="6" :label="policyExt.policyTypeName"/>
              <app-form-item :span="2" label="业务类型：" background/>
              <app-form-item :span="6" :label="policyExt.businessTypeName"/>
              <app-form-item :span="2" label="录入来源：" background/>
              <app-form-item :span="6" :label="policyExt.policyFrom"/>
            </app-form-group>
            <app-form-group>
              <app-form-item :span="2" label="订单状态：" background/>
              <app-form-item :span="6" :formatter="policyStatusFormatter" :label="policyExt.policyStatus"/>
              <app-form-item :span="2" label="签单时间：" background/>
              <app-form-item :span="6" :label="formatTime(policyExt.policyTime)"/>
              <app-form-item :span="2" label="录入时间：" background/>
              <app-form-item :span="6" :label="formatTime(policyExt.inputTime)"/>
            </app-form-group>
            <app-form-group>
              <app-form-item :span="2" label="同步状态：" background/>
              <app-form-item v-if="isDatongChannel" :span="22" label="@">
                <el-button
                  :type="btnType"
                  :disabled="btnType === 'info'"
                  :loading="btnLoading"
                  size="mini"
                  icon="el-icon-refresh"
                  round
                  @click="synchronize">立即同步</el-button>
              </app-form-item>
              <app-form-item v-if="!isDatongChannel" :span="22" label=""/>
            </app-form-group>
            <app-form-group>
              <app-form-item :span="2" label="商业险保单号：" background/>
              <app-form-item :span="6" :label="policyExt.vciPolicyNo"/>
              <app-form-item :span="2" label="商业险投保单号：" background/>
              <app-form-item :span="6" :label="policyExt.vciProposalNo"/>
              <app-form-item :span="2" label="核保时间：" background/>
              <app-form-item :span="6" :label="formatTime(policyExt.insureTime)"/>
            </app-form-group>
            <app-form-group>
              <app-form-item :span="2" label="商业险保费(元)：" background/>
              <app-form-item :span="6" :label="policyExt.vciPremium"/>
              <app-form-item :span="2" label="商业险折扣系数：" background/>
              <app-form-item :span="6" :label="policyExt.vciDiscount"/>
              <app-form-item :span="2" label="商业险出险次数：" background/>
              <app-form-item :span="6" :label="policyExt.vciLossOccurredCount"/>
            </app-form-group>
            <app-form-group>
              <app-form-item :span="2" label="起保时间：" background/>
              <app-form-item :span="6" :label="policyExt.vciStartDate"/>
              <app-form-item :span="2" label="终保时间：" background/>
              <app-form-item :span="6" :label="policyExt.vciEndDate "/>
              <app-form-item :span="2" label="@" background/>
              <app-form-item :span="6" label="@"/>
            </app-form-group>
            <app-form-group>
              <app-form-item :span="2" label="交强险保单号：" background/>
              <app-form-item :span="6" :label="policyExt.tciPolicyNo"/>
              <app-form-item :span="2" label="交强险投保单号：" background/>
              <app-form-item :span="6" :label="policyExt.tciProposalNo"/>
              <app-form-item :span="2" label="核保时间" background/>
              <app-form-item :span="6" :label="formatTime(policyExt.insureTime)"/>
            </app-form-group>
            <app-form-group>
              <app-form-item :span="2" label="交强险保费(元)：" background/>
              <app-form-item :span="6" :label="policyExt.tciPremium"/>
              <app-form-item :span="2" label="交强险折扣系数：" background/>
              <app-form-item :span="6" :label="policyExt.tciDiscount"/>
              <app-form-item :span="2" label="交强险出险次数" background/>
              <app-form-item :span="6" :label="policyExt.tciLossOccurredCount"/>
            </app-form-group>
            <app-form-group>
              <app-form-item :span="2" label="起保时间：" background/>
              <app-form-item :span="6" :label="policyExt.tciStartDate"/>
              <app-form-item :span="2" label="终保时间：" background/>
              <app-form-item :span="6" :label="policyExt.tciEndDate"/>
              <app-form-item :span="2" label="@" background/>
              <app-form-item :span="6" label="@"/>
            </app-form-group>
            <app-form-group>
              <app-form-item :span="2" label="保单配送方式：" background/>
              <app-form-item :span="22" :label="policyExt.receiveAddress"/>
            </app-form-group>
          </div>

          <!--车辆信息-->
          <div id="carinfo" style="padding-top: 20px;">
            <span style="font-weight: 800;">车辆信息</span>
            <app-form-group style="margin-top: 20px;">
              <app-form-item :span="2" label="车牌号：" background/>
              <app-form-item :span="6" :label="vehicleExt.licenseNo"/>
              <app-form-item :span="2" label="车架号：" background/>
              <app-form-item :span="6" :label="vehicleExt.frameNo"/>
              <app-form-item :span="2" label="发动机号：" background/>
              <app-form-item :span="6" :label="vehicleExt.engineNo"/>
            </app-form-group>
            <app-form-group>
              <app-form-item :span="2" label="品牌型号" background/>
              <app-form-item :span="14" :label="vehicleExt.brandName"/>
              <app-form-item :span="2" label="车型编码：" background/>
              <app-form-item :span="6" :label="vehicleExt.modelCode"/>
            </app-form-group>
            <app-form-group>
              <app-form-item :span="2" label="交管车辆类型：" background/>
              <app-form-item :span="6" :label="vehicleExt.vehicleType"/>
              <app-form-item :span="2" label="车辆种类：" background/>
              <app-form-item :span="6" :label="vehicleExt.vehicleType_"/>
              <app-form-item :span="2" label="车辆种类细分：" background/>
              <!--TODO: 车辆种类细分后台没返回，暂时和车辆种类用同一个字段-->
              <app-form-item :span="6" :label="vehicleExt.vehicleCategory"/>
            </app-form-group>
            <app-form-group>
              <app-form-item :span="2" label="所属性质：" background/>
              <app-form-item :span="6" :label="vehicleExt.nature"/>
              <app-form-item :span="2" label="使用性质：" background/>
              <app-form-item :span="6" :label="vehicleExt.useNature"/>
              <app-form-item :span="2" label="使用性质细分：" background/>
              <app-form-item :span="6" :label="vehicleExt.attachNature"/>
            </app-form-group>
            <app-form-group>
              <app-form-item :span="2" label="号牌种类：" background/>
              <app-form-item :span="6" :label="vehicleExt.plateType"/>
              <app-form-item :span="2" label="号牌底色：" background/>
              <app-form-item :span="6" :label="vehicleExt.plateColor"/>
              <app-form-item :span="2" label="能源类型：" background/>
              <app-form-item :span="6" :label="vehicleExt.energyType"/>
            </app-form-group>
            <app-form-group>
              <app-form-item :span="2" label="初登日期：" background/>
              <app-form-item :span="6" :label="vehicleExt.enrollDate"/>
              <app-form-item :span="2" label="新车购置价(元)：" background/>
              <app-form-item :span="6" :label="vehicleExt.purchasePrice"/>
              <app-form-item :span="2" label="核定座位数：" background/>
              <app-form-item :span="6" :label="vehicleExt.seatCount"/>
            </app-form-group>
            <app-form-group>
              <app-form-item :span="2" label="整备质量(吨)：" background/>
              <app-form-item :span="6" :label="vehicleExt.curbWeight"/>
              <app-form-item :span="2" label="核定载重量(吨)：" background/>
              <app-form-item :span="6" :label="vehicleExt.tonnage"/>
              <app-form-item :span="2" label="排量/功率(L/KW)：" background/>
              <app-form-item :span="6" :label="vehicleExt.displacement"/>
            </app-form-group>
            <app-form-group>
              <app-form-item :span="2" label="新车/旧车：" background/>
              <app-form-item :span="6" :label="vehicleExt.newOrOldCar"/>
              <app-form-item :span="2" label="是否过户：" background/>
              <app-form-item :span="6" :label="vehicleExt.transfer"/>
              <app-form-item :span="2" label="过户日期：" background/>
              <app-form-item :span="6" :label="vehicleExt.transferDate"/>
            </app-form-group>
          </div>

          <!--被保人信息-->
          <div id="personinfo" style="padding-top: 20px;">
            <span style="font-weight: 800;">被保人信息</span>
            <app-form-group style="margin-top: 20px;">
              <app-form-item :span="2" label="客户姓名：" background/>
              <app-form-item :span="6" :label="applicantExt.insuredName"/>
              <app-form-item :span="2" label="证件类型：" background/>
              <app-form-item :span="6" :label="applicantExt.insuredIdType"/>
              <app-form-item :span="2" label="证件号码：" background/>
              <app-form-item :span="6" :label="applicantExt.insuredIdNo"/>
            </app-form-group>
            <app-form-group>
              <app-form-item :span="2" label="手机号：" background/>
              <app-form-item :span="6" :label="applicantExt.insuredPhone"/>
              <app-form-item :span="2" label="联系邮箱：" background/>
              <app-form-item :span="6"/>
              <app-form-item :span="2" label="联系地址：" background/>
              <app-form-item :span="6" :label="applicantExt.insuredAddr"/>
            </app-form-group>
            <app-form-group>
              <app-form-item :span="2" label="投保人信息" background style="font-weight:bold;"/>
              <app-form-item v-if="applicantExt.holderCheck" :span="22" label="与被保人一致" background/>
              <app-form-item v-else :span="22" label="@" background/>
            </app-form-group>
            <template v-if="!applicantExt.holderCheck">
              <app-form-group>
                <app-form-item :span="2" label="客户姓名：" background/>
                <app-form-item :span="6" :label="applicantExt.holderName"/>
                <app-form-item :span="2" label="证件类型：" background/>
                <app-form-item :span="6" :label="applicantExt.holderIdType"/>
                <app-form-item :span="2" label="证件号码：" background/>
                <app-form-item :span="6" :label="applicantExt.holderIdNo"/>
              </app-form-group>
              <app-form-group>
                <app-form-item :span="2" label="手机号：" background/>
                <app-form-item :span="6" :label="applicantExt.holderPhone"/>
                <app-form-item :span="2" label="联系邮箱：" background/>
                <app-form-item :span="6"/>
                <app-form-item :span="2" label="联系地址：" background/>
                <app-form-item :span="6" :label="applicantExt.holderAddr"/>
              </app-form-group>
            </template>
            <app-form-group>
              <app-form-item :span="2" label="车主信息" background style="font-weight:bold;"/>
              <app-form-item v-if="applicantExt.ownerCheck" :span="22" label="与被保人一致" background/>
              <app-form-item v-else :span="22" label="@" background/>
            </app-form-group>
            <template v-if="!applicantExt.ownerCheck">
              <app-form-group>
                <app-form-item :span="2" label="客户姓名：" background/>
                <app-form-item :span="6" :label="applicantExt.ownerName"/>
                <app-form-item :span="2" label="证件类型：" background/>
                <app-form-item :span="6" :label="applicantExt.ownerIdType"/>
                <app-form-item :span="2" label="证件号码：" background/>
                <app-form-item :span="6" :label="applicantExt.ownerIdNo"/>
              </app-form-group>
              <app-form-group>
                <app-form-item :span="2" label="手机号：" background/>
                <app-form-item :span="6" :label="applicantExt.ownerPhone"/>
                <app-form-item :span="2" label="联系邮箱：" background/>
                <app-form-item :span="6" :label="applicantExt.ownerEmail"/>
                <app-form-item :span="2" label="联系地址：" background/>
                <app-form-item :span="6" :label="applicantExt.ownerAddr"/>
              </app-form-group>
            </template>
          </div>

          <!--险种明细-->
          <risk-info :risk-list="riskList" :policy-ext="policyExt" :tax="tax"/>

          <!--政策匹配信息-->
          <div id="policymatch" style="padding-top: 20px;">
            <div style="font-weight: 800; margin-bottom: 20px;">政策匹配信息</div>
            <app-form-group style="margin-top: 20px;">
              <app-form-item :span="2" label="子政策ID：" background/>
              <app-form-item :span="10" :label="formality.subStrategyName"/>
              <app-form-item :span="2" label="子政策名称：" background/>
              <app-form-item :span="10" :label="formality.subStrategySequence"/>
            </app-form-group>
          </div>

          <!--手续费&佣金-->
          <div id="commission" style="padding-top: 20px;">
            <span style="font-weight: 800;">手续费&佣金</span>
            <app-form-group style="margin-top: 20px;">
              <app-form-item :span="2" label="上游保司手续费：" background/>

              <app-form-item v-if="!isEdit" :span="6" :label="settlementFormatter(upFormality.upFormalityCountType)"/>
              <app-form-item v-if="isEdit" :span="6" no-padding label="@">
                <el-select v-model="upFormality.upFormalityCountType" style="width: 100%;" size="mini" placeholder="请选择">
                  <el-option
                    v-for="item in settlementMethodList"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"/>
                </el-select>
              </app-form-item>

              <app-form-item :span="2" label="交强险手续费率：" background/>

              <app-form-item v-if="!isEdit" :span="2" :label="upFormality.jqUpFormalityRate"/>
              <app-form-item v-if="isEdit" :span="2" no-padding label="@">
                <el-input v-model="upFormality.jqUpFormalityRate" style="width: 100%;" type="number" min="0" size="mini" placeholder="请输入"/>
              </app-form-item>

              <app-form-item :span="2" label="交强险手续费(元)：" background/>

              <app-form-item v-if="!isEdit" :span="2" :label="upFormality.jqUpFormality"/>
              <app-form-item v-if="isEdit" :span="2" no-padding label="@">
                <el-input v-model="upFormality.jqUpFormality" type="number" min="0" size="mini" placeholder="请输入"/>
              </app-form-item>

              <app-form-item :span="2" label="商业险手续费率：" background/>

              <app-form-item v-if="!isEdit" :span="2" :label="upFormality.upFormalityRate"/>
              <app-form-item v-if="isEdit" :span="2" no-padding label="@">
                <el-input v-model="upFormality.upFormalityRate" type="number" min="0" size="mini" placeholder="请输入"/>
              </app-form-item>

              <app-form-item :span="2" label="商业险手续费(元)：" background/>

              <app-form-item v-if="!isEdit" :span="2" :label="upFormality.upFormality"/>
              <app-form-item v-if="isEdit" :span="2" no-padding label="@">
                <el-input v-model="upFormality.upFormality" type="number" min="0" size="mini" placeholder="请输入"/>
              </app-form-item>

            </app-form-group>
            <app-form-group>
              <app-form-item :span="2" label="下游机构佣金：" background/>

              <app-form-item v-if="!isEdit" :span="6" :label="settlementFormatter(agencyFormality.agencyFormalityCountType)"/>
              <app-form-item v-if="isEdit" :span="6" no-padding label="@">
                <el-select v-model="agencyFormality.agencyFormalityCountType" style="width: 100%;" size="mini" placeholder="请选择">
                  <el-option
                    v-for="item in settlementMethodList"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"/>
                </el-select>
              </app-form-item>

              <app-form-item :span="2" label="交强险佣金率：" background/>

              <app-form-item v-if="!isEdit" :span="2" :label="agencyFormality.jqAgencyFormalityRate"/>
              <app-form-item v-if="isEdit" :span="2" no-padding label="@">
                <el-input v-model="agencyFormality.jqAgencyFormalityRate" type="number" min="0" size="mini" placeholder="请输入"/>
              </app-form-item>

              <app-form-item :span="2" label="交强险佣金(元)：" background/>

              <app-form-item v-if="!isEdit" :span="2" :label="agencyFormality.jqAgencyFormality"/>
              <app-form-item v-if="isEdit" :span="2" no-padding label="@">
                <el-input v-model="agencyFormality.jqAgencyFormality" type="number" min="0" size="mini" placeholder="请输入"/>
              </app-form-item>

              <app-form-item :span="2" label="商业险佣金率：" background/>

              <app-form-item v-if="!isEdit" :span="2" :label="agencyFormality.agencyFormalityRate"/>
              <app-form-item v-if="isEdit" :span="2" no-padding label="@">
                <el-input v-model="agencyFormality.agencyFormalityRate" type="number" min="0" size="mini" placeholder="请输入"/>
              </app-form-item>

              <app-form-item :span="2" label="商业险佣金(元)：" background/>

              <app-form-item v-if="!isEdit" :span="2" :label="agencyFormality.agencyFormality"/>
              <app-form-item v-if="isEdit" :span="2" no-padding label="@">
                <el-input v-model="agencyFormality.agencyFormality" type="number" min="0" size="mini" placeholder="请输入"/>
              </app-form-item>

            </app-form-group>
            <app-form-group>
              <app-form-item :span="2" label="下游业务员佣金：" background/>

              <app-form-item v-if="!isEdit" :span="6" :label="settlementFormatter(saleFormality.saleFormalityCountType)"/>
              <app-form-item v-if="isEdit" :span="6" no-padding label="@">
                <el-select v-model="saleFormality.saleFormalityCountType" style="width: 100%;" size="mini" placeholder="请选择">
                  <el-option
                    v-for="item in settlementMethodList"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"/>
                </el-select>
              </app-form-item>

              <app-form-item :span="2" label="交强险佣金率：" background/>

              <app-form-item v-if="!isEdit" :span="2" :label="saleFormality.jqSaleFormalityRate"/>
              <app-form-item v-if="isEdit" :span="2" no-padding label="@">
                <el-input v-model="saleFormality.jqSaleFormalityRate" type="number" min="0" size="mini" placeholder="请输入"/>
              </app-form-item>

              <app-form-item :span="2" label="交强险佣金(元)：" background/>

              <app-form-item v-if="!isEdit" :span="2" :label="saleFormality.jqSaleFormality"/>
              <app-form-item v-if="isEdit" :span="2" no-padding label="@">
                <el-input v-model="saleFormality.jqSaleFormality" type="number" min="0" size="mini" placeholder="请输入"/>
              </app-form-item>

              <app-form-item :span="2" label="商业险佣金率：" background/>

              <app-form-item v-if="!isEdit" :span="2" :label="saleFormality.saleFormalityRate"/>
              <app-form-item v-if="isEdit" :span="2" no-padding label="@">
                <el-input v-model="saleFormality.saleFormalityRate" type="number" min="0" size="mini" placeholder="请输入"/>
              </app-form-item>

              <app-form-item :span="2" label="商业险佣金(元)：" background/>

              <app-form-item v-if="!isEdit" :span="2" :label="saleFormality.saleFormality"/>
              <app-form-item v-if="isEdit" :span="2" no-padding label="@">
                <el-input v-model="saleFormality.saleFormality" style="width: 100%;" type="number" min="0" size="mini" placeholder="请输入"/>
              </app-form-item>

            </app-form-group>
          </div>

          <!--图片信息-->
          <div id="pictureinfo" style="padding-top: 20px;">
            <span style="font-weight: 800;">图片信息</span>
            <div v-if="imageList.length === 0" style="margin: 20px 0;font-size: 14px;color: #909399;">暂无数据</div>

            <!--遍历图片列表-->
            <div v-for="item in imageList" :key="item.name" class="imageinfo" style="margin-top: 20px;">
              <span class="title">{{ item.name }}：</span>
              <div v-for="img in item.images" :key="img.files" class="pic" @click="showimg(img.files, item.name)">
                <div class="modal">
                  <i class="el-icon-zoom-in"/>
                </div>
                <img :src="img.files" alt="">
              </div>
            </div>

          </div>

          <!--备注信息-->
          <div id="remarks" style="padding-top: 20px;">
            <span style="font-weight: 800;">备注信息</span>
            <app-form-group style="margin-top: 20px;">
              <app-form-item :span="2" label="备注信息：" background/>
              <app-form-item :span="22" :label="remark.remark"/>
            </app-form-group>
          </div>

          <!--操作日志-->
          <div id="logger" style="padding-top: 20px;">
            <span style="font-weight: 800;">操作日志</span>
            <div v-if="logs.length === 0" style="margin: 20px 0;font-size: 14px;color: #909399;">暂无数据</div>

            <el-steps :active="1" direction="vertical" style="margin-top: 20px;">
              <el-step
                v-for="(item, index) in logs"
                :key="index"
                :title="item.createTime"
                icon="el-icon-time"
                status="process">
                <div slot="description">{{ item.described }}</div>
                <!-- <div slot="description">admin01：【业务员】由“路小飞”变更为“路大飞”</div>
                <div slot="description">admin01：【业务员】由“路小飞”变更为“路大飞”</div> -->
              </el-step>
            </el-steps>
          </div>

        </div>
      </app-root-form>

    </div>

    <div v-if="isEdit" class="btns">
      <el-button size="small" @click="close">取消</el-button>
      <el-button type="primary" size="small" @click="sumbitPolicy">保存</el-button>
    </div>

    <div v-if="!isEdit" class="btns">
      <el-button type="primary" size="small" @click="close">关闭</el-button>
    </div>

  </div>
</template>
<script>
import RiskInfo from '@/views/businessmanagement/policy/components/riskInfo'
import { synchronize } from '@/api/policy_management'
import { MyInput, RootTreeSelect, MySelect } from '@/components/Customform'
import myAppElTreeSelect from '@/components/ElTreeSelect'
import dayjs from 'dayjs'
import company from '@/views/businessmanagement/company.js'

export default {
  name: 'Checkandeditpolicy',
  components: {
    RiskInfo,
    MyInput,
    RootTreeSelect,
    myAppElTreeSelect,
    MySelect
  },
  props: {
    policyDetail: {
      type: Object,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rules: {
        organizationId: [{ required: true, message: '所属机构必填', trigger: 'blur' }],
        userName: [{ required: true, message: '业务员不能为空', trigger: 'blur' }]
      },
      vvv: '',
      options: [],
      treeProps: {
        children: 'children',
        label: 'label'
      },
      btnType: 'primary',
      btnLoading: false,
      timelineheight: '500px',
      policyStatusList: [
        { key: 0, value: '报价失败' },
        { key: 1, value: '报价成功' },
        { key: 2, value: '下发修改' },
        { key: 3, value: '人工审核' },
        { key: 4, value: '核保成功' },
        { key: 5, value: '支付失败' },
        { key: 6, value: '支付成功' },
        { key: 7, value: '承保失败' },
        { key: 8, value: '承保成功' }
      ],
      settlementMethodList: [
        { key: -1, value: this.isEdit ? '请选择' : '--' },
        { key: 1, value: '按净保费' },
        { key: 2, value: '按全保费' }
      ]
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
      return this.detail.vehicleExt
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
      return `( ${vehicleExt.brandName} ) | 总保费 ${policyExt.totalPremium} 元：商业险 ${policyExt.vciPremium} 元，
      交强险 ${policyExt.tciPremium} 元，车船税 ${policyExt.vehicleTax} 元`
    },
    // 是否大童渠道
    isDatongChannel() {
      const channel = JSON.parse(localStorage.getItem('userAll')).data.channelCode
      return channel === '001'
    },
    // 保险公司头像
    companyAvatar() {
      const companyList = company()
      const id = this.detail.policyExt.companyId
      const item = companyList.find(item => item.id === id)
      console.log(item)
      if (!item) return ''
      const src = require(`@/assets/companyavatar/c_${item.icon}.png`)
      return src
    }
  },
  created() {
  },
  methods: {
    // 时间格式化
    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    },
    inputValidate(rule, value, callback) {
      console.log('++++++++++++++++++++++')
      console.log(rule)
      console.log(value)
      const myreg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!myreg.test(value)) {
        callback(new Error('错误'))
        return
      }
      callback()
    },
    // 当机构变化的时候触发的事件
    onBelongCompanyChange(val) {
      this.$emit('onBelongCompanyChange', val)
    },
    // 立即同步
    synchronize() {
      this.btnLoading = true
      synchronize(this.policyExt.id)
        .then(res => {
          this.btnLoading = false
          this.btnType = 'info'
          console.log(res)
        })
        .catch(err => {
          this.btnLoading = false
          this.btnType = 'primary'
          console.warn(err)
        })
    },
    // 图片预览
    showimg(url, title) {
      this.$imageview.show({
        title,
        url
      })
    },
    // 编辑保单提交
    sumbitPolicy() {
      this.$refs.policyForm.validateForm(({ isValid, prop, message, el }) => {
        console.log('sumbitPolicy', isValid, prop, message)
        if (!isValid) {
          // alert(message)
          console.log('message', message)
          this.$message.error(message)
          el && el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
          return
        }
        this.$emit('onSubmit')
      })
    },
    // 关闭
    close() {
      this.$emit('onClose')
    },
    // 查看详情
    checkDetail() {
      document.querySelector('a[href="#insurancedetails"]').click()
    },
    // 订单状态格式化
    getPolicyStatusListpolicyStatusFormatter(r) {
      if (r === null || r === undefined || r === '') return '--'
      const val = this.policyStatusList.find(item => Number(item.key) === r).value
      return val
    },
    // 上游保司手续费格式化
    settlementFormatter(count) {
      const settlementMethodList = this.settlementMethodList
      const type = settlementMethodList.find(item => item.key === Number(count)) || {}
      return type.value || '--'
    }
  }
}
</script>

<style lang="scss" scoped>
.checkandeditpolicy{
  .btns {
    width: 100%;
    margin-top: 10px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
  }
  .imageinfo {
    display: flex;
    align-items: flex-start;
    flex-flow: row wrap;
    .title {
      padding: 0 6px;
      width: 120px;
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
        background-color: rgba(0, 0, 0, .3);
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
  .policyheader {
    width: 100%;
    height: 50px;
    margin: 10px 0;
    position: relative;
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
      left: 20px;
      top: 0;
      z-index: 2;
    }
  }
  .policyitem {
    min-width: 1360px;
    padding-bottom: 370px;
  }
  .menu {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    z-index: 999;
    a {
      width: 133px;
      height: 40px;
      background-color: #666666;
      color: #ffffff;
      line-height: 40px;
      text-align: center;
      border: 1px solid #999999;
      margin-right: -1px;
    }
    a:hover {
      opacity: 0.9;
    }
  }
  .a_active {
    background-color: #ffffff!important;
    color: #000000!important;
  }
  .policywrap {
    position: relative;
    height: calc(100vh - 310px);
    overflow: auto;
    width: 100%;
    margin-top: 10px;
  }
}
</style>
