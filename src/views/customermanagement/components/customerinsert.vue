<template>
  <div v-loading="isLoading" class="manual-recording app-container" style="flex: 1;">
    <head-info title="新增客户" info/>
    <div class="app-panel">
      <scrollactive
        :offset="120"
        :scroll-offset="100"
        class="menu"
        active-class="a_active"
        scroll-container-selector=".customerwrap"
      >
        <a href="#customerinfo" class="scrollactive-item">客户信息</a>
        <a href="#carinfo" class="scrollactive-item">车辆信息</a>
      </scrollactive>
      <div class="customerwrap">
        <insert-form
          ref="addForm"
        />
      </div>
      <div class="bottom-menu">
        <el-button size="small" @click="cancel">取消</el-button>
        <el-button type="primary" size="small" @click="confirm">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import InsertForm from '@/views/customermanagement/components/insertform'
import {
  addCustomerInfo
} from '@/api/newCustomer'
// import { policyMixin } from '@/views/businessmanagement/mixin.js'
// import {
//   updatePolicyOrOrder
// } from '@/api/policy_management'
import { mapGetters } from 'vuex'

export default {
  name: 'ManualRecording',
  components: {
    InsertForm
  },
  // mixins: [policyMixin],
  props: {
    // 传入客户id
    // customerId: {
    //   type: String,
    //   default: null
    // }
  },
  data() {
    return {
      isShow: true,
      isLoading: false,
      isEditPolicyShow: false
    }
  },
  computed: {
    ...mapGetters(['isSubAdminChannel'])
  },
  mounted() {
    this.isShow = true
    console.log('isManualEntry', this.isManualEntry)
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    confirm() {
      console.log('提交保存')
      const validCheckDom1 = this.$refs.addForm.$refs.customertForm
      const validCheckDom2 = this.$refs.addForm.$refs.carForm
      const params = {}
      params.applicant = this.$refs.addForm['applicant']
      params.applicant.ownerIdType = params.applicant.ownerIdTypes.length > 0 ? params.applicant.ownerIdTypes[1] : ''
      params.applicant.insuredIdType = params.applicant.insuredIdTypes.length > 0 ? params.applicant.ownerIdTypes[1] : ''
      params.applicant.holderIdType = params.applicant.holderIdTypes.length > 0 ? params.applicant.ownerIdTypes[1] : ''
      // delete params.applicant.ownerIdTypes
      // delete params.applicant.insuredIdTypes
      // delete params.applicant.holderIdTypes
      validCheckDom1.validate(valid => {
        if (valid) {
          params.customer = this.$refs.addForm['customer']
          // params.customer.id = this.customerId
          console.log(params)
          validCheckDom2.validate(valid2 => {
            if (valid2) {
              params.carInfo = this.$refs.addForm['carInfo']
              params.carInfo.transferDate = params.carInfo.transfer === 0 ? params.carInfo.transferDate : ''
              addCustomerInfo(params).then(res => {
                this.$refs.addForm.$refs.customertForm.resetFields()
                this.$refs.addForm.$refs.carForm.resetFields()
                this.$refs.addForm.$refs.applicantForm.resetFields()
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.$emit('confirm')
                console.log(res)
              })
            } else {
              this.$message({
                message: '请填写必填项',
                type: 'warning'
              })
              return false
            }
          })
        } else {
          this.$message({
            message: '请填写必填项',
            type: 'warning'
          })
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.manual-recording {
  .menu {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    z-index: 999;
    a {
      width: 133px;
      height: 40px;
      background-color: #666666;
      color: #ffffff;
      line-height: 40px;
      text-align: center;
      border: 1px solid #999999;
      margin-right: -1px;
    }
    a:hover {
      opacity: 0.9;
    }
  }
  .app-panel {
    padding-right: 0;
  }
  .a_active {
    background-color: #ffffff !important;
    color: #000000 !important;
  }
  .customerwrap {
    height: calc(100vh - 320px);
    overflow: auto;
    margin-top: 15px;
    padding-bottom: 300px;
    .el-date-editor.el-input {
      width: 100%;
    }
    .el-select {
      width: 100%;
    }
  }
  .customerwrap.change {
    height: calc(100vh - 180px);
  }
  .text-item {
    color: #606266;
    .el-form-item__label {
      font-weight: normal;
    }
  }
  .wrap-content {
    min-width: 1000px;
    padding-right: 15px;
  }
  .item-header {
    background: #f2f2f2;
    line-height: 40px;
    padding-left: 10px;
    font-size: 14px;
    font-weight: 700;
    color: #333333;
  }
  .el-form-item {
    display: inline-block;
    width: 33%;
  }
  .el-form {
    padding-top: 10px;
  }
  .divider {
    background: #e4e4e4;
    height: 1px;
  }
  .m-b {
    margin-bottom: 10px;
  }
  .m-tb {
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .mt-25 {
    margin-top: 25px;
  }
  .inner-header {
    display: flex;
    padding-left: 30px;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #e4e4e4;
    font-size: 14px;
    color:#606266;
    .title {
      margin-right: 30px;
    }
  }
  .risk-item {
    display: flex;
    line-height: 40px;
    background: #f5f8fa;
    font-size: 14px;
    font-weight: 700;
    font-style: normal;
    color: #999999;
  }
  .risk-display-item {
    display: flex;
    line-height: 32px;
    font-size: 14px;
    font-style: normal;
  }
  .border-t {
    border-top: 1px solid #e4e4e4;
  }
  .risk-form {
    .el-form-item__content {
      display: flex;
      margin-left: 0 !important;
    }
  }
  .el-form-item.risk-form {
    width: 100%;
    margin-bottom: 0px;
    .el-input-group__append {
      padding: 0 10px;
    }
  }
  .risk-item,
  .risk-display-item,
  .el-form-item__content {
    .item1 {
      flex: 2.7;
      padding-left: 40px;
    }
    .item2 {
      flex: 2;
      padding-right: 30px;
    }
    .item3 {
      flex: 1.2;
      padding-right: 15px;
    }
  }
  .bottom-menu {
    margin: 0 -20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: center;
    .el-button {
      padding: 9px 25px;
    }
  }
}
</style>
