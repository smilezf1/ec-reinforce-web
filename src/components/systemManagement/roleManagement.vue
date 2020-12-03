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
        <el-button type="primary" size="small" @click="search(ruleForm)"
          >查询</el-button
        >
        <el-button type="primary" size="small" @click="addRole()"
          >新增角色</el-button
        >
        <el-drawer
          title="新增角色"
          :visible.sync="addRoleDrawer"
          :with-header="false"
          :wrapperClosable="false"
          :close-on-press-escape="false"
          size="30%"
          ref="addRoleDrawer"
          @close="resetForm('addRoleForm')"
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
                  size="small"
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

        <el-button
          type="primary"
          size="small"
          @click="refresh()"
          style="margin-left:10px"
          >刷新</el-button
        >
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
              <el-button size="small" type="primary" @click="edit(scope.row.id)"
                >编辑</el-button
              >
              <el-drawer
                title="编辑"
                :visible.sync="editDrawer"
                :with-header="false"
                :wrapperClosable="false"
                :close-on-press-escape="false"
                size="30%"
                ref="editDrawer"
              >
                <div class="el-drawer-header">
                  <h3>编辑</h3>
                </div>
                <div class="el-drawer-content">
                  <el-form :model="editForm" ref="editForm" :rules="rules">
                    <el-form-item label="角色名称" prop="name">
                      <el-input
                        v-model="editForm.name"
                        auto-complete="off"
                        size="small"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="是否有效" prop="status">
                      <el-select
                        v-model="editForm.status"
                        disabled
                        size="small"
                      >
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                      </el-select>
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
              <el-button
                size="small"
                type="success"
                @click="setting(scope.row.id)"
                >设置菜单</el-button
              >
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
              <el-button
                size="small"
                type="danger"
                v-if="scope.row.status == 1"
                @click="blockUp(scope.row.id)"
                >停用</el-button
              >
              <el-button
                size="small"
                type="warning"
                v-if="scope.row.status == 0"
                @click="launch(scope.row.id)"
                >启用</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>

    <div class="roleManagementBase">
      <template>
        <pagination @pageChanged="onPageChanged"></pagination>
      </template>
    </div>
  </div>
