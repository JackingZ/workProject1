<template>
  <div class="app-container">
    <head-info
      title="渠道管理"
      info="添加和编辑渠道信息，支持添加配置和充值渠道" />
    <div class="app-panel channel-right">
      <!--<el-row>-->
      <!--<el-col :span="22">-->
      <!--<el-select-->
      <!--v-model="searchValue.type"-->
      <!--clearable-->
      <!--filterable-->
      <!--placeholder="渠道类型"-->
      <!--style="width: 130px;">-->
      <!--<el-option-->
      <!--v-for="item in channelType"-->
      <!--:key="item.code"-->
      <!--:label="item.value1"-->
      <!--:value="item.code"/>-->
      <!--</el-select>-->

      <!--<el-select-->
      <!--v-model="searchValue.status"-->
      <!--clearable-->
      <!--filterable-->
      <!--placeholder="启用状态"-->
      <!--style="width: 130px;">-->
      <!--<el-option-->
      <!--v-for="item in status"-->
      <!--:key="item.key"-->
      <!--:label="item.value"-->
      <!--:value="item.key"/>-->
      <!--</el-select>-->

      <!--<div style="width: 460px;display: inline-block;">-->
      <!--<el-input v-model="inputValue" placeholder="请输入搜索条件" class="input-with-select">-->
      <!--<el-select-->
      <!--slot="prepend"-->
      <!--v-model="selType.model"-->
      <!--filterable-->
      <!--style="width: 130px;">-->
      <!--<el-option-->
      <!--v-for="item in selType.data"-->
      <!--:key="item.key"-->
      <!--:label="item.value"-->
      <!--:value="item.key"/>-->
      <!--</el-select>-->
      <!--</el-input>-->
      <!--</div>-->

      <!--<el-button type="primary" icon="el-icon-search" @click="queryAll">查询</el-button>-->
      <!--</el-col>-->
      <!--<el-col :span="2">-->
      <!--<el-row type="flex" justify="end">-->
      <!--<el-button type="primary" icon="el-icon-plus" @click="addChannel">添加</el-button>-->
      <!--</el-row>-->
      <!--</el-col>-->
      <!--</el-row>-->
      <el-row >
        <el-col :span="2">
          <div v-permission="permissionList.channelManagerADefault" style="cursor: pointer;display: inline-block;" @click="addChannel">
            <i class="el-icon-circle-plus-outline" style="color: #409EFF;font-size: 14px;" />
            <span style="color: #409EFF;font-size: 14px;">新增渠道</span>
          </div>
        </el-col>
        <el-col :span="22">
          <el-row style="text-align:right">
            <el-select
              v-model="searchValue.type"
              size="small"
              clearable
              placeholder="渠道性质"
              style="width: 140px;margin-right:10px;">
              <el-option
                value="1"
                label="代理渠道"/>
              <el-option
                value="2"
                label="分销渠道"/>
            </el-select>
            <el-select
              v-model="searchValue.cooperationTypes"
              multiple
              collapse-tags
              clearable
              size="small"
              placeholder="合作方式"
              style="width: 160px;margin-right:10px;">
              <el-option
                value="1"
                label="中介版"/>
              <el-option
                value="2"
                label="API接口"/>
              <el-option
                value="3"
                label="车商版"/>
            </el-select>
            <el-select
              v-model="searchValue.policyAreaCode"
              clearable
              filterable
              size="small"
              placeholder="合作地区"
              style="width: 130px;margin-right:10px;">
              <el-option
                v-for="item in addressList"
                :key="item.id"
                :value="item.id"
                :label="item.name"/>
            </el-select>
            <el-select
              v-model="searchValue.insureCompanyId"
              clearable
              filterable
              size="small"
              placeholder="合作保司"
              style="width: 130px;margin-right:10px;">
              <el-option
                v-for="item in companyList"
                :key="item.name"
                :value="item.id"
                :label="item.name"/>
            </el-select>
            <el-input
              v-model="inputValue"
              size="small"
              clearable
              style="margin-right: 10px;width: 200px;"
              placeholder="渠道简称/渠道编码"
              prefix-icon="el-icon-search"/>
            <el-button type="primary" icon="el-icon-search" size="small" @click="queryAll">查询</el-button>
            <el-button icon="el-icon-menu" size="small" @click="screenShow">筛选</el-button>
          </el-row>
        </el-col>
      </el-row>
      <div v-show="screenTags&&screenTags.length" class="screen-tag">
        <el-row type="flex" justify="start" align="center">
          <el-col :span="2" style="line-height: 32px;">
            <span>已选择:</span>
          </el-col>
          <el-col :span="22">
            <el-row type="flex" justify="start" align="center">
              <el-tag
                v-for="(tag, index) in screenTags"
                :key="tag.name"
                :disable-transitions="false"
                type="info"
                closable
                @close="closeTag(tag.name, index)">
                {{ tag.value }}
              </el-tag>
            </el-row>
          </el-col>
        </el-row>
      </div>

      <el-table v-loading="isLoading" :data="channelList.model" :height="tableHeight" max-height="100vh" border style="width: 100%;margin: 20px 0;" @sort-change="channelSort">
        <el-table-column prop="channel.shortName" label="渠道简称" min-width="160"/>
        <el-table-column prop="channel.outCode" label="渠道编码" min-width="160"/>
        <el-table-column :formatter="ctFormatter" prop="channel.type" label="渠道性质" min-width="100"/>
        <el-table-column :formatter="orgAreaFormat" label="总部地区" min-width="100"/>
        <el-table-column :formatter="balanceFormat" prop="channelBalance.balance" label="账户余额(元)" min-width="120"/>
        <!--<el-table-column prop="status" label="状态" width="100">-->
        <!--<template slot-scope="scope">-->
        <!--<el-switch-->
        <!--ref="channelList"-->
        <!--v-model="scope.row.channel.status"-->
        <!--:active-value="0"-->
        <!--:inactive-value="1"-->
        <!--@change="channelSwitch(scope)"/>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column :formatter="startEndTimeFormat" label="起止时间" min-width="200"/>
        <el-table-column :formatter="statusFormat" prop="channel.status" label="状态" min-width="100" />
        <el-table-column :formatter="addTimeFormat" label="添加时间" sortable="custom" min-width="120"/>
        <!--<el-table-column prop="id" label="渠道配置" width="100">-->
        <!--<template slot-scope="scope">-->
        <!--<el-button-->
        <!--size="mini"-->
        <!--type="text"-->
        <!--@click="addConfig(scope)">添加配置</el-button>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column prop="id" label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-permission="permissionList.channelAddConfig"
              size="mini"
              type="text"
              style="font-size: 14px;"
              @click="addConfig(scope)">添加配置</el-button>
            <el-button
              v-permission="permissionList.channelRecharge"
              size="mini"
              type="text"
              style="font-size: 14px;"
              @click="handleRecharge(scope)">充值</el-button>
            <el-button
              v-permission="permissionList.channelManagerUEdit"
              size="mini"
              type="text"
              style="font-size: 14px;"
              @click="editChannel(scope)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :total="channelList.count"
        :current-page.sync="page"
        :page-size="size"
        :page-sizes="[10, 20, 30, 40, 50]"
        style="text-align: right;"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="getCurrentData" />

      <el-dialog
        :visible.sync="isRechargeShow"
        :before-close="rechargeClose"
        title="渠道充值"
        width="500px">
        <div v-show="rechargestep1">
          <el-form
            ref="formRecharge"
            :model="formRecharge"
            :rules="formRechargeRules"
            label-width="120px"
            style="width: 360px;">
            <el-form-item label="渠道名称">
              <el-input v-model="formRecharge.channelName" :disabled="true" size="small"/>
            </el-form-item>
            <el-form-item label="渠道余额">
              <el-input v-model="formRecharge.balance" :disabled="true" size="small"/>
            </el-form-item>
            <el-form-item prop="chargeMoney" label="充值金额">
              <el-input v-model="formRecharge.chargeMoney" size="small" />
            </el-form-item>
            <el-form-item prop="giftMoney" label="赠送金额">
              <el-input v-model="formRecharge.giftMoney" size="small" />
            </el-form-item>
          </el-form>
          <div slot="footer" style="text-align: right;" class="dialog-footer">
            <el-button size="small" @click="rechargeClose">取 消</el-button>
            <el-button type="primary" size="small" @click="nextRecharge">确 定</el-button>
          </div>
        </div>
        <div v-show="rechargestep2" class="rechargeinfo">
          <div class="info">
            <div>充值渠道：{{ formRecharge.channelName }}</div>
            <div>充值金额：{{ formRecharge.chargeMoney }}</div>
            <div>赠送金额：{{ formRecharge.giftMoney }}</div>
          </div>
          <div style="text-align: center;margin: 20px;">请确认相关充值金额，点击确定即充值完成！</div>
          <div slot="footer" style="text-align: right;" class="dialog-footer">
            <el-button size="small" @click="rechargePrev">返回修改</el-button>
            <el-button type="primary" size="small" @click="subRecharge">确 定</el-button>
          </div>
        </div>
      </el-dialog>

      <app-drawer :is-show="isAddConfigShow" :drawer-title="addConfigData.title" :mask-closable="false" drawer-style="width: 500px;" @drawerClose="addConfigClose" @drawerConfirm="addConfigConfirm">
        <add-channel-config :is-loading="addConfigData.isLoading" :channel-type="addEditData.channelType" :data.sync="addConfigData" @changeImg="changeImgUrl"/>
      </app-drawer>

      <app-drawer :is-show="isAddEditShow" :drawer-title="isEdit ? '编辑渠道' : '添加渠道'" :mask-closable="false" drawer-style="width: 500px;" @drawerClose="addChannelClose" @drawerConfirm="addChannelConfirm">
        <div v-if="isEdit" slot="afterTitle" class="head-btn">
          <my-switch
            v-permission="permissionList.channelManagerUDisable"
            :value="currentEditStatus"
            :active-value="0"
            :inactive-value="1"
            @input="channelStateMsg"/>
        </div>
        <add-edit-channel
          ref="channelEdit"
          :data.sync="addEditData"
          :address-list="addressList"
          :company-list="companyList"
          :is-edit="isEdit"
          @handleViewFile="handleViewFile"
          @onChannelType="onChannelType"
          @addAreaData="addAreaData"
          @deleteAreaData="deleteAreaData"/>
      </app-drawer>

      <app-drawer :is-show="isScreenShow" :mask-closable="false" drawer-title="渠道筛选" drawer-style="width: 500px;" no-button @drawerClose="screenClose" @drawerConfirm="screenConfirm">
        <channel-screen
          ref="channelScreen"
          :channel-type="channelType"
          :search-value="searchValue"
          :status="status"
          :is-bill-channel="isBillChannel"
          :car-dealer-list="carDealerList"
          :area-list="areaList"
          :is-loading="screenIsloading"
          @screen="screen"
          @reset="reset"/>
      </app-drawer>
      <el-dialog :visible.sync="viewFileVisible" title="文件预览" width="600px" height="700px">
        <div style="width:550px;height:600px;">
          <iframe :src="fileUrl" frameborder="0" width="100%" height="600px" style="border: none;">
            This browser does not support PDFs. Please download the PDF to view it: <a :href="fileUrl">Download PDF</a>
          </iframe>
          <!-- <embed :src="fileUrl" type="application/pdf" width="400px" height="700px;"> -->
        </div>
        <!-- <div slot="footer" class="dialog-footer">
          <el-button @click="viewFileVisible = false">取 消</el-button>
          <el-button type="primary" @click="viewFileVisible = false">确 定</el-button>
        </div> -->
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { mGetDictionary,
  queryWithPage,
  mCharge,
  closeChannel,
  openChannel,
  queryWebConfig,
  mInsertList,
  getAllChannelData,
  channelLinked,
  updateChannelLinked,
  insertChannelLinked,
  checkChannelCode,
  queryAreaList,
  queryByChannelCode,
  getDefaultPermissions,
  queryBusinessLeaderList } from '@/api/number'
