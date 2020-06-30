<template>
  <div class="userManagement">
    <div class="userManagementHeader">
      <p>当前位置: 用户管理</p>
    </div>
    <div class="userManagementBody">
      <template>
        <!-- <i-table :columns="tableColumn" :data="listItem"></i-table> -->
        <treeTabl :data="data" :colums="columns"></treeTabl>
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
  /* data() {
    return {
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
      listItem: [], 
    };
  },*/
  data() {
    return {
      columns: [
        {
          text: "事件",
          value: "event",
          width: 200
        },
        {
          text: "ID",
          value: "id"
        },
        {
          text: "时间线",
          value: "timeLine"
        },
        {
          text: "备注",
          value: "comment"
        }
      ],
      data: [
        {
          id: 0,
          event: "事件1",
          timeLine: 50,
          comment: "无"
        },
        {
          id: 1,
          event: "事件1",
          timeLine: 100,
          comment: "无",
          children: [
            {
              id: 2,
              event: "事件2",
              timeLine: 10,
              comment: "无"
            },
            {
              id: 3,
              event: "事件3",
              timeLine: 90,
              comment: "无",
              children: [
                {
                  id: 4,
                  event: "事件4",
                  timeLine: 5,
                  comment: "无"
                },
                {
                  id: 5,
                  event: "事件5",
                  timeLine: 10,
                  comment: "无"
                },
                {
                  id: 6,
                  event: "事件6",
                  timeLine: 75,
                  comment: "无",
                  children: [
                    {
                      id: 7,
                      event: "事件7",
                      timeLine: 50,
                      comment: "无",
                      children: [
                        {
                          id: 71,
                          event: "事件71",
                          timeLine: 25,
                          comment: "xx"
                        },
                        {
                          id: 72,
                          event: "事件72",
                          timeLine: 5,
                          comment: "xx"
                        },
                        {
                          id: 73,
                          event: "事件73",
                          timeLine: 20,
                          comment: "xx"
                        }
                      ]
                    },
                    {
                      id: 8,
                      event: "事件8",
                      timeLine: 25,
                      comment: "无"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
  },

  mounted() {
    let baseUrl = this.api.baseUrl,
      params = { limit: 10, pn: 1 },
      _this = this;
    https
      .fetchPost(baseUrl + "/api/system/user/page", params)
      .then(res => {
        _this.listItem = res.data.data.items;
      })
      .catch(error => {
        console.log(error);
      });
    _this.initTableColumn("tableColumn");
  },
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
                  style: { whiteSpace: "normal", wordBreak: "break-all" }
                },
                params.row[params.column.key]
              )
            ]);
          });
        }
      }
    }
  }
};
</script>
<style>
.userManagementHeader {
  height: 50px;
  line-height: 50px;
  padding-left: 20px;
  font-size: 14px;
}
</style>
