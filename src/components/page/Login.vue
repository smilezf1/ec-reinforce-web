<template>
  <div class="Login">
    <div class="login-header">
      <img src="../../assets/logo1.png" />
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
          <el-form-item prop="userName">
            <img src="../../assets/user.png" class="icon" />
            <el-input
              v-model="ruleForm.userName"
              placeholder="用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <img src="../../assets/pwd.png" class="icon" />
            <el-input
              v-model="ruleForm.password"
              type="password"
              placeholder="密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="vercode">
            <img src="../../assets/code.png" class="icon" />
            <el-row>
              <el-col :span="15">
                <el-input v-model="ruleForm.VerCode" placeholder="图形验证码">
                </el-input
              ></el-col>
              <el-col :span="7">
                <img
                  :src="
                    this.api.baseUrl + '/captcha/getCaptchaCode?guid=' + Guid
                  "
                  @click="getVerifyCode()"
                  class="verifyCode"
                  ref="captcha"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button class="submit" @click="submitForm('ruleForm')"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="user-login-footer">
      <p>Version: 5.1 Copyright © 2020 蛮犀安全. All Rights Reserved</p>
    </div>
  </div>
</template>
<script>
import https from "../../http.js";
import md5 from "js-md5";
export default {
  name: "login",
  data() {
    return {
      ruleForm: {
        userName: "",
        password: "",
        VerCode: ""
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ],
        passWord: [{ required: true, message: "请输入密码", trigger: "blur" }],
        verCode: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      },
      verifyCode: "",
      Guid: this.guid.getGuid()
    };
  },
  methods: {
    submitForm(formName) {
      let data = this.ruleForm,
        guid = this.guid.getGuid(),
        userName = data.userName,
        password = md5(data.password),
        VerCode = data.VerCode,
        baseUrl = this.api.baseUrl;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            userName: userName,
            password: password,
            VerCode: VerCode,
            guid: guid
          };
          https.fetchPost(baseUrl + "/system/login/login", params).then(res => {
            console.log(res);
          });
         /*  this.$axios
            .post(baseUrl + "/system/login/login", params)
            .then(res => {
              console.log(res);
            }); */
        } else {
          this.$message({
            message: "必填项不能为空",
            type: "error"
          });
          return false;
        }
      });
    },
    getVerifyCode(event) {
      console.log("执行了嘛");
      this.$refs.captcha.src =
        this.api.baseUrl +
        "/captcha/getCaptchaCode?guid=" +
        this.guid.getGuid();
    }
  },
  mounted() {
    console.log(this.guid.getGuid(), "哈哈");
  }
};
</script>
<style>
html,
body,
#app {
  height: 100%;
}
.Login {
  height: 100%;
  background: #1a2980;
  background: -webkit-linear-gradient(to right, #26d0ce, #1a2980);
  background: linear-gradient(to right, #26d0ce, #1a2980);
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
.user-login-main-box .ruleForm .icon {
  width: 18px;
  position: absolute;
  z-index: 2;
  top: 50%;
  transform: translateY(-50%);
  left: 20px;
}
.user-login-main-box .ruleForm .verifyCode {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
.el-input__inner {
  padding: 0 47px;
  height: 50px;
  border-radius: 30px;
  box-shadow: 0 0 8px #eee;
}
.user-login-main-box .submit {
  width: 100%;
  background: #207ba6;
  color: white;
  border: none;
  font-size: 22px;
  border-radius: 30px;
}
.user-login-footer p {
  position: fixed;
  bottom: 25px;
  left: 50%;
  color: white;
  font-size: 15px;
  transform: translateX(-50%);
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", 微软雅黑, Tahoma,
    Arial, sans-serif;
}
</style>
