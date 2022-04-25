<template>
  <div v-loading="loading" class="app-container">
    <el-form
      ref="addEditPictureFormList"
      :model="pictureInfo"
      :rules="rules"
      class="addEditPictureFormList"
      label-width="110px"
      label-position="left"
    >
      <el-form-item label="图片名称" prop="picName">
        <el-input
          v-model="pictureInfo.picName"
          style="width: 100%;"
          size="small"
          placeholder="请输入"
        />
      </el-form-item>

      <el-form-item label="上传图片" prop="picUrl">
        <el-upload
          ref="upload"
          :file-list="fileList"
          :action="uploadUrl"
          :multiple="false"
          :headers="{ 'Authorization':token }"
          :on-success="handleUpload"
          :on-remove="handleRemove"
          :limit="1"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
        </el-upload>
      </el-form-item>

      <el-form-item label="投放渠道" prop="serving">
        <el-select
          v-model="pictureInfo.serving"
          placeholder="请选择"
          style="width: 100%;"
          size="small"
          @change="onServing"
        >
          <el-option
            v-for="item in channelList"
            :key="item.code"
            :label="item.shortName"
            :value="item.code"
          />
        </el-select>
      </el-form-item>

      <el-form-item v-if="parseInt(pictureInfo.serving) === 2" label="选择渠道" prop="channelCode">
        <el-select
          v-model="pictureInfo.channelCode"
          filterable
          placeholder="请选择"
          style="width: 100%;"
          size="small"
          @focus="getSelectChannel"
        >
          <el-option
            v-for="item in selectChannelList"
            :key="item.code"
            :label="item.shortName"
            :value="item.code"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="投放地区" prop="areaCode">
        <el-checkbox :indeterminate="isIndeterminate" v-model="pictureInfo.checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin-bottom: 5px 0;"/>
        <el-checkbox-group v-model="pictureInfo.areaCode" style="line-height: 25px;" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="city in cities" :label="city.id" :key="city.id">{{ city.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="生效时间" prop="date">
        <el-date-picker
          v-model="pictureInfo.date"
          size="small"
          style="width: 100%;"
          type="daterange"
          range-separator="至"
          start-placeholder="起始时间"
          end-placeholder="过期时间"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"/>
      </el-form-item>

      <el-form-item label="启用状态" prop="status">
        <el-radio-group v-model="pictureInfo.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="排序值" prop="sorted">
        <el-input
          v-model="pictureInfo.sorted"
          style="width: 100%;"
          size="small"
          placeholder="请输入"
          type="number"
        />
      </el-form-item>

      <el-form-item label="链接地址" prop="linkUrl">
        <el-input
          v-model="pictureInfo.linkUrl"
          style="width: 100%;"
          size="small"
          placeholder="请输入"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getToken, getTokenType } from '@/utils/auth'
import {
  getPlacementArea,
  // getServedChannels,
  getSelectChannel } from '@/api/graphic'
export default {
  name: 'AddEditPicture',
  props: {},
  data() {
    return {
      loading: false,
      pictureInfo: {
        picName: '',
        picUrl: '',
        serving: '',
        areaCode: [],
        status: 1,
        date: [],
        sorted: '',
        linkUrl: '',
        channelCode: '',
        checkAll: false
      },
      isIndeterminate: false,
      fileList: [],
      rules: {
        picName: [
          { required: true, message: '请输入图片名称', trigger: 'change' }
        ],
        serving: [
          { required: true, message: '请选择投放渠道', trigger: 'change' }
        ],
        channelCode: [
          { required: true, message: '请选择渠道', trigger: 'change' }
        ],
        areaCode: [
          { required: true, message: '请选择投放地区', trigger: 'change' }
        ],
        date: [
          { required: true, message: '请选择生效时间', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择启用状态', trigger: 'change' }
        ],
        sorted: [
          { required: true, message: '请输入排序值', trigger: 'change' }
        ],
        picUrl: [
          { required: true, message: '请上传一张图片', trigger: 'change' }
        ]
      },
      channelList: [
        { code: '1', shortName: '全部渠道' },
        { code: '001', shortName: '大童快保' },
        { code: '2', shortName: '非大童快保' }
      ],
      selectChannelList: [
        { code: 'allChannelCode', shortName: '全部' }
      ],
      cities: [
      ]
    }
  },
  computed: {
    token() {
      return `${getTokenType()} ${getToken()}`
    },
    uploadUrl() {
      return `${process.env.SERVER_URL}${
        process.env.API_ENV
      }/oauth/image-upload/up`
    }
  },
  created() {
    this.loading = true
    getPlacementArea()
      .then(res => {
        this.loading = false
        const { data: cities } = res
        this.cities = cities
        console.log(res)
      })
      .catch(err => {
        console.warn(err)
      })
    this.loading = true
    this.getSelectChannel()
    // getServedChannels()
    //   .then(res => {
    //     this.loading = false
    //     const { data: channelList } = res
    //     this.channelList = channelList
    //     console.log(res)
    //   })
    //   .catch(err => {
    //     console.warn(err)
    //   })
  },
  methods: {
    // 投放渠道改变时，清除选择渠道的值
    onServing() {
      this.pictureInfo.channelCode = ''
    },
    reset() {
      this.pictureInfo.id = undefined
      this.isIndeterminate = false
      this.pictureInfo.checkAll = false
      this.$refs.upload.clearFiles()
      this.pictureInfo.channelCode = ''
      this.$refs.addEditPictureFormList.resetFields()
    },
    handleUpload(response, file, fileList) {
      this.pictureInfo.picUrl = response.url
      this.$refs.addEditPictureFormList.validateField('picUrl')
    },
    handleRemove(file, fileList) {
      this.pictureInfo.picUrl = ''
      this.$refs.addEditPictureFormList.validateField('picUrl')
    },
    handleCheckAllChange(val) {
      this.pictureInfo.areaCode = val ? this.cities.map(item => item.id) : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.pictureInfo.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    },
    getSelectChannel() {
      if (this.selectChannelList.length <= 1) {
        getSelectChannel()
          .then(res => {
            const { data: selectChannelList } = res
            this.selectChannelList = [{ code: 'allChannelCode', shortName: '全部' }]
            this.selectChannelList = [...this.selectChannelList, ...selectChannelList]
            console.log(res)
          })
          .catch(err => {
            console.warn(err)
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
.addEditPictureFormList {
  .el-checkbox {
    margin: 0 !important;
    padding-right: 10px;
    width: 72px;
  }
}
</style>
