import echarts from "echarts";
import echartsConfig from '@/echartsConfig/index'
require('echarts/map/js/china.js')
var charts = {
    data() {
        return {
            areaList: [
                {name:"南海诸岛",value:0},
                {name: '北京', value: this.randomValue()},
                {name: '天津', value: this.randomValue()},
                {name: '上海', value: this.randomValue()},
                {name: '重庆', value: this.randomValue()},
                {name: '河北', value: this.randomValue()},
                {name: '河南', value: this.randomValue()},
                {name: '云南', value: this.randomValue()},
                {name: '辽宁', value: this.randomValue()},
                {name: '黑龙江', value: this.randomValue()},
                {name: '湖南', value: this.randomValue()},
                {name: '安徽', value: this.randomValue()},
                {name: '山东', value: this.randomValue()},
                {name: '新疆', value: this.randomValue()},
                {name: '江苏', value: this.randomValue()},
                {name: '浙江', value: this.randomValue()},
                {name: '江西', value: this.randomValue()},
                {name: '湖北', value: this.randomValue()},
                {name: '广西', value: this.randomValue()},
                {name: '甘肃', value: this.randomValue()},
                {name: '山西', value: this.randomValue()},
                {name: '内蒙古', value: this.randomValue()},
                {name: '陕西', value: this.randomValue()},
                {name: '吉林', value: this.randomValue()},
                {name: '福建', value: this.randomValue()},
                {name: '贵州', value: this.randomValue()},
                {name: '广东', value: this.randomValue()},
                {name: '青海', value: this.randomValue()},
                {name: '西藏', value: this.randomValue()},
                {name: '四川', value: this.randomValue()},
                {name: '宁夏', value: this.randomValue()},
                {name: '海南', value: this.randomValue()},
                {name: '台湾', value: this.randomValue()},
                {name: '香港', value: this.randomValue()},
                {name: '澳门', value: this.randomValue()}
            ],
            echartsConfig: echartsConfig,
            chartName: `echart_v${parseInt(Math.random() * 100000)}`,
            chartMap: {},
            default_color: ["#0091ff", "#44d7b6", "#2fc25b", "#facd14", "#f04864", "#6236ff", "#43b0ff", "#a1e053", "#e8ed1f", "#fa9e14"]
        }
    },
    beforeDestroy() {
        this.disposeCharts(this.chartName)
    },
    methods: {
        createCharts(options, element, type = 'other', target = 'ref') {
            let that = this,
                ele = that.$refs[element];
            that.$nextTick(() => {
                if (target == 'id') {
                    ele = document.getElementById(element);
                }
                if (!that.chartMap[element]) {
                    that.chartMap[element] = echarts.init(ele, echartsConfig[type]);
                } else {
                    that.chartMap[element].clear();
                }
                console.log(options)
                that.chartMap[element].setOption(options);
                that.chartMap[`${element}_func`] = function () {
                    if (that.chartMap[element]) {
                        that.chartMap[element].resize();
                    }

                }
                window.addEventListener("resize", that.chartMap[`${element}_func`]);
            })
        },
        
        disposeCharts(element) {
            let that = this;
            console.log("disposeCharts")
            that.$nextTick(() => {
                if (element instanceof Array) {
                    for (let item of element) {
                        if (that.chartMap[item]) {
                            window.removeEventListener("resize", that.chartMap[`${item}_func`]);
                            that[item].dispose();
                            delete that.chartMap[`${item}_func`]
                            delete that.chartMap[item]
                        }
                    }
                } else {
                    if (that.chartMap[element]) {
                        window.removeEventListener("resize", that.chartMap[`${element}_func`]);
                        that.chartMap[element].dispose();
                        delete that.chartMap[`${element}_func`]
                        delete that.chartMap[element]
                    }
                }

            })
        },
        creatMap(dataList) {
            return {
                tooltip: {
                    formatter:function(params,ticket, callback){
                        return params.seriesName+'<br />'+params.name+'：'+params.value
                    }
                },
                visualMap: {
                    min: 0,
                    max: 1500,
                    left: 'left',
                    top: 'bottom',
                    text: ['高','低'],
                    inRange: {
                        color: ['#e0ffff', '#006edd']
                    },
                    show:true
                },
                geo: {
                    map: 'china',
                    roam: false,
                    zoom:1.23,
                    label: {
                        normal: {
                            show: true,
                            fontSize:'10',
                            color: 'rgba(0,0,0,0.7)'
                        }
                    },
                    itemStyle: {
                        normal:{
                            borderColor: 'rgba(0, 0, 0, 0.2)'
                        },
                        emphasis:{
                            areaColor: '#F3B329',
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            shadowBlur: 20,
                            borderWidth: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                },
                series : [
                    {
                        name: '信息量',
                        type: 'map',
                        geoIndex: 0,
                        data: dataList
                    }
                ]
            }
            
        },
        randomValue() {
            return Math.round(Math.random()*1000);
        },
    },
}

export {charts};
