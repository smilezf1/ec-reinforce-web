<template>
  <div class="inexistence">
    <img src="../../assets/404.png" />
    <div class="inexistanceContent">
      <h1>抱歉,您访问的页面不存在!</h1>
      <el-button size="primary" class="goBackHome" @click="goBackHome"
        >返回首页</el-button
      >
    </div>
  </div>
</template>
<script>
export default {
  name: "inexistence",
  methods: {
    goBackHome() {
      this.$router.push({ name: "dashboard" });
    }
  }
};
</script>
<style>
.inexistence {
  margin: 20px;
  display: flex;
  align-items: center;
}
.goBackHome {
  border-radius: 0px;
  margin-top: 30px;
}
</style>
