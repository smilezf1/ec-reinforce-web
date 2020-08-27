<template>
  <div class="userManagement">
    <div class="userManagementHeader">
      <p>当前位置: 用户管理</p>
    </div>
    <div class="searchForm">
      <div class="searchBox">
        <el-form :model="ruleForm" ref="ruleForm">
          <el-input
            placeholder="请输入用户姓名"
            size="small"
            v-model="ruleForm.trueName"
          ></el-input>
          <el-input
            placeholder="请输入登录名"
            size="small"
            v-model="ruleForm.userName"
          ></el-input>
          <el-input
            placeholder="请输入手机号"
            size="small"
            v-model="ruleForm.mobile"
          ></el-input>
          <el-input
            placeholder="请输入邮箱"
            size="small"
            v-model="ruleForm.email"
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
        <el-tooltip effect="dark" content="新增" placement="top-start">
          <el-button
            type="primary"
            icon="el-icon-zoom-in"
            size="small"
            @click="addUser()"
            style="margin-right:10px"
          ></el-button>
        </el-tooltip>
        <el-drawer
          title="新增用户"
          :visible.sync="addUserDrawer"
          :with-header="false"
          :wrapperClosable="false"
          :close-on-press-escape="false"
          ref="addUserDrawer"
          @close="resetForm('addUserForm')"
        >
          <div class="el-drawer-header">
            <h3>新增用户</h3>
          </div>
          <div class="el-drawer-content">
            <el-form
              :model="addUserForm"
              ref="addUserForm"
              :rules="editRules"
              :label-position="labelPosition"
            >
              <el-form-item prop="trueName">
                <label slot="label"> 用&nbsp;户&nbsp;名</label>
                <el-input
                  size="small"
                  v-model="addUserForm.trueName"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item prop="userName">
                <label slot="label">登&nbsp;录&nbsp;名</label>
                <el-input
                  size="small"
                  v-model="addUserForm.userName"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item prop="pass">
                <label slot="label">用户密码</label>
                <el-input
                  size="small"
                  show-password
                  v-model="addUserForm.pass"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
              <el-form-item prop="checkPass">
                <label slot="label">确认密码</label>
                <el-input
                  size="small"
                  show-password
                  v-model="addUserForm.checkPass"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
              <el-form-item prop="sex">
                <label slot="label"
                  >性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</label
                >
                <el-select
                  v-model="addUserForm.sex"
                  size="small"
                  style="width:80%"
                  placeholder="请选择性别"
                >
                  <el-option
                    v-for="item in genderoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="mobile">
                <label slot="label">手&nbsp;机&nbsp;号</label>
                <el-input
                  size="small"
                  v-model="addUserForm.mobile"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="电子邮箱" prop="email">
                <el-input
                  size="small"
                  v-model="addUserForm.email"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="是否有效" prop="status">
                <el-select
                  v-model="addUserForm.status"
                  placeholder="请选择"
                  size="small"
                  style="width:80%"
                >
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="el-drawer-footer">
            <el-button
              type="primary"
              @click="saveaddUserForm('addUserForm', addUserForm)"
              >保存</el-button
            >
            <el-button @click="canceladdUserForm()" plain>取消</el-button>
          </div>
        </el-drawer>
        <el-tooltip effect="dark" content="刷新" placement="top-start">
          <el-button
            type="primary"
            icon="el-icon-refresh-right"
            size="small"
            @click="refresh()"
          ></el-button>
        </el-tooltip>
      </div>
    </div>
    <div class="userManagementBody">
      <template>
        <el-table
          :data="listItem"
          ref="listItem"
          v-loading="loading"
          element-loading-text="加载中"
        >
          <el-table-column type="index" label="序号" width="100">
            <template slot-scope="scope">
              <span>{{ (curPage - 1) * limit + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="trueName" label="用户名" width="200">
          </el-table-column>
          <el-table-column
            prop="userName"
            label="登录名"
            width="200"
          ></el-table-column>
          <el-table-column prop="sex" label="性别" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.sex == '1'">男</span>
              <span v-else>女</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="手机号"
            width="200"
          ></el-table-column>
          <el-table-column
            prop="email"
            label="电子邮箱"
            width="200"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="status"
            label="是否有效"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status == '1'">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            :show-overflow-tooltip="true"
            width="200"
          ></el-table-column>
          <el-table-column prop="operate" label="操作" width="290">
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
                  <el-form
                    :model="editForm"
                    ref="editForm"
                    :rules="editRules"
                    :label-position="labelPosition"
                  >
                    <el-form-item prop="trueName">
                      <label slot="label">用&nbsp;户&nbsp;名:&nbsp;</label>
                      <el-input
                        v-model="editForm.trueName"
                        autocomplete="off"
                      ></el-input>
                    </el-form-item>
                    <el-form-item prop="userName">
                      <label slot="label">登&nbsp;录&nbsp;名:&nbsp;</label>
                      <el-input
                        v-model="editForm.userName"
                        :disabled="true"
                      ></el-input>
                    </el-form-item>
                    <el-form-item prop="sex">
                      <label slot="label"
                        >性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别:</label
                      >
                      <el-select v-model="editForm.sex">
                        <el-option
                          v-for="item in genderoptions"
                          :key="item.id"
                          :value="item.id"
                          :label="item.label"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item prop="mobile">
                      <label slot="label">手&nbsp;机&nbsp;号:&nbsp;</label>
                      <el-input
                        v-model="editForm.mobile"
                        autocomplete="off"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="电子邮箱:" prop="email">
                      <el-input
                        v-model="editForm.email"
                        autocomplete="off"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="是否有效:" prop="status">
                      <el-select
                        v-model="editForm.status"
                        :disabled="editForm.userName == getLocalStorageUserName"
                      >
                        <el-option
                          v-for="item in statusOptions"
                          :key="item.id"
                          :value="item.id"
                          :label="item.label"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="el-drawer-footer">
                  <el-button
                    type="primary"
                    @click="editFormSave('editForm', editForm)"
                  >
                    保存</el-button
                  >
                  <el-button plain @click="editFormCancel">取消</el-button>
                </div>
              </el-drawer>
              <el-tooltip
                effect="dark"
                content="重置密码"
                placement="top-start"
              >
                <i
                  class="el-icon-unlock resetIcon"
                  @click="resetPassword(scope.row.id)"
                ></i>
              </el-tooltip>
              <el-drawer
                title="重置密码"
                :visible.sync="resetPasswordDrawer"
                :with-header="false"
                :wrapperClosable="false"
                :close-on-press-escape="false"
                ref="resetPasswordDrawer"
              >
                <div class="el-drawer-header">
                  <h3>重置密码</h3>
                </div>
                <div class="el-drawer-content">
                  <el-form
                    :model="resetPasswordForm"
                    ref="resetPasswordForm"
                    :rules="resetPasswordRules"
                  >
                    <el-form-item label="用户密码" prop="pass">
                      <el-input
                        show-password
                        v-model="resetPasswordForm.pass"
                        auto-complete="off"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass">
                      <el-input
                        show-password
                        v-model="resetPasswordForm.checkPass"
                        auto-complete="off"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="el-drawer-footer">
                  <el-button
                    type="primary"
                    @click="
                      saveresetPassword('resetPasswordForm', resetPasswordForm)
                    "
                    >保存</el-button
                  >
                  <el-button @click="cancelresetPassword()" plain
                    >取消</el-button
                  >
                </div>
              </el-drawer>
              <el-tooltip
                effect="dark"
                content="设置角色"
                placement="top-start"
                v-if="scope.row.status == 1"
              >
                <i
                  class="el-icon-setting settingIcon"
                  @click="setRole(scope.row.id)"
                ></i>
              </el-tooltip>
              <el-dialog
                title="角色列表"
                :visible.sync="dialogVisible"
                width="20%"
              >
                <el-tree
                  :data="roleTreeData"
                  node-key="id"
                  show-checkbox
                  :default-checked-keys="setRoleList"
                  @check="handleCheck"
                ></el-tree>
                <div class="el-dialog-footer" style="text-align:center">
                  <el-button type="primary" @click="setRoleSave"
                    >确定</el-button
                  >
                </div>
              </el-dialog>
              <el-tooltip
                effect="dark"
                content="停用"
                placement="top-start"
                v-if="
                  !(scope.row.userName == getLocalStorageUserName) &&
                    scope.row.status == 1
                "
              >
                <i
                  class="el-icon-close closeIcon"
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
                  class="el-icon-check closeIcon"
                  @click="launch(scope.row.id)"
                ></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <div class="userManagementBase">
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
    </div>
  </div>
</template>
<script>
import https from "../../http.js";
import md5 from "js-md5";
export default {
  name: "userManagement",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.resetPasswordForm.checkPass !== "") {
          this.$refs.resetPasswordForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.resetPasswordForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validatePass3 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.addUserForm.checkPass !== "") {
          this.$refs.addUserForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass4 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.addUserForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        trueName: "",
        userName: "",
        mobile: "",
        email: "",
        status: ""
      },
      curPage: 1, //当前页
      limit: 10, //每页显示的条目个数
      dataCount: 0, //总数目
      listItem: [],
      editDrawer: false,
      editId: null,
      resetPasswordId: null,
      resetPasswordDrawer: false,
      addUserDrawer: false,
      dialogVisible: false,
      roleTreeData: [],
      checkedNodes: [], //角色列表选中的数据
      roleList: [],
      setRoleList: [], //测试
      options: [
        { label: "是", id: "1" },
        { label: "否", id: "0" }
      ],
      genderoptions: [
        { label: "男", id: "1" },
        { label: "女", id: "0" }
      ],
      statusOptions: [
        { label: "是", id: "1" },
        { label: "否", id: "0" }
      ],
      resetPasswordForm: {
        pass: "",
        checkPass: ""
      },
      editForm: {
        trueName: "",
        userName: "",
        sex: "",
        mobile: "",
        email: "",
        status: ""
      },
      addUserForm: {
        trueName: "",
        userName: "",
        pass: "",
        checkPass: "",
        sex: "",
        mobile: "",
        email: "",
        status: ""
      },
      loading: false,
      labelPosition: "left",
      editRules: {
        trueName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        userName: [
          { required: true, message: "请输入登录名", trigger: "blur" }
        ],
        pass: [{ required: true, validator: validatePass3, trigger: "blur" }],
        checkPass: [
          { required: true, validator: validatePass4, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^[1][3|4|5|6|7|8|9][0-9]{9}$/,
            message: "请输入正确的手机号"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        sex: [{ required: true, message: "请输入性别", trigger: "change" }],
        status: [
          { required: true, message: "请输入是否有效", trigger: "change" }
        ]
      },
      resetPasswordRules: {
        pass: [{ required: true, validator: validatePass, trigger: "blur" }],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    changeRoleList: function() {
      return this.roleList.map(Number);
    },
    getLocalStorageUserName: function() {
      return localStorage.getItem("userName");
    }
  },
  inject: ["reload"],
  methods: {
    //获取后台数据
    getData(queryInfo) {
      let baseUrl = this.api.baseUrl;
      https
        .fetchPost(baseUrl + "/api/system/user/page", {
          pn: this.curPage,
          limit: this.limit,
          queryInfo
        })
        .then(res => {
          this.listItem = res.data.data.items;
          this.dataCount = res.data.data.count;
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
      let trueName = this.ruleForm.trueName,
        userName = this.ruleForm.userName,
        mobile = this.ruleForm.mobile,
        email = this.ruleForm.email,
        status = this.ruleForm.status;
      let queryInfo = { trueName, userName, mobile, email, status };
      this.getData(queryInfo);
    },
    //关闭Drawer时清空表单中的值
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //设置角色开始
    handleCheck(checkedNodes, checkedKeys) {
      this.checkedNodes = checkedKeys.checkedNodes;
    },
    //设置角色结束
    search(ruleForm) {
      let trueName = ruleForm.trueName,
        userName = ruleForm.userName,
        mobile = ruleForm.mobile,
        email = ruleForm.email,
        status = ruleForm.status,
        _this = this;
      let queryInfo = { trueName, userName, mobile, email, status, queryInfo };
      _this.loading = true;
      this.getData(queryInfo);
      setTimeout(function() {
        _this.loading = false;
      }, 500);
    },
    addUser() {
      this.addUserDrawer = true;
    },
    refresh() {
      this.reload();
    },
    canceladdUserForm() {
      this.addUserDrawer = false;
    },
    edit(id) {
      this.editDrawer = true;
      this.editId = id;
      let baseUrl = this.api.baseUrl;
      https.fetchGet(baseUrl + "/api/system/user/detail", { id }).then(res => {
        let data = res.data.data,
          editForm = this.editForm;
        editForm.trueName = data.trueName;
        editForm.userName = data.userName;
        editForm.sex = data.sex;
        if (data.sex === "1") {
          editForm.sex = "男";
        } else if (data.sex === "0") {
          editForm.sex = "女";
        }
        editForm.mobile = data.mobile;
        editForm.email = data.email;
        if (data.status === "1") {
          editForm.status = "是";
        } else if (data.status === "0") {
          editForm.status = "否";
        }
      });
    },
    editFormCancel() {
      this.editDrawer = false;
    },
    editFormSave(formName, form) {
      let baseUrl = this.api.baseUrl,
        id = this.editId,
        trueName = form.trueName,
        userName = form.userName,
        email = form.email,
        mobile = form.mobile,
        status = form.status,
        sex = form.sex;
      if (form.sex === "男") {
        sex = "1";
      } else if (form.sex === "女") {
        sex = "0";
      }
      if (form.status === "是") {
        status = "1";
      } else if (form.status === "否") {
        status = "0";
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          https
            .fetchPost(baseUrl + "/api/system/user/save", {
              id,
              trueName,
              userName,
              email,
              mobile,
              status,
              sex
            })
            .then(res => {
              if (res.data.code == "00") {
                this.editDrawer = false;
                this.reload();
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
    //重置密码
    resetPassword(id) {
      this.resetPasswordId = id;
      this.resetPasswordDrawer = true;
    },
    cancelresetPassword() {
      this.resetPasswordDrawer = false;
    },
    saveresetPassword(formName, form) {
      let baseUrl = this.api.baseUrl,
        id = this.resetPasswordId,
        password = md5(form.pass),
        checkPass = md5(form.checkPass);
      this.$refs[formName].validate(valid => {
        if (valid) {
          https
            .fetchPost(baseUrl + "/api/system/user/resetPwd", {
              id,
              password,
              checkPass
            })
            .then(res => {
              if (res.data.code == "00") {
                this.$notify.success({
                  message: "重置密码成功",
                  showClose: false,
                  duration: 1000
                });
              }
            });

          this.resetPasswordDrawer = false;
        } else {
          return false;
        }
      });
    },
    //保存新增的用户
    // status 1:有效 0:无效  sex 1:男 0:女
    saveaddUserForm(formName, form) {
      let baseUrl = this.api.baseUrl,
        trueName = form.trueName,
        userName = form.userName,
        password = md5(form.pass),
        mobile = form.mobile,
        email = form.email,
        sex = form.sex,
        status = form.status;
      this.$refs[formName].validate(valid => {
        if (valid) {
          https
            .fetchPost(baseUrl + "/api/system/user/save", {
              trueName,
              userName,
              password,
              mobile,
              email,
              sex,
              status
            })
            .then(res => {
              if (res.data.code === "00") {
                this.addUserDrawer = false;
                this.reload();
                this.$notify.success({
                  message: "新增用户成功",
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
    //设置角色开始
    setRole(id) {
      this.setRoleId = id;
      let baseUrl = this.api.baseUrl;
      this.dialogVisible = true;
      https
        .fetchGet(baseUrl + "/api/system/role/roleTree", { id })
        .then(res => {
          let data = res.data.data;
          data = JSON.parse(JSON.stringify(data).replace(/name/g, "label"));
          this.roleTreeData = data;
          this.roleTreeData.forEach((v, i) => {
            if (v.checked == true) {
              this.setRoleList.push(v.id);
              this.setRoleList = Array.from(new Set(this.setRoleList));
            }
          });
        });
    },
    setRoleSave() {
      let baseUrl = this.api.baseUrl,
        id = this.setRoleId,
        nodes = this.checkedNodes,
        roleList = this.roleList;
      if (nodes && nodes.length != 0) {
        for (var i = 0; i < nodes.length; i++) {
          if (!nodes[i].parent) {
            roleList.push(nodes[i].id);
            roleList = Array.from(new Set(roleList));
          }
        }
      }
      this.$confirm("确定要更新用户角色吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          https
            .fetchPost(baseUrl + "/api/system/user/saveUserRole", {
              roleList,
              userId: id
            })
            .then(res => {
              if (res.data.code == "00") {
                this.$notify({
                  message: "更新成功",
                  type: "success",
                  duration: 1000
                });
                this.reload();
                this.dialogVisible = false;
              }
            });
        })
        .catch(() => {});
    },
    //设置角色结束
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
            .fetchGet(baseUrl + "/api/system/user/active", { id })
            .then(res => {
              if (res.data.code === "00") {
                this.reload();
                this.$notify.success({
                  message: "启用成功",
                  showClose: false,
                  duration: 1000
                });
              }
            });
        })
        .catch(() => {});
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
            .fetchGet(baseUrl + "/api/system/user/invalid", { id })
            .then(res => {
              if (res.data.code === "00") {
                this.reload();
                this.$notify({
                  message: "停用成功",
                  type: "warning",
                  showClose: false,
                  duration: 1000
                });
              }
            });
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style scoped>
.userManagementHeader {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}
.userManagementBody {
  width: 99%;
}
.searchBox .el-input {
  margin: 0px 5px 5px 0px;
}
.el-input {
  width: auto;
}
.searchBox {
  margin-bottom: 15px;
  display: inline-block;
}
.operateBox {
  margin-left: 20px;
  display: inline-block;
  box-sizing: border-box;
  margin-bottom: 15px;
}
.editIcon,
.resetIcon,
.settingIcon,
.closeIcon {
  font-size: 22px;
  color: #409eff;
  margin-right: 10px;
  cursor: pointer;
}
/* Drawer抽屉 */
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
.el-drawer-content {
  padding: 20px;
}
.el-drawer-content .el-input {
  width: 80%;
}
.el-drawer-footer {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
th {
  font-weight: normal;
}
.el-table {
  font-size: 12px;
  border: 1px solid #dcdee2;
  border-bottom: 1px solid transparent;
}
.el-table thead {
  color: #515a6e;
  font-size: 12px;
}
.el-table__header-wrapper th {
  background: #f2f5f7 !important;
}
.el-table ::before {
  background: white;
}

.userManagementBase {
  margin-top: 20px;
}
</style>
