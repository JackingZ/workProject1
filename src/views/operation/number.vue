<!--suppress ALL -->
<template>
  <div style="display: flex;flex-flow: row nowrap;min-height: inherit;">
    <app-slide v-loading="orgSelectList.isSideLoading" :is-active="isActive">
      <!-- <el-input
        v-model="orgSelectList.model"
        size="small"
      placeholder="输入关键字进行过滤"/>-->
      <div class="tree-title">机构列表</div>
      <el-tree
        ref="orgtree"
        :data="orgSelectList.data"
        :props="orgProps"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :empty-text="selectValue.sourceId ? '暂无数据' : '请先选择渠道'"
        class="filter-tree"
        @node-click="selOrg"
      />
    </app-slide>
    <div style="display: flex;align-items: center;">
      <div class="btn" @click="toggle">
        <img :class="{ arrow: !isActive}" src="@/assets/imgs/arrow_left.png" alt>
      </div>
    </div>
    <div class="app-container number-right" style="width: 100%;overflow: auto;">
      <head-info title="工号管理" info="默认配置电脑出单工号，如需移动出单请联系工作人员处理"/>
      <div class="app-panel">
        <el-row type="flex" align="middle">
          <el-col :span="12">
            <div
              v-permission="permissionList.addNumber"
              style="cursor: pointer;display: inline-block;"
              @click="drawer.isShow = true,isEdit = false,channelId = ''"
            >
              <i class="el-icon-circle-plus-outline" style="color: #409EFF;font-size: 14px;"/>
              <span style="color: #409EFF;font-size: 14px;">新增工号</span>
            </div>
            <div
              v-permission="permissionList.isBatchOperation"
              v-if="isSubAdminChannel"
              style="cursor: pointer;display: inline-block;margin-left: 10px;"
              @click="batchOpen"
            >
              <i class="el-icon-bell" style="color: #409EFF;font-size: 14px;"/>
              <span style="color: #409EFF;font-size: 14px;">批量操作</span>
            </div>
          </el-col>
          <el-col :span="12">
            <el-row type="flex" justify="end">
              <el-select
                v-if="isSubAdminChannel"
                v-model="selectValue.sourceId"
                :loading="channelSelectList.loading"
                size="small"
                clearable
                filterable
                placeholder="所属渠道"
                style="margin-right: 10px;width: 130px;flex: 0 0 auto;"
                @focus="getChannel()"
                @change="getOrg"
              >
                <el-option
                  v-for="item in channelSelectList.data"
                  :key="item.code"
                  :label="item.shortName"
                  :value="item.code"
                />
              </el-select>

              <el-select
                v-model="selectValue.area"
                :loading="policyAreasList.loading"
                size="small"
                clearable
                filterable
                placeholder="选择地区"
                style="margin-right: 10px;width: 130px;flex: 0 0 auto;"
                @focus="getPolicyArea"
              >
                <el-option
                  v-for="item in policyAreasList.data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>

              <el-select
                v-model="selectValue.company"
                :loading="companyList.loading"
                size="small"
                clearable
                filterable
                placeholder="保险公司"
                style="margin-right: 10px;width: 130px;flex: 0 0 auto;"
                @focus="getCompanyList"
              >
                <el-option
                  v-for="item in companyList.data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>

              <el-input
                v-model="selectValue.keyWord"
                size="small"
                placeholder="工号名称/账号/ID"
                class="input-with-select"
                prefix-icon="el-icon-search"
                style="margin-right: 10px;width: 230px;flex: 0 0 auto;"
              />

              <el-button type="primary" icon="el-icon-search" size="small" @click="queryAll">查询</el-button>
              <el-button icon="el-icon-menu" size="small" @click="screenShow">筛选</el-button>
            </el-row>
          </el-col>
        </el-row>

        <div v-show="screenTags.length" class="screen-tag">
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
                  @close="closeTag(tag.name, index)"
                >{{ tag.value }}</el-tag>
              </el-row>
            </el-col>
          </el-row>
        </div>

        <el-table
          v-loading="isLoading"
          ref="table"
          :data="numberList.model"
          :row-class-name="tableRowClassName"
          :height="tableHeight"
          max-height="100vh"
          border
          style="width: 100%;margin: 20px 0;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            v-if="isSubAdminChannel && isCheckBoxShow()"
            type="selection"
            width="55"/>
          <el-table-column
            v-if="isSubAdminChannel"
            prop="id"
            label="ID"
            fixed="left"
            min-width="60"
          />
          <el-table-column
            v-if="isSubAdminChannel"
            prop="sourceName"
            label="所属渠道"
            fixed="left"
            width="120"
          />
          <el-table-column prop="channelName" label="工号名称" min-width="220"/>
          <el-table-column prop="explains" label="备注" min-width="200"/>
          <el-table-column prop="addr" label="地区" min-width="80"/>
          <el-table-column prop="companyName" label="保险公司" min-width="100"/>
          <el-table-column
            v-if="isSubAdminChannel"
            :formatter="companyTypeFormat"
            prop="companyType"
            label="工号类型"
            min-width="100"
          />
          <!--<el-table-column prop="usingPer" label="使用渠道" width="100"/>-->
          <el-table-column
            v-if="isSubAdminChannel"
            :formatter="statusFormat"
            prop="status"
            label="启用状态"
            min-width="100"
          >
            <!--<template slot-scope="scope">-->
            <!--<el-tooltip :content="'开启关闭工号'" placement="top">-->
            <!--<el-switch-->
            <!--v-permission="permissionList.openOrClose"-->
            <!--ref="channelList"-->
            <!--v-model="scope.row.status"-->
            <!--active-value="0"-->
            <!--inactive-value="1"-->
            <!--@change="numberSwitch(scope.row.id, scope.row.status)"/>-->
            <!--</el-tooltip>-->
            <!--</template>-->
          </el-table-column>
          <el-table-column prop="bingding" label="移动 / 电脑" min-width="120"/>
          <el-table-column prop="switching" label="移动 / 电脑" min-width="100"/>
          <el-table-column
            :formatter="dataFormat"
            :sort-orders="['ascending', 'descending', null]"
            prop="times"
            label="添加时间"
            sortable
            min-width="180"
          />
          <el-table-column prop="id" label="操作" fixed="right" width="250">
            <template slot-scope="scope">
              <el-button
                v-permission="permissionList.issueActionLog"
                v-if="isSubAdminChannel"
                size="mini"
                type="text"
                style="font-size: 14px;"
                @click="handleLog(scope)"
              >操作日志</el-button>
              <el-button
                v-permission="permissionList.bindingMechanism"
                size="mini"
                type="text"
                style="font-size: 14px;"
                @click="handleBinding(scope.$index, scope.row)"
              >绑定机构</el-button>
              <el-button
                v-permission="permissionList.editNumber"
                size="mini"
                type="text"
                style="font-size: 14px;"
                @click="handleEdit(scope)"
              >编辑</el-button>
              <el-button
                v-permission="permissionList.delNumber"
                size="mini"
                type="text"
                style="font-size: 14px;"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          :total="numberList.count"
          :current-page.sync="page"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="size"
          style="text-align: right;"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="getCurrentData"
          @prev-click="prevPage"
          @next-click="nextPage"
        />
      </div>
      <app-drawer
        :is-show="drawer.isShow"
        :drawer-title="isEdit ? '编辑工号' : '新增工号'"
        :mask-closable="false"
        drawer-style="width: 500px;"
        @drawerClose="close"
        @drawerConfirm="confirm"
      >
        <div
          v-permission="permissionList.openOrClose"
          v-if="isEdit && isSubAdminChannel"
          slot="afterTitle"
          class="head-btn"
        >
          <my-switch
            v-model="numberState"
            :active-value="0"
            :inactive-value="1 || 2"
            @input="numberStateMsg"
          />
        </div>
        <add-edit-number
          ref="numberEdit"
          :is-edit="isEdit"
          :number-state="numberState"
          :channel-id="channelId"
          @onNumberState="onNumberState"
        />
      </app-drawer>

      <app-drawer
        :is-show="isScreenShow"
        :mask-closable="false"
        drawer-title="工号筛选"
        drawer-style="width: 500px;"
        no-button
        @drawerClose="screenClose"
        @drawerConfirm="screenConfirm"
      >
        <number-screen
          :select-value="selectValue"
          :type-list="typeList"
          :company-type-list="companyTypeList"
          :renewal-list="renewalList"
          :bingding-state="bingdingState"
          :billing-type="billingType"
          :is-loading="screenIsloading"
          :state-list="stateList"
          :is-sub-admin="isSubAdminChannel"
          @screen="screen"
          @reset="reset"
        />
      </app-drawer>

      <el-dialog
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        :width="bindingDilogWidth"
        title="绑定机构"
      >
        <el-table
          v-loading="bindingList.isBindLoding"
          :header-cell-style="headRowStyle"
          :data="bindingList.list"
          border
          style="width: 100%;"
        >
          <el-table-column v-if="isSubAdminChannel" prop="name" label="使用渠道" min-width="100">
            <template slot-scope="scope">
              <span v-if="Number(scope.row.source_type) === 1">所属渠道</span>
              <span v-if="Number(scope.row.source_type) === 0">分配渠道</span>
            </template>
          </el-table-column>
          <el-table-column v-if="isSubAdminChannel" label="渠道简称" min-width="160">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.source_code"
                :disabled="Number(scope.row.source_type) === 1"
                size="small"
                clearable
                filterable
                placeholder="分配渠道"
                @focus="getChannel('xxx')"
              >
                <el-option
                  v-for="item in bindingList.channelList"
                  :key="item.code"
                  :label="item.shortName"
                  :value="item.code"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column v-if="isSubAdminChannel" label="续保查询设置" min-width="160">
            <template slot-scope="scope">
              <my-switch
                v-model="scope.row.renewal"
                :active-value="1"
                :inactive-value="0"
                enable-text="开"
                disable-text="关"
              />
            </template>
          </el-table-column>
          <!--<el-table-column label="绑定状态" prop="bingding" min-width="100">-->
          <!--<template slot-scope="scope">-->
          <!--<span v-if="Number(scope.row.bingding) === 1">已绑定</span>-->
          <!--<span v-if="Number(scope.row.bingding) === 0">未绑定</span>-->
          <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column v-if="isSubAdminChannel" label="移动出单设置" min-width="350">
            <template slot-scope="scope">
              <el-checkbox-group
                v-model="scope.row.permissions"
                @change="onPermissionsChange(scope.$index, scope.row.permissions)"
              >
                <el-checkbox
                  v-for="item in bindingList.permissions"
                  :key="item.code"
                  :label="item.code"
                >{{ item.name }}</el-checkbox>
              </el-checkbox-group>
            </template>
          </el-table-column>
          <el-table-column :label="isSubAdminChannel ? '' : '移动出单设置'" min-width="120">
            <template slot-scope="scope">
              <el-button
                :class="{noBinding: Number(scope.row.bingding) === 0}"
                size="mini"
                type="primary"
                @click="selOrgBindMobile(scope)"
              >绑定机构</el-button>
            </template>
          </el-table-column>

          <!--<el-table-column v-if="!isSubAdminChannel" label="移动出单设置" min-width="120">-->
          <!--<template slot-scope="scope">-->
          <!--<el-button-->
          <!--:class="{noBinding: Number(scope.row.bingding) === 0}"-->
          <!--size="mini"-->
          <!--type="primary"-->
          <!--@click="selOrgBindMobile(scope)">绑定机构</el-button>-->
          <!--</template>-->
          <!--</el-table-column>-->

          <!--<el-table-column prop="state" label="是否开启" width="80">-->
          <!--<template slot-scope="scope">-->
          <!--<el-switch-->

          <!--v-model="scope.row.state"-->
          <!--:active-value="1"-->
          <!--:inactive-value="0"-->
          <!--@change="bindSwitch(scope)"/>-->
          <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column prop="mobile" label min-width="80">
            <template slot-scope="scope">
              <my-switch
                v-model="scope.row.mobile"
                :active-value="1"
                :inactive-value="0"
                :disabled="!isSubAdminChannel"
                enable-text="开"
                disable-text="关"
                @input="bindSwitchMobile(scope)"
              />
            </template>
          </el-table-column>
          <el-table-column label="电脑出单设置" min-width="120">
            <template slot-scope="scope">
              <el-button
                v-show="Number(scope.row.mock === 1)"
                :class="{noBinding: Number(scope.row.bingdingPc) === 0}"
                size="mini"
                type="primary"
                @click="selOrgBind(scope)"
              >绑定机构</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="pc" label min-width="80">
            <template slot-scope="scope">
              <my-switch
                v-show="Number(scope.row.mock === 1)"
                v-model="scope.row.pc"
                :active-value="1"
                :inactive-value="0"
                enable-text="开"
                disable-text="关"
                @input="bindSwitchPc(scope)"
              />
            </template>
          </el-table-column>
          <el-table-column v-if="isSubAdminChannel" label="操作" min-width="60">
            <template slot-scope="scope">
              <div
                v-if="Number(scope.row.source_type) === 1"
                style="color: #409EFF;font-size: 16px;text-align: center;cursor: pointer;"
                @click="addBind"
              >
                <i class="el-icon-plus"/>
              </div>
              <div
                v-if="Number(scope.row.source_type) === 0"
                style="color: #409EFF;font-size: 16px;text-align: center;cursor: pointer;"
                @click="delBind(scope.$index)"
              >
                <i class="el-icon-minus"/>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div
          style="font-size: 12px;color: #999999;margin-top: 20px;margin-left: 10px;"
        >注：工号需绑定机构且开启后才可正常使用，新添加的机构也需要重新绑定哦</div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="handleClose">取 消</el-button>
          <el-button
            :loading="bindingList.isBindLoding"
            size="small"
            type="primary"
            @click="saveBind"
          >确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="bindDialog"
        :before-close="bindClose"
        :title="bindingList.bindType === 1 ? '绑定机构-电脑端' : '绑定机构-移动端'"
        width="30%"
      >
        <el-tree
          v-loading="bindingList.bind.isLoading"
          ref="tree"
          :data="bindingList.bind.data[0].comTree"
          :props="bindingList.bind.props"
          :default-checked-keys="bindingList.bind.data[0].checked"
          show-checkbox
          node-key="key"
        />
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="bindClose">取 消</el-button>
          <el-button
            :loading="bindingList.bind.isLoading"
            type="primary"
            size="small"
            @click="bindSubmit"
          >确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        :visible.sync="logDialog"
        :before-close="logClose"
        title="操作日志"
        width="1200px"
        height="500px"
      >
        <action-log :log-data="logData" @query="queryLog"/>
        <el-pagination
          :total="logData.logForm.count"
          size="small"
          style="text-align: right;"
          layout="total, prev, pager, next, jumper"
          @current-change="currentChange"
        />
      </el-dialog>

      <el-dialog
        :visible.sync="isHandleShow"
        :before-close="handleDialogClose"
        title="批量操作"
        width="680px"
      >
        <batch-operation ref="batch" :ids="batchData" @close="batchClose"/>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="isHandleShow = false">取 消</el-button>
          <el-button size="small" type="primary" @click="onBatch">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { checkPermissions } from '@/router/guard'
