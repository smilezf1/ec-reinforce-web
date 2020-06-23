<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#2193b0"
      text-color="#fff"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in sidebarList">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index"
              >
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                  >{{ threeItem.title }}</el-menu-item
                >
              </el-submenu>
              <el-menu-item
                v-else
                :index="subItem.index"
                :key="subItem.index"
                >{{ subItem.title }}</el-menu-item
              >
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<script>
import bus from "../common/bus";
export default {
  name: "Sidebar",
  data() {
    return {
      collapse: false,
      sidebarList: [
        {
          icon: "el-icon-s-home",
          index: "systemHome",
          title: "系统首页",
          subs: [{ index: "dashboard", title: "系统首页" }]
        },
        {
          icon: "el-icon-collection",
          index: "taskManager",
          title: "任务管理",
          subs: [
            {
              index: "reinforce",
              title: "加固"
            }
          ]
        },
        {
          icon: "el-icon-s-tools",
          index: "reinforceAllocation",
          title: "加固配置",
          subs: [
            { index: "reinforceStrategy", title: "加固策略" },
            { index: "reinforceItem", title: "加固项" },
            { index: "channelStrategy", title: "渠道策略" },
            { index: "signature", title: "签名" }
          ]
        },
        {
          icon: "el-icon-s-management",
          index: "systemManagement",
          title: "系统管理",
          subs: [
            { index: "userManagement", title: "用户管理" },
            { index: "roleManagement", title: "角色管理" },
            {
              index: "menuManagement",
              title: "菜单管理"
            }
          ]
        },
        {
          icon: "el-icon-menu",
          index: "systemRecommend",
          title: "系统介绍",
          subs: [{ index: "recommend", title: "系统介绍" }]
        }
      ]
    };
  },
  computed: {
    onRoutes() {
      /*  return this.$route.path.replace("/", ""); */
    }
  },
  created() {
    //通过Event Bus 进行组件间通信,来折叠侧边栏
    bus.$on("collapse", msg => {
      console.log(msg);
      this.collapse = msg;
      bus.$emig("collapse-content", msg);
    });
  }
};
</script>
<style>
.sidebar {
  display: block;
  position: absolute;
  top: 60px;
  bottom: 0;
  box-sizing: border-box;
}
.sidebar ::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 280px;
}
.sidebar-el-menu {
  height: 100%;
}
.el-menu-item i {
  color: #fff !important;
}
.el-submenu__title i {
  color: #fff !important;
}
.el-menu-item.is-active {
  background: #6dd5ed !important;
  color: white !important;
}
.el-submenu__icon-arrow {
  font-size: 16px;
}
.el-icon-arrow-down:before {
  color: white !important;
}
</style>
