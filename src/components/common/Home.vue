<template>
  <div class="Home">
    <Header></Header>
    <Slidebar></Slidebar>
    <!-- <xx></xx> -->
    <div class="content-box" :class="{ 'content-collapse': collapse }">
      <div class="content">
        <transition name="move" mode="out-in">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "@/components/common/Header.vue";
import Slidebar from "@/components/common/Sidebar.vue";
import xx from "@/components/common/xx.vue";
import bus from "./bus";
export default {
  name: "Home",
  components: { Header, Slidebar, xx },
  data() {
    return {
      collapse: false
    };
  },
  created() {
    bus.$on("collapse-content", msg => {
      this.collapse = msg;
    });
    //只有在标签页列表里的页面才能使用keep-alive,关闭标签后就不保存在内存中
    /*  bus.$on("tags", msg => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
    }); */
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
.content{
  padding:10px 10px 40px 20px;
  overflow-y:auto;
  margin-top:60px;
}
</style>
