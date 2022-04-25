<template>
  <div class="wrap-content">
    <div id="policyinfo" class="item-header">保单信息</div>
    <el-form
      ref="ruleForm"
      :model="policyDetail"
      :rules="isManualRecording ? policyRules : policyRules2"
      label-width="136px"
      class="demo-ruleForm"
      label-position="right"
    >
      <el-form-item v-if="isSubAdminChannel" label="所属渠道" prop="policyExt.sourceCode">
        <el-select
          v-model="policyExt.sourceCode"
          :loading="channelSelectList.loading"
          clearable
          filterable
          placeholder="请选择"
          size="small"
          @focus="getChannel"
          @change="onChannelClear"
        >
          <el-option
            v-for="item in channelSelectList.data"
            :key="item.code"
            :label="item.shortName"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="!isSubAdminChannel" label="所属渠道">
        <el-input v-model="policyExt.channelName" disabled size="small"/>
      </el-form-item>
      <el-form-item label="保险公司" prop="policyExt.companyId">
        <el-select
          v-model="policyExt.companyId"
          :loading="companyList.loading"
          :disabled="!policyExt.sourceCode"
          clearable
          filterable
          placeholder="请选择"
          size="small"
          @focus="getCompanyList(policyExt.sourceCode)"
          @change="onConpanyClear"
        >
          <el-option
            v-for="item in companyList.data"
            :key="item.companyId"
            :label="item.companyName"
            :value="item.companyId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="出单工号" prop="policyExt.channelId">
        <el-select
          v-model="policyExt.channelId"
          :loading="billingNumberList.loading"
          :disabled="!isNull(policyExt.companyId)"
          clearable
          filterable
          placeholder="请选择"
          size="small"
          @focus="getBillingNumberList(policyExt.sourceCode, policyExt.companyId)"
        >
          <el-option
            v-for="item in billingNumberList.data"
            :key="item.channelId"
            :label="item.channelName"
            :value="item.channelId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属机构" prop="policyExt.organizationId">
        <el-tree-select
          v-model="policyExt.organizationId"
          :loading="orgList.loading"
          :data="orgList.data"
          :default-expand-all="false"
          :disabled="!policyExt.sourceCode"
          clearable
          filterable
          size="small"
          placeholder="请选择"
          @focus="getOrgList(policyExt.sourceCode)"
          @change="onOrgClear"
        />
        <!--<el-select-->
        <!--v-model="policyExt.organizationId"-->
        <!--:disabled="!policyExt.sourceCode"-->
        <!--clearable-->
        <!--filterable-->
        <!--placeholder="请选择"-->
        <!--size="small"-->
        <!--@focus="getOrgList(policyExt.sourceCode)">-->
        <!--<el-option-->
        <!--v-for="item in orgList.data"-->
        <!--:key="item.code"-->
        <!--:label="item.shortName"-->
        <!--:value="item.code" />-->
        <!--</el-select>-->
      </el-form-item>
      <el-form-item label="业务员" prop="policyExt.userId">
        <el-select
          v-model="policyExt.userId"
          :disabled="!policyExt.organizationId"
          :loading="policySalesList.loading"
          clearable
          filterable
          placeholder="请选择"
          size="small"
          @focus="getPolicySalesList(policyExt.organizationId)"
        >
          <el-option
            v-for="item in policySalesList.data"
            :key="item.id"
            :label="item.idName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <br v-show="!isSubAdminChannel">
      <el-form-item v-show="isSubAdminChannel" label="出单员" prop="policyExt.operatorId">
        <el-select
          v-model="policyExt.operatorId"
          :disabled="!policyExt.organizationId"
          :loading="ordererList.loading"
          clearable
          filterable
          placeholder="请选择"
          size="small"
          @focus="getOrdererList(policyExt.organizationId)"
        >
          <el-option
            v-for="item in ordererList.data"
            :key="item.id"
            :label="item.idName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="投保类型" prop="policyExt.policyType">
        <el-select
          v-model="policyExt.policyType"
          clearable
          filterable
          placeholder="请选择"
          size="small"
          @change="onPolicyType"
        >
          <el-option
            v-for="item in policyTypeList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="业务类型" prop="name">
        <el-select
          v-model="policyExt.businessType"
          clearable
          filterable
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in businessTypeList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item :prop="isManualEntry ? '' : policyExt.isOffline" label="录入来源">
        <el-select
          v-model="policyExt.isOffline"
          :disabled="isManualEntry"
          clearable
          filterable
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in isOfflineList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态" prop="policyExt.policyStatus">
        <el-select
          v-model="policyExt.policyStatus"
          disabled
          clearable
          filterable
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in policyStatusList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="签单时间" prop="policyExt.policyTime">
        <el-date-picker
          v-model="policyExt.policyTime"
          type="date"
          format="yyyy 年 MM 月 dd 日"
          value-format="timestamp"
          placeholder="请选择日期"
          size="small"
        />
      </el-form-item>
      <el-form-item label="录入时间" prop="name">
        <el-input v-model="policyExt.inputTime" :disabled="true" size="small"/>
      </el-form-item>
      <div class="divider m-b"/>
      <div v-if="policyExt.policyType === 1 || policyExt.policyType === 3">
        <el-form-item label="交强险保单号" prop="policyExt.tciPolicyNo">
          <el-input v-model="policyExt.tciPolicyNo" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="交强险投保单号" prop="policyExt.tciProposalNo">
          <el-input v-model="policyExt.tciProposalNo" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="交强险核保时间" prop="name">
          <el-date-picker
            v-model="policyExt.insureTime"
            disabled
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="timestamp"
            placeholder="--"
            size="small"
          />
        </el-form-item>
        <el-form-item label="交强险保费(元)" prop="policyExt.tciPremium">
          <el-input v-model="policyExt.tciPremium" size="small" type="number" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="交强险折扣系数" prop="policyExt.tciDiscount">
          <el-input
            v-model="policyExt.tciDiscount"
            size="small"
            type="number"
            min="0"
            max="10"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="交强险出险次数" prop="name">
          <el-select
            v-model="policyExt.tciLossOccurredCount"
            clearable
            filterable
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in rickList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="交强险保险起期" prop="policyExt.tciStartDate">
          <el-date-picker
            v-model="policyExt.tciStartDate"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            placeholder="请选择日期"
            size="small"
          />
        </el-form-item>
        <el-form-item label="交强险保险止期" prop="policyExt.tciEndDate">
          <el-date-picker
            v-model="policyExt.tciEndDate"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            placeholder="请选择日期"
            size="small"
          />
        </el-form-item>
        <el-form-item label="车船税(元)" prop="policyExt.vehicleTax">
          <el-input v-model="policyExt.vehicleTax" size="small" type="number" placeholder="请输入"/>
        </el-form-item>
      </div>
      <div class="divider m-b"/>
      <div v-if="policyExt.policyType === 2 || policyExt.policyType === 3">
        <el-form-item label="商业险保单号" prop="policyExt.vciPolicyNo">
          <el-input v-model="policyExt.vciPolicyNo" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="商业险投保单号" prop="policyExt.vciProposalNo">
          <el-input v-model="policyExt.vciProposalNo" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="商业险核保时间" prop="name">
          <el-date-picker
            v-model="policyExt.insureTime"
            disabled
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            placeholder="--"
            size="small"
          />
        </el-form-item>
        <el-form-item label="商业险保费(元)" prop="policyExt.vciPremium">
          <el-input v-model="policyExt.vciPremium" size="small" type="number" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="商业险折扣系数" prop="policyExt.vciDiscount">
          <el-input v-model="policyExt.vciDiscount" size="small" type="number" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="商业险出险次数" prop="name">
          <el-select
            v-model="policyExt.vciLossOccurredCount"
            clearable
            filterable
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in rickList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商业险保险起期" prop="policyExt.vciStartDate">
          <el-date-picker
            v-model="policyExt.vciStartDate"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            placeholder="请选择日期"
            size="small"
          />
        </el-form-item>
        <el-form-item label="商业险保险止期" prop="policyExt.vciEndDate">
          <el-date-picker
            v-model="policyExt.vciEndDate"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            placeholder="请选择日期"
            size="small"
          />
        </el-form-item>
      </div>
      <br>
      <el-form-item label="收件人" prop="name">
        <el-input v-model="policyExt.receiveName" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="收件人手机" prop="name">
        <el-input v-model="policyExt.receivePhone" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="邮寄地址" prop="name">
        <el-input v-model="policyExt.receiveAddress" size="small" placeholder="请输入"/>
      </el-form-item>

      <div id="carinfo" class="item-header m-b">车辆信息</div>
      <el-form-item prop="name" label="车辆年限：">
        <el-select
          v-model="vehicleExt.newOrOldCar"
          disabled
          clearable
          filterable
          placeholder="--"
          size="small"
        >
          <el-option
            v-for="item in newOrOldCarList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="vehicleExt.licenseNo" label="车牌号：">
        <el-input v-model="vehicleExt.licenseNo" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item prop="vehicleExt.frameNo" label="车架号：">
        <el-input v-model="vehicleExt.frameNo" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="品牌型号：" prop="vehicleExt.brandName">
        <el-input v-model="vehicleExt.brandName" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="发动机号：" prop="vehicleExt.engineNo">
        <el-input v-model="vehicleExt.engineNo" size="small" placeholder="请输入"/>
      </el-form-item>
      <br v-show="!isDatongChannel && !isSubAdminChannel">
      <el-form-item v-show="isDatongChannel || isSubAdminChannel" label="车辆性质：" prop="name">
        <el-select
          v-model="vehicleExt.vehicleNature"
          placeholder="请选择"
          clearable
          filterable
          size="small"
        >
          <el-option
            v-for="item in vehicleNatureList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="交管车辆类型：" prop="vehicleExt.vehicleType">
        <el-select
          v-model="vehicleExt.vehicleType"
          clearable
          filterable
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in vehicleTypeList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车辆种类：" prop="vehicleExt.vehicleType_">
        <el-select
          v-model="vehicleExt.vehicleType_"
          clearable
          filterable
          placeholder="请选择"
          size="small"
          @change="onVehicleType"
        >
          <el-option
            v-for="item in vehicleSortList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车辆种类细分：" prop="name">
        <el-select
          v-model="vehicleExt.vehicleCategory"
          :disabled="!vehicleExt.vehicleType_"
          clearable
          filterable
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in carCategoryDetailList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车型编码：" prop="name">
        <el-input v-model="vehicleExt.modelCode" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="使用性质：" prop="vehicleExt.useNature">
        <el-select
          v-model="vehicleExt.useNature"
          clearable
          filterable
          placeholder="请选择"
          size="small"
          @change="onUseNature"
        >
          <el-option
            v-for="item in useNatureList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="使用性质细分：" prop="name">
        <el-select
          v-model="vehicleExt.attachNature"
          :disabled="!vehicleExt.useNature"
          clearable
          filterable
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in attachList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="初登日期：" prop="vehicleExt.enrollDate">
        <el-date-picker
          v-model="vehicleExt.enrollDate"
          type="date"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          placeholder="请选择日期"
          size="small"
        />
      </el-form-item>
      <el-form-item label="新车购置价(元)：" prop="vehicleExt.purchasePrice">
        <el-input v-model="vehicleExt.purchasePrice" size="small" type="number" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="核定座位数(座)：" prop="vehicleExt.seatCount">
        <el-input v-model="vehicleExt.seatCount" size="small" type="number" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="能源类型：" prop="name">
        <el-select
          v-model="vehicleExt.energyType"
          clearable
          filterable
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in energyTypeList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="号牌底色：" prop="name">
        <el-select
          v-model="vehicleExt.plateColor"
          clearable
          filterable
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in plateColorList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="号牌种类：" prop="name">
        <el-select
          v-model="vehicleExt.plateType"
          clearable
          filterable
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in plateTypeList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="整备质量(吨)：" prop="name">
        <el-input v-model="vehicleExt.curbWeight" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="核定载重量(吨)：" prop="name">
        <el-input v-model="vehicleExt.tonnage" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="排量/功率(L/KW)：" prop="name">
        <el-input v-model="vehicleExt.displacement" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="车辆过户：" prop="vehicleExt.transfer">
        <el-select
          v-model="vehicleExt.transfer"
          clearable
          filterable
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in transferList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="过户日期：" prop="vehicleExt.transferDate">
        <el-date-picker
          v-model="vehicleExt.transferDate"
          :disabled="vehicleExt.transfer !== '1'"
          type="date"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          placeholder="请选择日期"
          size="small"
        />
      </el-form-item>

      <div id="personinfo" class="item-header m-b">关系人信息</div>
      <div class="inner-header mt-25 m-b">
        <div class="title">车主信息</div>
      </div>
      <el-form-item label="姓名：" prop="applicantExt.ownerName">
        <el-input v-model="applicantExt.ownerName" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="证件类型：" prop="applicantExt.ownerIdType">
        <el-cascader
          v-model="applicantExt.ownerIdType"
          :options="applicantNatureList"
          :props="idCardProps"
          placeholder="请选择"
          size="small"
        />
      </el-form-item>
      <el-form-item label="证件号码：" prop="applicantExt.ownerIdNo">
        <el-input v-model="applicantExt.ownerIdNo" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="手机号：" prop="applicantExt.ownerPhone">
        <el-input v-model="applicantExt.ownerPhone" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="联系邮箱：" prop="name">
        <el-input v-model="applicantExt.ownerEmail" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="联系地址：" prop="name">
        <el-input v-model="applicantExt.ownerAddr" size="small" placeholder="请输入"/>
      </el-form-item>
      <div class="inner-header m-b">
        <div class="title">被保人信息</div>
        <el-radio-group v-model="applicantExt.ownerCheck" size="medium" @change="onOwnerCheck">
          <el-radio :label="true" size="medium">同车主</el-radio>
          <el-radio :label="false" size="medium">其他</el-radio>
        </el-radio-group>
      </div>
      <template v-if="!applicantExt.ownerCheck">
        <el-form-item label="姓名：" prop="applicantExt.insuredName">
          <el-input v-model="applicantExt.insuredName" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="证件类型：" prop="applicantExt.insuredIdType">
          <el-cascader
            v-model="applicantExt.insuredIdType"
            :options="applicantNatureList"
            :props="idCardProps"
            placeholder="请选择"
            size="small"
          />
        </el-form-item>
        <el-form-item label="证件号码：" prop="applicantExt.insuredIdNo">
          <el-input v-model="applicantExt.insuredIdNo" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="手机号：" prop="applicantExt.insuredPhone">
          <el-input v-model="applicantExt.insuredPhone" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="联系邮箱：" prop="name">
          <el-input v-model="ruleForm.name" disabled size="small" placeholder="--"/>
        </el-form-item>
        <el-form-item label="联系地址：" prop="name">
          <el-input v-model="applicantExt.insuredAddr" size="small" placeholder="请输入"/>
        </el-form-item>
      </template>
      <div class="inner-header m-b">
        <div class="title">投保人信息</div>
        <el-radio-group v-model="applicantExt.insuredRadio" size="medium" @change="onInsuredRadio">
          <el-radio :label="1" size="medium">同车主</el-radio>
          <el-radio :label="2" size="medium">同被保人</el-radio>
          <el-radio :label="3" size="medium">其他</el-radio>
        </el-radio-group>
      </div>
      <template v-if="applicantExt.insuredRadio === 3">
        <el-form-item label="姓名：" prop="applicantExt.holderName">
          <el-input v-model="applicantExt.holderName" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="证件类型：" prop="applicantExt.holderIdType">
          <el-cascader
            v-model="applicantExt.holderIdType"
            :options="applicantNatureList"
            :props="idCardProps"
            placeholder="请选择"
            size="small"
          />
        </el-form-item>
        <el-form-item label="证件号码：" prop="applicantExt.holderIdNo">
          <el-input v-model="applicantExt.holderIdNo" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="手机号：" prop="applicantExt.holderPhone">
          <el-input v-model="applicantExt.holderPhone" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="联系邮箱：" prop="name">
          <el-input v-model="ruleForm.name" disabled size="small" placeholder="--"/>
        </el-form-item>
        <el-form-item label="联系地址：" prop="name">
          <el-input v-model="applicantExt.holderAddr" size="small" placeholder="请输入"/>
        </el-form-item>
      </template>
      <div id="insurancedetails" class="item-header">商业险明细</div>
      <template v-if="parseInt(policyExt.policyType) === 2 || parseInt(policyExt.policyType) === 3">
        <div class="inner-header mt-25 m-b">
          <div class="title">主险</div>
        </div>
        <div class="risk-item">
          <div class="item1">险种项目</div>
          <div class="item2">保险金额(元)</div>
          <div class="item2">保费(元)</div>
          <div class="item3">是否投保不计免</div>
          <div class="item3">不计免保费(元)</div>
        </div>
        <el-form-item label prop="name" class="risk-form">
          <div class="item1">机动车损失保险</div>
          <el-input v-model="riskMap.a0.amount" class="item2" size="small" placeholder="请输入"/>
          <el-input v-model="riskMap.a0.premium" class="item2" size="small" placeholder="请输入"/>
          <el-checkbox
            v-model="riskMap.a0.isDeductible"
            :true-label="1"
            :false-label="0"
            class="item3"
          >是</el-checkbox>
          <el-input
            v-model="riskMap.a0.deductPremium"
            :disabled="riskMap.a0.isDeductible !== 1"
            class="item3"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label prop="name" class="risk-form">
          <div class="item1">机动车全车盗抢保险</div>
          <el-input v-model="riskMap.a1.amount" class="item2" size="small" placeholder="请输入"/>
          <el-input v-model="riskMap.a1.premium" class="item2" size="small" placeholder="请输入"/>
          <el-checkbox
            v-model="riskMap.a1.isDeductible"
            :true-label="1"
            :false-label="0"
            class="item3"
          >是</el-checkbox>
          <el-input
            v-model="riskMap.a1.deductPremium"
            :disabled="riskMap.a1.isDeductible !== 1"
            class="item3"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label prop="name" class="risk-form">
          <div class="item1">第三者责任保险</div>
          <el-input v-model="riskMap.a2.amount" class="item2" size="small" placeholder="请输入"/>
          <el-input v-model="riskMap.a2.premium" class="item2" size="small" placeholder="请输入"/>
          <el-checkbox
            v-model="riskMap.a2.isDeductible"
            :true-label="1"
            :false-label="0"
            class="item3"
          >是</el-checkbox>
          <el-input
            v-model="riskMap.a2.deductPremium"
            :disabled="riskMap.a2.isDeductible !== 1"
            class="item3"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label prop="name" class="risk-form">
          <div class="item1">车上人员责任险（司机）</div>
          <el-input v-model="riskMap.a3.unitAmount" class="item2" size="small" placeholder="请输入"/>
          <el-input v-model="riskMap.a3.premium" class="item2" size="small" placeholder="请输入"/>
          <el-checkbox
            v-model="riskMap.a3.isDeductible"
            :true-label="1"
            :false-label="0"
            class="item3"
          >是</el-checkbox>
          <el-input
            v-model="riskMap.a3.deductPremium"
            :disabled="riskMap.a3.isDeductible !== 1"
            class="item3"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label prop="name" class="risk-form">
          <div class="item1">车上人员责任险（乘客）</div>
          <div class="item2" style="display: flex;align-items: center;">
            <el-input v-model="riskMap.a4.unitAmount" size="small" placeholder="请输入"/>
            <div style="padding: 0 10px;">x</div>
            <el-input v-model="riskMap.a4.quantity" size="small" placeholder="请输入">
              <template slot="append">座</template>
            </el-input>
          </div>
          <el-input v-model="riskMap.a4.premium" class="item2" size="small" placeholder="请输入"/>
          <el-checkbox
            v-model="riskMap.a4.isDeductible"
            :true-label="1"
            :false-label="0"
            class="item3"
          >是</el-checkbox>
          <el-input
            v-model="riskMap.a4.deductPremium"
            :disabled="riskMap.a4.isDeductible !== 1"
            class="item3"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <div class="inner-header mt-25 m-b">
          <div class="title">附加险&特约险</div>
        </div>
        <div class="risk-item">
          <div class="item1">险种项目</div>
          <div class="item2">保险金额(元)</div>
          <div class="item2">保费(元)</div>
          <div class="item3">是否投保不计免</div>
          <div class="item3">不计免保费(元)</div>
        </div>
        <el-form-item label prop="name" class="risk-form">
          <div class="item1">车身划痕损失险</div>
          <el-input v-model="riskMap.a5.amount" class="item2" size="small" placeholder="请输入"/>
          <el-input v-model="riskMap.a5.premium" class="item2" size="small" placeholder="请输入"/>
          <el-checkbox
            v-model="riskMap.a5.isDeductible"
            :true-label="1"
            :false-label="0"
            class="item3"
          >是</el-checkbox>
          <el-input
            v-model="riskMap.a5.deductPremium"
            :disabled="riskMap.a5.isDeductible !== 1"
            class="item3"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label prop="name" class="risk-form">
          <div class="item1">玻璃单独破碎险</div>
          <el-select
            v-model="riskMap.a6.glassType"
            clearable
            filterable
            placeholder="请选择"
            class="item2"
            size="small"
          >
            <el-option
              v-for="item in glassTypeList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
          <el-input v-model="riskMap.a6.premium" class="item2" size="small" placeholder="请输入"/>
          <div class="item3"/>
          <div class="item3"/>
        </el-form-item>
        <el-form-item label prop="name" class="risk-form">
          <div class="item1">自燃损失险</div>
          <el-input v-model="riskMap.a8.amount" class="item2" size="small" placeholder="请输入"/>
          <el-input v-model="riskMap.a8.premium" class="item2" size="small" placeholder="请输入"/>
          <el-checkbox
            v-model="riskMap.a8.isDeductible"
            :true-label="1"
            :false-label="0"
            class="item3"
          >是</el-checkbox>
          <el-input
            v-model="riskMap.a8.deductPremium"
            :disabled="riskMap.a8.isDeductible !== 1"
            class="item3"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label prop="name" class="risk-form">
          <div class="item1">发动机涉水损失险</div>
          <el-input v-model="riskMap.a9.amount" class="item2" size="small" placeholder="请输入"/>
          <el-input v-model="riskMap.a9.premium" class="item2" size="small" placeholder="请输入"/>
          <el-checkbox
            v-model="riskMap.a9.isDeductible"
            :true-label="1"
            :false-label="0"
            class="item3"
          >是</el-checkbox>
          <el-input
            v-model="riskMap.a9.deductPremium"
            :disabled="riskMap.a9.isDeductible !== 1"
            class="item3"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label prop="name" class="risk-form">
          <div class="item1">指定修理厂险</div>
          <el-input v-model="riskMap.a7.amount" class="item2" size="small" placeholder="请输入"/>
          <el-input v-model="riskMap.a7.premium" class="item2" size="small" placeholder="请输入"/>
          <div class="item3"/>
          <div class="item3"/>
        </el-form-item>
        <el-form-item label prop="name" class="risk-form">
          <div class="item1">找不到第三方特约</div>
          <el-input v-model="riskMap.a10.amount" class="item2" size="small" placeholder="请输入"/>
          <el-input v-model="riskMap.a10.premium" class="item2" size="small" placeholder="请输入"/>
          <div class="item3"/>
          <div class="item3"/>
        </el-form-item>
        <el-form-item label prop="name" class="risk-form">
          <div class="item1">三者节假日翻倍险</div>
          <el-input v-model="riskMap.a11.amount" class="item2" size="small" placeholder="请输入"/>
          <el-input v-model="riskMap.a11.premium" class="item2" size="small" placeholder="请输入"/>
          <div class="item3"/>
          <div class="item3"/>
        </el-form-item>
        <!--<el-form-item label="" prop="name" class="risk-form">-->
        <!--<div class="item1">其他附加险........</div>-->
        <!--<el-input v-model="ruleForm.name" class="item2" size="small" placeholder="请输入"/>-->
        <!--<el-input v-model="ruleForm.name" class="item2" size="small" placeholder="请输入"/>-->
        <!--<el-checkbox v-model="ruleForm.checkbox" class="item3">是</el-checkbox>-->
        <!--<el-input v-model="ruleForm.name" :disabled="true" class="item3" size="small" placeholder="请输入"/>-->
        <!--</el-form-item>-->
      </template>
      <div v-permission="policyPermission" v-if="isManualEntry && isEditPolicy">
        <div id="commission" class="item-header m-b" style="margin-top: 80px;">手续费&佣金</div>
        <div class="inner-header mt-25 m-b">
          <div class="title">上游手续费</div>
        </div>
        <el-form-item :label="upformalityFormatter() + '结算方式'" prop="name">
          <el-select
            v-model="upFormality.upFormalityCountType"
            size="small"
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
        </el-form-item>
        <el-form-item label="商业险手续费率" prop="name">
          <el-input
            v-model="upFormality.upFormalityRate"
            size="small"
            placeholder="请输入"
            @change="upCalculateCommission"
          >
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商业险手续费(元)" prop="name">
          <el-input v-model="upFormality.upFormality" disabled size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item :label="upformalityFormatter()" prop="name">
          <el-input v-model="upFormality.name" disabled size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="交强险手续费率" prop="name">
          <el-input
            v-model="upFormality.jqUpFormalityRate"
            size="small"
            placeholder="请输入"
            @change="upCalculateCommission"
          >
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="交强险手续费(元)" prop="name">
          <el-input v-model="upFormality.jqUpFormality" disabled size="small" placeholder="请输入"/>
        </el-form-item>
        <div class="inner-header m-b">
          <div class="title">下游佣金</div>
          <!--<el-radio-group v-model="applicantExt.ownerCheck" size="medium">-->
          <!--<el-radio :label="true" size="medium">业务员佣金</el-radio>-->
          <!--</el-radio-group>-->
        </div>
        <template v-if="parseInt(upFormality.downType) === 1">
          <el-form-item label="机构结算方式" prop="name">
            <el-select
              v-model="agencyFormality.agencyFormalityCountType"
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
          </el-form-item>
          <el-form-item label="商业险佣金率" prop="name">
            <el-input
              v-model="agencyFormality.agencyFormalityRate"
              size="small"
              placeholder="请输入"
              @change="downOrgCalculateCommission"
            >
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商业险佣金(元)" prop="name">
            <el-input
              v-model="agencyFormality.agencyFormality"
              disabled
              size="small"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="下游机构" prop="name">
            <el-input
              v-model="agencyFormality.childrenCompanyName"
              disabled
              size="small"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="交强险佣金率" prop="name">
            <el-input
              v-model="agencyFormality.jqAgencyFormalityRate"
              size="small"
              placeholder="请输入"
              @change="downOrgCalculateCommission"
            >
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="交强险佣金(元)" prop="name">
            <el-input
              v-model="agencyFormality.jqAgencyFormality"
              disabled
              size="small"
              placeholder="请输入"
            />
          </el-form-item>
        </template>
        <template v-if="parseInt(upFormality.downType) === 2">
          <el-form-item label="业务员结算方式" prop="name">
            <el-select
              v-model="saleFormality.saleFormalityCountType"
              size="small"
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
          </el-form-item>
          <el-form-item label="商业险佣金率" prop="name">
            <el-input
              v-model="saleFormality.saleFormalityRate"
              size="small"
              placeholder="请输入"
              @change="downSaleCalculateCommission"
            >
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商业险佣金(元)" prop="name">
            <el-input
              v-model="saleFormality.saleFormality"
              disabled
              size="small"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="业务员" prop="name">
            <el-input v-model="policyExt.userName" disabled size="small" placeholder="请输入"/>
          </el-form-item>
          <el-form-item label="交强险佣金率" prop="name">
            <el-input
              v-model="saleFormality.jqSaleFormalityRate"
              size="small"
              placeholder="请输入"
              @change="downSaleCalculateCommission"
            >
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="交强险佣金(元)" prop="name">
            <el-input
              v-model="saleFormality.jqSaleFormality"
              disabled
              size="small"
              placeholder="请输入"
            />
          </el-form-item>
        </template>
      </div>
      <div id="remarks" class="item-header m-b" style="margin-top: 80px;">备注信息</div>
      <el-form-item label="备注信息" prop="name" style="width: 100%;">
        <el-input v-model="remark.remark" size="small" placeholder="请输入"/>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import company from '@/views/businessmanagement/company.js'
