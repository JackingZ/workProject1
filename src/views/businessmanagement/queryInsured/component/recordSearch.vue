<template>
  <div v-loading="isLoading" class="record-search-box">
    <el-form ref="searchForm" :model="searchForm" :rules="rules" class="search-form" label-position="left" label-width="100px">
      <el-form-item v-if="isAnyAdminChannel" label="所属渠道：" prop="sourceCode">
        <el-select v-if="isAnyAdminChannel" v-model="searchForm.sourceCode" filterable placeholder="请选择所属渠道" size="small" @change="handleChannel">
          <el-option v-for="item in channelData" :label="item.shortName" :key="item.code" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择地区：" prop="areaCode">
        <el-select v-model="searchForm.areaCode" size="small" filterable placeholder="请选择地区" @change="handleArea">
          <el-option v-for="item in areaData" :key="item.areaCode" :label="item.area" :value="item.areaCode" />
        </el-select>
      </el-form-item>
      <el-form-item label="保险公司：" prop="companyId">
        <el-select v-model="searchForm.companyId" size="small" filterable placeholder="请选择保险公司" @change="handleCompany">
          <el-option v-for="item in companyData" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="出单工号：" prop="channelId">
        <el-select v-model="searchForm.channelId" filterable placeholder="请选择工号" size="small">
          <el-option v-for="item in insuredData" :key="item.id" :label="item.channelName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择时间：" prop="startTime">
        <el-date-picker v-model="searchForm.startTime" :clearable="false" :picker-options="pickerOptions" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="年/月/日" size="small" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getInsuranceArea,
  getInsuranceCompany,
  getInsuranceChannel
} from '@/api/queryInsure'
import { mapGetters } from 'vuex'
export default {
  props: {
    channelData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      isLoading: false,
      areaData: [],
      companyData: [],
      insuredData: [],
      searchForm: {
        sourceCode: null,
        sourceName: '',
        areaCode: null,
        areaCodeName: '',
        companyId: null,
        companyName: '',
        channelId: null,
        channelName: '',
        startTime: null
      },
      rules: {
        sourceCode: [
          { required: true, message: '请选择所属渠道', trigger: 'change' }
        ],
        areaCode: [
          { required: true, message: '请选择地区', trigger: 'change' }
        ],
        companyId: [
          { required: true, message: '请选择保险公司', trigger: 'change' }
        ],
        channelId: [
          { required: true, message: '请选择工号', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= Date.now() - 86400
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否是管理员渠道
    ])
  },
  watch: {
    'searchForm.sourceCode'(val) {
      if (val) {
        this.channelData.forEach(item => {
          if (item.code === val) {
            this.searchForm.sourceName = item.shortName
          }
        })
      } else {
        this.searchForm.sourceName = ''
      }
    },
    'searchForm.areaCode'(val) {
      if (val) {
        this.areaData.forEach(item => {
          if (item.areaCode === val) {
            this.searchForm.areaCodeName = item.area
          }
        })
      } else {
        this.searchForm.areaCodeName = ''
      }
    },
    'searchForm.companyId'(val) {
      if (val.toString()) {
        this.companyData.forEach(item => {
          if (item.id === val) {
            this.searchForm.companyName = item.name
          }
        })
      } else {
        this.searchForm.companyName = ''
      }
    },
    'searchForm.channelId'(val) {
      if (val) {
        this.insuredData.forEach(item => {
          if (item.id === val) {
            this.searchForm.channelName = item.channelName
          }
        })
      } else {
        this.searchForm.channelName = ''
      }
    }
  },
  async created() {
    if (!this.isAnyAdminChannel) {
      this.searchForm.sourceCode = this.$store.getters.userAll.data.channelCode
      this.handleChannel()
    }
  },
  methods: {
    async handleChannel(val) {
      this.clear(true, true, true)
      const resA = await getInsuranceArea(this.searchForm.sourceCode)
      this.areaData = resA.data
    },
    async handleArea(val) {
      this.clear(false, true, true)
      if (this.searchForm.areaCode) {
        const resC = await getInsuranceCompany(this.searchForm.sourceCode, this.searchForm.areaCode)
        this.companyData = resC.data
      }
    },
    async handleCompany(val) {
      this.clear(false, false, true)
      if (this.searchForm.sourceCode && this.searchForm.areaCode && this.searchForm.companyId.toString()) {
        const params = {
          sourceCode: this.searchForm.sourceCode,
          areaCode: this.searchForm.areaCode,
          companyId: this.searchForm.companyId
        }
        const resI = await getInsuranceChannel(params)
        this.insuredData = resI.data
      }
    },
    clear(bool1, bool2, bool3) {
      if (bool1) {
        this.searchForm.areaCode = null
        this.searchForm.areaCodeName = null
        this.companyData = []
      }
      if (bool2) {
        this.searchForm.companyId = null
        this.searchForm.companyName = null
        this.insuredData = []
      }
      if (bool3) {
        this.searchForm.channelId = null
        this.searchForm.channelName = null
      }
    }
  }
}
</script>

<style lang="scss">
.record-search-box {
  padding: 20px;
  .search-form {
    .el-select,
    .el-date-editor {
      width: 90%;
    }
  }
}
</style>
