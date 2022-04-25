<template>
  <div v-loading="isLoading" ref="channelConfigAdd" class="app-container">
    <div class="header-line">车险前端配置</div>
    <el-row type="flex" style="margin-bottom: 20px;">
      <el-col :span="6">
        <span>渠道logo：</span>
      </el-col>
      <el-col :span="18">
        <el-upload
          id="upl"
          ref="upl"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleUpload"
          :headers="{ 'Authorization':token }"
          :multiple="false"
          :disabled="false"
          :file-list="imageUrl"
          :limit="1"
          :action="upload"
          list-type="picture-card">
          <i class="el-icon-plus"/>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img :src="data.data.wrap.config1.data" width="100%" alt="">
        </el-dialog>
      </el-col>
    </el-row>

    <el-row type="flex" style="margin-bottom: 20px;">
      <el-col :span="6"><span>渠道链接：</span></el-col>
      <el-col :span="18">
        <el-input
          :rows="2"
          v-model="data.data.wrap.config13.data"
          disabled
          type="textarea"
          size="small"
          placeholder="请输入"
          style="width: 300px;"/>
      </el-col>
    </el-row>
    <!-- <el-row type="flex" style="margin-bottom: 20px;" align="middle">
      <el-col :span="6"><span>续保查询上限：</span>
      </el-col>
      <el-col :span="18">
        <el-input v-model="data.data.wrap.config26.data" size="small" placeholder="请填写" style="width: 300px;" disabled>
          <template slot="append">次/天</template>
        </el-input>
      </el-col>
    </el-row> -->
    <el-row type="flex" style="margin-bottom: 20px;" align="middle">
      <el-col :span="6"><span>批量续保上限：</span>
        <!-- <el-tooltip effect="dark" content="个人业务员使用手机端访问H5时，单人每天可报价的次数上限（后台-移动出单不做限制）" placement="top-start">
          <i class="el-icon-info" style="color: #909399;"/>
        </el-tooltip> -->
      </el-col>
      <el-col :span="18">
        <el-input v-model="data.data.wrap.config14.data" size="small" placeholder="请填写" style="width: 300px;" disabled>
          <template slot="append">次/天</template>
        </el-input>
      </el-col>
    </el-row>
    <el-row type="flex" style="margin-bottom: 20px;">
      <el-col :span="6">
        <span>是否推送数据：</span>
      </el-col>
      <el-col :span="18">
        <el-radio-group v-model="data.data.wrap.config19.flag">
          <el-radio :label="1">否</el-radio>
          <el-radio :label="2">是</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>

    <!-- <el-form v-if="data.data.wrap.config19.flag===2" ref="channelConfig" :rules="configRules" :model="channelConfig" label-width="100px" class="demo-ruleForm">
      <el-form-item label="报价提交推送：" prop="quoteSubmit">
        <el-input v-model="channelConfig.quoteSubmit" size="small" style="width: 300px;"/>
      </el-form-item>
      <el-form-item label="核保提交推送：" prop="insureSubmit" >
        <el-input v-model="channelConfig.quoteSubmit" size="small" style="width: 300px;" />
      </el-form-item>
      <el-form-item label="核保成功推送：" prop="insureSuc" >
        <el-input v-model="channelConfig.insureSuc" size="small" style="width: 300px;" />
      </el-form-item>
      <el-form-item label="承保成功推送：" prop="underwriterSuc" >
        <el-input v-model="channelConfig.underwriterSuc" size="small" style="width: 300px;" />
      </el-form-item>
    </el-form> -->
    <div v-if="data.data.wrap.config19.flag===2">
      <el-row style="margin-bottom:20px;" type="flex" align="middle">
        <el-col :span="6">
          <span>报价提交推送：</span>
        </el-col>
        <el-col :span="18">
          <el-input
            v-model="data.data.wrap.config20.data"
            size="small"
            placeholder="请输入地址"
            style="width: 300px;" />
        </el-col>
      </el-row>
      <!-- <el-row style="margin-bottom:20px;" type="flex" align="middle">
        <el-col :span="6">
          <span/>
        </el-col>
        <el-col :span="18">
          <span class="warmtxt">请输入报价提交推送地址</span>
        </el-col>
      </el-row> -->

      <el-row style="margin-bottom:20px;" type="flex" align="middle">
        <el-col :span="6">
          <span>核保提交推送：</span>
        </el-col>
        <el-col :span="18">
          <el-input
            v-model="data.data.wrap.config21.data"
            size="small"
            placeholder="请输入地址"
            style="width: 300px;" />
        </el-col>
      </el-row>
      <!-- <el-row v-if="configUrl.warmShow2" :style=" configUrl.warmShow2 ?'margin-bottom:8px;':''" type="flex" align="middle">
        <el-col :span="6">
          <span/>
        </el-col>
        <el-col :span="18">
          <span class="warmtxt">请输入核保提交推送地址</span>
        </el-col>
      </el-row> -->

      <el-row style="margin-bottom:20px;" type="flex" align="middle">
        <el-col :span="6">
          <span>核保成功推送：</span>
        </el-col>
        <el-col :span="18">
          <el-input
            v-model="data.data.wrap.config22.data"
            size="small"
            placeholder="请输入地址"
            style="width: 300px;" />
        </el-col>
      </el-row>
      <!-- <el-row v-if="configUrl.warmShow3" :style="configUrl.warmShow3 ?'margin-bottom:8px;':''" type="flex" align="middle">
        <el-col :span="6">
          <span/>
        </el-col>
        <el-col :span="18">
          <span class="warmtxt">请输入核保成功推送地址</span>
        </el-col>
      </el-row> -->

      <el-row style="margin-bottom:20px;" type="flex" align="middle">
        <el-col :span="6">
          <span>承保成功推送：</span>
        </el-col>
        <el-col :span="18">
          <el-input
            v-model="data.data.wrap.config23.data"
            size="small"
            placeholder="请输入地址"
            style="width: 300px;" />
        </el-col>
        <!-- </el-row>
      <el-row v-if="configUrl.warmShow4" :style="configUrl.warmShow4 ?'margin-bottom:8px;':''" type="flex" align="middle">
        <el-col :span="6">
          <span/>
        </el-col>
        <el-col :span="18">
          <span class="warmtxt">请输入承保成功推送地址</span>
        </el-col>
      </el-row> -->
    </el-row></div>

    <!-- <el-row type="flex" align="middle" style="margin-bottom: 20px;">
      <el-col :span="6">
        <span>是否计费渠道：</span>
      </el-col>
      <el-col :span="18">
        <el-radio-group v-model="data.data.wrap.config12.flag">
          <el-radio :label="1">否</el-radio>
          <el-radio :label="0">是</el-radio>
        </el-radio-group>
      </el-col>
    </el-row> -->

    <el-row type="flex" align="middle" style="margin-bottom: 20px;">
      <el-col :span="6">
        <span>是否需要注册：</span>
      </el-col>
      <el-col :span="18">
        <el-radio-group v-model="data.data.wrap.config2.data[0]">
          <el-radio v-for="item in data.data.option.config102" :label="item.code" :key="item.code">{{ item.value1 }}</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>

    <el-row type="flex" align="middle" style="margin-bottom: 20px;">
      <el-col :span="6">
        <span>是否需要验证：</span>
      </el-col>
      <el-col :span="18">
        <el-radio-group v-model="data.data.wrap.config3.flag">
          <el-radio :label="1">否</el-radio>
          <el-radio :label="0">是</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>

    <el-row type="flex" align="middle" style="margin-bottom: 20px;">
      <el-col :span="6">
        <span>是否需要签名：</span>
      </el-col>
      <el-col :span="18">
        <el-radio-group v-model="data.data.wrap.config7.flag">
          <el-radio :label="1">否</el-radio>
          <el-radio :label="0">是</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>

    <el-row type="flex" align="middle" style="margin-bottom: 20px;">
      <el-col :span="6">
        <span>披露信息：</span>
      </el-col>
      <el-col :span="18">
        <el-radio-group v-model="data.data.wrap.config4.data">
          <el-radio :label="undefined">无</el-radio>
          <el-radio v-for="item in data.data.option.r101" :key="item.code" :label="item.code">{{ item.value1 }}</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>

    <el-row type="flex" align="middle" style="margin-bottom: 20px;">
      <el-col :span="6">
        <span>菜单可见：</span>
      </el-col>
      <el-col :span="18">
        <el-checkbox-group v-model="data.data.wrap.config5.data">
          <el-checkbox v-for="item in data.data.option.r102" :key="item.code" :label="item.code">{{ item.value1 }}</el-checkbox>
        </el-checkbox-group>
      </el-col>
    </el-row>

    <el-row type="flex" align="middle" style="margin-bottom: 20px;">
      <el-col :span="6">
        <span>代理查询续保：</span>
      </el-col>
      <el-col :span="18">
        <el-radio-group v-model="data.data.wrap.config16.data">
          <el-radio :label="1">所有工号</el-radio>
          <el-radio :label="2">自用工号</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>

    <el-row type="flex" style="margin-bottom: 20px;">
      <el-col :span="6">
        <span>前端查询续保：</span>
      </el-col>
      <el-col :span="18">
        <el-radio-group v-model="data.data.wrap.config17.data">
          <el-radio :label="3">快速查询</el-radio>
          <el-radio :label="1">标准查询</el-radio>
          <el-radio :label="2">精准查询</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>

    <el-row type="flex" style="margin-bottom: 20px;">
      <el-col :span="6">
        <span>批量查询续保：</span>
      </el-col>
      <el-col :span="18">
        <el-radio-group v-model="data.data.wrap.config18.data">
          <el-radio :label="3">快速查询</el-radio>
          <el-radio :label="1">标准查询</el-radio>
          <el-radio :label="2">精准查询</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>

    <div v-if="Number(channelType) === 2">
      <div class="header-line">分销渠道配置</div>
      <el-row type="flex" style="margin-bottom: 20px;">
        <el-col :span="6">
          <span>分配渠道模式：</span>
        </el-col>
        {{ data.data.wrap.config10.data }}
        <el-col :span="18">
          <el-radio-group v-model="data.data.wrap.config10.data">

            <!--<el-radio :label="undefined">无</el-radio>-->
            <el-radio v-for="item in data.data.option.r105" :key="item.code" :label="item.code">{{ item.value1 }}</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>

      <el-row type="flex" style="margin-bottom: 20px;">
        <el-col :span="6">
          <span>工号使用权限：</span>
        </el-col>
        <el-col :span="18">
          <el-checkbox-group v-model="data.data.wrap.config15.data">
            <el-checkbox v-for="item in data.data.option.r106" :key="item.code" :label="item.code">{{ item.value1 }}</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
    </div>

    <div class="header-line">车主平台配置</div>

    <el-row type="flex" style="margin-bottom: 20px;">
      <el-col :span="6">
        <span>车主平台版本：</span>
      </el-col>
      <el-col :span="18">
        <el-radio-group v-model="data.data.wrap.config9.data">
          <el-radio :label="undefined">无</el-radio>
          <el-radio v-for="item in data.data.option.r104" :key="item.code" :label="item.code">{{ item.value1 }}</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>

    <div class="header-line">渠道计费设置（流量计费渠道 / 使用报价短信，必填）</div>

    <el-row type="flex" style="margin-bottom: 20px;">
      <el-col :span="6">
        <span>开通报价短信：</span>
      </el-col>
      <el-col :span="18">
        <el-radio-group v-model="data.data.wrap.config25.data.subscription">
          <el-radio :label="1">否</el-radio>
          <el-radio :label="0">是</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <div v-if="JSON.stringify(data.data.wrap.config25.data.subscription) === '0'">
      <el-row type="flex" style="margin-bottom: 20px;" align="middle">
        <el-col :span="6">
          <span>短信计费标准：</span>
        </el-col>
        <el-col :span="18">
          <el-input v-model="data.data.wrap.config25.data.price" size="small" style="width: 300px;">
            <template slot="append">元/条</template>
          </el-input>
        </el-col>
      </el-row>
      <el-row type="flex" style="margin-bottom: 20px;" align="middle">
        <el-col :span="6">
          <span>人均发送上限：</span>
        </el-col>
        <el-col :span="18">
          <el-input v-model="data.data.wrap.config25.data.limit" size="small" style="width: 300px;">
            <template slot="append">条/天/人</template>
          </el-input>
        </el-col>
      </el-row>
      <el-row type="flex" style="margin-bottom: 20px;" align="middle">
        <el-col :span="6">
          <span>短信模板内容：</span>
        </el-col>
        <el-col :span="18">
          <el-input v-model="data.data.wrap.config25.data.sms" :rows="3" size="small" style="width: 300px;" type="textarea" placeholder="请输入短信模板内容" />
        </el-col>
      </el-row>
    </div>
    <!--<el-card shadow="never">-->
    <!--<div slot="header">-->
    <!--<span>单项配置</span>-->
    <!--</div>-->
    <!--<el-row>-->
    <!--<el-col :span="8" style="text-align: center;">-->
    <!--<div class="radio-title">是否需要注册</div>-->
    <!--<el-radio-group v-model="data.data.wrap.config2.flag">-->
    <!--<el-radio :label="0">是</el-radio>-->
    <!--<el-radio :label="1">否</el-radio>-->
    <!--</el-radio-group>-->
    <!--</el-col>-->
    <!--<el-col :span="8" style="text-align: center;">-->
    <!--<div class="radio-title">是否需要验证</div>-->
    <!--<el-radio-group v-model="data.data.wrap.config3.flag">-->
    <!--<el-radio :label="0">是</el-radio>-->
    <!--<el-radio :label="1">否</el-radio>-->
    <!--</el-radio-group>-->
    <!--</el-col>-->
    <!--<el-col :span="8" style="text-align: center;">-->
    <!--<div class="radio-title">是否需要签名</div>-->
    <!--<el-radio-group v-model="data.data.wrap.config7.flag">-->
    <!--<el-radio :label="0">是</el-radio>-->
    <!--<el-radio :label="1">否</el-radio>-->
    <!--</el-radio-group>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!--</el-card>-->

    <!--<el-card style="margin: 20px 0;" shadow="never">-->
    <!--<div slot="header">-->
    <!--<span>多项配置</span>-->
    <!--</div>-->
    <!--<div class="gutter">-->
    <!--<div class="radio-title">披露信息选项</div>-->
    <!--<el-radio-group v-model="data.data.wrap.config4.data">-->
    <!--<el-radio :label="undefined">无</el-radio>-->
    <!--<el-radio v-for="item in data.data.option.r101" :key="item.code" :label="item.code">{{ item.value1 }}</el-radio>-->
    <!--</el-radio-group>-->
    <!--</div>-->
    <!--<div class="gutter">-->
    <!--<div class="radio-title">车主平台版本</div>-->
    <!--<el-radio-group v-model="data.data.wrap.config9.data">-->
    <!--<el-radio :label="undefined">无</el-radio>-->
    <!--<el-radio v-for="item in data.data.option.r104" :key="item.code" :label="item.code">{{ item.value1 }}</el-radio>-->
    <!--</el-radio-group>-->
    <!--</div>-->
    <!--<div class="gutter">-->
    <!--<div class="radio-title">前端菜单可见</div>-->
    <!--<el-checkbox-group v-model="data.data.wrap.config5.data">-->
    <!--<el-checkbox v-for="item in data.data.option.r102" :key="item.code" :label="item.code">{{ item.value1 }}</el-checkbox>-->
    <!--</el-checkbox-group>-->
    <!--</div>-->
    <!--<div class="gutter">-->
    <!--<div class="radio-title">分配渠道模式</div>-->
    <!--<el-radio-group v-model="data.data.wrap.config10.data">-->
    <!--<el-radio :label="undefined">无</el-radio>-->
    <!--<el-radio v-for="item in data.data.option.r105" :key="item.code" :label="item.code">{{ item.value1 }}</el-radio>-->
    <!--</el-radio-group>-->
    <!--</div>-->
    <!--</el-card>-->

    <!--<el-card style="margin: 20px 0;" shadow="never">-->
    <!--<div slot="header">-->
    <!--<span>输入配置</span>-->
    <!--</div>-->
    <!--<div class="radio-title">服务器地址</div>-->
    <!--<el-input v-model="data.data.wrap.config8.data" placeholder="请输入" style="width: 300px;"/>-->
    <!--</el-card>-->

    <!--<el-card style="margin: 20px 0;" shadow="never">-->
    <!--<div slot="header">-->
    <!--<span>Logo配置</span>-->
    <!--</div>-->
    <!--<el-upload-->
    <!--:show-file-list="false"-->
    <!--:on-success="handleAvatarSuccess"-->
    <!--class="avatar-uploader"-->
    <!--action="https://jsonplaceholder.typicode.com/posts/">-->
    <!--<img v-if="data.data.wrap.config1.data" :src="data.data.wrap.config1.data" class="avatar">-->
    <!--<i v-else class="el-icon-plus avatar-uploader-icon"/>-->
    <!--</el-upload>-->
    <!--<el-upload-->
    <!--id="upl"-->
    <!--ref="upl"-->
    <!--:on-preview="handlePictureCardPreview"-->
    <!--:on-remove="handleRemove"-->
    <!--:on-success="handleUpload"-->
    <!--:headers="{ 'Authorization':token }"-->
    <!--:multiple="false"-->
    <!--:disabled="false"-->
    <!--:file-list="imageUrl"-->
    <!--:limit="1"-->
    <!--action="https://www.ybinsure.com/t/oauth/image-upload/up"-->
    <!--list-type="picture-card">-->
    <!--<i class="el-icon-plus"/>-->
    <!--</el-upload>-->
    <!--<el-dialog :visible.sync="dialogVisible">-->
    <!--<img :src="data.data.wrap.config1.data" width="100%" alt="">-->
    <!--</el-dialog>-->
    <!--</el-card>-->
  </div>
