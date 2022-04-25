<template>
  <div v-loading="isLoading" class="manual-recording app-container" style="flex: 1;width:100%;">
    <head-info title="客户详情" info="" />
    <div class="app-panel">
      <!-- <scrollactive
        :offset="110"
        :scroll-offset="90"
        class="menu"
        active-class="a_active"
        scroll-container-selector=".customerwrap"
      > -->
      <scrollactive
        :offset="150"
        :scroll-offset="10"
        class="menu"
        active-class="a_active"
        scroll-container-selector=".customerwrap"
      >
        <a href="#customerinfo" class="scrollactive-item">客户信息</a>
        <a href="#carinfo" class="scrollactive-item">车辆信息</a>
        <a href="#preInsure" class="scrollactive-item">往年投保</a>
        <a href="#quoteRecord" class="scrollactive-item">报价记录</a>
        <a href="#followRecord" class="scrollactive-item">跟进记录</a>
      </scrollactive>
      <div class="customerwrap">
        <detail-form
          :customer-detail-data = "customerDetailData"
          :car-info-list="carInfoList"
          :customer-id="customerId"
          @refreshDetail="refreshDetail"
        />
      </div>
      <div class="bottom-menu">
        <el-button type="primary" size="small" @click="goBack">返回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
// import RecordForm from '@/views/businessmanagement/policy/recording/form'
// import InfoDisplay from '@/views/businessmanagement/policy/components/infoDisplay'
// import EditPolicy from '@/views/businessmanagement/policy/components/editPolicy'
import DetailForm from '@/views/customermanagement/components/detailform'
// import { policyMixin } from '@/views/businessmanagement/mixin.js'
import {
  updateOrSavePolicy,
  updatePolicyOrOrder
} from '@/api/policy_management'
import { mapGetters } from 'vuex'

export default {
  name: 'CustomerDetail',
  components: {
    DetailForm
  },
  // mixins: [policyMixin],
  props: {
    // 传入客户id
    customerId: {
      type: String,
      default: null
    },
    customerDetailData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    carInfoList: {
      type: Object,
      default: () => {}
    },
    // salemanList: { // 业务员
    //   type: Array,
    //   default: () => {
    //     return []
    //   }
    // },
    isLoading: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    return {
      customerDetail: []
      // isLoading: false
    }
  },
  computed: {
    ...mapGetters(['isSubAdminChannel']),
    // 打开类型，1.保单查看，2.保单编辑，3.订单查看，4.订单编辑，5.手动录单
    type() {
      const policyProps = sessionStorage.getItem('policyProps') || '{}'
      const checkType = JSON.parse(policyProps).checkType || null
      const type = this.checkType || checkType
      return type
    },
    // 保单id
    id() {
      const policyProps = sessionStorage.getItem('policyProps') || '{}'
      const policyId = JSON.parse(policyProps).policyId || null
      const id = this.policyId || policyId
      return id
    }
  },
  mounted() {
  },
  created() {
    console.log(11111)
    console.log(this.customerDetailData)
  },
  methods: {
    // 编辑保单提交
    submitPolicy() {
      this.isLoading = true
      const policyDetail = this.policyDetail
      const policyExt = policyDetail.policyExt
      const {
        organizationName,
        organizationId,
        vciPolicyNo,
        tciPolicyNo,
        userName,
        userId,
        id: policyId
      } = policyExt
      const params = {
        identity: 2,
        policyId,
        organizationName,
        organizationId,
        vciPolicyNo,
        tciPolicyNo,
        userName,
        userId,
        up: policyDetail.upFormality,
        agency: policyDetail.agencyFormality,
        sale: policyDetail.saleFormality,
        remark: policyDetail.remark.remark,
        remarkId: policyDetail.remark.id
      }
      updatePolicyOrOrder(params)
        .then(res => {
          this.$emit('cancel')
          this.isLoading = false
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        })
        .catch(err => {
          this.isLoading = false
          console.log(err)
        })
    },

    // 手动录单提交
    updateOrSavePolicy() {
      // this.isLoading = true
      this.$refs['recordForm'].$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.policyDetail.riskList = this.objToArray(this.policyDetail.riskMap)
          updateOrSavePolicy(this.policyDetail)
            .then(res => {
              this.$emit('cancel')
              this.isLoading = false
              this.$message({
                message: '保存成功',
                type: 'success'
              })
            })
            .catch(err => {
              this.isLoading = false
              this.$message.error(err)
              console.warn(err)
            })
        } else {
          console.log('校验不通过')
          return false
        }
      })
    },
    // 刷新客户详情页面
    refreshDetail(val) {
      this.$emit('refreshDetail')
    },
    goBack() {
      this.$emit('cancel')
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
    font-size: 15px;
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
      flex: 2;
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
