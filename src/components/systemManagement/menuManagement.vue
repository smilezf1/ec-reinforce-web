<template>
  <div class="menuManagement">
    <div class="menuManagementHeader">
      <p>当前位置:菜单管理</p>
    </div>
    <div class="operateBox">
      <el-button type="primary" size="small" @click="addCatalogue()"
        >新增目录</el-button
      >
      <el-drawer
        title="新增目录"
        :visible.sync="addDrawer"
        :with-header="false"
        :wrapperClosable="false"
        :close-on-press-escape="false"
        size="30%"
        ref="addDrawer"
        @close="resetForm('addCatalogueForm')"
      >
        <div class="el-drawer-header">
          <h3>新增目录</h3>
        </div>
        <div class="el-drawer-content">
          <el-form
            :model="addCatalogueForm"
            :rules="rules"
            ref="addCatalogueForm"
          >
            <el-form-item label="资源名称" prop="name">
              <el-input v-model="addCatalogueForm.name" auto-complete="off"
                >11</el-input
              >
            </el-form-item>
            <el-form-item label="资源类型">
              <el-input
                v-model="addCatalogueForm.type"
                :disabled="true"
                placeholder="目录"
              ></el-input>
            </el-form-item>
            <el-form-item label="资源图标">
              <el-input
                v-model="addCatalogueForm.icon"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="el-drawer-footer">
          <el-button
            type="primary"
            @click="saveAddCatalogue('addCatalogueForm', addCatalogueForm)"
            >保存</el-button
          >
          <el-button @click="cancelAddCatalogueForm" plain>取消</el-button>
        </div>
      </el-drawer>
    </div>

    <div class="menuManagementBody">
      <template>
        <el-table ref="menusTable" :row-style="showRow" :data="menusTable">
          <el-table-column prop="name" label="资源名称">
            <template slot-scope="scope">
              <span :class="['type' + scope.row.type]">
                <i
                  v-if="scope.row.children"
                  @click="openToggle(scope.row)"
                  :class="[
                    scope.row.open
                      ? 'el-icon-caret-bottom'
                      : 'el-icon-caret-right'
                  ]"
                ></i>
                <span v-if="scope.row.type === 'M'"
                  ><i class="el-icon-folder"></i
                ></span>
                <span v-if="scope.row.type === 'T'"
                  ><i class="el-icon-document"></i
                ></span>
                {{ scope.row.name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="资源路径">
            <template slot-scope="scope">
              {{ scope.row.address }}
            </template>
          </el-table-column>
          <el-table-column
            prop="icon"
            label="资源图标"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.icon }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="资源类型">
            <template slot-scope="scope">
              <span v-if="scope.row.type === 'M'">目录</span>
              <span v-if="scope.row.type === 'T'">链接</span>
            </template>
          </el-table-column>
          <el-table-column prop="operation" label="操作">
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
                size="30%"
              >
                <div class="el-drawer-header">
                  <h3>编辑</h3>
                </div>
                <div class="el-drawer-content">
                  <el-form :model="form" :rules="rules" ref="form">
                    <el-form-item label="资源名称" prop="name">
                      <el-input
                        v-model="form.name"
                        auto-complete="off"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="资源类型">
                      <el-input v-model="form.type" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="资源图标">
                      <el-input
                        v-model="form.icon"
                        auto-complete="off"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="资源路径">
                      <el-input
                        v-model="form.address"
                        auto-complete="off"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="el-drawer-footer">
                  <el-button type="primary" @click="save('form', form)"
                    >保存</el-button
                  >
                  <el-button @click="cancelForm" plain>取消</el-button>
                </div>
              </el-drawer>
              <!--    <el-tooltip effect="dark" content="新增目录" placement="top-start"
                ><i
                  class="el-icon-document-add addCatalogueIcon"
                  @click="addCatalogue()"
                ></i
              ></el-tooltip> -->
              <!-- 只有在资源类型为目录时才能显示新增链接 -->
              <el-tooltip
                effect="dark"
                content="新增链接"
                placement="top-start"
              >
                <i
                  class="el-icon-link addLinkIcon"
                  v-if="scope.row.type === 'M'"
                  @click="addLink(scope.row.id)"
                ></i>
              </el-tooltip>
              <el-drawer
                title="新增链接"
                :visible.sync="addLinkDrawer"
                :with-header="false"
                :wrapperClosable="false"
                :close-on-press-escape="false"
                ref="addLinkDrawer"
                size="30%"
              >
                <div class="el-drawer-header">
                  <h3>新增链接</h3>
                </div>
                <div class="el-drawer-content">
                  <el-form
                    :model="addLinkForm"
                    :rules="rules"
                    ref="addLinkForm"
                  >
                    <el-form-item label="资源名称" prop="name">
                      <el-input
                        v-model="addLinkForm.name"
                        auto-complete="off"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="资源类型">
                      <el-input
                        v-model="addLinkForm.type"
                        :disabled="true"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="资源图标">
                      <el-input
                        v-model="addLinkForm.icon"
                        auto-complete="off"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="资源路径">
                      <el-input
                        v-model="addLinkForm.address"
                        auto-complete="off"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="el-drawer-footer">
                  <el-button
                    type="primary"
                    @click="saveAddLink('addLinkForm', addLinkForm)"
                    >保存</el-button
                  >
                  <el-button @click="cancelAddLinkForm" plain>取消</el-button>
                </div>
              </el-drawer>
              <el-tooltip
                effect="dark"
                content="停用"
                placement="top-start"
                v-if="scope.row.status == 1"
              >
                <i
                  class="el-icon-circle-close closeIcon"
                  @click="blockUp(scope.row.id)"
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
              {{ scope.row.operation }}
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>
<script>
import api from "../../request/api";
import Vue from "vue";
export default {
  name: "menuManagement",
  data() {
    return {
      //菜单树结构数据
      menusTable: [],
      editDrawer: false,
      addDrawer: false,
      addLinkDrawer: false,
      form: {
        name: "",
        type: "",
        address: "",
        icon: ""
      },
      addCatalogueForm: {
        name: "",
        type: "目录",
        icon: ""
      },
      addLinkForm: {
        name: "",
        type: "链接",
        icon: "",
        address: ""
      },
      rules: {
        name: [{ required: true, message: "请输入资源名称", trigger: "blur" }]
      },
      formLabelWidth: "80px",
      id: null,
      linkID: null
    };
  },
  inject: ["reload"],
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
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true;
      row.row._show = show;
      return show
        ? "animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;"
        : "display:none;";
    },
    //树节点开关操作
    openToggle(item) {
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
    },
    cancelForm() {
      this.editDrawer = false;
    },
    cancelAddCatalogueForm() {
      this.addDrawer = false;
    },
    //关闭Drawer时清空表单中的值
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    cancelAddLinkForm() {
      this.addLinkDrawer = false;
    },
    edit(id) {
      const params = { id };
      this.editDrawer = true;
      api.systemManageService.menuManageEdit(params).then(res => {
        if (res.code == "00") {
          const form = this.form,
            data = res.data;
          form.name = data.name;
          form.type = data.type;
          form.icon = data.icon;
          this.id = data.id;
          if (data.type === "M") {
            form.type = "目录";
          }
          if (data.type === "T") {
            form.type = "链接";
          }
          form.icon = data.icon;
        }
      });
    },
    save(formName, form) {
      let id = parseInt(this.id),
        name = form.name,
        icon = form.icon,
        address = form.address,
        type = null;
      if (form.type === "目录") {
        type = "M";
      }
      if (form.type === "链接") {
        type = "T";
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = { id, name, icon, type, address };
          api.systemManageService.menuManageEditSave(params).then(res => {
            if (res.code == "00") {
              this.reload();
              this.$notify.success({
                message: "保存成功",
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
    //新增目录
    addCatalogue() {
      this.addDrawer = true;
    },
    //保存新增的目录
    saveAddCatalogue(formName, addCatalogueForm) {
      let name = addCatalogueForm.name,
        icon = addCatalogueForm.icon,
        type = null;
      if (addCatalogueForm.type == "目录") {
        type = "M";
      }
      if (addCatalogueForm.type == "链接") {
        type = " T";
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = { name, icon, type, pId: "" };
          api.systemManageService
            .menuManageSaveAddCatalogue(params)
            .then(res => {
              if (res.code == "00") {
                this.reload();
                this.$notify.success({
                  message: "新增成功",
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
    //新增链接
    addLink(id) {
      this.addLinkDrawer = true;
      this.linkID = id;
    },
    //保存新增的链接
    saveAddLink(formName, addLinkForm) {
      const name = addLinkForm.name,
        icon = addLinkForm.icon,
        address = addLinkForm.address,
        pId = this.linkID;
      let type = null;
      if (addLinkForm.type == "目录") {
        type = "M";
      }
      if (addLinkForm.type == "链接") {
        type = "T";
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = { pId, name, icon, type, address };
          api.systemManageService.menuManageSaveAddLink(params).then(res => {
            if (res.code == "00") {
              this.reload();
              this.$notify.success({
                message: "新增成功",
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

    //停用
    blockUp(id) {
      new this.$messageTips(({ alert }) => {
        alert({ content: "确定要停用吗?", tip: "确定停用" });
      }).then(() => {
        const params = { id };
        api.systemManageService.menuManageBlockUp(params).then(res => {
          if (res.code == "00") {
            this.reload();
            this.$notify({
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
        alert({ content: "确定要启用吗", tip: "确定启用" });
      }).then(() => {
        const params = { id };
        api.systemManageService.menuManageLaunch(params).then(res => {
          if (res.code == "00") {
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
  created() {
    api.systemManageService.menuManageList().then(res => {
      if (res.code == "00") {
        this.menusTable = this.toTreeData(res.data);
      }
    });
  }
};
</script>
<style>
.menuManagementHeader {
  line-height: 50px;
  line-height: 50px;
  font-size: 14px;
}
.typeM {
  margin-left: 5px;
}

.typeT {
  margin-left: 20px;
}
.el-table {
  font-size: 12px;
  border: 1px solid #dcdee2;
  border-bottom: 1px solid transparent;
}
.el-table thead {
  font-size: 12px !important;
}
.el-table__header-wrapper {
  background: #f8f8f9;
}
.el-table__header-wrapper th {
  background: #f2f5f7;
}
.editIcon,
.addCatalogueIcon,
.addLinkIcon,
.closeIcon,
.checkIcon {
  font-size: 22px;
  color: #409eff;
  margin-right: 10px;
  cursor: pointer;
}
.el-table ::before {
  background: white;
}
.el-drawer-header {
  height: 50px;
  padding: 17px 20px;
  border-bottom: 1px solid #ebebeb;
}
.el-drawer-header h3 {
  color: #333;
  font-size: 16px;
  font-weight: 600;
}
.el-form {
  margin-top: 20px;
}
.el-drawer-content {
  padding: 20px;
}
.el-drawer-footer {
  width: 30%;
  position: fixed;
  bottom: 0;
  right: 0;
  text-align: right;
  padding: 10px 20px;
  border-top: 1px solid #ebebeb;
}
.operateBox {
  margin-bottom: 15px;
}
</style>
