<template>
  <div class="reinfore">
    <div class="reinforeHeader">
      <p>当前位置:加固服务</p>
    </div>
    <div class="searchForm">
      <div class="searchBox">
        <el-form :model="ruleForm" ref="ruleForm">
          <el-input
            placeholder="请输入应用名称"
            size="small"
            v-model="ruleForm.appName"
          ></el-input>
          <el-input
            placeholder="请输入版本号"
            size="small"
            v-model="ruleForm.appVersion"
          ></el-input>
          <!--    <el-date-picker
            type="datetime"
            placeholder="选择日期时间"
            v-model="ruleForm.createTime"
          ></el-date-picker> -->
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
        <el-tooltip effect="dark" content="新增任务" placement="top-start">
          <el-button
            type="primary"
            icon="el-icon-zoom-in"
            size="small"
            @click="add()"
          ></el-button>
        </el-tooltip>
        <el-drawer
          title="新增任务"
          :visible.sync="addTaskDrawer"
          :with-header="false"
          :wrapperClosable="false"
          :close-on-press-escape="false"
          :destroy-on-close="true"
          ref="addTaskDrawer"
          size="40%"
        >
          <div class="el-drawer-header">
            <h3>新增任务</h3>
          </div>
          <div class="el-drawer-content">
            <el-upload
              class="upload"
              drag
              action="/"
              multiple
              :http-request="addFileToFormData"
              v-show="uploadShow"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
            </el-upload>
            <!-- 上传文件的列表 -->
            <el-form :model="addRoleForm" :rules="rules" ref="addRoleForm">
              <el-collapse
                class="addApplicationForm"
                v-model="activeNames"
                v-if="uploadFileItems.length !== 0"
              >
                <el-collapse-item
                  title="应用信息"
                  v-for="(item, index) in uploadFileItems"
                  :key="item.id"
                  :name="index + 1"
                >
                  <el-row>
                    <el-col :span="6">
                      <el-image
                        :src="'data:image/jpg;base64,' + item.appIcon"
                        :fit="contain"
                      ></el-image>
                    </el-col>
                    <el-col :span="18">
                      <p class="appName">{{ item.appName }}</p>
                      <p class="appPackage">
                        包名:&nbsp;&nbsp;{{ item.appPackage }}
                      </p>
                      <p>
                        <span style="margin-right:10px;"
                          >版本:&nbsp;&nbsp;{{ item.appVersion }}
                        </span>
                        <span>大小:&nbsp;&nbsp;{{ item.appSize }}KB</span>
                      </p>
                    </el-col>
                  </el-row>
                  <!-- 策略名称 -->
                  <el-row class="strategyName">
                    <el-col :span="24">
                      <p class="strategyName">
                        <span>加固策略:&nbsp;&nbsp;</span>
                        <el-form-item
                          prop="curPrinter1"
                          style="width:60%;display:inline-block"
                        >
                          <el-select
                            v-model="addRoleForm.curPrinter1"
                            placeholder="请选择策略"
                            size="small"
                            @change="
                              strategyChange(addRoleForm.curPrinter1, index)
                            "
                          >
                            <el-option
                              v-for="item in strategyOptions"
                              :key="item.id"
                              :value="item.label"
                              :label="item.label"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </p>
                    </el-col>
                  </el-row>
                  <!-- 多渠道打包 -->
                  <el-row class="channelPack">
                    <el-span :span="24">
                      <p class="channelPack">
                        <span>是否多渠道打包:&nbsp;&nbsp;</span>
                        <template>
                          <el-radio
                            v-model="radio"
                            label="1"
                            @change="channelPackChange(radio)"
                            >是</el-radio
                          >
                          <el-radio
                            v-model="radio"
                            label="2"
                            @change="channelPackChange(radio)"
                            >否</el-radio
                          >
                        </template>
                        <template v-if="radio == 1">
                          <el-form-item>
                            <span>多渠道打包策略:</span>
                            <el-select
                              size="small"
                              placeholder="请选择多渠道打包策略"
                              v-model="channelPackList"
                            >
                              <el-option
                                v-for="item in channelPackList"
                                :key="item.id"
                                :label="item.channel_strategy_name"
                                :value="item.channel_strategy_name"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                        </template>

                        <!--   <el-form-item
                          prop="curPrinter2"
                          style="width:60%;display:inline-block"
                        >
                          <el-select
                            size="small"
                            v-model="addRoleForm.curPrinter2"
                            @change="channelPackChange(addRoleForm.curPrinter2)"
                          >
                            <el-option
                              v-for="item in channelPackOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </el-form-item> -->
                        <!--  <el-collapse v-if="addRoleForm.curPrinter2 === '是'">
                          <el-collapse-item title="多渠道策略信息">
                            <div v-for="item in channelPackList" :key="item.id">
                              <el-row>
                                <el-col :span="12"
                                  >多渠道策略名称:&nbsp;&nbsp;&nbsp;&nbsp;{{
                                    item.channel_strategy_name
                                  }}</el-col
                                >
                                <el-col :span="12"
                                  >多渠道策略描述:&nbsp;&nbsp;&nbsp;&nbsp;{{
                                    item.channel_strategy_describe
                                  }}</el-col
                                >
                              </el-row>
                              <el-row>
                                <el-col :span="12"
                                  >多渠道策略数量:&nbsp;&nbsp;&nbsp;&nbsp;{{
                                    item.channel_strategy_count
                                  }}</el-col
                                >
                                <el-col :span="12"
                                  >创建时间:&nbsp;&nbsp;&nbsp;&nbsp;{{
                                    item.create_time
                                  }}</el-col
                                >
                              </el-row>
                            </div>
                          </el-collapse-item>
                        </el-collapse> -->
                      </p>
                    </el-span>
                  </el-row>
                  <!-- 签名策略 -->
                  <el-row>
                    <el-span :span="24">
                      <p class="signature">
                        <span>是否签名:&nbsp;&nbsp;&nbsp;</span>
                        <el-form-item
                          prop="curPrinter3"
                          style="width:60%;display:inline-block"
                        >
                          <el-select
                            size="small"
                            v-model="addRoleForm.curPrinter3"
                            @change="signatureChange(addRoleForm.curPrinter3)"
                          >
                            <el-option
                              v-for="item in signatureOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                        <el-collapse v-if="addRoleForm.curPrinter3 == '是'">
                          <el-collapse-item title="签名信息">
                            <div v-for="item in signatureList" :key="item.id">
                              <el-row>
                                <el-col :span="12"
                                  >签名名称:&nbsp;&nbsp;&nbsp;&nbsp;{{
                                    item.signName
                                  }}</el-col
                                >
                                <el-col :span="12" class="password"
                                  >签名密码:&nbsp;&nbsp;&nbsp;&nbsp;
                                  <el-input
                                    v-model="item.signPwd"
                                    show-password
                                    readonly
                                    size="small"
                                    style="width:20%"
                                  ></el-input>
                                </el-col>
                              </el-row>
                              <el-row>
                                <el-col :span="12"
                                  >签名别名:&nbsp;&nbsp;&nbsp;&nbsp;{{
                                    item.signAliasName
                                  }}</el-col
                                >
                                <el-col :span="12" class="password"
                                  >别名密码:&nbsp;&nbsp;&nbsp;&nbsp;
                                  <el-input
                                    v-model="item.signAliasPwd"
                                    readonly
                                    size="small"
                                    style="width:20%;border"
                                    show-password
                                  ></el-input>
                                </el-col>
                              </el-row>
                              <el-row>
                                <el-col :span="12"
                                  >签名状态:&nbsp;&nbsp;&nbsp;&nbsp;
                                  <span v-if="item.status == 1">已完成</span>
                                </el-col>
                                <el-col :span="12"
                                  >创建时间:&nbsp;&nbsp;&nbsp;&nbsp;{{
                                    item.createTime
                                  }}</el-col
                                >
                              </el-row>
                            </div>
                          </el-collapse-item>
                        </el-collapse>
                      </p>
                    </el-span>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
            </el-form>
          </div>
          <div class="el-drawer-footer">
            <el-button
              type="primary"
              @click="saveaddTask('addRoleForm', addRoleForm)"
              >保存</el-button
            >
            <el-button @click="cancelSaveaddTask()" plain>取消</el-button>
          </div>
        </el-drawer>
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
    <div class="reinforeBody">
      <template>
        <el-table :data="listItem" ref="listItem">
          <el-table-column
            type="index"
            label="序号"
            width="60"
          ></el-table-column>
          <el-table-column prop="appName" label="应用名称">
            <template slot-scope="scope">
              <img :src="'data:image/jpg;base64,' + scope.row.appIcon" />
              <span style="margin-left:7px"
                >{{ scope.row.appName }}
              </span></template
            >
          </el-table-column>
          <el-table-column prop="appFileName" label="文件名称">
          </el-table-column>
          <el-table-column prop="appVersion" label="应用版本"></el-table-column>
          <el-table-column prop="createTime" label="创建时间">
          </el-table-column>
          <el-table-column prop="status" label="加固状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">已完成</span>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="创建人"></el-table-column>
          <el-table-column prop="operate" label="操作">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="加固" placement="top-start">
                <i
                  class="el-icon-video-play playIcon"
                  @click="delete scope.row.id"
                ></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="详细" placement="top-start">
                <i
                  class="el-icon-tickets floderIcon"
                  @click="detail(scope.row.id)"
                ></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <div class="reinforeBase">
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
    </div>
  </div>