</template>

<script>
import { getToken, getTokenType } from '@/utils/auth'

export default {
  name: 'AddChannelConfig',
  props: {
    channelType: {
      type: [String, Number],
      default: null
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    // configUrl: {
    //   type: Object,
    //   default() {
    //     return {
    //       warmShow1: false,
    //       warmShow2: false,
    //       warmShow3: false,
    //       warmShow4: false
    //     }
    //   }
    // },
    data: {
      type: Object,
      default() {
        return {
          isLoading: false,
          title: '添加配置',
          data: {
            wrap: {
              config1: { data: '' },
              config2: { flag: 1 },
              config3: { flag: 1 },
              config4: { data: undefined },
              config5: { data: [] },
              // config6: {},
              config7: { flag: 1 },
              config9: { data: undefined },
              config10: { data: '2' },
              // config12: { flag: 1 },
              config13: { data: '' },
              config14: { data: '' },
              // config26: { data: '' },
              config15: { data: [] },
              config16: { data: 1 },
              config17: { data: 1 },
              config18: { data: 1 },
              config19: { flag: 1 },
              config20: { data: '' },
              config21: { data: '' },
              config22: { data: '' },
              config23: { data: '' },
              config25: {
                code: '',
                value: '',
                data: {
                  subscription: 1,
                  price: '',
                  sms: '',
                  limit: ''
                }
              }
            },
            option: {}
          },
          is: 1
        }
      }
    }
  },
  data() {
    return {
      upload: `${process.env.SERVER_URL}${process.env.API_ENV}/oauth/image-upload/up`,
      radio: 1,
      input: '',
      imageUrl: [],
      dialogVisible: false,
      url: `${process.env.SERVER_URL + process.env.API_ENV}/oauth/image-upload/up`,
      token: `${getTokenType()} ${getToken()}`
      // configRules: {
      //   quoteSubmit: [
      //     { required: true, message: '请输入报价提交推送地址', trigger: 'blur' }
      //   ],
      //   insureSubmit: [
      //     { required: true, message: '请输入核保提交推送地址', trigger: 'blur' }
      //   ],
      //   insureSuc: [
      //     { required: true, message: '请输入核保成功推送地址', trigger: 'blur' }
      //   ],
      //   underwriteSuc: [
      //     { required: true, message: '请输入承保成功推送地址', trigger: 'blur' }
      //   ]
      // },
      // channelConfig: {
      //   quoteSubmit: '',
      //   insureSubmit: '',
      //   insureSuc: '',
      //   underwriteSuc: ''
      // }
    }
  },
  watch: {
    'data.data.wrap.config1.data'(val) {
      if (val) {
        this.$refs.upl.$children[1].$el.style.display = 'none'
        this.imageUrl = [{ name: '', url: val }]
      } else {
        this.$refs.upl.$children[1].$el.style.display = 'inline-block'
        this.imageUrl = []
      }
    }
    // configUrl(newVal) {
    //   if (newVal) {
    //     console.log('变化了')
    //     this.configUrl = newVal
    //   }
    // },
    // deep: true
  },
  methods: {
    handleRemove(file, fileList) {
      this.$emit('changeImg', null)
    },
    handlePictureCardPreview(file) {
      // this.imageUrl = file.url
      this.dialogVisible = true
    },
    handleUpload(response, file, fileList) {
      this.$emit('changeImg', response.url)
    }
  }
}
</script>

<style scoped>
  .radio-title{
    margin: 10px 0;
  }
  .gutter{
    margin-bottom: 20px;
  }
  .header-line {
    border-bottom: 1px #DCDFE6 solid;
    color: #909399;
    padding: 10px 0;
    margin-bottom: 20px;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 80px;
    height: 80px;
  }
  span {
    font-size: 14px;
  }
  .warmtxt{
    font-size: 12px;
    color:red;
  }
</style>

<style>
  .el-upload--picture-card {
    width: 80px!important;
    height: 80px!important;
    line-height: 80px!important;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 80px!important;
    height: 80px!important;
  }
  .el-tooltip__popper {
    width: 200px;
  }
</style>
