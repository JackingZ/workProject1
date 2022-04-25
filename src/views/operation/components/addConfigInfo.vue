<template>
  <div v-loading="editData.isLoading" class="add-personal-manager">
    <div class="add-personal-form">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm" label-position="left">
        <el-form-item label="类型：" prop="typeCode">
          <el-select
            v-model="ruleForm.typeCode"
            size="small"
            clearable
            filterable
            placeholder="请选择类型"
            style="margin-right: 10px;width: 280px;flex: 0 0 auto;">
            <el-option
              v-for="item in typeData"
              :key="item.id"
              :label="item.text"
              :value="item.code"/>
          </el-select>
          <!-- <el-input v-model="ruleForm.typeCode" size="small" /> -->
        </el-form-item>
        <el-form-item label="信息：" prop="text">
          <el-input v-model="ruleForm.text" size="small" placeholder="请输入信息" />
        </el-form-item>
        <el-form-item label="描述：">
          <el-input v-model="ruleForm.description" type="textarea" size="small" placeholder="请输入描述信息" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AddConfigInfo',
  props: {
    typeData: {
      type: Array,
      default: () => []
    },
    editData: {
      type: Object,
      default: () => {}
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ruleForm: {
        typeCode: this.editData.typeCode ? this.editData.typeCode : '',
        text: this.editData.text ? this.editData.text : '',
        description: this.editData.description ? this.editData.description : ''
      },
      rules: {
        typeCode: [
          { required: true, message: '请选择类型编码', trigger: 'change' }
        ],
        text: [
          { required: true, message: '请输入信息', trigger: 'blur' }
        ]
        // description: [
        //   { required: true, message: '请选择活动区域', trigger: 'blur' }
        // ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'isAnyAdminChannel' // 判断登陆用户是否管理员渠道
    ])
  },
  watch: {
    // isShow(newVal) {
    //   if (newVal && !this.isEdit) {
    //     console.log('isShow变化')
    //   }
    // },
    isEdit() {
      this.ruleForm = {}
      this.$refs.ruleForm.resetFields()
    },
    'editData': function(newVal) {
      console.log('值变化了')
      if (newVal) {
        this.ruleForm = this.editData
      }
    },
    deep: true
  },
  created() {
    // if (!this.isEdit) this.initData()
  },
  methods: {
    // async validateUserName(rule, value, callback) {
    //   const reg = /^(\w|\-|\_){2,40}$/
    //   const regN = /^\d{11}$/
    //   if (!this.ruleForm.channel) {
    //     callback(new Error('请选择渠道'))
    //     return
    //   }
    //   if (!value) {
    //     callback(new Error('请输入登录账号'))
    //   } else if (!reg.test(value)) {
    //     callback(new Error('请输入2-40位数字 字母 下划线(_) 连字符(-)'))
    //   } else if (value !== this.initialName) {
    //     const res = await checkOrgExistUser({
    //       userName: this.ruleForm.userName,
    //       channelCode: this.ruleForm.channel
    //     })
    //     if (res.data === true) {
    //       callback(new Error('登录账号已存在'))
    //     } else {
    //       callback()
    //     }
    //   } else {
    //     callback()
    //   }
    // }
  }
}
</script>

<style lang="scss">
.add-personal-sub-title {
  color: #999;
  font-size: 14px;
  padding: 10px;
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;
}
.add-personal-manager {
  margin: 20px;
  .el-form-item__content {
    width: 250px;
  }
  .add-personal-form {
    padding-left: 10px;
    .add-personal-title {
      font-size: 14px;
      color: #aaa;
    }
  }
  .el-form-item {
    width: 50%;
  }
  .el-input,
  .el-select {
    max-width: 320px;
  }
  .el-select {
    width: 100%;
  }
  .el-checkbox+.el-checkbox {
    margin-left: 0;
  }
  .el-checkbox__label{
    width: 120px;
  }
}

.el-radio+.el-radio{
  margin-left:15px;
}
.add-personal-manager .el-form-item__content {
    width: 280px;
}
</style>

