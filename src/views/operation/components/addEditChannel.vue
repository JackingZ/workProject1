<template>
  <div v-loading="data.isLoading" class="app-container addChannel">
    <el-form
      ref="addEditChannel"
      :model="data.channelForm"
      :rules="data.rules"
      label-width="115px"
      label-position="left">
      <div class="header-line">基础信息</div>
      <el-form-item label="渠道简称：" prop="shortName">
        <el-input v-model="data.channelForm.shortName" size="small"/>
      </el-form-item>
      <el-form-item label="渠道编码：" prop="outCode">
        <el-input v-model="data.channelForm.outCode" :disabled="isEdit" size="small"/>
      </el-form-item>
      <el-form-item label="渠道全称：" prop="fullName">
        <el-input v-model="data.channelForm.fullName" size="small"/>
      </el-form-item>
      <el-form-item label="总部地区：" prop="orgArea">
        <el-cascader
          :options="data.areaList"
          v-model="data.channelForm.orgArea"
          size="small"
          style="width: 100%;"/>
      </el-form-item>
      <el-form-item label="渠道性质：" prop="type">
        <el-select
          v-model="data.channelForm.type"
          :disabled="isEdit"
          size="small"
          placeholder="请选择渠道"
          style="width: 100%;"
          @change="$emit('onChannelType', $event)">
          <el-option
            value="1"
            label="代理渠道"/>
          <el-option
            value="2"
            label="分销渠道"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="data.channelForm.type == 2" label="关联渠道：" prop="proxyChannelCode">
        <el-select
          v-model="data.channelForm.proxyChannelCode"
          :disabled="isEdit"
          size="small"
          clearable
          filterable
          placeholder="请选择关联渠道"
          style="width: 100%;">
          <el-option
            v-for="item in data.channelList"
            :key="item.code"
            :label="item.shortName"
            :value="item.code"/>
        </el-select>
      </el-form-item>
      <el-form-item label="客户性质：" prop="customerProperty">
        <el-select
          v-model="data.channelForm.customerProperty"
          clearable
          size="small"
          placeholder="请选择客户性质"
          style="width: 100%;">
          <el-option
            :value="1"
            label="经代公司"/>
          <el-option
            :value="2"
            label="科技公司"/>
          <el-option
            :value="3"
            label="车商"/>
          <el-option
            :value="4"
            label="其他"/>
        </el-select>
      </el-form-item>
      <el-form-item label="客户类型：" prop="customerType">
        <el-select
          v-model="data.channelForm.customerType"
          clearable
          size="small"
          placeholder="请选择客户类型"
          style="width: 100%;"
          @change="handleCustomerType">
          <el-option
            :value="1"
            label="正式客户"/>
          <el-option
            :value="2"
            label="试用客户"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="data.channelForm.customerType == 1" label="合作方式：" prop="cooperationType">
        <!-- <el-cascader
          :options="cooperationTypeData"
          v-model="data.channelForm.cooperationType"
          :props="cooperationTypProps"
          style="width: 100%;"
          clearable
          size="small"
          @change="$emit('onChannelType', $event)"/> -->
        <el-select
          v-model="data.channelForm.cooperationType"
          size="small"
          placeholder="请选择合作方式"
          clearable
          style="width: 100%;"
          @change="handleCooperationType">
          <el-option
            :value="1"
            label="中介版"/>
          <el-option
            :value="2"
            label="API接口"/>
          <el-option
            :value="3"
            label="车商版"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="data.channelForm.customerType == 1&&data.channelForm.cooperationType == 2" label="API对接：" prop="apiType">
        <el-select
          v-model="data.channelForm.apiType"
          size="small"
          clearable
          placeholder="请选择API对接方式"
          style="width: 100%;">
          <el-option
            :value="1"
            label="模拟API"/>
          <el-option
            :value="2"
            label="接口API"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="data.channelForm.customerType == 1" label="计费方式：" prop="chargeType">
        <el-select
          v-model="data.channelForm.chargeType"
          clearable
          size="small"
          placeholder="计费方式"
          style="width: 100%;">
          <el-option
            :value="1"
            label="年费"/>
          <el-option
            :value="2"
            label="流量费"/>
        </el-select>
      </el-form-item>
      <el-form-item label="商务负责人：" prop="businessPrincipalId">
        <el-select
          v-model="data.channelForm.businessPrincipalId"
          size="small"
          clearable
          filterable
          placeholder="请选择商务负责人"
          style="width: 100%;">
          <el-option
            v-for="item in data.businessLeaderList"
            :key="item.id"
            :label="item.idName"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="起止时间：" prop="date">
        <el-date-picker
          v-model="data.channelForm.date"
          unlink-panels
          size="small"
          style="width: 100%;"
          type="daterange"
          range-separator="-"
          start-placeholder="起始时间"
          end-placeholder="过期时间"
          value-format="timestamp"/>
      </el-form-item>
      <el-form-item label="列表排序：" prop="sort">
        <el-input v-model="data.channelForm.sort" placeholder="数字越大，排序越前" size="small"/>
      </el-form-item>
      <el-form-item v-if="!isEdit" label="状态：" prop="status">
        <el-radio-group v-model="data.channelForm.status">
          <el-radio :label="0">启用</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>

      <div class="header-line">其他信息</div>

      <!--<el-form-item label="管理员账号：" prop="admin.userName">-->
      <!--<el-input v-model="data.channelForm.admin.userName" :disabled="isEdit" size="small"/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="姓名：" prop="admin.nickName">-->
      <!--<el-input v-model="data.channelForm.admin.nickName" size="small"/>-->
      <!--</el-form-item>-->
      <el-form-item
        class="contract-agreement"
        label="合同协议：">
        <el-upload
          ref="uploadfile"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-upload="beforeFileUpload"
          :on-success="onUploadSuccess"
          :headers="{ 'Authorization': token }"
          :action="uploadUrl"
          :file-list="uploadlist"
          :limit="1"
          style="display: inline-block;" >
          <el-button style="font-size: 14px;" type="primary" size="small">选择文件</el-button>
        </el-upload>
        <!-- <span>{{ fileName }}</span> -->
        <el-button v-show="data.channelForm.cooperationAgreementImgUrl" style="font-size: 14px;margin-left:10px;" type="text" size="small" @click="viewPdfFile">预览</el-button>
        <span v-show="!data.channelForm.cooperationAgreementImgUrl" style="color: #909399;font-size:12px;margin-left:10px;">无任何文件</span>
      </el-form-item>
      <el-form-item label="联系手机：" prop="phone">
        <el-input v-model="data.channelForm.phone" size="small"/>
      </el-form-item>

      <el-form-item label="联系人：" prop="contact">
        <el-input v-model="data.channelForm.contact" size="small"/>
      </el-form-item>

      <!--<el-form-item label="同步账号：" prop="userName">-->
      <!--<el-input v-model="data.channelForm.userName" size="small"/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="同步密码：" prop="passWord">-->
      <!--<el-input v-model="data.channelForm.passWord" size="small"/>-->
      <!--</el-form-item>-->

      <el-form-item label="联系地址：" prop="address">
        <el-input v-model="data.channelForm.address" size="small"/>
      </el-form-item>

      <el-form-item label="联系邮箱：" prop="email">
        <el-input v-model="data.channelForm.email" size="small"/>
      </el-form-item>
      <el-form-item label="备注：" prop="backUp">
        <el-input v-model="data.channelForm.backUp" size="small"/>
      </el-form-item>

      <div class="header-line">合作区域</div>
      <el-form-item v-for="(item,i) in data.channelForm.cooperationAreas" :key="i" label="地区&保司：" class="area-company" prop="policyArea">
        <el-select
          v-model="data.channelForm.cooperationAreas[i].policyAreaCode"
          size="small"
          placeholder="请选择地区"
          style="width: 152px;">
          <el-option
            v-for="item in addressList"
            :key="item.name"
            :label="item.name"
            :value="item.id" />
        </el-select>
        <el-select
          v-model="data.channelForm.cooperationAreas[i].insureCompanyIds"
          multiple
          collapse-tags
          filterable
          size="small"
          placeholder="请选择保司"
          style="width: 152px;line-height:38px"
          @remove-tag="removeTag"
          @change="handleCompanyChange">
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id" />
        </el-select>
        <span v-if="i===0" style="margin-left:5px;">
          <i type="primary" style="font-size:20px;color:#409eff;" class="el-icon-circle-plus-outline" @click="addAreaItem"/>
        </span>
        <span v-else style="margin-left:5px;">
          <i type="primary" style="font-size:20px;color:#FF0000;" class="el-icon-remove-outline" @click="deleteAreaItem(i)"/>
        </span>
      </el-form-item>

      <div class="header-line">渠道权限</div>

      <!-- <el-form-item v-if="data.channelForm.type == 1" label="是否车商渠道:" prop="carDealer">
        <el-radio-group v-model="data.channelForm.carDealer" :disabled="isEdit">
          <el-radio :label="1">否</el-radio>
          <el-radio :label="0">是</el-radio>
        </el-radio-group>
      </el-form-item> -->

      <el-form-item label="渠道权限" prop="permissionIds">
        <el-tree
          ref="tree"
          :data="data.permissionList"
          :props="data.props"
          :default-checked-keys="data.channelForm.permissionIds"
          show-checkbox
          node-key="key"/>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
