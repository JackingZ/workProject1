<template>
  <!--手动录单 start -->
  <div v-loading="btnLoginShow" class="LRDialogIsShow">
    <div class="dialogWrap" style="padding-bottom:20px;width:100%;margin:auto">
      <el-form id="PolicyInfo" ref="PolicyInfo" :model="PolicyInfo" :rules="tbdataRrules" label-width="100px" class="demo-ruleForm">
        <div class="dialog-list">
          <div class="grid-content">
            <el-form-item prop="policy.companyId" label="保险公司">
              <el-select v-model="PolicyInfo.policy.companyId" :disabled="policyDisapledMap.companyId" placeholder="请选择保险公司" filterable size="small" @change="changeCompang">
                <el-option v-for="item in companylist" :key="item.id" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item prop="policy.channelId" label="选择工号">
              <el-select v-model="PolicyInfo.policy.channelId" :disabled="policyDisapledMap.channelId" filterable clearable placeholder="请选择工号" size="small" @change="changechannelId" @click.native="headlechannelId">
                <el-option v-for="item in channellist" :key="item.id" :label="item.channelName" :value="item.id" />
              </el-select>
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item ref="myTree" prop="policy.team" label="所属团队">
              <my-tree-select :options="treeAllList" :value="PolicyInfo.policy.team" :normalizer="normalizer" :disable-branch-nodes="true" class="ledger-select_organ" no-options-text="数据加载中..." placeholder="选择机构" no-results-text="未找到结果" @close="headleTeamClick" @input="PolicyInfo.policy.team = $event" />
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item label="业务员" prop="policy.userId">
              <el-select v-model="PolicyInfo.policy.userId" placeholder="请选择业务员" size="small" filterable>
                <el-option v-for="item in SalesByCompanylist" :key="item.id" :label="item.idName" :value="item.id" />
              </el-select>
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item prop="policy.policyType" label="保单种类">
              <el-select v-model="PolicyInfo.policy.policyType" :disabled="policyDisapledMap.policyType" placeholder="保单种类不能为空" size="small" @change="handlePolicyType">
                <el-option v-for="item in policyTypelist" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item prop="policy.businessType" label="业务类型">
              <el-select v-model="PolicyInfo.policy.businessType" :disabled="policyDisapledMap.businessType" placeholder="请选择业务类型" size="small">
                <el-option v-for="item in businessTypelist" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </div>
          <div v-if="PolicyInfo.policy.policyType===3||PolicyInfo.policy.policyType===2">
            <h2>交强险：</h2>
            <div class="grid-content">
              <el-form-item prop="policy.tciPolicyNo" label="保单号">
                <el-input v-model="PolicyInfo.policy.tciPolicyNo" :disabled="policyDisapledMap.tciPolicyNo" placeholder="请输入交强险保单号" size="small" @change="handeletciPolicyNo" />
              </el-form-item>
            </div>
            <div class="grid-content">
              <el-form-item prop="policy.tciPremium" label="全保费">
                <el-input v-model="PolicyInfo.policy.tciPremium" :disabled="policyDisapledMap.tciPremium" placeholder="请输入交强险全保费（元）" size="small" @change="handletciPremium" />
              </el-form-item>
            </div>
            <div class="grid-content">
              <el-form-item prop="policy.tciNetPremium" label="净保费">
                <div class="inputjbfbox">{{ (PolicyInfo.policy.tciPremium/1.06).toFixed(2) }}</div>
              </el-form-item>
            </div>
            <div class="grid-content">
              <el-form-item prop="policy.vehicleTax" label="车船税">
                <el-input v-model.number="PolicyInfo.policy.vehicleTax" :disabled="policyDisapledMap.vehicleTax" :precision="2" :step="1" :min="0" placeholder="请输入车船税（元）" size="small" @change="handlevehicleTax" />
              </el-form-item>
            </div>
            <div class="grid-content">
              <el-form-item prop="policy.tciStartDate" label="保险起期">
                <el-date-picker v-model="PolicyInfo.policy.tciStartDate" :disabled="policyDisapledMap.tciStartDate" type="date" placeholder="选择交强险保险起期" format="yyyy 年 MM 月 dd 日" value-format="timestamp" size="small" />
              </el-form-item>
            </div>
            <div class="grid-content">
              <el-form-item prop="policy.tciEndDate" label="保险止期">
                <el-date-picker v-model="PolicyInfo.policy.tciEndDate" :disabled="policyDisapledMap.tciStartDate" :picker-options="picOpttciEndDate" type="date" placeholder="选择交强险保险止期" format="yyyy 年 MM 月 dd 日" value-format="timestamp" size="small" />
              </el-form-item>
            </div>
            <div class="grid-content">
              <el-form-item prop="policy.tciPolicyTime" label="签单时间">
                <el-date-picker v-model="PolicyInfo.policy.tciPolicyTime" :disabled="policyDisapledMap.tciPolicyTime" :picker-options="picOpttciPolicyTime" type="date" placeholder="选择交强险签单时间" format="yyyy 年 MM 月 dd 日" value-format="timestamp" size="small" />
              </el-form-item>
            </div>
            <div class="grid-content">
              <el-form-item prop="policy.tciDiscount" label="保险折扣">
                <el-input-number v-model="PolicyInfo.policy.tciDiscount" :disabled="policyDisapledMap.tciDiscount" :precision="4" :step="1" :min="0" :max="100" size="small" />
              </el-form-item>
            </div>
            <div class="grid-content">
              <el-form-item prop="policy.tciLossOccurredCount" label="出险次数">
                <el-select v-model="PolicyInfo.policy.tciLossOccurredCount" :disabled="policyDisapledMap.tciLossOccurredCount" placeholder="选择交强险出险次数" value-key="tciLossOccurredCount" size="small" clearable>
                  <el-option v-for="item in LossOccurredCountList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div v-if="PolicyInfo.policy.policyType===3||PolicyInfo.policy.policyType===1">
            <h2>商业险：</h2>
            <div class="grid-content">
              <el-form-item prop="policy.vciPolicyNo" label="保单号">
                <el-input v-model="PolicyInfo.policy.vciPolicyNo" :disabled="policyDisapledMap.vciPolicyNo" placeholder="请输入商业险保单号" size="small" @change="handelevciPolicyNo" />
              </el-form-item>
            </div>
            <div class="grid-content">
              <el-form-item prop="policy.vciPremium" label="全保费">
                <el-input v-model="PolicyInfo.policy.vciPremium" :disabled="policyDisapledMap.vciPremium" placeholder="请输入商业险全保费（元）" size="small" @change="handlevciPremium" />
              </el-form-item>
            </div>
            <div class="grid-content">
              <el-form-item prop="policy.vciNetPremium" label="净保费">
                <div class="inputjbfbox">{{ (PolicyInfo.policy.vciPremium/1.06).toFixed(2) }}</div>
              </el-form-item>
            </div>
            <div class="grid-content">
              <el-form-item prop="policy.vciStartDate" label="保险起期">
                <el-date-picker v-model="PolicyInfo.policy.vciStartDate" :disabled="policyDisapledMap.vciStartDate" type="date" placeholder="选择商业险保险起期" format="yyyy 年 MM 月 dd 日" value-format="timestamp" size="small" />
              </el-form-item>
            </div>
            <div class="grid-content">
              <el-form-item prop="policy.vciEndDate" label="保险止期">
                <el-date-picker v-model="PolicyInfo.policy.vciEndDate" :picker-options="picOptvciEndDate" :disabled="policyDisapledMap.vciEndDate" type="date" placeholder="选择商业险保险止期" format="yyyy 年 MM 月 dd 日" value-format="timestamp" size="small" />
              </el-form-item>
            </div>
            <div class="grid-content">
              <el-form-item prop="policy.vciPolicyTime" label="签单时间">
                <el-date-picker v-model="PolicyInfo.policy.vciPolicyTime" :picker-options="picOptvciPolicyTime" :disabled="policyDisapledMap.picOptvciPolicyTime" type="date" placeholder="选择商业险签单时间" format="yyyy 年 MM 月 dd 日" value-format="timestamp" size="small" />
              </el-form-item>
            </div>
            <div class="grid-content">
              <el-form-item prop="policy.vciDiscount" label="折扣">
                <el-input-number v-model="PolicyInfo.policy.vciDiscount" :disabled="policyDisapledMap.vciDiscount" :precision="4" :step="1" :min="0" :max="100" size="small" />
              </el-form-item>
            </div>
            <div class="grid-content">
              <el-form-item prop="policy.vciLossOccurredCount" label="出险次数">
                <el-select v-model="PolicyInfo.policy.vciLossOccurredCount" :disabled="policyDisapledMap.vciLossOccurredCount" value-key="vciLossOccurredCount" placeholder="选择商业险出险次数" size="small" clearable>
                  <el-option v-for="item in LossOccurredCountList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div style="clear:both; padding-top:10px;overflow:hidden;background:#f2f2f2;margin-bottom:10px;border-radius:8px;">
            <div class="grid-content">
              <el-form-item prop="policy.receiveName" label="收件人">
                <el-input v-model="PolicyInfo.policy.receiveName" :disabled="policyDisapledMap.receiveName" placeholder="请输入收件人姓名" size="small" />
              </el-form-item>
            </div>
            <div class="grid-content">
              <el-form-item prop="policy.receivePhone" label="收件人电话">
                <el-input v-model.number="PolicyInfo.policy.receivePhone" :disabled="policyDisapledMap.receivePhone" placeholder="请输入收件人联系电话" size="small" @change="handlereceivePhone" />
              </el-form-item>
            </div>
            <div class="grid-content w-email-input">
              <el-form-item prop="policy.receiveAddress" label="邮寄地址">
                <el-input v-model="PolicyInfo.policy.receiveAddress" :disabled="policyDisapledMap.receiveAddress" placeholder="请输入保单邮寄地址" size="small" />
              </el-form-item>
            </div>
            <div class="grid-content w-common-input">
              <el-form-item prop="policy.common" label="备注信息">
                <el-input v-model="PolicyInfo.policy.common" :disabled="policyDisapledMap.common" placeholder="请输入备注信息" size="small" />
              </el-form-item>
            </div>
          </div>
        </div>
        <el-tabs v-model="activeNameTab" type="card">
          <el-tab-pane label="车辆信息" name="first">
            <div class="dialog-listbox">
              <div class="grid-content">
                <el-form-item prop="vehicle.isNew" label="是否为新车">
                  <el-select v-model="PolicyInfo.vehicle.isNew" :disabled="vehicleDisapledMap.isNew" placeholder="请选择是否为新车" size="small" @change="handleagainValue">
                    <el-option v-for="item in isNewList" :key="item.id" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item ref="againValue" :prop="PolicyInfo.vehicle.isNew===0?'vehicle.licenseNo':''" label="车牌号">
                  <el-input v-model="PolicyInfo.vehicle.licenseNo" :disabled="vehicleDisapledMap.licenseNo" :minlength="6" :maxlength="10" placeholder="请输入车牌号" size="small" @change="checkCarNo" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="vehicle.brandName" label="厂牌型号">
                  <el-input v-model="PolicyInfo.vehicle.brandName" :disabled="vehicleDisapledMap.brandName" :maxlength="20" placeholder="请输入厂牌型号" size="small" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item :prop="PolicyInfo.vehicle.isNew===1? 'vehicle.frameNo':''" label="车架号">
                  <el-input v-model="PolicyInfo.vehicle.frameNo" :disabled="vehicleDisapledMap.frameNo" :minlength="15" :maxlength="17" placeholder="请输入车架号" size="small" @change="handleframeNo" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="vehicle.engineNo" label="发动机号">
                  <el-input v-model="PolicyInfo.vehicle.engineNo" :disabled="vehicleDisapledMap.engineNo" :maxlength="20" placeholder="请输入发动机号" size="small" @change="handleengineNo" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="vehicle.vehicleType" label="车辆类型">
                  <el-select v-model="PolicyInfo.vehicle.vehicleType" :disabled="vehicleDisapledMap.vehicleType" placeholder="请选择交管车辆类型" size="small" filterable>
                    <el-option v-for="item in vehicleTypeList" :key="item.id" :label="item.name" :value="item.code" />
                  </el-select>
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="vehicle.vehicleCategory" label="车辆种类">
                  <el-select v-model="PolicyInfo.vehicle.vehicleCategory" :disabled="vehicleDisapledMap.vehicleCategory" placeholder="请选择车辆种类" size="small" filterable>
                    <el-option v-for="item in vehicleCategoryList" :key="item.id" :label="item.name" :value="item.code" />
                  </el-select>
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="vehicle.plateType" label="号牌种类">
                  <el-select v-model="PolicyInfo.vehicle.plateType" :disabled="vehicleDisapledMap.plateType" placeholder="请选择号牌种类" size="small" filterable clearable>
                    <el-option v-for="item in plateTypeList" :key="item.id" :label="item.name" :value="item.code" />
                  </el-select>
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="vehicle.plateColor" label="号牌底色">
                  <el-select v-model="PolicyInfo.vehicle.plateColor" :disabled="vehicleDisapledMap.plateColor" placeholder="请选择号牌底色" size="small" filterable clearable>
                    <el-option v-for="item in plateColorList" :key="item.id" :label="item.name" :value="item.code" />
                  </el-select>
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="vehicle.energyType" label="能源类型">
                  <el-select v-model="PolicyInfo.vehicle.energyType" :disabled="vehicleDisapledMap.energyType" placeholder="请选择能源类型" size="small" clearable>
                    <el-option v-for="item in energyTypeList" :key="item.id" :label="item.name" :value="item.code" />
                  </el-select>
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="vehicle.useNature" label="使用性质">
                  <el-select v-model="PolicyInfo.vehicle.useNature" :disabled="vehicleDisapledMap.useNature" placeholder="请选择使用性质" size="small">
                    <el-option v-for="item in useNatureList" :key="item.id" :label="item.name" :value="item.code" />
                  </el-select>
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item :prop="PolicyInfo.vehicle.useNature==='100'?'':'vehicle.attachNature'" label="性质细分">
                  <el-select v-model="PolicyInfo.vehicle.attachNature" :disabled="vehicleDisapledMap.attachNature" placeholder="请选择使用性质细分" size="small" filterable clearable>
                    <el-option v-for="item in attachNatureList" :key="item.id" :label="item.name" :value="item.code" />
                  </el-select>
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="vehicle.modelCode" label="车型编码">
                  <el-input v-model="PolicyInfo.vehicle.modelCode" :disabled="vehicleDisapledMap.modelCode" :minlength="4" :maxlength="20" placeholder="请输入车型编码" size="small" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="vehicle.seatCount" label="核定座位数">
                  <el-input-number v-model="PolicyInfo.vehicle.seatCount" :disabled="vehicleDisapledMap.seatCount" :precision="0" :step="1" :min="0" :max="16" size="small" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="vehicle.tonnage" label="核载质量(吨)" class="ralative">
                  <el-input-number v-model="PolicyInfo.vehicle.tonnage" :disabled="vehicleDisapledMap.tonnage" :precision="4" :step="1" :min="0" :max="99" size="small" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="vehicle.curbWeight" label="整备质量(吨)">
                  <el-input-number v-model="PolicyInfo.vehicle.curbWeight" :disabled="vehicleDisapledMap.curbWeight" :precision="4" :step="1" :min="0" :max="999" size="small" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="vehicle.displacement" label="排/功(升/KW)" class="ralative">
                  <el-input-number v-model="PolicyInfo.vehicle.displacement" :disabled="vehicleDisapledMap.displacement" :precision="4" :step="1" :min="0" :max="100" size="small" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="vehicle.purchasePrice" label="新车购置价">
                  <el-input v-model="PolicyInfo.vehicle.purchasePrice" :disabled="vehicleDisapledMap.purchasePrice" placeholder="请输入新车购置价(元)" size="small" @change="handelepurchasePrice" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="vehicle.enrollDate" label="初登日期">
                  <el-date-picker v-model="PolicyInfo.vehicle.enrollDate" :disabled="vehicleDisapledMap.enrollDate" :picker-options="pickerOptionsOLD" type="date" placeholder="选择初登日期" format="yyyy 年 MM 月 dd 日" value-format="timestamp" size="small" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="vehicle.transfer" label="是否过户">
                  <el-select v-model="PolicyInfo.vehicle.transfer" :disabled="vehicleDisapledMap.transfer" placeholder="请选择是否过户" size="small" clearable>
                    <el-option label="否" value="0" />
                    <el-option label="是" value="1" />
                  </el-select>
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="vehicle.transferDate" label="过户日期">
                  <el-date-picker v-model="PolicyInfo.vehicle.transferDate" :disabled="vehicleDisapledMap.transferDate" :picker-options="pickerOptionsOLD" type="date" placeholder="请输入过户日期" format="yyyy 年 MM 月 dd 日" value-format="timestamp" size="small" />
                </el-form-item>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="关系人信息" name="second">
            <h2>车主信息</h2>
            <div class="dialog-listbox">
              <div class="grid-content">
                <el-form-item prop="applicant.ownerName" label="名称">
                  <el-input v-model="PolicyInfo.applicant.ownerName" :disabled="applicantDisapledMap.ownerName" placeholder="请输入车主姓名" size="small" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item label="证件类型" prop="applicant.ownerOptions">
                  <el-cascader :options="applicantNatureList" v-model="PolicyInfo.applicant.ownerOptions" :props="applicantNatureListDF" :disabled="applicantDisapledMap.ownerOptions" size="small" @change="handleownerOptions" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="applicant.ownerIdNo" label="证件号码">
                  <el-input v-model="PolicyInfo.applicant.ownerIdNo" :maxlength="18" :disabled="applicantDisapledMap.ownerIdNo" placeholder="请输入证件号码" size="small" @change="handleownerIdNo" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="applicant.ownerPhone" label="电话">
                  <el-input v-model="PolicyInfo.applicant.ownerPhone" :disabled="applicantDisapledMap.ownerPhone" placeholder="请输入电话" size="small" @change="handleownerPhone" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="applicant.ownerAddr" label="地址">
                  <el-input v-model="PolicyInfo.applicant.ownerAddr" :disabled="applicantDisapledMap.ownerAddr" placeholder="请输入地址" size="small" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="applicant.ownerSex" label="性别">
                  <el-select v-model="PolicyInfo.applicant.ownerSex" :disabled="applicantDisapledMap.ownerSex" placeholder="请选择性别" size="small" clearable>
                    <el-option v-for="item in Sexlist" :label="item.label" :value="item.value" :key="item.value" />
                  </el-select>
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="applicant.ownerBirthday" label="出生日期">
                  <el-date-picker v-model="PolicyInfo.applicant.ownerBirthday" :disabled="applicantDisapledMap.ownerBirthday" type="date" placeholder="请输入出生日期" format="yyyy 年 MM 月 dd 日" value-format="timestamp" size="small" />
                </el-form-item>
              </div>
              <template v-if="szGHCshow">
                <div class="grid-content">
                  <el-form-item prop="applicant.linkmanName" label="双录执行人">
                    <el-input v-model="PolicyInfo.applicant.linkmanName" :disabled="applicantDisapledMap.linkmanName" placeholder="请输入双录执行人" size="small" />
                  </el-form-item>
                </div>
                <div class="grid-content">
                  <el-form-item prop="applicant.linkmanIdNo" label="执行人证件">
                    <el-input v-model="PolicyInfo.applicant.linkmanIdNo" :disabled="applicantDisapledMap.linkmanIdNo" placeholder="请输入双录执行人证件" size="small" @change="handlelinkmanIdNo" />
                  </el-form-item>
                </div>
              </template>
            </div>
            <h2>被保人信息</h2>
            <div class="dialog-listbox">
              <div class="grid-content">
                <el-form-item prop="applicant.insuredName" label="姓名">
                  <el-input v-model="PolicyInfo.applicant.insuredName" :disabled="applicantDisapledMap.insuredName" placeholder="请输入姓名" size="small" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item label="证件类型" prop="applicant.insuredOptions">
                  <el-cascader v-model="PolicyInfo.applicant.insuredOptions" :disabled="applicantDisapledMap.insuredOptions" :options="applicantNatureList" :props="applicantNatureListDF" size="small" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="applicant.insuredIdNo" label="证件号码">
                  <el-input v-model="PolicyInfo.applicant.insuredIdNo" :disabled="applicantDisapledMap.insuredIdNo" placeholder="请输入证件号码" size="small" @change="handleinsuredIdNo" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="applicant.insuredPhone" label="电话">
                  <el-input v-model="PolicyInfo.applicant.insuredPhone" :disabled="applicantDisapledMap.insuredPhone" placeholder="请输入电话" size="small" @change="handleinsuredPhone" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="applicant.insuredAddr" label="地址">
                  <el-input v-model="PolicyInfo.applicant.insuredAddr" :disabled="applicantDisapledMap.insuredAddr" placeholder="请输入地址" size="small" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="applicant.insuredSex" label="性别">
                  <el-select v-model="PolicyInfo.applicant.insuredSex" :disabled="applicantDisapledMap.insuredSex" placeholder="请选择性别" size="small" clearable>
                    <el-option v-for="item in Sexlist" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="applicant.insuredBirthday" label="出生日期">
                  <el-date-picker v-model="PolicyInfo.applicant.insuredBirthday" :disabled="applicantDisapledMap.insuredBirthday" type="date" format="yyyy 年 MM 月 dd 日" placeholder="请输入出生日期" value-format="timestamp" size="small" />
                </el-form-item>
              </div>
            </div>
            <h2>投保人信息</h2>
            <div class="dialog-listbox">
              <div class="grid-content">
                <el-form-item prop="applicant.holderName" label="姓名">
                  <el-input v-model="PolicyInfo.applicant.holderName" :disabled="applicantDisapledMap.holderName" placeholder="请输入姓名" size="small" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="applicant.holderOptions" label="证件类型">
                  <el-cascader v-model="PolicyInfo.applicant.holderOptions" :disabled="applicantDisapledMap.holderOptions" :options="applicantNatureList" :props="applicantNatureListDF" size="small" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="applicant.holderIdNo" label="证件号码">
                  <el-input v-model="PolicyInfo.applicant.holderIdNo" :disabled="applicantDisapledMap.holderIdNo" :maxlength="18" placeholder="请输入证件号码" size="small" @change="handleholderIdNo" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="applicant.holderPhone" label="电话">
                  <el-input v-model="PolicyInfo.applicant.holderPhone" :disabled="applicantDisapledMap.holderPhone" placeholder="请输入电话" size="small" @change="handleholderPhone" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="applicant.holderAddr" label="地址">
                  <el-input v-model="PolicyInfo.applicant.holderAddr" :disabled="applicantDisapledMap.holderAddr" placeholder="请输入地址" size="small" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="applicant.holderSex" label="性别">
                  <el-select v-model="PolicyInfo.applicant.holderSex" :disabled="applicantDisapledMap.holderSex" placeholder="请选择性别" clearable size="small">
                    <el-option v-for="item in Sexlist" :label="item.label" :value="item.value" :key="item.value" />
                  </el-select>
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="applicant.holderBirthday" label="出生日期">
                  <el-date-picker v-model="PolicyInfo.applicant.holderBirthday" :disabled="applicantDisapledMap.holderBirthday" type="date" placeholder="请输入出生日期" format="yyyy 年 MM 月 dd 日" value-format="timestamp" size="small" />
                </el-form-item>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="SZcodeID===10002" label="销售人员信息" name="third">
            <div class="dialog-listbox">
              <div class="grid-content">
                <el-form-item prop="applicant.salesmanName" label="姓名">
                  <el-input v-model="PolicyInfo.applicant.salesmanName" :disabled="applicantDisapledMap.salesmanName" placeholder="请输入销售人员姓名" size="small" />
                </el-form-item>
              </div>
              <div class="grid-content">
                <el-form-item prop="applicant.salesmanIdNo" label="身份证号">
                  <el-input v-model="PolicyInfo.applicant.salesmanIdNo" :disabled="applicantDisapledMap.salesmanIdNo" placeholder="请输入销售人员身份证号" size="small" />
                </el-form-item>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="PolicyInfo.policy.policyType!==2" label="险种明细" name="fourth">
            <div style="position:relative">
              <div v-if="Riskshow" class="Riskshow" />
              <h2><i class="el-icon-document">&nbsp;</i>主险条款</h2>
              <el-table ref="multipleTable01" :data="mainRisklist" tooltip-effect="dark" row-key="getRowKeys" style="width: 100%" class="tableBxAll" @selection-change="handleSelectionChange01">
                <el-table-column type="selection" width="55" label="选择" />
                <el-table-column prop="riskName" label="项目" show-overflow-tooltip align="left" />
                <el-table-column label="保额">
                  <template slot-scope="scope">
                    <div v-if="scope.row.riskCode==='a4'" class="table-quantity">
                      <el-input v-model="scope.row.quantity" :maxlength="2" size="small" />
                      <div class="table-quantity-tips">座*</div>
                      <el-select v-model="scope.row.unitAmount" class="tableBxAllinput" placeholder="请选择保额" size="small">
                        <el-option v-for="item in scope.row.riskConfigs" :key="item.value" :label="item.name" :value="item.value" />
                      </el-select>
                    </div>
                    <div v-else>
                      <el-select v-if="scope.row.riskConfigs!==undefined" v-model="scope.row.amount" class="tableBxAllinput" placeholder="请选择保额" clearable size="small">
                        <el-option v-for="item in scope.row.riskConfigs" :key="item.value" :label="item.name" :value="item.value" />
                      </el-select>
                      <el-input v-else v-model="scope.row.amount" type="text" class="tableBxAllinput" placeholder="请输入保额" size="small" @change="risksamount(scope.row)" />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="保单保费">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.premium" type="text" placeholder="请输入保单保费" class="tableBxAllinput" size="small" @change="riskspremium(scope.row)" />
                  </template>
                </el-table-column>
                <el-table-column label="是否投保不计免" width="140">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.isDeductible" active-value="1" inactive-value="0" size="small" @change="handleisDeductible(scope.row)" />
                  </template>
                </el-table-column>
                <el-table-column label="不计免保费">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.deductPremium" type="text" placeholder="请输入保单保费" class="tableBxAllinput" size="small" @input="inputisdeductPremium(scope.row)" @change="handleisdeductPremium(scope.row)" />
                  </template>
                </el-table-column>
              </el-table>
              <h2><i class="el-icon-document">&nbsp;</i>附加险及其特约条款</h2>
              <el-table ref="multipleTable02" :data="additionalRisklist" tooltip-effect="dark" style="width: 100%" class="tableBxAll" @selection-change="handleSelectionChange02">
                <el-table-column type="selection" width="55" label="选择" />
                <el-table-column prop="riskName" label="项目" show-overflow-tooltip align="left" />
                <el-table-column label="保额">
                  <template slot-scope="scope">
                    <div v-if="scope.row.riskCode==='a6'">
                      <el-select v-model="scope.row.glassType" clearable class="tableBxAllinput" placeholder="选择类型" size="small">
                        <el-option v-for="item in scope.row.riskConfigs" :key="item.value" :label="item.name" :value="item.value" />
                      </el-select>
                    </div>
                    <div v-else>
                      <el-select v-if="scope.row.riskConfigs!==undefined" v-model="scope.row.amount" class="tableBxAllinput" placeholder="请选择保额" size="small" clearable>
                        <el-option v-for="item in scope.row.riskConfigs" :key="item.value" :label="item.name" :value="item.value" />
                      </el-select>
                      <el-input v-else v-model="scope.row.amount" type="text" placeholder="请输入保额" class="tableBxAllinput" size="small" @change="risksamount(scope.row)" />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="保单保费">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.premium" placeholder="请输入保单保费" class="tableBxAllinput" size="small" @change="riskspremium(scope.row)" />
                  </template>
                </el-table-column>
                <el-table-column label="是否投保不计免" width="140">
                  <template slot-scope="scope">
                    <el-switch v-if="scope.row.sdew===0" v-model="scope.row.isDeductible" :active-value="1" :inactive-value="0" size="small" @change="handleisDeductible(scope.row)" />
                  </template>
                </el-table-column>
                <el-table-column label="不计免保费">
                  <template slot-scope="scope">
                    <el-input v-if="scope.row.sdew==0" v-model="scope.row.deductPremium" placeholder="请输入保单保费" class="tableBxAllinput" size="small" @input="inputisdeductPremium(scope.row)" @change="handleisdeductPremium(scope.row)" />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="false" name="five" label="证件照">证件照</el-tab-pane>
        </el-tabs>
        <div class="form-btn">
          <el-button size="small" type="primary" @click="submitForm('PolicyInfo')">提交保单</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { PolicyInfo, tbdataRrules } from '@/utils/policydata'
