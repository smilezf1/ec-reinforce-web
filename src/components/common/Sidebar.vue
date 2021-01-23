<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      background-color="#207BA6"
      text-color="#fff"
      active-text-color="#20a0ff"
      router
      unique-opened
      :default-active="onRoutes"
    >
      <template v-for="item in sidebarList">
        <template v-if="item.list">
          <el-submenu :index="item.title" :key="item.id">
            <template slot="title"
              ><i :class="item.icon"></i
              ><span slot="title">{{ item.title }}</span></template
            >
            <template v-for="subItem in item.list">
              <el-menu-item :index="'/home/' + subItem.jump" :key="subItem.id">
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.title" :key="item.id">
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
import api from "../../request/api";
export default {
  name: "Sidebar",
  data() {
    return {
      sidebarList: [],
      active: ""
    };
  },
  inject: ["reload"],
  computed: {
    onRoutes() {
      return this.$route.path;
    }
  },
  created() {
    const _this = this;
    api.userService.getUserMenuTree().then(res => {
      if (res.code == "00") {
        _this.sidebarList = this.toTreeData(res.data);
      }
    });
  },
  mounted() {
    this.active = this.$route.jump;
  },
  methods: {
    toTreeData(data) {
      data.forEach(item => {
        delete item.children;
      });
      const map = {};
      data.forEach(i => {
        map[i.id] = i;
      });
      const treeData = [];
      data.forEach((child, index) => {
        const mapItem = map[child.pId];
        if (mapItem) {
          (mapItem.children || (mapItem.children = [])).push(child);
          mapItem.children.name = index - index;
        } else {
          treeData.push(child);
        }
      });
      return treeData;
    }
  }
};
</script>
<style>
.sidebar {
  display: block;
  position: fixed;
  top: 60px;
  bottom: 0;
  box-sizing: border-box;
  z-index: 99;
  overflow-y: auto;
}
.sidebar > ul {
  height: 100%;
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
  background: #409eff !important;
  color: white !important;
}
.el-submenu__icon-arrow {
  font-size: 16px;
}
.el-icon-arrow-down:before {
  color: white !important;
}
</style>
