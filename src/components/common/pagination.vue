<template>
  <div class="pagination">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="curPage"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="pageSize"
      :total="total"
      layout="total,sizes,prev,pager,next,jumper"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  name: "pagination",
  inject: ["pagination"], //接收mixins中provider提供的参数
  watch: {
    pagination: {
      deep: true,
      handler(v) {
        if (!v) {
          return;
        }
        const { pageSize, total, curPage } = v;
        this.pageSize = pageSize;
        this.total = total;
        this.curPage = curPage;
      }
    }
  },
  data() {
    return {
      pageSize: 10,
      curPage: 1,
      total: 0
    };
  },
  methods: {
    emitPaginationChangeInfo() {
      //触发父组件中特定的pageChanged函数
      const pageInfo = { pageSize: this.pageSize, curPage: this.curPage };
      this.$emit("pageChanged", pageInfo);
    },
    handleSizeChange(pageSize) {
      //每页条数改变
      const willMakePageChange = this.total / pageSize + 1 < this.curPage;
      this.pageSize = pageSize;
      //可能会造成页码发生改变,这时候不发送事件,可能会造成事件死循环
      if (!willMakePageChange) {
        this.emitPaginationChangeInfo();
      }
    },
    handleCurrentChange(curPage) {
      //页码发生改变
      this.curPage = curPage;
      this.emitPaginationChangeInfo();
    }
  }
};
</script>
