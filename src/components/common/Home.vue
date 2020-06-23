<template>
  <div class="Home">
    <Header></Header>
    <Slidebar></Slidebar>
    <div class="content-box">
      <div class="content">
        <transition name="move" mode="out-in">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </transition>
        <el-backtop target=".content"></el-backtop>
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
    return {};
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
  box-sizing:border-box;
}
</style>
