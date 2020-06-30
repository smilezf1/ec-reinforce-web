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
      listItem: []
    };
  },
  mounted() {
    let baseUrl = this.api.baseUrl,
      params = { limit: 10, pn: 1 },
      _this = this;
    https
      .fetchPost(baseUrl + "/api/system/role/page", params)
      .then(res => {
        _this.listItem = res.data.data.items;
      })
      .catch(error => {
        console.log(error);
      });
  }
};
</script>
<style>
.roleManagementHeader {
  height: 50px;
  line-height: 50px;
  padding-left: 20px;
  font-size: 14px;
}
</style>
