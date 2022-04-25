<template>
  <div id="mytask" class="app-container">
    <div class="app-panel">
      <div class="sub-header">
        <div class="sub-title">我的任务（出单员）</div>
        <el-badge :value="taskMessageNum" :max="99" :hidden="!taskMessageNum" class="badge-item" @click.native="taskMessageOpen">
          <svg-icon icon-class="task_messenger" style="width: 20px;height: 20px;" />
        </el-badge>
      </div>
      <div class="poster-box">
        <div class="posterdaymenu">
          <div v-for="(menu,index) in menuday" :key="index.menu" class="posterdaymenubox">
            <el-button :type="menuboxact===index?'primary':'text'" icon="el-icon-document" size="small" @click="menuHandleClick(index)">{{ menu.name }}</el-button>
          </div>
          <div class="posterdaymenubox">
            <span>
              <el-date-picker v-model="dateArr" :clearable="false" :picker-options="pickerOptionsOLD" type="daterange" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" size="small" @change="dateArrChange" />
            </span>
            <el-button type="primary" icon="el-icon-search" size="small" @click="menuHandleSearch">查询</el-button>
            <el-button icon="el-icon-delete" size="small" @click="resetMenu">清空</el-button>
          </div>
        </div>
        <div v-loading="menuLoading" class="posterdaymain">
          <div :class="menuboxnum === 0 ? 'menuboxnumzero' : 'posterdaymainbox'" @click="handleMenu(0)">
            <h3>待报价</h3>
            <p>{{ posterdaymain.goQuote }}</p>
          </div>
          <div :class="menuboxnum === 1 ? 'menuboxnumone' : 'posterdaymainbox'" @click="handleMenu(1)">
            <h3>待出单</h3>
            <p>{{ posterdaymain.goInsure }}</p>
          </div>
          <div :class="menuboxnum === 2 ? 'menuboxnumtwo' : 'posterdaymainbox'" @click="handleMenu(2)">
            <h3>已出单</h3>
            <p>{{ posterdaymain.insured }}</p>
          </div>
          <div :class="menuboxnum === 3 ? 'menuboxnumthree' : 'posterdaymainbox'" @click="handleMenu(3)">
            <h3>完成任务</h3>
            <p>{{ posterdaymain.complete }}</p>
          </div>
        </div>
      </div>
      <div class="searchMian">
        <h2>数据筛选</h2>
        <div class="searchMianList">
          <div class="searchMianBox">
            <el-input v-model="searchForm.licenseNo" placeholder="请输入车牌号" size="small" />
          </div>
          <div class="searchMianBox">
            <el-input v-model="searchForm.frameNo" placeholder="请输入车架号" size="small" />
          </div>
          <div class="searchMianBox">
            <el-input v-model="searchForm.operator" placeholder="请输入续保专员" size="small" />
          </div>
          <!--<div class="searchMianBox">
            <el-select :loading="selectLoading" v-model="searchForm.lastCompanyId" clearable filterable placeholder="请选择去年投保公司" size="small">
              <el-option v-for="item in companylist" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </div>-->
          <div class="searchMianBox">
            <el-select v-model="searchForm.taskState" clearable filterable size="small" placeholder="请选择任务状态">
              <el-option v-for="item in searchTaskStateList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <div class="searchMianBoxbtn">
            <el-button type="primary" icon="el-icon-search" size="small" @click="searchbtn">立即查询</el-button>
            <el-button icon="el-icon-menu" size="small" @click="moreSearch">高级搜索</el-button>
            <el-button icon="el-icon-delete" size="small" @click="searchReset">清空搜索</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="tabMian">
      <div class="tabMianTitle">
        <h2>数据列表</h2>
        <div class="tabMianMenu">
          <el-button icon="el-icon-refresh" size="small" @click="refreshPage">刷新</el-button>
        </div>
      </div>
      <div class="tabMianall">
        <el-table v-loading="tabMianLoading" ref="multipleTable" :data="insureTablist" :header-cell-style="{background:'#fff'}" border tooltip-effect="dark">
          <el-table-column prop="licenseNo" label="车牌号" show-overflow-tooltip fixed="left" />
          <el-table-column prop="frameNo" width="160" label="车架号" show-overflow-tooltip fixed="left" />
          <el-table-column prop="ownerName" label="车主姓名" show-overflow-tooltip />
          <el-table-column prop="ownerPhone" label="车主电话" show-overflow-tooltip />
          <el-table-column prop="comEndDate" label="商业险到期日期" min-width="100" show-overflow-tooltip />
          <el-table-column prop="forceEndDate" label="交强险到期日期" min-width="100" show-overflow-tooltip />
          <el-table-column prop="applyTime" label="申请时间" min-width="110" show-overflow-tooltip />
          <el-table-column label="报价状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button v-if="scope.row.quoteState===0" type="text" size="mini" @click="handleBJ(scope.row)">未报价</el-button>
              <el-button v-else-if="scope.row.quoteState===1" type="text" size="mini" @click="seeDetails(scope.row)">报价成功</el-button>
              <el-button v-else-if="scope.row.quoteState===2" type="text" size="mini" @click="seeDetails(scope.row)">报价失败</el-button>
            </template>
          </el-table-column>
          <el-table-column label="任务状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <!--<span v-if="scope.row.taskState===0">未分配</span>
              <span v-else-if="scope.row.taskState===1">已分配</span>
              <span v-else-if="scope.row.taskState===2">跟进中</span>
              <span v-else-if="scope.row.taskState===3">即将到期</span>
              <span v-else-if="scope.row.taskState===4">申请报价</span>
              <span v-else-if="scope.row.taskState===5">申请出单</span>
              <span v-else-if="scope.row.taskState===6">转派</span>
              <span v-else-if="scope.row.taskState===7">成交出单</span>
              <span v-else-if="scope.row.taskState===8">战败</span>
              <span v-else-if="scope.row.taskState===9">已报价</span>-->
              <span v-if="scope.row.taskState===0">申请报价</span>
              <span v-else-if="scope.row.taskState===1">已报价</span>
              <span v-else-if="scope.row.taskState===2">申请出单</span>
              <span v-else-if="scope.row.taskState===3">成交出单</span>
            </template>
          </el-table-column>
          <el-table-column prop="salesmanName" label="续保专员" show-overflow-tooltip />
          <el-table-column prop="salesmanPhone" label="续保专员电话" show-overflow-tooltip />
          <el-table-column label="备注" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-popover v-if="scope.row.mark" placement="top" title="备注信息" width="200" trigger="hover">
                <div style="word-break: break-all;">
                  <p>{{ scope.row.mark }}</p>
                </div>
                <el-button slot="reference" type="text" size="small">备注信息</el-button>
              </el-popover>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" show-overflow-tooltip fixed="right" width="80" class="hoverwidth">
            <template slot-scope="scope">
              <el-popover placement="left" trigger="hover">
                <div style="text-align: right; margin: 0">
                  <!--出单员成交出单3，已报价1只查看-->
                  <template v-if="scope.row.taskState!==1 && scope.row.taskState!==3">
                    <el-button v-if="scope.row.taskState===0||scope.row.taskState===2" type="text" size="small" icon="el-icon-share" class="right-bdr" @click="taskForBtn(scope.row)">任务转派</el-button>
                    <el-button v-if="scope.row.taskState===0" type="text" size="small" class="right-bdr" @click="offerForBtn(scope.row)">添加报价</el-button>
                    <el-button v-if="scope.row.taskState===2" type="text" size="small" class="right-bdr" @click="addEditForBtn(scope.row)">录入保单</el-button>
                    <el-button v-if="scope.row.taskState===2" type="text" size="small" class="right-bdr" @click="grabForBtn(scope.row)">手动抓单</el-button>
                    <el-button v-if="scope.row.taskState===2" type="text" size="small" class="right-bdr" @click="handleToQuickissue(scope.row)">快速投保</el-button>
                  </template>
                  <el-button type="text" size="small" @click="checkData(scope.row)">查看详情</el-button>
                </div>
                <el-button slot="reference" type="text" size="small">更多操作</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="count > 0" class="pageAll">
          <el-pagination :current-page="page" :page-sizes="[10, 20, 30, 40, 50]" :page-size="size" :total="count" layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChange" @current-change="currentChange" />
        </div>
      </div>
    </div>
    <!--查看报价详情-->
    <el-dialog v-if="priceShow" :visible.sync="priceShow" title="报价详情" width="60%" class="dialogAll">
      <customer-price v-if="priceShow" :price-list="priceList" :price-option="priceOption" :price-id="priceId" :is-apply-issue="isApplyIssue" :is-loading="priceLoading" @priceClose="priceClose" @priceOption="setPriceOption" />
    </el-dialog>
    <!--高级搜索-->
    <app-drawer :is-show="isSearchShow" :mask-closable="false" drawer-title="高级搜索" drawer-style="width: 720px;" no-button @drawerClose="searchClose">
      <more-search v-if="isSearchShow" ref="moreSearchForm" :search-form="searchForm" route-path="myTask" @reset="searchReset" @screen="searchConfirm" @cancel="searchCancel" />
    </app-drawer>
    <!-- 指派任务弹窗 -->
    <!-- <el-dialog v-if="appointForShow" :title="dialogTitle" :visible.sync="appointForShow" width="60%" class="dialogAll">
      <div class="dialogMain">
        <div class="dialogMainSearch">
          <span>续保专员</span>
          <span>
            <el-input v-model="serchform.name" placeholder="请输入续保专员" size="small" />
          </span>
          <span>
            <el-button type="success" icon="el-icon-search" size="small">查询</el-button>
          </span>
        </div>
        <el-table ref="multipleTable" :data="tableData3" highlight-current-row tooltip-effect="dark" class="dialogtable03" @current-change="handleCurrentChange">
          <el-table-column width="40">
            <template slot-scope="scope">
              <i :style="scope.row.id===trueId ?'color:#67c23a':'color:#aaa'" :class="scope.row.id===trueId ? 'el-icon-circle-check':'el-icon-circle-check-outline'" />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="续保专员" show-overflow-tooltip />
          <el-table-column prop="address" label="手机号" show-overflow-tooltip />
        </el-table>
        <div class="dialogMainCompany">
          <span v-for="(item,index) in companylist" :key="index.id">
            <el-radio v-model="companyNum" :label="index" border @change="getTemplateRadio(index,item)">
              <strong>保险公司：{{ item.name }}-价格：{{ item.price }}</strong>
              <p>报价时间:{{ item.time }}</p>
            </el-radio>
          </span>
        </div>
        <div class="dialogMainTops">
          <strong>备注</strong>
          <div>
            <el-input v-model="serchform.name" placeholder="请输入备注" />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="appointForShow = false">取 消</el-button>
        <el-button type="primary" @click="appointForShow = false">确 定</el-button>
      </span>
    </el-dialog> -->
    <!-- 任务转派弹窗 -->
    <el-dialog v-if="taskForShow" :visible.sync="taskForShow" title="任务转派" width="60%" class="dialogAll">
      <div class="dialogMain">
        <div class="dialogMainSearch">
          <span>出单专员</span>
          <span>
            <el-input v-model="taskForName" placeholder="请输入出单专员" size="small" />
          </span>
          <span>
            <el-button type="primary" icon="el-icon-search" size="small" @click="taskForSearch">查询</el-button>
          </span>
        </div>
        <el-table ref="multipleTable" :data="taskForList" highlight-current-row tooltip-effect="dark" class="dialogtable03" @current-change="taskForListChange">
          <el-table-column width="40">
            <template slot-scope="scope">
              <i :style="scope.row.id===taskForListId ?'color:#67c23a':'color:#aaa'" :class="scope.row.id===taskForListId ? 'el-icon-circle-check':'el-icon-circle-check-outline'" />
            </template>
          </el-table-column>
          <el-table-column prop="nickName" label="出单员" show-overflow-tooltip />
          <el-table-column prop="phone" label="手机号" show-overflow-tooltip />
        </el-table>
        <div class="dialogMainTops">
          <strong>备注</strong>
          <div>
            <el-input v-model="taskForRemarks" placeholder="请输入备注" />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="taskForShow = false">取 消</el-button>
        <el-button size="small" type="primary" @click="taskForEnter">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加报价弹窗 -->
    <app-drawer :is-show="offerForShow" :mask-closable="false" :drawer-style="offerForShowstyle" drawer-title="添加报价信息" no-button @drawerClose="offerForclose">
      <add-offer-form v-if="offerForShow" ref="isofferFor" :row-add-offer-list="rowAddOfferList" @getAddOfferOk="getAddOfferOk" />
    </app-drawer>
    <!--手动录单 弹窗 -->
    <app-drawer :is-show="addEditForShow" :mask-closable="false" :drawer-style="addEditForstyle" drawer-title="录入保单" no-button @drawerClose="addEditForclose">
      <add-edit-form v-if="addEditForShow" ref="isEditFor" :row-add-edit-list="rowAddEditList" :get-add-edit-for="getAddEditFor" @getBdOk="getBdOk" />
    </app-drawer>
    <!-- 抓单 弹窗 -->
    <app-drawer :is-show="grabForShow" :drawer-style="grabForShowstyle" :mask-closable="false" drawer-title="手动抓单" @drawerConfirm="grabForConfirm" @drawerClose="grabForclose">
      <grab-form v-if="grabForShow" ref="dataForm" @GrabTitle="grabFormTitle" @comuserName="comuserName" @getOrganName="getOrganName"/>
    </app-drawer>
    <!-- 抓单中 -->
    <el-dialog
      :visible.sync="getPolicyVisible1"
      :close-on-click-modal="false"
      title="手动抓单"
      width="500px"
      class="getpolicy"
    >
      <div class="dialog">
        <span>
          <img src="@/assets/imgs/u8231.gif">
        </span>
        <span class="txt">正在执行抓单操作...</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button size="small">稍后查看</el-button> -->
      </div>
    </el-dialog>
    <!-- 抓单完成弹窗 -->
    <el-dialog
      :visible.sync="getPolicyVisible2"
      :close-on-click-modal="false"
      title="手动抓单"
      width="500px"
      class="getpolicy"
    >
      <div style="text-align:center;margin: 30px">
        <div class="dialog_result">
          <span>
            <img src="@/assets/imgs/u8241.png">
          </span>
          <span class="txt">抓单完成！</span>
        </div>
        <p>总计{{ policyList.total }}条，抓取成功{{ policyList.finishCount }}条，重复抓取{{ policyList.repeatCount }}条，抓取失败{{ policyList.failCount }}条</p>
      </div>
      <div v-if="hasFalure&&isComplete" class="failReasons">
        <p>注：工号登录超时或连接异常，均会导致抓单失败。抓单失败的保单/车牌，您可稍后重试或通过“保存保单”、“手动录入”等方式，完成保单录入。本次抓取失败如下：{{ policyList.failArr }}</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button size="small" type="primary" >查看详情</el-button> -->
      </div>
    </el-dialog>
    <!--抓单成功弹窗-->
    <el-dialog v-if="editShow" :visible.sync="editShow" title="报价详情" width="90%" top="20px" class="dialogAll">
      <!-- <edit v-if="editShow" :put-one-capture-list="putOneCaptureList" @isEditAllShow="isEditAllShow" /> -->
    </el-dialog>
    <!--任务通知侧滑窗显示-->
    <app-drawer :is-show="isTaskMessageShow" :mask-closable="false" drawer-title="任务通知" drawer-style="width: 370px;" no-button @drawerClose="taskMessageClose">
      <!--滚动弹窗显示-->
      <div v-loading="messageListLoad" v-if="NotificationShow" class="Notification">
        <ul class="msg-wrapper">
          <li v-for="(item,index) in MessageList" :key="index" class="msg-item">
            <div class="item-box">
              <div class="msg-icon">
                <svg-icon v-show="item.status" icon-class="task-msg-read" style="width: 22px;height: 22px;" />
                <svg-icon v-show="!item.status" icon-class="task-msg-unread" style="width: 22px;height: 22px;" />
              </div>
              <div class="msg-content">
                <div class="mag-title-box">
                  <h3 class="msg-title">{{ item.title }}</h3>
                  <el-button class="msg-del-btn" size="mini" type="text" @click="delSeeBtn(item, index)"><i class="el-icon-circle-close-outline" /></el-button>
                </div>
                <p class="msg-desc">{{ item.msg }}</p>
                <div class="dialog-footer">
                  <el-button class="msg-desc-btn" type="primary" size="mini" @click="seeBtn(item)">查看详情</el-button>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div class="msg-handle">
          <div class="msg-pagination">
            <el-pagination :current-page="msgPage" :pager-count="msgPageMax" :page-sizes="[10]" :page-size="msgPageSize" :total="msgPageCount" layout="total, prev, pager, next" @current-change="msgPageChange" />
          </div>
          <div class="msg-clear-all">
            <el-button class="msg-clear-btn" type="primary" size="mini" @click="delAllMsgBtn">全部清空</el-button>
          </div>
        </div>
      </div>
      <div v-if="!NotificationShow" class="no-msg">暂无任务通知!</div>
    </app-drawer>
    <!--通过任务通知查看报价详情-->
    <el-dialog v-if="taskNotificationShow" :visible.sync="taskNotificationShow" title="报价详情" width="60%" class="dialogAll">
      <see-edit v-if="taskNotificationShow" ref="taskNotificationFor" :see-edit-list="notificationEditList" :is-loading="isNotificationLoading" notification-flag="taskNotification" @seeEditClose="seeEditClose" />
    </el-dialog>
  </div>
