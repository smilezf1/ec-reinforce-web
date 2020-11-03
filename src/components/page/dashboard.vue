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
            prop="reinforceStrategyName"
            label="策略名称"
            :show-overflow-tooltip="true"
          ></el-table-column>
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
      </template>
    </div>
    <div class="dashboardBase">
      <pagination @pageChanged="onPageChanged"></pagination>
    </div>
  </div>
</template>
<script>
import api from "../../request/api";
import pagination from "../common/pagination";
import pageMixins from "../../utils/pageMixins";
export default {
  name: "dashboard",
  components: { pagination },
  mixins: [pageMixins],
  data() {
    return {
      curPage: 1,
      limit: 10,
      listItem: []
    };
  },
  methods: {
    async getData() {
      const params = {};
      this.getDataItem(this.addPageInfo(params));
    },
    //获取后台数据
    getDataItem(params) {
      api.reinforceService.reinforceList(params).then(res => {
        if (res.code == "00") {
          const count = res.data.count,
            number = params.pn,
            size = params.limit;
          this.listItem = res.data.items;
          this.curPage = number;
          this.limit = size;
          this.onGotPageData({ totalElements: count, size, number });
        }
      });
    }
  },
  beforeMount() {
    this.getData();
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
.pagingBox {
  margin-top: 20px;
}
.dashboardBase {
  margin-top: 20px;
}
</style>
