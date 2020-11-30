import showAddDialog from '@/components/showAddDialog/index.vue'
export default {
    name: "cmpFilter",
    inject: [ 'tableCom' ],
    components: {
        "neo-add-dialog": showAddDialog,
    },
    data () {
        return {
            selectDialogShow: false,
            isShowAllFilter: false,
            filterType: '',
            showType: '',
            is_no_func: 2
        }
    },
    props: {
        default_value: {
            type: Number,
            default: 0
        },
        //菜单发布-查看失败菜单跳转-菜单明细- 发布计划idi & 状态 存在时候，默认选中查询条件
        menuPubPlanFilterForm: {
            type: Object,
            default() {
                return {}
            }
        },
        id: {
            type: [Number,String],
            default: 0
        }
    },
    computed: {
        subFuncs() {
            return this.tableCom.subFuncs
        },
        sepNum() {
            if(this.tableCom.subFuncs&&this.tableCom.subFuncs.functionQueryFields) {
                let list = this.tableCom.subFuncs.functionQueryFields
                if(!list.length) return 0

                if(list.length <= 2) {
                    return 2
                }

                if(list[0].fieldType == 'time' || list[1].fieldType == 'time' || list[2].fieldType == 'time') {
                    return  2
                } else {
                    return 3;
                }
            }
        },
        filterForm() {
            //菜单发布-[查看失败门店]跳转菜单明细- 发布计划id和状态——默认选中赋值
            if(this.id){
                return this.menuPubPlanFilterForm
            }else{
                return this.tableCom.filterForm
            }
        }
    },
    methods: {
        changeFilter () {
            this.isShowAllFilter = !this.isShowAllFilter
        },
        getData () {
            this.tableCom.currentPage = 1
            delete this.filterForm.userName
            this.$emit("getForm", this.filterForm)
            this.$emit("getData")
        },
        addressChange (e) {
            this.$refs.addressSelect.dropDownVisible = false;
        },
        getRegionsCityList(node, resolve) {
            const { level } = node;
            this.$fetch.regions_list({
                params: {
                    level: level + 1 || 1,
                    pid: node.data && node.data.id || ""
                }
            }).then(res => {
                const cities = res.body.map((value, i) => ({
                    value: {
                        name: value.name,
                        pid: value.id
                    },
                    label: value.name,
                    id:value.id,
                    leaf: level >= 2
                }));
                resolve(cities);
            })
        },
        showDialog(type) {
            this.filterType = type
            this.selectDialogShow = true
            if(type == 'userId') {
                this.showType = 8
            }else if(type == 'couponName') {
                this.showType = 5
            }
        },
        saveIsSelect (info) {
            this.selectDialogShow = false
            if(this.filterType == 'userId') {
                this.filterForm.userId = info.id
                this.filterForm.userName = info.name
            }else if(this.filterType == 'couponName') {
                this.filterForm.couponName = info.couponName
            }
        }
    },
    beforeCreate() {
        this.getRegionsList = this.getRegionsCityList
    },
    activated() {
        this.getRegionsList = this.getRegionsCityList
    },
    deactivated() {
        this.getRegionsList = function () {}
    }
}