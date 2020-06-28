<template>
  <div class="dashboard">
    <div class="dashboardHeader">
      <p>当前位置:我的加固任务</p>
      <div class="dashboardBody">
        <template>
          <i-table :columns="columns" :data="listItem" :border="true"></i-table
        ></template>
      </div>
      <div class="dashboardBase">
        <template>
          <Page
            total="100"
            :current="pn"
            :page-size="10"
            show-total
            show-sizer
            show-elevator
            slot="footer"
            @on-change="handlerPage"
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
        { title: "应用程序文件名称", key: "appFileName" },
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
        { title: "应用名称", key: "appName" },
        { title: "应用版本", key: "appVersion" },
        { title: "创建时间", key: "createTime" },
        { title: "更新时间", key: "updateTime" },
        { title: "上传人", key: "userName" }
      ],
      listItem: [], //调用接口获取的数据
      //分页
      limit: 10, //每页显示多少条
      pageData: [], //表格数据,随着分页变化
      pn: 1 //当前页
    };
  },
  methods: {
    //改变页码的方法
    handlerPage(pn) {
      this.changePagination(pn);
    },
    changePagination(pn) {
      const _this = this;
      _this.pn = pn;
    }
  },
  created() {
    let baseUrl = this.api.baseUrl,
      _this = this,
      pn = _this.pn;
    params = {
      limit: 10,
      pn: 1
    };
    console.log(params);
    https
      .fetchPost(baseUrl + "/api/reinforce/info/page", params)
      .then(res => {
        console.log(res);
        let data = res.data.data.items;
        _this.listItem = data;
        if (_this.pn) {
          _this.pageData = this.listItem.slice(0, 10);
        } else {
          this.changePagination();
        }
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
</style>
