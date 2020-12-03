<template>
  <div class="signature">
    <div class="signatureHeader">
      <p>当前位置: 签名服务</p>
    </div>
    <div class="searchForm">
      <div class="searchBox">
        <el-form :model="ruleForm" ref="ruleForm">
          <el-input
            size="small"
            placeholder="请输入签名文件名称"
            v-model="ruleForm.signatureName"
          ></el-input>
        </el-form>
      </div>
      <div class="operateBox">
        <el-button type="primary" size="small" @click="search()"
          >查询</el-button
        >

        <el-button type="primary" size="small" @click="refresh()"
          >刷新</el-button
        >

        <el-button type="primary" size="small" @click="uploadSignature()"
          >上传签名</el-button
        >
        <!-- 上传签名 -->
        <el-drawer
          title="上传签名"
          :visible.sync="uploadSignatureDrawer"
          :with-header="false"
          :wrapperClosable="false"
          :close-on-press-esape="false"
          :destroy-on-close="true"
          size="40%"
        >
          <div class="el-drawer-header">
            <h3>上传签名</h3>
          </div>
          <div class="el-drawer-content">
            <el-upload
              class="uploadSignature"
              drag
              action="/"
              :http-request="uploadSignatureFile"
              v-show="uploadShow"
              :file-list="uploadSignatureFileItem"
              accept=".keystore,.jks"
              ref="uploadSignature"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处,或<em>点击上传</em>
              </div>
              <div class="el-upload_tip" slot="tip">
                点击上传.keystore或.jks文件
              </div>
            </el-upload>
            <!-- 上传签名的列表 -->
            <div v-for="(item, index) in uploadSignatureFileItem" :key="index">
              <el-form
                :model="signatureItemForm[index]"
                :rules="uploadSignatureRules"
                label-width="100px"
                ref="signatureItemForm"
                class="signatureItemForm"
              >
                <div class="signatureName">
                  <h3 class="signatureNameTitle">
                    <i class="signatureNameTitleIcon"></i>
                    <span>上传签名文件</span>
                  </h3>
                  <div class="signatureNameContent">
                    <el-form-item label="签名文件"
                      ><el-input
                        size="small"
                        v-model="item.signatureFileName"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="signatureName">
                  <h3 class="signatureNameTitle">
                    <i class="signatureNameTitleIcon"></i>
                    <span>输入签名文件密码以及标识，以保存签名文件</span>
                  </h3>
                  <div class="signatureNameContent">
                    <el-form-item label="签名名称" prop="signatureName">
                      <el-input
                        size="small"
                        placeholder="请输入签名名称"
                        v-model="signatureItemForm[index].signatureName"
                        @input="showSaveSignatureBox"
                        @blur="checkSignName"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="签名密码" prop="signaturePwd">
                      <el-input
                        size="small"
                        placeholder="请输入签名密码"
                        type="password"
                        v-model="signatureItemForm[index].signaturePwd"
                        :disabled="signatureItemForm[index].signatureAliasBox"
                        @input="showSaveSignatureBox"
                      ></el-input>
                      <el-button
                        type="primary"
                        size="small"
                        v-if="
                          !signatureItemForm[index].signaturePwd &&
                            !signatureItemForm[index].signatureAliasBox
                        "
                        disabled
                        >确定</el-button
                      >
                      <el-button
                        type="primary"
                        size="small"
                        v-if="
                          signatureItemForm[index].signaturePwd &&
                            !signatureItemForm[index].signatureAliasBox
                        "
                        @click="
                          getSignatureAlias(
                            signatureItemForm[index].signaturePwd,
                            signatureItemForm[index].signatureAddress,
                            index
                          )
                        "
                        >确定</el-button
                      >
                    </el-form-item>
                    <!-- 签名密码输入正确才显示 -->
                    <template v-if="signatureItemForm[index].signatureAliasBox">
                      <el-form-item
                        label="签名别名"
                        prop="signatureAliasNameValue"
                      >
                        <el-select
                          v-model="
                            signatureItemForm[index].signatureAliasNameValue
                          "
                          placeholder="请选择签名别名"
                          style="width:55%"
                          @input="showSaveSignatureBox"
                        >
                          <el-option
                            v-for="signatureAliasNameItem in signatureItemForm[
                              index
                            ].signatureAliasName"
                            :key="signatureAliasNameItem.value"
                            :value="signatureAliasNameItem.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="别名密码" prop="signatureAliasPwd">
                        <el-input
                          @input="showSaveSignatureBox"
                          size="small"
                          type="password"
                          v-model="signatureItemForm[index].signatureAliasPwd"
                        ></el-input>
                      </el-form-item>
                    </template>
                  </div>
                </div>
              </el-form>
            </div>
          </div>
          <div class="el-drawer-footer">
            <div class="buttonBox" style="display:inline-block">
              <el-button
                type="primary"
                @click="saveSignature()"
                :disabled="!saveSignatureBox"
                >保存</el-button
              >
              <el-button @click="cancelSignature()" plain>取消</el-button>
            </div>
          </div>
        </el-drawer>
      </div>
    </div>
    <!-- 表格内容 -->
    <div class="signatureBody">
      <template>
        <el-table
          :data="listItem"
          element-loading-text="加载中"
          v-loading="loading"
        >
          <el-table-column type="index" label="序号" width="60">
            <template slot-scope="scope">
              <span>{{ (curPage - 1) * limit + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="signName"
            label="签名名称"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="signAliasName"
            label="签名别名"
          ></el-table-column>
          <el-table-column prop="userName" label="创建人"></el-table-column>
          <el-table-column
            prop="createTime"
            label="签名创建时间"
          ></el-table-column>
          <el-table-column prop="operate" label="操作">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="danger"
                @click="deleteSignature(scope.row.id, scope.row.signName)"
              >
                删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!-- 表格底部 分页 -->
    <div class="signatureBase">
      <pagination @pageChanged="onPageChanged"></pagination>
    </div>
  </div>
</template>
<script>
import api from "../../request/api";
import pagination from "../common/pagination";
import pageMixins from "../../utils/pageMixins";
export default {
  name: "signature",
  components: { pagination },
  mixins: [pageMixins],
  data() {
    return {
      curPage: 1,
      limit: 10,
      listItem: [],
      ruleForm: {
        signatureName: ""
      },
      uploadSignatureRules: {
        signatureName: [
          { required: true, message: "请输入签名名称", tirgger: "blur" }
        ],
        signaturePwd: [
          { required: true, message: "请输入签名密码", tirgger: "blur" }
        ],
        signatureAliasNameValue: [
          { required: true, message: "请选择签名别名", trigger: "blur" }
        ],
        signatureAliasPwd: [
          { required: true, message: "请输入别名密码", trigger: "blur" }
        ]
      },
      uploadSignatureDrawer: false,
      uploadShow: true,
      uploadSignatureFileItem: [],
      loading: false,
      signatureItemForm: [],
      saveSignatureBox: false
    };
  },
  inject: ["reload"],
  beforeMount() {
    this.getData();
  },
  methods: {
    //获取后台数据
    async getData() {
      const params = {};
      params.queryInfo = this.ruleForm;
      this.getDataItem(this.addPageInfo(params));
    },
    getDataItem(params) {
      api.reinforceService.getSignatureList(params).then(res => {
        if (res.code == "00") {
          const data = res.data,
            count = data.count,
            number = params.pn,
            size = params.limit;
          this.listItem = data.items;
          this.curPage = number;
          this.limit = size;
          this.onGotPageData({ totalElements: count, size, number });
        }
      });
    },
    //查询签名
    search() {
      let signName = this.ruleForm.signatureName,
        queryInfo = { signName },
        _this = this;
      _this.loading = true;
      _this.getData();
      setTimeout(function() {
        _this.loading = false;
      }, 500);
    },
    //刷新
    refresh() {
      this.reload();
    },
    //上传签名开始
    uploadSignatureFile(file) {
      let params = new FormData(),
        _this = this;
      params.append("file", file.file);
      //进度条配置
      let config = {
        onUploadProgress: ProgressEvent => {
          let progressPercent =
            ((ProgressEvent.loaded / ProgressEvent.total) * 100) | 0;
          file.onProgress({ percent: progressPercent });
        }
      };
      api.uploadService.uploadSignatureFile(params, config).then(res => {
        if (res.code == "01" || res.code == "99" || res.code == "500") {
          this.uploadSignatureDrawer = false;
          this.$refs.uploadSignature.clearFiles();
        }
        if (res.code == "00") {
          const data = res.data;
          this.uploadSignatureFileItem.push({
            signatureFileName: file.file.name,
            signFilePath: ""
          });
          this.signatureItemForm.push({
            signatureAddress: data,
            signatureName: "",
            signaturePwd: "",
            signatureAliasName: [],
            signatureAliasNameValue: "",
            signatureAliasPwd: "",
            signatureAliasBox: false
          });
          this.uploadShow = false;
          this.$refs.uploadSignature.clearFiles();
        }
      });
    },
    //删除签名
    deleteSignature(id, name) {
      const _this = this;
      new this.$messageTips(({ confirm }) => {
        confirm({ content: `确定要删除${name}签名吗?` });
      }).then(() => {
        api.signatureService.deleteSignature(id).then(res => {
          if (res.code == "00") {
            _this.$message({
              message: "删除成功!",
              type: "success",
              duration: 1000
            });
            _this.reload();
          }
        });
      });
    },
    //上传签名结束
    //获取签名别名
    getSignatureAlias(signaturePwd, signatureAddress, signatureIndex) {
      const _this = this,
        params = { signPwd: signaturePwd, signFilePath: signatureAddress };
      api.signatureService.getSignatureAlias;
      api.signatureService.getSignatureAlias(params).then(res => {
        if (res.code === "500") {
          _this.signatureItemForm[signatureIndex].signatureAliasBox = false;
        }
        if (res.code === "00") {
          _this.signatureItemForm[signatureIndex].signatureAliasBox = true;
          res.data.map(item => {
            _this.signatureItemForm[signatureIndex].signatureAliasName.push({
              value: item
            });
          });
        }
      });
    },
    //上传签名
    uploadSignature() {
      this.uploadSignatureDrawer = true;
    },
    //是否显示保存按钮
    showSaveSignatureBox() {
      let _this = this,
        signatureItemList = _this.signatureItemForm;
      signatureItemList.forEach((v, i) => {
        _this.$refs["signatureItemForm"][i].validate(valid => {
          let signatureAliasBox = _this.signatureItemForm[0].signatureAliasBox;
          if (valid && signatureAliasBox) {
            _this.saveSignatureBox = true;
          } else {
            _this.saveSignatureBox = false;
            return false;
          }
        });
      });
    },
    //检查签名名称是否重复
    checkSignName() {
      let _this = this,
        signName = _this.signatureItemForm[0]["signatureName"];
      if (signName) {
        api.signatureService.checkSignName({ signName }).then(res => {
          if (!res) {
            _this.$message.error("签名名称已存在!");
            _this.saveSignatureBox = false;
          }
        });
      } else {
      }
    },
    //保存上传的签名
    saveSignature() {
      let _this = this,
        data = _this.signatureItemForm[0],
        signName = data.signatureName,
        signPwd = data.signaturePwd,
        signAliasName = data.signatureAliasNameValue,
        signAliasPwd = data.signatureAliasPwd,
        signFilePath = data.signatureAddress;
      api.signatureService
        .saveSignature({
          signName,
          signPwd,
          signAliasName,
          signAliasPwd,
          signFilePath
        })
        .then(res => {
          if (res.code == "00") {
            _this.$message({
              message: "新增签名成功",
              type: "success",
              duration: 1000
            });
            this.$refs.uploadSignature.clearFiles();
            _this.reload();
          }
        });
    },
    //取消上传的签名
    cancelSignature() {
      if (this.signatureItemForm.length) {
        new this.$messageTips(({ confirm }) => {
          confirm({ content: "会清空当前上传的文件,是否继续" });
        }).then(() => {
          this.uploadSignatureDrawer = false;
          this.$refs.uploadSignature.clearFiles();
          this.reload();
        });
      } else {
        this.uploadSignatureDrawer = false;
      }
    }
  }
};
</script>
<style>
.signatureHeader {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}
.signature .searchForm {
  display: flex;
  margin-bottom: 15px;
}
.signatureBody .deleteIcon {
  font-size: 22px;
  color: #409eff;
  margin-right: 10px;
  cursor: pointer;
}
.searchForm .operateBox {
  margin-left: 20px;
}
.el-upload {
  width: 100%;
}
.el-upload_tip {
  text-align: center;
  font-size: 14px;
  margin-top: 5px;
  color: #a3a9b1;
}
.el-upload-dragger {
  width: 100%;
  height: 230px;
  margin-top: 20px;
}
/* 上传签名的表单 */
.signatureItemForm .signatureName {
  margin-top: 20px;
}
.signatureItemForm .signatureNameTitle {
  font-size: 16px;
  margin-bottom: 20px;
  font-weight: 530;
  position: relative;
}
.signatureItemForm .el-form-item__label {
  text-align: left;
}
.signatureItemForm .signatureNameTitle span {
  margin-left: 10px;
}
.signatureItemForm .signatureNameTitleIcon {
  display: inline-block;
  width: 3px;
  height: 14px;
  background: #409eff;
  margin-right: 10px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.signatureItemForm .el-collapse-item__header {
  font-size: 16px;
  font-weight: 700;
  color: #606266;
}
.signatureName .el-form-item__content > .el-input {
  width: 55%;
  margin-right: 5px;
}
.signatureBase {
  margin-top: 10px;
}
</style>
