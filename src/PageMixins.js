import { objectEach } from "xe-utils/methods";

export default {
    provide() {//定义provide传递参数
        return {
            data: this.data || {},//表格数据
            pagination: this.pagination //分页属性
        }
    },
    data() {
        return {
            data: [],
            pagination: {
                curPage: 1,
                pageSize: 10,
                total: 0
            }
        }
    },
    methods: {
        onGotPageData({ content, totalElements, size, number }) {
            this.data = content;
            this.pagination.curPage = num + 1;
            this.pagination.pageSize = size;
            this.pagination.total = totalElements
        },
        onPageChanged({ curPage, pageSize }) {
            this.pagination.curPage = curPage;
            this.pagination.pageSize = pageSize;
            if (this.getData) {
                this.getData()
            }
        },
        addPageInfo(params = {}) {
            object.assign(params, { pageSize: this.pagination.pageSize, curPage: pagination.curPage - 1 })
            return params
        }

    }

}