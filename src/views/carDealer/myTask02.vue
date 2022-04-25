<template>
  <div class="app-container">
    <div class="app-panel">
      <div class="sub-header">
        <div class="sub-title">我的任务（续保专员）</div>
        <el-badge :value="taskMessageNum" :max="99" :hidden="!taskMessageNum" class="badge-item" @click.native="taskMessageOpen">
          <svg-icon icon-class="task_messenger" style="width: 20px;height: 20px;" />
        </el-badge>
      </div>
      <div class="poster-box">
        <div class="posterdaymenu">
          <div v-for="(menu,index) in menuday" :key="index.menu" class="posterdaymenubox">
            <el-button :type="menuboxact===index?'primary':'text'" icon="el-icon-document" size="small" @click="menuHandleClick(index)">{{ menu.name }}</el-button>
          </div>
          <!-- <div class="posterdaymenubox">
            <span>
              <el-date-picker v-model="dateArr" :clearable="false" :picker-options="pickerOptionsOLD" type="daterange" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" size="small" @change="dateArrChange" />
            </span>
            <el-button type="primary" icon="el-icon-search" size="small" @click="menuHandleSearch">查询</el-button>
            <el-button icon="el-icon-delete" size="small" @click="resetMenu">清空</el-button>
          </div> -->
        </div>
        <div v-loading="menuLoading" class="posterdaymain">
          <div :class="menuboxnum === 0 ? 'menuboxnumzero' : 'posterdaymainbox'" @click="handleMenu(0)">
            <h3>续保期内进店</h3>
            <p>{{ posterdaymain.arrival }}</p>
          </div>
          <div :class="menuboxnum === 1 ? 'menuboxnumone' : 'posterdaymainbox'" @click="handleMenu(1)">
            <h3>计划跟进</h3>
            <p>{{ posterdaymain.goOn }}</p>
          </div>
          <!-- <div :class="menuboxnum === 2 ? 'menuboxnumtwo' : 'posterdaymainbox'" @click="handleMenu(2)">
            <h3>30天内到期</h3>
            <p>{{ posterdaymain.inner30 }}</p>
          </div> -->
          <div :class="menuboxnum === 3 ? 'menuboxnumtwo' : 'posterdaymainbox'" @click="handleMenu(3)">
            <h3>战败</h3>
            <p>{{ posterdaymain.fail }}</p>
          </div>
          <div :class="menuboxnum === 4 ? 'menuboxnumthree' : 'posterdaymainbox'" @click="handleMenu(4)">
            <h3>成交出单</h3>
            <p>{{ posterdaymain.success }}</p>
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
            <el-input v-model="searchForm.ownerName" placeholder="车主姓名" size="small" />
          </div>
          <div class="searchMianBox">
            <el-select v-model="searchForm.dateType" clearable filterable size="small" placeholder="请选择距离脱保天数">
              <el-option v-for="item in searchDateTypeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <div class="searchMianBox">
            <el-select v-model="searchForm.type" clearable filterable size="small" placeholder="请选择客户类型">
              <el-option v-for="item in searchTypeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <div class="searchMianBox">
            <el-select v-model="searchForm.taskState" clearable filterable size="small" placeholder="请选择任务状态">
              <el-option v-for="item in searchTaskStateList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <div class="searchMianBox">
            <el-select v-model="searchForm.state" clearable filterable size="small" placeholder="请选择跟进状态">
              <el-option v-for="item in searchStateList" :key="item.value" :label="item.label" :value="item.value" />
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
          <!-- 有出单出单员的时候有申请报价 -->
          <el-button type="success" icon="el-icon-circle-plus-outline" size="small" @click="newEditBtn">新增</el-button>
          <el-button v-if="operatorIdShow" type="primary" icon="el-icon-document" size="small" @click="offerForBtn">申请报价</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="refreshPage">刷新</el-button>
        </div>
      </div>
      <div class="tabMianall">
        <el-table v-loading="tabMianLoading" ref="multipleTable" :data="TaskList" :header-cell-style="{background:'#fff'}" border tooltip-effect="dark">
          <el-table-column v-if="operatorIdShow" label="选择" width="50" fixed="left">
            <template slot-scope="scope">
              <el-radio :label="scope.row.uuid" v-model="taskListRadio" @click.native.prevent="TaskListChange(scope.row)">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="licenseNo" width="100" label="车牌号" show-overflow-tooltip fixed="left" />
          <el-table-column prop="frameNo" width="160" label="车架号" show-overflow-tooltip fixed="left" />
          <el-table-column prop="ownerName" width="80" label="车主姓名" show-overflow-tooltip />
          <el-table-column prop="ownerPhone" width="120" label="联系电话" show-overflow-tooltip />
          <el-table-column prop="comEndDate" label="商业险到期日期" min-width="110" show-overflow-tooltip />
          <el-table-column prop="forceEndDate" label="交强险到期日期" min-width="110" show-overflow-tooltip />
          <el-table-column label="距离脱保天数" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ formatEndDayNum(scope.row) }}&nbsp;
              <el-popover v-if="(scope.row.allocationEndDate !== scope.row.comEndDate) && (scope.row.allocationEndDate !== scope.row.forceEndDate) && (scope.row.endDate >= 0 && scope.row.endDate <= renewalDay)" placement="right" trigger="hover">
                <svg-icon slot="reference" icon-class="gantan" />
                <span style="line-height: 20px;">已自动修复至保险到期日{{ scope.row.allocationEndDate }}</span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="allocationTime" label="分配日期" width="160" show-overflow-tooltip />
          <el-table-column label="报价状态" width="80" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-show="scope.row.quoteFlagShow">
                <el-button v-if="scope.row.quoteFlag===0" type="text" size="mini" @click="handleBJ(scope.row)">未报价</el-button>
                <el-button v-else-if="scope.row.quoteFlag===1" type="text" size="mini" @click="seeDetails(scope.row)">报价成功</el-button>
                <el-button v-else-if="scope.row.quoteFlag===2" type="text" size="mini" @click="handleBJ(scope.row)">报价失败</el-button>
              </div>
              <div v-show="!scope.row.quoteFlagShow">
                <el-button type="text" size="mini">报价中</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="任务状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.taskState===0">未分配</span>
              <span v-if="scope.row.taskState===1">未跟进</span>
              <span v-if="scope.row.taskState===2">跟进中</span>
              <span v-if="scope.row.taskState===3">即将到期</span>
              <span v-if="scope.row.taskState===4">申请报价</span>
              <span v-if="scope.row.taskState===5">申请出单</span>
              <span v-if="scope.row.taskState===6">转派</span>
              <span v-if="scope.row.taskState===7">成交出单</span>
              <span v-if="scope.row.taskState===8">战败</span>
              <span v-if="scope.row.taskState===9">已报价</span>
            </template>
          </el-table-column>
          <el-table-column label="客户标签" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.type===0">新转续</span>
              <span v-else-if="scope.row.type===1">续转续</span>
              <span v-else-if="scope.row.type===2">间转续</span>
              <span v-else-if="scope.row.type===3">潜转续</span>
            </template>
          </el-table-column>
          <el-table-column prop="lastCompany" label="往年投保" show-overflow-tooltip />
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
          <el-table-column label="操作" width="80" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <!--不在续保期内的只有查看详情-->
              <el-popover v-if="scope.row.endDate" placement="left" trigger="hover">
                <div style="text-align: right; margin: 0">
                  <!--续保专员，成交，战败 ，只能查看-->
                  <template v-if="scope.row.taskState!==7 && scope.row.taskState!==8">
                    <el-button v-if="scope.row.quoteFlag===1" :disabled="scope.row.automaticBan" type="text" size="small" icon="el-icon-refresh" class="right-bdr" @click="refreshBtn(scope.$index, scope.row)">刷新报价</el-button>
                    <el-button v-else :disabled="scope.row.automaticBan" type="text" size="small" icon="el-icon-time" class="right-bdr" @click="automaticBtn(scope.$index, scope.row)">自动报价</el-button>
                    <el-button type="text" size="small" class="right-bdr" @click="taskForBtn(scope.row)">任务转派</el-button>
                    <!--有出单员的时候 是申请出单 没有就是快投保, hasInsurance 是否已经投保 0未申请出单 1已经申请投-->
                    <template v-if="operatorIdShow">
                      <el-button v-if="scope.row.hasInsurance === 0" class="right-bdr" type="text" size="small" @click="applyingForBtn(scope.row)">申请出单</el-button>
                      <el-button v-else class="right-bdr" type="text" size="small" style="color:#aaa;">申请出单</el-button>
                    </template>
                    <el-button v-else type="text" class="right-bdr" size="small" @click="handleToQuickissue(scope.row)">快速投保</el-button>
                  </template>
                  <el-button type="text" size="small" @click="checkData(scope.row)">查看详情</el-button>
                </div>
                <el-button slot="reference" type="text" size="small">更多操作</el-button>
              </el-popover>
              <el-button v-else type="text" size="small" @click="checkData(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="count > 0" class="pageAll">
          <el-pagination :current-page="page" :page-sizes="[10, 20, 30, 40, 50]" :page-size="size" :total="count" layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChange" @current-change="currentChange" />
        </div>
      </div>
    </div>
    <el-dialog v-if="tabListMarkShow" :visible.sync="tabListMarkShow" title="备注详情" width="40%" class="dialogAll">
      <div class="tabListMarkText">{{ tabListMark }}</div>
    </el-dialog>
    <!--查看报价详情-->
    <el-dialog v-if="priceShow" :visible.sync="priceShow" title="报价详情" width="60%" class="dialogAll">
      <customer-price v-if="priceShow" :price-list="priceList" :price-option="priceOption" :price-id="priceId" :is-loading="priceLoading" @priceClose="priceClose" @priceOption="setPriceOption" />
    </el-dialog>
    <!--高级搜索-->
    <app-drawer :is-show="isSearchShow" :mask-closable="false" drawer-title="高级搜索" drawer-style="width: 720px;" no-button @drawerClose="searchClose">
      <more-search v-if="isSearchShow" ref="moreSearchForm" :search-form="searchForm" route-path="myTask02" @reset="searchReset" @screen="searchConfirm" @cancel="searchCancel" />
    </app-drawer>
    <!-- 申请出单弹窗 -->
    <el-dialog v-if="applyingForShow" :visible.sync="applyingForShow" title="申请出单" width="60%" class="dialogAll">
      <div class="dialogMain">
        <div class="dialogMainSearch">
          <span>出单员</span>
          <span>
            <el-input v-model="applyingForName" placeholder="请输入出单员" size="small" />
          </span>
          <span>
            <el-button type="primary" icon="el-icon-search" size="small" @click="applyingForSearch">查询</el-button>
          </span>
        </div>
        <el-table ref="multipleTable" :data="applyingTableList" highlight-current-row tooltip-effect="dark" class="dialogtable03" @current-change="applyingTableListChange">
          <el-table-column width="40">
            <template slot-scope="scope">
              <i :style="scope.row.id===applyingTableListId ?'color:#67c23a':'color:#aaa'" :class="scope.row.id===applyingTableListId ? 'el-icon-circle-check':'el-icon-circle-check-outline'" />
            </template>
          </el-table-column>
          <el-table-column prop="nickName" label="出单员" show-overflow-tooltip />
          <el-table-column prop="phone" label="手机号" show-overflow-tooltip />
        </el-table>
        <div v-loading="applyingForLoading" class="dialogMainCompany">
          <el-radio v-for="item in applyingCompanyList" :key="item.icar_poliy_id" v-model="companyNum" :label="item.icar_poliy_id" border @change="applyingCompanyChange">
            <strong>保险公司：{{ item.companyName }} 价格：{{ item.totalPremium }}</strong>
            <p>报价时间:{{ item.quoteTime }}</p>
          </el-radio>
        </div>
        <div class="dialogMainTops">
          <strong>备注</strong>
          <div>
            <el-input v-model="applyingForRemarks" placeholder="请输入备注" />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="applyingForShow = false">取 消</el-button>
        <el-button size="small" type="primary" @click="applyingForEnter">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 任务转派弹窗 -->
    <el-dialog v-if="taskForShow" :visible.sync="taskForShow" title="任务转派" width="60%" class="dialogAll">
      <div class="dialogMain">
        <div class="dialogMainSearch">
          <span>续保专员</span>
          <span>
            <el-input v-model="taskForName" placeholder="请输入续保专员名字" size="small" />
          </span>
          <span>
            <el-button type="primary" icon="el-icon-search" size="small" @click="taskForSearch">查询</el-button>
          </span>
        </div>
        <el-table ref="multipleTable" :data="taskForList" highlight-current-row tooltip-effect="dark" class="dialogtable03" @current-change="taskForListChange">
          <el-table-column width="40">
            <template slot-scope="scope">
              <i :style="scope.row.id===taskForListVal.id ?'color:#67c23a':'color:#aaa'" :class="scope.row.id===taskForListVal.id ? 'el-icon-circle-check':'el-icon-circle-check-outline'" />
            </template>
          </el-table-column>
          <el-table-column prop="nickName" label="续保专员" show-overflow-tooltip />
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
    <!-- 申请报价弹窗 -->
    <el-dialog v-if="offerForShow" :visible.sync="offerForShow" title="申请报价" width="60%" class="dialogAll">
      <div class="dialogMain">
        <div class="dialogMainSearch">
          <span>出单员</span>
          <span>
            <el-input v-model="offerForName" placeholder="请输入出单员" size="small" />
          </span>
          <span>
            <el-button type="primary" icon="el-icon-search" size="small" @click="offerForSearch">查询</el-button>
          </span>
        </div>
        <el-table ref="multipleTable" :data="offerTableList" highlight-current-row tooltip-effect="dark" class="dialogtable03" @current-change="offerTableListChange">
          <el-table-column width="40">
            <template slot-scope="scope">
              <i :style="scope.row.id===offerTableListId ?'color:#67c23a':'color:#aaa'" :class="scope.row.id===offerTableListId ? 'el-icon-circle-check':'el-icon-circle-check-outline'" />
            </template>
          </el-table-column>
          <el-table-column prop="nickName" label="出单员" show-overflow-tooltip />
          <el-table-column prop="phone" label="手机号" show-overflow-tooltip />
        </el-table>
        <div class="dialogMainList">
          <div class="dialogMainListBox">
            <span>车牌：</span>
            <span>
              <el-input v-model="offerForLicenseNo" :disabled="!!taskListRow.licenseNo" placeholder="请输入车牌" size="small" @change="offerForCarNo" />
            </span>
          </div>
          <div class="dialogMainListBox">
            <span>车架号：</span>
            <span>
              <el-input v-model="offerForVinNo" :disabled="!!taskListRow.frameNo" placeholder="请输入车架号" size="small" @change="offerForFrameNo" />
            </span>
          </div>
          <div class="dialogMainListBox">
            <span>保险公司：</span>
            <span>
              <el-select :loading="selectLoading" v-model="offerForCompany" filterable placeholder="请选择保险公司" size="small" @change="offerForCompanyChoice">
                <el-option v-for="item in companylist" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </span>
          </div>
          <div class="dialogMainListBox">
            <span>车主姓名：</span>
            <span>
              <el-input v-model="offerForCarName" :disabled="!!taskListRow.ownerName" placeholder="请输入车主姓名" size="small" />
            </span>
          </div>
          <div class="dialogMainListBox">
            <span>车主手机号码：</span>
            <span>
              <el-input v-model="offerForPhone" placeholder="请输入车主手机号码" size="small" />
            </span>
          </div>
        </div>
        <div class="card-box">
          <span class="cardbox-tit">上传证件照：</span>
          <div class="cardboxup-img">
            <el-upload v-loading="imageIdFaceLoading" :show-file-list="false" :on-success="uploadIdFaceChange" :before-upload="beforeAvatarUpload" :on-progress="imageIdFaceLoadingAct" :action="idUrl" class="avatar-uploader">
              <img v-if="imageIdFaceUrl" :src="imageIdFaceUrl" class="avatar">
              <svg-icon v-else icon-class="idface" class="avatar-uploader-icon" />
              <div slot="tip" style="text-align:center; padding-top:4px;">
                <el-button v-if="imageIdFaceUrl" size="mini" round style="font-size:12px; margin-bottom:4px;" @click="delIdFaceUplaod">删除照片</el-button>
                <div>身份证正面</div>
              </div>
            </el-upload>
            <el-upload v-loading="imageIdBackLoading" :show-file-list="false" :on-success="uploadIdBackChange" :before-upload="beforeAvatarUpload" :on-progress="imageIdBackLoadingAct" :action="idUrl" class="avatar-uploader">
              <img v-if="imageIdBackUrl" :src="imageIdBackUrl" class="avatar">
              <svg-icon v-else icon-class="idback" class="avatar-uploader-icon" />
              <div slot="tip" style="text-align:center; padding-top:4px;">
                <el-button v-if="imageIdBackUrl" size="mini" round style="font-size:12px; margin-bottom:4px;" @click="delIdBackUplaod">删除照片</el-button>
                <div>身份证反面</div>
              </div>
            </el-upload>
            <el-upload v-loading="imageLicenseFaceLoading" :show-file-list="false" :on-success="uploadLicenseFaceChange" :before-upload="beforeAvatarUpload" :on-progress="imageLicenseFaceLoadingAct" :action="licenseUrl" class="avatar-uploader">
              <img v-if="imageLicenseFaceUrl" :src="imageLicenseFaceUrl" class="avatar">
              <svg-icon v-else icon-class="licenseface" class="avatar-uploader-icon" />
              <div slot="tip" style="text-align:center; padding-top:4px;">
                <el-button v-if="imageLicenseFaceUrl" size="mini" round style="font-size:12px; margin-bottom:4px;" @click="delLicenseFaceUplaod">删除照片</el-button>
                <div>行驶证正面</div>
              </div>
            </el-upload>
            <el-upload v-loading="imageLicenseBackLoading" :auto-upload="false" :show-file-list="false" :on-change="uploadLicenseBackChange" :before-upload="beforeAvatarUpload" :action="licenseUrl" class="avatar-uploader">
              <img v-if="imageLicenseBackUrl" :src="imageLicenseBackUrl" class="avatar">
              <svg-icon v-else icon-class="licenseback" class="avatar-uploader-icon" />
              <div slot="tip" style="text-align:center; padding-top:4px;">
                <el-button v-if="imageLicenseBackUrl" size="mini" round style="font-size:12px; margin-bottom:4px;" @click="delLicenseBackUplaod">删除照片</el-button>
                <div>行驶证反面</div>
              </div>
            </el-upload>
          </div>
        </div>
        <div class="dialogMainTops">
          <strong>备注</strong>
          <div>
            <el-input v-model="offerForRemarks" placeholder="请输入备注" />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="offerForShow = false">取 消</el-button>
        <el-button size="small" type="primary" @click="offerForImgesEnter">确定</el-button>
      </span>
    </el-dialog>
    <!--新增任务-->
    <app-drawer :is-show="isEditShow" :mask-closable="false" drawer-title="新增信息" drawer-style="width: 500px;" @drawerConfirm="addConfirm" @drawerClose="close">
      <customer-edit ref="customerEdit" :edit-form="editForm" :control-data="controlData" :loading="editLoading" :back-img="backImg" @sendBackImg="sendBackImg" />
    </app-drawer>
    <!--自动报价失败弹窗-->
    <el-dialog :visible.sync="errDialogVisible" title="报价失败" width="30%">
      <div style="font-size: 14px;word-break: break-all;">原因：{{ automaticErrorReason }}</div>
      <div style="padding:10px 0 30px;">您可以完善信息重新报价或手动报价!</div>
      <div class="dialog-footer">
        <el-button size="small" @click="errDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleErrBJ">去手动报价</el-button>
      </div>
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
import moreSearch from '@/views/carDealer/components/moreSearch'
import appDrawer from '@/components/Drawer/drawer'
import seeEdit from '@/views/carDealer/components/seeEdit'
import customerEdit from '@/views/carDealer/customerEdit'
import customerPrice from '@/views/carDealer/customerPrice'
import { getToken, getTokenType } from '@/utils/auth'
import {
  getPlateInfo,
  getTaskList,
  getTaskDispatch,
  getUsersOnCondition,
  getUnreadMsgsSumByUId,
  getMsgsPageByUId,
  readMsgByIds,
  deleteMsgByIds,
  deleteAllMsgByUId,
  getInsuredCompany,
  getQuoteInfo,
  putApplyInsurance,
  getAllOfferRecords,
  newCarApplyOffer,
  refreshQuotation,
  autoQuotation
} from '@/api/mytask'
import { setCustomerEditImgs, getControlCarType } from '@/api/customer'
import { getRenewalStantandDay } from '@/api/renewal'
import { isNull } from '@/utils/policydata'
import dayjs from 'dayjs'
// import qs from 'qs'
export default {
  name: 'Mytask02',
  components: {
    appDrawer,
    moreSearch,
    seeEdit,
    customerEdit,
    customerPrice
  },
  data() {
    return {
      backImg: null,
      isLoading: false,
      menuLoading: false,
      operatorIdShow: false, // 这个是是否显示快速投保 申请报价
      NotificationShow: false, // 通知弹窗
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
      menuboxact: null,
      dateArr: [dayjs(), dayjs()],
      pickerOptionsOLD: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      menuboxnum: null,
      posterdaymain: '',
      searchForm: {
        plateDateType: null, // 看台日期类型 按次序0-4
        searchType: null,
        from: null,
        to: null,
        licenseNo: '', // 车牌
        ownerName: null, // 车主姓名
        dateType: null, // 距离脱保天数
        taskState: null, // 任务状态
        state: null, // 跟进状态
        type: null, // 客户类型
        frameNo: null, // 车架号
        ownerPhone: null, // 联系电话
        holderName: null, // 投保人
        allocationTime: null, // 分配时间 （allocationTimeBegin/allocationTimeEnd 起止期）
        allocationTimeBegin: null, // 分配开始时间
        allocationTimeEnd: null, // 分配结束时间
        renewalState: null, // 续保状态
        comEndDate: null, // 商业险止期 （comEndDateBegin/comEndDateEnd 起止期）
        comEndDateBegin: null, // 商业险开始时间
        comEndDateEnd: null, // 商业险结束时间
        forceEndDate: null, // 交强险止期 （forceEndDateBegin/forceEndDateEnd 起止期）
        forceEndDateBegin: null, // 交强险开始时间
        forceEndDateEnd: null, // 交强险结束时间
        planReturnTime: null, // 计划回访时间
        returnTime: null, // 录入回访时间
        quoteFlag: null, // 报价状态
        brandName: null, // 品牌型号
        inputType: null, // 录入方式
        enrollDate: null, // 注册日期（enrollDateBegin/enrollDateEnd 起止期）
        enrollDateBegin: null, // 注册开始时间
        enrollDateEnd: null, // 注册结束时间
        lastCompanyId: null, // 去年投保公司
        phoneType: null // 客户电话
      },
      serchform: {
        name: '张三'
      },
      // 距离脱保天数 列表
      searchDateTypeList: [
        {
          label: '90天内到期',
          value: 0
        },
        {
          label: '60天内到期',
          value: 1
        },
        {
          label: '30天内到期',
          value: 2
        },
        {
          label: '15天内到期',
          value: 3
        },
        {
          label: '7天内到期',
          value: 4
        }
      ],
      // 客户类型 列表
      searchTypeList: [
        {
          label: '新转续',
          value: 0
        },
        {
          label: '续转续',
          value: 1
        },
        {
          label: '间转续',
          value: 2
        },
        {
          label: '潜转续',
          value: 3
        }
      ],
      // 任务状态 列表
      searchTaskStateList: [
        // { label: '未分配', value: 0 },
        { label: '未跟进', value: 1 },
        { label: '跟进中', value: 2 },
        // { label: '即将到期', value: 3 },
        { label: '申请报价', value: 4 },
        { label: '已报价', value: 9 },
        { label: '申请出单', value: 5 },
        { label: '转派', value: 6 },
        { label: '成交出单', value: 7 },
        { label: '战败', value: 8 }
      ],
      // 跟进状态 列表
      searchStateList: [
        {
          label: '忙碌中待联系',
          value: 0
        },
        {
          label: '考虑中(普通)',
          value: 1
        },
        {
          label: '考虑中(重点)',
          value: 2
        },
        {
          label: '其他',
          value: 3
        },
        {
          label: '预约到店',
          value: 4
        },
        // {
        //   label: '成功出单',
        //   value: 6
        // },
        {
          label: '无效数据(停机/空号)',
          value: 5
        }
      ],
      TaskList: [],
      taskListRadio: '',
      taskListRow: '',
      tabMianLoading: false,
      // 备注信息
      tabListMarkShow: false,
      tabListMark: '',
      page: 1,
      size: 10,
      count: null,
      // 滚动弹出消息
      MessageList: [],
      // 任务转派弹窗
      taskForShow: false,
      taskForName: '',
      taskForList: [],
      taskForRow: '',
      taskForListVal: '',
      taskForRemarks: '',
      // 申请出单弹窗
      applyingForShow: false,
      companyNum: '0',
      applyingForName: '',
      applyingTableList: [],
      applyingCompanyList: [],
      applyingForId: '',
      applyingTableListId: '',
      applyingForRemarks: '',
      applyingForlicenseNo: '',
      applyingCompanyId: '',
      applyingIcarPoliyId: '',
      applyingLastCompanyId: null,
      applyingForLoading: false,
      // 自动报价失败弹窗
      automaticRow: '',
      errDialogVisible: false,
      automaticErrorReason: '', // 自动报价失败原因
      // 申请报价弹窗
      tableListSelection: [],
      offerForShow: false,
      offerForName: '',
      offerTableList: [],
      offerForId: '', // 续保专员列表id
      offerForUuid: '', // 续保专员列表 uuid
      offerForLicenseNo: '', // 申请报价车牌号
      offerForVinNo: '', // 申请报价车架号
      offerForCompany: null, // 申请报价保险公司
      offerForCompanyId: null, // 申请报价保险公司id
      offerForPhone: '', // 申请报价手机号
      offerForCarName: '', // 车主姓名
      offerTableListId: '', // 申请报价列表选择
      offerForRemarks: '', // 申请报价备注
      offerForDisabled: false,
      // 上传文件
      token: `${getTokenType()} ${getToken()}`,
      idUrl: `${
        process.env.SERVER_URL
      }/upload?uploadHandle=http://120.27.21.67${
        process.env.API_ENV
      }/icar/ocr/identityCard`, // 身份证识别接口
      licenseUrl: `${
        process.env.SERVER_URL
      }/upload?uploadHandle=http://120.27.21.67${
        process.env.API_ENV
      }/icar/ocr/drivingLicense`, // 行驶证识别接口
      imageIdFaceUrl: '',
      imageIdFaceFile: '',
      imageIdFaceInfo: '',
      imageIdFaceLoading: false,
      imageIdBackUrl: '',
      imageIdBackFile: '',
      imageIdBackInfo: '',
      imageIdBackLoading: false,
      imageLicenseFaceUrl: '',
      imageLicenseFaceFile: '',
      imageLicenseFaceInfo: '',
      imageLicenseFaceLoading: false,
      imageLicenseBackUrl: '',
      imageLicenseBackFile: '',
      imageLicenseBackInfo: '',
      imageLicenseBackLoading: false,
      imageUploadArr: [],
      fileData: null,
      imageUrl: '',
      // 上传end
      companylist: [],
      selectLoading: false,
      isSearchShow: false,
      currentRow: null,
      // 查看详情弹窗
      priceShow: false,
      taskNotificationShow: false,
      isNotificationLoading: false,
      priceList: [],
      notificationEditList: [],
      priceOption: {},
      priceId: '',
      priceLoading: false,
      // 新增任务
      isEditShow: false,
      editLoading: false,
      controlData: [],
      activeName: '',
      editForm: {
        name: null,
        insuringPerson: 0, // 投保人
        insuredPerson: 0, // 被保人
        transfer: 1, // 是否一年过户
        // id: null, // 用户id
        uuid: null,
        cardName: null,
        ownerName: null, // 车主姓名
        ownerPhone: null, // 联系电话
        ownerIdType: null, // 证件类型
        ownerCardType: null, // 数组
        ownerIdNo: null, // 证件号
        ownerAddr: null, // 联系地址
        ownerBirthday: null, // 出生日期
        ownerSex: null, // 车主性别
        ownerEmail: null, // 车主邮箱
        holderName: null, // 投保人姓名
        holderPhone: null, // 联系电话
        holderIdType: null, // 证件类型
        holderCardType: null, // 数组
        holderIdNo: null, // 证件号
        holderAddr: null, // 联系地址
        holderBirthday: null, // 出生日期
        holderSex: null, // 投保人性别
        insuredName: null, // 被保人姓名
        insuredPhone: null, // 联系电话
        insuredIdType: null, // 证件类型
        insureCardType: null, // 数组
        insuredIdNo: null, // 证件号
        insuredAddr: null, // 联系地址
        insuredBirthday: null, // 出生日期
        insuredSex: null, // 被保人性别
        licenseNo: '', // 车牌号
        useNature: null, // 车辆使用性质
        attachNature: null, // 使用性质细分
        brandName: null, // 品牌型号
        modelCode: null, // 车型编码
        frameNo: null, // 车架号
        engineNo: null, // 发动机号
        enrollDate: null, // 注册日期
        issueYear: null, // 年款
        purchasePrice: null, // 新车价格
        actualPrice: null,
        seatCount: null, // 座位数
        transferDate: null, // 过户日期
        displacement: null, // 排量/功率
        curbWeight: null, // 整备质量
        tonnage: null, // 核定载质量
        vehicleType: null, // 交管车辆类型
        vehicleCategory: null,
        type: null, // 客户类型
        allocationTime: null, // 分配时间
        salesmanId: null, // 续保员id
        operatorId: null,
        taskState: null, // 任务状态
        state: null, // 跟进状态
        mark: null,
        renewalState: null, // 续保状态
        planReturnTime: null, // 下次更进时间
        returnTime: null,
        inputType: null, // 录入方式
        time: null,
        updateTime: null,
        sourceId: null,
        plateColor: null, // 车牌底色
        forceEndDate: null, // 交强险到期日期
        comEndDate: null, // 商业险到期日期
        updator: null,
        del: null,
        lastCompanyId: null,
        file0: null,
        file1: null,
        file2: null,
        file3: null
      },
      timer: null,
      taskMessageNum: 0,
      messageListLoad: false,
      isTaskMessageShow: false,
      msgPage: 1, // 任务通知列表分页 当前页
      msgPageSize: 10, // 任务通知列表分页 每页条数
      msgPageMax: 5, // 任务通知列表分页 最大页码按钮数 大于等于 5 且小于等于 21 的奇数
      msgPageCount: null, // 任务通知列表分页 总条数
      renewalDay: 90
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
    this.getRenewalDay()
    this.menuHandleClick(0)
    this.searchbtn()
    this.getMessageListAjax(this.msgPage)
    this.actTime()
    // 判断是否有续保专员
    const resData = await getUsersOnCondition({
      type: '3',
      sourceId: this.$store.getters.userAll.data.channelCode
    })
    if (resData.data.length) {
      this.operatorIdShow = true
    } else {
      this.operatorIdShow = false
    }
  },
  beforeDestroy() {
    // 停止定时器
    clearInterval(this.timer)
  },
  methods: {
    getRenewalDay() {
      getRenewalStantandDay().then(res => {
        this.renewalDay = res.data.daysConfig
      })
    },
    sendBackImg(val) {
      this.backImg = val
    },
    // 时间不超过一年提示
    /*
    dateArrChange(val) {
      // console.log(val)
      if (dayjs(val[1]).diff(dayjs(val[0]), 'month') > 11) {
        this.$message({
          duration: 4000,
          message: '最多只可选择一年的时间长度进行查询！'
        })
        this.dateArr = [dayjs(), dayjs()]
      }
    },*/
    // 计算距离脱保天数
    formatEndDayNum(row) {
      if (row.endDate > this.renewalDay) {
        return ''
      } else if (row.endDate <= this.renewalDay && row.endDate >= 0) {
        return row.endDate
      } else {
        return ''
      }
    },
    // 刷新
    async refreshPage() {
      // 清空看台信息
      this.menuboxnum = null
      this.searchForm.from = ''
      this.searchForm.to = ''
      this.searchForm.searchType = null
      this.searchForm.plateDateType = null
      // 初始化高级搜索
      this.searchReset()
      this.getMessageListAjax()
    },
    // 申请报价车牌检测
    offerForCarNo(value) {
      const reg = /^(([\u4e00-\u9fa5]{1}[A-Z]{1})[-]?|([wW][Jj][\u4e00-\u9fa5]{1}[-]?)|([a-zA-Z]{2}))([A-Za-z0-9]{5}|[DdFf][A-HJ-NP-Za-hj-np-z0-9][0-9]{4}|[0-9]{5}[DdFf])$/
      if (value && new RegExp(reg).test(value)) {
        this.errorTip = false
      } else {
        this.$message({
          message: '请输入正确的车牌',
          type: 'warning'
        })
        this.offerForLicenseNo = ''
      }
    },
    // 申请报价车架号不能输入中文
    offerForFrameNo(value) {
      const reg = /^[a-z0-9]+$/i
      if (value && new RegExp(reg).test(value)) {
        this.errorTip = false
      } else {
        this.$message({
          message: '请输入正确的发动机号，只能是英文字母或数字，不能输入中文。',
          type: 'warning'
        })
        this.offerForVinNo = ''
      }
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
    handleMenu(index) {
      if (this.menuboxnum !== index) {
        this.menuboxnum = index
        // 筛选
        this.searchForm.plateDateType = this.menuboxact
        this.searchForm.searchType = this.menuboxnum
        if (this.menuboxact === null) {
          this.searchForm.from = ''
          this.searchForm.to = ''
        } else {
          this.searchForm.from = dayjs(this.dateArr[0]).format('YYYY-MM-DD 00:00:00')
          this.searchForm.to = dayjs(this.dateArr[1]).format('YYYY-MM-DD 23:59:59')
        }
      } else {
        this.menuboxnum = null
        this.searchForm.searchType = null
        this.searchForm.plateDateType = null
      }
      this.searchbtn()
    },
    menuHandleClick(index) {
      this.menuboxact = index
      this.menuLoading = true
      this.menuboxnum = null
      this.searchForm.plateDateType = null
      this.searchForm.searchType = null
      switch (index) {
        case 0: // 今天
          this.dateArr = [dayjs().format('YYYY-MM-DD 00:00:00'), dayjs().format('YYYY-MM-DD 23:59:59')]
          break
        case 1: // 本周
          this.dateArr = [dayjs(dayjs(dayjs().startOf('week')).valueOf() + 24 * 3600000), dayjs(dayjs(dayjs().startOf('week')).valueOf() + 7 * 24 * 3600000)]
          break
        case 2: // 本月
          this.dateArr = [dayjs().startOf('month'), dayjs().endOf('month')]
          break
        case 3: // 上月
          this.dateArr = [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
          break
      }
      getPlateInfo({ dateType: index })
        .then(res => {
          this.posterdaymain = res.data
          this.menuLoading = false
        })
        .catch(err => {
          console.warn(err)
        })
    },
    /*
    menuHandleSearch() {
      this.menuboxact = null
      this.menuLoading = true
      const startTime = dayjs(this.dateArr[0]).format('YYYY-MM-DD 00:00:00') // new Date(dayjs(this.dateArr[0]).format('YYYY-MM-DD 00:00:00')).getTime()
      const endTime = dayjs(this.dateArr[1]).format('YYYY-MM-DD 23:59:59') // new Date(dayjs(this.dateArr[1]).format('YYYY-MM-DD 23:59:59')).getTime()
      const Paramsdata = {
        dateType: 4,
        from: startTime,
        to: endTime
      }
      getPlateInfo(Paramsdata)
        .then(res => {
          this.posterdaymain = res.data
          this.menuLoading = false
        })
        .catch(err => {
          console.warn(err)
        })
    },*/
    // 搜索
    searchbtn() {
      this.tabMianLoading = true
      this.searchForm.licenseNo = this.searchForm.licenseNo.toString().trim()
      const current = {
        current: this.page,
        size: this.size
      }
      getTaskList({ ...this.searchForm, ...current })
        .then(res => {
          this.tabMianLoading = false
          this.TaskList = res.data.list
          this.count = res.data.total
          this.TaskList.forEach(element => {
            element.automaticBan = false // 自定义按钮 默认初始自动报价按钮可点击
            element.quoteFlagShow = true // 自定义按钮
          })
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
      this.tabMianLoading = true
      this.$refs.moreSearchForm.isLoading = true
      const current = {
        current: 1,
        size: this.size
      }
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
      const searchForm = this.searchForm
      getTaskList({ ...searchForm, ...current })
        .then(res => {
          this.TaskList = res.data.list
          this.TaskList.forEach(element => {
            element.automaticBan = false // 自定义按钮 默认初始自动报价按钮可点击
            element.quoteFlagShow = true // 自定义按钮
          })
          this.count = res.data.total
          this.isSearchShow = false
          this.tabMianLoading = false
          this.$refs.moreSearchForm.isLoading = false
        })
        .catch(err => {
          this.tabMianLoading = false
          this.$refs.moreSearchForm.isLoading = false
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
      const current = {
        current: this.page,
        size: this.size
      }
      getTaskList({ ...this.searchForm, ...current })
        .then(res => {
          this.tabMianLoading = false
          this.TaskList = res.data.list
          this.count = res.data.total
          this.TaskList.forEach(element => {
            element.automaticBan = false // 自定义按钮 默认初始自动报价按钮可点击
            element.quoteFlagShow = true // 自定义按钮
          })
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
    // 查看详情
    checkData(row) {
      this.$router.push({
        path: '/carDealer/customerDetail',
        query: { id: row.id, licenseNo: row.licenseNo, name: 'myTask' }
      })
    },
    // 刷新报价
    refreshBtn(index, row) {
      row.quoteFlagShow = false
      row.automaticBan = true
      this.TaskList.splice(index, 1, row)
      const Paramsdata = {
        licenseNo: row.licenseNo,
        companyId: row.lastCompanyId,
        uuid: row.uuid,
        icarPoliyId: '',
        sourceId: this.$store.getters.userAll.data.channelCode
      }
      refreshQuotation(Paramsdata)
        .then(res => {
          this.searchbtn()
          this.$message({
            message: '刷新报价成功',
            type: 'success'
          })
        })
        .catch(err => {
          console.warn(err)
          row.quoteFlagShow = true
          row.automaticBan = false
          this.TaskList.splice(index, 1, row)
          this.searchbtn()
        })
    },
    // 自动报价
    automaticBtn(index, row) {
      row.quoteFlagShow = false
      row.automaticBan = true
      this.TaskList.splice(index, 1, row)
      this.automaticRow = row
      const Paramsdata = {
        licenseNo: row.licenseNo,
        sourceId: this.$store.getters.userAll.data.channelCode
      }
      autoQuotation(Paramsdata)
        .then(res => {
          if (res.status !== 200) {
            row.quoteFlagShow = true
            row.automaticBan = false
            this.TaskList.splice(index, 1, row)
            this.automaticErrorReason = res.msg
            this.errDialogVisible = true
          } else {
            this.searchbtn()
            this.$message.success('自动报价成功!')
          }
        })
        .catch(err => {
          console.warn(err)
        })
    },
    handleErrBJ() {
      this.errDialogVisible = false
      // this.$router.push({
      //   path: '/insurance/quickissue',
      //   name: '移动出单',
      //   query: {
      //     carDealerId: this.automaticRow.uuid, // 是否车商标识
      //     carLicense: this.automaticRow.licenseNo, // 车牌号
      //     frameNo: this.automaticRow.frameNo // 车架号
      //   }
      // })
      window.openIssueUrl({
        carDealerId: this.automaticRow.uuid, // 是否车商标识
        carLicense: this.automaticRow.licenseNo, // 车牌号
        frameNo: this.automaticRow.frameNo // 车架号
      })
    },
    // 新建任务
    newEditBtn() {
      this.isEditShow = true
      this.editLoading = true
      this.activeName = 'first'
      getControlCarType()
        .then(res => {
          this.controlData = res.data.vehicleTypeList
          this.editLoading = false
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 关闭、取消
    close() {
      this.isSearchShow = false
      this.isEditShow = false
      this.searchReset()
      // this.$refs.customerEdit.$refs.ruleForm.resetFields()
    },
    // 新增保存
    addConfirm() {
      const formData = this.editForm
      if (formData.insuringPerson === 0) {
        formData.holderName = formData.ownerName
        formData.holderIdType = formData.ownerIdType
        formData.holderIdNo = formData.ownerIdNo
        formData.holderSex = formData.ownerSex
        formData.holderAddr = formData.ownerAddr
        formData.holderPhone = formData.ownerPhone
      }
      if (formData.insuredPerson === 0) {
        formData.insuredName = formData.ownerName
        formData.insuredIdType = formData.ownerIdType
        formData.insuredIdNo = formData.ownerIdNo
        formData.insuredSex = formData.ownerSex
        formData.insuredAddr = formData.ownerAddr
        formData.insuredPhone = formData.ownerPhone
      }
      if (formData.insuredPerson === 1) {
        formData.insuredName = formData.holderName
        formData.insuredIdType = formData.holderIdType
        formData.insuredIdNo = formData.holderIdNo
        formData.insuredSex = formData.holderSex
        formData.insuredAddr = formData.holderAddr
        formData.insuredPhone = formData.holderPhone
      }
      const fd = new FormData()
      fd.append('data', JSON.stringify(formData))
      if (formData.file0) {
        fd.append('file0', formData.file0)
      }
      if (formData.file1) {
        fd.append('file1', formData.file1)
      }
      if (formData.file2) {
        fd.append('file2', formData.file2)
      }
      if (formData.file3) {
        fd.append('file3', formData.file3)
      }
      if (formData.ownerIdType && formData.ownerIdNo) {
        this.activeName = 'second'
      } else {
        this.activeName = 'first'
      }
      this.$refs.customerEdit.$refs.ruleForm.validate(valid => {
        if (!valid) return
        // if (formData.cardName !== formData.ownerName) {
        //   this.$message.error('车主姓名不一致')
        //   return
        // }
        setCustomerEditImgs(fd)
          .then(res => {
            // console.log(res)
            if (res.status === 200) {
              this.isEditShow = false
              this.$message({
                type: 'success',
                message: '新增成功'
              })
              this.searchbtn()
              this.$refs.customerEdit.$refs.ruleForm.resetFields()
              this.editForm.imageIdface = null
              this.editForm.imageIdback = null
              this.editForm.imagelicenseface = null
              this.editForm.imagelicenseback = null
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(err => {
            console.warn(err)
          })
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
    async seeDetails(row) {
      this.priceId = row.uuid
      const resL = await getAllOfferRecords({ uuid: row.uuid })
      this.priceList = resL.data
      if (this.priceList.length > 0) {
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
    },
    // 申请出单
    applyingForBtn(row) {
      this.applyingForId = row.uuid
      this.applyingForlicenseNo = row.licenseNo
      this.applyingForName = ''
      this.applyingCompanyList = []
      this.applyingTableList = []
      this.applyingForLoading = true
      this.applyingForSearch()
      getAllOfferRecords({ uuid: row.uuid })
        .then(res => {
          if (res.data.length) {
            this.applyingForShow = true
            this.applyingCompanyList = res.data
            this.applyingForLoading = false
          } else {
            this.$message.error(
              '未获取到可以申请报价的保险公司！请先移步去报价。'
            )
            this.applyingForLoading = false
          }
          // console.log(res)
        })
        .catch(err => {
          this.applyingForLoading = false
          console.warn(err)
        })
    },
    applyingForSearch() {
      // 1续保和出单一体专员、2续保专员、3出单专员
      const Paramsdata = {
        type: '3',
        sourceId: this.$store.getters.userAll.data.channelCode,
        name: this.applyingForName
      }
      getUsersOnCondition(Paramsdata)
        .then(res => {
          this.applyingTableList = res.data
          // console.log(res)
        })
        .catch(err => {
          console.warn(err)
        })
    },
    applyingTableListChange(val) {
      this.applyingTableListId = val.id
    },
    applyingCompanyChange(val) {
      this.applyingIcarPoliyId = val
      this.applyingCompanyList.forEach(element => {
        if (element.icar_poliy_id === val) {
          this.applyinglastCompanyId = element.lastCompanyId
        }
      })
    },
    applyingForEnter() {
      if (!this.applyingTableListId) {
        this.$message.warning('请选择出单员!')
        return
      }
      if (!this.applyingIcarPoliyId) {
        this.$message.warning('请选择保险公司!')
        return
      }
      const Paramsdata = {
        uuid: this.applyingForId,
        icarPoliyId: this.applyingIcarPoliyId, // icar_poliy_id
        operatorId: this.applyingTableListId, // 选中的出单员id
        applyCompanyId: this.applyinglastCompanyId, // '申请报价保险公司的id'
        licenseNo: this.applyingForlicenseNo, // 这个是列表里面车牌号？我也不知道,据说是发送消息
        mark: this.applyingForRemarks
      }
      putApplyInsurance(Paramsdata)
        .then(res => {
          // console.log(res)
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.searchbtn()
          this.applyingForShow = false
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 任务转派
    taskForBtn(row) {
      this.taskForShow = true
      this.taskForRow = row
      this.taskForName = ''
      this.taskForList = []
      this.taskForRemarks = ''
      this.taskForSearch()
    },
    taskForSearch() {
      // 1续保和出单一体专员、2续保专员、3出单专员
      const Paramsdata = {
        type: '2',
        sourceId: this.$store.getters.userAll.data.channelCode,
        name: this.taskForName
      }
      getUsersOnCondition(Paramsdata)
        .then(res => {
          this.taskForList = res.data
          // console.log(res)
        })
        .catch(err => {
          console.warn(err)
        })
    },
    taskForListChange(val) {
      // this.currentRow = val
      // this.trueId = val.id
      this.taskForListVal = val
    },
    taskForEnter() {
      // 续保专员不能转派给自己
      if (this.taskForRow.salesmanId !== this.taskForListVal.id) {
        const Paramsdata = {
          id: this.taskForRow.id,
          salesmanId: this.taskForListVal.id,
          mark: this.taskForRemarks
        }
        getTaskDispatch(Paramsdata)
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
      } else {
        this.$message.warning('转派失败！任务不能转派给本人！')
      }
    },
    // 申请报价
    // -续保专员主列表选中
    TaskListChange(row) {
      if (row.uuid === this.taskListRadio) {
        this.taskListRadio = ''
        this.offerForId = ''
        this.offerForUuid = ''
        this.offerForLicenseNo = ''
        this.offerForCompany = null
        this.offerForVinNo = ''
        this.offerForCarName = ''
        this.offerForPhone = ''
        this.offerForRemarks = ''
        this.offerForDisabled = false
        this.taskListRow = ''
      } else {
        this.taskListRow = JSON.parse(JSON.stringify(row))
        this.taskListRadio = row.uuid
        this.offerForId = row.id
        this.offerForUuid = row.uuid
        this.offerForLicenseNo = row.licenseNo
        this.offerForCompany = row.lastCompany
        this.offerForCompanyId = row.lastCompanyId
        this.offerForVinNo = row.frameNo
        this.offerForCarName = row.ownerName
        this.offerForPhone = row.ownerPhone
        this.offerForRemarks = row.mark
        this.offerForDisabled = true
      }
    },
    // 打开 申请报价弹窗
    offerForBtn() {
      if (!this.taskListRadio) return
      this.offerForShow = true
      this.selectLoading = false
      this.offerForName = '' // 查询条件
      this.offerForLicenseNo = this.offerForLicenseNo || '' // 申请报价车牌号
      this.offerForCompany = this.offerForCompany // 保险公司
      this.offerForVinNo = this.offerForVinNo || '' // 申请报价车架号
      this.offerForCarName = this.offerForCarName || '' // 车主姓名
      this.offerForPhone = this.offerForPhone || '' // 申请报价手机号
      this.offerTableListId = '' // 申请报价列表选择
      this.offerForRemarks = this.offerForRemarks || '' // 申请报价备注
      this.imageIdFaceUrl = ''
      this.imageIdFaceLoading = false
      this.imageIdBackUrl = ''
      this.imageIdBackLoading = false
      this.imageLicenseFaceUrl = ''
      this.imageLicenseFaceLoading = false
      this.imageLicenseBackUrl = ''
      this.imageLicenseBackLoading = false
      this.offerForSearch()
      getInsuredCompany()
        .then(res => {
          this.companylist = res.data
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // -申请报价搜索
    offerForSearch() {
      // 1续保和出单一体专员、2续保专员、3出单专员
      const Paramsdata = {
        type: '3',
        sourceId: this.$store.getters.userAll.data.channelCode,
        name: this.offerForName
      }
      getUsersOnCondition(Paramsdata)
        .then(res => {
          this.offerTableList = res.data
          // console.log(res)
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // -申请报价表格选着
    offerTableListChange(val) {
      this.offerTableListId = val.id
    },
    // 获取保险公司
    handleCompany() {
      getInsuredCompany()
        .then(res => {
          this.companylist = res.data
          this.selectLoading = false
        })
        .catch(err => {
          console.warn(err)
          this.selectLoading = false
        })
    },
    // 上传证件照
    imageIdFaceLoadingAct() {
      this.imageIdFaceLoading = true
    },
    imageIdBackLoadingAct() {
      this.imageIdBackLoading = true
    },
    imageLicenseFaceLoadingAct() {
      this.imageLicenseFaceLoading = true
    },
    imageLicenseBackLoadingAct() {
      this.imageLicenseBackLoading = true
    },
    // 删除照片
    delIdFaceUplaod() {
      this.imageIdFaceUrl = ''
      this.imageIdFaceInfo = ''
      this.imageIdFaceFile = ''
    },
    delIdBackUplaod() {
      this.imageIdBackUrl = ''
      this.imageIdBackInfo = ''
      this.imageIdBackFile = ''
    },
    delLicenseFaceUplaod() {
      this.imageLicenseFaceUrl = ''
      this.imageLicenseFaceInfo = ''
      this.imageLicenseFaceFile = ''
    },
    delLicenseBackUplaod() {
      this.imageLicenseBackUrl = ''
      this.imageLicenseBackFile = ''
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是JPG/PNG格式')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过1MB!')
      }
      return isJPG && isLt2M
    },
    // 上传成功的钩子
    // 身份证正面
    uploadIdFaceChange(res, file) {
      // console.log(res)
      if (res.status === 200 && res.data.name) {
        this.imageIdFaceLoading = false
        this.imageIdFaceUrl = URL.createObjectURL(file.raw)
        this.imageIdFaceFile = file.raw
        this.imageIdFaceInfo = res.data
      } else {
        this.imageIdFaceLoading = false
        this.$message.error('身份证正面识别失败')
        this.imageIdFaceUrl = ''
      }
    },
    uploadIdBackChange(res, file) {
      if (res.status === 200 && res.data.idType) {
        this.imageIdBackLoading = false
        this.imageIdBackUrl = URL.createObjectURL(file.raw)
        this.imageIdBackFile = file.raw
        this.imageIdBackInfo = res.data
      } else {
        this.imageIdBackLoading = false
        this.$message.error('身份证反面识别失败')
        this.imageIdBackUrl = ''
      }
    },
    uploadLicenseFaceChange(res, file) {
      if (res.status === 200) {
        this.imageLicenseFaceLoading = false
        this.imageLicenseFaceUrl = URL.createObjectURL(file.raw)
        this.imageLicenseFaceFile = file.raw
        this.imageLicenseFaceInfo = res.data
      } else {
        this.imageLicenseFaceLoading = false
        this.$message.error('行驶证正面识别失败')
        this.imageLicenseFaceUrl = ''
      }
    },
    uploadLicenseBackChange(file) {
      // var reader = new FileReader()
      // reader.addEventListener('load', () => {
      //   console.log(reader.result)
      //   this.imageLicenseBackUrl = reader.result
      // }, false)
      // if (file.raw) {
      //   reader.readAsDataURL(file.raw)
      // }
      this.imageLicenseBackLoading = false
      this.imageLicenseBackUrl = URL.createObjectURL(file.raw)
      this.imageLicenseBackFile = file.raw
    },
    offerForCompanyChoice(val) {
      this.offerForCompanyId = val
    },
    // -申请报价确定保存
    offerForImgesEnter() {
      const formData = new FormData()
      if (this.imageIdFaceFile) {
        formData.append('flag0', 0)
        formData.append('file0', this.imageIdFaceFile)
      }
      if (this.imageIdBackFile) {
        formData.append('flag1', 1)
        formData.append('file1', this.imageIdBackFile)
      }
      if (this.imageLicenseFaceFile) {
        formData.append('flag2', 2)
        formData.append('file2', this.imageLicenseFaceFile)
      }
      if (this.imageLicenseBackFile) {
        formData.append('flag3', 3)
        formData.append('file3', this.imageLicenseBackFile)
      }
      formData.append(
        'IDInfo',
        JSON.stringify({
          ...this.imageIdFaceInfo,
          ...this.imageIdBackInfo
        })
      )
      formData.append(
        'carInfo',
        JSON.stringify({
          ...this.imageLicenseFaceInfo
        })
      )
      const baseData = {
        customerId: this.offerForId, // 续保任务主列表的id
        uuid: this.offerForUuid, // 续保任务主列表的uuid
        operatorId: this.offerTableListId, // 弹窗选中出单员的id
        licenseNo: this.offerForLicenseNo, // 弹窗车牌号
        frameNo: this.offerForVinNo, // 车架号
        applyCompanyId: this.offerForCompanyId, // 弹窗选着的公司
        name: this.offerForCarName, // 弹窗车主姓名
        phone: this.offerForPhone, // 弹窗手机号
        mark: this.offerForRemarks // 弹窗备注
      }
      formData.append('base', JSON.stringify(baseData))
      if (!this.offerTableListId) {
        this.$message.warning('请选择出单员！')
      } else if (!this.offerForLicenseNo && !this.offerForVinNo) {
        this.$message.warning('车牌号，车架号至少选填一项!')
      } else if (isNull(this.offerForCompanyId)) {
        this.$message.warning('请选择保险公司！')
      } else if (!this.offerForCarName) {
        this.$message.warning('车主姓名不能为空！')
      } else if (!this.offerForPhone) {
        this.$message.warning('车主电话不能为空！')
      } else {
        newCarApplyOffer(formData)
          .then(res => {
            this.$message({
              message: '恭喜你，申请报价成功！',
              type: 'success'
            })
            this.searchbtn()
            this.selectLoading = false
            this.offerForShow = false
            this.taskListRadio = ''
            this.offerForName = '' // 查询条件
            this.offerForId = '' // 申请报价列表id
            this.offerForUuid = '' // 申请报价列表UUID
            this.offerForLicenseNo = '' // 申请报价车牌号
            this.offerForVinNo = '' // 申请报价车架号
            this.offerForCompany = null // 申请报价保险公司
            this.offerForPhone = '' // 申请报价手机号
            this.offerForCarName = ''
            this.offerTableListId = '' // 申请报价列表选择
            this.offerForRemarks = '' // 申请报价备注
            this.imageIdFaceUrl = ''
            this.imageIdBackUrl = ''
            this.imageLicenseFaceUrl = ''
            this.imageLicenseBackUrl = ''
            this.taskListRow = ''
          })
          .catch(err => {
            console.warn(err)
            this.selectLoading = false
          })
      }
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

    .dialogMainCompany {
      .el-radio {
        height: auto;
        margin-bottom: 10px;
        margin-left: 0;
        margin-right: 10px;
        background: #f5f7fa;
      }
    }
  }
}
.el-popover--plain {
  word-break: break-all;
}
.el-popover {
  min-width: 0!important;
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
    .card-box {
      padding-top: 10px;
      .cardbox-tit {
        font-weight: bold;
        color: #606266;
        font-size: 14px;
      }
      .cardboxup-img {
        padding: 10px;
        overflow: hidden;
        .avatar-uploader {
          float: left;
          margin-right: 10px;
          .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            padding: 0 4px;
          }
          .el-upload:hover {
            border-color: #409eff;
          }
        }
        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 140px;
          height: 100px;
          line-height: 100px;
          text-align: center;
          padding: 0 4px;
          box-sizing: border-box;
        }
        .avatar {
          width: 140px;
          height: 100px;
          display: block;
        }
      }
    }
    .tabListMarkText {
      text-align: center;
      font-size: 18px;
      padding-bottom: 100px;
      min-width: 100px;
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
