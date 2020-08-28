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
          <el-form-item prop="verCode">
            <img src="../../assets/code.png" class="icon" />
            <el-row>
              <el-col :span="15">
                <el-input v-model="ruleForm.verCode" placeholder="图形验证码">
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
      <p>Version: 5.0.0 Copyright © 2020 蛮犀科技. All Rights Reserved</p>
    </div>
  </div>
</template>
<script>
import api from "../../request/api";
import md5 from "js-md5";
import { mapMutations } from "vuex";
export default {
  name: "login",
  data() {
    return {
      ruleForm: {
        userName: "",
        password: "",
        verCode: ""
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        verCode: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      },
      verifyCode: "",
      Guid: this.guid.getGuid()
    };
  },
  methods: {
    ...mapMutations(["changeLogin"]),
    submitForm(formName) {
      let data = this.ruleForm,
        guid = this.Guid,
        userName = data.userName,
        password = md5(data.password),
        verCode = data.verCode,
        _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            userName: userName,
            password: password,
            verCode: verCode,
            guid: guid
          };
          api.loginService
            .login(params)
            .then(res => {
              if (res.code === "00") {
                const accessToken = res.data.accessToken,
                  userName = res.data.userName;
                localStorage.setItem("Authorization", accessToken);
                localStorage.setItem("userName", userName);
                _this.$message({
                  message: "登录成功",
                  type: "success",
                  duration: 1000,
                  onClose() {
                    _this.$router.push("/dashboard");
                  }
                });
              } else {
                _this.Guid = this.guid.getGuid();
              }
            })
            .catch(error => {});
        } else {
          this.$message({
            message: "必填项不能为空",
            type: "error"
          });
          _this.Guid = this.guid.getGuid();
          return false;
        }
      });
    },
    getVerifyCode(event) {
      this.$refs.captcha.src =
        this.api.baseUrl +
        "/captcha/getCaptchaCode?guid=" +
        this.guid.getGuid();
    }
  },
  created() {
    let _this = this;
    document.onkeydown = function(e) {
      e = window.event || e;
      if (e.code == "NumpadEnter" || e.code == "Enter" || e.code == "enter") {
        _this.submitForm("ruleForm");
      } else {
      }
    };
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
.Login .el-input__inner {
  padding: 0 47px;
  height: 50px;
  border-radius: 30px;
  box-shadow: 0 0 8px #eee;
}
.user-login-main-box .submit {
  width: 100%;
  background: #207ba6 !important;
  color: white !important;
  border: none;
  font-size: 22px;
  border-radius: 30px;
}
.user-login-main-box .el-button:hover {
  background: #207ba6 !important;
  color: #fff !important;
  border: none;
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