import { getToken, getTokenType } from '@/utils/auth'
// import {
//   getPolicyAreasData,
//   getCompanysData } from '@/api/accounturl'
export default {
  name: 'AddEditChannel',
  props: {
    data: {
      type: Object,
      default() {
        return {
          isLoading: false
        }
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    addressList: {
      type: Array,
      default() {
        return []
      }
    },
    companyList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      token: `${getTokenType()} ${getToken()}`,
      uploadUrl: `${process.env.SERVER_URL}${process.env.API_ENV}/oauth/image-upload/up`,
      uploadlist: [],
      cooperationTypProps: {
        value: 'value',
        children: 'children'
      },
      cooperationTypeData: [{
        value: '1',
        label: '中介版',
        children: [{
          value: '0001',
          label: '年费'
        },
        {
          value: '0002',
          label: '流量费'
        }]
      },
      {
        value: '2',
        label: 'API接口',
        children: [{
          value: '0001',
          label: '年费'
        },
        {
          value: '0002',
          label: '流量费'
        }]
      },
      {
        value: '3',
        label: '车商版',
        children: [{
          value: '0001',
          label: '年费'
        },
        {
          value: '0002',
          label: '流量费'
        }]
      }]
      // companyList: { // 保险公司列表
      //   loading: false,
      //   data: []
      // }
    }
  },
  methods: {
    onUploadSuccess(res, file) {
      console.log(res)
      this.uploadlist = []
      // this.dialogLoading = fals
      // this.dialogUp = false
      this.data.channelForm.cooperationAgreementImgUrl = res.url
      this.$message({
        type: 'success',
        message: '上传成功'
      })
      this.uploadlist = []
      console.log('this.uploadlist', this.uploadlist)
      // this.getRenewalList()
      // this.getTodayUploadSum()
    },
    beforeFileUpload(file) {
      console.log('file的类型', file.type)
      if (file.type !== 'application/pdf') {
        this.$message.error('只支持上传pdf格式文件!')
        return false
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    addAreaItem() {
      this.$emit('addAreaData')
    },
    deleteAreaItem(index) {
      this.$emit('deleteAreaData', index)
    },
    viewPdfFile() {
      if (!this.data.channelForm.cooperationAgreementImgUrl) {
        this.$message({
          type: 'warning',
          message: '请先上传文件'
        })
        return
      }
      this.$emit('handleViewFile', this.data.channelForm.cooperationAgreementImgUrl)
    },
    // 客户类型变化
    handleCustomerType() {
      if (this.data.channelForm.customerType === 2) {
        this.data.channelForm.cooperationType = undefined
        this.data.channelForm.chargeType = undefined
        this.data.channelForm.apiType = undefined
      }
    },
    // 接口类型变化
    handleCooperationType() {
      if (this.data.channelForm.customerType === 1 && this.data.channelForm.cooperationType === 2) {
        this.data.channelForm.apiType = undefined
      }
    },
    // 保司变化
    handleCompanyChange() {
      this.data.channelForm.cooperationAreas.forEach(item => {
        console.log('保司的值', item.insureCompanyIds)
        // const hasAll = item.insureCompanyIds.some(info => { return info === -1 })
        // if (item.insureCompanyIds.length >= 2 && hasAll) {
        //   item.insureCompanyIds = [-1]
        // }
        // if (hasAll) {
        //   item.insureCompanyIds = [...this.companyList.map(i => i.id)]
        // }
        if (item.insureCompanyIds.length === 0) {
          this.$message({
            type: 'warning',
            message: '保司不能为空'
          })
          item.insureCompanyIds = [-1]
          return
        }
      })
    },
    removeTag(e) {
      console.log('删除标签', e)
    }
  }
}
</script>

<style lang="scss" scoped>
  .header-line {
    border-bottom: 1px #DCDFE6 solid;
    color: #909399;
    padding: 10px 0;
    margin-bottom: 20px;
  }
  .addChannel{
     .el-upload-list__item-name{
      float:right;
      margin-left: 20px;
     }
    .el-upload-list.el-upload-list--text{
      float:right;
      margin-left: 20px;
    }
  }

</style>
<style lang="scss">
    .area-company{
    .el-form-item__label:before{
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }
  // .contract-agreement{
  //     .el-form-item__label:before{
  //     content: '*';
  //     color: #f56c6c;
  //     margin-right: 4px;
  //   }
  // }
</style>
