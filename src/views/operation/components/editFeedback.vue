<template>
  <div v-loading="editData.loading" class="app-container">
    <el-form
      ref="eidtFeedback"
      :model="selectData"
      :rules="rules"
      label-width="115px"
      label-position="left">
      <el-form-item label="用户：" style="margin-left:10px">
        <el-input v-model="selectData.named" style="width:100%; margin-left:-10px " disabled/>
      </el-form-item>
      <el-form-item label="手机号码：" style="margin-left:10px">
        <el-input v-model="selectData.cell" style="width:100%; margin-left:-10px " disabled/>
      </el-form-item>
      <el-form-item label="所属渠道：" style="margin-left:10px">
        <el-input v-model="selectData.sourceId" style="width:100%; margin-left:-10px " disabled/>
      </el-form-item>
      <el-form-item label="所属机构：" style="margin-left:10px">
        <el-input v-model="selectData.agentGroup" style="width:100%; margin-left:-10px " disabled/>
      </el-form-item>
      <el-form-item label="内容：" style="margin-left:10px">
        <el-input v-model="selectData.content" rows="5" type="textarea" style="width:100%;margin-left:-10px" disabled/>
      </el-form-item>
      <el-form-item v-if="!selectData.images||selectData.images.length!==0">
        <el-popover
          ref="popover"
          placement="right"
          trigger="click">
          <el-row v-if="!selectData.images||selectData.images.length!==0">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-carousel arrow="always">
                <el-carousel-item v-for="item in selectData.images" :key="item.size">
                  <img :src="item.files" alt="图片">
                </el-carousel-item>
              </el-carousel>
            </el-col>
          </el-row>
        </el-popover>
        <el-button v-popover:popover v-model="selectData.images" type="text">查看图片</el-button>
      </el-form-item>
      <el-form-item label="处理流程：" style="margin-left:10px" prop="cell">
        <el-select
          v-model="selectData.status"
          style="width: 100%; margin-left:-10px;flex: 0 0 auto;"
        >
          <el-option :value="0" label="待处理" />
          <el-option :value="1" label="处理中" />
          <el-option :value="2" label="已处理" />
          <el-option :value="3" label="已忽略" />
        </el-select>
      </el-form-item>
      <el-form-item label="回复：" style="margin-left:10px" prop="reply">
        <el-input v-model="selectData.reply" rows="5" type="textarea" style="width:100%;margin-left:-10px" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'EditFeedBack',
  props: {
    editData: {
      type: Object,
      default() {
        return {
          loading: false
        }
      }
    }
  },
  data() {
    return {
      rules: {
        agentGroup: [
          { required: true, message: '机构不能为空', trigger: 'bur' }
        ],
        status: [
          { required: true, message: '处理流程不能为空', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    selectData() {
      return this.editData.data
    }
  },
  watch: {
    'editData': function(newVal) {
      console.log('值变化了')
    },
    deep: true
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
<style lang="scss">
    .el-popover{
    .el-row{
      .el-col{
        .el-carousel{
           width: 490px;
           height: 600px;
          .el-carousel__container{
            width: 490px;
            height: 600px;
            .el-carousel__item{+
              img{
               width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
    }
  }
</style>