import {
  getPolicyAreasData,
  getCompanysData } from '@/api/accounturl'
import { debounce } from '@/utils'
import { AppDrawer } from '@/components/Drawer'
import { AddChannelConfig, AddEditChannel, ChannelScreen } from '@/views/operation/components'
import dayjs from 'dayjs'

export default {
  name: 'Channel',
  components: {
    AppDrawer,
    AddChannelConfig,
    AddEditChannel,
    ChannelScreen
  },
  data() {
    const checkAccount = (rule, value, callback) => {
      if (!value) callback()
      const reg = /^[-_a-zA-Z0-9]{2,40}$/
      if (!reg.test(value)) {
        callback(new Error('请输入2-40位数字 字母 下划线(_) 连字符(-)!'))
      } else {
        callback()
      }
    }
    const checkPhone = (rule, value, callback) => {
      if (!value) callback()
      const reg = /^1[34578]\d{9}$/
      if (!reg.test(value)) {
        callback(new Error('手机号码格式不正确'))
      } else {
        callback()
      }
    }
    const isInteger = (rule, value, callback) => {
      if (!Number.isInteger(Number(value))) {
        callback(new Error('排序只能是整数'))
      } else {
        callback()
      }
    }
    const checkMoney = (rule, value, callback) => {
      if (Number(value) <= 0 || isNaN(Number(value))) {
        callback(new Error('金额必须是大于0的数字'))
      } else {
        callback()
      }
    }
    const checkGiftMoney = (rule, value, callback) => {
      if (value !== '' && value !== null && value !== undefined) {
        if (Number(value) <= 0 || isNaN(Number(value))) {
          callback(new Error('金额必须是大于0的数字'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const checkCode = (rule, value, callback) => {
      if (this.isEdit) {
        callback()
      } else {
        debounce(checkChannelCode, 500)(value, (err, res) => {
          if (err) {
            callback(new Error('渠道编码验证失败，请稍后重试'))
          } else {
            if (!res.data) {
              callback()
            } else {
              callback(new Error('渠道编码重复'))
            }
          }
        })
      }
    }
    return {
      // configUrl: { // 控制推送地址的显示隐藏
      //   warmShow1: false,
      //   warmShow2: false,
      //   warmShow3: false,
      //   warmShow4: false
      // },
      viewFileVisible: false,
      fileUrl: '',
      channelNature: '', // 渠道性质
      // cooperationAreas: '', // 合作地区
      cooperateCompany: '', // 合作保司
      companyList: [],
      coopAreaList: [],
      addressList: [],
      defaultPermission: [], // 代理或渠道默认权限
      tableHeight: 'calc(100vh - 310px)',
      rechargestep1: true,
      rechargestep2: false,
      isEdit: false, // 是否是编辑
      currentEditStatus: '', // 编辑时状态
      addEditData: { // 添加或编辑的数据
        isLoading: false,
        channelType: null,
        title: '添加渠道',
        channelList: [],
        areaList: [],
        permissionList: [],
        businessLeaderList: [],
        props: {
          label: 'title',
          children: 'children'
        },
        channelForm: {
          admin: {
            nickName: '',
            phone: '',
            userName: '',
            channelCode: ''
          },
          headCompany: {
            province: '',
            city: ''
          },
          orgArea: [],
          contact: '',
          shortName: '',
          fullName: '',
          code: '',
          sort: 100,
          startTime: '',
          expireTime: '',
          type: '',
          proxyChannelCode: '',
          status: 0,
          userName: '',
          passWord: '',
          email: '',
          address: '',
          backUp: '',
          date: '',
          radio: 1,
          channelPermissions: [],
          permissionIds: [],
          // carDealer: 1,
          businessPrincipalId: undefined,
          cooperationAreas: [
            {
              insureCompanyIds: [-1],
              policyAreaCode: ''
            }
          ],
          customerType: undefined, // 客户类型
          customerProperty: undefined, // 客户性质
          cooperationType: undefined, // 合作方式
          chargeType: undefined, // 计费方式
          apiType: undefined, // api对接方式
          cooperationAgreementImgUrl: '' // 上传合作协议图片
        },
        rules: {
          shortName: [
            { required: true, message: '渠道简称不能为空', trigger: 'blur' },
            { min: 2, message: '渠道简称长度不能小于2', trigger: 'blur' }
          ],
          fullName: [
            { required: true, message: '渠道全称不能为空', trigger: 'blur' },
            { min: 2, message: '渠道全称长度不能小于2', trigger: 'blur' }
          ],
          outCode: [
            { required: true, message: '渠道编码不能为空', trigger: 'blur' },
            { min: 5, message: '渠道编码长度不能小于5', trigger: 'blur' },
            { validator: checkCode, trigger: 'blur' }
          ],
          sort: [
            { required: true, message: '排序不能为空', trigger: 'blur' },
            { validator: isInteger, trigger: 'blur' }
          ],
          date: [
            { required: true, message: '时间不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '渠道类型不能为空', trigger: 'change' }
          ],
          proxyChannelCode: [
            { required: true, message: '关联渠道不能为空', trigger: 'change' }
          ],
          // orgArea: [
          //   { required: true, message: '总部地区不能为空', trigger: 'blur' }
          // ],
          status: [
            { required: true, message: '状态不能为空', trigger: 'blur' }
          ],
          'admin.nickName': [
            { required: true, message: '姓名不能为空', trigger: 'blur' },
            { min: 2, message: '姓名长度不能小于2', trigger: 'blur' }
          ],
          'admin.userName': [
            // { required: true, message: '登陆账号不能为空', trigger: 'blur' },
            { validator: checkAccount, trigger: 'change' }
          ],
          phone: [
            { required: true, message: '手机号码不能为空', trigger: 'blur' },
            { validator: checkPhone, trigger: 'change' }
          ],
          contact: [
            { required: true, message: '联系人不能为空', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '联系地址不能为空', trigger: 'blur' }
          ],
          permissionIds: [
            { required: true, message: '权限不能为空', trigger: 'blur' }
          ],
          // carDealer: [
          //   { required: true, message: '是否车商渠道不能为空', trigger: 'blur' }
          // ],
          customerType: [
            { required: true, message: '请选择客户类型', trigger: 'change' }
          ],
          customerProperty: [
            { required: true, message: '请选择客户性质', trigger: 'change' }
          ],
          cooperationType: [
            { required: true, message: '请选择合作方式', trigger: 'change' }
          ],
          chargeType: [
            { required: true, message: '请选择计费方式', trigger: 'change' }
          ],
          businessPrincipalId: [
            { required: true, message: '请选择商务负责人', trigger: 'change' }
          ],
          apiType: [
            { required: true, message: '请选择api对接方式', trigger: 'change' }
          ]
          // policyArea: [
          //   { message: '区域保司不能为空', trigger: 'blur' }
          // ]
        }
      },
      isAddEditShow: false, // 添加或编辑侧滑窗口
      isAddConfigShow: false, // 添加配置侧滑窗口,
      isScreenShow: false, // 渠道筛选侧滑窗口
      screenIsloading: false,
      addConfigData: { // 添加配置数据
        isLoading: false,
        title: '添加配置',
        data: {
          wrap: {
            config1: {},
            config2: { data: [] },
            config3: {},
            config4: {},
            config5: {},
            // config6: {},
            config7: {},
            config9: {},
            config10: {},
            // config12: {},
            config13: { data: '' },
            config14: {},
            config15: {},
            config16: { data: 1 },
            config17: { data: 1 },
            config18: { data: 1 },
            config19: {},
            config20: {},
            config21: {},
            config22: {},
            config23: {},
            config25: {
              code: '',
              value: '',
              data: {
                subscription: 1,
                price: '',
                sms: '',
                limit: ''
              }
            }
            // config26: {}
          },
          option: {}
        },
        is: 1
      },
      isRechargeShow: false, // 渠道充值弹窗
      page: 1,
      size: 20,
      isLoading: false, // 表格loading动画
      channelList: {}, // 工号列表
      channelType: [], // 渠道
      inputValue: '',
      status: [{ key: 0, value: '已启用' }, { key: 1, value: '已禁用' }], // 状态
      isBillChannel: [{ key: 0, value: '是' }, { key: 1, value: '否' }], // 计费渠道
      carDealerList: [{ key: 0, value: '车商渠道' }, { key: 1, value: '非车商渠道' }],
      selType: {
        data: [{ key: 0, value: '渠道编码' }, { key: 1, value: '渠道简称' }], // 选择关键词类型
        model: 0
      },
      areaList: [],
      searchValue: { // 查询条件的值
        type: undefined, // 渠道性质
        status: undefined, // 启用状态
        // isBillChannel: undefined,
        startTimes: [], // 开始时间区间
        endTimes: [], // 截至时间区间
        insureCompanyId: undefined, // 合作保司
        policyAreaCode: undefined, // 合作地区
        timeSort: 1, // 时间排序, 0-升序 1-降序, 默认使用降序
        // area: [],
        // province: '',
        // city: '',
        // carDealer: undefined,
        businessPrincipalId: undefined, // 商务负责人id
        chargeType: undefined, // 计费方式
        cooperationTypes: [], // 合作方式
        customerProperty: undefined, // 客户性质
        customerType: undefined // 客户类型
        // level: undefined
      },
      screenTags: [], // 筛选标签
      formRecharge: { // 充值表单
        channelCode: '',
        balance: 0,
        chargeMoney: null,
        giftMoney: null,
        type: '14'
      },
      formRechargeRules: {
        chargeMoney: [
          { required: true, message: '充值金额不能为空', trigger: 'blur' },
          { validator: checkMoney, trigger: 'change' }
        ],
        giftMoney: [
          { validator: checkGiftMoney, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
  },
  watch: {
    // 'searchValue.area'(val) {
    //   if (val) {
    //     this.searchValue.province = val[0]
    //     this.searchValue.city = val[1]
    //   } else {
    //     this.searchValue.province = undefined
    //     this.searchValue.city = undefined
    //   }
    // },
    'addEditData.channelForm.date'(val) {
      if (val && val.length) {
        this.addEditData.channelForm.startTime = val[0]
        this.addEditData.channelForm.expireTime = val[1]
      }
    },
    'addEditData.channelForm.orgArea'(val) {
      if (val && Object.prototype.toString.call(val) === '[object Array]') {
        this.addEditData.channelForm.headCompany.province = val[0]
        this.addEditData.channelForm.headCompany.city = val[1]
      }
    },
    'addEditData.channelForm.cooperationAreas'(val) {
      console.log('值有变化', val)
      if (!val || val.length === 0) {
        this.addEditData.channelForm.cooperationAreas = [
          {
            insureCompanyIds: [-1],
            policyAreaCode: ''
          }
        ]
      }
    },
    screenTags: function(val) {
      if (this.screenTags && this.screenTags.length) {
        this.tableHeight = 'calc(100vh - 383.5px)'
      } else {
        this.tableHeight = 'calc(100vh - 310px)'
        console.log(this.tableHeight)
      }
    }
  },
  created() {
    this.isLoading = true
    // 获取渠道类型
    mGetDictionary('00004')
      .then(res => {
        this.channelType = res.data
      })
      .catch(err => {
        console.warn(err)
      })
    // 获取渠道列表
    queryWithPage({
      page: this.page,
      size: this.size,
      model: this.searchValue,
      keyword: ''
    })
      .then(res => {
        this.isLoading = false
        this.channelList = res.data
      })
      .catch(err => {
        this.isLoading = false
        console.warn(err)
      })
    queryAreaList()
      .then(res => {
        this.areaList = res.data
      })
    this.getAreaList() // 获取地区列表
    this.getCompanyList() // 获取公司列表

    // 获取车商渠道权限默认值
    // dealerDefaultPermission()
    //   .then(res => {
    //     this.dealerDefaultPermission = res.data.map(item => item.id)
    //   })
    //   .catch(err => {
    //     console.warn(err)
    //   })
  },
  methods: {
    // onCarDealer(e) {
    //   if (e === 0) {
    //     this.$refs.channelEdit.$refs.tree.setCheckedKeys([])
    //
    //     // 处理权限树半选问题
    //     const roleRecursionData = this.recursion(this.addEditData.permissionList)
    //     const roleSelectData = this.dealerDefaultPermission
    //     const arr = []
    //     roleRecursionData.map(item => {
    //       roleSelectData.map(sitem => {
    //         if (sitem === item) {
    //           arr.push(sitem)
    //         }
    //       })
    //     })
    //     this.addEditData.channelForm.permissionIds = arr
    //     console.log(arr)
    //     // this.addEditData.channelForm.permissionIds = this.dealerDefaultPermission
    //     this.$refs.channelEdit.$refs.tree.setCheckedKeys(arr)
    //   } else {
    //     this.addEditData.channelForm.permissionIds = []
    //     this.$refs.channelEdit.$refs.tree.setCheckedKeys([])
    //   }
    // },
    handleViewFile(url) {
      // let AllImgExt=".jpg|.jpeg|.gif|.bmp|.png|"
      // let extName = url.substring(url.lastIndexOf(".")).toLowerCase()
      // const regExg1 = /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/
      // const regExg2 = /\.(pdf)$/
      // if (regExg1.test(url)) {
      //   this.fileType = 1
      // } else if (regExg2.test(url)) {
      //   this.fileType = 2
      // }
      this.fileUrl = url + '?application/pdf'
      this.viewFileVisible = true
    },
    addAreaData() { // 地区&保司新增
      this.addEditData.channelForm.cooperationAreas.push({
        policyAreaCode: '',
        insureCompanyIds: [-1]
      })
    },
    deleteAreaData(index) { // 地区&保司删除
      this.addEditData.channelForm.cooperationAreas.splice(index, 1)
    },
    async onChannelType(e) {
      console.log(e)
      if (e) {
        this.$refs.channelEdit.$refs.tree.setCheckedKeys([])
        // 处理权限树半选问题
        const roleRecursionData = this.recursion(this.addEditData.permissionList)
        const channelType = e === '1' ? '0000000007' : '0000000008'
        const { data: roleSelectData } = await getDefaultPermissions(channelType)
        const arr = []
        roleRecursionData.map(item => {
          roleSelectData.map(sitem => {
            if (sitem === item) {
              arr.push(sitem)
            }
          })
        })
        this.addEditData.channelForm.permissionIds = arr
        console.log(arr)
        // this.addEditData.channelForm.permissionIds = this.dealerDefaultPermission
        this.$refs.channelEdit.$refs.tree.setCheckedKeys(arr)
      } else {
        this.addEditData.channelForm.permissionIds = []
        this.$refs.channelEdit.$refs.tree.setCheckedKeys([])
      }
    },
    channelStateMsg(val) {
      this.currentEditStatus = val
      this.addEditData.channelForm.status = val
      switch (val) {
        case 0:
          this.$confirm('启用操作完成！继续点击“确定”按钮保存后生效', '提示', {
            confirmButtonText: '我知道了',
            showCancelButton: false,
            type: 'success'
          })
          break
        case 1:
          this.$confirm('禁用操作完成！继续点击“确定”按钮保存后生效', '提示', {
            confirmButtonText: '我知道了',
            showCancelButton: false,
            type: 'success'
          })
          break
        default:
          return
      }
    },
    bt() {
      this.$refs.channelEdit.data.channelForm.status = 1
    },
    // 渠道配置里的渠道链接
    channelUrl(code) {
      const mode = process.env.NODE_ENV
      switch (mode) {
        case 'production':
          return `https://ybinsure.com/spa/newCar/login?s=${code}`
        case 'development':
          return `https://ybinsure.com/spa/newCarTest/login?s=${code}`
        default:
          return `https://ybinsure.com/spa/newCarTest/login?s=${code}`
      }
    },
    channelSort(val) {
      if (val.order) {
        this.searchValue.timeSort = val.order === 'ascending' ? '0' : '1'
      } else {
        this.searchValue.timeSort = undefined
      }
      this.queryAll()
    },
    queryAll() {
      // switch (this.selType.model) {
      //   case 0:
      //     this.searchValue.outCode = this.inputValue
      //     this.searchValue.shortName = undefined
      //     break
      //   case 1:
      //     this.searchValue.outCode = undefined
      //     this.searchValue.shortName = this.inputValue
      //     break
      //   default:
      //     this.searchValue.outCode = undefined
      //     this.searchValue.shortName = undefined
      //     return
      // }
      this.isLoading = true
      queryWithPage({
        page: this.page,
        size: this.size,
        model: this.searchValue,
        keyword: this.inputValue
      })
        .then(res => {
          this.isLoading = false
          this.channelList = res.data
        })
        .catch(err => {
          this.isLoading = false
          console.warn(err)
        })
    },
    // 渠道开关
    async channelSwitch(scope) {
      const id = scope.row.channel.id
      const status = scope.row.channel.status
      if (status === 1) {
        try {
          scope.row.channel.status = 0
          await this.$confirm('禁用渠道会导致该渠道下的所有数据均无法使用，仍然要继续禁用吗?', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          await closeChannel(id)
          scope.row.channel.status = 1
          this.$message({
            message: '禁用成功',
            type: 'success'
          })
        } catch (e) {
          console.warn(e)
          this.$message({
            message: '禁用失败',
            type: 'warning'
          })
        }
      } else {
        try {
          scope.row.channel.status = 1
          await this.$alert('渠道已回复使用，请确认相关数据是否仍为最新', '温馨提示', {
            confirmButtonText: '确定',
            type: 'success'
          })
          await openChannel(id)
          scope.row.channel.status = 0
        } catch (e) {
          this.$message({
            message: '开启失败',
            type: 'warning'
          })
          console.warn(e)
        }
      }
    },
    // 渠道类型转换
    ctFormatter(r) {
      return Number(r.channel.type) === 1 ? '代理' : '分销'
    },
    // 总部地区格式化
    orgAreaFormat(r) {
      if (r.channel.headCompany.province && r.channel.headCompany.city) {
        return r.channel.headCompany.province + r.channel.headCompany.city
      } else {
        return '--'
      }
    },
    // 启用时间格式化
    startEndTimeFormat(r) {
      return `${dayjs(r.channel.startTime).format('YYYY-MM-DD')}~${dayjs(r.channel.expireTime).format('YYYY-MM-DD')}`
    },
    // 截止时间格式化
    addTimeFormat(r) {
      return dayjs(r.channel.createTime).format('YYYY-MM-DD')
    },
    // 启用状态格式化
    statusFormat(r) {
      if (r.channel.status === 0) return '正常'
      if (r.channel.status === 1) return '已禁用'
    },
    balanceFormat(r) {
      if (!r.channelBalance.balance) {
        const num = 0
        return `￥ ${num.toFixed(2)}`
      } else {
        return `￥ ${r.channelBalance.balance.toFixed(2)}`
      }
    },
    // 点击页码
    getCurrentData() {
      this.isLoading = true
      queryWithPage({
        page: this.page,
        size: this.size,
        model: this.searchValue
      })
        .then(res => {
          this.isLoading = false
          this.channelList = res.data
        })
        .catch(err => {
          this.isLoading = false
          console.warn(err)
        })
    },
    handleSizeChange(val) {
      this.isLoading = true
      this.size = val
      queryWithPage({
        page: this.page,
        size: this.size,
        model: this.searchValue
      })
        .then(res => {
          this.isLoading = false
          this.channelList = res.data
        })
        .catch(err => {
          this.isLoading = false
          console.warn(err)
        })
    },
    // 充值按钮
    handleRecharge(scope) {
      this.isRechargeShow = true
      this.rechargestep1 = true
      this.rechargestep2 = false
      this.formRecharge.channelCode = scope.row.channel.code
      this.formRecharge.channelName = scope.row.channel.shortName
      this.formRecharge.balance = scope.row.channelBalance.balance ? scope.row.channelBalance.balance.toFixed(2) : '0.00'
    },
    // 充值下一步
    nextRecharge() {
      this.$refs.formRecharge.validate(valid => {
        if (!valid) return
        this.rechargestep1 = false
        this.rechargestep2 = true
      })
    },
    // 提交充值
    subRecharge() {
      mCharge(this.formRecharge)
        .then(res => {
          this.rechargeClose()
          this.$message({
            message: '充值成功',
            type: 'success'
          })
          this.queryAll()
        })
        .catch(err => {
          this.rechargeClose()
          this.$message({
            message: '充值失败',
            type: 'warning'
          })
          console.warn(err)
        })
    },
    // 充值返回修改
    rechargePrev() {
      this.rechargestep1 = true
      this.rechargestep2 = false
    },
    // 取消充值
    rechargeClose() {
      this.$refs.formRecharge.resetFields()
      this.isRechargeShow = false
      this.formRecharge = { // 充值表单
        channelCode: '',
        balance: 0,
        chargeMoney: null,
        giftMoney: null,
        type: '14'
      }
    },
    // 添加配置按钮
    async addConfig(scope) {
      this.isAddConfigShow = true
      this.addEditData.channelType = scope.row.channel.type
      this.addConfigData.isLoading = true
      this.addConfigData.title = `${scope.row.channel.shortName}配置`
      // console.log(scope.row)
      const config102 = await mGetDictionary('00102') // 披露信息选项
      this.addConfigData.data.option = { ...this.addConfigData.data.option, config102: config102.data }
      const r101 = await mGetDictionary('00104') // 披露信息选项
      this.addConfigData.data.option = { ...this.addConfigData.data.option, r101: r101.data }

      const r102 = await mGetDictionary('00105') // 前端菜单可见
      this.addConfigData.data.option = { ...this.addConfigData.data.option, r102: r102.data }

      const r104 = await mGetDictionary('00109') // 分销渠道模式
      this.addConfigData.data.option = { ...this.addConfigData.data.option, r104: r104.data }

      const r105 = await mGetDictionary('00110') // 分销渠道模式
      this.addConfigData.data.option = { ...this.addConfigData.data.option, r105: r105.data }

      const r106 = await mGetDictionary('00115') // 工号使用权限
      this.addConfigData.data.option = { ...this.addConfigData.data.option, r106: r106.data }

      const result = await queryWebConfig(scope.row.channel.code)
      if (result.data && result.data.length === 0) {
        this.addConfigData.isLoading = false
        this.addConfigData.data.wrap = {
          config1: { data: '', code: '00101', value: scope.row.channel.code },
          config2: { data: ['1'], code: '00102', value: scope.row.channel.code },
          config3: { flag: 1, code: '00103', value: scope.row.channel.code },
          config4: { data: undefined, code: '00104', value: scope.row.channel.code },
          config5: { data: [], code: '00105', value: scope.row.channel.code },
          // config6: {},
          config7: { flag: 1, code: '00107', value: scope.row.channel.code },
          config13: { data: this.channelUrl(scope.row.channel.outCode), code: '00113', value: scope.row.channel.code },
          config9: { data: undefined, code: '00109', value: scope.row.channel.code },
          config10: { data: '2', code: '00110', value: scope.row.channel.code },
          config14: { data: '', code: '00124', value: scope.row.channel.code },
          config15: { data: [], code: '00115', value: scope.row.channel.code },
          config19: { flag: 1, code: '00119', value: scope.row.channel.code },
          config20: { data: '', code: '00120', value: scope.row.channel.code },
          config21: { data: '', code: '00121', value: scope.row.channel.code },
          config22: { data: '', code: '00122', value: scope.row.channel.code },
          config23: { data: '', code: '00123', value: scope.row.channel.code },
          // config12: { flag: 1, code: '00112', value: scope.row.channel.code },
          config16: { data: 1, code: '00116', value: scope.row.channel.code },
          config17: { data: 1, code: '00117', value: scope.row.channel.code },
          config18: { data: 1, code: '00118', value: scope.row.channel.code },
          config25: { code: '00125', value: scope.row.channel.code, data: { subscription: 1, price: '', sms: '', limit: '' }}
          // config26: { data: '', code: '00126', value: scope.row.channel.code }
        }
        return
      }
      // console.log(result)
      for (const i of result.data) {
        delete i.id
        delete i.createTime
        delete i.updateTime
      }
      const code1 = result.data.findIndex(function(val) { return val.code === '00101' })
      if (code1 < 0) {
        this.addConfigData.data.wrap.config1 = { data: '', code: '00101', value: scope.row.channel.code }
      } else {
        this.addConfigData.data.wrap.config1 = result.data[code1]
      }

      const code2 = result.data.findIndex(function(val) { return val.code === '00102' })
      if (code2 < 0) {
        this.addConfigData.data.wrap.config2 = { data: ['1'], code: '00102', value: scope.row.channel.code }
      } else {
        const code102 = result.data[code2]
        this.addConfigData.data.wrap.config2 = { ...code102, data: JSON.parse(code102.data) }
      }

      const code3 = result.data.findIndex(function(val) { return val.code === '00103' })
      if (code3 < 0) {
        this.addConfigData.data.wrap.config3 = { flag: 1, code: '00103', value: scope.row.channel.code }
      } else {
        this.addConfigData.data.wrap.config3 = result.data[code3]
      }

      const code7 = result.data.findIndex(function(val) { return val.code === '00107' })
      if (code7 < 0) {
        this.addConfigData.data.wrap.config7 = { flag: 1, code: '00107', value: scope.row.channel.code }
      } else {
        this.addConfigData.data.wrap.config7 = result.data[code7]
      }

      const code13 = result.data.findIndex(function(val) { return val.code === '00113' })
      if (code13 < 0) {
        this.addConfigData.data.wrap.config13 = { data: this.channelUrl(scope.row.channel.outCode), code: '00113', value: scope.row.channel.outCode }
      } else {
        // this.addConfigData.data.wrap.config13 = result.data[code13]
        this.addConfigData.data.wrap.config13 = { data: this.channelUrl(scope.row.channel.outCode), code: '00113', value: scope.row.channel.outCode }
      }

      const code4 = result.data.findIndex(function(val) { return val.code === '00104' })
      if (code4 < 0) {
        this.addConfigData.data.wrap.config4 = { data: undefined, code: '00104', value: scope.row.channel.code }
      } else {
        this.addConfigData.data.wrap.config4 = result.data[code4]
      }

      const code9 = result.data.findIndex(function(val) { return val.code === '00109' })
      if (code9 < 0) {
        this.addConfigData.data.wrap.config9 = { data: undefined, code: '00109', value: scope.row.channel.code }
      } else {
        this.addConfigData.data.wrap.config9 = result.data[code9]
      }

      const code10 = result.data.findIndex(function(val) { return val.code === '00110' })
      if (code10 < 0) {
        this.addConfigData.data.wrap.config10 = { data: '2', code: '00110', value: scope.row.channel.code }
      } else {
        this.addConfigData.data.wrap.config10 = result.data[code10]
      }

      const code5 = result.data.findIndex(function(val) { return val.code === '00105' })
      if (code5 < 0) {
        this.addConfigData.data.wrap.config5 = { data: [], code: '00105', value: scope.row.channel.code }
      } else {
        result.data[code5].data = JSON.parse(result.data[code5].data)
        this.addConfigData.data.wrap.config5 = result.data[code5]
      }

      const code14 = result.data.findIndex(function(val) { return val.code === '00124' })
      if (code14 < 0) {
        this.addConfigData.data.wrap.config14 = { data: '', code: '00124', value: scope.row.channel.code }
      } else {
        // result.data[code14].data = JSON.parse(result.data[code14].data)
        this.addConfigData.data.wrap.config14 = result.data[code14]
      }

      // const code26 = result.data.findIndex(function(val) { return val.code === '00126' })
      // if (code26 < 0) {
      //   this.addConfigData.data.wrap.config26 = { data: '', code: '00126', value: scope.row.channel.code }
      // } else {
      //   // result.data[code14].data = JSON.parse(result.data[code14].data)
      //   this.addConfigData.data.wrap.config26 = result.data[code26]
      // }

      const code15 = result.data.findIndex(function(val) { return val.code === '00115' })
      if (code15 < 0) {
        this.addConfigData.data.wrap.config15 = { data: [], code: '00115', value: scope.row.channel.code }
      } else {
        result.data[code15].data = JSON.parse(result.data[code15].data)
        this.addConfigData.data.wrap.config15 = result.data[code15]
      }

      // 是否数据推送
      const code19 = result.data.findIndex(function(val) { return val.code === '00119' })
      if (code19 < 0) {
        this.addConfigData.data.wrap.config19 = { flag: 1, code: '00119', value: scope.row.channel.code }
      } else {
        this.addConfigData.data.wrap.config19 = result.data[code19]
      }
      const code20 = result.data.findIndex(function(val) { return val.code === '00120' })
      if (code20 < 0) {
        this.addConfigData.data.wrap.config20 = { data: '', code: '00120', value: scope.row.channel.code }
      } else {
        this.addConfigData.data.wrap.config20 = result.data[code20]
      }
      const code21 = result.data.findIndex(function(val) { return val.code === '00121' })
      if (code21 < 0) {
        this.addConfigData.data.wrap.config21 = { data: '', code: '00121', value: scope.row.channel.code }
      } else {
        this.addConfigData.data.wrap.config21 = result.data[code21]
      }
      const code22 = result.data.findIndex(function(val) { return val.code === '00122' })
      if (code22 < 0) {
        this.addConfigData.data.wrap.config22 = { data: '', code: '00122', value: scope.row.channel.code }
      } else {
        this.addConfigData.data.wrap.config22 = result.data[code22]
      }
      const code23 = result.data.findIndex(function(val) { return val.code === '00123' })
      if (code23 < 0) {
        this.addConfigData.data.wrap.config23 = { data: '', code: '00123', value: scope.row.channel.code }
      } else {
        this.addConfigData.data.wrap.config23 = result.data[code23]
      }

      // const code12 = result.data.findIndex(function(val) { return val.code === '00112' })
      // if (code12 < 0) {
      //   this.addConfigData.data.wrap.config12 = { flag: 1, code: '00112', value: scope.row.channel.code }
      // } else {
      //   this.addConfigData.data.wrap.config12 = result.data[code12]
      // }

      const code16 = result.data.findIndex(function(val) { return val.code === '00116' })
      if (code16 < 0) {
        this.addConfigData.data.wrap.config16 = { data: 1, code: '00116', value: scope.row.channel.code }
      } else {
        result.data[code16].data = JSON.parse(result.data[code16].data)
        this.addConfigData.data.wrap.config16 = result.data[code16]
      }

      const code17 = result.data.findIndex(function(val) { return val.code === '00117' })
      if (code17 < 0) {
        this.addConfigData.data.wrap.config17 = { data: 1, code: '00117', value: scope.row.channel.code }
      } else {
        result.data[code17].data = JSON.parse(result.data[code17].data)
        this.addConfigData.data.wrap.config17 = result.data[code17]
      }

      const code18 = result.data.findIndex(function(val) { return val.code === '00118' })
      if (code18 < 0) {
        this.addConfigData.data.wrap.config18 = { data: 1, code: '00118', value: scope.row.channel.code }
      } else {
        result.data[code18].data = JSON.parse(result.data[code18].data)
        this.addConfigData.data.wrap.config18 = result.data[code18]
      }

      const code25 = result.data.findIndex(function(val) { return val.code === '00125' })
      if (code25 < 0) {
        this.addConfigData.data.wrap.config25 = { code: '00125', value: scope.row.channel.code, data: { subscription: 1, price: '', sms: '', limit: '' }}
      } else {
        result.data[code25].data = JSON.parse(result.data[code25].data)
        this.addConfigData.data.wrap.config25 = result.data[code25]
      }

      this.addConfigData.isLoading = false
    },
    // 取消添加配置关闭侧滑窗口
    addConfigClose() {
      this.isAddConfigShow = false
      this.addConfigData.title = '添加配置'
      this.addConfigData.data.wrap = {
        config1: { data: '', code: '00101' },
        config2: { data: [] },
        config3: {},
        config4: {},
        config5: {},
        // config6: {},
        config7: {},
        config13: { data: this.channelUrl(JSON.parse(localStorage.getItem('userAll')).data.channelCode) },
        config9: {},
        config10: {},
        config14: {},
        config15: {},
        config19: {},
        config20: {},
        config21: {},
        config22: {},
        config23: {},
        // config12: {},
        config16: { data: 1 },
        config17: { data: 1 },
        config18: { data: 1 },
        config25: {
          code: '',
          value: '',
          data: {
            subscription: 1,
            price: '',
            sms: '',
            limit: ''
          }
        }
        // config26: {}
      }
    },
    // 确认添加配置提交数据
    addConfigConfirm() {
      console.log('配置信息')
      console.log(this.addConfigData.data.wrap.config19)
      if (this.addConfigData.data.wrap.config19.flag === 2) {
        console.log(123)
        // if (!this.addConfigData.data.wrap.config20.data) {
        //   this.$notify({
        //     title: '提示',
        //     message: '报价提交推送地址不能为空',
        //     type: 'warning'
        //   })
        //   return
        // }
        // if (!this.addConfigData.data.wrap.config21.data) {
        //   this.$notify({
        //     title: '提示',
        //     message: '核保提交推送地址不能为空',
        //     type: 'warning'
        //   })
        //   return
        // }
        // if (!this.addConfigData.data.wrap.config22.data) {
        //   this.$notify({
        //     title: '提示',
        //     message: '核保成功推送地址不能为空',
        //     type: 'warning'
        //   })
        //   return
        // }
        // if (!this.addConfigData.data.wrap.config23.data) {
        //   this.$notify({
        //     title: '提示',
        //     message: '承保成功推送地址不能为空',
        //     type: 'warning'
        //   })
        //   return
        // }
        const regExp = /[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/
        if (this.addConfigData.data.wrap.config20.data && !regExp.test(this.addConfigData.data.wrap.config20.data)) {
          this.$notify({
            title: '提示',
            message: '报价提交推送地址地址格式不正确',
            type: 'warning'
          })
          return
        }
        if (this.addConfigData.data.wrap.config21.data && !regExp.test(this.addConfigData.data.wrap.config21.data)) {
          this.$notify({
            title: '提示',
            message: '核保提交推送地址格式不正确',
            type: 'warning'
          })
          return
        }
        if (this.addConfigData.data.wrap.config22.data && !regExp.test(this.addConfigData.data.wrap.config22.data)) {
          this.$notify({
            title: '提示',
            message: '核保成功推送地址格式不正确',
            type: 'warning'
          })
          return
        }
        if (this.addConfigData.data.wrap.config23.data && !regExp.test(this.addConfigData.data.wrap.config23.data)) {
          this.$notify({
            title: '提示',
            message: '承保成功推送地址格式不正确',
            type: 'warning'
          })
          return
        }
      } else {
        this.addConfigData.data.wrap.config20.data = null
        this.addConfigData.data.wrap.config21.data = null
        this.addConfigData.data.wrap.config22.data = null
        this.addConfigData.data.wrap.config23.data = null
      }
      if (JSON.stringify(this.addConfigData.data.wrap.config25.data.subscription) === '0') {
        const regFds = /^([1-9]\d*|0)(\.\d{1,2})?$/
        const regZzs = /^\+?[1-9][0-9]*$/
        if (!regFds.test(this.addConfigData.data.wrap.config25.data.price)) {
          this.$notify({
            title: '提示',
            message: '报价发送短信数值不正确',
            type: 'warning'
          })
          return
        }
        if (!this.addConfigData.data.wrap.config25.data.sms) {
          this.$notify({
            title: '提示',
            message: '短信模板ID不能为空',
            type: 'warning'
          })
          return
        }
        if (!regZzs.test(this.addConfigData.data.wrap.config25.data.limit)) {
          this.$notify({
            title: '提示',
            message: '人均发送上限数值不正确',
            type: 'warning'
          })
          return
        }
      } else {
        this.addConfigData.data.wrap.config25.data.price = null
        this.addConfigData.data.wrap.config25.data.sms = null
        this.addConfigData.data.wrap.config25.data.limit = null
      }
      this.addConfigData.data.wrap.config5.data = JSON.stringify(this.addConfigData.data.wrap.config5.data)
      this.addConfigData.data.wrap.config15.data = JSON.stringify(this.addConfigData.data.wrap.config15.data)
      this.addConfigData.data.wrap.config25.data = JSON.stringify(this.addConfigData.data.wrap.config25.data)
      const result = []
      for (const i in this.addConfigData.data.wrap) {
        if (!this.addConfigData.data.wrap[i].flag && this.addConfigData.data.wrap[i].flag !== 0) {
          this.addConfigData.data.wrap[i].flag = null
        }
        if (!this.addConfigData.data.wrap[i].data) {
          this.addConfigData.data.wrap[i].data = null
        }
        result.push(this.addConfigData.data.wrap[i])
      }
      const copyParams = JSON.parse(JSON.stringify(result))
      const item = copyParams.find(item => item.code === '00102')
      if (item) {
        item.data = JSON.stringify(item.data)
      }
      mInsertList({
        wrap: copyParams
      })
        .then(res => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        })
        .catch(err => {
          console.warn(err)
        })
      this.addConfigClose()
    },
    // 添加渠道
    async addChannel() {
      this.isEdit = false
      this.isAddEditShow = true
      this.addEditData.isLoading = true
      const channelList = await getAllChannelData()
      this.addEditData.channelList = channelList.data
      const areaList = await queryAreaList()
      this.addEditData.areaList = areaList.data

      const permissionList = await queryByChannelCode(1)
      this.addEditData.permissionList = permissionList.data

      const { data: businessLeaderList } = await queryBusinessLeaderList('yuebao-002')
      this.addEditData.businessLeaderList = businessLeaderList

      this.addEditData.isLoading = false
    },
    // 编辑渠道
    async editChannel(scope) {
      this.isEdit = true
      this.isAddEditShow = true
      this.addEditData.isLoading = true
      console.log(scope)
      this.currentEditStatus = scope.row.channel.status
      const channelList = await getAllChannelData()
      // type=2 为分销渠道 过滤数据
      const channelArr = []
      for (const i of channelList.data) {
        if (Number(i.type) === 1) {
          channelArr.push(i)
        }
      }
      this.addEditData.channelList = channelArr

      const areaList = await queryAreaList()
      this.addEditData.areaList = areaList.data

      const permissionList = await queryByChannelCode(1)
      this.addEditData.permissionList = permissionList.data

      const { data: businessLeaderList } = await queryBusinessLeaderList('yuebao-002')
      this.addEditData.businessLeaderList = businessLeaderList

      const roleRecursionData = await this.recursion(permissionList.data)
      const result = await channelLinked(scope.row.channel.id)
      if (result.data.headCompany.city && result.data.headCompany.province) {
        this.addEditData.channelForm.orgArea = [result.data.headCompany.province, result.data.headCompany.city]
      }
      this.addEditData.channelForm = { ...this.addEditData.channelForm, ...result.data }
      this.addEditData.channelForm.date = [this.addEditData.channelForm.startTime, this.addEditData.channelForm.expireTime]

      if (result.data.permissionIds) {
        const roleSelectData = result.data.permissionIds
        const arr = []
        roleRecursionData.map(item => {
          roleSelectData.map(sitem => {
            if (sitem === item) {
              arr.push(sitem)
            }
          })
        })
        this.addEditData.channelForm.permissionIds = arr
      }
      // 处理权限回填
      // const channelPermissionsArr = []
      // for (const i of result.data.channelPermissions) {
      //   channelPermissionsArr.push(i.permissionId)
      // }
      // console.log(channelPermissionsArr)
      // this.addEditData.permissionIds = channelPermissionsArr

      this.addEditData.isLoading = false
    },
    // 递归函数
    recursion(data) {
      const res = []
      const getId = arr => {
        arr.map(v => {
          if (v.children && v.children.length > 0) {
            getId(v.children)
          } else {
            res.push(v.key)
          }
        })
      }
      getId(data)
      return res
    },
    // 添加渠道侧滑取消按钮
    addChannelClose() {
      this.$refs.channelEdit.$refs.addEditChannel.clearValidate()
      this.isAddEditShow = false
      if (!this.isEdit) return
      console.log('this.prop', this.prop)
      this.$nextTick(() => {
        console.log('清除操作')
        this.$refs.channelEdit.$refs.addEditChannel.resetFields()
      })

      // if (this.prop) {
      //   console.log('8888', this.$refs.channelEdit.$refs.addEditChannel)
      //   this.$refs.channelEdit.$refs.addEditChannel.resetFields()
      // }

      this.addEditData.permissionIds = []
      this.addEditData.channelForm = {
        admin: {
          nickName: '',
          phone: '',
          userName: '',
          channelCode: ''
        },
        headCompany: {
          province: '',
          city: ''
        },
        shortName: '',
        fullName: '',
        code: '',
        sort: 100,
        startTime: '',
        expireTime: '',
        type: '',
        proxyChannelCode: '',
        status: 0,
        userName: '',
        passWord: '',
        email: '',
        backUp: '',
        date: '',
        radio: 1,
        channelPermissions: []
        // carDealer: 1
      }
    },
    channelWrap(arr) {
      const result = []
      for (const i of arr) {
        result.push({
          permissionId: i
        })
      }
      return result
    },
    // 添加或编辑渠道确定按钮
    addChannelConfirm() {
      // 判断是是否选了全部
      this.addEditData.channelForm.cooperationAreas.forEach(item => {
        const hasAll = item.insureCompanyIds.some(info => { return info === -1 })
        if (hasAll) {
          item.insureCompanyIds = [-1]
        }
      })
      // console.log(this.channelWrap(this.$refs.channelEdit.$refs.tree.getCheckedKeys()))
      // const channelPermissions = this.channelWrap(this.$refs.channelEdit.$refs.tree.getCheckedKeys())
      // const channelPermissions = this.channelWrap([
      //   ...this.$refs.channelEdit.$refs.tree.getCheckedKeys(),
      //   ...this.$refs.channelEdit.$refs.tree.getHalfCheckedKeys()
      // ])
      // this.addEditData.channelForm.permissionIds = this.$refs.channelEdit.$refs.tree.getCheckedKeys()
      this.addEditData.channelForm.permissionIds = [
        ...this.$refs.channelEdit.$refs.tree.getCheckedKeys(),
        ...this.$refs.channelEdit.$refs.tree.getHalfCheckedKeys()
      ]
      // console.log(this.$refs.channelEdit.$refs.tree.getCheckedKeys())
      // console.log(...this.$refs.channelEdit.$refs.tree.getHalfCheckedKeys())
      // return
      console.log('新增的数据===', this.addEditData.channelForm)
      this.$refs.channelEdit.$refs.addEditChannel.validate(valid => {
        if (!valid) return
        this.addChannelConfirmSubmit()
      })
      this.addEditData.channelForm.code = this.addEditData.channelForm.outCode
      // 新增的时候管理员账号给nickName赋值,编辑时不需要
      if (!this.isEdit) {
        this.addEditData.channelForm.admin.nickName = this.addEditData.channelForm.admin.userName
      }
    },
    async addChannelConfirmSubmit() {
      try {
        switch (this.isEdit) {
          case true: {
            this.addEditData.isLoading = true
            switch (this.currentEditStatus) {
              case 0:
                openChannel(this.addEditData.channelForm.id)
                break
              case 1:
                closeChannel(this.addEditData.channelForm.id)
                break
            }
            const updateData = await updateChannelLinked(this.addEditData.channelForm)
            this.addEditData.isLoading = false
            console.log(updateData)
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.queryAll()
            break
          }
          case false: {
            this.addEditData.isLoading = true
            this.addEditData.channelForm.admin.channelCode = this.addEditData.channelForm.code
            const insertData = await insertChannelLinked(this.addEditData.channelForm)
            this.addEditData.isLoading = false
            console.log(insertData)
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.queryAll()
            break
          }
          default:
            return
        }
      } catch (e) {
        this.$message.error(e)
        console.warn(e)
      }
      this.addChannelClose()
    },
    // 更换头像
    changeImgUrl(data) {
      this.addConfigData.data.wrap.config1.data = data
    },
    screenShow() {
      this.isScreenShow = true
    },
    screenClose() {
      this.isScreenShow = false
    },
    screenConfirm() {
      this.screenClose()
    },
    delScreen() { // 清除全部tag
      this.screenTags = []
    },

    // 根据地区代码找地区字符串
    searchItem(sourceList) {
      let parentItem
      function filterList(code, list) {
        parentItem = list.find(item => item.value === code)
        return parentItem
      }
      return function(code) {
        return filterList(code, parentItem ? parentItem.children || [] : sourceList)
      }
    },
    async screen() {
      this.screenIsloading = true
      this.delScreen()

      if (Number(this.searchValue.customerType) === 1) {
        this.screenTags.push({ name: 'customerType', value: '客户类型:正式客户' })
      } else if (Number(this.searchValue.customerType) === 2) {
        this.screenTags.push({ name: 'customerType', value: '客户类型:使用客户' })
      }

      if (Number(this.searchValue.customerProperty) === 1) {
        this.screenTags.push({ name: 'customerProperty', value: '客户性质:经代公司' })
      } else if (Number(this.searchValue.customerProperty) === 2) {
        this.screenTags.push({ name: 'customerProperty', value: '客户性质:科技公司' })
      } else if (Number(this.searchValue.customerProperty) === 3) {
        this.screenTags.push({ name: 'customerProperty', value: '客户性质:车商' })
      } else if (Number(this.searchValue.customerProperty) === 4) {
        this.screenTags.push({ name: 'customerProperty', value: '客户性质:其他' })
      }
      // else if (Number(this.searchValue.customerProperty) === 5) {
      //   this.screenTags.push({ name: 'customerProperty', value: '客户性质:其他' })
      // }

      if (Number(this.searchValue.chargeType) === 1) {
        this.screenTags.push({ name: 'chargeType', value: '计费方式:年费' })
      } else if (Number(this.searchValue.chargeType) === 2) {
        this.screenTags.push({ name: 'chargeType', value: '计费方式:流量费' })
      }

      // if (Number(this.searchValue.type) === 1) {
      //   this.screenTags.push({ name: 'type', value: '渠道性质:代理' })
      // } else if (Number(this.searchValue.type) === 2) {
      //   this.screenTags.push({ name: 'type', value: '渠道性质:分销' })
      // }

      if (Number(this.searchValue.carDealer) === 0 && this.searchValue.carDealer !== '') {
        this.screenTags.push({ name: 'carDealer', value: '渠道类型:车商渠道' })
      } else if (Number(this.searchValue.carDealer) === 1) {
        this.screenTags.push({ name: 'carDealer', value: '启用状态:非车商渠道' })
      }

      if (Number(this.searchValue.status) === 0 && this.searchValue.status !== '') {
        this.screenTags.push({ name: 'status', value: '启用状态:正常' })
      } else if (Number(this.searchValue.status) === 1) {
        this.screenTags.push({ name: 'status', value: '启用状态:已禁用' })
      }
      // if (Number(this.searchValue.isBillChannel) === 0 && this.searchValue.isBillChannel !== '') {
      //   this.screenTags.push({ name: 'isBillChannel', value: '计费渠道:是' })
      // } else if (Number(this.searchValue.isBillChannel) === 1) {
      //   this.screenTags.push({ name: 'isBillChannel', value: '计费渠道:否' })
      // }

      // if (this.searchValue.area.length) {
      //   const res = this.searchValue.area.map(this.searchItem(this.areaList)).filter(item => item).map(item => item.label).join('/')
      //   this.screenTags.push({ name: 'area', value: `总部地区:${res}` })
      // }

      // if (this.searchValue.level) {
      //   const gardingList = this.$refs.channelScreen.gardingList
      //   const text = gardingList.find(item => item.code === this.searchValue.level).value1
      //   this.screenTags.push({ name: 'level', value: `渠道分级:${text}` })
      // }

      if (this.searchValue.businessPrincipalId) {
        const businessLeaderList = this.$refs.channelScreen.businessLeaderList
        const text = businessLeaderList.find(item => item.id === this.searchValue.businessPrincipalId).idName
        this.screenTags.push({ name: 'businessPrincipalId', value: `商务负责人:${text}` })
      }

      if (this.searchValue.startTimes && this.searchValue.startTimes.length === 2) {
        const s = dayjs(this.searchValue.startTimes[0]).format('YYYY年/MM月/DD日')
        const e = dayjs(this.searchValue.startTimes[1]).format('YYYY年/MM月/DD日')
        this.screenTags.push({ name: 'startTimes', value: `起始时间:${s}-${e}` })
      }

      if (this.searchValue.endTimes && this.searchValue.endTimes.length === 2) {
        const s = dayjs(this.searchValue.endTimes[0]).format('YYYY年/MM月/DD日')
        const e = dayjs(this.searchValue.endTimes[1]).format('YYYY年/MM月/DD日')
        this.screenTags.push({ name: 'endTimes', value: `起始时间:${s}-${e}` })
      }

      // if (this.searchValue.date.length) {
      //   const str = `${dayjs(this.searchValue.date[0]).format('YYYY-MM-DD')}~${dayjs(this.searchValue.date[1]).format('YYYY-MM-DD')}`
      //   this.screenTags.push({ name: 'date', value: '起止时间:' + str })
      // }
      try {
        await this.queryAll()
      } catch (e) {
        console.warn(e)
      }
      this.screenIsloading = false
      this.screenClose()
    },
    closeTag(tag, index) {
      this.screenTags.splice(index, 1)
      this.searchValue[tag] = undefined
      // if (tag === 'date') {
      //   this.searchValue.startTime = undefined
      //   this.searchValue.endTime = undefined
      // } else if (tag === 'area') {
      //   this.searchValue.province = undefined
      //   this.searchValue.city = undefined
      // }
      if (tag === 'date') {
        this.searchValue.startTimes = []
        this.searchValue.endTimes = []
      }
      this.queryAll()
    },
    reset() {
      this.searchValue.customerType = undefined
      this.searchValue.customerProperty = undefined
      this.searchValue.chargeType = undefined
      this.searchValue.status = undefined
      this.searchValue.businessPrincipalId = undefined
      this.searchValue.tartTimes = []
      this.searchValue.endTimes = []
    },
    // 获取地区列表
    getAreaList() {
      getPolicyAreasData()
        .then(res => {
          this.addressList = res.data
          this.addressList.unshift({
            id: '',
            name: '全部地区'
          })
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 获取保险公司列表
    getCompanyList() {
      console.log('获取保险公司列表')
      getCompanysData()
        .then(res => {
          // console.log('保险公司' + JSON.stringify(res))
          // const companys = res.data.filter(v => {
          //   return v.isMock === 1
          // })
          // this.companyList = companys
          this.companyList = res.data
          this.companyList.unshift({
            id: -1,
            name: '全部保司'
          })
          // this.companyList = res.data
        })
        .catch(err => {
          console.warn(err)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
  .screen-tag {
    margin: 20px 0;
    padding: 10px;
    background-color: #f2f6fc;
    overflow: auto;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .rechargeinfo {
    .info {
      background-color: rgba(245, 245, 245, 1);
      padding: 10px 20px;
      border-radius: 10px;
      div {
        margin: 10px 0;
      }
    }
  }
</style>
<style lang="scss">
  .channel-right {
    .el-table td, .el-table th{
      padding: 0;
      height: 40px;
      line-height: 40px;
    }
    .el-table th {
      background: #fafafa;
    }
  }
</style>
