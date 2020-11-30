const region = require('@/utils/region.json');
import { operationsAndFeildsfunctions } from '@/api/cmpFilter'
let getFuncs = {
    data () {
        return {
            addressOptions: region,
            filteraddress: [],
            filterForm: {},
            defaultForm: {},
            storeList: [],
            priceTierList: [],
            categoryList: []
        }
    },
    provide() {
        return {
            tableCom: this
        }
    },
    computed: {
        subFuncs: function() {
            return this.$store.getters.getSubFunc(-1)
        }
    },
    mounted() {
        if(!this.isSelectItemCom) {
            console.log('isSelectItemCom1')
            if(!this.$route.meta.keepAlive) {
                console.log('isSelectItemCom2',this.$route.meta.func_id)

                this.getSubFuncs(this.$route.meta.func_id);
            }
        }
    },
    activated () {
        console.log('isSelectItemCom3')
        if(!this.isSelectItemCom && this.$route.meta.keepAlive) {
            console.log('isSelectItemCom4')
            this.getSubFuncs(this.$route.meta.func_id);
        }
    },
    methods: {
        async getSubFuncs(id, type = 1) {
            let that = this;
            let info = this.$store.getters.getSubFunc(id);

            if (!info.isNo) {
                if (type == 1) {
                    this.$store.commit('set_sub_func_id', id);
                } else {
                    that.newFuncs = info;
                }
                
                that.createFilterForm(id, info, (obj) => {
                    this.defaultForm = JSON.parse(JSON.stringify(obj));
                    this.commonSearch()
                });
            } else {
                console.log(id,'functionid')
                operationsAndFeildsfunctions({
                    functionId: id
                },false).then((res) => {
                    const ress={
                        "body": {
                            "functionOperations": [{
                                    "modifiedTime": "2020-03-02 14:25:39",
                                    "showName": "查看",
                                    "method": "GET",
                                    "pageUri": "string",
                                    "creatorId": "0",
                                    "modifierId": "0",
                                    "description": "查看详情",
                                    "processorUri": "/management/deliveryFeeRule/{id}",
                                    "functionId": "65",
                                    "showPageType": 1,
                                    "showLocation": "2R",
                                    "name": "detail",
                                    "tenantId": "0",
                                    "createdTime": "2020-03-02 14:25:40",
                                    "id": "159",
                                    "position": 1,
                                    "showIcon": "string"
                                },
                                {
                                    "modifiedTime": "2020-03-02 14:28:37",
                                    "showName": "新增",
                                    "method": "POST",
                                    "pageUri": "string",
                                    "creatorId": "0",
                                    "modifierId": "0",
                                    "description": "新增配送费",
                                    "processorUri": "/management/deliveryFeeRule/",
                                    "functionId": "65",
                                    "showPageType": 1,
                                    "showLocation": "1L",
                                    "name": "add",
                                    "tenantId": "0",
                                    "createdTime": "2020-03-02 14:28:37",
                                    "id": "160",
                                    "position": 1,
                                    "showIcon": "string"
                                },
                                {
                                    "modifiedTime": "2020-03-02 14:29:39",
                                    "showName": "编辑",
                                    "method": "PUT",
                                    "pageUri": "string",
                                    "creatorId": "0",
                                    "modifierId": "0",
                                    "description": "编辑配送费",
                                    "processorUri": "/management/deliveryFeeRule/",
                                    "functionId": "65",
                                    "showPageType": 1,
                                    "showLocation": "1R",
                                    "name": "modify",
                                    "tenantId": "0",
                                    "createdTime": "2020-03-02 14:29:39",
                                    "id": "161",
                                    "position": 2,
                                    "showIcon": "string"
                                },
                                {
                                    "modifiedTime": "2020-03-02 14:32:47",
                                    "showName": "删除",
                                    "method": "DELETE",
                                    "pageUri": "string",
                                    "creatorId": "0",
                                    "modifierId": "0",
                                    "description": "删除",
                                    "processorUri": "/management/deliveryFeeRule/{id}",
                                    "functionId": "65",
                                    "showPageType": 1,
                                    "showLocation": "2R",
                                    "name": "del",
                                    "tenantId": "0",
                                    "createdTime": "2020-03-02 14:32:47",
                                    "id": "162",
                                    "position": 3,
                                    "showIcon": "string"
                                },
                                {
                                    "modifiedTime": "2020-03-02 14:29:39",
                                    "showName": "重新使用",
                                    "method": "PUT",
                                    "pageUri": "string",
                                    "creatorId": "0",
                                    "modifierId": "0",
                                    "description": "重新使用",
                                    "processorUri": "/management/deliveryFeeRule/",
                                    "functionId": "65",
                                    "showPageType": 1,
                                    "showLocation": "1R",
                                    "name": "use",
                                    "tenantId": "0",
                                    "createdTime": "2020-03-02 14:29:39",
                                    "id": "163",
                                    "position": 4,
                                    "showIcon": "string"
                                },
                                {
                                    "modifiedTime": "2020-03-28 17:54:52",
                                    "showName": "停用",
                                    "method": "POST",
                                    "pageUri": "string",
                                    "creatorId": "0",
                                    "modifierId": "0",
                                    "description": "停用配送费",
                                    "processorUri": "/management/deliveryFeeRule/action/stop/{id}",
                                    "functionId": "65",
                                    "showPageType": 1,
                                    "showLocation": "2R",
                                    "name": "stop",
                                    "tenantId": "0",
                                    "createdTime": "2020-03-28 17:54:52",
                                    "id": "164",
                                    "position": 5,
                                    "showIcon": "string"
                                },
                                {
                                    "modifiedTime": "2020-07-14 16:36:57",
                                    "showName": "导出",
                                    "method": "POST",
                                    "pageUri": "string",
                                    "creatorId": "0",
                                    "modifierId": "0",
                                    "description": "{\"maxOutput\":20000}",
                                    "processorUri": "/management/deliveryOrders/action/export",
                                    "functionId": "65",
                                    "showPageType": 1,
                                    "showLocation": "1L",
                                    "name": "output",
                                    "tenantId": "0",
                                    "createdTime": "2020-07-14 16:36:57",
                                    "id": "198",
                                    "position": 1,
                                    "showIcon": "string"
                                }
                            ],
                            "functionQueryFields": [{
                                    "modifiedTime": "2020-03-02T15:14:13",
                                    "showName": "规则名称",
                                    "nullable": 1,
                                    "creatorId": "0",
                                    "modifierId": "0",
                                    "description": "string",
                                    "rules": "0000011111",
                                    "ioType": 0,
                                    "functionId": "65",
                                    "deleted": 0,
                                    "name": "ruleName",
                                    "tenantId": "0",
                                    "createdTime": "2020-03-02T15:14:13",
                                    "attribute": "{\"maxColumn\":30}",
                                    "id": "377",
                                    "position": 1,
                                    "fieldType": "text"
                                },
                                {
                                    "modifiedTime": "2020-03-02T15:14:13",
                                    "showName": "门店名称",
                                    "nullable": 1,
                                    "creatorId": "0",
                                    "modifierId": "0",
                                    "description": "string",
                                    "rules": "0000010111",
                                    "ioType": 0,
                                    "functionId": "65",
                                    "deleted": 0,
                                    "name": "storeName",
                                    "tenantId": "0",
                                    "createdTime": "2020-03-02T15:14:13",
                                    "attribute": "{\"maxColumn\":30}",
                                    "id": "378",
                                    "position": 2,
                                    "fieldType": "text"
                                },
                                {
                                    "modifiedTime": "2020-03-02T15:14:13",
                                    "showName": "适用范围",
                                    "nullable": 1,
                                    "creatorId": "0",
                                    "modifierId": "0",
                                    "description": "string",
                                    "rules": "0000011111",
                                    "ioType": 0,
                                    "functionId": "65",
                                    "deleted": 0,
                                    "fieldOption": {
                                        "sourceValueField": "",
                                        "modifiedTime": "2020-04-24T20:55:51",
                                        "creatorId": "0",
                                        "modifierId": "0",
                                        "description": "适用范围",
                                        "sourceMethod": "",
                                        "type": 1,
                                        "parentId": "65",
                                        "parentType": 1,
                                        "deleted": 0,
                                        "sourceUri": "",
                                        "tenantId": "0",
                                        "createdTime": "2020-04-24T20:55:51",
                                        "id": "58",
                                        "enumValues": "[{\"text\":\"全部\",\"value\":\"\"},{\"text\":\"全国\",\"value\":\"0\"},{\"text\":\"门店\",\"value\":\"1\"}]",
                                        "fieldId": "379",
                                        "multiSelect": 2
                                    },
                                    "name": "range",
                                    "tenantId": "0",
                                    "createdTime": "2020-03-02T15:14:13",
                                    "attribute": "{\"valueType\":\"radio\",\"showType\":\"base\"}",
                                    "id": "379",
                                    "position": 3,
                                    "fieldType": "select"
                                },
                                {
                                    "modifiedTime": "2020-03-02T15:14:13",
                                    "showName": "生效状态",
                                    "nullable": 1,
                                    "creatorId": "0",
                                    "modifierId": "0",
                                    "description": "string",
                                    "rules": "0000011111",
                                    "ioType": 0,
                                    "functionId": "65",
                                    "deleted": 0,
                                    "fieldOption": {
                                        "sourceValueField": "",
                                        "modifiedTime": "2020-04-14T13:52:47",
                                        "creatorId": "0",
                                        "modifierId": "0",
                                        "description": "生效状态",
                                        "sourceMethod": "",
                                        "type": 1,
                                        "parentId": "65",
                                        "parentType": 1,
                                        "deleted": 0,
                                        "sourceUri": "",
                                        "tenantId": "0",
                                        "createdTime": "2020-04-14T13:52:47",
                                        "id": "62",
                                        "enumValues": "[{\"text\":\"全部\",\"value\":\"\"},{\"text\":\"未生效\",\"value\":0},{\"text\":\"生效中\",\"value\":1},{\"text\":\"已失效\",\"value\":2}]",
                                        "fieldId": "383",
                                        "multiSelect": 2
                                    },
                                    "name": "activityStatus",
                                    "tenantId": "0",
                                    "createdTime": "2020-03-02T15:14:13",
                                    "attribute": "{\"valueType\":\"radio\",\"showType\":\"base\"}",
                                    "id": "383",
                                    "position": 6,
                                    "fieldType": "select"
                                },
                                {
                                    "modifiedTime": "2020-03-02T15:14:13",
                                    "showName": "创建时间",
                                    "nullable": 1,
                                    "creatorId": "0",
                                    "modifierId": "0",
                                    "description": "string",
                                    "rules": "0000011111",
                                    "ioType": 0,
                                    "functionId": "65",
                                    "deleted": 0,
                                    "name": "createdTime",
                                    "tenantId": "0",
                                    "createdTime": "2020-03-02T15:14:13",
                                    "attribute": "{\"format\":\"yyyy-MM-dd HH:mm:ss\"}",
                                    "id": "380",
                                    "position": 9,
                                    "fieldType": "time"
                                }
                            ],
                            "functionFields": [{
                                    "modifiedTime": "2020-03-02 15:14:13",
                                    "showName": "规则名称",
                                    "nullable": 1,
                                    "creatorId": "0",
                                    "modifierId": "0",
                                    "description": "string",
                                    "rules": "0000011111",
                                    "ioType": 0,
                                    "functionId": "65",
                                    "name": "ruleName",
                                    "tenantId": "0",
                                    "createdTime": "2020-03-02 15:14:13",
                                    "attribute": "{\"maxColumn\":30}",
                                    "id": "377",
                                    "position": 1,
                                    "fieldType": "text"
                                },
                                {
                                    "modifiedTime": "2020-03-02 15:14:13",
                                    "showName": "适用范围",
                                    "nullable": 1,
                                    "creatorId": "0",
                                    "modifierId": "0",
                                    "description": "string",
                                    "rules": "0000011111",
                                    "ioType": 0,
                                    "functionId": "65",
                                    "name": "range",
                                    "tenantId": "0",
                                    "createdTime": "2020-03-02 15:14:13",
                                    "attribute": "{\"valueType\":\"radio\",\"showType\":\"base\"}",
                                    "id": "379",
                                    "position": 3,
                                    "fieldType": "select"
                                },
                                {
                                    "modifiedTime": "2020-03-02 15:14:13",
                                    "showName": "生效日期",
                                    "nullable": 1,
                                    "creatorId": "0",
                                    "modifierId": "0",
                                    "description": "string",
                                    "rules": "0000001111",
                                    "ioType": 0,
                                    "functionId": "65",
                                    "name": "validDateFrom",
                                    "tenantId": "0",
                                    "createdTime": "2020-03-02 15:14:13",
                                    "attribute": "{\"maxColumn\":30}",
                                    "id": "381",
                                    "position": 4,
                                    "fieldType": "text"
                                },
                                {
                                    "modifiedTime": "2020-03-02 15:14:13",
                                    "showName": "时间范围",
                                    "nullable": 1,
                                    "creatorId": "0",
                                    "modifierId": "0",
                                    "description": "string",
                                    "rules": "0000001111",
                                    "ioType": 0,
                                    "functionId": "65",
                                    "name": "timeRange",
                                    "tenantId": "0",
                                    "createdTime": "2020-03-02 15:14:13",
                                    "attribute": "{\"maxColumn\":30}",
                                    "id": "382",
                                    "position": 5,
                                    "fieldType": "text"
                                },
                                {
                                    "modifiedTime": "2020-03-02 15:14:13",
                                    "showName": "生效状态",
                                    "nullable": 1,
                                    "creatorId": "0",
                                    "modifierId": "0",
                                    "description": "string",
                                    "rules": "0000011111",
                                    "ioType": 0,
                                    "functionId": "65",
                                    "name": "activityStatus",
                                    "tenantId": "0",
                                    "createdTime": "2020-03-02 15:14:13",
                                    "attribute": "{\"valueType\":\"radio\",\"showType\":\"base\"}",
                                    "id": "383",
                                    "position": 6,
                                    "fieldType": "select"
                                },
                                {
                                    "modifiedTime": "2020-03-02 15:14:13",
                                    "showName": "适用门店",
                                    "nullable": 1,
                                    "creatorId": "0",
                                    "modifierId": "0",
                                    "description": "string",
                                    "rules": "0000001111",
                                    "ioType": 0,
                                    "functionId": "65",
                                    "name": "storeNum",
                                    "tenantId": "0",
                                    "createdTime": "2020-03-02 15:14:13",
                                    "attribute": "{\"maxColumn\":30}",
                                    "id": "384",
                                    "position": 7,
                                    "fieldType": "text"
                                },
                                {
                                    "modifiedTime": "2020-03-02 15:14:13",
                                    "showName": "备注",
                                    "nullable": 1,
                                    "creatorId": "0",
                                    "modifierId": "0",
                                    "description": "string",
                                    "rules": "0000001111",
                                    "ioType": 0,
                                    "functionId": "65",
                                    "name": "remark",
                                    "tenantId": "0",
                                    "createdTime": "2020-03-02 15:14:13",
                                    "attribute": "{\"maxColumn\":30}",
                                    "id": "385",
                                    "position": 8,
                                    "fieldType": "text"
                                },
                                {
                                    "modifiedTime": "2020-03-02 15:14:13",
                                    "showName": "创建时间",
                                    "nullable": 1,
                                    "creatorId": "0",
                                    "modifierId": "0",
                                    "description": "string",
                                    "rules": "0000011111",
                                    "ioType": 0,
                                    "functionId": "65",
                                    "name": "createdTime",
                                    "tenantId": "0",
                                    "createdTime": "2020-03-02 15:14:13",
                                    "attribute": "{\"format\":\"yyyy-MM-dd HH:mm:ss\"}",
                                    "id": "380",
                                    "position": 9,
                                    "fieldType": "time"
                                },
                                {
                                    "modifiedTime": "2020-03-02 15:14:13",
                                    "showName": "创建人",
                                    "nullable": 1,
                                    "creatorId": "0",
                                    "modifierId": "0",
                                    "description": "string",
                                    "rules": "0000001111",
                                    "ioType": 0,
                                    "functionId": "65",
                                    "name": "creatorName",
                                    "tenantId": "0",
                                    "createdTime": "2020-03-02 15:14:13",
                                    "attribute": "{\"maxColumn\":30}",
                                    "id": "386",
                                    "position": 9,
                                    "fieldType": "text"
                                },
                                {
                                    "modifiedTime": "2020-03-02 15:14:13",
                                    "showName": "修改时间",
                                    "nullable": 1,
                                    "creatorId": "0",
                                    "modifierId": "0",
                                    "description": "string",
                                    "rules": "0000001111",
                                    "ioType": 0,
                                    "functionId": "65",
                                    "name": "modifiedTime",
                                    "tenantId": "0",
                                    "createdTime": "2020-03-02 15:14:13",
                                    "attribute": "{\"format\":\"yyyy-MM-dd HH:mm:ss\"}",
                                    "id": "387",
                                    "position": 10,
                                    "fieldType": "time"
                                },
                                {
                                    "modifiedTime": "2020-03-02 15:14:13",
                                    "showName": "修改人",
                                    "nullable": 1,
                                    "creatorId": "0",
                                    "modifierId": "0",
                                    "description": "string",
                                    "rules": "0000001111",
                                    "ioType": 0,
                                    "functionId": "65",
                                    "name": "modifiedName",
                                    "tenantId": "0",
                                    "createdTime": "2020-03-02 15:14:13",
                                    "attribute": "{\"maxColumn\":30}",
                                    "id": "388",
                                    "position": 11,
                                    "fieldType": "text"
                                }
                            ]
                        },
                        "code": "0",
                        "msg": "",
                        "timestamp": "1606378412247"
                    }
                    let list = ress.body;
                    let data = {
                        id: id,
                        list: list
                    };
                    if (type != 1) {
                        data.nosetId = 1;
                        that.newFuncs = list;
                    }
                    that.$store.commit('set_sub_func', data);
                    
                    that.createFilterForm(id, list, (obj) => {
                        this.filterForm = obj
                        this.defaultForm = JSON.parse(JSON.stringify(obj));
                        this.commonSearch()
                    });
                })
            }
        },
        async createFilterForm(id, list, cb) {
            let that = this,
                setDefaultStore = false,
                obj = {};
            for (let i = 0; i < list.functionQueryFields.length; i++) {
                if (list.functionQueryFields[i].fieldType == 'radio') {
                    obj[list.functionQueryFields[i].name] = '';
                } else if (list.functionQueryFields[i].fieldType == 'time'){
                    let attribute = JSON.parse(list.functionQueryFields[i].attribute)
                    let startTime = '',
                        endTime = ''
                    if(attribute.default == 'week') {
                        if(attribute.format == 'yyyy-MM-dd') {
                            startTime = this.getDay(-7)
                            endTime = this.getDay(0)
                        }else {
                            startTime = this.getDay(-7) + " 00:00:00"
                            endTime = this.getDay(0) + " 23:59:59"
                        }
                        obj[list.functionQueryFields[i].name] = [startTime, endTime];
                    }else {
                        obj[list.functionQueryFields[i].name] = [];
                    }
                } else if(list.functionQueryFields[i].fieldType == 'select'){
                    let attribute = JSON.parse(list.functionQueryFields[i].attribute)
                    if(attribute.selected) {
                        if(list.functionQueryFields[i].fieldOption && list.functionQueryFields[i].fieldOption.enumValues) {
                            let lst = this.getFuncFilter(that.subFuncs.functionQueryFields, list.functionQueryFields[i].name, 'name')
                            obj[list.functionQueryFields[i].name] = (lst[0] || {}).value;
                        }else if(list.functionQueryFields[i].name == 'storeCode') {
                            if(JSON.parse(list.functionQueryFields[i].attribute).selected) {
                                setDefaultStore = true
                            }
                            obj[list.functionQueryFields[i].name] = '';
                        }
                    }else {
                        obj[list.functionQueryFields[i].name] = '';
                    }
                }else {
                    obj[list.functionQueryFields[i].name] = '';
                }
            }
            
            if (([1, 17, 39, 41, 67, 74, 75, 76, 77, 78, 79, 80, 81, 82,84, 102, 103, 104, 105, 107, 44, 112].indexOf(id)>-1 ) && obj.storeCode != undefined && obj.storeCode != null) {
                if(setDefaultStore) {
                    await that.getStores()
                    obj = Object.assign({},obj,{
                        storeCode: this.storeList[0].storeCode
                    })
                } else {
                    that.getStores()
                }
            }else if(obj.priceTierCode != undefined && obj.priceTierCode != null) {
                that.getPriceTierList()
            }else if(obj.categoryId != undefined && obj.categoryId != null) {
                that.getCategoryList()
            }

            cb(obj)
        },
        getIsFunc(list, val, params='id', needInfo = false) {
            if (!list || list.length < 1) return false;
            for (let i = 0; i < list.length; i++) {
                if (val == list[i][params]) {
                    if(needInfo) {
                        return list[i]
                    }else {
                        return true;
                    }
                }
            }
            return false;
        },
        getFuncFilter(list, val,params='id') {
            if (!list || list.length < 1) [];
            for (let i = 0; i < list.length; i++) {
                if (val == list[i][params] && list[i].fieldOption) {
                    let enumValues = list[i].fieldOption.enumValues
                    if(typeof(enumValues) == "string" && enumValues) {
                        return JSON.parse(enumValues);
                    }
                    return enumValues;
                }
            }
            return []
        },
        resetSearch() {
            this.$store.commit('set_refresh_search_form', true)
            this.commonSearch()
        },
        commonSearch() {
            if(this.$store.state.Menu.refreshSearchForm) {
                this.filterForm = JSON.parse(JSON.stringify(this.defaultForm))
                this.currentPage = 1;
                this.getData(this.getFilterForm(this.filterForm));
            } else {
                this.getData(this.getFilterForm(this.filterForm))
            }
            this.$store.commit('set_refresh_search_form', false)
        },
        addressChange(e) {
            if (this.filterForm.province != undefined) {
                this.filterForm.province = e.length > 0 ? e[0] : ''
            }
            if (this.filterForm.city != undefined) {
                this.filterForm.city = e.length > 1 ? e[1] : ''
            }
            if (this.filterForm.area != undefined) {
                this.filterForm.area = e.length > 2 ? e[2] : ''
            }
        },
        /**
         * 获取门店数据 
         */
        async getStores() {
            const that = this;
            let res = await this.$fetch.store_list({
                pageNo: 1,
                pageSize: 10000,
                params: {}
            }, false)
            that.storeList = res.body && res.body.records || [];
        },
        getPriceTierList () {
            this.$fetch.product_price_all_list({}, false).then(res => {
                this.priceTierList = res.body.list
            })
        },
        getCategoryList () {
            this.$fetch.product_category_list({}, false).then(res => {
                this.categoryList = res.body
            })
        },
        getDay(day){
            let today = new Date();
            let targetday_milliseconds=today.getTime() + 1000*60*60*24*day;
            today.setTime(targetday_milliseconds); //注意，这行是关键代码
            let tYear = today.getFullYear();
            let tMonth = today.getMonth();
            let tDate = today.getDate();
            tMonth = this.doHandleMonth(tMonth + 1);
            tDate = this.doHandleMonth(tDate);
            return tYear+"-"+tMonth+"-"+tDate;
        },
        doHandleMonth(month){
            let m = month;
            if(month.toString().length == 1){
                m = "0" + month;
            }
            return m;
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
        },
        getWidth(item) {
            if(item.attribute) {
                try {
                    return JSON.parse(item.attribute).width || 100
                } catch(err) {
                    console.log(err)
                    return 100
                }
            } else {
                return 100
            }
        }
    },
}
export default getFuncs;
  