import { formmixin } from '@/views/businessmanagement/formmixin.js'
import ElTreeSelect from '@/components/ElTreeSelect/index'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
// 传入打开类型，1.保单查看，2.保单编辑，3.订单查看，4.订单编辑，5.手动录单
const typeFlag = {
  browsingPolicy: 1,
  editPolicy: 2,
  browsingOrder: 3,
  editOrder: 4,
  manualRecording: 5
}
export default {
  name: 'PolicyEdit',
  components: {
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
    },
    isManualEntry: {
      type: [String, Boolean],
      default: false
    }
  },
  data() {
    return {
      carCategoryDetailList: [], // 车辆种类细分
      attachList: [], // 车辆使用性质细分
      idCardProps: {
        value: 'code',
        label: 'name',
        children: 'children'
      },
      ruleForm: {
        name: '',
        check: '',
        checkbox: false,
        selectItem: '',
        date: ''
      },
      list: [],
      rules: {},
      showInsure: true,
      showInsured: true
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
    // 险别列表
    riskMap() {
      return this.detail.riskMap || {}
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
      return `( ${vehicleExt.brandName} ) | 总保费 ${
        policyExt.totalPremium
      } 元：商业险 ${policyExt.vciPremium} 元，
      交强险 ${policyExt.tciPremium} 元，车船税 ${policyExt.vehicleTax} 元`
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
      const id = this.detail.policyExt.companyId
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
    customList() {
      return this.carInfoDictionary.customList || []
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
    // 车辆种类
    vehicleSortList() {
      return this.carInfoDictionary.vehicleSortList || []
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
    // 监听初登日期
    'vehicleExt.enrollDate': {
      deep: true,
      handler(newVal) {
        if (newVal) {
          const nowTime = dayjs()
          const lastTime = dayjs(newVal)
          const val = nowTime.diff(lastTime, 'day')
          if (val < 270) {
            this.vehicleExt.newOrOldCar = '1'
            this.policyRules['vehicleExt.licenseNo'][0].required = false
            this.policyRules['vehicleExt.licenseNo'][1].validator = null
          } else {
            this.vehicleExt.newOrOldCar = '2'
            this.policyRules['vehicleExt.licenseNo'][0].required = true
            this.policyRules['vehicleExt.licenseNo'][1].validator = this.policyRules['vehicleExt.licenseNo1'][1].validator
          }
          console.log(val)
        } else {
          this.vehicleExt.newOrOldCar = ''
        }
      }
    },
    // 监听车辆种类
    'vehicleExt.vehicleType_': {
      deep: true,
      handler(newVal) {
        if (newVal) {
          const list = this.customList.find(item => item.parentCode === newVal) || {}
          this.carCategoryDetailList = list.children || []
        } else {
          this.vehicleExt.vehicleCategory = ''
        }
      }
    },
    // 监听车辆使用性质
    'vehicleExt.useNature': {
      deep: true,
      handler(newVal) {
        if (newVal) {
          const list = this.attachNatureList.filter(item => item.parentCode === newVal)
          this.attachList = list
        } else {
          this.vehicleExt.attachNature = ''
        }
      }
    },
    policyDetail: function(newVal, val) {
      if (this.checkType !== 2) return
      console.log(newVal)
      this.channelSelectList.data = newVal.dictionary.sourceCodelist
      this.companyList.data = newVal.dictionary.companyList
      this.billingNumberList.data = newVal.dictionary.workNolist
      const org = newVal.dictionary.organizationTree
      this.orgList.data = JSON.parse(
        JSON.stringify(org)
          .replace(/title/g, 'label')
          .replace(/key/g, 'value')
      )
      this.ordererList.data = newVal.dictionary.operatorList
      this.policySalesList.data = newVal.dictionary.userList
    }
  },
  created() {
    this.getCarInfo()
  },
  methods: {
    // 监听车辆种类
    onVehicleType() {
      this.vehicleExt.vehicleCategory = ''
    },
    // 监听使用性质
    onUseNature() {
      this.vehicleExt.attachNature = ''
    },
    // 监听投保类型
    onPolicyType() {
      this.$refs.ruleForm.clearValidate()
      console.log(this.$refs.ruleForm)
    },
    // 手动录入,被保人信息单选改变时触发
    onOwnerCheck(e) {
      this.applicantExt.insuredName = ''
      this.applicantExt.insuredIdType = []
      this.applicantExt.insuredIdNo = ''
      this.applicantExt.insuredPhone = ''
      this.ruleForm.name = ''
      this.applicantExt.insuredAddr = ''
    },
    // 手动录入,投保人信息单选改变时触发
    onInsuredRadio(e) {
      this.applicantExt.holderName = ''
      this.applicantExt.holderIdType = []
      this.applicantExt.holderIdNo = ''
      this.applicantExt.holderPhone = ''
      this.applicantExt.holderAddr = ''
      this.ruleForm.name = ''
    },
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
    }
  }
}
</script>
<style lang="scss">
.el-tree-select-dropdown {
  .el-tree {
    width: 271.55px;
    height: 300px;
    overflow: auto;
  }
  .el-tree-node > .el-tree-node__children {
    overflow: visible;
  }
}
</style>
