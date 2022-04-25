<template>
  <div class="wrap-content detail-customer">
    <div id="customerinfo" class="item-header">
      <div>客户信息</div>
      <div v-if="!isCustomerInfoEdit" class="edit-btn" @click="customerInfoEdit">
        <el-button class="edit-btn" style="margin-right:10px;" type="text">
          <i style="margin-right:5px;" class="el-icon-edit-outline"/>编辑
        </el-button>
      </div>
      <div v-else>
        <el-button class="edit-btn" style="margin-right:10px;" type="text" @click="handleCustomerCancel">
          <i style="margin-right:5px;" class="el-icon-circle-close-outline"/>取消
        </el-button>
        <el-button class="edit-btn" style="margin-right:5px;" type="text" @click="customerInfoSave">
          <i style="margin-right:5px;" class="el-icon-circle-check-outline"/>保存
        </el-button>
      </div>
    </div>
    <div style="float:left; width:33%;" class="wrap-left">
      <div class="customer_logo" style="padding: 60px 20px;">
        <div>
          <img style="width:180px;height:180px;" src="@/assets/imgs/customerinfo.png" alt="">
        </div>
        <div style="margin-left:10%;">
          <div class="info" style="font-weight:700;font-size: 28px;">{{ carInfoR.licenseNo ? carInfoR.licenseNo : '' }}</div>
          <div class="info" style="background: rgba(230, 162, 60, 1);margin-top:10px;font-size: 14px;color: #FFFFFF;"> {{ customerR.followUpStatusText ?customerR.followUpStatusText:'--' }} </div>
          <div class="info" style="background: rgba(64, 158, 255, 1);margin-top:10px;font-size: 14px;color: #FFFFFF;"> {{ customerR.statusText ? customerR.statusText:'--' }} </div>
        </div>
      </div>
    </div>

    <el-form
      ref="customerInfo"
      :model="customer"
      :rules="rule1"
      :hide-required-asterisk="!isCustomerInfoEdit"
      label-width="130px"
      class="demo-ruleForm"
      label-position="right"
      style="color: #606266;"
    >
      <el-form-item :hide-required-asterisk="true" label="客户姓名：" prop="name">
        <span v-if="!isCustomerInfoEdit">{{ customerR.name ? customerR.name : '--' }}</span>
        <el-input v-else v-model="customer.name" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="客户电话：" prop="phone">
        <span v-if="!isCustomerInfoEdit">{{ customerR.phone?customerR.phone:'--' }}</span>
        <el-input v-else v-model="customer.phone" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="录入时间：" prop="entryDate">
        <span v-if="!isCustomerInfoEdit">{{ customerR.entryDate ? customerR.entryDate : '--' }}</span>
        <el-input v-else v-model="customer.entryDate" disabled size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="录入来源：" prop="entrySourceText">
        <span v-if="!isCustomerInfoEdit">{{ customerR.entrySourceText ? customerR.entrySourceText : '--' }}</span>
        <el-input v-else v-model="customer.entrySourceText" disabled size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="客户备注：" prop="backup">
        <span v-if="!isCustomerInfoEdit">{{ customerR.backup ? customerR.backup : '--' }}</span>
        <el-input v-else v-model="customer.backup" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="往年投保：" prop="insureCompanyId">
        <span v-if="!isCustomerInfoEdit">{{ customerR.insureCompanyId || customerR.insureCompanyId === 0 ? companyDict(customerR.insureCompanyId) : '--' }}</span>
        <el-select
          v-else
          :loading="companyList.loading"
          v-model="customer.insureCompanyId"
          size="small"
          clearable
          filterable
          placeholder="请选择"
          style="width: 100%;"
          @change="handleInsureCompanyChange"
        >
          <el-option
            v-for="item in companyList.data"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="商业险止期：" prop="vciEndDate">
        <span v-if="!isCustomerInfoEdit">{{ customerR.vciEndDate ? customerR.vciEndDate: '--' }}</span>
        <el-date-picker
          v-else
          v-model="customer.vciEndDate"
          :clearable="false"
          size="small"
          style="width: 100%;margin-right: 10px;"
          type="date"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="交强险止期：" prop="tciEndDate">
        <span v-if="!isCustomerInfoEdit">{{ customerR.tciEndDate ? customerR.tciEndDate:'--' }}</span>
        <el-date-picker
          v-else
          v-model="customer.tciEndDate"
          :clearable="false"
          size="small"
          style="width: 100%; margin-right: 10px;"
          type="date"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <!-- {{ customer.companyId }} -->
      <el-form-item
        :rules="isCustomerInfoEdit ? { required: true, message: '请选择所属机构', trigger: 'change' }:{}"
        label="所属机构：">
        <span v-if="!isCustomerInfoEdit">{{ customerR.companyName ? customerR.companyName : '--' }}</span>
        <my-tree-select
          v-else
          :options="orgDataList"
          :value="customer.companyId"
          :normalizer="normalizer"
          no-options-text="数据加载中..."
          no-children-text=""
          style="width:100%;display: inline-block;vertical-align: middle;margin-right: 10px;"
          class="filter"
          placeholder="选择机构"
          no-results-text="未找到结果"
          @input="customer.companyId = $event"
        />
      </el-form-item>
      <el-form-item label="业务员：" prop="salesId">
        <span v-if="!isCustomerInfoEdit">{{ customerR.salesName ? customerR.salesName : '--' }}</span>
        <el-select
          v-else
          :loading="salemanList.loading"
          v-model="customer.salesId"
          size="small"
          clearable
          filterable
          placeholder="请选择"
          style="width: 100%;"
          @focus="getSalemanList"
        >
          <el-option
            v-for="item in salemanList.data"
            :key="item.id"
            :value="item.id"
            :label="item.fullName"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <!--  关系人信息 -->
    <div class="inner-header m-b">
      <div class="title">车主信息</div>
    </div>
    <el-form
      ref="applicantInfo"
      :model="applicant"
      :rules="rule1"
      :hide-required-asterisk="!isCustomerInfoEdit"
      label-width="130px"
      class="demo-ruleForm"
      label-position="right"
      style="color: #606266;"
    >
      <el-form-item label="姓名：" prop="ownerName">
        <span v-if="!isCustomerInfoEdit">{{ applicantR.ownerName ? applicantR.ownerName : '--' }}</span>
        <el-input v-else v-model="applicant.ownerName" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="证件类型：" prop="ownerIdTypeName">
        <span v-if="!isCustomerInfoEdit">{{ applicantR.ownerIdTypeName ? applicantR.ownerIdTypeName : '--' }}</span>
        <el-cascader
          v-else
          v-model="applicant.ownerIdTypes"
          :options="applicantNatureList"
          :props="idCardProps"
          style="width:100%;"
          placeholder="请选择"
          size="small"
        />
      </el-form-item>
      <el-form-item label="证件号码：" prop="ownerIdNo">
        <span v-if="!isCustomerInfoEdit">{{ applicantR.ownerIdNo ? applicantR.ownerIdNo:'--' }}</span>
        <el-input v-else v-model="applicant.ownerIdNo" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="手机号：" prop="ownerPhone">
        <span v-if="!isCustomerInfoEdit">{{ applicantR.ownerPhone ? applicantR.ownerPhone : '--' }}</span>
        <el-input v-else v-model="applicant.ownerPhone" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="联系邮箱：" prop="ownerEmail">
        <span v-if="!isCustomerInfoEdit">{{ applicantR.ownerEmail ? applicantR.ownerEmail : '--' }}</span>
        <el-input v-else v-model="applicant.ownerEmail" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="联系地址：" prop="ownerAddr">
        <span v-if="!isCustomerInfoEdit">{{ applicantR.ownerAddr ? applicantR.ownerAddr : '--' }}</span>
        <el-input v-else v-model="applicant.ownerAddr" size="small" placeholder="请输入"/>
      </el-form-item>
      <div class="inner-header m-b">
        <div class="title">被保人信息</div>
        <el-radio v-if="!isCustomerInfoEdit" v-model="defaultRadio" label="1" >{{ applicantR.insuredEqual===3?'其他':'同车主' }}</el-radio>
        <el-radio-group v-else v-model="applicant.insuredEqual" size="medium" @change="onOwnerCheck">
          <el-radio :label="1" size="medium" >同车主</el-radio>
          <el-radio :label="3" size="medium">其他</el-radio>
        </el-radio-group>
      </div>
      <template v-if="applicant.insuredEqual===3">
        <el-form-item label="姓名：" prop="insuredName">
          <span v-if="!isCustomerInfoEdit">{{ applicantR.insuredName ? applicantR.insuredName : '--' }}</span>
          <el-input v-else v-model="applicant.insuredName" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="证件类型：" prop="insuredIdTypeName">
          <span v-if="!isCustomerInfoEdit">{{ applicantR.insuredIdTypeName ? applicantR.insuredIdTypeName:'--' }}</span>
          <el-cascader
            v-else
            v-model="applicant.insuredIdTypes"
            :options="applicantNatureList"
            :props="idCardProps"
            placeholder="请选择"
            size="small"
          />
        </el-form-item>
        <el-form-item label="证件号码：" prop="insuredIdNo">
          <span v-if="!isCustomerInfoEdit">{{ applicantR.insuredIdNo ? applicantR.insuredIdNo : '--' }}</span>
          <el-input v-else v-model="applicant.insuredIdNo" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="手机号：" prop="insuredPhone">
          <span v-if="!isCustomerInfoEdit">{{ applicantR.insuredPhone ? applicantR.insuredPhone : '--' }}</span>
          <el-input v-else v-model="applicant.insuredPhone" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="联系邮箱：" prop="insuredEmail">
          <span v-if="!isCustomerInfoEdit">{{ applicantR.insuredEmail ? applicantR.insuredEmail : '--' }}</span>
          <el-input v-else v-model="applicant.insuredEmail" size="small" placeholder="--"/>
        </el-form-item>
        <el-form-item label="联系地址：" prop="insuredAddr">
          <span v-if="!isCustomerInfoEdit">{{ applicantR.insuredAddr ? applicantR.insuredAddr : '--' }}</span>
          <el-input v-else v-model="applicant.insuredAddr" size="small" placeholder="请输入"/>
        </el-form-item>
      </template>
      <div class="inner-header m-b">
        <div class="title">投保人信息</div>
        <el-radio v-if="!isCustomerInfoEdit" v-model="defaultRadio" label="1" >{{ getHolderCheck(applicant.holderEqual) }} </el-radio>
        <el-radio-group v-else v-model="applicant.holderEqual" size="medium" @change="onInsuredRadio">
          <el-radio :label="1" size="medium">同车主</el-radio>
          <el-radio :label="2" size="medium">同被保人</el-radio>
          <el-radio :label="3" size="medium">其他</el-radio>
        </el-radio-group>
      </div>
      <template v-if="applicant.holderEqual === 3">
        <el-form-item label="姓名：" prop="holderName">
          <span v-if="!isCustomerInfoEdit">{{ applicantR.holderName ? applicantR.holderName : '--' }}</span>
          <el-input v-else v-model="applicant.holderName" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="证件类型：" prop="holderIdTypeName">
          <span v-if="!isCustomerInfoEdit">{{ applicantR.holderIdTypeName ? applicantR.holderIdTypeName:'--' }}</span>
          <el-cascader
            v-else
            v-model="applicant.holderIdTypes"
            :options="applicantNatureList"
            :props="idCardProps"
            placeholder="请选择"
            size="small"
          />
        </el-form-item>
        <el-form-item label="证件号码：" prop="holderIdNo">
          <span v-if="!isCustomerInfoEdit">{{ applicantR.holderIdNo ? applicantR.holderIdNo : '--' }}</span>
          <el-input v-else v-model="applicant.holderIdNo" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="手机号：" prop="holderPhone">
          <span v-if="!isCustomerInfoEdit">{{ applicantR.holderPhone ? applicantR.holderPhone : '--' }}</span>
          <el-input v-else v-model="applicant.holderPhone" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="联系邮箱：" prop="holderEmail">
          <span v-if="!isCustomerInfoEdit">{{ applicantR.holderEmail ? applicantR.holderEmail : '--' }}</span>
          <el-input v-else v-model="applicant.holderEmail" size="small" placeholder="--"/>
        </el-form-item>
        <el-form-item label="联系地址：" prop="holderAddr">
          <span v-if="!isCustomerInfoEdit">{{ applicantR.holderAddr ? applicantR.holderAddr : '--' }}</span>
          <el-input v-else v-model="applicant.holderAddr" size="small" placeholder="请输入"/>
        </el-form-item>
      </template>
    </el-form>

    <!-- 车辆信息 -->
    <div id="carinfo" class="item-header">
      <div>车辆信息</div>
      <div v-if="!isVehicleInfoEdit" class="edit-btn" @click="vehicleInfoEdit">
        <el-button class="edit-btn" style="margin-right:10px;" type="text">
          <i style="margin-right:5px;" class="el-icon-edit-outline"/>编辑
        </el-button>
      </div>
      <div v-else>
        <el-button class="edit-btn" style="margin-right:10px;" type="text" @click="handleCarInfoEditCancel">
          <i style="margin-right:5px;" class="el-icon-circle-close-outline"/>取消
        </el-button>
        <el-button class="edit-btn" style="margin-right:5px;" type="text" @click="vehicleInfoSave">
          <i style="margin-right:5px;" class="el-icon-circle-check-outline"/>保存
        </el-button>
      </div>
    </div>
    <el-form
      ref="carInfo"
      :model="carInfo"
      :rules="rule3"
      :hide-required-asterisk="!isVehicleInfoEdit"
      label-width="130px"
      class="demo-ruleForm"
      label-position="right"
      style="color: #606266;"
    >
      <el-form-item prop="carYearsText" label="车辆年限：">
        <span v-if="!isVehicleInfoEdit">{{ carInfoR.carYearsText ? carInfoR.carYearsText : '--' }}</span>
        <el-select
          v-else
          v-model="carInfo.carYearsText"
          disabled
          clearable
          filterable
          placeholder="--"
          size="small"
        >
          <el-option label="" value="" />
        </el-select>
      </el-form-item>
      <el-form-item prop="licenseNo" label="车牌号：">
        <span v-if="!isVehicleInfoEdit">{{ carInfoR.licenseNo ? carInfoR.licenseNo : '--' }}</span>
        <el-input v-else v-model="carInfo.licenseNo" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item prop="frameNo" label="车架号：">
        <span v-show="!isVehicleInfoEdit">{{ carInfoR.frameNo ? carInfoR.frameNo : '--' }}</span>
        <el-input v-show="isVehicleInfoEdit" v-model="carInfo.frameNo" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="发动机号：" prop="engineNo">
        <span v-if="!isVehicleInfoEdit">{{ carInfoR.engineNo ? carInfoR.engineNo : '--' }}</span>
        <el-input v-else v-model="carInfo.engineNo" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="品牌型号：" prop="brandName">
        <span v-if="!isVehicleInfoEdit">{{ carInfoR.brandName ? carInfoR.brandName : '--' }}</span>
        <el-input v-else v-model="carInfo.brandName" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="车型编码：" prop="modelCode">
        <span v-if="!isVehicleInfoEdit">{{ carInfoR.modelCode ? carInfoR.modelCode : '--' }}</span>
        <el-input v-else v-model="carInfo.modelCode" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="初登日期：" prop="enrollDate">
        <span v-if="!isVehicleInfoEdit">{{ carInfoR.enrollDate ? carInfoR.enrollDate : '--' }}</span>
        <el-date-picker
          v-else
          v-model="carInfo.enrollDate"
          type="date"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择日期"
          size="small"
        />
      </el-form-item>

      <el-form-item label="新车购置价(元)：" prop="purchasePrice">
        <span v-if="!isVehicleInfoEdit">{{ carInfoR.purchasePrice ? carInfoR.purchasePrice : '--' }}</span>
        <el-input v-else v-model="carInfo.purchasePrice" size="small" type="number" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="核定座位数(座)：" prop="seatCount">
        <span v-if="!isVehicleInfoEdit">{{ carInfoR.seatCount ? carInfoR.seatCount : '--' }}</span>
        <el-input v-else v-model="carInfo.seatCount" size="small" type="number" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="交管车辆类型：" prop="vehicleTypeName">
        <span v-if="!isVehicleInfoEdit">{{ carInfoR.vehicleTypeName ? carInfoR.vehicleTypeName : '--' }}</span>
        <el-select
          v-else
          v-model="carInfo.vehicleType"
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
      <el-form-item label="使用性质：" prop="useNatureName">
        <span v-if="!isVehicleInfoEdit">{{ carInfoR.useNatureName ? carInfoR.useNatureName : '--' }}</span>
        <el-select
          v-else
          v-model="carInfo.useNature"
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
      <el-form-item label="使用性质细分：" prop="attachNature">
        <span v-if="!isVehicleInfoEdit">{{ carInfoR.attachNatureName ? carInfoR.attachNatureName : '--' }}</span>
        <el-select
          v-else
          v-model="carInfo.attachNature"
          :disabled="!carInfo.useNature"
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
      <el-form-item label="排量/功率(L/KW)：" prop="displacement">
        <span v-if="!isVehicleInfoEdit">{{ carInfoR.displacement ? carInfoR.displacement : '--' }}</span>
        <el-input v-else v-model="carInfo.displacement" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="能源类型：" prop="energyTypeName">
        <span v-if="!isVehicleInfoEdit">{{ carInfoR.energyTypeName ? carInfoR.energyTypeName : '--' }}</span>
        <el-select
          v-else
          v-model="carInfo.energyType"
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
      <el-form-item label="车辆过户：" prop="transfer">
        <span v-show="!isVehicleInfoEdit">{{ carInfoR.transfer === 0 ? '是' : '否' }}</span>
        <el-select
          v-show="isVehicleInfoEdit"
          v-model="carInfo.transfer"
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
      <el-form-item v-if="carInfo.transfer === 0" label="过户日期：" prop="transferDate">
        <span v-if="!isVehicleInfoEdit">{{ carInfoR.transferDate ? formatTime(carInfoR.transferDate): '--' }}</span>
        <el-date-picker
          v-else
          v-model="carInfo.transferDate"
          :picker-options="pickerRange"
          type="date"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期"/>
      </el-form-item>
    </el-form>
    <!-- 往年投保 -->
    <div id="preInsure" class="item-header" style="margin:20px 0;">往年投保</div>
    <div v-if="previInsureInfo.length>0" class="prev-insuretable">
      <el-table :data="previInsureInfo" max-height="300px" style="margin-top:20px;">
        <el-table-column property="insureType" label="投保类型" min-width="100"/>
        <el-table-column property="companyName" label="保险公司" min-width="100"/>
        <el-table-column property="endDate" label="保险止期" min-width="120" />
        <el-table-column property="premium" label="保费总额(元)" min-width="100" />
        <el-table-column property="organizationName" label="所属机构" min-width="180" />
        <el-table-column property="salesman" label="业务员" min-width="160" />
        <el-table-column label="险种详情" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              style="font-size: 14px;"
              @click="viewRiskDetail(scope)"
            >查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="isRiskDetailShow" title="投保信息" width="1000px">
        <risk-detail
          :loading="riskLoading"
          :risk-type="riskType"
          :prev-insure-data="prevInsureData" />
      </el-dialog>
    </div>
    <div v-if="previInsureInfo.length ===0" style="margin: 20px 0;margin-left:10px; font-size: 14px;color: #909399;"> 暂无数据</div>
    <!-- 报价记录 -->
    <div id="quoteRecord" class="item-header" style="margin:20px 0;">报价记录</div>
    <div v-if="quoteRecord.length ===0" style="margin: 20px 0;margin-left:10px; font-size: 14px;color: #909399;"> 暂无数据</div>
    <quote-record
      v-else
      :quote-record="quoteRecord" />
    <!-- 跟进信息 -->
    <div id="followRecord" class="item-header">
      <div>跟进信息</div>
      <div class="edit-btn" @click="recordInfo">
        <el-button class="edit-btn" style="margin-right:10px;" type="text">
          <i style="margin-right:5px;" class="el-icon-edit-outline"/>录入
        </el-button>
      </div>
    </div>

    <div v-if="followUps.length === 0" style="margin: 20px 0;margin-left:10px; font-size: 15px;color: #909399;">暂无数据</div>
    <div v-else>
      <el-steps :active="1" direction="vertical" style="margin-top: 20px;">
        <el-step
          v-for="item in followUps"
          :key="item.id"
          :title="item.title"
          icon="el-icon-time"
          status="process"
          style="margin-top:10px;"
        >
          <div slot="description">
            <div v-for="(info,index) in item.descipt" :key="index" class="descript" style="">
              <div class="time">{{ info.time }}</div>
              <div class="status">{{ info.statusText }}</div>
              <div class="message">回访时间：{{ info.nextFollowUpDate }} | 备注信息：{{ info.backup }}</div>
            </div>
          </div>
        </el-step>
        <el-step class="first-step" title="" icon="el-icon-location-outline" />
      </el-steps>
    </div>
    <el-dialog :visible.sync="isRecordShow" title="录入跟进信息" width="600px" class="recordInfo">
      <el-form ref="followupInfo" :model="recodInfoform" :rules="followUpsRules" label-width="120px">
        <el-form-item label="跟进状态：" prop="status" style="width:100%">
          <el-select
            v-model="recodInfoform.status"
            :loading="followStatus.loading"
            placeholder="请选择"
            style="width:405px;"
            @focus="geFollowUpType">
            <el-option
              v-for="item in followStatus.data"
              :key="item.code"
              :label="item.value1"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :rules="[
          { required: true, message: '请选择下次跟进时间', trigger: 'change' }]"
          label="下次跟进："
          style="width:100%">
          <el-radio-group v-model="nextFollowType" style="width:405px;">
            <el-radio :label="1">明天</el-radio>
            <el-radio :label="2">后天</el-radio>
            <el-radio :label="3">三天后</el-radio>
            <el-radio :label="4">一周后</el-radio>
            <el-radio :label="5">自定义</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="nextFollowType === 5" label="" prop="nextFollowUpDate" style="width:100%">
          <el-date-picker
            v-model="recodInfoform.nextFollowUpDate"
            type="date"
            placeholder="选择日期"
            format="yyyy - MM - dd "
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:405px;" />
        </el-form-item>
        <el-form-item label="备注信息：" prop="backup" style="width:100%">
          <el-input
            :rows="5"
            v-model="recodInfoform.backup"
            type="textarea"
            placeholder="请输入内容"
            style="width:405px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isRecordShow = false">取 消</el-button>
        <el-button type="primary" @click="handleFollowInfo">确 定</el-button>
      </div>
    </el-dialog>
    <div class="menu-bar" @click="isRecordShow = true">
      <div class="txt"><i class="el-icon-edit-outline"/> 录入跟进信息</div>
    </div>
    <!-- 跟进记录 -->
  </div>
