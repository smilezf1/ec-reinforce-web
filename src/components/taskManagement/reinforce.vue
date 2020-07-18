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
        <!--  <el-tooltip effect="dark" content="新增任务" placement="top-start"> -->
        <el-button
          type="primary"
          size="small"
          @click="add()"
          style="margin-right:10px"
          >新增任务</el-button
        >
        <!--    </el-tooltip> -->
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
              :file-list="uploadFileItems"
              ref="upload"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
            </el-upload>
            <!-- 上传文件的列表 -->
            <div v-for="(item, index) in uploadFileItems" :key="item.id">
              <el-form
                :model="addRoleFormArray[index]"
                :rules="rules"
                ref="addRoleForm"
              >
                <el-collapse class="addApplicationForm" v-model="activeNames">
                  <el-collapse-item title="应用信息" :name="index + 1">
                    <el-row>
                      <el-col :span="6">
                        <img :src="'data:image/jpg;base64,' + item.appIcon" />
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
                    <!--   <el-row class="strategyName">
                      <el-col :span="24">
                        <p class="strategyName">
                          <el-form-item
                            prop="curPrinter1"
                            style="width:60%;display:inline-block"
                          >
                            <label slot="label"
                              >加&nbsp;&nbsp;&nbsp;固&nbsp;&nbsp;&nbsp;策&nbsp;&nbsp;&nbsp;略:</label
                            >
                            <el-select
                              v-model="addRoleFormArray[index].curPrinter1"
                              placeholder="请选择策略"
                              size="small"
                              @change="
                                strategyChange(
                                  addRoleFormArray[index].curPrinter1,
                                  index
                                )
                              "
                            >
                              <el-option
                                v-for="item in strategyOptions"
                                :key="item.id"
                                :value="item.id"
                                :label="item.label"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                        </p>
                      </el-col>
                    </el-row> -->
                    <!-- 加固项 -->
                    <el-row class="reinforceItem">
                      <el-col :span="24">
                        <h3 style="font-size:16px">加固项</h3>
                        <div
                          class="reinforceItem"
                          v-for="item in reinforceItemData"
                          :key="item.id"
                        >
                          <!-- <el-form-item label="加固项"> -->
                          <!--  <el-tree
                            :data="reinforceItemData"
                            show-checkbox
                            node-key="id"
                            ref="tree"
                            :props="defaultProps"
                            @check-change="handleCheckChange"
                          ></el-tree> -->
                          <el-form-item :label="item.reinforceItemName">
                            <div v-if="item.children">
                              <div
                                v-for="subItem in item.children"
                                :key="subItem.id"
                              >
                                <el-checkbox-group
                                  v-model="
                                    addRoleFormArray[index].strategyItemDtoTest
                                  "
                                >
                                  <el-checkbox
                                    :label="subItem.reinforceItemName"
                                    :checked="subItem.isChecked == 1"
                                    :disabled="subItem.isCancel == 2"
                                    :value="subItem.id"
                                  ></el-checkbox>
                                </el-checkbox-group>
                              </div>
                            </div>
                            <div v-else>
                              <el-radio-group
                                v-model="addRoleFormArray[index].radioTest"
                                :disabled="item.isCancel == 2"
                                :label="item.isChecked"
                              >
                                <el-radio>启用</el-radio>
                                <el-radio>禁用</el-radio>
                              </el-radio-group>
                              <el-form-item
                                label="签名MD5"
                                v-if="item.reinforceItemName == '自定义签名MD5'"
                              >
                                <el-input
                                  v-model="
                                    addRoleFormArray[index].signMd5Items[index]
                                  "
                                  size="small"
                                  @keyup.enter.native="addSignature(index)"
                                  clearable
                                  maxlength="32"
                                ></el-input>
                                <el-button
                                  type="primary"
                                  icon="el-icon-plus"
                                  plain
                                  circle
                                  @click="addSignature(index)"
                                  size="small"
                                ></el-button>
                              </el-form-item>
                              <!-- 添加的子项目 -->
                              <el-form-item
                                v-if="
                                  item.reinforceItemName == '自定义签名MD5' &&
                                    index > 0
                                "
                                style="margin-left:70px"
                              >
                                <el-input
                                  v-model="
                                    addRoleFormArray[index].signMd5Items[index]
                                  "
                                  size="small"
                                  clearable
                                  @keyup.enter.native="addSignature(index)"
                                  maxlength="32"
                                ></el-input>
                              </el-form-item>
                            </div>
                          </el-form-item>
                        </div>
                      </el-col>
                    </el-row>
                    <!-- 多渠道打包 -->
                    <!--  <el-row class="channelPack">
                      <el-span :span="24">
                        <p class="channelPack">
                          <el-form-item
                            label="是否多渠道打包:"
                            style="width:60%;display:inline-block"
                            prop="radio1"
                          >
                            <el-radio-group
                              v-model="addRoleFormArray[index].radio1"
                            >
                              <el-radio
                                label="是"
                                @change="
                                  channelPackChange(
                                    addRoleFormArray[index].radio1
                                  )
                                "
                              ></el-radio>
                              <el-radio
                                label="否"
                                @change="
                                  channelPackChange(
                                    addRoleFormArray[index].radio1
                                  )
                                "
                              ></el-radio>
                            </el-radio-group>
                          </el-form-item>

                          <template
                            v-if="addRoleFormArray[index].radio1 == '是'"
                          >
                            <el-form-item
                              label="多渠道打包策略"
                              prop="curPrinter4"
                            >
                              <el-select
                                size="small"
                                placeholder="请选择多渠道打包策略"
                                v-model="addRoleFormArray[index].curPrinter4"
                              >
                                <el-option
                                  v-for="item in channelPackList"
                                  :key="item.id"
                                  :label="item.channel_strategy_name"
                                  :value="item.id"
                                ></el-option>
                              </el-select>
                            </el-form-item>
                          </template>
                        </p>
                      </el-span>
                    </el-row> -->
                    <!-- 签名策略 -->
                    <el-row>
                      <el-span :span="24">
                        <p class="signature">
                          <el-form-item
                            style="width:60%;display:inline-block"
                            prop="radio2"
                          >
                            <label slot="label"
                              >是&nbsp;&nbsp;&nbsp;否&nbsp;&nbsp;&nbsp;签&nbsp;&nbsp;&nbsp;名:</label
                            >
                            <el-radio-group
                              v-model="addRoleFormArray[index].radio2"
                            >
                              <el-radio
                                label="是"
                                @change="
                                  signatureChange(
                                    addRoleFormArray[index].radio2
                                  )
                                "
                                >是</el-radio
                              >
                              <el-radio
                                label="否"
                                @change="
                                  signatureChange(
                                    addRoleFormArray[index].radio2
                                  )
                                "
                                >否</el-radio
                              >
                            </el-radio-group>
                          </el-form-item>
                          <template
                            v-if="addRoleFormArray[index].radio2 == '是'"
                          >
                            <el-form-item label="签名策略" prop="curPrinter5">
                              <el-select
                                size="small"
                                placeholder="请选择签名策略"
                                v-model="addRoleFormArray[index].curPrinter5"
                              >
                                <el-option
                                  v-for="item in signatureList"
                                  :key="item.id"
                                  :label="item.signName"
                                  :value="item.id"
                                ></el-option>
                              </el-select>
                            </el-form-item>
                          </template>
                        </p>
                      </el-span>
                    </el-row>
                  </el-collapse-item>
                </el-collapse>
              </el-form>
            </div>
          </div>
          <div class="el-drawer-footer">
            <el-button type="primary" @click="saveaddTask()">加固</el-button>
            <el-button @click="cancelSaveaddTask()" plain>取消</el-button>
          </div>
        </el-drawer>
        <el-tooltip effect="dark" content="查询" placement="top-start">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="search(ruleForm)"
          ></el-button>
        </el-tooltip>
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
        <el-table
          :data="listItem"
          ref="listItem"
          v-loading="loading"
          element-loading-text="加载中"
        >
          <el-table-column type="index" label="序号" width="60">
            <template slot-scope="scope">
              <span>{{ (curPage - 1) * limit + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="appName"
            label="应用名称"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <img :src="'data:image/jpg;base64,' + scope.row.appIcon" />
              <el-tooltip
                effect="dark"
                :content="scope.row.appName"
                placement="top-start"
              >
                <span style="margin-left:7px">{{ scope.row.appName }} </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="appFileName" label="文件名称">
          </el-table-column>
          <el-table-column
            prop="appPath"
            label="文件key"
            v-if="false"
          ></el-table-column>
          <el-table-column prop="appVersion" label="应用版本"></el-table-column>
          <!--   <el-table-column
            prop="createTime"
            label="创建时间"
            :show-overflow-tooltip="true"
          >
          </el-table-column> -->
          <el-table-column
            prop="reinforceTaskStartTime"
            label="加固开始时间"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column props="reinforceTaskStatus" label="加固状态">
            <template slot-scope="scope">
              <span v-if="scope.row.reinforceTaskStatus === 1">待加固</span>
              <span v-if="scope.row.reinforceTaskStatus === 2">加固中</span>
              <span v-if="scope.row.reinforceTaskStatus === 3">加固成功</span>
              <span v-if="scope.row.reinforceTaskStatus === 4">加固失败</span>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="创建人"></el-table-column>
          <el-table-column prop="operate" label="操作">
            <template slot-scope="scope">
              <!--   <el-tooltip effect="dark" content="加固" placement="top-start">
                <i
                  class="el-icon-video-play playIcon"
                  @click="reinforce(scope.row.id)"
                ></i>
              </el-tooltip> -->
              <el-tooltip effect="dark" content="详细" placement="top-start">
                <i
                  class="el-icon-tickets floderIcon"
                  @click="detail(scope.row.id)"
                ></i>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="下载加固包"
                placement="top-start"
              >
                <i
                  class="el-icon-sold-out reinforcePackageIcon"
                  @click="downloadReinforcePackage(scope.row.id)"
                ></i>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="下载原包"
                placement="top-start"
              >
                <i
                  class="el-icon-download originalPackageIcon"
                  @click="downloadOriginalPackage(scope.row)"
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
      checkList: ["选中且禁用", "复选框 A"],
      curPage: 1, //当前页
      limit: 10, //每页显示的条目个数
      dataCount: 0, //总条目
      listItem: [], //调用接口获取的数据
      ruleForm: {
        appName: "",
        appFileName: "",
        appVersion: "",
        createTime: ""
      },
      addRoleFormArray: [],
      rules: {
        curPrinter1: [
          { required: true, message: "请选择加固策略", trigger: "blur" }
        ],
        curPrinter2: [
          { required: true, message: "是否多渠道打包", trigger: "blur" }
        ],
        curPrinter3: [{ required: true, message: "是否签名", trigger: "blur" }],
        curPrinter4: [
          { required: true, message: "请选择多渠道打包策略", trigger: "blur" }
        ],
        curPrinter5: [
          { required: true, message: "请选择签名策略", trigger: "blur" }
        ],
        radio1: [
          { required: true, message: "是否多渠道打包", trigger: "blur" }
        ],
        radio2: [{ required: true, message: "是否签名", trigger: "blur" }],
        //^[A-Fa-f0-9]+$
        signMd5Items: [
          { required: true, message: "请输入签名" },
          {
            pattern: /^[A-Fa-f0-9]+$/,
            message: "长度32位,仅支持数字、字母a-f,不区分大小写",
            trigger: ["blur", "change"]
          }
        ]
      },
      dateValue: "",
      addTaskDrawer: false,
      percentage: 0, //存放上传的百分比
      uploadFileItems: [],
      uploadShow: true,
      strategyOptions: [],
      channelPackOptions: [],
      reinforceDetailDrawer: false,
      //加固报告
      ReinforcePackageDrawer: false,
      exportLoading: false,
      xx: null,
      appReportQuery: {
        appReportFormat: "1"
      },
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
      ReinforcePackageData: null,
      riginalPackageData: null,
      label: "",
      strategyItemDto: [],
      loading: false,
      reinforceItemData: [],
      defaultProps: {
        children: "children",
        label: "reinforceItemName"
      },
      Array: null, //测试
      radio: 1, //测试
      radioItem: [],
      checkedItem: []
    };
  },
  inject: ["reload"],
  methods: {
    //测试
    handleCheckChange() {
      let res = [];
      this.Array = { reinforceItemList: [] };
      this.$refs.tree.forEach((v, i) => {
        let res = v.getCheckedKeys();
        this.Array.reinforceItemList.push(res);
      });
      console.log(
        this.Array.reinforceItemList[0],
        this.Array.reinforceItemList[1]
      );
    },

    addSignature(index) {
      let signMd5Items = this.addRoleFormArray[index].signMd5Items;
      let regularResult = /^\d{32}[A-Fa-f0-9]+$/.test(signMd5Items);
      console.log(signMd5Items.length);
      if (!regularResult) {
        this.$message.error("长度32位,仅支持数字、字母a-f,不区分大小写");
        console.log("难道时执行这个了吗");
      } else {
        console.log(signMd5Items, "1111");
        signMd5Items.push("");
        console.log(signMd5Items, "嘻嘻");
      }
    },
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
        queryInfo = { appName, appVersion },
        _this = this;
      _this.loading = true;
      this.getData(queryInfo);
      setTimeout(function() {
        _this.loading = false;
      }, 500);
    },
    //新增加固任务
    add() {
      this.addTaskDrawer = true;
    },
    //保存加固任务
    saveaddTask(formName, form) {
      let baseUrl = this.api.baseUrl,
        _this = this,
        taskList = this.addRoleFormArray,
        allValid = true;
      console.log(taskList, "哈哈");
      taskList.forEach((v, i) => {
        this.$refs["addRoleForm"][i].validate(valid => {
          if (valid) {
          } else {
            console.log("必选项没填");
            allValid = false;
            return false;
          }
        });
      });
      if (allValid) {
        const reinforceInfoDto = taskList.map((formItem, index) => {
          const curFileItem = _this.uploadFileItems[index];
          const checkedNodes = _this.Array.reinforceItemList[index];
          console.log(formItem, "有啥数据");
          const result = {
            appName: curFileItem.appName,
            appIcon: curFileItem.appIcon,
            appPackage: curFileItem.appPackage,
            appPath: curFileItem.appPath,
            appSize: curFileItem.appSize,
            appVersion: curFileItem.appVersion,
            md5: curFileItem.md5,
            reinforceStrategyId: formItem.curPrinter1,
            channelStrategyId: formItem.curPrinter4,
            signStrategyId: formItem.curPrinter5,
            strategyItemDto: { reinforceItemList: checkedNodes }
            /* ...curFileItem,
            ...formItem */
          };
          return result;
        });
        console.log("#reinforceInfoDto", reinforceInfoDto);
        https
          .fetchPost(
            baseUrl + "/api/reinforce/info/saveReinforceInfoOrUpdate",
            reinforceInfoDto
          )
          .then(res => {
            const _this = this;
            if (res.data.code == "00") {
              this.addTaskDrawer = false;
              this.$notify({
                title: "成功",
                message: "新增任务成功",
                type: "success"
              });
              _this.reload();
            }
          });
      } else {
        return "";
      }
    },
    //取消加固任务
    cancelSaveaddTask() {
      if (this.uploadFileItems.length !== 0) {
        this.$confirm("会清空当前上传的文件,是否继续?", "提示", {
          closeOnClickModal: false,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.addTaskDrawer = false;
            this.$refs.upload.clearFiles();
            this.reload();
          })
          .catch(() => {
            console.log("取消");
          });
      } else {
        this.addTaskDrawer = false;
      }
    },
    //加固
    reinforce(id) {
      console.log(id);
      let baseUrl = this.api.baseUrl;
      https
        .fetchGet(baseUrl + "/api/reinforce/info/startReinforce", {
          reinforceInfoId: id
        })
        .then(res => {
          this.$notify({
            title: "成功",
            message: "启动成功！",
            type: "success"
          });
          this.reload();
        });
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
          const _this = this;
          if (res.data.code === "01") {
            _this.$notify({
              title: "警告",
              message: res.data.message,
              type: "warning"
            });
            _this.addTaskDrawer = false;
            _this.$refs.upload.clearFiles();
          }
          if (res.data.code === "99") {
            _this.$notify({
              title: "警告",
              message: res.data.message,
              type: "warning"
            });
            _this.addTaskDrawer = false;
            _this.$refs.uploadc.clearFiles();
          }
          if (res.data.code === "00") {
            if (res.data.data) {
              let data = res.data.data;
              this.addRoleFormArray.push({
                curPrinter1: "",
                curPrinter2: "",
                curPrinter3: "",
                curPrinter4: "",
                curPrinter5: "",
                radio1: "",
                radio2: "",
                strategyItemDto: {},
                strategyItemDtoTest: [],
                radioTest: "1",
                signMd5Items: []
              });
              this.uploadFileItems.push(data);
              console.log(this.addRoleFormArray, "表单里面的数据");
              for (var i = 0; i < this.uploadFileItems.length; i++) {
                this.activeNames.push(i + 1);
                this.activeNames = Array.from(new Set(this.activeNames));
              }
              this.uploadShow = false;
            }
          }
        });
    },
    //上传结束---
    //
    //详情
    detail(id) {
      this.$router.push({ path: "/Detail" + id + "" });
    },
    //下载原包
    downloadOriginalPackage(data) {
      let appkey = data.appPath;
      let baseUrl = this.api.baseUrl,
        Authorization = localStorage.getItem("Authorization"),
        downloadUrl =
          baseUrl +
          "/api/reinforce/info/download/" +
          appkey +
          "?Authorization=" +
          Authorization;
      window.location.href = downloadUrl;
    },
    //下载加固包
    downloadReinforcePackage(id) {
      let baseUrl = this.api.baseUrl,
        Authorization = localStorage.getItem("Authorization");
      let downloadUrl =
        baseUrl +
        "/api/reinforce/info/downloadPackage/?reinforceInfoId=" +
        id +
        "&type=1&Authorization=" +
        Authorization;
      console.log(downloadUrl, "哈哈");
      window.location.href = downloadUrl;
    },
    //加固策略
    strategyChange(item, index) {
      let data = this.strategyOptions.filter(val => {
        return val["reinforce_describe"] == item;
      });
      this.strategyItemDto = data;
    },
    //是否多渠道打包
    channelPackChange(item) {
      let baseUrl = this.api.baseUrl;
      if (item == "是") {
        https
          .fetchPost(
            baseUrl + "/api/channel/strategy/findChannelStrategyByPage",
            { limit: 20, pn: 1 }
          )
          .then(res => {
            this.channelPackList = res.data.data.items;
          });
      } else {
        console.log("不做操作");
      }
    },
    //是否签名
    signatureChange(item) {
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
  beforeMount() {
    this.getData();
  },
  mounted() {
    let baseUrl = this.api.baseUrl;
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
      });
    //查询渠道策略分页列表 是否多渠道打包
    https
      .fetchPost(baseUrl + "/api/channel/strategy/findChannelStrategyByPage", {
        pn: 1,
        limit: 20
      })
      .then(res => {
        /*  console.log(res.data.data.items, "-----"); */
      });
    //查询签名列表 签名策略列表
    https
      .fetchPost(baseUrl + "/api/reinforce/sign/page", { pn: 1, limit: 20 })
      .then(res => {});
    //查询加固项tree
    https
      .fetchPost(baseUrl + "/api/reinforce/item/findReinforceItemTree", {
        reinforceItem: {}
      })
      .then(res => {
        this.reinforceItemData = res.data.data;
        this.reinforceItemData.forEach((v, i) => {
          if (v.children) {
            this.checkedItem.push(v);
          } else {
            this.radioItem.push(v);
          }
        });
        console.log(this.radioItem, "单选列表", this.checkedItem, "多选列表");
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
.reinfore .el-collapse-item__header.is-active {
  font-weight: 700;
  font-size: 16px;
}
.reinforeBody {
  width: 99%;
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
.floderIcon,
.reinforcePackageIcon,
.originalPackageIcon {
  font-size: 22px;
  color: #409eff;
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
  width: 100% !important;
  height: 230px !important;
  margin-top: 20px !important;
}
.el-drawer-content .el-collapse {
  margin-top: 10px;
  border-top: none !important;
  border-bottom: none !important;
}
.el-drawer-content .el-collapse .el-row {
  /*  padding: 20px 0; */
  text-align: justify;
}
.el-drawer-content .el-collapse .password .el-input__inner {
  border: none;
}
.reinforceItem {
  margin-top: 10px;
}
.addApplicationForm {
  padding: 20px;
  font-size: 14px;
  border: none;
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
  width: 55%;
  border-radius: 15px;
  margin: 30px 35px 0 0;
  vertical-align: middle;
}
.addApplicationForm .el-row:first-child p {
  line-height: 36px;
  color: #606266;
  margin: 10px 0;
}
.addApplicationForm .el-row .el-form-item {
  margin: 10px 0;
}
.addApplicationForm .appName {
  line-height: 40px;
  font-size: 16px;
  color: #333;
  font-weight: 700;
}
.searchBox {
  margin-bottom: 15px;
  display: flex;
}
.reinforeBase {
  margin-top: 20px;
}
.reinfore .operateBox {
  margin-left: 20px;
}
.el-table {
  font-size: 12px;
  border: 1px solid #dcdee2 !important;
  border-bottom: 1px solid transparent !important;
}
.el-table thead {
  color: #515a6e !important;
  font-size: 12px !important;
}
.el-table__header-wrapper {
  background: #f8f8f9;
}
.el-table__header-wrapper th {
  background: #f2f5f7 !important;
}
.el-table__body-wrapper span {
  font-size: 12px !important;
}
.el-table .cell {
  font-size: 12px;
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
