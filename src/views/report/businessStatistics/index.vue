<template>
  <!-- eslint-disable -->
  <div class="app-container business-state">
    <div class="app-panel">
      <el-row type="flex" style="flex-flow: row wrap;">
        <el-select
          v-model="formData.selectCompany"
          clearable
          filterable
          value-key="name"
          style="width: 130px;"
          class="filter"
          placeholder="保险公司"
          size="small"
          @change="onCompanyChange"
        >
          <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item"/>
        </el-select>
        <el-select
          v-if="isAnyAdminChannel"
          v-model="formData.selectChannel"
          clearable
          filterable
          multiple
          collapse-tags
          placeholder="所属渠道"
          size="small"
          class="filter"
          style="width:230px;"
          @change="onChannelChange"
        >
          <el-option
            v-for="item in channelList"
            :key="item.code"
            :label="item.shortName"
            :value="item.code"
          />
        </el-select>
        <el-select
          v-model="formData.selectBindAccount"
          value-key="channelName"
          style="width: 130px;"
          class="filter"
          filterable
          clearable
          placeholder="工号"
          size="small"
          @change="onConditionChange"
        >
          <el-option
            v-for="(item, index) in bindCompanyList"
            :key="index"
            :label="item.channelName"
            :value="item.id"
          />
        </el-select>
        <my-tree-select
          v-if="isShowOrgList"
          :options="orgList"
          v-model="formData.selectOrg"
          :normalizer="normalizer"
          no-options-text="数据加载中..."
          no-children-text
          style="width:200px;display: inline-block;vertical-align: top;"
          class="filter"
          placeholder="选择机构"
          no-results-text="未找到结果"
          @select="onConditionChange"
        />
        <el-select v-model="selectDateOption" placeholder="请选择日期类型" size="small" class="filter" @change="onDateOptionsChange">
          <el-option
            v-for="item in dateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <el-date-picker
          v-model="selectDate"
          :picker-options="datePickerOptions"
          :type="selectDateOption"
          :placeholder="getDatePlaceholder"
          :format="getDateFormat"
          size="small"
          class="filter"
          @change="selectDateChange"
        />
        <el-button type="primary" class="filter" size="mini" @click="queryData">查询</el-button>
        <el-button :loading="isExporting" class="filter" style="margin-right:0;" type="primary" size="mini" @click="exportFile">导出</el-button>
      </el-row>
      <tab-info-pane
        v-if="!isAnyAdminChannel"
        :date="date"
        :type="0"
        :isSingleChannel="true"
        :loadingData="paneConfig[0].isLoadingData"
        :loadingList="paneConfig[0].isLoadingList"
        ref="pane0"
        @requestChild="requestChildList($event)"></tab-info-pane>
      <el-tabs
        v-if="isAnyAdminChannel"
        v-model="seleceTab"
        @tab-click="tabChange">
        <el-tab-pane label="业务员统计" name="1">
          <tab-info-pane
            :date="date"
            :type="1"
            :isSingleChannel="paneConfig[1].isSingleChannel"
            :loadingData="paneConfig[1].isLoadingData"
            :loadingList="paneConfig[1].isLoadingList"
            ref="pane1"
            @requestChild="requestChildList($event)"></tab-info-pane>
        </el-tab-pane>
        <el-tab-pane label="次数统计" name="2">
          <tab-info-pane
            :date="date"
            :type="2"
            :isSingleChannel="paneConfig[2].isSingleChannel"
            :loadingData="paneConfig[2].isLoadingData"
            :loadingList="paneConfig[2].isLoadingList"
            ref="pane2"
            @requestChild="requestChildList($event)"></tab-info-pane>
        </el-tab-pane>
        <el-tab-pane label="车牌量统计" name="3">
          <tab-info-pane
            :date="date"
            :type="3"
            :isSingleChannel="paneConfig[3].isSingleChannel"
            :loadingData="paneConfig[3].isLoadingData"
            :loadingList="paneConfig[3].isLoadingList"
            ref="pane3"
            @requestChild="requestChildList($event)"></tab-info-pane>
        </el-tab-pane>
        <el-tab-pane label="综合统计" name="4">
          <tab-info-pane
            :date="date"
            :type="4"
            :isSingleChannel="paneConfig[4].isSingleChannel"
            :loadingData="paneConfig[4].isLoadingData"
            :loadingList="paneConfig[4].isLoadingList"
            ref="pane4"
            @requestChild="requestChildList($event)"></tab-info-pane>
        </el-tab-pane>
      </el-tabs>

      <!-- <el-popover
          placement="left-start"
          :width="isAnyAdminChannel ? 750 : 200"
          v-model="showFieldList">
          <div class="business-state">
            <el-checkbox-group
              :class="isAnyAdminChannel ? 'is-admin' : 'is-normal'"
              v-model="checkField">
              <el-checkbox v-for="item in checkFieldItems" :label="item.name" :key="item.name">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div style="text-align: center; margin: 0">
            <el-button size="small" type="text" @click="cancelSelectField">取消</el-button>
            <el-button type="primary" size="small" @click="confirmSelectField">确定</el-button>
          </div>
          <el-button slot="reference" class="toggle-list-item" @click="recoverField">自定义统计字段</el-button>
      </el-popover>-->
    </div>
  </div>
