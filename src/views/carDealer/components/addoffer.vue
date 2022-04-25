<template>
  <!--查看 start -->
  <div class="addOfferAll">
    <div style="padding-bottom:20px;width:100%;margin:auto;">
      <div class="addOffermain">
        <el-form ref="offerForm" :model="offerForm" :rules="addOfferRrules" label-width="100px">
          <div class="grid-content">
            <el-form-item label="保险公司" prop="companyId">
              <el-select v-model="offerForm.companyId" clearable filterable placeholder="请选择保险公司" size="small">
                <el-option v-for="item in companylist" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item label="车牌">
              <el-input v-model="offerForm.licenseNo" size="small" placeholder="请输入车牌号" @change="checkCarNo" />
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item label="车架号">
              <el-input v-model="offerForm.frameNo" size="small" placeholder="请输入车架号" @change="handleframeNo" />
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item label="商业险">
              <el-input v-model.number="offerForm.vciPremium" maxlength="5" size="small" placeholder="请输入商业险（元）" @change="handlevciPremium" />
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item label="交强险">
              <el-input v-model.number="offerForm.tciPremium" maxlength="5" size="small" placeholder="请输入交强险（元）" @change="handletciPremium" />
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item label="车船税">
              <el-input v-model.number="offerForm.vehicleTax" maxlength="5" size="small" placeholder="请输入车船税（元）" @change="handlevehicleTax" />
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item label="总金额">
              <el-input v-model.number="offerForm.totalPremium" :disabled="true" size="small" placeholder="请输入总金额" />
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item label="报价时间" prop="startDate">
              <el-date-picker v-model="offerForm.startDate" :clearable="false" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="timestamp" size="small" placeholder="选择报价时间" />
            </el-form-item>
          </div>
          <div class="grid-content imgFile">
            <el-form-item label="详情图片">
              <el-upload :show-file-list="false" :auto-upload="false" :on-change="imageFileChange" :action="idUrl" :class="{'avatar-uploader': !uploaderSuccess, 'avatar-uploader-success': uploaderSuccess}">
                <img v-if="imageFileUrl" :src="imageFileUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
                <div slot="tip" style="text-align:center; padding-top:4px;">
                  <el-button v-if="imageFileUrl" size="mini" round style="font-size:12px; margin-bottom:4px;" @click="delImgUplaod">删除照片</el-button>
                </div>
              </el-upload>
            </el-form-item>
          </div>
          <div class="grid-content">
            <el-form-item label="详情链接">
              <el-input v-model="offerForm.fileline" size="small" placeholder="链接" />
            </el-form-item>
          </div>
          <div style="padding:20px 0;text-align:center;">
            <el-button size="small" type="primary" @click="offerFormBtn">保存报价信息</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { getInsuredCompany, addQuoteInfo } from '@/api/mytask'
