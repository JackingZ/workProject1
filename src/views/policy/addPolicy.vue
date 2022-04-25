<template>
  <!-- eslint-disable -->
  <div class="add-insure-policy">
    <el-form ref="addPolicy" :model="roleForm" :rules="rules" v-loading="isLoading" label-position="top" label-width="100px">
      <el-form-item label="选择工号" prop="num">
        <el-select v-model="roleForm.num" :loading="companyData.loading" :disabled="isAdd" filterable value-key="id" placeholder="选择机构" size="small" @change="setInsureNum">
          <el-option v-for="(item, index) in companyData.data" :key="index" :label="item.channelName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="roleForm.timeStatus === '1' && isEdit" label="生效时间" prop="expireTime">
        <el-row :gutter="10">
          <el-col :span="11">
            <el-date-picker v-model="roleForm.startTime" disabled type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择日期" size="small" class="is-picker-input" />
          </el-col>
          <el-col :span="13">
            <el-date-picker v-model="roleForm.expireTime" :picker-options="pickerEnd" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择日期" size="small" @change="setDate" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item v-else label="生效时间" prop="datesData">
        <el-row>
          <el-col :span="24">
            <el-date-picker
              v-model="datesData"
              :disabled="isValue"
              :picker-options="pickerStart"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              :clearable="false"
              unlink-panels
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
              @change="getDate" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input v-model="roleForm.backup" size="small" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  // policyAddCompany,
  policyAddBelongCompany,
  queryPolicy,
  policyExistTime
} from '@/api/policy'
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
// import { debounce } from '@/utils'
export default {
  props: {
    policyId: {
      type: String,
      default: null
    },
    isCopy: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      datesData: null,
      roleForm: {
        backup: null,
        channelCode: null,
        createrCompanyId: null,
        expireTime: null,
        id: null,
        insureCompanyChannelId: null,
        num: null,
        name: null,
        startTime: null
      },
      rules: {
        num: [
          {
            required: true,
            message: '请选择工号',
            trigger: 'change'
          }
        ],
        expireTime: [
          {
            required: true,
            validator: this.validateExpireTime,
            trigger: 'change'
          }
        ],
        datesData: [
          {
            type: 'daterange',
            required: true,
            validator: this.validateTime,
            trigger: 'change'
          }
        ]
      },
      companyData: {
        loading: false,
        data: []
      },
      isAdd: false,
      isValue: true,
      isLoading: false,
      pickerStart: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000
        }
      },
      pickerEnd: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否是管理员渠道
    ])
  },
  watch: {
    'roleForm.num': function(val) {
      if (!val || val === '') {
        this.isValue = true
      } else {
        this.isValue = false
      }
    }
  },
  created() {
    this.getInsureNum()
    if (this.policyId) {
      this.isLoading = true
      this.isAdd = true
      this.getInsureInfo(this.policyId)
    }
  },
  methods: {
    validateTime(rule, value, callback) {
      if (!this.datesData) {
        callback(new Error('请选择时间'))
      } else {
        const params = {
          insureCompanyChannelId: this.roleForm.insureCompanyChannelId,
          startTime: dayjs(this.datesData[0]).valueOf(),
          expireTime: dayjs(this.datesData[1]).valueOf(),
          id: this.roleForm.id
        }
        if (this.isCopy) delete params.id
        policyExistTime(params)
          .then(res => {
            if (res.data) {
              callback(new Error('与该工号下其他政策的生效时间重叠'))
            } else {
              callback()
            }
          })
          .catch(err => {
            console.warn(err)
          })
      }
    },
    validateExpireTime(rule, value, callback) {
      const params = {
        insureCompanyChannelId: this.roleForm.insureCompanyChannelId,
        startTime: dayjs(this.roleForm.startTime).valueOf(),
        expireTime: dayjs(this.roleForm.expireTime).valueOf(),
        id: this.roleForm.id
      }
      if (this.isCopy) delete params.id
      policyExistTime(params)
        .then(res => {
          if (res.data) {
            callback(new Error('与该工号下其他政策的生效时间重叠'))
          } else {
            callback()
          }
        })
        .catch(err => {
          console.warn(err)
        })
    },
    getInsureInfo(id) {
      queryPolicy(id)
        .then(res => {
          this.isLoading = false
          this.roleForm = res.data
          this.roleForm.num = res.data.insureCompanyChannelId
          this.datesData = [res.data.startTime, res.data.expireTime]
        })
        .catch(err => {
          console.warn(err)
          this.isLoading = false
        })
    },
    getInsureNum() {
      const blcs = this.$store.getters.userAll.data.belongCompanys
      const maxItem = blcs.sort((a, b) => b.level - a.level)[0]
      policyAddBelongCompany([maxItem.id])
        .then(res => {
          this.companyData.data = res.data.filter(item => item.channelName)
          this.companyData.data.map(item => (item.id = item.id.toString()))
        })
        .catch(err => {
          console.warn(err)
        })
    },
    setInsureNum(val) {
      const obj = this.companyData.data.find(item => {
        return item.id === val
      })
      this.roleForm.createrCompanyId = obj.belongCompany
      this.roleForm.channelCode = obj.sourceId
      this.roleForm.name = obj.channelName
      this.roleForm.insureCompanyChannelId = obj.id
    },
    setDate(val) {
      this.roleForm.expireTime = val + ':00'
    },
    getDate(val) {
      console.log(val)
      this.roleForm.startTime = val[0] + ':00'
      this.roleForm.expireTime = val[1] + ':00'
    }
  }
}
</script>

<style lang="scss">
.add-insure-policy {
  padding: 20px;
  .el-form-item {
    width: 90%;
    margin-top: 20px;
    .el-select {
      width: 100%;
    }
    .el-date-editor {
      width: 100%;
    }
    .is-picker-input {
      .el-input__inner {
        padding-right: 0px;
      }
    }
  }
}
</style>

