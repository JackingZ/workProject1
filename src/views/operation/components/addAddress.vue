<template>
  <div class="app-container">
    <el-form
      ref="addAddress"
      :model="selectInfo"
      :rules="rules"
      label-width="115px"
      label-position="left">
      <el-form-item label="所属渠道：" prop="sourceCode1" style="margin-top:20px;">
        <el-select
          :disabled="isEdit"
          v-model="selectInfo.sourceCode1"
          size="small"
          clearable
          filterable
          placeholder="所属渠道"
          style="width: 280px;">
          <el-option
            v-for="item in channellist"
            :key="item.code"
            :label="item.shortName"
            :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="保监地区：" prop="areaCode1">
        <el-select
          :disabled="isEdit"
          v-model="selectInfo.areaCode1"
          size="small"
          clearable
          filterable
          placeholder="选择地区"
          style="margin-right: 10px;width: 280px;flex: 0 0 auto;">
          <el-option
            v-for="item in arealist"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="保险公司：" prop="companyId1">
        <el-select
          :disabled="isEdit"
          v-model="selectInfo.companyId1"
          size="small"
          clearable
          filterable
          placeholder="保险公司"
          style="margin-right: 10px;width: 280px;flex: 0 0 auto;">
          <el-option
            v-for="item in companylist"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="代理地址：" style="margin-left:10px" prop="proxyUrl1">
        <el-input v-model="selectInfo.proxyUrl1" size="small" style="width:280px;margin-left:-10px"/>
      </el-form-item>
      <el-form-item label="请求地址：" style="margin-left:10px" prop="reqUrl1">
        <el-input v-model="selectInfo.reqUrl1" size="small" style="width:280px;margin-left:-10px"/>
      </el-form-item>
      <el-form-item label="备注：" style="margin-left:10px" prop="remark1">
        <el-input v-model="selectInfo.remark1" size="small" style="width:280px;margin-left:-10px" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'AddAddress',
  props: {
    channellist: {
      type: Array,
      default() {}
    },
    arealist: {
      type: Array,
      default() {
        return {}
      }
    },
    companylist: {
      type: Array,
      default() {
        return {}
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const checkUrl = (rule, value, callback) => {
      if (!value) callback()
      // const regExp = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/
      const regExp = /[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/
      if (!regExp.test(value)) {
        callback(new Error('输入的地址格式不正确'))
      } else {
        callback()
      }
    }
    return {
      selectInfo: {
        sourceCode1: '',
        areaCode1: '',
        companyId1: '',
        proxyUrl1: '',
        reqUrl1: '',
        remark1: ''
      },
      rules: {
        sourceCode1: [
          { required: true, message: '渠道不能为空', trigger: 'change' }
        ],
        areaCode1: [
          { required: true, message: '保监地区不能为空', trigger: 'change' }
        ],
        companyId1: [
          { required: true, message: '保险公司不能为空', trigger: 'change' }
        ],
        proxyUrl1: [
          { required: false, message: '', trigger: 'bur' },
          { validator: checkUrl, trigger: 'bur' }
        ],
        reqUrl1: [
          { required: false, message: '', trigger: 'bur' },
          { validator: checkUrl, trigger: 'bur' }
        ],
        remark1: [
          { required: false, message: '', trigger: 'bur' }
        ]
      }
    }
  }
}
</script>

<style scoped>
  .header-line {
    border-bottom: 1px #DCDFE6 solid;
    color: #909399;
    padding: 10px 0;
    margin-bottom: 20px;
  }
</style>