import dayjs from 'dayjs'
export default {
  name: 'Addoffer',
  components: {},
  props: {
    rowAddOfferList: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      companylist: [],
      errorTip: false,
      idUrl: `${
        process.env.SERVER_URL
      }/upload?uploadHandle=http://120.27.21.67${
        process.env.API_ENV
      }/icar/ocr/identityCard`,
      imageFileUrl: '',
      imageFile: '',
      offerForm: {
        companyId: '',
        licenseNo: '',
        frameNo: '',
        vciPremium: '',
        tciPremium: '',
        vehicleTax: '',
        totalPremium: '',
        startDate: new Date(dayjs().format('YYYY-MM-DD HH:mm:ss')).getTime(),
        fileline: ''
      },
      addOfferRrules: {
        companyId: [
          {
            required: true,
            message: '请选择保险公司!',
            trigger: 'change blur'
          }
        ],
        startDate: [
          {
            required: true,
            message: '请输入报价时间!',
            trigger: 'change'
          }
        ]
      },
      uploaderSuccess: false
    }
  },
  created() {
    this.offerForm.licenseNo = this.rowAddOfferList.licenseNo
    this.offerForm.frameNo = this.rowAddOfferList.frameNo
    this.offerForm.uuid = this.rowAddOfferList.uuid
    // 获取保险公司
    getInsuredCompany()
      .then(res => {
        this.companylist = res.data
      })
      .catch(err => {
        console.warn(err)
      })
  },
  methods: {
    // 车牌检测
    checkCarNo(value) {
      const reg = /^(([\u4e00-\u9fa5]{1}[A-Z]{1})[-]?|([wW][Jj][\u4e00-\u9fa5]{1}[-]?)|([a-zA-Z]{2}))([A-Za-z0-9]{5}|[DdFf][A-HJ-NP-Za-hj-np-z0-9][0-9]{4}|[0-9]{5}[DdFf])$/
      if (value && new RegExp(reg).test(value)) {
        this.errorTip = false
      } else {
        this.$message({
          message: '请输入正确的车牌',
          type: 'warning'
        })
        this.offerForm.licenseNo = ''
      }
    },
    // 车架号不能输入中文
    handleframeNo(value) {
      const reg = /^[a-z0-9]+$/i
      if (value && new RegExp(reg).test(value)) {
        this.errorTip = false
      } else {
        this.$message({
          message: '请输入正确的车架号，只能是英文字母或数字，不能输入中文。',
          type: 'warning'
        })
        this.offerForm.frameNo = ''
      }
    },
    // 交强险保费
    handletciPremium(value) {
      const reg = /^\d+(?=\.{0,1}\d+$|$)/
      if (value && new RegExp(reg).test(value)) {
        this.offerForm.tciPremium = parseFloat(
          this.offerForm.tciPremium
        ).toFixed(2)
      } else {
        this.$message({
          message: '请输入正确的数值（大于0的正数）。',
          type: 'warning'
        })
        this.offerForm.tciPremium = ''
      }
      this.offerForm.totalPremium =
        Number(this.offerForm.vciPremium) +
        Number(this.offerForm.tciPremium) +
        Number(this.offerForm.vehicleTax)
    },
    // 商业险保费
    handlevciPremium(value) {
      const reg = /^\d+(?=\.{0,1}\d+$|$)/
      if (value && new RegExp(reg).test(value)) {
        this.offerForm.vciPremium = parseFloat(
          this.offerForm.vciPremium
        ).toFixed(2)
      } else {
        this.$message({
          message: '请输入正确的数值（大于0的正数）。',
          type: 'warning'
        })
        this.offerForm.vciPremium = ''
      }
      this.offerForm.totalPremium =
        Number(this.offerForm.vciPremium) +
        Number(this.offerForm.tciPremium) +
        Number(this.offerForm.vehicleTax)
    },
    // 车船税
    handlevehicleTax(value) {
      const reg = /^\d+(?=\.{0,1}\d+$|$)/
      if (value && new RegExp(reg).test(value)) {
        this.offerForm.vehicleTax = parseFloat(
          this.offerForm.vehicleTax
        ).toFixed(2)
      } else {
        this.$message({
          message: '请输入正确的数值（大于0的正数）。',
          type: 'warning'
        })
        this.offerForm.vehicleTax = ''
      }
      this.offerForm.totalPremium =
        Number(this.offerForm.vciPremium) +
        Number(this.offerForm.tciPremium) +
        Number(this.offerForm.vehicleTax)
    },
    // 改变上传图片 限制格式和大小
    imageFileChange(file) {
      const isLt2M = file.raw.size / 1024 / 1024 < 2
      if (!/(jpg|jpeg|JPG|JPEG|png|PNG)$/.test(file.raw.type)) {
        this.$message.warning('只能上传JPG/PNG格式!')
        return
      }
      if (!isLt2M) {
        this.$message.warning('上传图片大小不能超过2MB!')
        return
      }
      this.imageFileUrl = URL.createObjectURL(file.raw)
      this.imageFile = file.raw
      this.uploaderSuccess = true
    },
    // 删除上传图片
    delImgUplaod() {
      this.imageFileUrl = ''
      this.imageFile = ''
      this.uploaderSuccess = false
    },
    // 保存
    offerFormBtn() {
      if (this.offerForm.companyId === '') {
        this.$message.warning('请选择保险公司!')
        return
      }
      if (this.offerForm.licenseNo || this.offerForm.frameNo) {
        const formData = new FormData()
        formData.append('file', this.imageFile)
        const infoData = {
          companyId: this.offerForm.companyId, // 保险公司
          licenseNo: this.offerForm.licenseNo, // 车牌号
          frameNo: this.offerForm.frameNo, // 车架号
          vciPremium: this.offerForm.vciPremium, // 商业险
          tciPremium: this.offerForm.tciPremium, // 交强险
          vehicleTax: this.offerForm.vehicleTax, // 车船税
          totalPremium: this.offerForm.totalPremium, // 总金额
          quoteTime: this.offerForm.startDate, // 报价时间
          url: this.offerForm.fileline, // 弹窗备注
          uuid: this.offerForm.uuid
        }
        formData.append('info', JSON.stringify(infoData))
        addQuoteInfo(formData)
          .then(res => {
            this.$emit('getAddOfferOk', true)
            this.$message({
              message: res.msg,
              type: 'success'
            })
          })
          .catch(err => {
            console.warn(err)
          })
      } else {
        this.$message.error('车牌号，车架号至少填一项')
      }
    }
  }
}
</script>
<style lang="scss">
.addOfferAll {
  .el-select {
    width: 100%;
  }
  .el-date-editor {
    width: 100%;
  }
  .el-input {
    width: 100%;
  }
}
.imgFile {
   .el-upload {
      display: block !important;
   }
}
</style>
<style lang="scss" scoped>
.addOfferAll {
  padding: 20px;
}
.imgFile {
  padding: 10px;
  overflow: hidden;
  width: 100%;
  .avatar-uploader {
    display: block;
    margin-right: 10px;
    width: 100%;
    .el-upload {
      width: 100%;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      padding: 0 4px;
    }
    .el-upload:hover {
      border-color: #409eff;
    }
  }
  .avatar-uploader-success {
    display: block;
    margin-right: 10px;
    width: 100%;
    .el-upload {
      width: 100%;
      border: 0!important;
    }
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 100px;
    line-height: 100px;
    text-align: center;
    padding: 0 4px;
    box-sizing: border-box;
  }

  .avatar {
    width: 140px;
    height: 100px;
    display: block;
  }
}
</style>
