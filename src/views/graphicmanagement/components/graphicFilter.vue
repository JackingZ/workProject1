<template>
  <div class="app-container">
    <el-form
      ref="GraphicFilter"
      :model="searchValue"
      class="addEditPictureFormList"
      label-width="110px"
      label-position="left"
    >

      <el-form-item label="链接地址:">
        <el-select
          v-model="searchValue.hasLinkUrl"
          clearable
          placeholder="请选择"
          style="width: 100%;"
          size="small"
        >
          <el-option
            v-for="item in link"
            :key="item.key"
            :label="item.key"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间:">
        <el-date-picker
          v-model="searchValue.createTimeList"
          clearable
          size="small"
          style="width: 100%;"
          type="daterange"
          range-separator="至"
          start-placeholder="年/月/日"
          end-placeholder="年/月/日"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>

      <el-form-item label="起始时间:">
        <el-date-picker
          v-model="searchValue.startTimeList"
          clearable
          size="small"
          style="width: 100%;"
          type="daterange"
          range-separator="至"
          start-placeholder="年/月/日"
          end-placeholder="年/月/日"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>

      <el-form-item label="截止时间:">
        <el-date-picker
          v-model="searchValue.endTimeList"
          clearable
          size="small"
          style="width: 100%;"
          type="daterange"
          range-separator="至"
          start-placeholder="年/月/日"
          end-placeholder="年/月/日"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
    </el-form>

    <div style="text-align: center;">
      <el-button type="primary" size="small" @click="screen">确定</el-button>
      <el-button plain size="small" @click="reset">重置</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'GraphicFilter',
  props: {
    searchValue: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      link: [
        { key: '有', value: 1 },
        { key: '无', value: 0 }
      ]
    }
  },
  created() {},
  methods: {
    screen() {
      this.$emit('screen')
    },
    reset() {
      this.$emit('reset')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
