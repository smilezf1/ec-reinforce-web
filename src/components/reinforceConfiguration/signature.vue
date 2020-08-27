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
        <el-tooltip effect="dark" content="查询" placement="top-start">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="search()"
          ></el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="刷新" placement="top-start">
          <el-button
            type="primary"
            icon="el-icon-refresh-right"
            size="small"
            @click="refresh()"
          ></el-button>
        </el-tooltip>
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
                        size="mini"
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
            <el-button
              type="primary"
              @click="saveSignature()"
              :disabled="!saveSignatureBox"
              >保存</el-button
            >
            <el-button @click="cancelSignature()" plain>取消</el-button>
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
              <el-tooltip effect="dark" content="删除" placement="top-start">
                <i
                  class="el-icon-delete deleteIcon"
                  @click="deleteSignature(scope.row.id, scope.row.signName)"
                ></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!-- 表格底部 分页 -->
    <div class="signatureBase">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="curPage"
        :page-size="10"
        :page-sizes="[10, 20, 30, 40, 50]"
        layout="total,sizes,prev,pager,next,jumper"
        :total="dataCount"
        class="paginationBox"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import https from "../../http";
export default {
  name: "signature",
  data() {
    return {
      curPage: 1,
      limit: 10,
      dataCount: 0,
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
    getData(queryInfo) {
      let baseUrl = this.api.baseUrl;
      https
        .fetchPost(baseUrl + "/api/reinforce/sign/page", {
          pn: this.curPage,
          limit: this.limit,
          queryInfo
        })
        .then(res => {
          if (res.data.code == "00") {
            let data = res.data.data;
            this.listItem = data.items;
            this.dataCount = data.count;
          }
        });
    },
    //显示页面的条数
    handleSizeChange(val) {
      this.limit = val;
      this.getData();
    },
    //鼠标点击哪一页
    handleCurrentChange(val) {
      this.curPage = val;
      let signName = this.ruleForm.signatureName,
        queryInfo = { signName };
      this.getData(queryInfo);
    },
    //查询签名
    search() {
      let baseUrl = this.api.baseUrl,
        signName = this.ruleForm.signatureName,
        queryInfo = { signName },
        _this = this;
      _this.loading = true;
      _this.getData(queryInfo);
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
        baseUrl = this.api.baseUrl,
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
      https
        .uploadFile(
          baseUrl + "/api/reinforce/sign/uploadReinforceSignFile",
          params,
          config
        )
        .then(res => {
          if (res) {
            if (res.data.code === "00") {
              let data = res.data.data;
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
              console.log(this.signatureItemForm.length, "###");
              this.uploadShow = false;
              this.$refs.uploadSignature.clearFiles();
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //删除签名
    deleteSignature(id, name) {
      let _this = this,
        baseUrl = _this.api.baseUrl;
      _this
        .$confirm("确定要删除" + name + "签名吗?", "提示", {
          confirmButtonText: "确定",
          cancelButonText: "取消",
          type: "warning"
        })
        .then(() => {
          https
            .fetchGet(
              baseUrl + "/api/reinforce/sign/deleteReinforceSignById/" + id
            )
            .then(res => {
              if (res.data.code == "00") {
                _this.$message({
                  message: "删除成功!",
                  type: "success",
                  duration: 1000
                });
                _this.reload();
              }
            });
        })
        .catch(() => {});
    },
    //上传签名结束
    //获取签名别名
    getSignatureAlias(signaturePwd, signatureAddress, signatureIndex) {
      let baseUrl = this.api.baseUrl,
        _this = this;
      https
        .fetchPost(baseUrl + "/api/reinforce/sign/findSignAliasNameList", {
          signPwd: signaturePwd,
          signFilePath: signatureAddress
        })
        .then(res => {
          if (res.data.code === "500") {
            _this.$message.error(res.data.message);
            _this.signatureItemForm[signatureIndex].signatureAliasBox = false;
          }
          if (res.data.code === "00") {
            _this.signatureItemForm[signatureIndex].signatureAliasBox = true;
            res.data.data.map(item => {
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
        signName = _this.signatureItemForm[0]["signatureName"],
        baseUrl = _this.api.baseUrl;
      if (signName) {
        https
          .fetchGet(baseUrl + "/api/reinforce/sign/checkSignName", {
            signName
          })
          .then(res => {
            if (res.data) {
            } else {
              _this.$message.error("签名名称不能重复哦");
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
        signFilePath = data.signatureAddress,
        baseUrl = _this.api.baseUrl;
      https
        .fetchPost(baseUrl + "/api/reinforce/sign/addReinforceSign", {
          signName,
          signPwd,
          signAliasName,
          signAliasPwd,
          signFilePath
        })
        .then(res => {
          if (res.data.code === "00") {
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
        this.$confirm("会清空当前上传的文件,是否继续?", "提示", {
          closeOnClickModal: false,
          confirmButtonText: "确定",
          cancelButonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.uploadSignatureDrawer = false;
            this.$refs.uploadSignature.clearFiles();
            this.reload();
          })
          .catch(() => {});
        this.$refs.uploadSignature.clearFiles();
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
.signatureBody .el-table {
  font-size: 12px;
  border: 1px solid #dcdee2;
  border-bottom: 1px solid transparent !important;
}
.signatureBody .el-table thead {
  color: #515a6a;
}
.el-table__header-wrapper th {
  background: #f2f5f7 !important;
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
.signature .el-drawer {
  overflow-y: auto;
}
.signature .el-drawer-header {
  width: 100%;
  position: fixed;
  background: white;
  z-index: 99;
  height: 50px;
  padding: 17px 20px;
  border-bottom: 1px solid #ebebeb;
}
.signature .el-drawer-header h3 {
  color: #333;
  font-size: 16px;
  font-weight: 600;
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
.signature .el-drawer-content {
  margin-top: 50px;
  position: relative;
  overflow: auto;
  padding: 0px 20px 40px 20px;
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
.signature .el-drawer-footer {
  width: 100%;
  position: fixed;
  bottom: 0px;
  background: white;
  z-index: 9;
  padding: 10px 20px;
  border-top: 1px solid #ebebeb;
}
.signatureBase {
  margin-top: 10px;
}
</style>
