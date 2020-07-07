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
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
            </el-upload>
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
          <el-table-column prop="createTime" label="加固时间">
          </el-table-column>
          <el-table-column prop="userName" label="创建人"></el-table-column>
          <el-table-column prop="status" label="加固状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">已完成</span>
            </template>
          </el-table-column>
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
      fileFormData: null, //将要上传的formData数据
      percentage: 0 //存放上传的百分比
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
      /* 每选一个文件都会执行一次该函数 */
      this.fileFormData.append("file[]", file.file);
      let formData = this.fileFormData,
        uploadProgress = this.uploadProgress,
        baseUrl = this.api.baseUrl;
      https.fetchPost(baseUrl + "/api/reinforce/info/uploadReinforceFile", {
        file: formData
      });
    }
  },
  mounted() {
    this.getData();
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
