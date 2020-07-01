<template>
  <div class="yy">
    <el-table
      ref="menusTable"
      :row-style="showRow"
      :data="menusTable"
      v-bind="$attrs"
    >
      <el-table-column prop="name" lable="资源名称">
        <template slot-scope="scope">
          <span :class="['level' + scope.row.level]">
            <i
              v-if="scope.row.children"
              @click="opentToggle(scope.row)"
              :class="[
                scope.row.open ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
              ]"
            ></i>
            {{ scope.row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="资源路径">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column props="icon" label="资源图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="资源类型">
        <template>
          <template slot-scope="scope">
            {{ scope.row.type }}
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作">
        <template slot-scope="scope">
          <!-- 判断下面是否有子菜单，有子菜单不能是有删除按钮 -->
          <el-button v-if="!scope.row.children" type="text" size="small"
            >删除</el-button
          >
          <el-button type="text" size="small">编辑</el-button>
          {{ scope.row.operation }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import http from "../../http";
export default {
  data() {
    return {
      //菜单树结构数据
      menusTree: [],
      menusTable: []
    };
  },
  mounted() {
    let baseUrl = this.api.baseUrl;
    http.fetchGet(baseUrl + "/api/system/menu/list").then(res => {
      this.menusTable = this.toTreeData(res.data.data);
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
    },
    showRow(row) {
      console.log(row.row.parent);
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true;
      /* const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true;
      row.row._show = show;
      return show
        ? "animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;"
        : "display:none;"; */
    },
    //树节点开关操作
    opentToggle(item) {
      //展开和关闭样式的变换方法
      Vue.set(item, "open", !item.open);
      //展开的时候,显示子节点,关闭的时候隐藏子节点,遍历所有的子节点,加入到menusTable
      for (let j = 0; j < this.menusTable.length; j++) {
        //找到父节点的id,然后依次把子节点放到数组里面父节点里面
        if (this.menusTable[j].id !== item.id) {
          continue;
        }
        if (item.open) {
          let menusTable = this.menusTable;
          item.children.forEach((child, index) => {
            menusTable.splice(j + index + 1, 0, child); //添加子节点
          });
        } else {
          this.menusTable.splice(j + 1, item.children.length);
        }
        break;
      }
    }
  }
};
</script>
<style>
.level1,
.level2,
.level3 {
  display: inline-block;
  width: 20px;
}

.level1 {
  margin-left: 5px;
}

.level2 {
  margin-left: 20px;
}

.level3 {
  margin-left: 35px;
}
</style>