import {
  policyBelongCompany,
  getChannelListData,
  getquerySalesByCompanyId,
  getbaseInfo,
  YZpolicyExist,
  getBdinput
} from '@/api/mytask'
import { getCompanyEffective } from '@/api/ledger'
import MyTreeSelect from '@/components/MyTreeSelect/index'
export default {
  name: 'Edit',
  components: {
    MyTreeSelect
  },
  props: {
    putOneCaptureList: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      PolicyInfo: PolicyInfo(),
      tbdataRrules,
      pickerOptionsOLD: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      picOpttciEndDate: {
        disabledDate: time => {
          const beginDateVal = this.PolicyInfo.policy.tciStartDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal
          }
        }
      },
      picOptvciEndDate: {
        disabledDate: time => {
          const beginDateValvci = this.PolicyInfo.policy.vciStartDate
          if (beginDateValvci) {
            return time.getTime() < beginDateValvci
          }
        }
      },
      picOptvciPolicyTime: {
        disabledDate: time => {
          const beginDateValvci = this.PolicyInfo.policy.vciStartDate
          if (beginDateValvci) {
            return time.getTime() > beginDateValvci
          }
        }
      },
      picOpttciPolicyTime: {
        disabledDate: time => {
          const beginDateValvci = this.PolicyInfo.policy.tciStartDate
          if (beginDateValvci) {
            return time.getTime() > beginDateValvci
          }
        }
      },
      // 是否新车
      isNewList: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ],
      // 保单种类循环
      policyTypelist: [
        {
          label: '商业险',
          value: 1
        },
        {
          label: '交强险',
          value: 2
        },
        {
          label: '交商共保',
          value: 3
        }
      ],
      // 业务类型循环
      businessTypelist: [
        {
          label: '新保',
          value: '1'
        },
        {
          label: '续保',
          value: '2'
        },
        {
          label: '交商转保共保',
          value: '3'
        },
        {
          label: '旧车首保',
          value: '4'
        }
      ],
      // 保险类型循环
      LossOccurredCountList: [
        {
          label: '连续三年未出险',
          value: -3
        },
        {
          label: '连续两年未出险',
          value: -2
        },
        {
          label: '上年未出险',
          value: -1
        },
        {
          label: '出险一次',
          value: 1
        },
        {
          label: '出险两次',
          value: 2
        },
        {
          label: '出险三次',
          value: 3
        }
      ],
      // 性别循环
      Sexlist: [
        {
          label: '男',
          value: 1
        },
        {
          label: '女',
          value: 2
        }
      ],
      premium: '', // 保单保费
      amount: '', // 保额
      isDeductible: '', // 不计免赔0没有，1有
      deductPremium: '', // 折扣
      companylist: [],
      treeAllList: [],
      BDdefaultProps: {
        label: 'title',
        value: 'id',
        key: 'id'
      },
      changeIdHB: '其他',
      changeIdTHB: '其他',
      channellist: [],
      childOfTeamlist: [],
      SalesByCompanylist: [],
      isHideBox: false,
      cdTextName: '',
      multipleSelection: [],
      applicantNatureList: [],
      applicantNatureListDF: {
        label: 'name',
        value: 'code'
      },
      vehicleCategoryList: [],
      plateColorList: [],
      plateTypeList: [],
      mainRisk: [],
      additionalRisk: [],
      mainRisklist: [],
      additionalRisklist: [],
      attachNatureList: [],
      energyTypeList: [],
      useNatureList: [],
      vehicleTypeList: [],
      SZcodeID: '',
      LDDialogtitle: '录入保单',
      activeNameTab: 'first',
      szGHCshow: false,
      btnLoginShow: false,
      Riskshow: false,
      // 禁止编辑
      policyDisapledMap: '',
      vehicleDisapledMap: '',
      applicantDisapledMap: ''
    }
  },
  watch: {
    'PolicyInfo.policy.team': function(val) {
      const myTree = this.$refs.myTree
      if (myTree.unFristRender) {
        myTree.$emit.apply(myTree, ['el.form.change'].concat(val))
      } else {
        myTree.unFristRender = true
      }
    }
  },
  created() {
    this.btnLRBD()
  },
  methods: {
    // 深圳工号出的公户车才显示执行人双录执行人证件号
    handleownerOptions(value) {
      const Optionsone = value[0]
      if (
        (Optionsone === '200' || Optionsone === '300') &&
        this.SZcodeID === 10002
      ) {
        this.szGHCshow = true
      } else {
        this.szGHCshow = false
      }
    },
    // 保单明细不计免
    handleisdeductPremium(row) {
      const reg = /^\d+(?=\.{0,1}\d+$|$)/
      if (row.deductPremium && new RegExp(reg).test(row.deductPremium)) {
        this.errorTip = false
        row.deductPremium = parseFloat(row.deductPremium).toFixed(2)
      } else {
        this.$message({
          message: '请输入正确的数值',
          type: 'warning'
        })
        row.deductPremium = ''
      }
    },
    // 执行人证件号
    handlelinkmanIdNo(value) {
      const reg = /^[a-z0-9]+$/i
      if (value && new RegExp(reg).test(value)) {
        this.errorTip = false
      } else {
        this.$message({
          message: '请输入正确的发动机号，只能是英文字母或数字，不能输入中文。',
          type: 'warning'
        })
        this.PolicyInfo.applicant.linkmanIdNo = ''
      }
    },
    // 发动机号不能输入中文
    handleengineNo(value) {
      const reg = /^[a-z0-9]+$/i
      if (value && new RegExp(reg).test(value)) {
        this.errorTip = false
      } else {
        this.$message({
          message: '请输入正确的发动机号，只能是英文字母或数字，不能输入中文。',
          type: 'warning'
        })
        this.PolicyInfo.vehicle.engineNo = ''
      }
    },
    // 车架号不能输入中文
    handleframeNo(value) {
      const reg = /^[a-z0-9]+$/i
      if (value && new RegExp(reg).test(value)) {
        this.errorTip = false
      } else {
        this.$message({
          message: '请输入正确的发动机号，只能是英文字母或数字，不能输入中文。',
          type: 'warning'
        })
        this.PolicyInfo.vehicle.frameNo = ''
      }
    },
    // 投保人电话
    handleholderPhone(value) {
      const reg = /^[\d-]+$/
      if (value && new RegExp(reg).test(value)) {
        this.errorTip = false
      } else {
        this.$message({
          message: '请输入正确电话号码数字！不能包含符号和中文!',
          type: 'warning'
        })
        this.PolicyInfo.applicant.holderPhone = ''
      }
    },
    // 被保人电话
    handleinsuredPhone(value) {
      const reg = /^[\d-]+$/
      if (value && new RegExp(reg).test(value)) {
        this.errorTip = false
      } else {
        this.$message({
          message: '请输入正确电话号码数字！不能包含符号和中文!',
          type: 'warning'
        })
        this.PolicyInfo.applicant.insuredPhone = ''
      }
    },
    // 车主电话
    handleownerPhone(value) {
      const reg = /^[\d-]+$/
      if (value && new RegExp(reg).test(value)) {
        this.errorTip = false
      } else {
        this.$message({
          message: '请输入正确电话号码数字！不能包含符号和中文!',
          type: 'warning'
        })
        this.PolicyInfo.applicant.ownerPhone = ''
      }
    },
    // 收件人电话
    handlereceivePhone(value) {
      const reg = /^[\d-]+$/
      if (value && new RegExp(reg).test(value)) {
        this.errorTip = false
      } else {
        this.$message({
          message: '请输入正确电话号码数字！',
          type: 'warning'
        })
        this.PolicyInfo.policy.receivePhone = ''
      }
    },
    // 新车购置价
    handelepurchasePrice(value) {
      const reg = /^\d+(?=\.{0,1}\d+$|$)/
      if (value && new RegExp(reg).test(value)) {
        this.errorTip = false
        this.PolicyInfo.vehicle.purchasePrice = parseFloat(
          this.PolicyInfo.vehicle.purchasePrice
        ).toFixed(2)
      } else {
        this.$message({
          message: '请输入正确的数值（大于0的正数）。',
          type: 'warning'
        })
        this.PolicyInfo.vehicle.purchasePrice = ''
      }
    },
    // 保单明细保费保留两位小数
    riskspremium(row) {
      const reg = /^\d+(?=\.{0,1}\d+$|$)/
      if (row.premium && new RegExp(reg).test(row.premium)) {
        this.errorTip = false
        row.premium = parseFloat(row.premium).toFixed(2)
      } else {
        this.$message({
          message: '请输入正确的数值（大于0的正数）。',
          type: 'warning'
        })
        row.premium = ''
      }
    },
    // 保单明细保额保留两位小数
    risksamount(row) {
      const reg = /^\d+(?=\.{0,1}\d+$|$)/
      if (row.amount && new RegExp(reg).test(row.amount)) {
        this.errorTip = false
        row.amount = parseFloat(row.amount).toFixed(2)
      } else {
        this.$message({
          message: '请输入正确的数值（大于0的正数）。',
          type: 'warning'
        })
        row.amount = ''
      }
    },
    // 商业险全保费保留两位小数
    handlevciPremium(value) {
      const reg = /^\d+(?=\.{0,1}\d+$|$)/
      if (value && new RegExp(reg).test(value)) {
        this.errorTip = false
        this.PolicyInfo.policy.vciPremium = parseFloat(
          this.PolicyInfo.policy.vciPremium
        ).toFixed(2)
      } else {
        this.$message({
          message: '请输入正确的数值（大于0的正数）。',
          type: 'warning'
        })
        this.PolicyInfo.policy.vciPremium = ''
      }
    },
    // 交强险车船税保留两位数
    handlevehicleTax(value) {
      const reg = /^\d+(?=\.{0,1}\d+$|$)/
      if (value && new RegExp(reg).test(value)) {
        this.errorTip = false
        this.PolicyInfo.policy.vehicleTax = parseFloat(
          this.PolicyInfo.policy.vehicleTax
        ).toFixed(2)
      } else {
        this.$message({
          message: '请输入正确的数值（大于0的正数）。',
          type: 'warning'
        })
        this.PolicyInfo.policy.vehicleTax = ''
      }
    },
    // 交强险全保费保留两位数
    handletciPremium(value) {
      const reg = /^\d+(?=\.{0,1}\d+$|$)/
      if (value && new RegExp(reg).test(value)) {
        this.PolicyInfo.policy.tciPremium = parseFloat(
          this.PolicyInfo.policy.tciPremium
        ).toFixed(2)
      } else {
        this.$message({
          message: '请输入正确的数值（大于0的正数）。',
          type: 'warning'
        })
        this.PolicyInfo.policy.tciPremium = ''
      }
    },
    // 车牌检测
    checkCarNo(value) {
      const reg = /^(([\u4e00-\u9fa5]{1}[A-Z]{1})[-]?|([wW][Jj][\u4e00-\u9fa5]{1}[-]?)|([a-zA-Z]{2}))([A-Za-z0-9]{5}|[DdFf][A-HJ-NP-Za-hj-np-z0-9][0-9]{4}|[0-9]{5}[DdFf])$/
      if (value && new RegExp(reg).test(value)) {
        this.errorTip = false
      } else {
        this.$message({
          message: '请输入正确的车牌',
          type: 'warning'
        })
        this.PolicyInfo.vehicle.licenseNo = ''
      }
    },
    handleagainValue(val) {
      this.$refs.againValue.clearValidate()
    },
    // 切换保单种类清空其他的保险选项
    handlePolicyType(data) {
      // 1交强，2商业，3，交商共保
      if (data === 1) {
        this.PolicyInfo.policy.tciDiscount = '' // 交强险折扣 number
        this.PolicyInfo.policy.tciEndDate = '' // 交强险保险止期2018-09-13T02:30:51.657Z
        this.PolicyInfo.policy.tciLossOccurredCount = null // 交强险出险次数 string
        this.PolicyInfo.policy.tciPolicyNo = '' // 交强保单号 string
        this.PolicyInfo.policy.tciPolicyTime = '' // 交强险签单时间 string
        this.PolicyInfo.policy.tciPremium = '' // 交强险全保费 number
        this.PolicyInfo.policy.tciStartDate = '' // 交强险保险起期 ,string
        this.PolicyInfo.policy.vehicleTax = '' // 车船税number
      } else if (data === 2) {
        this.PolicyInfo.policy.vciDiscount = ''
        this.PolicyInfo.policy.vciEndDate = ''
        this.PolicyInfo.policy.vciLossOccurredCount = ''
        this.PolicyInfo.policy.vciPolicyNo = ''
        this.PolicyInfo.policy.vciPolicyTime = ''
        this.PolicyInfo.policy.vciPremium = ''
        this.PolicyInfo.policy.vciStartDate = ''
      } else {
        getbaseInfo().then(res => {
          // 主险
          this.mainRisklist = res.data.mainRisk
          // 附加险
          this.additionalRisk = res.data.additionalRisk
        })
      }
    },
    // 保单明细不计免未否时清空不计免保额
    handleisDeductible(row) {
      if (row.isDeductible === '0') {
        row.deductPremium = ''
      }
    },
    // 保单明细不计免有值时自动勾选
    inputisdeductPremium(row) {
      if (row.deductPremium !== '') {
        row.isDeductible = '1'
        // 有值自动勾选
        this.$nextTick(() => {
          this.$refs.multipleTable01.toggleRowSelection(row, true)
        })
      } else {
        row.isDeductible = '0'
      }
    },
    // 根据身份证获取出生日期，性别
    handleownerIdNo(data) {
      const reg = /^[a-z0-9]+$/i
      if (data && new RegExp(reg).test(data)) {
        this.errorTip = false
      } else {
        this.$message({
          message: '证件号，只能是英文字母或数字，不能输入中文。',
          type: 'warning'
        })
        this.PolicyInfo.applicant.ownerIdNo = ''
      }
      const Optionsone = this.PolicyInfo.applicant.ownerOptions[0]
      const Optionstwo = this.PolicyInfo.applicant.ownerOptions[1]
      const that = this
      let birthday = ''
      if (Optionsone === '100' && Optionstwo === '101') {
        if (data.length === 18) {
          birthday = data.substr(6, 8)
          if (parseInt(data.substr(16, 1)) % 2 === 1) {
            that.PolicyInfo.applicant.ownerSex = 1
          } else {
            that.PolicyInfo.applicant.ownerSex = 2
          }
        }
        birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
        that.PolicyInfo.applicant.ownerBirthday = new Date(birthday).getTime()
      }
    },
    handleinsuredIdNo(data) {
      const reg = /^[a-z0-9]+$/i
      if (!data && new RegExp(reg).test(data)) {
        this.$message({
          message: '证件号，只能是英文字母或数字，不能输入中文。',
          type: 'warning'
        })
        this.PolicyInfo.applicant.insuredIdNo = ''
      }
      const Optionsone = this.PolicyInfo.applicant.insuredOptions[0]
      const Optionstwo = this.PolicyInfo.applicant.insuredOptions[1]
      const that = this
      let birthday = ''
      if (Optionsone === '100' && Optionstwo === '101') {
        if (data.length === 18) {
          birthday = data.substr(6, 8)
          if (parseInt(data.substr(16, 1)) % 2 === 1) {
            that.PolicyInfo.applicant.insuredSex = 1
          } else {
            that.PolicyInfo.applicant.insuredSex = 2
          }
        }
        birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
        that.PolicyInfo.applicant.insuredBirthday = new Date(birthday).getTime()
      }
    },
    handleholderIdNo(data) {
      const reg = /^[a-z0-9]+$/i
      if (!data && new RegExp(reg).test(data)) {
        this.$message({
          message: '证件号，只能是英文字母或数字，不能输入中文。',
          type: 'warning'
        })
        this.PolicyInfo.applicant.holderIdNo = ''
      }
      const Optionsone = this.PolicyInfo.applicant.holderOptions[0]
      const Optionstwo = this.PolicyInfo.applicant.holderOptions[1]
      const that = this
      let birthday = ''
      if (Optionsone === '100' && Optionstwo === '101') {
        if (data.length === 18) {
          birthday = data.substr(6, 8)
          if (parseInt(data.substr(16, 1)) % 2 === 1) {
            that.PolicyInfo.applicant.holderSex = 1
          } else {
            that.PolicyInfo.applicant.holderSex = 2
          }
        }
        birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
        that.PolicyInfo.applicant.holderBirthday = new Date(birthday).getTime()
      }
    },
    // 根据保单号验证保单是否存在
    handeletciPolicyNo(data) {
      const Paramsdata = data
      YZpolicyExist(Paramsdata).then(res => {
        if (res.data === true) {
          this.$alert('<strong>该条保单已存在请不要重复提交</strong>', '警告', {
            dangerouslyUseHTMLString: true
          })
        }
      })
      const reg = /^[^\u4e00-\u9fa5]*$/
      if (data && new RegExp(reg).test(data)) {
        this.errorTip = false
      } else {
        this.$message({
          message: '不能输入中文！',
          type: 'warning'
        })
        this.PolicyInfo.policy.tciPolicyNo = ''
      }
    },
    handelevciPolicyNo(data) {
      const Paramsdata = data
      YZpolicyExist(Paramsdata).then(res => {
        if (res.data === true) {
          this.$alert('<strong>该条保单已存在请不要重复提交</strong>', '警告', {
            dangerouslyUseHTMLString: true
          })
        }
      })
      const reg = /^[^\u4e00-\u9fa5]*$/
      if (data && new RegExp(reg).test(data)) {
        this.errorTip = false
      } else {
        this.$message({
          message: '不能输入中文！',
          type: 'warning'
        })
        this.PolicyInfo.policy.vciPolicyNo = ''
      }
    },
    // 选择工号如果没有选择保险公司提示选择保险公司
    headlechannelId() {
      if (this.PolicyInfo.policy.companyId === '') {
        this.$message.error('请先选择保险公司！')
      }
    },
    // 根据保险公司ID获取工号列表
    changeCompang(data) {
      const blcs = this.$store.getters.userAll.data.belongCompanys
      const maxItem = blcs.sort((a, b) => b.level - a.level)[0]
      getChannelListData({ belongCompanys: [maxItem.id] }, data).then(res => {
        this.channellist = res.data
      })
    },
    // 获取深圳工号id
    changechannelId(data) {
      const choosenItem = this.channellist.filter(item => item.id === data)[0]
      this.SZcodeID = choosenItem.areaCode
    },
    // 获取点击的业务员这个是为了传给后台用的。
    changeuserId(data) {
      const userIdItem = this.SalesByCompanylist.filter(
        item => item.id === data
      )[0]
      this.comuserName = userIdItem.idName
    },
    // 选择保单主险列表
    handleSelectionChange01(val) {
      this.multipleSelection01 = val
    },
    // 选择附加主险列表
    handleSelectionChange02(val) {
      this.multipleSelection02 = val
      if (val[val.length - 1] !== '' && val[val.length - 1] !== undefined) {
        const checkCodeID = val[val.length - 1].checkCode
        this.mainRisklist.forEach(item => {
          if (item.riskCode === checkCodeID) {
            if (!item.premium) {
              this.$message({
                message: '警告！选择此险种 ' + item.riskName + ' 为必选',
                type: 'warning'
              })
            }
            this.$nextTick(() => {
              this.$refs.multipleTable01.toggleRowSelection(item, true)
            })
          }
        })
      }
    },
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
    // 获取团队id  给业务员
    headleTeamClick(value) {
      getquerySalesByCompanyId(value)
        .then(res => {
          this.SalesByCompanylist = res.data
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 点击展开录入保单
    async btnLRBD() {
      // 保险遮罩
      this.Riskshow = true
      // 拷贝抓取的内容 实现 禁止
      // this.disable = JSON.parse(JSON.stringify(this.putOneCaptureList))
      // 保险公司列表
      const blcs = this.$store.getters.userAll.data.belongCompanys
      const maxItem = blcs.sort((a, b) => b.level - a.level)[0]
      const resCompangList = await policyBelongCompany({
        belongCompanys: [maxItem.id]
      })
      this.companylist = resCompangList.data
      // 团队获取
      const CompanyEffective = await getCompanyEffective()
      this.treeAllList = CompanyEffective.data
      // 获取保单详情
      const resBaseInfo = await getbaseInfo()
      // 所属性质和证件种类
      this.applicantNatureList = resBaseInfo.data.applicantNatureList
      // 交管车辆类型
      this.vehicleTypeList = resBaseInfo.data.vehicleTypeList
      // 车辆种类
      this.vehicleCategoryList = resBaseInfo.data.vehicleCategoryList
      // 车牌颜色
      this.plateColorList = resBaseInfo.data.plateColorList
      // 号牌种类
      this.plateTypeList = resBaseInfo.data.plateTypeList
      // 保险类型
      // 主险
      this.mainRisklist = resBaseInfo.data.mainRisk
      // 附加险
      this.additionalRisklist = resBaseInfo.data.additionalRisk
      // 使用性质细分
      this.attachNatureList = resBaseInfo.data.attachNatureList
      // 能源类型
      this.energyTypeList = resBaseInfo.data.energyTypeList
      // 使用性质
      this.useNatureList = resBaseInfo.data.useNatureList
      // 获取到数据
      const defaultVal = PolicyInfo()
      this.PolicyInfo = { ...defaultVal, ...(this.putOneCaptureList || {}) }
      // 这个是禁止编辑
      this.policyDisapledMap = this.putOneCaptureList.policy.disapledMap
      this.applicantDisapledMap = this.putOneCaptureList.applicant.disapledMap
      this.vehicleDisapledMap = this.putOneCaptureList.vehicle.disapledMap
      if (
        this.putOneCaptureList.policy.companyId !== '' &&
        this.putOneCaptureList.policy.companyId !== undefined
      ) {
        this.PolicyInfo.policy.companyId = this.putOneCaptureList.policy.companyId.toString()
      }
      if (
        this.putOneCaptureList.policy.businessType !== '' &&
        this.putOneCaptureList.policy.businessType !== undefined
      ) {
        this.PolicyInfo.policy.businessType = this.putOneCaptureList.policy.businessType.toString()
      }
      // 保单保费还原
      if (this.PolicyInfo.policy.policyType !== 2) {
        // 主险 mainRisk
        // 附加险 additionalRisk
        const arr1 = this.putOneCaptureList.risks
        const arr2 = this.mainRisklist
        const arr3 = this.additionalRisklist
        arr1.forEach(box => {
          arr2.forEach(item01 => {
            if (item01.riskCode === box.riskCode) {
              item01.amount = box.amount
              item01.premium = box.premium
              if (box.isDeductible !== undefined) {
                item01.isDeductible = box.isDeductible.toString()
              }
              item01.deductPremium = box.deductPremium
              item01.quantity = box.quantity
              item01.unitAmount = box.unitAmount
            }
          })
          arr3.forEach(item02 => {
            if (item02.riskCode === box.riskCode) {
              item02.amount = box.amount
              item02.premium = box.premium
              if (box.isDeductible !== undefined) {
                item02.isDeductible = box.isDeductible.toString()
              }
              item02.deductPremium = box.deductPremium
              if (box.glassType !== undefined) {
                item02.glassType = box.glassType.toString()
              }
            }
          })
        })

        this.mainRisklist.forEach((row, index) => {
          // 通过risksPremium是否有值判断是否是选中
          if (row.premium) {
            this.$nextTick(() => {
              this.$refs.multipleTable01.toggleRowSelection(row, true)
            })
          }
        })
        this.additionalRisklist.forEach((row, index) => {
          // 通过risksPremium是否有值判断是否是选中
          if (row.premium) {
            this.$nextTick(() => {
              this.$refs.multipleTable02.toggleRowSelection(row, true)
            })
          }
        })
      }
      // 性别年龄还原
      const ownerOptionsone = this.putOneCaptureList.applicant.ownerOptions[0]
      const ownerOptionstwo = this.putOneCaptureList.applicant.ownerOptions[1]
      const that = this
      let ownerbirthday = ''
      // const ownersex = ''
      if (ownerOptionsone === '100' && ownerOptionstwo === '101') {
        if (this.putOneCaptureList.applicant.ownerIdNo.length === 18) {
          ownerbirthday = this.putOneCaptureList.applicant.ownerIdNo.substr(
            6,
            8
          )
          if (
            parseInt(this.putOneCaptureList.applicant.ownerIdNo.substr(16, 1)) %
              2 ===
            1
          ) {
            that.PolicyInfo.applicant.ownerSex = 1
          } else {
            that.PolicyInfo.applicant.ownerSex = 2
          }
          that.disabledshowOwner = true
        }
        ownerbirthday = ownerbirthday.replace(/(.{4})(.{2})/, '$1-$2-')
        that.PolicyInfo.applicant.ownerBirthday = new Date(
          ownerbirthday
        ).getTime()
      }

      const holderOptionsone = this.putOneCaptureList.applicant.holderOptions[0]
      const holderOptionstwo = this.putOneCaptureList.applicant.holderOptions[1]
      let holderbirthday = ''
      // const holdersex = ''
      if (holderOptionsone === '100' && holderOptionstwo === '101') {
        if (this.putOneCaptureList.applicant.holderIdNo.length === 18) {
          holderbirthday = this.putOneCaptureList.applicant.holderIdNo.substr(
            6,
            8
          )
          if (
            parseInt(
              this.putOneCaptureList.applicant.holderIdNo.substr(16, 1)
            ) %
              2 ===
            1
          ) {
            that.PolicyInfo.applicant.holderSex = 1
          } else {
            that.PolicyInfo.applicant.holderSex = 2
          }
          that.disabledshowHolder = true
        }
        holderbirthday = holderbirthday.replace(/(.{4})(.{2})/, '$1-$2-')
        that.PolicyInfo.applicant.holderBirthday = new Date(
          holderbirthday
        ).getTime()
      }

      const insuredOptionsone = this.putOneCaptureList.applicant
        .insuredOptions[0]
      const insuredOptionstwo = this.putOneCaptureList.applicant
        .insuredOptions[1]
      let insuredbirthday = ''
      // const insuredsex = ''
      if (insuredOptionsone === '100' && insuredOptionstwo === '101') {
        if (this.putOneCaptureList.applicant.insuredIdNo.length === 18) {
          insuredbirthday = this.putOneCaptureList.applicant.insuredIdNo.substr(
            6,
            8
          )
          if (
            parseInt(
              this.putOneCaptureList.applicant.insuredIdNo.substr(16, 1)
            ) %
              2 ===
            1
          ) {
            that.PolicyInfo.applicant.insuredSex = 1
          } else {
            that.PolicyInfo.applicant.insuredSex = 2
          }
          that.disabledshowInsured = true
        }
        insuredbirthday = insuredbirthday.replace(/(.{4})(.{2})/, '$1-$2-')
        that.PolicyInfo.applicant.insuredBirthday = new Date(
          insuredbirthday
        ).getTime()
      }
      // 公司获取是否是深圳工号
      if (this.putOneCaptureList.policy.companyId) {
        const CompanysURL = this.putOneCaptureList.policy.companyId
        // 根据机构id查询关联工号
        // var channellistItemBOX = this.putOneCaptureList.policy.channelId
        const blcs = this.$store.getters.userAll.data.belongCompanys
        const maxItem = blcs.sort((a, b) => b.level - a.level)[0]
        const ChannelListData = await getChannelListData(
          { belongCompanys: [maxItem.id] },
          CompanysURL
        )
        this.channellist = ChannelListData.data
      }
      // 所属团队
      const channel = 'channel'
      for (let index = 6; index >= 0; index--) {
        const maxchannel = this.putOneCaptureList.policy[channel + index]
        if (maxchannel) {
          this.PolicyInfo.policy.team = maxchannel.toString()
          break
        }
      }
      const TreeIdteam = this.PolicyInfo.policy.team
      const SalesByCompanylist = await getquerySalesByCompanyId(TreeIdteam)
      this.SalesByCompanylist = SalesByCompanylist.data
      // 双录执行人姓名
      if (
        this.putOneCaptureList.other !== undefined &&
        this.putOneCaptureList.other.linkmanName !== undefined
      ) {
        this.PolicyInfo.applicant.linkmanName = this.putOneCaptureList.other.linkmanName
      }
      // 双录执行人姓名
      if (
        this.putOneCaptureList.other !== undefined &&
        this.putOneCaptureList.other.linkmanIdNo !== undefined
      ) {
        this.PolicyInfo.applicant.linkmanIdNo = this.putOneCaptureList.other.linkmanIdNo
      }
      // 获取到数据End
      // this.$message({
      //   message: '恭喜你，提交成功',
      //   type: 'success'
      // })
    },
    // 提交保单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoginShow = true
          // 保费险种明细
          if (
            this.multipleSelection01 !== undefined &&
            this.multipleSelection02 !== undefined
          ) {
            this.PolicyInfo.risks = this.multipleSelection01.concat(
              this.multipleSelection02
            )
          } else if (
            this.multipleSelection01 !== undefined &&
            this.multipleSelection02 === undefined
          ) {
            this.PolicyInfo.risks = this.multipleSelection01
          } else if (
            this.multipleSelection02 !== undefined &&
            this.multipleSelection01 === undefined
          ) {
            this.PolicyInfo.risks = this.multipleSelection02
          } else {
            this.PolicyInfo.risks = []
          }
          const obj = {
            sourceCode: this.$store.getters.userAll.data.channelCode,
            operatorId: this.$store.getters.userAll.data.id,
            orderId: ''
          }
          this.PolicyInfo.policy = { ...this.PolicyInfo.policy, ...obj }
          getBdinput(this.PolicyInfo)
            .then(data => {
              if (data.status === 200) {
                this.$message({
                  message: '恭喜你，提交成功',
                  type: 'success'
                })
                this.btnLoginShow = false
                this.$emit('isEditAllShow', true)
                // window.location.reload()
              } else {
                alert(data.msg)
                this.btnLoginShow = false
              }
            })
            .catch(error => {
              this.btnLoginShow = false
              alert(error.response.data.msg)
            })
        } else {
          alert('提交失败，信息不完整!')
          this.btnLoginShow = false
          return false
        }
      })
    }
  }
}
</script>
<!--
<style lang="scss">
.LRDialogIsShow {
  .el-dialog {
    width: 90% !important;
    margin: 5vh auto !important;
    max-width: 100% !important;
    .el-col-6 {
      width: auto;
      input {
        width: 220px !important;
      }
      textarea {
        width: 220px;
      }
    }
    .el-col-12 {
      width: 640px !important;
    }
    .el-dialog__header {
      background: #f5f7fa;
      font-weight: bold;
      color: #555;
    }
    .el-table td {
      padding: 5px 0 !important;
    }
  }
  .el-input-number {
    width: 220px !important;
    height: 30px !important;
  }
  .grid-content {
    display: flex;
    align-items: center;
    height: 50px;
    .el-form-item {
      margin-bottom: 10px;
      width: 100%;
      .grid-content-name {
        white-space: nowrap;
        padding: 0 8px;
      }
      .el-form-item__error {
        padding-top: 0;
      }
    }
  }
  .w-email-input input {
    width: 540px;
  }
  .w-common-input {
    .el-form-item {
      width: 96%;
    }
    input {
      width: 100%;
    }
  }
  .tableBxAllinput {
    input {
      width: 140px !important;
      height: 30px !important;
    }
    .el-input__inner {
      width: 140px !important;
      height: 30px !important;
    }
  }
  .vue-treeselect {
    width: 220px;
  }
  .table-quantity {
    display: flex;
    input {
      min-width: 40px !important;
      width: 40px !important;
      height: 30px !important;
    }
    .el-input {
      width: 40px !important;
    }
    .el-select {
      .el-input__inner {
        text-align: left;
        width: 100%;
        padding: 0 15px !important;
      }
    }
    .tableBxAllinput {
      .el-input {
        width: 100% !important;
      }
    }
    .el-select .el-input__inner {
      text-align: left;
      padding: 0 15px !important;
    }
  }
}
</style>
-->
<style lang="scss" scoped>
.LRDialogIsShow {
  .dialog-list {
    overflow: hidden;
  }
  .grid-content {
    float: left;
    width: 360px;
    height: 56px;
    .grid-content-name {
      white-space: nowrap;
      padding: 0 8px;
    }
    .el-input {
      width: 260px;
    }
    .el-select {
      width: 260px;
    }
    .el-input-number {
      width: 260px;
    }
    .el-form-item__error{
      padding-top: 0 !important;
    }
  }
  h2 {
    font-size: 14px;
    color: #409eff;
    clear: both;
    padding: 0 10px 0 20px;
    margin-block-start: 0.35em;
    margin-block-end: 0.35em;
  }

  .inputjbfbox {
    width: 260px;
    border: 1px solid #c0c4cc;
    background: #fff;
    border-radius: 4px;
    height: 32px;
    line-height: 32px;
    padding: 0 15px;
    box-sizing: border-box;
    background: #f5f7fa;
  }
  .BXtable-syncGroup {
    padding-left: 10px;
  }
}
.inputsearchtree {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  width: 100%;
  min-width: 220px;
  height: 40px;
  padding: 0 15px;
  box-sizing: border-box;
}
.CDcomplicelist {
  position: absolute;
  top: 50px;
  left: 0;
  z-index: 3000;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  background: #fff;
  border-radius: 4px;
  min-width: 100%;

  .CDcomplicelisttree {
    width: 100%;
    max-height: 300px;
    min-height: 50px;
    overflow: auto;
  }
}

.tree-hide {
  text-align: center;
  font-size: 10px;
  color: #888;
  border-top: 1px solid #f2f2f2;
  cursor: pointer;
}

.tree-hide:hover {
  background: #f5f5f5;
}
.table-quantity-tips {
  width: 40px;
  text-align: center;
  line-height: 30px;
  height: 30px;
}
.form-btn {
  padding-top: 10px;
  text-align: center;
}
.Riskshow {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
  background: #fff;
  width: 100%;
  height: 100%;
  opacity: 0.3;
}
</style>
