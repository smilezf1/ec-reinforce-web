<template>
  <div class="roleManagement">
    <div class="roleManagementHeader">
      <p>当前位置: 角色管理</p>
    </div>
    <div class="searchForm">
      <div class="searchBox">
        <el-form :model="ruleForm" ref="ruleForm">
          <el-input
            placeholder="请输入角色名称"
            size="small"
            v-model="ruleForm.name"
          ></el-input>
          <el-select
            placeholder="是否有效"
            v-model="ruleForm.status"
            size="small"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.lable"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form>
      </div>
      <div class="operateBox">
        <el-tooltip effect="dark" content="查询" placement="top-start">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="search()"
          ></el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="新增" placement="top-start">
          <el-button
            type="primary"
            icon="el-icon-zoom-in"
            size="small"
            @click="add()"
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
      </div>
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
      ruleForm: {
        name: "",
        status: ""
      },
      options: [
        { value: "选项1", label: "是" },
        { value: "选项2", label: "否" }
      ],
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
  inject: ["reload"],
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
    },
    search() {
      consol.log("查询");
    },
    add() {
      console.log("新增");
    },
    refresh() {
      this.reload();
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
.searchBox .el-input {
  margin-right: 5px;
}
.el-input {
  width: auto;
}
.searchForm {
  display: flex;
}
.searchBox {
  margin-bottom: 10px;
  display: flex;
}
.operateBox {
  margin-left: 20px;
}
</style>
