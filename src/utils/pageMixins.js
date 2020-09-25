
export default {
    provide() {
        return {
            pagination: this.pagination
        }
    },
    data() {
        return {
            pagination: {
                curPage: 1,
                total: 0,
                pageSize: 10,
                queryInfo: null
            }
        }
    },
    methods: {
        onGotPageData({ totalElements, size, number, queryInfo }) {
            this.pagination.curPage = number
            this.pagination.pageSize = size
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
            Object.assign(params, { limit: this.pagination.pageSize, pn: this.pagination.curPage })
            return params
        }
    }
}