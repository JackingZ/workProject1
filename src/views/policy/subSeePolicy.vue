<template>
  <!-- eslint-disable -->
  <div v-loading="isLoading" class="sub-insure">
    <label class="sub-label">子政策名称：</label>
    <div class="sub-name">{{ subData.name }}</div>
    <div v-if="subData.subStrategyMatchCauses">
      <div v-for="(item, index) in subData.subStrategyMatchCauses" :key="index">
        <div v-if="item.wrapValueTitle.length > 0">
          <label class="sub-label">{{ item.codeTitle }}：</label>
          <div>
            <span v-for="(witem, windex) in item.wrapValueTitle" :key="windex">
              <el-button style="margin-right: 10px;margin-top:10px;cursor: pointer;" type="primary" size="mini">{{ witem }}</el-button>
            </span>
          </div>
        </div>
      </div>
    </div>
    <el-table :data="subData.subStrategyRates" style="width: 100%">
      <el-table-column prop="rateTypeTitle" label="手续费/佣金" />
      <el-table-column prop="name" label="机构/业务员" width="280">
        <template slot-scope="scope">
          <span v-if="scope.row.rateType === '1'">{{parentTitle(scope.row)}}</span>
          <el-popover v-if="scope.row.rateType === '2'" placement="bottom-start" width="250" @show="defaultCheckedChannel(scope.row, 'channelTree' + scope.$index)">
            <div>
              <el-tree :data="scope.row.options" :default-expanded-keys="scope.row.companyKey" :default-checked-keys="scope.row.companyKey" :ref="'channelTree' + scope.$index" check-strictly show-checkbox node-key="value" id="subSeeChannel" :props="defaultProps" />
            </div>
            <div slot="reference" style="width: 250px;">
              <el-input placeholder="请点击查看勾选的下游机构" size="small" />
            </div>
          </el-popover>
          <el-popover v-if="scope.row.rateType === '3'" placement="bottom-start" width="250" @show="defaultCheckedSaler(scope.row, 'salerTree' + scope.$index)">
            <div>
              <el-tree :data="scope.row.options" :default-checked-keys="scope.row.salesKey" :ref="'salerTree' + scope.$index" show-checkbox node-key="value" id="subSeeSaler" :props="defaultProps" />
            </div>
            <div slot="reference" style="width: 250px;">
              <el-input placeholder="请点击查看勾选的下游业务员" size="small" />
            </div>
          </el-popover>
          <el-popover v-if="scope.row.rateType === '4'" placement="bottom-start" width="250" @show="defaultCheckedTeam(scope.row, 'teamTree' + scope.$index)">
            <div>
              <el-tree :data="scope.row.options" :default-expanded-keys="scope.row.teamKey" :default-checked-keys="scope.row.teamKey" :ref="'teamTree' + scope.$index" check-strictly show-checkbox node-key="value" id="subSeeTeam" :props="defaultProps" />
            </div>
            <div slot="reference" style="width: 250px;">
              <el-input placeholder="请点击查看勾选的批量业务员" size="small" />
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="computeTypeText" label="结算方式" />
      <el-table-column prop="forceRiskTaxRate" label="交强险(含税)">
        <template slot-scope="scope">
          {{scope.row.forceRiskTaxRate}}%
        </template>
      </el-table-column>
      <el-table-column prop="businessRiskTaxRate" label="商业险(含税)">
        <template slot-scope="scope">
          {{scope.row.businessRiskTaxRate}}%
        </template>
      </el-table-column>
      <el-table-column prop="forceRiskRate" label="交强险(不含税)">
        <template slot-scope="scope">
          {{scope.row.forceRiskRate}}%
        </template>
      </el-table-column>
      <el-table-column prop="businessRiskRate" label="商业险(不含税)">
        <template slot-scope="scope">
          {{scope.row.businessRiskRate}}%
        </template>
      </el-table-column>
      <el-table-column prop="operateName" label="操作人" />
    </el-table>
  </div>
