<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      background-color="#207BA6"
      text-color="#fff"
      active-text-color="#20a0ff"
      router
      unique-opened
    >
      <template v-for="item in sidebarList">
        <template v-if="item.children">
          <el-submenu :index="item.id" :key="item.id">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.name }}</span>
            </template>
            <template v-for="subItem in item.children">
              <el-submenu
                v-if="subItem.children"
                :index="subItem.address"
                :key="subItem.id"
              >
                <template slot="title">{{ subItem.name }}</template>
                <el-menu-item
                  v-for="threeItem in subItem.children"
                  :key="threeItem.id"
                  >{{ threeItem.name }}</el-menu-item
                >
              </el-submenu>
              <el-menu-item v-else :index="subItem.address" :key="subItem.id">{{
                subItem.name
              }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.address" :key="item.id">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<script>
import bus from "../common/bus";
import http from "../../http.js";
export default {
  name: "Sidebar",
  data() {
    return {
      sidebarList: []
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  created() {
    let baseUrl = this.api.baseUrl,
      _this = this;
    http.fetchGet(baseUrl + "/api/system/menu/list").then(res => {
      /*  _this.sidebarList = res.data.data; */
      _this.sidebarList = this.toTreeData(res.data.data);
    });
  },
  methods: {
    toTreeData(data) {
      //删除所有的children,以防止多次调用
      data.forEach(item => {
        delete item.children;
      });
      let map = {}; //构建map
      data.forEach(i => {
        map[i.id] = i; //构建以id为键 当前数据为值
      });
      let treeData = [];
      data.forEach(child => {
        const mapItem = map[child.pId]; //判断当前数据的pId是否存在map中
        if (mapItem) {
          //不是最顶层的数据
          //注:这里map中的数据是引用了data的它的指向还是data,当mapItem改变时,arr也会改变
          (mapItem.children || (mapItem.children = [])).push(child); //判断mapItem是否存在child
        } else {
          //顶层数据
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
  position: absolute;
  top: 60px;
  bottom: 0;
  box-sizing: border-box;
  z-index: 2;
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
  background: #409eff63 !important;
  color: white !important;
}
.el-submenu__icon-arrow {
  font-size: 16px;
}
.el-icon-arrow-down:before {
  color: white !important;
}
</style>
