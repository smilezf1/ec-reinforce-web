<template>
  <div class="dashboard">
    <div class="dashboardHeader">
      <p>当前位置:我的加固任务</p>
      <div class="dashboardBody">
        <template>
          <i-table :columns="columns" :data="listItem.slice((curPage-1)*limit,curPage*limit)"></i-table>
        </template>
      </div>
      <div class="dashboardBase">
        <template>
          <Page
            :total="dataCount"
            show-sizer
            show-elevator
            show-total
            @on-change="handleChange"
            @on-page-size-change="handleSizeChange"
          ></Page>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import https from "../../http.js";
export default {
  name: "dashboard",
  data() {
    return {
      columns: [
        { title: "序号", type: "index", width: 60, align: "center" },
        { title: "应用程序文件名称", key: "appFileName", align: "center" },
        {
          title: "应用图标",
          key: "appIcon",
          render: (h, params) => {
            return h("img", {
              style: { width: "30px" },
              attrs: { src: "data:image/jpg;base64," + params.row.appIcon }
            });
          }
        },
        { title: "应用名称", key: "appName", align: "center" },
        { title: "应用版本", key: "appVersion", align: "center" },
        { title: "创建时间", key: "createTime", align: "center" },
        { title: "更新时间", key: "updateTime", align: "center" },
        { title: "上传人", key: "userName", align: "center" }
      ],
      curPage: 1,
      limit: 10,
      dataCount:0,
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
          this.listItem = res.data.data.items;
          this.dataCount=res.data.data.count;
        });
    },
    handleChange(val) {
      this.curPage = val;
      this.getData();
    },
    handleSizeChange(val) {
      this.limit = val;
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
  padding-left: 30px;
}
.dashboardBody {
  width: 99%;
}
.el-table thead {
  color: #515a6e;
  font-size: 15px;
  font-weight: 500;
}
th {
  font-weight: normal;
}
</style>
