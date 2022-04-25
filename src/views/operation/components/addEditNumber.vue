<template>
  <div v-loading="isLoading" class="app-container">
    <!--顶部tab-->
    <el-tabs v-show="isSubAdminChannel" v-model="activeName" type="card" style="width: 100%;position: absolute;left: 0;top: 54px;z-index: 10;background-color: #ffffff;" @tab-click="onTabChange">
      <el-tab-pane label="基础信息" name="first"/>
      <el-tab-pane label="详细信息" name="second" />
    </el-tabs>

    <el-form
      v-if="isFormShow"
      id="form"
      ref="formList"
      :model="formList"
      :rules="rules"
      :class="{tab_top: isSubAdminChannel}"
      label-width="110px"
      label-position="left">

      <el-form-item v-if="isEdit" label="工号名称" prop="channelName">
        <el-input v-model="formList.channelName" style="width: 100%;" size="small" placeholder="请输入"/>
      </el-form-item>

      <el-form-item v-if="isSubAdminChannel" id="f1" label="使用类型" prop="type">
        <el-select v-model="formList.type" :disabled="isEdit" placeholder="请选择" style="width: 100%;" size="small">
          <el-option
            v-for="item in dictionary.useType"
            :key="item.key"
            :label="item.label"
            :value="item.key"/>
        </el-select>
      </el-form-item>

      <el-form-item v-if="isSubAdminChannel" label="工号类型" prop="isMock">
        <el-select v-model="formList.isMock" :disabled="isEdit" placeholder="请选择" style="width: 100%;" size="small" @change="onNumberType">
          <el-option
            v-for="item in dictionary.numberType"
            :key="item.key"
            :label="item.label"
            :value="item.key"/>
        </el-select>
      </el-form-item>

      <el-form-item v-if="isSubAdminChannel" label="所属渠道" prop="sourceId">
        <el-select
          v-model="formList.sourceId"
          :loading="dictionary.channelList.isLoading"
          :disabled="isEdit"
          placeholder="请选择"
          style="width: 100%;"
          size="small"
          clearable
          filterable
          @focus="getChannelList"
          @change="onSourceId(2)">
          <el-option
            v-for="item in dictionary.channelList.data"
            :key="item.code"
            :label="item.shortName"
            :value="item.code"/>
        </el-select>
      </el-form-item>

      <el-form-item label="所属机构" prop="belongCompany">
        <el-tree-select
          v-model="formList.belongCompany"
          :loading="dictionary.orgList.loading"
          :data="dictionary.orgList.data"
          :default-expand-all="false"
          :disabled="!formList.sourceId"
          clearable
          filterable
          size="small"
          placeholder="请选择"
          @change="onBelongCompany"
          @focus="getOrgList"
        />
      </el-form-item>

      <el-form-item label="所属地区" prop="areaCodeArrs">
        <el-cascader
          :options="dictionary.areaList.data"
          :disabled="isEdit"
          v-model="formList.areaCodeArrs"
          size="small"
          style="width: 100%;"
          @focus="getArea"
          @change="onAreaCode(2)"/>
      </el-form-item>

      <el-form-item label="保险公司" prop="companyId">
        <el-select
          v-model="formList.companyId"
          :loading="dictionary.companyList.isLoading"
          :disabled="formList.isMock !== 0 && formList.isMock !== 1 || isEdit || !formList.sourceId"
          placeholder="请选择"
          style="width: 100%;"
          size="small"
          clearable
          filterable
          @focus="getCompany"
          @change="onCompanyId($event, 3)">
          <el-option
            v-for="item in dictionary.companyList.filterData"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item>

      <el-form-item v-if="formList.sourceId === '001'" label="保险公司编码" prop="comcodeArrs">
        <el-cascader
          :options="dictionary.companyCodeList.data"
          :props="dictionary.companyCodeList.props"
          :show-all-levels="false"
          :disabled="!isEmpty(formList.companyId)"
          v-model="formList.comcodeArrs"
          change-on-select
          style="width: 100%;"
          size="small"
          @focus="getCompanyCodeList"/>
      </el-form-item>

      <el-form-item v-if="formList.isMock === 1" label="账号" prop="vo.account">
        <el-input v-model="formList.vo.account" style="width: 100%;" size="small" placeholder="请输入"/>
      </el-form-item>

      <el-form-item v-if="formList.isMock === 1" label="密码" prop="vo.pwd">
        <el-input v-model="formList.vo.pwd" style="width: 100%;" size="small" placeholder="请输入"/>
      </el-form-item>

      <el-form-item v-if="formList.isMock === 1 && formList.companyId !== 57" label="登录地址" prop="vo.orgCode">
        <el-select
          v-model="formList.vo.orgCode"
          :loading="dictionary.reqUrlList.isLoading"
          :disabled="!isDisableReqUrl()"
          placeholder="请选择"
          style="width: 100%;"
          size="small"
          clearable
          filterable>
          <el-option
            v-for="item in dictionary.reqUrlList.data.landingUrlArrs"
            :key="item.id"
            :label="item.shortName"
            :value="item.landingUrl"/>
        </el-select>
      </el-form-item>

      <el-form-item v-if="formList.isMock === 1 && isSubAdminChannel" label="代理地址">
        <el-select
          v-model="formList.vo.serviceCode"
          :disabled="!isDisableReqUrl()"
          placeholder="请选择"
          style="width: 100%;"
          size="small"
          clearable
          filterable>
          <el-option
            v-for="item in dictionary.reqUrlList.data.proxyUrl"
            :key="item.id"
            :label="item.complex"
            :value="item.original"/>
        </el-select>
      </el-form-item>

      <el-form-item v-if="formList.isMock === 1 && isSubAdminChannel" label="请求地址">
        <el-select
          v-model="formList.vo.reqUrl"
          :disabled="!isDisableReqUrl()"
          placeholder="请选择"
          style="width: 100%;"
          size="small"
          clearable
          filterable>
          <el-option
            v-for="item in dictionary.reqUrlList.data.reqUrl"
            :key="item.id"
            :label="item.complex"
            :value="item.original"/>
        </el-select>
      </el-form-item>

      <el-form-item v-if="formList.isMock === 0" label="核保证件必传" prop="isUpload">
        <el-select
          v-model="formList.isUpload"
          placeholder="请选择"
          style="width: 100%;"
          size="small"
          clearable>
          <el-option
            v-for="item in dictionary.isUploadList"
            :key="item.key"
            :label="item.label"
            :value="item.key"/>
        </el-select>
      </el-form-item>

      <el-form-item label="备注" prop="explains">
        <el-input v-model="formList.explains" style="width: 100%;" size="small" placeholder="请输入"/>
      </el-form-item>

      <div id="line" style="width: 100%;border-bottom: 1px solid #e4e7ed;margin-bottom: 20px;" />

      <template v-if="isSubAdminChannel">
        <template v-for="item in dictionary.reqUrlList.data.customFields">
          <!--输入类型-->
          <transition :key="item.id" name="slide-fade">
            <el-form-item v-if="item.type === 1 && item.options.show" :key="item.id" :label="item.text" :prop="item.field">
              <el-input v-model="formList[item.field]" :placeholder="item.placeholder || `请输入${item.text}`" style="width: 100%;" size="small"/>
            </el-form-item>
          </transition>

          <!--单选类型-->
          <transition :key="item.id" name="slide-fade">
            <el-form-item v-if="item.type === 2" :key="item.id" :label="item.text" :prop="item.field">
              <el-radio-group v-model="formList[item.field]" @change="onRadioChange($event, item)">
                <el-radio v-for="(options, index) in item.dictionary_" :key="index" :label="options.value" size="small" placeholder="请输入">{{ options.label }}</el-radio>>
              </el-radio-group>
            </el-form-item>
          </transition>

          <!--按钮类型-->
          <el-form-item v-if="item.type === 4" :key="item.id" :label="item.text">
            <el-button type="text" @click="handleButton($event, item)">{{ item.dictionary_ }}</el-button>
          </el-form-item>

          <!--下拉选择类型-->
          <!--树选择类型-->
        </template>
      </template>

    </el-form>

    <special-setting
      ref="specialSetting"
      :show="isSpecialSetting"
      @confirm="updateSpecialSettingData"
      @close="isSpecialSetting = false"/>
  </div>
