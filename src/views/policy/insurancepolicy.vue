<template>
  <!-- eslint-disable -->
  <div class="app-container">
    <div class="app-panel policy-insure">
      <div class="policy-company">
        <el-button
          v-permission="permissionList.policyStrategyAdd"
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="addPolicy"
        >添加</el-button>
        <div class="policy-company-select">
          <div style="color: rgba(0,0,0,.65);line-height: 32px;float: left;">全部工号</div>
          <div style="margin-left: 56px;">
            <el-select
              v-model="channelsName"
              v-if="isAnyAdminChannel"
              :loading="channelData.loading"
              clearable
              filterable
              placeholder="所属渠道"
              style="width: 99px;"
              size="small"
              @focus="getChannel"
              @change="changeFilter"
            >
              <el-option
                v-for="item in channelData.data"
                :label="item.shortName"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
            <el-select
              v-model="companyName"
              :loading="companyData.loading"
              clearable
              filterable
              placeholder="保险公司"
              :style=" isAnyAdminChannel? 'width: 99px;' : 'width: 100%;'"
              size="small"
              @focus="getAllCompany"
              @change="changeFilter"
            >
              <el-option
                v-for="item in companyData.data"
                :label="item.name"
                :key="item.id"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
        <div v-loading="policyCompany.loading" class="policy-company-list">
          <div
            v-for="(item, index) in policyCompany.data"
            :key="index"
            :class="isActive === index ? 'active':''"
            class="policy-company-item"
            @click="choose(item, index)"
          >
            <span
              :class="item.strategyStatus === '1' ? 'company-list-icon_green':'company-list-icon_red'"
              class="company-list-icon"
            />
            <span class="company-list-name">{{ item.channelName }}</span>
          </div>
        </div>
      </div>
      <div class="policy-contain">
        <div style="display:flex;flex-flow:row;">
          <div style="flex: 1;">
            <el-select
              v-model="flag"
              style="width: 120px;margin: 10px 5px 0px 0px;"
              clearable
              placeholder="政策状态"
              size="small"
            >
              <el-option
                v-for="item in flagStatus"
                :key="item.code"
                :label="item.value"
                :value="item.code"
              />
            </el-select>
            <el-input
              v-model="policyInput"
              style="width: 270px;margin-top: 10px;"
              placeholder="请输入内容"
              size="small"
            >
              <el-select slot="prepend" v-model="policySelect" @change="setPolicyNameId">
                <el-option label="政策名称" value="name"/>
                <el-option label="政策id" value="sequence"/>
              </el-select>
            </el-input>
            <el-button
              type="primary"
              style="margin-top: 10px;"
              icon="el-icon-search"
              size="small"
              @click="query"
            >查询</el-button>
          </div>
          <div style="width: 250px;">
            <el-tree-select
              v-if="isAnyAdminChannel"
              v-model="channelView"
              :data="channelOptions"
              :defaultExpandAll="false"
              clearable
              filterable
              placeholder="选择机构视角"
              size="small"
              style="width: 250px;line-height:32px;margin-top: 10px;"
              @change="chooseChannel"
            />
          </div>
        </div>
        <div class="policy-contain-table">
          <el-table
            v-loading="isLoading"
            :data="policyTableData"
            :header-cell-style="{background:'#fafafa'}"
            height="calc(100vh - 305px)"
            style="width: 100%;"
            @expand-change="getRow"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table
                  v-loading="props.row.isSubLoading"
                  :data="props.row.children"
                  style="width: 100%"
                  :header-cell-style="{background:'#fafafa'}"
                >
                  <el-table-column prop="name" label="子政策名称"/>
                  <el-table-column prop="rateText" label="上游手续费"/>
                  <el-table-column prop="computeTypeText" label="结算方式"/>
                  <el-table-column label="操作">
                    <template slot-scope="child">
                      <el-button v-permission="permissionList.policySubStrategyView"
                        type="text" size="medium" @click="getSubPolicyInfo(child.row)">查看
                      </el-button>
                      <el-button v-if="!isExpireStatus(props.row.timeStatus)" v-permission="permissionList.policySubStrategyEdit"
                        type="text" size="medium" @click="editSubPolicyInfo(child.row, props.row)">编辑
                      </el-button>
                      <el-button v-if="higherCreater(props.row) && isAddedStatus(props.row.timeStatus)" v-permission="permissionList.policySubStrategyDelete"
                        type="text" size="medium" @click="deleteSubPolicyInfo(child.$index, child.row)">删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div v-if="props.row.totalCount > 0" class="el-pagination-wrap">
                  <el-pagination
                    @current-change="handleItemCurrentChange($event, props.row)"
                    :current-page="props.row.page"
                    :page-size="props.row.pageSize"
                    layout="prev, pager, next"
                    :total="props.row.totalCount"
                  ></el-pagination>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="ID" prop="sequence" width="50"/>
            <el-table-column label="政策名称" prop="name" min-width="200"/>
            <el-table-column label="所属机构" prop="createrCompanyName" min-width="100"/>
            <el-table-column :formatter="formatTime" label="生效时间" prop="effectiveTime" width="150"/>
            <el-table-column :formatter="formatStatus" label="状态" prop="status" width="80"/>
            <el-table-column label="操作" prop="desc" min-width="260">
              <template slot-scope="scope">
                <!-- <span v-if="likeCreater(scope.row) && isAddedStatus(scope.row.timeStatus)">
                  <span v-permission="permissionList.policyStrategyDisplay" class="operation-menu" @click="seePolicy(scope.row)">
                    设置可见<span class="divider"></span>
                  </span>
                </span>-->
                <el-button v-if="higherCreater(scope.row) && (isAddedStatus(scope.row.timeStatus) || isEffectStatus(scope.row.timeStatus))" v-permission="permissionList.policySubStrategyAdd"
                  type="text" size="medium" @click="addSubPolicyInfo(scope.row)">添加子政策
                </el-button>
                <el-button v-if="higherCreater(scope.row)" v-permission="permissionList.policyStrategyCopy"
                  type="text" size="medium" @click="copyPolicy(scope.row)">复制
                </el-button>
                <el-button v-if="higherCreater(scope.row) && (isAddedStatus(scope.row.timeStatus) || isEffectStatus(scope.row.timeStatus))" v-permission="permissionList.policyStrategyEdit"
                  type="text" size="medium" @click="editPolicy(scope.row)">编辑
                </el-button>
                <el-button v-if="higherCreater(scope.row) && isAddedStatus(scope.row.timeStatus)" v-permission="permissionList.policyStrategyDelete"
                  type="text" size="medium" @click="deletePolicy(scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="totalCount > 0" class="el-pagination-wrap">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-size="pageSize"
              layout="prev, pager, next"
              :total="totalCount"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 子政策查看 -->
    <app-drawer
      :onlyClose="true"
      :is-show="isSubSeeShow"
      :drawer-title="title"
      :mask-closable="false"
      drawer-style="width: 1300px;"
      @drawerClose="close"
      @drawerConfirm="subSeeConfirm"
    >
      <sub-see-policy
        v-if="isSubSeeShow"
        :sub-strategy-id="subStrategyId"
        :admin-view-id="channelView"
      />
    </app-drawer>
    <!-- 子政策新增编辑 -->
    <app-drawer
      :is-show="isSubEditShow"
      :drawer-title="title"
      :mask-closable="false"
      drawer-style="width: 1300px;"
      @drawerClose="close"
      @drawerConfirm="subEditConfirm"
    >
      <sub-edit-policy
        v-if="isSubEditShow"
        ref="subEditPolicy"
        :sub-policy-id="subPolicyId"
        :admin-view-id="channelView"
        :strategyModel="strategyModel"
        :sub-company-data="subCompanyData"
        :sub-policy-data="subPolicyData"
        :sub-policy-status="subPolicyStatus"
        :sub-name-status="subNameStatus"
        :isEffect="isEffect"
        :isAdded="isAdded"
        :isPolicyCreator="isPolicyCreator"
      />
    </app-drawer>
    <!-- 政策新增编辑 -->
    <app-drawer
      :is-show="isAddShow"
      :drawer-title="title"
      :mask-closable="false"
      drawer-style="width: 400px;"
      @drawerClose="close"
      @drawerConfirm="editConfirm"
    >
      <add-policy
        v-if="isAddShow"
        ref="addPolicy"
        :policy-id="policyId"
        :is-copy="isCopy"
        :is-edit="isEdit"
      />
    </app-drawer>
    <!-- 政策可见 -->
    <app-drawer
      :is-show="isSeeShow"
      :drawer-title="title"
      :mask-closable="false"
      drawer-style="width: 400px;"
      @drawerClose="close"
      @drawerConfirm="seeConfirm"
    >
      <see-policy v-if="isSeeShow" ref="seePolicy" :policy-data="policyData"/>
    </app-drawer>
  </div>
