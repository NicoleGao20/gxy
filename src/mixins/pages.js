
let pages = {
    data () {
        return {
            currentPage: 1,
            totalPage: 0,
            pageSize: 20,
            pageSizearr: [10, 20, 30, 40, 50, 100, 200]
        }
    },
    methods: {
        handleCurrentChange (value) {
            this.currentPage = value;
            this.getData();
        },
        handleSizeChange(value) {
            this.currentPage = 1;
            this.pageSize = value;
            this.getData();
        }
    }
}
export { pages };
  