</template>

<script>
import ElTreeSelect from '@/components/ElTreeSelect/index'
import CostSplitting from '@/views/operation/components/costSplitting'
import SpecialSetting from '@/views/operation/components/specialSetting'
import { getNumberAddFiled,
  getOrgData,
  queryAreaByChannel,
  queryCompanysListByChannelCode,
  getSynCompanyList,
  getReqUrlList,
  getJobNumberById,
  getJobNumberDictionary,
  queryAreaByOrgAndChannel } from '@/api/number'
import { getPolicyChannelList } from '@/api/policy_management'
import { mapGetters } from 'vuex'
export default {
  name: 'AddEditNumber',
  components: {
    ElTreeSelect,
    CostSplitting,
    SpecialSetting
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    numberState: {
      type: [String, Number],
      default: 0
    },
    channelId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      isFormShow: false,
      isSpecialSetting: false,
      isLoading: false,
      activeName: 'first',
      dictionary: {
        useType: [
          { key: 0, label: '正式' },
          { key: 1, label: '测试' }
        ],
        numberType: [
          { key: 0, label: '接口' },
          { key: 1, label: '模拟' }
        ],
        channelList: {
          isLoading: false,
          data: []
        },
        orgList: {
          isLoading: false,
          data: []
        },
        areaList: {
          isLoading: false,
          data: []
        },
        companyList: {
          isLoading: false,
          data: [],
          filterData: []
        },
        companyCodeList: {
          data: [],
          props: {
            label: 'shortName',
            value: 'code'
          }
        },
        reqUrlList: {
          isLoading: false,
          data: {
            landingUrlArrs: [],
            proxyUrl: [],
            reqUrl: [],
            customFields: []
          }
        },
        isUploadList: [
          { key: 0, label: '不需要' },
          { key: 1, label: '需要' }
        ]
      },
      formList: {},
      rules: {
        type: [
          { required: true, message: '请选择使用类型', trigger: 'change' }
        ],
        isMock: [
          { required: true, message: '请选择工号类型', trigger: 'change' }
        ],
        companyId: [
          { required: true, message: '请选择保险公司', trigger: 'change' }
        ],
        areaCodeArrs: [
          { required: true, message: '请选择地区', trigger: 'change' }
        ],
        sourceId: [
          { required: true, message: '请选择所属渠道', trigger: 'change' }
        ],
        belongCompany: [
          { required: true, message: '请选择所属机构', trigger: 'change' }
        ],
        isUpload: [
          { required: true, message: '请选择使用类型', trigger: 'change' }
        ],
        comcodeArrs: [
          { required: true, message: '请选择公司编码', trigger: 'change' }
        ],
        'vo.account': [
          { required: true, message: '请填写账号', trigger: 'change' }
        ],
        'vo.pwd': [
          { required: true, message: '请填写密码', trigger: 'change' }
        ],
        'vo.orgCode': [
          { required: true, message: '请填写登录地址', trigger: 'change' }
        ],
        channelName: [
          { required: true, message: '请填写工号名称', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['isSubAdminChannel'])
  },
  watch: {
    isEdit(newVal) {
      console.log('isEdit', newVal)
      if (!newVal) return
      this.getJobNumberDetails()
    }
  },
  created() {
    this.getNumberAddFiled()
  },
  methods: {
    // 监听选项卡切换
    onTabChange(e) {
      const { name } = e
      const line = document.getElementById('line')
      const wrap = document.querySelector('.drawer-body')
      if (name === 'first') {
        wrap.scrollTop = 0
      }
      if (name === 'second') {
        wrap.scrollTop = line.offsetTop - 120
      }
    },
    setDefaultValue() {
      if (!this.isSubAdminChannel) {
        this.formList.type = 0
        this.formList.isMock = 1
        this.formList.sourceId = JSON.parse(localStorage.getItem('userAll')).data.channelCode
      }
    },
    // 获取新增工号字段
    getNumberAddFiled() {
      getNumberAddFiled()
        .then(res => {
          const { data: formList } = res
          this.formList = formList
          this.isFormShow = true
          this.setDefaultValue()
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 获取所属渠道字典
    getChannelList() {
      if (this.dictionary.channelList.data.length) return
      this.dictionary.channelList.isLoading = true
      getPolicyChannelList()
        .then(res => {
          this.dictionary.channelList.isLoading = false
          const { data: channelList } = res
          const newList = channelList.filter(item => parseInt(item.type) === 1)
          this.dictionary.channelList.data = newList
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 获取所属机构
    getOrgList() {
      this.dictionary.orgList.isLoading = true
      getOrgData({ channelCode: this.formList.sourceId })
        .then(res => {
          this.dictionary.orgList.isLoading = false
          const { data: orgList } = res
          this.dictionary.orgList.data = JSON.parse(JSON.stringify(orgList).replace(/title/g, 'label').replace(/key/g, 'value'))
          console.log(orgList)
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 获取地区
    getArea() {
      // if (this.dictionary.areaList.data.length) return
      this.dictionary.areaList.isLoading = true
      queryAreaByChannel(this.formList.sourceId)
        .then(res => {
          this.dictionary.areaList.isLoading = false
          const { data: areaList } = res
          function run(arr) {
            for (var i of arr) {
              if (i.children && i.children.length) {
                run(i.children)
              } else {
                i.children = null
              }
            }
          }
          run(areaList)
          this.dictionary.areaList.data = areaList
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 获取保险公司
    getCompany() {
      // if (this.dictionary.companyList.data.length) return
      this.dictionary.companyList.isLoading = true
      queryCompanysListByChannelCode(this.formList.sourceId)
        .then(res => {
          this.dictionary.companyList.isLoading = false
          const { data: companyList } = res
          this.dictionary.companyList.data = companyList
          const filterData = companyList.filter(item => {
            return item.ismock === this.formList.isMock
          })
          this.dictionary.companyList.filterData = filterData
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 获取保险公司编码
    getCompanyCodeList() {
      getSynCompanyList(this.formList.companyId, this.formList.sourceId)
        .then(res => {
          const { data: companyCodeList } = res
          this.dictionary.companyCodeList.data = companyCodeList
          console.log(companyCodeList)
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 判断是否空值
    isEmpty(val) {
      if (val === '' || val === null || val === undefined) {
        return false
      } else {
        return true
      }
    },
    // 是否禁用登陆地址、请求地址、代理地址
    isDisableReqUrl() {
      const areaCodeArrs = this.formList.areaCodeArrs.length
      const sourceId = this.formList.sourceId
      const companyId = this.isEmpty(this.formList.companyId)
      if (areaCodeArrs && sourceId && companyId) {
        return true
      } else {
        return false
      }
    },
    // 监听所属机构
    onBelongCompany(e) {
      this.formList.areaCodeArrs = []
      if (!e) return
      queryAreaByOrgAndChannel(e, this.formList.sourceId)
        .then(res => {
          const { data: areaCodeArrs } = res
          if (areaCodeArrs.length) {
            this.formList.areaCodeArrs = areaCodeArrs
          }
          this.getArea()
          console.log(areaCodeArrs)
        })
        .catch(err => {
          console.warn(err)
        })
      console.log(e)
    },
    // 监听地区
    onAreaCode(type) {
      this.getReqUrlList(type)
      this.formList.vo.account = ''
      this.formList.vo.pwd = ''
      this.formList.vo.orgCode = ''
      this.formList.vo.serviceCode = ''
      this.formList.vo.reqUrl = ''
    },
    // 监听保险公司
    onCompanyId(e, type) {
      this.cleanDynamicFields()
      if (!this.isEmpty(e)) {
        this.dictionary.reqUrlList.data.customFields = []
      } else {
        this.getReqUrlList(type)
      }
      this.formList.vo.account = ''
      this.formList.vo.pwd = ''
      this.formList.vo.orgCode = ''
      this.formList.vo.serviceCode = ''
      this.formList.vo.reqUrl = ''
      this.setDefaultValue()
    },
    // 清除后台动态返回字段所绑定的值
    cleanDynamicFields() {
      const fieldList = this.dictionary.reqUrlList.data.customFields
      if (!fieldList.length) return
      const res = fieldList
        .map(item => ({ [item.field]: '' }))
        .reduce((previousValue, currentValue, currentIndex) => {
          let obj = {}
          obj = { ...previousValue, ...currentValue }
          return obj
        })
      console.log(res)
      this.formList = { ...this.formList, ...res }
    },
    // 清除固定字段的值
    clearFields() {
      const data = {
        channelName: '',
        type: '',
        isMock: '',
        sourceId: '',
        belongCompany: '',
        areaCodeArrs: [],
        companyId: '',
        comcodeArrs: [],
        isUpload: '',
        explains: '',
        vo: {
          account: '',
          pwd: '',
          orgCode: '',
          serviceCode: '',
          reqUrl: ''
        }
      }
      this.formList = { ...this.formList, ...data }
    },
    // 监听所属渠道
    onSourceId(type) {
      this.getReqUrlList(type)
      this.formList.vo.account = ''
      this.formList.vo.pwd = ''
      this.formList.vo.orgCode = ''
      this.formList.vo.serviceCode = ''
      this.formList.vo.reqUrl = ''
      this.formList.belongCompany = ''
      this.formList.comcodeArrs = []
    },
    // 获取登陆地址、请求地址、代理地址字典
    getReqUrlList(type = 3) {
      this.dictionary.reqUrlList.isLoading = true
      const areaCodeArrs = this.formList.areaCodeArrs
      const sourceId = this.formList.sourceId
      const companyId = this.formList.companyId
      getReqUrlList(areaCodeArrs, companyId, sourceId, type)
        .then(res => {
          this.dictionary.reqUrlList.isLoading = false
          const { data: reqUrlList } = res
          console.log(reqUrlList)
          if (reqUrlList.customFields) {
            this.dictionary.reqUrlList.data.customFields = reqUrlList.customFields
            // 给单选类型的组件添加默认值
            for (const item of reqUrlList.customFields) {
              if (item.type === 2) {
                this.formList[item.field] = item.defaultValue
              }
            }
          }
          this.dictionary.reqUrlList.data.landingUrlArrs = reqUrlList.landingUrlArrs
          this.dictionary.reqUrlList.data.proxyUrl = reqUrlList.proxyUrl
          this.dictionary.reqUrlList.data.reqUrl = reqUrlList.reqUrl
          // 非编辑情况下，请求地址和代理地址如果字典有值，默认选择第一项
          if (!this.isEdit) {
            this.formList.vo.reqUrl = reqUrlList.reqUrl.length ? reqUrlList.reqUrl[0]['original'] : ''
            this.formList.vo.serviceCode = reqUrlList.proxyUrl.length ? reqUrlList.proxyUrl[0]['original'] : ''
          }
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 监听工号类型
    onNumberType() {
      this.formList.vo.account = ''
      this.formList.vo.pwd = ''
      this.formList.vo.orgCode = ''
      this.formList.vo.serviceCode = ''
      this.formList.vo.reqUrl = ''
      this.formList.isUpload = ''
      this.formList.companyId = ''
      const companyList = this.dictionary.companyList.data
      if (companyList.length) {
        const filterData = companyList.filter(item => {
          return item.ismock === this.formList.isMock
        })
        this.dictionary.companyList.filterData = filterData
      }
    },
    // 监听单选组件
    onRadioChange(e, item) {
      // e !== 2 隐藏组件
      const { eventType, eventField } = item.options
      const dictionary = this.dictionary.reqUrlList.data.customFields
      if (!eventType) return
      for (const i of eventField) {
        this.formList[i] = ''
        const li = dictionary.find(c => c.field === i)
        li.options.show = parseInt(e) === 2
      }
    },
    // 特别约定
    updateSpecialSettingData(res) {
      if (res) this.formList.field12 = JSON.stringify(res).replace(/\"/g, '\\\"')
    },
    // 后台动态返回的按钮类型事件处理
    handleButton(e, item) {
      const { options } = item
      // 处理人保特别约定
      if (options.eventType === 1) {
        let tableData
        if (this.formList.field12) {
          try {
            const json = this.formList.field12.replace(/\\\"/g, '"')
            const data = JSON.parse(json)
            tableData = data
          } catch (error) {
            console.error(error)
          }
        }
        this.$refs.specialSetting.setData(tableData)
        this[options.eventField[0]] = true
      }
    },
    async getJobNumberDetails() {
      this.isLoading = true
      try {
        // 获取编辑工号所需的字典
        const { data: jobNumberDictionary } = await getJobNumberDictionary(this.channelId)
        this.dictionary.channelList.data = jobNumberDictionary.sourceCodelist
        this.dictionary.orgList.data = JSON.parse(JSON.stringify(jobNumberDictionary.organizationTree)
          .replace(/title/g, 'label')
          .replace(/key/g, 'value'))
        this.dictionary.areaList.data = jobNumberDictionary.provinceAndCityTree
        this.dictionary.companyList.filterData = jobNumberDictionary.companyList
        this.dictionary.companyCodeList.data = jobNumberDictionary.comcodeTree
        console.log(jobNumberDictionary)

        // 获取工号详情
        const { data: formList } = await getJobNumberById(this.channelId)
        this.dictionary.reqUrlList.data.landingUrlArrs = formList.landingUrlArrs
        this.dictionary.reqUrlList.data.proxyUrl = formList.proxyUrlArrs
        this.dictionary.reqUrlList.data.reqUrl = formList.reqUrlArrs
        this.dictionary.reqUrlList.data.customFields = formList.customFields
        this.formList = { ...this.formList, ...formList }
        this.$emit('onNumberState', this.formList.del)
        this.isLoading = false
        console.log(formList)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss">
  .el-tree-select-dropdown {
    .el-tree {
      width: 360px;
      height: 300px;
      overflow: auto;
    }
    .el-tree-node > .el-tree-node__children {
      overflow: visible;
    }
  }
  .numberAddOrgSelect {
    .el-input__inner {
      height: 32px!important;
    }
  }
  .tab_top {
    margin-top: 50px;
  }

  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }
</style>
