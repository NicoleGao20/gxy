let getOptions = {
    data () {
        return {}
    },
    methods: {
        _downLoad (info, url, sdata = {}, isShowPage = true) {
            const that = this;
            let maxOutput = 10000
            if(info && info.description && typeof info.description == 'string') {
                let description = JSON.parse(info.description)
                maxOutput = description.maxOutput
            }
            let curOutput = Math.min(maxOutput, that.totalPage || that.list.length)// that.list.length
            let submitObj = {
                params: sdata
            }
            if(isShowPage) {
                submitObj.pageNo = 1
                submitObj.pageSize = curOutput
            }
            that.$confirm('累计导出数据 <strong class="color-theme">' + curOutput + '</strong> 条，确定导出文件？', '提示', {
                confirmButtonText: '确定并导出',
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true,
                confirmButtonClass: "warning"
            }).then(() => {
                that.$fetch[url](submitObj).then((res) => {
                    that.$message({
                        message: '数据导出中，请稍后在导出管理中查看',
                        type: 'success'
                    })
                })
            }).catch(() => {});
        },
        getOptions (type) {
            let resArr = []
            for (let key in this.$basicConfig[type]) {
                resArr.push({
                    value: key,
                    text: this.$basicConfig[type][key]
                })
            }
            return resArr
        },
        getFilterForm (params) {
            let resParams = {}
            if (params) {
                for (let key in params) {
                    if(params[key] || params[key] === 0 || params[key] === '0') {
                        if(key == "categoryId") {
                            resParams[key] = params[key][params[key].length - 1]
                        }else if(key == "region") {
                            let codeArr = []
                            params[key].map(item => {
                                codeArr.push(String(item.pid))
                            })
                            resParams[key] = codeArr
                        }else if(params[key] instanceof Array) {
                            if(params[key].length > 0) {
                                resParams[key] = "[" + params[key][0] + "," + params[key][1] + "]"
                            }
                        }else {
                            resParams[key] = params[key]
                        }
                    }
                }
            }
            return resParams
        }
    }
}

export default getOptions;
