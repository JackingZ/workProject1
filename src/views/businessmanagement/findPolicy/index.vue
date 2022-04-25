<template>
  <div
    class="left-pane findPolicy"
    style="display: flex;flex-flow: row nowrap;min-height: inherit;"
  >
    <app-slide v-loading="orgSelectList.isSideLoading" :is-active="isActive">
      <div class="tree-title">
        <p>机构列表</p>
        <div class="showtype">
          <el-select
            v-model="selectTreeType"
            placeholder="请选择"
            size="small"
            style="width:130px;"
            @change="getRecordData"
          >
            <el-option :value="1" label="查看全部下级"/>
            <el-option :value="2" label="仅看当前机构"/>
          </el-select>
        </div>
      </div>
      <el-tree
        ref="orgtree"
        :data="orgSelectList.data"
        :props="orgProps"
        :expand-on-click-node="false"
        :empty-text="selectValue.channel ? '暂无数据' : '请先选择渠道'"
        class="filter-tree"
        @node-click="selOrg"
      />
    </app-slide>
    <div v-if="isRecordShow" style="display: flex;align-items: center;">
      <div class="arrow-wrap" style="z-index:1;">
        <img :src="isActive ? expandIcon.left : expandIcon.right" @click="isActive = !isActive">
      </div>
    </div>
    <div class="app-container" style="width: 100%;overflow: auto;">
      <div class="app-panel channel-right">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item v-permission="permissionList.businessBatchGrabbing" index="1">批量抓单</el-menu-item>
          <el-menu-item v-permission="permissionList.businessCatchRecord" index="2">抓单记录</el-menu-item>
        </el-menu>
        <div v-if="!isRecordShow">
          <get-policy @handleSubmit="handleSubmit"/>
        </div>
        <!-- 抓单操作窗口 -->
        <el-dialog
          :visible.sync="getPolicyVisible1"
          :close-on-click-modal="false"
          title="批量抓单"
          width="500px"
        >
          <div class="dialog">
            <span>
              <img src="@/assets/imgs/u8231.gif">
            </span>
            <span class="txt">正在执行批量抓单操作...</span>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="queryLater">稍后查看</el-button>
          </div>
        </el-dialog>
        <el-dialog
          :visible.sync="getPolicyVisible"
          :close-on-click-modal="false"
          title="批量抓单"
          width="500px"
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
            <el-button v-if="!isComplete" size="small" @click="queryLater">稍后查看</el-button>
            <el-button v-if="isComplete" size="small" type="primary" @click="gotoRecord">查看详情</el-button>
          </div>
        </el-dialog>

        <div v-if="isRecordShow" style="padding:20px;">
          <el-row type="flex" justify="start" align="middle">
            <el-col :span="24">
              <el-row type="flex" justify="end" align="middle">
                <el-select
                  v-if="isAnyAdminChannel"
                  v-model="selectValue.sourceId"
                  :loading="channelList.loading"
                  size="small"
                  clearable
                  filterable
                  placeholder="所属渠道"
                  style="margin-right: 10px;width: 130px;flex: 0 0 auto;"
                  @change="getOrg"
                >
                  <el-option
                    v-for="item in channelList.data"
                    :key="item.code"
                    :label="item.shortName"
                    :value="item.code"
                  />
                </el-select>
                <!-- <el-button
                  icon="el-icon-refresh"
                  size="small"
                  style="margin-right:10px;"
                  @click="getRefresh"
                >刷新</el-button> -->
              </el-row>
            </el-col>
          </el-row>
          <!-- <el-button size="small" style="margin-bottom: 20px;" @click="addProgress">重置进度</el-button>
          <my-progress :percentage="percentage" :stroke-width="14" /> -->
          <el-table
            v-loading="isLoading"
            :data="recordData"
            :default-sort="{prop: 'creatTime', order: 'descending'}"
            height="calc(100vh - 320px)"
            max-height="100vh"
            border
            style="width: 100%;margin: 20px 0;"
          >
            <el-table-column
              v-if="isAnyAdminChannel"
              prop="sourceName"
              label="所属渠道"
              width="150"
            />
            <el-table-column prop="operatorName" label="操作人" width="150"/>
            <el-table-column prop="companyName" label="保险公司" min-width="80"/>
            <el-table-column prop="channelName" label="出单渠道(工号)" min-width="200"/>
            <el-table-column prop="num" label="总计" min-width="60"/>
            <el-table-column prop="successful" label="成功" min-width="60"/>
            <el-table-column prop="repeatful" label="重复" min-width="60"/>
            <el-table-column prop="error" label="失败" min-width="60"/>
            <el-table-column prop="crawlerType" label="抓单方式" min-width="80"/>
            <el-table-column label="抓单进度" min-width="140">
              <template slot-scope="scope">
                <my-progress
                  :percentage="scope.row.policyProgress"
                  :stroke-width="14" />
                  <!-- <el-progress
                  :text-inside="true"
                  :stroke-width="14"
                  :percentage="scope.row.policyProgress"
                  :color="scope.row.color"
                /> -->
              </template>
            </el-table-column>
            <el-table-column prop="createTime" sortable label="提交时间" width="180"/>
            <el-table-column label="操作" min-width="130" fixed="right">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  style="font-size: 14px;"
                  @click="getDetail(scope)"
                >详情</el-button>
                <el-button
                  type="text"
                  size="mini"
                  style="font-size: 14px;"
                  @click="gotoPolicy(scope)"
                >查看保单</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog
            :visible.sync="getDetailVisible"
            :close-on-click-modal="false"
            title="批量抓单"
            width="500px"
          >
            <div style="text-align:center;margin:20px 0" class="detail_content">
              <div class="dialog_result">
                <span>
                  <img src="@/assets/imgs/u8241.png">
                </span>
                <span class="txt">抓单完成！</span>
              </div>
              <p>总计{{ policyList.total }}条，抓取成功{{ policyList.finishCount }}条，重复抓取{{ policyList.repeatCount }}条，抓取失败{{ policyList.failCount }}条</p>
            </div>
            <div v-if="!isSuccess" class="failReasons">
              <p>注：工号登录超时或连接异常，均会导致抓单失败。抓单失败的保单/车牌，您可稍后重试或通过“保存保单”、“手动录入”等方式，完成保单录入。本次抓取失败如下：{{ policyList.detail }}</p>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button size="small" type="primary" @click="closeDialog">关闭</el-button>
            </div>
          </el-dialog>
          <el-pagination
            :total="selectValue.total"
            :current-page.sync="selectValue.page"
            :page-size="selectValue.size"
            :page-sizes="[10, 20, 30, 40, 50]"
            style="text-align: right;"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="getCurrentData"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getOrgData } from '@/api/number'
