<template>
  <div class="channelStrategy">
    <div class="channelStrategyHeader">
      <p>当前位置:渠道策略</p>
    </div>
    <div class="searchForm">
      <div class="searchBox">
        <el-form :model="ruleForm" ref="ruleForm">
          <el-input
            size="small"
            placeholder="请输入渠道名称"
            v-model="ruleForm.channelStrategyName"
          ></el-input>
        </el-form>
      </div>
      <div class="operateBox">
        <el-tooltip effect="dark" content="查询" placement="top-start">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="searchChannelStrategyName()"
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
        <el-button type="primary" size="small" @click="createChannelStrategy()"
          >新建渠道策略</el-button
        >
      </div>
      <!-----新建渠道Drawer开始--- -->
      <el-drawer
        title="新建渠道"
        :visible.sync="createChannelStrategyDrawer"
        :with-header="false"
        :wrapperClosable="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
        ref="createChannelStrategyDrawer"
        size="40%"
      >
        <!-- 新建渠道Drawer头部-->
        <div class="el-drawer-header">
          <h3>新建渠道策略</h3>
        </div>
        <!-- 新建渠道Drawer主体-->
        <div class="el-drawer-content">
          <el-upload
            class="upload"
            drag
            action="/"
            :limit="1"
            :http-request="createChannelStrategyFile"
            :file-list="createChannelStrategyFileItem"
            accept=".apk"
            ref="createChannelStrategyUpload"
            v-if="createChannelStrategyUploadShow"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处,或<em>点击上传</em>
            </div>
            <div class="el-upload_tip" slot="tip">点击上传.apk文件</div>
          </el-upload>
          <!-- 创建渠道策略的列表 -->
          <div
            v-for="(item, index) in createChannelStrategyFileItem"
            :key="index"
          >
            <!-- 上传文件的信息 -->
            <el-form :model="channelStrategyForm" class="channelStrategyForm">
              <div class="channelStrategyItem">
                <h3 class="channelStrategyItemTitle">
                  <i class="channelStrategyItemIcon"> </i>
                  <span>应用信息</span>
                </h3>
                <div class="channelStrategyItemContent">
                  <el-row>
                    <el-col :span="6">
                      <img :src="'data:image/jpg;base64,' + item.data.appIcon"
                    /></el-col>
                    <el-col :span="18">
                      <p class="appName">{{ item.data.appName }}</p>
                      <p class="appPackage">
                        包名:&nbsp;&nbsp;{{ item.data.appPackage }}
                      </p>
                      <p>
                        <span style="margin-right:10px">
                          版本:&nbsp;&nbsp;{{ item.data.appVersion }}
                        </span>
                        <span
                          >大小:&nbsp;&nbsp;{{ item.data.appMbSize }}MB</span
                        >
                      </p>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div class="channelStrategyItem">
                <h3 class="channelStrategyItemTitle">
                  <i class="channelStrategyItemIcon"></i>
                  <span>渠道配置</span>
                </h3>
                <div class="channelStrategyItemContent">
                  <el-row>
                    <el-col :span="24">
                      <div class="channelStrategyBox">
                        <el-form-item
                          label="渠道名称"
                          prop="channelStrategyName"
                        >
                          <el-input
                            size="small"
                            v-model="channelStrategyForm.channelStrategyName"
                            placeholder="请输入渠道名称"
                            style="width:40%"
                          ></el-input>
                        </el-form-item>
                        <el-form-item
                          label="渠道参数"
                          prop="channelStrategyParameter"
                        >
                          <el-select
                            v-model="channelStrategyForm.channelKey"
                            placeholder="请选择渠道参数"
                            size="small"
                            :popper-append-to-body="false"
                          >
                            <el-option
                              v-for="(channelKeyItem, channelKeyIndex) in item
                                .channelKeyData[0]"
                              :key="channelKeyIndex"
                              :value="channelKeyItem"
                            ></el-option>
                          </el-select>
                          <el-input
                            size="small"
                            v-model="channelStrategyForm.channelValue"
                            placeholder="channelValue"
                            style="width:40%"
                          ></el-input>
                          <el-button
                            class="addChannelStrategyParameterButton"
                            icon="el-icon-plus addIcon"
                            type="text"
                            plain
                            @click="addChannelStrategyParameter(0)"
                          ></el-button>
                          <el-button
                            class="deleteChannelStrategyParameterButton"
                            icon="el-icon-delete delIcon"
                            type="text"
                            plain
                            @click="deleteChannelStrategyParameter(0)"
                          ></el-button>
                        </el-form-item>
                        <!-- 渠道参数列表 -->
                        <div
                          v-for="(channelSubItem,
                          channelSubIndex) in channelStrategyList[index]
                            .channelStrategyParameteList"
                          :key="channelSubIndex"
                        >
                          <el-form-item
                            label="渠道参数"
                            prop="channelStrategyParameter"
                          >
                            <el-select
                              v-model="channelStrategyForm.channelKey"
                              placeholder="请选择渠道参数"
                              size="small"
                              :popper-append-to-body="false"
                            ></el-select>
                            <el-input
                              size="small"
                              v-model="channelStrategyForm.channelValue"
                              placeholder="channelValue"
                              style="width:40%"
                            ></el-input>
                            <el-button
                              class="addChannelStrategyParameterButton"
                              icon="el-icon-plus addIcon"
                              type="text"
                              plain
                              @click="
                                addChannelStrategyParameter(channelSubIndex)
                              "
                            ></el-button>
                            <el-button
                              class="deleteChannelStrategyParameterButton"
                              icon="el-icon-delete delIcon"
                              type="text"
                              plain
                              :disabled="
                                channelStrategyList[index]
                                  .channelStrategyParameteList.length == 1
                              "
                              @click="
                                deleteChannelStrategyParameter(channelSubIndex)
                              "
                            ></el-button>
                          </el-form-item>
                        </div>
                        <!--  <el-button
                          class="deleteChannelStrategyButton"
                          type="text"
                          icon="el-icon-error"
                          :disabled="channelStrategyList.length == 1"
                          @click="deleteChannel(channelIndex)"
                          plain
                        ></el-button> -->
                      </div>
                      <!-- 渠道列表 -->
                      <template v-if="channelStrategyList.length > 1">
                        <div
                          class="channelStrategyBox"
                          v-for="(channelItem,
                          channelIndex) in channelStrategyList"
                          :key="channelIndex"
                        >
                          <el-form-item
                            label="渠道名称"
                            prop="channelStrategyName"
                          >
                            <el-input
                              size="small"
                              v-model="channelStrategyForm.channelStrategyName"
                              placeholder="请输入渠道名称"
                              style="width:40%"
                            ></el-input>
                          </el-form-item>
                          <el-form-item
                            label="渠道参数"
                            prop="channelStrategyParameter"
                          >
                            <el-select
                              v-model="channelStrategyForm.channelKey"
                              placeholder="请选择渠道参数"
                              size="small"
                              :popper-append-to-body="false"
                            >
                              <el-option
                                v-for="(channelKeyItem, channelKeyIndex) in item
                                  .channelKeyData[0]"
                                :key="channelKeyIndex"
                                :value="channelKeyItem"
                              ></el-option>
                            </el-select>
                            <el-input
                              size="small"
                              v-model="channelStrategyForm.channelValue"
                              placeholder="channelValue"
                              style="width:40%"
                            ></el-input>
                            <el-button
                              class="addChannelStrategyParameterButton"
                              icon="el-icon-plus addIcon"
                              type="text"
                              plain
                              @click="addChannelStrategyParameter()"
                            ></el-button>
                            <el-button
                              class="deleteChannelStrategyParameterButton"
                              icon="el-icon-delete delIcon"
                              type="text"
                              plain
                              @click="deleteChannelStrategyParameter()"
                            ></el-button>
                          </el-form-item>
                        </div>
                      </template>
                      <el-button
                        type="primary"
                        plain
                        size="small"
                        class="addChannelStrategy"
                        @click="addChannelStrategy()"
                        >添加渠道</el-button
                      >
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-form>
          </div>
        </div>
        <!-- 新建渠道Drawer尾部-->
        <div class="el-drawer-footer">
          <el-button type="primary" @click="saveChannelStrategy()"
            >保存</el-button
          >
          <el-button @click="cancelChannelStrategy()" plain>取消</el-button>
        </div>
      </el-drawer>
      <!-- 新建渠道Drawer结束 -->
      <!-- 修改渠道Drawer开始 -->
      <el-drawer
        title="修改渠道"
        :visible.sync="amendChannelStrategyDrawer"
        :with-header="false"
        :wrapperClosable="false"
        :destroy-on-cloase="true"
        ref="amendChannelStrategyDrawer"
        size="40%"
      >
        <div class="el-drawer-header">
          <h3>修改渠道</h3>
        </div>
        <div class="el-drawer-content">
          <el-form :model="channelStrategyForm"></el-form>
        </div>
        <div class="el-drawer-footer">
          <el-button type="primary" @click="amendChannelStrategy()"
            >修改</el-button
          >
          <el-button plain @click="cancelAmendChannelStrategy()"
            >取消</el-button
          >
        </div>
      </el-drawer>
      <!-- 修改渠道Drawer结束 -->
      <!-- 详细渠道Drawer开始 -->
      <el-drawer
        title="渠道详细"
        :visible.sync="detailChannelStrategyDrawer"
        :with-header="false"
        :wrapperClosable="false"
        :destroy-on-cloase="true"
        ref="detailChannelStrategyDrawer"
        size="40%"
      >
        <div class="el-drawer-header">
          <h3>渠道详细</h3>
        </div>
        <div class="el-drawer-content"></div>
        <div class="el-drawer-footer">
          <el-button plain @click="cancelChannelStrategyDetail()"
            >取消</el-button
          >
        </div>
      </el-drawer>
      <!-- 详细渠道Drawer结束 -->
    </div>
    <!-- 表格内容 -->
    <div class="channelStrategyBody">
      <el-table
        :data="listItem"
        v-loading="loading"
        element-loading-text="加载中"
      >
        <el-table-column type="index" label="序号" width="60">
          <template slot-scope="scope">
            <span>{{ (curPage - 1) * limit + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="channel_strategy_name"
          label="渠道策略名称"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="channel_strategy_describe"
          label="渠道策略描述"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="channel_strategy_count"
          label="渠道策略数量"
        ></el-table-column>
        <el-table-column prop="create_time" label="创建时间"></el-table-column>
        <el-table-column
          prop="user_name"
          label="创建人
        "
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改" placement="top-start">
              <i
                class="el-icon-edit-outline editIcon"
                @click="amendChannelStrategy(scope.row.id)"
              ></i>
            </el-tooltip>
            <el-tooltip effect="dark" content="详细" placement="top-start">
              <i
                class="el-icon-tickets detailIcon"
                @click="channelStrategyDetail(scope.row.id)"
              ></i>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top-start">
              <i
                class="el-icon-delete deletIcon"
                @click="deleteChannelStrategy(scope.row.id)"
              ></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表格底部 分页 -->
    <div class="channelStrategyBase">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="curPage"
        :page-size="10"
        :page-sizes="[10, 20, 30, 40, 50]"
        layout="total,sizes,prev,pager,next,jumper"
        :total="dataCount"
        class="pagionationBox"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import https from "../../http";
export default {
  name: "channelStrategy",
  data() {
    return {
      curPage: 1,
      limit: 10,
      dataCount: 0,
      listItem: [],
      ruleForm: {
        channelStrategyName: ""
      },
      loading: false,
      createChannelStrategyDrawer: false,
      amendChannelStrategyDrawer: false,
      detailChannelStrategyDrawer: false,
      createChannelStrategyFileItem: [],
      createChannelStrategyUploadShow: true,
      channelStrategyForm: {
        channelStrategyName: "",
        channelKey: "",
        channelValue: ""
      },
      channelStrategyList: [{ channelStrategyParameteList: [] }]
    };
  },
  inject: ["reload"],
  beforeMount() {
    let _this = this,
      baseUrl = this.api.baseUrl;
    _this.getData();
  },
  methods: {
    //获取表格数据
    getData(queryInfo) {
      let baseUrl = this.api.baseUrl;
      https
        .fetchPost(
          baseUrl + "/api/channel/strategy/findChannelStrategyByPage",
          { pn: this.curPage, limit: this.limit, queryInfo }
        )
        .then(res => {
          if (res.data.code === "00") {
            let data = res.data.data;
            this.listItem = data.items;
            this.dataCount = data.count;
          }
        });
    },
    //刷新
    refresh() {
      this.reload();
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.curPage = val;
      this.getData();
    },
    //获取渠道策略具体的内容
    getChannelStrategy(id) {
      let _this = this,
        baseUrl = _this.api.baseUrl;
      https
        .fetchGet(
          baseUrl + "/api/channel/strategy/findChannelStrategyDetail/" + id
        )
        .then(res => {
          console.log(res);
          if (res.data.code == "00") {
            let data = res.data.data;
            console.log(data, "渠道策略具体内容");
          }
        });
    },

    //渠道策略详细
    channelStrategyDetail(id) {
      this.detailChannelStrategyDrawer = true;
      this.getChannelStrategy(id);
    },
    //删除渠道策略
    deleteChannelStrategy(id) {
      console.log("删除渠道策略", id);
    },
    //查询渠道策略名称
    searchChannelStrategyName() {
      console.log(this.ruleForm.channelStrategyName);
    },
    //新建渠道
    createChannelStrategy() {
      this.createChannelStrategyDrawer = true;
    },
    //上传渠道策略开始
    createChannelStrategyFile(file) {
      let _this = this,
        params = new FormData(),
        baseUrl = _this.api.baseUrl;
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
            (res.data.code === "01" && res.data.code === "99") ||
            res.data.code === "500"
          ) {
            _this.createChannelStrategyDrawer = false;
            _this.$refs.createChannelStrategyUpload.clearFiles();
          }
          if (res.data.code === "00") {
            _this.createChannelStrategyUploadShow = false;
            let data = res.data.data,
              appPath = data.appPath,
              channelKeyData = [],
              dataItem = { data, channelKeyData };
            https
              .fetchGet(
                baseUrl +
                  "/api/channel/strategy/parseApkMateInfoByFileKey/" +
                  appPath
              )
              .then(res => {
                if (res.data.code === "00") {
                  channelKeyData.push(res.data.data);
                }
              });
            _this.createChannelStrategyFileItem.push(dataItem);
          }
        });
    },
    //保存创建的渠道策略
    saveChannelStrategy() {
      let _this = this;
      console.log(_this.channelStrategyForm, "表格里的数据");
    },
    //取消保存创建的渠道策略
    cancelChannelStrategy() {
      const _this = this;
      if (_this.createChannelStrategyFileItem.length) {
        _this
          .$confirm("会清空当前上传的文件,是否继续?", "提示", {
            closeOnClickModal: false,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            _this.reload();
            _this.createChannelStrategyDrawer = false;
            _this.$refs.createChannelStrategyUpload.clearFiles();
          })
          .catch(() => {
            console.log("取消");
          });
      } else {
        _this.createChannelStrategyDrawer = false;
      }
    },
    //添加渠道参数
    addChannelStrategyParameter(index) {
      this.channelStrategyList[index].channelStrategyParameteList.push({});
    },
    //删除渠道参数
    deleteChannelStrategyParameter(index) {
      console.log("删除渠道参数", index);
      this.channelStrategyList[index].channelStrategyParameteList.splice(
        index,
        1
      );
    },
    //添加渠道
    addChannelStrategy() {
      this.channelStrategyList.push({});
      console.log("添加渠道", this.channelStrategyList);
    },
    //删除渠道
    deleteChannel(index) {
      console.log(index, "删除渠道");
      this.channelStrategyList.splice(index, 1);
    },
    //修改渠道策略
    amendChannelStrategy() {
      this.amendChannelStrategyDrawer = true;
    },
    //取消保存修改的渠道
    cancelAmendChannelStrategy() {
      this.amendChannelStrategyDrawer = false;
    },
    //取消查看渠道详细
    cancelChannelStrategyDetail() {
      this.detailChannelStrategyDrawer = false;
    }
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
.channelStrategyBody .el-table {
  font-size: 12px;
  border: 1px solid #dcdee2;
  border-bottom: 1px solid transparent !important;
}
.channelStrategyBody .el-table thead {
  color: #515a6a;
}
.el-table__header-wrapper th {
  background: #f2f5f7 !important;
}
.channelStrategyHeader {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}
.channelStrategy .searchForm {
  display: flex;
}
.channelStrategy .operateBox {
  margin-left: 10px;
}
.channelStrategyBody {
  margin-top: 20px;
}
.channelStrategy .el-drawer-header {
  width: 100%;
  position: fixed;
  background: white;
  z-index: 99;
  height: 50px;
  padding: 17px 20px;
  border-bottom: 1px solid #ebebeb;
}
.channelStrategy .el-drawer-header h3 {
  color: #333;
  font-size: 16px;
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
.channelStrategy .el-drawer-content {
  position: relative;
  padding: 0 20px 40px 20px;
  margin: 60px 0 40px 0;
}
.channelStrategyItemContent .appName {
  line-height: 40px;
  font-size: 16px;
  color: #333;
  font-weight: 700;
}
.channelStrategyItemContent .appInfo {
  display: flex;
  margin: 30px 0;
}
.channelStrategyItemContent .el-row:first-child p {
  line-height: 36px;
  color: #606266;
  margin: 10px 0;
  font-size: 14px;
}
.channelStrategy .channelStrategyItemContent img {
  width: 55%;
  border-radius: 15px;
  margin: 30px 35px 0 0;
  vertical-align: middle;
}
.channelStrategy .el-drawer-footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  background: white;
  z-index: 9;
  padding: 10px 20px;
  border-top: 1px solid #ebebeb;
}
.editIcon,
.detailIcon,
.deletIcon,
.delIcon,
.addIcon {
  font-size: 22px;
  color: #409eff;
  cursor: pointer;
  margin-right: 10px;
}
.delIcon,
.addIcon {
  font-size: 18px;
  margin-left: 5px;
}
.channelStrategyItemIcon {
  width: 3px;
  height: 14px;
  background: #409eff;
  margin-right: 10px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.channelStrategyItemTitle {
  position: relative;
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 15px;
}
.channelStrategyItemTitle > span {
  color: #333;
  margin-left: 10px;
  font-weight: 530;
}
.channelStrategyBox {
  background: #409eff1c;
  padding: 20px;
  font-size: 12px;
  margin-top: 10px;
  position: relative;
}
.deleteChannelStrategyButton {
  position: absolute;
  right: 5px;
  top: 1px;
  cursor: pointer;
  color: #33333369;
  font-size: 15px;
  border: none;
  background: transparent !important;
}
.addChannelStrategyParameterButton,
.deleteChannelStrategyParameterButton {
  width: 15px;
  border: none;
  background: transparent !important;
}
.addChannelStrategy {
  margin-top: 15px;
}
.el-drawer {
  box-sizing: border-box !important;
  overflow-y: auto;
}
.el-form-item__content {
  font-size: 12px;
}
.channelStrategyBase {
  margin-top: 20px;
}
</style>