</template>

<script>
import {
  policySubInfo,
  getPolicyTeamEffective
} from '@/api/policy'
export default {
  props: {
    subStrategyId: {
      type: String,
      default: ''
    },
    adminViewId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      subData: {
        name: '',
        subStrategyMatchCauses: [],
        subStrategyRates: []
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      channelData: [],
      teamData: [],
      isLoading: false
    }
  },
  async created() {
    this.isLoading = true
    const resC = await getPolicyTeamEffective([this.adminViewId]) // 获取机构
    const jsonC = JSON.parse(
      JSON.stringify(resC.data)
        .replace(/title/g, 'label')
        .replace(/key/g, 'value')
    )
    if (jsonC[0] && jsonC[0].children && jsonC[0].children.length > 0) {
      this.channelData = jsonC[0].children
    } else {
      this.channelData = []
    }

    const resG = await getPolicyTeamEffective([this.adminViewId]) // 获取团队
    const jsonG = JSON.parse(
      JSON.stringify(resG.data)
        .replace(/title/g, 'label')
        .replace(/key/g, 'value')
    )
    // if (jsonG[0] && jsonG[0].children && jsonG[0].children.length > 0) {
    if (jsonG) {
      this.teamData = jsonG
    } else {
      this.teamData = []
    }

    // 获取政策信息
    const resI = await policySubInfo(this.subStrategyId, this.adminViewId)
    const json = JSON.parse(
      JSON.stringify(resI.data)
        .replace(/title/g, 'label')
        .replace(/key/g, 'value')
    )
    this.subData.name = resI.data.name
    this.subData.subStrategyMatchCauses = resI.data.subStrategyMatchCauses
    json.subStrategyRates.map((item, index) => {
      if (item.rateType === '2') {
        json.subStrategyRates[index].options = this.channelData
        const arrC = []
        item.companies.forEach(key => {
          arrC.push(key.companyId)
          json.subStrategyRates[index].companyKey = arrC
        })
      } else if (item.rateType === '4') {
        json.subStrategyRates[index].options = this.teamData
        const arrT = []
        item.companies.forEach(key => {
          arrT.push(key.companyId)
          json.subStrategyRates[index].teamKey = arrT
        })
      } else if (item.rateType === '3') {
        const arrS = []
        item.companies.forEach(key => {
          arrS.push(key.salesId)
          json.subStrategyRates[index].salesKey = arrS
        })
        const jsonO = JSON.parse(
          JSON.stringify(item.companies)
            .replace(/salesName/g, 'label')
            .replace(/salesId/g, 'value')
        )
        json.subStrategyRates[index].options = jsonO
      }
    })
    console.log('json.subStrategyRates', json.subStrategyRates)
    this.subData.subStrategyRates = json.subStrategyRates
    this.isLoading = false
  },
  methods: {
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
    },
    assignValue(item, key, value) {
      console.log('assignValue', arguments)
      item[key] = value
    },
    defaultCheckedChannel(row, name) {
      this.$refs[name].setCheckedKeys(row.companyKey)
    },
    defaultCheckedSaler(row, name) {
      this.$refs[name].setCheckedKeys(row.salesKey)
    },
    defaultCheckedTeam(row, name) {
      this.$refs[name].setCheckedKeys(row.teamKey)
    }
  }
}
</script>

<style lang="scss">
.sub-insure {
  padding: 20px 20px;
  .sub-label {
    height: 50px;
    line-height: 50px;
    font-weight: normal;
    font-size: 14px;
    color: #262626;
  }
  .sub-name {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
  }
}
#subSeeSaler,
#subSeeChannel,
#subSeeTeam {
  width: 224px;
  height: 300px;
  margin-top: 10px;
  overflow: auto;
  .el-tree-node > .el-tree-node__children {
    overflow: visible;
  }
}
</style>
