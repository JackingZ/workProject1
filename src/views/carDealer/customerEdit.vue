<template>
  <div v-loading="loading" class="edit-container">
    <el-form ref="ruleForm" :model="editForm" :rules="rules" label-position="left" label-width="140px" class="edit-customer-form">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="first">
          <el-form-item label="身份证证件相片：" prop="idPicture">
            <div style="font-size: 12px; color: #F56C6C;line-height: 40px;">备注：上传证件照自动识别下面信息</div>
            <div style="display: inline-block;">
              <el-upload v-loading="idfaceLoading" :show-file-list="false" :action="idUrl" :before-upload="beforeIdfaceUpload" :on-progress="handleIdfaceProgress" :on-success="handleIdfaceUpload">
                <img v-if="editForm.imageIdface" :src="editForm.imageIdface" style="width: 200px;height: 150px;display: block;">
                <div v-else class="icon-idface">
                  <svg-icon icon-class="idface" style="width: 200px;height: 150px;" />
                  <span class="word-idface">身份证正面</span>
                </div>
              </el-upload>
            </div>
            <div style="display: inline-block;">
              <el-upload v-loading="idbackLoading" :show-file-list="false" :action="idUrl" :before-upload="beforeIdbackUpload" :on-progress="handleIdbackProgress" :on-success="handleIdbackUpload">
                <img v-if="editForm.imageIdback" :src="editForm.imageIdback" style="width: 200px;height: 150px;display: block;">
                <div v-else class="icon-idback">
                  <svg-icon icon-class="idback" style="width: 200px;height: 150px;" />
                  <span class="word-idback">身份证反面</span>
                </div>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="姓名（车主）：">
            <el-input v-model="editForm.cardName" size="small" />
          </el-form-item>
          <el-form-item label="性别：" prop="ownerSex">
            <el-select v-model="editForm.ownerSex" style="width: 300px;" filterable placeholder="请选择" size="small">
              <el-option v-for="item in sexData" :key="item.key" :label="item.value" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话：" prop="ownerPhone">
            <el-input v-model="editForm.ownerPhone" size="small" />
          </el-form-item>
          <el-form-item label="证件类型：" prop="ownerCardType">
            <el-cascader v-model="editForm.ownerCardType" :options="cardOption" filterable placeholder="请选择证件类型" size="small" style="width: 300px;" @change="ownerCardChange" />
          </el-form-item>
          <el-form-item label="证件号：" prop="ownerIdNo">
            <el-input v-model="editForm.ownerIdNo" size="small" />
          </el-form-item>
          <el-form-item label="联系地址：" prop="ownerAddr">
            <el-input v-model="editForm.ownerAddr" size="small" />
          </el-form-item>
          <el-form-item label="邮箱：" prop="ownerEmail">
            <el-input v-model="editForm.ownerEmail" size="small" />
          </el-form-item>
          <el-form-item label="投保人：" prop="insuringPerson">
            <el-select v-model="editForm.insuringPerson" style="width: 300px;" filterable placeholder="请选择" size="small">
              <el-option v-for="item in insuringOption" :key="item.key" :label="item.value" :value="item.key" />
            </el-select>
          </el-form-item>

          <div v-if="editForm.insuringPerson === 1">
            <el-form-item label="姓名：" prop="holderName">
              <el-input v-model="editForm.holderName" size="small" />
            </el-form-item>
            <el-form-item label="证件类型:" prop="holderCardType">
              <el-cascader v-model="editForm.holderCardType" :options="cardOption" filterable placeholder="请选择证件类型" size="small" style="width: 300px;" @change="holderCardChange" />
            </el-form-item>
            <el-form-item label="证件号：" prop="holderIdNo">
              <el-input v-model="editForm.holderIdNo" size="small" />
            </el-form-item>
            <el-form-item label="性别：" prop="holderSex">
              <el-select v-model="editForm.holderSex" style="width: 300px;" clearable filterable placeholder="请选择" size="small">
                <el-option v-for="item in sexData" :key="item.key" :label="item.value" :value="item.key" />
              </el-select>
            </el-form-item>
            <el-form-item label="出生日期:" prop="holderBirthday ">
              <el-date-picker v-model="editForm.holderBirthday" :picker-options="pickerBirthday" type="date" style="width: 300px;" placeholder="选择日期" size="small" />
            </el-form-item>
            <el-form-item label="住址:" prop="holderAddr">
              <el-input v-model="editForm.holderAddr" size="small" />
            </el-form-item>
            <el-form-item label="电话:" prop="holderPhone">
              <el-input v-model="editForm.holderPhone" size="small" />
            </el-form-item>
          </div>

          <el-form-item label="被保人：" prop="insuredPerson">
            <el-select v-model="editForm.insuredPerson" style="width: 300px;" filterable placeholder="请选择" size="small">
              <el-option v-for="item in insuredOption" :key="item.key" :label="item.value" :value="item.key" />
            </el-select>
          </el-form-item>
          <div v-if="editForm.insuredPerson === 2">
            <el-form-item label="姓名：" prop="insuredName">
              <el-input v-model="editForm.insuredName" size="small" />
            </el-form-item>
            <el-form-item label="证件类型:" prop="insureCardType">
              <el-cascader v-model="editForm.insureCardType" :options="cardOption" filterable placeholder="请选择证件类型" size="small" style="width: 300px;" @change="insuredCardChange" />
            </el-form-item>
            <el-form-item label="证件号：" prop="insuredIdNo">
              <el-input v-model="editForm.insuredIdNo" size="small" />
            </el-form-item>
            <el-form-item label="性别：" prop="insuredSex">
              <el-select v-model="editForm.insuredSex" style="width: 300px;" clearable filterable placeholder="请选择" size="small">
                <el-option v-for="item in sexData" :key="item.key" :label="item.value" :value="item.key" />
              </el-select>
            </el-form-item>
            <el-form-item label="出生日期:" prop="insuredBirthday">
              <el-date-picker v-model="editForm.insuredBirthday" :picker-options="pickerBirthday" type="date" style="width: 300px;" placeholder="选择日期" size="small" />
            </el-form-item>
            <el-form-item label="住址:" prop="insuredAddr">
              <el-input v-model="editForm.insuredAddr" size="small" />
            </el-form-item>
            <el-form-item label="电话:" prop="insuredPhone">
              <el-input v-model="editForm.insuredPhone" size="small" />
            </el-form-item>
          </div>
        </el-tab-pane>

        <el-tab-pane label="车辆信息" name="second">
          <el-form-item label="上传行驶证：" prop="licenseImage">
            <div style="font-size: 12px; color: #F56C6C;line-height: 40px;">备注：上传行驶证自动识别下面信息</div>
            <div style="display: inline-block;">
              <el-upload v-loading="licensefaceLoading" :show-file-list="false" :action="licenseUrl" :before-upload="beforeLicensefaceUpload" :on-progress="handleLicensefaceProgress" :on-success="handleLicensefaceUpload">
                <img v-if="editForm.imagelicenseface" :src="editForm.imagelicenseface" style="width: 200px;height: 150px;display: block;">
                <div v-else class="icon-licenseface">
                  <svg-icon icon-class="licenseface" style="width: 200px;height: 150px;" />
                  <span class="word-licenseface">行驶证正本</span>
                </div>
              </el-upload>
            </div>
            <div style="display: inline-block;">
              <el-upload :show-file-list="false" :auto-upload="false" :before-upload="beforeLicensebackUpload" :on-change="handleLicensebackUpload" :action="licenseUrl">
                <img v-if="backImg" :src="backImg" style="width: 200px;height: 150px;display: block;">
                <div v-else class="icon-licenseback">
                  <svg-icon icon-class="licenseback" style="width: 200px;height: 150px;" />
                  <span class="word-licenseback">行驶证副本</span>
                </div>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="车主：" prop="ownerName">
            <el-input v-model="editForm.ownerName" size="small" />
          </el-form-item>
          <el-form-item label="车牌：" prop="licenseNo">
            <el-input v-model="editForm.licenseNo" :disabled="licenseDisable" size="small" />
            <div style="font-size: 12px; color: #999;line-height: 20px;">备注：新车可不录入车牌</div>
          </el-form-item>
          <el-form-item label="车架号：" prop="frameNo">
            <el-input v-model="editForm.frameNo" size="small" @blur="getFrameNoCarType"/>
          </el-form-item>
          <el-form-item label="发动机号：" prop="engineNo">
            <el-input v-model="editForm.engineNo" size="small"/>
          </el-form-item>
          <el-form-item label="车辆使用性质：" prop="useNature">
            <el-select v-model="editForm.useNature" style="width: 300px;" filterable placeholder="请选择" size="small">
              <el-option v-for="item in useNatureData" :key="item.key" :label="item.value" :value="item.key" />
            </el-select>
          </el-form-item>
          <div v-if="editForm.useNature === '200'">
            <el-form-item label="使用性质细分：" prop="attachNature">
              <el-select v-model="editForm.attachNature" style="width: 300px;" filterable placeholder="请选择" size="small">
                <el-option v-for="item in attachNatureData" :key="item.key" :label="item.value" :value="item.key" />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="车型：" prop="modelCode">
            <el-select v-model="editForm.modelCode" :loading="typeLoading" style="width: 300px;" filterable placeholder="请选择" size="small" @change="setBrandName">
              <el-option v-for="item in typeData" :key="item.modelCode" :label="item.modelCode" :value="item.modelCode" style="height: 50px;line-height: 0px;">
                <div style="line-height: 20px;">{{ item.brandName }}</div>
                <span style="font-size: 12px;color: #aaa;line-height: 15px;">车型编码：{{ item.modelCode }}</span>
                <div style="line-height: 15px;font-size: 12px;color: #aaa;">
                  <span>年款：{{ item.issueYear }}</span>
                  <span>排量：{{ item.displacement }}</span>
                  <span>新车购置价：{{ item.purchasePrice }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品牌型号:" prop="brandName">
            <el-input v-model="editForm.brandName" size="small" @blur="getBrandNameCarType"/>
          </el-form-item>
          <!-- <div v-if="editForm.modelCode">
            <el-form-item label="排量/功率：" prop="displacement">
              <el-input v-model="editForm.displacement" size="small" />
            </el-form-item>
            <el-form-item label="整备质量：" prop="curbWeight">
              <el-input v-model="editForm.curbWeight" size="small" />
            </el-form-item>
            <el-form-item label="核定载质量：" prop="tonnage">
              <el-input v-model="editForm.tonnage" size="small" />
            </el-form-item>
            <el-form-item label="年款：" prop="issueYear">
              <el-input v-model="editForm.issueYear" size="small" />
            </el-form-item>
          </div> -->
          <el-form-item label="新车价格：" prop="purchasePrice">
            <el-input v-model="editForm.purchasePrice" size="small" />
          </el-form-item>
          <el-form-item label="座位数：" prop="seatCount">
            <el-input v-model="editForm.seatCount" size="small" />
          </el-form-item>
          <el-form-item label="注册日期:" prop="enrollDate">
            <el-date-picker v-model="editForm.enrollDate" :clearable="false" type="date" value-format="yyyy-MM-dd" style="width: 300px;" placeholder="选择日期" size="small" />
          </el-form-item>
          <div v-if="isEdit">
            <el-form-item label="交强险止期:">
              <el-date-picker v-model="editForm.forceEndDate" :clearable="false" type="date" value-format="yyyy-MM-dd" style="width: 300px;" placeholder="选择日期" size="small" />
            </el-form-item>
            <el-form-item label="商业险止期:">
              <el-date-picker v-model="editForm.comEndDate" :clearable="false" type="date" value-format="yyyy-MM-dd" style="width: 300px;" placeholder="选择日期" size="small" />
            </el-form-item>
          </div>
          <el-form-item label="车牌底色:" prop="plateColor">
            <el-select v-model="editForm.plateColor" style="width: 300px;" filterable placeholder="请选择" size="small">
              <el-option v-for="item in colorData" :key="item.key" :label="item.value" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否一年内过户:" prop="transfer">
            <el-radio-group v-model="editForm.transfer">
              <el-radio v-for="item in statusList" :label="item.key" :key="item.key">{{ item.value }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="editForm.transfer === 0">
            <el-form-item label="过户日期:" prop="transferDate">
              <el-date-picker v-model="editForm.transferDate" type="date" style="width: 300px;" placeholder="选择日期" size="small" />
            </el-form-item>
          </div>
          <el-form-item label="交管车辆类型:" prop="vehicleType">
            <el-select v-model="editForm.vehicleType" style="width: 300px;" filterable placeholder="请选择" size="small">
              <el-option v-for="item in controlData" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
import { getToken, getTokenType } from '@/utils/auth'
import { compress, getBase64ToBlob } from '@/utils/imgUtil'
import { mapMutations } from 'vuex'
import qs from 'qs'
import { getCustomerCarType, setIdLicenseImg } from '@/api/customer'
export default {
  props: {
    titleName: {
      type: String,
      default: 'first'
    },
    editForm: {
      type: Object,
      default: null
    },
    controlData: {
      type: Array,
      default() {
        return []
      }
    },
    typeOption: {
      type: Array,
      default() {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    licenseDisable: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    backImg: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      idfaceLoading: false,
      idbackLoading: false,
      licensefaceLoading: false,
      licensebackLoading: false,
      idUrl: `${
        process.env.SERVER_URL
      }/upload?uploadHandle=http://120.27.21.67${
        process.env.API_ENV
      }/icar/ocr/identityCard`, // 身份证识别接口
      licenseUrl: `${
        process.env.SERVER_URL
      }/upload?uploadHandle=http://120.27.21.67${
        process.env.API_ENV
      }/icar/ocr/drivingLicense`, // 行驶证识别接口
      idlicenseUrl: `${
        process.env.SERVER_URL
      }/upload?uploadHandle=http://120.27.21.67${
        process.env.API_ENV
      }/dealer/guest/uploadCallback`, // 身份证行驶证上传接口
      activeName: 'first',
      typeData: [],
      typeLoading: false,
      hasFrameNoValue: false,
      hasBrandNameValue: false,
      token: `${getTokenType()} ${getToken()}`,
      pickerBirthday: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      rules: {
        cardName: [
          {
            required: true,
            validator: this.validateCardName,
            trigger: 'blur'
          }
        ],
        ownerName: [
          {
            required: true,
            validator: this.validateOwnerName,
            trigger: 'blur'
          }
        ],
        // idPicture: [
        //   {
        //     required: true,
        //     message: '请上传身份证照片',
        //     validator: this.validatePicture,
        //     trigger: 'blur'
        //   }
        // ],
        // ownerSex: [
        //   {
        //     required: true,
        //     message: '请输入车主性别',
        //     trigger: 'change'
        //   }
        // ],
        ownerCardType: [
          {
            required: true,
            message: '请选择证件类别',
            trigger: 'change'
          }
        ],
        ownerIdNo: [
          {
            required: true,
            // validator: this.validateIdNo,
            message: '请输入证件号',
            trigger: 'blur'
          }
        ],
        ownerPhone: [
          {
            required: false,
            validator: this.validateOwnerPhone,
            trigger: 'blur'
          }
        ],
        insuringPerson: [
          {
            required: true,
            message: '请选择投保人',
            trigger: 'change'
          }
        ],
        holderName: [
          {
            required: true,
            message: '请输入投保人姓名',
            trigger: 'blur'
          }
        ],
        holderIdNo: [
          {
            required: true,
            validator: this.validateIdNo,
            trigger: 'blur'
          }
        ],
        holderCardType: [
          {
            required: true,
            message: '请选择证件类型',
            trigger: 'change'
          }
        ],
        insuredPerson: [
          {
            required: true,
            message: '请选择被保人',
            trigger: 'change'
          }
        ],
        insuredName: [
          {
            required: true,
            message: '请输入被保人姓名',
            trigger: 'blur'
          }
        ],
        insureCardType: [
          {
            required: true,
            message: '请选择证件类型',
            trigger: 'change'
          }
        ],
        insuredIdNo: [
          {
            required: true,
            validator: this.validateIdNo,
            trigger: 'blur'
          }
        ],
        // licenseImage: [
        //   {
        //     required: true,
        //     message: '请上传行驶证照片',
        //     validator: this.validateImage,
        //     trigger: 'blur'
        //   }
        // ],
        licenseNo: [
          {
            required: false,
            validator: this.validateLicenseNo,
            trigger: 'blur'
          }
        ],
        purchasePrice: [
          {
            required: true,
            validator: this.validatePurchasePrice,
            trigger: 'blur'
          }
        ],
        frameNo: [
          {
            required: true,
            validator: this.validateFrameNo,
            trigger: 'blur'
          }
        ],
        engineNo: [
          {
            required: true,
            validator: this.validateEngineNo,
            trigger: 'blur'
          }
        ],
        useNature: [
          {
            required: true,
            message: '请选择车辆使用性质',
            trigger: 'change'
          }
        ],
        attachNature: [
          {
            required: true,
            message: '请选择使用性质细分项',
            trigger: 'change'
          }
        ],
        brandName: [
          {
            required: true,
            message: '请输入品牌型号',
            trigger: 'blur'
          }
        ],
        modelCode: [
          {
            required: true,
            message: '请选择对应车型',
            trigger: 'change'
          }
        ],
        seatCount: [
          {
            required: true,
            validator: this.validateSeatCount,
            trigger: 'blur'
          }
        ],
        enrollDate: [
          {
            required: true,
            message: '请选择注册日期',
            trigger: 'change'
          }
        ],
        plateColor: [
          {
            required: true,
            message: '请选择车牌底色',
            trigger: 'change'
          }
        ],
        transfer: [
          {
            required: true,
            message: '请选择是否过户',
            trigger: 'change'
          }
        ],
        transferDate: [
          {
            required: true,
            message: '请选择过户日期',
            trigger: 'change'
          }
        ],
        vehicleType: [
          {
            required: true,
            message: '请选择交管车辆类型',
            trigger: 'change'
          }
        ]
      },
      sexData: [
        { key: 1, value: '男' },
        { key: 2, value: '女' },
        { key: 9, value: '保密' }
      ],
      cardOption: [
        {
          label: '个人',
          value: '100',
          children: [
            {
              value: '101',
              label: '身份证'
            },
            {
              value: '102',
              label: '护照'
            },
            {
              value: '103',
              label: '军人证'
            },
            {
              value: '104',
              label: '港澳通行证'
            },
            {
              value: '105',
              label: '台胞证'
            }
          ]
        },
        {
          label: '企业',
          value: '200',
          children: [
            {
              value: '201',
              label: '统一社会信用代码'
            },
            {
              value: '202',
              label: '组织机构代码'
            },
            {
              value: '203',
              label: '税务登记证'
            },
            {
              value: '204',
              label: '营业执照'
            },
            {
              value: '299',
              label: '其他'
            }
          ]
        },
        {
          label: '机构',
          value: '300',
          children: [
            {
              value: '301',
              label: '统一社会信用代码'
            },
            {
              value: '302',
              label: '组织机构代码'
            },
            {
              value: '303',
              label: '税务登记证'
            },
            {
              value: '304',
              label: '营业执照'
            },
            {
              value: '399',
              label: '其他'
            }
          ]
        }
      ],
      colorData: [
        { key: '101', value: '蓝' },
        { key: '102', value: '黑' },
        { key: '103', value: '白' },
        { key: '104', value: '黄' },
        { key: '105', value: '白蓝' },
        { key: '106', value: '黄绿' },
        { key: '107', value: '渐变绿' },
        { key: '199', value: '其他' }
      ],
      useNatureData: [
        { key: '100', value: '非营业' },
        { key: '200', value: '营业' }
      ],
      attachNatureData: [
        { key: '201', value: '出租租赁' },
        { key: '202', value: '城市公交' },
        { key: '203', value: '公路客运' },
        { key: '204', value: '旅游客运' }
      ],
      insuringOption: [{ key: 0, value: '同车主' }, { key: 1, value: '其他' }],
      insuredOption: [
        { key: 0, value: '同车主' },
        { key: 1, value: '同投保人' },
        { key: 2, value: '其他' }
      ],
      statusList: [{ key: 0, value: '是' }, { key: 1, value: '否' }]
    }
  },
  watch: {
    titleName(val) {
      this.activeName = val
    },
    typeOption(val) {
      this.typeData = val
    }
  },
  methods: {
    ...mapMutations(['SET_TOKEN']),
    getFrameNoCarType() {
      if (this.hasBrandNameValue) return
      this.typeLoading = true
      getCustomerCarType(qs.stringify({ frameNo: this.editForm.frameNo }))
        .then(res => {
          if (res.status === 200) {
            this.typeLoading = false
            this.hasFrameNoValue = true
            this.typeData = res.data.list
          }
        })
        .catch(err => {
          console.warn(err)
          this.$message.error('未查询到车型信息，请核实车架号')
          this.typeLoading = false
          this.hasFrameNoValue = false
          this.typeData = []
        })
    },
    getBrandNameCarType() {
      if (this.hasFrameNoValue) return
      this.typeLoading = true
      getCustomerCarType(qs.stringify({ brandName: this.editForm.brandName }))
        .then(res => {
          if (res.status === 200) {
            this.typeLoading = false
            this.hasBrandNameValue = true
            this.typeData = res.data.list
          }
        })
        .catch(err => {
          console.warn(err)
          this.$message.error('未查询到车型信息，请核实品牌型号')
          this.typeLoading = false
          this.hasBrandNameValue = false
        })
    },
    // 选择车型设置品牌型号
    setBrandName(val) {
      this.typeData.forEach(item => {
        if (item.modelCode === val) {
          // this.editForm.brandName = item.brandName
          this.$set(this.editForm, 'brandName', item.brandName)
          this.$set(this.editForm, 'purchasePrice', item.purchasePrice)
          this.$set(this.editForm, 'seatCount', item.seatCount)
        }
      })
    },
    ownerCardChange(val) {
      this.editForm.ownerIdType = val[1]
    },
    holderCardChange(val) {
      this.editForm.holderIdType = val[1]
    },
    insuredCardChange(val) {
      this.editForm.insuredIdType = val[1]
    },
    beforeIdfaceUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是JPG/PNG格式')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过1MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },
    beforeIdbackUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是JPG/PNG格式')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过1MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },
    beforeLicensefaceUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是JPG/PNG格式')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过1MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },
    beforeLicensebackUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是JPG/PNG格式')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过1MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },
    handleIdfaceProgress() {
      this.idfaceLoading = true
    },
    handleIdbackProgress() {
      this.idbackLoading = true
    },
    handleLicensefaceProgress() {
      this.licensefaceLoading = true
    },
    // 识别身份证正面接口
    handleIdfaceUpload(res, file) {
      this.idfaceLoading = false
      this.editForm.imageIdface = URL.createObjectURL(file.raw)
      this.editForm.file0 = file.raw
      if (res.status === 200) {
        if (res.data.idType === '101' && res.data.name) {
          this.$message({
            message: '身份证识别成功',
            type: 'success'
          })
          const type = [res.data.idType.charAt(0) + '00', res.data.idType]
          if (res.data.sex === '男') {
            this.editForm.ownerSex = 1
          } else if (res.data.sex === '女') {
            this.editForm.ownerSex = 2
          }
          this.editForm.ownerIdNo = res.data.idNo
          this.editForm.ownerIdType = res.data.idType
          this.editForm.ownerCardType = type
          this.editForm.ownerAddr = res.data.address
        } else {
          this.$message.error('请上传身份证正面照片')
          this.editForm.imageIdface = null
          this.editForm.file0 = null
          return
        }
      } else {
        this.$message.error(res.message)
        this.editForm.imageIdface = null
        this.editForm.file0 = null
        return
      }
    },
    // 识别身份证反面接口
    handleIdbackUpload(res, file) {
      this.idbackLoading = false
      this.editForm.imageIdback = URL.createObjectURL(file.raw)
      this.editForm.file1 = file.raw
      if (res.status === 200) {
        if (res.data.idType === '101' && !res.data.name) {
          this.$message({
            message: '身份证识别成功',
            type: 'success'
          })
        } else {
          this.$message.error('请上传身份证反面照片')
          this.editForm.imageIdback = null
          this.editForm.file1 = null
          return
        }
      } else {
        this.$message.error(res.message)
        this.editForm.imageIdback = null
        this.editForm.file1 = null
        return
      }
    },
    // 识别行驶证正面接口
    handleLicensefaceUpload(res, file) {
      this.licensefaceLoading = false
      this.editForm.imagelicenseface = URL.createObjectURL(file.raw)
      this.editForm.file2 = file.raw
      if (res.status === 200) {
        if (res.data.frameNo && res.data.licenseNo) {
          this.$message({
            message: '行驶证识别成功',
            type: 'success'
          })

          this.editForm.ownerName = res.data.ownerName
          this.editForm.cardName = res.data.ownerName
          this.editForm.useNature = res.data.useNature
          // this.editForm.brandName = res.data.brandName
          this.$set(this.editForm, 'brandName', res.data.brandName)
          this.editForm.engineNo = res.data.engineNo
          this.editForm.enrollDate = res.data.enrollDate
          this.editForm.frameNo = res.data.frameNo
          // this.editForm.licenseNo = res.data.licenseNo
          this.getFrameNoCarType()
        } else {
          this.$message.error('请上传行驶证正本照片')
          this.editForm.imagelicenseface = null
          this.editForm.file2 = null
          return
        }
      } else {
        this.$message.error(res.message)
        this.editForm.imagelicenseface = null
        this.editForm.file2 = null
        return
      }
    },
    // 识别行驶证反面接口
    handleLicensebackUpload(file) {
      var reader = new FileReader()
      reader.addEventListener('load', () => {
        this.$emit('sendBackImg', reader.result)
      }, false)
      if (file.raw) {
        reader.readAsDataURL(file.raw)
      }
      this.editForm.imagelicenseback = URL.createObjectURL(file.raw)
      this.editForm.file3 = file.raw
    },
    // 上传保存证件照片
    analyseUpload(img, fileIndex) {
      const res = compress(img).base64
      const fileBlob = getBase64ToBlob(res, 'image/jpeg')
      const formdata = new FormData()
      formdata.append('flag', `${fileIndex}`)
      formdata.append('token', this.token)
      formdata.append('customerId', '')
      formdata.append(`file${fileIndex}`, fileBlob)
      this.SET_TOKEN('')
      setIdLicenseImg(formdata).then(res => {
        if (res.status === 200) {
          this.$message({
            message: '证件照片上传成功',
            type: 'success'
          })
        }
      })
    },
    // validatePicture(rule, value, callback) {
    //   if (this.editForm.imageIdface && this.editForm.imageIdback) {
    //     callback()
    //   } else {
    //     callback(new Error('请上传身份证照片'))
    //   }
    // },
    validateImage(rule, value, callback) {
      if (this.editForm.imagelicenseface && this.editForm.imagelicenseback) {
        callback()
      } else {
        callback(new Error('请上传行驶证照片'))
      }
    },
    validateCardName(rule, value, callback) {
      const reg = /[`~!@#$%^&*()+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——+={}|《》？：“”【】、；‘’，。、]/im
      if (!value) {
        callback(new Error('请输入姓名'))
      } else if (reg.test(value)) {
        callback(new Error('姓名不能为特殊字符'))
      } else {
        callback()
      }
    },
    validateOwnerName(rule, value, callback) {
      const reg = /[`~!@#$%^&*()+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——+={}|《》？：“”【】、；‘’，。、]/im
      if (!value) {
        callback(new Error('请输入车主'))
      } else if (reg.test(value)) {
        callback(new Error('车主不能为特殊字符'))
      } else {
        callback()
      }
    },
    isvalidPhone(str) {
      const reg = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/
      return reg.test(str)
    },
    validateOwnerPhone(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        if (!this.isvalidPhone(value)) {
          callback(new Error('请输入正确的11位手机号码'))
        } else {
          callback()
        }
      }
    },
    validateIdNo(rule, value, callback) {
      const reg = /^[A-Z0-9]+$/
      if (!value) {
        callback(new Error('请输入证件号'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的证件号'))
      } else {
        callback()
      }
    },
    validateFrameNo(rule, value, callback) {
      const reg = /^[A-Z0-9]+$/
      if (!value) {
        callback(new Error('请输入车架号'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的车架号'))
      } else {
        callback()
      }
    },
    validateEngineNo(rule, value, callback) {
      const reg = /^[A-Z0-9]+$/
      if (!value) {
        callback(new Error('请输入发动机号'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的发动机号'))
      } else {
        callback()
      }
    },
    validateLicenseNo(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        const reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{0,1}[A-Z0-9]{0,5}[A-Z0-9挂学警港澳]{1}$/
        if (!reg.test(value)) {
          callback(new Error('请输入正确的车牌号'))
        } else {
          callback()
        }
      }
    },
    validatePurchasePrice(rule, value, callback) {
      const reg = /^[0-9]+(.[0-9]{2})?$/
      if (!value) {
        callback(new Error('请输入车辆价格'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的车辆价格'))
      } else {
        callback()
      }
    },
    validateSeatCount(rule, value, callback) {
      const reg = /^\+?[1-9][0-9]*$/
      if (!value) {
        callback(new Error('请输入座位数'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的座位数'))
      } else {
        callback()
      }
    }
  }
}
</script>

<style lang="scss">
.edit-container {
  padding: 20px;
}
.edit-customer-form {
  .el-form-item {
    max-width: 440px;
  }
  .el-tabs > .el-tabs__content {
    overflow: auto;
    height: calc(100vh - 210px);
  }
  .icon-idface {
    position: relative;
    .word-idface {
      position: absolute;
      top: 60px;
      left: 70px;
      z-index: 1000;
      color: #666;
    }
  }
  .icon-idback {
    position: relative;
    .word-idback {
      position: absolute;
      top: 60px;
      left: 70px;
      color: #666;
    }
  }
  .icon-licenseface {
    position: relative;
    .word-licenseface {
      position: absolute;
      top: 60px;
      left: 70px;
      z-index: 1000;
      color: #666;
    }
  }
  .icon-licenseback {
    position: relative;
    .word-licenseback {
      position: absolute;
      top: 60px;
      left: 70px;
      color: #666;
    }
  }
}
</style>
