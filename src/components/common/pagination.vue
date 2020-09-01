<template>
  <div class="pagination">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.curPage"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="page.pageSize"
      layout="total,sizes,prev,pager,next,jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  name: "pagination",
  inject: ["pagination"], //接收后面mixins中provider的提供的参数
  props: {
    total: {
      //总页数
      type: Number,
      default: 0
    },
    curPage: {
      //当前页
      type: Number,
      default: 1
    },
    pageSize: {
      //每页显示条数
      type: Number,
      default: 10
    }
  },
  watch: {
    pagination: {
      //监听器
      deep: true,
      handler(v) {
        if (!v) {
          return;
        }
        const { pageSize, total, curPage } = v;
        this.curPage = curPage;
        this.pageSize = pageSize;
        this.total = total;
      }
    }
  },
  data() {
    return {
      page: {
        curPage: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  methods: {
    emitPaginationChangeInfo() {
      //触发父组件中特定的pageChanged函数
      const pageInfo = {
        pageSize: this.pageSize,
        curPage: this.curPage
      };
      this.$emit("pageChanged", pageInfo);
    },
    handleSizeChange(pageSize) {
      //每页条数改变
      const willMakePageChange = this.total / pageSize + 1 < this.curPage;
      this.pageSize = pageSize;
      //可能会造成页码发生改变,这时不发送事件,可能会造成事件死循环
      if (!willMakePageChange) {
        this.emitPaginationChangeInfo();
      }
    },
    handleCurrentChange(curPage) {
      //页码改变函数
      this.curPage = curPage;
      this.emitPaginationChangeInfo();
    }
  }
};
</script>
