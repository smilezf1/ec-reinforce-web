<template>
  <div class="reinforceItem">
    <div class="reinforceItemHeader">
      <p>当前位置: 加固项</p>
    </div>
    <!-- 表格内容 -->
    <div class="reinforceItemBody">
      <template>
        <el-table :data="listItem">
          <el-table-column type="index" label="序号" min-width="10%">
            <template slot-scope="scope">
              <span>{{ (curPage - 1) * limit + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="reinforce_item_name"
            label="加固项名称"
            min-width="30%"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="reinforce_item_describe"
            label="加固项描述"
            min-width="30%"
          ></el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间"
            min-width="30%"
          ></el-table-column>
        </el-table>
      </template>
    </div>
    <!-- 表格底部 分页 -->
    <div class="reinforceItemBase">
      <pagination @pageChanged="onPageChanged"></pagination>
    </div>
  </div>
</template>
<script>
import api from "../../request/api";
import pagination from "../common/pagination";
import pageMixins from "../../utils/pageMixins";
export default {
  name: "reinforceItem",
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
    getDataItem(params) {
      api.reinforceService.getReinforceItem(params).then(res => {
        if (res.code == "00") {
          const count = res.data.count,
            { pn, limit } = params;
          this.listItem = res.data.items;
          this.curPage = pn;
          this.limit = limit;
          this.onGotPageData({
            totalElements: count,
            size: limit,
            number: this.curPage
          });
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
.reinforceItemHeader {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}
.reinforceItemBase {
  margin-top: 20px;
}
</style>
