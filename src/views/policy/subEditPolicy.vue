<template>
  <!-- eslint-disable -->
  <div v-loading="isLoading">
    <div v-if="formOptions" class="sub-edit-policy">
      <el-form ref="subEditPolicy" :model="subForm" :rules="rules" label-width="100px">
        <el-form-item label="子政策名称：" prop="name">
          <el-input
            v-model="subForm.name"
            :disabled="subNameStatus"
            placeholder="请输入子政策名称"
            style="width: 200px;"
            size="small"
          />
        </el-form-item>
        <el-form-item label="保险类型：">
          <el-checkbox-group
            v-model="subForm.wrapValue004"
            :disabled="subPolicyStatus"
            value-key="code"
          >
            <el-checkbox
              v-for="item in formOptions[0].children"
              :key="item.code"
              :label="item.code"
              :value="item.code"
            >{{ item.value }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="车型种类：">
          <el-tree-select
            ref="carTypeTree"
            v-model="subForm.wrapValue005"
            :disabled="subPolicyStatus"
            :defaultExpandAll="false"
            :data="formOptions[1].children"
            multiple
            show-checkbox
            show-checked-strategy="all"
            style="width: 250px;"
            placeholder="请选择车型种类"
            size="small"
          />
        </el-form-item>
        <el-form-item label="使用性质：">
          <el-checkbox-group
            v-model="subForm.wrapValue006"
            :disabled="subPolicyStatus"
            value-key="code"
          >
            <el-checkbox
              v-for="item in formOptions[2].children"
              :key="item.code"
              :label="item.code"
              :value="item.code"
            >{{ item.value }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="所属性质：">
          <el-checkbox-group
            v-model="subForm.wrapValue007"
            :disabled="subPolicyStatus"
            value-key="code"
          >
            <el-checkbox
              v-for="item in formOptions[3].children"
              :key="item.code"
              :label="item.code"
              :value="item.code"
            >{{ item.value }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- <el-form-item label="业务类型：">
          <el-checkbox-group
            v-model="subForm.wrapValue008"
            :disabled="subPolicyStatus"
            value-key="code"
          >
            <el-checkbox
              v-for="item in formOptions[4].children"
              :key="item.code"
              :label="item.code"
              :value="item.code"
            >{{ item.value }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->
        <el-form-item label="车辆年限：">
          <el-checkbox-group
            v-model="subForm.wrapValue009"
            :disabled="subPolicyStatus"
            value-key="code"
          >
            <el-checkbox
              v-for="item in formOptions[5].children"
              :key="item.code"
              :label="item.code"
              :value="item.code"
            >{{ item.value }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="包含险种：">
          <el-select
            v-model="subForm.wrapValue100"
            :disabled="subPolicyStatus"
            value-key="code"
            size="small"
            multiple
            placeholder="选择包含险种"
            style="width: 250px;"
          >
            <el-option
              v-for="item in formOptions[6].children"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否过户：">
          <el-radio-group
            v-model="subForm.wrapValue101"
            :disabled="subPolicyStatus"
            value-key="code"
          >
            <el-radio
              v-for="item in formOptions[7].children"
              :key="item.code"
              :label="item.code"
              :value="item.code"
            >{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="车牌代号：">
          <el-select
            v-model="subForm.wrapValuePlate102"
            :disabled="subPolicyStatus"
            value-key="code"
            size="small"
            clearable
            placeholder="选择省份"
            style="width: 250px;"
          >
            <el-option
              v-for="item in provinceOptions"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            />
          </el-select>
          <el-select
            v-model="subForm.wrapValueNumber102"
            :disabled="subPolicyStatus"
            value-key="code"
            size="small"
            multiple
            placeholder="选择城市代号"
            style="width: 250px;"
          >
            <el-option
              v-for="item in cityOptions"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="上年交强险出险次数：">
          <el-select
            v-model="subForm.wrapValue103"
            :disabled="subPolicyStatus"
            value-key="code"
            size="small"
            clearable
            placeholder="选择上年交强险出险次数"
            style="width: 250px;"
          >
            <el-option
              v-for="item in formOptions[9].children"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="上年商业险出险次数：">
          <el-select
            v-model="subForm.wrapValue104"
            :disabled="subPolicyStatus"
            value-key="code"
            size="small"
            clearable
            placeholder="选择上年商业险出险次数"
            style="width: 250px;"
          >
            <el-option
              v-for="item in formOptions[10].children"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="交强折扣系数：">
          <el-input
            v-model="subForm.wrapValueMin105"
            :disabled="subPolicyStatus"
            placeholder="最低折扣系数"
            size="small"
            style="width: 250px;"
            @blur="discountFixed"
          />
          <el-input
            v-model="subForm.wrapValueMax105"
            :disabled="subPolicyStatus"
            placeholder="最高折扣系数"
            size="small"
            style="width: 250px;"
            @blur="discountFixed"
          />
        </el-form-item>
        <el-form-item label="商业折扣系数：">
          <el-input
            v-model="subForm.wrapValueMin106"
            :disabled="subPolicyStatus"
            placeholder="最低折扣系数"
            size="small"
            style="width: 250px;"
            @blur="discountFixed"
          />
          <el-input
            v-model="subForm.wrapValueMax106"
            :disabled="subPolicyStatus"
            placeholder="最高折扣系数"
            size="small"
            style="width: 250px;"
            @blur="discountFixed"
          />
        </el-form-item>

        <el-form-item>
          <el-table :data="subForm.subStrategyRates" ref="subStrategyRates">
            <el-table-column label="手续费/佣金" width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.rateTypeTitle || getRateTypeTitle(scope.row) }}</span>
              </template>
            </el-table-column>

            <el-table-column label="机构/业务员" width="300">
              <template slot-scope="scope">
                <span v-if="scope.row.rateType === '1'">{{parentTitle(scope.row)}}</span>

                <el-popover
                  v-if="scope.row.rateType === '2'"
                  :disabled="scope.row.disabled"
                  placement="bottom-start"
                  width="280"
                  @show="channelList(scope.row,scope.$index)"
                  @hide="scope.row.isChannelOpen = false"
                >
                  <div>
                    <el-tree
                      :data="scope.row.options"
                      :default-checked-keys="scope.row.companyKey"
                      :ref="'treeChannel' + scope.$index"
                      check-strictly
                      default-expand-all
                      show-checkbox
                      node-key="value"
                      id="popoverChannel"
                      :props="defaultProps"
                      @check="chooseChannel(scope.$index, 'treeChannel' + scope.$index)"
                    />
                  </div>
                  <div
                    slot="reference"
                    class="el-select el-select--small el-popover__reference"
                    aria-describedby="el-popover-4402"
                    tabindex="0"
                    style="width: 250px;"
                  >
                    <div class="el-select__tags" style="width: 100%; max-width: 250px;">
                      <span v-show="scope.row.isChannelValue">
                        <span class="el-tag el-tag--info el-tag--small sub-tree-tag">
                          <span
                            class="el-select__tags-text sub-tree-tag-text"
                          >{{ scope.row.channelValue }}</span>
                          <i class="el-tag__close el-icon-close sub-tree-tag-close"></i>
                        </span>
                        <span class="el-tag el-tag--info el-tag--small">
                          <span class="el-select__tags-text">{{ scope.row.channelNum }}</span>
                        </span>
                      </span>
                    </div>
                    <div class="el-input el-input--small el-input--suffix">
                      <input
                        type="text"
                        readonly="readonly"
                        auto-complete="off"
                        :placeholder="scope.row.isChannelValue? '' : '选择下游机构'"
                        class="el-input__inner"
                      >
                      <span class="el-input__suffix">
                        <span class="el-input__suffix-inner">
                          <i
                            class="el-select__caret el-input__icon el-icon-arrow-up"
                            :class="scope.row.isChannelOpen? 'is-reverse': ''"
                          />
                        </span>
                      </span>
                    </div>
                  </div>
                </el-popover>

                <el-popover
                  v-if="scope.row.rateType === '4'"
                  :disabled="scope.row.disabled"
                  placement="bottom-start"
                  width="280"
                  @show="teamList(scope.row,scope.$index)"
                  @hide="scope.row.isTeamOpen = false"
                >
                  <div>
                    <el-tree
                      :data="scope.row.options"
                      :default-checked-keys="scope.row.allKey"
                      :ref="'treeTeam' + scope.$index"
                      show-checkbox
                      default-expand-all
                      check-strictly
                      node-key="value"
                      id="popoverTeam"
                      :props="defaultProps"
                      @check="chooseTeam(scope.$index, 'treeTeam' + scope.$index)"
                    />
                  </div>
                  <div
                    slot="reference"
                    class="el-select el-select--small el-popover__reference"
                    aria-describedby="el-popover-4404"
                    tabindex="0"
                    style="width: 250px;"
                  >
                    <div class="el-select__tags" style="width: 100%; max-width: 250px;">
                      <span v-show="scope.row.isTeamValue">
                        <span class="el-tag el-tag--info el-tag--small sub-tree-tag">
                          <span
                            class="el-select__tags-text sub-tree-tag-text"
                          >{{ scope.row.teamValue }}</span>
                          <i class="el-tag__close el-icon-close sub-tree-tag-close"></i>
                        </span>
                        <span class="el-tag el-tag--info el-tag--small">
                          <span class="el-select__tags-text">{{ scope.row.teamNum }}</span>
                        </span>
                      </span>
                    </div>
                    <div class="el-input el-input--small el-input--suffix">
                      <input
                        type="text"
                        readonly="readonly"
                        auto-complete="off"
                        :placeholder="scope.row.isTeamValue? '' : '选择批量业务员'"
                        class="el-input__inner"
                      >
                      <span class="el-input__suffix">
                        <span class="el-input__suffix-inner">
                          <i
                            class="el-select__caret el-input__icon el-icon-arrow-up"
                            :class="scope.row.isTeamOpen? 'is-reverse': ''"
                          />
                        </span>
                      </span>
                    </div>
                  </div>
                </el-popover>

                <el-popover
                  v-if="scope.row.rateType === '3'"
                  :disabled="scope.row.disabled"
                  placement="bottom-start"
                  width="280"
                  @show="showSaler(scope.row,scope.$index)"
                  @hide="hideSaler(scope.row,scope.$index)"
                >
                  <div>
                    <el-input
                      v-model="scope.row.salerName"
                      placeholder="请输入你要指定的业务员"
                      size="small"
                      @change="clearSaler(scope.$index, scope.row)"
                    >
                      <el-button
                        slot="append"
                        icon="el-icon-search"
                        size="small"
                        @click="searchSaler(scope.$index)"
                      />
                    </el-input>
                    <div v-loading="scope.row.salerLoading">
                      <el-tree
                        :data="scope.row.options"
                        :default-checked-keys="scope.row.salerKey"
                        :ref="'treeSaler' + scope.$index"
                        show-checkbox
                        node-key="value"
                        id="popoverSaler"
                        :props="defaultProps"
                        @check="chooseSaler(scope.row, scope.$index, 'treeSaler' + scope.$index)"
                      />
                    </div>
                  </div>
                  <div
                    slot="reference"
                    class="el-select el-select--small el-popover__reference"
                    aria-describedby="el-popover-4403"
                    tabindex="0"
                    style="width: 250px;"
                  >
                    <div class="el-select__tags" style="width: 100%; max-width: 250px;">
                      <span v-show="scope.row.isSalerValue">
                        <span class="el-tag el-tag--info el-tag--small">
                          <span class="el-select__tags-text">{{ scope.row.salerValue }}</span>
                          <i class="el-tag__close el-icon-close"></i>
                        </span>
                        <span class="el-tag el-tag--info el-tag--small">
                          <span class="el-select__tags-text">{{ scope.row.salerNum }}</span>
                        </span>
                      </span>
                    </div>
                    <div class="el-input el-input--small el-input--suffix">
                      <input
                        type="text"
                        readonly="readonly"
                        auto-complete="off"
                        :placeholder="scope.row.isSalerValue? '' : '请点击搜索'"
                        class="el-input__inner"
                      >
                      <span class="el-input__suffix">
                        <span class="el-input__suffix-inner">
                          <i
                            class="el-select__caret el-input__icon el-icon-arrow-up"
                            :class="scope.row.isSalerOpen? 'is-reverse': ''"
                          />
                        </span>
                      </span>
                    </div>
                  </div>
                </el-popover>
              </template>
            </el-table-column>

            <el-table-column label="结算方式" width="160">
              <template v-if="ratesOptions" slot-scope="scope">
                <el-select
                  v-model="scope.row.computeType"
                  :disabled="scope.row.disabled"
                  value-key="code"
                  size="small"
                  style="width: 130px;"
                >
                  <el-option
                    v-for="item in ratesOptions"
                    :key="item.code"
                    :label="item.value"
                    :value="item.code"
                  />
                </el-select>
              </template>
            </el-table-column>

            <el-table-column label="交强险(含税)" width="120">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.forceRiskTaxRate"
                  :disabled="scope.row.disabled"
                  size="small"
                  @change="riskRateChangeHandler('1', scope.row)"
                >
                  <template slot="append">%</template>
                </el-input>
              </template>
            </el-table-column>

            <el-table-column label="商业险(含税)" width="120">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.businessRiskTaxRate"
                  :disabled="scope.row.disabled"
                  size="small"
                  @change="riskRateChangeHandler('2', scope.row)"
                >
                  <template slot="append">%</template>
                </el-input>
              </template>
            </el-table-column>

            <el-table-column label="交强险(不含税)" width="120">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.forceRiskRate"
                  :disabled="scope.row.disabled"
                  size="small"
                  @change="riskRateChangeHandler('3', scope.row)"
                >
                  <template slot="append">%</template>
                </el-input>
              </template>
            </el-table-column>

            <el-table-column label="商业险(不含税)" width="120">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.businessRiskRate"
                  :disabled="scope.row.disabled"
                  size="small"
                  @change="riskRateChangeHandler('4', scope.row)"
                >
                  <template slot="append">%</template>
                </el-input>
              </template>
            </el-table-column>

            <el-table-column label="操作人" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.operateName }}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <span v-if="scope.$index !== 0 && !scope.row.disabled">
                  <span style="color: #1890ff;cursor: pointer;" @click="subDelete(scope.$index)">删除</span>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <div style="text-align:right;">
            <el-button type="primary" size="small" icon="el-icon-plus" @click="addChannel">指定机构</el-button>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="addTeam">批量指定业务员</el-button>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="addSaler">单个指定业务员</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import {
  policyform,
  policyRates,
  subPolicyEditInfo,
  subPolicyEditRates,
  subPolicyCompanyId,
  getPolicyTeamEffective,
  getPolicySalesEffective,
  deleteStrategyRate
} from '@/api/policy'
import ElTreeSelect from '@/components/ElTreeSelect/index'
export default {
  components: {
    ElTreeSelect
  },
  props: {
    subPolicyData: {
      // 子政策行数据
      type: Object,
      default() {
        return {}
      }
    },
    subPolicyId: {
      type: String,
      default: ''
    },
    adminViewId: {
      type: String,
      default: ''
    },
    subPolicyStatus: {
      type: Boolean,
      default: false
    },
    subNameStatus: {
      type: Boolean,
      default: false
    },
    isPolicyCreator: {
      type: Boolean,
      default: false
    },
    isEffect: {
      type: Boolean,
      default: false
    },
    isAdded: {
      type: Boolean,
      default: false
    },
    subCompanyData: {
      // 政策行数据
      type: Object,
      default() {
        return {}
      }
    },
    strategyModel: Object
  },
  data() {
    return {
      isLoading: false,
      subForm: {
        name: null,
        channelCode: null,
        strategyId: null,
        wrapValue004: [],
        wrapValue005: [],
        wrapValue006: [],
        wrapValue007: [],
        wrapValue008: [],
        wrapValue009: [],
        wrapValue100: [],
        wrapValue101: '',
        wrapValuePlate102: null,
        wrapValueNumber102: [],
        wrapValue103: null,
        wrapValue104: null,
        wrapValueMin105: null,
        wrapValueMax105: null,
        wrapValueMin106: null,
        wrapValueMax106: null,
        subStrategyMatchCauses: [
          { code: '00004', flagType: '2', wrapValue: [] },
          { code: '00005', flagType: '4', wrapValue: [] },
          { code: '00006', flagType: '2', wrapValue: [] },
          { code: '00007', flagType: '2', wrapValue: [] },
          { code: '00008', flagType: '2', wrapValue: [] },
          { code: '00009', flagType: '2', wrapValue: [] },
          { code: '00100', flagType: '3', wrapValue: [] },
          { code: '00101', flagType: '1', wrapValue: [] },
          { code: '00102', flagType: '6', wrapValue: [] },
          { code: '00103', flagType: '7', wrapValue: [] },
          { code: '00104', flagType: '7', wrapValue: [] },
          { code: '00105', flagType: '5', wrapValue: [] },
          { code: '00106', flagType: '5', wrapValue: [] }
        ],
        subStrategyRates: [
          {
            businessRiskRate: null,
            businessRiskTaxRate: null,
            companies: [
              {
                companyId: this.subPolicyData.createrCompanyId,
                head: 0
              }
            ],
            computeType: '1',
            forceRiskRate: null,
            forceRiskTaxRate: null,
            operateId: this.$store.getters.userAll.data.id,
            rateType: '1',
            rateTypeTitle: '上游手续费'
          }
        ]
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入子政策名称',
            trigger: 'blur'
          }
        ]
      },
      formOptions: null,
      ratesOptions: [],
      provinceOptions: [],
      cityOptions: [],
      channelData: [],
      channelDataBackup: [],
      channelIndex: '',
      salesData: [],
      teamData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  /**
   * rateType 1 上游手续费 2 下游机构佣金 3 单个业务员 4 批量业务员佣金
   */
  async created() {
    this.isLoading = true
    const resF = await policyform() // 获取车险类别表单
    this.formOptions = resF.data
    if (resF.data && resF.data[1] && resF.data[1].children) {
      const json = JSON.parse(
        JSON.stringify(resF.data[1].children)
          .replace(/value/g, 'label')
          .replace(/code/g, 'value')
      )
      this.formOptions[1].children = json
    }
    const arr1 = [...resF.data[8].children]
    const arr2 = [...resF.data[8].children]
    this.provinceOptions = arr1.splice(0, 31)
    this.cityOptions = arr2.splice(31, 55)

    const resT = await policyRates() // 获取车险费率表格
    this.ratesOptions = resT.data

    const resC = await getPolicyTeamEffective([this.adminViewId]) // 获取机构
    const jsonC = JSON.parse(
      JSON.stringify(resC.data)
        .replace(/title/g, 'label')
        .replace(/key/g, 'value')
    )
    if (jsonC[0] && jsonC[0].children && jsonC[0].children.length > 0) {
      this.channelDataBackup = jsonC[0].children
    } else {
      this.channelDataBackup = []
    }
    // this.channelData = this.getCompanyTypeNodeOptionsCopy()
    this.channelData = this.recursionDelete(
      this.strategyModel.createrCompanyId,
      this.channelDataBackup
    )

    const resG = await getPolicyTeamEffective([this.adminViewId]) // 获取团队
    let jsonG = JSON.parse(
      JSON.stringify(resG.data)
        .replace(/title/g, 'label')
        .replace(/key/g, 'value')
    )
    // jsonG = this.recursionTeam(jsonG)
    // if (jsonG[0] && jsonG[0].children && jsonG[0].children.length > 0) {
    if (jsonG) {
      this.teamData = jsonG
    } else {
      this.teamData = []
    }

    // props传值渲染
    this.subForm.channelCode = this.subPolicyData.channelCode
    this.subForm.strategyId = this.subPolicyData.id
    this.isLoading = false

    if (this.subPolicyId) {
      // 编辑渲染
      this.isLoading = true
      this.subForm.name = this.subPolicyData.name
      this.subForm.id = this.subPolicyId
      this.subForm.strategyId = this.subPolicyData.strategyId
      // checkbox表单渲染
      this.getEditForm(this.subPolicyId)
      // 费率表格渲染
      const resRate = await subPolicyEditRates(
        this.subPolicyId,
        this.adminViewId
      )
      const subStrategyRates = resRate.data
      subStrategyRates.map((item, index) => {
        if (this.isEffect) {
          subStrategyRates[index].disabled = true
        }
        if (parseInt(item.rateType) === 1) {
          if (this.isAdded && !item.insureCompanyParentRate) {
            subStrategyRates[index].disabled = true
          }
          // if (!this.isAdded && !item.isPolicyCreator) {
          //   subStrategyRates[index].disabled = true
          // }
        }
      })
      for (let i = 0, len = resRate.data.length; i < len; i++) {
        // 已提交内容标识
        subStrategyRates[i].isUploaded = true
        if (resRate.data[i].rateType === '3') {
          // 业务员
          const salerArr = []
          const salerOtn = []
          const salerArray = resRate.data[i].companies
          if (salerArray.length > 0) {
            subStrategyRates[i].isSalerValue = true
            subStrategyRates[i].salerValue = salerArray[0].salesName
            subStrategyRates[i].salerNum = salerArray.length
          }
          for (let j = 0, slen = salerArray.length; j < slen; j++) {
            const item = salerArray[j]
            salerArr.push(item.salesId)
            salerOtn.push({ label: item.salesName, value: item.salesId })
          }
          subStrategyRates[i].lastKey = [...salerArr]
          subStrategyRates[i].salerKey = [...salerArr]
          // subStrategyRates[i].salerTree = [...salerOtn]
          subStrategyRates[i].options = [...salerOtn]
        } else if (resRate.data[i].rateType === '2') {
          // 机构
          const comArr = []
          const companyArray = resRate.data[i].companies
          for (let k = 0, clen = companyArray.length; k < clen; k++) {
            comArr.push(companyArray[k].companyId)
          }
          if (comArr.length > 0) {
            subStrategyRates[i].isChannelValue = true
            subStrategyRates[i].channelNum = comArr.length
            const resNameC = await subPolicyCompanyId([comArr[0]])
            subStrategyRates[i].channelValue = resNameC.data[0].name
          }
          subStrategyRates[i].companyKey = [...comArr]
          subStrategyRates[i].options = this.copyData(this.channelData)
          subStrategyRates[i].lastKey = [...comArr]
        } else if (resRate.data[i].rateType === '4') {
          // 团队
          const teamArr = []
          // const parentArr = []
          const teamArray = resRate.data[i].companies
          for (let k = 0, tlen = teamArray.length; k < tlen; k++) {
            teamArr.push(teamArray[k].companyId)
            // let list = []
            // for (let item of this.teamData) {
            //   this.searchImplement(teamArray[k].companyId, item, value => {
            //     list.push(value)
            //   })
            // }
            // parentArr.push(...list)
          }
          if (teamArr.length > 0) {
            subStrategyRates[i].isTeamValue = true
            subStrategyRates[i].teamNum = teamArr.length
            const resNameT = await subPolicyCompanyId([teamArr[0]])
            subStrategyRates[i].teamValue = resNameT.data[0].name
          }
          subStrategyRates[i].teamKey = [...teamArr]
          subStrategyRates[i].allKey = [...teamArr]
          subStrategyRates[i].options = this.copyData(this.teamData)
          subStrategyRates[i].lastKey = [...teamArr]
        }
      }
      this.subForm.subStrategyRates = [...subStrategyRates]
      this.isLoading = false
    }
  },
  methods: {
    getCompanyTypeNodeOptionsCopy() {
      let channelDataCopy =
        JSON.parse(JSON.stringify(this.channelDataBackup)) || []
      // 去掉该条政策拥有权机构 item
      channelDataCopy = channelDataCopy.filter(
        children => children.value !== this.strategyModel.createrCompanyId
      )
      return channelDataCopy
    },
    copyData(obj) {
      return JSON.parse(JSON.stringify(obj || {}))
    },
    getRateTypeTitle(item) {
      return item.rateType === '1' ? '上游手续费' : ''
    },
    // 编辑信息
    getEditForm(id) {
      subPolicyEditInfo(id)
        .then(res => {
          res.data.map((item, index) => {
            if (item.code === '00004') {
              if (item.wrapValue) {
                this.subForm.wrapValue004 = item.wrapValue
              }
            }
            if (item.code === '00005') {
              if (item.wrapValue) {
                this.subForm.wrapValue005 = item.wrapValue
              }
            }
            if (item.code === '00006') {
              if (item.wrapValue) {
                this.subForm.wrapValue006 = item.wrapValue
              }
            }
            if (item.code === '00007') {
              if (item.wrapValue) {
                this.subForm.wrapValue007 = item.wrapValue
              }
            }
            if (item.code === '00008') {
              if (item.wrapValue) {
                this.subForm.wrapValue008 = item.wrapValue
              }
            }
            if (item.code === '00009') {
              if (item.wrapValue) {
                this.subForm.wrapValue009 = item.wrapValue
              }
            }
            if (item.code === '00100') {
              if (item.wrapValue) {
                this.subForm.wrapValue100 = item.wrapValue
              }
            }
            if (item.code === '00101') {
              if (item.wrapValue && item.wrapValue.length > 0) {
                this.subForm.wrapValue101 = item.wrapValue[0]
              }
            }
            if (item.code === '00102') {
              if (item.wrapValue && item.wrapValue.length > 0) {
                const n = []
                for (let i = 0; i < item.wrapValue.length; i++) {
                  const a = item.wrapValue[i].split('---')
                  n.push(a[1])
                }
                this.subForm.wrapValuePlate102 = item.wrapValue[0].slice(0, 1)
                this.subForm.wrapValueNumber102 = n
              }
            }
            if (item.code === '00103') {
              if (item.wrapValue && item.wrapValue.length > 0) {
                this.subForm.wrapValue103 = item.wrapValue[0]
              }
            }
            if (item.code === '00104') {
              if (item.wrapValue && item.wrapValue.length > 0) {
                this.subForm.wrapValue104 = item.wrapValue[0]
              }
            }
            if (item.code === '00105') {
              if (item.wrapValue && item.wrapValue.length > 0) {
                this.subForm.wrapValueMin105 = item.wrapValue[0]
                this.subForm.wrapValueMax105 = item.wrapValue[1]
              }
            }
            if (item.code === '00106') {
              if (item.wrapValue && item.wrapValue.length > 0) {
                this.subForm.wrapValueMin106 = item.wrapValue[0]
                this.subForm.wrapValueMax106 = item.wrapValue[1]
              }
            }
          })
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 折扣系数限定数值
    discountFixed() {
      if (this.subForm.wrapValueMin105) {
        const data1 = Number(this.subForm.wrapValueMin105).toFixed(2)
        if (data1 < 0) {
          this.subForm.wrapValueMin105 = 0.01
        } else if (data1 > 100) {
          this.subForm.wrapValueMin105 = 100.0
        } else {
          this.subForm.wrapValueMin105 = data1
        }
      }
      if (this.subForm.wrapValueMax105) {
        const data2 = Number(this.subForm.wrapValueMax105).toFixed(2)
        if (data2 < 0) {
          this.subForm.wrapValueMax105 = 0.01
        } else if (data2 > 100) {
          this.subForm.wrapValueMax105 = 100.0
        } else {
          this.subForm.wrapValueMax105 = data2
        }
      }
      if (this.subForm.wrapValueMin106) {
        const data3 = Number(this.subForm.wrapValueMin106).toFixed(2)
        if (data3 < 0) {
          this.subForm.wrapValueMin106 = 0.01
        } else if (data3 > 100) {
          this.subForm.wrapValueMin106 = 100.0
        } else {
          this.subForm.wrapValueMin106 = data3
        }
      }
      if (this.subForm.wrapValueMax106) {
        const data4 = Number(this.subForm.wrapValueMax106).toFixed(2)
        if (data4 < 0) {
          this.subForm.wrapValueMax106 = 0.01
        } else if (data4 > 100) {
          this.subForm.wrapValueMax106 = 100.0
        } else {
          this.subForm.wrapValueMax106 = data4
        }
      }
    },
    // 含税比例
    riskRateChangeHandler(type, data) {
      const rate = 1.06
      const max = 94.34
      switch (type) {
        case '1':
          if (data.forceRiskTaxRate < 0) {
            data.forceRiskTaxRate = 0
          } else if (data.forceRiskTaxRate > max) {
            data.forceRiskTaxRate = 94.34
          }
          data.forceRiskRate = parseFloat(
            (data.forceRiskTaxRate * rate).toFixed(2)
          )
          break
        case '2':
          if (data.businessRiskTaxRate < 0) {
            data.businessRiskTaxRate = 0
          } else if (data.businessRiskTaxRate > max) {
            data.businessRiskTaxRate = 94.34
          }
          data.businessRiskRate = parseFloat(
            (data.businessRiskTaxRate * rate).toFixed(2)
          )
          break
        case '3':
          if (data.forceRiskRate < 0) {
            data.forceRiskRate = 0
          } else if (data.forceRiskRate > 100) {
            data.forceRiskRate = 100
          }
          data.forceRiskTaxRate = parseFloat(
            (data.forceRiskRate / rate).toFixed(2)
          )
          break
        case '4':
          if (data.businessRiskRate < 0) {
            data.businessRiskRate = 0
          } else if (data.businessRiskRate > 100) {
            data.businessRiskRate = 100
          }
          data.businessRiskTaxRate = parseFloat(
            (data.businessRiskRate / rate).toFixed(2)
          )
      }
    },
    // 展开机构菜单和禁用重复项
    channelList(row, index) {
      row.isChannelOpen = true
      const subStrategyRates = this.subForm.subStrategyRates
      const selectItem = subStrategyRates[index]
      // 只刷新一次即可
      if (selectItem._hasRefreshForbid) return
      subStrategyRates
        .filter(
          (item, itemIndex) =>
            parseInt(item.rateType) === 2 && itemIndex !== index
        )
        .forEach(item => {
          item.companyKey.forEach(value =>
            this.recursionTrue(value, selectItem.options)
          )
        })
      selectItem._hasRefreshForbid = true
    },
    // 选择机构
    chooseChannel(index, name) {
      const subStrategyRates = this.subForm.subStrategyRates
      const selectItem = subStrategyRates[index]
      const arrT = this.$refs[name].getCheckedNodes()
      console.log(arrT)
      if (arrT.length > 0) {
        selectItem.channelValue = arrT[0].label
        selectItem.isChannelValue = true
        selectItem.channelNum = arrT.length
      } else {
        selectItem.channelValue = ''
        selectItem.channelNum = null
        selectItem.isChannelValue = false
      }
      selectItem.companyKey = this.$refs[name].getCheckedKeys()
      console.log(selectItem.companyKey)
      const { add, remove } = this.getAddAndRemoveKeys(
        selectItem.lastKey,
        selectItem.companyKey
      )
      // 禁用其他item选项
      subStrategyRates
        .filter(
          (item, itemIndex) =>
            parseInt(item.rateType) === 2 && itemIndex !== index
        )
        .forEach(item => {
          console.log('add', add, 'remove', remove)
          add.forEach(addValue => this.recursionTrue(addValue, item.options))
          remove.forEach(addValue =>
            this.recursionFalse(addValue, item.options)
          )
        })
      selectItem.lastKey = [...selectItem.companyKey]
      const arr = []
      for (let i = 0, len = selectItem.companyKey.length; i < len; i++) {
        const obj = {
          companyId: selectItem.companyKey[i],
          parentCompanyId: this.adminViewId
        }
        arr.push(obj)
      }
      selectItem.companies = arr
    },
    // 展开团队菜单和禁用重复项
    teamList(row, index) {
      row.isTeamOpen = true
      const subStrategyRates = this.subForm.subStrategyRates
      const selectItem = subStrategyRates[index]
      // 只刷新一次即可
      if (selectItem._hasRefreshForbid) return
      subStrategyRates
        .filter(
          (item, itemIndex) =>
            parseInt(item.rateType) === 4 && itemIndex !== index
        )
        .forEach(item => {
          item.teamKey.forEach(value =>
            this.recursionTrue(value, selectItem.options)
          )
        })
      selectItem._hasRefreshForbid = true
    },
    // 选择团队
    chooseTeam(index, name) {
      const subStrategyRates = this.subForm.subStrategyRates
      const selectItem = subStrategyRates[index]
      /**
       * getCheckedNodes(leafOnly, includeHalfChecked) 接收两个 boolean 类型的参数
       * ，1. 是否只是叶子节点，默认值为 false 2. 是否包含半选节点，默认值为 false
       */
      const arrT = this.$refs[name].getCheckedNodes(false, false)
      console.log('arrT', arrT)
      if (arrT.length > 0) {
        selectItem.teamValue = arrT[0].label
        selectItem.isTeamValue = true
        selectItem.teamNum = arrT.length
      } else {
        selectItem.teamValue = ''
        selectItem.teamNum = null
        selectItem.isTeamValue = false
      }
      // 所有勾选项
      selectItem.allKey = []
      const arrK = this.$refs[name].getCheckedKeys()
      selectItem.allKey = arrK
      // 最底层的团队项
      selectItem.teamKey = []
      for (let i = 0, len = arrT.length; i < len; i++) {
        selectItem.teamKey.push(arrT[i].value)
      }
      const { add, remove } = this.getAddAndRemoveKeys(
        selectItem.lastKey,
        selectItem.allKey
      )
      // 禁用其他item选项
      subStrategyRates
        .filter(
          (item, itemIndex) =>
            parseInt(item.rateType) === 4 && itemIndex !== index
        )
        .forEach(item => {
          add.forEach(addValue => this.recursionTrue(addValue, item.options))
          remove.forEach(addValue =>
            this.recursionFalse(addValue, item.options)
          )
        })
      selectItem.lastKey = [...selectItem.allKey]
      const arr = []
      for (let i = 0, len = selectItem.teamKey.length; i < len; i++) {
        const obj = {
          companyId: selectItem.teamKey[i],
          parentCompanyId: this.adminViewId
        }
        arr.push(obj)
      }
      selectItem.companies = arr
    },
    showSaler(row, index) {
      row.isSalerOpen = true
    },
    hideSaler(row, index) {
      row.isSalerOpen = false
    },
    clearSaler(index, row) {
      const subStrategyRates = this.subForm.subStrategyRates
      const selectItem = subStrategyRates[index]
      // console.log(selectItem.salerTree)
      if (row.salerName === '') {
        row.options = selectItem.salerTree
        selectItem.salerAfter = selectItem.salerTree
      } // 切换业务员勾选再清空后数据错乱
    },
    // 搜索业务员和禁用重复项
    searchSaler(index) {
      const subStrategyRates = this.subForm.subStrategyRates
      const selectItem = subStrategyRates[index]
      if (!selectItem.salerName) return
      selectItem.salerLoading = true
      getPolicySalesEffective({
        companyIds: [this.adminViewId],
        keyword: selectItem.salerName
      })
        .then(res => {
          const jsonS = JSON.parse(
            JSON.stringify(res.data)
              .replace(/salesName/g, 'label')
              .replace(/id/g, 'value')
          )
          if (jsonS.length > 0) {
            selectItem.options = jsonS
          } else {
            selectItem.options = []
          }

          subStrategyRates
            .filter(
              (item, itemIndex) =>
                parseInt(item.rateType) === 3 && itemIndex !== index
            )
            .forEach(item => {
              item.salerKey.forEach(value =>
                this.recursionTrue(value, selectItem.options)
              )
            })
          selectItem.salerLoading = false
        })
        .catch(err => {
          selectItem.salerLoading = false
          console.warn(err)
        })
    },
    // 选择业务员
    chooseSaler(row, index, name) {
      const subStrategyRates = this.subForm.subStrategyRates
      const selectItem = subStrategyRates[index]
      selectItem.salerBefore = this.$refs[name].getCheckedNodes()
      const { before, after } = this.getBeforeAndAfterKeys(
        selectItem.salerBefore,
        selectItem.salerAfter
      )
      // console.log(before, after) // 每次勾选的增加值和减少值
      if (after.length > 0 && before.length > 0) {
        for (let i = 0; i < after.length; i++) {
          let isEqual = true
          for (let j = 0; j < before.length; j++) {
            if (after[i].value === before[j].value) {
              isEqual = false
            }
          }
          if (isEqual) {
            // 如果两个比对数组完全不一样，就只增加，不减少（切换搜索业务员）
            after.forEach(item => selectItem.salerTree.push(item))
            // console.log(selectItem.salerTree)
          }
        }
      } else {
        before.forEach(item => {
          selectItem.salerTree.forEach((itemD, index) => {
            if (itemD.value === item.value) {
              selectItem.salerTree.splice(index, 1)
            }
          })
        })
        after.forEach(item => selectItem.salerTree.push(item))
      }
      selectItem.salerAfter = JSON.parse(JSON.stringify(selectItem.salerBefore))
      // console.log(selectItem.salerTree)

      if (selectItem.salerTree.length > 0) {
        selectItem.salerValue = selectItem.salerTree[0].label
        selectItem.isSalerValue = true
        selectItem.salerNum = selectItem.salerTree.length
      } else {
        selectItem.salerValue = ''
        selectItem.salerNum = null
        selectItem.isSalerValue = false
      }
      selectItem.salerKey = []
      for (let i = 0, lenT = selectItem.salerTree.length; i < lenT; i++) {
        selectItem.salerKey.push(selectItem.salerTree[i].value)
      }
      const { add, remove } = this.getAddAndRemoveKeys(
        selectItem.lastKey,
        selectItem.salerKey
      )
      subStrategyRates
        .filter(
          (item, itemIndex) =>
            parseInt(item.rateType) === 3 && itemIndex !== index
        )
        .forEach(item => {
          add.forEach(addValue => this.recursionTrue(addValue, item.options))
          remove.forEach(addValue =>
            this.recursionFalse(addValue, item.options)
          )
        })
      selectItem.lastKey = [...selectItem.salerKey]
      const arr = []
      for (let i = 0, len = selectItem.salerKey.length; i < len; i++) {
        const obj = {
          salesId: selectItem.salerKey[i],
          parentCompanyId: this.adminViewId
        }
        arr.push(obj)
      }
      // 接口参数
      selectItem.companies = arr
    },
    // 对比数组查找新增值和删除值
    getAddAndRemoveKeys(last, current) {
      const add = current.filter(item => {
        return last.every(item2 => item !== item2)
      })
      const remove = last.filter(item => {
        return current.every(item2 => item !== item2)
      })
      return { add, remove }
    },
    // 对比数组查找新增值和删除值
    getBeforeAndAfterKeys(last, current) {
      const before = current.filter(item => {
        return last.every(item2 => item.value !== item2.value)
      })
      const after = last.filter(item => {
        return current.every(item2 => item.value !== item2.value)
      })
      return { before, after }
    },
    // 增加机构
    addChannel() {
      // 添加禁用项
      let options = this.copyData(this.channelData)
      this.subForm.subStrategyRates
        .filter((item, itemIndex) => parseInt(item.rateType) === 2)
        .forEach(item => {
          item.companyKey.forEach(value => this.recursionTrue(value, options))
        })
      const c = {
        businessRiskRate: null,
        businessRiskTaxRate: null,
        companies: [],
        companyKey: [],
        isChannelOpen: false,
        isChannelValue: false,
        channelValue: '',
        channelNum: null,
        lastKey: [],
        options,
        computeType: '1',
        forceRiskRate: null,
        forceRiskTaxRate: null,
        operateId: this.$store.getters.userAll.data.id,
        rateType: '2',
        rateTypeTitle: '下游机构佣金'
      }
      this.subForm.subStrategyRates.push(c)
    },
    // 增加业务员
    addSaler() {
      const s = {
        businessRiskRate: null,
        businessRiskTaxRate: null,
        companies: [],
        isSalerValue: false, // 业务员选中的是否有值
        isSalerOpen: false, // 是否展开树
        salerValue: '', // 选中的业务员名称
        salerNum: null, // 选中的业务员数量
        options: [], // 搜索出的业务员数据
        salerLoading: false,
        salerName: '', // 搜索值
        salerKey: [], // 选中的业务员id
        salerTree: [], // 选中的业务员树
        salerAfter: [], // 相等树
        salerBefore: [], // 相加树
        lastKey: [], // 最后的业务员id
        computeType: '1',
        forceRiskRate: null,
        forceRiskTaxRate: null,
        operateId: this.$store.getters.userAll.data.id,
        rateType: '3',
        rateTypeTitle: '业务员佣金'
      }
      this.subForm.subStrategyRates.push(s)
    },
    // 增加下游批量业务员佣金
    addTeam() {
      // 添加禁用项
      let options = this.copyData(this.teamData)
      this.subForm.subStrategyRates
        .filter((item, itemIndex) => parseInt(item.rateType) === 4)
        .forEach(item => {
          item.allKey.forEach(value => this.recursionTrue(value, options))
        })
      const s = {
        businessRiskRate: null,
        businessRiskTaxRate: null,
        companies: [],
        teamKey: [],
        allKey: [],
        lastKey: [],
        isTeamOpen: false,
        isTeamValue: false,
        teamValue: '',
        teamNum: null,
        options,
        computeType: '1',
        forceRiskRate: null,
        forceRiskTaxRate: null,
        operateId: this.$store.getters.userAll.data.id,
        rateType: '4',
        rateTypeTitle: '业务员佣金'
      }
      this.subForm.subStrategyRates.push(s)
    },
    // 删除
    subDelete(index) {
      const delData = this.subForm.subStrategyRates[index]
      if (!delData.isUploaded) {
        this.subForm.subStrategyRates.splice(index, 1)
        if (parseInt(delData.rateType) === 2) {
          this.resetDeleteOptions(delData.rateType, delData.companyKey)
        } else if (parseInt(delData.rateType) === 3) {
          this.resetDeleteOptions(delData.rateType, delData.salerKey)
        } else if (parseInt(delData.rateType) === 4) {
          this.resetDeleteOptions(delData.rateType, delData.allKey)
        }
        return
      }
      this.$confirm(
        '该操作会立即删除改费率信息，仍要继续删除吗？',
        '温馨提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: action => {
            if (action === 'confirm') {
              this.deleteItem(delData, index)
            }
          }
        }
      )
    },
    deleteItem(item, index) {
      deleteStrategyRate(item.id).then(data => {
        if (data && data.status === 200) {
          this.$message({
            type: 'success',
            message: '删除费率成功!'
          })
          this.subForm.subStrategyRates.splice(index, 1)
          if (parseInt(item.rateType) === 2) {
            this.resetDeleteOptions(item.rateType, item.companyKey)
          } else if (parseInt(item.rateType) === 3) {
            this.resetDeleteOptions(item.rateType, item.salerKey)
          } else if (parseInt(item.rateType) === 4) {
            this.resetDeleteOptions(item.rateType, item.allKey)
          }
        }
      })
    },
    // 删除掉item 禁用项要去掉
    resetDeleteOptions(type, list) {
      this.subForm.subStrategyRates
        .filter((item, itemIndex) => parseInt(item.rateType) === parseInt(type))
        .forEach(item => {
          list.forEach(value => this.recursionFalse(value, item.options))
        })
    },
    // 递归函数
    recursionTeam(data) {
      const getId = arr => {
        arr.map(v => {
          if (v.companyType !== '2') {
            v.disabled = true
            if (v.children && v.children.length > 0) {
              getId(v.children)
            }
          }
        })
      }
      getId(data)
      return data
    },
    // 递归函数
    recursionTrue(res, data) {
      let isover = false
      const getId = arr => {
        if (isover) return
        arr.map(v => {
          if (res === v.value) {
            v.disabled = true
            return (isover = true)
          } else {
            if (v.children && v.children.length > 0) {
              getId(v.children)
            }
          }
        })
      }
      getId(data)
    },
    // 递归函数
    recursionFalse(res, data) {
      let isover = false
      const getId = arr => {
        if (isover) return
        arr.map(v => {
          if (res === v.value) {
            v.disabled = false
            return (isover = true)
          } else {
            if (v.children && v.children.length > 0) {
              getId(v.children)
            }
          }
        })
      }
      getId(data)
    },
    // 递归函数
    recursionDelete(res, data) {
      let isover = false
      const getId = arr => {
        if (isover) return
        arr.map((item, index) => {
          if (res === item.value) {
            // arr = arr.splice(index, 1)
            item.disabled = true
            return (isover = true)
          } else {
            if (item.children && item.children.length > 0) {
              getId(item.children)
            }
          }
        })
      }
      getId(data)
      return data
    },
    // 反向递归函数
    searchImplement(id, item, callback) {
      if (item.value === id) {
        callback(item.value)
        return item
      } else if (item.children) {
        for (let child of item.children) {
          let res = this.searchImplement(id, child, callback)
          if (res) {
            callback(item.value)
            return res
          }
        }
      }
    },
    isHeadRateType(subStrategyRate) {
      return (
        subStrategyRate.rateType === '1' &&
        subStrategyRate.companies &&
        subStrategyRate.companies.length > 0 &&
        subStrategyRate.companies.some(value => value.head === 0)
      )
    },
    parentTitle(subStrategyRate) {
      return this.isHeadRateType(subStrategyRate)
        ? '上游保险公司手续费'
        : '上游机构手续费'
    }
  }
}
</script>

<style lang="scss">
.sub-edit-policy {
  .el-input__inner {
    padding: 0 10px !important;
  }
  padding: 20px;
  .el-form-item {
    margin-bottom: 10px;
    .el-form-item__label {
      float: none;
    }
    .el-form-item__content {
      margin-left: 0px !important;
      width: 100%;
    }
    .el-input-group__append {
      padding: 0 8px;
    }
  }
  .sub-tree-tag {
    float: left;
    width: 200px;
  }
  .sub-tree-tag-text {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
    width: 160px;
  }
  .sub-tree-tag-close {
    top: -7px !important;
  }
}
.el-tree-select-dropdown {
  .el-tree {
    width: 250px;
    height: 300px;
    overflow: auto;
  }
  .el-tree-node > .el-tree-node__children {
    overflow: visible;
  }
}
#popoverChannel,
#popoverTeam,
#popoverSaler {
  width: 224px;
  height: 300px;
  margin-top: 10px;
  overflow: auto;
  .el-tree-node > .el-tree-node__children {
    overflow: visible;
  }
}
</style>
