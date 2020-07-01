<template>
  <div class="roleManagement">
    <div class="roleManagementHeader">
      <p>当前位置: 角色管理</p>
    </div>
    <div class="roleManagementBody">
      <template>
        <i-table :columns="columns" :data="listItem"></i-table>
      </template>
    </div>
    <div class="roleManagementBase">
      <template>
        <Page
          :total="dataCount"
          show-sizer
          show-elevator
          show-total
          @on-change="handleChange"
          @on-page-size-change="handleSizeChange"
          style="margin-top:20px"
        ></Page>
      </template>
    </div>
  </div>
</template>
<script>
import https from "../../http.js";
export default {
  name: "roleManagement",
  data() {
    return {
      columns: [
        { title: "序号", type: "index", width: 60, align: "center" },
        { title: "角色名称", key: "name" },
        {
          title: "是否有效",
          key: "status",
          render: (h, params) => {
            let text = "";
            if (params.row.status === "1") {
              text = "是";
            } else if (params.row.status === "0") {
              text = "否";
            }
            return h("div", text);
          }
        },
        { title: "创建时间", key: "createTime" },
        { title: "更新时间", key: "updateTime" },
        { title: "操作", key: "" }
      ],
      listItem: [],
      dataCount: 0,
      curPage: 1,
      limit: 10
    };
  },
  methods: {
    //获取后台数据
    getData() {
      let baseUrl = this.api.baseUrl,
        _this = this;
      https
        .fetchPost(baseUrl + "/api/system/role/page", {
          pn: this.curPage,
          limit: this.limit
        })
        .then(res => {
          _this.listItem = res.data.data.items;
          _this.dataCount = res.data.data.count;
        })
        .catch(error => {
          console.log(error);
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
  }
};
</script>
<style>
.roleManagementHeader {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}
</style>