</template>
<script>
import https from "../../http.js";
export default {
  name: "reinfore",
  data() {
    return {
      curPage: 1,
      limit: 10,
      dataCount: 0,
      listItem: [], //调用接口获取的数据
      ruleForm: {
        appName: "",
        appFileName: "",
        appVersion: "",
        createTime: ""
      },
      addRoleForm: {
        curPrinter1: null,
        curPrinter2: null,
        curPrinter3: null
      },
      rules: {
        curPrinter1: [
          { required: true, message: "请选择加固策略", trigger: true }
        ],
        curPrinter2: [
          { required: true, message: "是否多渠道打包", trigger: true }
        ],
        curPrinter3: [{ required: true, message: "是否签名", trigger: true }]
      },
      dateValue: "",
      addTaskDrawer: false,
      percentage: 0, //存放上传的百分比
      uploadFileItems: [],
      uploadShow: true,
      strategyOptions: [],
      channelPackOptions: [],
      reinforceDetailDrawer: false,
      signatureOptions: [
        { value: "是", label: "是" },
        { value: "否", label: "否" }
      ],
      channelPackList: [],
      signatureList: [],
      activeNames: [],
      signAliasPwd: {
        appIcon: "",
        appName: "",
        appPackage: "",
        appSize: "",
        appVersion: "",
        reinforceSign: {}
      },
      xx: {},
      label: "",
      radio: 0,
      strategyItemDto: []
    };
  },
  inject: ["reload"],
  methods: {
    //获取后台数据
    getData(queryInfo) {
      let baseUrl = this.api.baseUrl;
      https
        .fetchPost(baseUrl + "/api/reinforce/info/page", {
          pn: this.curPage,
          limit: this.limit,
          queryInfo
        })
        .then(res => {
          let data = res.data.data;
          this.listItem = data.items;
          this.dataCount = data.count;
        });
    },
    //显示的页面条数
    handleSizeChange(val) {
      this.limit = val;
      this.getData();
    },
    // //鼠标点击哪一页
    handleCurrentChange(val) {
      this.curPage = val;
      this.getData();
    },
    refresh() {
      this.reload();
    },
    //查询加固服务
    search(form) {
      let baseUrl = this.api.baseUrl,
        appName = form.appName,
        appVersion = form.appVersion,
        queryInfo = { appName, appVersion };
      this.getData(queryInfo);
      this.reload();
    },
    //新增加固任务
    add() {
      this.addTaskDrawer = true;
    },
    //保存加固任务
    saveaddTask(formName, form) {
      let baseUrl = this.api.baseUrl;
      data = this.uploadFileItems
        .concat(this.signatureList)
        .concat(this.strategyItemDto);
      this.$refs[formName].validate(valid => {
        if (valid) {
          /*  https
        .fetchPost(baseUrl + "/api/reinforce/info/saveReinforceInfoOrUpdate", {
          reinforceInfoDto: data1
        })
        .then(res => {
          console.log(res);
        }); */
        } else {
          console.log("必选项没有填");
        }
      });
    },
    //取消加固任务
    cancelSaveaddTask() {
      this.addTaskDrawer = false;
      this.reload();
    },
    //上传-----开始
    addFileToFormData(file) {
      let params = new FormData(),
        baseUrl = this.api.baseUrl;
      params.append("file", file.file);
      //进度条配置
      let config = {
        onUploadProgress: ProgressEvent => {
          let progressPercent =
            ((ProgressEvent.loaded / ProgressEvent.total) * 100) | 0;
          //多个文件显示多个进度条
          file.onProgress({ percent: progressPercent });
        }
      };
      https
        .uploadFile(
          baseUrl + "/api/reinforce/info/uploadReinforceFile",
          params,
          config
        )
        .then(res => {
          if (res.data.code === "00") {
            console.log(res.data.data);
            this.uploadFileItems.push(res.data.data);
            for (var i = 0; i < this.uploadFileItems.length; i++) {
              this.activeNames.push(i + 1);
              this.activeNames = Array.from(new Set(this.activeNames));
            }
            this.uploadShow = false;
          }
        });
    },
    //上传结束---
    //详情
    detail(id) {
      this.$router.push({ path: "/Detail" + id + "" });
    },
    //测试

    //加固策略
    strategyChange(item, index) {
      console.log(this.addRoleForm);
      let data = this.strategyOptions.filter(val => {
        return val["reinforce_describe"] == item;
      });
      this.strategyItemDto = data;
      console.log(item, index);
    },
    //是否多渠道打包
    channelPackChange(item) {
      let baseUrl = this.api.baseUrl;
      if (item === "1") {
        https
          .fetchPost(
            baseUrl + "/api/channel/strategy/findChannelStrategyByPage",
            { limit: 20, pn: 1 }
          )
          .then(res => {
            this.channelPackList = res.data.data.items;
            console.log(this.channelPackList, "哈哈");
          });
      } else {
        console.log("不做操作");
      }
    },
    //是否签名
    signatureChange(item) {
      console.log(item);
      let baseUrl = this.api.baseUrl;
      if (item == "是") {
        https
          .fetchPost(baseUrl + "/api/reinforce/sign/page", {
            limit: 20,
            pn: 1
          })
          .then(res => {
            this.signatureList = res.data.data.items;
            console.log(this.signatureList);
          });
      }
    }
  },
  mounted() {
    let baseUrl = this.api.baseUrl;
    this.getData();
    //查询策略列表
    https
      .fetchPost(baseUrl + "/api/reinforce/strategy/page", {
        pn: 1,
        limit: 20
      })
      .then(res => {
        let data = res.data.data.items;
        data = JSON.parse(
          JSON.stringify(data).replace(/reinforce_strategy_name/g, "label")
        );
        this.strategyOptions = data;
        console.log(this.strategyOptions, "哈哈哈哈哈");
      });
    //查询渠道策略分页列表 是否多渠道打包
    https
      .fetchPost(baseUrl + "/api/channel/strategy/findChannelStrategyByPage", {
        pn: 1,
        limit: 20
      })
      .then(res => {
        console.log(res.data.data.items, "-----");
      });
    //查询签名列表 签名策略列表
    https
      .fetchPost(baseUrl + "/api/reinforce/sign/page", { pn: 1, limit: 20 })
      .then(res => {
        console.log(res.data.data.items, "++++");
      });
  }
};
</script>
<style>
.reinforeHeader {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}
.reinforeBody img {
  width: 40px;
  height: 40px;
  border: 1px solid #eaeaea;
  border-radius: 3px;
  vertical-align: middle;
}
.deleteIcon,
.playIcon,
.floderIcon {
  font-size: 22px;
  color: #207ba6;
  margin-right: 10px;
  cursor: pointer;
}
.searchForm {
  display: flex;
}
.searchForm .el-input {
  width: auto;
}
.searchForm .el-input {
  margin-right: 5px;
}
.el-date-editor--datetime .el-input__inner {
  height: 32px;
  line-height: 32px;
}
.el-date-editor--datetime .el-input__icon {
  line-height: 32px;
}
.el-upload {
  width: 100%;
}
.el-upload-dragger {
  width: 100%;
  height: 230px;
  margin-top: 20px;
}
.el-drawer-content .el-collapse {
  margin-top: 10px;
}
.el-drawer-content .el-collapse .el-row {
  /*  padding: 20px 0; */
  text-align: justify;
}
.el-drawer-content .el-collapse .password .el-input__inner {
  border: none;
}
.addApplicationForm {
  padding: 20px;
  font-size: 14px;
}
.addApplicationForm .handleBox p {
  margin-bottom: 20px;
}

