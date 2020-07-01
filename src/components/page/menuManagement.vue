<template>
  <div class="menuManagement">
    <div class="menuManagementHeader">
      <p>当前位置:菜单管理</p>
    </div>
    <div class="menuManagementBody">
      <template>
        <!--  <i-table :columns="tableColumns()" :data="listItem"></i-table> -->
        <treeTable :data="data" :colums="columns"></treeTable>
      </template>
    </div>
  </div>
</template>
<script>
import https from "../../http.js";
import treeTable from "@/components/treeTable";
export default {
  name: "menuManagement",
  components: { treeTable },
  /*  data() {
    return {
      columns: [
        { title: "资源名称", key: "name" },
        { title: "资源路径", key: "address" },
        { title: "资源图标", key: "icon" },
        {
          title: "资源类型",
          key: "type",
          render: (h, params) => {
            let text = "";
            if (params.row.type === "M") {
              text = "目录";
            }
            if (params.row.type === "T") {
              text = "链接";
            }
            return h("div", text);
            console.log(params.row.type);
          }
        },
        { title: "操作", key: "" }
      ],
      listItem: [],
      columns1: [
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
      ]
    };
  }, */
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
  created() {
    let baseUrl = this.api.baseUrl,
      _this = this;
    https
      .fetchGet(baseUrl + "/api/system/menu/list")
      .then(res => {
        console.log(res);
        _this.listItem = _this.toTreeData(res.data.data);
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    toTreeData(data) {
      //删除所有的children,以防止多次调用
      data.forEach(item => {
        delete item.children;
      });
      let map = {}; //构建map
      data.forEach(i => {
        map[i.id] = i; //构建以id为键 当前数据为值
      });
      let treeData = [];
      data.forEach(child => {
        const mapItem = map[child.pId]; //判断当前数据的pId是否存在map中
        if (mapItem) {
          //不是最顶层的数据
          //注:这里map中的数据是引用了data的它的指向还是data,当mapItem改变时,arr也会改变
          (mapItem.children || (mapItem.children = [])).push(child); //判断mapItem是否存在child
        } else {
          //顶层数据
          treeData.push(child);
        }
      });
      return treeData;
    },
    tableColumns() {
      let renderCols = Object.assign([], this.columns); //复制一份columns
      //设置render
      let expandRender = {
        type: "expand",
        width: 50, //展开列的宽度(箭头符号)
        render: (h, params) => {
          //复制属性,如果Vue中没有props
        }
      };
    }
  }
};
</script>
<style>
.menuManagementHeader {
  line-height: 50px;
  line-height: 50px;
  font-size: 14px;
}
</style>
