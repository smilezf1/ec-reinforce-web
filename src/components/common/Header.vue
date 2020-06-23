<template>
  <div class="Header">
    <div class="headerLeftBox">
      <img src="../../assets/logo1.png" />
      <span class="title">蛮犀安全移动应用加固系统</span>
    </div>
    <div class="headerRightBox">
      <el-dropdown class="userName" trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">您好,smile</span>
        <i class="el-icon-caret-bottom"></i>
        <el-dropdown-menu>
          <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
export default {
  name: "Header",
  computed: {
    /* userName(){
      let userName=localStorage.getItem("userName");
      return userName?userName:
    } */
  },
  methods: {
    //用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "loginout") {
        /*  localStorage.removeItem("userName"); */
        this.$confirm("确定要退出吗?", "退出提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$router.push("/login");
            this.$message({
              type: "success",
              message: "退出成功"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消退出"
            });
          });
      }
    }
  }
};
</script>
<style scoped>
.Header {
  height: 60px;
  line-height: 60px;
  background: linear-gradient(to bottom, #6dd5ed, #2193b0);
  color: white;
  padding: 0px 30px 0px 10px;
}
.headerLeftBox {
  display: flex;
  align-items: center;
  float: left;
}
.headerLeftBox .title {
  font-size: 15px;
}
.headerRightBox {
  float: right;
}
.headerRightBox .userName {
  color: white;
}
.headerRightBox .el-dropdown-link {
  font-size: 16px;
  cursor: pointer;
}
.el-dropdown-menu {
  top: 45px;
  padding: 5px 0;
}
</style>
