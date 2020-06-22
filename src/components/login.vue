<template>
  <div class="login">
    <div class="login-header">
      <img src="../assets/logo1.png" />
      <span class="title">蛮犀安全移动应用加固系统</span>
    </div>
    <div class="user-login-main">
      <div class="user-login-main-box">
        <h3 class="title">欢迎登录</h3>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="ruleForm"
        >
          <el-form-item>
            <img src="../assets/user.png" />
            <el-input
              v-model="ruleForm.userName"
              placeholder="用户名"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <img src="../assets/pwd.png" />
            <el-input
              v-model="ruleForm.password"
              type="password"
              placeholder="密码"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <img src="../assets/code.png" />
            <el-input
              v-model="ruleForm.vercode"
              placeholder="图形验证码"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="submit">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
      ruleForm: {
        uerName: "",
        passWord: "",
        vercode: ""
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ],
        passWord: [{ required: true, message: "请输入密码", trigger: "blur" }],
        vercode: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      }
    };
  },
  mounted() {}
};
</script>
<style>
html,
body,
#app {
  height: 100%;
}
.login {
  height: 100%;
  background: #2193b0;
  background: -webkit-linear-gradient(to bottom, #6dd5fa, #2193b0);
  background: linear-gradient(to bottom, #6dd5ed, #2193b0);
  position: relative;
}
.login-header {
  color: white;
  display: flex;
  align-items: center;
  padding-top: 5px;
}
.login-header .title {
  font-size: 22px;
}
.user-login-main-box {
  width: 400px;
  height: 400px;
  background: rgb(255, 255, 255, 0.1);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px 40px;
  box-sizing: border-box;
}
.user-login-main-box .title {
  color: white;
  font-size: 24px;
  text-align: center;
  font-weight: normal;
}
.user-login-main-box .ruleForm {
  margin-top: 20px;
}
.user-login-main-box .ruleForm .el-form-item_content {
  position: relative;
}
.user-login-main-box .ruleForm img {
  width: 18px;
  position: absolute;
  z-index: 2;
  top: 50%;
  transform: translateY(-50%);
  left: 20px;
}
.el-input__inner {
  padding: 0 47px;
  height: 50px;
  border-radius: 30px;
  box-shadow: 0 0 8px #eee;
}
.user-login-main-box .submit {
  width: 100%;
  background: linear-gradient(to bottom, #6dd5ed, #2193b0);
  color: white;
  border: none;
  font-size:22px;
  border-radius:30px;
}
</style>
