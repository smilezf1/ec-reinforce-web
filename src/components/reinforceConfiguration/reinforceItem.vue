<template>
  <div class="reinforceItem">
    <div class="reinforceItemHeader">
      <p>当前位置: 加固项</p>
    </div>
    <!-- 表格内容 -->
    <div class="reinforceItemBody">
      <template>
        <el-table :data="listItem">
          <el-table-column type="index" label="序号">
            <template slot-scope="scope">
              <span>{{ (curPage - 1) * limit + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="reinforce_item_name"
            label="加固项名称"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="reinforce_item_describe"
            label="加固项描述"
          ></el-table-column>
          <!--  <el-table-column
            prop="reinforce_item_code"
            label="加固项编码"
          ></el-table-column> -->
          <el-table-column
            prop="create_time"
            label="创建时间"
          ></el-table-column>
        </el-table>
      </template>
    </div>
    <!-- 表格底部 分页 -->
    <div class="reinforceItemBase">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="curPage"
        :page-size="10"
        :page-sizes="[10, 20, 30, 40, 50]"
        layout="total,sizes,prev,pager,next,jumper"
        :total="dataCount"
        class="paginationBox"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import https from "../../request/http";
export default {
  name: "reinforceItem",
  data() {
    return {
      curPage: 1,
      limit: 10,
      dataCount: 0,
      listItem: []
    };
  },
  methods: {
    getData(queryInfo) {
      https
        .fetchPost("/api/reinforce/item/page", {
          pn: this.curPage,
          limit: this.limit,
          queryInfo
        })
        .then(res => {
          if (res.data.code === "00") {
            let data = res.data.data;
            this.listItem = data.items;
            this.dataCount = data.count;
          }
        });
    },
    //显示页面的条数
    handleSizeChange(val) {
      this.listItem = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.curPage = val;
      this.getData();
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style>
.reinforceItemHeader {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}
.reinforceItemBody .el-table {
  font-size: 12px;
  border: 1px solid #dcdee2;
  border-bottom: 1px solid transparent !important;
}
.el-table thead {
  color: #515a6a;
}
.el-table__header-wrapper th {
  background: #f2f5f7 !important;
}
.reinforceItemBase {
  margin-top: 20px;
}
</style>