</template>
<script>
import {
  addFollowUpInfo,
  updateCustomerInfo,
  queryCustomerSaleman,
  getPreviInsureRiskData
} from '@/api/newCustomer'
import InfoItem from '@/views/customermanagement/components/infoItem'
import RiskDetail from '@/views/customermanagement/components/risksDetail'
import QuoteRecord from '@/views/customermanagement/components/quoteRecord'
import { formmixin } from '@/views/customermanagement/formmixin.js'
import MyTreeSelect from '@/components/MyTreeSelect'
import dayjs from 'dayjs'
import moment from 'moment'
import { mapState, mapGetters } from 'vuex'
export default {
  components: {
    InfoItem,
    RiskDetail,
    QuoteRecord,
    MyTreeSelect
  },
  mixins: [formmixin],
  props: {
    // 传入保单id
    customerId: {
      type: String,
      default: null
    },
    // salemanList: { // 业务员
    //   type: Array,
    //   default: () => {
    //     return []
    //   }
    // },
    customerDetail: {
      type: Object,
      default: () => {}
    },
    customerDetailData: {
      type: Object,
      default: () => {}
    },
    carInfoList: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      pickerRange: {
        disabledDate(time) {
          return time.getTime() + 365 * 60 * 60 * 24 * 1000 < Date.now()
        }
      },
      isCustomerInfoEdit: false, // 是否客户信息编辑
      isVehicleInfoEdit: false, // 是否车辆信息编辑
      isRiskDetailShow: false, // 险种详情是否显示
      isRecordShow: false, // 录入信息是否显示
      // detail: this.customerDetailData || {},
      organizationId: '',
      salemanList: { // 业务员
        data: [],
        loading: false
      },
      quotoInfo: {},
      riskLoading: false, // 往年投保加载
      riskType: '',
      newOrOldCar: '--',
      recodInfoform: { // 添加录单信息
        nextFollowUpDate: '',
        status: '',
        backup: ''
      },
      nextFollowType: 5, // 录单回访时间
      idCardProps: { // 证件类型
        value: 'code',
        label: 'name',
        children: 'children'
      },
      source_loading: false,
      customerType_loading: false,
      saleman_loading: false,
      defaultRadio: '1',
      attachList: [], // 车辆使用性质细分
      transferList: [{ key: 0, value: '是' }, { key: 1, value: '否' }],
      // 往年投保
      prevInsureData: {}
    }
  },
  computed: {
    ...mapState({
      customerDetailInfo: 'customerDetail'
    }),
    ...mapGetters(['customerR', 'applicantR', 'carInfoR', 'previInsureInfo']),
    detail() {
      return this.customerDetailData || {}
    },
    applicant() {
      return this.detail.applicant || {}
    },
    customer() {
      // return Object.assign({}, this.detail.customer)
      return this.detail.customer || {}
    },
    carInfo() {
      return this.detail.carInfo || {}
    },
    followUps() {
      return this.detail.followData || []
    },
    quoteRecord() {
      return this.detail.quoteRecords || []
    },
    // 车辆信息相关字典
    carInfoDictionary() {
      return this.carInfoList || {}
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
    }
  },
  watch: {
    // 监听车辆使用性质
    'carInfo.useNature': {
      deep: true,
      handler(newVal) {
        console.log('车辆新增有变化', newVal)
        if (newVal) {
          const list = this.attachNatureList.filter(item => item.parentCode === newVal)
          this.attachList = list
        } else {
          this.carInfo.attachNature = ''
        }
      }
    }
    // customerR: {
    //   deep: true,
    //   handler(newVal) {
    //     console.log(newVal)
    //   }
    // }
  },
  created() {
    this.getCompanyList()
    this.getOrgDataList()
    // this.selectCustomerValue.applicant = this.customerDetailData.applicant
    // console.log(this.customerDetailData)
  },
  mounted() {
    // this.getSalemanList()
    // this.getSalemanList()
  },
  methods: {
    // 客户编辑取消
    handleCustomerCancel() {
      this.isCustomerInfoEdit = false
      console.log(this.$refs.customerInfo)
      this.$refs.customerInfo.clearValidate()
      this.$refs.applicantInfo.clearValidate()
      // this.$refs.customerInfo.resetFields()
    // this.$emit('refreshDetail')

    // console.log(JSON.parse(localStorage.getItem('customerDetailInfo')).customer)
    // this.customer = JSON.parse(localStorage.getItem('customerDetailInfo')).customer
    // console.log(this.$refs.customerInfo)
    // this.$refs.customerInfo.resetFields()
    // console.log(this.selectCustomerValue)
    // this.customer = this.customerDetailData.customer
    // console.log(this.customer)
    },
    handleCarInfoEditCancel() {
      this.isVehicleInfoEdit = false
      this.$refs.carInfo.clearValidate()
    },
    // 被保人信息单选改变时触发
    onOwnerCheck(e) {
      this.applicant.insuredName = ''
      this.applicant.insuredIdType = []
      this.applicant.insuredIdNo = ''
      this.applicant.insuredPhone = ''
      this.applicant.insuredEmail = ''
      this.applicant.insuredAddr = ''
    },
    // 投保人信息单选改变时触发
    onInsuredRadio(e) {
      this.applicant.holderName = ''
      this.applicant.holderIdType = []
      this.applicant.holderIdNo = ''
      this.applicant.holderPhone = ''
      this.applicant.holderAddr = ''
      this.applic
    },
    // 投保人类型
    getHolderCheck(type) {
      if (type === 1) {
        return '同车主'
      } else if (type === 2) {
        return '同被保人'
      } else {
        return '其他'
      }
    },
    // 客户信息编辑
    customerInfoEdit() {
      this.isCustomerInfoEdit = true
      this.getSalemanList()
      // this.$emit('refreshDetail')
      // this.customer = { ...this.customerR }
      //
    },
    // 时间格式化
    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD')
    },
    // 车辆新编辑
    vehicleInfoEdit() {
      this.isVehicleInfoEdit = true
    },
    // 客户信息编辑保存
    customerInfoSave() {
      console.log('客户信息保存')
      // console.log(this.$refs.customerInfo)
      this.applicant.ownerIdType = this.applicant.ownerIdTypes.length > 0 ? this.applicant.ownerIdTypes[1] : ''
      this.applicant.insuredIdType = this.applicant.insuredIdTypes.length > 0 ? this.applicant.insuredIdTypes[1] : ''
      this.applicant.holderIdType = this.applicant.holderIdTypes.length > 0 ? this.applicant.holderIdTypes[1] : ''
      // 客户信息校验
      this.$refs.customerInfo.validate(valid => { // 客户信息校验
        if (valid) {
          console.log(this.customer)
          this.customer.id = this.customerId
          // this.applicant.ownerIdType = '101'
          const params = {
            customer: this.customer,
            applicant: this.applicant
          }
          updateCustomerInfo(params).then(res => {
            this.$emit('refreshDetail')
            this.isCustomerInfoEdit = false
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
          }).catch(err => {
            console.warn(err)
          })
        } else {
          console.log('error submit001!!')
          return false
        }
      })
    },
    // 车辆信息编辑保存
    vehicleInfoSave() {
      const customer = {}
      customer.id = this.customerId
      this.$refs.carInfo.validate(valid => {
        if (valid) {
          if (this.carInfo.transfer === 1) { // 不是过户车
            this.carInfo.transferDate = undefined
          }
          const params = {
            carInfo: this.carInfo,
            customer: customer
          }
          updateCustomerInfo(params).then(res => {
            this.$emit('refreshDetail')
            this.isVehicleInfoEdit = false
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
          }).catch(err => {
            console.warn(err)
          })
        } else {
          console.log('error submit!')
          return false
        }
      })
    },
    // 查看险种详情
    viewRiskDetail(scope) {
      this.riskLoading = true
      this.isRiskDetailShow = true
      this.riskType = scope.row.insureType
      const policyId = scope.row.policyId
      // const policyId = '39ed6912666611e9818300163e08a24e'
      getPreviInsureRiskData(policyId).then(res => {
        this.riskLoading = false
        this.prevInsureData = res.data
        console.log(res)
      }).catch(err => {
        console.warn(err)
      })
    },
    // 监听使用性质
    onUseNature() {
      // this.carInfo.attachNature = ''
      if (this.carInfo.useNature === '100') {
        this.carInfo.attachNature = ''
      }
    },
    // 录入信息
    recordInfo() {
      this.isRecordShow = true
    },
    handleInsureCompanyChange() {
      console.log('this', this)
      console.log('往年投保this.customer.insureCompany', this.customer.insureCompanyId)
      this.$forceUpdate()
      // this.$set(this.customer, 'insureCompanyId', this.customer.insureCompanyId)
      console.log('设置后的值', this.customer)
      // this.$set(this.customer, 'insureCompanyId', this.customer.insureCompanyId)
    },
    // 处理机构树节点
    normalizer(node) {
      if (node.children && node.children.length === 0) {
        delete node.children
      }
      return {
        id: node.key,
        label: node.title,
        children: node.children
      }
    },
    // 获取业务员
    getSalemanList() {
      if (!this.customer.companyId) {
        this.$message({
          message: '请先选择所属机构',
          type: 'warning'
        })
        return
      }
      this.salemanList.loading = true
      const params = [this.customer.companyId]
      queryCustomerSaleman(params).then(res => {
        this.salemanList.loading = false
        res.data.forEach(item => {
          item.fullName = item.idName + '--' + item.phone
        })
        this.salemanList.data = res.data
      }).catch(err => {
        this.salemanList.loading = false
        console.warn(err)
      })
    },
    // 处理录单操作
    handleFollowInfo() {
      if (this.nextFollowType === 1) {
        this.recodInfoform.nextFollowUpDate = moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
      } else if (this.nextFollowType === 2) {
        this.recodInfoform.nextFollowUpDate = moment().add(2, 'days').format('YYYY-MM-DD HH:mm:ss')
      } else if (this.nextFollowType === 3) {
        this.recodInfoform.nextFollowUpDate = moment().add(3, 'days').format('YYYY-MM-DD HH:mm:ss')
      } else if (this.nextFollowType === 4) {
        this.recodInfoform.nextFollowUpDate = moment().add(7, 'days').format('YYYY-MM-DD HH:mm:ss')
      }
      const params = this.recodInfoform
      this.$refs.followupInfo.validate(valid => {
        if (valid) {
          params.customerId = this.customerId // 客户ID从主页面带过来
          addFollowUpInfo(params).then(res => {
            console.log(res)
            this.$message({
              message: '录入信息成功',
              type: 'success'
            })
            this.$emit('refreshDetail')
            this.isRecordShow = false
            this.$refs.followupInfo.resetFields()
          }).catch(e => {
            console.warn(e)
            // this.isRecordShow = false
          })
        } else {
          console.log('error submit001!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.manual-recording .el-form::after{
   display:block;clear:both;content:"";visibility:hidden;height:0
}
.detail-customer {
  min-width: 1000px;
  padding-right: 15px;
  .item-header{
    margin:20px 0;
    padding:0 10px;
    display:flex;
    justify-content:space-between;
    .edit-btn{
      color:#409EFF;
      font-size:14px;
    }
  }
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
  .el-table td,
  .el-table th {
    padding: 0;
    height: 40px;
    line-height: 40px;
  }
  .el-table th {
    background: #fafafa;
  }
  .prev-insuretable{
      .el-table td, .el-table th.is-leaf{
      border-bottom:none;
    }
  }

  .descript{
    font-size:13px;
    display:flex;
    align-items:center;
    height:30px;
    line-height:30px;
    margin-top:15px;
    .time{
      color:#606266;
      font-weight: 400;
    }
    .status{
      background-color:#E6A23C;
      width: 150px;
      height: 30px;
      border-radius: 3px;
      color:#ffffff;
      text-align:center;
      margin-left:30px;
      margin-right:10px;
    }
    .message{
      color:#606266;
    }
  }
    .first-step{
      display: none;
      .el-step__icon-inner[class*=el-icon]:not(.is-status){
        display: none !important;
      }
    }
    .recordInfo{
      .el-radio+.el-radio{
        margin-left:20px;
      }
    }
    .menu-bar{
      position: fixed;
      right:30px;
      top:50vh;
      width:60px;
      height:180px;
      background-color:#606266;
      border-radius: 10px 0 0 10px;
      color:#ffffff;
      z-index:2000;
      cursor: pointer;
      .txt{
        width:10px;
        vertical-align: middle;
        margin:0 auto;
        margin-top:25px;
        font-size:16px;
        font-weight:400;
      }
    }
}
</style>