</template>

<script>
/* eslint-disable */
import {
  getChannelEffective,
  getPolicyAllCompany,
  getPolicyInsureCompany,
  getPolicyInsureView,
  policyStatus,
  selectPolicy,
  policySubID,
  policySee,
  policyAdd,
  policyCopy,
  policyEdit,
  policyDelete,
  subPolicyInsert,
  subPolicyUpdate,
  subPolicyDelete,
  deleteStrategySee
} from '@/api/policy'
import { mapGetters } from 'vuex'
import ElTreeSelect from '@/components/ElTreeSelect/index'
import subSeePolicy from '@/views/policy/subSeePolicy'
import subEditPolicy from '@/views/policy/subEditPolicy'
import addPolicy from '@/views/policy/addPolicy'
import seePolicy from '@/views/policy/seePolicy'
import appDrawer from '@/components/Drawer/drawer'
// 1 生效中 2 已添加 3 已失效
const StrategyStatus = {
  effect: 1,
  added: 2,
  expired: 3
}
export default {
  components: {
    subSeePolicy,
    subEditPolicy,
    addPolicy,
    seePolicy,
    appDrawer,
    ElTreeSelect
  },
  data() {
    return {
      isEffect: false,
      isAdded: false,
      isPolicyCreator: false,
      resData: [],
      channelsName: '',
      channelData: {
        loading: false,
        data: []
      },
      channelView: '',
      channelOptions: [],
      companyName: '',
      companyData: {
        loading: false,
        data: []
      },
      isActive: -1,
      insureCompanyChannelId: '',
      policyCompany: {
        loading: false,
        data: []
      },
      flag: null,
      flagStatus: [],
      policyInput: null,
      sequenceValue: null,
      nameValue: null,
      page: 1,
      pageSize: 20,
      totalCount: 0,
      policySelect: 'name',
      isLoading: false,
      isSubLoading: false,
      policyTableData: [],
      isSubSeeShow: false,
      title: '',
      subStrategyId: '',
      isAddShow: false,
      policyId: '',
      isCopy: false,
      isEdit: false,
      subPolicyId: '',
      subCompanyData: {},
      subPolicyData: {},
      policyData: {},
      isSubEditShow: false,
      isSeeShow: false,
      CompanyIndex: '',
      subPolicyStatus: false,
      subNameStatus: false,
      lastExpandRow: null,
      strategyModel: null
    }
  },
  computed: {
    ...mapGetters([
      'getLastCompany',
      'isAnyAdminChannel' // 判断登陆用户是否是管理员渠道
    ])
  },
  watch: {},
  created() {
    if (!this.isAnyAdminChannel) {
      const blcs = this.$store.getters.userAll.data.belongCompanys
      const maxItem = blcs.sort((a, b) => b.level - a.level)[0]
      this.channelView = maxItem.id
    }
    this.getCompany()
    this.getPolicyStatus()
  },
  methods: {
    // 添加
    addPolicy() {
      this.title = '添加政策'
      this.isAddShow = true
      this.policyId = ''
      this.isEdit = false
      this.isCopy = false
    },
    // 添加编辑复制政策
    editConfirm() {
      const addFormData = this.$refs.addPolicy.roleForm
      console.log(addFormData)
      this.$refs.addPolicy.$refs.addPolicy.validate(valid => {
        if (!valid) return
        if (this.policyId === '') {
          if (!addFormData.createrCompanyId) {
            this.$message.error('此工号不可添加政策')
            return
          }
          policyAdd({
            backup: addFormData.backup,
            channelCode: addFormData.channelCode,
            expireTime: addFormData.expireTime,
            createrCompanyId: addFormData.createrCompanyId,
            insureCompanyChannelId: addFormData.insureCompanyChannelId,
            name:
              addFormData.name +
              '-' +
              '[' +
              addFormData.startTime.slice(0, 10) +
              ']',
            startTime: addFormData.startTime
          })
            .then(res => {
              this.isAddShow = false
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.insureCompanyChannelId = addFormData.insureCompanyChannelId
              this.query()
              this.getCompany()
            })
            .catch(err => {
              console.warn(err)
            })
        } else {
          if (this.isCopy) {
            policyCopy({
              backup: addFormData.backup,
              channelCode: addFormData.channelCode,
              expireTime: addFormData.expireTime,
              id: addFormData.id,
              insureCompanyChannelId: addFormData.insureCompanyChannelId,
              name: addFormData.name,
              startTime: addFormData.startTime
            })
              .then(res => {
                this.isAddShow = false
                this.$message({
                  message: '复制成功',
                  type: 'success'
                })
                this.query()
                this.getCompany()
              })
              .catch(err => {
                console.warn(err)
                this.$message.error(err)
              })
          } else {
            policyEdit({
              backup: addFormData.backup,
              channelCode: addFormData.channelCode,
              expireTime: addFormData.expireTime,
              id: addFormData.id,
              insureCompanyChannelId: addFormData.insureCompanyChannelId,
              name: addFormData.name,
              startTime: addFormData.startTime
            })
              .then(res => {
                this.isAddShow = false
                this.$message({
                  message: '编辑成功',
                  type: 'success'
                })
                this.query()
                this.getCompany()
              })
              .catch(err => {
                console.warn(err)
                this.$message.error(err)
              })
          }
        }
      })
    },
    // 是否为正数字
    isNum(value) {
      return (
        value === null || value === undefined || !/^\d+(\.\d+)?$/.test(value)
      )
    },
    // 是否为数字
    isFuNum(value) {
      return (
        value === null ||
        value === undefined ||
        !/^((-?\d+\.\d+)|(-?\d+)|(-?\.\d+))$/.test(value)
      )
    },
    // 新增编辑子政策
    subEditConfirm() {
      const formData = JSON.parse(
        JSON.stringify(this.$refs.subEditPolicy.subForm)
      )
      console.log(formData)
      for (
        let i = 0, len = formData.subStrategyMatchCauses.length;
        i < len;
        i++
      ) {
        if (formData.subStrategyMatchCauses[i].code === '00004') {
          if (formData.wrapValue004) {
            formData.subStrategyMatchCauses[i].wrapValue = formData.wrapValue004
          }
        }
        if (formData.subStrategyMatchCauses[i].code === '00005') {
          if (formData.wrapValue005) {
            formData.subStrategyMatchCauses[i].wrapValue = formData.wrapValue005
          }
        }
        if (formData.subStrategyMatchCauses[i].code === '00006') {
          if (formData.wrapValue006) {
            formData.subStrategyMatchCauses[i].wrapValue = formData.wrapValue006
          }
        }
        if (formData.subStrategyMatchCauses[i].code === '00007') {
          if (formData.wrapValue007) {
            formData.subStrategyMatchCauses[i].wrapValue = formData.wrapValue007
          }
        }
        if (formData.subStrategyMatchCauses[i].code === '00008') {
          if (formData.wrapValue008) {
            formData.subStrategyMatchCauses[i].wrapValue = formData.wrapValue008
          }
        }
        if (formData.subStrategyMatchCauses[i].code === '00009') {
          if (formData.wrapValue009) {
            formData.subStrategyMatchCauses[i].wrapValue = formData.wrapValue009
          }
        }
        if (formData.subStrategyMatchCauses[i].code === '00100') {
          if (formData.wrapValue100) {
            formData.subStrategyMatchCauses[i].wrapValue = formData.wrapValue100
          }
        }
        if (formData.subStrategyMatchCauses[i].code === '00101') {
          if (formData.wrapValue101) {
            formData.subStrategyMatchCauses[i].wrapValue = [
              formData.wrapValue101
            ]
          }
        }
        if (formData.subStrategyMatchCauses[i].code === '00102') {
          if (
            formData.wrapValuePlate102 &&
            formData.wrapValueNumber102.length > 0
          ) {
            const arr = []
            for (let i = 0; i < formData.wrapValueNumber102.length; i++) {
              const c =
                formData.wrapValuePlate102 +
                '---' +
                formData.wrapValueNumber102[i]
              arr.push(c)
            }
            formData.subStrategyMatchCauses[i].wrapValue = arr
          } else {
            if (
              !formData.wrapValuePlate102 ||
              formData.wrapValueNumber102.length <= 0
            ) {
              formData.subStrategyMatchCauses[i].wrapValue = []
            }
          }
        }
        if (formData.subStrategyMatchCauses[i].code === '00103') {
          if (formData.wrapValue103 && formData.wrapValue103.length > 0) {
            formData.subStrategyMatchCauses[i].wrapValue = [
              formData.wrapValue103
            ]
          }
        }
        if (formData.subStrategyMatchCauses[i].code === '00104') {
          if (formData.wrapValue104 && formData.wrapValue104.length > 0) {
            formData.subStrategyMatchCauses[i].wrapValue = [
              formData.wrapValue104
            ]
          }
        }
        if (formData.subStrategyMatchCauses[i].code === '00105') {
          if (formData.wrapValueMin105 && formData.wrapValueMax105) {
            if (
              this.isFuNum(formData.wrapValueMin105) ||
              this.isFuNum(formData.wrapValueMax105)
            ) {
              this.$message.error('请输入正确的数值数据')
              return
            } else if (
              parseFloat(formData.wrapValueMin105) >
              parseFloat(formData.wrapValueMax105)
            ) {
              this.$message.error('最低值不能大于最高值')
              return
            } else {
              formData.subStrategyMatchCauses[i].wrapValue = [
                formData.wrapValueMin105,
                formData.wrapValueMax105
              ]
            }
          } else {
            formData.subStrategyMatchCauses[i].wrapValue = []
          }
        }
        if (formData.subStrategyMatchCauses[i].code === '00106') {
          if (formData.wrapValueMin106 && formData.wrapValueMax106) {
            if (
              this.isFuNum(formData.wrapValueMin106) ||
              this.isFuNum(formData.wrapValueMax106)
            ) {
              this.$message.error('请输入正确的数值数据')
              return
            } else if (
              parseFloat(formData.wrapValueMin106) >
              parseFloat(formData.wrapValueMax106)
            ) {
              this.$message.error('最低值不能大于最高值')
              return
            } else {
              formData.subStrategyMatchCauses[i].wrapValue = [
                formData.wrapValueMin106,
                formData.wrapValueMax106
              ]
            }
          } else {
            formData.subStrategyMatchCauses[i].wrapValue = []
          }
        }
      }
      for (let i = 0, len = formData.subStrategyRates.length; i < len; i++) {
        if (
          this.subPolicyId !== '' &&
          parseInt(formData.subStrategyRates[i].rateType) === 1
        )
          continue
        if (
          this.isNum(formData.subStrategyRates[i].forceRiskRate) ||
          this.isNum(formData.subStrategyRates[i].forceRiskTaxRate) ||
          this.isNum(formData.subStrategyRates[i].businessRiskRate) ||
          this.isNum(formData.subStrategyRates[i].businessRiskTaxRate)
        ) {
          this.$message.error('请输入正确的费率')
          return
        }
        if (
          Number(formData.subStrategyRates[i].forceRiskTaxRate) < 0 ||
          Number(formData.subStrategyRates[i].forceRiskTaxRate) > 100 ||
          Number(formData.subStrategyRates[i].businessRiskTaxRate) < 0 ||
          Number(formData.subStrategyRates[i].businessRiskTaxRate) > 100
        ) {
          this.$message.error('费率数据有误，费率区间为0-100')
          return
        }
        if (
          formData.subStrategyRates[i].rateType !== '1' &&
          formData.subStrategyRates[i].companies.length <= 0
        ) {
          this.$message.error('请选择费率关联机构')
          return
        }
        if (formData.subStrategyRates[i].options) {
          formData.subStrategyRates[i].options = []
        }
      }
      formData.rangeCompanyId = this.channelView
      this.$refs.subEditPolicy.$refs.subEditPolicy.validate(valid => {
        if (!valid) return
        if (this.subPolicyId === '') {
          subPolicyInsert(formData)
            .then(res => {
              this.$refs.subEditPolicy.subForm = { ...formData }
              console.log(res.msg)
              this.isSubEditShow = false
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              // this.query()
              this.rowRequest(this.lastExpandRow, true)
            })
            .catch(err => {
              console.warn(err)
              this.$message.error(err)
            })
        } else {
          console.log('subPolicyUpdate')
          subPolicyUpdate(formData)
            .then(res => {
              this.$refs.subEditPolicy.subForm = { ...formData }
              console.log(res.msg)
              this.isSubEditShow = false
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
              // this.query()
              this.rowRequest(this.lastExpandRow, true)
            })
            .catch(err => {
              console.warn(err)
              this.$message.error(err)
            })
        }
      })
    },
    // 政策公司列表
    getCompany() {
      this.policyCompany.loading = true
      getPolicyInsureCompany()
        .then(res => {
          this.policyCompany.loading = false
          this.policyCompany.data = res.data
          this.resData = res.data
        })
        .catch(err => {
          this.policyCompany.loading = false
          console.warn(err)
          this.$message.error(err)
        })
    },
    // 获取状态
    getPolicyStatus() {
      policyStatus()
        .then(res => {
          this.flagStatus = res.data
        })
        .catch(err => {
          console.warn(err)
          this.$message.error(err)
        })
    },
    // 渠道
    getChannel() {
      this.channelData.loading = true
      getChannelEffective()
        .then(res => {
          this.channelData.loading = false
          this.channelData.data = res.data
        })
        .catch(err => {
          this.channelData.loading = false
          console.warn(err)
          this.$message.error(err)
        })
    },
    // 保险公司
    getAllCompany() {
      this.companyData.loading = true
      getPolicyAllCompany()
        .then(res => {
          this.companyData.loading = false
          this.companyData.data = res.data
        })
        .catch(err => {
          this.companyData.loading = false
          console.warn(err)
          this.$message.error(err)
        })
    },
    // 筛选
    changeFilter() {
      if (this.channelsName !== '' && this.companyName !== '') {
        let arr = []
        for (const i of this.resData) {
          if (
            Number(i.companyId) === this.companyName &&
            i.sourceId === this.channelsName
          ) {
            arr.push(i)
          }
        }
        this.policyCompany.data = arr
      }
      if (this.channelsName === '' && this.companyName === '') {
        this.policyCompany.data = this.resData
      }
      if (this.channelsName !== '' && this.companyName === '') {
        let arr = []
        for (const i of this.resData) {
          if (i.sourceId === this.channelsName) {
            arr.push(i)
          }
        }
        this.policyCompany.data = arr
      }
      if (this.channelsName === '' && this.companyName !== '') {
        let arr = []
        for (const i of this.resData) {
          if (Number(i.companyId) === this.companyName) {
            arr.push(i)
          }
        }
        this.policyCompany.data = arr
      }
    },
    // 选取列表的保险公司
    async choose(item, index) {
      this.isActive = index
      this.insureCompanyChannelId = item.id
      // 获取机构视角
      const res = await getPolicyInsureView(item.belongCompany)
      const json = JSON.parse(
        JSON.stringify(res.data)
          .replace(/title/g, 'label')
          .replace(/key/g, 'value')
      )
      this.channelOptions = json
      console.log(this.channelOptions)
      this.query()
      // this.flag = null
      // this.policyInput = null
    },
    setPolicyNameId() {
      this.policyInput = null
    },
    async chooseChannel(val) {
      this.channelView = val
      this.query()
    },
    // 查询
    query() {
      this.isLoading = true
      const reg = /^[0-9]*$/
      let sequenceValue,
        nameValue = null
      if (this.policySelect === 'sequence') {
        if (reg.test(this.policyInput)) {
          sequenceValue = this.policyInput
        }
      } else {
        nameValue = this.policyInput
      }
      if (!this.insureCompanyChannelId) {
        this.$message({
          message: '请选择工号',
          type: 'warning'
        })
        this.isLoading = false
        return
      }
      // 选中工号查询
      selectPolicy({
        model: {
          flag: this.flag,
          insureCompanyChannelId: this.insureCompanyChannelId,
          sequence: sequenceValue,
          name: nameValue
        },
        page: this.page,
        size: this.pageSize
      })
        .then(res => {
          this.isLoading = false
          let arr = JSON.parse(JSON.stringify(res.data.model))
          arr.map((itemC, index) => {
            let list = []
            for (const itemT of this.channelOptions) {
              this.searchImplement(itemC.createrCompanyId, itemT, value => {
                list.push(value)
              })
            }
            arr[index].agreeOptions = list
          })
          this.policyTableData = arr
          this.totalCount = res.data.count
        })
        .catch(err => {
          this.isLoading = false
          console.warn(err)
          this.$message.error(err)
        })
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
    handleCurrentChange(val) {
      console.log(`handleCurrentChange 当前页: ${val}`)
      this.page = val
      this.query()
      // this.queryPersonList(this.currentPage, this.pageSize)
    },
    formatStatus(val) {
      for (let i = 0; i < this.flagStatus.length; i++) {
        if (this.flagStatus[i].code === val.timeStatus) {
          return this.flagStatus[i].value
        }
      }
    },
    formatTime(val) {
      return val.startTime.slice(0, 16) + ' ~  ' + val.expireTime.slice(0, 16)
    },
    // 展开
    getRow(row) {
      console.log(row)
      this.lastExpandRow = row
      this.subCompanyData = row
      if (this.policyTableData && this.policyTableData.length > 0) {
        for (let i = 0; i < this.policyTableData.length; i++) {
          if (this.policyTableData[i] === row) {
            this.CompanyIndex = i
          }
        }
      }
      if (!row.children) {
        row.children = []
        row.childrenBackup = []
        row.page = 1
        row.pageSize = 10
        row.totalCount = 0
        this.rowRequest(row)
      } else {
        row.isSubLoading = false
      }
    },
    rowRequest(row, isRefresh) {
      console.log(row.id)
      let cid
      if (this.channelView) {
        cid = this.channelView
      } else {
        cid = this.$store.getters.userAll.data.companyId
      }
      policySubID(cid, row.id).then(res => {
        row.isSubLoading = false
        if (res.data) {
          if (isRefresh && row.children)
            row.children.splice(0, row.children.length)
          res.data.forEach((item, index) => {
            const subStrategyRates = item.subStrategyRates
            const params = {
              rateText:
                subStrategyRates && subStrategyRates[0]
                  ? subStrategyRates[0].rateText
                  : '',
              computeTypeText:
                subStrategyRates && subStrategyRates[0]
                  ? subStrategyRates[0].computeTypeText
                  : '',
              ...item
            }
            if (index < row.pageSize) row.children.push(params)
            row.childrenBackup.push(params)
          })
          console.log('row.childrenBackup.length', row.childrenBackup.length)
          row.totalCount = row.childrenBackup.length
        }
      })
    },
    handleItemCurrentChange(page, item) {
      item.page = page
      const startIndex = (page - 1) * item.pageSize
      const endIndex = page * item.pageSize
      const res = item.childrenBackup.slice(startIndex, endIndex)
      // 不改变数组引用清空
      item.children.splice(0, item.children.length)
      const empty = []
      empty.push.apply(item.children, res)
    },
    // 设置可见
    seePolicy(row) {
      this.policyData = row
      this.isSeeShow = true
      this.title = '设置政策可见'
    },
    // 复制
    copyPolicy(row) {
      this.policyId = row.id
      this.title = '复制政策'
      this.isAddShow = true
      this.isCopy = true
      this.isEdit = false
    },
    // 编辑
    editPolicy(row) {
      this.title = '编辑政策'
      this.isAddShow = true
      this.policyId = row.id
      this.isEdit = true
      this.isCopy = false
    },
    // 删除
    deletePolicy(row) {
      this.$confirm(
        '删除政策将连带删除所有子政策，导致保单无法匹配政策，仍继续要删除吗？',
        '温馨提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          policyDelete(row.id)
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除政策成功!'
              })
              this.query()
            })
            .catch(err => {
              this.$message.error(err)
            })
        })
        .catch(() => {})
    },
    // 查看子政策
    getSubPolicyInfo(row) {
      if (this.isAnyAdminChannel && this.channelView === '') {
        this.$message.error('管理渠道请先选择机构视角')
        return
      }
      this.isSubSeeShow = true
      this.title = '查看子政策'
      this.subStrategyId = row.id
    },
    // 编辑子政策
    editSubPolicyInfo(row, pRow) {
      if (this.isAnyAdminChannel && this.channelView === '') {
        this.$message.error('管理渠道请先选择机构视角')
        return
      }
      this.subPolicyId = row.id
      this.subPolicyData = row
      console.log(this.subPolicyData)
      this.isSubEditShow = true
      this.title = '编辑子政策'
      this.subNameStatus =
        !this.isCreator(pRow) || this.isExpireStatus(pRow.timeStatus)
      this.subPolicyStatus =
        !this.isCreator(pRow) || this.isEffectStatus(pRow.timeStatus)
      // this.isPolicyCreator = this.isCreator(pRow)
      this.isEffect = this.isEffectStatus(pRow.timeStatus)
      this.isAdded = this.isAddedStatus(pRow.timeStatus)
      this.strategyModel = pRow
      console.log('editSubPolicyInfo', pRow)
    },
    // 删除子政策
    deleteSubPolicyInfo(index, row) {
      this.$confirm('确定需要删除该条子政策吗？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          subPolicyDelete(row.id)
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除子政策成功!'
              })
              this.rowRequest(this.lastExpandRow, true)
              // this.policyTableData[this.CompanyIndex].children.splice(index, 1)
            })
            .catch(err => {
              this.$message.error(err)
            })
        })
        .catch(() => {})
    },
    // 添加子政策
    addSubPolicyInfo(row) {
      // let isAgree = row.agreeOptions.some(item => {
      //   return item === this.channelView
      // })
      if (this.isAnyAdminChannel && this.channelView === '') {
        this.$message.error('管理渠道请先选择机构视角')
        return
      }
      // if (!isAgree) {
      //   this.$message.error('机构视角仅所属机构和上级可添加子政策')
      //   return
      // }
      this.subPolicyId = ''
      this.subPolicyData = row
      console.log(this.subPolicyData)
      this.isSubEditShow = true
      this.subPolicyStatus = false
      this.subNameStatus = false
      this.isPolicyCreator = false
      this.isEffect = false
      this.isAdded = false
      this.title = '添加子政策'
      this.strategyModel = row
    },
    // 关闭
    close() {
      this.isSubSeeShow = false
      this.isAddShow = false
      this.isSubEditShow = false
      this.isSeeShow = false
    },
    // 查看确定
    subSeeConfirm() {
      this.isSubSeeShow = false
    },
    // 政策可见确定
    seeConfirm() {
      const form = this.$refs.seePolicy.form
      // if (form.isSubmit) {
      //   this.isSeeShow = false
      //   return
      // }
      // 无机构直接隐藏
      if (!form.wrap || form.wrap.length === 0) {
        deleteStrategySee(this.$refs.seePolicy.policyData.id).then(res => {
          if (res.status === 200) {
            this.isSeeShow = false
            this.$message({
              message: '政策可见机构设置成功!',
              type: 'success'
            })
          }
        })
        return
      }
      this.$refs.seePolicy.$refs.seePolicy.validate(valid => {
        policySee(form)
          .then(res => {
            if (res.status === 200) {
              this.isSeeShow = false
              this.$message({
                message: res.msg,
                type: 'success'
              })
            }
          })
          .catch(err => {
            console.warn(err)
            this.$message.error(err)
          })
      })
    },
    // 归属机构可见
    likeCreater(item) {
      if (this.isAnyAdminChannel) {
        return true
      } else {
        return item && item.createrCompanyId === this.getLastCompany.id
      }
    },
    // 归属及上级机构可见
    higherCreater(item) {
      if (this.isAnyAdminChannel) {
        return true
      } else {
        return (
          item && item.agreeOptions.some(ele => item.createrCompanyId === ele)
        )
      }
    },
    isCreator(item) {
      // console.log('item', item)
      if (this.isAnyAdminChannel) {
        // return item && item.createrCompanyId === this.channelView
        return item && item.agreeOptions.some(ele => this.channelView === ele)
      } else {
        // return item && item.createrCompanyId === this.getLastCompany.id
        return (
          item && item.agreeOptions.some(ele => item.createrCompanyId === ele)
        ) // 放开上级
      }
    },
    // 是否已添加状态
    isAddedStatus(timeStatus) {
      return parseInt(timeStatus) === StrategyStatus.added
    },
    // 是否生效状态
    isEffectStatus(timeStatus) {
      return parseInt(timeStatus) === StrategyStatus.effect
    },
    // 是否过期状态
    isExpireStatus(timeStatus) {
      // console.log('timeStatus', timeStatus)
      return parseInt(timeStatus) === StrategyStatus.expired
    },
    // 检查当前用户是否有该权限项
    hasAuthority(authority) {
      const checkToken = this.$store.state.user.userInfo
      return (
        checkToken &&
        checkToken.authorities &&
        checkToken.authorities.length > 0 &&
        checkToken.authorities.some(a => a === authority)
      )
    }
  }
}
</script>