.addApplicationForm .el-select {
  width: 60%;
}
.addApplicationForm .handleBox {
  text-align: justify;
}
.addApplicationForm .appInfo {
  display: flex;
  margin: 30px 0;
}
.addApplicationForm img {
  width: 110px;
  border-radius: 15px;
  margin: 30px 35px 0 0;
  vertical-align: middle;
}
.addApplicationForm p {
  line-height: 36px;
  color: #606266;
  margin: 10px 0;
}
.addApplicationForm .appName {
  line-height: 40px;
  font-size: 16px;
  color: #333;
  font-weight: 700;
}
.searchBox {
  margin-bottom: 10px;
  display: flex;
}
.reinforeBase {
  margin-top: 20px;
}
.reinfore .operateBox {
  margin-left: 20px;
}
.operateBox .el-button--primary {
  background: #207ba6;
  border-color: #207ba6;
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
.el-table__header-wrapper {
  background: #f8f8f9;
}
.el-table__header-wrapper th {
  background: #f2f5f7;
}
.el-table ::before {
  background: white;
}
.operateBox .el-drawer {
  overflow-y: auto;
}
.el-drawer-header {
  width: 100%;
  position: fixed;
  background: white;
  z-index: 99;
  height: 50px;
  padding: 17px 20px;
  border-bottom: 1px solid #ebebeb;
}
.el-drawer-content {
  margin-top: 50px;
  position: relative;
  overflow: auto;
  padding: 0px 20px 40px 20px;
}
.el-drawer-content .upload {
  text-align: center;
}
.el-drawer-header h3 {
  color: #333;
  font-size: 16px;
  font-weight: 600;
}
.reinfore .el-drawer-footer {
  width: 100%;
  position: fixed;
  bottom: 0px;
  background: white;
  z-index: 9;
  padding: 10px 20px;
  border-top: 1px solid #ebebeb;
}
</style>
