<template>
  <div class="reinforceStrategy">
    <div class="reinforceStrategyHeader">
      <p>当前位置:加固策略</p>
    </div>
    <!-- 查询 -->
    <div class="searchForm">
      <div class="searchBox">
        <el-form :model="ruleForm" ref="ruleForm">
          <el-input
            placeholder="请输入策略名称"
            size="small"
            v-model="ruleForm.strategyName"
          ></el-input>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "reinforceStrategy",
  data() {
    return {
      ruleForm: {
        strategyName: ""
      }
    };
  }
};
</script>
<style>
.reinforceStrategyHeader {
  height: 50px;
  line-height: 50px;
  padding-left: 20px;
  font-size: 14px;
}
</style>
