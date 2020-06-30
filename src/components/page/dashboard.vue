<template>
  <div class="dashboard">
    <div class="dashboardHeader">
      <p>当前位置:我的加固任务</p>
      <div class="dashboardBody">
        <template>
          <i-table :columns="columns" :data="listItem"></i-table>
        </template>
      </div>
      <div class="dashboardBase">
        <template>
          <Page :total="100" show-sizer show-elevator show-total></Page>
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
      listItem: [] //调用接口获取的数据
    };
  },
  methods: {},
  created() {
    let baseUrl = this.api.baseUrl,
      _this = this,
      pn = _this.pn,
      params = { limit: 10, pn: 1 };
    https
      .fetchPost(baseUrl + "/api/reinforce/info/page", params)
      .then(res => {
        let data = res.data.data.items;
        _this.listItem = data;
      })
      .catch(error => {
        console.log(error);
      });
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
</style>
