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
            <div class="channelStrategyItem">
              <h3 class="channelStrategyItemTitle">
                <i class="channelStrategyItemIcon">
                  <span>应用信息</span>
                </i>
              </h3>
              <div class="channelStrategyItemContent">
                <el-row>
                  <el-col :span="6">
                    <img :src="'data:image/jpg;base64,' + item.appIcon"
                  /></el-col>
                  <el-col :span="18">
                    <p class="appName">{{ item.appName }}</p>
                    <p class="appPackage">
                      包名:&nbsp;&nbsp;{{ item.appPackage }}
                    </p>
                    <p>
                      <span style="margin-right:10px">
                        版本:&nbsp;&nbsp;{{ item.appVersion }}
                      </span>
                      <span>大小:&nbsp;&nbsp;{{ item.appMbSize }}MB</span>
                    </p>
                  </el-col>
                </el-row>
              </div>
            </div>
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
            <el-tooltip effect="dark" content="详细" placement="top-start">
              <i
                class="el-icon-tickets detailIcon"
                @click="detail(scope.row.id)"
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
      createChannelStrategyFileItem: [],
      createChannelStrategyUploadShow: true
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
    //渠道策略详细
    detail(id) {
      console.log(id);
    },
    //删除渠道策略
    deleteChannelStrategy(id) {
      console.log(id);
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
          console.log(res);
          if (
            (res.data.code === "01" && res.data.code === "99") ||
            res.data.code === "500"
          ) {
            _this.createChannelStrategyDrawer = false;
            _this.$refs.createChannelStrategyUpload.clearFiles();
          }
          if (res.data.code === "00") {
            _this.createChannelStrategyUploadShow = false;
            let data = res.data.data;
            console.log(data, "----");
            _this.createChannelStrategyFileItem.push(data);
            console.log(_this.createChannelStrategyFileItem, "0000");
          }
        });
    },
    //保存创建的渠道策略
    saveChannelStrategy() {},
    //取消保存创建的渠道策略
    cancelChannelStrategy() {
      if (this.createChannelStrategyFileItem.length) {
        this.$confirm("会清空当前上传的文件,是否继续?", "提示", {
          closeOnClickModal: false,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.createChannelStrategyDrawer = false;
            this.$refs.createChannelStrategyUpload.clearFiles();
            this.reload();
          })
          .catch(() => {
            console.log("取消");
          });
      } else {
        this.createChannelStrategyDrawer = false;
      }
    }
  }
};
</script>
<style>
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
.channelStrategy .el-drawer-content {
  margin-top: 60px;
  position: relative;
  padding: 0 20px 40px 20px;
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
.detailIcon,
.deletIcon {
  font-size: 22px;
  color: #409eff;
  margin-right: 10px;
  cursor: pointer;
}
.channelStrategyBase {
  margin-top: 20px;
}
</style>
