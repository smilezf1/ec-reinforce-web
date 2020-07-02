<template>
  <div class="userManagement">
    <div class="userManagementHeader">
      <p>当前位置: 用户管理</p>
    </div>
    <div class="searchForm">
      <div class="searchBox">
        <el-form :model="ruleForm" ref="ruleForm">
          <el-input
            placeholder="请输入用户姓名"
            size="small"
            v-model="ruleForm.trueName"
          ></el-input>
          <el-input
            placeholder="请输入登录名"
            size="small"
            v-model="ruleForm.userName"
          ></el-input>
          <el-input
            placeholder="请输入手机号"
            size="small"
            v-model="ruleForm.mobile"
          ></el-input>
          <el-input
            placeholder="请输入邮箱"
            size="small"
            v-model="ruleForm.email"
          ></el-input>
          <el-select
            placeholder="是否有效"
            v-model="ruleForm.status"
            size="small"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
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
    <div class="userManagementBody">
      <template>
        <i-table :columns="tableColumn" :data="listItem"></i-table>
      </template>
    </div>
    <div class="userManagementBase">
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
import treeTable from "@/components/treeTable";
export default {
  name: "userManagement",
  components: {
    treeTable
  },
  data() {
    return {
      ruleForm: {
        trueName: "",
        userName: "",
        mobile: "",
        email: "",
        status: ""
      },
      options: [
        { value: "选项1", lable: "是" },
        { value: "选项2", lable: "否" }
      ],
      tableColumn: [
        { title: "序号", type: "index", width: "60", align: "center" },
        { title: "用户姓名", key: "trueName", align: "center" },
        { title: "登录名", key: "userName", align: "center" },
        {
          title: "性别",
          key: "sex",
          align: "center",
          render: (h, params) => {
            let text = "";
            if (params.row.sex === "0") {
              text = "女";
            } else if (params.row.sex === "1") {
              text = "男";
            }
            return h("div", text);
          }
        },
        { title: "手机号", key: "mobile", align: "center" },
        {
          title: "电子邮箱",
          key: "email",
          align: "center",
          ellipsis: "true"
        },
        {
          title: "是否有效",
          key: "status",
          align: "center",
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
        { title: "创建时间", key: "createTime", align: "center" },
        { title: "更新时间", key: "updateTime", align: "center" },
        { title: "操作", key: "" }
      ],
      curPage: 1,
      limit: 10,
      dataCount: 0,
      listItem: []
    };
  },
  inject: ["reload"],
  methods: {
    //气泡提示
    initTableColumn(columnName) {
      for (let i = 0; i < this[columnName].length; i++) {
        if (!this[columnName][i].render) {
          this.$set(this[columnName][i], "ellipsis", true);
          this.$set(this[columnName][i], "render", (h, params) => {
            return h("Tooltip", { props: { placement: "top" } }, [
              params.row[params.column.key],
              h(
                "span",
                {
                  slot: "content",
                  style: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }
                },
                params.row[params.column.key]
              )
            ]);
          });
        }
      }
    },
    //获取后台数据
    getData(queryInfo) {
      let baseUrl = this.api.baseUrl;
      https
        .fetchPost(baseUrl + "/api/system/user/page", {
          pn: this.curPage,
          limit: this.limit,
          queryInfo
        })
        .then(res => {
          console.log(res.data.data.items);
          this.listItem = res.data.data.items;
          this.dataCount = res.data.data.count;
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
      let trueName = this.ruleForm.trueName,
        userName = this.ruleForm.userName,
        mobile = this.ruleForm.mobile,
        email = this.ruleForm.email,
        status = this.ruleForm.status,
        queryInfo = { trueName, userName, mobile, email, status, queryInfo };
      this.getData(queryInfo);
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
    this.initTableColumn("tableColumn");
  }
};
</script>
<style>
.userManagementHeader {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}
.userManagementBody {
  width: 99%;
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
