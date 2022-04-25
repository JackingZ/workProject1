<template>
  <div class="wrap-content">
    <div id="customerinfo" class="item-header" >客户信息</div>
    <div style="float:left; width:33%;" class="wrap-left">
      <div class="customer_logo" >
        <div>
          <img src="@/assets/imgs/customerinfo.png" alt="">
        </div>
        <div style="margin-left:10%;">
          <div class="info" style="font-weight:bold;">--</div>
          <div class="info" style="background: #409EFF; margin-top:10px;"> -- </div>
          <div class="info" style="background: #E6A23C; margin-top:10px;"> -- </div>
        </div>
      </div>
    </div>

    <el-form
      ref="customertForm"
      :model="customer"
      :rules="rule1"
      label-width="130px"
      class="demo-ruleForm"
      label-position="right"
    >
      <el-form-item label="客户姓名：" prop="name">
        <el-input v-model="customer.name" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="客户电话：" prop="phone">
        <el-input v-model="customer.phone" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="录入时间：">
        <el-input v-model="novalueName" size="small" disabled placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="录入来源：">
        <el-input v-model="novalueName" size="small" disabled placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="客户备注：" prop="backup">
        <el-input v-model="customer.backup" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="往年投保：" prop="insureCompanyId">
        <el-select
          :loading="companyList.loading"
          v-model="customer.insureCompanyId"
          size="small"
          clearable
          filterable
          placeholder="请选择"
          style="width: 100%;"
          @focus="getCompanyList"
        >
          <el-option
            v-for="item in companyList.data"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="商业险止期：" prop="vciEndDate">
        <el-date-picker
          v-model="customer.vciEndDate"
          :clearable="false"
          size="small"
          style="width: 100%;margin-right: 10px;"
          format="yyyy-MM-dd 23:59:59"
          value-format="yyyy-MM-dd 23:59:59"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="交强险止期：" prop="tciEndDate">
        <el-date-picker
          v-model="customer.tciEndDate"
          :clearable="false"
          size="small"
          style="width: 100%; margin-right: 10px;"
          format="yyyy-MM-dd 23:59:59"
          value-format="yyyy-MM-dd 23:59:59"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item
        :rules="[
        { required: true, message: '请选择所属机构', trigger: 'change' }]"
        label="所属机构："
        prop="organizationId">
        <my-tree-select
          :options="orgDataList"
          v-model="customer.organizationId"
          :normalizer="normalizer"
          no-options-text="数据加载中..."
          no-children-text=""
          style="width:100%;display: inline-block;vertical-align: top;margin-right: 10px;"
          class="filter"
          placeholder="选择机构"
          no-results-text="未找到结果"
          @open="getOrgDataList"
        />
      </el-form-item>
      <el-form-item label="业务员：" prop="salesId">
        <el-select
          v-model="customer.salesId"
          :loading="salemanList.loading"
          size="small"
          clearable
          filterable
          placeholder="请选择"
          style="width: 100%;"
          @focus="getSalemanList"
        >
          <el-option
            v-for="item in salemanList.data"
            :key="item.id"
            :value="item.id"
            :label="item.fullName"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <!-- <div class="" style="line-height:40px;height:40px;font-size:14px;color:#606266;border-bottom:1px solid #E4E4E4;margin-bottom:10px;">车主信息</div> -->
    <div class="inner-header m-b">
      <div class="title">车主信息</div>
    </div>
    <el-form
      ref="applicantForm"
      :model="applicant"
      :rules="rules2"
      label-width="130px"
      class="demo-ruleForm"
      label-position="right"
    >
      <el-form-item label="姓名：" prop="ownerName">
        <el-input v-model="applicant.ownerName" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="证件类型：" prop="ownerIdTypes">
        <el-cascader
          v-model="applicant.ownerIdTypes"
          :options="applicantNatureList"
          :props="idCardProps"
          style="width:100%;"
          placeholder="请选择"
          size="small"
        />
      </el-form-item>
      <el-form-item label="证件号码：" prop="ownerIdNo">
        <el-input v-model="applicant.ownerIdNo" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="手机号：" prop="ownerPhone">
        <el-input v-model="applicant.ownerPhone" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="联系邮箱：" prop="ownerEmail">
        <el-input v-model="applicant.ownerEmail" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="联系地址：" prop="ownerAddr">
        <el-input v-model="applicant.ownerAddr" size="small" placeholder="请输入"/>
      </el-form-item>
      <div class="inner-header m-b">
        <div class="title">被保人信息</div>
        <el-radio-group v-model="applicant.insuredEqual" size="medium" @change="onOwnerCheck">
          <el-radio :label="1" size="medium">同车主</el-radio>
          <el-radio :label="3" size="medium">其他</el-radio>
        </el-radio-group>
      </div>
      <template v-if="applicant.insuredEqual===3">
        <el-form-item label="姓名：" prop="insuredName">
          <el-input v-model="applicant.insuredName" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="证件类型：" prop="insuredIdTypes">
          <el-cascader
            v-model="applicant.insuredIdTypes"
            :options="applicantNatureList"
            :props="idCardProps"
            placeholder="请选择"
            size="small"
          />
        </el-form-item>
        <el-form-item label="证件号码：" prop="insuredIdNo">
          <el-input v-model="applicant.insuredIdNo" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="手机号：" prop="insuredPhone">
          <el-input v-model="applicant.insuredPhone" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="联系邮箱：" prop="insuredEmail">
          <el-input v-model="applicant.insuredEmail" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="联系地址：" prop="insuredAddr">
          <el-input v-model="applicant.insuredAddr" size="small" placeholder="请输入"/>
        </el-form-item>
      </template>
      <div class="inner-header m-b">
        <div class="title">投保人信息</div>
        <el-radio-group v-model="applicant.holderEqual" size="medium" @change="onInsuredRadio">
          <el-radio :label="1" size="medium">同车主</el-radio>
          <el-radio :label="2" size="medium">同被保人</el-radio>
          <el-radio :label="3" size="medium">其他</el-radio>
        </el-radio-group>
      </div>
      <template v-if="applicant.holderEqual === 3">
        <el-form-item label="姓名：" prop="holderName">
          <el-input v-model="applicant.holderName" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="证件类型：" prop="holderIdTypes">
          <el-cascader
            v-model="applicant.holderIdTypes"
            :options="applicantNatureList"
            :props="idCardProps"
            placeholder="请选择"
            size="small"
          />
        </el-form-item>
        <el-form-item label="证件号码：" prop="holderIdNo">
          <el-input v-model="applicant.holderIdNo" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="手机号：" prop="holderPhone">
          <el-input v-model="applicant.holderPhone" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="联系邮箱：" prop="holderEmail">
          <el-input v-model="applicant.holderEmail" size="small" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="联系地址：" prop="holderAddr">
          <el-input v-model="applicant.holderAddr" size="small" placeholder="请输入"/>
        </el-form-item>
      </template>
    </el-form>
    <div id="carinfo" class="item-header m-b">车辆信息</div>
    <el-form
      ref="carForm"
      :model="carInfo"
      :rules="rule3"
      label-width="130px"
      class="demo-ruleForm"
      label-position="right"
    >
      <el-form-item prop="name" label="车辆年限：">
        <el-select
          value="--"
          disabled
          clearable
          filterable
          placeholder="--"
          size="small"
        >
          <el-option label="" value="" />
        </el-select>
      </el-form-item>
      <el-form-item prop="licenseNo" label="车牌号：">
        <el-input v-model="carInfo.licenseNo" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item prop="frameNo" label="车架号：">
        <el-input v-model="carInfo.frameNo" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="发动机号：" prop="engineNo">
        <el-input v-model="carInfo.engineNo" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="品牌型号：" prop="brandName">
        <el-input v-model="carInfo.brandName" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="车型编码：" prop="modelCode">
        <el-input v-model="carInfo.modelCode" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="初登日期：" prop="enrollDate">
        <el-date-picker
          v-model="carInfo.enrollDate"
          type="date"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择日期"
          size="small"
        />
      </el-form-item>
      <el-form-item label="新车购置价(元)：" prop="purchasePrice">
        <el-input v-model="carInfo.purchasePrice" size="small" type="number" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="核定座位数(座)：" prop="seatCount">
        <el-input v-model="carInfo.seatCount" size="small" type="number" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="交管车辆类型：" prop="vehicleType">
        <el-select
          v-model="carInfo.vehicleType"
          clearable
          filterable
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in vehicleTypeList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="使用性质：" prop="useNature">
        <el-select
          v-model="carInfo.useNature"
          clearable
          filterable
          placeholder="请选择"
          size="small"
          @change="onUseNature"
        >
          <el-option
            v-for="item in useNatureList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="使用性质细分：" prop="name">
        <el-select
          v-model="carInfo.attachNature"
          :disabled="!carInfo.useNature"
          clearable
          filterable
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in attachList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="排量/功率(L/KW)：" prop="name">
        <el-input v-model="carInfo.displacement" size="small" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="能源类型：" prop="name">
        <el-select
          v-model="carInfo.energyType"
          clearable
          filterable
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in energyTypeList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车辆过户：" prop="transfer">
        <el-select
          v-model="carInfo.transfer"
          clearable
          filterable
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in transferList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="carInfo.transfer === 0" label="过户日期：" prop="transferDate">
        <el-date-picker
          v-model="carInfo.transferDate"
          :picker-options="pickerRange"
          type="date"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期"/>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  getCarInfoList
} from '@/api/policy_management'
import { queryCustomerSaleman } from '@/api/newCustomer'
import MyTreeSelect from '@/components/MyTreeSelect'
import { formmixin } from '@/views/customermanagement/formmixin.js'
import { mapGetters } from 'vuex'

