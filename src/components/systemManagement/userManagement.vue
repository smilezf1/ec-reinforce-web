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
          size="30%"
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
                size="30%"
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
                        size="small"
                      ></el-input>
                    </el-form-item>
                    <el-form-item prop="userName">
                      <label slot="label">登&nbsp;录&nbsp;名:&nbsp;</label>
                      <el-input
                        v-model="editForm.userName"
                        :disabled="true"
                        size="small"
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
                        size="small"
                        v-model="editForm.mobile"
                        autocomplete="off"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="电子邮箱:" prop="email">
                      <el-input
                        v-model="editForm.email"
                        autocomplete="off"
                        size="small"
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
                size="30%"
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
                        size="small"
                        show-password
                        v-model="resetPasswordForm.pass"
                        auto-complete="off"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass">
                      <el-input
                        size="small"
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
      <pagination @pageChanged="onPageChanged"></pagination>
    </div>
  </div>
</template>
<script>
import api from "../../request/api";
import md5 from "js-md5";
import pagination from "../common/pagination";
import pageMixins from "../../utils/pageMixins";
export default {
  name: "userManagement",
  components: { pagination },
  mixins: [pageMixins],
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.resetPasswordForm.checkPass !== "") {
          this.$refs.resetPasswordForm.validateField("checkPass");
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.resetPasswordForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    let validatePass3 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.addUserForm.checkPass !== "") {
          this.$refs.addUserForm.validateField("checkPass");
        }
        callback();
      }
    };
    let validatePass4 = (rule, value, callback) => {
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
      setRoleList: [],
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
    async getData() {
      const params = {};
      params.queryInfo = this.ruleForm;
      this.getDataItem(this.addPageInfo(params));
    },
    //获取后台数据
    getDataItem(params) {
      api.systemManageService.userManageList(params).then(res => {
        if (res.code == "00") {
          const data = res.data,
            count = data.count,
            { pn: number, limit: size } = params;
          this.listItem = data.items;
          this.curPage = number;
          this.limit = size;
          this.onGotPageData({ totalElements: count, size, number });
        }
      });
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
      const _this = this;
      _this.getData();
      _this.loading = true;
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
      const params = { id };
      api.systemManageService.userManageDetail(params).then(res => {
        const data = res.data,
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
      let id = this.editId,
        { trueName, userName, email, mobile, status, sex } = form;
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
          const params = { id, trueName, userName, email, mobile, status, sex };
          api.systemManageService.userManageSave(params).then(res => {
            if (res.code == "00") {
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
      const id = this.resetPasswordId,
        { pass: password, checkPass } = form,
        params = { id, password: md5(password), checkPass: md5(checkPass) };
      this.$refs[formName].validate(valid => {
        if (valid) {
          api.systemManageService.userManageResetPwd(params).then(res => {
            if (res.code == "00") {
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
      /*   let trueName = form.trueName,
        userName = form.userName,
        password = md5(form.pass),
        mobile = form.mobile,
        email = form.email,
        sex = form.sex,
        status = form.status; */
      const { trueName, userName, password, mobile, email, sex, status } = form;
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            trueName,
            userName,
            password,
            mobile,
            email,
            sex,
            status
          };
          api.systemManageService
            .userManageCheckUserName({ userName })
            .then(res => {
              if (res) {
                api.systemManageService.userManageSaveAdd(params).then(res => {
                  if (res.code == "00") {
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
                this.$message.error("登录名已存在");
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
      this.dialogVisible = true;
      const params = { id };
      api.systemManageService.userManageSetRole(params).then(res => {
        let data = res.data;
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
      const id = this.setRoleId,
        nodes = this.checkedNodes;
      let roleList = this.roleList;
      if (nodes && nodes.length != 0) {
        for (var i = 0; i < nodes.length; i++) {
          if (!nodes[i].parent) {
            roleList.push(nodes[i].id);
            roleList = Array.from(new Set(roleList));
          }
        }
      }
      new this.$messageTips(({ confirm }) => {
        confirm({ content: "确定要更新用户角色吗?" });
      }).then(res => {
        const params = { roleList, userId: id };
        api.systemManageService.userManageSaveUserRole(params).then(res => {
          if (res.code == "00") {
            this.$notify({
              message: "更新成功",
              type: "success",
              duration: 1000
            });
            this.reload();
            this.dialogVisible = false;
          }
        });
      });
    },
    //设置角色结束
    //启用
    launch(id) {
      new this.$messageTips(({ alert }) => {
        alert({ content: "确定要启用吗?", tips: "确定启用" });
      }).then(() => {
        const params = { id };
        api.systemManageService.userManageActive(params).then(res => {
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
    },
    //停用
    blockUp(id) {
      new this.$messageTips(({ alert }) => {
        alert({ content: "确定要停用吗?", tips: "确定停用" });
      }).then(() => {
        const params = { id };
        api.systemManageService.userManageInvalid(params).then(res => {
          if (res.code === "00") {
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
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style>
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
.userManagement .el-input {
  width: auto;
}
.userManagement .searchBox {
  margin-bottom: 15px;
  display: inline-block;
}
.userManagement .operateBox {
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
  width: 30%;
  position: fixed;
  bottom: 0;
  right: 0;
  text-align: right;
  padding: 10px 20px;
  border-top: 1px solid #ebebeb;
}
.userManagementBase {
  margin-top: 20px;
}
</style>
