<template>
  <div v-loading="isLoading" class="app-container">
    <el-form
      ref="addInform"
      :model="selectData"
      :rules="rules"
      label-width="115px"
      label-position="left">
      <el-form-item label="标题" prop="title">
        <el-input v-model="selectData.title" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input v-model="selectData.content" type="textarea"/>
      </el-form-item>
      <el-form-item label="方式" prop="type">
        <el-radio-group v-model="selectData.type">
          <el-radio label="按区域发送"/>
          <el-radio label="指定用户发送"/>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="selectData.type==='指定用户发送'" label="指定用户" prop="touids">
        <el-input v-model="selectData.touids" placeholder="请填写手机号，如果是多用户请用英文逗号隔开"/>
      </el-form-item>
      <el-form-item v-if="selectData.type==='按区域发送'" label="发送渠道" prop="tosourceid">
        <el-select
          v-model="selectData.tosourceid"
          :loading = "channelloading"
          placeholder="请选择发送渠道"
          clearable
          filterable
          style="margin-right: 10px;width: 100%;flex: 0 0 auto;"
          @change="handleChannelChange">
          <el-option
            v-for="item in channelData"
            :key="item.id"
            :label="item.explains"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="selectData.type==='按区域发送'" label="分公司" prop="corporation">
        <el-select
          v-model="selectData.corporation"
          :loading = "companyList.loading"
          placeholder="请选择分公司"
          clearable
          filterable
          style="margin-right: 10px;width: 100%;flex: 0 0 auto;"
          @focus="getCompanyList">
          <el-option
            v-for="item in companyList.data"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <!-- <el-form-item v-if="selectData.type==='按区域发送'" label="所属机构">
        <el-tree-select
          ref="treeList"
          v-model="selectData.comcode"
          :data="organOptions"
          :default-expand-all="false"
          :props="defaultProps"
          show-checkbox
          highlight-current
          node-key="key"
          clearable
          placeholder="请选择机构"
          style="margin-right: 10px;width: 100%;flex: 0 0 auto;"
          @focus="queryOrgan"
          @change="handleOrganChange" /> -->
      <!-- <el-tree-select
          ref="treeList"
          v-model="selectData.comcode"
          :data="organOptions"
          :default-expand-all="false"
          clearable
          filterable
          placeholder="请选择机构"
          style="width: 100%;"
          @focus="queryOrgan"
          @change="handleOrganChange" /> -->
      <!-- </el-form-item> -->

      <!-- <el-form-item v-if="selectData.type==='按区域发送'" label="所属机构" prop="comcode">
        <el-select
          v-model="selectData.comcode"
          placeholder="请选择所属机构"
          style="margin-right: 10px;width: 100%;flex: 0 0 auto;">
          <el-option label="区域一" value="shanghai"/>
        </el-select>
      </el-form-item> -->
      <el-form-item label="操作" prop="status">
        <el-radio-group v-model="selectData.status">
          <el-radio label="发布"/>
          <el-radio label="存草稿"/>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  getCompanysData,
  getOrganData
} from '@/api/notification'
import ElTreeSelect from '@/components/ElTreeSelect/index'
export default {
  name: 'AddAddress',
  components: {
    ElTreeSelect
  },
  props: {
    channellist: {
      type: Array,
      default() {}
    },
    channelloading: {
      type: Boolean,
      default() {}
    }
  },
  data() {
    return {
      isLoading: false,
      selectData: {
        title: '',
        content: '',
        type: '按区域发送',
        touids: '',
        tosourceid: '',
        corporation: '',
        status: '发布'
      },
      companyList: { // 公司列表
        data: [],
        loading: false
      },
      organOptions: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      rules: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'change' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'change' }
        ],
        type: [
          { required: true, trigger: 'change' }
        ],
        touids: [
          { required: true, message: '指定用户不能为空', trigger: 'change' }
        ],
        tosourceid: [
          { required: false, message: '请选择发送渠道', trigger: 'change' }
        ],
        corporation: [
          { required: false, trigger: 'change' }
        ],
        status: [
          { required: true, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    channelData() {
      return this.channellist
    }
  },
  methods: {
    //   获取公司
    getCompanyList() {
      if (!this.selectData.tosourceid || this.selectData.tosourceid === -1) {
        this.sourceId = ''
        return
      }
      this.companyList.loading = true
      const params = {
        level: 2,
        sourceId: this.selectData.tosourceid
      }
      getCompanysData(params).then(res => {
        this.companyList.loading = false
        this.companyList.data = res.data
        this.companyList.data.unshift({
          id: -1,
          name: '所有'
        })
        console.log(res)
      })
    },
    // 渠道数据变化
    handleChannelChange() {
      this.selectData.corporation = null
      this.companyList.data = []
    },
    // 获取机构
    queryOrgan() {
      if (!this.selectData.companyId) {
        this.organOptions = []
        return
      }
      const params = {
        sourceId: this.selectData.tosourceid,
        companyId: this.selectData.companyId
      }
      getOrganData(params).then(res => {
        console.log(res)
        this.organOptions = res.data
      })
    },
    handleOrganChange() {

    }
  }
}
</script>

<style scoped>
 .app-container{
    padding:20px;
  }
  .header-line {
    border-bottom: 1px #DCDFE6 solid;
    color: #909399;
    padding: 10px 0;
    margin-bottom: 20px;
  }
</style>
