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
              :key="item.value"
              :label="item.lable"
              :value="item.value"
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
        <el-tooltip effect="dark" content="新增" placement="top-start">
          <el-button
            type="primary"
            icon="el-icon-zoom-in"
            size="small"
            @click="add()"
          ></el-button>
        </el-tooltip>
        <el-drawer title=""></el-drawer>

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
        <el-table ref="listItem" :data="listItem">
          <el-table-column
            type="index"
            label="序号"
            width="60"
          ></el-table-column>
          <el-table-column prop="name" label="角色名称">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column prop="status" label="是否有效">
            <template slot-scope="scope">
              <span v-if="scope.row.status === '1'">是</span>
              <span v-if="scope.row.status === '0'">否</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间">
            <template slot-scope="scope">{{ scope.row.createTime }}</template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间">
            <template slot-scope="scope">{{ scope.row.updateTime }}</template>
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
              >
                <div class="el-drawer-header">
                  <h3>编辑</h3>
                </div>
                <div class="el-drawer-content">
                  <el-form :model="editForm" ref="editForm">
                    <el-form-item label="角色名称">
                      <el-input v-model="editForm.name"></el-input>
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
              >
                <i
                  class=" el-icon-setting settingIcon"
                  @click="setting(scope.row.id)"
                ></i>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="停用"
                placement="top-start"
                v-if="scope.row.status === '1'"
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
                v-if="scope.row.status === '0'"
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
          :current-page="currentPage4"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="dataCount"
          class="pagingBox"
          background
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
        { value: "是", label: "是" },
        { value: "否", label: "否" }
      ],
      listItem: [],
      dataCount: 0,
      curPage: 1,
      limit: 10,
      editDrawer: false,
      editForm: {
        name: ""
      },
      editId: null
    };
  },
  inject: ["reload"],
  methods: {
    //获取后台数据
    getData() {
      let baseUrl = this.api.baseUrl,
        _this = this;
      https
        .fetchPost(baseUrl + "/api/system/role/page", {
          pn: this.curPage,
          limit: this.limit
        })
        .then(res => {
          _this.listItem = res.data.data.items;
          _this.dataCount = res.data.data.count;
          console.log(_this.listItem);
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
      this.curPage = val;
      this.getData();
    },
    search(ruleForm) {
      let baseUrl = this.api.baseUrl,
        name = ruleForm.name,
        status = null;
      if (ruleForm.status == "是") {
        status = "1";
      } else if (ruleForm.status == "否") {
        status = "0";
      }
      https
        .fetchPost(baseUrl + "/api/system/role/page", {
          limit: 10,
          pn: 1,
          queryInfo: { name, status }
        })
        .then(res => {
          this.listItem = res.data.data.items;
          console.log(res.data.data.items);
        });
    },
    add() {},
    edit(id) {
      this.editDrawer = true;
      this.editId = id;
      let baseUrl = this.api.baseUrl;
      https.fetchGet(baseUrl + "/api/system/role/detail", { id }).then(res => {
        this.editForm.name = res.data.data.name;
      });
    },
    refresh() {
      this.reload();
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
        });
    },
    cancelForm() {
      this.editDrawer = false;
    },
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
        type: "success"
      })
        .then(() => {
          https
            .fetchGet(baseUrl + "/api/system/role/invalid", { id })
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
  margin-right: 5px;
}
.searchForm {
  display: flex;
}
.searchBox {
  margin-bottom: 10px;
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
  color: #207ba6;
  margin-right: 5px;
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
.el-button--primary {
  background: #207ba6;
  border-color: #207ba6;
}
.roleManagementBase {
  margin-top: 20px;
}
</style>
