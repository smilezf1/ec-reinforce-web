<template>
  <div class="dashboard">
    <div class="dashboardHeader">
      <p>当前位置:系统首页</p>
    </div>
    <div class="dashboardBody">
      <template>
        <el-table :data="listItem" ref="listItem">
          <el-table-column type="index" label="序号" width="100">
            <template slot-scope="scope">
              <span>{{ (curPage - 1) * limit + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="appName"
            label="应用名称"
            width="260"
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
              </el-tooltip></template
            >
          </el-table-column>
          <el-table-column
            prop="appFileName"
            label="文件名称"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="appVersion"
            label="应用版本"
            width="230"
          ></el-table-column>
          <el-table-column
            prop="reinforceTaskStartTime"
            label="加固开始时间"
            width="200"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column prop="status" label="加固状态" width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.reinforceTaskStatus === 1">
                <img src="../../assets/wait.png" class="status" />
                待加固
              </span>
              <span v-if="scope.row.reinforceTaskStatus === 2">
                <img src="../../assets/execute.png" class="status" />
                加固中
              </span>
              <span v-if="scope.row.reinforceTaskStatus === 3">
                <img src="../../assets/correct.png" class="status" />
                加固成功
              </span>
              <span v-if="scope.row.reinforceTaskStatus === 4">
                <img src="../../assets/error.png" class="status" />
                加固失败
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="userName"
            label="创建人"
            width="200"
          ></el-table-column>
        </el-table>
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
      </template>
    </div>
    <div class="dashboardBase"></div>
  </div>
</template>
<script>
import https from "../../http.js";
export default {
  name: "dashboard",
  data() {
    return {
      curPage: 1, //当前页
      limit: 10, //每页显示的条目个数
      dataCount: 0, //总数目
      listItem: [] //调用接口获取的数据
    };
  },
  methods: {
    //获取后台数据
    getData() {
      let baseUrl = this.api.baseUrl;
      https
        .fetchPost(baseUrl + "/api/reinforce/info/page", {
          pn: this.curPage,
          limit: this.limit
        })
        .then(res => {
          if (res.data.code === "00") {
            this.listItem = res.data.data.items;
            this.dataCount = res.data.data.count;
            console.log(this.listItem, "哈哈");
          }
        });
    },
    //显示的页面条数
    handleSizeChange(val) {
      this.limit = val;
      this.getData();
    },
    //鼠标点击哪一页
    handleCurrentChange(val) {
      this.curPage = val;
      this.getData();
    }
  },
  mounted() {
    this.getData();
    console.log(this.listItem);
  }
};
</script>
<style>
.dashboard {
  color: #45494c;
}
.dashboardHeader {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}
.dashboardBody {
  width: 99%;
}
.dashboard img {
  width: 33px;
  height: 33px;
  border-radius: 3px;
  vertical-align: middle;
}
.el-table {
  font-size: 12px;
  border: 1px solid #dcdee2 !important;
  border-bottom: 1px solid transparent !important;
}
.el-table::befor {
  height: 0;
}
.el-table__body .status {
  width: 25px;
  height: 25px;
  margin-right: 5px;
  border: none;
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
.pagingBox {
  margin-top: 20px;
}
</style>
