<template>
  <div class="reinforceStrategy">
    <div class="reinforceStrategyHeader">
      <p>当前位置:加固策略</p>
    </div>
    <!-- 查询 -->
    <div class="searchForm">
      <div class="searchBox">
        <el-form :model="ruleForm" ref="ruleForm">
          <el-input
            placeholder="请输入策略名称"
            size="small"
            v-model="ruleForm.strategyName"
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
        <el-button type="primary" size="small" @click="createStrategy()"
          >新建策略</el-button
        >
        <!-- 新建策略Drawer开始 -->
        <el-drawer
          title="新建策略"
          :visible.sync="createStrategyDrawer"
          :with-header="false"
          :wrapperClosable="false"
          :close-on-press-escape="false"
          :destroy-on-close="true"
          ref="createStrategyDrawer"
          size="40%"
        >
          <div class="el-drawer-header">
            <h3>新建策略</h3>
          </div>
          <div class="el-drawer-content">
            <el-upload
              class="upload"
              drag
              action="/"
              :http-request="createStrategyFile"
              :file-list="createStrategyFileItem"
              accept=".apk"
              ref="createStrategyUpload"
              v-show="createStrategyUploadShow"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处,或<em>点击上传</em>
              </div>
              <div class="el-upload_tip" slot="tip">点击上传.apk文件</div>
            </el-upload>
            <!--创建策略的列表 -->
            <div v-for="(item, index) in createStrategyFileItem" :key="index">
              <el-form
                :model="strategyItemForm"
                class="strategyItemForm"
                :rules="rules"
                ref="strategyItemForm"
              >
                <!-- 上传文件的信息 -->
                <div class="strategyItem">
                  <h3 class="strategyItemTitle">应用信息</h3>
                  <div class="strategyItemContent">
                    <el-row>
                      <el-col :span="6">
                        <img
                          :src="'data:image/jpg;base64,' + item.data.appIcon"
                        />
                      </el-col>
                      <el-col :span="18">
                        <p class="appName">{{ item.data.appName }}</p>
                        <p class="appPackage">
                          包名:&nbsp;&nbsp;{{ item.data.appPackage }}
                        </p>
                        <p>
                          <span style="margin-right:10px"
                            >版本:&nbsp;&nbsp;{{ item.data.appVersion }}</span
                          >
                          <span
                            >大小:&nbsp;&nbsp;{{ item.data.appMbSize }}MB</span
                          >
                        </p>
                        <el-form-item label="策略名称" prop="strategyName">
                          <el-input
                            size="small"
                            style="width:50%"
                            v-model="strategyItemForm.strategyName"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </div>
                <!-- 配置策略 -->
                <div class="strategyItem">
                  <h3 class="strategyItemTitle">配置策略</h3>
                  <div class="strategyItemContent">
                    <el-form-item
                      v-for="strategyItem in strategyItemData"
                      :key="strategyItem.id"
                      :label="strategyItem.reinforceItemName"
                      label-width="22%"
                    >
                      <!-- 有子选项 -->
                      <template v-if="strategyItem.children">
                        <template
                          v-if="strategyItem.reinforceItemName == '防篡改'"
                        >
                          <el-checkbox-group
                            v-model="strategyItemForm.tamperChoiceItem"
                            :min="0"
                            :max="1"
                          >
                            <el-checkbox
                              v-for="strategySubItem in strategyItem.children"
                              :key="strategySubItem.id"
                              :label="strategySubItem.id"
                              @change="
                                checked =>
                                  handleCheckedChange(
                                    checked,
                                    'falsify',
                                    '',
                                    strategyItem.id
                                  )
                              "
                              >{{
                                strategySubItem.reinforceItemName
                              }}</el-checkbox
                            >
                          </el-checkbox-group>
                        </template>
                        <template v-else>
                          <el-checkbox-group
                            v-model="strategyItemForm.choiceItem"
                          >
                            <el-checkbox
                              v-for="strategySubItem in strategyItem.children"
                              :key="strategySubItem.id"
                              :label="strategySubItem.id"
                              :disabled="strategySubItem.isCancel == 2"
                              :checked="strategySubItem.isChecked == 1"
                              >{{
                                strategySubItem.reinforceItemName
                              }}</el-checkbox
                            >
                          </el-checkbox-group>
                        </template>
                      </template>
                      <!-- 没有子选项 -->
                      <template v-else>
                        <!-- 启用签名MD5 -->
                        <el-checkbox-group
                          v-model="strategyItemForm.choiceItem"
                          v-if="
                            strategyItem.reinforceItemName == '自定义签名MD5'
                          "
                        >
                          <el-checkbox
                            :label="strategyItem.id"
                            :disabled="strategyItem.isCancel == 2"
                            :checked="strategyItem.isChecked == 1"
                            @change="
                              checked =>
                                handleCheckedChange(
                                  checked,
                                  'MD5',
                                  item.keyTreeData[0].signMd5Value
                                )
                            "
                            >启用</el-checkbox
                          >
                        </el-checkbox-group>
                        <!-- 启用SO高级加固 -->
                        <el-checkbox-group
                          v-model="strategyItemForm.choiceItem"
                          v-else-if="
                            strategyItem.reinforceItemName == 'SO高级加固'
                          "
                        >
                          <el-checkbox
                            :label="strategyItem.id"
                            :disabled="strategyItem.isCancel == 2 || soDisabled"
                            :checked="strategyItem.isChecked == 1"
                            @change="
                              checked => handleCheckedChange(checked, 'SO', '')
                            "
                            >启用</el-checkbox
                          >
                        </el-checkbox-group>
                        <!-- 启用H5文件加固 -->
                        <el-checkbox-group
                          v-model="strategyItemForm.choiceItem"
                          v-else-if="
                            strategyItem.reinforceItemName == 'H5文件加固'
                          "
                        >
                          <el-checkbox
                            :label="strategyItem.id"
                            :disabled="strategyItem.isCancel == 2 || h5Disabled"
                            :checked="strategyItem.isChecked == 1"
                            @change="
                              checked => handleCheckedChange(checked, 'H5', '')
                            "
                            >启用</el-checkbox
                          >
                        </el-checkbox-group>
                        <el-checkbox-group
                          v-else
                          v-model="strategyItemForm.choiceItem"
                        >
                          <el-checkbox
                            :label="strategyItem.id"
                            :disabled="strategyItem.isCancel == 2"
                            :checked="strategyItem.isChecked == 1"
                            >启用</el-checkbox
                          >
                        </el-checkbox-group>
                      </template>
                      <!-- 自定义签名MD5 -->
                      <template
                        v-if="
                          strategyItem.reinforceItemName == '自定义签名MD5' &&
                            strategyItemForm['MD5'] == true
                        "
                      >
                        <el-form-item label="签名MD5">
                          <template v-if="!strategyItemForm.addSignatureClick">
                            <el-input
                              size="small"
                              clearable
                              maxLength="32"
                              style="width:55%"
                              v-model="item.keyTreeData[0].signMd5Value"
                            ></el-input>
                            <el-button
                              type="text"
                              @click="
                                addSignature(item.keyTreeData[0].signMd5Value)
                              "
                              >添加</el-button
                            >
                          </template>
                          <template v-if="strategyItemForm.addSignatureClick">
                            <el-input
                              size="small"
                              clearable
                              maxLength="32"
                              style="width:55%"
                              v-model="strategyItemForm.signMd5Items[0].value"
                            ></el-input>
                            <el-button
                              type="text"
                              @click="
                                addSignature(
                                  strategyItemForm.signMd5Items[0].value
                                )
                              "
                              >添加</el-button
                            >
                          </template>
                        </el-form-item>
                        <el-form-item
                          v-for="(addSignatureItem,
                          addSignatureIndex) in strategyItemForm.signMd5Items"
                          :key="addSignatureIndex"
                          v-show="addSignatureIndex"
                          style="margin-left:70px"
                        >
                          <el-input
                            size="small"
                            style="width:55%"
                            clearable
                            maxlength="32"
                            :disabled="true"
                            v-model="addSignatureItem.value"
                          ></el-input>
                          <el-button
                            type="text"
                            @click="
                              deleteSignature(
                                addSignatureItem,
                                addSignatureIndex
                              )
                            "
                            >删除</el-button
                          >
                        </el-form-item>
                      </template>
                      <!-- SO高级加固 -->
                      <template
                        v-if="
                          strategyItem.reinforceItemName == 'SO高级加固' &&
                            strategyItemForm['SO'] == true
                        "
                      >
                        <el-tree
                          :data="item.keyTreeData[0].soItems"
                          show-checkbox
                          node-key="label"
                          ref="soTree"
                          @check-change="getSoCheckedNodes()"
                        ></el-tree>
                      </template>
                      <!-- H5文件加固 -->
                      <template
                        v-if="
                          strategyItem.reinforceItemName == 'H5文件加固' &&
                            strategyItemForm['H5'] == true
                        "
                      >
                        <el-tree
                          :data="item.keyTreeData[0].h5Items"
                          show-checkbox
                          node-key="label"
                          ref="h5Tree"
                          @check-change="getH5CheckedNodes()"
                        ></el-tree>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            </div>
            <div class="el-drawer-footer">
              <el-button
                type="primary"
                @click="saveStrategy()"
                :disabled="!saveStrategyBox"
                >保存</el-button
              >
              <el-button @click="cancelStrategy()" plain>取消</el-button>
            </div>
          </div>
        </el-drawer>
        <!-- 新增策略Drawer结束 -->
        <!-- 修改策略Drawer开始 -->
        <el-drawer
          title="修改策略"
          :visible.sync="amendStrategyDrawer"
          :with-header="false"
          :wrapperClosable="false"
          :close-on-press-escape="false"
          :destroy-on-close="true"
          ref="amendStrategyDrawer"
          size="40%"
        >
          <div class="el-drawer-header">
            <h3>修改策略</h3>
          </div>
          <div class="el-drawer-content"></div>
          <div class="el-drawer-footer">
            <el-button type="primary" @click="amendStrategy()">修改</el-button>
            <el-button @click="cancelAmendStrategy()" plain>取消</el-button>
          </div>
        </el-drawer>
        <!-- 修改策略Drawer结束 -->
        <!-- 策略详细Drawer开始 -->
        <el-drawer
          title="策略详情"
          :visible.sync="strategyDetailDrawer"
          :with-header="false"
          :wrapperClosable="false"
          :close-on-press-escape="false"
          :destroy-on-close="true"
          ref="strategyDetailDrawer"
          size="40%"
          class="strategyDetailDrawer"
        >
          <div class="el-drawer-header">
            <h3>策略详情</h3>
          </div>
          <div class="el-drawer-content">
            <!-- 策略详情-应用信息 -->
            <el-form :model="strategyDetailForm" class="strategyDetailForm">
              <div class="strategyName" style="height:200px;">
                <h3 class="strategyNameTitle">
                  <span>应用信息</span>
                </h3>
                <div class="strategyNameContent">
                  <el-row v-if="strategyDetailItem">
                    <el-col :span="6">
                      <img
                        :src="
                          'data:image/jpg;base64,' +
                            strategyDetailItem['reinforceInfo'].appIcon
                        "
                      />
                    </el-col>
                    <el-col :span="18">
                      <p class="appName">
                        {{ strategyDetailItem["reinforceInfo"].appName }}
                      </p>
                      <p class="appPackage">
                        包名:&nbsp;&nbsp;
                        {{ strategyDetailItem["reinforceInfo"].appPackage }}
                      </p>
                      <p>
                        <span style="margin-right:10px;">
                          版本:&nbsp;&nbsp;{{
                            strategyDetailItem["reinforceInfo"].appVersion
                          }}
                        </span>
                        <span
                          >大小:&nbsp;&nbsp;{{
                            strategyDetailItem["reinforceInfo"].appMbSize
                          }}</span
                        >
                      </p>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div class="strategyName">
                <h3 class="strategyNameTitle">
                  <span>配置策略</span>
                </h3>
                <div class="strategyNameContent">
                  <el-form-item
                    v-for="strategyItem in strategyItemData"
                    :key="strategyItem.id"
                    :label="strategyItem.reinforceItemName"
                    label-width="22%"
                  >
                    <!-- 有子选项 -->

                    <template v-if="strategyItem.children">
                      <el-checkbox
                        v-for="strategySubItem in strategyItem.children"
                        :key="strategySubItem.id"
                        :label="strategySubItem.id"
                        :disabled="true"
                        :checked="strategySubItem.isChecked == 1"
                        >{{ strategySubItem.reinforceItemName }}
                      </el-checkbox>
                    </template>
                    <!-- 没有子选项 -->
                    <template v-else>
                      <el-checkbox
                        :label="strategyItem.id"
                        :disabled="true"
                        :checked="strategyItem.isChecked == 1"
                        >启用</el-checkbox
                      >
                    </template>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
          <div class="el-drawer-footer">
            <el-button plain @click="cancelstrategyDetail()">取消</el-button>
          </div>
        </el-drawer>
      </div>
    </div>
    <!-- 表格内容 -->
    <div class="reinforceStrategyBody">
      <template>
        <el-table
          :data="listItem"
          element-loading-text="加载中"
          v-loading="loading"
        >
          <el-table-column type="index" label="序号">
            <template slot-scope="scope">
              <span>{{ (curPage - 1) * limit + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="reinforce_strategy_name"
            label="策略名称"
          ></el-table-column>
          <el-table-column
            prop="reinforce_strategy_count"
            label="策略数量"
          ></el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间"
          ></el-table-column>
          <el-table-column prop="user_name" label="创建人"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="修改" placement="top-start">
                <i
                  class="el-icon-edit-outline editIcon"
                  @click="amendStrategy(scope.row.id)"
                ></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="详细" placement="top-start">
                <i
                  class="el-icon-tickets floderIcon"
                  @click="strategyDetail(scope.row.id)"
                ></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top-start">
                <i
                  class="el-icon-delete deleteIcon"
                  @click="deleteStrategy(scope.row.id)"
                ></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!-- 表格底部 分页 -->
    <div class="reinforceStrategyBase">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrenChange"
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
  name: "reinforceStrategy",
  data() {
    return {
      ruleForm: {
        strategyName: ""
      },
      curPage: 1,
      limit: 10,
      dataCount: 0,
      listItem: [],
      loading: false,
      createStrategyDrawer: false,
      amendStrategyDrawer: false,
      strategyDetailDrawer: false,
      strategyItemForm: {
        strategyName: "",
        signMd5Items: [{ value: "" }],
        tamperChoiceItem: [],
        choiceItem: [],
        addSignatureClick: false,
        soItemList: []
      },
      rules: {
        strategyName: [
          { required: true, message: "请输入策略名称", trigger: "blur" }
        ]
      },
      createStrategyFileItem: [],
      createStrategyUploadShow: true,
      strategyItemData: [],
      h5Disabled: false,
      soDisabled: false,
      md5Checked: false,
      soChecked: false,
      saveStrategyBox: false,
      strategyDetailForm: {},
      strategyDetailItem: null
    };
  },
  inject: ["reload"],
  beforeMount() {
    let _this = this,
      baseUrl = _this.api.baseUrl;
    _this.getData();
    https
      .fetchPost(baseUrl + "/api/reinforce/item/findReinforceItemTree", {
        reinforceItem: {}
      })
      .then(res => {
        if (res.data.code === "00") {
          _this.strategyItemData = res.data.data;
        }
      });
  },
  mounted() {},
  methods: {
    //获取列表数据
    getData(queryInfo) {
      let baseUrl = this.api.baseUrl;
      https
        .fetchPost(baseUrl + "/api/reinforce/strategy/page", {
          pn: this.curPage,
          limit: this.limit,
          queryInfo
        })
        .then(res => {
          if (res.data.code === "00") {
            let data = res.data.data;
            this.listItem = data.items;
            this.dataCount = data.count;
          }
        });
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getData();
    },
    handleCurrenChange(val) {
      this.curPage = val;
      this.getData();
    },
    search() {
      let _this = this,
        reinforceStrategyName = _this.ruleForm.strategyName,
        queryInfo = { reinforceStrategyName };
      _this.loading = true;
      _this.getData(queryInfo);
      setTimeout(function() {
        _this.loading = false;
      }, 500);
    },
    refresh() {
      this.reload();
    },
    //创建策略
    createStrategy() {
      this.createStrategyDrawer = true;
    },
    //上传策略开始
    createStrategyFile(file) {
      let params = new FormData(),
        baseUrl = this.api.baseUrl,
        _this = this;
      params.append("file", file.file);
      //进度条配置
      let config = {
        onUploadProgress: ProgressEvent => {
          let progressEvent =
            ((ProgressEvent.loaded / ProgressEvent.total) * 100) | 0;
          file.onProgress({ percent: progressEvent });
        }
      };
      https
        .uploadFile(
          baseUrl + "/api/reinforce/info/uploadReinforceFile",
          params,
          config
        )
        .then(res => {
          if (
            res.data.code === "01" ||
            res.data.code === "99" ||
            res.data.code === "500"
          ) {
            _this.$notify({
              title: "警告",
              message: res.data.message,
              type: "warning",
              duration: 1000
            });
            _this.createStrategyDrawer = false;
            _this.$refs.createStrategyUpload.clearFiles();
          }
          if (res.data.code === "00") {
            _this.createStrategyUploadShow = false;
            _this.saveStrategyBox = true;
            let data = res.data.data,
              keyData = data.appPath,
              keyTreeData = [];
            let dataItem = { data, keyTreeData };
            //得到签名MD5,SO,h5
            https
              .fetchGet(
                baseUrl + "/api/reinforce/info/parseApkInfoByFileKey/" + keyData
              )
              .then(res => {
                if (res.data.code == "00") {
                  let data = res.data.data;
                  if (data.soItems.length == 0) {
                    _this.soDisabled = true;
                  }
                  if (data.h5Items.length == 0) {
                    _this.h5Disabled = true;
                  }
                  _this.createStrategyFileItem.push(dataItem);
                  keyTreeData.push(data);
                }
              });
          }
        });
    },
    //上传策略结束
    //勾选启用
    handleCheckedChange(checked, checkboxType, value, id) {
      const _this = this,
        strategyItemForm = _this.strategyItemForm;
      strategyItemForm[checkboxType] = checked;
      if (checkboxType === "falsify") {
        if (checked) {
          if (id) {
            strategyItemForm.choiceItem.push(id);
          }
        } else {
          strategyItemForm.choiceItem = strategyItemForm.choiceItem.filter(
            v => v != 3
          );
        }
      }
      if (checkboxType === "MD5") {
        strategyItemForm.md5Checked = checked;
        strategyItemForm.addSignatureClick = false;
        if (!checked) {
          strategyItemForm.signMd5Items = [];
        } else {
          strategyItemForm.signMd5Items = [{ value }];
        }
      } else if (checkboxType === "SO") {
        strategyItemForm.soChecked = checked;
      } else if (checkboxType === "H5") {
        strategyItemForm.h5Checked = checked;
      }
    },
    //得到SO选中的值
    getSoCheckedNodes() {
      const _this = this;
      _this.$refs.soTree.forEach((v, i) => {
        let result = v.getCheckedNodes().map(v => v.value);
        _this.strategyItemForm.soItemList = result;
      });
    },
    //得到H5选中的值
    getH5CheckedNodes() {
      const _this = this;
      _this.$refs.h5Tree.forEach((v, i) => {
        let result = v.getCheckedNodes().map(v => v.value);
        _this.strategyItemForm.h5ItemList = result;
      });
    },
    //添加签名
    addSignature(value) {
      let strategyItemForm = this.strategyItemForm;
      strategyItemForm.addSignatureClick = true;
      let regularResult = /^[A-Fa-f0-9]{32}$/.test(value);
      if (regularResult) {
        strategyItemForm.signMd5Items.push({ value: "" });
        strategyItemForm.signMd5Items[0].value = value;
        strategyItemForm.signMd5Items.reverse();
      } else {
        this.$message.error("长度32位,仅支持数字和字母A-F,不区分大小写");
      }
    },
    //删除签名
    deleteSignature(addSignatureItem, addSignatureIndex) {
      let strategyItemForm = this.strategyItemForm;
      if (strategyItemForm.signMd5Items.indexOf(addSignatureItem) > -1) {
        strategyItemForm.signMd5Items.splice(addSignatureIndex, 1);
      }
    },
    //取消保存策略
    cancelStrategy() {
      this.createStrategyDrawer = false;
      this.$refs.createStrategyUpload.clearFiles();
      this.reload();
    },

    //保存创建的策略
    saveStrategy() {
      let _this = this,
        baseUrl = _this.api.baseUrl,
        taskList = _this.strategyItemForm,
        allValid = true;
      _this.$refs["strategyItemForm"][0].validate(valid => {
        if (valid) {
        } else {
          allValid = false;
          return false;
        }
      });
      if (taskList.soChecked) {
        if (taskList.soItemList.length) {
        } else {
          _this.$message.error("请选择SO文件");
          allValid = false;
        }
      }
      if (taskList.h5Checked) {
        if (taskList.h5ItemList.length) {
        } else {
          _this.$message.error("请选择H5文件");
          allValid = false;
        }
      }
      if (taskList.md5Checked) {
        let md5Value = taskList.signMd5Items[0].value,
          regularResult = /^[A-Fa-f0-9]{32}$/.test(md5Value);
        if (md5Value) {
          if (regularResult) {
          } else {
            this.$message.error("长度32位,仅支持数字和字母A-F,不区分大小写");
            allValid = false;
          }
        }
      }

      //必填项都已经填写
      if (allValid) {
        let _this = this,
          strategyItemForm = _this.strategyItemForm,
          createStrategyFileItem = _this.createStrategyFileItem[0].data,
          signMd5ItemsData = [];
        if (strategyItemForm.h5ItemList) {
          strategyItemForm.h5ItemList = strategyItemForm.h5ItemList.filter(
            v => {
              return v != "";
            }
          );
        }
        if (strategyItemForm.soItemList) {
          strategyItemForm.soItemList = strategyItemForm.soItemList.filter(
            v => {
              return v != "";
            }
          );
        }
        strategyItemForm.signMd5Items = strategyItemForm.signMd5Items.filter(
          v => {
            return v.value != "";
          }
        );
        strategyItemForm.signMd5Items.forEach((v, i) => {
          signMd5ItemsData.push(v.value);
        });
        strategyItemForm.choiceItem = strategyItemForm.choiceItem
          .concat(strategyItemForm.tamperChoiceItem, 22)
          .filter(v => {
            return v != "";
          });
        let reinforceInfo = {
          appName: createStrategyFileItem.appName,
          appIcon: createStrategyFileItem.appIcon,
          appPackage: createStrategyFileItem.appPackage,
          appFileName: createStrategyFileItem.appFileName,
          appPath: createStrategyFileItem.appPath,
          appSize: createStrategyFileItem.appSize,
          appVersion: createStrategyFileItem.appVersion
        };
        let strategyItemDto = {
          reinforceStrategyName: strategyItemForm.strategyName,
          reinforceItemList: strategyItemForm.choiceItem,
          h5ItemList: strategyItemForm.h5ItemList,
          soItemList: strategyItemForm.soItemList,
          signMd5Items: signMd5ItemsData,
          reinforceInfo
        };
        https
          .fetchPost(
            baseUrl + "/api/reinforce/strategy/saveOrUpdateStrategy",
            strategyItemDto
          )
          .then(res => {
            if (res.data.code == "00") {
              _this.createStrategyDrawer = false;
              _this.$notify({
                title: "成功",
                message: "新增策略成功",
                type: "success"
              });
              _this.reload();
            }
            console.log(res);
          });
      }
    },
    //修改策略
    amendStrategy(id) {
      let baseUrl = this.api.baseUrl,
        strategyItemForm = this.strategyItemForm;
      /* strategyItemDto = { id, reinforceItemList }; */
      this.amendStrategyDrawer = true;
      console.log(strategyItemForm);
      /*    https
        .fetchPost(baseUrl + "/api/reinforce/strategy/saveOrUpdateStrategy", {
          id
        })
        .then(res => {
          console.log(res);
        }); */
    },
    //取消修改策略
    cancelAmendStrategy() {
      this.amendStrategyDrawer = false;
    },
    //策略详细
    strategyDetail(id) {
      this.strategyDetailDrawer = true;
      let baseUrl = this.api.baseUrl;
      https
        .fetchGet(baseUrl + "/api/reinforce/strategy/getStrategyDetail", {
          id
        })
        .then(res => {
          if (res.data.code === "00") {
            this.strategyDetailItem = res.data.data;
            console.log(this.strategyDetailItem.reinforceItemList, "哈哈");
          }
        });
    },
    //取消查看策略详细
    cancelstrategyDetail() {
      this.strategyDetailDrawer = false;
    },
    //删除策略
    deleteStrategy() {}
  }
};
</script>
<style>
.reinforceStrategyHeader {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}
.reinforceStrategy .searchForm {
  display: flex;
}
.reinforceStrategy .searchForm .operateBox {
  margin-left: 20px;
}
.reinforceStrategy .el-drawer {
  overflow-y: auto;
}
.reinforceStrategy .el-drawer-header {
  width: 100%;
  position: fixed;
  background: white;
  z-index: 99;
  height: 50px;
  padding: 17px 20px;
  border-bottom: 1px solid #ebebeb;
}
.reinforceStrategy .el-drawer-header h3 {
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
.reinforceStrategy .el-drawer-content {
  margin-top: 50px;
  position: relative;
  overflow: auto;
  padding: 0px 20px 40px 20px;
}
.reinforceStrategyBody {
  margin-top: 20px;
}
.editIcon,
.floderIcon,
.deleteIcon {
  font-size: 22px;
  color: #409eff;
  margin-right: 10px;
  cursor: pointer;
}
.reinforceStrategyBody .el-table {
  font-size: 12px;
  border: 1px solid #dcdee2;
  border-bottom: 1px solid transparent !important;
}
.reinforceStrategyBody .el-table thead {
  color: #515a6a;
}
.reinforceStrategyBody .el-table__header-wrapper {
  background: #f8f8f9 !important;
}
.reinforceStrategyBase .paginationBox {
  margin-top: 20px;
}
.reinforceStrategy .el-drawer-footer {
  text-align: right;
  width: 100%;
  background: white;
  z-index: 9;
  padding: 10px 20px;
  border-top: 1px solid #ebebeb;
}
.strategyItemForm {
  margin-top: 20px;
}
.strategyItemForm .el-row:first-child p,
.strategyDetailForm .el-row:first-child p {
  line-height: 36px;
  color: #606266;
  margin: 10px 0;
}
.strategyItemForm .strategyItemTitle {
  font-weight: 700;
  font-size: 16px;
}
.strategyItemForm .appName,
.strategyDetailForm .appName {
  line-height: 40px;
  font-size: 16px;
  color: #333;
  font-weight: 700;
}
.strategyItemForm .appInfo,
.strategyDetailForm .appInfo {
  display: flex;
  margin: 30px 0;
}
.strategyItemForm img,
.strategyDetailForm img {
  width: 55%;
  border-radius: 15px;
  margin: 30px 35px 0 0;
  vertical-align: middle;
}
.reinforceStrategy .el-form-item__label {
  text-align: left;
}
.strategyItemForm .strategyItemContent {
  margin-top: 10px;
}
/* 修改策略详情Drawer */
.strategyDetailDrawer .el-drawer-content {
  padding-top: 20px;
}
.strategyDetailDrawer .strategyNameTitle {
  margin-bottom: 20px;
  position: relative;
}
.strategyDetailDrawer .strategyNameTitle span {
  margin-left: 10px;
  color: #515a6e;
  font-size: 16px;
}
.reinforceStrategy
  .el-checkbox__input.is-disabled.is-checked
  .el-checkbox__inner {
  background-color: #409eff;
  border-color: #409eff;
}
</style>
