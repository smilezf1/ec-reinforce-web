<template>
  <div class="authorizeManagement">
    <div class="authorizeManagementHeader">
      <p>当前位置:授权管理</p>
    </div>
    <div class="authorizeBody">
      <template v-if="listItem">
        <el-button type="primary" @click="getUserCode" size="small"
          >生成注册码</el-button
        >
        <el-button type="primary" size="small" @click="uploadAuthorize()"
          >上传授权文件</el-button
        >
        <p class="userCode"><span class="title">注册码:</span>{{ userCode }}</p>
        <p class="isAuthorize">
          <span class="title">是否授权:</span>
          <span v-if="listItem.isAuth == 0">否</span>
          <span v-if="listItem.isAuth == 1">是</span>
        </p>
        <div
          class="authorizeTime"
          v-if="listItem.validStartDate && listItem.validEndDate"
        >
          <p>
            <span class="title">授权开始时间:</span
            >{{ listItem.validStartDate }}
          </p>
          <p>
            <span class="title">授权结束时间:</span>{{ listItem.validEndDate }}
          </p>
        </div>
        <!-- 上传授权文件 -->
        <el-drawer
          title="上传授权文件"
          :visible.sync="uploadAuthorizeFileDrawer"
          :with-header="false"
          :wrapperClosable="false"
          :close-on-press-escape="false"
          :destroy-on-close="true"
          ref="uploadAuthorizeFileDrawer"
          size="40%"
        >
          <!-- 上传授权文件Drawer头部 -->
          <div class="el-drawer-header">
            <h3>上传授权文件</h3>
          </div>
          <!-- 上传授权文件Drawer主体 -->
          <div class="el-drawer-content">
            <el-upload
              class="upload"
              drag
              action="/"
              :limit="1"
              :http-request="uploadAuthorizeFile"
              ref="upload"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处,或<em>点击上传</em>
              </div>
            </el-upload>
          </div>
          <div class="el-drawer-footer">
            <el-button plain @click="cancelUploadAuthorizeFile()"
              >取消</el-button
            >
          </div>
        </el-drawer>
      </template>
    </div>
  </div>
</template>
<script>
import api from "../../request/api";
export default {
  name: "authorizationManagement",
  inject: ["reload"],
  data() {
    return {
      name: "authorizeManagement",
      listItem: null,
      userCode: null,
      uploadAuthorizeFileDrawer: false
    };
  },
  beforeMount() {
    api.authorizeService.authorizeManageList().then(res => {
      if (res.code == "00") {
        this.listItem = res.data;
        this.userCode = res.data.userCode;
      }
    });
  },
  methods: {
    //获取userCode
    getUserCode() {
      api.authorizeService.getUserCode().then(res => {
        if (res.code == "00") {
          this.userCode = res.data;
        }
      });
    },
    //上传授权文件
    uploadAuthorize() {
      this.uploadAuthorizeFileDrawer = true;
    },
    //上传授权文件开始
    uploadAuthorizeFile(file) {
      const _this = this,
        params = new FormData();
      params.append("file", file.file);
      //进度条配置
      const config = {
        onUploadProgress: ProgressEvent => {
          const progressEvent =
            ((ProgressEvent.loaded / ProgressEvent.total) * 100) | 0;
          file.onProgress({ percent: progressEvent });
        }
      };
      api.uploadService.uploadAuthorizeFile(params, config).then(res => {
        if (res.code == "01" || res.code == "99" || res.code == "500") {
          _this.uploadAuthorizeFileDrawer = false;
          _this.$refs.upload.clearFiles();
        }
        if (res.code == "00") {
          _this.$notify({ message: "上传授权文件成功!", type: "success" });
          _this.getUserCode();
          const authInfo = {
            userLicencesPath: res.data,
            userCode: this.userCode
          };
          api.authorizeService.updateAuthorizeInfo(authInfo).then(res => {
            if (res.code == "00") {
              _this.$notify({ message: "更新成功!", type: "success" });
              _this.reload();
            }
          });
          this.uploadAuthorizeFileDrawer = false;
        }
      });
    },
    cancelUploadAuthorizeFile() {
      this.uploadAuthorizeFileDrawer = false;
    }
  }
};
</script>
<style>
.authorizeManagementHeader {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}
.authorizeBody {
  height: 500px;
  padding: 10px 20px 30px 20px;
  box-shadow: 0px 0px 10px #0000001a;
  color: #45494c;
  font-size: 14px;
}
.authorizeBody p {
  margin: 20px 0;
}
.authorizeBody .title {
  color: #45494c;
  font-weight: 550;
}
.authorizeBody .userCode {
  word-break: break-all;
  line-height: 25px;
  width: 70%;
}
.authorizeBody span {
  letter-spacing: 4px;
}
.authorizeBody .el-upload {
  width: 100%;
}
.authorizeBody .el-upload-dragger {
  width: 100%;
  height: 230px;
  margin-top: 20px;
}
</style>