</template>
<script>
import MyTreeSelect from '@/components/MyTreeSelect'
import MyTree from '@/components/MyTree/index'
import { getCompanyEffective } from '@/api/ledger'
import {
  financeCompany,
  queryByBindingCompanys,
  offLineBindCompany
} from '@/api/finance'
import { policyAddCompany } from '@/api/policy'
import { businessData, businessListData, businessExport } from '@/api/report'
import { getOrgData } from '@/api/system'
import { getAllChannelData } from '@/api/number'
import TabInfoPane from '@/views/report/businessStatistics/tabInfoPane'
import { mapGetters } from 'vuex'
import { getFields } from '@/views/report/businessStatistics/field'
import dayjs from 'dayjs'
import { Message } from 'element-ui'
import dateMixin from '@/views/report/dateMixin'
export default {
  components: {
    MyTreeSelect,
    MyTree,
    TabInfoPane
  },
  mixins: [dateMixin],
  data() {
    return {
      orgList: [], // 机构列表
      companyList: [], // 保险公司
      bindCompanyList: [], // 工号列表
      backupBindCompanyList: [], // 工号列表复制
      channelList: [], // 渠道列表
      formData: {
        selectOrg: '', // 当前选择机构
        selectCompany: '', // 当前选择保险公司
        selectBindAccount: '', // 当前选择工号
        selectChannel: [] // 当前选择的渠道
      },
      seleceTab: '1',
      paneConfig: {
        0: {
          isLoadingData: false, // 是否正在加载card数据
          isLoadingList: false, // 是否正在加载table数据
          isLoadedData: false, // 是否加载过card数据
          isLoadedList: false, // 是否加载过table数据
          params: {} // 上次请求参数
        },
        1: {
          isSingleChannel: false, // 是否单一渠道
          isLoadingData: false, // 是否正在加载card数据
          isLoadingList: false, // 是否正在加载table数据
          isLoadedData: false, // 是否加载过card数据
          isLoadedList: false, // 是否加载过table数据
          params: {} // 上次请求参数
        },
        2: {
          isSingleChannel: false,
          isLoadingData: false, // 是否正在加载card数据
          isLoadingList: false, // 是否正在加载table数据
          isLoadedData: false,
          isLoadedList: false,
          params: {} // 上次请求参数
        },
        3: {
          isSingleChannel: false,
          isLoadingData: false, // 是否正在加载card数据
          isLoadingList: false, // 是否正在加载table数据
          isLoadedData: false,
          isLoadedList: false,
          params: {} // 上次请求参数
        },
        4: {
          isSingleChannel: false,
          isLoadingData: false, // 是否正在加载card数据
          isLoadingList: false, // 是否正在加载table数据
          isLoadedData: false,
          isLoadedList: false,
          params: {} // 上次请求参数
        }
      },
      date: ['', ''],
      loadingTable: false,
      checkField: [],
      checkFieldItems: [],
      defaultFieldItems: [],
      showFieldList: false,
      isExporting: false
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否是管理员渠道
    ]),
    isShowOrgList() {
      if (this.isAnyAdminChannel) {
        return this.formData.selectChannel && this.formData.selectChannel.length === 1
      }
      return true
    }
  },
  watch: {
    'formData.selectChannel'(newVal) {
      if (!newVal || newVal.length === 0) this.formData.selectOrg = ''
    }
  },
  activated() {
    if (this.isAnyAdminChannel) this.getChannelList()
  },
  created() {
    this.initSelectDate()
    this.getOrgList()
    this.getChannelList()
    financeCompany().then(res => {
      if (res && res.data) this.companyList = res.data
    })
    this.getChannelIdList() // 查询工号
    if (!this.isAnyAdminChannel) this.queryData()
  },
  methods: {
    getOrgList() {
      if (this.isAnyAdminChannel) {
        const selectChannel = this.formData.selectChannel[0]
        if (!selectChannel) return
        getOrgData({
          channelCode: selectChannel
        }).then(res => {
          if (this.formData.selectChannel.length !== 1) return
          const result = res.data
          this.orgList = result
        })
      } else {
        getCompanyEffective().then(res => {
          const result = res.data
          this.orgList = result
        })
      }
    },
    // 获取工号
    getBindAccount() {},
    getChannelList() {
      if (!this.isAnyAdminChannel) return
      getAllChannelData().then(res => {
        this.channelList = res.data
      })
    },
    getChannelIdList() {
      const company = this.$store.state.user.userInfo.company // 所属机构
      Promise.all([
        policyAddCompany(company).then(res => {
          if (res && res.status === 200) return res.data
        }),
        queryByBindingCompanys(company).then(res => {
          if (res && res.status === 200) return res.data
        }),
        offLineBindCompany(company).then(res => {
          if (res && res.status === 200) {
            if (res.data) {
              return res.data.map(item => {
                return {
                  // ...item,
                  channelName: item.insureChannelName,
                  cid: item.cid,
                  id: item.cid,
                  companyId: parseInt(item.insureCompanySourceId)
                }
              })
            } else return []
          }
        })
      ]).then(res => {
        this.bindCompanyList = []
        for (let i = 0; i < 3; i++) {
          if (res[i]) this.bindCompanyList.push(...res[i])
        }
        this.backupBindCompanyList = [...this.bindCompanyList]
      })
    },
    initCheckFieldItems() {
      this.defaultFieldItems = getFields(this.isAnyAdminChannel)
    },
    recoverField() {
      console.log('recoverField')
      this.checkFieldItems = [...this.defaultFieldItems]
      this.checkField = []
      this.defaultFieldItems.forEach(item => {
        if (item.check) this.checkField.push(item.name)
      })
    },
    cancelSelectField() {
      this.showFieldList = false
      this.checkField = []
      this.checkFieldItems = []
    },
    // 确认自定义字段
    confirmSelectField() {
      this.defaultFieldItems = this.defaultFieldItems.map(item => {
        item.check = this.checkField.some(field => item.name === field)
        return item
      })
      this.showFieldList = false
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
    // 保险公司与工号级联
    onCompanyChange() {
      if (!this.formData.selectCompany) {
        this.formData.selectBindCompany = ''
        this.bindCompanyList = [...this.backupBindCompanyList]
        return
      }
      this.bindCompanyList = this.backupBindCompanyList.filter(
        item => this.formData.selectCompany.id === item.companyId
      )
      if (this.formData.selectBindCompany) {
        const isFind = this.bindCompanyList.some(
          item => item.id === this.formVal.selectBindCompany.id
        )
        if (!isFind) this.formData.selectBindCompany = ''
      }
      this.onConditionChange()
    },
    // 渠道修改
    onChannelChange() {
      console.log('onChannelChange')
      const selectChannel = this.formData.selectChannel
      this.formData.selectOrg = ''
      this.orgList = []
      // 单一渠道才获取机构列表
      if (selectChannel && selectChannel.length === 1) {
        this.getOrgList()
      }
      if (this.isAnyAdminChannel) {
        if (selectChannel.length > 9) {
          this.showAlertMsg('最多只能选择9个渠道', 'error')
          return
        }
      }
      this.onConditionChange()
    },
    queryData() {
      // countAddSale(params).then(res => {
      //   if (res.status === 200 && res.data) {
      //     const newSales = this.cardInfoData.newSales
      //     newSales.count = res.data.newAddSales
      //     newSales.percent = res.data.monthRadio
      //   }
      // })
      if (!this.hasSetDate()) {
        this.showAlertMsg('请选择时间范围', 'error')
        return
      }

      this.date = this.getDateArray()

      const selectChannel = this.formData.selectChannel
      if (this.isAnyAdminChannel) {
        if (selectChannel.length === 0) {
          this.showAlertMsg('请至少选一个渠道', 'error')
          return
        }
        if (selectChannel.length > 9) {
          this.showAlertMsg('最多只能选择9个渠道', 'error')
          return
        }
      }
      this.queryBusinessData()
      this.queryBusinessList()
    },
    queryBusinessData(tabChange) {
      if (!this.hasSetDate()) {
        this.showAlertMsg('请选择时间范围', 'error')
        return
      }
      const apiType = this.isAnyAdminChannel ? this.seleceTab : 0
      const selectChannel = this.formData.selectChannel
      let organizationId = ''
      // 运维渠道 单一渠道才传机构id
      if (this.isAnyAdminChannel) {
        if (selectChannel.length === 1) organizationId = this.formData.selectOrg || ''
      } else organizationId = this.formData.selectOrg || ''
      const formData = this.formData
      const params = {
        ...this.getDateParams(),
        organizationId, // 机构id
        sourceCode: this.isAnyAdminChannel ? selectChannel.join(',') || '' : '',
        companyId: formData.selectCompany ? formData.selectCompany.id : '', // 保险公司
        channelId: formData.selectBindAccount || '', // 工号
        // operateType: '', // 操作类型 0查询/1导出，不传默认0
        // pageNum: 0,
        // pageSize: 10,
        apiType
      }
      const paneConfig = this.paneConfig[apiType]
      if (paneConfig.isLoadingData) {
        if (!tabChange) this.showMessage('数据正在请求中')
        return
      }
      paneConfig.isLoadingData = true
      this.remove(params)
      this.checkSingleChannel(apiType)
      businessData(params).then(res => {
        paneConfig.isLoadingData = false
        if (res.status !== 200) {
          return
        }
        paneConfig.isLoadedData = true
        console.log('businessData', res)
        const { list } = res.data
        switch (parseInt(apiType)) {
          case 0:
            this.$refs.pane0 && this.$refs.pane0.setData(list)
            break
          case 1:
            this.$refs.pane1 && this.$refs.pane1.setData(list)
            break
          case 2:
            this.$refs.pane2 && this.$refs.pane2.setData(list)
            break
          case 3:
            this.$refs.pane3 && this.$refs.pane3.setData(list)
            break
          case 4:
            this.$refs.pane4 && this.$refs.pane4.setData(list)
            break
        }
      }).catch(e => {
        paneConfig.isLoadingData = false
      })
    },
    queryBusinessList({ tabChange, isExport } = {}) {
      if (!this.hasSetDate()) {
        this.showAlertMsg('请选择时间范围', 'error')
        return
      }
      const apiType = this.isAnyAdminChannel ? this.seleceTab : 0
      const selectChannel = this.formData.selectChannel
      let organizationId = ''
      // 运维渠道 单一渠道才传机构id
      if (this.isAnyAdminChannel) {
        if (selectChannel.length === 1) organizationId = this.formData.selectOrg || ''
      } else organizationId = this.formData.selectOrg || ''
      const formData = this.formData
      const params = {
        ...this.getDateParams(),
        organizationId, // 机构id
        sourceCode: selectChannel.join(',') || '',
        companyId: formData.selectCompany ? formData.selectCompany.id : '', // 保险公司
        channelId: formData.selectBindAccount || '', // 工号
        // operateType: '', // 操作类型 0查询/1导出，不传默认0
        pageNum: 0,
        pageSize: 10,
        apiType
      }
      const paneConfig = this.paneConfig[apiType]
      if (paneConfig.isLoadingList) {
        if (!tabChange) this.showMessage('数据正在请求中')
        return
      }
      // 缓存参数用于树形懒加载请求接口
      paneConfig.params = { ...params }
      paneConfig.isLoadingList = true
      if (isExport) params.operateType = 1
      this.remove(params)
      businessListData(params).then(res => {
        paneConfig.isLoadingList = false
        if (res.status !== 200) {
          return
        }
        paneConfig.isLoadedList = true
        console.log('businessListData', res)
        const { list } = res.data
        switch (parseInt(apiType)) {
          case 0:
            this.$refs.pane0 && this.$refs.pane0.setList(list)
            break
          case 1:
            this.$refs.pane1 && this.$refs.pane1.setList(list)
            break
          case 2:
            this.$refs.pane2 && this.$refs.pane2.setList(list)
            break
          case 3:
            this.$refs.pane3 && this.$refs.pane3.setList(list)
            break
          case 4:
            this.$refs.pane4 && this.$refs.pane4.setList(list)
            break
        }
      }).catch(e => {
        paneConfig.isLoadingList = false
      })
    },
    exportFile() {
      if (this.isExporting) {
        this.showAlertMsg('正在导出中')
        return
      }
      if (!this.hasSetDate()) {
        this.showAlertMsg('请选择时间范围', 'error')
        return
      }
      const selectChannel = this.formData.selectChannel
      if (this.isAnyAdminChannel) {
        if (selectChannel.length === 0) {
          this.showAlertMsg('请至少选一个渠道', 'error')
          return
        }
        if (selectChannel.length > 9) {
          this.showAlertMsg('最多只能选择9个渠道', 'error')
          return
        }
      }
      const apiType = this.isAnyAdminChannel ? this.seleceTab : 0
      let organizationId = ''
      // 运维渠道 单一渠道才传机构id
      if (this.isAnyAdminChannel) {
        if (selectChannel.length === 1) organizationId = this.formData.selectOrg || ''
      } else organizationId = this.formData.selectOrg || ''
      const formData = this.formData
      const params = {
        ...this.getDateParams(),
        organizationId, // 机构id
        sourceCode: selectChannel.join(',') || '',
        companyId: formData.selectCompany ? formData.selectCompany.id : '', // 保险公司
        channelId: formData.selectBindAccount || '', // 工号
        // operateType: '', // 操作类型 0查询/1导出，不传默认0
        pageNum: 0,
        pageSize: 10,
        apiType
      }
      this.isExporting = true
      const typeName = {
        '0': '_',
        '1': '_业务员统计_',
        '2': '_次数统计_',
        '3': '_车牌量统计_',
        '4': '_综合统计_'
      }
      businessExport(params).then(res => {
        this.isExporting = false
        const url = window.URL.createObjectURL(res)
        const a = document.createElement('a')
        document.body.appendChild(a)
        a.href = url
        a.download =
            '业务统计' + typeName[apiType] + dayjs().format('YYYY-MM-DD HH_mm_ss') + '.xls'
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }).catch(e => {
        this.isExporting = false
      })
    },
    onConditionChange() {
      for (const key in this.paneConfig) {
        this.paneConfig[key].isLoadedData = false
        this.paneConfig[key].isLoadedList = false
      }
    },
    // 检查是否单渠道
    checkSingleChannel(apiType) {
      const isSingleChannel = this.formData.selectChannel.length === 1
      this.$set(this.paneConfig[apiType], 'isSingleChannel', isSingleChannel)
    },
    // 删除空参数
    remove(obj) {
      for (const key in obj) {
        if (obj[key] !== 0 && !obj[key]) delete obj[key]
      }
    },
    tabChange() {
      // this.queryData()
      const apiType = this.isAnyAdminChannel ? this.seleceTab : 0
      const paneConfig = this.paneConfig[apiType]
      const isFitCondition = () => {
        if (!this.hasSetDate()) {
          this.showAlertMsg('请选择时间范围', 'error')
          return
        }
        const selectChannel = this.formData.selectChannel
        if (this.isAnyAdminChannel) {
          if (selectChannel.length === 0) {
            this.showAlertMsg('请至少选一个渠道', 'error')
            return false
          }
          if (selectChannel.length > 9) {
            this.showAlertMsg('最多只能选择9个渠道', 'error')
            return false
          }
        }
        return true
      }
      if (!isFitCondition() && (!paneConfig.isLoadedData || !paneConfig.isLoadedList)) return
      if (!paneConfig.isLoadedData) {
        this.queryBusinessData()
      }
      if (!paneConfig.isLoadedList) {
        this.queryBusinessList()
      }
    },
    requestChildList({ row, callback, type }) {
      const params = this.paneConfig[type].params
      if (!params) return
      const reFormatParams = {
        ...params,
        organizationId: row.organizationId
      }
      console.log('reFormatParams', reFormatParams)
      this.remove(reFormatParams)
      businessListData(reFormatParams).then(res => {
        if (res.status !== 200) {
          return
        }
        const { list } = res.data
        const data = list.map(item => {
          return {
            ...item,
            parent_id: row.organizationId,
            depth: (row.depth || 0) + 1
          }
        })
        callback && callback(data)
      })
    },
    showMessage(msg, type) {
      Message({
        message: msg,
        type: type || 'error',
        duration: 2 * 1000
      })
    }
  }
}
</script>
<style lang="scss">
.business-state {
  .el-table th {
    background: #fafafa;
  }
  .el-table td, .el-table th{
    // padding: 3px 0;
    padding: 0;
    height: 40px;
    line-height: 40px;
  }
  .is-admin {
    .el-checkbox {
      width: 180px;
      padding-left: 20px;
      padding-bottom: 10px;
    }
  }
  .is-normal {
    .el-checkbox {
      width: 200px;
      padding-left: 20px;
      padding-bottom: 10px;
    }
  }
  .el-checkbox + .el-checkbox {
    margin-left: 0px;
  }
  .app-panel {
    overflow: auto;
    height: calc(100vh - 120px);
  }
  .filter {
    margin: 0 10px 10px 0;
  }
  .el-range-separator {
    width: 30px;
    line-height: 28px;
  }
  .card-wrap {
    margin: 15px 0;
    // white-space: nowrap;
    min-width: 950px;
    width: 100%;
  }
  .tree-table {
    // max-width: 100%;
    height: 35px;
    border-collapse: separate;
    border-spacing: 0;
    text-align: left;
    font-weight: normal;
    font-size: 14px;
    border-left: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
    color: #606266;
  }
  .toggle-list-item {
    vertical-align: top;
    margin-top: 40px;
  }
  .tree-node__content:hover {
    background-color: #eef7fd;
  }
  .tree-node__expand-icon {
    padding: 6px;
    cursor: pointer;
    color: #c0c4cc;
    font-size: 12px;
    background: transparent;
    &::before {
      content: '+';
      color: #333;
      border: 1px solid #eee;
      width: 20px;
      height: 20px;
      display: inline-block;
      text-align: center;
      background: transparent;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      font-size: 16px;
      line-height: 18px;
    }
  }
  .tree-node__expand-icon.expanded {
    &::before {
      content: '-';
    }
  }
}
</style>
