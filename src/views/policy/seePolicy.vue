<template>
  <div class="see-policy-form">
    <el-form ref="seePolicy" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="政策可见：" prop="policy">
        <el-select v-model="form.policy" size="small" @change="getChangeDate">
          <el-option v-for="item in policySeeData" :key="item.key" :label="item.value" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item label="可见机构：" prop="wrap" class="is-required">
        <el-tree ref="tree" :data="channelData" :props="defaultProps" :default-checked-keys="defaultCheckCompany" check-strictly node-key="key" show-checkbox @check="companyClick" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { policyParentsTree, policySeeCompany } from '@/api/policy'
export default {
  props: {
    policyData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      form: {
        wrap: [],
        policy: '1',
        isSubmit: false
      },
      rules: {
        policy: [
          { required: true, message: '请选择可见上级', trigger: 'change' }
        ]
      },
      policySeeData: [
        { key: '1', value: '同投保地直属上级' },
        { key: '2', value: '全部直属上级' }
      ],
      channelData: [],
      defaultCheckCompany: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  created() {
    this.getSeeChannelTree(this.policyData.createrCompanyId, this.form.policy)
    this.getSeeCompany(this.policyData.id)
  },
  methods: {
    // 获取机构树
    getSeeChannelTree(id, type) {
      policyParentsTree(id, type)
        .then(res => {
          this.channelData = res.data
          if (!this.channelData || this.channelData.length <= 0) {
            this.form.isSubmit = true
          }
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 获取选中的机构
    getSeeCompany(id) {
      policySeeCompany(id)
        .then(res => {
          const arr = []
          const wrap = []
          res.data.map(item => {
            const obj = {
              companyId: item.companyId,
              strategyId: item.strategyId
            }
            arr.push(item.companyId)
            wrap.push(obj)
          })
          this.defaultCheckCompany = arr
          this.form.wrap = wrap
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 选中机构
    companyClick() {
      const comArr = this.$refs.tree.getCheckedKeys()
      const wrap = []
      comArr.map(item => {
        const obj = {
          companyId: item,
          strategyId: this.policyData.id
        }
        wrap.push(obj)
      })
      this.form.wrap = wrap
    },
    // 切换政策可见
    getChangeDate(val) {
      this.form.policy = val
      this.getSeeChannelTree(this.policyData.createrCompanyId, this.form.policy)
    }
  }
}
</script>

<style lang="scss">
.see-policy-form {
  padding: 30px 20px;
  .el-form-item {
    margin-bottom: 10px;
    .el-form-item__label {
      float: none;
    }
    .el-form-item__content {
      margin-left: 0px !important;
      width: 100%;
    }
  }
}
</style>