import { AppDrawer } from '@/components/Drawer'
import { AddEditNumber } from '@/views/operation/components'
import BatchOperation from '@/views/operation/components/BatchOperation.vue'
import {
  getNumberList,
  setNumberStatus,
  getOrgData,
  getPolicyAreasData,
  queryCompanysList,
  deleteNumber,
  getChannelsById,
  bindingAllSource,
  getCompanyByArea,
  bindingInstitution,
  getPermissions,
  getOperatorType,
  getLogsByPage,
  queryAuthChannel,
  saveOrupdateJobNumber
} from '@/api/number'
import { formatDate } from '@/utils'
import elTreeselect from 'el-tree-select'
import MyTreeSelect from '@/components/MyTreeSelect'
import { AppSlide } from '@/components/Slide'
import NumberScreen from '@/views/operation/components/numberScreen'
import { ActionLog } from '@/views/operation/components'
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
export default {
  name: 'Number',
  components: {
    AppDrawer,
    elTreeselect,
    AddEditNumber,
    MyTreeSelect,
    AppSlide,
    NumberScreen,
    ActionLog,
    BatchOperation
  },
  data() {
    return {
      batchData: [], // 多选操作
      isHandleShow: false,
      tableHeight: 'calc(100vh - 310px)',
      bindingDilogWidth: '',
      clickType: null, // 绑定机构移动或者pc
      isActive: false, // 机构侧滑,
      numberState: 0, // 工号开关
      screenTags: [], // 筛选标签
      screenIsloading: false,
      logData: {
        isLoading: false,
        options: [],
        props: {
          value: 'field',
          label: 'text',
          children: 'childs'
        },
        logForm: {
          model: []
        },
        date: [
          dayjs(dayjs().format('YYYY-MM-DD 00:00:00')).valueOf(),
          dayjs(dayjs().format('YYYY-MM-DD 23:59:59')).valueOf()
        ],
        form: {
          page: 1,
          size: 10,
          model: {
            stime: '',
            etime: '',
            operators: [],
            keyWord: '',
            channelId: '',
            sourceId: ''
          }
        }
      },
      logDialog: false,
      isScreenShow: false,
      isEdit: false,
      channelId: '',
      drawer: {
        isShow: false,
        title: '编辑工号'
      },
      dialogVisible: false, // 绑定机构弹窗
      bindDialog: false, // 绑定机构选择机构弹窗
      isDeleteNumberShow: false,
      isLoading: true,
      page: 1, // 当前页码
      size: 20, // 页宽
      numberList: {}, // 工号列表
      channelSelectList: {
        // 所属渠道下拉选择
        loading: false,
        data: []
      },
      policyAreasList: {
        // 保监地区列表
        loading: false,
        data: []
      },
      companyList: {
        // 保险公司列表
        loading: false,
        data: []
      },
      stateList: {
        // 启用状态
        loading: false,
        data: [
          { key: 1, value: '已禁用' },
          { key: 0, value: '已启用' },
          { key: 2, value: '异常' }
        ]
      },
      companyTypeList: {
        // 工号类型
        loading: false,
        data: [{ key: 0, value: '接口' }, { key: 1, value: '模拟' }]
      },
      renewalList: {
        loading: false,
        data: [{ key: 1, value: '开启' }, { key: 0, value: '关闭' }]
      },
      billingType: {
        // 工号类型
        loading: false,
        data: [
          { key: '2-1', value: '移动端开启' },
          { key: '2-0', value: '移动端关闭' },
          { key: '1-1', value: '电脑端开启' },
          { key: '1-0', value: '电脑端关闭' },
          { key: '3-1', value: '同时开启' },
          { key: '3-0', value: '同时关闭' }
        ]
      },
      keyTypeList: {
        // 关键词类型
        loading: false,
        data: [
          { key: 1, value: '工号名称' },
          { key: 2, value: '备注' },
          { key: 3, value: '工号ID' }
        ]
      },
      typeList: {
        // 关键词类型
        loading: false,
        data: [{ key: 0, value: '正式账号' }, { key: 1, value: '测试账号' }]
      },
      bingdingState: {
        loading: false,
        data: [
          { key: '2-1', value: '移动端已绑定' },
          { key: '2-0', value: '移动端未绑定' },
          { key: '1-1', value: '电脑端已绑定' },
          { key: '1-0', value: '电脑端未绑定' }
        ]
      },
      orgSelectList: {
        // 所属机构下拉选择
        loading: false,
        isSideLoading: false,
        disabled: false,
        model: '',
        props: { value: 'key', label: 'title', children: 'children' },
        data: []
      },
      orgProps: {
        label: 'title',
        children: 'children'
      },
      selectValue: {
        sourceId: undefined, // 所属渠道选择的值
        comcode: '', // 所属机构选择的值
        area: undefined, // 保监地区选择的值
        company: undefined, // 保险公司选择的值
        state: undefined, // 启用状态
        companyType: undefined, // 工号类型
        keyType: 1, // 搜索关键词的类型
        keyWord: '', // 关键词
        type: undefined, // 使用类型
        bingding: undefined, // 绑定状态
        date: [],
        stime: undefined,
        etime: undefined,
        invoiceType: undefined,
        renewal: undefined
      },
      bindingList: {
        // 绑定机构
        bindType: 1,
        index: null,
        list: [], //  绑定机构列表数据
        lastSelect: [],
        bind: {
          isLoading: false,
          props: { label: 'title', children: 'children' },
          data: [
            {
              comTree: [],
              checked: []
            }
          ]
        }, //  绑定机构树形列表
        isBindLoding: false, //  绑定机构列表loading状态
        channelList: [], // 渠道下拉选择
        permissions: [], // 工号权限
        numberId: { companyId: '', channelId: '' } // 当前点击绑定的id
      }
    }
  },
  computed: {
    ...mapGetters(['isSubAdminChannel'])
  },
  watch: {
    'selectValue.sourceId': function(val) {
      this.logData.form.model.sourceId = val
      if (!val || val === '') {
        this.orgSelectList.disabled = true
      } else {
        this.orgSelectList.disabled = false
      }
    },
    'orgSelectList.model': function(val) {
      this.$refs.orgtree.filter(val)
    },
    'selectValue.date': function(val) {
      if (val) {
        this.selectValue.stime = dayjs(val[0]).format('YYYY-MM-DD 00:00:00')
        this.selectValue.etime = dayjs(val[1]).format('YYYY-MM-DD 23:59:59')
      } else {
        this.selectValue.stime = undefined
        this.selectValue.etime = undefined
      }
    },
    screenTags: function(val) {
      if (this.screenTags.length) {
        this.tableHeight = 'calc(100vh - 383.5px)'
      } else {
        this.tableHeight = 'calc(100vh - 310px)'
        console.log(this.tableHeight)
      }
    }
  },
  created() {
    if (this.isSubAdminChannel) {
      this.selectValue.sourceId = undefined
      this.bindingDilogWidth = '80%'
    } else {
      this.selectValue.sourceId = JSON.parse(
        localStorage.getItem('userAll')
      ).data.channelCode
      this.bindingDilogWidth = '36%'
      this.getOrg()
    }
    // 获取工号列表
    getNumberList({
      page: this.page,
      size: this.size,
      model: this.selectValue
    })
      .then(res => {
        this.numberList = res.data
        this.isLoading = false
      })
      .catch(err => {
        console.warn(err)
        this.isLoading = false
      })
  },
  methods: {
    // 批量操作权限
    isCheckBoxShow() {
      return checkPermissions('1000001052')
    },
    // 打开批量操作
    batchOpen() {
      if (this.batchData.length) {
        this.isHandleShow = true
      } else {
        this.$message.error('请先选择要操作的工号')
      }
    },
    // 关闭批量操作
    batchClose() {
      this.isHandleShow = false
      this.$refs.table.clearSelection()
    },
    // 监听表格选择
    handleSelectionChange(e) {
      this.batchData = e.map(item => item.id)
    },
    // 批量操作提交
    onBatch() {
      this.$refs.batch.save()
    },
    // 工号开关
    onNumberState(e) {
      this.numberState = e
    },
    onPermissionsChange(index, val) {
      const conditions = [
        {
          name: '支付',
          add: ['核保', '报价'],
          remove: []
        },
        {
          name: '核保',
          add: ['报价'],
          remove: ['支付']
        },
        {
          name: '报价',
          add: [],
          remove: ['核保', '支付']
        }
      ]
      const arr = this.bindingList.permissions
      const list = [...this.bindingList.list[index].permissions]
      const lastSelect = this.bindingList.lastSelect[index].permissions
      function searchItemByCode(code) {
        return arr.find(item => item.code === code)
      }
      function searchItemByName(name) {
        return arr.find(item => item.name === name)
      }
      function searchCondition(name) {
        return conditions.find(item => item.name === name)
      }
      function compareList(list1, list2) {
        const add = list1.filter(item => {
          return list2.every(item2 => item !== item2)
        })
        const remove = list2.filter(item => {
          return list1.every(item2 => item !== item2)
        })
        return {
          add: add[0],
          remove: remove[0]
        }
      }
      function getConditionByCode(code) {
        const item = searchItemByCode(code)
        let condition
        if (item) condition = searchCondition(item.name)
        return condition
      }
      const { add, remove } = compareList(list, lastSelect)
      if (add) {
        const condition = getConditionByCode(add)
        condition.add.forEach(name => {
          const searchItem = searchItemByName(name)
          list.push(searchItem.code)
        })
      }
      if (remove) {
        const condition = getConditionByCode(remove)
        condition.remove.forEach(name => {
          const searchItem = searchItemByName(name)
          const index = list.findIndex(item => item === searchItem.code)
          if (index >= 0) list.splice(index, 1)
        })
      }
      const res = new Set(list)
      this.$set(this.bindingList.list[index], 'permissions', [...res])
      this.$set(this.bindingList.lastSelect[index], 'permissions', [...res])
    },
    headRowStyle({ row, column, rowIndex, columnIndex }) {
      if (this.isSubAdminChannel) {
        if (columnIndex === 3 || columnIndex === 4 || columnIndex === 6) {
          return {
            borderRight: '0'
          }
        }
      } else {
        if (columnIndex === 0 || columnIndex === 2) {
          return {
            borderRight: '0'
          }
        }
      }
    },
    toggle() {
      // 左侧机构侧滑
      this.isActive = !this.isActive
    },
    getNumberState(val) {
      console.log(val)
      this.numberState = val
    },
    numberStateMsg() {
      switch (this.numberState) {
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
    currentChange(val) {
      this.logData.form.page = val
      this.queryLog()
    },
    queryLog() {
      this.logData.form.model.stime = dayjs(this.logData.date[0]).format(
        'YYYY-MM-DD 00:00:00'
      )
      this.logData.form.model.etime = dayjs(this.logData.date[1]).format(
        'YYYY-MM-DD 23:59:59'
      )
      this.logData.isLoading = true
      getLogsByPage(this.logData.form)
        .then(res => {
          this.logData.logForm = res.data
          this.logData.isLoading = false
        })
        .catch(err => {
          this.logData.isLoading = false
          console.warn(err)
        })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
    selOrg(val) {
      if (val) {
        this.selectValue.comcode = val.key
        this.queryAll()
      }
    },
    // 打开侧滑窗口
    open() {
      this.isShow = true
    },
    // 关闭侧滑窗口
    close() {
      // if (this.isEdit) {
      //   this.$refs.numberEdit.reset(this.isSubAdminChannel)
      // }
      if (this.isEdit) {
        this.$refs.numberEdit.clearFields()
        this.$refs.numberEdit.$refs.formList.resetFields()
      }
      this.$refs.numberEdit.onCompanyId(3)
      this.$refs.numberEdit.$refs.formList.clearValidate()
      this.isEdit = false
      this.channelId = ''
      this.drawer.isShow = false
      this.numberState = 0
    },
    // 侧滑窗口确定
    confirm() {
      this.$refs.numberEdit.$refs.formList.validate(valid => {
        if (!valid) return
        this.$refs.numberEdit.isLoading = true
        const params = this.$refs.numberEdit.formList
        params.modify = !!this.isEdit
        params.del = this.numberState
        saveOrupdateJobNumber(params)
          .then(res => {
            console.log(res)
            this.$refs.numberEdit.clearFields()
            this.$refs.numberEdit.cleanDynamicFields()
            this.$refs.numberEdit.isLoading = false
            console.log(this.$refs.numberEdit)
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.close()
            getNumberList({
              page: this.page,
              size: this.size,
              model: this.selectValue
            })
              .then(res => {
                this.numberList = res.data
                this.isLoading = false
              })
              .catch(err => {
                console.warn(err)
                this.isLoading = false
              })
          })
          .catch(err => {
            this.$message({
              message: err.response.data.msg,
              type: 'error'
            })
            this.$refs.numberEdit.isLoading = false
            console.warn(err)
          })
      })
      // if (this.isEdit) {
      //   this.$refs.numberEdit.formList.del = this.numberState
      // }
    },
    // 格式化表格时间
    dataFormat(r) {
      return formatDate(r.times)
    },
    // 格式化工号类型
    companyTypeFormat(r) {
      if (Number(r.companyType) === 0) {
        return '接口'
      }
      if (Number(r.companyType) === 1) {
        return '模拟'
      }
    },
    // 格式化绑定状态
    bindFormat(r) {
      if (Number(r.bingding) === 0) {
        return '未绑定'
      }
      if (Number(r.bingding) === 1) {
        return '已绑定'
      }
    },
    // 状态格式化
    statusFormat(r) {
      switch (parseInt(r.status)) {
        case 0:
          return '正常'
        case 1:
          return '已禁用'
        case 2:
          return '异常'
        default:
          return ''
      }
    },
    // 异常及关闭工号样式修改
    tableRowClassName(r) {
      if (Number(r.row.del) === 0) {
        return 'warning-row'
      }
      if (Number(r.row.status) === 1) {
        return 'close-row'
      }
    },
    // 工号开关
    numberSwitch(id, status) {
      setNumberStatus({
        channelId: id,
        status: Number(status)
      })
        .then(res => {
          if (Number(status) === 0) {
            this.$message({
              message: '工号已开启',
              type: 'success'
            })
          } else {
            this.$message({
              message: '工号已关闭',
              type: 'success'
            })
          }
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 点击下一页
    nextPage() {
      this.isLoading = true
      this.page = this.page + 1
      getNumberList({
        page: this.page,
        size: this.size,
        model: this.selectValue
      })
        .then(res => {
          this.numberList = res.data
          this.isLoading = false
        })
        .catch(err => {
          console.warn(err)
          this.isLoading = false
        })
    },
    // 点击上一页
    prevPage() {
      this.isLoading = true
      this.page = this.page - 1
      getNumberList({
        page: this.page,
        size: this.size,
        model: this.selectValue
      })
        .then(res => {
          this.numberList = res.data
          this.isLoading = false
        })
        .catch(err => {
          console.warn(err)
          this.isLoading = false
        })
    },
    // 获取当前页码数据
    getCurrentData(val) {
      this.isLoading = true
      this.page = val
      getNumberList({
        page: this.page,
        size: this.size,
        model: this.selectValue
      })
        .then(res => {
          this.numberList = res.data
          this.isLoading = false
        })
        .catch(err => {
          console.warn(err)
          this.isLoading = false
        })
    },
    handleSizeChange(val) {
      this.isLoading = true
      this.size = val
      getNumberList({
        page: this.page,
        size: this.size,
        model: this.selectValue
      })
        .then(res => {
          this.numberList = res.data
          this.isLoading = false
        })
        .catch(err => {
          console.warn(err)
          this.isLoading = false
        })
    },
    // 获取所属渠道
    getChannel(params = undefined) {
      this.channelSelectList.loading = true
      this.orgSelectList.data = []
      this.selectValue.comcode = undefined
      queryAuthChannel(params)
        .then(res => {
          this.channelSelectList.loading = false
          this.channelSelectList.data = []
          this.channelSelectList.data = res.data
        })
        .catch(err => {
          this.channelSelectList.loading = false
          console.warn(err)
        })
    },
    // 获取机构
    getOrg() {
      getOrgData({
        channelCode: this.selectValue.sourceId
      })
        .then(res => {
          this.orgSelectList.data = res.data
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // setOrgValue(val) {
    //   this.selectValue.comcode = val.key
    // },
    //  获取保监地区
    getPolicyArea() {
      this.policyAreasList.loading = true
      getPolicyAreasData()
        .then(res => {
          this.policyAreasList.loading = false
          this.policyAreasList.data = res.data
        })
        .catch(err => {
          this.policyAreasList.loading = false
          console.warn(err)
        })
    },
    // 获取保险公司列表
    getCompanyList() {
      this.companyList.loading = true
      queryCompanysList()
        .then(res => {
          this.companyList.loading = false
          this.companyList.data = res.data
        })
        .catch(err => {
          this.companyList.loading = false
          console.warn(err)
        })
    },
    // 点击查询按钮
    queryAll() {
      this.numberList = []
      this.isLoading = true
      // this.page = 1
      // this.size = 10
      getNumberList({
        page: this.page,
        size: this.size,
        model: this.selectValue
      })
        .then(res => {
          this.numberList = res.data
          this.isLoading = false
        })
        .catch(err => {
          console.warn(err)
          this.isLoading = false
        })
    },
    // 删除工号
    async handleDelete(index, row) {
      try {
        await this.$confirm(
          '删除工号，会导致绑定的机构团队无法进行报价出单，仍要继续删除吗？',
          '温馨提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        const del = await deleteNumber(row.id)
        if (Number(del.status) !== 200) return
        await this.numberList.model.splice(index, 1)
        await this.$message({
          type: 'success',
          message: '删除成功'
        })
      } catch (e) {
        console.log(e)
      }
    },
    // 操作日志弹窗
    handleLog(scope) {
      this.logDialog = true
      this.logData.form.model.channelId = scope.row.id
      getOperatorType(scope.row.id)
        .then(res => {
          this.logData.options = res.data
        })
        .catch(err => {
          console.warn(err)
        })
      this.queryLog()
    },
    //  绑定机构弹窗
    async handleBinding(index, row) {
      console.log(row)
      // if (!this.isSubAdminChannel) {
      //   this.bindDialog = true
      //   this.bindingList.bind.isLoading = true
      //   this.bindingList.numberId.companyId = row.companyId
      //   this.bindingList.numberId.channelId = row.id
      //   this.bindingList.numberId.areaCode = row.areaCode
      //   this.bindingList.numberId.source_code = row.sourceId
      //   const sourceId = row.sourceId
      //   const areaCode = row.areaCode
      //   const channelId = row.id
      //   const token = this.$store.state.user.token
      //   const org = await getCompanyByArea(sourceId, areaCode, channelId, token)
      //   this.bindingList.bind.isLoading = false // 关闭绑定机构选择机构弹窗动画
      //   if (!org.data) {
      //     this.$message({
      //       message: '该配置地区与渠道不匹配',
      //       type: 'warning'
      //     })
      //     return
      //   }
      //   this.bindingList.bind.data = org.data
      //   return
      // }
      this.dialogVisible = true
      this.bindingList.numberId.companyId = row.companyId
      this.bindingList.numberId.channelId = row.id
      this.bindingList.numberId.areaCode = row.areaCode
      this.bindingList.isBindLoding = true
      try {
        const list = await getChannelsById(row.id)
        for (const i of list.data) {
          if (i.permissions !== '' && i.permissions !== null) {
            i.permissions = i.permissions.split(',')
          } else {
            i.permissions = []
          }
        }
        console.log(list)
        this.bindingList.list = list.data
        this.bindingList.lastSelect = JSON.parse(JSON.stringify(list.data))
        const channelList = await queryAuthChannel('xxx')
        this.bindingList.channelList = channelList.data
        const permissions = await getPermissions()
        this.bindingList.permissions = permissions.data
        this.bindingList.isBindLoding = false
      } catch (e) {
        this.bindingList.isBindLoding = false
        console.warn(e)
      }
    },
    //  绑定机构弹窗取消
    handleClose() {
      this.dialogVisible = false
      this.bindingList = {
        // 绑定机构
        list: [], //  绑定机构列表数据
        bind: {
          isLoading: false,
          props: { label: 'title', children: 'children' },
          data: [
            {
              comTree: [],
              checked: []
            }
          ]
        }, //  绑定机构树形列表
        isBindLoding: false, //  绑定机构列表loading状态
        channelList: [], // 渠道下拉选择
        permissions: [], // 工号权限
        numberId: { companyId: '', channelId: '' } // 当前点击绑定的id
      }
    },
    // 关闭绑定机构选择机构弹窗
    bindClose() {
      this.bindDialog = false
      this.bindingList.bind.data = [
        {
          comTree: [],
          checked: []
        }
      ]
    },
    // 关闭操作日志弹窗
    logClose() {
      this.logDialog = false
    },
    handleDialogClose() {
      this.isHandleShow = false
    },
    // 添加绑定机构
    addBind() {
      const params = {
        bingding: '0',
        bingdingPc: '0',
        companyId: this.bindingList.numberId.companyId,
        explains: '',
        id: null,
        permissions: [],
        sort: this.bindingList.list.length,
        source_code: undefined,
        source_type: 0,
        state: 1,
        mobile: 0,
        pc: 0,
        renewal: 1,
        mock: this.bindingList.list[0].mock
      }
      this.bindingList.list.push(params)
    },
    // 删除绑定机构
    delBind(index) {
      this.bindingList.list.splice(index, 1)
    },
    // 绑定机构弹窗开启关闭工号开关
    bindSwitchMobile(scope) {
      console.log(scope.row.state)
      // 权限分配校验
      if (
        scope.row.permissions.length === 0 &&
        Number(scope.row.mobile === 1)
      ) {
        scope.row.mobile = 0
        this.$message({
          message: '请至少选择一个权限',
          type: 'warning'
        })
      }
      // 是否绑定校验
      if (Number(scope.row.bingding) === 0 && Number(scope.row.mobile === 1)) {
        scope.row.mobile = 0
        this.$message({
          message: '请先绑定机构',
          type: 'warning'
        })
      }
    },
    // 绑定机构弹窗开启关闭工号开关
    bindSwitchPc(scope) {
      // 权限分配校验
      // 是否绑定校验
      if (Number(scope.row.bingdingPc) === 0 && Number(scope.row.pc === 1)) {
        scope.row.pc = 0
        this.$message({
          message: '请先绑定机构',
          type: 'warning'
        })
      }
    },
    // 绑定机构，选择机构绑定移动出单
    async selOrgBindMobile(scope) {
      this.bindingList.bindType = 2 // 设置绑定类型
      this.clickType = 'mobile'
      this.bindingList.index = scope.$index
      this.bindDialog = true // 开启绑定机构选择机构弹窗
      this.bindingList.bind.isLoading = true // 开启绑定机构选择机构弹窗动画
      const sourceId = scope.row.source_code
      this.bindingList.numberId.source_code = scope.row.source_code
      const areaCode = this.bindingList.numberId.areaCode
      const channelId = this.bindingList.numberId.channelId
      const token = this.$store.state.user.token
      const org = await getCompanyByArea(sourceId, areaCode, channelId, token, [
        2
      ])
      this.bindingList.bind.isLoading = false // 关闭绑定机构选择机构弹窗动画
      if (!org.data) {
        this.$message({
          message: '该配置地区与渠道不匹配',
          type: 'warning'
        })
        return
      }
      this.bindingList.bind.data = org.data
    },
    // 绑定机构，选择机构绑定电脑出单
    async selOrgBind(scope) {
      this.bindingList.bindType = 1 // 设置绑定类型
      this.clickType = 'pc'
      this.bindingList.index = scope.$index
      this.bindDialog = true // 开启绑定机构选择机构弹窗
      this.bindingList.bind.isLoading = true // 开启绑定机构选择机构弹窗动画
      const sourceId = scope.row.source_code
      this.bindingList.numberId.source_code = scope.row.source_code
      const areaCode = this.bindingList.numberId.areaCode
      const channelId = this.bindingList.numberId.channelId
      const token = this.$store.state.user.token
      const org = await getCompanyByArea(sourceId, areaCode, channelId, token, [
        1
      ])
      this.bindingList.bind.isLoading = false // 关闭绑定机构选择机构弹窗动画
      if (!org.data) {
        this.$message({
          message: '该配置地区与渠道不匹配',
          type: 'warning'
        })
        return
      }
      this.bindingList.bind.data = org.data
    },
    // 检查数组中是否有重复元素
    isRepeat(arr) {
      const hash = {}
      for (const i in arr) {
        if (hash[arr[i]]) {
          return true
        }
        hash[arr[i]] = true
      }
      return false
    },
    // 保存绑定机构工号信息
    saveBind() {
      const channels = JSON.parse(JSON.stringify(this.bindingList.list))
      for (const i of channels) {
        if (
          Object.prototype.toString.call(i.permissions) === '[object Array]'
        ) {
          i.permissions = i.permissions.join(',')
        }
      }
      // 过滤空列表
      for (let i = 0; i < channels.length; i++) {
        if (!channels[i].source_code) {
          channels.splice(i, 1)
          i--
        }
      }

      const arr = []
      for (const i of channels) {
        arr.push(i.source_code)
      }
      if (this.isRepeat(arr) === true) {
        this.$message.error('存在重复分配的渠道')
        return
      }
      this.bindingList.isBindLoding = true
      bindingAllSource(this.bindingList.numberId.channelId, channels)
        .then(res => {
          this.handleClose()
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        })
        .catch(err => {
          this.$message({
            message: '保存失败',
            type: 'warning'
          })
          console.warn(err)
        })
      // 获取工号列表
      getNumberList({
        page: this.page,
        size: this.size,
        model: this.selectValue
      })
        .then(res => {
          this.numberList = res.data
          this.isLoading = false
        })
        .catch(err => {
          console.warn(err)
          this.isLoading = false
        })
    },
    // 绑定机构选择机构确定
    async bindSubmit() {
      this.bindingList.bind.isLoading = true
      try {
        const channelId = this.bindingList.numberId.channelId
        const comcodes = this.$refs.tree.getCheckedKeys(true).join(',')
        // console.log(comcodes)
        const companyId = this.bindingList.numberId.companyId
        const source_code = this.bindingList.numberId.source_code
        const areaCode = this.bindingList.numberId.areaCode
        await bindingInstitution(
          channelId,
          comcodes,
          companyId,
          source_code,
          areaCode,
          this.bindingList.bindType
        )
        this.$message({
          message: '绑定成功',
          type: 'success'
        })

        // 前端更新绑定状态，改变按钮颜色
        const keys = {
          pc: 'bingdingPc',
          mobile: 'bingding'
        }
        const key = keys[this.clickType]
        const index = this.bindingList.index
        const list = this.bindingList.list
        list[index][key] = comcodes !== '' ? '1' : '0'

        // const list = await getChannelsById(channelId)
        // for (const i of list.data) {
        //   if (i.permissions !== '' && i.permissions !== null) {
        //     i.permissions = i.permissions.split(',')
        //   } else {
        //     i.permissions = []
        //   }
        // }
        // this.bindingList.list = list.data
        this.bindClose()
      } catch (e) {
        this.$message({
          message: '绑定失败',
          type: 'warning'
        })
        this.bindClose()
        console.warn(e)
      }
    },
    handleEdit(scope) {
      console.log(scope.row)
      this.drawer.isShow = true
      this.isEdit = true
      this.channelId = scope.row.id
    },
    // 处理树选择Key
    normalizer(node) {
      if (node.children.length === 0) {
        delete node.children
      }
      return {
        id: node.key,
        label: node.title,
        children: node.children
      }
    },
    screenClose() {
      this.isScreenShow = false
    },
    screenConfirm() {
      this.screenClose()
    },
    screenShow() {
      this.isScreenShow = true
    },

    async screen() {
      this.screenIsloading = true
      this.delScreen()
      if (Number(this.selectValue.invoiceType) === 1) {
        this.screenTags.push({
          name: 'invoiceType',
          value: '出单设置:电脑端开启'
        })
      } else if (Number(this.selectValue.invoiceType) === 2) {
        this.screenTags.push({
          name: 'invoiceType',
          value: '出单设置:移动端开启'
        })
      } else if (Number(this.selectValue.invoiceType) === 3) {
        this.screenTags.push({
          name: 'invoiceType',
          value: '出单设置:同时开启'
        })
      }

      if (Number(this.selectValue.type) === 0 && this.selectValue.type !== '') {
        this.screenTags.push({ name: 'type', value: '使用类型:正式账号' })
      } else if (Number(this.selectValue.type) === 1) {
        this.screenTags.push({ name: 'type', value: '使用类型:测试账号' })
      }
      if (
        Number(this.selectValue.companyType) === 0 &&
        this.selectValue.companyType !== ''
      ) {
        this.screenTags.push({ name: 'companyType', value: '工号类型:接口' })
      } else if (Number(this.selectValue.companyType) === 1) {
        this.screenTags.push({ name: 'companyType', value: '工号类型:模拟' })
      }
      if (
        Number(this.selectValue.renewal) === 0 &&
        this.selectValue.renewal !== ''
      ) {
        this.screenTags.push({ name: 'renewal', value: '续保查询:关闭' })
      } else if (Number(this.selectValue.renewal) === 1) {
        this.screenTags.push({ name: 'renewal', value: '续保查询:开启' })
      }
      if (
        Number(this.selectValue.state) === 0 &&
        this.selectValue.state !== ''
      ) {
        this.screenTags.push({ name: 'state', value: '启用状态:启用' })
      } else if (Number(this.selectValue.state) === 1) {
        this.screenTags.push({ name: 'state', value: '启用状态:禁用' })
      } else if (Number(this.selectValue.state) === 2) {
        this.screenTags.push({ name: 'state', value: '启用状态:异常' })
      }
      if (
        Number(this.selectValue.bingding) === 0 &&
        this.selectValue.bingding !== ''
      ) {
        this.screenTags.push({ name: 'bingding', value: '绑定状态:未绑定' })
      } else if (Number(this.selectValue.bingding) === 1) {
        this.screenTags.push({ name: 'bingding', value: '绑定状态:已绑定' })
      }
      if (this.selectValue.date && this.selectValue.date.length) {
        console.log('时间变化')
        const str = `${dayjs(this.selectValue.date[0]).format(
          'YYYY-MM-DD'
        )}~${dayjs(this.selectValue.date[0]).format('YYYY-MM-DD')}`
        this.screenTags.push({ name: 'date', value: '添加时间:' + str })
      }
      try {
        await this.queryAll()
      } catch (e) {
        console.warn(e)
      }
      this.screenIsloading = false
      this.screenClose()
    },
    reset() {
      this.selectValue.type = undefined
      this.selectValue.companyType = undefined
      this.selectValue.state = undefined
      this.selectValue.bingding = undefined
      this.selectValue.invoiceType = undefined
      this.selectValue.date = null
      this.selectValue.renewal = undefined
    },
    delScreen() {
      // 清除全部tag
      this.screenTags = []
    },
    closeTag(tag, index) {
      this.screenTags.splice(index, 1)
      this.selectValue[tag] = undefined
      if (tag === 'date') {
        this.selectValue.date = null
        this.selectValue.stime = undefined
        this.selectValue.etime = undefined
      }
      this.queryAll()
    }
  }
}
</script>

<style lang="scss">
.el-table .warning-row {
  color: #f14535;
}

.el-table .close-row {
  color: #c0c0c0;
}
/*.el-select .el-input {*/
/*width: 130px;*/
/*}*/
.slide-active {
  width: 320px;
}
</style>

<style lang="scss" scoped>
.tree-title {
  margin-left: 10px;
  margin-bottom: 10px;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
}
.noBinding {
  background-color: #a0cfff !important;
  border: #a0cfff !important;
}
.noBinding:hover {
  background-color: #66b1ff !important;
  border: #66b1ff !important;
}
.screen-tag {
  margin: 20px 0;
  padding: 10px;
  background-color: #f2f6fc;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.btn {
  width: 10px;
  height: 32px;
  overflow: hidden;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: -10px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 999;
  img {
    width: 10px;
    height: 10px;
    transition: all 0.5s ease;
  }
}
.btn:hover {
  background-color: rgba(0, 0, 0, 0.7);
}
.arrow {
  transform: rotateZ(180deg);
}
</style>
<style lang="scss">
.number-right {
  .el-table td,
  .el-table th {
    // padding: 3px 0;
    padding: 0;
    height: 40px;
    line-height: 40px;
  }
  .el-table th {
    background: #fafafa;
  }
}
</style>
