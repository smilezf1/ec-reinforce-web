<template>
  <div class="roleManagement">
    <div class="roleManagementHeader">
      <p>当前位置: 角色管理</p>
    </div>
    <div class="searchForm">
      <div class="searchBox">
        <el-form :model="ruleForm" ref="ruleForm">
          <el-input
            placeholder="请输入角色名称"
            size="small"
            v-model="ruleForm.name"
          ></el-input>
          <el-select
            placeholder="是否有效"
            v-model="ruleForm.status"
            size="small"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form>
      </div>
      <div class="operateBox">
        <el-tooltip effect="dark" content="查询" placement="top-start">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="search(ruleForm)"
          ></el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="新增角色" placement="top-start">
          <el-button
            type="primary"
            icon="el-icon-zoom-in"
            size="small"
            @click="addRole()"
          ></el-button>
        </el-tooltip>
        <el-drawer
          title="新增角色"
          :visible.sync="addRoleDrawer"
          :with-header="false"
          :wrapperClosable="false"
          :close-on-press-escape="false"
          ref="addRoleDrawer"
        >
          <div class="el-drawer-header">
            <h3>新增角色</h3>
          </div>
          <div class="el-drawer-content">
            <el-form :model="addRoleForm" :rules="rules" ref="addRoleForm">
              <el-form-item label="角色名称" prop="name">
                <el-input
                  v-model="addRoleForm.name"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="el-drawer-footer">
            <el-button
              type="primary"
              @click="saveaddRole('addRoleForm', addRoleForm)"
              >保存</el-button
            >
            <el-button @click="cancelSaveaddRole()" plain>取消</el-button>
          </div>
        </el-drawer>

        <el-tooltip effect="dark" content="刷新" placement="top-start">
          <el-button
            type="primary"
            icon="el-icon-refresh-right"
            size="small"
            @click="refresh()"
            style="margin-left:10px"
          ></el-button>
        </el-tooltip>
      </div>
    </div>
    <div class="roleManagementBody">
      <template>
        <el-table
          ref="listItem"
          :data="listItem"
          v-loading="loading"
          element-loading-text="加载中"
        >
          <el-table-column type="index" label="序号" width="150">
            <template slot-scope="scope">
              <span>{{ (curPage - 1) * limit + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="角色名称" width="300">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column prop="status" label="是否有效" width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.status === '1'">是</span>
              <span v-if="scope.row.status === '0'">否</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            :show-overflow-tooltip="true"
            width="300"
          >
            <template slot-scope="scope">{{ scope.row.createTime }}</template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="更新时间"
            :show-overflow-tooltip="true"
            width="300"
          >
            <template slot-scope="scope">{{ scope.row.updateTime }}</template>
          </el-table-column>
          <el-table-column prop="operation" label="操作" width="400">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="编辑" placement="top-start">
                <i
                  class="el-icon-edit-outline editIcon"
                  @click="edit(scope.row.id)"
                ></i>
              </el-tooltip>
              <el-drawer
                title="编辑"
                :visible.sync="editDrawer"
                :with-header="false"
                :wrapperClosable="false"
                :close-on-press-escape="false"
                ref="editDrawer"
              >
                <div class="el-drawer-header">
                  <h3>编辑</h3>
                </div>
                <div class="el-drawer-content">
                  <el-form :model="editForm" ref="editForm">
                    <el-form-item label="角色名称">
                      <el-input
                        v-model="editForm.name"
                        auto-complete="off"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="是否有效">
                      <el-input
                        v-model="editForm.status"
                        :disabled="true"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="el-drawer-footer">
                  <el-button
                    type="primary"
                    @click="saveEditForm('editForm', editForm)"
                    >保存</el-button
                  >
                  <el-button @click="cancelForm" plain>取消</el-button>
                </div>
              </el-drawer>

              <el-tooltip
                effect="dark"
                content="设置菜单"
                placement="top-start"
                v-if="scope.row.status == 1"
              >
                <i
                  class=" el-icon-setting settingIcon"
                  @click="setting(scope.row.id)"
                ></i>
              </el-tooltip>
              <el-dialog
                title="菜单列表"
                :visible.sync="menuDialog"
                width="20%"
              >
                <el-tree
                  :data="menuTreeData"
                  node-key="id"
                  show-checkbox
                  :default-checked-keys="setMenuList"
                  :props="defaultProps"
                  @check="handleCheck"
                ></el-tree>
                <div class="el-dialog-footer" style="text-align:center">
                  <el-button type="primary" @click="setMenuSave"
                    >确定</el-button
                  >
                </div>
              </el-dialog>
              <el-tooltip
                effect="dark"
                content="停用"
                placement="top-start"
                v-if="scope.row.status == 1"
              >
                <i
                  class="el-icon-circle-close closeIcon"
                  @click="blockUp(scope.row.id, scope.row.type)"
                ></i>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="启用"
                placement="top-start"
                v-if="scope.row.status == 0"
              >
                <i
                  class="el-icon-circle-check checkIcon"
                  @click="launch(scope.row.id)"
                ></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <div class="roleManagementBase">
      <template>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="curPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="dataCount"
          class="pagingBox"
        >
        </el-pagination>
      </template>
    </div>
  </div>
</template>
<script>
import https from "../../http.js";
export default {
  name: "roleManagement",
  data() {
    return {
      ruleForm: {
        name: "",
        status: ""
      },
      options: [
        { label: "是", id: "1" },
        { label: "否", id: "0" }
      ],
      listItem: [],
      dataCount: 0, //总数目
      curPage: 1, //当前页
      limit: 10, //每页显示的条目数
      editDrawer: false,
      addRoleDrawer: false,
      menuDialog: false,
      menuTreeData: [],
      menuList: [],
      setMenuList: [],
      setParMentList: [],
      checkedNodes: [], //菜单列表选中的数据
      defaultProps: {
        children: "children",
        label: "label"
      },
      rules: {
        name: [{ required: true, message: "请输入角色名称", tirgger: "blur" }]
      },
      addRoleForm: {
        name: ""
      },
      editForm: {
        name: "",
        status: ""
      },
      editId: null,
      loading: false
    };
  },
  inject: ["reload"],
  methods: {
    //获取后台数据
    getData(queryInfo) {
      let baseUrl = this.api.baseUrl,
        _this = this;
      https
        .fetchPost(baseUrl + "/api/system/role/page", {
          pn: this.curPage,
          limit: this.limit,
          queryInfo
        })
        .then(res => {
          _this.listItem = res.data.data.items;
          _this.dataCount = res.data.data.count;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleChange(val) {
      this.curPage = val;
      this.getData();
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getData();
    },
    handleCurrentChange(val) {
      let name = this.ruleForm.name,
        status = this.ruleForm.status,
        queryInfo = { name, status };
      this.curPage = val;
      this.getData(queryInfo);
    },
    search(ruleForm) {
      let baseUrl = this.api.baseUrl,
        name = ruleForm.name,
        status = ruleForm.status,
        _this = this;
      _this.loading = true;
      let queryInfo = { name, status };
      this.getData(queryInfo);
      setTimeout(function() {
        _this.loading = false;
      }, 500);
    },
    //新增角色开始
    addRole() {
      this.addRoleDrawer = true;
    },
    saveaddRole(formName, form) {
      let baseUrl = this.api.baseUrl,
        name = form.name;
      this.$refs[formName].validate(valid => {
        if (valid) {
          https
            .fetchPost(baseUrl + "/api/system/role/save", { name })
            .then(res => {
              if (res.data.code === "00") {
                this.reload();
                this.$$notify.success({
                  title: "成功",
                  message: "新增角色成功",
                  showClose: false
                });
              }
            });
        } else {
          return false;
        }
      });
      /*  this.addRoleDrawer = false; */
    },
    cancelSaveaddRole() {
      this.addRoleDrawer = false;
    },
    edit(id) {
      this.editDrawer = true;
      this.editId = id;
      let baseUrl = this.api.baseUrl;
      https.fetchGet(baseUrl + "/api/system/role/detail", { id }).then(res => {
        this.editForm.name = res.data.data.name;
        if (res.data.data.status === "1") {
          this.editForm.status = "是";
        } else if (res.data.data.status === "0") {
          this.editForm.status = "否";
        }
      });
    },
    refresh() {
      console.log("哈哈");
      const _this = this;
      _this.reload();
    },
    saveEditForm(formName, editForm) {
      let baseUrl = this.api.baseUrl,
        name = editForm.name,
        id = this.editId;
      https
        .fetchPost(baseUrl + "/api/system/role/save", { id, name })
        .then(res => {
          this.reload();
          this.editDrawer = false;
          this.$notify.success({
            title: "成功",
            message: "编辑成功",
            showClose: false
          });
        });
    },
    cancelForm() {
      this.editDrawer = false;
    },
    //将数据转化成树形格式
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
    //设置菜单开始
    handleCheck(checkedNodes, checkedKeys) {
      this.checkedNodes = checkedKeys.checkedNodes;
    },
    setting(id) {
      let baseUrl = this.api.baseUrl;
      this.menuDialog = true;
      this.setMenuId = id;
      https
        .fetchGet(baseUrl + "/api/system/menu/menuTree", { roleId: id })
        .then(res => {
          let data = res.data.data;
          (data = JSON.parse(JSON.stringify(data).replace(/name/g, "label"))),
            (this.menuTreeData = this.toTreeData(data));
          for (var j = 0; j < this.menuTreeData.length; j++) {
            if (this.menuTreeData[j].children) {
              for (var k = 0; k < this.menuTreeData[j].children.length; k++) {
                if (this.menuTreeData[j].children[k].id.startsWith("T")) {
                  this.menuTreeData[j].children[k].id = this.menuTreeData[
                    j
                  ].children[k].id.substring(1);
                }
              }
            }
            if (this.menuTreeData[j].id.startsWith("M")) {
              this.menuTreeData[j].id = this.menuTreeData[j].id.substring(1);
            }
          }
          this.menuTreeData.forEach((v, i) => {
            if (v.children) {
              v.children.forEach((v, i) => {
                if (v.checked == true) {
                  if (v.pId.startsWith("M")) {
                    this.setParMentList.push(v.pId.substring(1));
                    this.setParMentList = Array.from(
                      new Set(this.setParMentList)
                    );
                  }
                  this.setMenuList.push(v.id);
                  this.setMenuList = Array.from(new Set(this.setMenuList));
                }
              });
            } else {
              if (v.checked == true) {
                this.setMenuList.push(v.id);
                this.setMenuList = Array.from(new Set(this.setMenuList));
              }
            }
          });
        });
    },
    setMenuSave() {
      let baseUrl = this.api.baseUrl,
        id = this.setMenuId,
        nodes = this.checkedNodes,
        menuList = this.menuList;
      if (nodes && nodes.length != 0) {
        for (var i = 0; i < nodes.length; i++) {
          menuList.push(nodes[i].id);
          menuList = Array.from(new Set(menuList));
          console.log(menuList, "------");
        }
      }
      this.$confirm("确定要更新菜单列表吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        https
          .fetchPost(baseUrl + "/api/system/role/saveRoleItem", {
            btnList: [],
            itemList: menuList,
            roleId: id
          })
          .then(res => {
            if (res.data.code == "00") {
              this.$notify({
                title: "成功",
                message: "更新成功",
                type: "success"
              });
              this.reload();
              this.menuDialog = false;
            }
          });
      });
    },
    //设置菜单结束
    //停用
    blockUp(id) {
      let baseUrl = this.api.baseUrl;
      this.$alert("确定要停用吗?", "确定停用", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          https
            .fetchGet(baseUrl + "/api/system/role/invalid", { id })
            .then(res => {
              if (res.data.code === "00") {
                this.reload();
                this.$notify.success({
                  message: "停用成功",
                  type: "warning",
                  showClose: false
                });
              }
            });
        })
        .catch(() => {
          console.log("取消停用");
        });
      console.log(id, type);
    },
    //启用
    launch(id) {
      let baseUrl = this.api.baseUrl;
      this.$alert("确定要启用吗?", "确定启用", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          https
            .fetchGet(baseUrl + "/api/system/role/active", { id })
            .then(res => {
              if (res.data.code === "00") {
                this.reload();
                this.$notify.success({
                  message: "启用成功",
                  showClose: false
                });
              }
            });
        })
        .catch(() => {
          console.log("取消启用");
        });
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style scoped>
.roleManagementHeader {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}
.searchBox .el-input {
  margin: 0px 5px 5px 0px;
}
.searchForm {
  display: flex;
}
.searchBox {
  margin-bottom: 15px;
  display: flex;
}
.operateBox {
  margin-left: 20px;
}
.editIcon,
.settingIcon,
.closeIcon,
.checkIcon {
  font-size: 22px;
  color: #409eff;
  margin-right: 10px;
  cursor: pointer;
}
.el-table {
  font-size: 12px;
  border: 1px solid #dcdee2;
  border-bottom: 1px solid transparent;
}
.el-table thead {
  color: #515a6e;
}
.el-table__header-wrapper {
  background: #f8f8f9;
}
.el-table__header-wrapper th {
  background: #f2f5f7;
}
.el-table ::before {
  background: white;
}
.el-drawer-header {
  height: 50px;
  padding: 17px 20px;
  border-bottom: 1px solid #ebebeb;
}
.el-drawer-content {
  padding: 20px;
}
.el-drawer-header h3 {
  color: #333;
  font-size: 16px;
  font-weight: 600;
}
.el-drawer-footer {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
.el-input {
  width: auto;
}
/* .el-button--primary {
  background: #207ba6;
  border-color: #207ba6;
} */
.roleManagementBase {
  margin-top: 20px;
}
</style>