<style lang="scss">
.policy-insure {
  display: flex;
  flex-flow: row;
}
.policy-company {
  border: 1px solid #e8e8e8;
  padding: 20px;
  width: 300px;
  box-sizing: border-box;
  .el-button {
    width: 100%;
  }
  .policy-company-select {
    font-size: 14px;
    margin-top: 20px;
  }
  .policy-company-list {
    margin-top: 20px;
    box-sizing: border-box;
    height: calc(100vh - 305px);
    overflow: auto;
    .policy-company-item {
      padding: 0 15px;
      height: 40px;
      line-height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .company-list-icon {
        display: inline-block;
        width: 7px;
        height: 14px;
        margin-right: 8px;
      }
      .company-list-icon_red {
        background-color: #f5222d;
      }
      .company-list-icon_green {
        background-color: #52c41a;
      }
      .company-list-name {
        cursor: pointer;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
        &:hover {
          color: #1890ff;
        }
      }
    }
    .active {
      background-color: #e6f7ff;
      .company-list-name {
        color: #1890ff;
      }
    }
  }
}

.policy-contain {
  flex: 1;
  margin-left: 15px;
  border: 1px solid #e8e8e8;
  padding: 20px;
  height: calc(100vh - 158px);
  overflow: auto;
  box-sizing: border-box;
  .operation-menu {
    color: #1890ff;
    cursor: pointer;
    font-size: 14px;
  }
  .divider {
    margin: 0 8px;
    display: inline-block;
    height: 0.9em;
    width: 1px;
    vertical-align: middle;
    position: relative;
    top: -0.06em;
    background: #e8e8e8;
  }
  .el-input-group--prepend {
    max-width: 270px;
    margin-right: 5px;
    .el-input-group__prepend {
      background-color: #fff;
      width: 100px;
    }
  }
  .policy-contain-table {
    margin-top: 20px;
    .el-pagination-wrap {
      text-align: right;
      .el-pagination {
        margin-top: 20px;
      }
    }
  }
}
</style>