export default {
  name: 'InsertCustomer',
  components: {
    MyTreeSelect
  },
  mixins: [formmixin],
  props: {
  },
  data() {
    return {
      pickerRange: {
        disabledDate(time) {
          return time.getTime() + 365 * 60 * 60 * 24 * 1000 < Date.now()
        }
      },
      customer: { // 客户信息
        backup: '',
        insureCompanyId: '',
        name: '',
        phone: '',
        salesId: '',
        tciEndDate: '', // 交强险止期
        vciEndDate: '', // 商业险止期
        organizationId: ''
      },
      applicant: { // 关系人信息
        ownerName: '',
        ownerIdTypes: [],
        ownerIdNo: '',
        ownerPhone: '',
        owerEmail: '',
        owerAddr: '',
        insuredName: '',
        insuredIdTypes: [],
        insuredPhone: '',
        insuredEmail: '',
        insuredIdNo: '',
        insuredAddr: '',
        insuredEqual: 1,
        holderName: '',
        holderIdTypes: [],
        holderPhone: '',
        holderEmail: '',
        holderAddr: '',
        holderEqual: 1, // 是否同车主
        holderIdNo: ''

      },
      carInfo: { // 车辆信息
        attachNature: '',
        brandName: '',
        displacement: '',
        energyType: '',
        engineNo: '',
        enrollDate: '',
        frameNo: '',
        licenseNo: '',
        modelCode: '',
        purchasePrice: '',
        seatCount: '',
        transfer: 1,
        transferDate: '',
        useNature: '',
        vehicleType: ''
      },
      source_loading: false,
      customerType_loading: false,
      saleman_loading: false,
      //   carCategoryDetailList: [], // 车辆种类细分
      //   attachList: [], // 车辆使用性质细分
      idCardProps: {
        value: 'code',
        label: 'name',
        children: 'children'
      },
      carInfoList: {
        // 获取车辆基础信息字典
        loading: false,
        data: {}
      },
      attachList: [], // 车辆使用性质细分
      transferList: [{ key: 0, value: '是' }, { key: 1, value: '否' }],
      newOrOldCarList: [
        { key: '1', value: '新车' },
        { key: '2', value: '旧车' }
      ],
      novalueName: '--',
      salemanList: { // 业务员
        data: [],
        loading: false
      },
      rules2: {},
      rules3: {}
    //   ruleForm: {
    //     name: '',
    //     check: '',
    //     checkbox: false,
    //     selectItem: '',
    //     date: ''
    //   },
    //   list: [],
    //   rules: {},
    //   showInsure: true,
    //   showInsured: true
    }
  },
  computed: {
    ...mapGetters(['isSubAdminChannel']),
    // applicant() {
    //   return this.selectCustomerValue.applicant || {}
    // },
    // carInfo() { // 车辆信息
    //   return this.selectCustomerValue.carInfo || {}
    // },
    // customer() {
    //   return this.selectCustomerValue.customer || {}
    // },
    // 车辆信息相关字典
    carInfoDictionary() {
      return this.carInfoList.data || {}
    },
    // 证件类型
    applicantNatureList() {
      return this.carInfoDictionary.applicantNatureList || []
    },
    // 车辆种类细分
    customList() {
      return this.carInfoDictionary.customList || []
    },
    // 号牌底色
    plateColorList() {
      return this.carInfoDictionary.plateColorList || []
    },
    // 交管车辆类型
    vehicleTypeList() {
      return this.carInfoDictionary.vehicleTypeList || []
    },
    // 使用性质
    useNatureList() {
      return this.carInfoDictionary.useNatureList || []
    },
    // 能源类型
    energyTypeList() {
      return this.carInfoDictionary.energyTypeList || []
    },
    // 使用性质细分
    attachNatureList() {
      return this.carInfoDictionary.attachNatureList || []
    },
    // 号牌种类
    plateTypeList() {
      return this.carInfoDictionary.plateTypeList || []
    },
    // 车辆种类
    vehicleSortList() {
      return this.carInfoDictionary.vehicleSortList || []
    }
  },
  watch: {
    // 监听车辆使用性质
    'carInfo.useNature': {
      deep: true,
      handler(newVal) {
        // console.log('车辆新增有变化', newVal)
        if (newVal) {
          const list = this.attachNatureList.filter(item => item.parentCode === newVal)
          this.attachList = list
        } else {
          this.carInfo.attachNature = ''
        }
      }
    }
  },
  created() {
    this.getCarInfo()
    console.log('车辆信息')
    console.log(this.carInfoList.data)
  },
  methods: {
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
    // 获取业务员
    getSalemanList() {
      if (!this.customer.organizationId) {
        this.$message({
          message: '请先选择所属机构',
          type: 'warning'
        })
        return
      }
      this.salemanList.loading = true
      const params = [this.customer.organizationId]
      queryCustomerSaleman(params).then(res => {
        this.salemanList.loading = false
        // console.log(res)
        res.data.forEach(item => {
          item.fullName = item.idName + '--' + item.phone
        })
        this.salemanList.data = res.data
      }).catch(err => {
        this.salemanList.loading = false
        console.warn(err)
      })
    },
    // 被保人信息单选改变时触发
    onOwnerCheck(e) {
      this.selectCustomerValue.applicant.insuredName = ''
      this.selectCustomerValue.applicant.insuredIdTypes = []
      this.selectCustomerValue.applicant.insuredIdNo = ''
      this.selectCustomerValue.applicant.insuredPhone = ''
      this.selectCustomerValue.applicant.insuredEmail = ''
      this.selectCustomerValue.applicant.insuredAddr = ''
    },
    // 投保人信息单选改变时触发
    onInsuredRadio(e) {
      this.selectCustomerValue.applicant.holderName = ''
      this.selectCustomerValue.applicant.holderIdTypes = []
      this.selectCustomerValue.applicant.holderIdNo = ''
      this.selectCustomerValue.applicant.holderPhone = ''
      this.selectCustomerValue.applicant.holderAddr = ''
      this.selectCustomerValue.applicant.holderEmail = ''
    },
    // 监听使用性质
    onUseNature() {
      // console.log('使用性质', this.carInfo.useNature)
      if (this.carInfo.useNature === '100') {
        this.carInfo.attachNature = ''
      }
    },
    // 获取车辆相关基础信息字典
    getCarInfo() {
      this.carInfoList.loading = true
      getCarInfoList()
        .then(res => {
          this.carInfoList.loading = false
          this.carInfoList.data = res.data
        })
        .catch(err => {
          this.carInfoList.loading = false
          console.warn(err)
        })
    }
  }
}
</script>
<style lang="scss">
.el-tree-select-dropdown {
  .el-tree {
    width: 271.55px;
    height: 300px;
    overflow: auto;
  }
  .el-tree-node > .el-tree-node__children {
    overflow: visible;
  }
}
</style>
<style lang="scss">
.wrap-left{
    .customer_logo{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 60px 20px;
        overflow: hidden;
        img{
            width:180px;
            height:180px;
        }
        .info{
        width:140px;
        height: 30px;
        line-height:30px;
        border-radius: 50px;
        text-align:center
     }
   }
}
</style>