</template>
<script>
import addEditForm from '@/views/carDealer/components/addedit'
import grabForm from '@/views/carDealer/components/grabform'
import addOfferForm from '@/views/carDealer/components/addoffer'
import edit from '@/views/carDealer/components/edit'
import moreSearch from '@/views/carDealer/components/moreSearch'
import appDrawer from '@/components/Drawer/drawer'
import customerPrice from '@/views/carDealer/customerPrice'
import dayjs from 'dayjs'
import qs from 'qs'
import {
  getInsurePlateInfo,
  getInsureListPage,
  getInsuredCompany,
  getQuoteUserListByKey,
  getUnreadMsgsSumByUId,
  getMsgsPageByUId,
  readMsgByIds,
  deleteMsgByIds,
  deleteAllMsgByUId,
  redeployQuoteUser,
  getAllOfferRecords,
  getQuoteInfo
  // putOneCapture
} from '@/api/mytask'
import { getPolicySubmit, getPolicyDetail } from '@/api/findPolicy'
import { getCustomerSelectId } from '@/api/customer'
export default {
  name: 'Mytask',
  components: {
    addEditForm,
    grabForm,
    addOfferForm,
    appDrawer,
    moreSearch,
    customerPrice,
    edit
  },
  data() {
    return {
      getPolicyVisible1: false,
      getPolicyVisible2: false,
      isComplete: true, // 抓单是否完成
      hasFalure: false, // 抓单完成后是否有失败的
      policyList: {
        total: 0,
        finishCount: 0,
        repeatCount: 0,
        failCount: 0,
        repeatArr: '',
        failArr: '',
        detail: ''
      },
      isLoading: false,
      menuLoading: false,
      NotificationShow: false, // 通知弹窗
      MessageList: [],
      // 0-今日 1-本周 2-本月 3-上月 4-自定义
      menuday: [
        {
          name: '今天',
          value: 0
        },
        {
          name: '本周',
          value: 1
        },
        {
          name: '本月',
          value: 2
        },
        {
          name: '上月',
          value: 3
        }
      ],
      menuboxact: '',
      dateArr: [dayjs(), dayjs()],
      pickerOptionsOLD: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      posterdaymain: '',
      menuboxnum: null,
      tabMianLoading: false,
      insureTablist: [],
      page: 1,
      size: 10,
      count: null,
      appointForShow: false,
      dialogTitle: '',
      companyNum: '保险公司',
      companylist: [],
      // 高级搜索
      searchForm: {
        panelState: null,
        start: null,
        end: null,
        licenseNo: '', // 车牌
        ownerName: null, // 车主姓名
        dateType: null, // 距离脱保天数
        operator: null, // 续保专员
        taskState: null, // 任务状态
        state: null, // 跟进状态
        type: null, // 客户类型
        frameNo: null, // 车架号
        ownerPhone: null, // 联系电话
        holderName: null, // 投保人
        allocationTime: null, // 分配时间
        allocationTimeBegin: null, // 分配开始时间
        allocationTimeEnd: null, // 分配结束时间
        renewalState: null, // 续保状态
        comEndDate: null, // 商业险止期
        comEndDateBegin: null, // 商业险开始时间
        comEndDateEnd: null, // 商业险结束时间
        forceEndDate: null, // 交强险止期
        forceEndDateBegin: null, // 交强险开始时间
        forceEndDateEnd: null, // 交强险结束时间
        planReturnTime: null, // 计划回访时间
        returnTime: null, // 录入回访时间
        quoteFlag: null, // 报价状态
        brandName: null, // 品牌型号
        inputType: null, // 录入方式
        enrollDate: null, // 注册日期
        enrollDateBegin: null, // 注册开始时间
        enrollDateEnd: null, // 注册结束时间
        lastCompanyId: null, // 去年投保公司
        phoneType: null // 客户电话
      },
      // 任务状态 列表
      searchTaskStateList: [
        // { label: '未分配', value: 0 },
        // { label: '已分配', value: 1 },
        { label: '申请报价', value: 0 },
        { label: '已报价', value: 1 },
        { label: '申请出单', value: 2 },
        // { label: '转派', value: 6 },
        { label: '成交出单', value: 3 }
        // { label: '跟进中', value: 2 },
        // { label: '即将到期', value: 3 },
        // { label: '申请报价', value: 4 },
        // { label: '已报价', value: 9 },
        // { label: '申请出单', value: 5 },
        // { label: '转派', value: 6 }
        // { label: '成交出单', value: 7 },
        // { label: '战败', value: 8 }
      ],
      selectLoading: false,
      // 手动录单
      addEditForShow: false,
      rowAddEditList: '',
      getAddEditFor: '',
      addEditForstyle: 'width:800px;',
      // 抓取保单
      grabForShow: false,
      grabForShowstyle: 'width: 520px;',
      sdzdFormarrstips: '',
      childrenGrabTitle: '',
      policyOrganName: '',
      comuserNametext: '',
      // 抓单成功
      editShow: false,
      putOneCaptureList: '', // 抓单返回数据
      // 高级搜索部分
      isSearchShow: false,
      // 添加报价弹窗
      offerForShow: false,
      offerForShowstyle: 'width:500px;',
      rowAddOfferList: '',
      // 查看详情弹窗
      priceShow: false,
      priceLoading: false,
      priceList: [],
      priceOption: {},
      taskNotificationShow: false,
      isNotificationLoading: false,
      notificationEditList: [],
      priceId: '',
      isApplyIssue: false,
      trueId: '',
      // 任务转派弹窗
      taskForShow: false,
      taskForName: '',
      taskForList: [],
      taskForId: '',
      taskForRId: '',
      taskForListId: '',
      taskForRemarks: '',
      timer: null,
      timer2: null,
      taskMessageNum: 0,
      messageListLoad: false,
      isTaskMessageShow: false,
      msgPage: 1, // 任务通知列表分页 当前页
      msgPageSize: 10, // 任务通知列表分页 每页条数
      msgPageMax: 5, // 任务通知列表分页 最大页码按钮数 大于等于 5 且小于等于 21 的奇数
      msgPageCount: null // 任务通知列表分页 总条数
    }
  },
  watch: {
    $route(to, from) {
      if (to.path === ('/carDealer/myTask02' || '/carDealer/myTask')) {
        this.actTime()
      } else {
        // 停止定时器
        clearInterval(this.timer)
      }
    }
  },
  async created() {
    this.menuHandleClick(0)
    this.searchbtn()
    this.getMessageListAjax(this.msgPage)
    this.actTime()
    // 获取保险公司
    const resComList = await getInsuredCompany()
    this.companylist = resComList.data
  },
  beforeDestroy() {
    // 停止定时器
    clearInterval(this.timer)
    clearTimeout(this.timer2)
  },
  methods: {
    // 时间不超过一年提示
    dateArrChange(val) {
      // console.log(val)
      if (dayjs(val[1]).diff(dayjs(val[0]), 'month') > 11) {
        this.$message({
          duration: 4000,
          message: '最多只可选择一年的时间长度进行查询！'
        })
        this.dateArr = [dayjs(), dayjs()]
      }
    },
    // 刷新
    async refreshPage() {
      // 初始化看台信息
      this.menuboxnum = null
      this.searchForm.panelState = null
      this.searchForm.start = ''
      this.searchForm.end = ''
      // 清空搜索条件
      this.searchReset()
      this.getMessageListAjax(this.msgPage)
    },
    // 抓单成功保存抓单保单返回(true)
    isEditAllShow(value) {
      this.editShow = !value
    },
    // 添加报价信息成功返回信息（true）
    getAddOfferOk(value) {
      this.offerForShow = !value
      this.searchbtn()
    },
    // 保存保单成功返回的信息（true）
    getBdOk(value) {
      this.addEditForShow = !value
      this.searchbtn()
    },
    // 获取子组件抓单信息的标题，是车牌号还是保单号
    grabFormTitle(value) {
      this.childrenGrabTitle = value
    },
    // 获取抓单页面机构名称
    getOrganName(value) {
      this.policyOrganName = value
    },
    // 获取子组件业务员名称
    comuserName(value) {
      this.comuserNametext = value
    },
    // 每30秒刷新一次任务通知
    actTime() {
      this.timer = setInterval(() => {
        if (this.msgPage === 1) { // 自定义在分页第一页时才隔30秒刷新一次
          this.getMessageListAjax(this.msgPage)
        }
      }, 30000)
    },
    // 发起消息请求
    async getMessageListAjax(currentPage) {
      try {
        this.messageListLoad = true
        this.MessageList = []
        this.taskMessageNum = 0
        const resMsgUnread = await getUnreadMsgsSumByUId()
        if (resMsgUnread.status === 200) {
          this.taskMessageNum = resMsgUnread.data
        }
        const resMessage = await getMsgsPageByUId({
          current: currentPage,
          size: this.msgPageSize
        })
        if (resMessage.data.records.length) {
          this.messageListLoad = false
          this.msgPage = resMessage.data.current
          this.msgPageCount = resMessage.data.total
          this.MessageList = resMessage.data.records
          this.NotificationShow = true
        } else {
          this.NotificationShow = false
        }
      } catch (e) {
        console.warn(e)
        this.messageListLoad = false
        this.NotificationShow = false
      }
    },
    // 任务通知已读请求
    readMsgAjax(item) {
      readMsgByIds(item.id).then(res => {
        if (res.status === 200) {
          this.msgPage = 1
          this.getMessageListAjax(this.msgPage)
        }
      }).catch(err => {
        console.warn(err)
      })
    },
    // 任务通知侧滑窗打开
    taskMessageOpen() {
      this.isTaskMessageShow = true
    },
    // 任务通知侧滑窗关闭
    taskMessageClose() {
      this.isTaskMessageShow = false
    },
    // 任务通知删除请求
    deleteMsgAjax(item, index) { // type: 1关闭 0查看详情
      deleteMsgByIds(item.id).then(res => {
        if (res.status === 200) {
          this.MessageList.splice(index, 1)
          if (!item.status) {
            this.taskMessageNum -= 1
          }
        }
      }).catch(err => {
        console.warn(err)
      })
    },
    // 通知消息的查看和删除
    async seeBtn(item) {
      this.readMsgAjax(item)
      this.taskNotificationShow = false // 关闭详情弹窗
      if (item.type === 0) {
        this.$router.push({
          path: '/carDealer/customerDetail',
          query: {
            id: item.businessId,
            licenseNo: item.licenseNo,
            name: 'myTask'
          }
        })
      } else {
        // 打开查看详情
        try {
          this.notificationEditList = []
          this.isNotificationLoading = true
          const resL = await getQuoteInfo({ orderId: item.businessId })
          resL.data.qutote.salesmanName = resL.data.salesmanName
          resL.data.qutote.salesmanPhone = resL.data.salesmanPhone
          resL.data.qutote.times = dayjs(parseInt(resL.data.qutote.times)).format('YYYY-MM-DD HH:mm:ss')
          this.notificationEditList.push(resL.data)
          this.isNotificationLoading = false
          this.taskNotificationShow = true
        } catch (e) {
          console.warn(e)
          this.isNotificationLoading = false
        }
      }
    },
    delSeeBtn(item, index) {
      this.deleteMsgAjax(item, index)
    },
    // 清空任务通知列表
    delAllMsgBtn() {
      this.$confirm('此操作将清空任务列表, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAllMsgByUId().then(res => {
          if (res.status === 200) {
            this.msgPage = 1
            this.getMessageListAjax(this.msgPage)
            this.isTaskMessageShow = false
          }
        }).catch(err => {
          console.warn(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消清空操作'
        })
      })
    },
    // 任务通知查看详情弹窗关闭
    taskNotificationClose() {
      this.taskNotificationShow = false
    },
    // 看台面板
    resetMenu() {
      this.menuboxnum = null
      this.menuboxact = 0
      this.dateArr = [
        dayjs().format('YYYY-MM-DD 00:00:00'),
        dayjs().format('YYYY-MM-DD 23:59:59')
      ]
      this.searchForm.panelState = null
      this.searchForm.start = ''
      this.searchForm.end = ''
      this.plateInfoAjax(0)
      this.searchbtn()
    },
    handleMenu(index) {
      if (this.menuboxnum !== index) {
        this.menuboxnum = index
        this.searchForm.panelState = index
        this.searchForm.start = dayjs(this.dateArr[0]).format(
          'YYYY-MM-DD 00:00:00'
        )
        this.searchForm.end = dayjs(this.dateArr[1]).format(
          'YYYY-MM-DD 23:59:59'
        )
      } else {
        this.menuboxnum = null
        this.searchForm.panelState = null
        this.searchForm.start = ''
        this.searchForm.end = ''
      }
      this.searchbtn()
    },
    menuHandleClick(index) {
      this.menuLoading = true
      this.menuboxact = index
      this.menuboxnum = null
      this.searchForm.panelState = null
      this.searchForm.start = ''
      this.searchForm.end = ''
      this.plateInfoAjax(index)
    },
    plateInfoAjax(index) {
      switch (index) {
        case 0: // 今天
          this.dateArr = [
            dayjs().format('YYYY-MM-DD 00:00:00'),
            dayjs().format('YYYY-MM-DD 23:59:59')
          ]
          break
        case 1: // 本周
          this.dateArr = [
            dayjs(dayjs(dayjs().startOf('week')).valueOf() + 24 * 3600000),
            dayjs(dayjs(dayjs().startOf('week')).valueOf() + 7 * 24 * 3600000)
          ]
          break
        case 2: // 本月
          this.dateArr = [dayjs().startOf('month'), dayjs().endOf('month')]
          break
        case 3: // 上月
          this.dateArr = [
            dayjs()
              .subtract(1, 'month')
              .startOf('month'),
            dayjs()
              .subtract(1, 'month')
              .endOf('month')
          ]
          break
      }
      getInsurePlateInfo(qs.stringify({ dateType: index }))
        .then(res => {
          this.posterdaymain = res.data
          this.menuLoading = false
        })
        .catch(err => {
          this.menuLoading = false
          console.warn(err)
        })
    },
    menuHandleSearch() {
      this.menuboxact = null
      this.menuLoading = true
      const startTime = dayjs(this.dateArr[0]).format('YYYY-MM-DD 00:00:00') // new Date(dayjs(this.dateArr[0]).format('YYYY-MM-DD 00:00:00')).getTime()
      const endTime = dayjs(this.dateArr[1]).format('YYYY-MM-DD 23:59:59') // new Date(dayjs(this.dateArr[1]).format('YYYY-MM-DD 23:59:59')).getTime()
      if (startTime && endTime) {
        const Paramsdata = {
          dateType: 4,
          start: startTime,
          end: endTime
        }
        getInsurePlateInfo(qs.stringify(Paramsdata))
          .then(res => {
            this.posterdaymain = res.data
            this.menuLoading = false
          })
          .catch(err => {
            console.warn(err)
          })
      } else {
        this.$message({
          message: '请选择时间，进行查询！',
          type: 'warning'
        })
      }
    },
    // 搜索
    searchbtn() {
      this.tabMianLoading = true
      this.searchForm.licenseNo = this.searchForm.licenseNo.toString().trim()
      const Paramsdata = {
        current: this.page,
        size: this.size,
        params: this.searchForm
      }
      getInsureListPage(Paramsdata)
        .then(res => {
          this.tabMianLoading = false
          this.count = res.data.total
          this.page = res.data.current
          this.insureTablist = res.data.records
        })
        .catch(err => {
          this.tabMianLoading = false
          console.warn(err)
        })
    },
    // 高级搜索
    moreSearch() {
      this.isSearchShow = true
    },
    // 高级搜索确定
    searchConfirm() {
      this.$refs.moreSearchForm.isLoading = true
      this.tabMianLoading = true
      if (this.searchForm.allocationTime) {
        this.searchForm.allocationTimeBegin = dayjs(
          this.searchForm.allocationTime
        )
          .startOf('month')
          .format('YYYY-MM-DD 00:00:00')
        this.searchForm.allocationTimeEnd = dayjs(
          this.searchForm.allocationTime
        )
          .endOf('month')
          .format('YYYY-MM-DD 23:59:59')
      }
      if (this.searchForm.forceEndDate) {
        this.searchForm.forceEndDateBegin = dayjs(this.searchForm.forceEndDate)
          .startOf('month')
          .format('YYYY-MM-DD 00:00:00')
        this.searchForm.forceEndDateEnd = dayjs(this.searchForm.forceEndDate)
          .endOf('month')
          .format('YYYY-MM-DD 23:59:59')
      }
      if (this.searchForm.comEndDate) {
        this.searchForm.comEndDateBegin = dayjs(this.searchForm.comEndDate)
          .startOf('month')
          .format('YYYY-MM-DD 00:00:00')
        this.searchForm.comEndDateEnd = dayjs(this.searchForm.comEndDate)
          .endOf('month')
          .format('YYYY-MM-DD 23:59:59')
      }
      if (this.searchForm.enrollDate) {
        this.searchForm.enrollDateBegin = dayjs(this.searchForm.enrollDate)
          .startOf('month')
          .format('YYYY-MM-DD 00:00:00')
        this.searchForm.enrollDateEnd = dayjs(this.searchForm.enrollDate)
          .endOf('month')
          .format('YYYY-MM-DD 23:59:59')
      }
      this.searchForm.licenseNo = this.searchForm.licenseNo.toString().trim()
      const Paramsdata = {
        current: 1,
        size: this.size,
        params: this.searchForm
      }
      getInsureListPage(Paramsdata)
        .then(res => {
          this.isSearchShow = false
          this.$refs.moreSearchForm.isLoading = false
          this.tabMianLoading = false
          this.count = res.data.total
          this.page = res.data.current
          this.insureTablist = res.data.records
        })
        .catch(err => {
          this.$refs.moreSearchForm.isLoading = false
          this.tabMianLoading = false
          console.warn(err)
        })
    },
    // 高级搜索取消
    searchCancel() {
      this.isSearchShow = false
      this.searchReset()
    },
    // 高级搜索清空
    searchReset() {
      this.searchForm.licenseNo = '' // 车牌
      this.searchForm.ownerName = null // 车主姓名
      this.searchForm.dateType = null // 距离脱保天数
      this.searchForm.operator = null // 续保专员
      this.searchForm.type = null // 客户类型
      this.searchForm.taskState = null // 任务状态
      this.searchForm.state = null // 跟进状态
      this.searchForm.frameNo = null // 车架号
      this.searchForm.ownerPhone = null // 联系电话
      this.searchForm.holderName = null // 投保人
      this.searchForm.allocationTime = null // 分配时间
      this.searchForm.allocationTimeBegin = null
      this.searchForm.allocationTimeEnd = null
      this.searchForm.renewalState = null // 续保状态
      this.searchForm.comEndDate = null // 商业险止期
      this.searchForm.comEndDateBegin = null
      this.searchForm.comEndDateEnd = null
      this.searchForm.forceEndDate = null // 交强险止期
      this.searchForm.forceEndDateBegin = null
      this.searchForm.forceEndDateEnd = null
      this.searchForm.planReturnTime = null // 计划回访时间
      this.searchForm.returnTime = null // 录入回访时间
      this.searchForm.quoteFlag = null // 报价状态
      this.searchForm.brandName = null // 品牌型号
      this.searchForm.inputType = null // 录入方式
      this.searchForm.enrollDate = null // 注册日期
      this.searchForm.enrollDateBegin = null
      this.searchForm.enrollDateEnd = null
      this.searchForm.lastCompanyId = null // 去年投保公司
      this.searchForm.phoneType = null // 客户电话
      this.searchbtn()
    },
    // 高级搜索关闭 x
    searchClose() {
      this.isSearchShow = false
    },
    // 翻页
    sizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.size = val
      this.searchbtn()
    },
    currentChange(val) {
      this.page = val
      this.tabMianLoading = true
      const Paramsdata = {
        current: this.page,
        size: this.size,
        params: this.searchForm
      }
      getInsureListPage(Paramsdata)
        .then(res => {
          this.tabMianLoading = false
          this.count = res.data.total
          this.insureTablist = res.data.records
        })
        .catch(err => {
          this.tabMianLoading = false
          console.warn(err)
        })
    },
    // 任务通知列表分页
    msgPageChange(val) {
      this.msgPage = val
      this.getMessageListAjax(this.msgPage)
    },
    // 报价失败，未报价
    handleBJ(row) {
      // this.$router.push({
      //   path: '/insurance/quickissue',
      //   name: '移动出单',
      //   query: {
      //     carDealerId: row.uuid, // 是否车商标识
      //     carLicense: row.licenseNo, // 车牌号
      //     frameNo: row.frameNo // 车架号
      //   }
      // })
      window.openIssueUrl({
        carDealerId: row.uuid, // 是否车商标识
        carLicense: row.licenseNo, // 车牌号
        frameNo: row.frameNo // 车架号
      })
    },
    // 快速投保
    handleToQuickissue(row) {
      this.$router.push({
        path: '/insurance/issuecenter',
        name: '电脑出单'
      })
    },
    // 查看详情
    checkData(row) {
      this.$router.push({
        path: '/carDealer/customerDetail',
        query: { id: row.id, licenseNo: row.licenseNo, name: 'myTask' }
      })
    },
    // 列表备注信息
    // handleTipsMsg(row) {
    //   console.log(row)
    // },
    // 指派任务
    // appointForBtn() {
    //   this.dialogTitle = '指派任务'
    //   this.appointForShow = true
    // },
    // appointForclose() {
    //   this.companyNum = ''
    // },
    // handleCurrentChange(val) {
    //   this.currentRow = val
    //   this.taskForId = val.id
    // },
    // 任务转派
    taskForBtn(row) {
      this.taskForShow = true
      this.taskForId = row.uuid
      this.taskForRId = row.rId
      this.taskForName = ''
      this.taskForList = []
      this.taskForRemarks = ''
      this.taskForSearch()
    },
    taskForSearch() {
      const Paramsdata = {
        key: this.taskForName
      }
      getQuoteUserListByKey(qs.stringify(Paramsdata))
        .then(res => {
          this.taskForList = res.data
        })
        .catch(err => {
          console.warn(err)
        })
    },
    taskForListChange(val) {
      this.taskForListId = val.id
    },
    taskForEnter() {
      if (!this.taskForListId) {
        this.$message.warning('请勾选出单员后再进行任务转派!')
        return
      }
      if (this.$store.getters.userAll.data.id === this.taskForListId) {
        this.$message.warning('出单员不可将任务转派给本人!')
        return
      }
      const Paramsdata = {
        uuid: this.taskForId,
        rId: this.taskForRId,
        operatorId: this.taskForListId,
        mark: this.taskForRemarks
      }
      redeployQuoteUser(qs.stringify(Paramsdata))
        .then(res => {
          // console.log(res)
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.taskForShow = false
          this.searchbtn()
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 添加报价信息
    offerForBtn(row) {
      this.offerForShowTitle = '添加报价信息'
      this.offerForShow = true
      this.rowAddOfferList = row
    },
    // offerForConfirm() {
    //   // this.$refs.isofferFor.offerForm
    // },
    offerForclose() {
      this.offerForShow = false
      // this.$refs.isofferFor.resetForm()
    },
    // 上传证件照
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    // 录入保单
    addEditForBtn(row) {
      this.rowAddEditList = row
      // this.addEditForShow = true
      getCustomerSelectId(row.id)
        .then(res => {
          this.addEditForShow = true
          this.getAddEditFor = res.data
          // console.log(res.data)
        })
        .catch(err => {
          console.warn(err)
        })
    },
    addEditForclose() {
      this.addEditForShow = false
      this.$refs.isEditFor.resetForm()
    },
    // 抓单
    grabForBtn() {
      this.grabForShow = true
    },
    // 开始抓单
    grabForConfirm() {
      // console.log(this.$refs.dataForm)
      this.getPolicyVisible1 = true
      const policyData = this.$refs.dataForm['selectValue']
      console.log('抓单数据', policyData)
      this.$refs.dataForm.$refs.selectValue.validate(valid => {
        if (valid) {
          console.log('submit!')
          const params = {
            channelId: policyData.account.id, // 工号ID ,
            channelName: policyData.account.channelName, // 工号名称 ,
            companyId: policyData.company.companyId, // 保险公司Id
            companyName: policyData.company.companyName, // 保险公司名称 ,
            operatorId: policyData.operator.id, // 出单员ID ,
            operatorName: policyData.operator.idName, // 出单员名称
            sourceCode: policyData.channel.code, // 渠道编码 ,
            sourceName: policyData.channel.shortName, // 渠道名称 ,
            team: this.policyOrganName, // 机构名称 ,
            teamId: policyData.organ, // 机构Id ,
            userId: policyData.salesman.id, // 业务员ID ,
            userName: policyData.salesman.name // 业务员名称
          }
          if (this.channelType === 1) {
            if (policyData.area.length !== 0) {
              params.province = policyData.area[0]
              params.city = policyData.area[1]
            }
          }
          if (this.channelType === 2) {
            if (policyData.area.length !== 0) {
              params.province = policyData.area[0]
              params.city = policyData.area[1]
            }
            params.netWork = policyData.netWork
          }
          console.log('类型', this.childrenGrabTitle)
          if (this.childrenGrabTitle === '保单号') { // 保单号
            params.type = 1
            console.log(policyData.policyNo)
            params.arrs = policyData.policyNo.replace(/\n/g, ',').replace(/\s+/g, '').split(',')
            // params.arrs = policyData.policyNo.trim().split('\n')
            console.log(params.arrs)
          } else { // 车牌号
            params.type = 2
            params.arrs = policyData.license.replace(/\n/g, ',').replace(/\s+/g, '').split(',')
            // params.arrs = policyData.license.trim().split('\n')
          }
          console.log(params)
          this.handleSubmit(params)
          // this.$emit('handleSubmit', params)

          // this.$refs.dataForm.isLoading = true
          // if (this.childrenGrabTitle === '保单号') {
          //   const str = this.$refs.dataForm.sdzdForm.arrs
          //   const sdzdFormarrstips = {
          //     sourceCode: this.$store.getters.userAll.data.channelCode,
          //     type: '1',
          //     arrs: str.trim().split(/\s+/),
          //     userName: this.comuserNametext
          //   }
          //   putOneCapture({
          //     ...this.$refs.dataForm.sdzdForm,
          //     ...sdzdFormarrstips
          //   })
          //     .then(res => {
          //       this.grabForShow = false
          //       this.editShow = true
          //       this.putOneCaptureList = res.data
          //     })
          //     .catch(err => {
          //       this.$refs.dataForm.isLoading = false
          //       this.$message.error(err)
          //       console.warn(err)
          //     })
          // } else {
          //   const str = this.$refs.dataForm.sdzdForm.arrs
          //   const sdzdFormarrstips = {
          //     sourceCode: this.$store.getters.userAll.data.channelCode,
          //     type: '2',
          //     arrs: str.trim().split(/\s+/),
          //     userName: this.comuserNametext
          //   }
          //   putOneCapture({
          //     ...this.$refs.dataForm.sdzdForm,
          //     ...sdzdFormarrstips
          //   })
          //     .then(res => {
          //       this.grabForShow = false
          //       this.editShow = true
          //       console.log(res)
          //     })
          //     .catch(err => {
          //       this.$message.error(err)
          //       this.$refs.dataForm.isLoading = false
          //       console.warn(err)
          //     })
          // }
        } else {
          this.$message.error('抓单信息不完整！')
        }
      })
      // const lerdgerData = this.$refs.dataForm.sdzdForm
      // 获取下来列表信息
    },
    // 获取保单
    handleSubmit(data) {
      // this.isComplete = false
      this.getPolicyVisible1 = true
      this.isComplete = false
      getPolicySubmit(data)
        .then(res => {
          console.log(res)
          const id = res.data
          this.getPolicyResult(id)
        })
        .catch(err => {
          console.log(err)
          this.getPolicyVisible = false
          this.getPolicyVisible1 = false
        })
    },
    // 获取抓单返回的详情
    getPolicyResult(id) {
      getPolicyDetail(id)
        .then(res => {
          console.log(res)
          if (res.data.flag === 1) {
            console.log('清除定时器')
            clearTimeout(this.timer2) // 清除定时器
            this.getPolicyVisible1 = false
            this.getPolicyVisible2 = true
            this.isComplete = true
            if (res.data.description.indexOf('异常') > -1) {
              this.hasFalure = true
            } else {
              this.hasFalure = false
            }
            this.policyList.total = res.data.total
            this.policyList.repeatCount = 0
            this.policyList.finishCount = 0
            this.policyList.failCount = 0
            this.policyList.repeatArr = ''
            this.policyList.failArr = ''
            res.data.detail.forEach(item => {
              if (item.description.indexOf('重复') > -1) {
                this.policyList.repeatCount = item.num
                this.policyList.repeatArr = item.arrs.join()
              } else if (item.description.indexOf('成功') > -1) {
                this.policyList.finishCount = item.num
              } else {
                this.policyList.failCount = item.num
                this.policyList.failArr = item.arrs.join('、')
              }
            })
          } else {
            this.timer2 = setTimeout(() => {
              this.getPolicyResult(id)
            }, 7000)
          }
          console.log(res)
        })
        .catch(err => {
          console.log(err)
          this.isComplete = true
          this.getPolicyVisible = false
        })
    },
    grabForclose() {
      this.grabForShow = false
      this.$refs.dataForm.isLoading = false
    },
    // 查看详情
    async seeDetails(row) {
      this.priceId = row.uuid
      this.isApplyIssue = row.taskState === 2
      const resL = await getAllOfferRecords({
        uuid: row.uuid,
        icarPoliyId: row.taskState === 2 ? row.icarPoliyId : '',
        operatorType: row.taskState === 2 ? 1 : 0
      })
      this.priceList = resL.data
      if (this.priceList && this.priceList.length > 0) {
        this.priceShow = true
        this.priceLoading = true
        // 默认展示第一个报价数据
        const resD = await getQuoteInfo({
          orderId: this.priceList[0].icar_poliy_id
        })
        this.priceOption = resD.data
        this.priceLoading = false
      } else {
        this.$message.warning('暂无报价记录')
        return
      }
    },
    // 查看详情弹窗关闭
    priceClose() {
      this.priceShow = false
    },
    // 任务通知 报价详情弹窗关闭
    seeEditClose() {
      this.taskNotificationShow = false
    },
    setPriceOption(val) {
      this.priceOption = val
    }
  }
}
</script>
<style lang="scss">
.dialogAll {
  .el-dialog {
    border-radius: 4px 4px 0 0;
    overflow: hidden;
    margin: 0vh auto 15vh auto;
    .el-dialog__body {
      padding: 25px 25px 20px;
    }

    .el-radio {
      height: auto;
      background: #f5f7fa;
    }

    .upload-demo {
      padding-top: 10px;

      ul.el-upload-list {
        overflow: hidden;

        li {
          width: 240px;
          float: left;
          margin-right: 10px;
        }
      }
    }
  }
}
.el-popover {
  min-width: 0 !important;
}
</style>
<style lang="scss" scoped>
  .app-container {
    .sub-header {
      border-bottom: 1px solid #eee;
      line-height: 30px;
      color: #333;
      margin-bottom: 20px;
      padding-bottom: 10px;
      font-size: 16px;
      font-weight: 800;
      .sub-title {
        display: inline-block;
      }
      .badge-item {
        float: right;
        font-size: 20px;
        margin-right: 20px;
        cursor: pointer;
      }
    }
    .poster-box {
      .posterdaymenu {
        overflow: hidden;
        .posterdaymenubox {
          float: left;
          button {
            padding: 10px 20px;
            margin: 5px 10px;
            font-size: 14px;
          }
          svg {
            font-size: 18px;
          }
          .menuboxact {
            background: #f5f7fa;
            border: #d5d5d5;
          }
        }
      }
      .posterdaymain {
        overflow: hidden;
        padding: 20px 0 10px 0;
        display: inline-block;
        div {
          margin: 0 10px 10px 0;
          float: left;
          text-align: center;
          padding: 5px 10px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          min-width: 240px;
          border-radius: 4px;
          box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.1);
          transition: all 0.5s;
          cursor: pointer;

          h3 {
            font-size: 16px;
            color: rgba(255, 255, 255, 1);
            line-height: 1em;
            margin-block-start: 0.75em;
            margin-block-end: 0.75em;
          }

          p {
            color: rgba(255, 255, 255, 0.9);
            margin-block-start: 0.5em;
            margin-block-end: 0.5em;
          }
        }

        .posterdaymainbox:nth-child(5n + 1) {
          background: rgba(64, 158, 255, 1);
        }
        .menuboxnumzero {
          background: rgba(64, 158, 255, 0.3);
          h3 {
            color: rgba(64, 158, 255, 1);
          }
          p {
            color: rgba(64, 158, 255, 1);
          }
        }
        .posterdaymainbox:nth-child(5n + 2) {
          background: rgba(103, 194, 58, 1);
        }
        .menuboxnumone {
          background: rgba(103, 194, 58, 0.3);
          h3 {
            color: rgba(103, 194, 58, 1);
          }
          p {
            color: rgba(103, 194, 58, 1);
          }
        }
        .posterdaymainbox:nth-child(5n + 3) {
          background: rgba(230, 162, 60, 1);
        }
        .menuboxnumtwo {
          background: rgba(230, 162, 60, 0.3);
          h3 {
            color: rgba(230, 162, 60, 1);
          }
          p {
            color: rgba(230, 162, 60, 1);
          }
        }
        .posterdaymainbox:nth-child(5n + 4) {
          background: rgba(245, 108, 108, 1);
        }
        .menuboxnumthree {
          background: rgba(245, 108, 108, 0.3);
          h3 {
            color: rgba(245, 108, 108, 1);
          }
          p {
            color: rgba(245, 108, 108, 1);
          }
        }
        .posterdaymainbox:nth-child(5n + 5) {
          background: rgba(255, 124, 60, 1);
        }
        .menuboxnumfour {
          background: rgba(255, 124, 60, 0.3);
          h3 {
            color: rgba(255, 124, 60, 1);
          }
          p {
            color: rgba(255, 124, 60, 1);
          }
        }

        .posterdaymainbox:hover {
          border-radius: 8px;
          box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.3);
        }
      }
    }
    .searchMian {
      padding: 20px 0px 10px 0px;
      h2 {
        font-size: 16px;
        color: #666;
        margin-block-start: 0.5em;
        margin-block-end: 0.5em;
      }

      .searchMianList {
        overflow: hidden;

        .searchMianBox {
          width: 200px;
          float: left;
          padding-top: 10px;
          padding-right: 10px;
        }

        .searchMianBoxzkbtn {
          float: left;
          padding-left: 20px;

          button {
            font-size: 12px;
            font-weight: bold;
            height: 32px;
            box-sizing: border-box;
            margin-top: 4px;
          }
        }

        .searchMianBoxbtn {
          padding-top: 10px;
          float: left;
          text-align: center;
        }
      }
    }
    .tabMian {
      padding: 20px;
      background: #fff;
      margin-top: 10px;

      .tabMianTitle {
        overflow: hidden;

        h2 {
          float: left;
          font-size: 16px;
          color: #666;
          margin-block-start: 0.5em;
          margin-block-end: 0.5em;
        }

        .tabMianMenu {
          float: right;
          padding-bottom: 6px;
        }
      }
    }
    .tabMianall {
      table {
        width: 100%;
      }
      .pageAll {
        text-align: right;
        margin-top: 20px;
      }
    }
    .dialogMain {
      .dialogMainSearch {
        display: flex;
        align-items: center;
        span {
          display: block;
          height: 40px;
          line-height: 40px;
          padding-right: 10px;
        }
      }
      .dialogMainCompany {
        padding-top: 10px;
        overflow: hidden;
        span {
          padding: 0 10px 10px 0;
          display: block;
          float: left;
        }
        strong {
        }

        p {
          padding-left: 24px;
          margin-block-start: 0.5em;
          margin-block-end: 0em;
          font-size: 12px;
          opacity: 0.8;
        }
      }
      .dialogMainList {
        padding: 10px 0 0 0;
        display: flex;

        .dialogMainListBox {
          padding-right: 10px;

          span {
            display: inline-block;
            font-weight: bold;
          }
        }
      }
      .dialogMainTops {
        padding-top: 10px;
        strong {
          display: block;
          padding-bottom: 10px;
        }
      }
    }
    .listitem-btn {
      padding: 10px;
      text-align: center;
    }
    .dialogtable03 {
      width: 100%;
      .el-icon-circle-check {
        font-size: 18px;
      }
      .el-icon-circle-check-outline {
        font-size: 14px;
      }
    }
    .right-bdr {
      position: relative;
    }
    .right-bdr::before {
      content: '';
      position: absolute;
      right: -10px;
      top: 50%;
      margin-top: -6px;
      width: 1px;
      height: 12px;
      background-color: #c0c4cc;
      z-index: 1;
    }
    .Notification {
      overflow-y: auto;
      // height: 100%;
      height: calc(100% - 45px);
      .msg-wrapper {
        padding: 10px 24px 0;
        margin: 0;
        box-sizing: border-box;
        .msg-item {
          list-style: none;
          border-bottom: 1px solid #e8e8e8;
          .item-box {
            background: #fff;
            padding: 15px 10px;
            box-sizing: border-box;
            width: 300px;
            display: flex;
            align-items: flex-start;
            position: relative;
            .msg-icon {
              flex: 0 0 22px;
              width: 22px;
              margin-right: 10px;
              font-size: 22px;
            }
            .msg-content {
              flex: 1;
              .mag-title-box {
                .msg-title {
                  display: inline-block;
                  margin: 0.25em 0;
                  font-size: 16px;
                  color: #333;
                }
                .msg-del-btn {
                  float: right;
                  padding: 0;
                  font-size: 20px;
                  color: #aaa;
                }
              }
              .msg-desc {
                margin: 0.5em 0;
                font-size: 14px;
                line-height: 1.4em;
                color: #555;
              }
              .dialog-footer {
                .msg-desc-btn {
                  float: right;
                }
              }
            }
          }
        }
      }
      .msg-handle {
        overflow: hidden;
        position: fixed;
        bottom: 0;
        right: 0;
        width: 370px;
        padding: 13px 0;
        box-sizing: border-box;
        border-top: 1px solid #e8e8e8;
        background-color: #fff;
        .msg-pagination {
          margin-bottom: 13px;
          text-align: right;
        }
        .msg-clear-all {
          .msg-clear-btn {
            float: right;
            margin-right: 15px;
          }
        }
      }
    }
    .no-msg {
      font-size: 18px;
      color: #494949;
      margin: 24px;
    }
  }