import { getAllChannelData } from '@/api/accounturl'
import {
  getPolicySubmit,
  getPolicyDetail,
  getPolicyRecord
} from '@/api/findPolicy'
import { mapGetters } from 'vuex'
import { AppSlide } from '@/components/Slide'
import GetPolicy from '@/views/businessmanagement/findPolicy/component/getPolicy'
import MyProgress from '@/components/MyProgress'

export default {
  components: {
    AppSlide,
    GetPolicy,
    MyProgress
  },
  data() {
    return {
      percent: 0,
      seeLate: true,
      percentage: 30,
      // isSelectShow: false,
      selectTreeType: 1,
      isActive: false,
      timer: null, // 获取结果的定时器名称
      timer2: null, // 定时刷新页面定时器
      isSuccess: true, // 是否全部成功的保单
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
      getPolicyVisible: false, // 抓单结果对话框
      getPolicyVisible1: false, // 抓单进行中
      getDetailVisible: false, // 详情对话框是否显示
      isRecordShow: false, // 是否抓单记录页面
      activeIndex: '1',
      isLoading: true,
      // isActive: false, // 机构侧滑
      progressStatus: '', // 进度条状态
      channelList: {
        // 所属渠道下拉选择
        loading: false,
        data: []
      },
      selectValue: {
        total: 10,
        page: 1,
        size: 20,
        sourceId: '',
        comcode: ''
      },
      orgSelectList: {
        isSideLoading: false,
        model: '',
        data: [],
        disabled: false
      },
      orgProps: {
        label: 'title',
        children: 'children'
      },
      table: {
        count: 0,
        model: [],
        titles: []
      },
      // 侧滑树形结构的开关按钮
      expandIcon: {
        left: require('@/assets/imgs/expand_select-left.png'),
        right: require('@/assets/imgs/expand_select-right.png')
      },
      recordData: []
    }
  },
  computed: {
    ...mapGetters(['isAnyAdminChannel'])
  },
  watch: {
    'selectValue.sourceId': function(val) {
      if (!val || val === '') {
        this.orgSelectList.disabled = true
      } else {
        this.orgSelectList.disabled = false
      }
    },
    'orgSelectList.model': function(val) {
      this.$refs.orgtree.filter(val)
    }
  },
  created() {
    // 权限设置处理
    const permissionList = this.$store.state.user.permissions
    const isGrap = permissionList.some(item => {
      return this.permissionList.businessBatchGrabbing === item
    })
    if (!isGrap) {
      console.log('抓单记录')
      this.activeIndex = '2'
      this.getPolicyVisible = false
      this.isRecordShow = true
    }
    this.getChannel()
    this.getRecordData()
    if (!this.isAnyAdminChannel) {
      this.getOrg()
      // this.isActive = true
    }
  },
  mounted() {},
  destroyed() {
    clearTimeout(this.timer2)
    clearTimeout(this.timer)
  },
  methods: {
    queryLater() {
      this.getPolicyVisible1 = false
    },
    addProgress() {
      this.percentage = 50
      setTimeout(() => {
        this.percentage = 70
      }, 700)
      setTimeout(() => {
        this.percentage = 100
      }, 1300)
    },
    // 获取保单记录
    getRecordData(val) {
      console.log('获取保单')
      if (val) {
        this.isLoading = false
      } else {
        this.isLoading = true
      }
      console.log(this.isAnyAdminChannel)
      if (!this.isAnyAdminChannel) {
        var channelCode = JSON.parse(localStorage.getItem('userAll')).data
          .channelCode
      } else {
        channelCode = this.selectValue.sourceId
      }
      const params = {
        page: this.selectValue.page,
        size: this.selectValue.size,
        model: {
          sourceCode: channelCode || '',
          teamId: this.selectValue.comcode || '',
          type: this.selectTreeType
        }
      }
      console.log(params)
      getPolicyRecord(params).then(res => {
        this.isLoading = false
        console.log(res)
        this.selectValue.total = res.data.count
        var result = res.data.model
        if (result.length === 0) {
          this.recordData = []
          this.isLoading = false
          return
        }
        result.forEach(item => {
          if (item.crawlerType === 1) {
            item.crawlerType = '按保单号'
          } else {
            item.crawlerType = '按车牌号'
          }
          item.policyProgress = parseInt(
            ((item.successful + item.repeatful + item.error) / item.num) * 100
          )
        })
        console.log('百分比', result[0]['policyProgress'])
        this.percent = result[0]['policyProgress']
        if (result[0]['policyProgress'] !== 100) {
          this.refreshReacord()
        } else {
          clearTimeout(this.timer)
          clearTimeout(this.timer2)
        }
        this.recordData = result
        this.isLoading = false
      })
    },
    // 获取保单
    handleSubmit(data) {
      // this.isComplete = false
      this.refreshReacord()
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
    // 刷新页面
    refreshReacord() {
      console.log('刷新页面')
      this.timer2 = setTimeout(() => {
        this.getRecordData('1')
      }, 10000)
    },
    // 获取抓单返回的详情
    getPolicyResult(id) {
      getPolicyDetail(id)
        .then(res => {
          if (res.data.flag === 1) {
            console.log('清除定时器1')
            clearTimeout(this.timer) // 清除定时器
            if (!this.isRecordShow) {
              console.log('关闭抓单中的窗口')
              this.getPolicyVisible = true
              this.getPolicyVisible1 = false
            }
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
            this.timer = setTimeout(() => {
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
    // 跳转到保单记录页面
    gotoRecord() {
      this.handleSelect('2')
      this.getPolicyVisible = false
      // this.isRecordShow = true
      this.activeIndex = '2'
      // this.activeIndex = '2'
      this.getRecordData()
    },
    // 获取渠道
    getChannel() {
      getAllChannelData().then(res => {
        console.log(res)
        this.channelList.data = res.data
      })
    },
    selOrg(val) {
      if (val) {
        this.selectValue.comcode = val.key
        // this.selectValue.sourceId = JSON.parse(localStorage.getItem('userAll')).data.channelCode
        this.getRecordData()
      }
    },
    // 获取机构
    getOrg() {
      this.selectValue.comcode = undefined
      if (!this.isAnyAdminChannel) {
        // 判断是否运维
        var channelCode = JSON.parse(localStorage.getItem('userAll')).data
          .channelCode
        console.log('渠道编号', channelCode)
      } else {
        channelCode = this.selectValue.sourceId
      }
      getOrgData({
        channelCode: channelCode
      })
        .then(res => {
          // console.log(res)
          this.orgSelectList.data = res.data
          console.log(this.orgSelectList.data)
          this.getRecordData()
        })
        .catch(err => {
          console.warn(err)
        })
    },
    handleSelect(key, keyPath) {
      if (key === '1') {
        this.isRecordShow = false
        // this.isActive = false
        this.isActive = false
      } else if (key === '2') {
        clearTimeout(this.timer)
        this.getPolicyVisible = false
        this.isRecordShow = true
        this.getRecordData()
        // if (!this.isAnyAdminChannel) {
        //   this.isActive = true
        // }
      }
      // console.log(this.isRecordShow)
    },
    // 关闭详情对话框
    closeDialog() {
      this.getDetailVisible = false
    },
    // 获取详情
    getDetail(scope) {
      console.log(scope.row)
      const id = scope.row.id
      this.policyList.total = scope.row.num
      this.policyList.finishCount = scope.row.successful
      this.policyList.repeatCount = scope.row.repeatful
      this.policyList.failCount = scope.row.error
      if (this.policyList.failCount !== 0) {
        // 有失败的情况
        getPolicyDetail(id).then(res => {
          this.getDetailVisible = true
          console.log(res)
          this.isSuccess = false
          console.log(res.data.detail.arrs)
          // this.hasFalure = true
          let detailList = []
          res.data.detail.forEach(item => {
            if (item.description.indexOf('异常') > -1) {
              detailList = item.arrs
            }
          })
          this.policyList.detail = detailList.join('、')
        })
      } else {
        this.isSuccess = true
        // this.hasFalure = false
        this.getDetailVisible = true
      }
    },
    // 查看保单
    gotoPolicy(scope) {
      const channelCode = scope.row.sourceCode
      const createTime = []
      createTime[0] = scope.row.createTime
      createTime[1] = scope.row.createTime
      const id = scope.row.id
      console.log(channelCode, createTime)
      console.log(this.$router)
      this.$router.push({
        name: '保单台账',
        params: {
          channelCode,
          createTime,
          id
        }
      })
    },
    // 刷新页面
    getRefresh() {
      this.getRecordData()
    },
    // 每页显示的数据条数
    handleSizeChange(val) {
      this.selectValue.size = val
      this.getRecordData()
    },
    // 页面发生变化的时候
    getCurrentData() {
      this.getRecordData()
    }
  }
}
</script>
<style lang="scss" scoped>
// @import '@/assets/iconfont/iconfont.css';
.tree-title {
  margin-left: 10px;
  margin-bottom: 10px;
  height: 46px;
  line-height: 46px;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-around;
  align-items: center;
  p {
    flex: 1;
    font-size: 400;
    color: #909399;
    // display:inline-block;
  }
  .showtype {
    flex: 1;
  }
}
.nav {
  width: 100%;
  height: 50px;
  border-bottom: 1px solid rgba(242, 242, 242, 1);
  p {
    height: 50px;
    line-height: 50px;
    display: inline-block;
  }
}
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
  }
}
.arrow-wrap {
  display: flex;
  align-items: center;
  height: calc(100vh - 114px);
  box-sizing: border-box;
  margin-right: -12px;
  cursor: pointer;
  img {
    width: 12px;
  }
}
.app-panel {
  height: calc(100vh - 114px);
}
.slide-active {
  width: 320px;
  margin: 10px 0;
  // min-width: 240px;
}
</style>
<style lang="scss">
.findPolicy {
  .el-dialog__header {
    border-bottom: 1px solid #cccccc;
  }
  .el-dialog__footer {
    border-top: 1px solid #cccccc;
  }
  .channel-right {
    padding: 0;
    .el-table td,
    .el-table th {
      padding: 0;
      height: 40px;
      line-height: 40px;
    }
    .el-table th {
      background: #fafafa;
    }
    .panel-info {
      font-size: 16px;
      background-color: rgb(240, 242, 245);
      border-bottom: 1px solid #cccccc;
    }
    .el-menu-item.is-active {
      background-color: #fff !important;
    }
    input.invalid:focus {
      border: 1px solid #ddd !important;
    }
    .el-menu-item {
      font-size: 16px;
    }
  }
  .tree-title {
    .el-input--small .el-input__inner {
      height: 30px;
      line-height: 30px;
    }
  }
  .el-tree {
    .el-tree__empty-text {
      font-size: 14px;
    }
  }
}
</style>
