<template>
  <div class="Home">
    <Header></Header>
    <Slidebar></Slidebar>
    <div class="content-box" :class="{ 'content-collapse': collapse }">
      <div class="content">
        <keep-alive>
          <router-view v-if="$route.meta.KeepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.KeepAlive"></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "@/components/common/Header.vue";
import Slidebar from "@/components/common/Sidebar.vue";
import bus from "./bus";
export default {
  name: "Home",
  components: { Header, Slidebar },
  data() {
    return {
      collapse: false
    };
  },
  created() {
    bus.$on("collapse-content", msg => {
      this.collapse = msg;
    });
  }
};
</script>
<style>
.content-box {
  width: 100%;
  position: absolute;
  padding-left: 280px;
  box-sizing: border-box;
}
.content {
  padding: 10px 10px 40px 20px;
  overflow-y: auto;
  margin-top: 60px;
}
</style>