</template>
<script>
import api from "../../request/api";
import pagination from "../common/pagination";
import pageMixins from "../../utils/pageMixins";
export default {
  name: "roleManagement",
  components: { pagination },
  mixins: [pageMixins],
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
      curPage: 1,
      limit: 10,
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
    async getData() {
      const params = {};
      params.queryInfo = this.ruleForm;
      this.getDataItem(this.addPageInfo(params));
    },
    //获取后台数据
    getDataItem(params) {
      const _this = this;
      api.systemManageService.roleManageList(params).then(res => {
        if (res.code == "00") {
          const count = res.data.count,
            { pn: number, limit: size } = params;
          _this.listItem = res.data.items;
          _this.curPage = number;
          _this.limit = size;
          this.onGotPageData({ totalElements: count, size, number });
        }
      });
    },
    search(ruleForm) {
      const _this = this;
      _this.loading = true;
      this.getData();
      setTimeout(function() {
        _this.loading = false;
      }, 500);
    },
    //关闭Drawer时清空表单中的值
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //新增角色开始
    addRole() {
      this.addRoleDrawer = true;
    },
    saveaddRole(formName, form) {
      const name = form.name;
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = { name };
          api.systemManageService.roleManageSave(params).then(res => {
            if (res.code == "00") {
              this.reload();
              this.$notify.success({
                message: "新增角色成功",
                showClose: false,
                duration: 1000
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    cancelSaveaddRole() {
      this.addRoleDrawer = false;
    },
    edit(id) {
      this.editDrawer = true;
      this.editId = id;
      const params = { id };
      api.systemManageService.roleManageDetail(params).then(res => {
        if (res.code == "00") {
          this.editForm = res.data;
        }
      });
    },
    refresh() {
      this.reload();
    },
    saveEditForm(formName, editForm) {
      const name = editForm.name,
        id = this.editId,
        params = { id, name };
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          api.systemManageService.roleManageSaveEdit(params).then(res => {
            if (res.code == "00") {
              this.reload();
              this.editDrawer = false;
              this.$notify.success({
                message: "编辑成功",
                showClose: false,
                duration: 1000
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    cancelForm() {
      this.editDrawer = false;
    },
    //将数据转化成树形格式
    toTreeData(data) {
      data.forEach(item => {
        delete item.children;
      });
      let map = {};
      data.forEach(i => {
        map[i.id] = i;
      });
      let treeData = [];
      data.forEach(child => {
        const mapItem = map[child.pId];
        if (mapItem) {
          (mapItem.children || (mapItem.children = [])).push(child);
        } else {
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
      this.menuDialog = true;
      this.setMenuId = id;
      const params = { roleId: id };
      api.systemManageService.roleManageSettingMenu(params).then(res => {
        let data = res.data;
        (data = JSON.parse(JSON.stringify(data).replace(/name/g, "label"))),
          (this.menuTreeData = this.toTreeData(data));
        this.setMenuList = this.setSelectedList(this.menuTreeData);
      });
    },
    setSelectedList(menuTreeData) {
      this.setMenuList = [];
      menuTreeData.forEach((v, i) => {
        if (v.children) {
          v.children.forEach((v, i) => {
            if (v.checked == true) {
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
      return this.setMenuList;
    },
    setMenuSave() {
      const id = this.setMenuId,
        nodes = this.checkedNodes;
      let menuList = this.menuList,
        selectedList = this.setMenuList;
      if (nodes && nodes.length != 0) {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].id.indexOf("T")) {
          } else {
            nodes[i].id = nodes[i].id.replace("T", "");
            menuList.push(nodes[i].id);
            menuList = Array.from(new Set(menuList));
          }
        }
      } else {
        if (selectedList && selectedList.length != 0) {
          for (let i = 0; i < selectedList.length; i++) {
            selectedList[i] = selectedList[i].replace("T", "");
            menuList.push(selectedList[i]);
            menuList = Array.from(new Set(menuList));
          }
        }
      }
      new this.$messageTips(({ confirm }) => {
        confirm({ content: "确定要更新菜单列表吗?" });
      }).then(() => {
        const params = { btnList: [], itemList: menuList, roleId: id };
        api.systemManageService.roleManageSettingMenuSave(params).then(res => {
          if (res.code == "00") {
            this.$notify({
              message: "更新成功",
              type: "success",
              duration: 1000
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
      new this.$messageTips(({ alert }) => {
        alert({ content: "确定要停用吗?", tip: "确定停用" });
      }).then(() => {
        const params = { id };
        api.systemManageService.roleManageBlockUp(params).then(res => {
          if (res.code === "00") {
            this.reload();
            this.$notify.success({
              message: "停用成功",
              type: "warning",
              showClose: false,
              duration: 1000
            });
          }
        });
      });
    },
    //启用
    launch(id) {
      new this.$messageTips(({ alert }) => {
        alert({ content: "确定要启用吗", tips: "确定启用" });
      }).then(() => {
        const params = { id };
        api.systemManageService.roleManageLaunch(params).then(res => {
          if (res.code === "00") {
            this.reload();
            this.$notify.success({
              message: "启用成功",
              showClose: false,
              duration: 1000
            });
          }
        });
      });
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style>
.roleManagementHeader {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}
.searchBox .el-input {
  margin: 0px 5px 5px 0px;
}
.roleManagement .searchForm {
  display: flex;
}
.roleManagement .searchBox {
  margin-bottom: 15px;
  display: flex;
}
.roleManagement .operateBox {
  margin-left: 20px;
}
.roleManagement .searchBox .el-input,
.roleManagement .searchBox .el-select {
  width: auto;
}
.roleManagement .el-select {
  width: 100%;
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
.roleManagement .el-drawer-footer {
  width: 30%;
}
.roleManagementBase {
  margin-top: 20px;
}
</style>
