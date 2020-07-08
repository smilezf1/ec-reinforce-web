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
          ref="addTaskDrawer"
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
            <div
              class="addApplicationForm"
              v-for="item in uploadFileItems"
              :key="item.id"
            >
              <div class="appInfo">
                <div class="left">
                  <img :src="'data:image/jpg;base64,' + item.appIcon" />
                </div>
                <div class="right">
                  <p class="appName">{{ item.appName }}</p>
                  <p class="appPackage">
                    包名:&nbsp;&nbsp;{{ item.appPackage }}
                  </p>
                  <p>
                    <span style="margin-right:10px;"
                      >版本:&nbsp;&nbsp;{{ item.appVersion }}
                    </span>
                    <span>大小:&nbsp;&nbsp;{{ item.appSize }}</span>
                  </p>
                  <!-- 策略名称 -->
                  <p class="strategyName">
                    <span>策略名称:&nbsp;&nbsp;</span
                    ><el-select
                      v-model="strategyOptions.label"
                      placeholder="请选择策略"
                    >
                      <el-option
                        v-for="item in strategyOptions"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </p>
                  <!-- 多渠道打包 -->
                  <p class="channelPack">
                    <span>多渠道打包:&nbsp;&nbsp;</span>
                    <el-select></el-select>
                  </p>
                </div>
              </div>
            </div>
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
              <!--  <el-drawer
                title="加固详情"
                :visible.sync="reinforceDetailDrawer"
                :with-header="false"
                :wrapperClosable="false"
                :close-on-press-escape="false"
                ref="reinforceDetailDrawer"
                size="60%"
              >
                <div class="el-drawer-header">
                  <h3>加固详情</h3>
                </div>
                <div class="el-drawer-content">
                <el-table></el-table>
                </div>
                <div class="el-drawer-footer">
                  <el-button type="primary">保存</el-button>
                  <el-button plain>取消</el-button>
                </div>
              </el-drawer> -->
              <el-tooltip effect="dark" content="删除" placement="top-start">
                <i
                  class="el-icon-delete deleteIcon"
                  @click="delete scope.row.id"
                ></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
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
      </template>
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
      dateValue: "",
      addTaskDrawer: false,
      percentage: 0, //存放上传的百分比
      uploadFileItems: [],
      uploadShow: true,
      strategyOptions: [],
      channelPackOptions: [],
      reinforceDetailDrawer: false
    };
  },
  inject: ["reload"],
  created() {
    this.fileFormData = new FormData();
  },
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
          console.log(this.listItem);
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
      console.log("新增");
      this.addTaskDrawer = true;
    },
    //保存加固任务
    saveaddTask() {
      this.addTaskDrawer = false;
    },
    //取消加固任务
    cancelSaveaddTask() {
      this.addTaskDrawer = false;
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
            this.uploadFileItems.push(res.data.data);
            this.uploadShow = false;
          }
        });
    },
    //上传结束---
    //详情
    detail(id) {
      /*   this.reinforceDetailDrawer = true;
      let baseUrl = this.api.baseUrl;
      https
        .fetchGet(baseUrl + "/api/reinforce/info/findReinforceDetailById", {
          reinforceId: id
        })
        .then(res => {
          console.log(res.data.data);
        }); */
      this.$router.push({ path: "/reinforce/id="+id+"" });
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
        console.log(data, "hahh");
        this.strategyOptions = data;
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
.addApplicationForm .appInfo {
  display: flex;
  margin: 30px 0;
  padding: 20px;
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
.operateBox {
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
.el-drawer-header {
  height: 50px;
  padding: 17px 20px;
  border-bottom: 1px solid #ebebeb;
}
.el-drawer-content {
  padding: 20px;
}
.el-drawer-content .upload {
  text-align: center;
}
.el-drawer-header h3 {
  color: #333;
  font-size: 16px;
  font-weight: 600;
}
.el-drawer-footer {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