</style>
<style lang="less">
    .getpolicy{
      .el-dialog__header {
        border-bottom: 1px solid #cccccc !important;
      }
      .el-dialog__footer {
        padding:30px 20px 20px !important;
      // border-top: 1px solid #cccccc;
    }
    // 抓单进行中窗口
    .dialog {
      text-align: center;
      width: 100%;
      height: 150px;
      line-height: 150px;
      font-size: 20px;
      span {
        display: inline-block;
        height: 32px;
        line-height: 32px;
        vertical-align: middle;
      }
      .txt {
        margin-left: 10px;
      }
    }
  }
    .dialog_result {
      text-align: center;
      width: 100%;
      font-size: 20px;
      margin-bottom: 30px;
      span {
        display: inline-block;
        height: 32px;
        line-height: 32px;
        vertical-align: middle;
      }
      .txt {
        margin-left: 10px;
      }
    }
    .failReasons {
      background-color: #f2f2f2;
      width: 400px;
      margin: 0 auto;
      text-align: left;
      margin-top: 20px;
      padding: 5px 5px;
      p {
        padding: 0px 8px;
        line-height:20px;
      }
}
  .el-tree-select-dropdown .el-tree>.el-tree-node{
    max-height: 500px;
    overflow: auto;
  }
</style>

