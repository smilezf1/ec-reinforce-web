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
        <el-tooltip effect="dark" content="刷新" placement="top-start">
          <el-button
            type="primary"
            icon="el-icon-refresh-right"
            size="small"
            @click="refresh()"
            style="margin-left:10px"
          ></el-button>
        </el-tooltip>
        <el-button
          type="primary"
          size="small"
          @click="addReinforceTask()"
          style="margin-right:10px"
          >新增任务</el-button
        >
        <el-drawer
          title="新增任务"
          :visible.sync="addTaskDrawer"
          :with-header="false"
          :wrapperClosable="false"
          :close-on-press-escape="false"
          :destroy-on-close="true"
          ref="addTaskDrawer"
          size="40%"
          class="addTaskDrawer"
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
              :limit="5"
              :http-request="addFileToFormData"
              v-show="uploadShow"
              :file-list="uploadFileItems"
              :on-exceed="handleExceed"
              accept=".apk"
              ref="upload"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
            </el-upload>
            <p class="uploadTip" v-show="uploadShow">
              最多只能上传5个文件
            </p>
            <!-- 上传文件的列表 -->
            <div v-for="(item, index) in uploadFileItems" :key="item.id">
              <el-form
                :model="addRoleFormArray[index]"
                :rules="rules"
                ref="addRoleForm"
              >
                <el-collapse class="addApplicationForm" v-model="activeNames">
                  <el-collapse-item
                    title="应用信息"
                    :name="index + 1"
                    class="title"
                  >
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
                          <span style="margin-right:10px;"
                            >版本:&nbsp;&nbsp;{{ item.data.appVersion }}
                          </span>
                          <span
                            >大小:&nbsp;&nbsp;{{ item.data.appMbSize }}MB</span
                          >
                        </p>
                      </el-col>
                    </el-row>
                    <!-- 加固项 -->
                    <!-- 策略名称 -->
                    <el-row class="strategyName">
                      <el-col :span="24">
                        <p class="strategyName">
                          <el-form-item prop="curPrinter1" label-width="22%">
                            <label slot="label">加固策略:</label>
                            <template>
                              <el-select
                                v-model="addRoleFormArray[index].curPrinter1"
                                placeholder="请选择策略"
                                size="small"
                                :popper-append-to-body="false"
                                @change="
                                  strategyChange(
                                    addRoleFormArray[index].curPrinter1,
                                    index
                                  )
                                "
                              >
                                <el-option
                                  v-for="reinforceItem in item
                                    .packageTreeData[0]"
                                  :key="reinforceItem.id"
                                  :label="reinforceItem.reinforceStrategyName"
                                  :value="reinforceItem.id"
                                ></el-option>
                              </el-select>
                            </template>
                          </el-form-item>
                        </p>
                      </el-col>
                    </el-row>
                    <!--  <el-row class="strategyDescribe">
                      <el-col :span="24">
                        <p class="strategyDescribe">
                          <el-form-item
                            prop="strategyDescribe"
                            label-width="22%"
                          >
                            <label slot="label">策略描述:</label>
                            <el-input
                              placeholder="策略描述"
                              size="small"
                              style="width:59%"
                              v-model="addRoleFormArray[index].strategyDescribe"
                            ></el-input>
                          </el-form-item>
                        </p>
                      </el-col>
                    </el-row> -->
                    <el-row
                      class="reinforceItem"
                      v-if="addRoleFormArray[index].showReinforceItem"
                    >
                      <el-col :span="24">
                        <h3 style="font-size:16px">加固项</h3>
                        <div
                          class="reinforceItem"
                          v-for="checkboxItem in reinforceItemData"
                          :key="checkboxItem.id"
                        >
                          <el-form-item
                            :label="checkboxItem.reinforceItemName + ':'"
                            :label-position="labelPosition"
                            label-width="22%"
                          >
                            <template v-if="checkboxItem.children">
                              <el-checkbox-group
                                v-if="
                                  checkboxItem.reinforceItemName == '防篡改'
                                "
                                v-model="addRoleFormArray[index].tamperArray"
                                :min="0"
                                :max="1"
                              >
                                <el-checkbox
                                  v-for="subItem in checkboxItem.children"
                                  :key="subItem.id"
                                  :label="subItem.id"
                                  :disabled="
                                    subItem.isCancel == 2 ||
                                      addRoleFormArray[index].strategyType == 2
                                  "
                                  style="margin-right:8px"
                                  @change="
                                    checked =>
                                      handleCheckedChange(
                                        checked,
                                        index,
                                        'falsify',
                                        '',
                                        checkboxItem.id
                                      )
                                  "
                                  >{{ subItem.reinforceItemName }}
                                </el-checkbox>
                              </el-checkbox-group>
                              <el-checkbox-group
                                v-else
                                v-model="addRoleFormArray[index].choiceArray"
                              >
                                <el-checkbox
                                  v-for="subItem in checkboxItem.children"
                                  :key="subItem.id"
                                  :label="subItem.id"
                                  :disabled="
                                    subItem.isCancel == 2 ||
                                      addRoleFormArray[index].strategyType == 2
                                  "
                                  style="margin-right:8px"
                                  @change="
                                    checked =>
                                      handleCheckedChange(
                                        checked,
                                        index,
                                        '',
                                        '',
                                        checkboxItem.id
                                      )
                                  "
                                  >{{ subItem.reinforceItemName }}</el-checkbox
                                >
                              </el-checkbox-group>
                            </template>
                            <template v-else>
                              <el-checkbox-group
                                v-model="addRoleFormArray[index].choiceArray"
                                v-if="
                                  checkboxItem.reinforceItemName ==
                                    '自定义签名MD5'
                                "
                              >
                                <el-checkbox
                                  :label="checkboxItem.id"
                                  :disabled="
                                    checkboxItem.isCancel == 2 ||
                                      addRoleFormArray[index].strategyType == 2
                                  "
                                  @change="
                                    checked =>
                                      handleCheckedChange(
                                        checked,
                                        index,
                                        'MD5',
                                        item.keyTreeData[0].signMd5Value,
                                        ''
                                      )
                                  "
                                  >启用</el-checkbox
                                >
                              </el-checkbox-group>
                              <el-checkbox-group
                                v-model="addRoleFormArray[index].choiceArray"
                                v-else-if="
                                  checkboxItem.reinforceItemName == 'SO高级加固'
                                "
                              >
                                <el-checkbox
                                  :label="checkboxItem.id"
                                  :disabled="
                                    addRoleFormArray[index].soDisabled ||
                                      checkboxItem.isCancel == 2 ||
                                      addRoleFormArray[index].strategyType == 2
                                  "
                                  >启用</el-checkbox
                                >
                              </el-checkbox-group>
                              <el-checkbox-group
                                v-model="addRoleFormArray[index].choiceArray"
                                v-else-if="
                                  checkboxItem.reinforceItemName == 'H5文件加固'
                                "
                              >
                                <el-checkbox
                                  :label="checkboxItem.id"
                                  :disabled="
                                    addRoleFormArray[index].h5Disabled ||
                                      checkboxItem.isCancel == 2 ||
                                      addRoleFormArray[index].strategyType == 2
                                  "
                                  @change="
                                    checked =>
                                      handleCheckedChange(
                                        checked,
                                        index,
                                        'H5',
                                        '',
                                        ''
                                      )
                                  "
                                  >启用</el-checkbox
                                >
                              </el-checkbox-group>
                              <el-checkbox-group
                                v-else
                                v-model="addRoleFormArray[index].choiceArray"
                              >
                                <el-checkbox
                                  :label="checkboxItem.id"
                                  :disabled="
                                    checkboxItem.isCancel == 2 ||
                                      addRoleFormArray[index].strategyType == 2
                                  "
                                  @change="
                                    checked =>
                                      handleCheckedChange(
                                        checked,
                                        index,
                                        '',
                                        '',
                                        ''
                                      )
                                  "
                                  >启用</el-checkbox
                                >
                              </el-checkbox-group>
                            </template>
                            <!-- 自定义签名MD5 -->
                            <template
                              v-if="
                                checkboxItem.reinforceItemName ==
                                  '自定义签名MD5' &&
                                  addRoleFormArray[index].choiceArray.includes(
                                    13
                                  )
                              "
                            >
                              <el-form-item label="签名MD5">
                                <template
                                  v-if="
                                    !addRoleFormArray[index].addSignatureClick
                                  "
                                >
                                  <el-input
                                    size="small"
                                    clearable
                                    style="width:51%"
                                    maxlength="32"
                                    v-model="
                                      addRoleFormArray[index].signMd5Items[0]
                                        .value
                                    "
                                  ></el-input>
                                  <el-button
                                    type="text"
                                    @click="
                                      addSignature(
                                        index,
                                        item.keyTreeData[0].signMd5Value
                                      )
                                    "
                                    >添加</el-button
                                  >
                                </template>
                                <template
                                  v-if="
                                    addRoleFormArray[index].addSignatureClick
                                  "
                                >
                                  <el-input
                                    size="small"
                                    style="width:51%"
                                    clearable
                                    maxlength="32"
                                    v-model="
                                      addRoleFormArray[index].signMd5Items[0]
                                        .value
                                    "
                                  ></el-input>
                                  <el-button
                                    type="text"
                                    @click="
                                      addSignature(
                                        index,
                                        addRoleFormArray[index].signMd5Items[0]
                                          .value
                                      )
                                    "
                                    >添加</el-button
                                  >
                                </template>
                              </el-form-item>
                              <el-form-item
                                v-for="(addItem, addIndex) in addRoleFormArray[
                                  index
                                ].signMd5Items"
                                :key="addIndex"
                                v-show="addIndex"
                                style="margin-left:70px"
                              >
                                <el-input
                                  size="small"
                                  style="width:58%"
                                  clearable
                                  maxlength="32"
                                  v-model="addItem.value"
                                  :disabled="true"
                                ></el-input>
                                <el-button
                                  type="text"
                                  @click="
                                    deleteSignature(index, addIndex, addItem)
                                  "
                                  >删除</el-button
                                >
                              </el-form-item>
                            </template>
                            <!-- SO高级加固 -->
                            <template
                              v-if="
                                checkboxItem.reinforceItemName ==
                                  'SO高级加固' &&
                                  addRoleFormArray[index].choiceArray.includes(
                                    23
                                  )
                              "
                            >
                              <el-tree
                                :data="item.keyTreeData[0].soItems"
                                show-checkbox
                                style="height:150px;overflow:auto"
                                node-key="key"
                                ref="soTree"
                                default-expand-all
                                :default-checked-keys="
                                  addRoleFormArray[index].flatSoArray
                                "
                                @check-change="getSoCheckedNodes(index)"
                              >
                              </el-tree>
                            </template>
                            <!-- H5文件加固 -->
                            <template
                              v-if="
                                checkboxItem.reinforceItemName ==
                                  'H5文件加固' &&
                                  addRoleFormArray[index].choiceArray.includes(
                                    24
                                  )
                              "
                            >
                              <el-tree
                                :data="item.keyTreeData[0].h5Items"
                                show-checkbox
                                style="height:150px;overflow:auto"
                                ref="h5Tree"
                                default-expand-all
                                node-key="key"
                                :default-checked-keys="
                                  addRoleFormArray[index].flatH5Array
                                "
                                @check-change="getH5CheckedNodes(index)"
                              ></el-tree>
                            </template>
                          </el-form-item>
                        </div>
                      </el-col>
                    </el-row>

                    <!-- 多渠道打包 -->
                    <!--  <el-row class="channelPack">
                      <el-col :span="24">
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
                      </el-col>
                    </el-row> -->
                    <!-- 签名策略 -->
                    <el-row>
                      <el-col :span="24">
                        <p class="signature">
                          <el-form-item
                            style="width:60%;display:inline-block"
                            prop="radio2"
                          >
                            <label slot="label">是否签名:</label>
                            <el-radio-group
                              v-model="addRoleFormArray[index].radio2"
                              style="margin-left:17%"
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
                            <!-- 签名策略 -->
                            <el-form-item prop="curPrinter5">
                              <label slot="label">签名策略:</label>
                              <el-select
                                size="small"
                                placeholder="请选择签名策略"
                                v-model="addRoleFormArray[index].curPrinter5"
                                style="margin-left: 10%;"
                              >
                                <el-option
                                  v-for="item in signatureList"
                                  :key="item.id"
                                  :label="item.signName"
                                  :value="item.id"
                                ></el-option>
                              </el-select>
                            </el-form-item>
                            <!-- 签名版本 -->
                            <el-form-item prop="curPrinter6">
                              <label slot="label">签名版本:</label>
                              <el-radio-group
                                class="signatureVersions"
                                v-model="addRoleFormArray[index].curPrinter6"
                              >
                                <el-radio :label="1"> Java</el-radio>
                                <el-radio :label="2">Android V1</el-radio>
                                <el-radio :label="3">Android V2</el-radio>
                                <el-radio :label="4"
                                  >Android V1 + Android V2</el-radio
                                >
                              </el-radio-group>
                            </el-form-item>
                          </template>
                        </p>
                      </el-col>
                    </el-row>
                  </el-collapse-item>
                </el-collapse>
              </el-form>
            </div>
          </div>
          <div class="el-drawer-footer">
            <el-button
              type="primary"
              @click="saveReinforceTask()"
              :disabled="saveReinforceTaskBox"
              >加固</el-button
            >
            <el-button @click="cancelReinforceTask()" plain>取消</el-button>
          </div>
        </el-drawer>
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
            width="220"
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
          <el-table-column
            prop="appFileName"
            label="文件名称"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="appVersion"
            label="应用版本"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="reinforceTaskStartTime"
            label="加固开始时间"
            :show-overflow-tooltip="true"
            width="170"
          ></el-table-column>
          <el-table-column
            props="reinforceTaskStatus"
            label="加固状态"
            width="170"
          >
            <template slot-scope="scope" class="status">
              <span v-if="scope.row.reinforceTaskStatus === 1">
                <img src="../../assets/wait.png" class="status" />
                待加固</span
              >
              <span v-if="scope.row.reinforceTaskStatus === 2">
                <img src="../../assets/execute.png" class="status" />
                加固中
              </span>
              <span v-if="scope.row.reinforceTaskStatus === 3"
                ><img
                  src="../../assets/correct.png"
                  class="status"
                />加固成功</span
              >
              <span v-if="scope.row.reinforceTaskStatus === 4">
                <img src="../../assets/error.png" class="status" />
                加固失败</span
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="userName"
            label="创建人"
            width="140"
          ></el-table-column>
          <el-table-column prop="operate" label="操作" width="290">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="详细" placement="top-start">
                <i
                  class="el-icon-tickets floderIcon"
                  @click="detail(scope.row.id)"
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
              <el-tooltip
                effect="dark"
                content="下载加固包"
                placement="top-start"
              >
                <template v-if="scope.row.reinforceTaskStatus == 3">
                  <i
                    class="el-icon-sold-out reinforcePackageIcon"
                    @click="downloadReinforcePackage(scope.row.id)"
                  ></i>
                </template>
                <template v-else>
                  <i class="el-icon-sold-out disabledIcon"></i>
                </template>
              </el-tooltip>
              <el-tooltip effect="dark" content="日志" placement="top-start">
                <template
                  v-if="
                    scope.row.reinforceTaskStatus == 3 ||
                      scope.row.reinforceTaskStatus == 4
                  "
                >
                  <i
                    class="el-icon-reading ticketsIcon"
                    @click="
                      viewLog(
                        scope.row.id,
                        scope.row.appName,
                        scope.row.reinforceTaskStatus
                      )
                    "
                  ></i>
                </template>
                <template v-else>
                  <i class="el-icon-reading disabledIcon"></i>
                </template>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top-start">
                <i
                  class="el-icon-delete deleteIcon"
                  @click="deletePackage(scope.row.id)"
                >
                </i>
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
        :current-page="curPage"
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
      labelPosition: "right",
      curPage: 1,
      limit: 10,
      dataCount: 0,
      listItem: [],
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
        curPrinter6: [
          { required: true, message: "请选择签名版本", trigger: "blur" }
        ],
        /*  strategyDescribe: [
          { required: true, message: "请输入策略描述", trigger: "blur" }
        ], */
        radio1: [
          { required: true, message: "是否多渠道打包", trigger: "blur" }
        ],
        radio2: [{ required: true, message: "是否签名", trigger: "blur" }]
      },
      strategyName: "",
      addTaskDrawer: false,
      uploadFileItems: [],
      uploadShow: true,
      strategyOptions: [],
      channelPackOptions: [],
      reinforcedetailDrawer: false,
      channelPackList: [],
      signatureList: [],
      activeNames: [],
      strategyItemDto: [],
      loading: false,
      reinforceItemData: [],
      radioItem: [],
      checkedItem: [],
      saveReinforceTaskBox: true
    };
  },
  inject: ["reload"],
  methods: {
    handleExceed(files, fileList) {
      this.$message.warning(`最多只能选5个文件哦`);
    },
    getSoCheckedNodes(index) {
      const _this = this;
      _this.$refs.soTree.forEach((v, i) => {
        let result = v.getCheckedNodes().map(v => v.value);
        _this.addRoleFormArray[index].flatSoArray = result;
      });
    },
    getH5CheckedNodes(index) {
      const _this = this;
      _this.$refs.h5Tree.forEach((v, i) => {
        let result = v.getCheckedNodes().map(v => v.value);
        _this.addRoleFormArray[index].flatH5Array = result;
      });
    },
    handleCheckedChange(checked, index, checkboxType, value, id) {
      const _this = this;
      _this.addRoleFormArray[index][checkboxType] = checked;
      if (checkboxType === "falsify") {
        if (checked) {
          if (id) {
            this.addRoleFormArray[index].choiceArray.push(id);
          }
        } else {
          this.addRoleFormArray[index].choiceArray = this.addRoleFormArray[
            index
          ].choiceArray.filter(v => v !== 3);
        }
      }
      if (checkboxType === "MD5") {
        _this.addRoleFormArray[index].md5Checked = checked;
        this.addRoleFormArray[index].addSignatureClick = false;
        if (!checked) {
          _this.addRoleFormArray[index].signMd5Items = [];
        } else {
          _this.addRoleFormArray[index].signMd5Items = [{ value }];
        }
      } else if (checkboxType === "SO") {
        _this.addRoleFormArray[index].soChecked = checked;
      } else if (checkboxType == "H5") {
        _this.addRoleFormArray[index].h5Checked = checked;
      }
    },
    addSignature(index, value) {
      this.addRoleFormArray[index].addSignatureClick = true;
      let signMd5Items = value,
        regularResult = /^[A-Fa-f0-9]{32}$/.test(signMd5Items);
      if (regularResult) {
        this.addRoleFormArray[index].signMd5Items.push({
          value: ""
        });
        this.addRoleFormArray[index].signMd5Items[0].value = signMd5Items;
        this.addRoleFormArray[index].signMd5Items.reverse();
      } else {
        this.$message.error("长度32位,仅支持数字和字母A-F,不区分大小写");
      }
    },
    deleteSignature(index, addIndex, addItem) {
      if (this.addRoleFormArray[index].signMd5Items.indexOf(addItem) > -1) {
        this.addRoleFormArray[index].signMd5Items.splice(addIndex, 1);
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
          if (res) {
            if (res.data.code == "00") {
              let data = res.data.data;
              this.listItem = data.items;
              this.dataCount = data.count;
            }
          }
        });
    },
    //显示的页面条数
    handleSizeChange(val) {
      this.limit = val;
      let appName = this.ruleForm.appName,
        appVersion = this.ruleForm.appVersion,
        queryInfo = { appName, appVersion };
      this.getData(queryInfo);
    },
    //鼠标点击哪一页
    handleCurrentChange(val) {
      this.curPage = val;
      let appName = this.ruleForm.appName,
        appVersion = this.ruleForm.appVersion,
        queryInfo = { appName, appVersion };
      this.getData(queryInfo);
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
    addReinforceTask() {
      this.addTaskDrawer = true;
    },
    //保存加固任务
    saveReinforceTask(formName, form) {
      let _this = this,
        baseUrl = _this.api.baseUrl,
        taskList = _this.addRoleFormArray,
        allValid = true;
      taskList.forEach((v, i) => {
        let addRoleFormArray = _this.addRoleFormArray[i];
        _this.$refs["addRoleForm"][i].validate(valid => {
          if (!valid) {
            allValid = false;
          }
        });
        if (addRoleFormArray.choiceArray.includes(23)) {
          if (!addRoleFormArray.flatSoArray.length) {
            _this.$message.error("请选择SO文件");
            allValid = false;
          }
        }
        if (addRoleFormArray.choiceArray.includes(24)) {
          if (!addRoleFormArray.flatH5Array.length) {
            _this.$message.error("请选择H5文件");
            allValid = false;
          }
        }
        if (addRoleFormArray.choiceArray.includes(13)) {
          let signMd5Items =
              addRoleFormArray.signMd5Items[
                addRoleFormArray.signMd5Items.length - 1
              ].value,
            regularResult = /^[A-Fa-f0-9]{32}$/.test(signMd5Items);
          if (signMd5Items) {
            if (!regularResult) {
              _this.$message.error("长度32位,仅支持数字和字母A-F,不区分大小写");
              allValid = false;
            }
          } else {
            _this.$message.error("签名MD5不能为空哦");
            allValid = false;
          }
        }
      });
      if (allValid) {
        _this.saveReinforceTaskBox = true;
        const reinforceInfoDto = taskList.map((formItem, index) => {
          const curFileItem = _this.uploadFileItems[index].data;
          let signMd5Items = [];
          formItem.signMd5Items.forEach((v, i) => {
            signMd5Items.push(v.value);
          });
          let signMd5ItemsData = signMd5Items.filter(v => v);
          formItem.flatSoArray = formItem.flatSoArray.filter(v => v);
          formItem.flatH5Array = formItem.flatH5Array.filter(v => v);
          formItem.choiceArray = formItem.choiceArray.concat(
            formItem.tamperArray
          );
          const result = {
            appName: curFileItem.appName,
            appIcon: curFileItem.appIcon,
            appPackage: curFileItem.appPackage,
            appFileName: curFileItem.appFileName,
            appPath: curFileItem.appPath,
            appSize: curFileItem.appSize,
            appVersion: curFileItem.appVersion,
            md5: curFileItem.md5,
            reinforceStrategyId: formItem.curPrinter1,
            channelStrategyId: formItem.curPrinter4,
            signStrategyId: formItem.curPrinter5,
            signType: formItem.curPrinter6,
            strategyItemDto: {
              reinforceItemList: [...new Set(formItem.choiceArray)],
              signMd5Items: signMd5ItemsData,
              soItemList: formItem.flatSoArray,
              h5ItemList: formItem.flatH5Array,
              id: formItem.curPrinter1
            }
          };
          return result;
        });
        console.log(reinforceInfoDto, "*****");
        https
          .fetchPost(
            baseUrl + "/api/reinforce/info/saveReinforceInfoOrUpdate",
            reinforceInfoDto
          )
          .then(res => {
            if (res) {
              if (res.data.code == "500") {
                _this.addTaskDrawer = false;
                _this.reload();
              }
              if (res.data.code == "00") {
                _this.addTaskDrawer = false;
                _this.$notify({
                  title: "成功",
                  message: "新增任务成功",
                  type: "success"
                });
                _this.reload();
              }
            }
          });
      } else {
        return "";
      }
    },
    //取消加固任务
    cancelReinforceTask() {
      if (this.uploadFileItems.length) {
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
          baseUrl + "/api/reinforce/info/uploadReinforceFile",
          params,
          config
        )
        .then(res => {
          if (res) {
            if (
              res.data.code === "01" ||
              res.data.code === "99" ||
              res.data.code === "500"
            ) {
              _this.addTaskDrawer = false;
              _this.$refs.upload.clearFiles();
            }
            if (res.data.code === "00") {
              _this.saveReinforceTaskBox = false;
              if (res.data.data) {
                let data = res.data.data,
                  keyData = data.appPath,
                  packageData = data.appPackage,
                  keyTreeData = [],
                  packageTreeData = [],
                  dataItem = { data, keyTreeData, packageTreeData };
                this.addRoleFormArray.push({
                  curPrinter1: "",
                  curPrinter2: "",
                  curPrinter3: "",
                  curPrinter4: "",
                  curPrinter5: "",
                  curPrinter6: "",
                  radio1: "",
                  radio2: "",
                  strategyItemDto: {},
                  strategyItemDtoTest: [],
                  signMd5Items: [{ value: "" }],
                  choiceItem: [],
                  choiceTamperItem: [],
                  choiceDebugItem: [],
                  md5Checked: false,
                  soChecked: false,
                  h5Checked: false,
                  soDisabled: false,
                  h5Disabled: false,
                  soItemList: [],
                  h5ItemList: [],
                  md5List: [],
                  addSignatureClick: false,
                  flatSoArray: [],
                  flatH5Array: [],
                  tamperArray: [],
                  choiceArray: [],
                  showReinforceItem: false,
                  strategyType: 1,
                  strategyDescribe: ""
                });
                https
                  .fetchGet(
                    baseUrl +
                      "/api/reinforce/info/parseApkInfoByFileKey/" +
                      keyData
                  )
                  .then(res => {
                    if (res.data.code == "00") {
                      let data = res.data.data;
                      this.amendOriginTree(data.soItems);
                      this.amendOriginTree(data.h5Items);
                      console.log(data.soItems, data.h5Items);
                      if (data.soItems.length == 0) {
                        this.addRoleFormArray.forEach((v, i) => {
                          v.soDisabled = true;
                        });
                      }
                      if (data.h5Items.length == 0) {
                        this.addRoleFormArray.forEach((v, i) => {
                          v.h5Disabled = true;
                        });
                      }
                      keyTreeData.push(data);
                    }
                  });
                https
                  .fetchGet(
                    baseUrl +
                      "/api/reinforce/strategy/findStrategyByPackageName",
                    { packageName: packageData }
                  )
                  .then(res => {
                    if (res.data.code == "00") {
                      packageTreeData.push(res.data.data);
                    }
                  });
                this.uploadFileItems.push(dataItem);
                console.log(this.uploadFileItems, "******");
                for (var i = 0; i < this.uploadFileItems.length; i++) {
                  this.activeNames.push(i + 1);
                  this.activeNames = Array.from(new Set(this.activeNames));
                }
                this.uploadShow = false;
              }
              _this.$refs.upload.clearFiles();
            }
          } else {
            _this.$refs.upload.clearFiles();
            _this.addTaskDrawer = false;
            _this.$notify.error({ title: "错误", message: "应用解析错误" });
          }
        });
    },
    //上传结束---
    //详情
    detail(id) {
      this.$router.push({ path: "/detail" + id + "" });
    },
    //查看日志
    viewLog(id, appName, status) {
      this.$router.push({ path: "/Log" + id + "", query: { appName, status } });
    },
    //下载原包
    downloadOriginalPackage(data) {
      let appkey = data.appPath,
        baseUrl = this.api.baseUrl,
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
        "/api/reinforce/info/downloadPackage/?reinforceTaskId=" +
        id +
        "&type=1&Authorization=" +
        Authorization;
      window.location.href = downloadUrl;
    },
    //删除
    deletePackage(id) {
      let baseUrl = this.api.baseUrl,
        _this = this;
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          https
            .fetchGet(
              baseUrl + "/api/reinforce/info/deleteReinforceInfoById/" + id
            )
            .then(res => {
              if (res.data.code == "00") {
                _this.$message({ type: "success", message: "删除成功" });
                _this.reload();
              }
            });
        })
        .catch(() => {
          _this.$message({ type: "info", message: "已取消删除" });
          _this.reload();
        });
    },
    //修改原始SOH5数据
    amendOriginTree(treeNodes) {
      const _this = this;
      if (treeNodes) {
        treeNodes.forEach(item => {
          item["key"] = item.vaue ? item.value : item.label;
          if (item.children) {
            _this.amendOriginTree(item.children);
          } else {
            item["key"] = item.value ? item.value : item.label;
          }
        });
      }
    },
    //根据用户选中的策略名称得到的树形结构选中的原始值
    traverseTree(treeNodes, flatArray) {
      const _this = this;
      if (treeNodes) {
        treeNodes.forEach(item => {
          if (item.children) {
            _this.traverseTree(item.children, flatArray);
          } else {
            flatArray.push(item.value);
          }
        });
      }
    },
    //加固策略
    strategyChange(id, index) {
      /*  let data = this.strategyOptions.filter(val => {
        return val["reinforce_describe"] == item;
      });
      this.strategyItemDto = data; */
      let _this = this,
        baseUrl = _this.api.baseUrl;
      https
        .fetchGet(baseUrl + "/api/reinforce/strategy/getStrategyDetail", {
          id
        })
        .then(res => {
          if (res.data.code == "00") {
            _this.addRoleFormArray[index].showReinforceItem = true;
            let data = res.data.data,
              selectedList = data.reinforceItemList;
            _this.addRoleFormArray[index].strategyType = data.strategyType;
            _this.addRoleFormArray[index].strategyDescribe = "";
            //初始化防止每次都push一下
            _this.addRoleFormArray[index].signMd5Items = [{ value: "" }];
            data.md5ItemList.map(v => {
              _this.addRoleFormArray[index].signMd5Items.push({ value: v });
            });
            if (data.strategyType == 1) {
              _this.$message({
                message:
                  "当前选择为用户自定义策略,会随您的操作进行更新,请谨慎操作！",
                type: "warning"
              });
            }
            if (data.strategyType == 2) {
              _this.$message({
                message: "当前选择为默认加固策略,不可做修改！",
                type: "warning"
              });
            }
            _this.reinforceItemData.forEach(obj => {
              obj["checked"] = false;
              if (obj.children) {
                obj.children.forEach(v => {
                  v["checked"] = false;
                  selectedList.some(obj1 => {
                    if (obj1.id == v.id) {
                      v["checked"] = true;
                    }
                  });
                });
              }
              selectedList.some(obj1 => {
                if (obj1.id == obj.id) {
                  obj["checked"] = true;
                }
              });
            });
            let choiceArray = [],
              tamperArray = [],
              result = _this.reinforceItemData.map(item => {
                if (item.children) {
                  if (item.reinforceItemName == "防篡改") {
                    item.children.forEach(v => {
                      if (v.checked == true) {
                        tamperArray.push(v.id);
                      }
                    });
                  } else {
                    item.children.forEach(v => {
                      if (v.checked == true) {
                        choiceArray.push(v.id);
                      }
                    });
                  }
                }
                if (item.checked == true) {
                  return item.id;
                }
              });
            result = result.filter(v => v);
            choiceArray = choiceArray.filter(v => v);
            choiceArray = choiceArray.concat(result);
            _this.traverseTree(
              data.soItemList,
              _this.addRoleFormArray[index].flatSoArray
            );
            _this.traverseTree(
              data.h5ItemList,
              _this.addRoleFormArray[index].flatH5Array
            );
            _this.addRoleFormArray[index].choiceArray = choiceArray;
            _this.addRoleFormArray[index].tamperArray = tamperArray;
          }
        });
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
  beforeRouteEnter(to, from, next) {
    if (from.name == "detail" || from.name == "log") {
      to.meta.KeepAlive = true;
    } else {
      to.meta.KeepAlive = false;
    }
    next();
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
        if (res.data.code == "00") {
          let data = res.data.data.items;
          data = JSON.parse(
            JSON.stringify(data).replace(/reinforce_strategy_name/g, "label")
          );
          this.strategyOptions = data;
        }
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
        if (res.data.code == "00") {
          this.reinforceItemData = res.data.data;
          this.reinforceItemData.forEach((v, i) => {
            if (v.children) {
              this.checkedItem.push(v);
            } else {
              this.radioItem.push(v);
            }
          });
        }
      });
  }
};
</script>
<style>
.el-select-dropdown {
  position: absolute !important;
  top: 35px !important;
  left: 0 !important;
}
.el-collapse-item__wrap {
  overflow: visible;
}
.reinforeHeader {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}
.reinfore .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #409eff;
  border-color: #409eff;
}
.reinfore .el-collapse-item__header.is-active {
  font-weight: 700;
  font-size: 16px;
}
.addApplicationForm .titleIcon {
  display: inline-block;
  width: 4px;
  height: 14px;
  background: skyblue;
}
.reinforeBody {
  width: 99%;
  box-sizing: border-box;
}
.reinforeBody img {
  width: 33px;
  height: 33px;
  border-radius: 3px;
  vertical-align: middle;
}
.deleteIcon,
.playIcon,
.floderIcon,
.reinforcePackageIcon,
.originalPackageIcon,
.deleteIcon,
.ticketsIcon {
  font-size: 22px;
  color: #409eff;
  margin-right: 10px;
  cursor: pointer;
}
.disabledIcon {
  font-size: 22px;
  margin-right: 10px;
  cursor: not-allowed;
  color: #9dc7f1;
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
.el-table__body .status {
  width: 25px;
  height: 25px;
  margin-right: 5px;
  border: none;
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
.uploadTip {
  text-align: center;
  color: #a3a9b1;
  font-size: 14px;
  margin-top: 5px;
}

.el-drawer-content .el-collapse {
  margin-top: 10px;
  border-top: none !important;
  border-bottom: none !important;
}
.el-drawer-content .el-collapse .el-row {
  text-align: justify;
}
.el-drawer-content .signatureVersions {
  margin-left: 10%;
}
.el-drawer-content .signatureVersions .el-radio {
  display: block;
  margin-top: 20px;
}
.el-drawer-content .el-collapse .password .el-input__inner {
  border: none;
}
.reinfore .reinforceItem {
  margin-top: 10px;
}
.reinforceItem .el-form-item__label,
.signature .el-form-item__label,
.strategyName .el-form-item__label,
.strategyDescribe .el-form-item__label {
  text-align: left !important;
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
  position: relative;
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
  position: fixed; /*  */
  background: white;
  z-index: 99;
  height: 50px;
  padding: 17px 20px;
  border-bottom: 1px solid #ebebeb;
}
.el-drawer-content {
  margin-top: 50px;
  position: relative;
  overflow-y: auto;
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
  padding: 20px;
  border-top: 1px solid #ebebeb;
  position: fixed;
  bottom: 0;
  z-index: 99;
  background: white;
}
</style>
